(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const d of n.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function a(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=a(i);fetch(i.href,n)}})();const z="0.0.97";(function(){try{const o=localStorage.getItem("app_version");if(o&&o!==z){const a=localStorage.getItem("contactos_diarios"),s=localStorage.getItem("contactos_diarios_backups"),i=localStorage.getItem("contactos_diarios_backup_fecha"),n=localStorage.getItem("contactos_diarios_webdav_config");["app_version","contactos_diarios","contactos_diarios_backups","contactos_diarios_backup_fecha","contactos_diarios_webdav_config"].forEach(u=>{u!=="contactos_diarios"&&localStorage.removeItem(u)}),"caches"in window&&caches.keys().then(u=>{u.forEach(f=>{(f.includes("contactosdiarios")||f.includes("contactos-diarios"))&&caches.delete(f)})}),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(u=>{u.forEach(f=>{f.scope.includes(window.location.origin)&&f.unregister()})}),a&&localStorage.setItem("contactos_diarios",a),s&&localStorage.setItem("contactos_diarios_backups",s),i&&localStorage.setItem("contactos_diarios_backup_fecha",i),n&&localStorage.setItem("contactos_diarios_webdav_config",n),location.reload()}localStorage.setItem("app_version",z)}catch{}})();function Q({contacts:e,filter:o,onSelect:a,onDelete:s}){let i=o?e.filter(n=>{const d=o.toLowerCase(),u=n.notes?Object.values(n.notes).join(" ").toLowerCase():"";return n.tags?.some(f=>f.toLowerCase().includes(d))||n.name?.toLowerCase().includes(d)||n.surname?.toLowerCase().includes(d)||u.includes(d)}):e;return i=i.slice().sort((n,d)=>{if(d.pinned&&!n.pinned)return 1;if(n.pinned&&!d.pinned)return-1;if(n.pinned===d.pinned){const u=n.lastEdited||0,f=d.lastEdited||0;return f!==u?f-u:(n.surname||"").localeCompare(d.surname||"")}return 0}),console.log("📋 Orden final:",i.map(n=>`${n.pinned?"📌":"📄"} ${n.name} (${n.lastEdited?new Date(n.lastEdited).toLocaleDateString()+" "+new Date(n.lastEdited).toLocaleTimeString():"Sin fecha"})`)),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${o||""}" />
      <ul>
        ${i.length===0?'<li class="empty">Sin contactos</li>':i.map((n,d)=>{const u=Date.now(),f=24*60*60*1e3,g=n.lastEdited&&u-n.lastEdited<f,w=g&&!n.pinned?" recently-edited":"";let b="";if(n.lastEdited){const y=u-n.lastEdited,I=Math.floor(y/(60*60*1e3)),D=Math.floor(y%(60*60*1e3)/(60*1e3));I<1?b=D<1?"Ahora":`${D}m`:I<24?b=`${I}h`:b=`${Math.floor(I/24)}d`}return`
          <li${n.pinned?' class="pinned"':w}>
            <div class="contact-main">
              <button class="select-contact" data-index="${e.indexOf(n)}">
                ${g&&!n.pinned?"🆕 ":""}${n.surname?n.surname+", ":""}${n.name}
                ${b&&g?`<span class="time-ago">(${b})</span>`:""}
              </button>
              <span class="tags">${(n.tags||[]).map(y=>`<span class='tag'>${y}</span>`).join(" ")}</span>
              <button class="pin-contact" data-index="${e.indexOf(n)}" title="${n.pinned?"Desfijar":"Fijar"}">${n.pinned?"📌":"📍"}</button>
            </div>
            <div class="contact-info">
              ${n.phone?`<a href="tel:${n.phone}" class="contact-link" title="Llamar"><span>📞</span> ${n.phone}</a>`:""}
              ${n.email?`<a href="mailto:${n.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${n.email}</a>`:""}
            </div>
            <div class="contact-actions">
              <button class="add-note-contact" data-index="${e.indexOf(n)}" title="Añadir nota">📝</button>
              <button class="edit-contact" data-index="${e.indexOf(n)}" title="Editar">✏️</button>
              <button class="delete-contact" data-index="${e.indexOf(n)}" title="Eliminar">🗑️</button>
            </div>
          </li>
          `}).join("")}
      </ul>
    </div>
  `}function ee({contact:e}){return`
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
  `}function te({notes:e}){if(!j())return`
      <div class="notes-area">
        <h3>🔒 Notas privadas protegidas</h3>
        <div style="text-align:center;padding:20px;background:#f8f9fa;border-radius:8px;margin:20px 0;">
          <p style="margin-bottom:15px;color:#666;">
            Las notas están protegidas con contraseña para mantener tu privacidad.
          </p>
          <button id="unlock-notes-btn" style="background:#3a4a7c;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;">
            🔓 Desbloquear notas
          </button>
          ${j()?`
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
        ${Object.entries(e||{}).sort((i,n)=>n[0].localeCompare(i[0])).map(([i,n])=>`
          <li>
            <b>${i}</b>:
            <span class="note-content" data-date="${i}">${n}</span>
            <button class="edit-note" data-date="${i}" title="Editar">✏️</button>
            <button class="delete-note" data-date="${i}" title="Eliminar">🗑️</button>
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
  `}function oe({}){return`
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
  `}function ne({contacts:e,visible:o,page:a=1}){let s=[];e.forEach((g,w)=>{g.notes&&Object.entries(g.notes).forEach(([b,y])=>{s.push({date:b,text:y,contact:g,contactIndex:w})})}),s.sort((g,w)=>w.date.localeCompare(g.date));const i=4,n=Math.max(1,Math.ceil(s.length/i)),d=Math.min(Math.max(a,1),n),u=(d-1)*i,f=s.slice(u,u+i);return`
    <div id="all-notes-modal" class="modal" style="display:${o?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${s.length===0?"<li>No hay notas registradas.</li>":f.map(g=>`
            <li>
              <b>${g.date}</b> — <span style="color:#3a4a7c">${g.contact.surname?g.contact.surname+", ":""}${g.contact.name}</span><br/>
              <span>${g.text}</span>
              <a href="#" class="edit-note-link" data-contact="${g.contactIndex}" data-date="${g.date}" style="margin-left:0.5em;color:#646cff;font-size:0.95em;">Editar nota</a>
            </li>
          `).join("")}
        </ul>
        <div class="pagination" style="display:flex;justify-content:center;align-items:center;gap:1em;margin:1em 0;">
          <button id="prev-notes-page" ${d===1?"disabled":""}>&lt; Anterior</button>
          <span>Página ${d} de ${n}</span>
          <button id="next-notes-page" ${d===n?"disabled":""}>Siguiente &gt;</button>
        </div>
        <div class="form-actions">
          <button id="close-all-notes">Cerrar</button>
        </div>
      </div>
    </div>
  `}function ae({visible:e,backups:o}){return`
    <div id="backup-modal" class="modal" style="display:${e?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:400px;">
        <h3>Restaurar copia local</h3>
        <div class="backup-btns" style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;">
          ${o.length===0?"<span>Sin copias locales.</span>":o.map(a=>`
            <div class="backup-btn-group" style="display:flex;align-items:center;gap:0.3rem;">
              <button class="restore-backup-btn" data-fecha="${a.fecha}">${a.fecha}</button>
              <button class="share-backup-btn" data-fecha="${a.fecha}" title="Compartir backup" style="background:#06b6d4;padding:0.4rem 0.7rem;font-size:1.1em;">📤</button>
            </div>
          `).join("")}
        </div>
        <div class="form-actions" style="margin-top:1.2rem;"><button id="close-backup-modal">Cerrar</button></div>
      </div>
    </div>
  `}function se({visible:e,contactIndex:o}){const a=o!==null?t.contacts[o]:null,s=new Date,n=new Date(s.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);return`
    <div id="add-note-modal" class="modal" style="display:${e?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:500px;">
        <h3>Añadir nota diaria</h3>
        ${a?`<p><strong>${a.surname?a.surname+", ":""}${a.name}</strong></p>`:""}
        <form id="add-note-form">
          <label>Fecha <input type="date" id="add-note-date" value="${n}" required /></label>
          <label>Nota <textarea id="add-note-text" rows="4" placeholder="Escribe una nota para este contacto..." required></textarea></label>
          <div class="form-actions">
            <button type="submit">Guardar nota</button>
            <button type="button" id="cancel-add-note">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `}function v(e,o="info"){let a=document.getElementById("notification-container");a||(a=document.createElement("div"),a.id="notification-container",a.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
      pointer-events: none;
    `,document.body.appendChild(a));const s=document.createElement("div");s.style.cssText=`
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
  `;const i=o==="success"?"✅":o==="error"?"❌":o==="warning"?"⚠️":"ℹ️";s.innerHTML=`${i} ${e}`,a.appendChild(s),setTimeout(()=>{s.style.opacity="1",s.style.transform="translateX(0)"},10);const n=()=>{s.style.opacity="0",s.style.transform="translateX(100%)",setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},300)};s.onclick=n,setTimeout(n,4e3)}function ie(e){console.log("📢 Mostrando notificación de actualización para versión:",e);const o=document.createElement("div");o.id="update-notification",o.innerHTML=`
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
  `;const a=document.getElementById("update-notification");a&&a.remove(),document.body.appendChild(o),setTimeout(()=>{document.getElementById("update-notification")&&ce()},1e4)}function ce(){const e=document.getElementById("update-notification");e&&(e.style.transform="translateX(100%)",e.style.transition="transform 0.3s ease",setTimeout(()=>e.remove(),300))}function _(e){const o=[];return!e.name||e.name.trim().length===0?o.push("El nombre es obligatorio"):e.name.trim().length<2?o.push("El nombre debe tener al menos 2 caracteres"):e.name.trim().length>50&&o.push("El nombre no puede tener más de 50 caracteres"),e.surname&&e.surname.trim().length>50&&o.push("Los apellidos no pueden tener más de 50 caracteres"),e.phone&&e.phone.trim().length>0&&(/^[\d\s\-\+\(\)\.]{6,20}$/.test(e.phone.trim())||o.push("El teléfono debe contener solo números, espacios y caracteres válidos (6-20 caracteres)")),e.email&&e.email.trim().length>0&&(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email.trim())?e.email.trim().length>100&&o.push("El email no puede tener más de 100 caracteres"):o.push("El email debe tener un formato válido")),o}function T(e){const o=[];return!e||e.trim().length===0?(o.push("La nota no puede estar vacía"),o):(e.trim().length>1e3&&o.push("La nota no puede tener más de 1000 caracteres"),e.trim().length<3&&o.push("La nota debe tener al menos 3 caracteres"),/^[\w\s\.\,\;\:\!\?\-\(\)\[\]\"\'\/\@\#\$\%\&\*\+\=\<\>\{\}\|\~\`\ñÑáéíóúÁÉÍÓÚüÜ]*$/.test(e)||o.push("La nota contiene caracteres no permitidos"),o)}const U="contactos_diarios";let t={contacts:re(),selected:null,notes:"",editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1,showAddNoteModal:!1,addNoteContactIndex:null,allNotesPage:1,duplicates:[],showDuplicateModal:!1,showAuthModal:!1,authMode:"login",pendingAction:null};function re(){try{return JSON.parse(localStorage.getItem(U))||[]}catch{return[]}}function k(e){localStorage.setItem(U,JSON.stringify(e))}function m(){const e=document.querySelector("#app"),o=t.editing!==null?t.contacts[t.editing]:null,a=t.selected!==null?t.contacts[t.selected].notes||{}:{};e.innerHTML=`
    <h1>Diario de Contactos</h1>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <div class="main-grid">
      <div>
        
        ${Q({contacts:t.contacts,filter:t.tagFilter})}
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
        ${t.editing!==null?ee({contact:o}):""}
        ${t.selected!==null&&t.editing===null?te({notes:a}):""}
      </div>
    </div>
    ${ne({contacts:t.contacts,visible:t.showAllNotes,page:t.allNotesPage})}
    ${ae({visible:t.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})} <!-- Modal de backup -->
    ${se({visible:t.showAddNoteModal,contactIndex:t.addNoteContactIndex})} <!-- Modal añadir nota -->
    ${Ee({duplicates:t.duplicates,visible:t.showDuplicateModal})} <!-- Modal de gestión de duplicados -->
    ${Ne({visible:t.showAuthModal,mode:t.authMode})} <!-- Modal de autenticación -->
    ${oe({})}
  `,le(),Ae();const s=document.getElementById("show-backup-modal");s&&(s.onclick=()=>{t.showBackupModal=!0,m()});const i=document.getElementById("close-backup-modal");i&&(i.onclick=()=>{t.showBackupModal=!1,m()}),document.querySelectorAll(".add-note-contact").forEach(u=>{u.onclick=f=>{const g=Number(u.dataset.index);if(!j()){t.pendingAction={type:"addNote",contactIndex:g},P()?t.authMode="login":t.authMode="setup",t.showAuthModal=!0,m();return}t.addNoteContactIndex=g,t.showAddNoteModal=!0,m()}});const n=document.getElementById("cancel-add-note");n&&(n.onclick=()=>{t.showAddNoteModal=!1,t.addNoteContactIndex=null,m()}),document.querySelectorAll(".restore-backup-btn").forEach(u=>{u.onclick=()=>ve(u.dataset.fecha)});const d=document.getElementById("restore-local-backup");d&&(d.onclick=restaurarBackupLocal)}let V=null;function le(){const e=document.getElementById("tag-filter");e&&e.addEventListener("input",r=>{clearTimeout(V),V=setTimeout(()=>{t.tagFilter=e.value,m();const c=document.getElementById("tag-filter");c&&(c.value=t.tagFilter,c.focus(),c.setSelectionRange(t.tagFilter.length,t.tagFilter.length))},300)});const o=document.getElementById("add-contact");o&&(o.onclick=()=>{t.editing=null,t.selected=null,m(),t.editing=t.contacts.length,m()}),document.querySelectorAll(".select-contact").forEach(r=>{r.onclick=c=>{c.preventDefault(),c.stopPropagation(),L(r)&&(t.selected=Number(r.dataset.index),t.editing=null,m())}}),document.querySelectorAll(".edit-contact").forEach(r=>{r.onclick=c=>{c.preventDefault(),c.stopPropagation(),L(r)&&(t.editing=Number(r.dataset.index),t.selected=null,m())}}),document.querySelectorAll(".delete-contact").forEach(r=>{r.onclick=c=>{if(c.preventDefault(),c.stopPropagation(),!L(r))return;const l=Number(r.dataset.index),p=t.contacts[l],h=p.surname?`${p.surname}, ${p.name}`:p.name;confirm(`¿Estás seguro de eliminar el contacto "${h}"?

Esta acción no se puede deshacer.`)&&(t.contacts.splice(l,1),k(t.contacts),v("Contacto eliminado correctamente","success"),t.selected=null,m())}}),document.querySelectorAll(".pin-contact").forEach(r=>{r.onclick=c=>{if(c.preventDefault(),c.stopPropagation(),!L(r))return;const l=Number(r.dataset.index);t.contacts[l].pinned&&!confirm("¿Seguro que quieres desfijar este contacto?")||(t.contacts[l].pinned=!t.contacts[l].pinned,k(t.contacts),m())}});const a=document.getElementById("contact-form");a&&(a.onsubmit=r=>{r.preventDefault();const c=Object.fromEntries(new FormData(a)),l=_(c);if(l.length>0){v("Error de validación: "+l.join(", "),"error");return}let p=c.tags?c.tags.split(",").map(S=>S.trim()).filter(Boolean):[];delete c.tags;const h={...c};t.contacts.some((S,$)=>t.editing!==null&&$===t.editing?!1:J(S,h))&&!confirm("Ya existe un contacto similar. ¿Deseas guardarlo de todas formas?")||(t.editing!==null&&t.editing<t.contacts.length?(t.contacts[t.editing]={...t.contacts[t.editing],...c,tags:p,lastEdited:Date.now()},console.log("✏️ Contacto editado:",t.contacts[t.editing].name,"lastEdited:",new Date().toLocaleString()),v("Contacto actualizado correctamente","success")):(t.contacts.push({...c,notes:{},tags:p,lastEdited:Date.now(),createdAt:Date.now()}),v("Contacto añadido correctamente","success")),k(t.contacts),t.editing=null,m())},document.getElementById("cancel-edit").onclick=()=>{t.editing=null,m()});const s=document.getElementById("add-note-form");if(s&&t.addNoteContactIndex!==null){const r=c=>{c.preventDefault();const l=document.getElementById("add-note-date").value,p=document.getElementById("add-note-text").value.trim();if(!l||!p){v("Por favor, selecciona una fecha y escribe una nota","warning");return}const h=T(p);if(h.length>0){v("Error en la nota: "+h.join(", "),"error");return}const E=t.addNoteContactIndex;t.contacts[E].notes||(t.contacts[E].notes={}),t.contacts[E].notes[l]?t.contacts[E].notes[l]+=`
`+p:t.contacts[E].notes[l]=p,t.contacts[E].lastEdited=Date.now(),k(t.contacts),v("Nota añadida correctamente","success"),t.showAddNoteModal=!1,t.addNoteContactIndex=null,m()};s.onsubmit=r}const i=document.getElementById("note-form");if(i&&t.selected!==null){const r=c=>{c.preventDefault();const l=document.getElementById("note-date").value,p=document.getElementById("note-text").value.trim();if(!l||!p){v("Por favor, selecciona una fecha y escribe una nota","warning");return}const h=T(p);if(h.length>0){v("Error en la nota: "+h.join(", "),"error");return}t.contacts[t.selected].notes||(t.contacts[t.selected].notes={}),t.contacts[t.selected].notes[l]?t.contacts[t.selected].notes[l]+=`
`+p:t.contacts[t.selected].notes[l]=p,t.contacts[t.selected].lastEdited=Date.now(),k(t.contacts),v("Nota guardada correctamente","success"),document.getElementById("note-text").value="",m()};i.onsubmit=r}document.querySelectorAll(".edit-note").forEach(r=>{r.onclick=c=>{const l=r.dataset.date,p=document.getElementById("edit-note-modal"),h=document.getElementById("edit-note-text");h.value=t.contacts[t.selected].notes[l],p.style.display="block",document.getElementById("save-edit-note").onclick=()=>{const E=h.value.trim(),S=T(E);if(S.length>0){v("Error en la nota: "+S.join(", "),"error");return}t.contacts[t.selected].notes[l]=E,t.contacts[t.selected].lastEdited=Date.now(),k(t.contacts),v("Nota actualizada correctamente","success"),p.style.display="none",m()},document.getElementById("cancel-edit-note").onclick=()=>{p.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(r=>{r.onclick=c=>{const l=r.dataset.date;confirm(`¿Estás seguro de eliminar la nota del ${l}?

Esta acción no se puede deshacer.`)&&(delete t.contacts[t.selected].notes[l],k(t.contacts),v("Nota eliminada correctamente","success"),m())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{me(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{fe(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{ge(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async r=>{const c=r.target.files[0];if(!c)return;const l=await c.text();let p=[];if(c.name.endsWith(".vcf"))p=de(l);else if(c.name.endsWith(".csv"))p=pe(l);else if(c.name.endsWith(".json"))try{const h=JSON.parse(l);Array.isArray(h)?p=h:h&&Array.isArray(h.contacts)&&(p=h.contacts)}catch{}if(p.length){const h=[],E=[];if(p.forEach((x,C)=>{const F=_(x);F.length===0?h.push(x):E.push({index:C+1,errors:F})}),E.length>0){const x=E.map(C=>`Contacto ${C.index}: ${C.errors.join(", ")}`).join(`
`);if(!confirm(`Se encontraron ${E.length} contacto(s) con errores:

${x}

¿Deseas importar solo los contactos válidos (${h.length})?`))return}const S=x=>t.contacts.some(C=>C.name===x.name&&C.surname===x.surname&&C.phone===x.phone),$=h.filter(x=>!S(x));$.length?(t.contacts=t.contacts.concat($),k(t.contacts),v(`${$.length} contacto(s) importado(s) correctamente`,"success"),m()):v("No se han importado contactos nuevos (todos ya existen)","info")}else v("No se pudieron importar contactos del archivo seleccionado","error")};const n=document.getElementById("close-all-notes");n&&(n.onclick=()=>{t.showAllNotes=!1,t.allNotesPage=1,m()});const d=document.getElementById("show-all-notes-btn");d&&(d.onclick=()=>{if(!j()){t.pendingAction={type:"showAllNotes"},P()?t.authMode="login":t.authMode="setup",t.showAuthModal=!0,m();return}t.showAllNotes=!0,t.allNotesPage=1,m()});const u=document.getElementById("prev-notes-page");u&&(u.onclick=()=>{t.allNotesPage>1&&(t.allNotesPage--,m())});const f=document.getElementById("next-notes-page");f&&(f.onclick=()=>{let r=[];t.contacts.forEach((l,p)=>{l.notes&&Object.entries(l.notes).forEach(([h,E])=>{r.push({date:h,text:E,contact:l,contactIndex:p})})});const c=Math.max(1,Math.ceil(r.length/4));t.allNotesPage<c&&(t.allNotesPage++,m())}),document.querySelectorAll(".edit-note-link").forEach(r=>{r.onclick=c=>{c.preventDefault();const l=Number(r.dataset.contact),p=r.dataset.date;t.selected=l,t.editing=null,t.showAllNotes=!1,m(),setTimeout(()=>{const h=document.querySelector(`.edit-note[data-date="${p}"]`);h&&h.click()},50)}}),document.querySelectorAll(".share-backup-btn").forEach(r=>{r.onclick=async()=>{const c=r.dataset.fecha,p=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(x=>x.fecha===c);if(!p)return alert("No se encontró la copia seleccionada.");const h=`contactos_backup_${c}.json`,E=JSON.stringify(p.datos,null,2),S=new Blob([E],{type:"application/json"}),$=document.createElement("a");if($.href=URL.createObjectURL(S),$.download=h,$.style.display="none",document.body.appendChild($),$.click(),setTimeout(()=>{URL.revokeObjectURL($.href),$.remove()},1e3),navigator.canShare&&window.File&&window.FileReader)try{const x=new File([S],h,{type:"application/json"});navigator.canShare({files:[x]})&&await navigator.share({files:[x],title:"Backup de Contactos",text:`Copia de seguridad (${c}) de ContactosDiarios`})}catch{}}});const g=document.getElementById("manage-duplicates-btn");g&&(g.onclick=()=>{t.duplicates=be(),t.duplicates.length===0?v("No se encontraron contactos duplicados","info"):(t.showDuplicateModal=!0,m())});const w=document.getElementById("validate-contacts-btn");w&&(w.onclick=()=>{const r=[];if(t.contacts.forEach((c,l)=>{const p=_(c);if(p.length>0){const h=c.surname?`${c.surname}, ${c.name}`:c.name;r.push({index:l+1,name:h,errors:p})}}),r.length===0)v(`✅ Todos los ${t.contacts.length} contactos son válidos`,"success");else{const c=r.map(l=>`${l.index}. ${l.name}: ${l.errors.join(", ")}`).join(`
`);v(`⚠️ Se encontraron ${r.length} contacto(s) con errores`,"warning"),console.log("Contactos con errores de validación:",r),confirm(`Se encontraron ${r.length} contacto(s) con errores de validación:

${c}

¿Deseas ver más detalles en la consola del navegador?`)&&console.table(r)}});const b=document.getElementById("cancel-duplicate-resolution");b&&(b.onclick=()=>{t.showDuplicateModal=!1,t.duplicates=[],m()});const y=document.getElementById("apply-resolution");y&&(y.onclick=we),document.querySelectorAll('input[name^="resolution-"]').forEach(r=>{r.addEventListener("change",()=>{const c=r.name.split("-")[1],l=document.getElementById(`merge-section-${c}`),p=document.getElementById(`individual-section-${c}`);r.value==="merge"?(l.style.display="block",p.style.display="none"):r.value==="select"?(l.style.display="none",p.style.display="block"):(l.style.display="none",p.style.display="none")})}),document.querySelectorAll('.resolution-option input[type="radio"]').forEach(r=>{r.addEventListener("change",()=>{const c=r.name;document.querySelectorAll(`input[name="${c}"]`).forEach(l=>{l.closest(".resolution-option").classList.remove("selected")}),r.closest(".resolution-option").classList.add("selected")})});const I=document.getElementById("unlock-notes-btn");I&&(I.onclick=()=>{t.selected!==null&&(t.pendingAction={type:"showContactNotes",contactIndex:t.selected}),P()?t.authMode="login":t.authMode="setup",t.showAuthModal=!0,m()});const D=document.getElementById("logout-btn");D&&(D.onclick=()=>{Se(),m()});const A=document.getElementById("auth-form");A&&!A.hasAttribute("data-handler-added")&&(A.setAttribute("data-handler-added","true"),A.onsubmit=r=>{r.preventDefault();const c=document.getElementById("auth-password").value.trim();if(!c){v("Por favor, introduce una contraseña","warning");return}if(t.authMode==="setup"){const l=document.getElementById("auth-password-confirm").value.trim();if(c!==l){v("Las contraseñas no coinciden","error");return}if(c.length<4){v("La contraseña debe tener al menos 4 caracteres","warning");return}xe(c),N.isAuthenticated=!0,N.sessionExpiry=Date.now()+30*60*1e3,t.showAuthModal=!1,A.reset(),setTimeout(()=>{X()},100),m()}else ke(c)?(t.showAuthModal=!1,A.reset(),m()):(document.getElementById("auth-password").value="",document.getElementById("auth-password").focus())});const q=document.getElementById("cancel-auth");q&&(q.onclick=()=>{t.showAuthModal=!1,t.pendingAction=null,m()});const O=document.getElementById("auth-modal");if(O){O.onclick=l=>{l.target===O&&(t.showAuthModal=!1,t.pendingAction=null,m())};const r=document.getElementById("auth-password");if(r){const l=window.innerWidth<=700?300:100;setTimeout(()=>{r.focus(),window.innerWidth<=700&&r.scrollIntoView({behavior:"smooth",block:"center"})},l)}const c=l=>{l.key==="Escape"&&t.showAuthModal&&(t.showAuthModal=!1,t.pendingAction=null,m())};document.addEventListener("keydown",c)}}function de(e){const o=[],a=e.split("END:VCARD");for(const s of a){const i=/FN:([^\n]*)/.exec(s)?.[1]?.trim(),n=/N:.*;([^;\n]*)/.exec(s)?.[1]?.trim()||"",d=/TEL.*:(.+)/.exec(s)?.[1]?.trim(),u=/EMAIL.*:(.+)/.exec(s)?.[1]?.trim();i&&o.push({name:i,surname:n,phone:d||"",email:u||"",notes:{},tags:[]})}return o}function ue(e){return e.map(o=>`BEGIN:VCARD
VERSION:3.0
FN:${o.name}
N:${o.surname||""};;;;
TEL:${o.phone||""}
EMAIL:${o.email||""}
END:VCARD`).join(`
`)}function pe(e){const o=e.split(`
`).filter(Boolean),[a,...s]=o;return s.map(i=>{const[n,d,u,f,g,w]=i.split(",");return{name:n?.trim()||"",surname:d?.trim()||"",phone:u?.trim()||"",email:f?.trim()||"",notes:w?JSON.parse(w):{},tags:g?g.split(";").map(b=>b.trim()):[]}})}function me(){const e=ue(t.contacts),o=new Blob([e],{type:"text/vcard"}),a=document.createElement("a");a.href=URL.createObjectURL(o),a.download="contactos.vcf",a.click()}function fe(){const e="name,surname,phone,email,tags,notes",o=t.contacts.map(n=>[n.name,n.surname,n.phone,n.email,(n.tags||[]).join(";"),JSON.stringify(n.notes||{})].map(d=>'"'+String(d).replace(/"/g,'""')+'"').join(",")),a=[e,...o].join(`
`),s=new Blob([a],{type:"text/csv"}),i=document.createElement("a");i.href=URL.createObjectURL(s),i.download="contactos.csv",i.click()}function ge(){const e=new Blob([JSON.stringify(t.contacts,null,2)],{type:"application/json"}),o=document.createElement("a");o.href=URL.createObjectURL(e),o.download="contactos.json",o.click()}function H(){const e=new Date,a=new Date(e.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);let s=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");s.find(i=>i.fecha===a)||(s.push({fecha:a,datos:t.contacts}),s.length>10&&(s=s.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(s))),localStorage.setItem("contactos_diarios_backup_fecha",a)}setInterval(H,60*60*1e3);H();function he(){const e=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]"),o=document.getElementById("backup-info");o&&(e.length===0?o.textContent="Sin copias locales.":o.innerHTML="Últimas copias locales: "+e.map(a=>`<button class="restore-backup-btn" data-fecha="${a.fecha}">${a.fecha}</button>`).join(" "))}function ve(e){if(!confirm("¿Seguro que quieres restaurar la copia de seguridad del "+e+"? Se sobrescribirán los contactos actuales."))return;const a=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(s=>s.fecha===e);a?(t.contacts=a.datos,k(t.contacts),m(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}function J(e,o){const a=s=>s?s.toLowerCase().replace(/\s+/g," ").trim():"";return!!(a(e.name)===a(o.name)&&a(e.surname)===a(o.surname)||e.phone&&o.phone&&e.phone.replace(/\s+/g,"")===o.phone.replace(/\s+/g,"")||e.email&&o.email&&a(e.email)===a(o.email))}function be(){const e=[],o=new Set;for(let a=0;a<t.contacts.length;a++){if(o.has(a))continue;const s=[{...t.contacts[a],originalIndex:a}];o.add(a);for(let i=a+1;i<t.contacts.length;i++)o.has(i)||J(t.contacts[a],t.contacts[i])&&(s.push({...t.contacts[i],originalIndex:i}),o.add(i));s.length>1&&e.push({contacts:s})}return e}function G(e){if(e.length===0)return null;if(e.length===1)return e[0];const o={name:"",surname:"",phone:"",email:"",tags:[],notes:{},pinned:!1};let a="",s="";e.forEach(n=>{n.name&&n.name.length>a.length&&(a=n.name),n.surname&&n.surname.length>s.length&&(s=n.surname)}),o.name=a,o.surname=s,o.phone=e.find(n=>n.phone)?.phone||"",o.email=e.find(n=>n.email)?.email||"";const i=new Set;return e.forEach(n=>{n.tags&&n.tags.forEach(d=>i.add(d))}),o.tags=Array.from(i),e.forEach((n,d)=>{n.notes&&Object.entries(n.notes).forEach(([u,f])=>{o.notes[u]?o.notes[u]+=`
--- Contacto ${d+1} ---
${f}`:o.notes[u]=f})}),o.pinned=e.some(n=>n.pinned),o}function ye(e){const o=G(e);return`
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
            ${o.tags.map(a=>`<span class="tag">${a}</span>`).join("")}
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
  `}function Ee({duplicates:e,visible:o}){return!o||e.length===0?'<div id="duplicate-modal" class="modal" style="display:none"></div>':`
    <div id="duplicate-modal" class="modal" style="display:flex;z-index:5000;">
      <div class="modal-content" style="max-width:800px;max-height:90vh;overflow-y:auto;">
        <h3>🔍 Gestión de contactos duplicados</h3>
        <p>Se encontraron <strong>${e.length}</strong> grupo(s) de contactos duplicados. 
           Para cada grupo, elige cómo resolverlo:</p>
        
        ${e.map((a,s)=>`
          <div class="duplicate-group" style="border:1px solid #ddd;border-radius:8px;padding:15px;margin:15px 0;background:#fafafa;">
            <h4>Grupo ${s+1} - ${a.contacts.length} contactos similares</h4>
            
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
              ${ye(a.contacts)}
            </div>
            
            <!-- Sección de selección individual (oculta por defecto) -->
            <div class="individual-selection" id="individual-section-${s}" style="display:none;">
              <h5>Selecciona el contacto a mantener:</h5>
              ${a.contacts.map((i,n)=>`
                <label class="duplicate-contact" style="display:block;margin:8px 0;padding:12px;border:1px solid #ccc;border-radius:6px;cursor:pointer;">
                  <input type="radio" name="keep-${s}" value="${i.originalIndex}">
                  <strong>${i.surname?i.surname+", ":""}${i.name}</strong>
                  ${i.phone?`📞 ${i.phone}`:""}
                  ${i.email?`✉️ ${i.email}`:""}
                  ${i.tags&&i.tags.length>0?`<br>🏷️ ${i.tags.join(", ")}`:""}
                  ${Object.keys(i.notes||{}).length>0?`<br>📝 ${Object.keys(i.notes).length} nota(s)`:""}
                  ${i.pinned?"<br>📌 Fijado":""}
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
  `}function we(){const e=[];let o=0;if(t.duplicates.forEach((n,d)=>{const u=document.querySelector(`input[name="resolution-${d}"]:checked`),f=u?u.value:"skip";if(f==="merge")e.push({type:"merge",groupIndex:d,contacts:n.contacts}),o++;else if(f==="select"){const g=document.querySelector(`input[name="keep-${d}"]:checked`);if(g){const w=parseInt(g.value),b=n.contacts.filter(y=>y.originalIndex!==w).map(y=>y.originalIndex);e.push({type:"delete",groupIndex:d,toDelete:b,toKeep:w}),o++}}}),o===0){v("No hay operaciones que realizar","info");return}const a=e.filter(n=>n.type==="merge").length,s=e.filter(n=>n.type==="delete").length;let i=`¿Confirmar las siguientes operaciones?

`;if(a>0&&(i+=`🔗 Fusionar ${a} grupo(s) de contactos
`),s>0&&(i+=`🗑️ Eliminar duplicados en ${s} grupo(s)
`),i+=`
Esta acción no se puede deshacer.`,!confirm(i)){v("Operación cancelada","info");return}try{let n=0,d=0;const u=[];e.forEach(b=>{if(b.type==="merge"){const y=G(b.contacts);t.contacts.push(y),b.contacts.forEach(I=>{u.push(I.originalIndex)}),n++}else b.type==="delete"&&(b.toDelete.forEach(y=>{u.push(y)}),d+=b.toDelete.length)}),[...new Set(u)].sort((b,y)=>y-b).forEach(b=>{b<t.contacts.length&&t.contacts.splice(b,1)}),k(t.contacts);let g="Resolución completada: ";const w=[];n>0&&w.push(`${n} contacto(s) fusionado(s)`),d>0&&w.push(`${d} duplicado(s) eliminado(s)`),g+=w.join(" y "),v(g,"success"),t.showDuplicateModal=!1,t.duplicates=[],m()}catch(n){v("Error al aplicar resolución: "+n.message,"error")}}const W="contactos_diarios_auth";let N={isAuthenticated:!1,sessionExpiry:null};function K(e){let o=0;for(let a=0;a<e.length;a++){const s=e.charCodeAt(a);o=(o<<5)-o+s,o=o&o}return o.toString()}function xe(e){const o=K(e);localStorage.setItem(W,o),v("Contraseña establecida correctamente","success")}function $e(e){const o=localStorage.getItem(W);return o?K(e)===o:!1}function P(){return localStorage.getItem(W)!==null}function ke(e){return $e(e)?(N.isAuthenticated=!0,N.sessionExpiry=Date.now()+30*60*1e3,v("Autenticación exitosa","success"),setTimeout(()=>{X()},100),!0):(v("Contraseña incorrecta","error"),!1)}function j(){return N.isAuthenticated?Date.now()>N.sessionExpiry?(N.isAuthenticated=!1,N.sessionExpiry=null,!1):!0:!1}function Se(){N.isAuthenticated=!1,N.sessionExpiry=null,v("Sesión cerrada","info")}function X(){if(!t.pendingAction)return;const e=t.pendingAction;switch(t.pendingAction=null,e.type){case"showAllNotes":t.showAllNotes=!0,t.allNotesPage=1;break;case"addNote":t.addNoteContactIndex=e.contactIndex,t.showAddNoteModal=!0;break;case"showContactNotes":t.selected=e.contactIndex,t.editing=null;break}m()}function Ne({visible:e,mode:o="login"}){return`
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
  `}async function Y(){console.log("🧹 Limpiando cache y forzando actualización...");try{if("caches"in window){const e=await caches.keys();await Promise.all(e.map(o=>(console.log("🗑️ Eliminando cache:",o),caches.delete(o))))}if("serviceWorker"in navigator){const e=await navigator.serviceWorker.getRegistrations();await Promise.all(e.map(o=>(console.log("🔄 Desregistrando SW:",o.scope),o.unregister())))}console.log("✅ Cache limpiado, recargando..."),window.location.reload()}catch(e){console.error("❌ Error limpiando cache:",e),window.location.reload()}}window.clearCacheAndReload=Y;document.addEventListener("keydown",e=>{e.ctrlKey&&e.shiftKey&&e.key==="R"&&(e.preventDefault(),Y())});async function Ie(){console.log("🔍 Obteniendo versión del Service Worker...");try{if("serviceWorker"in navigator&&navigator.serviceWorker.controller){console.log("📡 Intentando comunicación directa con SW...");const a=new MessageChannel,s=new Promise((n,d)=>{const u=setTimeout(()=>{d(new Error("Timeout en comunicación con SW"))},3e3);a.port1.onmessage=f=>{clearTimeout(u),f.data&&f.data.type==="VERSION_RESPONSE"?(console.log("✅ Versión recibida del SW:",f.data.version),n(f.data.version)):d(new Error("Respuesta inválida del SW"))}});return navigator.serviceWorker.controller.postMessage({type:"GET_VERSION"},[a.port2]),await s}console.log("📄 SW no disponible, intentando fetch...");const e=`${Date.now()}-${Math.random().toString(36).substr(2,9)}`,o=[`/sw.js?v=${e}`,`/ContactosDiarios/sw.js?v=${e}`,`./sw.js?v=${e}`];for(const a of o)try{console.log(`🌐 Intentando fetch: ${a}`);const s=await fetch(a,{cache:"no-cache",headers:{"Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0"}});if(s.ok){const i=await s.text();console.log("📄 Código SW obtenido, longitud:",i.length);const n=[/CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/const\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/let\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/var\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/version['":]?\s*['"`]([0-9.]+)['"`]/i,/v?([0-9]+\.[0-9]+\.[0-9]+)/];for(const d of n){const u=i.match(d);if(u&&u[1])return console.log("✅ Versión encontrada:",u[1]),u[1]}console.log("⚠️ No se encontró versión en el código SW")}}catch(s){console.log(`❌ Error fetch ${a}:`,s.message)}return console.log("🔄 Usando versión fallback..."),"0.0.91"}catch(e){return console.error("❌ Error general obteniendo versión SW:",e),"0.0.91"}}async function M(){console.log("📋 Mostrando versión del Service Worker...");let e=document.getElementById("sw-version-info");e||(e=document.createElement("div"),e.id="sw-version-info",e.style.cssText=`
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
  `;try{const o=await Ie();e.innerHTML=`
      <p class="version-text">Service Worker v${o}</p>
    `,console.log("✅ Versión del SW mostrada:",o)}catch(o){console.error("❌ Error mostrando versión SW:",o),e.innerHTML=`
      <p class="version-text">Service Worker v0.0.87</p>
    `}}async function Ce(){console.log("🚀 Inicializando aplicación...");const e=M(),o=new Promise(s=>setTimeout(()=>s("timeout"),5e3));if(await Promise.race([e,o])==="timeout"){console.log("⏰ Timeout obteniendo versión SW, usando fallback");let s=document.getElementById("sw-version-info");s&&(s.innerHTML=`
        <p class="version-text">Service Worker v0.0.91</p>
      `)}"serviceWorker"in navigator&&(navigator.serviceWorker.addEventListener("controllerchange",()=>{console.log("🔄 Service Worker actualizado, refrescando versión..."),setTimeout(()=>M(),500)}),navigator.serviceWorker.ready.then(()=>{console.log("✅ Service Worker listo, actualizando versión..."),setTimeout(()=>M(),2e3)}).catch(s=>{console.log("❌ Error esperando SW ready:",s)}),navigator.serviceWorker.addEventListener("message",s=>{s.data&&s.data.type==="SW_UPDATED"&&(console.log("📢 Service Worker actualizado a versión:",s.data.version),ie(s.data.version),M())}))}let Z=0,B=!1;function Ae(){let e=null;window.addEventListener("scroll",()=>{B=!0,clearTimeout(e),e=setTimeout(()=>{B=!1},100)},{passive:!0}),document.addEventListener("touchstart",()=>{Z=Date.now()},{passive:!0}),document.addEventListener("touchmove",()=>{B=!0},{passive:!0}),document.addEventListener("touchend",()=>{setTimeout(()=>{B=!1},100)},{passive:!0})}function L(e){if(e&&(e.classList.contains("add-note-contact")||e.classList.contains("edit-contact")||e.classList.contains("delete-contact")||e.classList.contains("pin-contact")||e.classList.contains("select-contact")))return console.log("🔘 Click permitido en botón:",e.className),!0;const o=Date.now()-Z,a=!B&&o>150;return console.log("🔍 isClickSafe check:",{isScrolling:B,timeSinceTouch:o,isSafe:a}),a}document.addEventListener("DOMContentLoaded",()=>{R(),m(),Ce(),he(),console.log("📱 ContactosDiarios iniciado correctamente"),console.log("🆕 Nueva funcionalidad: Contactos recientemente editados"),console.log("💡 Usa Ctrl+Shift+R para limpiar cache y forzar actualización"),console.log("🔧 También disponible: window.clearCacheAndReload()")});function R(){let e=!1;const o=Date.now();t.contacts.forEach((a,s)=>{a.lastEdited||(a.lastEdited=a.createdAt||o-(t.contacts.length-s)*1e3*60*60,e=!0,console.log(`📅 Migrado contacto ${a.name}: ${new Date(a.lastEdited).toLocaleString()}`)),a.createdAt||(a.createdAt=a.lastEdited,e=!0)}),e&&(k(t.contacts),console.log("📅 Contactos migrados con fechas de edición diferenciadas"))}document.addEventListener("DOMContentLoaded",()=>{R(),window.debugContacts=()=>{console.log("🔍 Estado actual de contactos:"),t.contacts.forEach((e,o)=>{console.log(`${o}: ${e.name} ${e.surname||""} - Fijado: ${e.pinned||!1} - LastEdited: ${e.lastEdited?new Date(e.lastEdited).toLocaleString():"Sin fecha"}`)})},window.simulateEdit=e=>{t.contacts[e]&&(t.contacts[e].lastEdited=Date.now(),k(t.contacts),m(),console.log(`✏️ Simulada edición de contacto ${e}: ${t.contacts[e].name}`))},window.resetDatesAndMigrate=()=>{t.contacts.forEach(e=>{delete e.lastEdited,delete e.createdAt}),k(t.contacts),R(),m(),console.log("🔄 Fechas reseteadas y migración forzada")}});
