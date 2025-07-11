(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))l(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&l(a)}).observe(document,{childList:!0,subtree:!0});function c(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function l(s){if(s.ep)return;s.ep=!0;const n=c(s);fetch(s.href,n)}})();const f="0.0.20";(function(){try{const e=localStorage.getItem("app_version");if(e&&e!==f){const c=localStorage.getItem("contactos_diarios");Object.keys(localStorage).forEach(l=>{l!=="contactos_diarios"&&localStorage.removeItem(l)}),"caches"in window&&caches.keys().then(l=>l.forEach(s=>caches.delete(s))),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(l=>l.forEach(s=>s.unregister())),c&&localStorage.setItem("contactos_diarios",c),location.reload()}localStorage.setItem("app_version",f)}catch{}})();function h({contacts:o,filter:e,onSelect:c,onDelete:l}){let s=e?o.filter(n=>{const a=e.toLowerCase(),i=n.notes?Object.values(n.notes).join(" ").toLowerCase():"";return n.tags?.some(r=>r.toLowerCase().includes(a))||n.name?.toLowerCase().includes(a)||n.surname?.toLowerCase().includes(a)||i.includes(a)}):o;return s=s.slice().sort((n,a)=>a.pinned&&!n.pinned?1:n.pinned&&!a.pinned?-1:(n.surname||"").localeCompare(a.surname||"")),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${e||""}" />
      <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
      <ul>
        ${s.length===0?'<li class="empty">Sin contactos</li>':s.map((n,a)=>`
          <li${n.pinned?' class="pinned"':""}>
            <div class="contact-main">
              <button class="select-contact" data-index="${o.indexOf(n)}">${n.surname?n.surname+", ":""}${n.name}</button>
              <span class="tags">${(n.tags||[]).map(i=>`<span class='tag'>${i}</span>`).join(" ")}</span>
              <button class="pin-contact" data-index="${o.indexOf(n)}" title="${n.pinned?"Desfijar":"Fijar"}">${n.pinned?"📌":"📍"}</button>
            </div>
            <div class="contact-info">
              ${n.phone?`<a href="tel:${n.phone}" class="contact-link" title="Llamar"><span>📞</span> ${n.phone}</a>`:""}
              ${n.email?`<a href="mailto:${n.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${n.email}</a>`:""}
            </div>
            <button class="edit-contact" data-index="${o.indexOf(n)}" title="Editar">✏️</button>
            <button class="delete-contact" data-index="${o.indexOf(n)}" title="Eliminar">🗑️</button>
          </li>
        `).join("")}
      </ul>
    </div>
  `}function v({contact:o}){return`
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
  `}function E({notes:o}){return`
    <div class="notes-area">
      <h3>Notas diarias</h3>
      <form id="note-form">
        <input type="date" id="note-date" value="${new Date().toISOString().slice(0,10)}" required />
        <textarea id="note-text" rows="3" placeholder="Escribe una nota para la fecha seleccionada..."></textarea>
        <button type="submit">Guardar nota</button>
      </form>
      <ul class="note-history">
        ${Object.entries(o||{}).sort((e,c)=>c[0].localeCompare(e[0])).map(([e,c])=>`
          <li>
            <b>${e}</b>:
            <span class="note-content" data-date="${e}">${c}</span>
            <button class="edit-note" data-date="${e}" title="Editar">✏️</button>
            <button class="delete-note" data-date="${e}" title="Eliminar">🗑️</button>
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
  `}function k({}){return`
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
  `}function x({contacts:o,visible:e}){let c=[];return o.forEach((l,s)=>{l.notes&&Object.entries(l.notes).forEach(([n,a])=>{c.push({date:n,text:a,contact:l,contactIndex:s})})}),c.sort((l,s)=>s.date.localeCompare(l.date)),`
    <div id="all-notes-modal" class="modal" style="display:${e?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${c.length===0?"<li>No hay notas registradas.</li>":c.map(l=>`
            <li>
              <b>${l.date}</b> — <span style="color:#3a4a7c">${l.contact.surname?l.contact.surname+", ":""}${l.contact.name}</span><br/>
              <span>${l.text}</span>
              <a href="#" class="edit-note-link" data-contact="${l.contactIndex}" data-date="${l.date}" style="margin-left:0.5em;color:#646cff;font-size:0.95em;">Editar nota</a>
            </li>
          `).join("")}
        </ul>
        <div class="form-actions">
          <button id="close-all-notes">Cerrar</button>
        </div>
      </div>
    </div>
  `}function I({visible:o,backups:e}){return`
    <div id="backup-modal" class="modal" style="display:${o?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:400px;">
        <h3>Restaurar copia local</h3>
        <div class="backup-btns" style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;">
          ${e.length===0?"<span>Sin copias locales.</span>":e.map(c=>`
            <div class="backup-btn-group" style="display:flex;align-items:center;gap:0.3rem;">
              <button class="restore-backup-btn" data-fecha="${c.fecha}">${c.fecha}</button>
              <button class="share-backup-btn" data-fecha="${c.fecha}" title="Compartir backup" style="background:#06b6d4;padding:0.4rem 0.7rem;font-size:1.1em;">📤</button>
            </div>
          `).join("")}
        </div>
        <div class="form-actions" style="margin-top:1.2rem;"><button id="close-backup-modal">Cerrar</button></div>
      </div>
    </div>
  `}const b="contactos_diarios";let t={contacts:$(),selected:null,editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1};function $(){try{return JSON.parse(localStorage.getItem(b))||[]}catch{return[]}}function p(o){localStorage.setItem(b,JSON.stringify(o))}function d(){const o=document.querySelector("#app"),e=t.editing!==null?t.contacts[t.editing]:null,c=t.selected!==null?t.contacts[t.selected].notes||{}:{};o.innerHTML=`
    <h1>Diario de Contactos</h1>
    <div id="backup-info" style="margin-bottom:0.7rem;font-size:0.98em;color:#3a4a7c;"></div>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <div class="main-grid">
      <div>
        ${h({contacts:t.contacts,filter:t.tagFilter})}
        ${k({})}
        <button id="show-backup-modal" class="add-btn" style="width:100%;margin-top:0.7rem;background:#06b6d4;">Restaurar copia local</button>
      </div>
      <div>
        ${t.editing!==null?v({contact:e}):""}
        ${t.selected!==null&&t.editing===null?E({notes:c}):""}
      </div>
    </div>
    ${x({contacts:t.contacts,visible:t.showAllNotes})}
    ${I({visible:t.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})} <!-- Modal de backup -->
  `,B(),L();const l=document.getElementById("show-backup-modal");l&&(l.onclick=()=>{t.showBackupModal=!0,d()});const s=document.getElementById("close-backup-modal");s&&(s.onclick=()=>{t.showBackupModal=!1,d()}),document.querySelectorAll(".restore-backup-btn").forEach(a=>{a.onclick=()=>A(a.dataset.fecha)});const n=document.getElementById("restore-local-backup");n&&(n.onclick=restaurarBackupLocal)}function B(){const o=document.getElementById("tag-filter");o&&o.addEventListener("input",a=>{t.tagFilter=o.value,d();const i=document.getElementById("tag-filter");i&&(i.value=t.tagFilter,i.focus(),i.setSelectionRange(t.tagFilter.length,t.tagFilter.length))});const e=document.getElementById("add-contact");e&&(e.onclick=()=>{t.editing=null,t.selected=null,d(),t.editing=t.contacts.length,d()}),document.querySelectorAll(".select-contact").forEach(a=>{a.onclick=i=>{t.selected=Number(a.dataset.index),t.editing=null,d()}}),document.querySelectorAll(".edit-contact").forEach(a=>{a.onclick=i=>{t.editing=Number(a.dataset.index),t.selected=null,d()}}),document.querySelectorAll(".delete-contact").forEach(a=>{a.onclick=i=>{confirm("¿Eliminar este contacto?")&&(t.contacts.splice(Number(a.dataset.index),1),p(t.contacts),t.selected=null,d())}}),document.querySelectorAll(".pin-contact").forEach(a=>{a.onclick=i=>{const r=Number(a.dataset.index);t.contacts[r].pinned=!t.contacts[r].pinned,p(t.contacts),d()}});const c=document.getElementById("contact-form");c&&(c.onsubmit=a=>{a.preventDefault();const i=Object.fromEntries(new FormData(c));let r=i.tags?i.tags.split(",").map(u=>u.trim()).filter(Boolean):[];delete i.tags,t.editing!==null&&t.editing<t.contacts.length?t.contacts[t.editing]={...t.contacts[t.editing],...i,tags:r}:t.contacts.push({...i,notes:{},tags:r}),p(t.contacts),t.editing=null,d()},document.getElementById("cancel-edit").onclick=()=>{t.editing=null,d()});const l=document.getElementById("note-form");l&&t.selected!==null&&(l.onsubmit=a=>{a.preventDefault();const i=document.getElementById("note-date").value,r=document.getElementById("note-text").value.trim();!i||!r||(t.contacts[t.selected].notes||(t.contacts[t.selected].notes={}),t.contacts[t.selected].notes[i]=r,p(t.contacts),d())}),document.querySelectorAll(".edit-note").forEach(a=>{a.onclick=i=>{const r=a.dataset.date,u=document.getElementById("edit-note-modal"),m=document.getElementById("edit-note-text");m.value=t.contacts[t.selected].notes[r],u.style.display="block",document.getElementById("save-edit-note").onclick=()=>{t.contacts[t.selected].notes[r]=m.value.trim(),p(t.contacts),u.style.display="none",d()},document.getElementById("cancel-edit-note").onclick=()=>{u.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(a=>{a.onclick=i=>{const r=a.dataset.date;confirm("¿Eliminar la nota de "+r+"?")&&(delete t.contacts[t.selected].notes[r],p(t.contacts),d())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{C(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{O(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{j(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async a=>{const i=a.target.files[0];if(!i)return;const r=await i.text();let u=[];if(i.name.endsWith(".vcf"))u=S(r);else if(i.name.endsWith(".csv"))u=w(r);else if(i.name.endsWith(".json"))try{const m=JSON.parse(r);Array.isArray(m)?u=m:m&&Array.isArray(m.contacts)&&(u=m.contacts)}catch{}u.length&&(t.contacts=t.contacts.concat(u),p(t.contacts),d())};const s=document.getElementById("close-all-notes");s&&(s.onclick=()=>{t.showAllNotes=!1,d()});const n=document.getElementById("show-all-notes-btn");n&&(n.onclick=()=>{t.showAllNotes=!0,d()}),document.querySelectorAll(".edit-note-link").forEach(a=>{a.onclick=i=>{i.preventDefault();const r=Number(a.dataset.contact),u=a.dataset.date;t.selected=r,t.editing=null,t.showAllNotes=!1,d(),setTimeout(()=>{const m=document.querySelector(`.edit-note[data-date="${u}"]`);m&&m.click()},50)}})}function S(o){const e=[],c=o.split("END:VCARD");for(const l of c){const s=/FN:([^\n]*)/.exec(l)?.[1]?.trim(),n=/N:.*;([^;\n]*)/.exec(l)?.[1]?.trim()||"",a=/TEL.*:(.+)/.exec(l)?.[1]?.trim(),i=/EMAIL.*:(.+)/.exec(l)?.[1]?.trim();s&&e.push({name:s,surname:n,phone:a||"",email:i||"",notes:{},tags:[]})}return e}function N(o){return o.map(e=>`BEGIN:VCARD
VERSION:3.0
FN:${e.name}
N:${e.surname||""};;;;
TEL:${e.phone||""}
EMAIL:${e.email||""}
END:VCARD`).join(`
`)}function w(o){const e=o.split(`
`).filter(Boolean),[c,...l]=e;return l.map(s=>{const[n,a,i,r,u,m]=s.split(",");return{name:n?.trim()||"",surname:a?.trim()||"",phone:i?.trim()||"",email:r?.trim()||"",notes:m?JSON.parse(m):{},tags:u?u.split(";").map(y=>y.trim()):[]}})}function C(){const o=N(t.contacts),e=new Blob([o],{type:"text/vcard"}),c=document.createElement("a");c.href=URL.createObjectURL(e),c.download="contactos.vcf",c.click()}function O(){const o="name,surname,phone,email,tags,notes",e=t.contacts.map(n=>[n.name,n.surname,n.phone,n.email,(n.tags||[]).join(";"),JSON.stringify(n.notes||{})].map(a=>'"'+String(a).replace(/"/g,'""')+'"').join(",")),c=[o,...e].join(`
`),l=new Blob([c],{type:"text/csv"}),s=document.createElement("a");s.href=URL.createObjectURL(l),s.download="contactos.csv",s.click()}function j(){const o=new Blob([JSON.stringify(t.contacts,null,2)],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(o),e.download="contactos.json",e.click()}function g(){const o=new Date().toISOString().slice(0,10);let e=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");e.find(c=>c.fecha===o)||(e.push({fecha:o,datos:t.contacts}),e.length>10&&(e=e.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(e))),localStorage.setItem("contactos_diarios_backup_fecha",o)}setInterval(g,60*60*1e3);g();function L(){const o=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]"),e=document.getElementById("backup-info");e&&(o.length===0?e.textContent="Sin copias locales.":e.innerHTML="Últimas copias locales: "+o.map(c=>`<button class="restore-backup-btn" data-fecha="${c.fecha}">${c.fecha}</button>`).join(" "))}function A(o){const c=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(l=>l.fecha===o);c?(t.contacts=c.datos,p(t.contacts),d(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}document.addEventListener("DOMContentLoaded",()=>{d();let o=null;const e=document.createElement("button");e.textContent="📲 Instalar en tu dispositivo",e.className="add-btn",e.style.display="none",e.style.position="fixed",e.style.bottom="1.5rem",e.style.left="50%",e.style.transform="translateX(-50%)",e.style.zIndex="3000",document.body.appendChild(e),window.addEventListener("beforeinstallprompt",c=>{c.preventDefault(),o=c,e.style.display="block"}),e.addEventListener("click",async()=>{if(o){o.prompt();const{outcome:c}=await o.userChoice;c==="accepted"&&(e.style.display="none"),o=null}}),window.addEventListener("appinstalled",()=>{e.style.display="none"})});
