(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const d of o.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function s(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(a){if(a.ep)return;a.ep=!0;const o=s(a);fetch(a.href,o)}})();const P="0.0.62";(function(){try{const t=localStorage.getItem("app_version");if(t&&t!==P){const s=localStorage.getItem("contactos_diarios"),i=localStorage.getItem("contactos_diarios_backups"),a=localStorage.getItem("contactos_diarios_backup_fecha"),o=localStorage.getItem("contactos_diarios_webdav_config");["app_version","contactos_diarios","contactos_diarios_backups","contactos_diarios_backup_fecha","contactos_diarios_webdav_config"].forEach(p=>{p!=="contactos_diarios"&&localStorage.removeItem(p)}),"caches"in window&&caches.keys().then(p=>{p.forEach(b=>{(b.includes("contactosdiarios")||b.includes("contactos-diarios"))&&caches.delete(b)})}),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(p=>{p.forEach(b=>{b.scope.includes(window.location.origin)&&b.unregister()})}),s&&localStorage.setItem("contactos_diarios",s),i&&localStorage.setItem("contactos_diarios_backups",i),a&&localStorage.setItem("contactos_diarios_backup_fecha",a),o&&localStorage.setItem("contactos_diarios_webdav_config",o),location.reload()}localStorage.setItem("app_version",P)}catch{}})();function J({contacts:n,filter:t,onSelect:s,onDelete:i}){let a=t?n.filter(o=>{const d=t.toLowerCase(),p=o.notes?Object.values(o.notes).join(" ").toLowerCase():"";return o.tags?.some(b=>b.toLowerCase().includes(d))||o.name?.toLowerCase().includes(d)||o.surname?.toLowerCase().includes(d)||p.includes(d)}):n;return a=a.slice().sort((o,d)=>d.pinned&&!o.pinned?1:o.pinned&&!d.pinned?-1:(o.surname||"").localeCompare(d.surname||"")),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${t||""}" />
      <ul>
        ${a.length===0?'<li class="empty">Sin contactos</li>':a.map((o,d)=>`
          <li${o.pinned?' class="pinned"':""}>
            <div class="contact-main">
              <button class="select-contact" data-index="${n.indexOf(o)}">${o.surname?o.surname+", ":""}${o.name}</button>
              <span class="tags">${(o.tags||[]).map(p=>`<span class='tag'>${p}</span>`).join(" ")}</span>
              <button class="pin-contact" data-index="${n.indexOf(o)}" title="${o.pinned?"Desfijar":"Fijar"}">${o.pinned?"📌":"📍"}</button>
            </div>
            <div class="contact-info">
              ${o.phone?`<a href="tel:${o.phone}" class="contact-link" title="Llamar"><span>📞</span> ${o.phone}</a>`:""}
              ${o.email?`<a href="mailto:${o.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${o.email}</a>`:""}
            </div>
            <button class="add-note-contact" data-index="${n.indexOf(o)}" title="Añadir nota">📝</button>
            <button class="edit-contact" data-index="${n.indexOf(o)}" title="Editar">✏️</button>
            <button class="delete-contact" data-index="${n.indexOf(o)}" title="Eliminar">🗑️</button>
          </li>
        `).join("")}
      </ul>
    </div>
  `}function U({contact:n}){return`
    <form id="contact-form">
      <h2>${n?"Editar":"Nuevo"} contacto</h2>
      <label>Nombre <input name="name" placeholder="Nombre" value="${n?.name||""}" required /></label>
      <label>Apellidos <input name="surname" placeholder="Apellidos" value="${n?.surname||""}" required /></label>
      <label>Teléfono <input name="phone" placeholder="Teléfono" value="${n?.phone||""}" pattern="[0-9+-() ]*" /></label>
      <label>Email <input name="email" placeholder="Email" value="${n?.email||""}" type="email" /></label>
      <label>Etiquetas <input name="tags" placeholder="Ej: familia, trabajo" value="${n?.tags?.join(", ")||""}" /></label>
      <div class="form-actions">
        <button type="submit">Guardar</button>
        <button type="button" id="cancel-edit">Cancelar</button>
      </div>
    </form>
  `}function G({notes:n}){if(!A())return`
      <div class="notes-area">
        <h3>🔒 Notas privadas protegidas</h3>
        <div style="text-align:center;padding:20px;background:#f8f9fa;border-radius:8px;margin:20px 0;">
          <p style="margin-bottom:15px;color:#666;">
            Las notas están protegidas con contraseña para mantener tu privacidad.
          </p>
          <button id="unlock-notes-btn" style="background:#3a4a7c;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;">
            🔓 Desbloquear notas
          </button>
          ${A()?`
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
        ${Object.entries(n||{}).sort((a,o)=>o[0].localeCompare(a[0])).map(([a,o])=>`
          <li>
            <b>${a}</b>:
            <span class="note-content" data-date="${a}">${o}</span>
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
  `}function W({}){return`
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
  `}function K({contacts:n,visible:t,page:s=1}){let i=[];n.forEach((h,v)=>{h.notes&&Object.entries(h.notes).forEach(([y,E])=>{i.push({date:y,text:E,contact:h,contactIndex:v})})}),i.sort((h,v)=>v.date.localeCompare(h.date));const a=4,o=Math.max(1,Math.ceil(i.length/a)),d=Math.min(Math.max(s,1),o),p=(d-1)*a,b=i.slice(p,p+a);return`
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
          <span>Página ${d} de ${o}</span>
          <button id="next-notes-page" ${d===o?"disabled":""}>Siguiente &gt;</button>
        </div>
        <div class="form-actions">
          <button id="close-all-notes">Cerrar</button>
        </div>
      </div>
    </div>
  `}function H({visible:n,backups:t}){return`
    <div id="backup-modal" class="modal" style="display:${n?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:400px;">
        <h3>Restaurar copia local</h3>
        <div class="backup-btns" style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;">
          ${t.length===0?"<span>Sin copias locales.</span>":t.map(s=>`
            <div class="backup-btn-group" style="display:flex;align-items:center;gap:0.3rem;">
              <button class="restore-backup-btn" data-fecha="${s.fecha}">${s.fecha}</button>
              <button class="share-backup-btn" data-fecha="${s.fecha}" title="Compartir backup" style="background:#06b6d4;padding:0.4rem 0.7rem;font-size:1.1em;">📤</button>
            </div>
          `).join("")}
        </div>
        <div class="form-actions" style="margin-top:1.2rem;"><button id="close-backup-modal">Cerrar</button></div>
      </div>
    </div>
  `}function X({visible:n,contactIndex:t}){const s=t!==null?e.contacts[t]:null,i=new Date,o=new Date(i.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);return`
    <div id="add-note-modal" class="modal" style="display:${n?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:500px;">
        <h3>Añadir nota diaria</h3>
        ${s?`<p><strong>${s.surname?s.surname+", ":""}${s.name}</strong></p>`:""}
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
  `}function g(n,t="info"){let s=document.getElementById("notification-container");s||(s=document.createElement("div"),s.id="notification-container",s.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
      pointer-events: none;
    `,document.body.appendChild(s));const i=document.createElement("div");i.style.cssText=`
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
  `;const a=t==="success"?"✅":t==="error"?"❌":t==="warning"?"⚠️":"ℹ️";i.innerHTML=`${a} ${n}`,s.appendChild(i),setTimeout(()=>{i.style.opacity="1",i.style.transform="translateX(0)"},10);const o=()=>{i.style.opacity="0",i.style.transform="translateX(100%)",setTimeout(()=>{i.parentNode&&i.parentNode.removeChild(i)},300)};i.onclick=o,setTimeout(o,4e3)}const T="contactos_diarios";let e={contacts:Y(),selected:null,notes:"",editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1,showAddNoteModal:!1,addNoteContactIndex:null,allNotesPage:1,duplicates:[],showDuplicateModal:!1,showAuthModal:!1,authMode:"login"};function Y(){try{return JSON.parse(localStorage.getItem(T))||[]}catch{return[]}}function I(n){localStorage.setItem(T,JSON.stringify(n))}function m(){const n=document.querySelector("#app"),t=e.editing!==null?e.contacts[e.editing]:null,s=e.selected!==null?e.contacts[e.selected].notes||{}:{};n.innerHTML=`
    <h1>Diario de Contactos</h1>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <div class="main-grid">
      <div>
        <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
        ${J({contacts:e.contacts,filter:e.tagFilter})}
        <button id="show-backup-modal" class="add-btn" style="width:100%;margin-top:0.7rem;background:#06b6d4;">Restaurar copia local</button>
        <div style="margin-top:1rem;">
          <button id="import-btn" style="background:#6f42c1;color:#fff;margin:0 10px 1.2rem 0;">📂 Importar contactos</button>
          <button id="export-btn" style="background:#fd7e14;color:#fff;margin:0 10px 1.2rem 0;">💾 Exportar contactos</button>
          <button id="manage-duplicates-btn" style="background:#dc3545;color:#fff;margin:0 10px 1.2rem 0;">🔍 Gestionar duplicados</button>
          <button id="validate-contacts-btn" style="background:#28a745;color:#fff;margin:0 10px 1.2rem 0;">✅ Validar contactos</button>
        </div>
      </div>
      <div>
        ${e.editing!==null?U({contact:t}):""}
        ${e.selected!==null&&e.editing===null?G({notes:s}):""}
      </div>
    </div>
    ${K({contacts:e.contacts,visible:e.showAllNotes,page:e.allNotesPage})}
    ${H({visible:e.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})} <!-- Modal de backup -->
    ${X({visible:e.showAddNoteModal,contactIndex:e.addNoteContactIndex})} <!-- Modal añadir nota -->
    ${le({duplicates:e.duplicates,visible:e.showDuplicateModal})} <!-- Modal de gestión de duplicados -->
    ${fe({visible:e.showAuthModal,mode:e.authMode})} <!-- Modal de autenticación -->
    ${W({})}
  `,Z();const i=document.getElementById("show-backup-modal");i&&(i.onclick=()=>{e.showBackupModal=!0,m()});const a=document.getElementById("close-backup-modal");a&&(a.onclick=()=>{e.showBackupModal=!1,m()}),document.querySelectorAll(".add-note-contact").forEach(p=>{p.onclick=b=>{if(!A()){D()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m();return}e.addNoteContactIndex=Number(p.dataset.index),e.showAddNoteModal=!0,m()}});const o=document.getElementById("cancel-add-note");o&&(o.onclick=()=>{e.showAddNoteModal=!1,e.addNoteContactIndex=null,m()}),document.querySelectorAll(".restore-backup-btn").forEach(p=>{p.onclick=()=>se(p.dataset.fecha)});const d=document.getElementById("restore-local-backup");d&&(d.onclick=restaurarBackupLocal)}let q=null;function Z(){const n=document.getElementById("tag-filter");n&&n.addEventListener("input",l=>{clearTimeout(q),q=setTimeout(()=>{e.tagFilter=n.value,m();const c=document.getElementById("tag-filter");c&&(c.value=e.tagFilter,c.focus(),c.setSelectionRange(e.tagFilter.length,e.tagFilter.length))},300)});const t=document.getElementById("add-contact");t&&(t.onclick=()=>{e.editing=null,e.selected=null,m(),e.editing=e.contacts.length,m()}),document.querySelectorAll(".select-contact").forEach(l=>{l.onclick=c=>{e.selected=Number(l.dataset.index),e.editing=null,m()}}),document.querySelectorAll(".edit-contact").forEach(l=>{l.onclick=c=>{e.editing=Number(l.dataset.index),e.selected=null,m()}}),document.querySelectorAll(".delete-contact").forEach(l=>{l.onclick=c=>{const r=Number(l.dataset.index),u=e.contacts[r],f=u.surname?`${u.surname}, ${u.name}`:u.name;confirm(`¿Estás seguro de eliminar el contacto "${f}"?

Esta acción no se puede deshacer.`)&&(e.contacts.splice(r,1),I(e.contacts),g("Contacto eliminado correctamente","success"),e.selected=null,m())}}),document.querySelectorAll(".pin-contact").forEach(l=>{l.onclick=c=>{const r=Number(l.dataset.index);e.contacts[r].pinned&&!confirm("¿Seguro que quieres desfijar este contacto?")||(e.contacts[r].pinned=!e.contacts[r].pinned,I(e.contacts),m())}});const s=document.getElementById("contact-form");s&&(s.onsubmit=l=>{l.preventDefault();const c=Object.fromEntries(new FormData(s)),r=validateContact(c);if(r.length>0){g("Error de validación: "+r.join(", "),"error");return}let u=c.tags?c.tags.split(",").map(k=>k.trim()).filter(Boolean):[];delete c.tags;const f={...c};e.contacts.some((k,w)=>e.editing!==null&&w===e.editing?!1:R(k,f))&&!confirm("Ya existe un contacto similar. ¿Deseas guardarlo de todas formas?")||(e.editing!==null&&e.editing<e.contacts.length?(e.contacts[e.editing]={...e.contacts[e.editing],...c,tags:u},g("Contacto actualizado correctamente","success")):(e.contacts.push({...c,notes:{},tags:u}),g("Contacto añadido correctamente","success")),I(e.contacts),e.editing=null,m())},document.getElementById("cancel-edit").onclick=()=>{e.editing=null,m()});const i=document.getElementById("add-note-form");i&&e.addNoteContactIndex!==null&&(i.onsubmit=l=>{l.preventDefault();const c=document.getElementById("add-note-date").value,r=document.getElementById("add-note-text").value.trim();if(!c||!r){g("Por favor, selecciona una fecha y escribe una nota","warning");return}const u=validateNote(r);if(u.length>0){g("Error en la nota: "+u.join(", "),"error");return}const f=e.addNoteContactIndex;e.contacts[f].notes||(e.contacts[f].notes={}),e.contacts[f].notes[c]?e.contacts[f].notes[c]+=`
`+r:e.contacts[f].notes[c]=r,I(e.contacts),g("Nota añadida correctamente","success"),e.showAddNoteModal=!1,e.addNoteContactIndex=null,m()});const a=document.getElementById("note-form");a&&e.selected!==null&&(a.onsubmit=l=>{l.preventDefault();const c=document.getElementById("note-date").value,r=document.getElementById("note-text").value.trim();if(!c||!r){g("Por favor, selecciona una fecha y escribe una nota","warning");return}const u=validateNote(r);if(u.length>0){g("Error en la nota: "+u.join(", "),"error");return}e.contacts[e.selected].notes||(e.contacts[e.selected].notes={}),e.contacts[e.selected].notes[c]?e.contacts[e.selected].notes[c]+=`
`+r:e.contacts[e.selected].notes[c]=r,I(e.contacts),g("Nota guardada correctamente","success"),document.getElementById("note-text").value="",m()}),document.querySelectorAll(".edit-note").forEach(l=>{l.onclick=c=>{const r=l.dataset.date,u=document.getElementById("edit-note-modal"),f=document.getElementById("edit-note-text");f.value=e.contacts[e.selected].notes[r],u.style.display="block",document.getElementById("save-edit-note").onclick=()=>{const $=f.value.trim(),k=validateNote($);if(k.length>0){g("Error en la nota: "+k.join(", "),"error");return}e.contacts[e.selected].notes[r]=$,I(e.contacts),g("Nota actualizada correctamente","success"),u.style.display="none",m()},document.getElementById("cancel-edit-note").onclick=()=>{u.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(l=>{l.onclick=c=>{const r=l.dataset.date;confirm(`¿Estás seguro de eliminar la nota del ${r}?

Esta acción no se puede deshacer.`)&&(delete e.contacts[e.selected].notes[r],I(e.contacts),g("Nota eliminada correctamente","success"),m())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{oe(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{ne(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{ae(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async l=>{const c=l.target.files[0];if(!c)return;const r=await c.text();let u=[];if(c.name.endsWith(".vcf"))u=Q(r);else if(c.name.endsWith(".csv"))u=te(r);else if(c.name.endsWith(".json"))try{const f=JSON.parse(r);Array.isArray(f)?u=f:f&&Array.isArray(f.contacts)&&(u=f.contacts)}catch{}if(u.length){const f=[],$=[];if(u.forEach((x,S)=>{const _=validateContact(x);_.length===0?f.push(x):$.push({index:S+1,errors:_})}),$.length>0){const x=$.map(S=>`Contacto ${S.index}: ${S.errors.join(", ")}`).join(`
`);if(!confirm(`Se encontraron ${$.length} contacto(s) con errores:

${x}

¿Deseas importar solo los contactos válidos (${f.length})?`))return}const k=x=>e.contacts.some(S=>S.name===x.name&&S.surname===x.surname&&S.phone===x.phone),w=f.filter(x=>!k(x));w.length?(e.contacts=e.contacts.concat(w),I(e.contacts),g(`${w.length} contacto(s) importado(s) correctamente`,"success"),m()):g("No se han importado contactos nuevos (todos ya existen)","info")}else g("No se pudieron importar contactos del archivo seleccionado","error")};const o=document.getElementById("close-all-notes");o&&(o.onclick=()=>{e.showAllNotes=!1,e.allNotesPage=1,m()});const d=document.getElementById("show-all-notes-btn");d&&(d.onclick=()=>{if(!A()){D()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m();return}e.showAllNotes=!0,e.allNotesPage=1,m()});const p=document.getElementById("prev-notes-page");p&&(p.onclick=()=>{e.allNotesPage>1&&(e.allNotesPage--,m())});const b=document.getElementById("next-notes-page");b&&(b.onclick=()=>{let l=[];e.contacts.forEach((r,u)=>{r.notes&&Object.entries(r.notes).forEach(([f,$])=>{l.push({date:f,text:$,contact:r,contactIndex:u})})});const c=Math.max(1,Math.ceil(l.length/4));e.allNotesPage<c&&(e.allNotesPage++,m())}),document.querySelectorAll(".edit-note-link").forEach(l=>{l.onclick=c=>{c.preventDefault();const r=Number(l.dataset.contact),u=l.dataset.date;e.selected=r,e.editing=null,e.showAllNotes=!1,m(),setTimeout(()=>{const f=document.querySelector(`.edit-note[data-date="${u}"]`);f&&f.click()},50)}}),document.querySelectorAll(".share-backup-btn").forEach(l=>{l.onclick=async()=>{const c=l.dataset.fecha,u=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(x=>x.fecha===c);if(!u)return alert("No se encontró la copia seleccionada.");const f=`contactos_backup_${c}.json`,$=JSON.stringify(u.datos,null,2),k=new Blob([$],{type:"application/json"}),w=document.createElement("a");if(w.href=URL.createObjectURL(k),w.download=f,w.style.display="none",document.body.appendChild(w),w.click(),setTimeout(()=>{URL.revokeObjectURL(w.href),w.remove()},1e3),navigator.canShare&&window.File&&window.FileReader)try{const x=new File([k],f,{type:"application/json"});navigator.canShare({files:[x]})&&await navigator.share({files:[x],title:"Backup de Contactos",text:`Copia de seguridad (${c}) de ContactosDiarios`})}catch{}}});const h=document.getElementById("manage-duplicates-btn");h&&(h.onclick=()=>{e.duplicates=ie(),e.duplicates.length===0?g("No se encontraron contactos duplicados","info"):(e.showDuplicateModal=!0,m())});const v=document.getElementById("validate-contacts-btn");v&&(v.onclick=()=>{const l=[];if(e.contacts.forEach((c,r)=>{const u=validateContact(c);if(u.length>0){const f=c.surname?`${c.surname}, ${c.name}`:c.name;l.push({index:r+1,name:f,errors:u})}}),l.length===0)g(`✅ Todos los ${e.contacts.length} contactos son válidos`,"success");else{const c=l.map(r=>`${r.index}. ${r.name}: ${r.errors.join(", ")}`).join(`
`);g(`⚠️ Se encontraron ${l.length} contacto(s) con errores`,"warning"),console.log("Contactos con errores de validación:",l),confirm(`Se encontraron ${l.length} contacto(s) con errores de validación:

${c}

¿Deseas ver más detalles en la consola del navegador?`)&&console.table(l)}});const y=document.getElementById("cancel-duplicate-resolution");y&&(y.onclick=()=>{e.showDuplicateModal=!1,e.duplicates=[],m()});const E=document.getElementById("apply-resolution");E&&(E.onclick=re),document.querySelectorAll('input[name^="resolution-"]').forEach(l=>{l.addEventListener("change",()=>{const c=l.name.split("-")[1],r=document.getElementById(`merge-section-${c}`),u=document.getElementById(`individual-section-${c}`);l.value==="merge"?(r.style.display="block",u.style.display="none"):l.value==="select"?(r.style.display="none",u.style.display="block"):(r.style.display="none",u.style.display="none")})}),document.querySelectorAll('.resolution-option input[type="radio"]').forEach(l=>{l.addEventListener("change",()=>{const c=l.name;document.querySelectorAll(`input[name="${c}"]`).forEach(r=>{r.closest(".resolution-option").classList.remove("selected")}),l.closest(".resolution-option").classList.add("selected")})});const C=document.getElementById("unlock-notes-btn");C&&(C.onclick=()=>{D()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m()});const L=document.getElementById("logout-btn");L&&(L.onclick=()=>{me(),m()});const B=document.getElementById("auth-form");B&&!B.hasAttribute("data-handler-added")&&(B.setAttribute("data-handler-added","true"),B.onsubmit=l=>{l.preventDefault();const c=document.getElementById("auth-password").value.trim();if(!c){g("Por favor, introduce una contraseña","warning");return}if(e.authMode==="setup"){const r=document.getElementById("auth-password-confirm").value.trim();if(c!==r){g("Las contraseñas no coinciden","error");return}if(c.length<4){g("La contraseña debe tener al menos 4 caracteres","warning");return}de(c),N.isAuthenticated=!0,N.sessionExpiry=Date.now()+30*60*1e3,e.showAuthModal=!1,B.reset(),m()}else pe(c)?(e.showAuthModal=!1,B.reset(),m()):(document.getElementById("auth-password").value="",document.getElementById("auth-password").focus())});const O=document.getElementById("cancel-auth");O&&(O.onclick=()=>{e.showAuthModal=!1,m()});const M=document.getElementById("auth-modal");if(M){M.onclick=r=>{r.target===M&&(e.showAuthModal=!1,m())};const l=document.getElementById("auth-password");if(l){const r=window.innerWidth<=700?300:100;setTimeout(()=>{l.focus(),window.innerWidth<=700&&setTimeout(()=>{l.scrollIntoView({behavior:"smooth",block:"center"})},100)},r)}const c=r=>{r.key==="Escape"&&e.showAuthModal&&(e.showAuthModal=!1,m())};document.addEventListener("keydown",c)}}function Q(n){const t=[],s=n.split("END:VCARD");for(const i of s){const a=/FN:([^\n]*)/.exec(i)?.[1]?.trim(),o=/N:.*;([^;\n]*)/.exec(i)?.[1]?.trim()||"",d=/TEL.*:(.+)/.exec(i)?.[1]?.trim(),p=/EMAIL.*:(.+)/.exec(i)?.[1]?.trim();a&&t.push({name:a,surname:o,phone:d||"",email:p||"",notes:{},tags:[]})}return t}function ee(n){return n.map(t=>`BEGIN:VCARD
VERSION:3.0
FN:${t.name}
N:${t.surname||""};;;;
TEL:${t.phone||""}
EMAIL:${t.email||""}
END:VCARD`).join(`
`)}function te(n){const t=n.split(`
`).filter(Boolean),[s,...i]=t;return i.map(a=>{const[o,d,p,b,h,v]=a.split(",");return{name:o?.trim()||"",surname:d?.trim()||"",phone:p?.trim()||"",email:b?.trim()||"",notes:v?JSON.parse(v):{},tags:h?h.split(";").map(y=>y.trim()):[]}})}function oe(){const n=ee(e.contacts),t=new Blob([n],{type:"text/vcard"}),s=document.createElement("a");s.href=URL.createObjectURL(t),s.download="contactos.vcf",s.click()}function ne(){const n="name,surname,phone,email,tags,notes",t=e.contacts.map(o=>[o.name,o.surname,o.phone,o.email,(o.tags||[]).join(";"),JSON.stringify(o.notes||{})].map(d=>'"'+String(d).replace(/"/g,'""')+'"').join(",")),s=[n,...t].join(`
`),i=new Blob([s],{type:"text/csv"}),a=document.createElement("a");a.href=URL.createObjectURL(i),a.download="contactos.csv",a.click()}function ae(){const n=new Blob([JSON.stringify(e.contacts,null,2)],{type:"application/json"}),t=document.createElement("a");t.href=URL.createObjectURL(n),t.download="contactos.json",t.click()}function F(){const n=new Date,s=new Date(n.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);let i=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");i.find(a=>a.fecha===s)||(i.push({fecha:s,datos:e.contacts}),i.length>10&&(i=i.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(i))),localStorage.setItem("contactos_diarios_backup_fecha",s)}setInterval(F,60*60*1e3);F();function se(n){if(!confirm("¿Seguro que quieres restaurar la copia de seguridad del "+n+"? Se sobrescribirán los contactos actuales."))return;const s=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(i=>i.fecha===n);s?(e.contacts=s.datos,I(e.contacts),m(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}function R(n,t){const s=i=>i?i.toLowerCase().replace(/\s+/g," ").trim():"";return!!(s(n.name)===s(t.name)&&s(n.surname)===s(t.surname)||n.phone&&t.phone&&n.phone.replace(/\s+/g,"")===t.phone.replace(/\s+/g,"")||n.email&&t.email&&s(n.email)===s(t.email))}function ie(){const n=[],t=new Set;for(let s=0;s<e.contacts.length;s++){if(t.has(s))continue;const i=[{...e.contacts[s],originalIndex:s}];t.add(s);for(let a=s+1;a<e.contacts.length;a++)t.has(a)||R(e.contacts[s],e.contacts[a])&&(i.push({...e.contacts[a],originalIndex:a}),t.add(a));i.length>1&&n.push({contacts:i})}return n}function V(n){if(n.length===0)return null;if(n.length===1)return n[0];const t={name:"",surname:"",phone:"",email:"",tags:[],notes:{},pinned:!1};let s="",i="";n.forEach(o=>{o.name&&o.name.length>s.length&&(s=o.name),o.surname&&o.surname.length>i.length&&(i=o.surname)}),t.name=s,t.surname=i,t.phone=n.find(o=>o.phone)?.phone||"",t.email=n.find(o=>o.email)?.email||"";const a=new Set;return n.forEach(o=>{o.tags&&o.tags.forEach(d=>a.add(d))}),t.tags=Array.from(a),n.forEach((o,d)=>{o.notes&&Object.entries(o.notes).forEach(([p,b])=>{t.notes[p]?t.notes[p]+=`
--- Contacto ${d+1} ---
${b}`:t.notes[p]=b})}),t.pinned=n.some(o=>o.pinned),t}function ce(n){const t=V(n);return`
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
            ${t.tags.map(s=>`<span class="tag">${s}</span>`).join("")}
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
  `}function le({duplicates:n,visible:t}){return!t||n.length===0?'<div id="duplicate-modal" class="modal" style="display:none"></div>':`
    <div id="duplicate-modal" class="modal" style="display:flex;z-index:5000;">
      <div class="modal-content" style="max-width:800px;max-height:90vh;overflow-y:auto;">
        <h3>🔍 Gestión de contactos duplicados</h3>
        <p>Se encontraron <strong>${n.length}</strong> grupo(s) de contactos duplicados. 
           Para cada grupo, elige cómo resolverlo:</p>
        
        ${n.map((s,i)=>`
          <div class="duplicate-group" style="border:1px solid #ddd;border-radius:8px;padding:15px;margin:15px 0;background:#fafafa;">
            <h4>Grupo ${i+1} - ${s.contacts.length} contactos similares</h4>
            
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
              ${ce(s.contacts)}
            </div>
            
            <!-- Sección de selección individual (oculta por defecto) -->
            <div class="individual-selection" id="individual-section-${i}" style="display:none;">
              <h5>Selecciona el contacto a mantener:</h5>
              ${s.contacts.map((a,o)=>`
                <label class="duplicate-contact" style="display:block;margin:8px 0;padding:12px;border:1px solid #ccc;border-radius:6px;cursor:pointer;">
                  <input type="radio" name="keep-${i}" value="${a.originalIndex}">
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
  `}function re(){const n=[];let t=0;if(e.duplicates.forEach((o,d)=>{const p=document.querySelector(`input[name="resolution-${d}"]:checked`),b=p?p.value:"skip";if(b==="merge")n.push({type:"merge",groupIndex:d,contacts:o.contacts}),t++;else if(b==="select"){const h=document.querySelector(`input[name="keep-${d}"]:checked`);if(h){const v=parseInt(h.value),y=o.contacts.filter(E=>E.originalIndex!==v).map(E=>E.originalIndex);n.push({type:"delete",groupIndex:d,toDelete:y,toKeep:v}),t++}}}),t===0){g("No hay operaciones que realizar","info");return}const s=n.filter(o=>o.type==="merge").length,i=n.filter(o=>o.type==="delete").length;let a=`¿Confirmar las siguientes operaciones?

`;if(s>0&&(a+=`🔗 Fusionar ${s} grupo(s) de contactos
`),i>0&&(a+=`🗑️ Eliminar duplicados en ${i} grupo(s)
`),a+=`
Esta acción no se puede deshacer.`,!confirm(a)){g("Operación cancelada","info");return}try{let o=0,d=0;const p=[];n.forEach(y=>{if(y.type==="merge"){const E=V(y.contacts);e.contacts.push(E),y.contacts.forEach(C=>{p.push(C.originalIndex)}),o++}else y.type==="delete"&&(y.toDelete.forEach(E=>{p.push(E)}),d+=y.toDelete.length)}),[...new Set(p)].sort((y,E)=>E-y).forEach(y=>{y<e.contacts.length&&e.contacts.splice(y,1)}),I(e.contacts);let h="Resolución completada: ";const v=[];o>0&&v.push(`${o} contacto(s) fusionado(s)`),d>0&&v.push(`${d} duplicado(s) eliminado(s)`),h+=v.join(" y "),g(h,"success"),e.showDuplicateModal=!1,e.duplicates=[],m()}catch(o){g("Error al aplicar resolución: "+o.message,"error")}}const j="contactos_diarios_auth";let N={isAuthenticated:!1,sessionExpiry:null};function z(n){let t=0;for(let s=0;s<n.length;s++){const i=n.charCodeAt(s);t=(t<<5)-t+i,t=t&t}return t.toString()}function de(n){const t=z(n);localStorage.setItem(j,t),g("Contraseña establecida correctamente","success")}function ue(n){const t=localStorage.getItem(j);return t?z(n)===t:!1}function D(){return localStorage.getItem(j)!==null}function pe(n){return ue(n)?(N.isAuthenticated=!0,N.sessionExpiry=Date.now()+30*60*1e3,g("Autenticación exitosa","success"),!0):(g("Contraseña incorrecta","error"),!1)}function A(){return N.isAuthenticated?Date.now()>N.sessionExpiry?(N.isAuthenticated=!1,N.sessionExpiry=null,!1):!0:!1}function me(){N.isAuthenticated=!1,N.sessionExpiry=null,g("Sesión cerrada","info")}function fe({visible:n,mode:t="login"}){return`
    <div id="auth-modal" class="modal" style="display:${n?"flex":"none"};z-index:6000;">
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
  `}function ge(){return window.innerWidth<=700||/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)}function he(){document.addEventListener("touchstart",{},{passive:!0}),/iPad|iPhone|iPod/.test(navigator.userAgent)&&(document.body.style.webkitOverflowScrolling="touch"),window.matchMedia("(display-mode: standalone)").matches&&(document.body.classList.add("pwa-mode"),/iPhone/.test(navigator.userAgent)&&(document.body.style.paddingTop="env(safe-area-inset-top)")),ge()&&navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2&&document.documentElement.style.setProperty("--animation-duration","0.1s")}document.addEventListener("DOMContentLoaded",()=>{m(),he();let n=null;const t=document.createElement("button");t.textContent="📲 Instalar en tu dispositivo",t.className="add-btn",t.style.display="none",t.style.position="fixed",t.style.bottom="1.5rem",t.style.left="50%",t.style.transform="translateX(-50%)",t.style.zIndex="3000",document.body.appendChild(t),window.addEventListener("beforeinstallprompt",s=>{s.preventDefault(),n=s,t.style.display="block"}),t.addEventListener("click",async()=>{if(n){n.prompt();const{outcome:s}=await n.userChoice;s==="accepted"&&(t.style.display="none"),n=null}}),window.addEventListener("appinstalled",()=>{t.style.display="none"})});
