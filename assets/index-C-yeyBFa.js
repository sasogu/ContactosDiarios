(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const m of i.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&o(m)}).observe(document,{childList:!0,subtree:!0});function s(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(a){if(a.ep)return;a.ep=!0;const i=s(a);fetch(a.href,i)}})();const x="0.0.46";(function(){try{const e=localStorage.getItem("app_version");if(e&&e!==x){const s=localStorage.getItem("contactos_diarios");Object.keys(localStorage).forEach(o=>{o!=="contactos_diarios"&&localStorage.removeItem(o)}),"caches"in window&&caches.keys().then(o=>o.forEach(a=>caches.delete(a))),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(o=>o.forEach(a=>a.unregister())),s&&localStorage.setItem("contactos_diarios",s),location.reload()}localStorage.setItem("app_version",x)}catch{}})();function N({contacts:n,filter:e}){let s=e?n.filter(o=>{const a=e.toLowerCase(),i=o.notes?Object.values(o.notes).join(" ").toLowerCase():"";return o.tags?.some(m=>m.toLowerCase().includes(a))||o.name?.toLowerCase().includes(a)||o.surname?.toLowerCase().includes(a)||i.includes(a)}):n;return s=s.slice().sort((o,a)=>a.pinned&&!o.pinned?1:o.pinned&&!a.pinned?-1:(o.surname||"").localeCompare(a.surname||"")),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${e||""}" />
      <ul>
        ${s.length===0?'<li class="empty">Sin contactos</li>':s.map((o,a)=>`
          <li${o.pinned?' class="pinned"':""}>
            <div class="contact-main">
              <button class="select-contact" data-index="${a}" style="background:none;border:none;padding:0;color:inherit;font:inherit;${isMobile()?"font-weight:bold;text-decoration:underline;":""}">
                ${o.surname?o.surname+", ":""}${o.name}
              </button>
              <span class="tags">${(o.tags||[]).map(i=>`<span class='tag'>${i}</span>`).join(" ")}</span>
              <button class="pin-contact" data-index="${a}" title="${o.pinned?"Desfijar":"Fijar"}">${o.pinned?"📌":"📍"}</button>
            </div>
            <div class="contact-info">
              ${o.phone?`<a href="tel:${o.phone}" class="contact-link" title="Llamar"><span>📞</span> ${o.phone}</a>`:""}
              ${o.email?`<a href="mailto:${o.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${o.email}</a>`:""}
            </div>
            <button class="edit-contact" data-index="${a}" title="Editar">✏️</button>
            <button class="delete-contact" data-index="${a}" title="Eliminar">🗑️</button>
          </li>
        `).join("")}
      </ul>
    </div>
  `}function $({contact:n}){return`
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
  `}function S({notes:n}){return`
    <div class="notes-area">
      <h3>Notas diarias</h3>
      <form id="note-form">
        <input type="date" id="note-date" value="${new Date().toISOString().slice(0,10)}" required />
        <textarea id="note-text" rows="3" placeholder="Escribe una nota para la fecha seleccionada..."></textarea>
        <button type="submit">Guardar nota</button>
      </form>
      <ul class="note-history">
        ${Object.entries(n||{}).sort((e,s)=>s[0].localeCompare(e[0])).map(([e,s])=>`
          <li>
            <b>${e}</b>:
            <span class="note-content" data-date="${e}">${s}</span>
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
  `}function w({}){return`
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
  `}function B({contacts:n,visible:e,page:s=1}){let o=[];n.forEach((c,r)=>{c.notes&&Object.entries(c.notes).forEach(([d,p])=>{o.push({date:d,text:p,contact:c,contactIndex:r})})}),o.sort((c,r)=>r.date.localeCompare(c.date));const a=4,i=Math.max(1,Math.ceil(o.length/a)),m=Math.min(Math.max(s,1),i),g=(m-1)*a,l=o.slice(g,g+a);return`
    <div id="all-notes-modal" class="modal" style="display:${e?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${o.length===0?"<li>No hay notas registradas.</li>":l.map(c=>`
            <li>
              <b>${c.date}</b> — <span style="color:#3a4a7c">${c.contact.surname?c.contact.surname+", ":""}${c.contact.name}</span><br/>
              <span>${c.text}</span>
              <a href="#" class="edit-note-link" data-contact="${c.contactIndex}" data-date="${c.date}" style="margin-left:0.5em;color:#646cff;font-size:0.95em;">Editar nota</a>
            </li>
          `).join("")}
        </ul>
        <div class="pagination" style="display:flex;justify-content:center;align-items:center;gap:1em;margin:1em 0;">
          <button id="prev-notes-page" ${m===1?"disabled":""}>&lt; Anterior</button>
          <span>Página ${m} de ${i}</span>
          <button id="next-notes-page" ${m===i?"disabled":""}>Siguiente &gt;</button>
        </div>
        <div class="form-actions">
          <button id="close-all-notes">Cerrar</button>
        </div>
      </div>
    </div>
  `}function C({visible:n,backups:e}){return`
    <div id="backup-modal" class="modal" style="display:${n?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:400px;">
        <h3>Restaurar copia local</h3>
        <div class="backup-btns" style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;">
          ${e.length===0?"<span>Sin copias locales.</span>":e.map(s=>`
            <div class="backup-btn-group" style="display:flex;align-items:center;gap:0.3rem;">
              <button class="restore-backup-btn" data-fecha="${s.fecha}">${s.fecha}</button>
              <button class="share-backup-btn" data-fecha="${s.fecha}" title="Compartir backup" style="background:#06b6d4;padding:0.4rem 0.7rem;font-size:1.1em;">📤</button>
            </div>
          `).join("")}
        </div>
        <div class="form-actions" style="margin-top:1.2rem;"><button id="close-backup-modal">Cerrar</button></div>
      </div>
    </div>
  `}function j({visible:n,contact:e}){return!n||!e?"":`
    <div class="modal" id="add-note-modal" style="display:flex;">
      <div class="modal-content" style="max-width:400px;">
        <h3>Nueva nota para ${e.surname?e.surname+", ":""}${e.name}</h3>
        <form id="add-note-form">
          <label for="add-note-date">Fecha:</label>
          <input type="date" id="add-note-date" required value="${new Date().toISOString().slice(0,10)}" />
          <label for="add-note-text">Nota:</label>
          <textarea id="add-note-text" required style="min-width:220px;min-height:80px;"></textarea>
          <div style="margin-top:1em;display:flex;gap:1em;">
            <button type="submit" class="add-btn" style="flex:1;">Guardar</button>
            <button type="button" class="close-add-note add-btn" style="flex:1;background:#c00;">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `}const k="contactos_diarios";let t={contacts:O(),selected:null,editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1,allNotesPage:1,showAddNoteModal:!1,addNoteContactIdx:null};function O(){try{return JSON.parse(localStorage.getItem(k))||[]}catch{return[]}}function h(n){localStorage.setItem(k,JSON.stringify(n))}function u(){const n=document.querySelector("#app"),e=t.editing!==null?t.contacts[t.editing]:null,s=t.selected!==null?t.contacts[t.selected].notes||{}:{};n.innerHTML=`
    <h1>Diario de Contactos</h1>
    <div id="backup-info" style="margin-bottom:0.7rem;font-size:0.98em;color:#3a4a7c;"></div>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <div class="main-grid">
      <div>
        <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
        ${w({})}
        ${N({contacts:t.contacts,filter:t.tagFilter})}
        <button id="show-backup-modal" class="add-btn" style="width:100%;margin-top:0.7rem;background:#06b6d4;">Restaurar copia local</button>
      </div>
      <div>
        ${t.editing!==null?$({contact:e}):""}
        ${t.selected!==null&&t.editing===null?S({notes:s}):""}
      </div>
    </div>
    ${B({contacts:t.contacts,visible:t.showAllNotes,page:t.allNotesPage})}
    ${C({visible:t.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})}
    ${j({visible:t.showAddNoteModal,contact:t.addNoteContactIdx!==null?t.contacts[t.addNoteContactIdx]:null})}
  `,A(),R();const o=document.getElementById("show-backup-modal");o&&(o.onclick=()=>{t.showBackupModal=!0,u()});const a=document.getElementById("close-backup-modal");a&&(a.onclick=()=>{t.showBackupModal=!1,u()}),document.querySelectorAll(".restore-backup-btn").forEach(m=>{m.onclick=()=>D(m.dataset.fecha)});const i=document.getElementById("restore-local-backup");i&&(i.onclick=restaurarBackupLocal)}let E=null;function A(){const n=document.getElementById("tag-filter");n&&n.addEventListener("input",l=>{clearTimeout(E),E=setTimeout(()=>{t.tagFilter=n.value,u();const c=document.getElementById("tag-filter");c&&(c.value=t.tagFilter,c.focus(),c.setSelectionRange(t.tagFilter.length,t.tagFilter.length))},300)});const e=document.getElementById("add-contact");e&&(e.onclick=()=>{t.editing=null,t.selected=null,u(),t.editing=t.contacts.length,u()}),document.querySelectorAll(".select-contact").forEach(l=>{l.onclick=c=>{const r=parseInt(l.dataset.index,10);isMobile()?(t.showAddNoteModal=!0,t.addNoteContactIdx=r,u()):(t.selected=r,u())}}),document.querySelectorAll(".edit-contact").forEach(l=>{l.onclick=c=>{t.editing=Number(l.dataset.index),t.selected=null,u()}}),document.querySelectorAll(".delete-contact").forEach(l=>{l.onclick=c=>{confirm("¿Eliminar este contacto?")&&(t.contacts.splice(Number(l.dataset.index),1),h(t.contacts),t.selected=null,u())}}),document.querySelectorAll(".pin-contact").forEach(l=>{l.onclick=c=>{const r=Number(l.dataset.index);t.contacts[r].pinned&&!confirm("¿Seguro que quieres desfijar este contacto?")||(t.contacts[r].pinned=!t.contacts[r].pinned,h(t.contacts),u())}});const s=document.getElementById("contact-form");s&&(s.onsubmit=l=>{l.preventDefault();const c=Object.fromEntries(new FormData(s));let r=c.tags?c.tags.split(",").map(d=>d.trim()).filter(Boolean):[];delete c.tags,t.editing!==null&&t.editing<t.contacts.length?t.contacts[t.editing]={...t.contacts[t.editing],...c,tags:r}:t.contacts.push({...c,notes:{},tags:r}),h(t.contacts),t.editing=null,u()},document.getElementById("cancel-edit").onclick=()=>{t.editing=null,u()});const o=document.getElementById("note-form");o&&t.selected!==null&&(o.onsubmit=l=>{l.preventDefault();const c=document.getElementById("note-date").value,r=document.getElementById("note-text").value.trim();!c||!r||(t.contacts[t.selected].notes||(t.contacts[t.selected].notes={}),t.contacts[t.selected].notes[c]=r,h(t.contacts),u())}),document.querySelectorAll(".edit-note").forEach(l=>{l.onclick=c=>{const r=l.dataset.date,d=document.getElementById("edit-note-modal"),p=document.getElementById("edit-note-text");p.value=t.contacts[t.selected].notes[r],d.style.display="block",document.getElementById("save-edit-note").onclick=()=>{t.contacts[t.selected].notes[r]=p.value.trim(),h(t.contacts),d.style.display="none",u()},document.getElementById("cancel-edit-note").onclick=()=>{d.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(l=>{l.onclick=c=>{const r=l.dataset.date;confirm("¿Eliminar la nota de "+r+"?")&&(delete t.contacts[t.selected].notes[r],h(t.contacts),u())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{M(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{P(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{F(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async l=>{const c=l.target.files[0];if(!c)return;const r=await c.text();let d=[];if(c.name.endsWith(".vcf"))d=L(r);else if(c.name.endsWith(".csv"))d=_(r);else if(c.name.endsWith(".json"))try{const p=JSON.parse(r);Array.isArray(p)?d=p:p&&Array.isArray(p.contacts)&&(d=p.contacts)}catch{}if(d.length){const p=b=>t.contacts.some(f=>f.name===b.name&&f.surname===b.surname&&f.phone===b.phone),y=d.filter(b=>!p(b));y.length?(t.contacts=t.contacts.concat(y),h(t.contacts),u()):alert("No se han importado contactos nuevos (todos ya existen).")}};const a=document.getElementById("close-all-notes");a&&(a.onclick=()=>{t.showAllNotes=!1,t.allNotesPage=1,u()});const i=document.getElementById("show-all-notes-btn");i&&(i.onclick=()=>{t.showAllNotes=!0,t.allNotesPage=1,u()});const m=document.getElementById("prev-notes-page");m&&(m.onclick=()=>{t.allNotesPage>1&&(t.allNotesPage--,u())});const g=document.getElementById("next-notes-page");g&&(g.onclick=()=>{let l=[];t.contacts.forEach((r,d)=>{r.notes&&Object.entries(r.notes).forEach(([p,y])=>{l.push({date:p,text:y,contact:r,contactIndex:d})})});const c=Math.max(1,Math.ceil(l.length/4));t.allNotesPage<c&&(t.allNotesPage++,u())}),document.querySelectorAll(".edit-note-link").forEach(l=>{l.onclick=c=>{c.preventDefault();const r=Number(l.dataset.contact),d=l.dataset.date;t.selected=r,t.editing=null,t.showAllNotes=!1,u(),setTimeout(()=>{const p=document.querySelector(`.edit-note[data-date="${d}"]`);p&&p.click()},50)}}),document.querySelectorAll(".share-backup-btn").forEach(l=>{l.onclick=async()=>{const c=l.dataset.fecha,d=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(v=>v.fecha===c);if(!d)return alert("No se encontró la copia seleccionada.");const p=`contactos_backup_${c}.json`,y=JSON.stringify(d.datos,null,2),b=new Blob([y],{type:"application/json"}),f=document.createElement("a");if(f.href=URL.createObjectURL(b),f.download=p,f.style.display="none",document.body.appendChild(f),f.click(),setTimeout(()=>{URL.revokeObjectURL(f.href),f.remove()},1e3),navigator.canShare&&window.File&&window.FileReader)try{const v=new File([b],p,{type:"application/json"});navigator.canShare({files:[v]})&&await navigator.share({files:[v],title:"Backup de Contactos",text:`Copia de seguridad (${c}) de ContactosDiarios`})}catch{}}})}function L(n){const e=[],s=n.split("END:VCARD");for(const o of s){const a=/FN:([^\n]*)/.exec(o)?.[1]?.trim(),i=/N:.*;([^;\n]*)/.exec(o)?.[1]?.trim()||"",m=/TEL.*:(.+)/.exec(o)?.[1]?.trim(),g=/EMAIL.*:(.+)/.exec(o)?.[1]?.trim();a&&e.push({name:a,surname:i,phone:m||"",email:g||"",notes:{},tags:[]})}return e}function q(n){return n.map(e=>`BEGIN:VCARD
VERSION:3.0
FN:${e.name}
N:${e.surname||""};;;;
TEL:${e.phone||""}
EMAIL:${e.email||""}
END:VCARD`).join(`
`)}function _(n){const e=n.split(`
`).filter(Boolean),[s,...o]=e;return o.map(a=>{const[i,m,g,l,c,r]=a.split(",");return{name:i?.trim()||"",surname:m?.trim()||"",phone:g?.trim()||"",email:l?.trim()||"",notes:r?JSON.parse(r):{},tags:c?c.split(";").map(d=>d.trim()):[]}})}function M(){const n=q(t.contacts),e=new Blob([n],{type:"text/vcard"}),s=document.createElement("a");s.href=URL.createObjectURL(e),s.download="contactos.vcf",s.click()}function P(){const n="name,surname,phone,email,tags,notes",e=t.contacts.map(i=>[i.name,i.surname,i.phone,i.email,(i.tags||[]).join(";"),JSON.stringify(i.notes||{})].map(m=>'"'+String(m).replace(/"/g,'""')+'"').join(",")),s=[n,...e].join(`
`),o=new Blob([s],{type:"text/csv"}),a=document.createElement("a");a.href=URL.createObjectURL(o),a.download="contactos.csv",a.click()}function F(){const n=new Blob([JSON.stringify(t.contacts,null,2)],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(n),e.download="contactos.json",e.click()}function I(){const n=new Date().toISOString().slice(0,10);let e=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");e.find(s=>s.fecha===n)||(e.push({fecha:n,datos:t.contacts}),e.length>10&&(e=e.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(e))),localStorage.setItem("contactos_diarios_backup_fecha",n)}setInterval(I,60*60*1e3);I();function R(){const n=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]"),e=document.getElementById("backup-info");e&&(n.length===0?e.textContent="Sin copias locales.":e.innerHTML="Últimas copias locales: "+n.map(s=>`<button class="restore-backup-btn" data-fecha="${s.fecha}">${s.fecha}</button>`).join(" "))}function D(n){if(!confirm("¿Seguro que quieres restaurar la copia de seguridad del "+n+"? Se sobrescribirán los contactos actuales."))return;const s=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(o=>o.fecha===n);s?(t.contacts=s.datos,h(t.contacts),u(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}document.addEventListener("DOMContentLoaded",()=>{u();let n=null;const e=document.createElement("button");e.textContent="📲 Instalar en tu dispositivo",e.className="add-btn",e.style.display="none",e.style.position="fixed",e.style.bottom="1.5rem",e.style.left="50%",e.style.transform="translateX(-50%)",e.style.zIndex="3000",document.body.appendChild(e),window.addEventListener("beforeinstallprompt",s=>{s.preventDefault(),n=s,e.style.display="block"}),e.addEventListener("click",async()=>{if(n){n.prompt();const{outcome:s}=await n.userChoice;s==="accepted"&&(e.style.display="none"),n=null}}),window.addEventListener("appinstalled",()=>{e.style.display="none"})});
