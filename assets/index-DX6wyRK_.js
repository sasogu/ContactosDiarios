(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const c of s)if(c.type==="childList")for(const p of c.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&a(p)}).observe(document,{childList:!0,subtree:!0});function n(s){const c={};return s.integrity&&(c.integrity=s.integrity),s.referrerPolicy&&(c.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?c.credentials="include":s.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function a(s){if(s.ep)return;s.ep=!0;const c=n(s);fetch(s.href,c)}})();const J="0.1.09";let T=!1,M=[];const K=50,A=console.log;function ie(e,o="info"){const n=new Date().toLocaleTimeString(),a={timestamp:n,message:typeof e=="object"?JSON.stringify(e,null,2):e,type:o};M.unshift(a),M.length>K&&(M=M.slice(0,K)),T&&U(),A(`[${n}] ${e}`)}console.log=function(...e){ie(e.join(" "),"info"),A.apply(console,e)};function z(){A("🐛 Toggling mobile logs, current state:",T),T=!T;let e=document.getElementById("mobile-logs-panel");T?(A("📱 Mostrando panel de logs móvil"),e||(e=document.createElement("div"),e.id="mobile-logs-panel",e.innerHTML=`
        <div class="mobile-logs-header">
          <span>📱 Debug Logs</span>
          <button id="copy-logs-btn">📋</button>
          <button id="clear-logs-btn">🗑️</button>
          <button id="close-logs-btn">❌</button>
        </div>
        <div id="mobile-logs-content"></div>
      `,document.body.appendChild(e),document.getElementById("copy-logs-btn").addEventListener("click",_e),document.getElementById("clear-logs-btn").addEventListener("click",Z),document.getElementById("close-logs-btn").addEventListener("click",z),A("📱 Panel de logs creado")),e.style.display="block",U()):(A("📱 Ocultando panel de logs móvil"),e&&(e.style.display="none"))}function U(){const e=document.getElementById("mobile-logs-content");e&&(e.innerHTML=M.map(o=>`
    <div class="mobile-log-entry mobile-log-${o.type}">
      <span class="mobile-log-time">${o.timestamp}</span>
      <pre class="mobile-log-message">${o.message}</pre>
    </div>
  `).join(""))}function Z(){A("🗑️ Limpiando logs móviles"),M=[],U()}window.toggleMobileLogs=z;window.clearMobileLogs=Z;(function(){try{const o=localStorage.getItem("app_version");if(o&&o!==J){const n=localStorage.getItem("contactos_diarios"),a=localStorage.getItem("contactos_diarios_backups"),s=localStorage.getItem("contactos_diarios_backup_fecha"),c=localStorage.getItem("contactos_diarios_webdav_config");["app_version","contactos_diarios","contactos_diarios_backups","contactos_diarios_backup_fecha","contactos_diarios_webdav_config"].forEach(m=>{m!=="contactos_diarios"&&localStorage.removeItem(m)}),"caches"in window&&caches.keys().then(m=>{m.forEach(i=>{(i.includes("contactosdiarios")||i.includes("contactos-diarios"))&&caches.delete(i)})}),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(m=>{m.forEach(i=>{i.scope.includes(window.location.origin)&&i.unregister()})}),n&&localStorage.setItem("contactos_diarios",n),a&&localStorage.setItem("contactos_diarios_backups",a),s&&localStorage.setItem("contactos_diarios_backup_fecha",s),c&&localStorage.setItem("contactos_diarios_webdav_config",c),location.reload()}localStorage.setItem("app_version",J)}catch{}})();function ce({contacts:e,filter:o,onSelect:n,onDelete:a}){let s=o?e.filter(i=>{const r=o.toLowerCase(),h=i.notes?Object.values(i.notes).join(" ").toLowerCase():"";return i.tags?.some(b=>b.toLowerCase().includes(r))||i.name?.toLowerCase().includes(r)||i.surname?.toLowerCase().includes(r)||h.includes(r)}):e;console.log("🔄 INICIANDO ORDENACIÓN - Estado inicial:",s.length,"contactos"),s.forEach((i,r)=>{(!i.lastEdited||isNaN(Number(i.lastEdited)))&&(console.log(`⚠️ Contacto sin fecha válida: ${i.name} - lastEdited: ${i.lastEdited}`),s[r].lastEdited=0)});for(let i=0;i<2;i++)console.log(`🔄 Pasada de ordenación #${i+1}`),s=s.slice().sort((r,h)=>{const b=/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),E=window.location.hostname==="sasogu.github.io";if(r.pinned!==h.pinned){const B=r.pinned?-1:1;return(b||E)&&console.log(`📌 Fijado: ${r.pinned?r.name:h.name} va arriba (resultado: ${B})`),B}const k=Number(r.lastEdited)||0,I=Number(h.lastEdited)||0,w=I-k;return(b||E)&&i===0&&console.log(`📅 ${r.name}(${k}) vs ${h.name}(${I}) = ${w} (${w>0?h.name:w<0?r.name:"igual"} primero)`),w});console.log("✅ ORDENACIÓN COMPLETADA"),console.log("🔍 VALIDANDO ORDEN FINAL...");const c=s.filter(i=>i.pinned),p=s.filter(i=>!i.pinned);console.log(`📌 Contactos fijados: ${c.length}`),console.log(`📄 Contactos no fijados: ${p.length}`);let m=!0;for(let i=0;i<p.length-1;i++){const r=p[i],h=p[i+1],b=Number(r.lastEdited)||0,E=Number(h.lastEdited)||0;b<E?(console.log(`❌ ERROR: ${r.name} (${b}) debería ir DESPUÉS de ${h.name} (${E})`),m=!1):console.log(`✅ OK: ${r.name} (${b}) antes que ${h.name} (${E})`)}if(m||(console.log("🔧 FORZANDO CORRECCIÓN DEL ORDEN..."),p.sort((i,r)=>{const h=Number(i.lastEdited)||0;return(Number(r.lastEdited)||0)-h}),s=[...c,...p],console.log("✅ ORDEN CORREGIDO")),(window.location.hostname==="sasogu.github.io"||/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))&&console.log("📱 ORDEN FINAL:",s.slice(0,8).map((i,r)=>`${r+1}. ${i.pinned?"📌":"📄"} ${i.name} (${i.lastEdited?new Date(i.lastEdited).toLocaleString():"Sin fecha"})`)),window.location.hostname==="sasogu.github.io"||/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){console.log("📱 DEBUG MÓVIL - Orden contactos:",s.slice(0,5).map(r=>`${r.pinned?"📌":"📄"} ${r.name} (${r.lastEdited?new Date(r.lastEdited).toLocaleString():"Sin fecha"})`));const i=s.filter(r=>!r.pinned);console.log("📄 DEBUG - Contactos NO fijados ordenados:",i.slice(0,5).map(r=>`${r.name} (${r.lastEdited?new Date(r.lastEdited).toLocaleString():"Sin fecha"}) [${r.lastEdited}]`));for(let r=0;r<i.length-1;r++){const h=i[r],b=i[r+1],E=Number(h.lastEdited)||0,k=Number(b.lastEdited)||0;E<k?console.log(`❌ ERROR ORDEN: ${h.name} (${E}) debería ir DESPUÉS de ${b.name} (${k})`):console.log(`✅ ORDEN OK: ${h.name} (${E}) está antes que ${b.name} (${k})`)}}return`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${o||""}" />
      <ul>
        ${s.length===0?'<li class="empty">Sin contactos</li>':s.map((i,r)=>{const h=Date.now(),b=24*60*60*1e3,E=i.lastEdited&&h-i.lastEdited<b,k=E&&!i.pinned?" recently-edited":"";let I="";if(i.lastEdited){const w=h-i.lastEdited,B=Math.floor(w/(60*60*1e3)),O=Math.floor(w%(60*60*1e3)/(60*1e3));B<1?I=O<1?"Ahora":`${O}m`:B<24?I=`${B}h`:I=`${Math.floor(B/24)}d`}return`
          <li${i.pinned?' class="pinned"':k}>
            <div class="contact-main">
              <button class="select-contact" data-index="${e.indexOf(i)}">
                ${E&&!i.pinned?"🆕 ":""}${i.surname?i.surname+", ":""}${i.name}
                ${I&&E?`<span class="time-ago">(${I})</span>`:""}
              </button>
              <span class="tags">${(i.tags||[]).map(w=>`<span class='tag'>${w}</span>`).join(" ")}</span>
              <button class="pin-contact" data-index="${e.indexOf(i)}" title="${i.pinned?"Desfijar":"Fijar"}">${i.pinned?"📌":"📍"}</button>
            </div>
            <div class="contact-info">
              ${i.phone?`<a href="tel:${i.phone}" class="contact-link" title="Llamar"><span>📞</span> ${i.phone}</a>`:""}
              ${i.email?`<a href="mailto:${i.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${i.email}</a>`:""}
            </div>
            <div class="contact-actions">
              <button class="add-note-contact" data-index="${e.indexOf(i)}" title="Añadir nota">📝</button>
              <button class="edit-contact" data-index="${e.indexOf(i)}" title="Editar">✏️</button>
              <button class="delete-contact" data-index="${e.indexOf(i)}" title="Eliminar">🗑️</button>
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
    `;const o=new Date;return`
    <div class="notes-area">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
        <h3>Notas diarias</h3>
        <button id="logout-btn" style="background:#dc3545;color:white;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;font-size:0.8em;">
          🚪 Cerrar sesión
        </button>
      </div>
      <form id="note-form">
        <input type="date" id="note-date" value="${new Date(o.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10)}" required />
        <textarea id="note-text" rows="3" placeholder="Escribe una nota para la fecha seleccionada..."></textarea>
        <button type="submit">Guardar nota</button>
      </form>
      <ul class="note-history">
        ${Object.entries(e||{}).sort((s,c)=>c[0].localeCompare(s[0])).map(([s,c])=>`
          <li>
            <b>${s}</b>:
            <span class="note-content" data-date="${s}">${c}</span>
            <button class="edit-note" data-date="${s}" title="Editar">✏️</button>
            <button class="delete-note" data-date="${s}" title="Eliminar">🗑️</button>
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
  `}function ue({contacts:e,visible:o,page:n=1}){let a=[];e.forEach((r,h)=>{r.notes&&Object.entries(r.notes).forEach(([b,E])=>{a.push({date:b,text:E,contact:r,contactIndex:h})})}),a.sort((r,h)=>h.date.localeCompare(r.date));const s=4,c=Math.max(1,Math.ceil(a.length/s)),p=Math.min(Math.max(n,1),c),m=(p-1)*s,i=a.slice(m,m+s);return`
    <div id="all-notes-modal" class="modal" style="display:${o?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${a.length===0?"<li>No hay notas registradas.</li>":i.map(r=>`
            <li>
              <b>${r.date}</b> — <span style="color:#3a4a7c">${r.contact.surname?r.contact.surname+", ":""}${r.contact.name}</span><br/>
              <span>${r.text}</span>
              <a href="#" class="edit-note-link" data-contact="${r.contactIndex}" data-date="${r.date}" style="margin-left:0.5em;color:#646cff;font-size:0.95em;">Editar nota</a>
            </li>
          `).join("")}
        </ul>
        <div class="pagination" style="display:flex;justify-content:center;align-items:center;gap:1em;margin:1em 0;">
          <button id="prev-notes-page" ${p===1?"disabled":""}>&lt; Anterior</button>
          <span>Página ${p} de ${c}</span>
          <button id="next-notes-page" ${p===c?"disabled":""}>Siguiente &gt;</button>
        </div>
        <div class="form-actions">
          <button id="close-all-notes">Cerrar</button>
        </div>
      </div>
    </div>
  `}function pe({visible:e,backups:o}){return`
    <div id="backup-modal" class="modal" style="display:${e?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:400px;">
        <h3>Restaurar copia local</h3>
        <div class="backup-btns" style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;">
          ${o.length===0?"<span>Sin copias locales.</span>":o.map(n=>`
            <div class="backup-btn-group" style="display:flex;align-items:center;gap:0.3rem;">
              <button class="restore-backup-btn" data-fecha="${n.fecha}">${n.fecha}</button>
              <button class="share-backup-btn" data-fecha="${n.fecha}" title="Compartir backup" style="background:#06b6d4;padding:0.4rem 0.7rem;font-size:1.1em;">📤</button>
            </div>
          `).join("")}
        </div>
        <div class="form-actions" style="margin-top:1.2rem;"><button id="close-backup-modal">Cerrar</button></div>
      </div>
    </div>
  `}function me({visible:e,contactIndex:o}){const n=o!==null?t.contacts[o]:null,a=new Date,c=new Date(a.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);return`
    <div id="add-note-modal" class="modal" style="display:${e?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:500px;">
        <h3>Añadir nota diaria</h3>
        ${n?`<p><strong>${n.surname?n.surname+", ":""}${n.name}</strong></p>`:""}
        <form id="add-note-form">
          <label>Fecha <input type="date" id="add-note-date" value="${c}" required /></label>
          <label>Nota <textarea id="add-note-text" rows="4" placeholder="Escribe una nota para este contacto..." required></textarea></label>
          <div class="form-actions">
            <button type="submit">Guardar nota</button>
            <button type="button" id="cancel-add-note">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `}function y(e,o="info"){let n=document.getElementById("notification-container");n||(n=document.createElement("div"),n.id="notification-container",n.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
      pointer-events: none;
    `,document.body.appendChild(n));const a=document.createElement("div");a.style.cssText=`
    background: ${o==="success"?"#d4edda":o==="error"?"#f8d7da":o==="warning"?"#fff3cd":"#d1ecf1"};
    color: ${o==="success"?"#155724":o==="error"?"#721c24":o==="warning"?"#856404":"#0c5460"};
    border: 1px solid ${o==="success"?"#c3e6cb":o==="error"?"#f5c6cb":o==="warning"?"#ffeaa7":"#bee5eb"};
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
  `;const s=o==="success"?"✅":o==="error"?"❌":o==="warning"?"⚠️":"ℹ️";a.innerHTML=`${s} ${e}`,n.appendChild(a),setTimeout(()=>{a.style.opacity="1",a.style.transform="translateX(0)"},10);const c=()=>{a.style.opacity="0",a.style.transform="translateX(100%)",setTimeout(()=>{a.parentNode&&a.parentNode.removeChild(a)},300)};a.onclick=c,setTimeout(c,4e3)}function ge(e){console.log("📢 Mostrando notificación de actualización para versión:",e);const o=document.createElement("div");o.id="update-notification",o.innerHTML=`
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
  `;const n=document.getElementById("update-notification");n&&n.remove(),document.body.appendChild(o),setTimeout(()=>{document.getElementById("update-notification")&&fe()},1e4)}function fe(){const e=document.getElementById("update-notification");e&&(e.style.transform="translateX(100%)",e.style.transition="transform 0.3s ease",setTimeout(()=>e.remove(),300))}function q(e){const o=[];return!e.name||e.name.trim().length===0?o.push("El nombre es obligatorio"):e.name.trim().length<2?o.push("El nombre debe tener al menos 2 caracteres"):e.name.trim().length>50&&o.push("El nombre no puede tener más de 50 caracteres"),e.surname&&e.surname.trim().length>50&&o.push("Los apellidos no pueden tener más de 50 caracteres"),e.phone&&e.phone.trim().length>0&&(/^[\d\s\-\+\(\)\.]{6,20}$/.test(e.phone.trim())||o.push("El teléfono debe contener solo números, espacios y caracteres válidos (6-20 caracteres)")),e.email&&e.email.trim().length>0&&(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email.trim())?e.email.trim().length>100&&o.push("El email no puede tener más de 100 caracteres"):o.push("El email debe tener un formato válido")),o}function F(e){const o=[];return!e||e.trim().length===0?(o.push("La nota no puede estar vacía"),o):(e.trim().length>1e3&&o.push("La nota no puede tener más de 1000 caracteres"),e.trim().length<3&&o.push("La nota debe tener al menos 3 caracteres"),/^[\w\s\.\,\;\:\!\?\-\(\)\[\]\"\'\/\@\#\$\%\&\*\+\=\<\>\{\}\|\~\`\ñÑáéíóúÁÉÍÓÚüÜ]*$/.test(e)||o.push("La nota contiene caracteres no permitidos"),o)}const Y="contactos_diarios";let t={contacts:he(),selected:null,notes:"",editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1,showAddNoteModal:!1,addNoteContactIndex:null,allNotesPage:1,duplicates:[],showDuplicateModal:!1,showAuthModal:!1,authMode:"login",pendingAction:null};function he(){try{return JSON.parse(localStorage.getItem(Y))||[]}catch{return[]}}function C(e){localStorage.setItem(Y,JSON.stringify(e))}function f(){console.log("🎨 Iniciando render...");try{const e=document.querySelector("#app");if(!e){console.error("❌ ERROR: No se encontró el elemento #app");return}console.log("✅ Elemento #app encontrado:",e);const o=t.editing!==null?t.contacts[t.editing]:null,n=t.selected!==null?t.contacts[t.selected].notes||{}:{};console.log("📊 Estado actual:",{editing:t.editing,selected:t.selected,contactsCount:t.contacts.length}),e.innerHTML=`
    <h1>Diario de Contactos</h1>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <div class="main-grid">
      <div>
        
        ${ce({contacts:t.contacts,filter:t.tagFilter})}
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
        ${t.editing!==null?re({contact:o}):""}
        ${t.selected!==null&&t.editing===null?le({notes:n}):""}
      </div>
    </div>
    ${ue({contacts:t.contacts,visible:t.showAllNotes,page:t.allNotesPage})}
    ${pe({visible:t.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})} <!-- Modal de backup -->
    ${me({visible:t.showAddNoteModal,contactIndex:t.addNoteContactIndex})} <!-- Modal añadir nota -->
    ${Ce({duplicates:t.duplicates,visible:t.showDuplicateModal})} <!-- Modal de gestión de duplicados -->
    ${Oe({visible:t.showAuthModal,mode:t.authMode})} <!-- Modal de autenticación -->
    ${de({})}
  `,be(),Pe();const a=document.getElementById("show-backup-modal");a&&(a.onclick=()=>{t.showBackupModal=!0,f()});const s=document.getElementById("close-backup-modal");s&&(s.onclick=()=>{t.showBackupModal=!1,f()}),document.querySelectorAll(".add-note-contact").forEach(m=>{m.onclick=i=>{const r=Number(m.dataset.index);if(!W()){t.pendingAction={type:"addNote",contactIndex:r},V()?t.authMode="login":t.authMode="setup",t.showAuthModal=!0,f();return}t.addNoteContactIndex=r,t.showAddNoteModal=!0,f()}});const c=document.getElementById("cancel-add-note");c&&(c.onclick=()=>{t.showAddNoteModal=!1,t.addNoteContactIndex=null,f()}),document.querySelectorAll(".restore-backup-btn").forEach(m=>{m.onclick=()=>Se(m.dataset.fecha)});const p=document.getElementById("restore-local-backup");p&&(p.onclick=restaurarBackupLocal),console.log("✅ Render completado exitosamente")}catch(e){console.error("❌ ERROR en render:",e),console.error("Stack trace:",e.stack);const o=document.querySelector("#app");o&&(o.innerHTML=`
        <div style="padding: 20px; background: #ffebee; border: 1px solid #f44336; border-radius: 8px; margin: 20px;">
          <h2 style="color: #d32f2f;">❌ Error de la aplicación</h2>
          <p><strong>Error:</strong> ${e.message}</p>
          <p><strong>Línea:</strong> ${e.stack}</p>
          <button onclick="location.reload()" style="background: #2196F3; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
            🔄 Recargar aplicación
          </button>
        </div>
      `)}}let X=null;function be(){const e=document.getElementById("tag-filter");e&&e.addEventListener("input",d=>{clearTimeout(X),X=setTimeout(()=>{t.tagFilter=e.value,f();const l=document.getElementById("tag-filter");l&&(l.value=t.tagFilter,l.focus(),l.setSelectionRange(t.tagFilter.length,t.tagFilter.length))},300)});const o=document.getElementById("add-contact");o&&(o.onclick=()=>{t.editing=null,t.selected=null,f(),t.editing=t.contacts.length,f()}),document.querySelectorAll(".select-contact").forEach(d=>{d.onclick=l=>{l.preventDefault(),l.stopPropagation(),j(d)&&(t.selected=Number(d.dataset.index),t.editing=null,f())}}),document.querySelectorAll(".edit-contact").forEach(d=>{d.onclick=l=>{l.preventDefault(),l.stopPropagation(),j(d)&&(t.editing=Number(d.dataset.index),t.selected=null,f())}}),document.querySelectorAll(".delete-contact").forEach(d=>{d.onclick=l=>{if(l.preventDefault(),l.stopPropagation(),!j(d))return;const u=Number(d.dataset.index),g=t.contacts[u],v=g.surname?`${g.surname}, ${g.name}`:g.name;confirm(`¿Estás seguro de eliminar el contacto "${v}"?

Esta acción no se puede deshacer.`)&&(t.contacts.splice(u,1),C(t.contacts),y("Contacto eliminado correctamente","success"),t.selected=null,f())}}),document.querySelectorAll(".pin-contact").forEach(d=>{d.onclick=l=>{if(l.preventDefault(),l.stopPropagation(),!j(d))return;const u=Number(d.dataset.index);t.contacts[u].pinned&&!confirm("¿Seguro que quieres desfijar este contacto?")||(t.contacts[u].pinned=!t.contacts[u].pinned,C(t.contacts),f())}});const n=document.getElementById("contact-form");n&&(n.onsubmit=d=>{d.preventDefault();const l=Object.fromEntries(new FormData(n)),u=q(l);if(u.length>0){y("Error de validación: "+u.join(", "),"error");return}let g=l.tags?l.tags.split(",").map(N=>N.trim()).filter(Boolean):[];delete l.tags;const v={...l};t.contacts.some((N,S)=>t.editing!==null&&S===t.editing?!1:ee(N,v))&&!confirm("Ya existe un contacto similar. ¿Deseas guardarlo de todas formas?")||(t.editing!==null&&t.editing<t.contacts.length?(t.contacts[t.editing]={...t.contacts[t.editing],...l,tags:g,lastEdited:Date.now()},(window.location.hostname==="sasogu.github.io"||/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))&&console.log("📱 CONTACTO EDITADO:",t.contacts[t.editing].name,"Nueva fecha:",new Date().toLocaleString()),y("Contacto actualizado correctamente","success")):(t.contacts.push({...l,notes:{},tags:g,lastEdited:Date.now(),createdAt:Date.now()}),y("Contacto añadido correctamente","success")),C(t.contacts),t.editing=null,f())},document.getElementById("cancel-edit").onclick=()=>{t.editing=null,f()});const a=document.getElementById("add-note-form");if(a&&t.addNoteContactIndex!==null){const d=l=>{l.preventDefault();const u=document.getElementById("add-note-date").value,g=document.getElementById("add-note-text").value.trim();if(!u||!g){y("Por favor, selecciona una fecha y escribe una nota","warning");return}const v=F(g);if(v.length>0){y("Error en la nota: "+v.join(", "),"error");return}const x=t.addNoteContactIndex;t.contacts[x].notes||(t.contacts[x].notes={}),t.contacts[x].notes[u]?t.contacts[x].notes[u]+=`
`+g:t.contacts[x].notes[u]=g,t.contacts[x].lastEdited=Date.now(),(window.location.hostname==="sasogu.github.io"||/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))&&console.log(`📝 MÓVIL - Nota añadida a ${t.contacts[x].name}, lastEdited: ${t.contacts[x].lastEdited}`),C(t.contacts),y("Nota añadida correctamente","success"),t.showAddNoteModal=!1,t.addNoteContactIndex=null,f()};a.onsubmit=d}const s=document.getElementById("note-form");if(s&&t.selected!==null){const d=l=>{l.preventDefault();const u=document.getElementById("note-date").value,g=document.getElementById("note-text").value.trim();if(!u||!g){y("Por favor, selecciona una fecha y escribe una nota","warning");return}const v=F(g);if(v.length>0){y("Error en la nota: "+v.join(", "),"error");return}t.contacts[t.selected].notes||(t.contacts[t.selected].notes={}),t.contacts[t.selected].notes[u]?t.contacts[t.selected].notes[u]+=`
`+g:t.contacts[t.selected].notes[u]=g,t.contacts[t.selected].lastEdited=Date.now(),C(t.contacts),y("Nota guardada correctamente","success"),document.getElementById("note-text").value="",f()};s.onsubmit=d}document.querySelectorAll(".edit-note").forEach(d=>{d.onclick=l=>{const u=d.dataset.date,g=document.getElementById("edit-note-modal"),v=document.getElementById("edit-note-text");v.value=t.contacts[t.selected].notes[u],g.style.display="block",document.getElementById("save-edit-note").onclick=()=>{const x=v.value.trim(),N=F(x);if(N.length>0){y("Error en la nota: "+N.join(", "),"error");return}t.contacts[t.selected].notes[u]=x,t.contacts[t.selected].lastEdited=Date.now(),C(t.contacts),y("Nota actualizada correctamente","success"),g.style.display="none",f()},document.getElementById("cancel-edit-note").onclick=()=>{g.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(d=>{d.onclick=l=>{const u=d.dataset.date;confirm(`¿Estás seguro de eliminar la nota del ${u}?

Esta acción no se puede deshacer.`)&&(delete t.contacts[t.selected].notes[u],C(t.contacts),y("Nota eliminada correctamente","success"),f())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{xe(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{we(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{$e(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async d=>{const l=d.target.files[0];if(!l)return;const u=await l.text();let g=[];if(l.name.endsWith(".vcf"))g=ve(u);else if(l.name.endsWith(".csv"))g=Ee(u);else if(l.name.endsWith(".json"))try{const v=JSON.parse(u);Array.isArray(v)?g=v:v&&Array.isArray(v.contacts)&&(g=v.contacts)}catch{}if(g.length){const v=[],x=[];if(g.forEach(($,L)=>{const G=q($);G.length===0?v.push($):x.push({index:L+1,errors:G})}),x.length>0){const $=x.map(L=>`Contacto ${L.index}: ${L.errors.join(", ")}`).join(`
`);if(!confirm(`Se encontraron ${x.length} contacto(s) con errores:

${$}

¿Deseas importar solo los contactos válidos (${v.length})?`))return}const N=$=>t.contacts.some(L=>L.name===$.name&&L.surname===$.surname&&L.phone===$.phone),S=v.filter($=>!N($));S.length?(t.contacts=t.contacts.concat(S),C(t.contacts),y(`${S.length} contacto(s) importado(s) correctamente`,"success"),f()):y("No se han importado contactos nuevos (todos ya existen)","info")}else y("No se pudieron importar contactos del archivo seleccionado","error")};const c=document.getElementById("close-all-notes");c&&(c.onclick=()=>{t.showAllNotes=!1,t.allNotesPage=1,f()});const p=document.getElementById("show-all-notes-btn");p&&(p.onclick=()=>{if(!W()){t.pendingAction={type:"showAllNotes"},V()?t.authMode="login":t.authMode="setup",t.showAuthModal=!0,f();return}t.showAllNotes=!0,t.allNotesPage=1,f()});const m=document.getElementById("prev-notes-page");m&&(m.onclick=()=>{t.allNotesPage>1&&(t.allNotesPage--,f())});const i=document.getElementById("next-notes-page");i&&(i.onclick=()=>{let d=[];t.contacts.forEach((u,g)=>{u.notes&&Object.entries(u.notes).forEach(([v,x])=>{d.push({date:v,text:x,contact:u,contactIndex:g})})});const l=Math.max(1,Math.ceil(d.length/4));t.allNotesPage<l&&(t.allNotesPage++,f())}),document.querySelectorAll(".edit-note-link").forEach(d=>{d.onclick=l=>{l.preventDefault();const u=Number(d.dataset.contact),g=d.dataset.date;t.selected=u,t.editing=null,t.showAllNotes=!1,f(),setTimeout(()=>{const v=document.querySelector(`.edit-note[data-date="${g}"]`);v&&v.click()},50)}}),document.querySelectorAll(".share-backup-btn").forEach(d=>{d.onclick=async()=>{const l=d.dataset.fecha,g=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find($=>$.fecha===l);if(!g)return alert("No se encontró la copia seleccionada.");const v=`contactos_backup_${l}.json`,x=JSON.stringify(g.datos,null,2),N=new Blob([x],{type:"application/json"}),S=document.createElement("a");if(S.href=URL.createObjectURL(N),S.download=v,S.style.display="none",document.body.appendChild(S),S.click(),setTimeout(()=>{URL.revokeObjectURL(S.href),S.remove()},1e3),navigator.canShare&&window.File&&window.FileReader)try{const $=new File([N],v,{type:"application/json"});navigator.canShare({files:[$]})&&await navigator.share({files:[$],title:"Backup de Contactos",text:`Copia de seguridad (${l}) de ContactosDiarios`})}catch{}}});const r=document.getElementById("manage-duplicates-btn");r&&(r.onclick=()=>{t.duplicates=Ie(),t.duplicates.length===0?y("No se encontraron contactos duplicados","info"):(t.showDuplicateModal=!0,f())});const h=document.getElementById("validate-contacts-btn");h&&(h.onclick=()=>{const d=[];if(t.contacts.forEach((l,u)=>{const g=q(l);if(g.length>0){const v=l.surname?`${l.surname}, ${l.name}`:l.name;d.push({index:u+1,name:v,errors:g})}}),d.length===0)y(`✅ Todos los ${t.contacts.length} contactos son válidos`,"success");else{const l=d.map(u=>`${u.index}. ${u.name}: ${u.errors.join(", ")}`).join(`
`);y(`⚠️ Se encontraron ${d.length} contacto(s) con errores`,"warning"),console.log("Contactos con errores de validación:",d),confirm(`Se encontraron ${d.length} contacto(s) con errores de validación:

${l}

¿Deseas ver más detalles en la consola del navegador?`)&&console.table(d)}});const b=document.getElementById("cancel-duplicate-resolution");b&&(b.onclick=()=>{t.showDuplicateModal=!1,t.duplicates=[],f()});const E=document.getElementById("apply-resolution");E&&(E.onclick=Ae),document.querySelectorAll('input[name^="resolution-"]').forEach(d=>{d.addEventListener("change",()=>{const l=d.name.split("-")[1],u=document.getElementById(`merge-section-${l}`),g=document.getElementById(`individual-section-${l}`);d.value==="merge"?(u.style.display="block",g.style.display="none"):d.value==="select"?(u.style.display="none",g.style.display="block"):(u.style.display="none",g.style.display="none")})}),document.querySelectorAll('.resolution-option input[type="radio"]').forEach(d=>{d.addEventListener("change",()=>{const l=d.name;document.querySelectorAll(`input[name="${l}"]`).forEach(u=>{u.closest(".resolution-option").classList.remove("selected")}),d.closest(".resolution-option").classList.add("selected")})});const k=document.getElementById("unlock-notes-btn");k&&(k.onclick=()=>{t.selected!==null&&(t.pendingAction={type:"showContactNotes",contactIndex:t.selected}),V()?t.authMode="login":t.authMode="setup",t.showAuthModal=!0,f()});const I=document.getElementById("logout-btn");I&&(I.onclick=()=>{Me(),f()});const w=document.getElementById("auth-form");w&&!w.hasAttribute("data-handler-added")&&(w.setAttribute("data-handler-added","true"),w.onsubmit=d=>{d.preventDefault();const l=document.getElementById("auth-password").value.trim();if(!l){y("Por favor, introduce una contraseña","warning");return}if(t.authMode==="setup"){const u=document.getElementById("auth-password-confirm").value.trim();if(l!==u){y("Las contraseñas no coinciden","error");return}if(l.length<4){y("La contraseña debe tener al menos 4 caracteres","warning");return}Be(l),D.isAuthenticated=!0,D.sessionExpiry=Date.now()+30*60*1e3,t.showAuthModal=!1,w.reset(),setTimeout(()=>{ne()},100),f()}else Le(l)?(t.showAuthModal=!1,w.reset(),f()):(document.getElementById("auth-password").value="",document.getElementById("auth-password").focus())});const B=document.getElementById("cancel-auth");B&&(B.onclick=()=>{t.showAuthModal=!1,t.pendingAction=null,f()});const O=document.getElementById("auth-modal");if(O){O.onclick=u=>{u.target===O&&(t.showAuthModal=!1,t.pendingAction=null,f())};const d=document.getElementById("auth-password");if(d){const u=window.innerWidth<=700?300:100;setTimeout(()=>{d.focus(),window.innerWidth<=700&&d.scrollIntoView({behavior:"smooth",block:"center"})},u)}const l=u=>{u.key==="Escape"&&t.showAuthModal&&(t.showAuthModal=!1,t.pendingAction=null,f())};document.addEventListener("keydown",l)}}function ve(e){const o=[],n=e.split("END:VCARD");for(const a of n){const s=/FN:([^\n]*)/.exec(a)?.[1]?.trim(),c=/N:.*;([^;\n]*)/.exec(a)?.[1]?.trim()||"",p=/TEL.*:(.+)/.exec(a)?.[1]?.trim(),m=/EMAIL.*:(.+)/.exec(a)?.[1]?.trim();s&&o.push({name:s,surname:c,phone:p||"",email:m||"",notes:{},tags:[]})}return o}function ye(e){return e.map(o=>`BEGIN:VCARD
VERSION:3.0
FN:${o.name}
N:${o.surname||""};;;;
TEL:${o.phone||""}
EMAIL:${o.email||""}
END:VCARD`).join(`
`)}function Ee(e){const o=e.split(`
`).filter(Boolean),[n,...a]=o;return a.map(s=>{const[c,p,m,i,r,h]=s.split(",");return{name:c?.trim()||"",surname:p?.trim()||"",phone:m?.trim()||"",email:i?.trim()||"",notes:h?JSON.parse(h):{},tags:r?r.split(";").map(b=>b.trim()):[]}})}function xe(){const e=ye(t.contacts),o=new Blob([e],{type:"text/vcard"}),n=document.createElement("a");n.href=URL.createObjectURL(o),n.download="contactos.vcf",n.click()}function we(){const e="name,surname,phone,email,tags,notes",o=t.contacts.map(c=>[c.name,c.surname,c.phone,c.email,(c.tags||[]).join(";"),JSON.stringify(c.notes||{})].map(p=>'"'+String(p).replace(/"/g,'""')+'"').join(",")),n=[e,...o].join(`
`),a=new Blob([n],{type:"text/csv"}),s=document.createElement("a");s.href=URL.createObjectURL(a),s.download="contactos.csv",s.click()}function $e(){const e=new Blob([JSON.stringify(t.contacts,null,2)],{type:"application/json"}),o=document.createElement("a");o.href=URL.createObjectURL(e),o.download="contactos.json",o.click()}function Q(){const e=new Date,n=new Date(e.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);let a=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");a.find(s=>s.fecha===n)||(a.push({fecha:n,datos:t.contacts}),a.length>10&&(a=a.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(a))),localStorage.setItem("contactos_diarios_backup_fecha",n)}setInterval(Q,60*60*1e3);Q();function ke(){const e=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]"),o=document.getElementById("backup-info");o&&(e.length===0?o.textContent="Sin copias locales.":o.innerHTML="Últimas copias locales: "+e.map(n=>`<button class="restore-backup-btn" data-fecha="${n.fecha}">${n.fecha}</button>`).join(" "))}function Se(e){if(!confirm("¿Seguro que quieres restaurar la copia de seguridad del "+e+"? Se sobrescribirán los contactos actuales."))return;const n=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(a=>a.fecha===e);n?(t.contacts=n.datos,C(t.contacts),f(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}function ee(e,o){const n=a=>a?a.toLowerCase().replace(/\s+/g," ").trim():"";return!!(n(e.name)===n(o.name)&&n(e.surname)===n(o.surname)||e.phone&&o.phone&&e.phone.replace(/\s+/g,"")===o.phone.replace(/\s+/g,"")||e.email&&o.email&&n(e.email)===n(o.email))}function Ie(){const e=[],o=new Set;for(let n=0;n<t.contacts.length;n++){if(o.has(n))continue;const a=[{...t.contacts[n],originalIndex:n}];o.add(n);for(let s=n+1;s<t.contacts.length;s++)o.has(s)||ee(t.contacts[n],t.contacts[s])&&(a.push({...t.contacts[s],originalIndex:s}),o.add(s));a.length>1&&e.push({contacts:a})}return e}function te(e){if(e.length===0)return null;if(e.length===1)return e[0];const o={name:"",surname:"",phone:"",email:"",tags:[],notes:{},pinned:!1};let n="",a="";e.forEach(c=>{c.name&&c.name.length>n.length&&(n=c.name),c.surname&&c.surname.length>a.length&&(a=c.surname)}),o.name=n,o.surname=a,o.phone=e.find(c=>c.phone)?.phone||"",o.email=e.find(c=>c.email)?.email||"";const s=new Set;return e.forEach(c=>{c.tags&&c.tags.forEach(p=>s.add(p))}),o.tags=Array.from(s),e.forEach((c,p)=>{c.notes&&Object.entries(c.notes).forEach(([m,i])=>{o.notes[m]?o.notes[m]+=`
--- Contacto ${p+1} ---
${i}`:o.notes[m]=i})}),o.pinned=e.some(c=>c.pinned),o}function Ne(e){const o=te(e);return`
    <div class="merge-preview">
      <h5>🔗 Vista previa del contacto fusionado:</h5>
      <div class="contact-preview">
        <div class="contact-field"><strong>Nombre:</strong> ${o.name}</div>
        <div class="contact-field"><strong>Apellidos:</strong> ${o.surname}</div>
        <div class="contact-field"><strong>Teléfono:</strong> ${o.phone||"No especificado"}</div>
        <div class="contact-field"><strong>Email:</strong> ${o.email||"No especificado"}</div>
        <div class="contact-field">
          <strong>Etiquetas:</strong>
          <div class="tags">
            ${o.tags.map(n=>`<span class="tag">${n}</span>`).join("")}
          </div>
        </div>
        <div class="contact-field">
          <strong>Notas:</strong> ${Object.keys(o.notes).length} fecha(s) con notas
        </div>
        <div class="contact-field">
          <strong>Estado:</strong> ${o.pinned?"📌 Fijado":"Normal"}
        </div>
      </div>
    </div>
  `}function Ce({duplicates:e,visible:o}){return!o||e.length===0?'<div id="duplicate-modal" class="modal" style="display:none"></div>':`
    <div id="duplicate-modal" class="modal" style="display:flex;z-index:5000;">
      <div class="modal-content" style="max-width:800px;max-height:90vh;overflow-y:auto;">
        <h3>🔍 Gestión de contactos duplicados</h3>
        <p>Se encontraron <strong>${e.length}</strong> grupo(s) de contactos duplicados. 
           Para cada grupo, elige cómo resolverlo:</p>
        
        ${e.map((n,a)=>`
          <div class="duplicate-group" style="border:1px solid #ddd;border-radius:8px;padding:15px;margin:15px 0;background:#fafafa;">
            <h4>Grupo ${a+1} - ${n.contacts.length} contactos similares</h4>
            
            <!-- Opciones de resolución -->
            <div class="resolution-options">
              <label class="resolution-option">
                <input type="radio" name="resolution-${a}" value="merge" checked>
                🔗 Fusionar en un contacto
              </label>
              <label class="resolution-option">
                <input type="radio" name="resolution-${a}" value="select">
                👆 Seleccionar uno y eliminar otros
              </label>
              <label class="resolution-option">
                <input type="radio" name="resolution-${a}" value="skip">
                ⏭️ Omitir este grupo
              </label>
            </div>
            
            <!-- Vista previa de fusión (mostrar por defecto) -->
            <div class="merge-section" id="merge-section-${a}">
              ${Ne(n.contacts)}
            </div>
            
            <!-- Sección de selección individual (oculta por defecto) -->
            <div class="individual-selection" id="individual-section-${a}" style="display:none;">
              <h5>Selecciona el contacto a mantener:</h5>
              ${n.contacts.map((s,c)=>`
                <label class="duplicate-contact" style="display:block;margin:8px 0;padding:12px;border:1px solid #ccc;border-radius:6px;cursor:pointer;">
                  <input type="radio" name="keep-${a}" value="${s.originalIndex}">
                  <strong>${s.surname?s.surname+", ":""}${s.name}</strong>
                  ${s.phone?`📞 ${s.phone}`:""}
                  ${s.email?`✉️ ${s.email}`:""}
                  ${s.tags&&s.tags.length>0?`<br>🏷️ ${s.tags.join(", ")}`:""}
                  ${Object.keys(s.notes||{}).length>0?`<br>📝 ${Object.keys(s.notes).length} nota(s)`:""}
                  ${s.pinned?"<br>📌 Fijado":""}
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
  `}function Ae(){const e=[];let o=0;if(t.duplicates.forEach((c,p)=>{const m=document.querySelector(`input[name="resolution-${p}"]:checked`),i=m?m.value:"skip";if(i==="merge")e.push({type:"merge",groupIndex:p,contacts:c.contacts}),o++;else if(i==="select"){const r=document.querySelector(`input[name="keep-${p}"]:checked`);if(r){const h=parseInt(r.value),b=c.contacts.filter(E=>E.originalIndex!==h).map(E=>E.originalIndex);e.push({type:"delete",groupIndex:p,toDelete:b,toKeep:h}),o++}}}),o===0){y("No hay operaciones que realizar","info");return}const n=e.filter(c=>c.type==="merge").length,a=e.filter(c=>c.type==="delete").length;let s=`¿Confirmar las siguientes operaciones?

`;if(n>0&&(s+=`🔗 Fusionar ${n} grupo(s) de contactos
`),a>0&&(s+=`🗑️ Eliminar duplicados en ${a} grupo(s)
`),s+=`
Esta acción no se puede deshacer.`,!confirm(s)){y("Operación cancelada","info");return}try{let c=0,p=0;const m=[];e.forEach(b=>{if(b.type==="merge"){const E=te(b.contacts);t.contacts.push(E),b.contacts.forEach(k=>{m.push(k.originalIndex)}),c++}else b.type==="delete"&&(b.toDelete.forEach(E=>{m.push(E)}),p+=b.toDelete.length)}),[...new Set(m)].sort((b,E)=>E-b).forEach(b=>{b<t.contacts.length&&t.contacts.splice(b,1)}),C(t.contacts);let r="Resolución completada: ";const h=[];c>0&&h.push(`${c} contacto(s) fusionado(s)`),p>0&&h.push(`${p} duplicado(s) eliminado(s)`),r+=h.join(" y "),y(r,"success"),t.showDuplicateModal=!1,t.duplicates=[],f()}catch(c){y("Error al aplicar resolución: "+c.message,"error")}}const H="contactos_diarios_auth";let D={isAuthenticated:!1,sessionExpiry:null};function oe(e){let o=0;for(let n=0;n<e.length;n++){const a=e.charCodeAt(n);o=(o<<5)-o+a,o=o&o}return o.toString()}function Be(e){const o=oe(e);localStorage.setItem(H,o),y("Contraseña establecida correctamente","success")}function De(e){const o=localStorage.getItem(H);return o?oe(e)===o:!1}function V(){return localStorage.getItem(H)!==null}function Le(e){return De(e)?(D.isAuthenticated=!0,D.sessionExpiry=Date.now()+30*60*1e3,y("Autenticación exitosa","success"),setTimeout(()=>{ne()},100),!0):(y("Contraseña incorrecta","error"),!1)}function W(){return D.isAuthenticated?Date.now()>D.sessionExpiry?(D.isAuthenticated=!1,D.sessionExpiry=null,!1):!0:!1}function Me(){D.isAuthenticated=!1,D.sessionExpiry=null,y("Sesión cerrada","info")}function ne(){if(!t.pendingAction)return;const e=t.pendingAction;switch(t.pendingAction=null,e.type){case"showAllNotes":t.showAllNotes=!0,t.allNotesPage=1;break;case"addNote":t.addNoteContactIndex=e.contactIndex,t.showAddNoteModal=!0;break;case"showContactNotes":t.selected=e.contactIndex,t.editing=null;break}f()}function Oe({visible:e,mode:o="login"}){return`
    <div id="auth-modal" class="modal" style="display:${e?"flex":"none"};z-index:6000;">
      <div class="modal-content" style="max-width:400px;">
        <h3>${o==="setup"?"🔐 Establecer contraseña":"🔑 Acceso a notas privadas"}</h3>
        <p>${o==="setup"?"Establece una contraseña para proteger tus notas personales:":"Introduce tu contraseña para acceder a las notas:"}</p>
        
        <form id="auth-form">
          <label>
            Contraseña
            <input type="password" id="auth-password" placeholder="Introduce tu contraseña" required autocomplete="current-password" />
          </label>
          ${o==="setup"?`
            <label>
              Confirmar contraseña
              <input type="password" id="auth-password-confirm" placeholder="Confirma tu contraseña" required autocomplete="new-password" />
            </label>
          `:""}
          <div class="form-actions" style="margin-top:20px;">
            <button type="submit">${o==="setup"?"Establecer contraseña":"Acceder"}</button>
            <button type="button" id="cancel-auth">Cancelar</button>
          </div>
        </form>
        
        ${o==="login"?`
          <div style="margin-top:15px;padding-top:15px;border-top:1px solid #ddd;">
            <p style="font-size:0.9em;color:#666;">
              💡 La contraseña se almacena de forma segura en tu dispositivo
            </p>
          </div>
        `:""}
      </div>
    </div>
  `}async function ae(){console.log("🧹 Limpiando cache y forzando actualización...");try{if("caches"in window){const e=await caches.keys();await Promise.all(e.map(o=>(console.log("🗑️ Eliminando cache:",o),caches.delete(o))))}if("serviceWorker"in navigator){const e=await navigator.serviceWorker.getRegistrations();await Promise.all(e.map(o=>(console.log("🔄 Desregistrando SW:",o.scope),o.unregister())))}console.log("✅ Cache limpiado, recargando..."),window.location.reload()}catch(e){console.error("❌ Error limpiando cache:",e),window.location.reload()}}window.clearCacheAndReload=ae;document.addEventListener("keydown",e=>{e.ctrlKey&&e.shiftKey&&e.key==="R"&&(e.preventDefault(),ae())});async function Te(){console.log("🔍 Obteniendo versión del Service Worker...");try{if("serviceWorker"in navigator&&navigator.serviceWorker.controller){console.log("📡 Intentando comunicación directa con SW...");const n=new MessageChannel,a=new Promise((c,p)=>{const m=setTimeout(()=>{p(new Error("Timeout en comunicación con SW"))},3e3);n.port1.onmessage=i=>{clearTimeout(m),i.data&&i.data.type==="VERSION_RESPONSE"?(console.log("✅ Versión recibida del SW:",i.data.version),c(i.data.version)):p(new Error("Respuesta inválida del SW"))}});return navigator.serviceWorker.controller.postMessage({type:"GET_VERSION"},[n.port2]),await a}console.log("📄 SW no disponible, intentando fetch...");const e=`${Date.now()}-${Math.random().toString(36).substr(2,9)}`,o=[`/sw.js?v=${e}`,`/ContactosDiarios/sw.js?v=${e}`,`./sw.js?v=${e}`];for(const n of o)try{console.log(`🌐 Intentando fetch: ${n}`);const a=await fetch(n,{cache:"no-cache",headers:{"Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0"}});if(a.ok){const s=await a.text();console.log("📄 Código SW obtenido, longitud:",s.length);const c=[/CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/const\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/let\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/var\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/version['":]?\s*['"`]([0-9.]+)['"`]/i,/v?([0-9]+\.[0-9]+\.[0-9]+)/];for(const p of c){const m=s.match(p);if(m&&m[1])return console.log("✅ Versión encontrada:",m[1]),m[1]}console.log("⚠️ No se encontró versión en el código SW")}}catch(a){console.log(`❌ Error fetch ${n}:`,a.message)}return console.log("🔄 Usando versión fallback..."),"0.0.91"}catch(e){return console.error("❌ Error general obteniendo versión SW:",e),"0.0.91"}}async function P(){console.log("📋 Mostrando versión del Service Worker...");let e=document.getElementById("sw-version-info");e||(e=document.createElement("div"),e.id="sw-version-info",e.style.cssText=`
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
  `;try{const o=await Te();e.innerHTML=`
      <p class="version-text">Service Worker v${o}</p>
    `,console.log("✅ Versión del SW mostrada:",o)}catch(o){console.error("❌ Error mostrando versión SW:",o),e.innerHTML=`
      <p class="version-text">Service Worker v0.0.87</p>
    `}}async function Re(){console.log("🚀 Inicializando aplicación...");const e=P(),o=new Promise(a=>setTimeout(()=>a("timeout"),5e3));if(await Promise.race([e,o])==="timeout"){console.log("⏰ Timeout obteniendo versión SW, usando fallback");let a=document.getElementById("sw-version-info");a&&(a.innerHTML=`
        <p class="version-text">Service Worker v0.0.91</p>
      `)}"serviceWorker"in navigator&&(navigator.serviceWorker.addEventListener("controllerchange",()=>{console.log("🔄 Service Worker actualizado, refrescando versión..."),setTimeout(()=>P(),500)}),navigator.serviceWorker.ready.then(()=>{console.log("✅ Service Worker listo, actualizando versión..."),setTimeout(()=>P(),2e3)}).catch(a=>{console.log("❌ Error esperando SW ready:",a)}),navigator.serviceWorker.addEventListener("message",a=>{a.data&&a.data.type==="SW_UPDATED"&&(console.log("📢 Service Worker actualizado a versión:",a.data.version),ge(a.data.version),P())}))}let se=0,R=!1;function Pe(){let e=null;window.addEventListener("scroll",()=>{R=!0,clearTimeout(e),e=setTimeout(()=>{R=!1},100)},{passive:!0}),document.addEventListener("touchstart",()=>{se=Date.now()},{passive:!0}),document.addEventListener("touchmove",()=>{R=!0},{passive:!0}),document.addEventListener("touchend",()=>{setTimeout(()=>{R=!1},100)},{passive:!0})}function j(e){if(e&&(e.classList.contains("add-note-contact")||e.classList.contains("edit-contact")||e.classList.contains("delete-contact")||e.classList.contains("pin-contact")||e.classList.contains("select-contact")))return!0;const o=Date.now()-se;return!R&&o>150}document.addEventListener("DOMContentLoaded",()=>{try{console.log("=== 📱 INICIO DEBUG MÓVIL ==="),console.log("🌐 URL:",window.location.href),console.log("📱 User Agent:",navigator.userAgent),console.log("📊 Screen:",screen.width+"x"+screen.height),console.log("🖥️ Viewport:",window.innerWidth+"x"+window.innerHeight),console.log("🗂️ localStorage disponible:",!!window.localStorage),console.log("⚙️ Service Worker:","serviceWorker"in navigator),console.log("=================================");const e=document.getElementById("debug-trigger");e?(e.addEventListener("click",z),console.log("🐛 Botón de debug configurado")):console.log("❌ No se encontró el botón de debug"),console.log("🔄 Iniciando migración de contactos..."),je(),console.log("✅ Migración completada"),console.log("🎨 Iniciando render inicial..."),f(),console.log("✅ Render inicial completado"),console.log("⚙️ Inicializando app..."),Re(),console.log("✅ App inicializada"),console.log("💾 Mostrando info de backup..."),ke(),console.log("✅ Info backup mostrada"),console.log("📱 ContactosDiarios iniciado correctamente"),console.log("🆕 Nueva funcionalidad: Contactos recientemente editados"),console.log("💡 Usa Ctrl+Shift+R para limpiar cache y forzar actualización"),console.log("🔧 También disponible: window.clearCacheAndReload()")}catch(e){console.error("💥 ERROR CRÍTICO EN INICIALIZACIÓN:",e),console.error("Stack trace:",e.stack);const o=document.querySelector("#app");o&&(o.innerHTML=`
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
      `)}});function je(){let e=!1;const o=Date.now();t.contacts.forEach((n,a)=>{n.lastEdited||(n.lastEdited=n.createdAt||o-(t.contacts.length-a)*1e3*60*60,e=!0),n.createdAt||(n.createdAt=n.lastEdited,e=!0)}),e&&C(t.contacts)}async function _e(){try{const e={timestamp:new Date().toISOString(),url:window.location.href,userAgent:navigator.userAgent,screen:`${screen.width}x${screen.height}`,viewport:`${window.innerWidth}x${window.innerHeight}`,localStorage:!!window.localStorage,serviceWorker:"serviceWorker"in navigator,logs:M},o=`=== 📱 DEBUG MÓVIL EXPORT ===
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
Estado contactos: ${JSON.stringify(t,null,2)}
localStorage contactos: ${localStorage.getItem("contactos_diarios")}
=== FIN DEBUG ===`;if(navigator.clipboard&&navigator.clipboard.writeText)await navigator.clipboard.writeText(o),A("✅ Debug copiado al portapapeles"),_("📋 Debug copiado al portapapeles");else{const n=document.createElement("textarea");n.value=o,n.style.position="fixed",n.style.top="0",n.style.left="0",n.style.width="2em",n.style.height="2em",n.style.padding="0",n.style.border="none",n.style.outline="none",n.style.boxShadow="none",n.style.background="transparent",document.body.appendChild(n),n.focus(),n.select();try{if(document.execCommand("copy"))A("✅ Debug copiado al portapapeles (fallback)"),_("📋 Debug copiado (selecciona y copia manualmente si no funcionó)");else throw new Error("execCommand failed")}catch(a){A("❌ Error copiando al portapapeles:",a),_("❌ Error copiando. Selecciona todo el texto manualmente")}document.body.removeChild(n)}}catch(e){A("❌ Error en copyMobileLogsToClipboard:",e),_("❌ Error copiando logs")}}function _(e){const o=document.createElement("div");o.style.cssText=`
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
  `,o.textContent=e,document.body.appendChild(o),setTimeout(()=>{o.parentNode&&o.parentNode.removeChild(o)},3e3)}
