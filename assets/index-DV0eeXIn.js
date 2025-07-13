(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const d of n.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function a(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=a(i);fetch(i.href,n)}})();const F="0.0.84";(function(){try{const o=localStorage.getItem("app_version");if(o&&o!==F){const a=localStorage.getItem("contactos_diarios"),s=localStorage.getItem("contactos_diarios_backups"),i=localStorage.getItem("contactos_diarios_backup_fecha"),n=localStorage.getItem("contactos_diarios_webdav_config");["app_version","contactos_diarios","contactos_diarios_backups","contactos_diarios_backup_fecha","contactos_diarios_webdav_config"].forEach(u=>{u!=="contactos_diarios"&&localStorage.removeItem(u)}),"caches"in window&&caches.keys().then(u=>{u.forEach(h=>{(h.includes("contactosdiarios")||h.includes("contactos-diarios"))&&caches.delete(h)})}),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(u=>{u.forEach(h=>{h.scope.includes(window.location.origin)&&h.unregister()})}),a&&localStorage.setItem("contactos_diarios",a),s&&localStorage.setItem("contactos_diarios_backups",s),i&&localStorage.setItem("contactos_diarios_backup_fecha",i),n&&localStorage.setItem("contactos_diarios_webdav_config",n),location.reload()}localStorage.setItem("app_version",F)}catch{}})();function ee({contacts:t,filter:o,onSelect:a,onDelete:s}){let i=o?t.filter(n=>{const d=o.toLowerCase(),u=n.notes?Object.values(n.notes).join(" ").toLowerCase():"";return n.tags?.some(h=>h.toLowerCase().includes(d))||n.name?.toLowerCase().includes(d)||n.surname?.toLowerCase().includes(d)||u.includes(d)}):t;return i=i.slice().sort((n,d)=>d.pinned&&!n.pinned?1:n.pinned&&!d.pinned?-1:(n.surname||"").localeCompare(d.surname||"")),`
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
  `}function te({contact:t}){return`
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
  `}function oe({notes:t}){if(!M())return`
      <div class="notes-area">
        <h3>🔒 Notas privadas protegidas</h3>
        <div style="text-align:center;padding:20px;background:#f8f9fa;border-radius:8px;margin:20px 0;">
          <p style="margin-bottom:15px;color:#666;">
            Las notas están protegidas con contraseña para mantener tu privacidad.
          </p>
          <button id="unlock-notes-btn" style="background:#3a4a7c;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;">
            🔓 Desbloquear notas
          </button>
          ${M()?`
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
  `}function ne({}){return`
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
  `}function ae({contacts:t,visible:o,page:a=1}){let s=[];t.forEach((v,E)=>{v.notes&&Object.entries(v.notes).forEach(([b,w])=>{s.push({date:b,text:w,contact:v,contactIndex:E})})}),s.sort((v,E)=>E.date.localeCompare(v.date));const i=4,n=Math.max(1,Math.ceil(s.length/i)),d=Math.min(Math.max(a,1),n),u=(d-1)*i,h=s.slice(u,u+i);return`
    <div id="all-notes-modal" class="modal" style="display:${o?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${s.length===0?"<li>No hay notas registradas.</li>":h.map(v=>`
            <li>
              <b>${v.date}</b> — <span style="color:#3a4a7c">${v.contact.surname?v.contact.surname+", ":""}${v.contact.name}</span><br/>
              <span>${v.text}</span>
              <a href="#" class="edit-note-link" data-contact="${v.contactIndex}" data-date="${v.date}" style="margin-left:0.5em;color:#646cff;font-size:0.95em;">Editar nota</a>
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
  `}function se({visible:t,backups:o}){return`
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
  `}function ie({visible:t,contactIndex:o}){const a=o!==null?e.contacts[o]:null,s=new Date,n=new Date(s.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);return`
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
  `;const i=o==="success"?"✅":o==="error"?"❌":o==="warning"?"⚠️":"ℹ️";s.innerHTML=`${i} ${t}`,a.appendChild(s),setTimeout(()=>{s.style.opacity="1",s.style.transform="translateX(0)"},10);const n=()=>{s.style.opacity="0",s.style.transform="translateX(100%)",setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},300)};s.onclick=n,setTimeout(n,4e3)}function L(t){const o=[];return!t.name||t.name.trim().length===0?o.push("El nombre es obligatorio"):t.name.trim().length<2?o.push("El nombre debe tener al menos 2 caracteres"):t.name.trim().length>50&&o.push("El nombre no puede tener más de 50 caracteres"),t.surname&&t.surname.trim().length>50&&o.push("Los apellidos no pueden tener más de 50 caracteres"),t.phone&&t.phone.trim().length>0&&(/^[\d\s\-\+\(\)\.]{6,20}$/.test(t.phone.trim())||o.push("El teléfono debe contener solo números, espacios y caracteres válidos (6-20 caracteres)")),t.email&&t.email.trim().length>0&&(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.email.trim())?t.email.trim().length>100&&o.push("El email no puede tener más de 100 caracteres"):o.push("El email debe tener un formato válido")),o}function O(t){const o=[];return!t||t.trim().length===0?(o.push("La nota no puede estar vacía"),o):(t.trim().length>1e3&&o.push("La nota no puede tener más de 1000 caracteres"),t.trim().length<3&&o.push("La nota debe tener al menos 3 caracteres"),/^[\w\s\.\,\;\:\!\?\-\(\)\[\]\"\'\/\@\#\$\%\&\*\+\=\<\>\{\}\|\~\`\ñÑáéíóúÁÉÍÓÚüÜ]*$/.test(t)||o.push("La nota contiene caracteres no permitidos"),o)}const H="contactos_diarios";let e={contacts:ce(),selected:null,notes:"",editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1,showAddNoteModal:!1,addNoteContactIndex:null,allNotesPage:1,duplicates:[],showDuplicateModal:!1,showAuthModal:!1,authMode:"login",pendingAction:null};function ce(){try{return JSON.parse(localStorage.getItem(H))||[]}catch{return[]}}function S(t){localStorage.setItem(H,JSON.stringify(t))}function p(){const t=document.querySelector("#app"),o=e.editing!==null?e.contacts[e.editing]:null,a=e.selected!==null?e.contacts[e.selected].notes||{}:{};t.innerHTML=`
    <h1>Diario de Contactos</h1>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <div class="main-grid">
      <div>
        <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
        ${ee({contacts:e.contacts,filter:e.tagFilter})}
        <button id="show-backup-modal" class="add-btn" style="width:100%;margin-top:0.7rem;background:#06b6d4;">Restaurar copia local</button>
        <div style="margin-top:1rem;">
          <button id="import-btn" style="background:#6f42c1;color:#fff;margin:0 10px 1.2rem 0;">📂 Importar contactos</button>
          <button id="export-btn" style="background:#fd7e14;color:#fff;margin:0 10px 1.2rem 0;">💾 Exportar contactos</button>
          <button id="manage-duplicates-btn" style="background:#dc3545;color:#fff;margin:0 10px 1.2rem 0;">🔍 Gestionar duplicados</button>
          <button id="validate-contacts-btn" style="background:#28a745;color:#fff;margin:0 10px 1.2rem 0;">✅ Validar contactos</button>
        </div>
      </div>
      <div>
        ${e.editing!==null?te({contact:o}):""}
        ${e.selected!==null&&e.editing===null?oe({notes:a}):""}
      </div>
    </div>
    ${ae({contacts:e.contacts,visible:e.showAllNotes,page:e.allNotesPage})}
    ${se({visible:e.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})} <!-- Modal de backup -->
    ${ie({visible:e.showAddNoteModal,contactIndex:e.addNoteContactIndex})} <!-- Modal añadir nota -->
    ${be({duplicates:e.duplicates,visible:e.showDuplicateModal})} <!-- Modal de gestión de duplicados -->
    ${ke({visible:e.showAuthModal,mode:e.authMode})} <!-- Modal de autenticación -->
    ${ne({})}
  `,re(),Q();const s=document.getElementById("show-backup-modal");s&&(s.onclick=()=>{e.showBackupModal=!0,p()});const i=document.getElementById("close-backup-modal");i&&(i.onclick=()=>{e.showBackupModal=!1,p()}),document.querySelectorAll(".add-note-contact").forEach(u=>{u.onclick=h=>{const v=Number(u.dataset.index);if(!M()){e.pendingAction={type:"addNote",contactIndex:v},P()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,p();return}e.addNoteContactIndex=v,e.showAddNoteModal=!0,p()}});const n=document.getElementById("cancel-add-note");n&&(n.onclick=()=>{e.showAddNoteModal=!1,e.addNoteContactIndex=null,p()}),document.querySelectorAll(".restore-backup-btn").forEach(u=>{u.onclick=()=>ge(u.dataset.fecha)});const d=document.getElementById("restore-local-backup");d&&(d.onclick=restaurarBackupLocal)}let z=null;function re(){const t=document.getElementById("tag-filter");t&&t.addEventListener("input",r=>{clearTimeout(z),z=setTimeout(()=>{e.tagFilter=t.value,p();const c=document.getElementById("tag-filter");c&&(c.value=e.tagFilter,c.focus(),c.setSelectionRange(e.tagFilter.length,e.tagFilter.length))},300)});const o=document.getElementById("add-contact");o&&(o.onclick=()=>{e.editing=null,e.selected=null,p(),e.editing=e.contacts.length,p()}),document.querySelectorAll(".select-contact").forEach(r=>{r.onclick=c=>{c.preventDefault(),c.stopPropagation(),B()&&(e.selected=Number(r.dataset.index),e.editing=null,p())}}),document.querySelectorAll(".edit-contact").forEach(r=>{r.onclick=c=>{c.preventDefault(),c.stopPropagation(),B()&&(e.editing=Number(r.dataset.index),e.selected=null,p())}}),document.querySelectorAll(".delete-contact").forEach(r=>{r.onclick=c=>{if(c.preventDefault(),c.stopPropagation(),!B())return;const l=Number(r.dataset.index),m=e.contacts[l],f=m.surname?`${m.surname}, ${m.name}`:m.name;confirm(`¿Estás seguro de eliminar el contacto "${f}"?

Esta acción no se puede deshacer.`)&&(e.contacts.splice(l,1),S(e.contacts),g("Contacto eliminado correctamente","success"),e.selected=null,p())}}),document.querySelectorAll(".pin-contact").forEach(r=>{r.onclick=c=>{if(c.preventDefault(),c.stopPropagation(),!B())return;const l=Number(r.dataset.index);e.contacts[l].pinned&&!confirm("¿Seguro que quieres desfijar este contacto?")||(e.contacts[l].pinned=!e.contacts[l].pinned,S(e.contacts),p())}});const a=document.getElementById("contact-form");a&&(a.onsubmit=r=>{r.preventDefault();const c=Object.fromEntries(new FormData(a)),l=L(c);if(l.length>0){g("Error de validación: "+l.join(", "),"error");return}let m=c.tags?c.tags.split(",").map(k=>k.trim()).filter(Boolean):[];delete c.tags;const f={...c};e.contacts.some((k,$)=>e.editing!==null&&$===e.editing?!1:K(k,f))&&!confirm("Ya existe un contacto similar. ¿Deseas guardarlo de todas formas?")||(e.editing!==null&&e.editing<e.contacts.length?(e.contacts[e.editing]={...e.contacts[e.editing],...c,tags:m},g("Contacto actualizado correctamente","success")):(e.contacts.push({...c,notes:{},tags:m}),g("Contacto añadido correctamente","success")),S(e.contacts),e.editing=null,p())},document.getElementById("cancel-edit").onclick=()=>{e.editing=null,p()});const s=document.getElementById("add-note-form");if(s&&e.addNoteContactIndex!==null){const r=c=>{c.preventDefault();const l=document.getElementById("add-note-date").value,m=document.getElementById("add-note-text").value.trim();if(!l||!m){g("Por favor, selecciona una fecha y escribe una nota","warning");return}const f=O(m);if(f.length>0){g("Error en la nota: "+f.join(", "),"error");return}const y=e.addNoteContactIndex;e.contacts[y].notes||(e.contacts[y].notes={}),e.contacts[y].notes[l]?e.contacts[y].notes[l]+=`
`+m:e.contacts[y].notes[l]=m,S(e.contacts),g("Nota añadida correctamente","success"),e.showAddNoteModal=!1,e.addNoteContactIndex=null,p()};s.onsubmit=r}const i=document.getElementById("note-form");if(i&&e.selected!==null){const r=c=>{c.preventDefault();const l=document.getElementById("note-date").value,m=document.getElementById("note-text").value.trim();if(!l||!m){g("Por favor, selecciona una fecha y escribe una nota","warning");return}const f=O(m);if(f.length>0){g("Error en la nota: "+f.join(", "),"error");return}e.contacts[e.selected].notes||(e.contacts[e.selected].notes={}),e.contacts[e.selected].notes[l]?e.contacts[e.selected].notes[l]+=`
`+m:e.contacts[e.selected].notes[l]=m,S(e.contacts),g("Nota guardada correctamente","success"),document.getElementById("note-text").value="",p()};i.onsubmit=r}document.querySelectorAll(".edit-note").forEach(r=>{r.onclick=c=>{const l=r.dataset.date,m=document.getElementById("edit-note-modal"),f=document.getElementById("edit-note-text");f.value=e.contacts[e.selected].notes[l],m.style.display="block",document.getElementById("save-edit-note").onclick=()=>{const y=f.value.trim(),k=O(y);if(k.length>0){g("Error en la nota: "+k.join(", "),"error");return}e.contacts[e.selected].notes[l]=y,S(e.contacts),g("Nota actualizada correctamente","success"),m.style.display="none",p()},document.getElementById("cancel-edit-note").onclick=()=>{m.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(r=>{r.onclick=c=>{const l=r.dataset.date;confirm(`¿Estás seguro de eliminar la nota del ${l}?

Esta acción no se puede deshacer.`)&&(delete e.contacts[e.selected].notes[l],S(e.contacts),g("Nota eliminada correctamente","success"),p())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{me(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{pe(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{fe(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async r=>{const c=r.target.files[0];if(!c)return;const l=await c.text();let m=[];if(c.name.endsWith(".vcf"))m=le(l);else if(c.name.endsWith(".csv"))m=ue(l);else if(c.name.endsWith(".json"))try{const f=JSON.parse(l);Array.isArray(f)?m=f:f&&Array.isArray(f.contacts)&&(m=f.contacts)}catch{}if(m.length){const f=[],y=[];if(m.forEach((x,N)=>{const V=L(x);V.length===0?f.push(x):y.push({index:N+1,errors:V})}),y.length>0){const x=y.map(N=>`Contacto ${N.index}: ${N.errors.join(", ")}`).join(`
`);if(!confirm(`Se encontraron ${y.length} contacto(s) con errores:

${x}

¿Deseas importar solo los contactos válidos (${f.length})?`))return}const k=x=>e.contacts.some(N=>N.name===x.name&&N.surname===x.surname&&N.phone===x.phone),$=f.filter(x=>!k(x));$.length?(e.contacts=e.contacts.concat($),S(e.contacts),g(`${$.length} contacto(s) importado(s) correctamente`,"success"),p()):g("No se han importado contactos nuevos (todos ya existen)","info")}else g("No se pudieron importar contactos del archivo seleccionado","error")};const n=document.getElementById("close-all-notes");n&&(n.onclick=()=>{e.showAllNotes=!1,e.allNotesPage=1,p()});const d=document.getElementById("show-all-notes-btn");d&&(d.onclick=()=>{if(!M()){e.pendingAction={type:"showAllNotes"},P()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,p();return}e.showAllNotes=!0,e.allNotesPage=1,p()});const u=document.getElementById("prev-notes-page");u&&(u.onclick=()=>{e.allNotesPage>1&&(e.allNotesPage--,p())});const h=document.getElementById("next-notes-page");h&&(h.onclick=()=>{let r=[];e.contacts.forEach((l,m)=>{l.notes&&Object.entries(l.notes).forEach(([f,y])=>{r.push({date:f,text:y,contact:l,contactIndex:m})})});const c=Math.max(1,Math.ceil(r.length/4));e.allNotesPage<c&&(e.allNotesPage++,p())}),document.querySelectorAll(".edit-note-link").forEach(r=>{r.onclick=c=>{c.preventDefault();const l=Number(r.dataset.contact),m=r.dataset.date;e.selected=l,e.editing=null,e.showAllNotes=!1,p(),setTimeout(()=>{const f=document.querySelector(`.edit-note[data-date="${m}"]`);f&&f.click()},50)}}),document.querySelectorAll(".share-backup-btn").forEach(r=>{r.onclick=async()=>{const c=r.dataset.fecha,m=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(x=>x.fecha===c);if(!m)return alert("No se encontró la copia seleccionada.");const f=`contactos_backup_${c}.json`,y=JSON.stringify(m.datos,null,2),k=new Blob([y],{type:"application/json"}),$=document.createElement("a");if($.href=URL.createObjectURL(k),$.download=f,$.style.display="none",document.body.appendChild($),$.click(),setTimeout(()=>{URL.revokeObjectURL($.href),$.remove()},1e3),navigator.canShare&&window.File&&window.FileReader)try{const x=new File([k],f,{type:"application/json"});navigator.canShare({files:[x]})&&await navigator.share({files:[x],title:"Backup de Contactos",text:`Copia de seguridad (${c}) de ContactosDiarios`})}catch{}}});const v=document.getElementById("manage-duplicates-btn");v&&(v.onclick=()=>{e.duplicates=he(),e.duplicates.length===0?g("No se encontraron contactos duplicados","info"):(e.showDuplicateModal=!0,p())});const E=document.getElementById("validate-contacts-btn");E&&(E.onclick=()=>{const r=[];if(e.contacts.forEach((c,l)=>{const m=L(c);if(m.length>0){const f=c.surname?`${c.surname}, ${c.name}`:c.name;r.push({index:l+1,name:f,errors:m})}}),r.length===0)g(`✅ Todos los ${e.contacts.length} contactos son válidos`,"success");else{const c=r.map(l=>`${l.index}. ${l.name}: ${l.errors.join(", ")}`).join(`
`);g(`⚠️ Se encontraron ${r.length} contacto(s) con errores`,"warning"),console.log("Contactos con errores de validación:",r),confirm(`Se encontraron ${r.length} contacto(s) con errores de validación:

${c}

¿Deseas ver más detalles en la consola del navegador?`)&&console.table(r)}});const b=document.getElementById("cancel-duplicate-resolution");b&&(b.onclick=()=>{e.showDuplicateModal=!1,e.duplicates=[],p()});const w=document.getElementById("apply-resolution");w&&(w.onclick=ye),document.querySelectorAll('input[name^="resolution-"]').forEach(r=>{r.addEventListener("change",()=>{const c=r.name.split("-")[1],l=document.getElementById(`merge-section-${c}`),m=document.getElementById(`individual-section-${c}`);r.value==="merge"?(l.style.display="block",m.style.display="none"):r.value==="select"?(l.style.display="none",m.style.display="block"):(l.style.display="none",m.style.display="none")})}),document.querySelectorAll('.resolution-option input[type="radio"]').forEach(r=>{r.addEventListener("change",()=>{const c=r.name;document.querySelectorAll(`input[name="${c}"]`).forEach(l=>{l.closest(".resolution-option").classList.remove("selected")}),r.closest(".resolution-option").classList.add("selected")})});const A=document.getElementById("unlock-notes-btn");A&&(A.onclick=()=>{e.selected!==null&&(e.pendingAction={type:"showContactNotes",contactIndex:e.selected}),P()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,p()});const q=document.getElementById("logout-btn");q&&(q.onclick=()=>{$e(),p()});const C=document.getElementById("auth-form");C&&!C.hasAttribute("data-handler-added")&&(C.setAttribute("data-handler-added","true"),C.onsubmit=r=>{r.preventDefault();const c=document.getElementById("auth-password").value.trim();if(!c){g("Por favor, introduce una contraseña","warning");return}if(e.authMode==="setup"){const l=document.getElementById("auth-password-confirm").value.trim();if(c!==l){g("Las contraseñas no coinciden","error");return}if(c.length<4){g("La contraseña debe tener al menos 4 caracteres","warning");return}Ee(c),I.isAuthenticated=!0,I.sessionExpiry=Date.now()+30*60*1e3,e.showAuthModal=!1,C.reset(),setTimeout(()=>{Z()},100),p()}else we(c)?(e.showAuthModal=!1,C.reset(),p()):(document.getElementById("auth-password").value="",document.getElementById("auth-password").focus())});const W=document.getElementById("cancel-auth");W&&(W.onclick=()=>{e.showAuthModal=!1,e.pendingAction=null,p()});const D=document.getElementById("auth-modal");if(D){D.onclick=l=>{l.target===D&&(e.showAuthModal=!1,e.pendingAction=null,p())};const r=document.getElementById("auth-password");if(r){const l=window.innerWidth<=700?300:100;setTimeout(()=>{r.focus(),window.innerWidth<=700&&r.scrollIntoView({behavior:"smooth",block:"center"})},l)}const c=l=>{l.key==="Escape"&&e.showAuthModal&&(e.showAuthModal=!1,e.pendingAction=null,p())};document.addEventListener("keydown",c)}}function le(t){const o=[],a=t.split("END:VCARD");for(const s of a){const i=/FN:([^\n]*)/.exec(s)?.[1]?.trim(),n=/N:.*;([^;\n]*)/.exec(s)?.[1]?.trim()||"",d=/TEL.*:(.+)/.exec(s)?.[1]?.trim(),u=/EMAIL.*:(.+)/.exec(s)?.[1]?.trim();i&&o.push({name:i,surname:n,phone:d||"",email:u||"",notes:{},tags:[]})}return o}function de(t){return t.map(o=>`BEGIN:VCARD
VERSION:3.0
FN:${o.name}
N:${o.surname||""};;;;
TEL:${o.phone||""}
EMAIL:${o.email||""}
END:VCARD`).join(`
`)}function ue(t){const o=t.split(`
`).filter(Boolean),[a,...s]=o;return s.map(i=>{const[n,d,u,h,v,E]=i.split(",");return{name:n?.trim()||"",surname:d?.trim()||"",phone:u?.trim()||"",email:h?.trim()||"",notes:E?JSON.parse(E):{},tags:v?v.split(";").map(b=>b.trim()):[]}})}function me(){const t=de(e.contacts),o=new Blob([t],{type:"text/vcard"}),a=document.createElement("a");a.href=URL.createObjectURL(o),a.download="contactos.vcf",a.click()}function pe(){const t="name,surname,phone,email,tags,notes",o=e.contacts.map(n=>[n.name,n.surname,n.phone,n.email,(n.tags||[]).join(";"),JSON.stringify(n.notes||{})].map(d=>'"'+String(d).replace(/"/g,'""')+'"').join(",")),a=[t,...o].join(`
`),s=new Blob([a],{type:"text/csv"}),i=document.createElement("a");i.href=URL.createObjectURL(s),i.download="contactos.csv",i.click()}function fe(){const t=new Blob([JSON.stringify(e.contacts,null,2)],{type:"application/json"}),o=document.createElement("a");o.href=URL.createObjectURL(t),o.download="contactos.json",o.click()}function G(){const t=new Date,a=new Date(t.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);let s=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");s.find(i=>i.fecha===a)||(s.push({fecha:a,datos:e.contacts}),s.length>10&&(s=s.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(s))),localStorage.setItem("contactos_diarios_backup_fecha",a)}setInterval(G,60*60*1e3);G();function ge(t){if(!confirm("¿Seguro que quieres restaurar la copia de seguridad del "+t+"? Se sobrescribirán los contactos actuales."))return;const a=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(s=>s.fecha===t);a?(e.contacts=a.datos,S(e.contacts),p(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}function K(t,o){const a=s=>s?s.toLowerCase().replace(/\s+/g," ").trim():"";return!!(a(t.name)===a(o.name)&&a(t.surname)===a(o.surname)||t.phone&&o.phone&&t.phone.replace(/\s+/g,"")===o.phone.replace(/\s+/g,"")||t.email&&o.email&&a(t.email)===a(o.email))}function he(){const t=[],o=new Set;for(let a=0;a<e.contacts.length;a++){if(o.has(a))continue;const s=[{...e.contacts[a],originalIndex:a}];o.add(a);for(let i=a+1;i<e.contacts.length;i++)o.has(i)||K(e.contacts[a],e.contacts[i])&&(s.push({...e.contacts[i],originalIndex:i}),o.add(i));s.length>1&&t.push({contacts:s})}return t}function X(t){if(t.length===0)return null;if(t.length===1)return t[0];const o={name:"",surname:"",phone:"",email:"",tags:[],notes:{},pinned:!1};let a="",s="";t.forEach(n=>{n.name&&n.name.length>a.length&&(a=n.name),n.surname&&n.surname.length>s.length&&(s=n.surname)}),o.name=a,o.surname=s,o.phone=t.find(n=>n.phone)?.phone||"",o.email=t.find(n=>n.email)?.email||"";const i=new Set;return t.forEach(n=>{n.tags&&n.tags.forEach(d=>i.add(d))}),o.tags=Array.from(i),t.forEach((n,d)=>{n.notes&&Object.entries(n.notes).forEach(([u,h])=>{o.notes[u]?o.notes[u]+=`
--- Contacto ${d+1} ---
${h}`:o.notes[u]=h})}),o.pinned=t.some(n=>n.pinned),o}function ve(t){const o=X(t);return`
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
  `}function be({duplicates:t,visible:o}){return!o||t.length===0?'<div id="duplicate-modal" class="modal" style="display:none"></div>':`
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
  `}function ye(){const t=[];let o=0;if(e.duplicates.forEach((n,d)=>{const u=document.querySelector(`input[name="resolution-${d}"]:checked`),h=u?u.value:"skip";if(h==="merge")t.push({type:"merge",groupIndex:d,contacts:n.contacts}),o++;else if(h==="select"){const v=document.querySelector(`input[name="keep-${d}"]:checked`);if(v){const E=parseInt(v.value),b=n.contacts.filter(w=>w.originalIndex!==E).map(w=>w.originalIndex);t.push({type:"delete",groupIndex:d,toDelete:b,toKeep:E}),o++}}}),o===0){g("No hay operaciones que realizar","info");return}const a=t.filter(n=>n.type==="merge").length,s=t.filter(n=>n.type==="delete").length;let i=`¿Confirmar las siguientes operaciones?

`;if(a>0&&(i+=`🔗 Fusionar ${a} grupo(s) de contactos
`),s>0&&(i+=`🗑️ Eliminar duplicados en ${s} grupo(s)
`),i+=`
Esta acción no se puede deshacer.`,!confirm(i)){g("Operación cancelada","info");return}try{let n=0,d=0;const u=[];t.forEach(b=>{if(b.type==="merge"){const w=X(b.contacts);e.contacts.push(w),b.contacts.forEach(A=>{u.push(A.originalIndex)}),n++}else b.type==="delete"&&(b.toDelete.forEach(w=>{u.push(w)}),d+=b.toDelete.length)}),[...new Set(u)].sort((b,w)=>w-b).forEach(b=>{b<e.contacts.length&&e.contacts.splice(b,1)}),S(e.contacts);let v="Resolución completada: ";const E=[];n>0&&E.push(`${n} contacto(s) fusionado(s)`),d>0&&E.push(`${d} duplicado(s) eliminado(s)`),v+=E.join(" y "),g(v,"success"),e.showDuplicateModal=!1,e.duplicates=[],p()}catch(n){g("Error al aplicar resolución: "+n.message,"error")}}const R="contactos_diarios_auth";let I={isAuthenticated:!1,sessionExpiry:null};function Y(t){let o=0;for(let a=0;a<t.length;a++){const s=t.charCodeAt(a);o=(o<<5)-o+s,o=o&o}return o.toString()}function Ee(t){const o=Y(t);localStorage.setItem(R,o),g("Contraseña establecida correctamente","success")}function xe(t){const o=localStorage.getItem(R);return o?Y(t)===o:!1}function P(){return localStorage.getItem(R)!==null}function we(t){return xe(t)?(I.isAuthenticated=!0,I.sessionExpiry=Date.now()+30*60*1e3,g("Autenticación exitosa","success"),setTimeout(()=>{Z()},100),!0):(g("Contraseña incorrecta","error"),!1)}function M(){return I.isAuthenticated?Date.now()>I.sessionExpiry?(I.isAuthenticated=!1,I.sessionExpiry=null,!1):!0:!1}function $e(){I.isAuthenticated=!1,I.sessionExpiry=null,g("Sesión cerrada","info")}function Z(){if(!e.pendingAction)return;const t=e.pendingAction;switch(e.pendingAction=null,t.type){case"showAllNotes":e.showAllNotes=!0,e.allNotesPage=1;break;case"addNote":e.addNoteContactIndex=t.contactIndex,e.showAddNoteModal=!0;break;case"showContactNotes":e.selected=t.contactIndex,e.editing=null;break}p()}function ke({visible:t,mode:o="login"}){return`
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
  `}function Se(){return window.innerWidth<=700||/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)}function Ie(){if(/iPad|iPhone|iPod/.test(navigator.userAgent)&&(document.body.style.webkitOverflowScrolling="touch"),window.matchMedia("(display-mode: standalone)").matches&&(document.body.classList.add("pwa-mode"),/iPhone/.test(navigator.userAgent)&&(document.body.style.paddingTop="env(safe-area-inset-top)")),Se()){const t=document.querySelector('meta[name="viewport"]');t&&t.setAttribute("content","width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover")}}document.addEventListener("DOMContentLoaded",()=>{p(),Ie()});let T=!1,j=null;function U(){T=!0,j&&clearTimeout(j),j=setTimeout(()=>{T=!1},150)}function B(){return!T}function Q(){const t=document.querySelector(".contact-list ul");t&&(t.addEventListener("scroll",U,{passive:!0}),t.addEventListener("touchmove",U,{passive:!0}))}Q();async function Ne(){console.log("🔍 Obteniendo versión del Service Worker...");try{if("serviceWorker"in navigator&&navigator.serviceWorker.controller){console.log("📡 Intentando comunicación directa con SW...");const a=new MessageChannel,s=new Promise((n,d)=>{const u=setTimeout(()=>{d(new Error("Timeout en comunicación con SW"))},3e3);a.port1.onmessage=h=>{clearTimeout(u),h.data&&h.data.type==="VERSION_RESPONSE"?(console.log("✅ Versión recibida del SW:",h.data.version),n(h.data.version)):d(new Error("Respuesta inválida del SW"))}});return navigator.serviceWorker.controller.postMessage({type:"GET_VERSION"},[a.port2]),await s}console.log("📄 SW no disponible, intentando fetch...");const t=`${Date.now()}-${Math.random().toString(36).substr(2,9)}`,o=[`/sw.js?v=${t}`,`/ContactosDiarios/sw.js?v=${t}`,`./sw.js?v=${t}`];for(const a of o)try{console.log(`🌐 Intentando fetch: ${a}`);const s=await fetch(a,{cache:"no-cache",headers:{"Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0"}});if(s.ok){const i=await s.text();console.log("📄 Código SW obtenido, longitud:",i.length);const n=[/CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/const\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/let\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/var\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/version['":]?\s*['"`]([0-9.]+)['"`]/i,/v?([0-9]+\.[0-9]+\.[0-9]+)/];for(const d of n){const u=i.match(d);if(u&&u[1])return console.log("✅ Versión encontrada:",u[1]),u[1]}console.log("⚠️ No se encontró versión en el código SW")}}catch(s){console.log(`❌ Error fetch ${a}:`,s.message)}return console.log("🔄 Usando versión fallback..."),"0.0.85"}catch(t){return console.error("❌ Error general obteniendo versión SW:",t),"0.0.85"}}async function _(){console.log("📱 Iniciando visualización de versión SW...");let t=document.getElementById("sw-version-info");t||(t=document.createElement("div"),t.id="sw-version-info",t.className="version-info",document.body.appendChild(t)),t.innerHTML=`
    <p class="version-text">Service Worker cargando...</p>
  `;const o=await Ne();t.innerHTML=`
    <p class="version-text">Service Worker v${o}</p>
  `,console.log("✅ Versión SW mostrada:",o)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",J):J();async function J(){console.log("🚀 Inicializando aplicación...");const t=_(),o=new Promise(s=>setTimeout(()=>s("timeout"),5e3));if(await Promise.race([t,o])==="timeout"){console.log("⏰ Timeout obteniendo versión SW, usando fallback");let s=document.getElementById("sw-version-info");s&&(s.innerHTML=`
        <p class="version-text">Service Worker v0.0.85</p>
      `)}"serviceWorker"in navigator&&(navigator.serviceWorker.addEventListener("controllerchange",()=>{console.log("🔄 Service Worker actualizado, refrescando versión..."),setTimeout(()=>_(),500)}),navigator.serviceWorker.ready.then(()=>{console.log("✅ Service Worker listo, actualizando versión..."),setTimeout(()=>_(),2e3)}).catch(s=>{console.log("❌ Error esperando SW ready:",s)}))}
