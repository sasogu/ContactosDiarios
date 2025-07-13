(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const d of a.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function n(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=n(s);fetch(s.href,a)}})();const R="0.0.67";(function(){try{const t=localStorage.getItem("app_version");if(t&&t!==R){const n=localStorage.getItem("contactos_diarios"),i=localStorage.getItem("contactos_diarios_backups"),s=localStorage.getItem("contactos_diarios_backup_fecha"),a=localStorage.getItem("contactos_diarios_webdav_config");["app_version","contactos_diarios","contactos_diarios_backups","contactos_diarios_backup_fecha","contactos_diarios_webdav_config"].forEach(p=>{p!=="contactos_diarios"&&localStorage.removeItem(p)}),"caches"in window&&caches.keys().then(p=>{p.forEach(b=>{(b.includes("contactosdiarios")||b.includes("contactos-diarios"))&&caches.delete(b)})}),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(p=>{p.forEach(b=>{b.scope.includes(window.location.origin)&&b.unregister()})}),n&&localStorage.setItem("contactos_diarios",n),i&&localStorage.setItem("contactos_diarios_backups",i),s&&localStorage.setItem("contactos_diarios_backup_fecha",s),a&&localStorage.setItem("contactos_diarios_webdav_config",a),location.reload()}localStorage.setItem("app_version",R)}catch{}})();function K({contacts:o,filter:t,onSelect:n,onDelete:i}){let s=t?o.filter(a=>{const d=t.toLowerCase(),p=a.notes?Object.values(a.notes).join(" ").toLowerCase():"";return a.tags?.some(b=>b.toLowerCase().includes(d))||a.name?.toLowerCase().includes(d)||a.surname?.toLowerCase().includes(d)||p.includes(d)}):o;return s=s.slice().sort((a,d)=>d.pinned&&!a.pinned?1:a.pinned&&!d.pinned?-1:(a.surname||"").localeCompare(d.surname||"")),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${t||""}" />
      <ul>
        ${s.length===0?'<li class="empty">Sin contactos</li>':s.map((a,d)=>`
          <li${a.pinned?' class="pinned"':""}>
            <div class="contact-main">
              <button class="select-contact" data-index="${o.indexOf(a)}">${a.surname?a.surname+", ":""}${a.name}</button>
              <span class="tags">${(a.tags||[]).map(p=>`<span class='tag'>${p}</span>`).join(" ")}</span>
              <button class="pin-contact" data-index="${o.indexOf(a)}" title="${a.pinned?"Desfijar":"Fijar"}">${a.pinned?"📌":"📍"}</button>
            </div>
            <div class="contact-info">
              ${a.phone?`<a href="tel:${a.phone}" class="contact-link" title="Llamar"><span>📞</span> ${a.phone}</a>`:""}
              ${a.email?`<a href="mailto:${a.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${a.email}</a>`:""}
            </div>
            <button class="add-note-contact" data-index="${o.indexOf(a)}" title="Añadir nota">📝</button>
            <button class="edit-contact" data-index="${o.indexOf(a)}" title="Editar">✏️</button>
            <button class="delete-contact" data-index="${o.indexOf(a)}" title="Eliminar">🗑️</button>
          </li>
        `).join("")}
      </ul>
    </div>
  `}function H({contact:o}){return`
    <form id="contact-form">
      <h2>${o?"Editar":"Nuevo"} contacto</h2>
      <label>Nombre <input name="name" placeholder="Nombre" value="${o?.name||""}" required /></label>
      <label>Apellidos <input name="surname" placeholder="Apellidos" value="${o?.surname||""}" required /></label>
      <label>Teléfono <input name="phone" placeholder="Teléfono" value="${o?.phone||""}" pattern="[0-9+-() ]*" /></label>
      <label>Email <input name="email" placeholder="Email" value="${o?.email||""}" type="email" /></label>
      <label>Etiquetas <input name="tags" placeholder="Ej: familia, trabajo" value="${o?.tags?.join(", ")||""}" /></label>
      <div class="form-actions">
        <button type="submit">Guardar</button>
        <button type="button" id="cancel-edit">Cancelar</button>
      </div>
    </form>
  `}function X({notes:o}){if(!D())return`
      <div class="notes-area">
        <h3>🔒 Notas privadas protegidas</h3>
        <div style="text-align:center;padding:20px;background:#f8f9fa;border-radius:8px;margin:20px 0;">
          <p style="margin-bottom:15px;color:#666;">
            Las notas están protegidas con contraseña para mantener tu privacidad.
          </p>
          <button id="unlock-notes-btn" style="background:#3a4a7c;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;">
            🔓 Desbloquear notas
          </button>
          ${D()?`
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
        ${Object.entries(o||{}).sort((s,a)=>a[0].localeCompare(s[0])).map(([s,a])=>`
          <li>
            <b>${s}</b>:
            <span class="note-content" data-date="${s}">${a}</span>
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
  `}function Y({}){return`
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
  `}function Z({contacts:o,visible:t,page:n=1}){let i=[];o.forEach((h,E)=>{h.notes&&Object.entries(h.notes).forEach(([v,w])=>{i.push({date:v,text:w,contact:h,contactIndex:E})})}),i.sort((h,E)=>E.date.localeCompare(h.date));const s=4,a=Math.max(1,Math.ceil(i.length/s)),d=Math.min(Math.max(n,1),a),p=(d-1)*s,b=i.slice(p,p+s);return`
    <div id="all-notes-modal" class="modal" style="display:${t?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${i.length===0?"<li>No hay notas registradas.</li>":b.map(h=>`
            <li>
              <b>${h.date}</b> — <span style="color:#3a4a7c">${h.contact.surname?h.contact.surname+", ":""}${h.contact.name}</span><br/>
              <span>${h.text}</span>
              <a href="#" class="edit-note-link" data-contact="${h.contactIndex}" data-date="${h.date}" style="margin-left:0.5em;color:#646cff;font-size:0.95em;">Editar nota</a>
            </li>
          `).join("")}
        </ul>
        <div class="pagination" style="display:flex;justify-content:center;align-items:center;gap:1em;margin:1em 0;">
          <button id="prev-notes-page" ${d===1?"disabled":""}>&lt; Anterior</button>
          <span>Página ${d} de ${a}</span>
          <button id="next-notes-page" ${d===a?"disabled":""}>Siguiente &gt;</button>
        </div>
        <div class="form-actions">
          <button id="close-all-notes">Cerrar</button>
        </div>
      </div>
    </div>
  `}function Q({visible:o,backups:t}){return`
    <div id="backup-modal" class="modal" style="display:${o?"flex":"none"};z-index:4000;">
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
  `}function ee({visible:o,contactIndex:t}){const n=t!==null?e.contacts[t]:null,i=new Date,a=new Date(i.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);return`
    <div id="add-note-modal" class="modal" style="display:${o?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:500px;">
        <h3>Añadir nota diaria</h3>
        ${n?`<p><strong>${n.surname?n.surname+", ":""}${n.name}</strong></p>`:""}
        <form id="add-note-form">
          <label>Fecha <input type="date" id="add-note-date" value="${a}" required /></label>
          <label>Nota <textarea id="add-note-text" rows="4" placeholder="Escribe una nota para este contacto..." required></textarea></label>
          <div class="form-actions">
            <button type="submit">Guardar nota</button>
            <button type="button" id="cancel-add-note">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `}function g(o,t="info"){let n=document.getElementById("notification-container");n||(n=document.createElement("div"),n.id="notification-container",n.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
      pointer-events: none;
    `,document.body.appendChild(n));const i=document.createElement("div");i.style.cssText=`
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
  `;const s=t==="success"?"✅":t==="error"?"❌":t==="warning"?"⚠️":"ℹ️";i.innerHTML=`${s} ${o}`,n.appendChild(i),setTimeout(()=>{i.style.opacity="1",i.style.transform="translateX(0)"},10);const a=()=>{i.style.opacity="0",i.style.transform="translateX(100%)",setTimeout(()=>{i.parentNode&&i.parentNode.removeChild(i)},300)};i.onclick=a,setTimeout(a,4e3)}function L(o){const t=[];return!o.name||o.name.trim().length===0?t.push("El nombre es obligatorio"):o.name.trim().length<2?t.push("El nombre debe tener al menos 2 caracteres"):o.name.trim().length>50&&t.push("El nombre no puede tener más de 50 caracteres"),o.surname&&o.surname.trim().length>50&&t.push("Los apellidos no pueden tener más de 50 caracteres"),o.phone&&o.phone.trim().length>0&&(/^[\d\s\-\+\(\)\.]{6,20}$/.test(o.phone.trim())||t.push("El teléfono debe contener solo números, espacios y caracteres válidos (6-20 caracteres)")),o.email&&o.email.trim().length>0&&(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.email.trim())?o.email.trim().length>100&&t.push("El email no puede tener más de 100 caracteres"):t.push("El email debe tener un formato válido")),t}function j(o){const t=[];return!o||o.trim().length===0?(t.push("La nota no puede estar vacía"),t):(o.trim().length>1e3&&t.push("La nota no puede tener más de 1000 caracteres"),o.trim().length<3&&t.push("La nota debe tener al menos 3 caracteres"),/^[\w\s\.\,\;\:\!\?\-\(\)\[\]\"\'\/\@\#\$\%\&\*\+\=\<\>\{\}\|\~\`\ñÑáéíóúÁÉÍÓÚüÜ]*$/.test(o)||t.push("La nota contiene caracteres no permitidos"),t)}const V="contactos_diarios";let e={contacts:te(),selected:null,notes:"",editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1,showAddNoteModal:!1,addNoteContactIndex:null,allNotesPage:1,duplicates:[],showDuplicateModal:!1,showAuthModal:!1,authMode:"login",pendingAction:null};function te(){try{return JSON.parse(localStorage.getItem(V))||[]}catch{return[]}}function I(o){localStorage.setItem(V,JSON.stringify(o))}function m(){const o=document.querySelector("#app"),t=e.editing!==null?e.contacts[e.editing]:null,n=e.selected!==null?e.contacts[e.selected].notes||{}:{};o.innerHTML=`
    <h1>Diario de Contactos</h1>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <div class="main-grid">
      <div>
        <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
        ${K({contacts:e.contacts,filter:e.tagFilter})}
        <button id="show-backup-modal" class="add-btn" style="width:100%;margin-top:0.7rem;background:#06b6d4;">Restaurar copia local</button>
        <div style="margin-top:1rem;">
          <button id="import-btn" style="background:#6f42c1;color:#fff;margin:0 10px 1.2rem 0;">📂 Importar contactos</button>
          <button id="export-btn" style="background:#fd7e14;color:#fff;margin:0 10px 1.2rem 0;">💾 Exportar contactos</button>
          <button id="manage-duplicates-btn" style="background:#dc3545;color:#fff;margin:0 10px 1.2rem 0;">🔍 Gestionar duplicados</button>
          <button id="validate-contacts-btn" style="background:#28a745;color:#fff;margin:0 10px 1.2rem 0;">✅ Validar contactos</button>
        </div>
      </div>
      <div>
        ${e.editing!==null?H({contact:t}):""}
        ${e.selected!==null&&e.editing===null?X({notes:n}):""}
      </div>
    </div>
    ${Z({contacts:e.contacts,visible:e.showAllNotes,page:e.allNotesPage})}
    ${Q({visible:e.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})} <!-- Modal de backup -->
    ${ee({visible:e.showAddNoteModal,contactIndex:e.addNoteContactIndex})} <!-- Modal añadir nota -->
    ${me({duplicates:e.duplicates,visible:e.showDuplicateModal})} <!-- Modal de gestión de duplicados -->
    ${ye({visible:e.showAuthModal,mode:e.authMode})} <!-- Modal de autenticación -->
    ${Y({})}
  `,oe();const i=document.getElementById("show-backup-modal");i&&(i.onclick=()=>{e.showBackupModal=!0,m()});const s=document.getElementById("close-backup-modal");s&&(s.onclick=()=>{e.showBackupModal=!1,m()}),document.querySelectorAll(".add-note-contact").forEach(p=>{p.onclick=b=>{const h=Number(p.dataset.index);if(!D()){e.pendingAction={type:"addNote",contactIndex:h},O()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m();return}e.addNoteContactIndex=h,e.showAddNoteModal=!0,m()}});const a=document.getElementById("cancel-add-note");a&&(a.onclick=()=>{e.showAddNoteModal=!1,e.addNoteContactIndex=null,m()}),document.querySelectorAll(".restore-backup-btn").forEach(p=>{p.onclick=()=>re(p.dataset.fecha)});const d=document.getElementById("restore-local-backup");d&&(d.onclick=restaurarBackupLocal)}let F=null;function oe(){const o=document.getElementById("tag-filter");o&&o.addEventListener("input",r=>{clearTimeout(F),F=setTimeout(()=>{e.tagFilter=o.value,m();const l=document.getElementById("tag-filter");l&&(l.value=e.tagFilter,l.focus(),l.setSelectionRange(e.tagFilter.length,e.tagFilter.length))},300)});const t=document.getElementById("add-contact");t&&(t.onclick=()=>{e.editing=null,e.selected=null,m(),e.editing=e.contacts.length,m()}),document.querySelectorAll(".select-contact").forEach(r=>{r.onclick=l=>{e.selected=Number(r.dataset.index),e.editing=null,m()}}),document.querySelectorAll(".edit-contact").forEach(r=>{r.onclick=l=>{e.editing=Number(r.dataset.index),e.selected=null,m()}}),document.querySelectorAll(".delete-contact").forEach(r=>{r.onclick=l=>{const c=Number(r.dataset.index),u=e.contacts[c],f=u.surname?`${u.surname}, ${u.name}`:u.name;confirm(`¿Estás seguro de eliminar el contacto "${f}"?

Esta acción no se puede deshacer.`)&&(e.contacts.splice(c,1),I(e.contacts),g("Contacto eliminado correctamente","success"),e.selected=null,m())}}),document.querySelectorAll(".pin-contact").forEach(r=>{r.onclick=l=>{const c=Number(r.dataset.index);e.contacts[c].pinned&&!confirm("¿Seguro que quieres desfijar este contacto?")||(e.contacts[c].pinned=!e.contacts[c].pinned,I(e.contacts),m())}});const n=document.getElementById("contact-form");n&&(n.onsubmit=r=>{r.preventDefault();const l=Object.fromEntries(new FormData(n)),c=L(l);if(c.length>0){g("Error de validación: "+c.join(", "),"error");return}let u=l.tags?l.tags.split(",").map(N=>N.trim()).filter(Boolean):[];delete l.tags;const f={...l};e.contacts.some((N,k)=>e.editing!==null&&k===e.editing?!1:z(N,f))&&!confirm("Ya existe un contacto similar. ¿Deseas guardarlo de todas formas?")||(e.editing!==null&&e.editing<e.contacts.length?(e.contacts[e.editing]={...e.contacts[e.editing],...l,tags:u},g("Contacto actualizado correctamente","success")):(e.contacts.push({...l,notes:{},tags:u}),g("Contacto añadido correctamente","success")),I(e.contacts),e.editing=null,m())},document.getElementById("cancel-edit").onclick=()=>{e.editing=null,m()});const i=document.getElementById("add-note-form");if(i&&e.addNoteContactIndex!==null){const r=l=>{l.preventDefault(),$()&&console.log("🔍 Submit añadir nota en móvil");const c=document.getElementById("add-note-date").value,u=document.getElementById("add-note-text").value.trim();if(!c||!u){g("Por favor, selecciona una fecha y escribe una nota","warning");return}const f=j(u);if(f.length>0){g("Error en la nota: "+f.join(", "),"error");return}const y=e.addNoteContactIndex;e.contacts[y].notes||(e.contacts[y].notes={}),e.contacts[y].notes[c]?e.contacts[y].notes[c]+=`
`+u:e.contacts[y].notes[c]=u,I(e.contacts),g("Nota añadida correctamente","success"),e.showAddNoteModal=!1,e.addNoteContactIndex=null,m()};if(i.onsubmit=r,$()){const l=i.querySelector('button[type="submit"]');l&&(console.log("🔍 Configurando botón añadir nota para móvil"),l.addEventListener("touchend",function(c){console.log("🔍 TouchEnd en botón añadir nota - forzando submit"),c.preventDefault(),setTimeout(()=>{r(c)},50)},{passive:!1}),l.addEventListener("click",function(c){$()&&(console.log("🔍 Click en botón añadir nota (móvil backup)"),c.preventDefault(),r(c))}))}}const s=document.getElementById("note-form");if(s&&e.selected!==null){$()&&console.log("🔍 Configurando formulario de notas para móvil");const r=l=>{l.preventDefault(),$()&&console.log("🔍 Submit formulario notas en móvil");const c=document.getElementById("note-date").value,u=document.getElementById("note-text").value.trim();if(!c||!u){g("Por favor, selecciona una fecha y escribe una nota","warning");return}const f=j(u);if(f.length>0){g("Error en la nota: "+f.join(", "),"error");return}e.contacts[e.selected].notes||(e.contacts[e.selected].notes={}),e.contacts[e.selected].notes[c]?e.contacts[e.selected].notes[c]+=`
`+u:e.contacts[e.selected].notes[c]=u,I(e.contacts),g("Nota guardada correctamente","success"),$()&&console.log("🔍 Nota guardada exitosamente en móvil"),document.getElementById("note-text").value="",m()};if(s.onsubmit=r,$()){const l=s.querySelector('button[type="submit"]');l&&(l.type="submit",l.addEventListener("touchstart",function(c){console.log("🔍 TouchStart en botón guardar nota"),this.style.backgroundColor="#0056b3"},{passive:!0}),l.addEventListener("touchend",function(c){console.log("🔍 TouchEnd en botón guardar nota - forzando submit"),this.style.backgroundColor="",c.preventDefault(),setTimeout(()=>{r(c)},50)},{passive:!1}),l.addEventListener("click",function(c){$()&&(console.log("🔍 Click en botón guardar nota (móvil backup)"),c.preventDefault(),r(c))}))}}document.querySelectorAll(".edit-note").forEach(r=>{r.onclick=l=>{const c=r.dataset.date,u=document.getElementById("edit-note-modal"),f=document.getElementById("edit-note-text");f.value=e.contacts[e.selected].notes[c],u.style.display="block",document.getElementById("save-edit-note").onclick=()=>{const y=f.value.trim(),N=j(y);if(N.length>0){g("Error en la nota: "+N.join(", "),"error");return}e.contacts[e.selected].notes[c]=y,I(e.contacts),g("Nota actualizada correctamente","success"),u.style.display="none",m()},document.getElementById("cancel-edit-note").onclick=()=>{u.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(r=>{r.onclick=l=>{const c=r.dataset.date;confirm(`¿Estás seguro de eliminar la nota del ${c}?

Esta acción no se puede deshacer.`)&&(delete e.contacts[e.selected].notes[c],I(e.contacts),g("Nota eliminada correctamente","success"),m())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{ie(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{ce(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{le(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async r=>{const l=r.target.files[0];if(!l)return;const c=await l.text();let u=[];if(l.name.endsWith(".vcf"))u=ne(c);else if(l.name.endsWith(".csv"))u=se(c);else if(l.name.endsWith(".json"))try{const f=JSON.parse(c);Array.isArray(f)?u=f:f&&Array.isArray(f.contacts)&&(u=f.contacts)}catch{}if(u.length){const f=[],y=[];if(u.forEach((x,C)=>{const q=L(x);q.length===0?f.push(x):y.push({index:C+1,errors:q})}),y.length>0){const x=y.map(C=>`Contacto ${C.index}: ${C.errors.join(", ")}`).join(`
`);if(!confirm(`Se encontraron ${y.length} contacto(s) con errores:

${x}

¿Deseas importar solo los contactos válidos (${f.length})?`))return}const N=x=>e.contacts.some(C=>C.name===x.name&&C.surname===x.surname&&C.phone===x.phone),k=f.filter(x=>!N(x));k.length?(e.contacts=e.contacts.concat(k),I(e.contacts),g(`${k.length} contacto(s) importado(s) correctamente`,"success"),m()):g("No se han importado contactos nuevos (todos ya existen)","info")}else g("No se pudieron importar contactos del archivo seleccionado","error")};const a=document.getElementById("close-all-notes");a&&(a.onclick=()=>{e.showAllNotes=!1,e.allNotesPage=1,m()});const d=document.getElementById("show-all-notes-btn");d&&(d.onclick=()=>{if(!D()){e.pendingAction={type:"showAllNotes"},O()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m();return}e.showAllNotes=!0,e.allNotesPage=1,m()});const p=document.getElementById("prev-notes-page");p&&(p.onclick=()=>{e.allNotesPage>1&&(e.allNotesPage--,m())});const b=document.getElementById("next-notes-page");b&&(b.onclick=()=>{let r=[];e.contacts.forEach((c,u)=>{c.notes&&Object.entries(c.notes).forEach(([f,y])=>{r.push({date:f,text:y,contact:c,contactIndex:u})})});const l=Math.max(1,Math.ceil(r.length/4));e.allNotesPage<l&&(e.allNotesPage++,m())}),document.querySelectorAll(".edit-note-link").forEach(r=>{r.onclick=l=>{l.preventDefault();const c=Number(r.dataset.contact),u=r.dataset.date;e.selected=c,e.editing=null,e.showAllNotes=!1,m(),setTimeout(()=>{const f=document.querySelector(`.edit-note[data-date="${u}"]`);f&&f.click()},50)}}),document.querySelectorAll(".share-backup-btn").forEach(r=>{r.onclick=async()=>{const l=r.dataset.fecha,u=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(x=>x.fecha===l);if(!u)return alert("No se encontró la copia seleccionada.");const f=`contactos_backup_${l}.json`,y=JSON.stringify(u.datos,null,2),N=new Blob([y],{type:"application/json"}),k=document.createElement("a");if(k.href=URL.createObjectURL(N),k.download=f,k.style.display="none",document.body.appendChild(k),k.click(),setTimeout(()=>{URL.revokeObjectURL(k.href),k.remove()},1e3),navigator.canShare&&window.File&&window.FileReader)try{const x=new File([N],f,{type:"application/json"});navigator.canShare({files:[x]})&&await navigator.share({files:[x],title:"Backup de Contactos",text:`Copia de seguridad (${l}) de ContactosDiarios`})}catch{}}});const h=document.getElementById("manage-duplicates-btn");h&&(h.onclick=()=>{e.duplicates=de(),e.duplicates.length===0?g("No se encontraron contactos duplicados","info"):(e.showDuplicateModal=!0,m())});const E=document.getElementById("validate-contacts-btn");E&&(E.onclick=()=>{const r=[];if(e.contacts.forEach((l,c)=>{const u=L(l);if(u.length>0){const f=l.surname?`${l.surname}, ${l.name}`:l.name;r.push({index:c+1,name:f,errors:u})}}),r.length===0)g(`✅ Todos los ${e.contacts.length} contactos son válidos`,"success");else{const l=r.map(c=>`${c.index}. ${c.name}: ${c.errors.join(", ")}`).join(`
`);g(`⚠️ Se encontraron ${r.length} contacto(s) con errores`,"warning"),console.log("Contactos con errores de validación:",r),confirm(`Se encontraron ${r.length} contacto(s) con errores de validación:

${l}

¿Deseas ver más detalles en la consola del navegador?`)&&console.table(r)}});const v=document.getElementById("cancel-duplicate-resolution");v&&(v.onclick=()=>{e.showDuplicateModal=!1,e.duplicates=[],m()});const w=document.getElementById("apply-resolution");w&&(w.onclick=pe),document.querySelectorAll('input[name^="resolution-"]').forEach(r=>{r.addEventListener("change",()=>{const l=r.name.split("-")[1],c=document.getElementById(`merge-section-${l}`),u=document.getElementById(`individual-section-${l}`);r.value==="merge"?(c.style.display="block",u.style.display="none"):r.value==="select"?(c.style.display="none",u.style.display="block"):(c.style.display="none",u.style.display="none")})}),document.querySelectorAll('.resolution-option input[type="radio"]').forEach(r=>{r.addEventListener("change",()=>{const l=r.name;document.querySelectorAll(`input[name="${l}"]`).forEach(c=>{c.closest(".resolution-option").classList.remove("selected")}),r.closest(".resolution-option").classList.add("selected")})});const B=document.getElementById("unlock-notes-btn");B&&(B.onclick=()=>{e.selected!==null&&(e.pendingAction={type:"showContactNotes",contactIndex:e.selected}),O()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m()});const _=document.getElementById("logout-btn");_&&(_.onclick=()=>{be(),m()});const A=document.getElementById("auth-form");A&&!A.hasAttribute("data-handler-added")&&(A.setAttribute("data-handler-added","true"),$()&&console.log("Configurando formulario auth para móvil"),A.onsubmit=r=>{r.preventDefault(),$()&&console.log("Submit auth form en móvil");const l=document.getElementById("auth-password").value.trim();if(!l){g("Por favor, introduce una contraseña","warning");return}if(e.authMode==="setup"){const c=document.getElementById("auth-password-confirm").value.trim();if(l!==c){g("Las contraseñas no coinciden","error");return}if(l.length<4){g("La contraseña debe tener al menos 4 caracteres","warning");return}fe(l),S.isAuthenticated=!0,S.sessionExpiry=Date.now()+30*60*1e3,e.showAuthModal=!1,A.reset(),setTimeout(()=>{G()},100),m()}else he(l)?(e.showAuthModal=!1,A.reset(),m()):(document.getElementById("auth-password").value="",document.getElementById("auth-password").focus())});const P=document.getElementById("cancel-auth");P&&(P.onclick=()=>{e.showAuthModal=!1,e.pendingAction=null,m()});const M=document.getElementById("auth-modal");if(M){M.onclick=c=>{c.target===M&&(e.showAuthModal=!1,e.pendingAction=null,m())};const r=document.getElementById("auth-password");if(r){const c=window.innerWidth<=700?500:100;setTimeout(()=>{r.scrollIntoView({behavior:"smooth",block:"center"}),setTimeout(()=>{r.focus(),document.activeElement!==r&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&r.click()},window.innerWidth<=700?200:50)},c)}const l=c=>{c.key==="Escape"&&e.showAuthModal&&(e.showAuthModal=!1,e.pendingAction=null,m())};document.addEventListener("keydown",l)}}function ne(o){const t=[],n=o.split("END:VCARD");for(const i of n){const s=/FN:([^\n]*)/.exec(i)?.[1]?.trim(),a=/N:.*;([^;\n]*)/.exec(i)?.[1]?.trim()||"",d=/TEL.*:(.+)/.exec(i)?.[1]?.trim(),p=/EMAIL.*:(.+)/.exec(i)?.[1]?.trim();s&&t.push({name:s,surname:a,phone:d||"",email:p||"",notes:{},tags:[]})}return t}function ae(o){return o.map(t=>`BEGIN:VCARD
VERSION:3.0
FN:${t.name}
N:${t.surname||""};;;;
TEL:${t.phone||""}
EMAIL:${t.email||""}
END:VCARD`).join(`
`)}function se(o){const t=o.split(`
`).filter(Boolean),[n,...i]=t;return i.map(s=>{const[a,d,p,b,h,E]=s.split(",");return{name:a?.trim()||"",surname:d?.trim()||"",phone:p?.trim()||"",email:b?.trim()||"",notes:E?JSON.parse(E):{},tags:h?h.split(";").map(v=>v.trim()):[]}})}function ie(){const o=ae(e.contacts),t=new Blob([o],{type:"text/vcard"}),n=document.createElement("a");n.href=URL.createObjectURL(t),n.download="contactos.vcf",n.click()}function ce(){const o="name,surname,phone,email,tags,notes",t=e.contacts.map(a=>[a.name,a.surname,a.phone,a.email,(a.tags||[]).join(";"),JSON.stringify(a.notes||{})].map(d=>'"'+String(d).replace(/"/g,'""')+'"').join(",")),n=[o,...t].join(`
`),i=new Blob([n],{type:"text/csv"}),s=document.createElement("a");s.href=URL.createObjectURL(i),s.download="contactos.csv",s.click()}function le(){const o=new Blob([JSON.stringify(e.contacts,null,2)],{type:"application/json"}),t=document.createElement("a");t.href=URL.createObjectURL(o),t.download="contactos.json",t.click()}function U(){const o=new Date,n=new Date(o.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);let i=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");i.find(s=>s.fecha===n)||(i.push({fecha:n,datos:e.contacts}),i.length>10&&(i=i.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(i))),localStorage.setItem("contactos_diarios_backup_fecha",n)}setInterval(U,60*60*1e3);U();function re(o){if(!confirm("¿Seguro que quieres restaurar la copia de seguridad del "+o+"? Se sobrescribirán los contactos actuales."))return;const n=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(i=>i.fecha===o);n?(e.contacts=n.datos,I(e.contacts),m(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}function z(o,t){const n=i=>i?i.toLowerCase().replace(/\s+/g," ").trim():"";return!!(n(o.name)===n(t.name)&&n(o.surname)===n(t.surname)||o.phone&&t.phone&&o.phone.replace(/\s+/g,"")===t.phone.replace(/\s+/g,"")||o.email&&t.email&&n(o.email)===n(t.email))}function de(){const o=[],t=new Set;for(let n=0;n<e.contacts.length;n++){if(t.has(n))continue;const i=[{...e.contacts[n],originalIndex:n}];t.add(n);for(let s=n+1;s<e.contacts.length;s++)t.has(s)||z(e.contacts[n],e.contacts[s])&&(i.push({...e.contacts[s],originalIndex:s}),t.add(s));i.length>1&&o.push({contacts:i})}return o}function J(o){if(o.length===0)return null;if(o.length===1)return o[0];const t={name:"",surname:"",phone:"",email:"",tags:[],notes:{},pinned:!1};let n="",i="";o.forEach(a=>{a.name&&a.name.length>n.length&&(n=a.name),a.surname&&a.surname.length>i.length&&(i=a.surname)}),t.name=n,t.surname=i,t.phone=o.find(a=>a.phone)?.phone||"",t.email=o.find(a=>a.email)?.email||"";const s=new Set;return o.forEach(a=>{a.tags&&a.tags.forEach(d=>s.add(d))}),t.tags=Array.from(s),o.forEach((a,d)=>{a.notes&&Object.entries(a.notes).forEach(([p,b])=>{t.notes[p]?t.notes[p]+=`
--- Contacto ${d+1} ---
${b}`:t.notes[p]=b})}),t.pinned=o.some(a=>a.pinned),t}function ue(o){const t=J(o);return`
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
  `}function me({duplicates:o,visible:t}){return!t||o.length===0?'<div id="duplicate-modal" class="modal" style="display:none"></div>':`
    <div id="duplicate-modal" class="modal" style="display:flex;z-index:5000;">
      <div class="modal-content" style="max-width:800px;max-height:90vh;overflow-y:auto;">
        <h3>🔍 Gestión de contactos duplicados</h3>
        <p>Se encontraron <strong>${o.length}</strong> grupo(s) de contactos duplicados. 
           Para cada grupo, elige cómo resolverlo:</p>
        
        ${o.map((n,i)=>`
          <div class="duplicate-group" style="border:1px solid #ddd;border-radius:8px;padding:15px;margin:15px 0;background:#fafafa;">
            <h4>Grupo ${i+1} - ${n.contacts.length} contactos similares</h4>
            
            <!-- Opciones de resolución -->
            <div class="resolution-options">
              <label class="resolution-option">
                <input type="radio" name="resolution-${i}" value="merge" checked>
                🔗 Fusionar en un contacto
              </label>
              <label class="resolution-option">
                <input type="radio" name="resolution-${i}" value="select">
                👆 Seleccionar uno y eliminar otros
              </label>
              <label class="resolution-option">
                <input type="radio" name="resolution-${i}" value="skip">
                ⏭️ Omitir este grupo
              </label>
            </div>
            
            <!-- Vista previa de fusión (mostrar por defecto) -->
            <div class="merge-section" id="merge-section-${i}">
              ${ue(n.contacts)}
            </div>
            
            <!-- Sección de selección individual (oculta por defecto) -->
            <div class="individual-selection" id="individual-section-${i}" style="display:none;">
              <h5>Selecciona el contacto a mantener:</h5>
              ${n.contacts.map((s,a)=>`
                <label class="duplicate-contact" style="display:block;margin:8px 0;padding:12px;border:1px solid #ccc;border-radius:6px;cursor:pointer;">
                  <input type="radio" name="keep-${i}" value="${s.originalIndex}">
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
  `}function pe(){const o=[];let t=0;if(e.duplicates.forEach((a,d)=>{const p=document.querySelector(`input[name="resolution-${d}"]:checked`),b=p?p.value:"skip";if(b==="merge")o.push({type:"merge",groupIndex:d,contacts:a.contacts}),t++;else if(b==="select"){const h=document.querySelector(`input[name="keep-${d}"]:checked`);if(h){const E=parseInt(h.value),v=a.contacts.filter(w=>w.originalIndex!==E).map(w=>w.originalIndex);o.push({type:"delete",groupIndex:d,toDelete:v,toKeep:E}),t++}}}),t===0){g("No hay operaciones que realizar","info");return}const n=o.filter(a=>a.type==="merge").length,i=o.filter(a=>a.type==="delete").length;let s=`¿Confirmar las siguientes operaciones?

`;if(n>0&&(s+=`🔗 Fusionar ${n} grupo(s) de contactos
`),i>0&&(s+=`🗑️ Eliminar duplicados en ${i} grupo(s)
`),s+=`
Esta acción no se puede deshacer.`,!confirm(s)){g("Operación cancelada","info");return}try{let a=0,d=0;const p=[];o.forEach(v=>{if(v.type==="merge"){const w=J(v.contacts);e.contacts.push(w),v.contacts.forEach(B=>{p.push(B.originalIndex)}),a++}else v.type==="delete"&&(v.toDelete.forEach(w=>{p.push(w)}),d+=v.toDelete.length)}),[...new Set(p)].sort((v,w)=>w-v).forEach(v=>{v<e.contacts.length&&e.contacts.splice(v,1)}),I(e.contacts);let h="Resolución completada: ";const E=[];a>0&&E.push(`${a} contacto(s) fusionado(s)`),d>0&&E.push(`${d} duplicado(s) eliminado(s)`),h+=E.join(" y "),g(h,"success"),e.showDuplicateModal=!1,e.duplicates=[],m()}catch(a){g("Error al aplicar resolución: "+a.message,"error")}}const T="contactos_diarios_auth";let S={isAuthenticated:!1,sessionExpiry:null};function W(o){let t=0;for(let n=0;n<o.length;n++){const i=o.charCodeAt(n);t=(t<<5)-t+i,t=t&t}return t.toString()}function fe(o){const t=W(o);localStorage.setItem(T,t),g("Contraseña establecida correctamente","success")}function ge(o){const t=localStorage.getItem(T);return t?W(o)===t:!1}function O(){return localStorage.getItem(T)!==null}function he(o){return ge(o)?(S.isAuthenticated=!0,S.sessionExpiry=Date.now()+30*60*1e3,g("Autenticación exitosa","success"),setTimeout(()=>{G()},100),!0):(g("Contraseña incorrecta","error"),!1)}function D(){return S.isAuthenticated?Date.now()>S.sessionExpiry?(S.isAuthenticated=!1,S.sessionExpiry=null,!1):!0:!1}function be(){S.isAuthenticated=!1,S.sessionExpiry=null,g("Sesión cerrada","info")}function ve(){$()&&(console.log("🔍 Configurando eventos de formulario específicos para móvil"),document.addEventListener("submit",function(o){console.log("🔍 Submit event detectado en móvil:",o.target.id)},!0),document.addEventListener("click",function(o){const t=o.target;if(t.type==="submit"&&t.closest("#note-form")){console.log("🔍 Click en botón guardar nota (móvil)"),o.preventDefault();const n=t.closest("form");if(n&&n.onsubmit){console.log("🔍 Ejecutando onsubmit manualmente");const i=new Event("submit",{bubbles:!0,cancelable:!0});n.dispatchEvent(i)}}if(t.type==="submit"&&t.closest("#add-note-form")){console.log("🔍 Click en botón añadir nota (móvil)"),o.preventDefault();const n=t.closest("form");if(n&&n.onsubmit){console.log("🔍 Ejecutando onsubmit de añadir nota manualmente");const i=new Event("submit",{bubbles:!0,cancelable:!0});n.dispatchEvent(i)}}if(t.type==="submit"&&t.closest("#auth-form")){console.log("🔍 Click en botón auth (móvil)"),o.preventDefault();const n=t.closest("form");if(n&&n.onsubmit){console.log("🔍 Ejecutando onsubmit de auth manualmente");const i=new Event("submit",{bubbles:!0,cancelable:!0});n.dispatchEvent(i)}}},!0))}function G(){if(!e.pendingAction)return;const o=e.pendingAction;switch(e.pendingAction=null,o.type){case"showAllNotes":e.showAllNotes=!0,e.allNotesPage=1;break;case"addNote":e.addNoteContactIndex=o.contactIndex,e.showAddNoteModal=!0;break;case"showContactNotes":e.selected=o.contactIndex,e.editing=null;break}m()}function ye({visible:o,mode:t="login"}){return`
    <div id="auth-modal" class="modal" style="display:${o?"flex":"none"};z-index:6000;">
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
  `}function $(){return window.innerWidth<=700||/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)}function Ee(){if(document.addEventListener("touchstart",{},{passive:!0}),/iPad|iPhone|iPod/.test(navigator.userAgent)&&(document.body.style.webkitOverflowScrolling="touch"),window.matchMedia("(display-mode: standalone)").matches&&(document.body.classList.add("pwa-mode"),/iPhone/.test(navigator.userAgent)&&(document.body.style.paddingTop="env(safe-area-inset-top)")),$()){navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2&&document.documentElement.style.setProperty("--animation-duration","0.1s"),document.addEventListener("touchend",function(n){const i=n.target;if(i.tagName==="BUTTON"||i.closest("button")){n.preventDefault();const s=i.tagName==="BUTTON"?i:i.closest("button");(s.type==="submit"||s.closest("form"))&&console.log("🔍 Botón táctil detectado:",s.textContent,s.type),setTimeout(()=>{s.click()},50)}i.type==="submit"&&(n.preventDefault(),console.log("🔍 Input submit táctil detectado"),setTimeout(()=>{i.click()},50))},{passive:!1}),document.addEventListener("touchstart",function(n){n.target.tagName==="BUTTON"&&n.target.type==="submit"&&(console.log("🔍 TouchStart en botón submit"),n.target.style.backgroundColor="#0056b3")},{passive:!0}),document.addEventListener("touchend",function(n){n.target.tagName==="BUTTON"&&n.target.type==="submit"&&(console.log("🔍 TouchEnd en botón submit"),setTimeout(()=>{n.target.style.backgroundColor=""},100))},{passive:!0});const t=document.querySelector('meta[name="viewport"]');t&&t.setAttribute("content","width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover")}}document.addEventListener("DOMContentLoaded",()=>{$()&&(console.log("🔍 MODO MÓVIL DETECTADO"),console.log("- User Agent:",navigator.userAgent),console.log("- Viewport width:",window.innerWidth),console.log("- Touch support:","ontouchstart"in window),setTimeout(()=>{g(`📱 Modo móvil activo (${window.innerWidth}px)`,"info")},1e3)),m(),Ee(),setTimeout(()=>{ve()},500);let o=null;const t=document.createElement("button");t.textContent="📲 Instalar en tu dispositivo",t.className="add-btn",t.style.display="none",t.style.position="fixed",t.style.bottom="1.5rem",t.style.left="50%",t.style.transform="translateX(-50%)",t.style.zIndex="3000",document.body.appendChild(t),window.addEventListener("beforeinstallprompt",n=>{n.preventDefault(),o=n,t.style.display="block"}),t.addEventListener("click",async()=>{if(o){o.prompt();const{outcome:n}=await o.userChoice;n==="accepted"&&(t.style.display="none"),o=null}}),window.addEventListener("appinstalled",()=>{t.style.display="none"})});
