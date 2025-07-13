(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const d of n.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function a(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=a(i);fetch(i.href,n)}})();const z="0.0.89";(function(){try{const o=localStorage.getItem("app_version");if(o&&o!==z){const a=localStorage.getItem("contactos_diarios"),s=localStorage.getItem("contactos_diarios_backups"),i=localStorage.getItem("contactos_diarios_backup_fecha"),n=localStorage.getItem("contactos_diarios_webdav_config");["app_version","contactos_diarios","contactos_diarios_backups","contactos_diarios_backup_fecha","contactos_diarios_webdav_config"].forEach(u=>{u!=="contactos_diarios"&&localStorage.removeItem(u)}),"caches"in window&&caches.keys().then(u=>{u.forEach(h=>{(h.includes("contactosdiarios")||h.includes("contactos-diarios"))&&caches.delete(h)})}),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(u=>{u.forEach(h=>{h.scope.includes(window.location.origin)&&h.unregister()})}),a&&localStorage.setItem("contactos_diarios",a),s&&localStorage.setItem("contactos_diarios_backups",s),i&&localStorage.setItem("contactos_diarios_backup_fecha",i),n&&localStorage.setItem("contactos_diarios_webdav_config",n),location.reload()}localStorage.setItem("app_version",z)}catch{}})();function Z({contacts:t,filter:o,onSelect:a,onDelete:s}){let i=o?t.filter(n=>{const d=o.toLowerCase(),u=n.notes?Object.values(n.notes).join(" ").toLowerCase():"";return n.tags?.some(h=>h.toLowerCase().includes(d))||n.name?.toLowerCase().includes(d)||n.surname?.toLowerCase().includes(d)||u.includes(d)}):t;return i=i.slice().sort((n,d)=>d.pinned&&!n.pinned?1:n.pinned&&!d.pinned?-1:(n.surname||"").localeCompare(d.surname||"")),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${o||""}" />
      <ul>
        ${i.length===0?'<li class="empty">Sin contactos</li>':i.map((n,d)=>`
          <li${n.pinned?' class="pinned"':""}>
            <div class="contact-main">
              <button class="select-contact" data-index="${t.indexOf(n)}">${n.surname?n.surname+", ":""}${n.name}</button>
              <span class="tags">${(n.tags||[]).map(u=>`<span class='tag'>${u}</span>`).join(" ")}</span>
              <button class="pin-contact" data-index="${t.indexOf(n)}" title="${n.pinned?"Desfijar":"Fijar"}">${n.pinned?"📌":"📍"}</button>
            </div>
            <div class="contact-info">
              ${n.phone?`<a href="tel:${n.phone}" class="contact-link" title="Llamar"><span>📞</span> ${n.phone}</a>`:""}
              ${n.email?`<a href="mailto:${n.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${n.email}</a>`:""}
            </div>
            <div class="contact-actions">
              <button class="add-note-contact" data-index="${t.indexOf(n)}" title="Añadir nota">📝</button>
              <button class="edit-contact" data-index="${t.indexOf(n)}" title="Editar">✏️</button>
              <button class="delete-contact" data-index="${t.indexOf(n)}" title="Eliminar">🗑️</button>
            </div>
          </li>
        `).join("")}
      </ul>
    </div>
  `}function Q({contact:t}){return`
    <form id="contact-form">
      <h2>${t?"Editar":"Nuevo"} contacto</h2>
      <label>Nombre <input name="name" placeholder="Nombre" value="${t?.name||""}" required /></label>
      <label>Apellidos <input name="surname" placeholder="Apellidos" value="${t?.surname||""}" required /></label>
      <label>Teléfono <input name="phone" placeholder="Teléfono" value="${t?.phone||""}" pattern="[0-9+-() ]*" /></label>
      <label>Email <input name="email" placeholder="Email" value="${t?.email||""}" type="email" /></label>
      <label>Etiquetas <input name="tags" placeholder="Ej: familia, trabajo" value="${t?.tags?.join(", ")||""}" /></label>
      <div class="form-actions">
        <button type="submit">Guardar</button>
        <button type="button" id="cancel-edit">Cancelar</button>
      </div>
    </form>
  `}function ee({notes:t}){if(!L())return`
      <div class="notes-area">
        <h3>🔒 Notas privadas protegidas</h3>
        <div style="text-align:center;padding:20px;background:#f8f9fa;border-radius:8px;margin:20px 0;">
          <p style="margin-bottom:15px;color:#666;">
            Las notas están protegidas con contraseña para mantener tu privacidad.
          </p>
          <button id="unlock-notes-btn" style="background:#3a4a7c;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;">
            🔓 Desbloquear notas
          </button>
          ${L()?`
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
        ${Object.entries(t||{}).sort((i,n)=>n[0].localeCompare(i[0])).map(([i,n])=>`
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
  `}function te({}){return`
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
  `}function oe({contacts:t,visible:o,page:a=1}){let s=[];t.forEach((b,x)=>{b.notes&&Object.entries(b.notes).forEach(([v,w])=>{s.push({date:v,text:w,contact:b,contactIndex:x})})}),s.sort((b,x)=>x.date.localeCompare(b.date));const i=4,n=Math.max(1,Math.ceil(s.length/i)),d=Math.min(Math.max(a,1),n),u=(d-1)*i,h=s.slice(u,u+i);return`
    <div id="all-notes-modal" class="modal" style="display:${o?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${s.length===0?"<li>No hay notas registradas.</li>":h.map(b=>`
            <li>
              <b>${b.date}</b> — <span style="color:#3a4a7c">${b.contact.surname?b.contact.surname+", ":""}${b.contact.name}</span><br/>
              <span>${b.text}</span>
              <a href="#" class="edit-note-link" data-contact="${b.contactIndex}" data-date="${b.date}" style="margin-left:0.5em;color:#646cff;font-size:0.95em;">Editar nota</a>
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
  `}function ne({visible:t,backups:o}){return`
    <div id="backup-modal" class="modal" style="display:${t?"flex":"none"};z-index:4000;">
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
  `}function ae({visible:t,contactIndex:o}){const a=o!==null?e.contacts[o]:null,s=new Date,n=new Date(s.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);return`
    <div id="add-note-modal" class="modal" style="display:${t?"flex":"none"};z-index:4000;">
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
  `}function g(t,o="info"){let a=document.getElementById("notification-container");a||(a=document.createElement("div"),a.id="notification-container",a.style.cssText=`
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
  `;const i=o==="success"?"✅":o==="error"?"❌":o==="warning"?"⚠️":"ℹ️";s.innerHTML=`${i} ${t}`,a.appendChild(s),setTimeout(()=>{s.style.opacity="1",s.style.transform="translateX(0)"},10);const n=()=>{s.style.opacity="0",s.style.transform="translateX(100%)",setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},300)};s.onclick=n,setTimeout(n,4e3)}function se(t){console.log("📢 Mostrando notificación de actualización para versión:",t);const o=document.createElement("div");o.id="update-notification",o.innerHTML=`
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
        Versión ${t} lista para usar
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
  `;const a=document.getElementById("update-notification");a&&a.remove(),document.body.appendChild(o),setTimeout(()=>{document.getElementById("update-notification")&&ie()},1e4)}function ie(){const t=document.getElementById("update-notification");t&&(t.style.transform="translateX(100%)",t.style.transition="transform 0.3s ease",setTimeout(()=>t.remove(),300))}function _(t){const o=[];return!t.name||t.name.trim().length===0?o.push("El nombre es obligatorio"):t.name.trim().length<2?o.push("El nombre debe tener al menos 2 caracteres"):t.name.trim().length>50&&o.push("El nombre no puede tener más de 50 caracteres"),t.surname&&t.surname.trim().length>50&&o.push("Los apellidos no pueden tener más de 50 caracteres"),t.phone&&t.phone.trim().length>0&&(/^[\d\s\-\+\(\)\.]{6,20}$/.test(t.phone.trim())||o.push("El teléfono debe contener solo números, espacios y caracteres válidos (6-20 caracteres)")),t.email&&t.email.trim().length>0&&(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.email.trim())?t.email.trim().length>100&&o.push("El email no puede tener más de 100 caracteres"):o.push("El email debe tener un formato válido")),o}function O(t){const o=[];return!t||t.trim().length===0?(o.push("La nota no puede estar vacía"),o):(t.trim().length>1e3&&o.push("La nota no puede tener más de 1000 caracteres"),t.trim().length<3&&o.push("La nota debe tener al menos 3 caracteres"),/^[\w\s\.\,\;\:\!\?\-\(\)\[\]\"\'\/\@\#\$\%\&\*\+\=\<\>\{\}\|\~\`\ñÑáéíóúÁÉÍÓÚüÜ]*$/.test(t)||o.push("La nota contiene caracteres no permitidos"),o)}const V="contactos_diarios";let e={contacts:ce(),selected:null,notes:"",editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1,showAddNoteModal:!1,addNoteContactIndex:null,allNotesPage:1,duplicates:[],showDuplicateModal:!1,showAuthModal:!1,authMode:"login",pendingAction:null};function ce(){try{return JSON.parse(localStorage.getItem(V))||[]}catch{return[]}}function S(t){localStorage.setItem(V,JSON.stringify(t))}function m(){const t=document.querySelector("#app"),o=e.editing!==null?e.contacts[e.editing]:null,a=e.selected!==null?e.contacts[e.selected].notes||{}:{};t.innerHTML=`
    <h1>Diario de Contactos</h1>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <div class="main-grid">
      <div>
        
        ${Z({contacts:e.contacts,filter:e.tagFilter})}
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
        ${e.editing!==null?Q({contact:o}):""}
        ${e.selected!==null&&e.editing===null?ee({notes:a}):""}
      </div>
    </div>
    ${oe({contacts:e.contacts,visible:e.showAllNotes,page:e.allNotesPage})}
    ${ne({visible:e.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})} <!-- Modal de backup -->
    ${ae({visible:e.showAddNoteModal,contactIndex:e.addNoteContactIndex})} <!-- Modal añadir nota -->
    ${ye({duplicates:e.duplicates,visible:e.showDuplicateModal})} <!-- Modal de gestión de duplicados -->
    ${Se({visible:e.showAuthModal,mode:e.authMode})} <!-- Modal de autenticación -->
    ${te({})}
  `,re(),Ce();const s=document.getElementById("show-backup-modal");s&&(s.onclick=()=>{e.showBackupModal=!0,m()});const i=document.getElementById("close-backup-modal");i&&(i.onclick=()=>{e.showBackupModal=!1,m()}),document.querySelectorAll(".add-note-contact").forEach(u=>{u.onclick=h=>{const b=Number(u.dataset.index);if(!L()){e.pendingAction={type:"addNote",contactIndex:b},T()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m();return}e.addNoteContactIndex=b,e.showAddNoteModal=!0,m()}});const n=document.getElementById("cancel-add-note");n&&(n.onclick=()=>{e.showAddNoteModal=!1,e.addNoteContactIndex=null,m()}),document.querySelectorAll(".restore-backup-btn").forEach(u=>{u.onclick=()=>he(u.dataset.fecha)});const d=document.getElementById("restore-local-backup");d&&(d.onclick=restaurarBackupLocal)}let F=null;function re(){const t=document.getElementById("tag-filter");t&&t.addEventListener("input",r=>{clearTimeout(F),F=setTimeout(()=>{e.tagFilter=t.value,m();const c=document.getElementById("tag-filter");c&&(c.value=e.tagFilter,c.focus(),c.setSelectionRange(e.tagFilter.length,e.tagFilter.length))},300)});const o=document.getElementById("add-contact");o&&(o.onclick=()=>{e.editing=null,e.selected=null,m(),e.editing=e.contacts.length,m()}),document.querySelectorAll(".select-contact").forEach(r=>{r.onclick=c=>{c.preventDefault(),c.stopPropagation(),D()&&(e.selected=Number(r.dataset.index),e.editing=null,m())}}),document.querySelectorAll(".edit-contact").forEach(r=>{r.onclick=c=>{c.preventDefault(),c.stopPropagation(),D()&&(e.editing=Number(r.dataset.index),e.selected=null,m())}}),document.querySelectorAll(".delete-contact").forEach(r=>{r.onclick=c=>{if(c.preventDefault(),c.stopPropagation(),!D())return;const l=Number(r.dataset.index),p=e.contacts[l],f=p.surname?`${p.surname}, ${p.name}`:p.name;confirm(`¿Estás seguro de eliminar el contacto "${f}"?

Esta acción no se puede deshacer.`)&&(e.contacts.splice(l,1),S(e.contacts),g("Contacto eliminado correctamente","success"),e.selected=null,m())}}),document.querySelectorAll(".pin-contact").forEach(r=>{r.onclick=c=>{if(c.preventDefault(),c.stopPropagation(),!D())return;const l=Number(r.dataset.index);e.contacts[l].pinned&&!confirm("¿Seguro que quieres desfijar este contacto?")||(e.contacts[l].pinned=!e.contacts[l].pinned,S(e.contacts),m())}});const a=document.getElementById("contact-form");a&&(a.onsubmit=r=>{r.preventDefault();const c=Object.fromEntries(new FormData(a)),l=_(c);if(l.length>0){g("Error de validación: "+l.join(", "),"error");return}let p=c.tags?c.tags.split(",").map($=>$.trim()).filter(Boolean):[];delete c.tags;const f={...c};e.contacts.some(($,k)=>e.editing!==null&&k===e.editing?!1:H($,f))&&!confirm("Ya existe un contacto similar. ¿Deseas guardarlo de todas formas?")||(e.editing!==null&&e.editing<e.contacts.length?(e.contacts[e.editing]={...e.contacts[e.editing],...c,tags:p},g("Contacto actualizado correctamente","success")):(e.contacts.push({...c,notes:{},tags:p}),g("Contacto añadido correctamente","success")),S(e.contacts),e.editing=null,m())},document.getElementById("cancel-edit").onclick=()=>{e.editing=null,m()});const s=document.getElementById("add-note-form");if(s&&e.addNoteContactIndex!==null){const r=c=>{c.preventDefault();const l=document.getElementById("add-note-date").value,p=document.getElementById("add-note-text").value.trim();if(!l||!p){g("Por favor, selecciona una fecha y escribe una nota","warning");return}const f=O(p);if(f.length>0){g("Error en la nota: "+f.join(", "),"error");return}const y=e.addNoteContactIndex;e.contacts[y].notes||(e.contacts[y].notes={}),e.contacts[y].notes[l]?e.contacts[y].notes[l]+=`
`+p:e.contacts[y].notes[l]=p,S(e.contacts),g("Nota añadida correctamente","success"),e.showAddNoteModal=!1,e.addNoteContactIndex=null,m()};s.onsubmit=r}const i=document.getElementById("note-form");if(i&&e.selected!==null){const r=c=>{c.preventDefault();const l=document.getElementById("note-date").value,p=document.getElementById("note-text").value.trim();if(!l||!p){g("Por favor, selecciona una fecha y escribe una nota","warning");return}const f=O(p);if(f.length>0){g("Error en la nota: "+f.join(", "),"error");return}e.contacts[e.selected].notes||(e.contacts[e.selected].notes={}),e.contacts[e.selected].notes[l]?e.contacts[e.selected].notes[l]+=`
`+p:e.contacts[e.selected].notes[l]=p,S(e.contacts),g("Nota guardada correctamente","success"),document.getElementById("note-text").value="",m()};i.onsubmit=r}document.querySelectorAll(".edit-note").forEach(r=>{r.onclick=c=>{const l=r.dataset.date,p=document.getElementById("edit-note-modal"),f=document.getElementById("edit-note-text");f.value=e.contacts[e.selected].notes[l],p.style.display="block",document.getElementById("save-edit-note").onclick=()=>{const y=f.value.trim(),$=O(y);if($.length>0){g("Error en la nota: "+$.join(", "),"error");return}e.contacts[e.selected].notes[l]=y,S(e.contacts),g("Nota actualizada correctamente","success"),p.style.display="none",m()},document.getElementById("cancel-edit-note").onclick=()=>{p.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(r=>{r.onclick=c=>{const l=r.dataset.date;confirm(`¿Estás seguro de eliminar la nota del ${l}?

Esta acción no se puede deshacer.`)&&(delete e.contacts[e.selected].notes[l],S(e.contacts),g("Nota eliminada correctamente","success"),m())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{pe(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{me(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{fe(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async r=>{const c=r.target.files[0];if(!c)return;const l=await c.text();let p=[];if(c.name.endsWith(".vcf"))p=le(l);else if(c.name.endsWith(".csv"))p=ue(l);else if(c.name.endsWith(".json"))try{const f=JSON.parse(l);Array.isArray(f)?p=f:f&&Array.isArray(f.contacts)&&(p=f.contacts)}catch{}if(p.length){const f=[],y=[];if(p.forEach((E,N)=>{const q=_(E);q.length===0?f.push(E):y.push({index:N+1,errors:q})}),y.length>0){const E=y.map(N=>`Contacto ${N.index}: ${N.errors.join(", ")}`).join(`
`);if(!confirm(`Se encontraron ${y.length} contacto(s) con errores:

${E}

¿Deseas importar solo los contactos válidos (${f.length})?`))return}const $=E=>e.contacts.some(N=>N.name===E.name&&N.surname===E.surname&&N.phone===E.phone),k=f.filter(E=>!$(E));k.length?(e.contacts=e.contacts.concat(k),S(e.contacts),g(`${k.length} contacto(s) importado(s) correctamente`,"success"),m()):g("No se han importado contactos nuevos (todos ya existen)","info")}else g("No se pudieron importar contactos del archivo seleccionado","error")};const n=document.getElementById("close-all-notes");n&&(n.onclick=()=>{e.showAllNotes=!1,e.allNotesPage=1,m()});const d=document.getElementById("show-all-notes-btn");d&&(d.onclick=()=>{if(!L()){e.pendingAction={type:"showAllNotes"},T()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m();return}e.showAllNotes=!0,e.allNotesPage=1,m()});const u=document.getElementById("prev-notes-page");u&&(u.onclick=()=>{e.allNotesPage>1&&(e.allNotesPage--,m())});const h=document.getElementById("next-notes-page");h&&(h.onclick=()=>{let r=[];e.contacts.forEach((l,p)=>{l.notes&&Object.entries(l.notes).forEach(([f,y])=>{r.push({date:f,text:y,contact:l,contactIndex:p})})});const c=Math.max(1,Math.ceil(r.length/4));e.allNotesPage<c&&(e.allNotesPage++,m())}),document.querySelectorAll(".edit-note-link").forEach(r=>{r.onclick=c=>{c.preventDefault();const l=Number(r.dataset.contact),p=r.dataset.date;e.selected=l,e.editing=null,e.showAllNotes=!1,m(),setTimeout(()=>{const f=document.querySelector(`.edit-note[data-date="${p}"]`);f&&f.click()},50)}}),document.querySelectorAll(".share-backup-btn").forEach(r=>{r.onclick=async()=>{const c=r.dataset.fecha,p=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(E=>E.fecha===c);if(!p)return alert("No se encontró la copia seleccionada.");const f=`contactos_backup_${c}.json`,y=JSON.stringify(p.datos,null,2),$=new Blob([y],{type:"application/json"}),k=document.createElement("a");if(k.href=URL.createObjectURL($),k.download=f,k.style.display="none",document.body.appendChild(k),k.click(),setTimeout(()=>{URL.revokeObjectURL(k.href),k.remove()},1e3),navigator.canShare&&window.File&&window.FileReader)try{const E=new File([$],f,{type:"application/json"});navigator.canShare({files:[E]})&&await navigator.share({files:[E],title:"Backup de Contactos",text:`Copia de seguridad (${c}) de ContactosDiarios`})}catch{}}});const b=document.getElementById("manage-duplicates-btn");b&&(b.onclick=()=>{e.duplicates=be(),e.duplicates.length===0?g("No se encontraron contactos duplicados","info"):(e.showDuplicateModal=!0,m())});const x=document.getElementById("validate-contacts-btn");x&&(x.onclick=()=>{const r=[];if(e.contacts.forEach((c,l)=>{const p=_(c);if(p.length>0){const f=c.surname?`${c.surname}, ${c.name}`:c.name;r.push({index:l+1,name:f,errors:p})}}),r.length===0)g(`✅ Todos los ${e.contacts.length} contactos son válidos`,"success");else{const c=r.map(l=>`${l.index}. ${l.name}: ${l.errors.join(", ")}`).join(`
`);g(`⚠️ Se encontraron ${r.length} contacto(s) con errores`,"warning"),console.log("Contactos con errores de validación:",r),confirm(`Se encontraron ${r.length} contacto(s) con errores de validación:

${c}

¿Deseas ver más detalles en la consola del navegador?`)&&console.table(r)}});const v=document.getElementById("cancel-duplicate-resolution");v&&(v.onclick=()=>{e.showDuplicateModal=!1,e.duplicates=[],m()});const w=document.getElementById("apply-resolution");w&&(w.onclick=xe),document.querySelectorAll('input[name^="resolution-"]').forEach(r=>{r.addEventListener("change",()=>{const c=r.name.split("-")[1],l=document.getElementById(`merge-section-${c}`),p=document.getElementById(`individual-section-${c}`);r.value==="merge"?(l.style.display="block",p.style.display="none"):r.value==="select"?(l.style.display="none",p.style.display="block"):(l.style.display="none",p.style.display="none")})}),document.querySelectorAll('.resolution-option input[type="radio"]').forEach(r=>{r.addEventListener("change",()=>{const c=r.name;document.querySelectorAll(`input[name="${c}"]`).forEach(l=>{l.closest(".resolution-option").classList.remove("selected")}),r.closest(".resolution-option").classList.add("selected")})});const B=document.getElementById("unlock-notes-btn");B&&(B.onclick=()=>{e.selected!==null&&(e.pendingAction={type:"showContactNotes",contactIndex:e.selected}),T()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m()});const R=document.getElementById("logout-btn");R&&(R.onclick=()=>{$e(),m()});const C=document.getElementById("auth-form");C&&!C.hasAttribute("data-handler-added")&&(C.setAttribute("data-handler-added","true"),C.onsubmit=r=>{r.preventDefault();const c=document.getElementById("auth-password").value.trim();if(!c){g("Por favor, introduce una contraseña","warning");return}if(e.authMode==="setup"){const l=document.getElementById("auth-password-confirm").value.trim();if(c!==l){g("Las contraseñas no coinciden","error");return}if(c.length<4){g("La contraseña debe tener al menos 4 caracteres","warning");return}Ee(c),I.isAuthenticated=!0,I.sessionExpiry=Date.now()+30*60*1e3,e.showAuthModal=!1,C.reset(),setTimeout(()=>{K()},100),m()}else ke(c)?(e.showAuthModal=!1,C.reset(),m()):(document.getElementById("auth-password").value="",document.getElementById("auth-password").focus())});const W=document.getElementById("cancel-auth");W&&(W.onclick=()=>{e.showAuthModal=!1,e.pendingAction=null,m()});const j=document.getElementById("auth-modal");if(j){j.onclick=l=>{l.target===j&&(e.showAuthModal=!1,e.pendingAction=null,m())};const r=document.getElementById("auth-password");if(r){const l=window.innerWidth<=700?300:100;setTimeout(()=>{r.focus(),window.innerWidth<=700&&r.scrollIntoView({behavior:"smooth",block:"center"})},l)}const c=l=>{l.key==="Escape"&&e.showAuthModal&&(e.showAuthModal=!1,e.pendingAction=null,m())};document.addEventListener("keydown",c)}}function le(t){const o=[],a=t.split("END:VCARD");for(const s of a){const i=/FN:([^\n]*)/.exec(s)?.[1]?.trim(),n=/N:.*;([^;\n]*)/.exec(s)?.[1]?.trim()||"",d=/TEL.*:(.+)/.exec(s)?.[1]?.trim(),u=/EMAIL.*:(.+)/.exec(s)?.[1]?.trim();i&&o.push({name:i,surname:n,phone:d||"",email:u||"",notes:{},tags:[]})}return o}function de(t){return t.map(o=>`BEGIN:VCARD
VERSION:3.0
FN:${o.name}
N:${o.surname||""};;;;
TEL:${o.phone||""}
EMAIL:${o.email||""}
END:VCARD`).join(`
`)}function ue(t){const o=t.split(`
`).filter(Boolean),[a,...s]=o;return s.map(i=>{const[n,d,u,h,b,x]=i.split(",");return{name:n?.trim()||"",surname:d?.trim()||"",phone:u?.trim()||"",email:h?.trim()||"",notes:x?JSON.parse(x):{},tags:b?b.split(";").map(v=>v.trim()):[]}})}function pe(){const t=de(e.contacts),o=new Blob([t],{type:"text/vcard"}),a=document.createElement("a");a.href=URL.createObjectURL(o),a.download="contactos.vcf",a.click()}function me(){const t="name,surname,phone,email,tags,notes",o=e.contacts.map(n=>[n.name,n.surname,n.phone,n.email,(n.tags||[]).join(";"),JSON.stringify(n.notes||{})].map(d=>'"'+String(d).replace(/"/g,'""')+'"').join(",")),a=[t,...o].join(`
`),s=new Blob([a],{type:"text/csv"}),i=document.createElement("a");i.href=URL.createObjectURL(s),i.download="contactos.csv",i.click()}function fe(){const t=new Blob([JSON.stringify(e.contacts,null,2)],{type:"application/json"}),o=document.createElement("a");o.href=URL.createObjectURL(t),o.download="contactos.json",o.click()}function U(){const t=new Date,a=new Date(t.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);let s=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");s.find(i=>i.fecha===a)||(s.push({fecha:a,datos:e.contacts}),s.length>10&&(s=s.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(s))),localStorage.setItem("contactos_diarios_backup_fecha",a)}setInterval(U,60*60*1e3);U();function ge(){const t=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]"),o=document.getElementById("backup-info");o&&(t.length===0?o.textContent="Sin copias locales.":o.innerHTML="Últimas copias locales: "+t.map(a=>`<button class="restore-backup-btn" data-fecha="${a.fecha}">${a.fecha}</button>`).join(" "))}function he(t){if(!confirm("¿Seguro que quieres restaurar la copia de seguridad del "+t+"? Se sobrescribirán los contactos actuales."))return;const a=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(s=>s.fecha===t);a?(e.contacts=a.datos,S(e.contacts),m(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}function H(t,o){const a=s=>s?s.toLowerCase().replace(/\s+/g," ").trim():"";return!!(a(t.name)===a(o.name)&&a(t.surname)===a(o.surname)||t.phone&&o.phone&&t.phone.replace(/\s+/g,"")===o.phone.replace(/\s+/g,"")||t.email&&o.email&&a(t.email)===a(o.email))}function be(){const t=[],o=new Set;for(let a=0;a<e.contacts.length;a++){if(o.has(a))continue;const s=[{...e.contacts[a],originalIndex:a}];o.add(a);for(let i=a+1;i<e.contacts.length;i++)o.has(i)||H(e.contacts[a],e.contacts[i])&&(s.push({...e.contacts[i],originalIndex:i}),o.add(i));s.length>1&&t.push({contacts:s})}return t}function J(t){if(t.length===0)return null;if(t.length===1)return t[0];const o={name:"",surname:"",phone:"",email:"",tags:[],notes:{},pinned:!1};let a="",s="";t.forEach(n=>{n.name&&n.name.length>a.length&&(a=n.name),n.surname&&n.surname.length>s.length&&(s=n.surname)}),o.name=a,o.surname=s,o.phone=t.find(n=>n.phone)?.phone||"",o.email=t.find(n=>n.email)?.email||"";const i=new Set;return t.forEach(n=>{n.tags&&n.tags.forEach(d=>i.add(d))}),o.tags=Array.from(i),t.forEach((n,d)=>{n.notes&&Object.entries(n.notes).forEach(([u,h])=>{o.notes[u]?o.notes[u]+=`
--- Contacto ${d+1} ---
${h}`:o.notes[u]=h})}),o.pinned=t.some(n=>n.pinned),o}function ve(t){const o=J(t);return`
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
  `}function ye({duplicates:t,visible:o}){return!o||t.length===0?'<div id="duplicate-modal" class="modal" style="display:none"></div>':`
    <div id="duplicate-modal" class="modal" style="display:flex;z-index:5000;">
      <div class="modal-content" style="max-width:800px;max-height:90vh;overflow-y:auto;">
        <h3>🔍 Gestión de contactos duplicados</h3>
        <p>Se encontraron <strong>${t.length}</strong> grupo(s) de contactos duplicados. 
           Para cada grupo, elige cómo resolverlo:</p>
        
        ${t.map((a,s)=>`
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
              ${ve(a.contacts)}
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
  `}function xe(){const t=[];let o=0;if(e.duplicates.forEach((n,d)=>{const u=document.querySelector(`input[name="resolution-${d}"]:checked`),h=u?u.value:"skip";if(h==="merge")t.push({type:"merge",groupIndex:d,contacts:n.contacts}),o++;else if(h==="select"){const b=document.querySelector(`input[name="keep-${d}"]:checked`);if(b){const x=parseInt(b.value),v=n.contacts.filter(w=>w.originalIndex!==x).map(w=>w.originalIndex);t.push({type:"delete",groupIndex:d,toDelete:v,toKeep:x}),o++}}}),o===0){g("No hay operaciones que realizar","info");return}const a=t.filter(n=>n.type==="merge").length,s=t.filter(n=>n.type==="delete").length;let i=`¿Confirmar las siguientes operaciones?

`;if(a>0&&(i+=`🔗 Fusionar ${a} grupo(s) de contactos
`),s>0&&(i+=`🗑️ Eliminar duplicados en ${s} grupo(s)
`),i+=`
Esta acción no se puede deshacer.`,!confirm(i)){g("Operación cancelada","info");return}try{let n=0,d=0;const u=[];t.forEach(v=>{if(v.type==="merge"){const w=J(v.contacts);e.contacts.push(w),v.contacts.forEach(B=>{u.push(B.originalIndex)}),n++}else v.type==="delete"&&(v.toDelete.forEach(w=>{u.push(w)}),d+=v.toDelete.length)}),[...new Set(u)].sort((v,w)=>w-v).forEach(v=>{v<e.contacts.length&&e.contacts.splice(v,1)}),S(e.contacts);let b="Resolución completada: ";const x=[];n>0&&x.push(`${n} contacto(s) fusionado(s)`),d>0&&x.push(`${d} duplicado(s) eliminado(s)`),b+=x.join(" y "),g(b,"success"),e.showDuplicateModal=!1,e.duplicates=[],m()}catch(n){g("Error al aplicar resolución: "+n.message,"error")}}const P="contactos_diarios_auth";let I={isAuthenticated:!1,sessionExpiry:null};function G(t){let o=0;for(let a=0;a<t.length;a++){const s=t.charCodeAt(a);o=(o<<5)-o+s,o=o&o}return o.toString()}function Ee(t){const o=G(t);localStorage.setItem(P,o),g("Contraseña establecida correctamente","success")}function we(t){const o=localStorage.getItem(P);return o?G(t)===o:!1}function T(){return localStorage.getItem(P)!==null}function ke(t){return we(t)?(I.isAuthenticated=!0,I.sessionExpiry=Date.now()+30*60*1e3,g("Autenticación exitosa","success"),setTimeout(()=>{K()},100),!0):(g("Contraseña incorrecta","error"),!1)}function L(){return I.isAuthenticated?Date.now()>I.sessionExpiry?(I.isAuthenticated=!1,I.sessionExpiry=null,!1):!0:!1}function $e(){I.isAuthenticated=!1,I.sessionExpiry=null,g("Sesión cerrada","info")}function K(){if(!e.pendingAction)return;const t=e.pendingAction;switch(e.pendingAction=null,t.type){case"showAllNotes":e.showAllNotes=!0,e.allNotesPage=1;break;case"addNote":e.addNoteContactIndex=t.contactIndex,e.showAddNoteModal=!0;break;case"showContactNotes":e.selected=t.contactIndex,e.editing=null;break}m()}function Se({visible:t,mode:o="login"}){return`
    <div id="auth-modal" class="modal" style="display:${t?"flex":"none"};z-index:6000;">
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
  `}async function X(){console.log("🧹 Limpiando cache y forzando actualización...");try{if("caches"in window){const t=await caches.keys();await Promise.all(t.map(o=>(console.log("🗑️ Eliminando cache:",o),caches.delete(o))))}if("serviceWorker"in navigator){const t=await navigator.serviceWorker.getRegistrations();await Promise.all(t.map(o=>(console.log("🔄 Desregistrando SW:",o.scope),o.unregister())))}console.log("✅ Cache limpiado, recargando..."),window.location.reload()}catch(t){console.error("❌ Error limpiando cache:",t),window.location.reload()}}window.clearCacheAndReload=X;document.addEventListener("keydown",t=>{t.ctrlKey&&t.shiftKey&&t.key==="R"&&(t.preventDefault(),X())});async function Ie(){console.log("🔍 Obteniendo versión del Service Worker...");try{if("serviceWorker"in navigator&&navigator.serviceWorker.controller){console.log("📡 Intentando comunicación directa con SW...");const a=new MessageChannel,s=new Promise((n,d)=>{const u=setTimeout(()=>{d(new Error("Timeout en comunicación con SW"))},3e3);a.port1.onmessage=h=>{clearTimeout(u),h.data&&h.data.type==="VERSION_RESPONSE"?(console.log("✅ Versión recibida del SW:",h.data.version),n(h.data.version)):d(new Error("Respuesta inválida del SW"))}});return navigator.serviceWorker.controller.postMessage({type:"GET_VERSION"},[a.port2]),await s}console.log("📄 SW no disponible, intentando fetch...");const t=`${Date.now()}-${Math.random().toString(36).substr(2,9)}`,o=[`/sw.js?v=${t}`,`/ContactosDiarios/sw.js?v=${t}`,`./sw.js?v=${t}`];for(const a of o)try{console.log(`🌐 Intentando fetch: ${a}`);const s=await fetch(a,{cache:"no-cache",headers:{"Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0"}});if(s.ok){const i=await s.text();console.log("📄 Código SW obtenido, longitud:",i.length);const n=[/CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/const\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/let\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/var\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/version['":]?\s*['"`]([0-9.]+)['"`]/i,/v?([0-9]+\.[0-9]+\.[0-9]+)/];for(const d of n){const u=i.match(d);if(u&&u[1])return console.log("✅ Versión encontrada:",u[1]),u[1]}console.log("⚠️ No se encontró versión en el código SW")}}catch(s){console.log(`❌ Error fetch ${a}:`,s.message)}return console.log("🔄 Usando versión fallback..."),"0.0.87"}catch(t){return console.error("❌ Error general obteniendo versión SW:",t),"0.0.87"}}async function M(){console.log("📋 Mostrando versión del Service Worker...");let t=document.getElementById("sw-version-info");t||(t=document.createElement("div"),t.id="sw-version-info",t.style.cssText=`
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
    `,document.body.appendChild(t)),t.innerHTML=`
    <p class="version-text">SW cargando...</p>
  `;try{const o=await Ie();t.innerHTML=`
      <p class="version-text">Service Worker v${o}</p>
    `,console.log("✅ Versión del SW mostrada:",o)}catch(o){console.error("❌ Error mostrando versión SW:",o),t.innerHTML=`
      <p class="version-text">Service Worker v0.0.87</p>
    `}}async function Ne(){console.log("🚀 Inicializando aplicación...");const t=M(),o=new Promise(s=>setTimeout(()=>s("timeout"),5e3));if(await Promise.race([t,o])==="timeout"){console.log("⏰ Timeout obteniendo versión SW, usando fallback");let s=document.getElementById("sw-version-info");s&&(s.innerHTML=`
        <p class="version-text">Service Worker v0.0.87</p>
      `)}"serviceWorker"in navigator&&(navigator.serviceWorker.addEventListener("controllerchange",()=>{console.log("🔄 Service Worker actualizado, refrescando versión..."),setTimeout(()=>M(),500)}),navigator.serviceWorker.ready.then(()=>{console.log("✅ Service Worker listo, actualizando versión..."),setTimeout(()=>M(),2e3)}).catch(s=>{console.log("❌ Error esperando SW ready:",s)}),navigator.serviceWorker.addEventListener("message",s=>{s.data&&s.data.type==="SW_UPDATED"&&(console.log("📢 Service Worker actualizado a versión:",s.data.version),se(s.data.version),M())}))}let Y=0,A=!1;function Ce(){let t=null;window.addEventListener("scroll",()=>{A=!0,clearTimeout(t),t=setTimeout(()=>{A=!1},100)},{passive:!0}),document.addEventListener("touchstart",()=>{Y=Date.now()},{passive:!0}),document.addEventListener("touchmove",()=>{A=!0},{passive:!0}),document.addEventListener("touchend",()=>{setTimeout(()=>{A=!1},100)},{passive:!0})}function D(){const t=Date.now()-Y;return!A&&t>150}document.addEventListener("DOMContentLoaded",()=>{m(),Ne(),ge(),console.log("📱 ContactosDiarios iniciado correctamente"),console.log("💡 Usa Ctrl+Shift+R para limpiar cache y forzar actualización"),console.log("🔧 También disponible: window.clearCacheAndReload()")});
