(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const d of n.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function c(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=c(s);fetch(s.href,n)}})();const v="0.0.24";(function(){try{const e=localStorage.getItem("app_version");if(e&&e!==v){const c=localStorage.getItem("contactos_diarios");Object.keys(localStorage).forEach(i=>{i!=="contactos_diarios"&&localStorage.removeItem(i)}),"caches"in window&&caches.keys().then(i=>i.forEach(s=>caches.delete(s))),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(i=>i.forEach(s=>s.unregister())),c&&localStorage.setItem("contactos_diarios",c),location.reload()}localStorage.setItem("app_version",v)}catch{}})();function k({contacts:o,filter:e,onSelect:c,onDelete:i}){let s=e?o.filter(n=>{const d=e.toLowerCase(),f=n.notes?Object.values(n.notes).join(" ").toLowerCase():"";return n.tags?.some(l=>l.toLowerCase().includes(d))||n.name?.toLowerCase().includes(d)||n.surname?.toLowerCase().includes(d)||f.includes(d)}):o;return s=s.slice().sort((n,d)=>d.pinned&&!n.pinned?1:n.pinned&&!d.pinned?-1:(n.surname||"").localeCompare(d.surname||"")),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${e||""}" />
      <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
      <ul>
        ${s.length===0?'<li class="empty">Sin contactos</li>':s.map((n,d)=>`
          <li${n.pinned?' class="pinned"':""}>
            <div class="contact-main">
              <button class="select-contact" data-index="${o.indexOf(n)}">${n.surname?n.surname+", ":""}${n.name}</button>
              <span class="tags">${(n.tags||[]).map(f=>`<span class='tag'>${f}</span>`).join(" ")}</span>
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
  `}function I({contact:o}){return`
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
  `}function $({notes:o}){return`
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
  `}function N({}){return`
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
  `}function S({contacts:o,visible:e,page:c=1}){let i=[];o.forEach((a,r)=>{a.notes&&Object.entries(a.notes).forEach(([m,p])=>{i.push({date:m,text:p,contact:a,contactIndex:r})})}),i.sort((a,r)=>r.date.localeCompare(a.date));const s=4,n=Math.max(1,Math.ceil(i.length/s)),d=Math.min(Math.max(c,1),n),f=(d-1)*s,l=i.slice(f,f+s);return`
    <div id="all-notes-modal" class="modal" style="display:${e?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${i.length===0?"<li>No hay notas registradas.</li>":l.map(a=>`
            <li>
              <b>${a.date}</b> — <span style="color:#3a4a7c">${a.contact.surname?a.contact.surname+", ":""}${a.contact.name}</span><br/>
              <span>${a.text}</span>
              <a href="#" class="edit-note-link" data-contact="${a.contactIndex}" data-date="${a.date}" style="margin-left:0.5em;color:#646cff;font-size:0.95em;">Editar nota</a>
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
  `}function B({visible:o,backups:e}){return`
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
  `}const E="contactos_diarios";let t={contacts:w(),selected:null,editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1,allNotesPage:1};function w(){try{return JSON.parse(localStorage.getItem(E))||[]}catch{return[]}}function g(o){localStorage.setItem(E,JSON.stringify(o))}function u(){const o=document.querySelector("#app"),e=t.editing!==null?t.contacts[t.editing]:null,c=t.selected!==null?t.contacts[t.selected].notes||{}:{};o.innerHTML=`
    <h1>Diario de Contactos</h1>
    <div id="backup-info" style="margin-bottom:0.7rem;font-size:0.98em;color:#3a4a7c;"></div>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <div class="main-grid">
      <div>
        ${k({contacts:t.contacts,filter:t.tagFilter})}
        ${N({})}
        <button id="show-backup-modal" class="add-btn" style="width:100%;margin-top:0.7rem;background:#06b6d4;">Restaurar copia local</button>
      </div>
      <div>
        ${t.editing!==null?I({contact:e}):""}
        ${t.selected!==null&&t.editing===null?$({notes:c}):""}
      </div>
    </div>
    ${S({contacts:t.contacts,visible:t.showAllNotes,page:t.allNotesPage})}
    ${B({visible:t.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})} <!-- Modal de backup -->
  `,O(),q();const i=document.getElementById("show-backup-modal");i&&(i.onclick=()=>{t.showBackupModal=!0,u()});const s=document.getElementById("close-backup-modal");s&&(s.onclick=()=>{t.showBackupModal=!1,u()}),document.querySelectorAll(".restore-backup-btn").forEach(d=>{d.onclick=()=>M(d.dataset.fecha)});const n=document.getElementById("restore-local-backup");n&&(n.onclick=restaurarBackupLocal)}function O(){const o=document.getElementById("tag-filter");o&&o.addEventListener("input",l=>{t.tagFilter=o.value,u();const a=document.getElementById("tag-filter");a&&(a.value=t.tagFilter,a.focus(),a.setSelectionRange(t.tagFilter.length,t.tagFilter.length))});const e=document.getElementById("add-contact");e&&(e.onclick=()=>{t.editing=null,t.selected=null,u(),t.editing=t.contacts.length,u()}),document.querySelectorAll(".select-contact").forEach(l=>{l.onclick=a=>{t.selected=Number(l.dataset.index),t.editing=null,u()}}),document.querySelectorAll(".edit-contact").forEach(l=>{l.onclick=a=>{t.editing=Number(l.dataset.index),t.selected=null,u()}}),document.querySelectorAll(".delete-contact").forEach(l=>{l.onclick=a=>{confirm("¿Eliminar este contacto?")&&(t.contacts.splice(Number(l.dataset.index),1),g(t.contacts),t.selected=null,u())}}),document.querySelectorAll(".pin-contact").forEach(l=>{l.onclick=a=>{const r=Number(l.dataset.index);t.contacts[r].pinned=!t.contacts[r].pinned,g(t.contacts),u()}});const c=document.getElementById("contact-form");c&&(c.onsubmit=l=>{l.preventDefault();const a=Object.fromEntries(new FormData(c));let r=a.tags?a.tags.split(",").map(m=>m.trim()).filter(Boolean):[];delete a.tags,t.editing!==null&&t.editing<t.contacts.length?t.contacts[t.editing]={...t.contacts[t.editing],...a,tags:r}:t.contacts.push({...a,notes:{},tags:r}),g(t.contacts),t.editing=null,u()},document.getElementById("cancel-edit").onclick=()=>{t.editing=null,u()});const i=document.getElementById("note-form");i&&t.selected!==null&&(i.onsubmit=l=>{l.preventDefault();const a=document.getElementById("note-date").value,r=document.getElementById("note-text").value.trim();!a||!r||(t.contacts[t.selected].notes||(t.contacts[t.selected].notes={}),t.contacts[t.selected].notes[a]=r,g(t.contacts),u())}),document.querySelectorAll(".edit-note").forEach(l=>{l.onclick=a=>{const r=l.dataset.date,m=document.getElementById("edit-note-modal"),p=document.getElementById("edit-note-text");p.value=t.contacts[t.selected].notes[r],m.style.display="block",document.getElementById("save-edit-note").onclick=()=>{t.contacts[t.selected].notes[r]=p.value.trim(),g(t.contacts),m.style.display="none",u()},document.getElementById("cancel-edit-note").onclick=()=>{m.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(l=>{l.onclick=a=>{const r=l.dataset.date;confirm("¿Eliminar la nota de "+r+"?")&&(delete t.contacts[t.selected].notes[r],g(t.contacts),u())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{L(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{P(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{_(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async l=>{const a=l.target.files[0];if(!a)return;const r=await a.text();let m=[];if(a.name.endsWith(".vcf"))m=C(r);else if(a.name.endsWith(".csv"))m=A(r);else if(a.name.endsWith(".json"))try{const p=JSON.parse(r);Array.isArray(p)?m=p:p&&Array.isArray(p.contacts)&&(m=p.contacts)}catch{}if(m.length){const p=b=>t.contacts.some(y=>y.name===b.name&&y.surname===b.surname&&y.phone===b.phone),h=m.filter(b=>!p(b));h.length?(t.contacts=t.contacts.concat(h),g(t.contacts),u()):alert("No se han importado contactos nuevos (todos ya existen).")}};const s=document.getElementById("close-all-notes");s&&(s.onclick=()=>{t.showAllNotes=!1,t.allNotesPage=1,u()});const n=document.getElementById("show-all-notes-btn");n&&(n.onclick=()=>{t.showAllNotes=!0,t.allNotesPage=1,u()});const d=document.getElementById("prev-notes-page");d&&(d.onclick=()=>{t.allNotesPage>1&&(t.allNotesPage--,u())});const f=document.getElementById("next-notes-page");f&&(f.onclick=()=>{let l=[];t.contacts.forEach((r,m)=>{r.notes&&Object.entries(r.notes).forEach(([p,h])=>{l.push({date:p,text:h,contact:r,contactIndex:m})})});const a=Math.max(1,Math.ceil(l.length/4));t.allNotesPage<a&&(t.allNotesPage++,u())}),document.querySelectorAll(".edit-note-link").forEach(l=>{l.onclick=a=>{a.preventDefault();const r=Number(l.dataset.contact),m=l.dataset.date;t.selected=r,t.editing=null,t.showAllNotes=!1,u(),setTimeout(()=>{const p=document.querySelector(`.edit-note[data-date="${m}"]`);p&&p.click()},50)}})}function C(o){const e=[],c=o.split("END:VCARD");for(const i of c){const s=/FN:([^\n]*)/.exec(i)?.[1]?.trim(),n=/N:.*;([^;\n]*)/.exec(i)?.[1]?.trim()||"",d=/TEL.*:(.+)/.exec(i)?.[1]?.trim(),f=/EMAIL.*:(.+)/.exec(i)?.[1]?.trim();s&&e.push({name:s,surname:n,phone:d||"",email:f||"",notes:{},tags:[]})}return e}function j(o){return o.map(e=>`BEGIN:VCARD
VERSION:3.0
FN:${e.name}
N:${e.surname||""};;;;
TEL:${e.phone||""}
EMAIL:${e.email||""}
END:VCARD`).join(`
`)}function A(o){const e=o.split(`
`).filter(Boolean),[c,...i]=e;return i.map(s=>{const[n,d,f,l,a,r]=s.split(",");return{name:n?.trim()||"",surname:d?.trim()||"",phone:f?.trim()||"",email:l?.trim()||"",notes:r?JSON.parse(r):{},tags:a?a.split(";").map(m=>m.trim()):[]}})}function L(){const o=j(t.contacts),e=new Blob([o],{type:"text/vcard"}),c=document.createElement("a");c.href=URL.createObjectURL(e),c.download="contactos.vcf",c.click()}function P(){const o="name,surname,phone,email,tags,notes",e=t.contacts.map(n=>[n.name,n.surname,n.phone,n.email,(n.tags||[]).join(";"),JSON.stringify(n.notes||{})].map(d=>'"'+String(d).replace(/"/g,'""')+'"').join(",")),c=[o,...e].join(`
`),i=new Blob([c],{type:"text/csv"}),s=document.createElement("a");s.href=URL.createObjectURL(i),s.download="contactos.csv",s.click()}function _(){const o=new Blob([JSON.stringify(t.contacts,null,2)],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(o),e.download="contactos.json",e.click()}function x(){const o=new Date().toISOString().slice(0,10);let e=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");e.find(c=>c.fecha===o)||(e.push({fecha:o,datos:t.contacts}),e.length>10&&(e=e.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(e))),localStorage.setItem("contactos_diarios_backup_fecha",o)}setInterval(x,60*60*1e3);x();function q(){const o=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]"),e=document.getElementById("backup-info");e&&(o.length===0?e.textContent="Sin copias locales.":e.innerHTML="Últimas copias locales: "+o.map(c=>`<button class="restore-backup-btn" data-fecha="${c.fecha}">${c.fecha}</button>`).join(" "))}function M(o){if(!confirm("¿Seguro que quieres restaurar la copia de seguridad del "+o+"? Se sobrescribirán los contactos actuales."))return;const c=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(i=>i.fecha===o);c?(t.contacts=c.datos,g(t.contacts),u(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}document.addEventListener("DOMContentLoaded",()=>{u();let o=null;const e=document.createElement("button");e.textContent="📲 Instalar en tu dispositivo",e.className="add-btn",e.style.display="none",e.style.position="fixed",e.style.bottom="1.5rem",e.style.left="50%",e.style.transform="translateX(-50%)",e.style.zIndex="3000",document.body.appendChild(e),window.addEventListener("beforeinstallprompt",c=>{c.preventDefault(),o=c,e.style.display="block"}),e.addEventListener("click",async()=>{if(o){o.prompt();const{outcome:c}=await o.userChoice;c==="accepted"&&(e.style.display="none"),o=null}}),window.addEventListener("appinstalled",()=>{e.style.display="none"})});
