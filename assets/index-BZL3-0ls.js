(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function c(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=c(s);fetch(s.href,n)}})();const E="0.0.46";(function(){try{const e=localStorage.getItem("app_version");if(e&&e!==E){const c=localStorage.getItem("contactos_diarios");Object.keys(localStorage).forEach(i=>{i!=="contactos_diarios"&&localStorage.removeItem(i)}),"caches"in window&&caches.keys().then(i=>i.forEach(s=>caches.delete(s))),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(i=>i.forEach(s=>s.unregister())),c&&localStorage.setItem("contactos_diarios",c),location.reload()}localStorage.setItem("app_version",E)}catch{}})();function $({contacts:o,filter:e,onSelect:c,onDelete:i}){let s=e?o.filter(n=>{const r=e.toLowerCase(),p=n.notes?Object.values(n.notes).join(" ").toLowerCase():"";return n.tags?.some(b=>b.toLowerCase().includes(r))||n.name?.toLowerCase().includes(r)||n.surname?.toLowerCase().includes(r)||p.includes(r)}):o;return s=s.slice().sort((n,r)=>r.pinned&&!n.pinned?1:n.pinned&&!r.pinned?-1:(n.surname||"").localeCompare(r.surname||"")),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${e||""}" />
      <ul>
        ${s.length===0?'<li class="empty">Sin contactos</li>':s.map((n,r)=>`
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
  `}function S({contact:o}){return`
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
  `}function w({notes:o}){return`
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
  `}function B({}){return`
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
  `}function C({contacts:o,visible:e,page:c=1}){let i=[];o.forEach((a,l)=>{a.notes&&Object.entries(a.notes).forEach(([d,u])=>{i.push({date:d,text:u,contact:a,contactIndex:l})})}),i.sort((a,l)=>l.date.localeCompare(a.date));const s=4,n=Math.max(1,Math.ceil(i.length/s)),r=Math.min(Math.max(c,1),n),p=(r-1)*s,b=i.slice(p,p+s);return`
    <div id="all-notes-modal" class="modal" style="display:${e?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${i.length===0?"<li>No hay notas registradas.</li>":b.map(a=>`
            <li>
              <b>${a.date}</b> — <span style="color:#3a4a7c">${a.contact.surname?a.contact.surname+", ":""}${a.contact.name}</span><br/>
              <span>${a.text}</span>
              <a href="#" class="edit-note-link" data-contact="${a.contactIndex}" data-date="${a.date}" style="margin-left:0.5em;color:#646cff;font-size:0.95em;">Editar nota</a>
            </li>
          `).join("")}
        </ul>
        <div class="pagination" style="display:flex;justify-content:center;align-items:center;gap:1em;margin:1em 0;">
          <button id="prev-notes-page" ${r===1?"disabled":""}>&lt; Anterior</button>
          <span>Página ${r} de ${n}</span>
          <button id="next-notes-page" ${r===n?"disabled":""}>Siguiente &gt;</button>
        </div>
        <div class="form-actions">
          <button id="close-all-notes">Cerrar</button>
        </div>
      </div>
    </div>
  `}function O({visible:o,backups:e}){return`
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
  `}function A({visible:o,contactIndex:e}){const c=e!==null?t.contacts[e]:null;return`
    <div id="add-note-modal" class="modal" style="display:${o?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:500px;">
        <h3>Añadir nota diaria</h3>
        ${c?`<p><strong>${c.surname?c.surname+", ":""}${c.name}</strong></p>`:""}
        <form id="add-note-form">
          <label>Fecha <input type="date" id="add-note-date" value="${new Date().toISOString().slice(0,10)}" required /></label>
          <label>Nota <textarea id="add-note-text" rows="4" placeholder="Escribe una nota para este contacto..." required></textarea></label>
          <div class="form-actions">
            <button type="submit">Guardar nota</button>
            <button type="button" id="cancel-add-note">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `}const N="contactos_diarios";let t={contacts:j(),selected:null,editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1,showAddNoteModal:!1,addNoteContactIndex:null,allNotesPage:1};function j(){try{return JSON.parse(localStorage.getItem(N))||[]}catch{return[]}}function h(o){localStorage.setItem(N,JSON.stringify(o))}function m(){const o=document.querySelector("#app"),e=t.editing!==null?t.contacts[t.editing]:null,c=t.selected!==null?t.contacts[t.selected].notes||{}:{};o.innerHTML=`
    <h1>Diario de Contactos</h1>
    <div id="backup-info" style="margin-bottom:0.7rem;font-size:0.98em;color:#3a4a7c;"></div>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <div class="main-grid">
      <div>
        <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
        ${B({})}
        ${$({contacts:t.contacts,filter:t.tagFilter})}
        <button id="show-backup-modal" class="add-btn" style="width:100%;margin-top:0.7rem;background:#06b6d4;">Restaurar copia local</button>
      </div>
      <div>
        ${t.editing!==null?S({contact:e}):""}
        ${t.selected!==null&&t.editing===null?w({notes:c}):""}
      </div>
    </div>
    ${C({contacts:t.contacts,visible:t.showAllNotes,page:t.allNotesPage})}
    ${O({visible:t.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})} <!-- Modal de backup -->
    ${A({visible:t.showAddNoteModal,contactIndex:t.addNoteContactIndex})} <!-- Modal añadir nota -->
  `,L(),D();const i=document.getElementById("show-backup-modal");i&&(i.onclick=()=>{t.showBackupModal=!0,m()});const s=document.getElementById("close-backup-modal");s&&(s.onclick=()=>{t.showBackupModal=!1,m()}),document.querySelectorAll(".add-note-contact").forEach(p=>{p.onclick=b=>{t.addNoteContactIndex=Number(p.dataset.index),t.showAddNoteModal=!0,m()}});const n=document.getElementById("cancel-add-note");n&&(n.onclick=()=>{t.showAddNoteModal=!1,t.addNoteContactIndex=null,m()}),document.querySelectorAll(".restore-backup-btn").forEach(p=>{p.onclick=()=>J(p.dataset.fecha)});const r=document.getElementById("restore-local-backup");r&&(r.onclick=restaurarBackupLocal)}let k=null;function L(){const o=document.getElementById("tag-filter");o&&o.addEventListener("input",a=>{clearTimeout(k),k=setTimeout(()=>{t.tagFilter=o.value,m();const l=document.getElementById("tag-filter");l&&(l.value=t.tagFilter,l.focus(),l.setSelectionRange(t.tagFilter.length,t.tagFilter.length))},300)});const e=document.getElementById("add-contact");e&&(e.onclick=()=>{t.editing=null,t.selected=null,m(),t.editing=t.contacts.length,m()}),document.querySelectorAll(".select-contact").forEach(a=>{a.onclick=l=>{t.selected=Number(a.dataset.index),t.editing=null,m()}}),document.querySelectorAll(".edit-contact").forEach(a=>{a.onclick=l=>{t.editing=Number(a.dataset.index),t.selected=null,m()}}),document.querySelectorAll(".delete-contact").forEach(a=>{a.onclick=l=>{confirm("¿Eliminar este contacto?")&&(t.contacts.splice(Number(a.dataset.index),1),h(t.contacts),t.selected=null,m())}}),document.querySelectorAll(".pin-contact").forEach(a=>{a.onclick=l=>{const d=Number(a.dataset.index);t.contacts[d].pinned&&!confirm("¿Seguro que quieres desfijar este contacto?")||(t.contacts[d].pinned=!t.contacts[d].pinned,h(t.contacts),m())}});const c=document.getElementById("contact-form");c&&(c.onsubmit=a=>{a.preventDefault();const l=Object.fromEntries(new FormData(c));let d=l.tags?l.tags.split(",").map(u=>u.trim()).filter(Boolean):[];delete l.tags,t.editing!==null&&t.editing<t.contacts.length?t.contacts[t.editing]={...t.contacts[t.editing],...l,tags:d}:t.contacts.push({...l,notes:{},tags:d}),h(t.contacts),t.editing=null,m()},document.getElementById("cancel-edit").onclick=()=>{t.editing=null,m()});const i=document.getElementById("add-note-form");i&&t.addNoteContactIndex!==null&&(i.onsubmit=a=>{a.preventDefault();const l=document.getElementById("add-note-date").value,d=document.getElementById("add-note-text").value.trim();if(!l||!d)return;const u=t.addNoteContactIndex;t.contacts[u].notes||(t.contacts[u].notes={}),t.contacts[u].notes[l]=d,h(t.contacts),t.showAddNoteModal=!1,t.addNoteContactIndex=null,m()});const s=document.getElementById("note-form");s&&t.selected!==null&&(s.onsubmit=a=>{a.preventDefault();const l=document.getElementById("note-date").value,d=document.getElementById("note-text").value.trim();!l||!d||(t.contacts[t.selected].notes||(t.contacts[t.selected].notes={}),t.contacts[t.selected].notes[l]=d,h(t.contacts),m())}),document.querySelectorAll(".edit-note").forEach(a=>{a.onclick=l=>{const d=a.dataset.date,u=document.getElementById("edit-note-modal"),f=document.getElementById("edit-note-text");f.value=t.contacts[t.selected].notes[d],u.style.display="block",document.getElementById("save-edit-note").onclick=()=>{t.contacts[t.selected].notes[d]=f.value.trim(),h(t.contacts),u.style.display="none",m()},document.getElementById("cancel-edit-note").onclick=()=>{u.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(a=>{a.onclick=l=>{const d=a.dataset.date;confirm("¿Eliminar la nota de "+d+"?")&&(delete t.contacts[t.selected].notes[d],h(t.contacts),m())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{P(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{F(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{R(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async a=>{const l=a.target.files[0];if(!l)return;const d=await l.text();let u=[];if(l.name.endsWith(".vcf"))u=q(d);else if(l.name.endsWith(".csv"))u=_(d);else if(l.name.endsWith(".json"))try{const f=JSON.parse(d);Array.isArray(f)?u=f:f&&Array.isArray(f.contacts)&&(u=f.contacts)}catch{}if(u.length){const f=y=>t.contacts.some(g=>g.name===y.name&&g.surname===y.surname&&g.phone===y.phone),v=u.filter(y=>!f(y));v.length?(t.contacts=t.contacts.concat(v),h(t.contacts),m()):alert("No se han importado contactos nuevos (todos ya existen).")}};const n=document.getElementById("close-all-notes");n&&(n.onclick=()=>{t.showAllNotes=!1,t.allNotesPage=1,m()});const r=document.getElementById("show-all-notes-btn");r&&(r.onclick=()=>{t.showAllNotes=!0,t.allNotesPage=1,m()});const p=document.getElementById("prev-notes-page");p&&(p.onclick=()=>{t.allNotesPage>1&&(t.allNotesPage--,m())});const b=document.getElementById("next-notes-page");b&&(b.onclick=()=>{let a=[];t.contacts.forEach((d,u)=>{d.notes&&Object.entries(d.notes).forEach(([f,v])=>{a.push({date:f,text:v,contact:d,contactIndex:u})})});const l=Math.max(1,Math.ceil(a.length/4));t.allNotesPage<l&&(t.allNotesPage++,m())}),document.querySelectorAll(".edit-note-link").forEach(a=>{a.onclick=l=>{l.preventDefault();const d=Number(a.dataset.contact),u=a.dataset.date;t.selected=d,t.editing=null,t.showAllNotes=!1,m(),setTimeout(()=>{const f=document.querySelector(`.edit-note[data-date="${u}"]`);f&&f.click()},50)}}),document.querySelectorAll(".share-backup-btn").forEach(a=>{a.onclick=async()=>{const l=a.dataset.fecha,u=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(x=>x.fecha===l);if(!u)return alert("No se encontró la copia seleccionada.");const f=`contactos_backup_${l}.json`,v=JSON.stringify(u.datos,null,2),y=new Blob([v],{type:"application/json"}),g=document.createElement("a");if(g.href=URL.createObjectURL(y),g.download=f,g.style.display="none",document.body.appendChild(g),g.click(),setTimeout(()=>{URL.revokeObjectURL(g.href),g.remove()},1e3),navigator.canShare&&window.File&&window.FileReader)try{const x=new File([y],f,{type:"application/json"});navigator.canShare({files:[x]})&&await navigator.share({files:[x],title:"Backup de Contactos",text:`Copia de seguridad (${l}) de ContactosDiarios`})}catch{}}})}function q(o){const e=[],c=o.split("END:VCARD");for(const i of c){const s=/FN:([^\n]*)/.exec(i)?.[1]?.trim(),n=/N:.*;([^;\n]*)/.exec(i)?.[1]?.trim()||"",r=/TEL.*:(.+)/.exec(i)?.[1]?.trim(),p=/EMAIL.*:(.+)/.exec(i)?.[1]?.trim();s&&e.push({name:s,surname:n,phone:r||"",email:p||"",notes:{},tags:[]})}return e}function M(o){return o.map(e=>`BEGIN:VCARD
VERSION:3.0
FN:${e.name}
N:${e.surname||""};;;;
TEL:${e.phone||""}
EMAIL:${e.email||""}
END:VCARD`).join(`
`)}function _(o){const e=o.split(`
`).filter(Boolean),[c,...i]=e;return i.map(s=>{const[n,r,p,b,a,l]=s.split(",");return{name:n?.trim()||"",surname:r?.trim()||"",phone:p?.trim()||"",email:b?.trim()||"",notes:l?JSON.parse(l):{},tags:a?a.split(";").map(d=>d.trim()):[]}})}function P(){const o=M(t.contacts),e=new Blob([o],{type:"text/vcard"}),c=document.createElement("a");c.href=URL.createObjectURL(e),c.download="contactos.vcf",c.click()}function F(){const o="name,surname,phone,email,tags,notes",e=t.contacts.map(n=>[n.name,n.surname,n.phone,n.email,(n.tags||[]).join(";"),JSON.stringify(n.notes||{})].map(r=>'"'+String(r).replace(/"/g,'""')+'"').join(",")),c=[o,...e].join(`
`),i=new Blob([c],{type:"text/csv"}),s=document.createElement("a");s.href=URL.createObjectURL(i),s.download="contactos.csv",s.click()}function R(){const o=new Blob([JSON.stringify(t.contacts,null,2)],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(o),e.download="contactos.json",e.click()}function I(){const o=new Date().toISOString().slice(0,10);let e=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");e.find(c=>c.fecha===o)||(e.push({fecha:o,datos:t.contacts}),e.length>10&&(e=e.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(e))),localStorage.setItem("contactos_diarios_backup_fecha",o)}setInterval(I,60*60*1e3);I();function D(){const o=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]"),e=document.getElementById("backup-info");e&&(o.length===0?e.textContent="Sin copias locales.":e.innerHTML="Últimas copias locales: "+o.map(c=>`<button class="restore-backup-btn" data-fecha="${c.fecha}">${c.fecha}</button>`).join(" "))}function J(o){if(!confirm("¿Seguro que quieres restaurar la copia de seguridad del "+o+"? Se sobrescribirán los contactos actuales."))return;const c=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(i=>i.fecha===o);c?(t.contacts=c.datos,h(t.contacts),m(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}document.addEventListener("DOMContentLoaded",()=>{m();let o=null;const e=document.createElement("button");e.textContent="📲 Instalar en tu dispositivo",e.className="add-btn",e.style.display="none",e.style.position="fixed",e.style.bottom="1.5rem",e.style.left="50%",e.style.transform="translateX(-50%)",e.style.zIndex="3000",document.body.appendChild(e),window.addEventListener("beforeinstallprompt",c=>{c.preventDefault(),o=c,e.style.display="block"}),e.addEventListener("click",async()=>{if(o){o.prompt();const{outcome:c}=await o.userChoice;c==="accepted"&&(e.style.display="none"),o=null}}),window.addEventListener("appinstalled",()=>{e.style.display="none"})});
