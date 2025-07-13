(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const d of o.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function a(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=a(s);fetch(s.href,o)}})();const z="0.0.83";(function(){try{const n=localStorage.getItem("app_version");if(n&&n!==z){const a=localStorage.getItem("contactos_diarios"),i=localStorage.getItem("contactos_diarios_backups"),s=localStorage.getItem("contactos_diarios_backup_fecha"),o=localStorage.getItem("contactos_diarios_webdav_config");["app_version","contactos_diarios","contactos_diarios_backups","contactos_diarios_backup_fecha","contactos_diarios_webdav_config"].forEach(p=>{p!=="contactos_diarios"&&localStorage.removeItem(p)}),"caches"in window&&caches.keys().then(p=>{p.forEach(b=>{(b.includes("contactosdiarios")||b.includes("contactos-diarios"))&&caches.delete(b)})}),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(p=>{p.forEach(b=>{b.scope.includes(window.location.origin)&&b.unregister()})}),a&&localStorage.setItem("contactos_diarios",a),i&&localStorage.setItem("contactos_diarios_backups",i),s&&localStorage.setItem("contactos_diarios_backup_fecha",s),o&&localStorage.setItem("contactos_diarios_webdav_config",o),location.reload()}localStorage.setItem("app_version",z)}catch{}})();function te({contacts:t,filter:n,onSelect:a,onDelete:i}){let s=n?t.filter(o=>{const d=n.toLowerCase(),p=o.notes?Object.values(o.notes).join(" ").toLowerCase():"";return o.tags?.some(b=>b.toLowerCase().includes(d))||o.name?.toLowerCase().includes(d)||o.surname?.toLowerCase().includes(d)||p.includes(d)}):t;return s=s.slice().sort((o,d)=>d.pinned&&!o.pinned?1:o.pinned&&!d.pinned?-1:(o.surname||"").localeCompare(d.surname||"")),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${n||""}" />
      <ul>
        ${s.length===0?'<li class="empty">Sin contactos</li>':s.map((o,d)=>`
          <li${o.pinned?' class="pinned"':""}>
            <div class="contact-main">
              <button class="select-contact" data-index="${t.indexOf(o)}">${o.surname?o.surname+", ":""}${o.name}</button>
              <span class="tags">${(o.tags||[]).map(p=>`<span class='tag'>${p}</span>`).join(" ")}</span>
              <button class="pin-contact" data-index="${t.indexOf(o)}" title="${o.pinned?"Desfijar":"Fijar"}">${o.pinned?"📌":"📍"}</button>
            </div>
            <div class="contact-info">
              ${o.phone?`<a href="tel:${o.phone}" class="contact-link" title="Llamar"><span>📞</span> ${o.phone}</a>`:""}
              ${o.email?`<a href="mailto:${o.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${o.email}</a>`:""}
            </div>
            <div class="contact-actions">
              <button class="add-note-contact" data-index="${t.indexOf(o)}" title="Añadir nota">📝</button>
              <button class="edit-contact" data-index="${t.indexOf(o)}" title="Editar">✏️</button>
              <button class="delete-contact" data-index="${t.indexOf(o)}" title="Eliminar">🗑️</button>
            </div>
          </li>
        `).join("")}
      </ul>
    </div>
  `}function ne({contact:t}){return`
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
    `;const n=new Date;return`
    <div class="notes-area">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
        <h3>Notas diarias</h3>
        <button id="logout-btn" style="background:#dc3545;color:white;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;font-size:0.8em;">
          🚪 Cerrar sesión
        </button>
      </div>
      <form id="note-form">
        <input type="date" id="note-date" value="${new Date(n.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10)}" required />
        <textarea id="note-text" rows="3" placeholder="Escribe una nota para la fecha seleccionada..."></textarea>
        <button type="submit">Guardar nota</button>
      </form>
      <ul class="note-history">
        ${Object.entries(t||{}).sort((s,o)=>o[0].localeCompare(s[0])).map(([s,o])=>`
          <li>
            <b>${s}</b>:
            <span class="note-content" data-date="${s}">${o}</span>
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
  `}function ae({}){return`
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
  `}function se({contacts:t,visible:n,page:a=1}){let i=[];t.forEach((h,x)=>{h.notes&&Object.entries(h.notes).forEach(([v,E])=>{i.push({date:v,text:E,contact:h,contactIndex:x})})}),i.sort((h,x)=>x.date.localeCompare(h.date));const s=4,o=Math.max(1,Math.ceil(i.length/s)),d=Math.min(Math.max(a,1),o),p=(d-1)*s,b=i.slice(p,p+s);return`
    <div id="all-notes-modal" class="modal" style="display:${n?"flex":"none"}">
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
          <span>Página ${d} de ${o}</span>
          <button id="next-notes-page" ${d===o?"disabled":""}>Siguiente &gt;</button>
        </div>
        <div class="form-actions">
          <button id="close-all-notes">Cerrar</button>
        </div>
      </div>
    </div>
  `}function ie({visible:t,backups:n}){return`
    <div id="backup-modal" class="modal" style="display:${t?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:400px;">
        <h3>Restaurar copia local</h3>
        <div class="backup-btns" style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;">
          ${n.length===0?"<span>Sin copias locales.</span>":n.map(a=>`
            <div class="backup-btn-group" style="display:flex;align-items:center;gap:0.3rem;">
              <button class="restore-backup-btn" data-fecha="${a.fecha}">${a.fecha}</button>
              <button class="share-backup-btn" data-fecha="${a.fecha}" title="Compartir backup" style="background:#06b6d4;padding:0.4rem 0.7rem;font-size:1.1em;">📤</button>
            </div>
          `).join("")}
        </div>
        <div class="form-actions" style="margin-top:1.2rem;"><button id="close-backup-modal">Cerrar</button></div>
      </div>
    </div>
  `}function ce({visible:t,contactIndex:n}){const a=n!==null?e.contacts[n]:null,i=new Date,o=new Date(i.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);return`
    <div id="add-note-modal" class="modal" style="display:${t?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:500px;">
        <h3>Añadir nota diaria</h3>
        ${a?`<p><strong>${a.surname?a.surname+", ":""}${a.name}</strong></p>`:""}
        <form id="add-note-form">
          <label>Fecha <input type="date" id="add-note-date" value="${o}" required /></label>
          <label>Nota <textarea id="add-note-text" rows="4" placeholder="Escribe una nota para este contacto..." required></textarea></label>
          <div class="form-actions">
            <button type="submit">Guardar nota</button>
            <button type="button" id="cancel-add-note">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `}function g(t,n="info"){let a=document.getElementById("notification-container");a||(a=document.createElement("div"),a.id="notification-container",a.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
      pointer-events: none;
    `,document.body.appendChild(a));const i=document.createElement("div");i.style.cssText=`
    background: ${n==="success"?"#d4edda":n==="error"?"#f8d7da":n==="warning"?"#fff3cd":"#d1ecf1"};
    color: ${n==="success"?"#155724":n==="error"?"#721c24":n==="warning"?"#856404":"#0c5460"};
    border: 1px solid ${n==="success"?"#c3e6cb":n==="error"?"#f5c6cb":n==="warning"?"#ffeaa7":"#bee5eb"};
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
  `;const s=n==="success"?"✅":n==="error"?"❌":n==="warning"?"⚠️":"ℹ️";i.innerHTML=`${s} ${t}`,a.appendChild(i),setTimeout(()=>{i.style.opacity="1",i.style.transform="translateX(0)"},10);const o=()=>{i.style.opacity="0",i.style.transform="translateX(100%)",setTimeout(()=>{i.parentNode&&i.parentNode.removeChild(i)},300)};i.onclick=o,setTimeout(o,4e3)}function L(t){const n=[];return!t.name||t.name.trim().length===0?n.push("El nombre es obligatorio"):t.name.trim().length<2?n.push("El nombre debe tener al menos 2 caracteres"):t.name.trim().length>50&&n.push("El nombre no puede tener más de 50 caracteres"),t.surname&&t.surname.trim().length>50&&n.push("Los apellidos no pueden tener más de 50 caracteres"),t.phone&&t.phone.trim().length>0&&(/^[\d\s\-\+\(\)\.]{6,20}$/.test(t.phone.trim())||n.push("El teléfono debe contener solo números, espacios y caracteres válidos (6-20 caracteres)")),t.email&&t.email.trim().length>0&&(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.email.trim())?t.email.trim().length>100&&n.push("El email no puede tener más de 100 caracteres"):n.push("El email debe tener un formato válido")),n}function j(t){const n=[];return!t||t.trim().length===0?(n.push("La nota no puede estar vacía"),n):(t.trim().length>1e3&&n.push("La nota no puede tener más de 1000 caracteres"),t.trim().length<3&&n.push("La nota debe tener al menos 3 caracteres"),/^[\w\s\.\,\;\:\!\?\-\(\)\[\]\"\'\/\@\#\$\%\&\*\+\=\<\>\{\}\|\~\`\ñÑáéíóúÁÉÍÓÚüÜ]*$/.test(t)||n.push("La nota contiene caracteres no permitidos"),n)}const H="contactos_diarios";let e={contacts:le(),selected:null,notes:"",editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1,showAddNoteModal:!1,addNoteContactIndex:null,allNotesPage:1,duplicates:[],showDuplicateModal:!1,showAuthModal:!1,authMode:"login",pendingAction:null};function le(){try{return JSON.parse(localStorage.getItem(H))||[]}catch{return[]}}function I(t){localStorage.setItem(H,JSON.stringify(t))}function m(){const t=document.querySelector("#app"),n=e.editing!==null?e.contacts[e.editing]:null,a=e.selected!==null?e.contacts[e.selected].notes||{}:{};t.innerHTML=`
    <h1>Diario de Contactos</h1>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <div class="main-grid">
      <div>
        <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
        ${te({contacts:e.contacts,filter:e.tagFilter})}
        <button id="show-backup-modal" class="add-btn" style="width:100%;margin-top:0.7rem;background:#06b6d4;">Restaurar copia local</button>
        <div style="margin-top:1rem;">
          <button id="import-btn" style="background:#6f42c1;color:#fff;margin:0 10px 1.2rem 0;">📂 Importar contactos</button>
          <button id="export-btn" style="background:#fd7e14;color:#fff;margin:0 10px 1.2rem 0;">💾 Exportar contactos</button>
          <button id="manage-duplicates-btn" style="background:#dc3545;color:#fff;margin:0 10px 1.2rem 0;">🔍 Gestionar duplicados</button>
          <button id="validate-contacts-btn" style="background:#28a745;color:#fff;margin:0 10px 1.2rem 0;">✅ Validar contactos</button>
        </div>
      </div>
      <div>
        ${e.editing!==null?ne({contact:n}):""}
        ${e.selected!==null&&e.editing===null?oe({notes:a}):""}
      </div>
    </div>
    ${se({contacts:e.contacts,visible:e.showAllNotes,page:e.allNotesPage})}
    ${ie({visible:e.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})} <!-- Modal de backup -->
    ${ce({visible:e.showAddNoteModal,contactIndex:e.addNoteContactIndex})} <!-- Modal añadir nota -->
    ${ye({duplicates:e.duplicates,visible:e.showDuplicateModal})} <!-- Modal de gestión de duplicados -->
    ${Ie({visible:e.showAuthModal,mode:e.authMode})} <!-- Modal de autenticación -->
    ${ae({})}
  `,re(),ee();const i=document.getElementById("show-backup-modal");i&&(i.onclick=()=>{e.showBackupModal=!0,m()});const s=document.getElementById("close-backup-modal");s&&(s.onclick=()=>{e.showBackupModal=!1,m()}),document.querySelectorAll(".add-note-contact").forEach(p=>{p.onclick=b=>{const h=Number(p.dataset.index);if(!M()){e.pendingAction={type:"addNote",contactIndex:h},P()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m();return}e.addNoteContactIndex=h,e.showAddNoteModal=!0,m()}});const o=document.getElementById("cancel-add-note");o&&(o.onclick=()=>{e.showAddNoteModal=!1,e.addNoteContactIndex=null,m()}),document.querySelectorAll(".restore-backup-btn").forEach(p=>{p.onclick=()=>he(p.dataset.fecha)});const d=document.getElementById("restore-local-backup");d&&(d.onclick=restaurarBackupLocal)}let W=null;function re(){const t=document.getElementById("tag-filter");t&&t.addEventListener("input",l=>{clearTimeout(W),W=setTimeout(()=>{e.tagFilter=t.value,m();const c=document.getElementById("tag-filter");c&&(c.value=e.tagFilter,c.focus(),c.setSelectionRange(e.tagFilter.length,e.tagFilter.length))},300)});const n=document.getElementById("add-contact");n&&(n.onclick=()=>{e.editing=null,e.selected=null,m(),e.editing=e.contacts.length,m()}),document.querySelectorAll(".select-contact").forEach(l=>{l.onclick=c=>{c.preventDefault(),c.stopPropagation(),B()&&(e.selected=Number(l.dataset.index),e.editing=null,m())}}),document.querySelectorAll(".edit-contact").forEach(l=>{l.onclick=c=>{c.preventDefault(),c.stopPropagation(),B()&&(e.editing=Number(l.dataset.index),e.selected=null,m())}}),document.querySelectorAll(".delete-contact").forEach(l=>{l.onclick=c=>{if(c.preventDefault(),c.stopPropagation(),!B())return;const r=Number(l.dataset.index),u=e.contacts[r],f=u.surname?`${u.surname}, ${u.name}`:u.name;confirm(`¿Estás seguro de eliminar el contacto "${f}"?

Esta acción no se puede deshacer.`)&&(e.contacts.splice(r,1),I(e.contacts),g("Contacto eliminado correctamente","success"),e.selected=null,m())}}),document.querySelectorAll(".pin-contact").forEach(l=>{l.onclick=c=>{if(c.preventDefault(),c.stopPropagation(),!B())return;const r=Number(l.dataset.index);e.contacts[r].pinned&&!confirm("¿Seguro que quieres desfijar este contacto?")||(e.contacts[r].pinned=!e.contacts[r].pinned,I(e.contacts),m())}});const a=document.getElementById("contact-form");a&&(a.onsubmit=l=>{l.preventDefault();const c=Object.fromEntries(new FormData(a)),r=L(c);if(r.length>0){g("Error de validación: "+r.join(", "),"error");return}let u=c.tags?c.tags.split(",").map(k=>k.trim()).filter(Boolean):[];delete c.tags;const f={...c};e.contacts.some((k,$)=>e.editing!==null&&$===e.editing?!1:X(k,f))&&!confirm("Ya existe un contacto similar. ¿Deseas guardarlo de todas formas?")||(e.editing!==null&&e.editing<e.contacts.length?(e.contacts[e.editing]={...e.contacts[e.editing],...c,tags:u},g("Contacto actualizado correctamente","success")):(e.contacts.push({...c,notes:{},tags:u}),g("Contacto añadido correctamente","success")),I(e.contacts),e.editing=null,m())},document.getElementById("cancel-edit").onclick=()=>{e.editing=null,m()});const i=document.getElementById("add-note-form");if(i&&e.addNoteContactIndex!==null){const l=c=>{c.preventDefault();const r=document.getElementById("add-note-date").value,u=document.getElementById("add-note-text").value.trim();if(!r||!u){g("Por favor, selecciona una fecha y escribe una nota","warning");return}const f=j(u);if(f.length>0){g("Error en la nota: "+f.join(", "),"error");return}const y=e.addNoteContactIndex;e.contacts[y].notes||(e.contacts[y].notes={}),e.contacts[y].notes[r]?e.contacts[y].notes[r]+=`
`+u:e.contacts[y].notes[r]=u,I(e.contacts),g("Nota añadida correctamente","success"),e.showAddNoteModal=!1,e.addNoteContactIndex=null,m()};i.onsubmit=l}const s=document.getElementById("note-form");if(s&&e.selected!==null){const l=c=>{c.preventDefault();const r=document.getElementById("note-date").value,u=document.getElementById("note-text").value.trim();if(!r||!u){g("Por favor, selecciona una fecha y escribe una nota","warning");return}const f=j(u);if(f.length>0){g("Error en la nota: "+f.join(", "),"error");return}e.contacts[e.selected].notes||(e.contacts[e.selected].notes={}),e.contacts[e.selected].notes[r]?e.contacts[e.selected].notes[r]+=`
`+u:e.contacts[e.selected].notes[r]=u,I(e.contacts),g("Nota guardada correctamente","success"),document.getElementById("note-text").value="",m()};s.onsubmit=l}document.querySelectorAll(".edit-note").forEach(l=>{l.onclick=c=>{const r=l.dataset.date,u=document.getElementById("edit-note-modal"),f=document.getElementById("edit-note-text");f.value=e.contacts[e.selected].notes[r],u.style.display="block",document.getElementById("save-edit-note").onclick=()=>{const y=f.value.trim(),k=j(y);if(k.length>0){g("Error en la nota: "+k.join(", "),"error");return}e.contacts[e.selected].notes[r]=y,I(e.contacts),g("Nota actualizada correctamente","success"),u.style.display="none",m()},document.getElementById("cancel-edit-note").onclick=()=>{u.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(l=>{l.onclick=c=>{const r=l.dataset.date;confirm(`¿Estás seguro de eliminar la nota del ${r}?

Esta acción no se puede deshacer.`)&&(delete e.contacts[e.selected].notes[r],I(e.contacts),g("Nota eliminada correctamente","success"),m())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{pe(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{fe(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{ge(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async l=>{const c=l.target.files[0];if(!c)return;const r=await c.text();let u=[];if(c.name.endsWith(".vcf"))u=de(r);else if(c.name.endsWith(".csv"))u=me(r);else if(c.name.endsWith(".json"))try{const f=JSON.parse(r);Array.isArray(f)?u=f:f&&Array.isArray(f.contacts)&&(u=f.contacts)}catch{}if(u.length){const f=[],y=[];if(u.forEach((w,N)=>{const V=L(w);V.length===0?f.push(w):y.push({index:N+1,errors:V})}),y.length>0){const w=y.map(N=>`Contacto ${N.index}: ${N.errors.join(", ")}`).join(`
`);if(!confirm(`Se encontraron ${y.length} contacto(s) con errores:

${w}

¿Deseas importar solo los contactos válidos (${f.length})?`))return}const k=w=>e.contacts.some(N=>N.name===w.name&&N.surname===w.surname&&N.phone===w.phone),$=f.filter(w=>!k(w));$.length?(e.contacts=e.contacts.concat($),I(e.contacts),g(`${$.length} contacto(s) importado(s) correctamente`,"success"),m()):g("No se han importado contactos nuevos (todos ya existen)","info")}else g("No se pudieron importar contactos del archivo seleccionado","error")};const o=document.getElementById("close-all-notes");o&&(o.onclick=()=>{e.showAllNotes=!1,e.allNotesPage=1,m()});const d=document.getElementById("show-all-notes-btn");d&&(d.onclick=()=>{if(!M()){e.pendingAction={type:"showAllNotes"},P()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m();return}e.showAllNotes=!0,e.allNotesPage=1,m()});const p=document.getElementById("prev-notes-page");p&&(p.onclick=()=>{e.allNotesPage>1&&(e.allNotesPage--,m())});const b=document.getElementById("next-notes-page");b&&(b.onclick=()=>{let l=[];e.contacts.forEach((r,u)=>{r.notes&&Object.entries(r.notes).forEach(([f,y])=>{l.push({date:f,text:y,contact:r,contactIndex:u})})});const c=Math.max(1,Math.ceil(l.length/4));e.allNotesPage<c&&(e.allNotesPage++,m())}),document.querySelectorAll(".edit-note-link").forEach(l=>{l.onclick=c=>{c.preventDefault();const r=Number(l.dataset.contact),u=l.dataset.date;e.selected=r,e.editing=null,e.showAllNotes=!1,m(),setTimeout(()=>{const f=document.querySelector(`.edit-note[data-date="${u}"]`);f&&f.click()},50)}}),document.querySelectorAll(".share-backup-btn").forEach(l=>{l.onclick=async()=>{const c=l.dataset.fecha,u=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(w=>w.fecha===c);if(!u)return alert("No se encontró la copia seleccionada.");const f=`contactos_backup_${c}.json`,y=JSON.stringify(u.datos,null,2),k=new Blob([y],{type:"application/json"}),$=document.createElement("a");if($.href=URL.createObjectURL(k),$.download=f,$.style.display="none",document.body.appendChild($),$.click(),setTimeout(()=>{URL.revokeObjectURL($.href),$.remove()},1e3),navigator.canShare&&window.File&&window.FileReader)try{const w=new File([k],f,{type:"application/json"});navigator.canShare({files:[w]})&&await navigator.share({files:[w],title:"Backup de Contactos",text:`Copia de seguridad (${c}) de ContactosDiarios`})}catch{}}});const h=document.getElementById("manage-duplicates-btn");h&&(h.onclick=()=>{e.duplicates=be(),e.duplicates.length===0?g("No se encontraron contactos duplicados","info"):(e.showDuplicateModal=!0,m())});const x=document.getElementById("validate-contacts-btn");x&&(x.onclick=()=>{const l=[];if(e.contacts.forEach((c,r)=>{const u=L(c);if(u.length>0){const f=c.surname?`${c.surname}, ${c.name}`:c.name;l.push({index:r+1,name:f,errors:u})}}),l.length===0)g(`✅ Todos los ${e.contacts.length} contactos son válidos`,"success");else{const c=l.map(r=>`${r.index}. ${r.name}: ${r.errors.join(", ")}`).join(`
`);g(`⚠️ Se encontraron ${l.length} contacto(s) con errores`,"warning"),console.log("Contactos con errores de validación:",l),confirm(`Se encontraron ${l.length} contacto(s) con errores de validación:

${c}

¿Deseas ver más detalles en la consola del navegador?`)&&console.table(l)}});const v=document.getElementById("cancel-duplicate-resolution");v&&(v.onclick=()=>{e.showDuplicateModal=!1,e.duplicates=[],m()});const E=document.getElementById("apply-resolution");E&&(E.onclick=xe),document.querySelectorAll('input[name^="resolution-"]').forEach(l=>{l.addEventListener("change",()=>{const c=l.name.split("-")[1],r=document.getElementById(`merge-section-${c}`),u=document.getElementById(`individual-section-${c}`);l.value==="merge"?(r.style.display="block",u.style.display="none"):l.value==="select"?(r.style.display="none",u.style.display="block"):(r.style.display="none",u.style.display="none")})}),document.querySelectorAll('.resolution-option input[type="radio"]').forEach(l=>{l.addEventListener("change",()=>{const c=l.name;document.querySelectorAll(`input[name="${c}"]`).forEach(r=>{r.closest(".resolution-option").classList.remove("selected")}),l.closest(".resolution-option").classList.add("selected")})});const C=document.getElementById("unlock-notes-btn");C&&(C.onclick=()=>{e.selected!==null&&(e.pendingAction={type:"showContactNotes",contactIndex:e.selected}),P()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m()});const T=document.getElementById("logout-btn");T&&(T.onclick=()=>{ke(),m()});const A=document.getElementById("auth-form");A&&!A.hasAttribute("data-handler-added")&&(A.setAttribute("data-handler-added","true"),A.onsubmit=l=>{l.preventDefault();const c=document.getElementById("auth-password").value.trim();if(!c){g("Por favor, introduce una contraseña","warning");return}if(e.authMode==="setup"){const r=document.getElementById("auth-password-confirm").value.trim();if(c!==r){g("Las contraseñas no coinciden","error");return}if(c.length<4){g("La contraseña debe tener al menos 4 caracteres","warning");return}we(c),S.isAuthenticated=!0,S.sessionExpiry=Date.now()+30*60*1e3,e.showAuthModal=!1,A.reset(),setTimeout(()=>{Q()},100),m()}else $e(c)?(e.showAuthModal=!1,A.reset(),m()):(document.getElementById("auth-password").value="",document.getElementById("auth-password").focus())});const F=document.getElementById("cancel-auth");F&&(F.onclick=()=>{e.showAuthModal=!1,e.pendingAction=null,m()});const D=document.getElementById("auth-modal");if(D){D.onclick=r=>{r.target===D&&(e.showAuthModal=!1,e.pendingAction=null,m())};const l=document.getElementById("auth-password");if(l){const r=window.innerWidth<=700?300:100;setTimeout(()=>{l.focus(),window.innerWidth<=700&&l.scrollIntoView({behavior:"smooth",block:"center"})},r)}const c=r=>{r.key==="Escape"&&e.showAuthModal&&(e.showAuthModal=!1,e.pendingAction=null,m())};document.addEventListener("keydown",c)}}function de(t){const n=[],a=t.split("END:VCARD");for(const i of a){const s=/FN:([^\n]*)/.exec(i)?.[1]?.trim(),o=/N:.*;([^;\n]*)/.exec(i)?.[1]?.trim()||"",d=/TEL.*:(.+)/.exec(i)?.[1]?.trim(),p=/EMAIL.*:(.+)/.exec(i)?.[1]?.trim();s&&n.push({name:s,surname:o,phone:d||"",email:p||"",notes:{},tags:[]})}return n}function ue(t){return t.map(n=>`BEGIN:VCARD
VERSION:3.0
FN:${n.name}
N:${n.surname||""};;;;
TEL:${n.phone||""}
EMAIL:${n.email||""}
END:VCARD`).join(`
`)}function me(t){const n=t.split(`
`).filter(Boolean),[a,...i]=n;return i.map(s=>{const[o,d,p,b,h,x]=s.split(",");return{name:o?.trim()||"",surname:d?.trim()||"",phone:p?.trim()||"",email:b?.trim()||"",notes:x?JSON.parse(x):{},tags:h?h.split(";").map(v=>v.trim()):[]}})}function pe(){const t=ue(e.contacts),n=new Blob([t],{type:"text/vcard"}),a=document.createElement("a");a.href=URL.createObjectURL(n),a.download="contactos.vcf",a.click()}function fe(){const t="name,surname,phone,email,tags,notes",n=e.contacts.map(o=>[o.name,o.surname,o.phone,o.email,(o.tags||[]).join(";"),JSON.stringify(o.notes||{})].map(d=>'"'+String(d).replace(/"/g,'""')+'"').join(",")),a=[t,...n].join(`
`),i=new Blob([a],{type:"text/csv"}),s=document.createElement("a");s.href=URL.createObjectURL(i),s.download="contactos.csv",s.click()}function ge(){const t=new Blob([JSON.stringify(e.contacts,null,2)],{type:"application/json"}),n=document.createElement("a");n.href=URL.createObjectURL(t),n.download="contactos.json",n.click()}function K(){const t=new Date,a=new Date(t.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);let i=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");i.find(s=>s.fecha===a)||(i.push({fecha:a,datos:e.contacts}),i.length>10&&(i=i.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(i))),localStorage.setItem("contactos_diarios_backup_fecha",a)}setInterval(K,60*60*1e3);K();function he(t){if(!confirm("¿Seguro que quieres restaurar la copia de seguridad del "+t+"? Se sobrescribirán los contactos actuales."))return;const a=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(i=>i.fecha===t);a?(e.contacts=a.datos,I(e.contacts),m(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}function X(t,n){const a=i=>i?i.toLowerCase().replace(/\s+/g," ").trim():"";return!!(a(t.name)===a(n.name)&&a(t.surname)===a(n.surname)||t.phone&&n.phone&&t.phone.replace(/\s+/g,"")===n.phone.replace(/\s+/g,"")||t.email&&n.email&&a(t.email)===a(n.email))}function be(){const t=[],n=new Set;for(let a=0;a<e.contacts.length;a++){if(n.has(a))continue;const i=[{...e.contacts[a],originalIndex:a}];n.add(a);for(let s=a+1;s<e.contacts.length;s++)n.has(s)||X(e.contacts[a],e.contacts[s])&&(i.push({...e.contacts[s],originalIndex:s}),n.add(s));i.length>1&&t.push({contacts:i})}return t}function Y(t){if(t.length===0)return null;if(t.length===1)return t[0];const n={name:"",surname:"",phone:"",email:"",tags:[],notes:{},pinned:!1};let a="",i="";t.forEach(o=>{o.name&&o.name.length>a.length&&(a=o.name),o.surname&&o.surname.length>i.length&&(i=o.surname)}),n.name=a,n.surname=i,n.phone=t.find(o=>o.phone)?.phone||"",n.email=t.find(o=>o.email)?.email||"";const s=new Set;return t.forEach(o=>{o.tags&&o.tags.forEach(d=>s.add(d))}),n.tags=Array.from(s),t.forEach((o,d)=>{o.notes&&Object.entries(o.notes).forEach(([p,b])=>{n.notes[p]?n.notes[p]+=`
--- Contacto ${d+1} ---
${b}`:n.notes[p]=b})}),n.pinned=t.some(o=>o.pinned),n}function ve(t){const n=Y(t);return`
    <div class="merge-preview">
      <h5>🔗 Vista previa del contacto fusionado:</h5>
      <div class="contact-preview">
        <div class="contact-field"><strong>Nombre:</strong> ${n.name}</div>
        <div class="contact-field"><strong>Apellidos:</strong> ${n.surname}</div>
        <div class="contact-field"><strong>Teléfono:</strong> ${n.phone||"No especificado"}</div>
        <div class="contact-field"><strong>Email:</strong> ${n.email||"No especificado"}</div>
        <div class="contact-field">
          <strong>Etiquetas:</strong>
          <div class="tags">
            ${n.tags.map(a=>`<span class="tag">${a}</span>`).join("")}
          </div>
        </div>
        <div class="contact-field">
          <strong>Notas:</strong> ${Object.keys(n.notes).length} fecha(s) con notas
        </div>
        <div class="contact-field">
          <strong>Estado:</strong> ${n.pinned?"📌 Fijado":"Normal"}
        </div>
      </div>
    </div>
  `}function ye({duplicates:t,visible:n}){return!n||t.length===0?'<div id="duplicate-modal" class="modal" style="display:none"></div>':`
    <div id="duplicate-modal" class="modal" style="display:flex;z-index:5000;">
      <div class="modal-content" style="max-width:800px;max-height:90vh;overflow-y:auto;">
        <h3>🔍 Gestión de contactos duplicados</h3>
        <p>Se encontraron <strong>${t.length}</strong> grupo(s) de contactos duplicados. 
           Para cada grupo, elige cómo resolverlo:</p>
        
        ${t.map((a,i)=>`
          <div class="duplicate-group" style="border:1px solid #ddd;border-radius:8px;padding:15px;margin:15px 0;background:#fafafa;">
            <h4>Grupo ${i+1} - ${a.contacts.length} contactos similares</h4>
            
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
              ${ve(a.contacts)}
            </div>
            
            <!-- Sección de selección individual (oculta por defecto) -->
            <div class="individual-selection" id="individual-section-${i}" style="display:none;">
              <h5>Selecciona el contacto a mantener:</h5>
              ${a.contacts.map((s,o)=>`
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
  `}function xe(){const t=[];let n=0;if(e.duplicates.forEach((o,d)=>{const p=document.querySelector(`input[name="resolution-${d}"]:checked`),b=p?p.value:"skip";if(b==="merge")t.push({type:"merge",groupIndex:d,contacts:o.contacts}),n++;else if(b==="select"){const h=document.querySelector(`input[name="keep-${d}"]:checked`);if(h){const x=parseInt(h.value),v=o.contacts.filter(E=>E.originalIndex!==x).map(E=>E.originalIndex);t.push({type:"delete",groupIndex:d,toDelete:v,toKeep:x}),n++}}}),n===0){g("No hay operaciones que realizar","info");return}const a=t.filter(o=>o.type==="merge").length,i=t.filter(o=>o.type==="delete").length;let s=`¿Confirmar las siguientes operaciones?

`;if(a>0&&(s+=`🔗 Fusionar ${a} grupo(s) de contactos
`),i>0&&(s+=`🗑️ Eliminar duplicados en ${i} grupo(s)
`),s+=`
Esta acción no se puede deshacer.`,!confirm(s)){g("Operación cancelada","info");return}try{let o=0,d=0;const p=[];t.forEach(v=>{if(v.type==="merge"){const E=Y(v.contacts);e.contacts.push(E),v.contacts.forEach(C=>{p.push(C.originalIndex)}),o++}else v.type==="delete"&&(v.toDelete.forEach(E=>{p.push(E)}),d+=v.toDelete.length)}),[...new Set(p)].sort((v,E)=>E-v).forEach(v=>{v<e.contacts.length&&e.contacts.splice(v,1)}),I(e.contacts);let h="Resolución completada: ";const x=[];o>0&&x.push(`${o} contacto(s) fusionado(s)`),d>0&&x.push(`${d} duplicado(s) eliminado(s)`),h+=x.join(" y "),g(h,"success"),e.showDuplicateModal=!1,e.duplicates=[],m()}catch(o){g("Error al aplicar resolución: "+o.message,"error")}}const R="contactos_diarios_auth";let S={isAuthenticated:!1,sessionExpiry:null};function Z(t){let n=0;for(let a=0;a<t.length;a++){const i=t.charCodeAt(a);n=(n<<5)-n+i,n=n&n}return n.toString()}function we(t){const n=Z(t);localStorage.setItem(R,n),g("Contraseña establecida correctamente","success")}function Ee(t){const n=localStorage.getItem(R);return n?Z(t)===n:!1}function P(){return localStorage.getItem(R)!==null}function $e(t){return Ee(t)?(S.isAuthenticated=!0,S.sessionExpiry=Date.now()+30*60*1e3,g("Autenticación exitosa","success"),setTimeout(()=>{Q()},100),!0):(g("Contraseña incorrecta","error"),!1)}function M(){return S.isAuthenticated?Date.now()>S.sessionExpiry?(S.isAuthenticated=!1,S.sessionExpiry=null,!1):!0:!1}function ke(){S.isAuthenticated=!1,S.sessionExpiry=null,g("Sesión cerrada","info")}function Q(){if(!e.pendingAction)return;const t=e.pendingAction;switch(e.pendingAction=null,t.type){case"showAllNotes":e.showAllNotes=!0,e.allNotesPage=1;break;case"addNote":e.addNoteContactIndex=t.contactIndex,e.showAddNoteModal=!0;break;case"showContactNotes":e.selected=t.contactIndex,e.editing=null;break}m()}function Ie({visible:t,mode:n="login"}){return`
    <div id="auth-modal" class="modal" style="display:${t?"flex":"none"};z-index:6000;">
      <div class="modal-content" style="max-width:400px;">
        <h3>${n==="setup"?"🔐 Establecer contraseña":"🔑 Acceso a notas privadas"}</h3>
        <p>${n==="setup"?"Establece una contraseña para proteger tus notas personales:":"Introduce tu contraseña para acceder a las notas:"}</p>
        
        <form id="auth-form">
          <label>
            Contraseña
            <input type="password" id="auth-password" placeholder="Introduce tu contraseña" required autocomplete="current-password" />
          </label>
          ${n==="setup"?`
            <label>
              Confirmar contraseña
              <input type="password" id="auth-password-confirm" placeholder="Confirma tu contraseña" required autocomplete="new-password" />
            </label>
          `:""}
          <div class="form-actions" style="margin-top:20px;">
            <button type="submit">${n==="setup"?"Establecer contraseña":"Acceder"}</button>
            <button type="button" id="cancel-auth">Cancelar</button>
          </div>
        </form>
        
        ${n==="login"?`
          <div style="margin-top:15px;padding-top:15px;border-top:1px solid #ddd;">
            <p style="font-size:0.9em;color:#666;">
              💡 La contraseña se almacena de forma segura en tu dispositivo
            </p>
          </div>
        `:""}
      </div>
    </div>
  `}function Se(){return window.innerWidth<=700||/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)}function Ne(){if(/iPad|iPhone|iPod/.test(navigator.userAgent)&&(document.body.style.webkitOverflowScrolling="touch"),window.matchMedia("(display-mode: standalone)").matches&&(document.body.classList.add("pwa-mode"),/iPhone/.test(navigator.userAgent)&&(document.body.style.paddingTop="env(safe-area-inset-top)")),Se()){const t=document.querySelector('meta[name="viewport"]');t&&t.setAttribute("content","width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover")}}document.addEventListener("DOMContentLoaded",()=>{m(),Ne()});let q=!1,O=null;function U(){q=!0,O&&clearTimeout(O),O=setTimeout(()=>{q=!1},150)}function B(){return!q}function ee(){const t=document.querySelector(".contact-list ul");t&&(t.addEventListener("scroll",U,{passive:!0}),t.addEventListener("touchmove",U,{passive:!0}))}ee();async function Ae(){try{if("serviceWorker"in navigator&&navigator.serviceWorker.controller){const t=await navigator.serviceWorker.getRegistration();if(t&&t.active){const i=(await(await fetch(t.active.scriptURL)).text()).match(/CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/);if(i)return i[1]}}return"No disponible"}catch(t){return console.log("Error obteniendo versión SW:",t),"Error"}}async function J(){const t=await Ae();let n=document.getElementById("sw-version-info");n||(n=document.createElement("div"),n.id="sw-version-info",n.className="version-info",document.body.appendChild(n)),n.innerHTML=`
    <p class="version-text">Service Worker v${t}</p>
  `}function _(){return!!(window.matchMedia("(display-mode: standalone)").matches||window.matchMedia("(display-mode: fullscreen)").matches||window.matchMedia("(display-mode: minimal-ui)").matches||window.navigator.standalone===!0)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{J(),G()}):(J(),G());function G(){let t=document.querySelector('button[textContent*="Instalar"]')||document.querySelector("#install-btn")||Array.from(document.querySelectorAll("button")).find(a=>a.textContent.includes("Instalar"));if(t||(t=document.createElement("button"),t.id="install-btn",t.textContent="📲 Instalar en tu dispositivo",t.className="add-btn",t.style.cssText=`
      display: none;
      position: fixed;
      bottom: 4rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 3000;
      background: #3a4a7c;
      color: white;
      border: none;
      padding: 0.8rem 1.2rem;
      border-radius: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
    `,document.body.appendChild(t)),_()){t.style.display="none";return}let n=null;window.addEventListener("beforeinstallprompt",a=>{a.preventDefault(),n=a,_()||(t.style.display="block")}),t.addEventListener("click",async()=>{if(n){n.prompt();const{outcome:a}=await n.userChoice;a==="accepted"&&(t.style.display="none"),n=null}}),window.addEventListener("appinstalled",()=>{t.style.display="none"}),setInterval(()=>{_()&&t.style.display!=="none"&&(t.style.display="none")},3e3)}
