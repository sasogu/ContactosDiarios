(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const d of o.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function i(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(a){if(a.ep)return;a.ep=!0;const o=i(a);fetch(a.href,o)}})();const k="0.0.48";function y(t,n="info",i=3e3){let s=document.getElementById("notifications-container");s||(s=document.createElement("div"),s.id="notifications-container",s.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    `,document.body.appendChild(s));const a=document.createElement("div"),o={success:"✅",error:"❌",warning:"⚠️",info:"ℹ️"},d={success:"#10b981",error:"#ef4444",warning:"#f59e0b",info:"#3b82f6"};a.innerHTML=`
    <div style="display: flex; align-items: center; gap: 8px;">
      <span>${o[n]}</span>
      <span style="flex: 1;">${t}</span>
      <button onclick="this.parentElement.parentElement.remove()" style="background:none;border:none;color:white;cursor:pointer;">&times;</button>
    </div>
  `,a.style.cssText=`
    background: ${d[n]};
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideInNotification 0.3s ease-out;
    margin-bottom: 8px;
  `,s.appendChild(a),setTimeout(()=>{a.parentElement&&(a.style.animation="slideOutNotification 0.3s ease-in",setTimeout(()=>a.remove(),300))},i)}function B(t){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)}function C(t){return/^[\+]?[0-9\-\(\)\s]{6,20}$/.test(t.replace(/\s/g,""))}function O(t){return t?.toString().trim().replace(/[<>]/g,"")||""}function L(t){const n=[],i=[];return!t.name||!t.name.trim()?n.push("El nombre es obligatorio"):t.name.trim().length<2&&n.push("El nombre debe tener al menos 2 caracteres"),!t.surname||!t.surname.trim()?n.push("Los apellidos son obligatorios"):t.surname.trim().length<2&&n.push("Los apellidos deben tener al menos 2 caracteres"),t.email&&t.email.trim()&&!B(t.email.trim())&&n.push("El formato del email no es válido"),t.phone&&t.phone.trim()&&!C(t.phone.trim())&&n.push("El formato del teléfono no es válido"),(!t.email||!t.email.trim())&&(!t.phone||!t.phone.trim())&&i.push("Se recomienda añadir al menos un email o teléfono"),{errors:n,warnings:i,isValid:n.length===0}}function N(t){const n=[];return t.date||n.push("La fecha es obligatoria"),!t.text||!t.text.trim()?n.push("El texto de la nota es obligatorio"):t.text.trim().length<3&&n.push("La nota debe tener al menos 3 caracteres"),{errors:n,isValid:n.length===0}}function I(t,n,i=null){return t.some((s,a)=>{if(i!==null&&a===i)return!1;const o=s.name?.toLowerCase().trim()===n.name?.toLowerCase().trim(),d=s.surname?.toLowerCase().trim()===n.surname?.toLowerCase().trim(),g=s.phone?.trim()&&n.phone?.trim()&&s.phone.trim()===n.phone.trim();return o&&d||g})}(function(){try{const n=localStorage.getItem("app_version");if(n&&n!==k){const i=localStorage.getItem("contactos_diarios");Object.keys(localStorage).forEach(s=>{s!=="contactos_diarios"&&localStorage.removeItem(s)}),"caches"in window&&caches.keys().then(s=>s.forEach(a=>caches.delete(a))),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(s=>s.forEach(a=>a.unregister())),i&&localStorage.setItem("contactos_diarios",i),location.reload()}localStorage.setItem("app_version",k)}catch{}})();function A({contacts:t,filter:n,onSelect:i,onDelete:s}){let a=n?t.filter(o=>{const d=n.toLowerCase(),g=o.notes?Object.values(o.notes).join(" ").toLowerCase():"";return o.tags?.some(v=>v.toLowerCase().includes(d))||o.name?.toLowerCase().includes(d)||o.surname?.toLowerCase().includes(d)||g.includes(d)}):t;return a=a.slice().sort((o,d)=>d.pinned&&!o.pinned?1:o.pinned&&!d.pinned?-1:(o.surname||"").localeCompare(d.surname||"")),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${n||""}" />
      <ul>
        ${a.length===0?'<li class="empty">Sin contactos</li>':a.map((o,d)=>`
          <li${o.pinned?' class="pinned"':""}>
            <div class="contact-main">
              <button class="select-contact" data-index="${t.indexOf(o)}">${o.surname?o.surname+", ":""}${o.name}</button>
              <span class="tags">${(o.tags||[]).map(g=>`<span class='tag'>${g}</span>`).join(" ")}</span>
              <button class="pin-contact" data-index="${t.indexOf(o)}" title="${o.pinned?"Desfijar":"Fijar"}">${o.pinned?"📌":"📍"}</button>
            </div>
            <div class="contact-info">
              ${o.phone?`<a href="tel:${o.phone}" class="contact-link" title="Llamar"><span>📞</span> ${o.phone}</a>`:""}
              ${o.email?`<a href="mailto:${o.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${o.email}</a>`:""}
            </div>
            <button class="add-note-contact" data-index="${t.indexOf(o)}" title="Añadir nota">📝</button>
            <button class="edit-contact" data-index="${t.indexOf(o)}" title="Editar">✏️</button>
            <button class="delete-contact" data-index="${t.indexOf(o)}" title="Eliminar">🗑️</button>
          </li>
        `).join("")}
      </ul>
    </div>
  `}function j({contact:t}){return`
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
  `}function M({notes:t}){const n=new Date;return`
    <div class="notes-area">
      <h3>Notas diarias</h3>
      <form id="note-form">
        <input type="date" id="note-date" value="${new Date(n.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10)}" required />
        <textarea id="note-text" rows="3" placeholder="Escribe una nota para la fecha seleccionada..."></textarea>
        <button type="submit">Guardar nota</button>
      </form>
      <ul class="note-history">
        ${Object.entries(t||{}).sort((a,o)=>o[0].localeCompare(a[0])).map(([a,o])=>`
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
  `}function q({}){return`
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
  `}function P({contacts:t,visible:n,page:i=1}){let s=[];t.forEach((c,l)=>{c.notes&&Object.entries(c.notes).forEach(([r,u])=>{s.push({date:r,text:u,contact:c,contactIndex:l})})}),s.sort((c,l)=>l.date.localeCompare(c.date));const a=4,o=Math.max(1,Math.ceil(s.length/a)),d=Math.min(Math.max(i,1),o),g=(d-1)*a,v=s.slice(g,g+a);return`
    <div id="all-notes-modal" class="modal" style="display:${n?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${s.length===0?"<li>No hay notas registradas.</li>":v.map(c=>`
            <li>
              <b>${c.date}</b> — <span style="color:#3a4a7c">${c.contact.surname?c.contact.surname+", ":""}${c.contact.name}</span><br/>
              <span>${c.text}</span>
              <a href="#" class="edit-note-link" data-contact="${c.contactIndex}" data-date="${c.date}" style="margin-left:0.5em;color:#646cff;font-size:0.95em;">Editar nota</a>
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
  `}function R({visible:t,backups:n}){return`
    <div id="backup-modal" class="modal" style="display:${t?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:400px;">
        <h3>Restaurar copia local</h3>
        <div class="backup-btns" style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;">
          ${n.length===0?"<span>Sin copias locales.</span>":n.map(i=>`
            <div class="backup-btn-group" style="display:flex;align-items:center;gap:0.3rem;">
              <button class="restore-backup-btn" data-fecha="${i.fecha}">${i.fecha}</button>
              <button class="share-backup-btn" data-fecha="${i.fecha}" title="Compartir backup" style="background:#06b6d4;padding:0.4rem 0.7rem;font-size:1.1em;">📤</button>
            </div>
          `).join("")}
        </div>
        <div class="form-actions" style="margin-top:1.2rem;"><button id="close-backup-modal">Cerrar</button></div>
      </div>
    </div>
  `}function _({visible:t,contactIndex:n}){const i=n!==null?e.contacts[n]:null,s=new Date,o=new Date(s.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);return`
    <div id="add-note-modal" class="modal" style="display:${t?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:500px;">
        <h3>Añadir nota diaria</h3>
        ${i?`<p><strong>${i.surname?i.surname+", ":""}${i.name}</strong></p>`:""}
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
  `}const $="contactos_diarios";let e={contacts:F(),selected:null,editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1,showAddNoteModal:!1,addNoteContactIndex:null,allNotesPage:1};function F(){try{return JSON.parse(localStorage.getItem($))||[]}catch{return[]}}function x(t){localStorage.setItem($,JSON.stringify(t))}function m(){const t=document.querySelector("#app"),n=e.editing!==null?e.contacts[e.editing]:null,i=e.selected!==null?e.contacts[e.selected].notes||{}:{};t.innerHTML=`
    <h1>Diario de Contactos</h1>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <div class="main-grid">
      <div>
        <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
        ${q({})}
        ${A({contacts:e.contacts,filter:e.tagFilter})}
        <button id="show-backup-modal" class="add-btn" style="width:100%;margin-top:0.7rem;background:#06b6d4;">Restaurar copia local</button>
      </div>
      <div>
        ${e.editing!==null?j({contact:n}):""}
        ${e.selected!==null&&e.editing===null?M({notes:i}):""}
      </div>
    </div>
    ${P({contacts:e.contacts,visible:e.showAllNotes,page:e.allNotesPage})}
    ${R({visible:e.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})} <!-- Modal de backup -->
    ${_({visible:e.showAddNoteModal,contactIndex:e.addNoteContactIndex})} <!-- Modal añadir nota -->
  `,V();const s=document.getElementById("show-backup-modal");s&&(s.onclick=()=>{e.showBackupModal=!0,m()});const a=document.getElementById("close-backup-modal");a&&(a.onclick=()=>{e.showBackupModal=!1,m()}),document.querySelectorAll(".add-note-contact").forEach(g=>{g.onclick=v=>{e.addNoteContactIndex=Number(g.dataset.index),e.showAddNoteModal=!0,m()}});const o=document.getElementById("cancel-add-note");o&&(o.onclick=()=>{e.showAddNoteModal=!1,e.addNoteContactIndex=null,m()}),document.querySelectorAll(".restore-backup-btn").forEach(g=>{g.onclick=()=>W(g.dataset.fecha)});const d=document.getElementById("restore-local-backup");d&&(d.onclick=restaurarBackupLocal)}let w=null;function V(){const t=document.getElementById("tag-filter");t&&t.addEventListener("input",c=>{clearTimeout(w),w=setTimeout(()=>{e.tagFilter=t.value,m();const l=document.getElementById("tag-filter");l&&(l.value=e.tagFilter,l.focus(),l.setSelectionRange(e.tagFilter.length,e.tagFilter.length))},300)});const n=document.getElementById("add-contact");n&&(n.onclick=()=>{e.editing=null,e.selected=null,m(),e.editing=e.contacts.length,m()}),document.querySelectorAll(".select-contact").forEach(c=>{c.onclick=l=>{e.selected=Number(c.dataset.index),e.editing=null,m()}}),document.querySelectorAll(".edit-contact").forEach(c=>{c.onclick=l=>{e.editing=Number(c.dataset.index),e.selected=null,m()}}),document.querySelectorAll(".delete-contact").forEach(c=>{c.onclick=l=>{confirm("¿Eliminar este contacto?")&&(e.contacts.splice(Number(c.dataset.index),1),x(e.contacts),e.selected=null,m())}}),document.querySelectorAll(".pin-contact").forEach(c=>{c.onclick=l=>{const r=Number(c.dataset.index);e.contacts[r].pinned&&!confirm("¿Seguro que quieres desfijar este contacto?")||(e.contacts[r].pinned=!e.contacts[r].pinned,x(e.contacts),m())}});const i=document.getElementById("contact-form");i&&(i.onsubmit=c=>{c.preventDefault();const l=Object.fromEntries(new FormData(i));Object.keys(l).forEach(f=>{l[f]=O(l[f])});let r=l.tags?l.tags.split(",").map(f=>f.trim()).filter(Boolean):[];delete l.tags;const{errors:u,warnings:p,isValid:h}=L({...l});if(!h){u.forEach(f=>y(f,"error"));return}const b={...l,tags:r};if(e.editing!==null&&e.editing<e.contacts.length){const f=e.editing;if(I(e.contacts,b,f)&&!confirm("Ya existe un contacto similar. ¿Quieres guardarlo de todas formas?")){y("Operación cancelada","info");return}e.contacts[f]={...e.contacts[f],...b},y("Contacto actualizado correctamente","success")}else{if(I(e.contacts,b)&&!confirm("Ya existe un contacto similar. ¿Quieres crearlo de todas formas?")){y("Operación cancelada","info");return}e.contacts.push({...b,notes:{}}),y("Contacto creado correctamente","success")}x(e.contacts),e.editing=null,m(),p.forEach(f=>y(f,"warning"))},document.getElementById("cancel-edit").onclick=()=>{e.editing=null,m()});const s=document.getElementById("add-note-form");s&&e.addNoteContactIndex!==null&&(s.onsubmit=c=>{c.preventDefault();const l=document.getElementById("add-note-date").value,r=document.getElementById("add-note-text").value.trim(),{errors:u,isValid:p}=N({date:l,text:r});if(!p){u.forEach(b=>y(b,"error"));return}if(!l||!r)return;const h=e.addNoteContactIndex;e.contacts[h].notes||(e.contacts[h].notes={}),e.contacts[h].notes[l]?e.contacts[h].notes[l]+=`
`+r:e.contacts[h].notes[l]=r,x(e.contacts),y("Nota añadida con éxito.","success"),e.showAddNoteModal=!1,e.addNoteContactIndex=null,m()});const a=document.getElementById("note-form");a&&e.selected!==null&&(a.onsubmit=c=>{c.preventDefault();const l=document.getElementById("note-date").value,r=document.getElementById("note-text").value.trim(),{errors:u,isValid:p}=N({date:l,text:r});if(!p){u.forEach(h=>y(h,"error"));return}if(!(!l||!r)){if(e.contacts[e.selected].notes||(e.contacts[e.selected].notes={}),e.contacts[e.selected].notes[l]){if(!confirm("Ya existe una nota para esta fecha. ¿Quieres añadir el texto a la nota existente?")){y("Operación cancelada","info");return}e.contacts[e.selected].notes[l]+=`
`+r}else e.contacts[e.selected].notes[l]=r;x(e.contacts),y("Nota guardada correctamente","success"),m()}}),document.querySelectorAll(".edit-note").forEach(c=>{c.onclick=l=>{const r=c.dataset.date,u=document.getElementById("edit-note-modal"),p=document.getElementById("edit-note-text");p.value=e.contacts[e.selected].notes[r],u.style.display="block",document.getElementById("save-edit-note").onclick=()=>{e.contacts[e.selected].notes[r]=p.value.trim(),x(e.contacts),u.style.display="none",m()},document.getElementById("cancel-edit-note").onclick=()=>{u.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(c=>{c.onclick=l=>{const r=c.dataset.date;confirm("¿Eliminar la nota de "+r+"?")&&(delete e.contacts[e.selected].notes[r],x(e.contacts),m())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{U(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{z(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{G(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async c=>{const l=c.target.files[0];if(!l)return;const r=await l.text();let u=[];if(l.name.endsWith(".vcf"))u=T(r);else if(l.name.endsWith(".csv"))u=J(r);else if(l.name.endsWith(".json"))try{const p=JSON.parse(r);Array.isArray(p)?u=p:p&&Array.isArray(p.contacts)&&(u=p.contacts)}catch{}if(u.length){const p=b=>e.contacts.some(f=>f.name===b.name&&f.surname===b.surname&&f.phone===b.phone),h=u.filter(b=>!p(b));h.length?(e.contacts=e.contacts.concat(h),x(e.contacts),m(),y("Importación completada. Contactos añadidos: "+h.length,"success")):y("No se han importado contactos nuevos (todos ya existen).","info")}};const o=document.getElementById("close-all-notes");o&&(o.onclick=()=>{e.showAllNotes=!1,e.allNotesPage=1,m()});const d=document.getElementById("show-all-notes-btn");d&&(d.onclick=()=>{e.showAllNotes=!0,e.allNotesPage=1,m()});const g=document.getElementById("prev-notes-page");g&&(g.onclick=()=>{e.allNotesPage>1&&(e.allNotesPage--,m())});const v=document.getElementById("next-notes-page");v&&(v.onclick=()=>{let c=[];e.contacts.forEach((r,u)=>{r.notes&&Object.entries(r.notes).forEach(([p,h])=>{c.push({date:p,text:h,contact:r,contactIndex:u})})});const l=Math.max(1,Math.ceil(c.length/4));e.allNotesPage<l&&(e.allNotesPage++,m())}),document.querySelectorAll(".edit-note-link").forEach(c=>{c.onclick=l=>{l.preventDefault();const r=Number(c.dataset.contact),u=c.dataset.date;e.selected=r,e.editing=null,e.showAllNotes=!1,m(),setTimeout(()=>{const p=document.querySelector(`.edit-note[data-date="${u}"]`);p&&p.click()},50)}}),document.querySelectorAll(".share-backup-btn").forEach(c=>{c.onclick=async()=>{const l=c.dataset.fecha,u=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(E=>E.fecha===l);if(!u)return alert("No se encontró la copia seleccionada.");const p=`contactos_backup_${l}.json`,h=JSON.stringify(u.datos,null,2),b=new Blob([h],{type:"application/json"}),f=document.createElement("a");if(f.href=URL.createObjectURL(b),f.download=p,f.style.display="none",document.body.appendChild(f),f.click(),setTimeout(()=>{URL.revokeObjectURL(f.href),f.remove()},1e3),navigator.canShare&&window.File&&window.FileReader)try{const E=new File([b],p,{type:"application/json"});navigator.canShare({files:[E]})&&await navigator.share({files:[E],title:"Backup de Contactos",text:`Copia de seguridad (${l}) de ContactosDiarios`})}catch{}}})}function T(t){const n=[],i=t.split("END:VCARD");for(const s of i){const a=/FN:([^\n]*)/.exec(s)?.[1]?.trim(),o=/N:.*;([^;\n]*)/.exec(s)?.[1]?.trim()||"",d=/TEL.*:(.+)/.exec(s)?.[1]?.trim(),g=/EMAIL.*:(.+)/.exec(s)?.[1]?.trim();a&&n.push({name:a,surname:o,phone:d||"",email:g||"",notes:{},tags:[]})}return n}function D(t){return t.map(n=>`BEGIN:VCARD
VERSION:3.0
FN:${n.name}
N:${n.surname||""};;;;
TEL:${n.phone||""}
EMAIL:${n.email||""}
END:VCARD`).join(`
`)}function J(t){const n=t.split(`
`).filter(Boolean),[i,...s]=n;return s.map(a=>{const[o,d,g,v,c,l]=a.split(",");return{name:o?.trim()||"",surname:d?.trim()||"",phone:g?.trim()||"",email:v?.trim()||"",notes:l?JSON.parse(l):{},tags:c?c.split(";").map(r=>r.trim()):[]}})}function U(){const t=D(e.contacts),n=new Blob([t],{type:"text/vcard"}),i=document.createElement("a");i.href=URL.createObjectURL(n),i.download="contactos.vcf",i.click()}function z(){const t="name,surname,phone,email,tags,notes",n=e.contacts.map(o=>[o.name,o.surname,o.phone,o.email,(o.tags||[]).join(";"),JSON.stringify(o.notes||{})].map(d=>'"'+String(d).replace(/"/g,'""')+'"').join(",")),i=[t,...n].join(`
`),s=new Blob([i],{type:"text/csv"}),a=document.createElement("a");a.href=URL.createObjectURL(s),a.download="contactos.csv",a.click()}function G(){const t=new Blob([JSON.stringify(e.contacts,null,2)],{type:"application/json"}),n=document.createElement("a");n.href=URL.createObjectURL(t),n.download="contactos.json",n.click()}function S(){const t=new Date,i=new Date(t.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);let s=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");s.find(a=>a.fecha===i)||(s.push({fecha:i,datos:e.contacts}),s.length>10&&(s=s.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(s))),localStorage.setItem("contactos_diarios_backup_fecha",i)}setInterval(S,60*60*1e3);S();function W(t){if(!confirm("¿Seguro que quieres restaurar la copia de seguridad del "+t+"? Se sobrescribirán los contactos actuales."))return;const i=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(s=>s.fecha===t);i?(e.contacts=i.datos,x(e.contacts),m(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}document.addEventListener("DOMContentLoaded",()=>{m();let t=null;const n=document.createElement("button");n.textContent="📲 Instalar en tu dispositivo",n.className="add-btn",n.style.display="none",n.style.position="fixed",n.style.bottom="1.5rem",n.style.left="50%",n.style.transform="translateX(-50%)",n.style.zIndex="3000",document.body.appendChild(n),window.addEventListener("beforeinstallprompt",i=>{i.preventDefault(),t=i,n.style.display="block"}),n.addEventListener("click",async()=>{if(t){t.prompt();const{outcome:i}=await t.userChoice;i==="accepted"&&(n.style.display="none"),t=null}}),window.addEventListener("appinstalled",()=>{n.style.display="none"})});
