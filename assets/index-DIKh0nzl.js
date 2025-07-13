(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const d of o.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&a(d)}).observe(document,{childList:!0,subtree:!0});function c(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(s){if(s.ep)return;s.ep=!0;const o=c(s);fetch(s.href,o)}})();const j="0.0.50";(function(){try{const t=localStorage.getItem("app_version");if(t&&t!==j){const c=localStorage.getItem("contactos_diarios");Object.keys(localStorage).forEach(a=>{a!=="contactos_diarios"&&localStorage.removeItem(a)}),"caches"in window&&caches.keys().then(a=>a.forEach(s=>caches.delete(s))),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(a=>a.forEach(s=>s.unregister())),c&&localStorage.setItem("contactos_diarios",c),location.reload()}localStorage.setItem("app_version",j)}catch{}})();function q({contacts:n,filter:t,onSelect:c,onDelete:a}){let s=t?n.filter(o=>{const d=t.toLowerCase(),p=o.notes?Object.values(o.notes).join(" ").toLowerCase():"";return o.tags?.some(y=>y.toLowerCase().includes(d))||o.name?.toLowerCase().includes(d)||o.surname?.toLowerCase().includes(d)||p.includes(d)}):n;return s=s.slice().sort((o,d)=>d.pinned&&!o.pinned?1:o.pinned&&!d.pinned?-1:(o.surname||"").localeCompare(d.surname||"")),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${t||""}" />
      <ul>
        ${s.length===0?'<li class="empty">Sin contactos</li>':s.map((o,d)=>`
          <li${o.pinned?' class="pinned"':""}>
            <div class="contact-main">
              <button class="select-contact" data-index="${n.indexOf(o)}">${o.surname?o.surname+", ":""}${o.name}</button>
              <span class="tags">${(o.tags||[]).map(p=>`<span class='tag'>${p}</span>`).join(" ")}</span>
              <button class="pin-contact" data-index="${n.indexOf(o)}" title="${o.pinned?"Desfijar":"Fijar"}">${o.pinned?"📌":"📍"}</button>
            </div>
            <div class="contact-info">
              ${o.phone?`<a href="tel:${o.phone}" class="contact-link" title="Llamar"><span>📞</span> ${o.phone}</a>`:""}
              ${o.email?`<a href="mailto:${o.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${o.email}</a>`:""}
            </div>
            <button class="add-note-contact" data-index="${n.indexOf(o)}" title="Añadir nota">📝</button>
            <button class="edit-contact" data-index="${n.indexOf(o)}" title="Editar">✏️</button>
            <button class="delete-contact" data-index="${n.indexOf(o)}" title="Eliminar">🗑️</button>
          </li>
        `).join("")}
      </ul>
    </div>
  `}function P({contact:n}){return`
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
  `}function T({notes:n}){const t=new Date;return`
    <div class="notes-area">
      <h3>Notas diarias</h3>
      <form id="note-form">
        <input type="date" id="note-date" value="${new Date(t.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10)}" required />
        <textarea id="note-text" rows="3" placeholder="Escribe una nota para la fecha seleccionada..."></textarea>
        <button type="submit">Guardar nota</button>
      </form>
      <ul class="note-history">
        ${Object.entries(n||{}).sort((s,o)=>o[0].localeCompare(s[0])).map(([s,o])=>`
          <li>
            <b>${s}</b>:
            <span class="note-content" data-date="${s}">${o}</span>
            <button class="edit-note" data-date="${s}" title="Editar">✏️</button>
            <button class="delete-note" data-date="${s}" title="Eliminar">🗑️</button>
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
  `}function F({}){return`
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
  `}function R({contacts:n,visible:t,page:c=1}){let a=[];n.forEach((g,v)=>{g.notes&&Object.entries(g.notes).forEach(([b,E])=>{a.push({date:b,text:E,contact:g,contactIndex:v})})}),a.sort((g,v)=>v.date.localeCompare(g.date));const s=4,o=Math.max(1,Math.ceil(a.length/s)),d=Math.min(Math.max(c,1),o),p=(d-1)*s,y=a.slice(p,p+s);return`
    <div id="all-notes-modal" class="modal" style="display:${t?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${a.length===0?"<li>No hay notas registradas.</li>":y.map(g=>`
            <li>
              <b>${g.date}</b> — <span style="color:#3a4a7c">${g.contact.surname?g.contact.surname+", ":""}${g.contact.name}</span><br/>
              <span>${g.text}</span>
              <a href="#" class="edit-note-link" data-contact="${g.contactIndex}" data-date="${g.date}" style="margin-left:0.5em;color:#646cff;font-size:0.95em;">Editar nota</a>
            </li>
          `).join("")}
        </ul>
        <div class="pagination" style="display:flex;justify-content:center;align-items:center;gap:1em;margin:1em 0;">
          <button id="prev-notes-page" ${d===1?"disabled":""}>&lt; Anterior</button>
          <span>Página ${d} de ${o}</span>
          <button id="next-notes-page" ${d===o?"disabled":""}>Siguiente &gt;</button>
        </div>
        <div class="form-actions">
          <button id="close-all-notes">Cerrar</button>
        </div>
      </div>
    </div>
  `}function _({visible:n,backups:t}){return`
    <div id="backup-modal" class="modal" style="display:${n?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:400px;">
        <h3>Restaurar copia local</h3>
        <div class="backup-btns" style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;">
          ${t.length===0?"<span>Sin copias locales.</span>":t.map(c=>`
            <div class="backup-btn-group" style="display:flex;align-items:center;gap:0.3rem;">
              <button class="restore-backup-btn" data-fecha="${c.fecha}">${c.fecha}</button>
              <button class="share-backup-btn" data-fecha="${c.fecha}" title="Compartir backup" style="background:#06b6d4;padding:0.4rem 0.7rem;font-size:1.1em;">📤</button>
            </div>
          `).join("")}
        </div>
        <div class="form-actions" style="margin-top:1.2rem;"><button id="close-backup-modal">Cerrar</button></div>
      </div>
    </div>
  `}function V({visible:n,contactIndex:t}){const c=t!==null?e.contacts[t]:null,a=new Date,o=new Date(a.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);return`
    <div id="add-note-modal" class="modal" style="display:${n?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:500px;">
        <h3>Añadir nota diaria</h3>
        ${c?`<p><strong>${c.surname?c.surname+", ":""}${c.name}</strong></p>`:""}
        <form id="add-note-form">
          <label>Fecha <input type="date" id="add-note-date" value="${o}" required /></label>
          <label>Nota <textarea id="add-note-text" rows="4" placeholder="Escribe una nota para este contacto..." required></textarea></label>
          <div class="form-actions">
            <button type="submit">Guardar nota</button>
            <button type="button" id="cancel-add-note">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `}const O="contactos_diarios";let e={contacts:J(),selected:null,notes:"",editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1,showAddNoteModal:!1,addNoteContactIndex:null,allNotesPage:1,duplicates:[],showDuplicateModal:!1};function J(){try{return JSON.parse(localStorage.getItem(O))||[]}catch{return[]}}function w(n){localStorage.setItem(O,JSON.stringify(n))}function f(){const n=document.querySelector("#app"),t=e.editing!==null?e.contacts[e.editing]:null,c=e.selected!==null?e.contacts[e.selected].notes||{}:{};n.innerHTML=`
    <h1>Diario de Contactos</h1>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <button id="manage-duplicates-btn" style="background:#dc3545;color:#fff;margin:0 10px 1.2rem 0;">🔍 Gestionar duplicados</button>
    <button id="validate-contacts-btn" style="background:#28a745;color:#fff;margin:0 10px 1.2rem 0;">✅ Validar contactos</button>
    <div class="main-grid">
      <div>
        <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
        ${F({})}
        ${q({contacts:e.contacts,filter:e.tagFilter})}
        <button id="show-backup-modal" class="add-btn" style="width:100%;margin-top:0.7rem;background:#06b6d4;">Restaurar copia local</button>
      </div>
      <div>
        ${e.editing!==null?P({contact:t}):""}
        ${e.selected!==null&&e.editing===null?T({notes:c}):""}
      </div>
    </div>
    ${R({contacts:e.contacts,visible:e.showAllNotes,page:e.allNotesPage})}
    ${_({visible:e.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})} <!-- Modal de backup -->
    ${V({visible:e.showAddNoteModal,contactIndex:e.addNoteContactIndex})} <!-- Modal añadir nota -->
    ${ee({duplicates:e.duplicates,visible:e.showDuplicateModal})} <!-- Modal de gestión de duplicados -->
  `,U();const a=document.getElementById("show-backup-modal");a&&(a.onclick=()=>{e.showBackupModal=!0,f()});const s=document.getElementById("close-backup-modal");s&&(s.onclick=()=>{e.showBackupModal=!1,f()}),document.querySelectorAll(".add-note-contact").forEach(p=>{p.onclick=y=>{e.addNoteContactIndex=Number(p.dataset.index),e.showAddNoteModal=!0,f()}});const o=document.getElementById("cancel-add-note");o&&(o.onclick=()=>{e.showAddNoteModal=!1,e.addNoteContactIndex=null,f()}),document.querySelectorAll(".restore-backup-btn").forEach(p=>{p.onclick=()=>H(p.dataset.fecha)});const d=document.getElementById("restore-local-backup");d&&(d.onclick=restaurarBackupLocal)}let D=null;function U(){const n=document.getElementById("tag-filter");n&&n.addEventListener("input",l=>{clearTimeout(D),D=setTimeout(()=>{e.tagFilter=n.value,f();const i=document.getElementById("tag-filter");i&&(i.value=e.tagFilter,i.focus(),i.setSelectionRange(e.tagFilter.length,e.tagFilter.length))},300)});const t=document.getElementById("add-contact");t&&(t.onclick=()=>{e.editing=null,e.selected=null,f(),e.editing=e.contacts.length,f()}),document.querySelectorAll(".select-contact").forEach(l=>{l.onclick=i=>{e.selected=Number(l.dataset.index),e.editing=null,f()}}),document.querySelectorAll(".edit-contact").forEach(l=>{l.onclick=i=>{e.editing=Number(l.dataset.index),e.selected=null,f()}}),document.querySelectorAll(".delete-contact").forEach(l=>{l.onclick=i=>{const r=Number(l.dataset.index),u=e.contacts[r],m=u.surname?`${u.surname}, ${u.name}`:u.name;confirm(`¿Estás seguro de eliminar el contacto "${m}"?

Esta acción no se puede deshacer.`)&&(e.contacts.splice(r,1),w(e.contacts),h("Contacto eliminado correctamente","success"),e.selected=null,f())}}),document.querySelectorAll(".pin-contact").forEach(l=>{l.onclick=i=>{const r=Number(l.dataset.index);e.contacts[r].pinned&&!confirm("¿Seguro que quieres desfijar este contacto?")||(e.contacts[r].pinned=!e.contacts[r].pinned,w(e.contacts),f())}});const c=document.getElementById("contact-form");c&&(c.onsubmit=l=>{l.preventDefault();const i=Object.fromEntries(new FormData(c)),r=I(i);if(r.length>0){h("Error de validación: "+r.join(", "),"error");return}let u=i.tags?i.tags.split(",").map(N=>N.trim()).filter(Boolean):[];delete i.tags;const m={...i};e.contacts.some((N,$)=>e.editing!==null&&$===e.editing?!1:L(N,m))&&!confirm("Ya existe un contacto similar. ¿Deseas guardarlo de todas formas?")||(e.editing!==null&&e.editing<e.contacts.length?(e.contacts[e.editing]={...e.contacts[e.editing],...i,tags:u},h("Contacto actualizado correctamente","success")):(e.contacts.push({...i,notes:{},tags:u}),h("Contacto añadido correctamente","success")),w(e.contacts),e.editing=null,f())},document.getElementById("cancel-edit").onclick=()=>{e.editing=null,f()});const a=document.getElementById("add-note-form");a&&e.addNoteContactIndex!==null&&(a.onsubmit=l=>{l.preventDefault();const i=document.getElementById("add-note-date").value,r=document.getElementById("add-note-text").value.trim();if(!i||!r){h("Por favor, selecciona una fecha y escribe una nota","warning");return}const u=B(r);if(u.length>0){h("Error en la nota: "+u.join(", "),"error");return}const m=e.addNoteContactIndex;e.contacts[m].notes||(e.contacts[m].notes={}),e.contacts[m].notes[i]?e.contacts[m].notes[i]+=`
`+r:e.contacts[m].notes[i]=r,w(e.contacts),h("Nota añadida correctamente","success"),e.showAddNoteModal=!1,e.addNoteContactIndex=null,f()});const s=document.getElementById("note-form");s&&e.selected!==null&&(s.onsubmit=l=>{l.preventDefault();const i=document.getElementById("note-date").value,r=document.getElementById("note-text").value.trim();if(!i||!r){h("Por favor, selecciona una fecha y escribe una nota","warning");return}const u=B(r);if(u.length>0){h("Error en la nota: "+u.join(", "),"error");return}e.contacts[e.selected].notes||(e.contacts[e.selected].notes={}),e.contacts[e.selected].notes[i]?e.contacts[e.selected].notes[i]+=`
`+r:e.contacts[e.selected].notes[i]=r,w(e.contacts),h("Nota guardada correctamente","success"),document.getElementById("note-text").value="",f()}),document.querySelectorAll(".edit-note").forEach(l=>{l.onclick=i=>{const r=l.dataset.date,u=document.getElementById("edit-note-modal"),m=document.getElementById("edit-note-text");m.value=e.contacts[e.selected].notes[r],u.style.display="block",document.getElementById("save-edit-note").onclick=()=>{const k=m.value.trim(),N=B(k);if(N.length>0){h("Error en la nota: "+N.join(", "),"error");return}e.contacts[e.selected].notes[r]=k,w(e.contacts),h("Nota actualizada correctamente","success"),u.style.display="none",f()},document.getElementById("cancel-edit-note").onclick=()=>{u.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(l=>{l.onclick=i=>{const r=l.dataset.date;confirm(`¿Estás seguro de eliminar la nota del ${r}?

Esta acción no se puede deshacer.`)&&(delete e.contacts[e.selected].notes[r],w(e.contacts),h("Nota eliminada correctamente","success"),f())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{K(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{Z(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{Y(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async l=>{const i=l.target.files[0];if(!i)return;const r=await i.text();let u=[];if(i.name.endsWith(".vcf"))u=z(r);else if(i.name.endsWith(".csv"))u=W(r);else if(i.name.endsWith(".json"))try{const m=JSON.parse(r);Array.isArray(m)?u=m:m&&Array.isArray(m.contacts)&&(u=m.contacts)}catch{}if(u.length){const m=[],k=[];if(u.forEach((x,S)=>{const C=I(x);C.length===0?m.push(x):k.push({index:S+1,errors:C})}),k.length>0){const x=k.map(S=>`Contacto ${S.index}: ${S.errors.join(", ")}`).join(`
`);if(!confirm(`Se encontraron ${k.length} contacto(s) con errores:

${x}

¿Deseas importar solo los contactos válidos (${m.length})?`))return}const N=x=>e.contacts.some(S=>S.name===x.name&&S.surname===x.surname&&S.phone===x.phone),$=m.filter(x=>!N(x));$.length?(e.contacts=e.contacts.concat($),w(e.contacts),h(`${$.length} contacto(s) importado(s) correctamente`,"success"),f()):h("No se han importado contactos nuevos (todos ya existen)","info")}else h("No se pudieron importar contactos del archivo seleccionado","error")};const o=document.getElementById("close-all-notes");o&&(o.onclick=()=>{e.showAllNotes=!1,e.allNotesPage=1,f()});const d=document.getElementById("show-all-notes-btn");d&&(d.onclick=()=>{e.showAllNotes=!0,e.allNotesPage=1,f()});const p=document.getElementById("prev-notes-page");p&&(p.onclick=()=>{e.allNotesPage>1&&(e.allNotesPage--,f())});const y=document.getElementById("next-notes-page");y&&(y.onclick=()=>{let l=[];e.contacts.forEach((r,u)=>{r.notes&&Object.entries(r.notes).forEach(([m,k])=>{l.push({date:m,text:k,contact:r,contactIndex:u})})});const i=Math.max(1,Math.ceil(l.length/4));e.allNotesPage<i&&(e.allNotesPage++,f())}),document.querySelectorAll(".edit-note-link").forEach(l=>{l.onclick=i=>{i.preventDefault();const r=Number(l.dataset.contact),u=l.dataset.date;e.selected=r,e.editing=null,e.showAllNotes=!1,f(),setTimeout(()=>{const m=document.querySelector(`.edit-note[data-date="${u}"]`);m&&m.click()},50)}}),document.querySelectorAll(".share-backup-btn").forEach(l=>{l.onclick=async()=>{const i=l.dataset.fecha,u=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(x=>x.fecha===i);if(!u)return alert("No se encontró la copia seleccionada.");const m=`contactos_backup_${i}.json`,k=JSON.stringify(u.datos,null,2),N=new Blob([k],{type:"application/json"}),$=document.createElement("a");if($.href=URL.createObjectURL(N),$.download=m,$.style.display="none",document.body.appendChild($),$.click(),setTimeout(()=>{URL.revokeObjectURL($.href),$.remove()},1e3),navigator.canShare&&window.File&&window.FileReader)try{const x=new File([N],m,{type:"application/json"});navigator.canShare({files:[x]})&&await navigator.share({files:[x],title:"Backup de Contactos",text:`Copia de seguridad (${i}) de ContactosDiarios`})}catch{}}});const g=document.getElementById("manage-duplicates-btn");g&&(g.onclick=()=>{e.duplicates=X(),e.duplicates.length===0?h("No se encontraron contactos duplicados","info"):(e.showDuplicateModal=!0,f())});const v=document.getElementById("validate-contacts-btn");v&&(v.onclick=()=>{const l=[];if(e.contacts.forEach((i,r)=>{const u=I(i);if(u.length>0){const m=i.surname?`${i.surname}, ${i.name}`:i.name;l.push({index:r+1,name:m,errors:u})}}),l.length===0)h(`✅ Todos los ${e.contacts.length} contactos son válidos`,"success");else{const i=l.map(r=>`${r.index}. ${r.name}: ${r.errors.join(", ")}`).join(`
`);h(`⚠️ Se encontraron ${l.length} contacto(s) con errores`,"warning"),console.log("Contactos con errores de validación:",l),confirm(`Se encontraron ${l.length} contacto(s) con errores de validación:

${i}

¿Deseas ver más detalles en la consola del navegador?`)&&console.table(l)}});const b=document.getElementById("cancel-duplicate-resolution");b&&(b.onclick=()=>{e.showDuplicateModal=!1,e.duplicates=[],f()});const E=document.getElementById("apply-resolution");E&&(E.onclick=te),document.querySelectorAll('input[name^="resolution-"]').forEach(l=>{l.addEventListener("change",()=>{const i=l.name.split("-")[1],r=document.getElementById(`merge-section-${i}`),u=document.getElementById(`individual-section-${i}`);l.value==="merge"?(r.style.display="block",u.style.display="none"):l.value==="select"?(r.style.display="none",u.style.display="block"):(r.style.display="none",u.style.display="none")})}),document.querySelectorAll('.resolution-option input[type="radio"]').forEach(l=>{l.addEventListener("change",()=>{const i=l.name;document.querySelectorAll(`input[name="${i}"]`).forEach(r=>{r.closest(".resolution-option").classList.remove("selected")}),l.closest(".resolution-option").classList.add("selected")})})}function z(n){const t=[],c=n.split("END:VCARD");for(const a of c){const s=/FN:([^\n]*)/.exec(a)?.[1]?.trim(),o=/N:.*;([^;\n]*)/.exec(a)?.[1]?.trim()||"",d=/TEL.*:(.+)/.exec(a)?.[1]?.trim(),p=/EMAIL.*:(.+)/.exec(a)?.[1]?.trim();s&&t.push({name:s,surname:o,phone:d||"",email:p||"",notes:{},tags:[]})}return t}function G(n){return n.map(t=>`BEGIN:VCARD
VERSION:3.0
FN:${t.name}
N:${t.surname||""};;;;
TEL:${t.phone||""}
EMAIL:${t.email||""}
END:VCARD`).join(`
`)}function W(n){const t=n.split(`
`).filter(Boolean),[c,...a]=t;return a.map(s=>{const[o,d,p,y,g,v]=s.split(",");return{name:o?.trim()||"",surname:d?.trim()||"",phone:p?.trim()||"",email:y?.trim()||"",notes:v?JSON.parse(v):{},tags:g?g.split(";").map(b=>b.trim()):[]}})}function K(){const n=G(e.contacts),t=new Blob([n],{type:"text/vcard"}),c=document.createElement("a");c.href=URL.createObjectURL(t),c.download="contactos.vcf",c.click()}function Z(){const n="name,surname,phone,email,tags,notes",t=e.contacts.map(o=>[o.name,o.surname,o.phone,o.email,(o.tags||[]).join(";"),JSON.stringify(o.notes||{})].map(d=>'"'+String(d).replace(/"/g,'""')+'"').join(",")),c=[n,...t].join(`
`),a=new Blob([c],{type:"text/csv"}),s=document.createElement("a");s.href=URL.createObjectURL(a),s.download="contactos.csv",s.click()}function Y(){const n=new Blob([JSON.stringify(e.contacts,null,2)],{type:"application/json"}),t=document.createElement("a");t.href=URL.createObjectURL(n),t.download="contactos.json",t.click()}function A(){const n=new Date,c=new Date(n.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);let a=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");a.find(s=>s.fecha===c)||(a.push({fecha:c,datos:e.contacts}),a.length>10&&(a=a.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(a))),localStorage.setItem("contactos_diarios_backup_fecha",c)}setInterval(A,60*60*1e3);A();function H(n){if(!confirm("¿Seguro que quieres restaurar la copia de seguridad del "+n+"? Se sobrescribirán los contactos actuales."))return;const c=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(a=>a.fecha===n);c?(e.contacts=c.datos,w(e.contacts),f(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}function L(n,t){const c=a=>a?a.toLowerCase().replace(/\s+/g," ").trim():"";return!!(c(n.name)===c(t.name)&&c(n.surname)===c(t.surname)||n.phone&&t.phone&&n.phone.replace(/\s+/g,"")===t.phone.replace(/\s+/g,"")||n.email&&t.email&&c(n.email)===c(t.email))}function X(){const n=[],t=new Set;for(let c=0;c<e.contacts.length;c++){if(t.has(c))continue;const a=[{...e.contacts[c],originalIndex:c}];t.add(c);for(let s=c+1;s<e.contacts.length;s++)t.has(s)||L(e.contacts[c],e.contacts[s])&&(a.push({...e.contacts[s],originalIndex:s}),t.add(s));a.length>1&&n.push({contacts:a})}return n}function M(n){if(n.length===0)return null;if(n.length===1)return n[0];const t={name:"",surname:"",phone:"",email:"",tags:[],notes:{},pinned:!1};let c="",a="";n.forEach(o=>{o.name&&o.name.length>c.length&&(c=o.name),o.surname&&o.surname.length>a.length&&(a=o.surname)}),t.name=c,t.surname=a,t.phone=n.find(o=>o.phone)?.phone||"",t.email=n.find(o=>o.email)?.email||"";const s=new Set;return n.forEach(o=>{o.tags&&o.tags.forEach(d=>s.add(d))}),t.tags=Array.from(s),n.forEach((o,d)=>{o.notes&&Object.entries(o.notes).forEach(([p,y])=>{t.notes[p]?t.notes[p]+=`
--- Contacto ${d+1} ---
${y}`:t.notes[p]=y})}),t.pinned=n.some(o=>o.pinned),t}function Q(n){const t=M(n);return`
    <div class="merge-preview">
      <h5>🔗 Vista previa del contacto fusionado:</h5>
      <div class="contact-preview">
        <div class="contact-field"><strong>Nombre:</strong> ${t.name}</div>
        <div class="contact-field"><strong>Apellidos:</strong> ${t.surname}</div>
        <div class="contact-field"><strong>Teléfono:</strong> ${t.phone||"No especificado"}</div>
        <div class="contact-field"><strong>Email:</strong> ${t.email||"No especificado"}</div>
        <div class="contact-field">
          <strong>Etiquetas:</strong>
          <div class="tags">
            ${t.tags.map(c=>`<span class="tag">${c}</span>`).join("")}
          </div>
        </div>
        <div class="contact-field">
          <strong>Notas:</strong> ${Object.keys(t.notes).length} fecha(s) con notas
        </div>
        <div class="contact-field">
          <strong>Estado:</strong> ${t.pinned?"📌 Fijado":"Normal"}
        </div>
      </div>
    </div>
  `}function ee({duplicates:n,visible:t}){return!t||n.length===0?'<div id="duplicate-modal" class="modal" style="display:none"></div>':`
    <div id="duplicate-modal" class="modal" style="display:flex;z-index:5000;">
      <div class="modal-content" style="max-width:800px;max-height:90vh;overflow-y:auto;">
        <h3>🔍 Gestión de contactos duplicados</h3>
        <p>Se encontraron <strong>${n.length}</strong> grupo(s) de contactos duplicados. 
           Para cada grupo, elige cómo resolverlo:</p>
        
        ${n.map((c,a)=>`
          <div class="duplicate-group" style="border:1px solid #ddd;border-radius:8px;padding:15px;margin:15px 0;background:#fafafa;">
            <h4>Grupo ${a+1} - ${c.contacts.length} contactos similares</h4>
            
            <!-- Opciones de resolución -->
            <div class="resolution-options">
              <label class="resolution-option">
                <input type="radio" name="resolution-${a}" value="merge" checked>
                🔗 Fusionar en un contacto
              </label>
              <label class="resolution-option">
                <input type="radio" name="resolution-${a}" value="select">
                👆 Seleccionar uno y eliminar otros
              </label>
              <label class="resolution-option">
                <input type="radio" name="resolution-${a}" value="skip">
                ⏭️ Omitir este grupo
              </label>
            </div>
            
            <!-- Vista previa de fusión (mostrar por defecto) -->
            <div class="merge-section" id="merge-section-${a}">
              ${Q(c.contacts)}
            </div>
            
            <!-- Sección de selección individual (oculta por defecto) -->
            <div class="individual-selection" id="individual-section-${a}" style="display:none;">
              <h5>Selecciona el contacto a mantener:</h5>
              ${c.contacts.map((s,o)=>`
                <label class="duplicate-contact" style="display:block;margin:8px 0;padding:12px;border:1px solid #ccc;border-radius:6px;cursor:pointer;">
                  <input type="radio" name="keep-${a}" value="${s.originalIndex}">
                  <strong>${s.surname?s.surname+", ":""}${s.name}</strong>
                  ${s.phone?`📞 ${s.phone}`:""}
                  ${s.email?`✉️ ${s.email}`:""}
                  ${s.tags&&s.tags.length>0?`<br>🏷️ ${s.tags.join(", ")}`:""}
                  ${Object.keys(s.notes||{}).length>0?`<br>📝 ${Object.keys(s.notes).length} nota(s)`:""}
                  ${s.pinned?"<br>📌 Fijado":""}
                </label>
              `).join("")}
            </div>
          </div>
        `).join("")}
        
        <div class="form-actions" style="margin-top:20px;">
          <button id="apply-resolution" style="background:#28a745;color:white;">Aplicar resolución</button>
          <button id="cancel-duplicate-resolution" style="background:#6c757d;color:white;">Cancelar</button>
        </div>
      </div>
    </div>
  `}function te(){const n=[];let t=0;if(e.duplicates.forEach((o,d)=>{const p=document.querySelector(`input[name="resolution-${d}"]:checked`),y=p?p.value:"skip";if(y==="merge")n.push({type:"merge",groupIndex:d,contacts:o.contacts}),t++;else if(y==="select"){const g=document.querySelector(`input[name="keep-${d}"]:checked`);if(g){const v=parseInt(g.value),b=o.contacts.filter(E=>E.originalIndex!==v).map(E=>E.originalIndex);n.push({type:"delete",groupIndex:d,toDelete:b,toKeep:v}),t++}}}),t===0){h("No hay operaciones que realizar","info");return}const c=n.filter(o=>o.type==="merge").length,a=n.filter(o=>o.type==="delete").length;let s=`¿Confirmar las siguientes operaciones?

`;if(c>0&&(s+=`🔗 Fusionar ${c} grupo(s) de contactos
`),a>0&&(s+=`🗑️ Eliminar duplicados en ${a} grupo(s)
`),s+=`
Esta acción no se puede deshacer.`,!confirm(s)){h("Operación cancelada","info");return}try{let o=0,d=0;const p=[];n.forEach(b=>{if(b.type==="merge"){const E=M(b.contacts);e.contacts.push(E),b.contacts.forEach(l=>{p.push(l.originalIndex)}),o++}else b.type==="delete"&&(b.toDelete.forEach(E=>{p.push(E)}),d+=b.toDelete.length)}),[...new Set(p)].sort((b,E)=>E-b).forEach(b=>{b<e.contacts.length&&e.contacts.splice(b,1)}),w(e.contacts);let g="Resolución completada: ";const v=[];o>0&&v.push(`${o} contacto(s) fusionado(s)`),d>0&&v.push(`${d} duplicado(s) eliminado(s)`),g+=v.join(" y "),h(g,"success"),e.showDuplicateModal=!1,e.duplicates=[],f()}catch(o){h("Error al aplicar resolución: "+o.message,"error")}}function h(n,t="info"){const c=document.querySelector(".notification");c&&c.remove();const a=document.createElement("div");switch(a.className=`notification ${t}`,a.textContent=n,a.style.cssText=`
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    z-index: 10000;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    max-width: 400px;
    word-wrap: break-word;
    animation: slideInNotification 0.3s ease-out;
  `,t){case"success":a.style.background="#d4edda",a.style.color="#155724",a.style.border="1px solid #c3e6cb";break;case"error":a.style.background="#f8d7da",a.style.color="#721c24",a.style.border="1px solid #f5c6cb";break;case"warning":a.style.background="#fff3cd",a.style.color="#856404",a.style.border="1px solid #ffeaa7";break;default:a.style.background="#d1ecf1",a.style.color="#0c5460",a.style.border="1px solid #bee5eb"}document.body.appendChild(a),setTimeout(()=>{a.parentNode&&(a.style.animation="slideOutNotification 0.3s ease-in forwards",setTimeout(()=>a.remove(),300))},4e3)}function I(n){const t=[];return(!n.name||n.name.trim().length===0)&&t.push("El nombre es obligatorio"),(!n.surname||n.surname.trim().length===0)&&t.push("Los apellidos son obligatorios"),n.phone&&!/^[0-9+\-() ]+$/.test(n.phone)&&t.push("El teléfono contiene caracteres no válidos"),n.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n.email)&&t.push("El formato del email no es válido"),t}function B(n){return!n||n.trim().length===0?["La nota no puede estar vacía"]:n.trim().length>500?["La nota no puede superar los 500 caracteres"]:[]}document.addEventListener("DOMContentLoaded",()=>{f();let n=null;const t=document.createElement("button");t.textContent="📲 Instalar en tu dispositivo",t.className="add-btn",t.style.display="none",t.style.position="fixed",t.style.bottom="1.5rem",t.style.left="50%",t.style.transform="translateX(-50%)",t.style.zIndex="3000",document.body.appendChild(t),window.addEventListener("beforeinstallprompt",c=>{c.preventDefault(),n=c,t.style.display="block"}),t.addEventListener("click",async()=>{if(n){n.prompt();const{outcome:c}=await n.userChoice;c==="accepted"&&(t.style.display="none"),n=null}}),window.addEventListener("appinstalled",()=>{t.style.display="none"})});
