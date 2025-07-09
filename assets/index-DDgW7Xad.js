(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const t of n)if(t.type==="childList")for(const l of t.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function c(n){const t={};return n.integrity&&(t.integrity=n.integrity),n.referrerPolicy&&(t.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?t.credentials="include":n.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(n){if(n.ep)return;n.ep=!0;const t=c(n);fetch(n.href,t)}})();function y({contacts:a,filter:o,onSelect:c,onDelete:s}){let n=o?a.filter(t=>t.tags?.some(l=>l.toLowerCase().includes(o.toLowerCase()))||t.name?.toLowerCase().includes(o.toLowerCase())||t.surname?.toLowerCase().includes(o.toLowerCase())):a;return n=n.slice().sort((t,l)=>l.pinned&&!t.pinned?1:t.pinned&&!l.pinned?-1:(t.surname||"").localeCompare(l.surname||"")),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos o etiqueta..." value="${o||""}" />
      <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
      <ul>
        ${n.length===0?'<li class="empty">Sin contactos</li>':n.map((t,l)=>`
          <li${t.pinned?' class="pinned"':""}>
            <div class="contact-main">
              <button class="select-contact" data-index="${a.indexOf(t)}">${t.surname?t.surname+", ":""}${t.name}</button>
              <span class="tags">${(t.tags||[]).map(i=>`<span class='tag'>${i}</span>`).join(" ")}</span>
              <button class="pin-contact" data-index="${a.indexOf(t)}" title="${t.pinned?"Desfijar":"Fijar"}">${t.pinned?"📌":"📍"}</button>
            </div>
            <div class="contact-info">
              ${t.phone?`<a href="tel:${t.phone}" class="contact-link" title="Llamar"><span>📞</span> ${t.phone}</a>`:""}
              ${t.email?`<a href="mailto:${t.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${t.email}</a>`:""}
            </div>
            <button class="edit-contact" data-index="${a.indexOf(t)}" title="Editar">✏️</button>
            <button class="delete-contact" data-index="${a.indexOf(t)}" title="Eliminar">🗑️</button>
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
        ${Object.entries(a||{}).sort((o,c)=>c[0].localeCompare(o[0])).map(([o,c])=>`
          <li>
            <b>${o}</b>:
            <span class="note-content" data-date="${o}">${c}</span>
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
  `}function h({}){return`
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
  `}const f="contactos_diarios";let e={contacts:E(),selected:null,editing:null,tagFilter:""};function E(){try{return JSON.parse(localStorage.getItem(f))||[]}catch{return[]}}function d(a){localStorage.setItem(f,JSON.stringify(a))}function r(){const a=document.querySelector("#app"),o=e.editing!==null?e.contacts[e.editing]:null,c=e.selected!==null?e.contacts[e.selected].notes||{}:{};a.innerHTML=`
    <h1>Diario de Contactos</h1>
    <div class="main-grid">
      <div>
        ${y({contacts:e.contacts,filter:e.tagFilter})}
        ${h({})}
      </div>
      <div>
        ${e.editing!==null?b({contact:o}):""}
        ${e.selected!==null&&e.editing===null?v({notes:c}):""}
      </div>
    </div>
  `,x()}function x(){const a=document.getElementById("tag-filter");a&&a.addEventListener("input",n=>{e.tagFilter=a.value,r();const t=document.getElementById("tag-filter");t&&(t.value=e.tagFilter,t.focus(),t.setSelectionRange(e.tagFilter.length,e.tagFilter.length))});const o=document.getElementById("add-contact");o&&(o.onclick=()=>{e.editing=null,e.selected=null,r(),e.editing=e.contacts.length,r()}),document.querySelectorAll(".select-contact").forEach(n=>{n.onclick=t=>{e.selected=Number(n.dataset.index),e.editing=null,r()}}),document.querySelectorAll(".edit-contact").forEach(n=>{n.onclick=t=>{e.editing=Number(n.dataset.index),e.selected=null,r()}}),document.querySelectorAll(".delete-contact").forEach(n=>{n.onclick=t=>{confirm("¿Eliminar este contacto?")&&(e.contacts.splice(Number(n.dataset.index),1),d(e.contacts),e.selected=null,r())}}),document.querySelectorAll(".pin-contact").forEach(n=>{n.onclick=t=>{const l=Number(n.dataset.index);e.contacts[l].pinned=!e.contacts[l].pinned,d(e.contacts),r()}});const c=document.getElementById("contact-form");c&&(c.onsubmit=n=>{n.preventDefault();const t=Object.fromEntries(new FormData(c));let l=t.tags?t.tags.split(",").map(i=>i.trim()).filter(Boolean):[];delete t.tags,e.editing!==null&&e.editing<e.contacts.length?e.contacts[e.editing]={...e.contacts[e.editing],...t,tags:l}:e.contacts.push({...t,notes:{},tags:l}),d(e.contacts),e.editing=null,r()},document.getElementById("cancel-edit").onclick=()=>{e.editing=null,r()});const s=document.getElementById("note-form");s&&e.selected!==null&&(s.onsubmit=n=>{n.preventDefault();const t=document.getElementById("note-date").value,l=document.getElementById("note-text").value.trim();!t||!l||(e.contacts[e.selected].notes||(e.contacts[e.selected].notes={}),e.contacts[e.selected].notes[t]=l,d(e.contacts),r())}),document.querySelectorAll(".edit-note").forEach(n=>{n.onclick=t=>{const l=n.dataset.date,i=document.getElementById("edit-note-modal"),u=document.getElementById("edit-note-text");u.value=e.contacts[e.selected].notes[l],i.style.display="block",document.getElementById("save-edit-note").onclick=()=>{e.contacts[e.selected].notes[l]=u.value.trim(),d(e.contacts),i.style.display="none",r()},document.getElementById("cancel-edit-note").onclick=()=>{i.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(n=>{n.onclick=t=>{const l=n.dataset.date;confirm("¿Eliminar la nota de "+l+"?")&&(delete e.contacts[e.selected].notes[l],d(e.contacts),r())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{N(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{S(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{C(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async n=>{const t=n.target.files[0];if(!t)return;const l=await t.text();let i=[];if(t.name.endsWith(".vcf"))i=$(l);else if(t.name.endsWith(".csv"))i=B(l);else if(t.name.endsWith(".json"))try{i=JSON.parse(l)}catch{}i.length&&(e.contacts=e.contacts.concat(i),d(e.contacts),r())}}function $(a){const o=[],c=a.split("END:VCARD");for(const s of c){const n=/FN:([^\n]*)/.exec(s)?.[1]?.trim(),t=/N:.*;([^;\n]*)/.exec(s)?.[1]?.trim()||"",l=/TEL.*:(.+)/.exec(s)?.[1]?.trim(),i=/EMAIL.*:(.+)/.exec(s)?.[1]?.trim();n&&o.push({name:n,surname:t,phone:l||"",email:i||"",notes:{},tags:[]})}return o}function I(a){return a.map(o=>`BEGIN:VCARD
VERSION:3.0
FN:${o.name}
N:${o.surname||""};;;;
TEL:${o.phone||""}
EMAIL:${o.email||""}
END:VCARD`).join(`
`)}function B(a){const o=a.split(`
`).filter(Boolean),[c,...s]=o;return s.map(n=>{const[t,l,i,u,m,p]=n.split(",");return{name:t?.trim()||"",surname:l?.trim()||"",phone:i?.trim()||"",email:u?.trim()||"",notes:p?JSON.parse(p):{},tags:m?m.split(";").map(g=>g.trim()):[]}})}function N(){const a=I(e.contacts),o=new Blob([a],{type:"text/vcard"}),c=document.createElement("a");c.href=URL.createObjectURL(o),c.download="contactos.vcf",c.click()}function S(){const a="name,surname,phone,email,tags,notes",o=e.contacts.map(t=>[t.name,t.surname,t.phone,t.email,(t.tags||[]).join(";"),JSON.stringify(t.notes||{})].map(l=>'"'+String(l).replace(/"/g,'""')+'"').join(",")),c=[a,...o].join(`
`),s=new Blob([c],{type:"text/csv"}),n=document.createElement("a");n.href=URL.createObjectURL(s),n.download="contactos.csv",n.click()}function C(){const a=new Blob([JSON.stringify(e.contacts,null,2)],{type:"application/json"}),o=document.createElement("a");o.href=URL.createObjectURL(a),o.download="contactos.json",o.click()}document.addEventListener("DOMContentLoaded",r);
