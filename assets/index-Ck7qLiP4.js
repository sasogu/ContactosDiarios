(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))c(l);new MutationObserver(l=>{for(const e of l)if(e.type==="childList")for(const o of e.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&c(o)}).observe(document,{childList:!0,subtree:!0});function i(l){const e={};return l.integrity&&(e.integrity=l.integrity),l.referrerPolicy&&(e.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?e.credentials="include":l.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function c(l){if(l.ep)return;l.ep=!0;const e=i(l);fetch(l.href,e)}})();const f="0.0.4";(function(){try{const n=localStorage.getItem("app_version");n&&n!==f&&(localStorage.clear(),"caches"in window&&caches.keys().then(i=>i.forEach(c=>caches.delete(c))),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(i=>i.forEach(c=>c.unregister())),location.reload()),localStorage.setItem("app_version",f)}catch{}})();function y({contacts:a,filter:n,onSelect:i,onDelete:c}){let l=n?a.filter(e=>e.tags?.some(o=>o.toLowerCase().includes(n.toLowerCase()))||e.name?.toLowerCase().includes(n.toLowerCase())||e.surname?.toLowerCase().includes(n.toLowerCase())):a;return l=l.slice().sort((e,o)=>o.pinned&&!e.pinned?1:e.pinned&&!o.pinned?-1:(e.surname||"").localeCompare(o.surname||"")),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos o etiqueta..." value="${n||""}" />
      <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
      <ul>
        ${l.length===0?'<li class="empty">Sin contactos</li>':l.map((e,o)=>`
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
  `}function v({notes:a}){return`
    <div class="notes-area">
      <h3>Notas diarias</h3>
      <form id="note-form">
        <input type="date" id="note-date" value="${new Date().toISOString().slice(0,10)}" required />
        <textarea id="note-text" rows="3" placeholder="Escribe una nota para la fecha seleccionada..."></textarea>
        <button type="submit">Guardar nota</button>
      </form>
      <ul class="note-history">
        ${Object.entries(a||{}).sort((n,i)=>i[0].localeCompare(n[0])).map(([n,i])=>`
          <li>
            <b>${n}</b>:
            <span class="note-content" data-date="${n}">${i}</span>
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
  `}function x({contacts:a,visible:n}){let i=[];return a.forEach(c=>{c.notes&&Object.entries(c.notes).forEach(([l,e])=>{i.push({date:l,text:e,contact:c})})}),i.sort((c,l)=>l.date.localeCompare(c.date)),`
    <div id="all-notes-modal" class="modal" style="display:${n?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${i.length===0?"<li>No hay notas registradas.</li>":i.map(c=>`
            <li>
              <b>${c.date}</b> — <span style="color:#3a4a7c">${c.contact.surname?c.contact.surname+", ":""}${c.contact.name}</span><br/>
              <span>${c.text}</span>
            </li>
          `).join("")}
        </ul>
        <div class="form-actions">
          <button id="close-all-notes">Cerrar</button>
        </div>
      </div>
    </div>
  `}const g="contactos_diarios";let t={contacts:$(),selected:null,editing:null,tagFilter:"",showAllNotes:!1};function $(){try{return JSON.parse(localStorage.getItem(g))||[]}catch{return[]}}function m(a){localStorage.setItem(g,JSON.stringify(a))}function d(){const a=document.querySelector("#app"),n=t.editing!==null?t.contacts[t.editing]:null,i=t.selected!==null?t.contacts[t.selected].notes||{}:{};a.innerHTML=`
    <h1>Diario de Contactos</h1>
    <div class="main-grid">
      <div>
        <button id="show-all-notes-btn" class="add-btn" style="width:100%;margin-bottom:1rem;">🗒️ Ver todas las notas</button>
        ${y({contacts:t.contacts,filter:t.tagFilter})}
        ${E({})}
      </div>
      <div>
        ${t.editing!==null?b({contact:n}):""}
        ${t.selected!==null&&t.editing===null?v({notes:i}):""}
      </div>
    </div>
    ${x({contacts:t.contacts,visible:t.showAllNotes})}
  `,I()}function I(){const a=document.getElementById("tag-filter");a&&a.addEventListener("input",o=>{t.tagFilter=a.value,d();const s=document.getElementById("tag-filter");s&&(s.value=t.tagFilter,s.focus(),s.setSelectionRange(t.tagFilter.length,t.tagFilter.length))});const n=document.getElementById("add-contact");n&&(n.onclick=()=>{t.editing=null,t.selected=null,d(),t.editing=t.contacts.length,d()}),document.querySelectorAll(".select-contact").forEach(o=>{o.onclick=s=>{t.selected=Number(o.dataset.index),t.editing=null,d()}}),document.querySelectorAll(".edit-contact").forEach(o=>{o.onclick=s=>{t.editing=Number(o.dataset.index),t.selected=null,d()}}),document.querySelectorAll(".delete-contact").forEach(o=>{o.onclick=s=>{confirm("¿Eliminar este contacto?")&&(t.contacts.splice(Number(o.dataset.index),1),m(t.contacts),t.selected=null,d())}}),document.querySelectorAll(".pin-contact").forEach(o=>{o.onclick=s=>{const r=Number(o.dataset.index);t.contacts[r].pinned=!t.contacts[r].pinned,m(t.contacts),d()}});const i=document.getElementById("contact-form");i&&(i.onsubmit=o=>{o.preventDefault();const s=Object.fromEntries(new FormData(i));let r=s.tags?s.tags.split(",").map(u=>u.trim()).filter(Boolean):[];delete s.tags,t.editing!==null&&t.editing<t.contacts.length?t.contacts[t.editing]={...t.contacts[t.editing],...s,tags:r}:t.contacts.push({...s,notes:{},tags:r}),m(t.contacts),t.editing=null,d()},document.getElementById("cancel-edit").onclick=()=>{t.editing=null,d()});const c=document.getElementById("note-form");c&&t.selected!==null&&(c.onsubmit=o=>{o.preventDefault();const s=document.getElementById("note-date").value,r=document.getElementById("note-text").value.trim();!s||!r||(t.contacts[t.selected].notes||(t.contacts[t.selected].notes={}),t.contacts[t.selected].notes[s]=r,m(t.contacts),d())}),document.querySelectorAll(".edit-note").forEach(o=>{o.onclick=s=>{const r=o.dataset.date,u=document.getElementById("edit-note-modal"),p=document.getElementById("edit-note-text");p.value=t.contacts[t.selected].notes[r],u.style.display="block",document.getElementById("save-edit-note").onclick=()=>{t.contacts[t.selected].notes[r]=p.value.trim(),m(t.contacts),u.style.display="none",d()},document.getElementById("cancel-edit-note").onclick=()=>{u.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(o=>{o.onclick=s=>{const r=o.dataset.date;confirm("¿Eliminar la nota de "+r+"?")&&(delete t.contacts[t.selected].notes[r],m(t.contacts),d())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{C(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{w(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{O(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async o=>{const s=o.target.files[0];if(!s)return;const r=await s.text();let u=[];if(s.name.endsWith(".vcf"))u=N(r);else if(s.name.endsWith(".csv"))u=S(r);else if(s.name.endsWith(".json"))try{u=JSON.parse(r)}catch{}u.length&&(t.contacts=t.contacts.concat(u),m(t.contacts),d())};const l=document.getElementById("close-all-notes");l&&(l.onclick=()=>{t.showAllNotes=!1,d()});const e=document.getElementById("show-all-notes-btn");e&&(e.onclick=()=>{t.showAllNotes=!0,d()})}function N(a){const n=[],i=a.split("END:VCARD");for(const c of i){const l=/FN:([^\n]*)/.exec(c)?.[1]?.trim(),e=/N:.*;([^;\n]*)/.exec(c)?.[1]?.trim()||"",o=/TEL.*:(.+)/.exec(c)?.[1]?.trim(),s=/EMAIL.*:(.+)/.exec(c)?.[1]?.trim();l&&n.push({name:l,surname:e,phone:o||"",email:s||"",notes:{},tags:[]})}return n}function B(a){return a.map(n=>`BEGIN:VCARD
VERSION:3.0
FN:${n.name}
N:${n.surname||""};;;;
TEL:${n.phone||""}
EMAIL:${n.email||""}
END:VCARD`).join(`
`)}function S(a){const n=a.split(`
`).filter(Boolean),[i,...c]=n;return c.map(l=>{const[e,o,s,r,u,p]=l.split(",");return{name:e?.trim()||"",surname:o?.trim()||"",phone:s?.trim()||"",email:r?.trim()||"",notes:p?JSON.parse(p):{},tags:u?u.split(";").map(h=>h.trim()):[]}})}function C(){const a=B(t.contacts),n=new Blob([a],{type:"text/vcard"}),i=document.createElement("a");i.href=URL.createObjectURL(n),i.download="contactos.vcf",i.click()}function w(){const a="name,surname,phone,email,tags,notes",n=t.contacts.map(e=>[e.name,e.surname,e.phone,e.email,(e.tags||[]).join(";"),JSON.stringify(e.notes||{})].map(o=>'"'+String(o).replace(/"/g,'""')+'"').join(",")),i=[a,...n].join(`
`),c=new Blob([i],{type:"text/csv"}),l=document.createElement("a");l.href=URL.createObjectURL(c),l.download="contactos.csv",l.click()}function O(){const a=new Blob([JSON.stringify(t.contacts,null,2)],{type:"application/json"}),n=document.createElement("a");n.href=URL.createObjectURL(a),n.download="contactos.json",n.click()}document.addEventListener("DOMContentLoaded",d);
