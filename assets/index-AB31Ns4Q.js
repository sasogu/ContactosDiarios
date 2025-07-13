(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}})();const F="0.0.98";(function(){try{const o=localStorage.getItem("app_version");if(o&&o!==F){const n=localStorage.getItem("contactos_diarios"),a=localStorage.getItem("contactos_diarios_backups"),s=localStorage.getItem("contactos_diarios_backup_fecha"),i=localStorage.getItem("contactos_diarios_webdav_config");["app_version","contactos_diarios","contactos_diarios_backups","contactos_diarios_backup_fecha","contactos_diarios_webdav_config"].forEach(u=>{u!=="contactos_diarios"&&localStorage.removeItem(u)}),"caches"in window&&caches.keys().then(u=>{u.forEach(f=>{(f.includes("contactosdiarios")||f.includes("contactos-diarios"))&&caches.delete(f)})}),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(u=>{u.forEach(f=>{f.scope.includes(window.location.origin)&&f.unregister()})}),n&&localStorage.setItem("contactos_diarios",n),a&&localStorage.setItem("contactos_diarios_backups",a),s&&localStorage.setItem("contactos_diarios_backup_fecha",s),i&&localStorage.setItem("contactos_diarios_webdav_config",i),location.reload()}localStorage.setItem("app_version",F)}catch{}})();function Q({contacts:t,filter:o,onSelect:n,onDelete:a}){let s=o?t.filter(c=>{const u=o.toLowerCase(),f=c.notes?Object.values(c.notes).join(" ").toLowerCase():"";return c.tags?.some(g=>g.toLowerCase().includes(u))||c.name?.toLowerCase().includes(u)||c.surname?.toLowerCase().includes(u)||f.includes(u)}):t;s=s.slice().sort((c,u)=>{if(u.pinned&&!c.pinned)return 1;if(c.pinned&&!u.pinned)return-1;if(c.pinned===u.pinned){const f=c.lastEdited||0;return(u.lastEdited||0)-f}return 0});const i=s.filter(c=>!c.pinned&&c.lastEdited);return i.length>0&&(console.log("� Contactos NO fijados ordenados por fecha:"),i.slice(0,5).forEach((c,u)=>{console.log(`${u+1}. ${c.name} - ${new Date(c.lastEdited).toLocaleString()}`)})),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${o||""}" />
      <ul>
        ${s.length===0?'<li class="empty">Sin contactos</li>':s.map((c,u)=>{const f=Date.now(),g=24*60*60*1e3,y=c.lastEdited&&f-c.lastEdited<g,b=y&&!c.pinned?" recently-edited":"";let E="";if(c.lastEdited){const I=f-c.lastEdited,B=Math.floor(I/(60*60*1e3)),C=Math.floor(I%(60*60*1e3)/(60*1e3));B<1?E=C<1?"Ahora":`${C}m`:B<24?E=`${B}h`:E=`${Math.floor(B/24)}d`}return`
          <li${c.pinned?' class="pinned"':b}>
            <div class="contact-main">
              <button class="select-contact" data-index="${t.indexOf(c)}">
                ${y&&!c.pinned?"🆕 ":""}${c.surname?c.surname+", ":""}${c.name}
                ${E&&y?`<span class="time-ago">(${E})</span>`:""}
              </button>
              <span class="tags">${(c.tags||[]).map(I=>`<span class='tag'>${I}</span>`).join(" ")}</span>
              <button class="pin-contact" data-index="${t.indexOf(c)}" title="${c.pinned?"Desfijar":"Fijar"}">${c.pinned?"📌":"📍"}</button>
            </div>
            <div class="contact-info">
              ${c.phone?`<a href="tel:${c.phone}" class="contact-link" title="Llamar"><span>📞</span> ${c.phone}</a>`:""}
              ${c.email?`<a href="mailto:${c.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${c.email}</a>`:""}
            </div>
            <div class="contact-actions">
              <button class="add-note-contact" data-index="${t.indexOf(c)}" title="Añadir nota">📝</button>
              <button class="edit-contact" data-index="${t.indexOf(c)}" title="Editar">✏️</button>
              <button class="delete-contact" data-index="${t.indexOf(c)}" title="Eliminar">🗑️</button>
            </div>
          </li>
          `}).join("")}
      </ul>
    </div>
  `}function ee({contact:t}){return`
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
  `}function te({notes:t}){if(!j())return`
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
        ${Object.entries(t||{}).sort((s,i)=>i[0].localeCompare(s[0])).map(([s,i])=>`
          <li>
            <b>${s}</b>:
            <span class="note-content" data-date="${s}">${i}</span>
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
  `}function ne({contacts:t,visible:o,page:n=1}){let a=[];t.forEach((g,y)=>{g.notes&&Object.entries(g.notes).forEach(([b,E])=>{a.push({date:b,text:E,contact:g,contactIndex:y})})}),a.sort((g,y)=>y.date.localeCompare(g.date));const s=4,i=Math.max(1,Math.ceil(a.length/s)),c=Math.min(Math.max(n,1),i),u=(c-1)*s,f=a.slice(u,u+s);return`
    <div id="all-notes-modal" class="modal" style="display:${o?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${a.length===0?"<li>No hay notas registradas.</li>":f.map(g=>`
            <li>
              <b>${g.date}</b> — <span style="color:#3a4a7c">${g.contact.surname?g.contact.surname+", ":""}${g.contact.name}</span><br/>
              <span>${g.text}</span>
              <a href="#" class="edit-note-link" data-contact="${g.contactIndex}" data-date="${g.date}" style="margin-left:0.5em;color:#646cff;font-size:0.95em;">Editar nota</a>
            </li>
          `).join("")}
        </ul>
        <div class="pagination" style="display:flex;justify-content:center;align-items:center;gap:1em;margin:1em 0;">
          <button id="prev-notes-page" ${c===1?"disabled":""}>&lt; Anterior</button>
          <span>Página ${c} de ${i}</span>
          <button id="next-notes-page" ${c===i?"disabled":""}>Siguiente &gt;</button>
        </div>
        <div class="form-actions">
          <button id="close-all-notes">Cerrar</button>
        </div>
      </div>
    </div>
  `}function ae({visible:t,backups:o}){return`
    <div id="backup-modal" class="modal" style="display:${t?"flex":"none"};z-index:4000;">
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
  `}function se({visible:t,contactIndex:o}){const n=o!==null?e.contacts[o]:null,a=new Date,i=new Date(a.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);return`
    <div id="add-note-modal" class="modal" style="display:${t?"flex":"none"};z-index:4000;">
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
  `}function v(t,o="info"){let n=document.getElementById("notification-container");n||(n=document.createElement("div"),n.id="notification-container",n.style.cssText=`
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
  `;const s=o==="success"?"✅":o==="error"?"❌":o==="warning"?"⚠️":"ℹ️";a.innerHTML=`${s} ${t}`,n.appendChild(a),setTimeout(()=>{a.style.opacity="1",a.style.transform="translateX(0)"},10);const i=()=>{a.style.opacity="0",a.style.transform="translateX(100%)",setTimeout(()=>{a.parentNode&&a.parentNode.removeChild(a)},300)};a.onclick=i,setTimeout(i,4e3)}function ie(t){console.log("📢 Mostrando notificación de actualización para versión:",t);const o=document.createElement("div");o.id="update-notification",o.innerHTML=`
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
  `;const n=document.getElementById("update-notification");n&&n.remove(),document.body.appendChild(o),setTimeout(()=>{document.getElementById("update-notification")&&ce()},1e4)}function ce(){const t=document.getElementById("update-notification");t&&(t.style.transform="translateX(100%)",t.style.transition="transform 0.3s ease",setTimeout(()=>t.remove(),300))}function T(t){const o=[];return!t.name||t.name.trim().length===0?o.push("El nombre es obligatorio"):t.name.trim().length<2?o.push("El nombre debe tener al menos 2 caracteres"):t.name.trim().length>50&&o.push("El nombre no puede tener más de 50 caracteres"),t.surname&&t.surname.trim().length>50&&o.push("Los apellidos no pueden tener más de 50 caracteres"),t.phone&&t.phone.trim().length>0&&(/^[\d\s\-\+\(\)\.]{6,20}$/.test(t.phone.trim())||o.push("El teléfono debe contener solo números, espacios y caracteres válidos (6-20 caracteres)")),t.email&&t.email.trim().length>0&&(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.email.trim())?t.email.trim().length>100&&o.push("El email no puede tener más de 100 caracteres"):o.push("El email debe tener un formato válido")),o}function P(t){const o=[];return!t||t.trim().length===0?(o.push("La nota no puede estar vacía"),o):(t.trim().length>1e3&&o.push("La nota no puede tener más de 1000 caracteres"),t.trim().length<3&&o.push("La nota debe tener al menos 3 caracteres"),/^[\w\s\.\,\;\:\!\?\-\(\)\[\]\"\'\/\@\#\$\%\&\*\+\=\<\>\{\}\|\~\`\ñÑáéíóúÁÉÍÓÚüÜ]*$/.test(t)||o.push("La nota contiene caracteres no permitidos"),o)}const U="contactos_diarios";let e={contacts:re(),selected:null,notes:"",editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1,showAddNoteModal:!1,addNoteContactIndex:null,allNotesPage:1,duplicates:[],showDuplicateModal:!1,showAuthModal:!1,authMode:"login",pendingAction:null};function re(){try{return JSON.parse(localStorage.getItem(U))||[]}catch{return[]}}function k(t){localStorage.setItem(U,JSON.stringify(t))}function m(){const t=document.querySelector("#app"),o=e.editing!==null?e.contacts[e.editing]:null,n=e.selected!==null?e.contacts[e.selected].notes||{}:{};t.innerHTML=`
    <h1>Diario de Contactos</h1>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <div class="main-grid">
      <div>
        
        ${Q({contacts:e.contacts,filter:e.tagFilter})}
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
        ${e.editing!==null?ee({contact:o}):""}
        ${e.selected!==null&&e.editing===null?te({notes:n}):""}
      </div>
    </div>
    ${ne({contacts:e.contacts,visible:e.showAllNotes,page:e.allNotesPage})}
    ${ae({visible:e.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})} <!-- Modal de backup -->
    ${se({visible:e.showAddNoteModal,contactIndex:e.addNoteContactIndex})} <!-- Modal añadir nota -->
    ${Ee({duplicates:e.duplicates,visible:e.showDuplicateModal})} <!-- Modal de gestión de duplicados -->
    ${Ne({visible:e.showAuthModal,mode:e.authMode})} <!-- Modal de autenticación -->
    ${oe({})}
  `,le(),Ae();const a=document.getElementById("show-backup-modal");a&&(a.onclick=()=>{e.showBackupModal=!0,m()});const s=document.getElementById("close-backup-modal");s&&(s.onclick=()=>{e.showBackupModal=!1,m()}),document.querySelectorAll(".add-note-contact").forEach(u=>{u.onclick=f=>{const g=Number(u.dataset.index);if(!j()){e.pendingAction={type:"addNote",contactIndex:g},R()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m();return}e.addNoteContactIndex=g,e.showAddNoteModal=!0,m()}});const i=document.getElementById("cancel-add-note");i&&(i.onclick=()=>{e.showAddNoteModal=!1,e.addNoteContactIndex=null,m()}),document.querySelectorAll(".restore-backup-btn").forEach(u=>{u.onclick=()=>ve(u.dataset.fecha)});const c=document.getElementById("restore-local-backup");c&&(c.onclick=restaurarBackupLocal)}let V=null;function le(){const t=document.getElementById("tag-filter");t&&t.addEventListener("input",l=>{clearTimeout(V),V=setTimeout(()=>{e.tagFilter=t.value,m();const r=document.getElementById("tag-filter");r&&(r.value=e.tagFilter,r.focus(),r.setSelectionRange(e.tagFilter.length,e.tagFilter.length))},300)});const o=document.getElementById("add-contact");o&&(o.onclick=()=>{e.editing=null,e.selected=null,m(),e.editing=e.contacts.length,m()}),document.querySelectorAll(".select-contact").forEach(l=>{l.onclick=r=>{r.preventDefault(),r.stopPropagation(),M(l)&&(e.selected=Number(l.dataset.index),e.editing=null,m())}}),document.querySelectorAll(".edit-contact").forEach(l=>{l.onclick=r=>{r.preventDefault(),r.stopPropagation(),M(l)&&(e.editing=Number(l.dataset.index),e.selected=null,m())}}),document.querySelectorAll(".delete-contact").forEach(l=>{l.onclick=r=>{if(r.preventDefault(),r.stopPropagation(),!M(l))return;const d=Number(l.dataset.index),p=e.contacts[d],h=p.surname?`${p.surname}, ${p.name}`:p.name;confirm(`¿Estás seguro de eliminar el contacto "${h}"?

Esta acción no se puede deshacer.`)&&(e.contacts.splice(d,1),k(e.contacts),v("Contacto eliminado correctamente","success"),e.selected=null,m())}}),document.querySelectorAll(".pin-contact").forEach(l=>{l.onclick=r=>{if(r.preventDefault(),r.stopPropagation(),!M(l))return;const d=Number(l.dataset.index);e.contacts[d].pinned&&!confirm("¿Seguro que quieres desfijar este contacto?")||(e.contacts[d].pinned=!e.contacts[d].pinned,k(e.contacts),m())}});const n=document.getElementById("contact-form");n&&(n.onsubmit=l=>{l.preventDefault();const r=Object.fromEntries(new FormData(n)),d=T(r);if(d.length>0){v("Error de validación: "+d.join(", "),"error");return}let p=r.tags?r.tags.split(",").map(S=>S.trim()).filter(Boolean):[];delete r.tags;const h={...r};e.contacts.some((S,$)=>e.editing!==null&&$===e.editing?!1:J(S,h))&&!confirm("Ya existe un contacto similar. ¿Deseas guardarlo de todas formas?")||(e.editing!==null&&e.editing<e.contacts.length?(e.contacts[e.editing]={...e.contacts[e.editing],...r,tags:p,lastEdited:Date.now()},console.log("✏️ Contacto editado:",e.contacts[e.editing].name,"lastEdited:",new Date().toLocaleString()),v("Contacto actualizado correctamente","success")):(e.contacts.push({...r,notes:{},tags:p,lastEdited:Date.now(),createdAt:Date.now()}),v("Contacto añadido correctamente","success")),k(e.contacts),e.editing=null,m())},document.getElementById("cancel-edit").onclick=()=>{e.editing=null,m()});const a=document.getElementById("add-note-form");if(a&&e.addNoteContactIndex!==null){const l=r=>{r.preventDefault();const d=document.getElementById("add-note-date").value,p=document.getElementById("add-note-text").value.trim();if(!d||!p){v("Por favor, selecciona una fecha y escribe una nota","warning");return}const h=P(p);if(h.length>0){v("Error en la nota: "+h.join(", "),"error");return}const w=e.addNoteContactIndex;e.contacts[w].notes||(e.contacts[w].notes={}),e.contacts[w].notes[d]?e.contacts[w].notes[d]+=`
`+p:e.contacts[w].notes[d]=p,e.contacts[w].lastEdited=Date.now(),console.log(`📝 Nota añadida a ${e.contacts[w].name}, lastEdited actualizado: ${new Date().toLocaleString()}`),k(e.contacts),v("Nota añadida correctamente","success"),e.showAddNoteModal=!1,e.addNoteContactIndex=null,m()};a.onsubmit=l}const s=document.getElementById("note-form");if(s&&e.selected!==null){const l=r=>{r.preventDefault();const d=document.getElementById("note-date").value,p=document.getElementById("note-text").value.trim();if(!d||!p){v("Por favor, selecciona una fecha y escribe una nota","warning");return}const h=P(p);if(h.length>0){v("Error en la nota: "+h.join(", "),"error");return}e.contacts[e.selected].notes||(e.contacts[e.selected].notes={}),e.contacts[e.selected].notes[d]?e.contacts[e.selected].notes[d]+=`
`+p:e.contacts[e.selected].notes[d]=p,e.contacts[e.selected].lastEdited=Date.now(),console.log(`📝 Nota añadida directamente a ${e.contacts[e.selected].name}, lastEdited: ${new Date().toLocaleString()}`),k(e.contacts),v("Nota guardada correctamente","success"),document.getElementById("note-text").value="",m()};s.onsubmit=l}document.querySelectorAll(".edit-note").forEach(l=>{l.onclick=r=>{const d=l.dataset.date,p=document.getElementById("edit-note-modal"),h=document.getElementById("edit-note-text");h.value=e.contacts[e.selected].notes[d],p.style.display="block",document.getElementById("save-edit-note").onclick=()=>{const w=h.value.trim(),S=P(w);if(S.length>0){v("Error en la nota: "+S.join(", "),"error");return}e.contacts[e.selected].notes[d]=w,e.contacts[e.selected].lastEdited=Date.now(),console.log(`✏️ Nota editada de ${e.contacts[e.selected].name}, lastEdited: ${new Date().toLocaleString()}`),k(e.contacts),v("Nota actualizada correctamente","success"),p.style.display="none",m()},document.getElementById("cancel-edit-note").onclick=()=>{p.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(l=>{l.onclick=r=>{const d=l.dataset.date;confirm(`¿Estás seguro de eliminar la nota del ${d}?

Esta acción no se puede deshacer.`)&&(delete e.contacts[e.selected].notes[d],k(e.contacts),v("Nota eliminada correctamente","success"),m())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{me(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{fe(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{ge(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async l=>{const r=l.target.files[0];if(!r)return;const d=await r.text();let p=[];if(r.name.endsWith(".vcf"))p=de(d);else if(r.name.endsWith(".csv"))p=pe(d);else if(r.name.endsWith(".json"))try{const h=JSON.parse(d);Array.isArray(h)?p=h:h&&Array.isArray(h.contacts)&&(p=h.contacts)}catch{}if(p.length){const h=[],w=[];if(p.forEach((x,A)=>{const z=T(x);z.length===0?h.push(x):w.push({index:A+1,errors:z})}),w.length>0){const x=w.map(A=>`Contacto ${A.index}: ${A.errors.join(", ")}`).join(`
`);if(!confirm(`Se encontraron ${w.length} contacto(s) con errores:

${x}

¿Deseas importar solo los contactos válidos (${h.length})?`))return}const S=x=>e.contacts.some(A=>A.name===x.name&&A.surname===x.surname&&A.phone===x.phone),$=h.filter(x=>!S(x));$.length?(e.contacts=e.contacts.concat($),k(e.contacts),v(`${$.length} contacto(s) importado(s) correctamente`,"success"),m()):v("No se han importado contactos nuevos (todos ya existen)","info")}else v("No se pudieron importar contactos del archivo seleccionado","error")};const i=document.getElementById("close-all-notes");i&&(i.onclick=()=>{e.showAllNotes=!1,e.allNotesPage=1,m()});const c=document.getElementById("show-all-notes-btn");c&&(c.onclick=()=>{if(!j()){e.pendingAction={type:"showAllNotes"},R()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m();return}e.showAllNotes=!0,e.allNotesPage=1,m()});const u=document.getElementById("prev-notes-page");u&&(u.onclick=()=>{e.allNotesPage>1&&(e.allNotesPage--,m())});const f=document.getElementById("next-notes-page");f&&(f.onclick=()=>{let l=[];e.contacts.forEach((d,p)=>{d.notes&&Object.entries(d.notes).forEach(([h,w])=>{l.push({date:h,text:w,contact:d,contactIndex:p})})});const r=Math.max(1,Math.ceil(l.length/4));e.allNotesPage<r&&(e.allNotesPage++,m())}),document.querySelectorAll(".edit-note-link").forEach(l=>{l.onclick=r=>{r.preventDefault();const d=Number(l.dataset.contact),p=l.dataset.date;e.selected=d,e.editing=null,e.showAllNotes=!1,m(),setTimeout(()=>{const h=document.querySelector(`.edit-note[data-date="${p}"]`);h&&h.click()},50)}}),document.querySelectorAll(".share-backup-btn").forEach(l=>{l.onclick=async()=>{const r=l.dataset.fecha,p=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(x=>x.fecha===r);if(!p)return alert("No se encontró la copia seleccionada.");const h=`contactos_backup_${r}.json`,w=JSON.stringify(p.datos,null,2),S=new Blob([w],{type:"application/json"}),$=document.createElement("a");if($.href=URL.createObjectURL(S),$.download=h,$.style.display="none",document.body.appendChild($),$.click(),setTimeout(()=>{URL.revokeObjectURL($.href),$.remove()},1e3),navigator.canShare&&window.File&&window.FileReader)try{const x=new File([S],h,{type:"application/json"});navigator.canShare({files:[x]})&&await navigator.share({files:[x],title:"Backup de Contactos",text:`Copia de seguridad (${r}) de ContactosDiarios`})}catch{}}});const g=document.getElementById("manage-duplicates-btn");g&&(g.onclick=()=>{e.duplicates=be(),e.duplicates.length===0?v("No se encontraron contactos duplicados","info"):(e.showDuplicateModal=!0,m())});const y=document.getElementById("validate-contacts-btn");y&&(y.onclick=()=>{const l=[];if(e.contacts.forEach((r,d)=>{const p=T(r);if(p.length>0){const h=r.surname?`${r.surname}, ${r.name}`:r.name;l.push({index:d+1,name:h,errors:p})}}),l.length===0)v(`✅ Todos los ${e.contacts.length} contactos son válidos`,"success");else{const r=l.map(d=>`${d.index}. ${d.name}: ${d.errors.join(", ")}`).join(`
`);v(`⚠️ Se encontraron ${l.length} contacto(s) con errores`,"warning"),console.log("Contactos con errores de validación:",l),confirm(`Se encontraron ${l.length} contacto(s) con errores de validación:

${r}

¿Deseas ver más detalles en la consola del navegador?`)&&console.table(l)}});const b=document.getElementById("cancel-duplicate-resolution");b&&(b.onclick=()=>{e.showDuplicateModal=!1,e.duplicates=[],m()});const E=document.getElementById("apply-resolution");E&&(E.onclick=we),document.querySelectorAll('input[name^="resolution-"]').forEach(l=>{l.addEventListener("change",()=>{const r=l.name.split("-")[1],d=document.getElementById(`merge-section-${r}`),p=document.getElementById(`individual-section-${r}`);l.value==="merge"?(d.style.display="block",p.style.display="none"):l.value==="select"?(d.style.display="none",p.style.display="block"):(d.style.display="none",p.style.display="none")})}),document.querySelectorAll('.resolution-option input[type="radio"]').forEach(l=>{l.addEventListener("change",()=>{const r=l.name;document.querySelectorAll(`input[name="${r}"]`).forEach(d=>{d.closest(".resolution-option").classList.remove("selected")}),l.closest(".resolution-option").classList.add("selected")})});const I=document.getElementById("unlock-notes-btn");I&&(I.onclick=()=>{e.selected!==null&&(e.pendingAction={type:"showContactNotes",contactIndex:e.selected}),R()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m()});const B=document.getElementById("logout-btn");B&&(B.onclick=()=>{Se(),m()});const C=document.getElementById("auth-form");C&&!C.hasAttribute("data-handler-added")&&(C.setAttribute("data-handler-added","true"),C.onsubmit=l=>{l.preventDefault();const r=document.getElementById("auth-password").value.trim();if(!r){v("Por favor, introduce una contraseña","warning");return}if(e.authMode==="setup"){const d=document.getElementById("auth-password-confirm").value.trim();if(r!==d){v("Las contraseñas no coinciden","error");return}if(r.length<4){v("La contraseña debe tener al menos 4 caracteres","warning");return}xe(r),N.isAuthenticated=!0,N.sessionExpiry=Date.now()+30*60*1e3,e.showAuthModal=!1,C.reset(),setTimeout(()=>{X()},100),m()}else ke(r)?(e.showAuthModal=!1,C.reset(),m()):(document.getElementById("auth-password").value="",document.getElementById("auth-password").focus())});const O=document.getElementById("cancel-auth");O&&(O.onclick=()=>{e.showAuthModal=!1,e.pendingAction=null,m()});const _=document.getElementById("auth-modal");if(_){_.onclick=d=>{d.target===_&&(e.showAuthModal=!1,e.pendingAction=null,m())};const l=document.getElementById("auth-password");if(l){const d=window.innerWidth<=700?300:100;setTimeout(()=>{l.focus(),window.innerWidth<=700&&l.scrollIntoView({behavior:"smooth",block:"center"})},d)}const r=d=>{d.key==="Escape"&&e.showAuthModal&&(e.showAuthModal=!1,e.pendingAction=null,m())};document.addEventListener("keydown",r)}}function de(t){const o=[],n=t.split("END:VCARD");for(const a of n){const s=/FN:([^\n]*)/.exec(a)?.[1]?.trim(),i=/N:.*;([^;\n]*)/.exec(a)?.[1]?.trim()||"",c=/TEL.*:(.+)/.exec(a)?.[1]?.trim(),u=/EMAIL.*:(.+)/.exec(a)?.[1]?.trim();s&&o.push({name:s,surname:i,phone:c||"",email:u||"",notes:{},tags:[]})}return o}function ue(t){return t.map(o=>`BEGIN:VCARD
VERSION:3.0
FN:${o.name}
N:${o.surname||""};;;;
TEL:${o.phone||""}
EMAIL:${o.email||""}
END:VCARD`).join(`
`)}function pe(t){const o=t.split(`
`).filter(Boolean),[n,...a]=o;return a.map(s=>{const[i,c,u,f,g,y]=s.split(",");return{name:i?.trim()||"",surname:c?.trim()||"",phone:u?.trim()||"",email:f?.trim()||"",notes:y?JSON.parse(y):{},tags:g?g.split(";").map(b=>b.trim()):[]}})}function me(){const t=ue(e.contacts),o=new Blob([t],{type:"text/vcard"}),n=document.createElement("a");n.href=URL.createObjectURL(o),n.download="contactos.vcf",n.click()}function fe(){const t="name,surname,phone,email,tags,notes",o=e.contacts.map(i=>[i.name,i.surname,i.phone,i.email,(i.tags||[]).join(";"),JSON.stringify(i.notes||{})].map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(",")),n=[t,...o].join(`
`),a=new Blob([n],{type:"text/csv"}),s=document.createElement("a");s.href=URL.createObjectURL(a),s.download="contactos.csv",s.click()}function ge(){const t=new Blob([JSON.stringify(e.contacts,null,2)],{type:"application/json"}),o=document.createElement("a");o.href=URL.createObjectURL(t),o.download="contactos.json",o.click()}function H(){const t=new Date,n=new Date(t.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);let a=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");a.find(s=>s.fecha===n)||(a.push({fecha:n,datos:e.contacts}),a.length>10&&(a=a.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(a))),localStorage.setItem("contactos_diarios_backup_fecha",n)}setInterval(H,60*60*1e3);H();function he(){const t=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]"),o=document.getElementById("backup-info");o&&(t.length===0?o.textContent="Sin copias locales.":o.innerHTML="Últimas copias locales: "+t.map(n=>`<button class="restore-backup-btn" data-fecha="${n.fecha}">${n.fecha}</button>`).join(" "))}function ve(t){if(!confirm("¿Seguro que quieres restaurar la copia de seguridad del "+t+"? Se sobrescribirán los contactos actuales."))return;const n=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(a=>a.fecha===t);n?(e.contacts=n.datos,k(e.contacts),m(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}function J(t,o){const n=a=>a?a.toLowerCase().replace(/\s+/g," ").trim():"";return!!(n(t.name)===n(o.name)&&n(t.surname)===n(o.surname)||t.phone&&o.phone&&t.phone.replace(/\s+/g,"")===o.phone.replace(/\s+/g,"")||t.email&&o.email&&n(t.email)===n(o.email))}function be(){const t=[],o=new Set;for(let n=0;n<e.contacts.length;n++){if(o.has(n))continue;const a=[{...e.contacts[n],originalIndex:n}];o.add(n);for(let s=n+1;s<e.contacts.length;s++)o.has(s)||J(e.contacts[n],e.contacts[s])&&(a.push({...e.contacts[s],originalIndex:s}),o.add(s));a.length>1&&t.push({contacts:a})}return t}function G(t){if(t.length===0)return null;if(t.length===1)return t[0];const o={name:"",surname:"",phone:"",email:"",tags:[],notes:{},pinned:!1};let n="",a="";t.forEach(i=>{i.name&&i.name.length>n.length&&(n=i.name),i.surname&&i.surname.length>a.length&&(a=i.surname)}),o.name=n,o.surname=a,o.phone=t.find(i=>i.phone)?.phone||"",o.email=t.find(i=>i.email)?.email||"";const s=new Set;return t.forEach(i=>{i.tags&&i.tags.forEach(c=>s.add(c))}),o.tags=Array.from(s),t.forEach((i,c)=>{i.notes&&Object.entries(i.notes).forEach(([u,f])=>{o.notes[u]?o.notes[u]+=`
--- Contacto ${c+1} ---
${f}`:o.notes[u]=f})}),o.pinned=t.some(i=>i.pinned),o}function ye(t){const o=G(t);return`
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
  `}function Ee({duplicates:t,visible:o}){return!o||t.length===0?'<div id="duplicate-modal" class="modal" style="display:none"></div>':`
    <div id="duplicate-modal" class="modal" style="display:flex;z-index:5000;">
      <div class="modal-content" style="max-width:800px;max-height:90vh;overflow-y:auto;">
        <h3>🔍 Gestión de contactos duplicados</h3>
        <p>Se encontraron <strong>${t.length}</strong> grupo(s) de contactos duplicados. 
           Para cada grupo, elige cómo resolverlo:</p>
        
        ${t.map((n,a)=>`
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
              ${ye(n.contacts)}
            </div>
            
            <!-- Sección de selección individual (oculta por defecto) -->
            <div class="individual-selection" id="individual-section-${a}" style="display:none;">
              <h5>Selecciona el contacto a mantener:</h5>
              ${n.contacts.map((s,i)=>`
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
  `}function we(){const t=[];let o=0;if(e.duplicates.forEach((i,c)=>{const u=document.querySelector(`input[name="resolution-${c}"]:checked`),f=u?u.value:"skip";if(f==="merge")t.push({type:"merge",groupIndex:c,contacts:i.contacts}),o++;else if(f==="select"){const g=document.querySelector(`input[name="keep-${c}"]:checked`);if(g){const y=parseInt(g.value),b=i.contacts.filter(E=>E.originalIndex!==y).map(E=>E.originalIndex);t.push({type:"delete",groupIndex:c,toDelete:b,toKeep:y}),o++}}}),o===0){v("No hay operaciones que realizar","info");return}const n=t.filter(i=>i.type==="merge").length,a=t.filter(i=>i.type==="delete").length;let s=`¿Confirmar las siguientes operaciones?

`;if(n>0&&(s+=`🔗 Fusionar ${n} grupo(s) de contactos
`),a>0&&(s+=`🗑️ Eliminar duplicados en ${a} grupo(s)
`),s+=`
Esta acción no se puede deshacer.`,!confirm(s)){v("Operación cancelada","info");return}try{let i=0,c=0;const u=[];t.forEach(b=>{if(b.type==="merge"){const E=G(b.contacts);e.contacts.push(E),b.contacts.forEach(I=>{u.push(I.originalIndex)}),i++}else b.type==="delete"&&(b.toDelete.forEach(E=>{u.push(E)}),c+=b.toDelete.length)}),[...new Set(u)].sort((b,E)=>E-b).forEach(b=>{b<e.contacts.length&&e.contacts.splice(b,1)}),k(e.contacts);let g="Resolución completada: ";const y=[];i>0&&y.push(`${i} contacto(s) fusionado(s)`),c>0&&y.push(`${c} duplicado(s) eliminado(s)`),g+=y.join(" y "),v(g,"success"),e.showDuplicateModal=!1,e.duplicates=[],m()}catch(i){v("Error al aplicar resolución: "+i.message,"error")}}const q="contactos_diarios_auth";let N={isAuthenticated:!1,sessionExpiry:null};function K(t){let o=0;for(let n=0;n<t.length;n++){const a=t.charCodeAt(n);o=(o<<5)-o+a,o=o&o}return o.toString()}function xe(t){const o=K(t);localStorage.setItem(q,o),v("Contraseña establecida correctamente","success")}function $e(t){const o=localStorage.getItem(q);return o?K(t)===o:!1}function R(){return localStorage.getItem(q)!==null}function ke(t){return $e(t)?(N.isAuthenticated=!0,N.sessionExpiry=Date.now()+30*60*1e3,v("Autenticación exitosa","success"),setTimeout(()=>{X()},100),!0):(v("Contraseña incorrecta","error"),!1)}function j(){return N.isAuthenticated?Date.now()>N.sessionExpiry?(N.isAuthenticated=!1,N.sessionExpiry=null,!1):!0:!1}function Se(){N.isAuthenticated=!1,N.sessionExpiry=null,v("Sesión cerrada","info")}function X(){if(!e.pendingAction)return;const t=e.pendingAction;switch(e.pendingAction=null,t.type){case"showAllNotes":e.showAllNotes=!0,e.allNotesPage=1;break;case"addNote":e.addNoteContactIndex=t.contactIndex,e.showAddNoteModal=!0;break;case"showContactNotes":e.selected=t.contactIndex,e.editing=null;break}m()}function Ne({visible:t,mode:o="login"}){return`
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
  `}async function Y(){console.log("🧹 Limpiando cache y forzando actualización...");try{if("caches"in window){const t=await caches.keys();await Promise.all(t.map(o=>(console.log("🗑️ Eliminando cache:",o),caches.delete(o))))}if("serviceWorker"in navigator){const t=await navigator.serviceWorker.getRegistrations();await Promise.all(t.map(o=>(console.log("🔄 Desregistrando SW:",o.scope),o.unregister())))}console.log("✅ Cache limpiado, recargando..."),window.location.reload()}catch(t){console.error("❌ Error limpiando cache:",t),window.location.reload()}}window.clearCacheAndReload=Y;document.addEventListener("keydown",t=>{t.ctrlKey&&t.shiftKey&&t.key==="R"&&(t.preventDefault(),Y())});async function Ie(){console.log("🔍 Obteniendo versión del Service Worker...");try{if("serviceWorker"in navigator&&navigator.serviceWorker.controller){console.log("📡 Intentando comunicación directa con SW...");const n=new MessageChannel,a=new Promise((i,c)=>{const u=setTimeout(()=>{c(new Error("Timeout en comunicación con SW"))},3e3);n.port1.onmessage=f=>{clearTimeout(u),f.data&&f.data.type==="VERSION_RESPONSE"?(console.log("✅ Versión recibida del SW:",f.data.version),i(f.data.version)):c(new Error("Respuesta inválida del SW"))}});return navigator.serviceWorker.controller.postMessage({type:"GET_VERSION"},[n.port2]),await a}console.log("📄 SW no disponible, intentando fetch...");const t=`${Date.now()}-${Math.random().toString(36).substr(2,9)}`,o=[`/sw.js?v=${t}`,`/ContactosDiarios/sw.js?v=${t}`,`./sw.js?v=${t}`];for(const n of o)try{console.log(`🌐 Intentando fetch: ${n}`);const a=await fetch(n,{cache:"no-cache",headers:{"Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0"}});if(a.ok){const s=await a.text();console.log("📄 Código SW obtenido, longitud:",s.length);const i=[/CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/const\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/let\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/var\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/version['":]?\s*['"`]([0-9.]+)['"`]/i,/v?([0-9]+\.[0-9]+\.[0-9]+)/];for(const c of i){const u=s.match(c);if(u&&u[1])return console.log("✅ Versión encontrada:",u[1]),u[1]}console.log("⚠️ No se encontró versión en el código SW")}}catch(a){console.log(`❌ Error fetch ${n}:`,a.message)}return console.log("🔄 Usando versión fallback..."),"0.0.91"}catch(t){return console.error("❌ Error general obteniendo versión SW:",t),"0.0.91"}}async function L(){console.log("📋 Mostrando versión del Service Worker...");let t=document.getElementById("sw-version-info");t||(t=document.createElement("div"),t.id="sw-version-info",t.style.cssText=`
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
    `}}async function Ce(){console.log("🚀 Inicializando aplicación...");const t=L(),o=new Promise(a=>setTimeout(()=>a("timeout"),5e3));if(await Promise.race([t,o])==="timeout"){console.log("⏰ Timeout obteniendo versión SW, usando fallback");let a=document.getElementById("sw-version-info");a&&(a.innerHTML=`
        <p class="version-text">Service Worker v0.0.91</p>
      `)}"serviceWorker"in navigator&&(navigator.serviceWorker.addEventListener("controllerchange",()=>{console.log("🔄 Service Worker actualizado, refrescando versión..."),setTimeout(()=>L(),500)}),navigator.serviceWorker.ready.then(()=>{console.log("✅ Service Worker listo, actualizando versión..."),setTimeout(()=>L(),2e3)}).catch(a=>{console.log("❌ Error esperando SW ready:",a)}),navigator.serviceWorker.addEventListener("message",a=>{a.data&&a.data.type==="SW_UPDATED"&&(console.log("📢 Service Worker actualizado a versión:",a.data.version),ie(a.data.version),L())}))}let Z=0,D=!1;function Ae(){let t=null;window.addEventListener("scroll",()=>{D=!0,clearTimeout(t),t=setTimeout(()=>{D=!1},100)},{passive:!0}),document.addEventListener("touchstart",()=>{Z=Date.now()},{passive:!0}),document.addEventListener("touchmove",()=>{D=!0},{passive:!0}),document.addEventListener("touchend",()=>{setTimeout(()=>{D=!1},100)},{passive:!0})}function M(t){if(t&&(t.classList.contains("add-note-contact")||t.classList.contains("edit-contact")||t.classList.contains("delete-contact")||t.classList.contains("pin-contact")||t.classList.contains("select-contact")))return console.log("🔘 Click permitido en botón:",t.className),!0;const o=Date.now()-Z,n=!D&&o>150;return console.log("🔍 isClickSafe check:",{isScrolling:D,timeSinceTouch:o,isSafe:n}),n}document.addEventListener("DOMContentLoaded",()=>{W(),m(),Ce(),he(),console.log("📱 ContactosDiarios iniciado correctamente"),console.log("🆕 Nueva funcionalidad: Contactos recientemente editados"),console.log("💡 Usa Ctrl+Shift+R para limpiar cache y forzar actualización"),console.log("🔧 También disponible: window.clearCacheAndReload()")});function W(){let t=!1;const o=Date.now();e.contacts.forEach((n,a)=>{n.lastEdited||(n.lastEdited=n.createdAt||o-(e.contacts.length-a)*1e3*60*60,t=!0,console.log(`📅 Migrado contacto ${n.name}: ${new Date(n.lastEdited).toLocaleString()}`)),n.createdAt||(n.createdAt=n.lastEdited,t=!0)}),t&&(k(e.contacts),console.log("📅 Contactos migrados con fechas de edición diferenciadas"))}document.addEventListener("DOMContentLoaded",()=>{W(),window.debugContacts=()=>{console.log("🔍 Estado actual de contactos:"),e.contacts.forEach((t,o)=>{console.log(`${o}: ${t.name} ${t.surname||""} - Fijado: ${t.pinned||!1} - LastEdited: ${t.lastEdited?new Date(t.lastEdited).toLocaleString():"Sin fecha"}`)})},window.simulateEdit=t=>{e.contacts[t]&&(e.contacts[t].lastEdited=Date.now(),k(e.contacts),m(),console.log(`✏️ Simulada edición de contacto ${t}: ${e.contacts[t].name}`))},window.resetDatesAndMigrate=()=>{e.contacts.forEach(t=>{delete t.lastEdited,delete t.createdAt}),k(e.contacts),W(),m(),console.log("🔄 Fechas reseteadas y migración forzada")}});
