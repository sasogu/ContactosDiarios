(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const d of a.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function i(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=i(n);fetch(n.href,a)}})();const P="0.0.58";(function(){try{const t=localStorage.getItem("app_version");if(t&&t!==P){const i=localStorage.getItem("contactos_diarios"),s=localStorage.getItem("contactos_diarios_backups"),n=localStorage.getItem("contactos_diarios_backup_fecha"),a=localStorage.getItem("contactos_diarios_webdav_config");["app_version","contactos_diarios","contactos_diarios_backups","contactos_diarios_backup_fecha","contactos_diarios_webdav_config"].forEach(u=>{u!=="contactos_diarios"&&localStorage.removeItem(u)}),"caches"in window&&caches.keys().then(u=>{u.forEach(f=>{(f.includes("contactosdiarios")||f.includes("contactos-diarios"))&&caches.delete(f)})}),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(u=>{u.forEach(f=>{f.scope.includes(window.location.origin)&&f.unregister()})}),i&&localStorage.setItem("contactos_diarios",i),s&&localStorage.setItem("contactos_diarios_backups",s),n&&localStorage.setItem("contactos_diarios_backup_fecha",n),a&&localStorage.setItem("contactos_diarios_webdav_config",a),location.reload()}localStorage.setItem("app_version",P)}catch{}})();function U({contacts:o,filter:t,onSelect:i,onDelete:s}){let n=t?o.filter(a=>{const d=t.toLowerCase(),u=a.notes?Object.values(a.notes).join(" ").toLowerCase():"";return a.tags?.some(f=>f.toLowerCase().includes(d))||a.name?.toLowerCase().includes(d)||a.surname?.toLowerCase().includes(d)||u.includes(d)}):o;return n=n.slice().sort((a,d)=>d.pinned&&!a.pinned?1:a.pinned&&!d.pinned?-1:(a.surname||"").localeCompare(d.surname||"")),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${t||""}" />
      <ul>
        ${n.length===0?'<li class="empty">Sin contactos</li>':n.map((a,d)=>`
          <li${a.pinned?' class="pinned"':""}>
            <div class="contact-main">
              <button class="select-contact" data-index="${o.indexOf(a)}">${a.surname?a.surname+", ":""}${a.name}</button>
              <span class="tags">${(a.tags||[]).map(u=>`<span class='tag'>${u}</span>`).join(" ")}</span>
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
  `}function J({contact:o}){return`
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
  `}function G({notes:o}){if(!B())return`
      <div class="notes-area">
        <h3>🔒 Notas privadas protegidas</h3>
        <div style="text-align:center;padding:20px;background:#f8f9fa;border-radius:8px;margin:20px 0;">
          <p style="margin-bottom:15px;color:#666;">
            Las notas están protegidas con contraseña para mantener tu privacidad.
          </p>
          <button id="unlock-notes-btn" style="background:#3a4a7c;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;">
            🔓 Desbloquear notas
          </button>
          ${B()?`
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
        ${Object.entries(o||{}).sort((n,a)=>a[0].localeCompare(n[0])).map(([n,a])=>`
          <li>
            <b>${n}</b>:
            <span class="note-content" data-date="${n}">${a}</span>
            <button class="edit-note" data-date="${n}" title="Editar">✏️</button>
            <button class="delete-note" data-date="${n}" title="Eliminar">🗑️</button>
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
  `}function K({}){return`
    <div class="import-export">
      <button id="import-btn">Importar contactos</button>
      <button id="export-btn">Exportar contactos</button>
      <input type="file" id="import-file" accept=".vcf,.csv,.json" style="display:none" />
    </div>
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
  `}function H({contacts:o,visible:t,page:i=1}){let s=[];o.forEach((b,v)=>{b.notes&&Object.entries(b.notes).forEach(([y,E])=>{s.push({date:y,text:E,contact:b,contactIndex:v})})}),s.sort((b,v)=>v.date.localeCompare(b.date));const n=4,a=Math.max(1,Math.ceil(s.length/n)),d=Math.min(Math.max(i,1),a),u=(d-1)*n,f=s.slice(u,u+n);return`
    <div id="all-notes-modal" class="modal" style="display:${t?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${s.length===0?"<li>No hay notas registradas.</li>":f.map(b=>`
            <li>
              <b>${b.date}</b> — <span style="color:#3a4a7c">${b.contact.surname?b.contact.surname+", ":""}${b.contact.name}</span><br/>
              <span>${b.text}</span>
              <a href="#" class="edit-note-link" data-contact="${b.contactIndex}" data-date="${b.date}" style="margin-left:0.5em;color:#646cff;font-size:0.95em;">Editar nota</a>
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
  `}function Y({visible:o,backups:t}){return`
    <div id="backup-modal" class="modal" style="display:${o?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:400px;">
        <h3>Restaurar copia local</h3>
        <div class="backup-btns" style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;">
          ${t.length===0?"<span>Sin copias locales.</span>":t.map(i=>`
            <div class="backup-btn-group" style="display:flex;align-items:center;gap:0.3rem;">
              <button class="restore-backup-btn" data-fecha="${i.fecha}">${i.fecha}</button>
              <button class="share-backup-btn" data-fecha="${i.fecha}" title="Compartir backup" style="background:#06b6d4;padding:0.4rem 0.7rem;font-size:1.1em;">📤</button>
            </div>
          `).join("")}
        </div>
        <div class="form-actions" style="margin-top:1.2rem;"><button id="close-backup-modal">Cerrar</button></div>
      </div>
    </div>
  `}function Z({visible:o,contactIndex:t}){const i=t!==null?e.contacts[t]:null,s=new Date,a=new Date(s.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);return`
    <div id="add-note-modal" class="modal" style="display:${o?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:500px;">
        <h3>Añadir nota diaria</h3>
        ${i?`<p><strong>${i.surname?i.surname+", ":""}${i.name}</strong></p>`:""}
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
  `}const F="contactos_diarios";let e={contacts:X(),selected:null,notes:"",editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1,showAddNoteModal:!1,addNoteContactIndex:null,allNotesPage:1,duplicates:[],showDuplicateModal:!1,showAuthModal:!1,authMode:"login"};function X(){try{return JSON.parse(localStorage.getItem(F))||[]}catch{return[]}}function S(o){localStorage.setItem(F,JSON.stringify(o))}function m(){const o=document.querySelector("#app"),t=e.editing!==null?e.contacts[e.editing]:null,i=e.selected!==null?e.contacts[e.selected].notes||{}:{};o.innerHTML=`
    <h1>Diario de Contactos</h1>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <button id="manage-duplicates-btn" style="background:#dc3545;color:#fff;margin:0 10px 1.2rem 0;">🔍 Gestionar duplicados</button>
    <button id="validate-contacts-btn" style="background:#28a745;color:#fff;margin:0 10px 1.2rem 0;">✅ Validar contactos</button>
    <div class="main-grid">
      <div>
        <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
        ${K({})}
        ${U({contacts:e.contacts,filter:e.tagFilter})}
        <button id="show-backup-modal" class="add-btn" style="width:100%;margin-top:0.7rem;background:#06b6d4;">Restaurar copia local</button>
      </div>
      <div>
        ${e.editing!==null?J({contact:t}):""}
        ${e.selected!==null&&e.editing===null?G({notes:i}):""}
      </div>
    </div>
    ${H({contacts:e.contacts,visible:e.showAllNotes,page:e.allNotesPage})}
    ${Y({visible:e.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})} <!-- Modal de backup -->
    ${Z({visible:e.showAddNoteModal,contactIndex:e.addNoteContactIndex})} <!-- Modal añadir nota -->
    ${re({duplicates:e.duplicates,visible:e.showDuplicateModal})} <!-- Modal de gestión de duplicados -->
    ${ge({visible:e.showAuthModal,mode:e.authMode})} <!-- Modal de autenticación -->
  `,Q();const s=document.getElementById("show-backup-modal");s&&(s.onclick=()=>{e.showBackupModal=!0,m()});const n=document.getElementById("close-backup-modal");n&&(n.onclick=()=>{e.showBackupModal=!1,m()}),document.querySelectorAll(".add-note-contact").forEach(u=>{u.onclick=f=>{if(!B()){M()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m();return}e.addNoteContactIndex=Number(u.dataset.index),e.showAddNoteModal=!0,m()}});const a=document.getElementById("cancel-add-note");a&&(a.onclick=()=>{e.showAddNoteModal=!1,e.addNoteContactIndex=null,m()}),document.querySelectorAll(".restore-backup-btn").forEach(u=>{u.onclick=()=>ie(u.dataset.fecha)});const d=document.getElementById("restore-local-backup");d&&(d.onclick=restaurarBackupLocal)}let T=null;function Q(){const o=document.getElementById("tag-filter");o&&o.addEventListener("input",l=>{clearTimeout(T),T=setTimeout(()=>{e.tagFilter=o.value,m();const c=document.getElementById("tag-filter");c&&(c.value=e.tagFilter,c.focus(),c.setSelectionRange(e.tagFilter.length,e.tagFilter.length))},300)});const t=document.getElementById("add-contact");t&&(t.onclick=()=>{e.editing=null,e.selected=null,m(),e.editing=e.contacts.length,m()}),document.querySelectorAll(".select-contact").forEach(l=>{l.onclick=c=>{e.selected=Number(l.dataset.index),e.editing=null,m()}}),document.querySelectorAll(".edit-contact").forEach(l=>{l.onclick=c=>{e.editing=Number(l.dataset.index),e.selected=null,m()}}),document.querySelectorAll(".delete-contact").forEach(l=>{l.onclick=c=>{const r=Number(l.dataset.index),p=e.contacts[r],g=p.surname?`${p.surname}, ${p.name}`:p.name;confirm(`¿Estás seguro de eliminar el contacto "${g}"?

Esta acción no se puede deshacer.`)&&(e.contacts.splice(r,1),S(e.contacts),h("Contacto eliminado correctamente","success"),e.selected=null,m())}}),document.querySelectorAll(".pin-contact").forEach(l=>{l.onclick=c=>{const r=Number(l.dataset.index);e.contacts[r].pinned&&!confirm("¿Seguro que quieres desfijar este contacto?")||(e.contacts[r].pinned=!e.contacts[r].pinned,S(e.contacts),m())}});const i=document.getElementById("contact-form");i&&(i.onsubmit=l=>{l.preventDefault();const c=Object.fromEntries(new FormData(i)),r=A(c);if(r.length>0){h("Error de validación: "+r.join(", "),"error");return}let p=c.tags?c.tags.split(",").map(k=>k.trim()).filter(Boolean):[];delete c.tags;const g={...c};e.contacts.some((k,$)=>e.editing!==null&&$===e.editing?!1:V(k,g))&&!confirm("Ya existe un contacto similar. ¿Deseas guardarlo de todas formas?")||(e.editing!==null&&e.editing<e.contacts.length?(e.contacts[e.editing]={...e.contacts[e.editing],...c,tags:p},h("Contacto actualizado correctamente","success")):(e.contacts.push({...c,notes:{},tags:p}),h("Contacto añadido correctamente","success")),S(e.contacts),e.editing=null,m())},document.getElementById("cancel-edit").onclick=()=>{e.editing=null,m()});const s=document.getElementById("add-note-form");s&&e.addNoteContactIndex!==null&&(s.onsubmit=l=>{l.preventDefault();const c=document.getElementById("add-note-date").value,r=document.getElementById("add-note-text").value.trim();if(!c||!r){h("Por favor, selecciona una fecha y escribe una nota","warning");return}const p=D(r);if(p.length>0){h("Error en la nota: "+p.join(", "),"error");return}const g=e.addNoteContactIndex;e.contacts[g].notes||(e.contacts[g].notes={}),e.contacts[g].notes[c]?e.contacts[g].notes[c]+=`
`+r:e.contacts[g].notes[c]=r,S(e.contacts),h("Nota añadida correctamente","success"),e.showAddNoteModal=!1,e.addNoteContactIndex=null,m()});const n=document.getElementById("note-form");n&&e.selected!==null&&(n.onsubmit=l=>{l.preventDefault();const c=document.getElementById("note-date").value,r=document.getElementById("note-text").value.trim();if(!c||!r){h("Por favor, selecciona una fecha y escribe una nota","warning");return}const p=D(r);if(p.length>0){h("Error en la nota: "+p.join(", "),"error");return}e.contacts[e.selected].notes||(e.contacts[e.selected].notes={}),e.contacts[e.selected].notes[c]?e.contacts[e.selected].notes[c]+=`
`+r:e.contacts[e.selected].notes[c]=r,S(e.contacts),h("Nota guardada correctamente","success"),document.getElementById("note-text").value="",m()}),document.querySelectorAll(".edit-note").forEach(l=>{l.onclick=c=>{const r=l.dataset.date,p=document.getElementById("edit-note-modal"),g=document.getElementById("edit-note-text");g.value=e.contacts[e.selected].notes[r],p.style.display="block",document.getElementById("save-edit-note").onclick=()=>{const w=g.value.trim(),k=D(w);if(k.length>0){h("Error en la nota: "+k.join(", "),"error");return}e.contacts[e.selected].notes[r]=w,S(e.contacts),h("Nota actualizada correctamente","success"),p.style.display="none",m()},document.getElementById("cancel-edit-note").onclick=()=>{p.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(l=>{l.onclick=c=>{const r=l.dataset.date;confirm(`¿Estás seguro de eliminar la nota del ${r}?

Esta acción no se puede deshacer.`)&&(delete e.contacts[e.selected].notes[r],S(e.contacts),h("Nota eliminada correctamente","success"),m())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{ne(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{ae(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{se(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async l=>{const c=l.target.files[0];if(!c)return;const r=await c.text();let p=[];if(c.name.endsWith(".vcf"))p=ee(r);else if(c.name.endsWith(".csv"))p=oe(r);else if(c.name.endsWith(".json"))try{const g=JSON.parse(r);Array.isArray(g)?p=g:g&&Array.isArray(g.contacts)&&(p=g.contacts)}catch{}if(p.length){const g=[],w=[];if(p.forEach((x,I)=>{const q=A(x);q.length===0?g.push(x):w.push({index:I+1,errors:q})}),w.length>0){const x=w.map(I=>`Contacto ${I.index}: ${I.errors.join(", ")}`).join(`
`);if(!confirm(`Se encontraron ${w.length} contacto(s) con errores:

${x}

¿Deseas importar solo los contactos válidos (${g.length})?`))return}const k=x=>e.contacts.some(I=>I.name===x.name&&I.surname===x.surname&&I.phone===x.phone),$=g.filter(x=>!k(x));$.length?(e.contacts=e.contacts.concat($),S(e.contacts),h(`${$.length} contacto(s) importado(s) correctamente`,"success"),m()):h("No se han importado contactos nuevos (todos ya existen)","info")}else h("No se pudieron importar contactos del archivo seleccionado","error")};const a=document.getElementById("close-all-notes");a&&(a.onclick=()=>{e.showAllNotes=!1,e.allNotesPage=1,m()});const d=document.getElementById("show-all-notes-btn");d&&(d.onclick=()=>{if(!B()){M()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m();return}e.showAllNotes=!0,e.allNotesPage=1,m()});const u=document.getElementById("prev-notes-page");u&&(u.onclick=()=>{e.allNotesPage>1&&(e.allNotesPage--,m())});const f=document.getElementById("next-notes-page");f&&(f.onclick=()=>{let l=[];e.contacts.forEach((r,p)=>{r.notes&&Object.entries(r.notes).forEach(([g,w])=>{l.push({date:g,text:w,contact:r,contactIndex:p})})});const c=Math.max(1,Math.ceil(l.length/4));e.allNotesPage<c&&(e.allNotesPage++,m())}),document.querySelectorAll(".edit-note-link").forEach(l=>{l.onclick=c=>{c.preventDefault();const r=Number(l.dataset.contact),p=l.dataset.date;e.selected=r,e.editing=null,e.showAllNotes=!1,m(),setTimeout(()=>{const g=document.querySelector(`.edit-note[data-date="${p}"]`);g&&g.click()},50)}}),document.querySelectorAll(".share-backup-btn").forEach(l=>{l.onclick=async()=>{const c=l.dataset.fecha,p=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(x=>x.fecha===c);if(!p)return alert("No se encontró la copia seleccionada.");const g=`contactos_backup_${c}.json`,w=JSON.stringify(p.datos,null,2),k=new Blob([w],{type:"application/json"}),$=document.createElement("a");if($.href=URL.createObjectURL(k),$.download=g,$.style.display="none",document.body.appendChild($),$.click(),setTimeout(()=>{URL.revokeObjectURL($.href),$.remove()},1e3),navigator.canShare&&window.File&&window.FileReader)try{const x=new File([k],g,{type:"application/json"});navigator.canShare({files:[x]})&&await navigator.share({files:[x],title:"Backup de Contactos",text:`Copia de seguridad (${c}) de ContactosDiarios`})}catch{}}});const b=document.getElementById("manage-duplicates-btn");b&&(b.onclick=()=>{e.duplicates=ce(),e.duplicates.length===0?h("No se encontraron contactos duplicados","info"):(e.showDuplicateModal=!0,m())});const v=document.getElementById("validate-contacts-btn");v&&(v.onclick=()=>{const l=[];if(e.contacts.forEach((c,r)=>{const p=A(c);if(p.length>0){const g=c.surname?`${c.surname}, ${c.name}`:c.name;l.push({index:r+1,name:g,errors:p})}}),l.length===0)h(`✅ Todos los ${e.contacts.length} contactos son válidos`,"success");else{const c=l.map(r=>`${r.index}. ${r.name}: ${r.errors.join(", ")}`).join(`
`);h(`⚠️ Se encontraron ${l.length} contacto(s) con errores`,"warning"),console.log("Contactos con errores de validación:",l),confirm(`Se encontraron ${l.length} contacto(s) con errores de validación:

${c}

¿Deseas ver más detalles en la consola del navegador?`)&&console.table(l)}});const y=document.getElementById("cancel-duplicate-resolution");y&&(y.onclick=()=>{e.showDuplicateModal=!1,e.duplicates=[],m()});const E=document.getElementById("apply-resolution");E&&(E.onclick=de),document.querySelectorAll('input[name^="resolution-"]').forEach(l=>{l.addEventListener("change",()=>{const c=l.name.split("-")[1],r=document.getElementById(`merge-section-${c}`),p=document.getElementById(`individual-section-${c}`);l.value==="merge"?(r.style.display="block",p.style.display="none"):l.value==="select"?(r.style.display="none",p.style.display="block"):(r.style.display="none",p.style.display="none")})}),document.querySelectorAll('.resolution-option input[type="radio"]').forEach(l=>{l.addEventListener("change",()=>{const c=l.name;document.querySelectorAll(`input[name="${c}"]`).forEach(r=>{r.closest(".resolution-option").classList.remove("selected")}),l.closest(".resolution-option").classList.add("selected")})});const C=document.getElementById("unlock-notes-btn");C&&(C.onclick=()=>{M()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m()});const O=document.getElementById("logout-btn");O&&(O.onclick=()=>{fe(),m()});const L=document.getElementById("auth-form");L&&(L.onsubmit=l=>{l.preventDefault();const c=document.getElementById("auth-password").value;if(e.authMode==="setup"){const r=document.getElementById("auth-password-confirm").value;if(c!==r){h("Las contraseñas no coinciden","error");return}if(c.length<4){h("La contraseña debe tener al menos 4 caracteres","warning");return}ue(c),N.isAuthenticated=!0,N.sessionExpiry=Date.now()+30*60*1e3,e.showAuthModal=!1,m()}else me(c)&&(e.showAuthModal=!1,m())});const _=document.getElementById("cancel-auth");_&&(_.onclick=()=>{e.showAuthModal=!1,m()})}function ee(o){const t=[],i=o.split("END:VCARD");for(const s of i){const n=/FN:([^\n]*)/.exec(s)?.[1]?.trim(),a=/N:.*;([^;\n]*)/.exec(s)?.[1]?.trim()||"",d=/TEL.*:(.+)/.exec(s)?.[1]?.trim(),u=/EMAIL.*:(.+)/.exec(s)?.[1]?.trim();n&&t.push({name:n,surname:a,phone:d||"",email:u||"",notes:{},tags:[]})}return t}function te(o){return o.map(t=>`BEGIN:VCARD
VERSION:3.0
FN:${t.name}
N:${t.surname||""};;;;
TEL:${t.phone||""}
EMAIL:${t.email||""}
END:VCARD`).join(`
`)}function oe(o){const t=o.split(`
`).filter(Boolean),[i,...s]=t;return s.map(n=>{const[a,d,u,f,b,v]=n.split(",");return{name:a?.trim()||"",surname:d?.trim()||"",phone:u?.trim()||"",email:f?.trim()||"",notes:v?JSON.parse(v):{},tags:b?b.split(";").map(y=>y.trim()):[]}})}function ne(){const o=te(e.contacts),t=new Blob([o],{type:"text/vcard"}),i=document.createElement("a");i.href=URL.createObjectURL(t),i.download="contactos.vcf",i.click()}function ae(){const o="name,surname,phone,email,tags,notes",t=e.contacts.map(a=>[a.name,a.surname,a.phone,a.email,(a.tags||[]).join(";"),JSON.stringify(a.notes||{})].map(d=>'"'+String(d).replace(/"/g,'""')+'"').join(",")),i=[o,...t].join(`
`),s=new Blob([i],{type:"text/csv"}),n=document.createElement("a");n.href=URL.createObjectURL(s),n.download="contactos.csv",n.click()}function se(){const o=new Blob([JSON.stringify(e.contacts,null,2)],{type:"application/json"}),t=document.createElement("a");t.href=URL.createObjectURL(o),t.download="contactos.json",t.click()}function R(){const o=new Date,i=new Date(o.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);let s=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");s.find(n=>n.fecha===i)||(s.push({fecha:i,datos:e.contacts}),s.length>10&&(s=s.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(s))),localStorage.setItem("contactos_diarios_backup_fecha",i)}setInterval(R,60*60*1e3);R();function ie(o){if(!confirm("¿Seguro que quieres restaurar la copia de seguridad del "+o+"? Se sobrescribirán los contactos actuales."))return;const i=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(s=>s.fecha===o);i?(e.contacts=i.datos,S(e.contacts),m(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}function V(o,t){const i=s=>s?s.toLowerCase().replace(/\s+/g," ").trim():"";return!!(i(o.name)===i(t.name)&&i(o.surname)===i(t.surname)||o.phone&&t.phone&&o.phone.replace(/\s+/g,"")===t.phone.replace(/\s+/g,"")||o.email&&t.email&&i(o.email)===i(t.email))}function ce(){const o=[],t=new Set;for(let i=0;i<e.contacts.length;i++){if(t.has(i))continue;const s=[{...e.contacts[i],originalIndex:i}];t.add(i);for(let n=i+1;n<e.contacts.length;n++)t.has(n)||V(e.contacts[i],e.contacts[n])&&(s.push({...e.contacts[n],originalIndex:n}),t.add(n));s.length>1&&o.push({contacts:s})}return o}function W(o){if(o.length===0)return null;if(o.length===1)return o[0];const t={name:"",surname:"",phone:"",email:"",tags:[],notes:{},pinned:!1};let i="",s="";o.forEach(a=>{a.name&&a.name.length>i.length&&(i=a.name),a.surname&&a.surname.length>s.length&&(s=a.surname)}),t.name=i,t.surname=s,t.phone=o.find(a=>a.phone)?.phone||"",t.email=o.find(a=>a.email)?.email||"";const n=new Set;return o.forEach(a=>{a.tags&&a.tags.forEach(d=>n.add(d))}),t.tags=Array.from(n),o.forEach((a,d)=>{a.notes&&Object.entries(a.notes).forEach(([u,f])=>{t.notes[u]?t.notes[u]+=`
--- Contacto ${d+1} ---
${f}`:t.notes[u]=f})}),t.pinned=o.some(a=>a.pinned),t}function le(o){const t=W(o);return`
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
            ${t.tags.map(i=>`<span class="tag">${i}</span>`).join("")}
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
  `}function re({duplicates:o,visible:t}){return!t||o.length===0?'<div id="duplicate-modal" class="modal" style="display:none"></div>':`
    <div id="duplicate-modal" class="modal" style="display:flex;z-index:5000;">
      <div class="modal-content" style="max-width:800px;max-height:90vh;overflow-y:auto;">
        <h3>🔍 Gestión de contactos duplicados</h3>
        <p>Se encontraron <strong>${o.length}</strong> grupo(s) de contactos duplicados. 
           Para cada grupo, elige cómo resolverlo:</p>
        
        ${o.map((i,s)=>`
          <div class="duplicate-group" style="border:1px solid #ddd;border-radius:8px;padding:15px;margin:15px 0;background:#fafafa;">
            <h4>Grupo ${s+1} - ${i.contacts.length} contactos similares</h4>
            
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
              ${le(i.contacts)}
            </div>
            
            <!-- Sección de selección individual (oculta por defecto) -->
            <div class="individual-selection" id="individual-section-${s}" style="display:none;">
              <h5>Selecciona el contacto a mantener:</h5>
              ${i.contacts.map((n,a)=>`
                <label class="duplicate-contact" style="display:block;margin:8px 0;padding:12px;border:1px solid #ccc;border-radius:6px;cursor:pointer;">
                  <input type="radio" name="keep-${s}" value="${n.originalIndex}">
                  <strong>${n.surname?n.surname+", ":""}${n.name}</strong>
                  ${n.phone?`📞 ${n.phone}`:""}
                  ${n.email?`✉️ ${n.email}`:""}
                  ${n.tags&&n.tags.length>0?`<br>🏷️ ${n.tags.join(", ")}`:""}
                  ${Object.keys(n.notes||{}).length>0?`<br>📝 ${Object.keys(n.notes).length} nota(s)`:""}
                  ${n.pinned?"<br>📌 Fijado":""}
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
  `}function de(){const o=[];let t=0;if(e.duplicates.forEach((a,d)=>{const u=document.querySelector(`input[name="resolution-${d}"]:checked`),f=u?u.value:"skip";if(f==="merge")o.push({type:"merge",groupIndex:d,contacts:a.contacts}),t++;else if(f==="select"){const b=document.querySelector(`input[name="keep-${d}"]:checked`);if(b){const v=parseInt(b.value),y=a.contacts.filter(E=>E.originalIndex!==v).map(E=>E.originalIndex);o.push({type:"delete",groupIndex:d,toDelete:y,toKeep:v}),t++}}}),t===0){h("No hay operaciones que realizar","info");return}const i=o.filter(a=>a.type==="merge").length,s=o.filter(a=>a.type==="delete").length;let n=`¿Confirmar las siguientes operaciones?

`;if(i>0&&(n+=`🔗 Fusionar ${i} grupo(s) de contactos
`),s>0&&(n+=`🗑️ Eliminar duplicados en ${s} grupo(s)
`),n+=`
Esta acción no se puede deshacer.`,!confirm(n)){h("Operación cancelada","info");return}try{let a=0,d=0;const u=[];o.forEach(y=>{if(y.type==="merge"){const E=W(y.contacts);e.contacts.push(E),y.contacts.forEach(C=>{u.push(C.originalIndex)}),a++}else y.type==="delete"&&(y.toDelete.forEach(E=>{u.push(E)}),d+=y.toDelete.length)}),[...new Set(u)].sort((y,E)=>E-y).forEach(y=>{y<e.contacts.length&&e.contacts.splice(y,1)}),S(e.contacts);let b="Resolución completada: ";const v=[];a>0&&v.push(`${a} contacto(s) fusionado(s)`),d>0&&v.push(`${d} duplicado(s) eliminado(s)`),b+=v.join(" y "),h(b,"success"),e.showDuplicateModal=!1,e.duplicates=[],m()}catch(a){h("Error al aplicar resolución: "+a.message,"error")}}const j="contactos_diarios_auth";let N={isAuthenticated:!1,sessionExpiry:null};function z(o){let t=0;for(let i=0;i<o.length;i++){const s=o.charCodeAt(i);t=(t<<5)-t+s,t=t&t}return t.toString()}function ue(o){const t=z(o);localStorage.setItem(j,t),h("Contraseña establecida correctamente","success")}function pe(o){const t=localStorage.getItem(j);return t?z(o)===t:!1}function M(){return localStorage.getItem(j)!==null}function me(o){return pe(o)?(N.isAuthenticated=!0,N.sessionExpiry=Date.now()+30*60*1e3,h("Autenticación exitosa","success"),!0):(h("Contraseña incorrecta","error"),!1)}function B(){return N.isAuthenticated?Date.now()>N.sessionExpiry?(N.isAuthenticated=!1,N.sessionExpiry=null,!1):!0:!1}function fe(){N.isAuthenticated=!1,N.sessionExpiry=null,h("Sesión cerrada","info")}function ge({visible:o,mode:t="login"}){return`
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
  `}function h(o,t="info"){const i=document.querySelector(".notification");i&&i.remove();const s=document.createElement("div");switch(s.className=`notification ${t}`,s.textContent=o,s.style.cssText=`
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    z-index: 10000;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    max-width: 400px;
    word-wrap: break-word;
    animation: slideInNotification 0.3s ease-out;
  `,t){case"success":s.style.background="#d4edda",s.style.color="#155724",s.style.border="1px solid #c3e6cb";break;case"error":s.style.background="#f8d7da",s.style.color="#721c24",s.style.border="1px solid #f5c6cb";break;case"warning":s.style.background="#fff3cd",s.style.color="#856404",s.style.border="1px solid #ffeaa7";break;default:s.style.background="#d1ecf1",s.style.color="#0c5460",s.style.border="1px solid #bee5eb"}document.body.appendChild(s),setTimeout(()=>{s.parentNode&&(s.style.animation="slideOutNotification 0.3s ease-in forwards",setTimeout(()=>s.remove(),300))},4e3)}function A(o){const t=[];return(!o.name||o.name.trim().length===0)&&t.push("El nombre es obligatorio"),(!o.surname||o.surname.trim().length===0)&&t.push("Los apellidos son obligatorios"),o.phone&&!/^[0-9+\-() ]+$/.test(o.phone)&&t.push("El teléfono contiene caracteres no válidos"),o.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.email)&&t.push("El formato del email no es válido"),t}function D(o){return!o||o.trim().length===0?["La nota no puede estar vacía"]:o.trim().length>500?["La nota no puede superar los 500 caracteres"]:[]}document.addEventListener("DOMContentLoaded",()=>{m();let o=null;const t=document.createElement("button");t.textContent="📲 Instalar en tu dispositivo",t.className="add-btn",t.style.display="none",t.style.position="fixed",t.style.bottom="1.5rem",t.style.left="50%",t.style.transform="translateX(-50%)",t.style.zIndex="3000",document.body.appendChild(t),window.addEventListener("beforeinstallprompt",s=>{s.preventDefault(),o=s,t.style.display="block"}),t.addEventListener("click",async()=>{if(o){o.prompt();const{outcome:s}=await o.userChoice;s==="accepted"&&(t.style.display="none"),o=null}}),window.addEventListener("appinstalled",()=>{t.style.display="none"});function i(){const s=document.createElement("button");s.textContent="🔍 Diagnóstico PWA",s.style.cssText=`
      position: fixed;
      top: 10px;
      right: 10px;
      background: #007bff;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 5px;
      cursor: pointer;
      z-index: 1000;
      font-size: 12px;
    `,s.onclick=async()=>{const n=[];if("serviceWorker"in navigator){n.push("✅ Service Worker soportado");try{const f=await navigator.serviceWorker.getRegistration();f?(n.push("✅ Service Worker registrado"),n.push(`📍 Scope: ${f.scope}`),n.push(`📍 State: ${f.active?f.active.state:"No activo"}`)):n.push("❌ Service Worker NO registrado")}catch(f){n.push("❌ Error verificando Service Worker: "+f.message)}}else n.push("❌ Service Worker NO soportado");const a=document.querySelector('link[rel="manifest"]');if(a){n.push("✅ Manifest link encontrado"),n.push(`📍 Manifest URL: ${a.href}`);try{const b=await(await fetch(a.href)).json();n.push("✅ Manifest cargado correctamente"),n.push(`📍 App name: ${b.name}`),n.push(`📍 Icons: ${b.icons.length} iconos`)}catch(f){n.push("❌ Error cargando manifest: "+f.message)}}else n.push("❌ Manifest link NO encontrado");location.protocol==="https:"||location.hostname==="localhost"?n.push("✅ Protocolo seguro (HTTPS/localhost)"):n.push("❌ PWA requiere HTTPS o localhost"),window.matchMedia("(display-mode: standalone)").matches?n.push("✅ PWA ya está instalada"):n.push("⚠️ PWA no está instalada aún");const d=document.querySelector('meta[name="theme-color"]'),u=document.querySelector('meta[name="viewport"]');d?n.push("✅ Theme color configurado"):n.push("❌ Theme color faltante"),u?n.push("✅ Viewport configurado"):n.push("❌ Viewport faltante"),alert(`🔍 DIAGNÓSTICO PWA:

`+n.join(`
`))},document.body.appendChild(s)}i()});
