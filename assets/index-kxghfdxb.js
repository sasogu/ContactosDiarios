(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))c(l);new MutationObserver(l=>{for(const e of l)if(e.type==="childList")for(const n of e.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&c(n)}).observe(document,{childList:!0,subtree:!0});function i(l){const e={};return l.integrity&&(e.integrity=l.integrity),l.referrerPolicy&&(e.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?e.credentials="include":l.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function c(l){if(l.ep)return;l.ep=!0;const e=i(l);fetch(l.href,e)}})();const f="0.0.7";(function(){try{const o=localStorage.getItem("app_version");o&&o!==f&&(localStorage.clear(),"caches"in window&&caches.keys().then(i=>i.forEach(c=>caches.delete(c))),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(i=>i.forEach(c=>c.unregister())),location.reload()),localStorage.setItem("app_version",f)}catch{}})();function y({contacts:a,filter:o,onSelect:i,onDelete:c}){let l=o?a.filter(e=>e.tags?.some(n=>n.toLowerCase().includes(o.toLowerCase()))||e.name?.toLowerCase().includes(o.toLowerCase())||e.surname?.toLowerCase().includes(o.toLowerCase())):a;return l=l.slice().sort((e,n)=>n.pinned&&!e.pinned?1:e.pinned&&!n.pinned?-1:(e.surname||"").localeCompare(n.surname||"")),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos o etiqueta..." value="${o||""}" />
      <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
      <ul>
        ${l.length===0?'<li class="empty">Sin contactos</li>':l.map((e,n)=>`
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
  `}function x({contacts:a,visible:o}){let i=[];return a.forEach((c,l)=>{c.notes&&Object.entries(c.notes).forEach(([e,n])=>{i.push({date:e,text:n,contact:c,contactIndex:l})})}),i.sort((c,l)=>l.date.localeCompare(c.date)),`
    <div id="all-notes-modal" class="modal" style="display:${o?"flex":"none"}">
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
  `}const g="contactos_diarios";let t={contacts:$(),selected:null,editing:null,tagFilter:"",showAllNotes:!1};function $(){try{return JSON.parse(localStorage.getItem(g))||[]}catch{return[]}}function p(a){localStorage.setItem(g,JSON.stringify(a))}function d(){const a=document.querySelector("#app"),o=t.editing!==null?t.contacts[t.editing]:null,i=t.selected!==null?t.contacts[t.selected].notes||{}:{};a.innerHTML=`
    <h1>Diario de Contactos</h1>
    <div class="main-grid">
      <div>
        <button id="show-all-notes-btn" class="add-btn" style="width:100%;margin-bottom:1rem;">🗒️ Ver todas las notas</button>
        ${y({contacts:t.contacts,filter:t.tagFilter})}
        ${E({})}
      </div>
      <div>
        ${t.editing!==null?b({contact:o}):""}
        ${t.selected!==null&&t.editing===null?v({notes:i}):""}
      </div>
    </div>
    ${x({contacts:t.contacts,visible:t.showAllNotes})}
  `,I()}function I(){const a=document.getElementById("tag-filter");a&&a.addEventListener("input",n=>{t.tagFilter=a.value,d();const s=document.getElementById("tag-filter");s&&(s.value=t.tagFilter,s.focus(),s.setSelectionRange(t.tagFilter.length,t.tagFilter.length))});const o=document.getElementById("add-contact");o&&(o.onclick=()=>{t.editing=null,t.selected=null,d(),t.editing=t.contacts.length,d()}),document.querySelectorAll(".select-contact").forEach(n=>{n.onclick=s=>{t.selected=Number(n.dataset.index),t.editing=null,d()}}),document.querySelectorAll(".edit-contact").forEach(n=>{n.onclick=s=>{t.editing=Number(n.dataset.index),t.selected=null,d()}}),document.querySelectorAll(".delete-contact").forEach(n=>{n.onclick=s=>{confirm("¿Eliminar este contacto?")&&(t.contacts.splice(Number(n.dataset.index),1),p(t.contacts),t.selected=null,d())}}),document.querySelectorAll(".pin-contact").forEach(n=>{n.onclick=s=>{const r=Number(n.dataset.index);t.contacts[r].pinned=!t.contacts[r].pinned,p(t.contacts),d()}});const i=document.getElementById("contact-form");i&&(i.onsubmit=n=>{n.preventDefault();const s=Object.fromEntries(new FormData(i));let r=s.tags?s.tags.split(",").map(u=>u.trim()).filter(Boolean):[];delete s.tags,t.editing!==null&&t.editing<t.contacts.length?t.contacts[t.editing]={...t.contacts[t.editing],...s,tags:r}:t.contacts.push({...s,notes:{},tags:r}),p(t.contacts),t.editing=null,d()},document.getElementById("cancel-edit").onclick=()=>{t.editing=null,d()});const c=document.getElementById("note-form");c&&t.selected!==null&&(c.onsubmit=n=>{n.preventDefault();const s=document.getElementById("note-date").value,r=document.getElementById("note-text").value.trim();!s||!r||(t.contacts[t.selected].notes||(t.contacts[t.selected].notes={}),t.contacts[t.selected].notes[s]=r,p(t.contacts),d())}),document.querySelectorAll(".edit-note").forEach(n=>{n.onclick=s=>{const r=n.dataset.date,u=document.getElementById("edit-note-modal"),m=document.getElementById("edit-note-text");m.value=t.contacts[t.selected].notes[r],u.style.display="block",document.getElementById("save-edit-note").onclick=()=>{t.contacts[t.selected].notes[r]=m.value.trim(),p(t.contacts),u.style.display="none",d()},document.getElementById("cancel-edit-note").onclick=()=>{u.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(n=>{n.onclick=s=>{const r=n.dataset.date;confirm("¿Eliminar la nota de "+r+"?")&&(delete t.contacts[t.selected].notes[r],p(t.contacts),d())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{w(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{C(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{O(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async n=>{const s=n.target.files[0];if(!s)return;const r=await s.text();let u=[];if(s.name.endsWith(".vcf"))u=N(r);else if(s.name.endsWith(".csv"))u=S(r);else if(s.name.endsWith(".json"))try{u=JSON.parse(r)}catch{}u.length&&(t.contacts=t.contacts.concat(u),p(t.contacts),d())};const l=document.getElementById("close-all-notes");l&&(l.onclick=()=>{t.showAllNotes=!1,d()});const e=document.getElementById("show-all-notes-btn");e&&(e.onclick=()=>{t.showAllNotes=!0,d()}),document.querySelectorAll(".edit-note-link").forEach(n=>{n.onclick=s=>{s.preventDefault();const r=Number(n.dataset.contact),u=n.dataset.date;t.selected=r,t.editing=null,t.showAllNotes=!1,d(),setTimeout(()=>{const m=document.querySelector(`.edit-note[data-date="${u}"]`);m&&m.click()},50)}})}function N(a){const o=[],i=a.split("END:VCARD");for(const c of i){const l=/FN:([^\n]*)/.exec(c)?.[1]?.trim(),e=/N:.*;([^;\n]*)/.exec(c)?.[1]?.trim()||"",n=/TEL.*:(.+)/.exec(c)?.[1]?.trim(),s=/EMAIL.*:(.+)/.exec(c)?.[1]?.trim();l&&o.push({name:l,surname:e,phone:n||"",email:s||"",notes:{},tags:[]})}return o}function B(a){return a.map(o=>`BEGIN:VCARD
VERSION:3.0
FN:${o.name}
N:${o.surname||""};;;;
TEL:${o.phone||""}
EMAIL:${o.email||""}
END:VCARD`).join(`
`)}function S(a){const o=a.split(`
`).filter(Boolean),[i,...c]=o;return c.map(l=>{const[e,n,s,r,u,m]=l.split(",");return{name:e?.trim()||"",surname:n?.trim()||"",phone:s?.trim()||"",email:r?.trim()||"",notes:m?JSON.parse(m):{},tags:u?u.split(";").map(h=>h.trim()):[]}})}function w(){const a=B(t.contacts),o=new Blob([a],{type:"text/vcard"}),i=document.createElement("a");i.href=URL.createObjectURL(o),i.download="contactos.vcf",i.click()}function C(){const a="name,surname,phone,email,tags,notes",o=t.contacts.map(e=>[e.name,e.surname,e.phone,e.email,(e.tags||[]).join(";"),JSON.stringify(e.notes||{})].map(n=>'"'+String(n).replace(/"/g,'""')+'"').join(",")),i=[a,...o].join(`
`),c=new Blob([i],{type:"text/csv"}),l=document.createElement("a");l.href=URL.createObjectURL(c),l.download="contactos.csv",l.click()}function O(){const a=new Blob([JSON.stringify(t.contacts,null,2)],{type:"application/json"}),o=document.createElement("a");o.href=URL.createObjectURL(a),o.download="contactos.json",o.click()}document.addEventListener("DOMContentLoaded",d);
