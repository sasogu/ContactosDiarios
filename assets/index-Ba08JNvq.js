(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const e of a)if(e.type==="childList")for(const r of e.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function s(a){const e={};return a.integrity&&(e.integrity=a.integrity),a.referrerPolicy&&(e.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?e.credentials="include":a.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function i(a){if(a.ep)return;a.ep=!0;const e=s(a);fetch(a.href,e)}})();const E="0.0.47";(function(){try{const n=localStorage.getItem("app_version");if(n&&n!==E){const s=localStorage.getItem("contactos_diarios");Object.keys(localStorage).forEach(i=>{i!=="contactos_diarios"&&localStorage.removeItem(i)}),"caches"in window&&caches.keys().then(i=>i.forEach(a=>caches.delete(a))),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(i=>i.forEach(a=>a.unregister())),s&&localStorage.setItem("contactos_diarios",s),location.reload()}localStorage.setItem("app_version",E)}catch{}})();function S({contacts:o,filter:n,onSelect:s,onDelete:i}){let a=n?o.filter(e=>{const r=n.toLowerCase(),p=e.notes?Object.values(e.notes).join(" ").toLowerCase():"";return e.tags?.some(b=>b.toLowerCase().includes(r))||e.name?.toLowerCase().includes(r)||e.surname?.toLowerCase().includes(r)||p.includes(r)}):o;return a=a.slice().sort((e,r)=>r.pinned&&!e.pinned?1:e.pinned&&!r.pinned?-1:(e.surname||"").localeCompare(r.surname||"")),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${n||""}" />
      <ul>
        ${a.length===0?'<li class="empty">Sin contactos</li>':a.map((e,r)=>`
          <li${e.pinned?' class="pinned"':""}>
            <div class="contact-main">
              <button class="select-contact" data-index="${o.indexOf(e)}">${e.surname?e.surname+", ":""}${e.name}</button>
              <span class="tags">${(e.tags||[]).map(p=>`<span class='tag'>${p}</span>`).join(" ")}</span>
              <button class="pin-contact" data-index="${o.indexOf(e)}" title="${e.pinned?"Desfijar":"Fijar"}">${e.pinned?"📌":"📍"}</button>
            </div>
            <div class="contact-info">
              ${e.phone?`<a href="tel:${e.phone}" class="contact-link" title="Llamar"><span>📞</span> ${e.phone}</a>`:""}
              ${e.email?`<a href="mailto:${e.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${e.email}</a>`:""}
            </div>
            <button class="add-note-contact" data-index="${o.indexOf(e)}" title="Añadir nota">📝</button>
            <button class="edit-contact" data-index="${o.indexOf(e)}" title="Editar">✏️</button>
            <button class="delete-contact" data-index="${o.indexOf(e)}" title="Eliminar">🗑️</button>
          </li>
        `).join("")}
      </ul>
    </div>
  `}function $({contact:o}){return`
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
  `}function w({notes:o}){const n=new Date;return`
    <div class="notes-area">
      <h3>Notas diarias</h3>
      <form id="note-form">
        <input type="date" id="note-date" value="${new Date(n.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10)}" required />
        <textarea id="note-text" rows="3" placeholder="Escribe una nota para la fecha seleccionada..."></textarea>
        <button type="submit">Guardar nota</button>
      </form>
      <ul class="note-history">
        ${Object.entries(o||{}).sort((a,e)=>e[0].localeCompare(a[0])).map(([a,e])=>`
          <li>
            <b>${a}</b>:
            <span class="note-content" data-date="${a}">${e}</span>
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
  `}function C({contacts:o,visible:n,page:s=1}){let i=[];o.forEach((c,l)=>{c.notes&&Object.entries(c.notes).forEach(([d,u])=>{i.push({date:d,text:u,contact:c,contactIndex:l})})}),i.sort((c,l)=>l.date.localeCompare(c.date));const a=4,e=Math.max(1,Math.ceil(i.length/a)),r=Math.min(Math.max(s,1),e),p=(r-1)*a,b=i.slice(p,p+a);return`
    <div id="all-notes-modal" class="modal" style="display:${n?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${i.length===0?"<li>No hay notas registradas.</li>":b.map(c=>`
            <li>
              <b>${c.date}</b> — <span style="color:#3a4a7c">${c.contact.surname?c.contact.surname+", ":""}${c.contact.name}</span><br/>
              <span>${c.text}</span>
              <a href="#" class="edit-note-link" data-contact="${c.contactIndex}" data-date="${c.date}" style="margin-left:0.5em;color:#646cff;font-size:0.95em;">Editar nota</a>
            </li>
          `).join("")}
        </ul>
        <div class="pagination" style="display:flex;justify-content:center;align-items:center;gap:1em;margin:1em 0;">
          <button id="prev-notes-page" ${r===1?"disabled":""}>&lt; Anterior</button>
          <span>Página ${r} de ${e}</span>
          <button id="next-notes-page" ${r===e?"disabled":""}>Siguiente &gt;</button>
        </div>
        <div class="form-actions">
          <button id="close-all-notes">Cerrar</button>
        </div>
      </div>
    </div>
  `}function O({visible:o,backups:n}){return`
    <div id="backup-modal" class="modal" style="display:${o?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:400px;">
        <h3>Restaurar copia local</h3>
        <div class="backup-btns" style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;">
          ${n.length===0?"<span>Sin copias locales.</span>":n.map(s=>`
            <div class="backup-btn-group" style="display:flex;align-items:center;gap:0.3rem;">
              <button class="restore-backup-btn" data-fecha="${s.fecha}">${s.fecha}</button>
              <button class="share-backup-btn" data-fecha="${s.fecha}" title="Compartir backup" style="background:#06b6d4;padding:0.4rem 0.7rem;font-size:1.1em;">📤</button>
            </div>
          `).join("")}
        </div>
        <div class="form-actions" style="margin-top:1.2rem;"><button id="close-backup-modal">Cerrar</button></div>
      </div>
    </div>
  `}function A({visible:o,contactIndex:n}){const s=n!==null?t.contacts[n]:null,i=new Date,e=new Date(i.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);return`
    <div id="add-note-modal" class="modal" style="display:${o?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:500px;">
        <h3>Añadir nota diaria</h3>
        ${s?`<p><strong>${s.surname?s.surname+", ":""}${s.name}</strong></p>`:""}
        <form id="add-note-form">
          <label>Fecha <input type="date" id="add-note-date" value="${e}" required /></label>
          <label>Nota <textarea id="add-note-text" rows="4" placeholder="Escribe una nota para este contacto..." required></textarea></label>
          <div class="form-actions">
            <button type="submit">Guardar nota</button>
            <button type="button" id="cancel-add-note">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `}const N="contactos_diarios";let t={contacts:j(),selected:null,editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1,showAddNoteModal:!1,addNoteContactIndex:null,allNotesPage:1};function j(){try{return JSON.parse(localStorage.getItem(N))||[]}catch{return[]}}function h(o){localStorage.setItem(N,JSON.stringify(o))}function m(){const o=document.querySelector("#app"),n=t.editing!==null?t.contacts[t.editing]:null,s=t.selected!==null?t.contacts[t.selected].notes||{}:{};o.innerHTML=`
    <h1>Diario de Contactos</h1>
    <div id="backup-info" style="margin-bottom:0.7rem;font-size:0.98em;color:#3a4a7c;"></div>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <div class="main-grid">
      <div>
        <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
        ${B({})}
        ${S({contacts:t.contacts,filter:t.tagFilter})}
        <button id="show-backup-modal" class="add-btn" style="width:100%;margin-top:0.7rem;background:#06b6d4;">Restaurar copia local</button>
      </div>
      <div>
        ${t.editing!==null?$({contact:n}):""}
        ${t.selected!==null&&t.editing===null?w({notes:s}):""}
      </div>
    </div>
    ${C({contacts:t.contacts,visible:t.showAllNotes,page:t.allNotesPage})}
    ${O({visible:t.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})} <!-- Modal de backup -->
    ${A({visible:t.showAddNoteModal,contactIndex:t.addNoteContactIndex})} <!-- Modal añadir nota -->
  `,L(),R();const i=document.getElementById("show-backup-modal");i&&(i.onclick=()=>{t.showBackupModal=!0,m()});const a=document.getElementById("close-backup-modal");a&&(a.onclick=()=>{t.showBackupModal=!1,m()}),document.querySelectorAll(".add-note-contact").forEach(p=>{p.onclick=b=>{t.addNoteContactIndex=Number(p.dataset.index),t.showAddNoteModal=!0,m()}});const e=document.getElementById("cancel-add-note");e&&(e.onclick=()=>{t.showAddNoteModal=!1,t.addNoteContactIndex=null,m()}),document.querySelectorAll(".restore-backup-btn").forEach(p=>{p.onclick=()=>J(p.dataset.fecha)});const r=document.getElementById("restore-local-backup");r&&(r.onclick=restaurarBackupLocal)}let k=null;function L(){const o=document.getElementById("tag-filter");o&&o.addEventListener("input",c=>{clearTimeout(k),k=setTimeout(()=>{t.tagFilter=o.value,m();const l=document.getElementById("tag-filter");l&&(l.value=t.tagFilter,l.focus(),l.setSelectionRange(t.tagFilter.length,t.tagFilter.length))},300)});const n=document.getElementById("add-contact");n&&(n.onclick=()=>{t.editing=null,t.selected=null,m(),t.editing=t.contacts.length,m()}),document.querySelectorAll(".select-contact").forEach(c=>{c.onclick=l=>{t.selected=Number(c.dataset.index),t.editing=null,m()}}),document.querySelectorAll(".edit-contact").forEach(c=>{c.onclick=l=>{t.editing=Number(c.dataset.index),t.selected=null,m()}}),document.querySelectorAll(".delete-contact").forEach(c=>{c.onclick=l=>{confirm("¿Eliminar este contacto?")&&(t.contacts.splice(Number(c.dataset.index),1),h(t.contacts),t.selected=null,m())}}),document.querySelectorAll(".pin-contact").forEach(c=>{c.onclick=l=>{const d=Number(c.dataset.index);t.contacts[d].pinned&&!confirm("¿Seguro que quieres desfijar este contacto?")||(t.contacts[d].pinned=!t.contacts[d].pinned,h(t.contacts),m())}});const s=document.getElementById("contact-form");s&&(s.onsubmit=c=>{c.preventDefault();const l=Object.fromEntries(new FormData(s));let d=l.tags?l.tags.split(",").map(u=>u.trim()).filter(Boolean):[];delete l.tags,t.editing!==null&&t.editing<t.contacts.length?t.contacts[t.editing]={...t.contacts[t.editing],...l,tags:d}:t.contacts.push({...l,notes:{},tags:d}),h(t.contacts),t.editing=null,m()},document.getElementById("cancel-edit").onclick=()=>{t.editing=null,m()});const i=document.getElementById("add-note-form");i&&t.addNoteContactIndex!==null&&(i.onsubmit=c=>{c.preventDefault();const l=document.getElementById("add-note-date").value,d=document.getElementById("add-note-text").value.trim();if(!l||!d)return;const u=t.addNoteContactIndex;t.contacts[u].notes||(t.contacts[u].notes={}),t.contacts[u].notes[l]?t.contacts[u].notes[l]+=`
`+d:t.contacts[u].notes[l]=d,h(t.contacts),t.showAddNoteModal=!1,t.addNoteContactIndex=null,m()});const a=document.getElementById("note-form");a&&t.selected!==null&&(a.onsubmit=c=>{c.preventDefault();const l=document.getElementById("note-date").value,d=document.getElementById("note-text").value.trim();!l||!d||(t.contacts[t.selected].notes||(t.contacts[t.selected].notes={}),t.contacts[t.selected].notes[l]?t.contacts[t.selected].notes[l]+=`
`+d:t.contacts[t.selected].notes[l]=d,h(t.contacts),m())}),document.querySelectorAll(".edit-note").forEach(c=>{c.onclick=l=>{const d=c.dataset.date,u=document.getElementById("edit-note-modal"),f=document.getElementById("edit-note-text");f.value=t.contacts[t.selected].notes[d],u.style.display="block",document.getElementById("save-edit-note").onclick=()=>{t.contacts[t.selected].notes[d]=f.value.trim(),h(t.contacts),u.style.display="none",m()},document.getElementById("cancel-edit-note").onclick=()=>{u.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(c=>{c.onclick=l=>{const d=c.dataset.date;confirm("¿Eliminar la nota de "+d+"?")&&(delete t.contacts[t.selected].notes[d],h(t.contacts),m())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{_(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{P(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{F(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async c=>{const l=c.target.files[0];if(!l)return;const d=await l.text();let u=[];if(l.name.endsWith(".vcf"))u=D(d);else if(l.name.endsWith(".csv"))u=q(d);else if(l.name.endsWith(".json"))try{const f=JSON.parse(d);Array.isArray(f)?u=f:f&&Array.isArray(f.contacts)&&(u=f.contacts)}catch{}if(u.length){const f=y=>t.contacts.some(g=>g.name===y.name&&g.surname===y.surname&&g.phone===y.phone),v=u.filter(y=>!f(y));v.length?(t.contacts=t.contacts.concat(v),h(t.contacts),m()):alert("No se han importado contactos nuevos (todos ya existen).")}};const e=document.getElementById("close-all-notes");e&&(e.onclick=()=>{t.showAllNotes=!1,t.allNotesPage=1,m()});const r=document.getElementById("show-all-notes-btn");r&&(r.onclick=()=>{t.showAllNotes=!0,t.allNotesPage=1,m()});const p=document.getElementById("prev-notes-page");p&&(p.onclick=()=>{t.allNotesPage>1&&(t.allNotesPage--,m())});const b=document.getElementById("next-notes-page");b&&(b.onclick=()=>{let c=[];t.contacts.forEach((d,u)=>{d.notes&&Object.entries(d.notes).forEach(([f,v])=>{c.push({date:f,text:v,contact:d,contactIndex:u})})});const l=Math.max(1,Math.ceil(c.length/4));t.allNotesPage<l&&(t.allNotesPage++,m())}),document.querySelectorAll(".edit-note-link").forEach(c=>{c.onclick=l=>{l.preventDefault();const d=Number(c.dataset.contact),u=c.dataset.date;t.selected=d,t.editing=null,t.showAllNotes=!1,m(),setTimeout(()=>{const f=document.querySelector(`.edit-note[data-date="${u}"]`);f&&f.click()},50)}}),document.querySelectorAll(".share-backup-btn").forEach(c=>{c.onclick=async()=>{const l=c.dataset.fecha,u=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(x=>x.fecha===l);if(!u)return alert("No se encontró la copia seleccionada.");const f=`contactos_backup_${l}.json`,v=JSON.stringify(u.datos,null,2),y=new Blob([v],{type:"application/json"}),g=document.createElement("a");if(g.href=URL.createObjectURL(y),g.download=f,g.style.display="none",document.body.appendChild(g),g.click(),setTimeout(()=>{URL.revokeObjectURL(g.href),g.remove()},1e3),navigator.canShare&&window.File&&window.FileReader)try{const x=new File([y],f,{type:"application/json"});navigator.canShare({files:[x]})&&await navigator.share({files:[x],title:"Backup de Contactos",text:`Copia de seguridad (${l}) de ContactosDiarios`})}catch{}}})}function D(o){const n=[],s=o.split("END:VCARD");for(const i of s){const a=/FN:([^\n]*)/.exec(i)?.[1]?.trim(),e=/N:.*;([^;\n]*)/.exec(i)?.[1]?.trim()||"",r=/TEL.*:(.+)/.exec(i)?.[1]?.trim(),p=/EMAIL.*:(.+)/.exec(i)?.[1]?.trim();a&&n.push({name:a,surname:e,phone:r||"",email:p||"",notes:{},tags:[]})}return n}function M(o){return o.map(n=>`BEGIN:VCARD
VERSION:3.0
FN:${n.name}
N:${n.surname||""};;;;
TEL:${n.phone||""}
EMAIL:${n.email||""}
END:VCARD`).join(`
`)}function q(o){const n=o.split(`
`).filter(Boolean),[s,...i]=n;return i.map(a=>{const[e,r,p,b,c,l]=a.split(",");return{name:e?.trim()||"",surname:r?.trim()||"",phone:p?.trim()||"",email:b?.trim()||"",notes:l?JSON.parse(l):{},tags:c?c.split(";").map(d=>d.trim()):[]}})}function _(){const o=M(t.contacts),n=new Blob([o],{type:"text/vcard"}),s=document.createElement("a");s.href=URL.createObjectURL(n),s.download="contactos.vcf",s.click()}function P(){const o="name,surname,phone,email,tags,notes",n=t.contacts.map(e=>[e.name,e.surname,e.phone,e.email,(e.tags||[]).join(";"),JSON.stringify(e.notes||{})].map(r=>'"'+String(r).replace(/"/g,'""')+'"').join(",")),s=[o,...n].join(`
`),i=new Blob([s],{type:"text/csv"}),a=document.createElement("a");a.href=URL.createObjectURL(i),a.download="contactos.csv",a.click()}function F(){const o=new Blob([JSON.stringify(t.contacts,null,2)],{type:"application/json"}),n=document.createElement("a");n.href=URL.createObjectURL(o),n.download="contactos.json",n.click()}function I(){const o=new Date,s=new Date(o.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);let i=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");i.find(a=>a.fecha===s)||(i.push({fecha:s,datos:t.contacts}),i.length>10&&(i=i.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(i))),localStorage.setItem("contactos_diarios_backup_fecha",s)}setInterval(I,60*60*1e3);I();function R(){const o=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]"),n=document.getElementById("backup-info");n&&(o.length===0?n.textContent="Sin copias locales.":n.innerHTML="Últimas copias locales: "+o.map(s=>`<button class="restore-backup-btn" data-fecha="${s.fecha}">${s.fecha}</button>`).join(" "))}function J(o){if(!confirm("¿Seguro que quieres restaurar la copia de seguridad del "+o+"? Se sobrescribirán los contactos actuales."))return;const s=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(i=>i.fecha===o);s?(t.contacts=s.datos,h(t.contacts),m(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}document.addEventListener("DOMContentLoaded",()=>{m();let o=null;const n=document.createElement("button");n.textContent="📲 Instalar en tu dispositivo",n.className="add-btn",n.style.display="none",n.style.position="fixed",n.style.bottom="1.5rem",n.style.left="50%",n.style.transform="translateX(-50%)",n.style.zIndex="3000",document.body.appendChild(n),window.addEventListener("beforeinstallprompt",s=>{s.preventDefault(),o=s,n.style.display="block"}),n.addEventListener("click",async()=>{if(o){o.prompt();const{outcome:s}=await o.userChoice;s==="accepted"&&(n.style.display="none"),o=null}}),window.addEventListener("appinstalled",()=>{n.style.display="none"})});
