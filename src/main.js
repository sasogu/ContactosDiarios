import './style.css'
import { APP_VERSION } from './version.js';

// Limpieza automática de caché/Service Worker si cambia la versión, pero conserva los contactos
(function checkVersionAndCleanCache() {
  try {
    const storedVersion = localStorage.getItem('app_version');
    if (storedVersion && storedVersion !== APP_VERSION) {
      // Conserva los contactos
      const contactos = localStorage.getItem('contactos_diarios');
      // Limpia solo claves de versión/caché
      Object.keys(localStorage).forEach(k => {
        if (k !== 'contactos_diarios') localStorage.removeItem(k);
      });
      if ('caches' in window) caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
      }
      // Restaura los contactos
      if (contactos) localStorage.setItem('contactos_diarios', contactos);
      location.reload();
    }
    localStorage.setItem('app_version', APP_VERSION);
  } catch(e) { /* ignorar errores de limpieza */ }
})();

// --- Componentes reutilizables ---
function ContactList({ contacts, filter, onSelect, onDelete }) {
  // Filtrado y orden por apellidos, nombre, etiquetas y contenido de notas
  let filtered = filter ? contacts.filter(c => {
    const filterText = filter.toLowerCase();
    const notas = c.notes ? Object.values(c.notes).join(' ').toLowerCase() : '';
    return (
      (c.tags?.some(t => t.toLowerCase().includes(filterText))) ||
      (c.name?.toLowerCase().includes(filterText)) ||
      (c.surname?.toLowerCase().includes(filterText)) ||
      (notas.includes(filterText))
    );
  }) : contacts;
  // Ordenar: primero los fijados, luego por apellidos
  filtered = filtered.slice().sort((a, b) => {
    if (b.pinned && !a.pinned) return 1;
    if (a.pinned && !b.pinned) return -1;
    return (a.surname || '').localeCompare(b.surname || '');
  });
  return `
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${filter || ''}" />
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

function AllNotesModal({ contacts, visible, page = 1 }) {
  // Recopilar todas las notas con referencia al contacto y su índice
  let allNotes = [];
  contacts.forEach((c, idx) => {
    if (c.notes) {
      Object.entries(c.notes).forEach(([date, text]) => {
        allNotes.push({ date, text, contact: c, contactIndex: idx });
      });
    }
  });
  // Ordenar por fecha descendente
  allNotes.sort((a, b) => b.date.localeCompare(a.date));
  const notesPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(allNotes.length / notesPerPage));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const startIdx = (currentPage - 1) * notesPerPage;
  const notesToShow = allNotes.slice(startIdx, startIdx + notesPerPage);
  return `
    <div id="all-notes-modal" class="modal" style="display:${visible ? 'flex' : 'none'}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${allNotes.length === 0 ? '<li>No hay notas registradas.</li>' : notesToShow.map(n => `
            <li>
              <b>${n.date}</b> — <span style="color:#3a4a7c">${n.contact.surname ? n.contact.surname + ', ' : ''}${n.contact.name}</span><br/>
              <span>${n.text}</span>
              <a href="#" class="edit-note-link" data-contact="${n.contactIndex}" data-date="${n.date}" style="margin-left:0.5em;color:#646cff;font-size:0.95em;">Editar nota</a>
            </li>
          `).join('')}
        </ul>
        <div class="pagination" style="display:flex;justify-content:center;align-items:center;gap:1em;margin:1em 0;">
          <button id="prev-notes-page" ${currentPage === 1 ? 'disabled' : ''}>&lt; Anterior</button>
          <span>Página ${currentPage} de ${totalPages}</span>
          <button id="next-notes-page" ${currentPage === totalPages ? 'disabled' : ''}>Siguiente &gt;</button>
        </div>
        <div class="form-actions">
          <button id="close-all-notes">Cerrar</button>
        </div>
      </div>
    </div>
  `;
}

function BackupModal({ visible, backups }) {
  return `
    <div id="backup-modal" class="modal" style="display:${visible ? 'flex' : 'none'};z-index:4000;">
      <div class="modal-content" style="max-width:400px;">
        <h3>Restaurar copia local</h3>
        <div class="backup-btns" style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;">
          ${backups.length === 0 ? '<span>Sin copias locales.</span>' : backups.map(b => `
            <div class="backup-btn-group" style="display:flex;align-items:center;gap:0.3rem;">
              <button class="restore-backup-btn" data-fecha="${b.fecha}">${b.fecha}</button>
              <button class="share-backup-btn" data-fecha="${b.fecha}" title="Compartir backup" style="background:#06b6d4;padding:0.4rem 0.7rem;font-size:1.1em;">📤</button>
            </div>
          `).join('')}
        </div>
        <div class="form-actions" style="margin-top:1.2rem;"><button id="close-backup-modal">Cerrar</button></div>
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
  tagFilter: '',
  showAllNotes: false,
  showBackupModal: false,
  allNotesPage: 1 // Página actual del modal de notas
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
    <div id="backup-info" style="margin-bottom:0.7rem;font-size:0.98em;color:#3a4a7c;"></div>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <div class="main-grid">
      <div>
        ${ContactList({ contacts: state.contacts, filter: state.tagFilter })}
        ${ImportExport({})}
        <button id="show-backup-modal" class="add-btn" style="width:100%;margin-top:0.7rem;background:#06b6d4;">Restaurar copia local</button>
      </div>
      <div>
        ${state.editing !== null ? ContactForm({ contact }) : ''}
        ${state.selected !== null && state.editing === null ? NotesArea({ notes }) : ''}
      </div>
    </div>
    ${AllNotesModal({ contacts: state.contacts, visible: state.showAllNotes, page: state.allNotesPage })}
    ${BackupModal({ visible: state.showBackupModal, backups: JSON.parse(localStorage.getItem('contactos_diarios_backups') || '[]') })} <!-- Modal de backup -->
  `;
  bindEvents();
  // Mostrar info de backup local
  mostrarInfoBackup();
  // Botón para abrir modal de backups
  const showBackupBtn = document.getElementById('show-backup-modal');
  if (showBackupBtn) showBackupBtn.onclick = () => { state.showBackupModal = true; render(); };
  // Botón cerrar modal de backups
  const closeBackupBtn = document.getElementById('close-backup-modal');
  if (closeBackupBtn) closeBackupBtn.onclick = () => { state.showBackupModal = false; render(); };
  // Botones restaurar backup por fecha
  document.querySelectorAll('.restore-backup-btn').forEach(btn => {
    btn.onclick = () => restaurarBackupPorFecha(btn.dataset.fecha);
  });
  // Botón restaurar backup local
  const restoreBtn = document.getElementById('restore-local-backup');
  if (restoreBtn) restoreBtn.onclick = restaurarBackupLocal;
}

let debounceTimeout = null;
function bindEvents() {
  // Filtro por etiqueta
  const tagInput = document.getElementById('tag-filter');
  if (tagInput) {
    tagInput.addEventListener('input', e => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        state.tagFilter = tagInput.value;
        render();
        // Después de render, restaurar el foco y el valor
        const newInput = document.getElementById('tag-filter');
        if (newInput) {
          newInput.value = state.tagFilter;
          newInput.focus();
          newInput.setSelectionRange(state.tagFilter.length, state.tagFilter.length);
        }
      }, 300);
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
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          imported = data;
        } else if (data && Array.isArray(data.contacts)) {
          imported = data.contacts;
        }
      } catch {}
    }
    if (imported.length) {
      // Evitar duplicados: compara por nombre, apellidos y teléfono
      const existe = (c) => state.contacts.some(
        x => x.name === c.name && x.surname === c.surname && x.phone === c.phone
      );
      const nuevos = imported.filter(c => !existe(c));
      if (nuevos.length) {
        state.contacts = state.contacts.concat(nuevos);
        saveContacts(state.contacts);
        render();
      } else {
        alert('No se han importado contactos nuevos (todos ya existen).');
      }
    }
  };
  // Cerrar modal de todas las notas
  const closeAllNotes = document.getElementById('close-all-notes');
  if (closeAllNotes) {
    closeAllNotes.onclick = () => {
      state.showAllNotes = false;
      state.allNotesPage = 1; // Reinicia a la primera página al cerrar
      render();
    };
  }
  // Botón para ver todas las notas
  const allNotesBtn = document.getElementById('show-all-notes-btn');
  if (allNotesBtn) {
    allNotesBtn.onclick = () => {
      state.showAllNotes = true;
      state.allNotesPage = 1; // Siempre empieza en la primera página
      render();
    };
  }
  // Paginación del modal de notas
  const prevNotesPage = document.getElementById('prev-notes-page');
  if (prevNotesPage) {
    prevNotesPage.onclick = () => {
      if (state.allNotesPage > 1) {
        state.allNotesPage--;
        render();
      }
    };
  }
  const nextNotesPage = document.getElementById('next-notes-page');
  if (nextNotesPage) {
    nextNotesPage.onclick = () => {
      // Calcular total de páginas
      let allNotes = [];
      state.contacts.forEach((c, idx) => {
        if (c.notes) {
          Object.entries(c.notes).forEach(([date, text]) => {
            allNotes.push({ date, text, contact: c, contactIndex: idx });
          });
        }
      });
      const totalPages = Math.max(1, Math.ceil(allNotes.length / 4));
      if (state.allNotesPage < totalPages) {
        state.allNotesPage++;
        render();
      }
    };
  }
  // Enlaces para editar nota desde el modal de todas las notas
  document.querySelectorAll('.edit-note-link').forEach(link => {
    link.onclick = e => {
      e.preventDefault();
      const contactIdx = Number(link.dataset.contact);
      const date = link.dataset.date;
      state.selected = contactIdx;
      state.editing = null;
      state.showAllNotes = false;
      render();
      // Abrir el modal de edición de nota tras render
      setTimeout(() => {
        const btn = document.querySelector(`.edit-note[data-date="${date}"]`);
        if (btn) btn.click();
      }, 50);
    };
  });
  // Botón compartir backup
  document.querySelectorAll('.share-backup-btn').forEach(btn => {
    btn.onclick = async () => {
      const fecha = btn.dataset.fecha;
      const backups = JSON.parse(localStorage.getItem('contactos_diarios_backups') || '[]');
      const backup = backups.find(b => b.fecha === fecha);
      if (!backup) return alert('No se encontró la copia seleccionada.');
      const fileName = `contactos_backup_${fecha}.json`;
      const fileContent = JSON.stringify(backup.datos, null, 2);
      const blob = new Blob([fileContent], { type: 'application/json' });
      if (navigator.canShare && navigator.canShare({ files: [new File([blob], fileName, { type: 'application/json' })] })) {
        try {
          await navigator.share({
            files: [new File([blob], fileName, { type: 'application/json' })],
            title: 'Backup de Contactos',
            text: `Copia de seguridad (${fecha}) de ContactosDiarios`
          });
        } catch (e) {
          // Si el usuario cancela, no hacer nada
        }
      } else if (navigator.share) {
        // Web Share API sin soporte de archivos: compartir como texto
        try {
          await navigator.share({
            title: 'Backup de Contactos',
            text: `Copia de seguridad (${fecha}) de ContactosDiarios:\n${fileContent}`
          });
        } catch (e) {}
      } else {
        // Fallback: descarga directa
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        a.click();
      }
    };
  });
}

// --- Configuración Nextcloud WebDAV ---
const WEBDAV_CONFIG_KEY = 'contactos_diarios_webdav_config';

function getWebDAVConfig() {
  try {
    return JSON.parse(localStorage.getItem(WEBDAV_CONFIG_KEY)) || {};
  } catch {
    return {};
  }
}
function setWebDAVConfig(config) {
  localStorage.setItem(WEBDAV_CONFIG_KEY, JSON.stringify(config));
}

function WebDAVConfigForm() {
  const config = getWebDAVConfig();
  return `
    <form id="webdav-config-form" class="webdav-form">
      <h3>Backup Nextcloud (WebDAV)</h3>
      <label>URL WebDAV <input name="url" type="url" required placeholder="https://tuservidor/nextcloud/remote.php/dav/files/usuario/" value="${config.url||''}" /></label>
      <label>Usuario <input name="user" required value="${config.user||''}" /></label>
      <label>Contraseña <input name="pass" type="password" required value="${config.pass||''}" /></label>
      <button type="submit">Guardar configuración</button>
      <button type="button" id="force-webdav-backup" style="margin-top:0.7rem;background:#06b6d4;">Forzar copia en Nextcloud</button>
    </form>
  `;
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

// --- Backup local automático diario con histórico ---
function backupLocalDiario() {
  const hoy = new Date().toISOString().slice(0, 10);
  let backups = JSON.parse(localStorage.getItem('contactos_diarios_backups') || '[]');
  if (!backups.find(b => b.fecha === hoy)) {
    backups.push({ fecha: hoy, datos: state.contacts });
    // Limitar a los últimos 10 backups
    if (backups.length > 10) backups = backups.slice(-10);
    localStorage.setItem('contactos_diarios_backups', JSON.stringify(backups));
  }
  localStorage.setItem('contactos_diarios_backup_fecha', hoy);
}
setInterval(backupLocalDiario, 60 * 60 * 1000); // Comprobar cada hora
backupLocalDiario(); // Ejecutar al cargar

function mostrarInfoBackup() {
  const backups = JSON.parse(localStorage.getItem('contactos_diarios_backups') || '[]');
  const info = document.getElementById('backup-info');
  if (info) {
    if (backups.length === 0) {
      info.textContent = 'Sin copias locales.';
    } else {
      info.innerHTML = 'Últimas copias locales: ' + backups.map(b => `<button class="restore-backup-btn" data-fecha="${b.fecha}">${b.fecha}</button>`).join(' ');
    }
  }
}

function restaurarBackupPorFecha(fecha) {
  if (!confirm('¿Seguro que quieres restaurar la copia de seguridad del ' + fecha + '? Se sobrescribirán los contactos actuales.')) return;
  const backups = JSON.parse(localStorage.getItem('contactos_diarios_backups') || '[]');
  const backup = backups.find(b => b.fecha === fecha);
  if (backup) {
    state.contacts = backup.datos;
    saveContacts(state.contacts);
    render();
    alert('Backup restaurado correctamente.');
  } else {
    alert('No se encontró la copia seleccionada.');
  }
}

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
  render();

  // Instalación guiada PWA
  let deferredPrompt = null;
  const installBtn = document.createElement('button');
  installBtn.textContent = '📲 Instalar en tu dispositivo';
  installBtn.className = 'add-btn';
  installBtn.style.display = 'none';
  installBtn.style.position = 'fixed';
  installBtn.style.bottom = '1.5rem';
  installBtn.style.left = '50%';
  installBtn.style.transform = 'translateX(-50%)';
  installBtn.style.zIndex = '3000';
  document.body.appendChild(installBtn);

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
  });

  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        installBtn.style.display = 'none';
      }
      deferredPrompt = null;
    }
  });

  window.addEventListener('appinstalled', () => {
    installBtn.style.display = 'none';
  });
});
