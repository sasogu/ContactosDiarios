(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const e of n)if(e.type==="childList")for(const c of e.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&l(c)}).observe(document,{childList:!0,subtree:!0});function i(n){const e={};return n.integrity&&(e.integrity=n.integrity),n.referrerPolicy&&(e.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?e.credentials="include":n.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function l(n){if(n.ep)return;n.ep=!0;const e=i(n);fetch(n.href,e)}})();const f="0.0.2";(function(){try{const o=localStorage.getItem("app_version");o&&o!==f&&(localStorage.clear(),"caches"in window&&caches.keys().then(i=>i.forEach(l=>caches.delete(l))),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(i=>i.forEach(l=>l.unregister())),location.reload()),localStorage.setItem("app_version",f)}catch{}})();function v({contacts:a,filter:o,onSelect:i,onDelete:l}){let n=o?a.filter(e=>e.tags?.some(c=>c.toLowerCase().includes(o.toLowerCase()))||e.name?.toLowerCase().includes(o.toLowerCase())||e.surname?.toLowerCase().includes(o.toLowerCase())):a;return n=n.slice().sort((e,c)=>c.pinned&&!e.pinned?1:e.pinned&&!c.pinned?-1:(e.surname||"").localeCompare(c.surname||"")),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos o etiqueta..." value="${o||""}" />
      <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
      <ul>
        ${n.length===0?'<li class="empty">Sin contactos</li>':n.map((e,c)=>`
          <li${e.pinned?' class="pinned"':""}>
            <div class="contact-main">
              <button class="select-contact" data-index="${a.indexOf(e)}">${e.surname?e.surname+", ":""}${e.name}</button>
              <span class="tags">${(e.tags||[]).map(s=>`<span class='tag'>${s}</span>`).join(" ")}</span>
              <button class="pin-contact" data-index="${a.indexOf(e)}" title="${e.pinned?"Desfijar":"Fijar"}">${e.pinned?"📌":"📍"}</button>
            </div>
            <div class="contact-info">
              ${e.phone?`<a href="tel:${e.phone}" class="contact-link" title="Llamar"><span>📞</span> ${e.phone}</a>`:""}
              ${e.email?`<a href="mailto:${e.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${e.email}</a>`:""}
            </div>
            <button class="edit-contact" data-index="${a.indexOf(e)}" title="Editar">✏️</button>
            <button class="delete-contact" data-index="${a.indexOf(e)}" title="Eliminar">🗑️</button>
          </li>
        `).join("")}
      </ul>
    </div>
  `}function b({contact:a}){return`
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
  `}function h({notes:a}){return`
    <div class="notes-area">
      <h3>Notas diarias</h3>
      <form id="note-form">
        <input type="date" id="note-date" value="${new Date().toISOString().slice(0,10)}" required />
        <textarea id="note-text" rows="3" placeholder="Escribe una nota para la fecha seleccionada..."></textarea>
        <button type="submit">Guardar nota</button>
      </form>
      <ul class="note-history">
        ${Object.entries(a||{}).sort((o,i)=>i[0].localeCompare(o[0])).map(([o,i])=>`
          <li>
            <b>${o}</b>:
            <span class="note-content" data-date="${o}">${i}</span>
            <button class="edit-note" data-date="${o}" title="Editar">✏️</button>
            <button class="delete-note" data-date="${o}" title="Eliminar">🗑️</button>
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
  `}const g="contactos_diarios";let t={contacts:x(),selected:null,editing:null,tagFilter:""};function x(){try{return JSON.parse(localStorage.getItem(g))||[]}catch{return[]}}function d(a){localStorage.setItem(g,JSON.stringify(a))}function r(){const a=document.querySelector("#app"),o=t.editing!==null?t.contacts[t.editing]:null,i=t.selected!==null?t.contacts[t.selected].notes||{}:{};a.innerHTML=`
    <h1>Diario de Contactos</h1>
    <div class="main-grid">
      <div>
        ${v({contacts:t.contacts,filter:t.tagFilter})}
        ${E({})}
      </div>
      <div>
        ${t.editing!==null?b({contact:o}):""}
        ${t.selected!==null&&t.editing===null?h({notes:i}):""}
      </div>
    </div>
  `,I()}function I(){const a=document.getElementById("tag-filter");a&&a.addEventListener("input",n=>{t.tagFilter=a.value,r();const e=document.getElementById("tag-filter");e&&(e.value=t.tagFilter,e.focus(),e.setSelectionRange(t.tagFilter.length,t.tagFilter.length))});const o=document.getElementById("add-contact");o&&(o.onclick=()=>{t.editing=null,t.selected=null,r(),t.editing=t.contacts.length,r()}),document.querySelectorAll(".select-contact").forEach(n=>{n.onclick=e=>{t.selected=Number(n.dataset.index),t.editing=null,r()}}),document.querySelectorAll(".edit-contact").forEach(n=>{n.onclick=e=>{t.editing=Number(n.dataset.index),t.selected=null,r()}}),document.querySelectorAll(".delete-contact").forEach(n=>{n.onclick=e=>{confirm("¿Eliminar este contacto?")&&(t.contacts.splice(Number(n.dataset.index),1),d(t.contacts),t.selected=null,r())}}),document.querySelectorAll(".pin-contact").forEach(n=>{n.onclick=e=>{const c=Number(n.dataset.index);t.contacts[c].pinned=!t.contacts[c].pinned,d(t.contacts),r()}});const i=document.getElementById("contact-form");i&&(i.onsubmit=n=>{n.preventDefault();const e=Object.fromEntries(new FormData(i));let c=e.tags?e.tags.split(",").map(s=>s.trim()).filter(Boolean):[];delete e.tags,t.editing!==null&&t.editing<t.contacts.length?t.contacts[t.editing]={...t.contacts[t.editing],...e,tags:c}:t.contacts.push({...e,notes:{},tags:c}),d(t.contacts),t.editing=null,r()},document.getElementById("cancel-edit").onclick=()=>{t.editing=null,r()});const l=document.getElementById("note-form");l&&t.selected!==null&&(l.onsubmit=n=>{n.preventDefault();const e=document.getElementById("note-date").value,c=document.getElementById("note-text").value.trim();!e||!c||(t.contacts[t.selected].notes||(t.contacts[t.selected].notes={}),t.contacts[t.selected].notes[e]=c,d(t.contacts),r())}),document.querySelectorAll(".edit-note").forEach(n=>{n.onclick=e=>{const c=n.dataset.date,s=document.getElementById("edit-note-modal"),u=document.getElementById("edit-note-text");u.value=t.contacts[t.selected].notes[c],s.style.display="block",document.getElementById("save-edit-note").onclick=()=>{t.contacts[t.selected].notes[c]=u.value.trim(),d(t.contacts),s.style.display="none",r()},document.getElementById("cancel-edit-note").onclick=()=>{s.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(n=>{n.onclick=e=>{const c=n.dataset.date;confirm("¿Eliminar la nota de "+c+"?")&&(delete t.contacts[t.selected].notes[c],d(t.contacts),r())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{C(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{N(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{O(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async n=>{const e=n.target.files[0];if(!e)return;const c=await e.text();let s=[];if(e.name.endsWith(".vcf"))s=$(c);else if(e.name.endsWith(".csv"))s=S(c);else if(e.name.endsWith(".json"))try{s=JSON.parse(c)}catch{}s.length&&(t.contacts=t.contacts.concat(s),d(t.contacts),r())}}function $(a){const o=[],i=a.split("END:VCARD");for(const l of i){const n=/FN:([^\n]*)/.exec(l)?.[1]?.trim(),e=/N:.*;([^;\n]*)/.exec(l)?.[1]?.trim()||"",c=/TEL.*:(.+)/.exec(l)?.[1]?.trim(),s=/EMAIL.*:(.+)/.exec(l)?.[1]?.trim();n&&o.push({name:n,surname:e,phone:c||"",email:s||"",notes:{},tags:[]})}return o}function B(a){return a.map(o=>`BEGIN:VCARD
VERSION:3.0
FN:${o.name}
N:${o.surname||""};;;;
TEL:${o.phone||""}
EMAIL:${o.email||""}
END:VCARD`).join(`
`)}function S(a){const o=a.split(`
`).filter(Boolean),[i,...l]=o;return l.map(n=>{const[e,c,s,u,m,p]=n.split(",");return{name:e?.trim()||"",surname:c?.trim()||"",phone:s?.trim()||"",email:u?.trim()||"",notes:p?JSON.parse(p):{},tags:m?m.split(";").map(y=>y.trim()):[]}})}function C(){const a=B(t.contacts),o=new Blob([a],{type:"text/vcard"}),i=document.createElement("a");i.href=URL.createObjectURL(o),i.download="contactos.vcf",i.click()}function N(){const a="name,surname,phone,email,tags,notes",o=t.contacts.map(e=>[e.name,e.surname,e.phone,e.email,(e.tags||[]).join(";"),JSON.stringify(e.notes||{})].map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(",")),i=[a,...o].join(`
`),l=new Blob([i],{type:"text/csv"}),n=document.createElement("a");n.href=URL.createObjectURL(l),n.download="contactos.csv",n.click()}function O(){const a=new Blob([JSON.stringify(t.contacts,null,2)],{type:"application/json"}),o=document.createElement("a");o.href=URL.createObjectURL(a),o.download="contactos.json",o.click()}document.addEventListener("DOMContentLoaded",r);
