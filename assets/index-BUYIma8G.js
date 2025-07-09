(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))c(l);new MutationObserver(l=>{for(const n of l)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&c(o)}).observe(document,{childList:!0,subtree:!0});function i(l){const n={};return l.integrity&&(n.integrity=l.integrity),l.referrerPolicy&&(n.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?n.credentials="include":l.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function c(l){if(l.ep)return;l.ep=!0;const n=i(l);fetch(l.href,n)}})();const f="0.0.14";(function(){try{const e=localStorage.getItem("app_version");if(e&&e!==f){const i=localStorage.getItem("contactos_diarios");Object.keys(localStorage).forEach(c=>{c!=="contactos_diarios"&&localStorage.removeItem(c)}),"caches"in window&&caches.keys().then(c=>c.forEach(l=>caches.delete(l))),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(c=>c.forEach(l=>l.unregister())),i&&localStorage.setItem("contactos_diarios",i),location.reload()}localStorage.setItem("app_version",f)}catch{}})();function b({contacts:a,filter:e,onSelect:i,onDelete:c}){let l=e?a.filter(n=>{const o=e.toLowerCase(),s=n.notes?Object.values(n.notes).join(" ").toLowerCase():"";return n.tags?.some(r=>r.toLowerCase().includes(o))||n.name?.toLowerCase().includes(o)||n.surname?.toLowerCase().includes(o)||s.includes(o)}):a;return l=l.slice().sort((n,o)=>o.pinned&&!n.pinned?1:n.pinned&&!o.pinned?-1:(n.surname||"").localeCompare(o.surname||"")),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${e||""}" />
      <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
      <ul>
        ${l.length===0?'<li class="empty">Sin contactos</li>':l.map((n,o)=>`
          <li${n.pinned?' class="pinned"':""}>
            <div class="contact-main">
              <button class="select-contact" data-index="${a.indexOf(n)}">${n.surname?n.surname+", ":""}${n.name}</button>
              <span class="tags">${(n.tags||[]).map(s=>`<span class='tag'>${s}</span>`).join(" ")}</span>
              <button class="pin-contact" data-index="${a.indexOf(n)}" title="${n.pinned?"Desfijar":"Fijar"}">${n.pinned?"📌":"📍"}</button>
            </div>
            <div class="contact-info">
              ${n.phone?`<a href="tel:${n.phone}" class="contact-link" title="Llamar"><span>📞</span> ${n.phone}</a>`:""}
              ${n.email?`<a href="mailto:${n.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${n.email}</a>`:""}
            </div>
            <button class="edit-contact" data-index="${a.indexOf(n)}" title="Editar">✏️</button>
            <button class="delete-contact" data-index="${a.indexOf(n)}" title="Eliminar">🗑️</button>
          </li>
        `).join("")}
      </ul>
    </div>
  `}function h({contact:a}){return`
    <form id="contact-form">
      <h2>${a?"Editar":"Nuevo"} contacto</h2>
      <label>Nombre <input name="name" placeholder="Nombre" value="${a?.name||""}" required /></label>
      <label>Apellidos <input name="surname" placeholder="Apellidos" value="${a?.surname||""}" required /></label>
      <label>Teléfono <input name="phone" placeholder="Teléfono" value="${a?.phone||""}" pattern="[0-9+-() ]*" /></label>
      <label>Email <input name="email" placeholder="Email" value="${a?.email||""}" type="email" /></label>
      <label>Etiquetas <input name="tags" placeholder="Ej: familia, trabajo" value="${a?.tags?.join(", ")||""}" /></label>
      <div class="form-actions">
        <button type="submit">Guardar</button>
        <button type="button" id="cancel-edit">Cancelar</button>
      </div>
    </form>
  `}function v({notes:a}){return`
    <div class="notes-area">
      <h3>Notas diarias</h3>
      <form id="note-form">
        <input type="date" id="note-date" value="${new Date().toISOString().slice(0,10)}" required />
        <textarea id="note-text" rows="3" placeholder="Escribe una nota para la fecha seleccionada..."></textarea>
        <button type="submit">Guardar nota</button>
      </form>
      <ul class="note-history">
        ${Object.entries(a||{}).sort((e,i)=>i[0].localeCompare(e[0])).map(([e,i])=>`
          <li>
            <b>${e}</b>:
            <span class="note-content" data-date="${e}">${i}</span>
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
  `}function E({}){return`
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
  `}function x({contacts:a,visible:e}){let i=[];return a.forEach((c,l)=>{c.notes&&Object.entries(c.notes).forEach(([n,o])=>{i.push({date:n,text:o,contact:c,contactIndex:l})})}),i.sort((c,l)=>l.date.localeCompare(c.date)),`
    <div id="all-notes-modal" class="modal" style="display:${e?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${i.length===0?"<li>No hay notas registradas.</li>":i.map(c=>`
            <li>
              <b>${c.date}</b> — <span style="color:#3a4a7c">${c.contact.surname?c.contact.surname+", ":""}${c.contact.name}</span><br/>
              <span>${c.text}</span>
              <a href="#" class="edit-note-link" data-contact="${c.contactIndex}" data-date="${c.date}" style="margin-left:0.5em;color:#646cff;font-size:0.95em;">Editar nota</a>
            </li>
          `).join("")}
        </ul>
        <div class="form-actions">
          <button id="close-all-notes">Cerrar</button>
        </div>
      </div>
    </div>
  `}const g="contactos_diarios";let t={contacts:I(),selected:null,editing:null,tagFilter:"",showAllNotes:!1};function I(){try{return JSON.parse(localStorage.getItem(g))||[]}catch{return[]}}function p(a){localStorage.setItem(g,JSON.stringify(a))}function d(){const a=document.querySelector("#app"),e=t.editing!==null?t.contacts[t.editing]:null,i=t.selected!==null?t.contacts[t.selected].notes||{}:{};a.innerHTML=`
    <h1>Diario de Contactos</h1>
    <div class="main-grid">
      <div>
        <button id="show-all-notes-btn" class="add-btn" style="width:100%;margin-bottom:1rem;">🗒️ Ver todas las notas</button>
        ${b({contacts:t.contacts,filter:t.tagFilter})}
        ${E({})}
      </div>
      <div>
        ${t.editing!==null?h({contact:e}):""}
        ${t.selected!==null&&t.editing===null?v({notes:i}):""}
      </div>
    </div>
    ${x({contacts:t.contacts,visible:t.showAllNotes})}
  `,$()}function $(){const a=document.getElementById("tag-filter");a&&a.addEventListener("input",o=>{t.tagFilter=a.value,d();const s=document.getElementById("tag-filter");s&&(s.value=t.tagFilter,s.focus(),s.setSelectionRange(t.tagFilter.length,t.tagFilter.length))});const e=document.getElementById("add-contact");e&&(e.onclick=()=>{t.editing=null,t.selected=null,d(),t.editing=t.contacts.length,d()}),document.querySelectorAll(".select-contact").forEach(o=>{o.onclick=s=>{t.selected=Number(o.dataset.index),t.editing=null,d()}}),document.querySelectorAll(".edit-contact").forEach(o=>{o.onclick=s=>{t.editing=Number(o.dataset.index),t.selected=null,d()}}),document.querySelectorAll(".delete-contact").forEach(o=>{o.onclick=s=>{confirm("¿Eliminar este contacto?")&&(t.contacts.splice(Number(o.dataset.index),1),p(t.contacts),t.selected=null,d())}}),document.querySelectorAll(".pin-contact").forEach(o=>{o.onclick=s=>{const r=Number(o.dataset.index);t.contacts[r].pinned=!t.contacts[r].pinned,p(t.contacts),d()}});const i=document.getElementById("contact-form");i&&(i.onsubmit=o=>{o.preventDefault();const s=Object.fromEntries(new FormData(i));let r=s.tags?s.tags.split(",").map(u=>u.trim()).filter(Boolean):[];delete s.tags,t.editing!==null&&t.editing<t.contacts.length?t.contacts[t.editing]={...t.contacts[t.editing],...s,tags:r}:t.contacts.push({...s,notes:{},tags:r}),p(t.contacts),t.editing=null,d()},document.getElementById("cancel-edit").onclick=()=>{t.editing=null,d()});const c=document.getElementById("note-form");c&&t.selected!==null&&(c.onsubmit=o=>{o.preventDefault();const s=document.getElementById("note-date").value,r=document.getElementById("note-text").value.trim();!s||!r||(t.contacts[t.selected].notes||(t.contacts[t.selected].notes={}),t.contacts[t.selected].notes[s]=r,p(t.contacts),d())}),document.querySelectorAll(".edit-note").forEach(o=>{o.onclick=s=>{const r=o.dataset.date,u=document.getElementById("edit-note-modal"),m=document.getElementById("edit-note-text");m.value=t.contacts[t.selected].notes[r],u.style.display="block",document.getElementById("save-edit-note").onclick=()=>{t.contacts[t.selected].notes[r]=m.value.trim(),p(t.contacts),u.style.display="none",d()},document.getElementById("cancel-edit-note").onclick=()=>{u.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(o=>{o.onclick=s=>{const r=o.dataset.date;confirm("¿Eliminar la nota de "+r+"?")&&(delete t.contacts[t.selected].notes[r],p(t.contacts),d())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{w(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{C(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{O(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async o=>{const s=o.target.files[0];if(!s)return;const r=await s.text();let u=[];if(s.name.endsWith(".vcf"))u=N(r);else if(s.name.endsWith(".csv"))u=B(r);else if(s.name.endsWith(".json"))try{u=JSON.parse(r)}catch{}u.length&&(t.contacts=t.contacts.concat(u),p(t.contacts),d())};const l=document.getElementById("close-all-notes");l&&(l.onclick=()=>{t.showAllNotes=!1,d()});const n=document.getElementById("show-all-notes-btn");n&&(n.onclick=()=>{t.showAllNotes=!0,d()}),document.querySelectorAll(".edit-note-link").forEach(o=>{o.onclick=s=>{s.preventDefault();const r=Number(o.dataset.contact),u=o.dataset.date;t.selected=r,t.editing=null,t.showAllNotes=!1,d(),setTimeout(()=>{const m=document.querySelector(`.edit-note[data-date="${u}"]`);m&&m.click()},50)}})}function N(a){const e=[],i=a.split("END:VCARD");for(const c of i){const l=/FN:([^\n]*)/.exec(c)?.[1]?.trim(),n=/N:.*;([^;\n]*)/.exec(c)?.[1]?.trim()||"",o=/TEL.*:(.+)/.exec(c)?.[1]?.trim(),s=/EMAIL.*:(.+)/.exec(c)?.[1]?.trim();l&&e.push({name:l,surname:n,phone:o||"",email:s||"",notes:{},tags:[]})}return e}function S(a){return a.map(e=>`BEGIN:VCARD
VERSION:3.0
FN:${e.name}
N:${e.surname||""};;;;
TEL:${e.phone||""}
EMAIL:${e.email||""}
END:VCARD`).join(`
`)}function B(a){const e=a.split(`
`).filter(Boolean),[i,...c]=e;return c.map(l=>{const[n,o,s,r,u,m]=l.split(",");return{name:n?.trim()||"",surname:o?.trim()||"",phone:s?.trim()||"",email:r?.trim()||"",notes:m?JSON.parse(m):{},tags:u?u.split(";").map(y=>y.trim()):[]}})}function w(){const a=S(t.contacts),e=new Blob([a],{type:"text/vcard"}),i=document.createElement("a");i.href=URL.createObjectURL(e),i.download="contactos.vcf",i.click()}function C(){const a="name,surname,phone,email,tags,notes",e=t.contacts.map(n=>[n.name,n.surname,n.phone,n.email,(n.tags||[]).join(";"),JSON.stringify(n.notes||{})].map(o=>'"'+String(o).replace(/"/g,'""')+'"').join(",")),i=[a,...e].join(`
`),c=new Blob([i],{type:"text/csv"}),l=document.createElement("a");l.href=URL.createObjectURL(c),l.download="contactos.csv",l.click()}function O(){const a=new Blob([JSON.stringify(t.contacts,null,2)],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(a),e.download="contactos.json",e.click()}document.addEventListener("DOMContentLoaded",()=>{d();let a=null;const e=document.createElement("button");e.textContent="📲 Instalar en tu dispositivo",e.className="add-btn",e.style.display="none",e.style.position="fixed",e.style.bottom="1.5rem",e.style.left="50%",e.style.transform="translateX(-50%)",e.style.zIndex="3000",document.body.appendChild(e),window.addEventListener("beforeinstallprompt",i=>{i.preventDefault(),a=i,e.style.display="block"}),e.addEventListener("click",async()=>{if(a){a.prompt();const{outcome:i}=await a.userChoice;i==="accepted"&&(e.style.display="none"),a=null}}),window.addEventListener("appinstalled",()=>{e.style.display="none"})});
