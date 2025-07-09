(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))c(l);new MutationObserver(l=>{for(const n of l)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&c(r)}).observe(document,{childList:!0,subtree:!0});function i(l){const n={};return l.integrity&&(n.integrity=l.integrity),l.referrerPolicy&&(n.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?n.credentials="include":l.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function c(l){if(l.ep)return;l.ep=!0;const n=i(l);fetch(l.href,n)}})();const y="0.0.15";(function(){try{const e=localStorage.getItem("app_version");if(e&&e!==y){const i=localStorage.getItem("contactos_diarios");Object.keys(localStorage).forEach(c=>{c!=="contactos_diarios"&&localStorage.removeItem(c)}),"caches"in window&&caches.keys().then(c=>c.forEach(l=>caches.delete(l))),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(c=>c.forEach(l=>l.unregister())),i&&localStorage.setItem("contactos_diarios",i),location.reload()}localStorage.setItem("app_version",y)}catch{}})();function x({contacts:o,filter:e,onSelect:i,onDelete:c}){let l=e?o.filter(n=>{const r=e.toLowerCase(),p=n.notes?Object.values(n.notes).join(" ").toLowerCase():"";return n.tags?.some(a=>a.toLowerCase().includes(r))||n.name?.toLowerCase().includes(r)||n.surname?.toLowerCase().includes(r)||p.includes(r)}):o;return l=l.slice().sort((n,r)=>r.pinned&&!n.pinned?1:n.pinned&&!r.pinned?-1:(n.surname||"").localeCompare(r.surname||"")),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${e||""}" />
      <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
      <ul>
        ${l.length===0?'<li class="empty">Sin contactos</li>':l.map((n,r)=>`
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
  `}function w({notes:o}){return`
    <div class="notes-area">
      <h3>Notas diarias</h3>
      <form id="note-form">
        <input type="date" id="note-date" value="${new Date().toISOString().slice(0,10)}" required />
        <textarea id="note-text" rows="3" placeholder="Escribe una nota para la fecha seleccionada..."></textarea>
        <button type="submit">Guardar nota</button>
      </form>
      <ul class="note-history">
        ${Object.entries(o||{}).sort((e,i)=>i[0].localeCompare(e[0])).map(([e,i])=>`
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
  `}function $({}){return`
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
  `}function N({contacts:o,visible:e}){let i=[];return o.forEach((c,l)=>{c.notes&&Object.entries(c.notes).forEach(([n,r])=>{i.push({date:n,text:r,contact:c,contactIndex:l})})}),i.sort((c,l)=>l.date.localeCompare(c.date)),`
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
  `}const v="contactos_diarios";let t={contacts:B(),selected:null,notes:"",editing:null,tagFilter:"",showAllNotes:!1};function B(){try{return JSON.parse(localStorage.getItem(v))||[]}catch{return[]}}function g(o){localStorage.setItem(v,JSON.stringify(o))}function m(){const o=document.querySelector("#app"),e=t.editing!==null?t.contacts[t.editing]:null,i=t.selected!==null?t.contacts[t.selected].notes||{}:{};o.innerHTML=`
    <h1>Diario de Contactos</h1>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <div class="main-grid">
      <div>
        ${x({contacts:t.contacts,filter:t.tagFilter})}
        ${$({})}
        <button id="show-webdav-config" class="add-btn" style="width:100%;margin-top:1.5rem;">☁️ Configurar backup Nextcloud</button>
        <div id="webdav-config-modal" class="modal" style="display:none;z-index:3000;">
          <div class="modal-content" style="max-width:400px;">
            ${k()}
            <div class="form-actions"><button id="close-webdav-config">Cerrar</button></div>
          </div>
        </div>
      </div>
      <div>
        ${t.editing!==null?I({contact:e}):""}
        ${t.selected!==null&&t.editing===null?w({notes:i}):""}
      </div>
    </div>
    ${N({contacts:t.contacts,visible:t.showAllNotes})}
  `,S()}function S(){const o=document.getElementById("tag-filter");o&&o.addEventListener("input",a=>{t.tagFilter=o.value,m();const s=document.getElementById("tag-filter");s&&(s.value=t.tagFilter,s.focus(),s.setSelectionRange(t.tagFilter.length,t.tagFilter.length))});const e=document.getElementById("add-contact");e&&(e.onclick=()=>{t.editing=null,t.selected=null,m(),t.editing=t.contacts.length,m()}),document.querySelectorAll(".select-contact").forEach(a=>{a.onclick=s=>{t.selected=Number(a.dataset.index),t.editing=null,m()}}),document.querySelectorAll(".edit-contact").forEach(a=>{a.onclick=s=>{t.editing=Number(a.dataset.index),t.selected=null,m()}}),document.querySelectorAll(".delete-contact").forEach(a=>{a.onclick=s=>{confirm("¿Eliminar este contacto?")&&(t.contacts.splice(Number(a.dataset.index),1),g(t.contacts),t.selected=null,m())}}),document.querySelectorAll(".pin-contact").forEach(a=>{a.onclick=s=>{const d=Number(a.dataset.index);t.contacts[d].pinned=!t.contacts[d].pinned,g(t.contacts),m()}});const i=document.getElementById("contact-form");i&&(i.onsubmit=a=>{a.preventDefault();const s=Object.fromEntries(new FormData(i));let d=s.tags?s.tags.split(",").map(u=>u.trim()).filter(Boolean):[];delete s.tags,t.editing!==null&&t.editing<t.contacts.length?t.contacts[t.editing]={...t.contacts[t.editing],...s,tags:d}:t.contacts.push({...s,notes:{},tags:d}),g(t.contacts),t.editing=null,m()},document.getElementById("cancel-edit").onclick=()=>{t.editing=null,m()});const c=document.getElementById("note-form");c&&t.selected!==null&&(c.onsubmit=a=>{a.preventDefault();const s=document.getElementById("note-date").value,d=document.getElementById("note-text").value.trim();!s||!d||(t.contacts[t.selected].notes||(t.contacts[t.selected].notes={}),t.contacts[t.selected].notes[s]=d,g(t.contacts),m())}),document.querySelectorAll(".edit-note").forEach(a=>{a.onclick=s=>{const d=a.dataset.date,u=document.getElementById("edit-note-modal"),f=document.getElementById("edit-note-text");f.value=t.contacts[t.selected].notes[d],u.style.display="block",document.getElementById("save-edit-note").onclick=()=>{t.contacts[t.selected].notes[d]=f.value.trim(),g(t.contacts),u.style.display="none",m()},document.getElementById("cancel-edit-note").onclick=()=>{u.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(a=>{a.onclick=s=>{const d=a.dataset.date;confirm("¿Eliminar la nota de "+d+"?")&&(delete t.contacts[t.selected].notes[d],g(t.contacts),m())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{L(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{D(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{F(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async a=>{const s=a.target.files[0];if(!s)return;const d=await s.text();let u=[];if(s.name.endsWith(".vcf"))u=O(d);else if(s.name.endsWith(".csv"))u=j(d);else if(s.name.endsWith(".json"))try{u=JSON.parse(d)}catch{}u.length&&(t.contacts=t.contacts.concat(u),g(t.contacts),m())};const l=document.getElementById("close-all-notes");l&&(l.onclick=()=>{t.showAllNotes=!1,m()});const n=document.getElementById("show-all-notes-btn");n&&(n.onclick=()=>{t.showAllNotes=!0,m()}),document.querySelectorAll(".edit-note-link").forEach(a=>{a.onclick=s=>{s.preventDefault();const d=Number(a.dataset.contact),u=a.dataset.date;t.selected=d,t.editing=null,t.showAllNotes=!1,m(),setTimeout(()=>{const f=document.querySelector(`.edit-note[data-date="${u}"]`);f&&f.click()},50)}}),document.getElementById("show-webdav-config").onclick=()=>{document.getElementById("webdav-config-modal").style.display="flex"},document.getElementById("close-webdav-config").onclick=()=>{document.getElementById("webdav-config-modal").style.display="none"};const r=document.getElementById("webdav-config-form");r&&(r.onsubmit=a=>{a.preventDefault();const s=Object.fromEntries(new FormData(r));C(s),alert("Configuración guardada. Ahora puedes usar la opción de backup a Nextcloud."),document.getElementById("webdav-config-modal").style.display="none"});const p=document.getElementById("force-webdav-backup");p&&(p.onclick=async()=>{const a=E();if(!a.url||!a.user||!a.pass){alert("Configura primero la URL, usuario y contraseña de WebDAV.");return}try{const s=JSON.stringify(t.contacts),u=`contactosdiarios-backup-${new Date().toISOString().replace(/[:.]/g,"-")}.json`,f=a.url.replace(/\/$/,"")+"/"+u,b=await fetch(f,{method:"PUT",headers:{Authorization:"Basic "+btoa(a.user+":"+a.pass),"Content-Type":"application/json"},body:s});b.ok?alert("Backup subido correctamente a Nextcloud."):alert("Error al subir el backup: "+b.status+" "+b.statusText)}catch(s){alert("Error al conectar con Nextcloud: "+s.message)}})}const h="contactos_diarios_webdav_config";function E(){try{return JSON.parse(localStorage.getItem(h))||{}}catch{return{}}}function C(o){localStorage.setItem(h,JSON.stringify(o))}function k(){const o=E();return`
    <form id="webdav-config-form" class="webdav-form">
      <h3>Backup Nextcloud (WebDAV)</h3>
      <label>URL WebDAV <input name="url" type="url" required placeholder="https://tuservidor/nextcloud/remote.php/dav/files/usuario/" value="${o.url||""}" /></label>
      <label>Usuario <input name="user" required value="${o.user||""}" /></label>
      <label>Contraseña <input name="pass" type="password" required value="${o.pass||""}" /></label>
      <button type="submit">Guardar configuración</button>
      <button type="button" id="force-webdav-backup" style="margin-top:0.7rem;background:#06b6d4;">Forzar copia en Nextcloud</button>
    </form>
  `}function O(o){const e=[],i=o.split("END:VCARD");for(const c of i){const l=/FN:([^\n]*)/.exec(c)?.[1]?.trim(),n=/N:.*;([^;\n]*)/.exec(c)?.[1]?.trim()||"",r=/TEL.*:(.+)/.exec(c)?.[1]?.trim(),p=/EMAIL.*:(.+)/.exec(c)?.[1]?.trim();l&&e.push({name:l,surname:n,phone:r||"",email:p||"",notes:{},tags:[]})}return e}function A(o){return o.map(e=>`BEGIN:VCARD
VERSION:3.0
FN:${e.name}
N:${e.surname||""};;;;
TEL:${e.phone||""}
EMAIL:${e.email||""}
END:VCARD`).join(`
`)}function j(o){const e=o.split(`
`).filter(Boolean),[i,...c]=e;return c.map(l=>{const[n,r,p,a,s,d]=l.split(",");return{name:n?.trim()||"",surname:r?.trim()||"",phone:p?.trim()||"",email:a?.trim()||"",notes:d?JSON.parse(d):{},tags:s?s.split(";").map(u=>u.trim()):[]}})}function L(){const o=A(t.contacts),e=new Blob([o],{type:"text/vcard"}),i=document.createElement("a");i.href=URL.createObjectURL(e),i.download="contactos.vcf",i.click()}function D(){const o="name,surname,phone,email,tags,notes",e=t.contacts.map(n=>[n.name,n.surname,n.phone,n.email,(n.tags||[]).join(";"),JSON.stringify(n.notes||{})].map(r=>'"'+String(r).replace(/"/g,'""')+'"').join(",")),i=[o,...e].join(`
`),c=new Blob([i],{type:"text/csv"}),l=document.createElement("a");l.href=URL.createObjectURL(c),l.download="contactos.csv",l.click()}function F(){const o=new Blob([JSON.stringify(t.contacts,null,2)],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(o),e.download="contactos.json",e.click()}document.addEventListener("DOMContentLoaded",()=>{m();let o=null;const e=document.createElement("button");e.textContent="📲 Instalar en tu dispositivo",e.className="add-btn",e.style.display="none",e.style.position="fixed",e.style.bottom="1.5rem",e.style.left="50%",e.style.transform="translateX(-50%)",e.style.zIndex="3000",document.body.appendChild(e),window.addEventListener("beforeinstallprompt",i=>{i.preventDefault(),o=i,e.style.display="block"}),e.addEventListener("click",async()=>{if(o){o.prompt();const{outcome:i}=await o.userChoice;i==="accepted"&&(e.style.display="none"),o=null}}),window.addEventListener("appinstalled",()=>{e.style.display="none"})});
