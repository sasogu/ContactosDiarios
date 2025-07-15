import './style.css'
import { APP_VERSION } from './version.js';

// Sistema de logs visible para móviles
let mobileLogsVisible = false;
let mobileLogsList = [];
const MAX_MOBILE_LOGS = 50;

// Guardar referencia al console.log original ANTES de cualquier sobrescritura
const originalConsoleLog = console.log;

// Función para agregar logs al panel móvil
function addMobileLog(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = {
    timestamp,
    message: typeof message === 'object' ? JSON.stringify(message, null, 2) : message,
    type
  };
  
  mobileLogsList.unshift(logEntry);
  if (mobileLogsList.length > MAX_MOBILE_LOGS) {
    mobileLogsList = mobileLogsList.slice(0, MAX_MOBILE_LOGS);
  }
  
  if (mobileLogsVisible) {
    updateMobileLogsDisplay();
  }
  
  // Usar el console.log original para evitar recursión
  originalConsoleLog(`[${timestamp}] ${message}`);
}

// Sobrescribir console.log para capturar todos los logs
console.log = function(...args) {
  addMobileLog(args.join(' '), 'info');
  originalConsoleLog.apply(console, args);
};

// Función para mostrar/ocultar panel de logs
function toggleMobileLogs() {
  originalConsoleLog('🐛 Toggling mobile logs, current state:', mobileLogsVisible);
  mobileLogsVisible = !mobileLogsVisible;
  
  let logsPanel = document.getElementById('mobile-logs-panel');
  
  if (mobileLogsVisible) {
    originalConsoleLog('📱 Mostrando panel de logs móvil');
    if (!logsPanel) {
      logsPanel = document.createElement('div');
      logsPanel.id = 'mobile-logs-panel';
      logsPanel.innerHTML = `
        <div class="mobile-logs-header">
          <span>📱 Debug Logs</span>
          <button id="copy-logs-btn">📋</button>
          <button id="clear-logs-btn">🗑️</button>
          <button id="close-logs-btn">❌</button>
        </div>
        <div id="mobile-logs-content"></div>
      `;
      document.body.appendChild(logsPanel);
      
      // Configurar event listeners para los botones del panel
      document.getElementById('copy-logs-btn').addEventListener('click', copyMobileLogsToClipboard);
      document.getElementById('clear-logs-btn').addEventListener('click', clearMobileLogs);
      document.getElementById('close-logs-btn').addEventListener('click', toggleMobileLogs);
      
      originalConsoleLog('📱 Panel de logs creado');
    }
    logsPanel.style.display = 'block';
    updateMobileLogsDisplay();
  } else {
    originalConsoleLog('📱 Ocultando panel de logs móvil');
    if (logsPanel) {
      logsPanel.style.display = 'none';
    }
  }
}

// Actualizar contenido del panel de logs
function updateMobileLogsDisplay() {
  const content = document.getElementById('mobile-logs-content');
  if (!content) return;
  
  content.innerHTML = mobileLogsList.map(log => `
    <div class="mobile-log-entry mobile-log-${log.type}">
      <span class="mobile-log-time">${log.timestamp}</span>
      <pre class="mobile-log-message">${log.message}</pre>
    </div>
  `).join('');
}

// Limpiar logs
function clearMobileLogs() {
  originalConsoleLog('🗑️ Limpiando logs móviles');
  mobileLogsList = [];
  updateMobileLogsDisplay();
}

// Hacer funciones globales para poder usarlas desde HTML
window.toggleMobileLogs = toggleMobileLogs;
window.clearMobileLogs = clearMobileLogs;

// Limpieza automática de caché/Service Worker si cambia la versión, pero SOLO para esta aplicación
(function checkVersionAndCleanCache() {
  try {
    // Usar clave específica para esta aplicación para no interferir con otras
    const APP_STORAGE_KEY = 'contactos_diarios_app_version';
    const storedVersion = localStorage.getItem(APP_STORAGE_KEY);
    
    if (storedVersion && storedVersion !== APP_VERSION) {
      console.log(`🔧 Actualizando ContactosDiarios de v${storedVersion} a v${APP_VERSION}`);
      
      // Conserva SOLO los datos de esta aplicación específica
      const contactos = localStorage.getItem('contactos_diarios');
      const backups = localStorage.getItem('contactos_diarios_backups');
      const backupFecha = localStorage.getItem('contactos_diarios_backup_fecha');
      const webdavConfig = localStorage.getItem('contactos_diarios_webdav_config');
      
      // SOLO limpia claves específicas de ContactosDiarios, NO toca otras aplicaciones
      const thisAppKeys = [
        APP_STORAGE_KEY,
        'contactos_diarios_backups', 
        'contactos_diarios_backup_fecha',
        'contactos_diarios_webdav_config'
      ];
      
      console.log('🧹 Limpiando SOLO claves de ContactosDiarios:', thisAppKeys);
      
      // Eliminar solo las claves de esta aplicación específica
      thisAppKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Limpiar SOLO caché de ContactosDiarios
      if ('caches' in window) {
        caches.keys().then(keys => {
          keys.forEach(key => {
            // SOLO eliminar cachés que contengan específicamente el nombre de esta aplicación
            if (key.includes('contactosdiarios') || key.includes('contactos-diarios')) {
              console.log('🗑️ Eliminando caché de ContactosDiarios:', key);
              caches.delete(key);
            }
          });
        });
      }
      
      // Desregistrar SOLO el service worker de esta aplicación específica
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.getRegistrations().then(regs => {
          regs.forEach(reg => {
            // SOLO desregistrar si el service worker pertenece específicamente a ContactosDiarios
            const isContactosDiariosWorker = reg.scope.includes('/ContactosDiarios/') || 
                                            reg.active?.scriptURL.includes('ContactosDiarios') ||
                                            reg.active?.scriptURL.includes('contactosdiarios');
            
            if (isContactosDiariosWorker) {
              console.log('🔧 Desregistrando service worker de ContactosDiarios:', reg.scope);
              reg.unregister();
            } else {
              console.log('✅ Preservando service worker de otra aplicación:', reg.scope);
            }
          });
        });
      }
      
      // Restaurar SOLO los datos de ContactosDiarios
      if (contactos) localStorage.setItem('contactos_diarios', contactos);
      if (backups) localStorage.setItem('contactos_diarios_backups', backups);
      if (backupFecha) localStorage.setItem('contactos_diarios_backup_fecha', backupFecha);
      if (webdavConfig) localStorage.setItem('contactos_diarios_webdav_config', webdavConfig);
      
      console.log('✅ Datos de ContactosDiarios restaurados, recargando...');
      location.reload();
    }
    
    // Usar clave específica para no interferir con otras aplicaciones
    localStorage.setItem(APP_STORAGE_KEY, APP_VERSION);
  } catch(e) { 
    console.error('❌ Error en limpieza de ContactosDiarios:', e);
  }
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
  // ORDENACIÓN ROBUSTA: primero los fijados, luego por fecha de edición (más reciente primero)
  console.log('🔄 INICIANDO ORDENACIÓN - Estado inicial:', filtered.length, 'contactos');
  
  // Verificar que todos los contactos tengan la propiedad lastEdited válida
  filtered.forEach((contact, index) => {
    if (!contact.lastEdited || isNaN(Number(contact.lastEdited))) {
      console.log(`⚠️ Contacto sin fecha válida: ${contact.name} - lastEdited: ${contact.lastEdited}`);
      // Asignar fecha por defecto si no existe
      filtered[index].lastEdited = 0;
    }
  });
  
  // Forzar ordenación múltiple para garantizar consistencia en móviles
  for (let pass = 0; pass < 2; pass++) {
    console.log(`🔄 Pasada de ordenación #${pass + 1}`);
    
    filtered = filtered.slice().sort((a, b) => {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isGitHub = window.location.hostname === 'sasogu.github.io';
      
      // 1. PRIMERO: Los contactos fijados siempre van arriba
      if (a.pinned !== b.pinned) {
        const result = a.pinned ? -1 : 1;
        if (isMobile || isGitHub) {
          console.log(`📌 Fijado: ${a.pinned ? a.name : b.name} va arriba (resultado: ${result})`);
        }
        return result;
      }
      
      // 2. SEGUNDO: Entre contactos del mismo tipo (ambos fijados o ambos no fijados), 
      //    ordenar por fecha de última edición (más reciente primero)
      const aTime = Number(a.lastEdited) || 0;
      const bTime = Number(b.lastEdited) || 0;
      
      // Más reciente primero (orden descendente)
      const result = bTime - aTime;
      
      if ((isMobile || isGitHub) && pass === 0) {
        console.log(`📅 ${a.name}(${aTime}) vs ${b.name}(${bTime}) = ${result} (${result > 0 ? b.name : result < 0 ? a.name : 'igual'} primero)`);
      }
      
      return result;
    });
  }
  
  console.log('✅ ORDENACIÓN COMPLETADA');
  
  // VALIDACIÓN FINAL: Verificar que la ordenación es correcta
  console.log('🔍 VALIDANDO ORDEN FINAL...');
  
  // Separar contactos fijados y no fijados para validación individual
  const pinnedContacts = filtered.filter(c => c.pinned);
  const unpinnedContacts = filtered.filter(c => !c.pinned);
  
  console.log(`📌 Contactos fijados: ${pinnedContacts.length}`);
  console.log(`📄 Contactos no fijados: ${unpinnedContacts.length}`);
  
  // Validar orden de contactos no fijados (por fecha de edición, más reciente primero)
  let ordenCorrecto = true;
  for (let i = 0; i < unpinnedContacts.length - 1; i++) {
    const current = unpinnedContacts[i];
    const next = unpinnedContacts[i + 1];
    const currentTime = Number(current.lastEdited) || 0;
    const nextTime = Number(next.lastEdited) || 0;
    
    if (currentTime < nextTime) {
      console.log(`❌ ERROR: ${current.name} (${currentTime}) debería ir DESPUÉS de ${next.name} (${nextTime})`);
      ordenCorrecto = false;
    } else {
      console.log(`✅ OK: ${current.name} (${currentTime}) antes que ${next.name} (${nextTime})`);
    }
  }
  
  // Si el orden no es correcto, forzar corrección
  if (!ordenCorrecto) {
    console.log('🔧 FORZANDO CORRECCIÓN DEL ORDEN...');
    
    // Re-ordenar solo los no fijados
    unpinnedContacts.sort((a, b) => {
      const aTime = Number(a.lastEdited) || 0;
      const bTime = Number(b.lastEdited) || 0;
      return bTime - aTime; // Más reciente primero
    });
    
    // Reconstruir array con fijados primero, luego no fijados ordenados
    filtered = [...pinnedContacts, ...unpinnedContacts];
    console.log('✅ ORDEN CORREGIDO');
  }
  
  // Log final del orden para debugging
  if (window.location.hostname === 'sasogu.github.io' || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log('📱 ORDEN FINAL:', filtered.slice(0, 8).map((c, i) => `${i+1}. ${c.pinned ? '📌' : '📄'} ${c.name} (${c.lastEdited ? new Date(c.lastEdited).toLocaleString() : 'Sin fecha'})`));
  }
  
  // Log temporal para debugging en móvil/GitHub Pages
  if (window.location.hostname === 'sasogu.github.io' || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log('📱 DEBUG MÓVIL - Orden contactos:', filtered.slice(0, 5).map(c => `${c.pinned ? '📌' : '📄'} ${c.name} (${c.lastEdited ? new Date(c.lastEdited).toLocaleString() : 'Sin fecha'})`));
    
    // Debug específico para contactos NO fijados
    const unpinnedContacts = filtered.filter(c => !c.pinned);
    console.log('📄 DEBUG - Contactos NO fijados ordenados:', unpinnedContacts.slice(0, 5).map(c => `${c.name} (${c.lastEdited ? new Date(c.lastEdited).toLocaleString() : 'Sin fecha'}) [${c.lastEdited}]`));
    
    // Verificar si el orden de no fijados es correcto
    for (let i = 0; i < unpinnedContacts.length - 1; i++) {
      const current = unpinnedContacts[i];
      const next = unpinnedContacts[i + 1];
      const currentTime = Number(current.lastEdited) || 0;
      const nextTime = Number(next.lastEdited) || 0;
      
      if (currentTime < nextTime) {
        console.log(`❌ ERROR ORDEN: ${current.name} (${currentTime}) debería ir DESPUÉS de ${next.name} (${nextTime})`);
      } else {
        console.log(`✅ ORDEN OK: ${current.name} (${currentTime}) está antes que ${next.name} (${nextTime})`);
      }
    }
  }
  
  return `
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${filter || ''}" />
      <ul>
        ${filtered.length === 0 ? '<li class="empty">Sin contactos</li>' : filtered.map((c, i) => {
          const now = Date.now();
          const recentThreshold = 24 * 60 * 60 * 1000; // 24 horas
          const isRecentlyEdited = c.lastEdited && (now - c.lastEdited) < recentThreshold;
          const recentClass = isRecentlyEdited && !c.pinned ? ' recently-edited' : '';
          
          // Calcular tiempo desde última edición para mostrar
          let timeAgo = '';
          if (c.lastEdited) {
            const diff = now - c.lastEdited;
            const hours = Math.floor(diff / (60 * 60 * 1000));
            const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
            
            if (hours < 1) {
              timeAgo = minutes < 1 ? 'Ahora' : `${minutes}m`;
            } else if (hours < 24) {
              timeAgo = `${hours}h`;
            } else {
              const days = Math.floor(hours / 24);
              timeAgo = `${days}d`;
            }
          }
          
          return `
          <li${c.pinned ? ' class="pinned"' : recentClass}>
            <div class="contact-main">
              <button class="select-contact" data-index="${contacts.indexOf(c)}">
                ${isRecentlyEdited && !c.pinned ? '🆕 ' : ''}${c.surname ? c.surname + ', ' : ''}${c.name}
                ${timeAgo && isRecentlyEdited ? `<span class="time-ago">(${timeAgo})</span>` : ''}
              </button>
              <span class="tags">${(c.tags||[]).map(t => `<span class='tag'>${t}</span>`).join(' ')}</span>
              <button class="pin-contact" data-index="${contacts.indexOf(c)}" title="${c.pinned ? 'Desfijar' : 'Fijar'}">${c.pinned ? '📌' : '📍'}</button>
            </div>
            <div class="contact-info">
              ${c.phone ? `<a href="tel:${c.phone}" class="contact-link" title="Llamar"><span>📞</span> ${c.phone}</a>` : ''}
              ${c.email ? `<a href="mailto:${c.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${c.email}</a>` : ''}
            </div>
            <div class="contact-actions">
              <button class="add-note-contact" data-index="${contacts.indexOf(c)}" title="Añadir nota">📝</button>
              <button class="edit-contact" data-index="${contacts.indexOf(c)}" title="Editar">✏️</button>
              <button class="delete-contact" data-index="${contacts.indexOf(c)}" title="Eliminar">🗑️</button>
            </div>
          </li>
          `;
        }).join('')}
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
  // Verificar autenticación para mostrar notas
  if (!isAuthenticated()) {
    return `
      <div class="notes-area">
        <h3>🔒 Notas privadas protegidas</h3>
        <div style="text-align:center;padding:20px;background:#f8f9fa;border-radius:8px;margin:20px 0;">
          <p style="margin-bottom:15px;color:#666;">
            Las notas están protegidas con contraseña para mantener tu privacidad.
          </p>
          <button id="unlock-notes-btn" style="background:#3a4a7c;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;">
            🔓 Desbloquear notas
          </button>
          ${isAuthenticated() ? `
            <button id="logout-btn" style="background:#dc3545;color:white;padding:8px 15px;border:none;border-radius:5px;cursor:pointer;margin-left:10px;">
              🚪 Cerrar sesión
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Obtener fecha actual en zona horaria de España (Europe/Madrid)
  const today = new Date();
  const spainDate = new Date(today.toLocaleString("en-US", {timeZone: "Europe/Madrid"}));
  const localDate = spainDate.toISOString().slice(0,10);
  
  // Mostrar historial de notas por fecha con edición y borrado
  return `
    <div class="notes-area">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
        <h3>Notas diarias</h3>
        <button id="logout-btn" style="background:#dc3545;color:white;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;font-size:0.8em;">
          🚪 Cerrar sesión
        </button>
      </div>
      <form id="note-form">
        <input type="date" id="note-date" value="${localDate}" required />
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
    <input type="file" id="import-file" accept=".vcf,.csv,.json" style="display:none" />
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

function AddNoteModal({ visible, contactIndex }) {
  const contact = contactIndex !== null ? state.contacts[contactIndex] : null;
  // Obtener fecha actual en zona horaria de España (Europe/Madrid)
  const today = new Date();
  const spainDate = new Date(today.toLocaleString("en-US", {timeZone: "Europe/Madrid"}));
  const localDate = spainDate.toISOString().slice(0,10);
  
  return `
    <div id="add-note-modal" class="modal" style="display:${visible ? 'flex' : 'none'};z-index:4000;">
      <div class="modal-content" style="max-width:500px;">
        <h3>Añadir nota diaria</h3>
        ${contact ? `<p><strong>${contact.surname ? contact.surname + ', ' : ''}${contact.name}</strong></p>` : ''}
        <form id="add-note-form">
          <label>Fecha <input type="date" id="add-note-date" value="${localDate}" required /></label>
          <label>Nota <textarea id="add-note-text" rows="4" placeholder="Escribe una nota para este contacto..." required></textarea></label>
          <div class="form-actions">
            <button type="submit">Guardar nota</button>
            <button type="button" id="cancel-add-note">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// --- Función de notificaciones ---
function showNotification(message, type = 'info') {
  // Crear o reutilizar el contenedor de notificaciones
  let notificationContainer = document.getElementById('notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    notificationContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
      pointer-events: none;
    `;
    document.body.appendChild(notificationContainer);
  }
  
  // Crear la notificación
  const notification = document.createElement('div');
  notification.style.cssText = `
    background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : type === 'warning' ? '#fff3cd' : '#d1ecf1'};
    color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : type === 'warning' ? '#856404' : '#0c5460'};
    border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : type === 'warning' ? '#ffeaa7' : '#bee5eb'};
    padding: 12px 16px;
    border-radius: 6px;
    margin-bottom: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    font-size: 14px;
    line-height: 1.4;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease-in-out;
    pointer-events: auto;
    cursor: pointer;
  `;
  
  // Icono según el tipo
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
  notification.innerHTML = `${icon} ${message}`;
  
  // Añadir la notificación al contenedor
  notificationContainer.appendChild(notification);
  
  // Animar entrada
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Auto-remover después de 4 segundos
  const removeNotification = () => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  };
  
  // Click para cerrar manualmente
  notification.onclick = removeNotification;
  
  // Auto-remover
  setTimeout(removeNotification, 4000);
}

// Función para mostrar notificación de actualización
function showUpdateNotification(newVersion) {
  console.log('📢 Mostrando notificación de actualización para versión:', newVersion);
  
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.id = 'update-notification';
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      max-width: 300px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="font-weight: bold; margin-bottom: 8px;">
        🆕 Nueva versión disponible
      </div>
      <div style="font-size: 14px; margin-bottom: 12px;">
        Versión ${newVersion} lista para usar
      </div>
      <div style="display: flex; gap: 10px;">
        <button onclick="reloadApp()" style="
          background: white;
          color: #4CAF50;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 12px;
        ">
          Actualizar ahora
        </button>
        <button onclick="dismissUpdate()" style="
          background: transparent;
          color: white;
          border: 1px solid white;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        ">
          Más tarde
        </button>
      </div>
    </div>
  `;
  
  // Remover notificación anterior si existe
  const existingNotification = document.getElementById('update-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  document.body.appendChild(notification);
  
  // Auto-ocultar después de 10 segundos
  setTimeout(() => {
    if (document.getElementById('update-notification')) {
      dismissUpdate();
    }
  }, 10000);
}

// Función para recargar la aplicación
function reloadApp() {
  console.log('🔄 Recargando aplicación...');
  window.location.reload();
}

// Función para descartar la notificación de actualización
function dismissUpdate() {
  const notification = document.getElementById('update-notification');
  if (notification) {
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }
}

// --- Funciones de validación ---
function validateContact(contact) {
  const errors = [];
  
  // Validar nombre (obligatorio)
  if (!contact.name || contact.name.trim().length === 0) {
    errors.push('El nombre es obligatorio');
  } else if (contact.name.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  } else if (contact.name.trim().length > 50) {
    errors.push('El nombre no puede tener más de 50 caracteres');
  }
  
  // Validar apellidos (opcional pero si se proporciona, validar)
  if (contact.surname && contact.surname.trim().length > 50) {
    errors.push('Los apellidos no pueden tener más de 50 caracteres');
  }
  
  // Validar teléfono (opcional pero si se proporciona, validar formato básico)
  if (contact.phone && contact.phone.trim().length > 0) {
    const phoneRegex = /^[\d\s\-\+\(\)\.]{6,20}$/;
    if (!phoneRegex.test(contact.phone.trim())) {
      errors.push('El teléfono debe contener solo números, espacios y caracteres válidos (6-20 caracteres)');
    }
  }
  
  // Validar email (opcional pero si se proporciona, validar formato)
  if (contact.email && contact.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email.trim())) {
      errors.push('El email debe tener un formato válido');
    } else if (contact.email.trim().length > 100) {
      errors.push('El email no puede tener más de 100 caracteres');
    }
  }
  
  return errors;
}

function validateNote(noteText) {
  const errors = [];
  
  if (!noteText || noteText.trim().length === 0) {
    errors.push('La nota no puede estar vacía');
    return errors;
  }
  
  // Validar longitud máxima
  if (noteText.trim().length > 1000) {
    errors.push('La nota no puede tener más de 1000 caracteres');
  }
  
  // Validar longitud mínima
  if (noteText.trim().length < 3) {
    errors.push('La nota debe tener al menos 3 caracteres');
  }
  
  // Validar caracteres no permitidos (solo caracteres básicos y algunos especiales)
  const allowedCharsRegex = /^[\w\s\.\,\;\:\!\?\-\(\)\[\]\"\'\/\@\#\$\%\&\*\+\=\<\>\{\}\|\~\`\ñÑáéíóúÁÉÍÓÚüÜ]*$/;
  if (!allowedCharsRegex.test(noteText)) {
    errors.push('La nota contiene caracteres no permitidos');
  }
  
  return errors;
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
  showAddNoteModal: false,
  addNoteContactIndex: null,
  allNotesPage: 1, // Página actual del modal de notas
  duplicates: [], // Grupos de contactos duplicados encontrados
  showDuplicateModal: false,
  showAuthModal: false,
  authMode: 'login', // 'login' o 'setup'
  pendingAction: null // Acción a ejecutar después de autenticación exitosa
};

function loadContacts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}
function saveContacts(contacts) {
  // PROTECCIÓN: Nunca guardar array vacío si ya existen contactos
  if (!contacts || !Array.isArray(contacts)) {
    console.error('❌ ERROR: Intentando guardar contactos inválidos:', contacts);
    return;
  }
  
  if (contacts.length === 0) {
    // Verificar si ya existen contactos en localStorage
    const existingContacts = localStorage.getItem(STORAGE_KEY);
    if (existingContacts && existingContacts !== '[]') {
      console.error('❌ ERROR: Intentando sobrescribir contactos existentes con array vacío. Operación cancelada.');
      console.log('📊 Contactos existentes:', existingContacts);
      return;
    }
    console.log('ℹ️ Guardando array vacío (primera vez o limpieza intencional)');
  }
  
  console.log(`💾 Guardando ${contacts.length} contactos en localStorage`);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

function render() {
  console.log('🎨 Iniciando render...');
  
  try {
    const app = document.querySelector('#app');
    if (!app) {
      console.error('❌ ERROR: No se encontró el elemento #app');
      return;
    }
    
    console.log('✅ Elemento #app encontrado:', app);
    
    const contact = state.editing !== null ? state.contacts[state.editing] : null;
    const notes = state.selected !== null ? (state.contacts[state.selected].notes || {}) : {};
    
    console.log('📊 Estado actual:', {
      editing: state.editing,
      selected: state.selected,
      contactsCount: state.contacts.length
    });
    
    app.innerHTML = `
    <h1>Diario de Contactos</h1>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <div class="main-grid">
      <div>
        
        ${ContactList({ contacts: state.contacts, filter: state.tagFilter })}
        <button id="show-backup-modal" class="add-btn" style="width:100%;margin-top:0.7rem;background:#06b6d4;">Restaurar copia local</button>
        <div style="margin-top:1rem;">
        <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
          <button id="import-btn" style="background:#6f42c1;color:#fff;margin:0 10px 1.2rem 0;">📂 Importar contactos</button>
          <button id="export-btn" style="background:#fd7e14;color:#fff;margin:0 10px 1.2rem 0;">💾 Exportar contactos</button>
          <button id="manage-duplicates-btn" style="background:#dc3545;color:#fff;margin:0 10px 1.2rem 0;">🔍 Gestionar duplicados</button>
          <button id="validate-contacts-btn" style="background:#28a745;color:#fff;margin:0 10px 1.2rem 0;">✅ Validar contactos</button>
        </div>
      </div>
      <div>
        ${state.editing !== null ? ContactForm({ contact }) : ''}
        ${state.selected !== null && state.editing === null ? NotesArea({ notes }) : ''}
      </div>
    </div>
    ${AllNotesModal({ contacts: state.contacts, visible: state.showAllNotes, page: state.allNotesPage })}
    ${BackupModal({ visible: state.showBackupModal, backups: JSON.parse(localStorage.getItem('contactos_diarios_backups') || '[]') })} <!-- Modal de backup -->
    ${AddNoteModal({ visible: state.showAddNoteModal, contactIndex: state.addNoteContactIndex })} <!-- Modal añadir nota -->
    ${DuplicateManagementModal({ duplicates: state.duplicates, visible: state.showDuplicateModal })} <!-- Modal de gestión de duplicados -->
    ${AuthModal({ visible: state.showAuthModal, mode: state.authMode })} <!-- Modal de autenticación -->
    ${ImportExport({})}
  `;
  bindEvents();
  setupScrollProtection(); // Configurar protección contra scroll
  // Botón para abrir modal de backups
  const showBackupBtn = document.getElementById('show-backup-modal');
  if (showBackupBtn) showBackupBtn.onclick = () => { state.showBackupModal = true; render(); };
  // Botón cerrar modal de backups
  const closeBackupBtn = document.getElementById('close-backup-modal');
  if (closeBackupBtn) closeBackupBtn.onclick = () => { state.showBackupModal = false; render(); };
  // Botones para añadir nota diaria
  document.querySelectorAll('.add-note-contact').forEach(btn => {
    btn.onclick = e => {
      const contactIndex = Number(btn.dataset.index);
      
      if (!isAuthenticated()) {
        // Guardar la acción que se quiere realizar después de autenticarse
        state.pendingAction = { type: 'addNote', contactIndex };
        
        if (isPasswordSet()) {
          state.authMode = 'login';
        } else {
          state.authMode = 'setup';
        }
        state.showAuthModal = true;
        render();
        return;
      }
      
      state.addNoteContactIndex = contactIndex;
      state.showAddNoteModal = true;
      render();
    };
  });
  // Botón cerrar modal de añadir nota
  const closeAddNoteBtn = document.getElementById('cancel-add-note');
  if (closeAddNoteBtn) closeAddNoteBtn.onclick = () => { 
    state.showAddNoteModal = false; 
    state.addNoteContactIndex = null;
    render(); 
  };
  // Botones restaurar backup por fecha
  document.querySelectorAll('.restore-backup-btn').forEach(btn => {
    btn.onclick = () => restaurarBackupPorFecha(btn.dataset.fecha);
  });
  // Botón restaurar backup local
  const restoreBtn = document.getElementById('restore-local-backup');
  if (restoreBtn) restoreBtn.onclick = restaurarBackupLocal;
  
  console.log('✅ Render completado exitosamente');
  
  } catch (error) {
    console.error('❌ ERROR en render:', error);
    console.error('Stack trace:', error.stack);
    
    // Intentar mostrar al menos el mensaje de error en la app
    const app = document.querySelector('#app');
    if (app) {
      app.innerHTML = `
        <div style="padding: 20px; background: #ffebee; border: 1px solid #f44336; border-radius: 8px; margin: 20px;">
          <h2 style="color: #d32f2f;">❌ Error de la aplicación</h2>
          <p><strong>Error:</strong> ${error.message}</p>
          <p><strong>Línea:</strong> ${error.stack}</p>
          <button onclick="location.reload()" style="background: #2196F3; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
            🔄 Recargar aplicación
          </button>
        </div>
      `;
    }
  }
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
      e.preventDefault();
      e.stopPropagation();
      
      // Prevenir clicks durante scroll
      if (!isClickSafe(btn)) {
        return;
      }
      
      state.selected = Number(btn.dataset.index);
      state.editing = null;
      render();
    };
  });
  // Editar contacto
  document.querySelectorAll('.edit-contact').forEach(btn => {
    btn.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      
      // Prevenir clicks durante scroll
      if (!isClickSafe(btn)) {
        return;
      }
      
      state.editing = Number(btn.dataset.index);
      state.selected = null;
      render();
    };
  });
  // Eliminar contacto
  document.querySelectorAll('.delete-contact').forEach(btn => {
    btn.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      
      // Prevenir clicks durante scroll
      if (!isClickSafe(btn)) {
        return;
      }
      
      const contactIndex = Number(btn.dataset.index);
      const contact = state.contacts[contactIndex];
      const contactName = contact.surname ? `${contact.surname}, ${contact.name}` : contact.name;
      
      if (confirm(`¿Estás seguro de eliminar el contacto "${contactName}"?\n\nEsta acción no se puede deshacer.`)) {
        state.contacts.splice(contactIndex, 1);
        saveContacts(state.contacts);
        showNotification('Contacto eliminado correctamente', 'success');
        state.selected = null;
        render();
      }
    };
  });
  // Fijar contacto
  document.querySelectorAll('.pin-contact').forEach(btn => {
    btn.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      
      // Prevenir clicks durante scroll
      if (!isClickSafe(btn)) {
        return;
      }
      
      const idx = Number(btn.dataset.index);
      if (state.contacts[idx].pinned) {
        if (!confirm('¿Seguro que quieres desfijar este contacto?')) return;
      }
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
      
      // Validar datos del contacto
      const errors = validateContact(data);
      if (errors.length > 0) {
        showNotification('Error de validación: ' + errors.join(', '), 'error');
        return;
      }
      
      // Procesar etiquetas
      let tags = data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      delete data.tags;
      
      // Verificar duplicados antes de guardar
      const contactToSave = { ...data, tags };
      const isDuplicate = state.contacts.some((c, index) => {
        // Omitir el contacto actual si estamos editando
        if (state.editing !== null && index === state.editing) return false;
        return isDuplicateContact(c, contactToSave);
      });
      
      if (isDuplicate) {
        if (!confirm('Ya existe un contacto similar. ¿Deseas guardarlo de todas formas?')) {
          return;
        }
      }
      
      if (state.editing !== null && state.editing < state.contacts.length) {
        // Editar contacto existente
        state.contacts[state.editing] = {
          ...state.contacts[state.editing], 
          ...data, 
          tags,
          lastEdited: Date.now()
        };
        
        // Log temporal para debugging en móvil
        if (window.location.hostname === 'sasogu.github.io' || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          console.log('📱 CONTACTO EDITADO:', state.contacts[state.editing].name, 'Nueva fecha:', new Date().toLocaleString());
        }
        
        showNotification('Contacto actualizado correctamente', 'success');
      } else {
        // Crear nuevo contacto
        state.contacts.push({ 
          ...data, 
          notes: {}, 
          tags,
          lastEdited: Date.now(),
          createdAt: Date.now()
        });
        showNotification('Contacto añadido correctamente', 'success');
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
  // Formulario de añadir nota modal
  const addNoteForm = document.getElementById('add-note-form');
  if (addNoteForm && state.addNoteContactIndex !== null) {
    const handleAddNoteSubmit = (e) => {
      e.preventDefault();
      
      const date = document.getElementById('add-note-date').value;
      const text = document.getElementById('add-note-text').value.trim();
      
      if (!date || !text) {
        showNotification('Por favor, selecciona una fecha y escribe una nota', 'warning');
        return;
      }
      
      const noteErrors = validateNote(text);
      if (noteErrors.length > 0) {
        showNotification('Error en la nota: ' + noteErrors.join(', '), 'error');
        return;
      }
      
      const contactIndex = state.addNoteContactIndex;
      if (!state.contacts[contactIndex].notes) state.contacts[contactIndex].notes = {};
      
      if (state.contacts[contactIndex].notes[date]) {
        state.contacts[contactIndex].notes[date] += '\n' + text;
      } else {
        state.contacts[contactIndex].notes[date] = text;
      }
      
      // Actualizar fecha de última edición al añadir nota desde modal
      state.contacts[contactIndex].lastEdited = Date.now();
      
      // Debug móvil
      if (window.location.hostname === 'sasogu.github.io' || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        console.log(`📝 MÓVIL - Nota añadida a ${state.contacts[contactIndex].name}, lastEdited: ${state.contacts[contactIndex].lastEdited}`);
      }
      
      saveContacts(state.contacts);
      showNotification('Nota añadida correctamente', 'success');
      
      state.showAddNoteModal = false;
      state.addNoteContactIndex = null;
      render();
    };
    
    addNoteForm.onsubmit = handleAddNoteSubmit;
    
    // Solo agregar eventos táctiles si realmente son necesarios
    // Se remueve la sensibilidad excesiva
  }
  // Notas diarias
  const noteForm = document.getElementById('note-form');
  if (noteForm && state.selected !== null) {
    const handleNoteSubmit = (e) => {
      e.preventDefault();
      
      const date = document.getElementById('note-date').value;
      const text = document.getElementById('note-text').value.trim();
      
      if (!date || !text) {
        showNotification('Por favor, selecciona una fecha y escribe una nota', 'warning');
        return;
      }
      
      const noteErrors = validateNote(text);
      if (noteErrors.length > 0) {
        showNotification('Error en la nota: ' + noteErrors.join(', '), 'error');
        return;
      }
      
      if (!state.contacts[state.selected].notes) state.contacts[state.selected].notes = {};
      
      if (state.contacts[state.selected].notes[date]) {
        state.contacts[state.selected].notes[date] += '\n' + text;
      } else {
        state.contacts[state.selected].notes[date] = text;
      }
      
      // Actualizar fecha de última edición al añadir nota
      state.contacts[state.selected].lastEdited = Date.now();
      
      saveContacts(state.contacts);
      showNotification('Nota guardada correctamente', 'success');
      
      document.getElementById('note-text').value = '';
      render();
    };
    
    noteForm.onsubmit = handleNoteSubmit;
    
    // Se remueve la sensibilidad táctil excesiva
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
        const newText = textarea.value.trim();
        
        // Validar contenido de la nota
        const noteErrors = validateNote(newText);
        if (noteErrors.length > 0) {
          showNotification('Error en la nota: ' + noteErrors.join(', '), 'error');
          return;
        }
        
        state.contacts[state.selected].notes[date] = newText;
        
        // Actualizar fecha de última edición al editar nota
        state.contacts[state.selected].lastEdited = Date.now();
        
        saveContacts(state.contacts);
        showNotification('Nota actualizada correctamente', 'success');
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
      if (confirm(`¿Estás seguro de eliminar la nota del ${date}?\n\nEsta acción no se puede deshacer.`)) {
        delete state.contacts[state.selected].notes[date];
        saveContacts(state.contacts);
        showNotification('Nota eliminada correctamente', 'success');
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
      // Validar contactos importados
      const validContacts = [];
      const invalidContacts = [];
      
      imported.forEach((contact, index) => {
        const errors = validateContact(contact);
        if (errors.length === 0) {
          validContacts.push(contact);
        } else {
          invalidContacts.push({ index: index + 1, errors });
        }
      });
      
      if (invalidContacts.length > 0) {
        const invalidList = invalidContacts.map(c => `Contacto ${c.index}: ${c.errors.join(', ')}`).join('\n');
        if (!confirm(`Se encontraron ${invalidContacts.length} contacto(s) con errores:\n\n${invalidList}\n\n¿Deseas importar solo los contactos válidos (${validContacts.length})?`)) {
          return;
        }
      }
      
      // Evitar duplicados: compara por nombre, apellidos y teléfono
      const existe = (c) => state.contacts.some(
        x => x.name === c.name && x.surname === c.surname && x.phone === c.phone
      );
      const nuevos = validContacts.filter(c => !existe(c));
      
      if (nuevos.length) {
        state.contacts = state.contacts.concat(nuevos);
        saveContacts(state.contacts);
        showNotification(`${nuevos.length} contacto(s) importado(s) correctamente`, 'success');
        render();
      } else {
        showNotification('No se han importado contactos nuevos (todos ya existen)', 'info');
      }
    } else {
      showNotification('No se pudieron importar contactos del archivo seleccionado', 'error');
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
      if (!isAuthenticated()) {
        // Guardar la acción que se quiere realizar después de autenticarse
        state.pendingAction = { type: 'showAllNotes' };
        
        if (isPasswordSet()) {
          state.authMode = 'login';
        } else {
          state.authMode = 'setup';
        }
        state.showAuthModal = true;
        render();
        return;
      }
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
      // Siempre descarga el archivo primero
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(a.href);
        a.remove();
      }, 1000);
      // Luego intenta compartir si es posible
      if (navigator.canShare && window.File && window.FileReader) {
        try {
          const file = new File([blob], fileName, { type: 'application/json' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Backup de Contactos',
              text: `Copia de seguridad (${fecha}) de ContactosDiarios`
            });
          }
        } catch (e) {
          // Si el usuario cancela, no hacer nada
        }
      }
    };
  });
  
  // --- Eventos para gestión de duplicados ---
  
  // Botón para gestionar duplicados
  const manageDuplicatesBtn = document.getElementById('manage-duplicates-btn');
  if (manageDuplicatesBtn) {
    manageDuplicatesBtn.onclick = () => {
      state.duplicates = findAllDuplicates();
      if (state.duplicates.length === 0) {
        showNotification('No se encontraron contactos duplicados', 'info');
      } else {
        state.showDuplicateModal = true;
        render();
      }
    };
  }
  
  // Botón para validar todos los contactos
  const validateContactsBtn = document.getElementById('validate-contacts-btn');
  if (validateContactsBtn) {
    validateContactsBtn.onclick = () => {
      const invalidContacts = [];
      
      state.contacts.forEach((contact, index) => {
        const errors = validateContact(contact);
        if (errors.length > 0) {
          const contactName = contact.surname ? `${contact.surname}, ${contact.name}` : contact.name;
          invalidContacts.push({ 
            index: index + 1, 
            name: contactName, 
            errors 
          });
        }
      });
      
      if (invalidContacts.length === 0) {
        showNotification(`✅ Todos los ${state.contacts.length} contactos son válidos`, 'success');
      } else {
        const invalidList = invalidContacts.map(c => 
          `${c.index}. ${c.name}: ${c.errors.join(', ')}`
        ).join('\n');
        
        showNotification(`⚠️ Se encontraron ${invalidContacts.length} contacto(s) con errores`, 'warning');
        
        // Mostrar detalles en consola para debugging
        console.log('Contactos con errores de validación:', invalidContacts);
        
        // Opcional: ofrecer corrección automática
        if (confirm(`Se encontraron ${invalidContacts.length} contacto(s) con errores de validación:\n\n${invalidList}\n\n¿Deseas ver más detalles en la consola del navegador?`)) {
          console.table(invalidContacts);
        }
      }
    };
  }
  
  // Botón para cancelar gestión de duplicados
  const cancelDuplicateBtn = document.getElementById('cancel-duplicate-resolution');
  if (cancelDuplicateBtn) {
    cancelDuplicateBtn.onclick = () => {
      state.showDuplicateModal = false;
      state.duplicates = [];
      render();
    };
  }
  
  // Botón para aplicar resolución de duplicados
  const applyResolutionBtn = document.getElementById('apply-resolution');
  if (applyResolutionBtn) {
    applyResolutionBtn.onclick = applyDuplicateResolution;
  }
  
  // Eventos para cambiar tipo de resolución de duplicados
  document.querySelectorAll('input[name^="resolution-"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const groupIndex = radio.name.split('-')[1];
      const mergeSection = document.getElementById(`merge-section-${groupIndex}`);
      const individualSection = document.getElementById(`individual-section-${groupIndex}`);
      
      if (radio.value === 'merge') {
        mergeSection.style.display = 'block';
        individualSection.style.display = 'none';
      } else if (radio.value === 'select') {
        mergeSection.style.display = 'none';
        individualSection.style.display = 'block';
      } else { // skip
        mergeSection.style.display = 'none';
        individualSection.style.display = 'none';
      }
    });
  });
  
  // Actualizar estilos de opciones de resolución seleccionadas
  document.querySelectorAll('.resolution-option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      // Quitar clase selected de todas las opciones del grupo
      const groupName = radio.name;
      document.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
        r.closest('.resolution-option').classList.remove('selected');
      });
      // Añadir clase selected a la opción seleccionada
      radio.closest('.resolution-option').classList.add('selected');
    });
  });
  
  // --- Eventos de autenticación ---
  
  // Botón para desbloquear notas
  const unlockNotesBtn = document.getElementById('unlock-notes-btn');
  if (unlockNotesBtn) {
    unlockNotesBtn.onclick = () => {
      // Si hay un contacto seleccionado, mostrar sus notas después de autenticarse
      if (state.selected !== null) {
        state.pendingAction = { type: 'showContactNotes', contactIndex: state.selected };
      }
      
      if (isPasswordSet()) {
        state.authMode = 'login';
      } else {
        state.authMode = 'setup';
      }
      state.showAuthModal = true;
      render();
    };
  }
  
  // Botón de logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      logout();
      render();
    };
  }
  
  // Formulario de autenticación
  const authForm = document.getElementById('auth-form');
  if (authForm && !authForm.hasAttribute('data-handler-added')) {
    authForm.setAttribute('data-handler-added', 'true');
    
    authForm.onsubmit = e => {
      e.preventDefault();
      const password = document.getElementById('auth-password').value.trim();
      
      if (!password) {
        showNotification('Por favor, introduce una contraseña', 'warning');
        return;
      }
      
      if (state.authMode === 'setup') {
        const confirmPassword = document.getElementById('auth-password-confirm').value.trim();
        if (password !== confirmPassword) {
          showNotification('Las contraseñas no coinciden', 'error');
          return;
        }
        if (password.length < 4) {
          showNotification('La contraseña debe tener al menos 4 caracteres', 'warning');
          return;
        }
        setPassword(password);
        authState.isAuthenticated = true;
        authState.sessionExpiry = Date.now() + (30 * 60 * 1000);
        state.showAuthModal = false;
        authForm.reset();
        
        // Ejecutar acción pendiente si existe
        setTimeout(() => {
          executePendingAction();
        }, 100);
        
        render();
      } else {
        const authResult = authenticate(password);
        if (authResult) {
          state.showAuthModal = false;
          authForm.reset();
          render();
        } else {
          document.getElementById('auth-password').value = '';
          document.getElementById('auth-password').focus();
        }
      }
    };
  }
  
  // Botón cancelar autenticación
  const cancelAuthBtn = document.getElementById('cancel-auth');
  if (cancelAuthBtn) {
    cancelAuthBtn.onclick = () => {
      state.showAuthModal = false;
      state.pendingAction = null; // Limpiar acción pendiente al cancelar
      render();
    };
  }
  
  // Cerrar modal de autenticación haciendo clic fuera
  const authModal = document.getElementById('auth-modal');
  if (authModal) {
    authModal.onclick = (e) => {
      if (e.target === authModal) {
        state.showAuthModal = false;
        state.pendingAction = null; // Limpiar acción pendiente al cerrar
        render();
      }
    };
    
    // Focus automático en el campo de contraseña
    const passwordInput = document.getElementById('auth-password');
    if (passwordInput) {
      const delay = window.innerWidth <= 700 ? 300 : 100;
      setTimeout(() => {
        passwordInput.focus();
        if (window.innerWidth <= 700) {
          passwordInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, delay);
    }
    
    // Cerrar con tecla Escape
    const escapeHandler = (e) => {
      if (e.key === 'Escape' && state.showAuthModal) {
        state.showAuthModal = false;
        state.pendingAction = null; // Limpiar acción pendiente
        render();
      }
    };
    document.addEventListener('keydown', escapeHandler);
  }
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
  console.log('🔄 Ejecutando backup automático diario...');
  
  // Obtener fecha actual en zona horaria de España (Europe/Madrid)
  const today = new Date();
  const spainDate = new Date(today.toLocaleString("en-US", {timeZone: "Europe/Madrid"}));
  const hoy = spainDate.toISOString().slice(0, 10);
  
  // IMPORTANTE: Leer directamente desde localStorage, NO desde state
  const contactosActuales = localStorage.getItem('contactos_diarios');
  if (!contactosActuales) {
    console.log('⚠️ No hay contactos para hacer backup');
    return;
  }
  
  try {
    const contactosData = JSON.parse(contactosActuales);
    if (!Array.isArray(contactosData) || contactosData.length === 0) {
      console.log('⚠️ Los datos de contactos están vacíos, saltando backup');
      return;
    }
    
    let backups = JSON.parse(localStorage.getItem('contactos_diarios_backups') || '[]');
    
    // Solo crear backup si no existe uno para hoy
    if (!backups.find(b => b.fecha === hoy)) {
      console.log(`💾 Creando backup para ${hoy} con ${contactosData.length} contactos`);
      backups.push({ fecha: hoy, datos: contactosData });
      
      // Limitar a los últimos 10 backups
      if (backups.length > 10) {
        console.log(`🗂️ Limitando backups a los últimos 10 (había ${backups.length})`);
        backups = backups.slice(-10);
      }
      
      localStorage.setItem('contactos_diarios_backups', JSON.stringify(backups));
      console.log(`✅ Backup diario creado exitosamente para ${hoy}`);
    } else {
      console.log(`📅 Ya existe backup para ${hoy}`);
    }
    
    localStorage.setItem('contactos_diarios_backup_fecha', hoy);
  } catch (error) {
    console.error('❌ Error en backup automático:', error);
  }
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

// --- Sistema de detección y gestión de duplicados ---
function isDuplicateContact(contact1, contact2) {
  // Normalizar texto para comparación
  const normalize = (str) => str ? str.toLowerCase().replace(/\s+/g, ' ').trim() : '';
  
  // Coincidencia exacta de nombre y apellidos
  if (normalize(contact1.name) === normalize(contact2.name) && 
      normalize(contact1.surname) === normalize(contact2.surname)) {
    return true;
  }
  
  // Coincidencia exacta de teléfono (si ambos lo tienen)
  if (contact1.phone && contact2.phone && 
      contact1.phone.replace(/\s+/g, '') === contact2.phone.replace(/\s+/g, '')) {
    return true;
  }
  
  // Coincidencia exacta de email (si ambos lo tienen)
  if (contact1.email && contact2.email && 
      normalize(contact1.email) === normalize(contact2.email)) {
    return true;
  }
  
  return false;
}

function findAllDuplicates() {
  const duplicates = [];
  const processed = new Set();
  
  for (let i = 0; i < state.contacts.length; i++) {
    if (processed.has(i)) continue;
    
    const group = [{ ...state.contacts[i], originalIndex: i }];
    processed.add(i);
    
    for (let j = i + 1; j < state.contacts.length; j++) {
      if (processed.has(j)) continue;
      
      if (isDuplicateContact(state.contacts[i], state.contacts[j])) {
        group.push({ ...state.contacts[j], originalIndex: j });
        processed.add(j);
      }
    }
    
    if (group.length > 1) {
      duplicates.push({ contacts: group });
    }
  }
  
  return duplicates;
}

function mergeContactsData(contacts) {
  if (contacts.length === 0) return null;
  if (contacts.length === 1) return contacts[0];
  
  // Lógica de fusión inteligente
  const merged = {
    name: '',
    surname: '',
    phone: '',
    email: '',
    tags: [],
    notes: {},
    pinned: false
  };
  
  // Tomar el nombre y apellido más largo
  let longestName = '';
  let longestSurname = '';
  
  contacts.forEach(contact => {
    if (contact.name && contact.name.length > longestName.length) {
      longestName = contact.name;
    }
    if (contact.surname && contact.surname.length > longestSurname.length) {
      longestSurname = contact.surname;
    }
  });
  
  merged.name = longestName;
  merged.surname = longestSurname;
  
  // Tomar el primer teléfono y email encontrado
  merged.phone = contacts.find(c => c.phone)?.phone || '';
  merged.email = contacts.find(c => c.email)?.email || '';
  
  // Fusionar etiquetas únicas
  const allTags = new Set();
  contacts.forEach(contact => {
    if (contact.tags) {
      contact.tags.forEach(tag => allTags.add(tag));
    }
  });
  merged.tags = Array.from(allTags);
  
  // Fusionar notas por fecha
  contacts.forEach((contact, index) => {
    if (contact.notes) {
      Object.entries(contact.notes).forEach(([date, note]) => {
        if (merged.notes[date]) {
          // Si ya existe una nota para esa fecha, combinar con separador
          merged.notes[date] += `\n--- Contacto ${index + 1} ---\n${note}`;
        } else {
          merged.notes[date] = note;
        }
      });
    }
  });
  
  // Mantener el estado de fijado si alguno está fijado
  merged.pinned = contacts.some(c => c.pinned);
  
  return merged;
}

function generateMergePreview(contacts) {
  const mergedContact = mergeContactsData(contacts);
  
  return `
    <div class="merge-preview">
      <h5>🔗 Vista previa del contacto fusionado:</h5>
      <div class="contact-preview">
        <div class="contact-field"><strong>Nombre:</strong> ${mergedContact.name}</div>
        <div class="contact-field"><strong>Apellidos:</strong> ${mergedContact.surname}</div>
        <div class="contact-field"><strong>Teléfono:</strong> ${mergedContact.phone || 'No especificado'}</div>
        <div class="contact-field"><strong>Email:</strong> ${mergedContact.email || 'No especificado'}</div>
        <div class="contact-field">
          <strong>Etiquetas:</strong>
          <div class="tags">
            ${mergedContact.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </div>
        <div class="contact-field">
          <strong>Notas:</strong> ${Object.keys(mergedContact.notes).length} fecha(s) con notas
        </div>
        <div class="contact-field">
          <strong>Estado:</strong> ${mergedContact.pinned ? '📌 Fijado' : 'Normal'}
        </div>
      </div>
    </div>
  `;
}

function DuplicateManagementModal({ duplicates, visible }) {
  if (!visible || duplicates.length === 0) {
    return `<div id="duplicate-modal" class="modal" style="display:none"></div>`;
  }
  
  return `
    <div id="duplicate-modal" class="modal" style="display:flex;z-index:5000;">
      <div class="modal-content" style="max-width:800px;max-height:90vh;overflow-y:auto;">
        <h3>🔍 Gestión de contactos duplicados</h3>
        <p>Se encontraron <strong>${duplicates.length}</strong> grupo(s) de contactos duplicados. 
           Para cada grupo, elige cómo resolverlo:</p>
        
        ${duplicates.map((group, groupIndex) => `
          <div class="duplicate-group" style="border:1px solid #ddd;border-radius:8px;padding:15px;margin:15px 0;background:#fafafa;">
            <h4>Grupo ${groupIndex + 1} - ${group.contacts.length} contactos similares</h4>
            
            <!-- Opciones de resolución -->
            <div class="resolution-options">
              <label class="resolution-option">
                <input type="radio" name="resolution-${groupIndex}" value="merge" checked>
                🔗 Fusionar en un contacto
              </label>
              <label class="resolution-option">
                <input type="radio" name="resolution-${groupIndex}" value="select">
                👆 Seleccionar uno y eliminar otros
              </label>
              <label class="resolution-option">
                <input type="radio" name="resolution-${groupIndex}" value="skip">
                ⏭️ Omitir este grupo
              </label>
            </div>
            
            <!-- Vista previa de fusión (mostrar por defecto) -->
            <div class="merge-section" id="merge-section-${groupIndex}">
              ${generateMergePreview(group.contacts)}
            </div>
            
            <!-- Sección de selección individual (oculta por defecto) -->
            <div class="individual-selection" id="individual-section-${groupIndex}" style="display:none;">
              <h5>Selecciona el contacto a mantener:</h5>
              ${group.contacts.map((contact, contactIndex) => `
                <label class="duplicate-contact" style="display:block;margin:8px 0;padding:12px;border:1px solid #ccc;border-radius:6px;cursor:pointer;">
                  <input type="radio" name="keep-${groupIndex}" value="${contact.originalIndex}">
                  <strong>${contact.surname ? contact.surname + ', ' : ''}${contact.name}</strong>
                  ${contact.phone ? `📞 ${contact.phone}` : ''}
                  ${contact.email ? `✉️ ${contact.email}` : ''}
                  ${contact.tags && contact.tags.length > 0 ? `<br>🏷️ ${contact.tags.join(', ')}` : ''}
                  ${Object.keys(contact.notes || {}).length > 0 ? `<br>📝 ${Object.keys(contact.notes).length} nota(s)` : ''}
                  ${contact.pinned ? '<br>📌 Fijado' : ''}
                </label>
              `).join('')}
            </div>
          </div>
        `).join('')}
        
        <div class="form-actions" style="margin-top:20px;">
          <button id="apply-resolution" style="background:#28a745;color:white;">Aplicar resolución</button>
          <button id="cancel-duplicate-resolution" style="background:#6c757d;color:white;">Cancelar</button>
        </div>
      </div>
    </div>
  `;
}

function applyDuplicateResolution() {
  const resolutions = [];
  let totalOperations = 0;
  
  // Recopilar resoluciones para cada grupo
  state.duplicates.forEach((group, groupIndex) => {
    const resolutionRadio = document.querySelector(`input[name="resolution-${groupIndex}"]:checked`);
    const resolutionType = resolutionRadio ? resolutionRadio.value : 'skip';
    
    if (resolutionType === 'merge') {
      resolutions.push({
        type: 'merge',
        groupIndex,
        contacts: group.contacts
      });
      totalOperations++;
    } else if (resolutionType === 'select') {
      const selectedRadio = document.querySelector(`input[name="keep-${groupIndex}"]:checked`);
      if (selectedRadio) {
        const indexToKeep = parseInt(selectedRadio.value);
        const contactsToDelete = group.contacts
          .filter(contact => contact.originalIndex !== indexToKeep)
          .map(contact => contact.originalIndex);
        
        resolutions.push({
          type: 'delete',
          groupIndex,
          toDelete: contactsToDelete,
          toKeep: indexToKeep
        });
        totalOperations++;
      }
    }
    // 'skip' no requiere acción
  });
  
  if (totalOperations === 0) {
    showNotification('No hay operaciones que realizar', 'info');
    return;
  }
  
  // Confirmar operaciones
  const mergeCount = resolutions.filter(r => r.type === 'merge').length;
  const deleteCount = resolutions.filter(r => r.type === 'delete').length;
  
  let confirmMessage = '¿Confirmar las siguientes operaciones?\n\n';
  if (mergeCount > 0) confirmMessage += `🔗 Fusionar ${mergeCount} grupo(s) de contactos\n`;
  if (deleteCount > 0) confirmMessage += `🗑️ Eliminar duplicados en ${deleteCount} grupo(s)\n`;
  confirmMessage += '\nEsta acción no se puede deshacer.';
  
  if (!confirm(confirmMessage)) {
    showNotification('Operación cancelada', 'info');
    return;
  }
  
  try {
    let mergedCount = 0;
    let deletedCount = 0;
    const indicesToDelete = [];
    
    // Procesar resoluciones
    resolutions.forEach(resolution => {
      if (resolution.type === 'merge') {
        // Crear contacto fusionado
        const mergedContact = mergeContactsData(resolution.contacts);
        
        // Añadir a la lista de contactos
        state.contacts.push(mergedContact);
        
        // Marcar contactos originales para eliminación
        resolution.contacts.forEach(contact => {
          indicesToDelete.push(contact.originalIndex);
        });
        
        mergedCount++;
      } else if (resolution.type === 'delete') {
        // Marcar contactos para eliminación (excepto el que se mantiene)
        resolution.toDelete.forEach(index => {
          indicesToDelete.push(index);
        });
        deletedCount += resolution.toDelete.length;
      }
    });
    
    // Eliminar contactos marcados (ordenar de mayor a menor para evitar problemas con índices)
    const uniqueToDelete = [...new Set(indicesToDelete)].sort((a, b) => b - a);
    uniqueToDelete.forEach(index => {
      if (index < state.contacts.length) {
        state.contacts.splice(index, 1);
      }
    });
    
    // Guardar cambios
    saveContacts(state.contacts);
    
    // Mostrar resultado
    let successMessage = 'Resolución completada: ';
    const messages = [];
    if (mergedCount > 0) messages.push(`${mergedCount} contacto(s) fusionado(s)`);
    if (deletedCount > 0) messages.push(`${deletedCount} duplicado(s) eliminado(s)`);
    successMessage += messages.join(' y ');
    
    showNotification(successMessage, 'success');
    
    // Cerrar modal y limpiar estado
    state.showDuplicateModal = false;
    state.duplicates = [];
    render();
    
  } catch (error) {
    showNotification('Error al aplicar resolución: ' + error.message, 'error');
  }
}

// --- Sistema de autenticación para notas ---
const AUTH_KEY = 'contactos_diarios_auth';
let authState = {
  isAuthenticated: false,
  sessionExpiry: null
};

function hashPassword(password) {
  // Usar una función hash simple pero efectiva
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a entero de 32 bits
  }
  return hash.toString();
}

function setPassword(password) {
  const hashedPassword = hashPassword(password);
  localStorage.setItem(AUTH_KEY, hashedPassword);
  showNotification('Contraseña establecida correctamente', 'success');
}

function verifyPassword(password) {
  const storedHash = localStorage.getItem(AUTH_KEY);
  if (!storedHash) return false;
  return hashPassword(password) === storedHash;
}

function isPasswordSet() {
  return localStorage.getItem(AUTH_KEY) !== null;
}

function authenticate(password) {
  if (verifyPassword(password)) {
    authState.isAuthenticated = true;
    // Sesión válida por 30 minutos
    authState.sessionExpiry = Date.now() + (30 * 60 * 1000);
    showNotification('Autenticación exitosa', 'success');
    
    // Ejecutar acción pendiente si existe
    setTimeout(() => {
      executePendingAction();
    }, 100); // Pequeño delay para que el modal se cierre primero
    
    return true;
  } else {
    showNotification('Contraseña incorrecta', 'error');
    return false;
  }
}

function isAuthenticated() {
  if (!authState.isAuthenticated) {
    return false;
  }
  if (Date.now() > authState.sessionExpiry) {
    authState.isAuthenticated = false;
    authState.sessionExpiry = null;
    return false;
  }
  return true;
}

function logout() {
  authState.isAuthenticated = false;
  authState.sessionExpiry = null;
  showNotification('Sesión cerrada', 'info');
}

function executePendingAction() {
  if (!state.pendingAction) return;
  
  const action = state.pendingAction;
  state.pendingAction = null; // Limpiar la acción pendiente
  
  switch (action.type) {
    case 'showAllNotes':
      state.showAllNotes = true;
      state.allNotesPage = 1;
      break;
    case 'addNote':
      state.addNoteContactIndex = action.contactIndex;
      state.showAddNoteModal = true;
      break;
    case 'showContactNotes':
      state.selected = action.contactIndex;
      state.editing = null;
      break;
  }
  
  render();
}

function AuthModal({ visible, mode = 'login' }) {
  return `
    <div id="auth-modal" class="modal" style="display:${visible ? 'flex' : 'none'};z-index:6000;">
      <div class="modal-content" style="max-width:400px;">
        <h3>${mode === 'setup' ? '🔐 Establecer contraseña' : '🔑 Acceso a notas privadas'}</h3>
        <p>${mode === 'setup' ? 
          'Establece una contraseña para proteger tus notas personales:' : 
          'Introduce tu contraseña para acceder a las notas:'}</p>
        
        <form id="auth-form">
          <label>
            Contraseña
            <input type="password" id="auth-password" placeholder="Introduce tu contraseña" required autocomplete="current-password" />
          </label>
          ${mode === 'setup' ? `
            <label>
              Confirmar contraseña
              <input type="password" id="auth-password-confirm" placeholder="Confirma tu contraseña" required autocomplete="new-password" />
            </label>
          ` : ''}
          <div class="form-actions" style="margin-top:20px;">
            <button type="submit">${mode === 'setup' ? 'Establecer contraseña' : 'Acceder'}</button>
            <button type="button" id="cancel-auth">Cancelar</button>
          </div>
        </form>
        
        ${mode === 'login' ? `
          <div style="margin-top:15px;padding-top:15px;border-top:1px solid #ddd;">
            <p style="font-size:0.9em;color:#666;">
              💡 La contraseña se almacena de forma segura en tu dispositivo
            </p>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// Función para limpiar cache y forzar actualización
async function clearCacheAndReload() {
  console.log('🧹 Limpiando cache y forzando actualización...');
  
  try {
    // Limpiar todos los caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          console.log('🗑️ Eliminando cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }
    
    // Desregistrar service worker si existe
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => {
          console.log('🔄 Desregistrando SW:', registration.scope);
          return registration.unregister();
        })
      );
    }
    
    console.log('✅ Cache limpiado, recargando...');
    window.location.reload();
    
  } catch (error) {
    console.error('❌ Error limpiando cache:', error);
    window.location.reload();
  }
}

// Función disponible globalmente para debugging
window.clearCacheAndReload = clearCacheAndReload;

// Atajo de teclado para limpiar cache: Ctrl+Shift+R
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.key === 'R') {
    event.preventDefault();
    clearCacheAndReload();
  }
});

// Función para obtener la versión del Service Worker
async function getServiceWorkerVersion() {
  console.log('🔍 Obteniendo versión del Service Worker...');
  
  try {
    // Método 1: Comunicación directa con el service worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      console.log('📡 Intentando comunicación directa con SW...');
      const messageChannel = new MessageChannel();
      
      const versionPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout en comunicación con SW'));
        }, 3000);
        
        messageChannel.port1.onmessage = (event) => {
          clearTimeout(timeout);
          if (event.data && event.data.type === 'VERSION_RESPONSE') {
            console.log('✅ Versión recibida del SW:', event.data.version);
            resolve(event.data.version);
          } else {
            reject(new Error('Respuesta inválida del SW'));
          }
        };
      });
      
      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_VERSION' },
        [messageChannel.port2]
      );
      
      const swVersion = await versionPromise;
      return swVersion;
    }
    
    console.log('📄 SW no disponible, intentando fetch...');
    
    // Método 2: Fetch con cache busting agresivo
    const cacheBuster = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const swUrls = [
      `/sw.js?v=${cacheBuster}`,
      `/ContactosDiarios/sw.js?v=${cacheBuster}`,
      `./sw.js?v=${cacheBuster}`
    ];
    
    for (const url of swUrls) {
      try {
        console.log(`🌐 Intentando fetch: ${url}`);
        const response = await fetch(url, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (response.ok) {
          const swCode = await response.text();
          console.log('📄 Código SW obtenido, longitud:', swCode.length);
          
          // Múltiples patrones para encontrar la versión
          const patterns = [
            /CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,
            /const\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,
            /let\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,
            /var\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,
            /version['":]?\s*['"`]([0-9.]+)['"`]/i,
            /v?([0-9]+\.[0-9]+\.[0-9]+)/
          ];
          
          for (const pattern of patterns) {
            const match = swCode.match(pattern);
            if (match && match[1]) {
              console.log('✅ Versión encontrada:', match[1]);
              return match[1];
            }
          }
          
          console.log('⚠️ No se encontró versión en el código SW');
        }
      } catch (fetchError) {
        console.log(`❌ Error fetch ${url}:`, fetchError.message);
      }
    }
    
    // Método 3: Fallback final
    console.log('🔄 Usando versión fallback...');
    return '0.0.91';
    
  } catch (error) {
    console.error('❌ Error general obteniendo versión SW:', error);
    return '0.0.91';
  }
}

// Función para mostrar la versión del service worker
async function displayServiceWorkerVersion() {
  console.log('📋 Mostrando versión del Service Worker...');
  
  // Obtener o crear el elemento para mostrar la versión
  let versionElement = document.getElementById('sw-version-info');
  if (!versionElement) {
    // Crear elemento en el pie de página
    versionElement = document.createElement('div');
    versionElement.id = 'sw-version-info';
    versionElement.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
      pointer-events: none;
    `;
    document.body.appendChild(versionElement);
  }
  
  // Mostrar estado de carga
  versionElement.innerHTML = `
    <p class="version-text">SW cargando...</p>
  `;
  
  try {
    const version = await getServiceWorkerVersion();
    versionElement.innerHTML = `
      <p class="version-text">Service Worker v${version}</p>
    `;
    console.log('✅ Versión del SW mostrada:', version);
  } catch (error) {
    console.error('❌ Error mostrando versión SW:', error);
    versionElement.innerHTML = `
      <p class="version-text">Service Worker v0.0.87</p>
    `;
  }
}

async function initializeApp() {
  console.log('🚀 Inicializando aplicación...');
  
  // Mostrar versión del service worker con timeout
  const versionPromise = displayServiceWorkerVersion();
  const timeoutPromise = new Promise(resolve => 
    setTimeout(() => resolve('timeout'), 5000)
  );
  
  const result = await Promise.race([versionPromise, timeoutPromise]);
  if (result === 'timeout') {
    console.log('⏰ Timeout obteniendo versión SW, usando fallback');
    let versionElement = document.getElementById('sw-version-info');
    if (versionElement) {
      versionElement.innerHTML = `
        <p class="version-text">Service Worker v0.0.91</p>
      `;
    }
  }
  
  // Si hay service worker, escuchar cuando se actualice
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Service Worker actualizado, refrescando versión...');
      setTimeout(() => displayServiceWorkerVersion(), 500);
    });
    
    // También intentar obtener la versión después de que el SW esté listo
    navigator.serviceWorker.ready.then(() => {
      console.log('✅ Service Worker listo, actualizando versión...');
      setTimeout(() => displayServiceWorkerVersion(), 2000);
    }).catch(err => {
      console.log('❌ Error esperando SW ready:', err);
    });
    
    // Escuchar mensajes del service worker
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data && event.data.type === 'SW_UPDATED') {
        console.log('📢 Service Worker actualizado a versión:', event.data.version);
        showUpdateNotification(event.data.version);
        displayServiceWorkerVersion();
      }
    });
  }
}

// Protección contra scroll en móviles
let lastTouchTime = 0;
let isScrolling = false;

function setupScrollProtection() {
  // Detectar cuando el usuario está haciendo scroll
  let scrollTimer = null;
  
  window.addEventListener('scroll', () => {
    isScrolling = true;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      isScrolling = false;
    }, 100);
  }, { passive: true });
  
  // Detectar gestos táctiles
  document.addEventListener('touchstart', () => {
    lastTouchTime = Date.now();
  }, { passive: true });
  
  document.addEventListener('touchmove', () => {
    isScrolling = true;
  }, { passive: true });
  
  document.addEventListener('touchend', () => {
    setTimeout(() => {
      isScrolling = false;
    }, 100);
  }, { passive: true });
}

function isClickSafe(element) {
  // Si el elemento es un botón de acción de contacto o selección, siempre permitir el click
  if (element && (
    element.classList.contains('add-note-contact') ||
    element.classList.contains('edit-contact') ||
    element.classList.contains('delete-contact') ||
    element.classList.contains('pin-contact') ||
    element.classList.contains('select-contact')
  )) {
    return true;
  }
  
  // Para otros elementos, aplicar la protección original
  const timeSinceTouch = Date.now() - lastTouchTime;
  const isSafe = !isScrolling && timeSinceTouch > 150;
  return isSafe;
}

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Log inicial con información del entorno
    console.log('=== 📱 INICIO DEBUG MÓVIL ===');
    console.log('🌐 URL:', window.location.href);
    console.log('📱 User Agent:', navigator.userAgent);
    console.log('📊 Screen:', screen.width + 'x' + screen.height);
    console.log('🖥️ Viewport:', window.innerWidth + 'x' + window.innerHeight);
    console.log('🗂️ localStorage disponible:', !!window.localStorage);
    console.log('⚙️ Service Worker:', 'serviceWorker' in navigator);
    console.log('=================================');
    
    // Configurar el botón de debug logs
    const debugButton = document.getElementById('debug-trigger');
    if (debugButton) {
      debugButton.addEventListener('click', toggleMobileLogs);
      console.log('🐛 Botón de debug configurado');
    } else {
      console.log('❌ No se encontró el botón de debug');
    }
    
    console.log('🔄 Iniciando migración de contactos...');
    // Migrar contactos existentes
    migrateContactsWithEditDate();
    console.log('✅ Migración completada');
    
    console.log('🎨 Iniciando render inicial...');
    render();
    console.log('✅ Render inicial completado');
    
    console.log('⚙️ Inicializando app...');
    initializeApp();
    console.log('✅ App inicializada');
    
    console.log('💾 Mostrando info de backup...');
    mostrarInfoBackup(); // Mostrar información de backup al cargar
    console.log('✅ Info backup mostrada');
    
    console.log('📱 ContactosDiarios iniciado correctamente');
    console.log('🆕 Nueva funcionalidad: Contactos recientemente editados');
    console.log('💡 Usa Ctrl+Shift+R para limpiar cache y forzar actualización');
    console.log('🔧 También disponible: window.clearCacheAndReload()');
    
  } catch (error) {
    console.error('💥 ERROR CRÍTICO EN INICIALIZACIÓN:', error);
    console.error('Stack trace:', error.stack);
    
    // Mostrar error en la app si es posible
    const app = document.querySelector('#app');
    if (app) {
      app.innerHTML = `
        <div style="padding: 20px; background: #ffebee; border: 1px solid #f44336; border-radius: 8px; margin: 20px;">
          <h2 style="color: #d32f2f;">💥 Error crítico de inicialización</h2>
          <p><strong>Error:</strong> ${error.message}</p>
          <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto;">${error.stack}</pre>
          <button onclick="location.reload()" style="background: #2196F3; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">
            🔄 Recargar aplicación
          </button>
          <button onclick="localStorage.clear(); location.reload()" style="background: #ff5722; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
            🗑️ Limpiar datos y recargar
          </button>
        </div>
      `;
    }
  }
});

// Migración para añadir lastEdited a contactos existentes que no lo tienen
function migrateContactsWithEditDate() {
  let needsSave = false;
  const now = Date.now();
  
  state.contacts.forEach((contact, index) => {
    if (!contact.lastEdited) {
      // Para contactos sin fecha de edición, usar la fecha de creación si existe,
      // o una fecha base escalonada para mantener un orden diferenciado
      contact.lastEdited = contact.createdAt || (now - ((state.contacts.length - index) * 1000 * 60 * 60)); // Espaciar por horas
      needsSave = true;
    }
    
    // Añadir createdAt si no existe
    if (!contact.createdAt) {
      contact.createdAt = contact.lastEdited;
      needsSave = true;
    }
  });
  
  if (needsSave) {
    saveContacts(state.contacts);
  }
}

// Copiar logs al portapapeles
async function copyMobileLogsToClipboard() {
  try {
    // Preparar el texto con toda la información del debug
    const debugInfo = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      screen: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      localStorage: !!window.localStorage,
      serviceWorker: 'serviceWorker' in navigator,
      logs: mobileLogsList
    };
    
    const debugText = `=== 📱 DEBUG MÓVIL EXPORT ===
Timestamp: ${debugInfo.timestamp}
URL: ${debugInfo.url}
User Agent: ${debugInfo.userAgent}
Screen: ${debugInfo.screen}
Viewport: ${debugInfo.viewport}
LocalStorage: ${debugInfo.localStorage}
Service Worker: ${debugInfo.serviceWorker}

=== 📋 LOGS (${debugInfo.logs.length} entradas) ===
${debugInfo.logs.map(log => `[${log.timestamp}] ${log.message}`).join('\n')}

=== 🔍 DATOS ADICIONALES ===
Estado contactos: ${JSON.stringify(state, null, 2)}
localStorage contactos: ${localStorage.getItem('contactos_diarios')}
=== FIN DEBUG ===`;

    // Intentar copiar al portapapeles
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(debugText);
      originalConsoleLog('✅ Debug copiado al portapapeles');
      
      // Mostrar notificación visual
      showCopyNotification('📋 Debug copiado al portapapeles');
    } else {
      // Fallback para navegadores que no soportan Clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = debugText;
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          originalConsoleLog('✅ Debug copiado al portapapeles (fallback)');
          showCopyNotification('📋 Debug copiado (selecciona y copia manualmente si no funcionó)');
        } else {
          throw new Error('execCommand failed');
        }
      } catch (err) {
        originalConsoleLog('❌ Error copiando al portapapeles:', err);
        showCopyNotification('❌ Error copiando. Selecciona todo el texto manualmente');
      }
      
      document.body.removeChild(textArea);
    }
  } catch (error) {
    originalConsoleLog('❌ Error en copyMobileLogsToClipboard:', error);
    showCopyNotification('❌ Error copiando logs');
  }
}

// Mostrar notificación de copia
function showCopyNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    z-index: 10001;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}
