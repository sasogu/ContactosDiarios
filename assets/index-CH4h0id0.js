(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const d of n.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&a(d)}).observe(document,{childList:!0,subtree:!0});function c(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(s){if(s.ep)return;s.ep=!0;const n=c(s);fetch(s.href,n)}})();const P="0.0.56";(function(){try{const t=localStorage.getItem("app_version");if(t&&t!==P){const c=localStorage.getItem("contactos_diarios"),a=localStorage.getItem("contactos_diarios_backups"),s=localStorage.getItem("contactos_diarios_backup_fecha"),n=localStorage.getItem("contactos_diarios_webdav_config");["app_version","contactos_diarios","contactos_diarios_backups","contactos_diarios_backup_fecha","contactos_diarios_webdav_config"].forEach(p=>{p!=="contactos_diarios"&&localStorage.removeItem(p)}),"caches"in window&&caches.keys().then(p=>{p.forEach(b=>{(b.includes("contactosdiarios")||b.includes("contactos-diarios"))&&caches.delete(b)})}),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(p=>{p.forEach(b=>{b.scope.includes(window.location.origin)&&b.unregister()})}),c&&localStorage.setItem("contactos_diarios",c),a&&localStorage.setItem("contactos_diarios_backups",a),s&&localStorage.setItem("contactos_diarios_backup_fecha",s),n&&localStorage.setItem("contactos_diarios_webdav_config",n),location.reload()}localStorage.setItem("app_version",P)}catch{}})();function U({contacts:o,filter:t,onSelect:c,onDelete:a}){let s=t?o.filter(n=>{const d=t.toLowerCase(),p=n.notes?Object.values(n.notes).join(" ").toLowerCase():"";return n.tags?.some(b=>b.toLowerCase().includes(d))||n.name?.toLowerCase().includes(d)||n.surname?.toLowerCase().includes(d)||p.includes(d)}):o;return s=s.slice().sort((n,d)=>d.pinned&&!n.pinned?1:n.pinned&&!d.pinned?-1:(n.surname||"").localeCompare(d.surname||"")),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${t||""}" />
      <ul>
        ${s.length===0?'<li class="empty">Sin contactos</li>':s.map((n,d)=>`
          <li${n.pinned?' class="pinned"':""}>
            <div class="contact-main">
              <button class="select-contact" data-index="${o.indexOf(n)}">${n.surname?n.surname+", ":""}${n.name}</button>
              <span class="tags">${(n.tags||[]).map(p=>`<span class='tag'>${p}</span>`).join(" ")}</span>
              <button class="pin-contact" data-index="${o.indexOf(n)}" title="${n.pinned?"Desfijar":"Fijar"}">${n.pinned?"📌":"📍"}</button>
            </div>
            <div class="contact-info">
              ${n.phone?`<a href="tel:${n.phone}" class="contact-link" title="Llamar"><span>📞</span> ${n.phone}</a>`:""}
              ${n.email?`<a href="mailto:${n.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${n.email}</a>`:""}
            </div>
            <button class="add-note-contact" data-index="${o.indexOf(n)}" title="Añadir nota">📝</button>
            <button class="edit-contact" data-index="${o.indexOf(n)}" title="Editar">✏️</button>
            <button class="delete-contact" data-index="${o.indexOf(n)}" title="Eliminar">🗑️</button>
          </li>
        `).join("")}
      </ul>
    </div>
  `}function G({contact:o}){return`
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
  `}function K({notes:o}){if(!B())return`
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
        ${Object.entries(o||{}).sort((s,n)=>n[0].localeCompare(s[0])).map(([s,n])=>`
          <li>
            <b>${s}</b>:
            <span class="note-content" data-date="${s}">${n}</span>
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
  `}function W({}){return`
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
  `}function H({contacts:o,visible:t,page:c=1}){let a=[];o.forEach((h,v)=>{h.notes&&Object.entries(h.notes).forEach(([y,E])=>{a.push({date:y,text:E,contact:h,contactIndex:v})})}),a.sort((h,v)=>v.date.localeCompare(h.date));const s=4,n=Math.max(1,Math.ceil(a.length/s)),d=Math.min(Math.max(c,1),n),p=(d-1)*s,b=a.slice(p,p+s);return`
    <div id="all-notes-modal" class="modal" style="display:${t?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${a.length===0?"<li>No hay notas registradas.</li>":b.map(h=>`
            <li>
              <b>${h.date}</b> — <span style="color:#3a4a7c">${h.contact.surname?h.contact.surname+", ":""}${h.contact.name}</span><br/>
              <span>${h.text}</span>
              <a href="#" class="edit-note-link" data-contact="${h.contactIndex}" data-date="${h.date}" style="margin-left:0.5em;color:#646cff;font-size:0.95em;">Editar nota</a>
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
  `}function Y({visible:o,backups:t}){return`
    <div id="backup-modal" class="modal" style="display:${o?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:400px;">
        <h3>Restaurar copia local</h3>
        <div class="backup-btns" style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;">
          ${t.length===0?"<span>Sin copias locales.</span>":t.map(c=>`
            <div class="backup-btn-group" style="display:flex;align-items:center;gap:0.3rem;">
              <button class="restore-backup-btn" data-fecha="${c.fecha}">${c.fecha}</button>
              <button class="share-backup-btn" data-fecha="${c.fecha}" title="Compartir backup" style="background:#06b6d4;padding:0.4rem 0.7rem;font-size:1.1em;">📤</button>
            </div>
          `).join("")}
        </div>
        <div class="form-actions" style="margin-top:1.2rem;"><button id="close-backup-modal">Cerrar</button></div>
      </div>
    </div>
  `}function Z({visible:o,contactIndex:t}){const c=t!==null?e.contacts[t]:null,a=new Date,n=new Date(a.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);return`
    <div id="add-note-modal" class="modal" style="display:${o?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:500px;">
        <h3>Añadir nota diaria</h3>
        ${c?`<p><strong>${c.surname?c.surname+", ":""}${c.name}</strong></p>`:""}
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
  `}const T="contactos_diarios";let e={contacts:X(),selected:null,notes:"",editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1,showAddNoteModal:!1,addNoteContactIndex:null,allNotesPage:1,duplicates:[],showDuplicateModal:!1,showAuthModal:!1,authMode:"login"};function X(){try{return JSON.parse(localStorage.getItem(T))||[]}catch{return[]}}function N(o){localStorage.setItem(T,JSON.stringify(o))}function m(){const o=document.querySelector("#app"),t=e.editing!==null?e.contacts[e.editing]:null,c=e.selected!==null?e.contacts[e.selected].notes||{}:{};o.innerHTML=`
    <h1>Diario de Contactos</h1>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <button id="manage-duplicates-btn" style="background:#dc3545;color:#fff;margin:0 10px 1.2rem 0;">🔍 Gestionar duplicados</button>
    <button id="validate-contacts-btn" style="background:#28a745;color:#fff;margin:0 10px 1.2rem 0;">✅ Validar contactos</button>
    <div class="main-grid">
      <div>
        <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
        ${W({})}
        ${U({contacts:e.contacts,filter:e.tagFilter})}
        <button id="show-backup-modal" class="add-btn" style="width:100%;margin-top:0.7rem;background:#06b6d4;">Restaurar copia local</button>
      </div>
      <div>
        ${e.editing!==null?G({contact:t}):""}
        ${e.selected!==null&&e.editing===null?K({notes:c}):""}
      </div>
    </div>
    ${H({contacts:e.contacts,visible:e.showAllNotes,page:e.allNotesPage})}
    ${Y({visible:e.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})} <!-- Modal de backup -->
    ${Z({visible:e.showAddNoteModal,contactIndex:e.addNoteContactIndex})} <!-- Modal añadir nota -->
    ${re({duplicates:e.duplicates,visible:e.showDuplicateModal})} <!-- Modal de gestión de duplicados -->
    ${ge({visible:e.showAuthModal,mode:e.authMode})} <!-- Modal de autenticación -->
  `,Q();const a=document.getElementById("show-backup-modal");a&&(a.onclick=()=>{e.showBackupModal=!0,m()});const s=document.getElementById("close-backup-modal");s&&(s.onclick=()=>{e.showBackupModal=!1,m()}),document.querySelectorAll(".add-note-contact").forEach(p=>{p.onclick=b=>{if(!B()){j()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m();return}e.addNoteContactIndex=Number(p.dataset.index),e.showAddNoteModal=!0,m()}});const n=document.getElementById("cancel-add-note");n&&(n.onclick=()=>{e.showAddNoteModal=!1,e.addNoteContactIndex=null,m()}),document.querySelectorAll(".restore-backup-btn").forEach(p=>{p.onclick=()=>ce(p.dataset.fecha)});const d=document.getElementById("restore-local-backup");d&&(d.onclick=restaurarBackupLocal)}let F=null;function Q(){const o=document.getElementById("tag-filter");o&&o.addEventListener("input",l=>{clearTimeout(F),F=setTimeout(()=>{e.tagFilter=o.value,m();const i=document.getElementById("tag-filter");i&&(i.value=e.tagFilter,i.focus(),i.setSelectionRange(e.tagFilter.length,e.tagFilter.length))},300)});const t=document.getElementById("add-contact");t&&(t.onclick=()=>{e.editing=null,e.selected=null,m(),e.editing=e.contacts.length,m()}),document.querySelectorAll(".select-contact").forEach(l=>{l.onclick=i=>{e.selected=Number(l.dataset.index),e.editing=null,m()}}),document.querySelectorAll(".edit-contact").forEach(l=>{l.onclick=i=>{e.editing=Number(l.dataset.index),e.selected=null,m()}}),document.querySelectorAll(".delete-contact").forEach(l=>{l.onclick=i=>{const r=Number(l.dataset.index),u=e.contacts[r],f=u.surname?`${u.surname}, ${u.name}`:u.name;confirm(`¿Estás seguro de eliminar el contacto "${f}"?

Esta acción no se puede deshacer.`)&&(e.contacts.splice(r,1),N(e.contacts),g("Contacto eliminado correctamente","success"),e.selected=null,m())}}),document.querySelectorAll(".pin-contact").forEach(l=>{l.onclick=i=>{const r=Number(l.dataset.index);e.contacts[r].pinned&&!confirm("¿Seguro que quieres desfijar este contacto?")||(e.contacts[r].pinned=!e.contacts[r].pinned,N(e.contacts),m())}});const c=document.getElementById("contact-form");c&&(c.onsubmit=l=>{l.preventDefault();const i=Object.fromEntries(new FormData(c)),r=A(i);if(r.length>0){g("Error de validación: "+r.join(", "),"error");return}let u=i.tags?i.tags.split(",").map(k=>k.trim()).filter(Boolean):[];delete i.tags;const f={...i};e.contacts.some((k,$)=>e.editing!==null&&$===e.editing?!1:V(k,f))&&!confirm("Ya existe un contacto similar. ¿Deseas guardarlo de todas formas?")||(e.editing!==null&&e.editing<e.contacts.length?(e.contacts[e.editing]={...e.contacts[e.editing],...i,tags:u},g("Contacto actualizado correctamente","success")):(e.contacts.push({...i,notes:{},tags:u}),g("Contacto añadido correctamente","success")),N(e.contacts),e.editing=null,m())},document.getElementById("cancel-edit").onclick=()=>{e.editing=null,m()});const a=document.getElementById("add-note-form");a&&e.addNoteContactIndex!==null&&(a.onsubmit=l=>{l.preventDefault();const i=document.getElementById("add-note-date").value,r=document.getElementById("add-note-text").value.trim();if(!i||!r){g("Por favor, selecciona una fecha y escribe una nota","warning");return}const u=D(r);if(u.length>0){g("Error en la nota: "+u.join(", "),"error");return}const f=e.addNoteContactIndex;e.contacts[f].notes||(e.contacts[f].notes={}),e.contacts[f].notes[i]?e.contacts[f].notes[i]+=`
`+r:e.contacts[f].notes[i]=r,N(e.contacts),g("Nota añadida correctamente","success"),e.showAddNoteModal=!1,e.addNoteContactIndex=null,m()});const s=document.getElementById("note-form");s&&e.selected!==null&&(s.onsubmit=l=>{l.preventDefault();const i=document.getElementById("note-date").value,r=document.getElementById("note-text").value.trim();if(!i||!r){g("Por favor, selecciona una fecha y escribe una nota","warning");return}const u=D(r);if(u.length>0){g("Error en la nota: "+u.join(", "),"error");return}e.contacts[e.selected].notes||(e.contacts[e.selected].notes={}),e.contacts[e.selected].notes[i]?e.contacts[e.selected].notes[i]+=`
`+r:e.contacts[e.selected].notes[i]=r,N(e.contacts),g("Nota guardada correctamente","success"),document.getElementById("note-text").value="",m()}),document.querySelectorAll(".edit-note").forEach(l=>{l.onclick=i=>{const r=l.dataset.date,u=document.getElementById("edit-note-modal"),f=document.getElementById("edit-note-text");f.value=e.contacts[e.selected].notes[r],u.style.display="block",document.getElementById("save-edit-note").onclick=()=>{const w=f.value.trim(),k=D(w);if(k.length>0){g("Error en la nota: "+k.join(", "),"error");return}e.contacts[e.selected].notes[r]=w,N(e.contacts),g("Nota actualizada correctamente","success"),u.style.display="none",m()},document.getElementById("cancel-edit-note").onclick=()=>{u.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(l=>{l.onclick=i=>{const r=l.dataset.date;confirm(`¿Estás seguro de eliminar la nota del ${r}?

Esta acción no se puede deshacer.`)&&(delete e.contacts[e.selected].notes[r],N(e.contacts),g("Nota eliminada correctamente","success"),m())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{ne(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{ae(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{se(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async l=>{const i=l.target.files[0];if(!i)return;const r=await i.text();let u=[];if(i.name.endsWith(".vcf"))u=ee(r);else if(i.name.endsWith(".csv"))u=oe(r);else if(i.name.endsWith(".json"))try{const f=JSON.parse(r);Array.isArray(f)?u=f:f&&Array.isArray(f.contacts)&&(u=f.contacts)}catch{}if(u.length){const f=[],w=[];if(u.forEach((x,S)=>{const q=A(x);q.length===0?f.push(x):w.push({index:S+1,errors:q})}),w.length>0){const x=w.map(S=>`Contacto ${S.index}: ${S.errors.join(", ")}`).join(`
`);if(!confirm(`Se encontraron ${w.length} contacto(s) con errores:

${x}

¿Deseas importar solo los contactos válidos (${f.length})?`))return}const k=x=>e.contacts.some(S=>S.name===x.name&&S.surname===x.surname&&S.phone===x.phone),$=f.filter(x=>!k(x));$.length?(e.contacts=e.contacts.concat($),N(e.contacts),g(`${$.length} contacto(s) importado(s) correctamente`,"success"),m()):g("No se han importado contactos nuevos (todos ya existen)","info")}else g("No se pudieron importar contactos del archivo seleccionado","error")};const n=document.getElementById("close-all-notes");n&&(n.onclick=()=>{e.showAllNotes=!1,e.allNotesPage=1,m()});const d=document.getElementById("show-all-notes-btn");d&&(d.onclick=()=>{if(!B()){j()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m();return}e.showAllNotes=!0,e.allNotesPage=1,m()});const p=document.getElementById("prev-notes-page");p&&(p.onclick=()=>{e.allNotesPage>1&&(e.allNotesPage--,m())});const b=document.getElementById("next-notes-page");b&&(b.onclick=()=>{let l=[];e.contacts.forEach((r,u)=>{r.notes&&Object.entries(r.notes).forEach(([f,w])=>{l.push({date:f,text:w,contact:r,contactIndex:u})})});const i=Math.max(1,Math.ceil(l.length/4));e.allNotesPage<i&&(e.allNotesPage++,m())}),document.querySelectorAll(".edit-note-link").forEach(l=>{l.onclick=i=>{i.preventDefault();const r=Number(l.dataset.contact),u=l.dataset.date;e.selected=r,e.editing=null,e.showAllNotes=!1,m(),setTimeout(()=>{const f=document.querySelector(`.edit-note[data-date="${u}"]`);f&&f.click()},50)}}),document.querySelectorAll(".share-backup-btn").forEach(l=>{l.onclick=async()=>{const i=l.dataset.fecha,u=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(x=>x.fecha===i);if(!u)return alert("No se encontró la copia seleccionada.");const f=`contactos_backup_${i}.json`,w=JSON.stringify(u.datos,null,2),k=new Blob([w],{type:"application/json"}),$=document.createElement("a");if($.href=URL.createObjectURL(k),$.download=f,$.style.display="none",document.body.appendChild($),$.click(),setTimeout(()=>{URL.revokeObjectURL($.href),$.remove()},1e3),navigator.canShare&&window.File&&window.FileReader)try{const x=new File([k],f,{type:"application/json"});navigator.canShare({files:[x]})&&await navigator.share({files:[x],title:"Backup de Contactos",text:`Copia de seguridad (${i}) de ContactosDiarios`})}catch{}}});const h=document.getElementById("manage-duplicates-btn");h&&(h.onclick=()=>{e.duplicates=ie(),e.duplicates.length===0?g("No se encontraron contactos duplicados","info"):(e.showDuplicateModal=!0,m())});const v=document.getElementById("validate-contacts-btn");v&&(v.onclick=()=>{const l=[];if(e.contacts.forEach((i,r)=>{const u=A(i);if(u.length>0){const f=i.surname?`${i.surname}, ${i.name}`:i.name;l.push({index:r+1,name:f,errors:u})}}),l.length===0)g(`✅ Todos los ${e.contacts.length} contactos son válidos`,"success");else{const i=l.map(r=>`${r.index}. ${r.name}: ${r.errors.join(", ")}`).join(`
`);g(`⚠️ Se encontraron ${l.length} contacto(s) con errores`,"warning"),console.log("Contactos con errores de validación:",l),confirm(`Se encontraron ${l.length} contacto(s) con errores de validación:

${i}

¿Deseas ver más detalles en la consola del navegador?`)&&console.table(l)}});const y=document.getElementById("cancel-duplicate-resolution");y&&(y.onclick=()=>{e.showDuplicateModal=!1,e.duplicates=[],m()});const E=document.getElementById("apply-resolution");E&&(E.onclick=de),document.querySelectorAll('input[name^="resolution-"]').forEach(l=>{l.addEventListener("change",()=>{const i=l.name.split("-")[1],r=document.getElementById(`merge-section-${i}`),u=document.getElementById(`individual-section-${i}`);l.value==="merge"?(r.style.display="block",u.style.display="none"):l.value==="select"?(r.style.display="none",u.style.display="block"):(r.style.display="none",u.style.display="none")})}),document.querySelectorAll('.resolution-option input[type="radio"]').forEach(l=>{l.addEventListener("change",()=>{const i=l.name;document.querySelectorAll(`input[name="${i}"]`).forEach(r=>{r.closest(".resolution-option").classList.remove("selected")}),l.closest(".resolution-option").classList.add("selected")})});const C=document.getElementById("unlock-notes-btn");C&&(C.onclick=()=>{j()?e.authMode="login":e.authMode="setup",e.showAuthModal=!0,m()});const L=document.getElementById("logout-btn");L&&(L.onclick=()=>{fe(),m()});const _=document.getElementById("auth-form");_&&(_.onsubmit=l=>{l.preventDefault();const i=document.getElementById("auth-password").value;if(e.authMode==="setup"){const r=document.getElementById("auth-password-confirm").value;if(i!==r){g("Las contraseñas no coinciden","error");return}if(i.length<4){g("La contraseña debe tener al menos 4 caracteres","warning");return}ue(i),I.isAuthenticated=!0,I.sessionExpiry=Date.now()+30*60*1e3,e.showAuthModal=!1,m()}else me(i)&&(e.showAuthModal=!1,m())});const O=document.getElementById("cancel-auth");O&&(O.onclick=()=>{e.showAuthModal=!1,m()})}function ee(o){const t=[],c=o.split("END:VCARD");for(const a of c){const s=/FN:([^\n]*)/.exec(a)?.[1]?.trim(),n=/N:.*;([^;\n]*)/.exec(a)?.[1]?.trim()||"",d=/TEL.*:(.+)/.exec(a)?.[1]?.trim(),p=/EMAIL.*:(.+)/.exec(a)?.[1]?.trim();s&&t.push({name:s,surname:n,phone:d||"",email:p||"",notes:{},tags:[]})}return t}function te(o){return o.map(t=>`BEGIN:VCARD
VERSION:3.0
FN:${t.name}
N:${t.surname||""};;;;
TEL:${t.phone||""}
EMAIL:${t.email||""}
END:VCARD`).join(`
`)}function oe(o){const t=o.split(`
`).filter(Boolean),[c,...a]=t;return a.map(s=>{const[n,d,p,b,h,v]=s.split(",");return{name:n?.trim()||"",surname:d?.trim()||"",phone:p?.trim()||"",email:b?.trim()||"",notes:v?JSON.parse(v):{},tags:h?h.split(";").map(y=>y.trim()):[]}})}function ne(){const o=te(e.contacts),t=new Blob([o],{type:"text/vcard"}),c=document.createElement("a");c.href=URL.createObjectURL(t),c.download="contactos.vcf",c.click()}function ae(){const o="name,surname,phone,email,tags,notes",t=e.contacts.map(n=>[n.name,n.surname,n.phone,n.email,(n.tags||[]).join(";"),JSON.stringify(n.notes||{})].map(d=>'"'+String(d).replace(/"/g,'""')+'"').join(",")),c=[o,...t].join(`
`),a=new Blob([c],{type:"text/csv"}),s=document.createElement("a");s.href=URL.createObjectURL(a),s.download="contactos.csv",s.click()}function se(){const o=new Blob([JSON.stringify(e.contacts,null,2)],{type:"application/json"}),t=document.createElement("a");t.href=URL.createObjectURL(o),t.download="contactos.json",t.click()}function R(){const o=new Date,c=new Date(o.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);let a=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");a.find(s=>s.fecha===c)||(a.push({fecha:c,datos:e.contacts}),a.length>10&&(a=a.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(a))),localStorage.setItem("contactos_diarios_backup_fecha",c)}setInterval(R,60*60*1e3);R();function ce(o){if(!confirm("¿Seguro que quieres restaurar la copia de seguridad del "+o+"? Se sobrescribirán los contactos actuales."))return;const c=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(a=>a.fecha===o);c?(e.contacts=c.datos,N(e.contacts),m(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}function V(o,t){const c=a=>a?a.toLowerCase().replace(/\s+/g," ").trim():"";return!!(c(o.name)===c(t.name)&&c(o.surname)===c(t.surname)||o.phone&&t.phone&&o.phone.replace(/\s+/g,"")===t.phone.replace(/\s+/g,"")||o.email&&t.email&&c(o.email)===c(t.email))}function ie(){const o=[],t=new Set;for(let c=0;c<e.contacts.length;c++){if(t.has(c))continue;const a=[{...e.contacts[c],originalIndex:c}];t.add(c);for(let s=c+1;s<e.contacts.length;s++)t.has(s)||V(e.contacts[c],e.contacts[s])&&(a.push({...e.contacts[s],originalIndex:s}),t.add(s));a.length>1&&o.push({contacts:a})}return o}function z(o){if(o.length===0)return null;if(o.length===1)return o[0];const t={name:"",surname:"",phone:"",email:"",tags:[],notes:{},pinned:!1};let c="",a="";o.forEach(n=>{n.name&&n.name.length>c.length&&(c=n.name),n.surname&&n.surname.length>a.length&&(a=n.surname)}),t.name=c,t.surname=a,t.phone=o.find(n=>n.phone)?.phone||"",t.email=o.find(n=>n.email)?.email||"";const s=new Set;return o.forEach(n=>{n.tags&&n.tags.forEach(d=>s.add(d))}),t.tags=Array.from(s),o.forEach((n,d)=>{n.notes&&Object.entries(n.notes).forEach(([p,b])=>{t.notes[p]?t.notes[p]+=`
--- Contacto ${d+1} ---
${b}`:t.notes[p]=b})}),t.pinned=o.some(n=>n.pinned),t}function le(o){const t=z(o);return`
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
            ${t.tags.map(c=>`<span class="tag">${c}</span>`).join("")}
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
        
        ${o.map((c,a)=>`
          <div class="duplicate-group" style="border:1px solid #ddd;border-radius:8px;padding:15px;margin:15px 0;background:#fafafa;">
            <h4>Grupo ${a+1} - ${c.contacts.length} contactos similares</h4>
            
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
              ${le(c.contacts)}
            </div>
            
            <!-- Sección de selección individual (oculta por defecto) -->
            <div class="individual-selection" id="individual-section-${a}" style="display:none;">
              <h5>Selecciona el contacto a mantener:</h5>
              ${c.contacts.map((s,n)=>`
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
  `}function de(){const o=[];let t=0;if(e.duplicates.forEach((n,d)=>{const p=document.querySelector(`input[name="resolution-${d}"]:checked`),b=p?p.value:"skip";if(b==="merge")o.push({type:"merge",groupIndex:d,contacts:n.contacts}),t++;else if(b==="select"){const h=document.querySelector(`input[name="keep-${d}"]:checked`);if(h){const v=parseInt(h.value),y=n.contacts.filter(E=>E.originalIndex!==v).map(E=>E.originalIndex);o.push({type:"delete",groupIndex:d,toDelete:y,toKeep:v}),t++}}}),t===0){g("No hay operaciones que realizar","info");return}const c=o.filter(n=>n.type==="merge").length,a=o.filter(n=>n.type==="delete").length;let s=`¿Confirmar las siguientes operaciones?

`;if(c>0&&(s+=`🔗 Fusionar ${c} grupo(s) de contactos
`),a>0&&(s+=`🗑️ Eliminar duplicados en ${a} grupo(s)
`),s+=`
Esta acción no se puede deshacer.`,!confirm(s)){g("Operación cancelada","info");return}try{let n=0,d=0;const p=[];o.forEach(y=>{if(y.type==="merge"){const E=z(y.contacts);e.contacts.push(E),y.contacts.forEach(C=>{p.push(C.originalIndex)}),n++}else y.type==="delete"&&(y.toDelete.forEach(E=>{p.push(E)}),d+=y.toDelete.length)}),[...new Set(p)].sort((y,E)=>E-y).forEach(y=>{y<e.contacts.length&&e.contacts.splice(y,1)}),N(e.contacts);let h="Resolución completada: ";const v=[];n>0&&v.push(`${n} contacto(s) fusionado(s)`),d>0&&v.push(`${d} duplicado(s) eliminado(s)`),h+=v.join(" y "),g(h,"success"),e.showDuplicateModal=!1,e.duplicates=[],m()}catch(n){g("Error al aplicar resolución: "+n.message,"error")}}const M="contactos_diarios_auth";let I={isAuthenticated:!1,sessionExpiry:null};function J(o){let t=0;for(let c=0;c<o.length;c++){const a=o.charCodeAt(c);t=(t<<5)-t+a,t=t&t}return t.toString()}function ue(o){const t=J(o);localStorage.setItem(M,t),g("Contraseña establecida correctamente","success")}function pe(o){const t=localStorage.getItem(M);return t?J(o)===t:!1}function j(){return localStorage.getItem(M)!==null}function me(o){return pe(o)?(I.isAuthenticated=!0,I.sessionExpiry=Date.now()+30*60*1e3,g("Autenticación exitosa","success"),!0):(g("Contraseña incorrecta","error"),!1)}function B(){return I.isAuthenticated?Date.now()>I.sessionExpiry?(I.isAuthenticated=!1,I.sessionExpiry=null,!1):!0:!1}function fe(){I.isAuthenticated=!1,I.sessionExpiry=null,g("Sesión cerrada","info")}function ge({visible:o,mode:t="login"}){return`
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
  `}function g(o,t="info"){const c=document.querySelector(".notification");c&&c.remove();const a=document.createElement("div");switch(a.className=`notification ${t}`,a.textContent=o,a.style.cssText=`
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
  `,t){case"success":a.style.background="#d4edda",a.style.color="#155724",a.style.border="1px solid #c3e6cb";break;case"error":a.style.background="#f8d7da",a.style.color="#721c24",a.style.border="1px solid #f5c6cb";break;case"warning":a.style.background="#fff3cd",a.style.color="#856404",a.style.border="1px solid #ffeaa7";break;default:a.style.background="#d1ecf1",a.style.color="#0c5460",a.style.border="1px solid #bee5eb"}document.body.appendChild(a),setTimeout(()=>{a.parentNode&&(a.style.animation="slideOutNotification 0.3s ease-in forwards",setTimeout(()=>a.remove(),300))},4e3)}function A(o){const t=[];return(!o.name||o.name.trim().length===0)&&t.push("El nombre es obligatorio"),(!o.surname||o.surname.trim().length===0)&&t.push("Los apellidos son obligatorios"),o.phone&&!/^[0-9+\-() ]+$/.test(o.phone)&&t.push("El teléfono contiene caracteres no válidos"),o.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.email)&&t.push("El formato del email no es válido"),t}function D(o){return!o||o.trim().length===0?["La nota no puede estar vacía"]:o.trim().length>500?["La nota no puede superar los 500 caracteres"]:[]}document.addEventListener("DOMContentLoaded",()=>{m();let o=null;const t=document.createElement("button");t.textContent="📲 Instalar en tu dispositivo",t.className="add-btn",t.style.display="none",t.style.position="fixed",t.style.bottom="1.5rem",t.style.left="50%",t.style.transform="translateX(-50%)",t.style.zIndex="3000",document.body.appendChild(t),window.addEventListener("beforeinstallprompt",c=>{c.preventDefault(),o=c,t.style.display="block"}),t.addEventListener("click",async()=>{if(o){o.prompt();const{outcome:c}=await o.userChoice;c==="accepted"&&(t.style.display="none"),o=null}}),window.addEventListener("appinstalled",()=>{t.style.display="none"})});
