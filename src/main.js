import './style.css'
import { APP_VERSION } from './version.js';

// Limpieza automática de caché/localStorage si cambia la versión
(function checkVersionAndCleanCache() {
  try {
    const storedVersion = localStorage.getItem('app_version');
    if (storedVersion && storedVersion !== APP_VERSION) {
      localStorage.clear();
      if ('caches' in window) caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
      }
      // Puedes añadir aquí limpieza de IndexedDB si usas
      location.reload();
    }
    localStorage.setItem('app_version', APP_VERSION);
  } catch(e) { /* ignorar errores de limpieza */ }
})();

// --- Componentes reutilizables ---
function ContactList({ contacts, filter, onSelect, onDelete }) {
  // Filtrado y orden por apellidos y búsqueda por nombre/apellidos
  let filtered = filter ? contacts.filter(c =>
    (c.tags?.some(t => t.toLowerCase().includes(filter.toLowerCase()))) ||
    (c.name?.toLowerCase().includes(filter.toLowerCase())) ||
    (c.surname?.toLowerCase().includes(filter.toLowerCase()))
  ) : contacts;
  // Ordenar: primero los fijados, luego por apellidos
  filtered = filtered.slice().sort((a, b) => {
    if (b.pinned && !a.pinned) return 1;
    if (a.pinned && !b.pinned) return -1;
    return (a.surname || '').localeCompare(b.surname || '');
  });
  return `
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos o etiqueta..." value="${filter || ''}" />
      <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
      <ul>
        ${filtered.length === 0 ? '<li class="empty">Sin contactos</li>' : filtered.map((c, i) => `
          <li${c.pinned ? ' class="pinned"' : ''}>
            <div class="contact-main">
              <button class="select-contact" data-index="${contacts.indexOf(c)}">${c.surname ? c.surname + ', ' : ''}${c.name}</button>
              <span class="tags">${(c.tags||[]).map(t => `<span class='tag'>${t}</span>`).join(' ')}</span>
              <button class="pin-contact" data-index="${contacts.indexOf(c)}" title="${c.pinned ? 'Desfijar' : 'Fijar'}">${c.pinned ? '📌' : '📍'}</button>
            </div>
            <div class="contact-info">
              ${c.phone ? `<a href="tel:${c.phone}" class="contact-link" title="Llamar"><span>📞</span> ${c.phone}</a>` : ''}
              ${c.email ? `<a href="mailto:${c.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${c.email}</a>` : ''}
            </div>
            <button class="edit-contact" data-index="${contacts.indexOf(c)}" title="Editar">✏️</button>
            <button class="delete-contact" data-index="${contacts.indexOf(c)}" title="Eliminar">🗑️</button>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

function ContactForm({ contact }) {
  return `
    <form id="contact-form">
      <h2>${contact ? 'Editar' : 'Nuevo'} contacto</h2>
      <label>Nombre <input name="name" placeholder="Nombre" value="${contact?.name || ''}" required /></label>
      <label>Apellidos <input name="surname" placeholder="Apellidos" value="${contact?.surname || ''}" required /></label>
      <label>Teléfono <input name="phone" placeholder="Teléfono" value="${contact?.phone || ''}" pattern="[0-9+\-() ]*" /></label>
      <label>Email <input name="email" placeholder="Email" value="${contact?.email || ''}" type="email" /></label>
      <label>Etiquetas <input name="tags" placeholder="Ej: familia, trabajo" value="${contact?.tags?.join(', ') || ''}" /></label>
      <div class="form-actions">
        <button type="submit">Guardar</button>
        <button type="button" id="cancel-edit">Cancelar</button>
      </div>
    </form>
  `;
}

function NotesArea({ notes }) {
  // Mostrar historial de notas por fecha con edición y borrado
  return `
    <div class="notes-area">
      <h3>Notas diarias</h3>
      <form id="note-form">
        <input type="date" id="note-date" value="${new Date().toISOString().slice(0,10)}" required />
        <textarea id="note-text" rows="3" placeholder="Escribe una nota para la fecha seleccionada..."></textarea>
        <button type="submit">Guardar nota</button>
      </form>
      <ul class="note-history">
        ${Object.entries(notes||{}).sort((a,b)=>b[0].localeCompare(a[0])).map(([date, text]) => `
          <li>
            <b>${date}</b>:
            <span class="note-content" data-date="${date}">${text}</span>
            <button class="edit-note" data-date="${date}" title="Editar">✏️</button>
            <button class="delete-note" data-date="${date}" title="Eliminar">🗑️</button>
          </li>
        `).join('')}
      </ul>
      <div id="edit-note-modal" class="modal" style="display:none">
        <div class="modal-content">
          <h4>Editar nota</h4>
          <textarea id="edit-note-text" rows="4"></textarea>
          <div class="form-actions">
            <button id="save-edit-note">Guardar</button>
            <button id="cancel-edit-note">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function ImportExport({}) {
  return `
    <div class="import-export">
      <button id="import-btn">Importar contactos</button>
      <button id="export-btn">Exportar contactos</button>
      <input type="file" id="import-file" accept=".vcf,.csv,.json" style="display:none" />
    </div>
    <div id="export-modal" class="modal" style="display:none">
      <div class="modal-content">
        <h4>Exportar contactos</h4>
        <p>¿En qué formato quieres exportar?</p>
        <div class="form-actions">
          <button id="export-vcf">vCard (.vcf)</button>
          <button id="export-csv">CSV (.csv)</button>
          <button id="export-json">JSON (.json)</button>
          <button id="cancel-export">Cancelar</button>
        </div>
      </div>
    </div>
  `;
}

// --- Estado y lógica principal ---
const STORAGE_KEY = 'contactos_diarios';
let state = {
  contacts: loadContacts(),
  selected: null,
  notes: '',
  editing: null,
  tagFilter: ''
};

function loadContacts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}
function saveContacts(contacts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

function render() {
  const app = document.querySelector('#app');
  const contact = state.editing !== null ? state.contacts[state.editing] : null;
  const notes = state.selected !== null ? (state.contacts[state.selected].notes || {}) : {};
  app.innerHTML = `
    <h1>Diario de Contactos</h1>
    <div class="main-grid">
      <div>
        ${ContactList({ contacts: state.contacts, filter: state.tagFilter })}
        ${ImportExport({})}
      </div>
      <div>
        ${state.editing !== null ? ContactForm({ contact }) : ''}
        ${state.selected !== null && state.editing === null ? NotesArea({ notes }) : ''}
      </div>
    </div>
  `;
  bindEvents();
}

function bindEvents() {
  // Filtro por etiqueta
  const tagInput = document.getElementById('tag-filter');
  if (tagInput) {
    tagInput.addEventListener('input', e => {
      state.tagFilter = tagInput.value;
      render();
      // Después de render, restaurar el foco y el valor
      const newInput = document.getElementById('tag-filter');
      if (newInput) {
        newInput.value = state.tagFilter;
        newInput.focus();
        newInput.setSelectionRange(state.tagFilter.length, state.tagFilter.length);
      }
    });
  }
  // Añadir contacto
  const addBtn = document.getElementById('add-contact');
  if (addBtn) {
    addBtn.onclick = () => {
      state.editing = null;
      state.selected = null;
      render();
      state.editing = state.contacts.length; // Para que el formulario sea de nuevo contacto
      render();
    };
  }
  // Selección de contacto
  document.querySelectorAll('.select-contact').forEach(btn => {
    btn.onclick = e => {
      state.selected = Number(btn.dataset.index);
      state.editing = null;
      render();
    };
  });
  // Editar contacto
  document.querySelectorAll('.edit-contact').forEach(btn => {
    btn.onclick = e => {
      state.editing = Number(btn.dataset.index);
      state.selected = null;
      render();
    };
  });
  // Eliminar contacto
  document.querySelectorAll('.delete-contact').forEach(btn => {
    btn.onclick = e => {
      if (confirm('¿Eliminar este contacto?')) {
        state.contacts.splice(Number(btn.dataset.index), 1);
        saveContacts(state.contacts);
        state.selected = null;
        render();
      }
    };
  });
  // Fijar contacto
  document.querySelectorAll('.pin-contact').forEach(btn => {
    btn.onclick = e => {
      const idx = Number(btn.dataset.index);
      state.contacts[idx].pinned = !state.contacts[idx].pinned;
      saveContacts(state.contacts);
      render();
    };
  });
  // Formulario de contacto
  const form = document.getElementById('contact-form');
  if (form) {
    form.onsubmit = e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      // Procesar etiquetas
      let tags = data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      delete data.tags;
      if (state.editing !== null && state.editing < state.contacts.length) {
        state.contacts[state.editing] = { ...state.contacts[state.editing], ...data, tags };
      } else {
        state.contacts.push({ ...data, notes: {}, tags });
      }
      saveContacts(state.contacts);
      state.editing = null;
      render();
    };
    document.getElementById('cancel-edit').onclick = () => {
      state.editing = null;
      render();
    };
  }
  // Notas diarias
  const noteForm = document.getElementById('note-form');
  if (noteForm && state.selected !== null) {
    noteForm.onsubmit = e => {
      e.preventDefault();
      const date = document.getElementById('note-date').value;
      const text = document.getElementById('note-text').value.trim();
      if (!date || !text) return;
      if (!state.contacts[state.selected].notes) state.contacts[state.selected].notes = {};
      state.contacts[state.selected].notes[date] = text;
      saveContacts(state.contacts);
      render();
    };
  }
  // Editar nota
  document.querySelectorAll('.edit-note').forEach(btn => {
    btn.onclick = e => {
      const date = btn.dataset.date;
      const modal = document.getElementById('edit-note-modal');
      const textarea = document.getElementById('edit-note-text');
      textarea.value = state.contacts[state.selected].notes[date];
      modal.style.display = 'block';
      document.getElementById('save-edit-note').onclick = () => {
        state.contacts[state.selected].notes[date] = textarea.value.trim();
        saveContacts(state.contacts);
        modal.style.display = 'none';
        render();
      };
      document.getElementById('cancel-edit-note').onclick = () => {
        modal.style.display = 'none';
      };
    };
  });
  // Borrar nota
  document.querySelectorAll('.delete-note').forEach(btn => {
    btn.onclick = e => {
      const date = btn.dataset.date;
      if (confirm('¿Eliminar la nota de ' + date + '?')) {
        delete state.contacts[state.selected].notes[date];
        saveContacts(state.contacts);
        render();
      }
    };
  });
  // Importar/exportar
  document.getElementById('import-btn').onclick = () => {
    document.getElementById('import-file').click();
  };
  document.getElementById('export-btn').onclick = () => {
    document.getElementById('export-modal').style.display = 'flex';
    document.getElementById('export-vcf').onclick = () => {
      exportVCF();
      document.getElementById('export-modal').style.display = 'none';
    };
    document.getElementById('export-csv').onclick = () => {
      exportCSV();
      document.getElementById('export-modal').style.display = 'none';
    };
    document.getElementById('export-json').onclick = () => {
      exportJSON();
      document.getElementById('export-modal').style.display = 'none';
    };
    document.getElementById('cancel-export').onclick = () => {
      document.getElementById('export-modal').style.display = 'none';
    };
  };
  // Importar JSON
  document.getElementById('import-file').onchange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    let imported = [];
    if (file.name.endsWith('.vcf')) {
      imported = parseVCF(text);
    } else if (file.name.endsWith('.csv')) {
      imported = parseCSV(text);
    } else if (file.name.endsWith('.json')) {
      try {
        imported = JSON.parse(text);
      } catch {}
    }
    if (imported.length) {
      state.contacts = state.contacts.concat(imported);
      saveContacts(state.contacts);
      render();
    }
  };
}

function parseVCF(text) {
  // Muy básico: nombre, apellidos, teléfono y email
  const contacts = [];
  const entries = text.split('END:VCARD');
  for (const entry of entries) {
    const name = /FN:([^\n]*)/.exec(entry)?.[1]?.trim();
    const surname = /N:.*;([^;\n]*)/.exec(entry)?.[1]?.trim() || '';
    const phone = /TEL.*:(.+)/.exec(entry)?.[1]?.trim();
    const email = /EMAIL.*:(.+)/.exec(entry)?.[1]?.trim();
    if (name) contacts.push({ name, surname, phone: phone || '', email: email || '', notes: {}, tags: [] });
  }
  return contacts;
}
function toVCF(contacts) {
  return contacts.map(c => `BEGIN:VCARD\nVERSION:3.0\nFN:${c.name}\nN:${c.surname || ''};;;;\nTEL:${c.phone || ''}\nEMAIL:${c.email || ''}\nEND:VCARD`).join('\n');
}
function parseCSV(text) {
  // Espera cabecera: name,surname,phone,email,tags,notes
  const lines = text.split('\n').filter(Boolean);
  const [header, ...rows] = lines;
  return rows.map(row => {
    const [name, surname, phone, email, tags, notes] = row.split(',');
    return {
      name: name?.trim() || '',
      surname: surname?.trim() || '',
      phone: phone?.trim() || '',
      email: email?.trim() || '',
      notes: notes ? JSON.parse(notes) : {},
      tags: tags ? tags.split(';').map(t => t.trim()) : []
    };
  });
}
function exportVCF() {
  const vcf = toVCF(state.contacts);
  const blob = new Blob([vcf], { type: 'text/vcard' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'contactos.vcf';
  a.click();
}
function exportCSV() {
  // Cabecera: name,surname,phone,email,tags,notes
  const header = 'name,surname,phone,email,tags,notes';
  const rows = state.contacts.map(c => [
    c.name,
    c.surname,
    c.phone,
    c.email,
    (c.tags||[]).join(';'),
    JSON.stringify(c.notes||{})
  ].map(v => '"'+String(v).replace(/"/g,'""')+'"').join(','));
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'contactos.csv';
  a.click();
}
function exportJSON() {
  const blob = new Blob([JSON.stringify(state.contacts, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'contactos.json';
  a.click();
}

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', render);
