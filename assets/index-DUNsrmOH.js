(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const p of i.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&s(p)}).observe(document,{childList:!0,subtree:!0});function n(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=n(a);fetch(a.href,i)}})();const q="0.1.09";let R=!1,M=[];const X=50,A=console.log;function ie(e,t="info"){const n=new Date().toLocaleTimeString(),s={timestamp:n,message:typeof e=="object"?JSON.stringify(e,null,2):e,type:t};M.unshift(s),M.length>X&&(M=M.slice(0,X)),R&&H(),A(`[${n}] ${e}`)}console.log=function(...e){ie(e.join(" "),"info"),A.apply(console,e)};function G(){A("🐛 Toggling mobile logs, current state:",R),R=!R;let e=document.getElementById("mobile-logs-panel");R?(A("📱 Mostrando panel de logs móvil"),e||(e=document.createElement("div"),e.id="mobile-logs-panel",e.innerHTML=`
        <div class="mobile-logs-header">
          <span>📱 Debug Logs</span>
          <button id="copy-logs-btn">📋</button>
          <button id="clear-logs-btn">🗑️</button>
          <button id="close-logs-btn">❌</button>
        </div>
        <div id="mobile-logs-content"></div>
      `,document.body.appendChild(e),document.getElementById("copy-logs-btn").addEventListener("click",_e),document.getElementById("clear-logs-btn").addEventListener("click",Z),document.getElementById("close-logs-btn").addEventListener("click",G),A("📱 Panel de logs creado")),e.style.display="block",H()):(A("📱 Ocultando panel de logs móvil"),e&&(e.style.display="none"))}function H(){const e=document.getElementById("mobile-logs-content");e&&(e.innerHTML=M.map(t=>`
    <div class="mobile-log-entry mobile-log-${t.type}">
      <span class="mobile-log-time">${t.timestamp}</span>
      <pre class="mobile-log-message">${t.message}</pre>
    </div>
  `).join(""))}function Z(){A("🗑️ Limpiando logs móviles"),M=[],H()}window.toggleMobileLogs=G;window.clearMobileLogs=Z;(function(){try{const t="contactos_diarios_app_version",n=localStorage.getItem(t);if(n&&n!==q){console.log(`🔧 Actualizando ContactosDiarios de v${n} a v${q}`);const s=localStorage.getItem("contactos_diarios"),a=localStorage.getItem("contactos_diarios_backups"),i=localStorage.getItem("contactos_diarios_backup_fecha"),p=localStorage.getItem("contactos_diarios_webdav_config"),g=[t,"contactos_diarios_backups","contactos_diarios_backup_fecha","contactos_diarios_webdav_config"];console.log("🧹 Limpiando SOLO claves de ContactosDiarios:",g),g.forEach(c=>{localStorage.removeItem(c)}),"caches"in window&&caches.keys().then(c=>{c.forEach(r=>{(r.includes("contactosdiarios")||r.includes("contactos-diarios"))&&(console.log("🗑️ Eliminando caché de ContactosDiarios:",r),caches.delete(r))})}),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(c=>{c.forEach(r=>{r.scope.includes("/ContactosDiarios/")||r.active?.scriptURL.includes("ContactosDiarios")||r.active?.scriptURL.includes("contactosdiarios")?(console.log("🔧 Desregistrando service worker de ContactosDiarios:",r.scope),r.unregister()):console.log("✅ Preservando service worker de otra aplicación:",r.scope)})}),s&&localStorage.setItem("contactos_diarios",s),a&&localStorage.setItem("contactos_diarios_backups",a),i&&localStorage.setItem("contactos_diarios_backup_fecha",i),p&&localStorage.setItem("contactos_diarios_webdav_config",p),console.log("✅ Datos de ContactosDiarios restaurados, recargando..."),location.reload()}localStorage.setItem(t,q)}catch(t){console.error("❌ Error en limpieza de ContactosDiarios:",t)}})();function ce({contacts:e,filter:t,onSelect:n,onDelete:s}){let a=t?e.filter(c=>{const r=t.toLowerCase(),f=c.notes?Object.values(c.notes).join(" ").toLowerCase():"";return c.tags?.some(b=>b.toLowerCase().includes(r))||c.name?.toLowerCase().includes(r)||c.surname?.toLowerCase().includes(r)||f.includes(r)}):e;console.log("🔄 INICIANDO ORDENACIÓN - Estado inicial:",a.length,"contactos"),a.forEach((c,r)=>{(!c.lastEdited||isNaN(Number(c.lastEdited)))&&(console.log(`⚠️ Contacto sin fecha válida: ${c.name} - lastEdited: ${c.lastEdited}`),a[r].lastEdited=0)});for(let c=0;c<2;c++)console.log(`🔄 Pasada de ordenación #${c+1}`),a=a.slice().sort((r,f)=>{const b=/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),E=window.location.hostname==="sasogu.github.io";if(r.pinned!==f.pinned){const D=r.pinned?-1:1;return(b||E)&&console.log(`📌 Fijado: ${r.pinned?r.name:f.name} va arriba (resultado: ${D})`),D}const k=Number(r.lastEdited)||0,I=Number(f.lastEdited)||0,w=I-k;return(b||E)&&c===0&&console.log(`📅 ${r.name}(${k}) vs ${f.name}(${I}) = ${w} (${w>0?f.name:w<0?r.name:"igual"} primero)`),w});console.log("✅ ORDENACIÓN COMPLETADA"),console.log("🔍 VALIDANDO ORDEN FINAL...");const i=a.filter(c=>c.pinned),p=a.filter(c=>!c.pinned);console.log(`📌 Contactos fijados: ${i.length}`),console.log(`📄 Contactos no fijados: ${p.length}`);let g=!0;for(let c=0;c<p.length-1;c++){const r=p[c],f=p[c+1],b=Number(r.lastEdited)||0,E=Number(f.lastEdited)||0;b<E?(console.log(`❌ ERROR: ${r.name} (${b}) debería ir DESPUÉS de ${f.name} (${E})`),g=!1):console.log(`✅ OK: ${r.name} (${b}) antes que ${f.name} (${E})`)}if(g||(console.log("🔧 FORZANDO CORRECCIÓN DEL ORDEN..."),p.sort((c,r)=>{const f=Number(c.lastEdited)||0;return(Number(r.lastEdited)||0)-f}),a=[...i,...p],console.log("✅ ORDEN CORREGIDO")),(window.location.hostname==="sasogu.github.io"||/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))&&console.log("📱 ORDEN FINAL:",a.slice(0,8).map((c,r)=>`${r+1}. ${c.pinned?"📌":"📄"} ${c.name} (${c.lastEdited?new Date(c.lastEdited).toLocaleString():"Sin fecha"})`)),window.location.hostname==="sasogu.github.io"||/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){console.log("📱 DEBUG MÓVIL - Orden contactos:",a.slice(0,5).map(r=>`${r.pinned?"📌":"📄"} ${r.name} (${r.lastEdited?new Date(r.lastEdited).toLocaleString():"Sin fecha"})`));const c=a.filter(r=>!r.pinned);console.log("📄 DEBUG - Contactos NO fijados ordenados:",c.slice(0,5).map(r=>`${r.name} (${r.lastEdited?new Date(r.lastEdited).toLocaleString():"Sin fecha"}) [${r.lastEdited}]`));for(let r=0;r<c.length-1;r++){const f=c[r],b=c[r+1],E=Number(f.lastEdited)||0,k=Number(b.lastEdited)||0;E<k?console.log(`❌ ERROR ORDEN: ${f.name} (${E}) debería ir DESPUÉS de ${b.name} (${k})`):console.log(`✅ ORDEN OK: ${f.name} (${E}) está antes que ${b.name} (${k})`)}}return`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${t||""}" />
      <ul>
        ${a.length===0?'<li class="empty">Sin contactos</li>':a.map((c,r)=>{const f=Date.now(),b=24*60*60*1e3,E=c.lastEdited&&f-c.lastEdited<b,k=E&&!c.pinned?" recently-edited":"";let I="";if(c.lastEdited){const w=f-c.lastEdited,D=Math.floor(w/(60*60*1e3)),O=Math.floor(w%(60*60*1e3)/(60*1e3));D<1?I=O<1?"Ahora":`${O}m`:D<24?I=`${D}h`:I=`${Math.floor(D/24)}d`}return`
          <li${c.pinned?' class="pinned"':k}>
            <div class="contact-main">
              <button class="select-contact" data-index="${e.indexOf(c)}">
                ${E&&!c.pinned?"🆕 ":""}${c.surname?c.surname+", ":""}${c.name}
                ${I&&E?`<span class="time-ago">(${I})</span>`:""}
              </button>
              <span class="tags">${(c.tags||[]).map(w=>`<span class='tag'>${w}</span>`).join(" ")}</span>
              <button class="pin-contact" data-index="${e.indexOf(c)}" title="${c.pinned?"Desfijar":"Fijar"}">${c.pinned?"📌":"📍"}</button>
            </div>
            <div class="contact-info">
              ${c.phone?`<a href="tel:${c.phone}" class="contact-link" title="Llamar"><span>📞</span> ${c.phone}</a>`:""}
              ${c.email?`<a href="mailto:${c.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${c.email}</a>`:""}
            </div>
            <div class="contact-actions">
              <button class="add-note-contact" data-index="${e.indexOf(c)}" title="Añadir nota">📝</button>
              <button class="edit-contact" data-index="${e.indexOf(c)}" title="Editar">✏️</button>
              <button class="delete-contact" data-index="${e.indexOf(c)}" title="Eliminar">🗑️</button>
            </div>
          </li>
          `}).join("")}
      </ul>
    </div>
  `}function re({contact:e}){return`
    <form id="contact-form">
      <h2>${e?"Editar":"Nuevo"} contacto</h2>
      <label>Nombre <input name="name" placeholder="Nombre" value="${e?.name||""}" required /></label>
      <label>Apellidos <input name="surname" placeholder="Apellidos" value="${e?.surname||""}" required /></label>
      <label>Teléfono <input name="phone" placeholder="Teléfono" value="${e?.phone||""}" pattern="[0-9+-() ]*" /></label>
      <label>Email <input name="email" placeholder="Email" value="${e?.email||""}" type="email" /></label>
      <label>Etiquetas <input name="tags" placeholder="Ej: familia, trabajo" value="${e?.tags?.join(", ")||""}" /></label>
      <div class="form-actions">
        <button type="submit">Guardar</button>
        <button type="button" id="cancel-edit">Cancelar</button>
      </div>
    </form>
  `}function le({notes:e}){if(!W())return`
      <div class="notes-area">
        <h3>🔒 Notas privadas protegidas</h3>
        <div style="text-align:center;padding:20px;background:#f8f9fa;border-radius:8px;margin:20px 0;">
          <p style="margin-bottom:15px;color:#666;">
            Las notas están protegidas con contraseña para mantener tu privacidad.
          </p>
          <button id="unlock-notes-btn" style="background:#3a4a7c;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;">
            🔓 Desbloquear notas
          </button>
          ${W()?`
            <button id="logout-btn" style="background:#dc3545;color:white;padding:8px 15px;border:none;border-radius:5px;cursor:pointer;margin-left:10px;">
              🚪 Cerrar sesión
            </button>
          `:""}
        </div>
      </div>
    `;const t=new Date;return`
    <div class="notes-area">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
        <h3>Notas diarias</h3>
        <button id="logout-btn" style="background:#dc3545;color:white;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;font-size:0.8em;">
          🚪 Cerrar sesión
        </button>
      </div>
      <form id="note-form">
        <input type="date" id="note-date" value="${new Date(t.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10)}" required />
        <textarea id="note-text" rows="3" placeholder="Escribe una nota para la fecha seleccionada..."></textarea>
        <button type="submit">Guardar nota</button>
      </form>
      <ul class="note-history">
        ${Object.entries(e||{}).sort((a,i)=>i[0].localeCompare(a[0])).map(([a,i])=>`
          <li>
            <b>${a}</b>:
            <span class="note-content" data-date="${a}">${i}</span>
            <button class="edit-note" data-date="${a}" title="Editar">✏️</button>
            <button class="delete-note" data-date="${a}" title="Eliminar">🗑️</button>
          </li>
        `).join("")}
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
  `}function de({}){return`
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
  `}function ue({contacts:e,visible:t,page:n=1}){let s=[];e.forEach((r,f)=>{r.notes&&Object.entries(r.notes).forEach(([b,E])=>{s.push({date:b,text:E,contact:r,contactIndex:f})})}),s.sort((r,f)=>f.date.localeCompare(r.date));const a=4,i=Math.max(1,Math.ceil(s.length/a)),p=Math.min(Math.max(n,1),i),g=(p-1)*a,c=s.slice(g,g+a);return`
    <div id="all-notes-modal" class="modal" style="display:${t?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${s.length===0?"<li>No hay notas registradas.</li>":c.map(r=>`
            <li>
              <b>${r.date}</b> — <span style="color:#3a4a7c">${r.contact.surname?r.contact.surname+", ":""}${r.contact.name}</span><br/>
              <span>${r.text}</span>
              <a href="#" class="edit-note-link" data-contact="${r.contactIndex}" data-date="${r.date}" style="margin-left:0.5em;color:#646cff;font-size:0.95em;">Editar nota</a>
            </li>
          `).join("")}
        </ul>
        <div class="pagination" style="display:flex;justify-content:center;align-items:center;gap:1em;margin:1em 0;">
          <button id="prev-notes-page" ${p===1?"disabled":""}>&lt; Anterior</button>
          <span>Página ${p} de ${i}</span>
          <button id="next-notes-page" ${p===i?"disabled":""}>Siguiente &gt;</button>
        </div>
        <div class="form-actions">
          <button id="close-all-notes">Cerrar</button>
        </div>
      </div>
    </div>
  `}function pe({visible:e,backups:t}){return`
    <div id="backup-modal" class="modal" style="display:${e?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:400px;">
        <h3>Restaurar copia local</h3>
        <div class="backup-btns" style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;">
          ${t.length===0?"<span>Sin copias locales.</span>":t.map(n=>`
            <div class="backup-btn-group" style="display:flex;align-items:center;gap:0.3rem;">
              <button class="restore-backup-btn" data-fecha="${n.fecha}">${n.fecha}</button>
              <button class="share-backup-btn" data-fecha="${n.fecha}" title="Compartir backup" style="background:#06b6d4;padding:0.4rem 0.7rem;font-size:1.1em;">📤</button>
            </div>
          `).join("")}
        </div>
        <div class="form-actions" style="margin-top:1.2rem;"><button id="close-backup-modal">Cerrar</button></div>
      </div>
    </div>
  `}function me({visible:e,contactIndex:t}){const n=t!==null?o.contacts[t]:null,s=new Date,i=new Date(s.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);return`
    <div id="add-note-modal" class="modal" style="display:${e?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:500px;">
        <h3>Añadir nota diaria</h3>
        ${n?`<p><strong>${n.surname?n.surname+", ":""}${n.name}</strong></p>`:""}
        <form id="add-note-form">
          <label>Fecha <input type="date" id="add-note-date" value="${i}" required /></label>
          <label>Nota <textarea id="add-note-text" rows="4" placeholder="Escribe una nota para este contacto..." required></textarea></label>
          <div class="form-actions">
            <button type="submit">Guardar nota</button>
            <button type="button" id="cancel-add-note">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `}function y(e,t="info"){let n=document.getElementById("notification-container");n||(n=document.createElement("div"),n.id="notification-container",n.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
      pointer-events: none;
    `,document.body.appendChild(n));const s=document.createElement("div");s.style.cssText=`
    background: ${t==="success"?"#d4edda":t==="error"?"#f8d7da":t==="warning"?"#fff3cd":"#d1ecf1"};
    color: ${t==="success"?"#155724":t==="error"?"#721c24":t==="warning"?"#856404":"#0c5460"};
    border: 1px solid ${t==="success"?"#c3e6cb":t==="error"?"#f5c6cb":t==="warning"?"#ffeaa7":"#bee5eb"};
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
  `;const a=t==="success"?"✅":t==="error"?"❌":t==="warning"?"⚠️":"ℹ️";s.innerHTML=`${a} ${e}`,n.appendChild(s),setTimeout(()=>{s.style.opacity="1",s.style.transform="translateX(0)"},10);const i=()=>{s.style.opacity="0",s.style.transform="translateX(100%)",setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},300)};s.onclick=i,setTimeout(i,4e3)}function ge(e){console.log("📢 Mostrando notificación de actualización para versión:",e);const t=document.createElement("div");t.id="update-notification",t.innerHTML=`
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
        Versión ${e} lista para usar
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
  `;const n=document.getElementById("update-notification");n&&n.remove(),document.body.appendChild(t),setTimeout(()=>{document.getElementById("update-notification")&&fe()},1e4)}function fe(){const e=document.getElementById("update-notification");e&&(e.style.transform="translateX(100%)",e.style.transition="transform 0.3s ease",setTimeout(()=>e.remove(),300))}function z(e){const t=[];return!e.name||e.name.trim().length===0?t.push("El nombre es obligatorio"):e.name.trim().length<2?t.push("El nombre debe tener al menos 2 caracteres"):e.name.trim().length>50&&t.push("El nombre no puede tener más de 50 caracteres"),e.surname&&e.surname.trim().length>50&&t.push("Los apellidos no pueden tener más de 50 caracteres"),e.phone&&e.phone.trim().length>0&&(/^[\d\s\-\+\(\)\.]{6,20}$/.test(e.phone.trim())||t.push("El teléfono debe contener solo números, espacios y caracteres válidos (6-20 caracteres)")),e.email&&e.email.trim().length>0&&(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email.trim())?e.email.trim().length>100&&t.push("El email no puede tener más de 100 caracteres"):t.push("El email debe tener un formato válido")),t}function F(e){const t=[];return!e||e.trim().length===0?(t.push("La nota no puede estar vacía"),t):(e.trim().length>1e3&&t.push("La nota no puede tener más de 1000 caracteres"),e.trim().length<3&&t.push("La nota debe tener al menos 3 caracteres"),/^[\w\s\.\,\;\:\!\?\-\(\)\[\]\"\'\/\@\#\$\%\&\*\+\=\<\>\{\}\|\~\`\ñÑáéíóúÁÉÍÓÚüÜ]*$/.test(e)||t.push("La nota contiene caracteres no permitidos"),t)}const V="contactos_diarios";let o={contacts:he(),selected:null,notes:"",editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1,showAddNoteModal:!1,addNoteContactIndex:null,allNotesPage:1,duplicates:[],showDuplicateModal:!1,showAuthModal:!1,authMode:"login",pendingAction:null};function he(){try{return JSON.parse(localStorage.getItem(V))||[]}catch{return[]}}function C(e){if(!e||!Array.isArray(e)){console.error("❌ ERROR: Intentando guardar contactos inválidos:",e);return}if(e.length===0){const t=localStorage.getItem(V);if(t&&t!=="[]"){console.error("❌ ERROR: Intentando sobrescribir contactos existentes con array vacío. Operación cancelada."),console.log("📊 Contactos existentes:",t);return}console.log("ℹ️ Guardando array vacío (primera vez o limpieza intencional)")}console.log(`💾 Guardando ${e.length} contactos en localStorage`),localStorage.setItem(V,JSON.stringify(e))}function h(){console.log("🎨 Iniciando render...");try{const e=document.querySelector("#app");if(!e){console.error("❌ ERROR: No se encontró el elemento #app");return}console.log("✅ Elemento #app encontrado:",e);const t=o.editing!==null?o.contacts[o.editing]:null,n=o.selected!==null?o.contacts[o.selected].notes||{}:{};console.log("📊 Estado actual:",{editing:o.editing,selected:o.selected,contactsCount:o.contacts.length}),e.innerHTML=`
    <h1>Diario de Contactos</h1>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <div class="main-grid">
      <div>
        
        ${ce({contacts:o.contacts,filter:o.tagFilter})}
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
        ${o.editing!==null?re({contact:t}):""}
        ${o.selected!==null&&o.editing===null?le({notes:n}):""}
      </div>
    </div>
    ${ue({contacts:o.contacts,visible:o.showAllNotes,page:o.allNotesPage})}
    ${pe({visible:o.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})} <!-- Modal de backup -->
    ${me({visible:o.showAddNoteModal,contactIndex:o.addNoteContactIndex})} <!-- Modal añadir nota -->
    ${Ce({duplicates:o.duplicates,visible:o.showDuplicateModal})} <!-- Modal de gestión de duplicados -->
    ${Oe({visible:o.showAuthModal,mode:o.authMode})} <!-- Modal de autenticación -->
    ${de({})}
  `,be(),Pe();const s=document.getElementById("show-backup-modal");s&&(s.onclick=()=>{o.showBackupModal=!0,h()});const a=document.getElementById("close-backup-modal");a&&(a.onclick=()=>{o.showBackupModal=!1,h()}),document.querySelectorAll(".add-note-contact").forEach(g=>{g.onclick=c=>{const r=Number(g.dataset.index);if(!W()){o.pendingAction={type:"addNote",contactIndex:r},U()?o.authMode="login":o.authMode="setup",o.showAuthModal=!0,h();return}o.addNoteContactIndex=r,o.showAddNoteModal=!0,h()}});const i=document.getElementById("cancel-add-note");i&&(i.onclick=()=>{o.showAddNoteModal=!1,o.addNoteContactIndex=null,h()}),document.querySelectorAll(".restore-backup-btn").forEach(g=>{g.onclick=()=>Se(g.dataset.fecha)});const p=document.getElementById("restore-local-backup");p&&(p.onclick=restaurarBackupLocal),console.log("✅ Render completado exitosamente")}catch(e){console.error("❌ ERROR en render:",e),console.error("Stack trace:",e.stack);const t=document.querySelector("#app");t&&(t.innerHTML=`
        <div style="padding: 20px; background: #ffebee; border: 1px solid #f44336; border-radius: 8px; margin: 20px;">
          <h2 style="color: #d32f2f;">❌ Error de la aplicación</h2>
          <p><strong>Error:</strong> ${e.message}</p>
          <p><strong>Línea:</strong> ${e.stack}</p>
          <button onclick="location.reload()" style="background: #2196F3; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
            🔄 Recargar aplicación
          </button>
        </div>
      `)}}let Y=null;function be(){const e=document.getElementById("tag-filter");e&&e.addEventListener("input",d=>{clearTimeout(Y),Y=setTimeout(()=>{o.tagFilter=e.value,h();const l=document.getElementById("tag-filter");l&&(l.value=o.tagFilter,l.focus(),l.setSelectionRange(o.tagFilter.length,o.tagFilter.length))},300)});const t=document.getElementById("add-contact");t&&(t.onclick=()=>{o.editing=null,o.selected=null,h(),o.editing=o.contacts.length,h()}),document.querySelectorAll(".select-contact").forEach(d=>{d.onclick=l=>{l.preventDefault(),l.stopPropagation(),j(d)&&(o.selected=Number(d.dataset.index),o.editing=null,h())}}),document.querySelectorAll(".edit-contact").forEach(d=>{d.onclick=l=>{l.preventDefault(),l.stopPropagation(),j(d)&&(o.editing=Number(d.dataset.index),o.selected=null,h())}}),document.querySelectorAll(".delete-contact").forEach(d=>{d.onclick=l=>{if(l.preventDefault(),l.stopPropagation(),!j(d))return;const u=Number(d.dataset.index),m=o.contacts[u],v=m.surname?`${m.surname}, ${m.name}`:m.name;confirm(`¿Estás seguro de eliminar el contacto "${v}"?

Esta acción no se puede deshacer.`)&&(o.contacts.splice(u,1),C(o.contacts),y("Contacto eliminado correctamente","success"),o.selected=null,h())}}),document.querySelectorAll(".pin-contact").forEach(d=>{d.onclick=l=>{if(l.preventDefault(),l.stopPropagation(),!j(d))return;const u=Number(d.dataset.index);o.contacts[u].pinned&&!confirm("¿Seguro que quieres desfijar este contacto?")||(o.contacts[u].pinned=!o.contacts[u].pinned,C(o.contacts),h())}});const n=document.getElementById("contact-form");n&&(n.onsubmit=d=>{d.preventDefault();const l=Object.fromEntries(new FormData(n)),u=z(l);if(u.length>0){y("Error de validación: "+u.join(", "),"error");return}let m=l.tags?l.tags.split(",").map(N=>N.trim()).filter(Boolean):[];delete l.tags;const v={...l};o.contacts.some((N,S)=>o.editing!==null&&S===o.editing?!1:ee(N,v))&&!confirm("Ya existe un contacto similar. ¿Deseas guardarlo de todas formas?")||(o.editing!==null&&o.editing<o.contacts.length?(o.contacts[o.editing]={...o.contacts[o.editing],...l,tags:m,lastEdited:Date.now()},(window.location.hostname==="sasogu.github.io"||/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))&&console.log("📱 CONTACTO EDITADO:",o.contacts[o.editing].name,"Nueva fecha:",new Date().toLocaleString()),y("Contacto actualizado correctamente","success")):(o.contacts.push({...l,notes:{},tags:m,lastEdited:Date.now(),createdAt:Date.now()}),y("Contacto añadido correctamente","success")),C(o.contacts),o.editing=null,h())},document.getElementById("cancel-edit").onclick=()=>{o.editing=null,h()});const s=document.getElementById("add-note-form");if(s&&o.addNoteContactIndex!==null){const d=l=>{l.preventDefault();const u=document.getElementById("add-note-date").value,m=document.getElementById("add-note-text").value.trim();if(!u||!m){y("Por favor, selecciona una fecha y escribe una nota","warning");return}const v=F(m);if(v.length>0){y("Error en la nota: "+v.join(", "),"error");return}const x=o.addNoteContactIndex;o.contacts[x].notes||(o.contacts[x].notes={}),o.contacts[x].notes[u]?o.contacts[x].notes[u]+=`
`+m:o.contacts[x].notes[u]=m,o.contacts[x].lastEdited=Date.now(),(window.location.hostname==="sasogu.github.io"||/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))&&console.log(`📝 MÓVIL - Nota añadida a ${o.contacts[x].name}, lastEdited: ${o.contacts[x].lastEdited}`),C(o.contacts),y("Nota añadida correctamente","success"),o.showAddNoteModal=!1,o.addNoteContactIndex=null,h()};s.onsubmit=d}const a=document.getElementById("note-form");if(a&&o.selected!==null){const d=l=>{l.preventDefault();const u=document.getElementById("note-date").value,m=document.getElementById("note-text").value.trim();if(!u||!m){y("Por favor, selecciona una fecha y escribe una nota","warning");return}const v=F(m);if(v.length>0){y("Error en la nota: "+v.join(", "),"error");return}o.contacts[o.selected].notes||(o.contacts[o.selected].notes={}),o.contacts[o.selected].notes[u]?o.contacts[o.selected].notes[u]+=`
`+m:o.contacts[o.selected].notes[u]=m,o.contacts[o.selected].lastEdited=Date.now(),C(o.contacts),y("Nota guardada correctamente","success"),document.getElementById("note-text").value="",h()};a.onsubmit=d}document.querySelectorAll(".edit-note").forEach(d=>{d.onclick=l=>{const u=d.dataset.date,m=document.getElementById("edit-note-modal"),v=document.getElementById("edit-note-text");v.value=o.contacts[o.selected].notes[u],m.style.display="block",document.getElementById("save-edit-note").onclick=()=>{const x=v.value.trim(),N=F(x);if(N.length>0){y("Error en la nota: "+N.join(", "),"error");return}o.contacts[o.selected].notes[u]=x,o.contacts[o.selected].lastEdited=Date.now(),C(o.contacts),y("Nota actualizada correctamente","success"),m.style.display="none",h()},document.getElementById("cancel-edit-note").onclick=()=>{m.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(d=>{d.onclick=l=>{const u=d.dataset.date;confirm(`¿Estás seguro de eliminar la nota del ${u}?

Esta acción no se puede deshacer.`)&&(delete o.contacts[o.selected].notes[u],C(o.contacts),y("Nota eliminada correctamente","success"),h())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{xe(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{we(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{$e(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async d=>{const l=d.target.files[0];if(!l)return;const u=await l.text();let m=[];if(l.name.endsWith(".vcf"))m=ve(u);else if(l.name.endsWith(".csv"))m=Ee(u);else if(l.name.endsWith(".json"))try{const v=JSON.parse(u);Array.isArray(v)?m=v:v&&Array.isArray(v.contacts)&&(m=v.contacts)}catch{}if(m.length){const v=[],x=[];if(m.forEach(($,B)=>{const K=z($);K.length===0?v.push($):x.push({index:B+1,errors:K})}),x.length>0){const $=x.map(B=>`Contacto ${B.index}: ${B.errors.join(", ")}`).join(`
`);if(!confirm(`Se encontraron ${x.length} contacto(s) con errores:

${$}

¿Deseas importar solo los contactos válidos (${v.length})?`))return}const N=$=>o.contacts.some(B=>B.name===$.name&&B.surname===$.surname&&B.phone===$.phone),S=v.filter($=>!N($));S.length?(o.contacts=o.contacts.concat(S),C(o.contacts),y(`${S.length} contacto(s) importado(s) correctamente`,"success"),h()):y("No se han importado contactos nuevos (todos ya existen)","info")}else y("No se pudieron importar contactos del archivo seleccionado","error")};const i=document.getElementById("close-all-notes");i&&(i.onclick=()=>{o.showAllNotes=!1,o.allNotesPage=1,h()});const p=document.getElementById("show-all-notes-btn");p&&(p.onclick=()=>{if(!W()){o.pendingAction={type:"showAllNotes"},U()?o.authMode="login":o.authMode="setup",o.showAuthModal=!0,h();return}o.showAllNotes=!0,o.allNotesPage=1,h()});const g=document.getElementById("prev-notes-page");g&&(g.onclick=()=>{o.allNotesPage>1&&(o.allNotesPage--,h())});const c=document.getElementById("next-notes-page");c&&(c.onclick=()=>{let d=[];o.contacts.forEach((u,m)=>{u.notes&&Object.entries(u.notes).forEach(([v,x])=>{d.push({date:v,text:x,contact:u,contactIndex:m})})});const l=Math.max(1,Math.ceil(d.length/4));o.allNotesPage<l&&(o.allNotesPage++,h())}),document.querySelectorAll(".edit-note-link").forEach(d=>{d.onclick=l=>{l.preventDefault();const u=Number(d.dataset.contact),m=d.dataset.date;o.selected=u,o.editing=null,o.showAllNotes=!1,h(),setTimeout(()=>{const v=document.querySelector(`.edit-note[data-date="${m}"]`);v&&v.click()},50)}}),document.querySelectorAll(".share-backup-btn").forEach(d=>{d.onclick=async()=>{const l=d.dataset.fecha,m=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find($=>$.fecha===l);if(!m)return alert("No se encontró la copia seleccionada.");const v=`contactos_backup_${l}.json`,x=JSON.stringify(m.datos,null,2),N=new Blob([x],{type:"application/json"}),S=document.createElement("a");if(S.href=URL.createObjectURL(N),S.download=v,S.style.display="none",document.body.appendChild(S),S.click(),setTimeout(()=>{URL.revokeObjectURL(S.href),S.remove()},1e3),navigator.canShare&&window.File&&window.FileReader)try{const $=new File([N],v,{type:"application/json"});navigator.canShare({files:[$]})&&await navigator.share({files:[$],title:"Backup de Contactos",text:`Copia de seguridad (${l}) de ContactosDiarios`})}catch{}}});const r=document.getElementById("manage-duplicates-btn");r&&(r.onclick=()=>{o.duplicates=Ie(),o.duplicates.length===0?y("No se encontraron contactos duplicados","info"):(o.showDuplicateModal=!0,h())});const f=document.getElementById("validate-contacts-btn");f&&(f.onclick=()=>{const d=[];if(o.contacts.forEach((l,u)=>{const m=z(l);if(m.length>0){const v=l.surname?`${l.surname}, ${l.name}`:l.name;d.push({index:u+1,name:v,errors:m})}}),d.length===0)y(`✅ Todos los ${o.contacts.length} contactos son válidos`,"success");else{const l=d.map(u=>`${u.index}. ${u.name}: ${u.errors.join(", ")}`).join(`
`);y(`⚠️ Se encontraron ${d.length} contacto(s) con errores`,"warning"),console.log("Contactos con errores de validación:",d),confirm(`Se encontraron ${d.length} contacto(s) con errores de validación:

${l}

¿Deseas ver más detalles en la consola del navegador?`)&&console.table(d)}});const b=document.getElementById("cancel-duplicate-resolution");b&&(b.onclick=()=>{o.showDuplicateModal=!1,o.duplicates=[],h()});const E=document.getElementById("apply-resolution");E&&(E.onclick=Ae),document.querySelectorAll('input[name^="resolution-"]').forEach(d=>{d.addEventListener("change",()=>{const l=d.name.split("-")[1],u=document.getElementById(`merge-section-${l}`),m=document.getElementById(`individual-section-${l}`);d.value==="merge"?(u.style.display="block",m.style.display="none"):d.value==="select"?(u.style.display="none",m.style.display="block"):(u.style.display="none",m.style.display="none")})}),document.querySelectorAll('.resolution-option input[type="radio"]').forEach(d=>{d.addEventListener("change",()=>{const l=d.name;document.querySelectorAll(`input[name="${l}"]`).forEach(u=>{u.closest(".resolution-option").classList.remove("selected")}),d.closest(".resolution-option").classList.add("selected")})});const k=document.getElementById("unlock-notes-btn");k&&(k.onclick=()=>{o.selected!==null&&(o.pendingAction={type:"showContactNotes",contactIndex:o.selected}),U()?o.authMode="login":o.authMode="setup",o.showAuthModal=!0,h()});const I=document.getElementById("logout-btn");I&&(I.onclick=()=>{Me(),h()});const w=document.getElementById("auth-form");w&&!w.hasAttribute("data-handler-added")&&(w.setAttribute("data-handler-added","true"),w.onsubmit=d=>{d.preventDefault();const l=document.getElementById("auth-password").value.trim();if(!l){y("Por favor, introduce una contraseña","warning");return}if(o.authMode==="setup"){const u=document.getElementById("auth-password-confirm").value.trim();if(l!==u){y("Las contraseñas no coinciden","error");return}if(l.length<4){y("La contraseña debe tener al menos 4 caracteres","warning");return}De(l),L.isAuthenticated=!0,L.sessionExpiry=Date.now()+30*60*1e3,o.showAuthModal=!1,w.reset(),setTimeout(()=>{ne()},100),h()}else Be(l)?(o.showAuthModal=!1,w.reset(),h()):(document.getElementById("auth-password").value="",document.getElementById("auth-password").focus())});const D=document.getElementById("cancel-auth");D&&(D.onclick=()=>{o.showAuthModal=!1,o.pendingAction=null,h()});const O=document.getElementById("auth-modal");if(O){O.onclick=u=>{u.target===O&&(o.showAuthModal=!1,o.pendingAction=null,h())};const d=document.getElementById("auth-password");if(d){const u=window.innerWidth<=700?300:100;setTimeout(()=>{d.focus(),window.innerWidth<=700&&d.scrollIntoView({behavior:"smooth",block:"center"})},u)}const l=u=>{u.key==="Escape"&&o.showAuthModal&&(o.showAuthModal=!1,o.pendingAction=null,h())};document.addEventListener("keydown",l)}}function ve(e){const t=[],n=e.split("END:VCARD");for(const s of n){const a=/FN:([^\n]*)/.exec(s)?.[1]?.trim(),i=/N:.*;([^;\n]*)/.exec(s)?.[1]?.trim()||"",p=/TEL.*:(.+)/.exec(s)?.[1]?.trim(),g=/EMAIL.*:(.+)/.exec(s)?.[1]?.trim();a&&t.push({name:a,surname:i,phone:p||"",email:g||"",notes:{},tags:[]})}return t}function ye(e){return e.map(t=>`BEGIN:VCARD
VERSION:3.0
FN:${t.name}
N:${t.surname||""};;;;
TEL:${t.phone||""}
EMAIL:${t.email||""}
END:VCARD`).join(`
`)}function Ee(e){const t=e.split(`
`).filter(Boolean),[n,...s]=t;return s.map(a=>{const[i,p,g,c,r,f]=a.split(",");return{name:i?.trim()||"",surname:p?.trim()||"",phone:g?.trim()||"",email:c?.trim()||"",notes:f?JSON.parse(f):{},tags:r?r.split(";").map(b=>b.trim()):[]}})}function xe(){const e=ye(o.contacts),t=new Blob([e],{type:"text/vcard"}),n=document.createElement("a");n.href=URL.createObjectURL(t),n.download="contactos.vcf",n.click()}function we(){const e="name,surname,phone,email,tags,notes",t=o.contacts.map(i=>[i.name,i.surname,i.phone,i.email,(i.tags||[]).join(";"),JSON.stringify(i.notes||{})].map(p=>'"'+String(p).replace(/"/g,'""')+'"').join(",")),n=[e,...t].join(`
`),s=new Blob([n],{type:"text/csv"}),a=document.createElement("a");a.href=URL.createObjectURL(s),a.download="contactos.csv",a.click()}function $e(){const e=new Blob([JSON.stringify(o.contacts,null,2)],{type:"application/json"}),t=document.createElement("a");t.href=URL.createObjectURL(e),t.download="contactos.json",t.click()}function Q(){console.log("🔄 Ejecutando backup automático diario...");const e=new Date,n=new Date(e.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10),s=localStorage.getItem("contactos_diarios");if(!s){console.log("⚠️ No hay contactos para hacer backup");return}try{const a=JSON.parse(s);if(!Array.isArray(a)||a.length===0){console.log("⚠️ Los datos de contactos están vacíos, saltando backup");return}let i=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");i.find(p=>p.fecha===n)?console.log(`📅 Ya existe backup para ${n}`):(console.log(`💾 Creando backup para ${n} con ${a.length} contactos`),i.push({fecha:n,datos:a}),i.length>10&&(console.log(`🗂️ Limitando backups a los últimos 10 (había ${i.length})`),i=i.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(i)),console.log(`✅ Backup diario creado exitosamente para ${n}`)),localStorage.setItem("contactos_diarios_backup_fecha",n)}catch(a){console.error("❌ Error en backup automático:",a)}}setInterval(Q,60*60*1e3);Q();function ke(){const e=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]"),t=document.getElementById("backup-info");t&&(e.length===0?t.textContent="Sin copias locales.":t.innerHTML="Últimas copias locales: "+e.map(n=>`<button class="restore-backup-btn" data-fecha="${n.fecha}">${n.fecha}</button>`).join(" "))}function Se(e){if(!confirm("¿Seguro que quieres restaurar la copia de seguridad del "+e+"? Se sobrescribirán los contactos actuales."))return;const n=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(s=>s.fecha===e);n?(o.contacts=n.datos,C(o.contacts),h(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}function ee(e,t){const n=s=>s?s.toLowerCase().replace(/\s+/g," ").trim():"";return!!(n(e.name)===n(t.name)&&n(e.surname)===n(t.surname)||e.phone&&t.phone&&e.phone.replace(/\s+/g,"")===t.phone.replace(/\s+/g,"")||e.email&&t.email&&n(e.email)===n(t.email))}function Ie(){const e=[],t=new Set;for(let n=0;n<o.contacts.length;n++){if(t.has(n))continue;const s=[{...o.contacts[n],originalIndex:n}];t.add(n);for(let a=n+1;a<o.contacts.length;a++)t.has(a)||ee(o.contacts[n],o.contacts[a])&&(s.push({...o.contacts[a],originalIndex:a}),t.add(a));s.length>1&&e.push({contacts:s})}return e}function te(e){if(e.length===0)return null;if(e.length===1)return e[0];const t={name:"",surname:"",phone:"",email:"",tags:[],notes:{},pinned:!1};let n="",s="";e.forEach(i=>{i.name&&i.name.length>n.length&&(n=i.name),i.surname&&i.surname.length>s.length&&(s=i.surname)}),t.name=n,t.surname=s,t.phone=e.find(i=>i.phone)?.phone||"",t.email=e.find(i=>i.email)?.email||"";const a=new Set;return e.forEach(i=>{i.tags&&i.tags.forEach(p=>a.add(p))}),t.tags=Array.from(a),e.forEach((i,p)=>{i.notes&&Object.entries(i.notes).forEach(([g,c])=>{t.notes[g]?t.notes[g]+=`
--- Contacto ${p+1} ---
${c}`:t.notes[g]=c})}),t.pinned=e.some(i=>i.pinned),t}function Ne(e){const t=te(e);return`
    <div class="merge-preview">
      <h5>🔗 Vista previa del contacto fusionado:</h5>
      <div class="contact-preview">
        <div class="contact-field"><strong>Nombre:</strong> ${t.name}</div>
        <div class="contact-field"><strong>Apellidos:</strong> ${t.surname}</div>
        <div class="contact-field"><strong>Teléfono:</strong> ${t.phone||"No especificado"}</div>
        <div class="contact-field"><strong>Email:</strong> ${t.email||"No especificado"}</div>
        <div class="contact-field">
          <strong>Etiquetas:</strong>
          <div class="tags">
            ${t.tags.map(n=>`<span class="tag">${n}</span>`).join("")}
          </div>
        </div>
        <div class="contact-field">
          <strong>Notas:</strong> ${Object.keys(t.notes).length} fecha(s) con notas
        </div>
        <div class="contact-field">
          <strong>Estado:</strong> ${t.pinned?"📌 Fijado":"Normal"}
        </div>
      </div>
    </div>
  `}function Ce({duplicates:e,visible:t}){return!t||e.length===0?'<div id="duplicate-modal" class="modal" style="display:none"></div>':`
    <div id="duplicate-modal" class="modal" style="display:flex;z-index:5000;">
      <div class="modal-content" style="max-width:800px;max-height:90vh;overflow-y:auto;">
        <h3>🔍 Gestión de contactos duplicados</h3>
        <p>Se encontraron <strong>${e.length}</strong> grupo(s) de contactos duplicados. 
           Para cada grupo, elige cómo resolverlo:</p>
        
        ${e.map((n,s)=>`
          <div class="duplicate-group" style="border:1px solid #ddd;border-radius:8px;padding:15px;margin:15px 0;background:#fafafa;">
            <h4>Grupo ${s+1} - ${n.contacts.length} contactos similares</h4>
            
            <!-- Opciones de resolución -->
            <div class="resolution-options">
              <label class="resolution-option">
                <input type="radio" name="resolution-${s}" value="merge" checked>
                🔗 Fusionar en un contacto
              </label>
              <label class="resolution-option">
                <input type="radio" name="resolution-${s}" value="select">
                👆 Seleccionar uno y eliminar otros
              </label>
              <label class="resolution-option">
                <input type="radio" name="resolution-${s}" value="skip">
                ⏭️ Omitir este grupo
              </label>
            </div>
            
            <!-- Vista previa de fusión (mostrar por defecto) -->
            <div class="merge-section" id="merge-section-${s}">
              ${Ne(n.contacts)}
            </div>
            
            <!-- Sección de selección individual (oculta por defecto) -->
            <div class="individual-selection" id="individual-section-${s}" style="display:none;">
              <h5>Selecciona el contacto a mantener:</h5>
              ${n.contacts.map((a,i)=>`
                <label class="duplicate-contact" style="display:block;margin:8px 0;padding:12px;border:1px solid #ccc;border-radius:6px;cursor:pointer;">
                  <input type="radio" name="keep-${s}" value="${a.originalIndex}">
                  <strong>${a.surname?a.surname+", ":""}${a.name}</strong>
                  ${a.phone?`📞 ${a.phone}`:""}
                  ${a.email?`✉️ ${a.email}`:""}
                  ${a.tags&&a.tags.length>0?`<br>🏷️ ${a.tags.join(", ")}`:""}
                  ${Object.keys(a.notes||{}).length>0?`<br>📝 ${Object.keys(a.notes).length} nota(s)`:""}
                  ${a.pinned?"<br>📌 Fijado":""}
                </label>
              `).join("")}
            </div>
          </div>
        `).join("")}
        
        <div class="form-actions" style="margin-top:20px;">
          <button id="apply-resolution" style="background:#28a745;color:white;">Aplicar resolución</button>
          <button id="cancel-duplicate-resolution" style="background:#6c757d;color:white;">Cancelar</button>
        </div>
      </div>
    </div>
  `}function Ae(){const e=[];let t=0;if(o.duplicates.forEach((i,p)=>{const g=document.querySelector(`input[name="resolution-${p}"]:checked`),c=g?g.value:"skip";if(c==="merge")e.push({type:"merge",groupIndex:p,contacts:i.contacts}),t++;else if(c==="select"){const r=document.querySelector(`input[name="keep-${p}"]:checked`);if(r){const f=parseInt(r.value),b=i.contacts.filter(E=>E.originalIndex!==f).map(E=>E.originalIndex);e.push({type:"delete",groupIndex:p,toDelete:b,toKeep:f}),t++}}}),t===0){y("No hay operaciones que realizar","info");return}const n=e.filter(i=>i.type==="merge").length,s=e.filter(i=>i.type==="delete").length;let a=`¿Confirmar las siguientes operaciones?

`;if(n>0&&(a+=`🔗 Fusionar ${n} grupo(s) de contactos
`),s>0&&(a+=`🗑️ Eliminar duplicados en ${s} grupo(s)
`),a+=`
Esta acción no se puede deshacer.`,!confirm(a)){y("Operación cancelada","info");return}try{let i=0,p=0;const g=[];e.forEach(b=>{if(b.type==="merge"){const E=te(b.contacts);o.contacts.push(E),b.contacts.forEach(k=>{g.push(k.originalIndex)}),i++}else b.type==="delete"&&(b.toDelete.forEach(E=>{g.push(E)}),p+=b.toDelete.length)}),[...new Set(g)].sort((b,E)=>E-b).forEach(b=>{b<o.contacts.length&&o.contacts.splice(b,1)}),C(o.contacts);let r="Resolución completada: ";const f=[];i>0&&f.push(`${i} contacto(s) fusionado(s)`),p>0&&f.push(`${p} duplicado(s) eliminado(s)`),r+=f.join(" y "),y(r,"success"),o.showDuplicateModal=!1,o.duplicates=[],h()}catch(i){y("Error al aplicar resolución: "+i.message,"error")}}const J="contactos_diarios_auth";let L={isAuthenticated:!1,sessionExpiry:null};function oe(e){let t=0;for(let n=0;n<e.length;n++){const s=e.charCodeAt(n);t=(t<<5)-t+s,t=t&t}return t.toString()}function De(e){const t=oe(e);localStorage.setItem(J,t),y("Contraseña establecida correctamente","success")}function Le(e){const t=localStorage.getItem(J);return t?oe(e)===t:!1}function U(){return localStorage.getItem(J)!==null}function Be(e){return Le(e)?(L.isAuthenticated=!0,L.sessionExpiry=Date.now()+30*60*1e3,y("Autenticación exitosa","success"),setTimeout(()=>{ne()},100),!0):(y("Contraseña incorrecta","error"),!1)}function W(){return L.isAuthenticated?Date.now()>L.sessionExpiry?(L.isAuthenticated=!1,L.sessionExpiry=null,!1):!0:!1}function Me(){L.isAuthenticated=!1,L.sessionExpiry=null,y("Sesión cerrada","info")}function ne(){if(!o.pendingAction)return;const e=o.pendingAction;switch(o.pendingAction=null,e.type){case"showAllNotes":o.showAllNotes=!0,o.allNotesPage=1;break;case"addNote":o.addNoteContactIndex=e.contactIndex,o.showAddNoteModal=!0;break;case"showContactNotes":o.selected=e.contactIndex,o.editing=null;break}h()}function Oe({visible:e,mode:t="login"}){return`
    <div id="auth-modal" class="modal" style="display:${e?"flex":"none"};z-index:6000;">
      <div class="modal-content" style="max-width:400px;">
        <h3>${t==="setup"?"🔐 Establecer contraseña":"🔑 Acceso a notas privadas"}</h3>
        <p>${t==="setup"?"Establece una contraseña para proteger tus notas personales:":"Introduce tu contraseña para acceder a las notas:"}</p>
        
        <form id="auth-form">
          <label>
            Contraseña
            <input type="password" id="auth-password" placeholder="Introduce tu contraseña" required autocomplete="current-password" />
          </label>
          ${t==="setup"?`
            <label>
              Confirmar contraseña
              <input type="password" id="auth-password-confirm" placeholder="Confirma tu contraseña" required autocomplete="new-password" />
            </label>
          `:""}
          <div class="form-actions" style="margin-top:20px;">
            <button type="submit">${t==="setup"?"Establecer contraseña":"Acceder"}</button>
            <button type="button" id="cancel-auth">Cancelar</button>
          </div>
        </form>
        
        ${t==="login"?`
          <div style="margin-top:15px;padding-top:15px;border-top:1px solid #ddd;">
            <p style="font-size:0.9em;color:#666;">
              💡 La contraseña se almacena de forma segura en tu dispositivo
            </p>
          </div>
        `:""}
      </div>
    </div>
  `}async function ae(){console.log("🧹 Limpiando cache y forzando actualización...");try{if("caches"in window){const e=await caches.keys();await Promise.all(e.map(t=>(console.log("🗑️ Eliminando cache:",t),caches.delete(t))))}if("serviceWorker"in navigator){const e=await navigator.serviceWorker.getRegistrations();await Promise.all(e.map(t=>(console.log("🔄 Desregistrando SW:",t.scope),t.unregister())))}console.log("✅ Cache limpiado, recargando..."),window.location.reload()}catch(e){console.error("❌ Error limpiando cache:",e),window.location.reload()}}window.clearCacheAndReload=ae;document.addEventListener("keydown",e=>{e.ctrlKey&&e.shiftKey&&e.key==="R"&&(e.preventDefault(),ae())});async function Re(){console.log("🔍 Obteniendo versión del Service Worker...");try{if("serviceWorker"in navigator&&navigator.serviceWorker.controller){console.log("📡 Intentando comunicación directa con SW...");const n=new MessageChannel,s=new Promise((i,p)=>{const g=setTimeout(()=>{p(new Error("Timeout en comunicación con SW"))},3e3);n.port1.onmessage=c=>{clearTimeout(g),c.data&&c.data.type==="VERSION_RESPONSE"?(console.log("✅ Versión recibida del SW:",c.data.version),i(c.data.version)):p(new Error("Respuesta inválida del SW"))}});return navigator.serviceWorker.controller.postMessage({type:"GET_VERSION"},[n.port2]),await s}console.log("📄 SW no disponible, intentando fetch...");const e=`${Date.now()}-${Math.random().toString(36).substr(2,9)}`,t=[`/sw.js?v=${e}`,`/ContactosDiarios/sw.js?v=${e}`,`./sw.js?v=${e}`];for(const n of t)try{console.log(`🌐 Intentando fetch: ${n}`);const s=await fetch(n,{cache:"no-cache",headers:{"Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0"}});if(s.ok){const a=await s.text();console.log("📄 Código SW obtenido, longitud:",a.length);const i=[/CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/const\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/let\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/var\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/version['":]?\s*['"`]([0-9.]+)['"`]/i,/v?([0-9]+\.[0-9]+\.[0-9]+)/];for(const p of i){const g=a.match(p);if(g&&g[1])return console.log("✅ Versión encontrada:",g[1]),g[1]}console.log("⚠️ No se encontró versión en el código SW")}}catch(s){console.log(`❌ Error fetch ${n}:`,s.message)}return console.log("🔄 Usando versión fallback..."),"0.0.91"}catch(e){return console.error("❌ Error general obteniendo versión SW:",e),"0.0.91"}}async function P(){console.log("📋 Mostrando versión del Service Worker...");let e=document.getElementById("sw-version-info");e||(e=document.createElement("div"),e.id="sw-version-info",e.style.cssText=`
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
    `,document.body.appendChild(e)),e.innerHTML=`
    <p class="version-text">SW cargando...</p>
  `;try{const t=await Re();e.innerHTML=`
      <p class="version-text">Service Worker v${t}</p>
    `,console.log("✅ Versión del SW mostrada:",t)}catch(t){console.error("❌ Error mostrando versión SW:",t),e.innerHTML=`
      <p class="version-text">Service Worker v0.0.87</p>
    `}}async function Te(){console.log("🚀 Inicializando aplicación...");const e=P(),t=new Promise(s=>setTimeout(()=>s("timeout"),5e3));if(await Promise.race([e,t])==="timeout"){console.log("⏰ Timeout obteniendo versión SW, usando fallback");let s=document.getElementById("sw-version-info");s&&(s.innerHTML=`
        <p class="version-text">Service Worker v0.0.91</p>
      `)}"serviceWorker"in navigator&&(navigator.serviceWorker.addEventListener("controllerchange",()=>{console.log("🔄 Service Worker actualizado, refrescando versión..."),setTimeout(()=>P(),500)}),navigator.serviceWorker.ready.then(()=>{console.log("✅ Service Worker listo, actualizando versión..."),setTimeout(()=>P(),2e3)}).catch(s=>{console.log("❌ Error esperando SW ready:",s)}),navigator.serviceWorker.addEventListener("message",s=>{s.data&&s.data.type==="SW_UPDATED"&&(console.log("📢 Service Worker actualizado a versión:",s.data.version),ge(s.data.version),P())}))}let se=0,T=!1;function Pe(){let e=null;window.addEventListener("scroll",()=>{T=!0,clearTimeout(e),e=setTimeout(()=>{T=!1},100)},{passive:!0}),document.addEventListener("touchstart",()=>{se=Date.now()},{passive:!0}),document.addEventListener("touchmove",()=>{T=!0},{passive:!0}),document.addEventListener("touchend",()=>{setTimeout(()=>{T=!1},100)},{passive:!0})}function j(e){if(e&&(e.classList.contains("add-note-contact")||e.classList.contains("edit-contact")||e.classList.contains("delete-contact")||e.classList.contains("pin-contact")||e.classList.contains("select-contact")))return!0;const t=Date.now()-se;return!T&&t>150}document.addEventListener("DOMContentLoaded",()=>{try{console.log("=== 📱 INICIO DEBUG MÓVIL ==="),console.log("🌐 URL:",window.location.href),console.log("📱 User Agent:",navigator.userAgent),console.log("📊 Screen:",screen.width+"x"+screen.height),console.log("🖥️ Viewport:",window.innerWidth+"x"+window.innerHeight),console.log("🗂️ localStorage disponible:",!!window.localStorage),console.log("⚙️ Service Worker:","serviceWorker"in navigator),console.log("=================================");const e=document.getElementById("debug-trigger");e?(e.addEventListener("click",G),console.log("🐛 Botón de debug configurado")):console.log("❌ No se encontró el botón de debug"),console.log("🔄 Iniciando migración de contactos..."),je(),console.log("✅ Migración completada"),console.log("🎨 Iniciando render inicial..."),h(),console.log("✅ Render inicial completado"),console.log("⚙️ Inicializando app..."),Te(),console.log("✅ App inicializada"),console.log("💾 Mostrando info de backup..."),ke(),console.log("✅ Info backup mostrada"),console.log("📱 ContactosDiarios iniciado correctamente"),console.log("🆕 Nueva funcionalidad: Contactos recientemente editados"),console.log("💡 Usa Ctrl+Shift+R para limpiar cache y forzar actualización"),console.log("🔧 También disponible: window.clearCacheAndReload()")}catch(e){console.error("💥 ERROR CRÍTICO EN INICIALIZACIÓN:",e),console.error("Stack trace:",e.stack);const t=document.querySelector("#app");t&&(t.innerHTML=`
        <div style="padding: 20px; background: #ffebee; border: 1px solid #f44336; border-radius: 8px; margin: 20px;">
          <h2 style="color: #d32f2f;">💥 Error crítico de inicialización</h2>
          <p><strong>Error:</strong> ${e.message}</p>
          <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto;">${e.stack}</pre>
          <button onclick="location.reload()" style="background: #2196F3; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">
            🔄 Recargar aplicación
          </button>
          <button onclick="localStorage.clear(); location.reload()" style="background: #ff5722; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
            🗑️ Limpiar datos y recargar
          </button>
        </div>
      `)}});function je(){let e=!1;const t=Date.now();o.contacts.forEach((n,s)=>{n.lastEdited||(n.lastEdited=n.createdAt||t-(o.contacts.length-s)*1e3*60*60,e=!0),n.createdAt||(n.createdAt=n.lastEdited,e=!0)}),e&&C(o.contacts)}async function _e(){try{const e={timestamp:new Date().toISOString(),url:window.location.href,userAgent:navigator.userAgent,screen:`${screen.width}x${screen.height}`,viewport:`${window.innerWidth}x${window.innerHeight}`,localStorage:!!window.localStorage,serviceWorker:"serviceWorker"in navigator,logs:M},t=`=== 📱 DEBUG MÓVIL EXPORT ===
Timestamp: ${e.timestamp}
URL: ${e.url}
User Agent: ${e.userAgent}
Screen: ${e.screen}
Viewport: ${e.viewport}
LocalStorage: ${e.localStorage}
Service Worker: ${e.serviceWorker}

=== 📋 LOGS (${e.logs.length} entradas) ===
${e.logs.map(n=>`[${n.timestamp}] ${n.message}`).join(`
`)}

=== 🔍 DATOS ADICIONALES ===
Estado contactos: ${JSON.stringify(o,null,2)}
localStorage contactos: ${localStorage.getItem("contactos_diarios")}
=== FIN DEBUG ===`;if(navigator.clipboard&&navigator.clipboard.writeText)await navigator.clipboard.writeText(t),A("✅ Debug copiado al portapapeles"),_("📋 Debug copiado al portapapeles");else{const n=document.createElement("textarea");n.value=t,n.style.position="fixed",n.style.top="0",n.style.left="0",n.style.width="2em",n.style.height="2em",n.style.padding="0",n.style.border="none",n.style.outline="none",n.style.boxShadow="none",n.style.background="transparent",document.body.appendChild(n),n.focus(),n.select();try{if(document.execCommand("copy"))A("✅ Debug copiado al portapapeles (fallback)"),_("📋 Debug copiado (selecciona y copia manualmente si no funcionó)");else throw new Error("execCommand failed")}catch(s){A("❌ Error copiando al portapapeles:",s),_("❌ Error copiando. Selecciona todo el texto manualmente")}document.body.removeChild(n)}}catch(e){A("❌ Error en copyMobileLogsToClipboard:",e),_("❌ Error copiando logs")}}function _(e){const t=document.createElement("div");t.style.cssText=`
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
  `,t.textContent=e,document.body.appendChild(t),setTimeout(()=>{t.parentNode&&t.parentNode.removeChild(t)},3e3)}
