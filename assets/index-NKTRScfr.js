(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const d of o.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function c(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(a){if(a.ep)return;a.ep=!0;const o=c(a);fetch(a.href,o)}})();const j="0.0.53";(function(){try{const t=localStorage.getItem("app_version");if(t&&t!==j){const c=localStorage.getItem("contactos_diarios"),s=localStorage.getItem("contactos_diarios_backups"),a=localStorage.getItem("contactos_diarios_backup_fecha"),o=localStorage.getItem("contactos_diarios_webdav_config");["app_version","contactos_diarios","contactos_diarios_backups","contactos_diarios_backup_fecha","contactos_diarios_webdav_config"].forEach(m=>{m!=="contactos_diarios"&&localStorage.removeItem(m)}),"caches"in window&&caches.keys().then(m=>{m.forEach(h=>{(h.includes("contactosdiarios")||h.includes("contactos-diarios"))&&caches.delete(h)})}),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(m=>{m.forEach(h=>{h.scope.includes(window.location.origin)&&h.unregister()})}),c&&localStorage.setItem("contactos_diarios",c),s&&localStorage.setItem("contactos_diarios_backups",s),a&&localStorage.setItem("contactos_diarios_backup_fecha",a),o&&localStorage.setItem("contactos_diarios_webdav_config",o),location.reload()}localStorage.setItem("app_version",j)}catch{}})();function M({contacts:n,filter:t,onSelect:c,onDelete:s}){let a=t?n.filter(o=>{const d=t.toLowerCase(),m=o.notes?Object.values(o.notes).join(" ").toLowerCase():"";return o.tags?.some(h=>h.toLowerCase().includes(d))||o.name?.toLowerCase().includes(d)||o.surname?.toLowerCase().includes(d)||m.includes(d)}):n;return a=a.slice().sort((o,d)=>d.pinned&&!o.pinned?1:o.pinned&&!d.pinned?-1:(o.surname||"").localeCompare(d.surname||"")),`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${t||""}" />
      <ul>
        ${a.length===0?'<li class="empty">Sin contactos</li>':a.map((o,d)=>`
          <li${o.pinned?' class="pinned"':""}>
            <div class="contact-main">
              <button class="select-contact" data-index="${n.indexOf(o)}">${o.surname?o.surname+", ":""}${o.name}</button>
              <span class="tags">${(o.tags||[]).map(m=>`<span class='tag'>${m}</span>`).join(" ")}</span>
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
  `}function q({contact:n}){return`
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
  `}function P({notes:n}){const t=new Date;return`
    <div class="notes-area">
      <h3>Notas diarias</h3>
      <form id="note-form">
        <input type="date" id="note-date" value="${new Date(t.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10)}" required />
        <textarea id="note-text" rows="3" placeholder="Escribe una nota para la fecha seleccionada..."></textarea>
        <button type="submit">Guardar nota</button>
      </form>
      <ul class="note-history">
        ${Object.entries(n||{}).sort((a,o)=>o[0].localeCompare(a[0])).map(([a,o])=>`
          <li>
            <b>${a}</b>:
            <span class="note-content" data-date="${a}">${o}</span>
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
  `}function T({contacts:n,visible:t,page:c=1}){let s=[];n.forEach((g,v)=>{g.notes&&Object.entries(g.notes).forEach(([y,E])=>{s.push({date:y,text:E,contact:g,contactIndex:v})})}),s.sort((g,v)=>v.date.localeCompare(g.date));const a=4,o=Math.max(1,Math.ceil(s.length/a)),d=Math.min(Math.max(c,1),o),m=(d-1)*a,h=s.slice(m,m+a);return`
    <div id="all-notes-modal" class="modal" style="display:${t?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${s.length===0?"<li>No hay notas registradas.</li>":h.map(g=>`
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
  `}function R({visible:n,backups:t}){return`
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
  `}function V({visible:n,contactIndex:t}){const c=t!==null?e.contacts[t]:null,s=new Date,o=new Date(s.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);return`
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
  `}const O="contactos_diarios";let e={contacts:J(),selected:null,notes:"",editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1,showAddNoteModal:!1,addNoteContactIndex:null,allNotesPage:1,duplicates:[],showDuplicateModal:!1};function J(){try{return JSON.parse(localStorage.getItem(O))||[]}catch{return[]}}function N(n){localStorage.setItem(O,JSON.stringify(n))}function f(){const n=document.querySelector("#app"),t=e.editing!==null?e.contacts[e.editing]:null,c=e.selected!==null?e.contacts[e.selected].notes||{}:{};n.innerHTML=`
    <h1>Diario de Contactos</h1>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <button id="manage-duplicates-btn" style="background:#dc3545;color:#fff;margin:0 10px 1.2rem 0;">🔍 Gestionar duplicados</button>
    <button id="validate-contacts-btn" style="background:#28a745;color:#fff;margin:0 10px 1.2rem 0;">✅ Validar contactos</button>
    <div class="main-grid">
      <div>
        <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
        ${F({})}
        ${M({contacts:e.contacts,filter:e.tagFilter})}
        <button id="show-backup-modal" class="add-btn" style="width:100%;margin-top:0.7rem;background:#06b6d4;">Restaurar copia local</button>
      </div>
      <div>
        ${e.editing!==null?q({contact:t}):""}
        ${e.selected!==null&&e.editing===null?P({notes:c}):""}
      </div>
    </div>
    ${T({contacts:e.contacts,visible:e.showAllNotes,page:e.allNotesPage})}
    ${R({visible:e.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})} <!-- Modal de backup -->
    ${V({visible:e.showAddNoteModal,contactIndex:e.addNoteContactIndex})} <!-- Modal añadir nota -->
    ${ee({duplicates:e.duplicates,visible:e.showDuplicateModal})} <!-- Modal de gestión de duplicados -->
  `,U();const s=document.getElementById("show-backup-modal");s&&(s.onclick=()=>{e.showBackupModal=!0,f()});const a=document.getElementById("close-backup-modal");a&&(a.onclick=()=>{e.showBackupModal=!1,f()}),document.querySelectorAll(".add-note-contact").forEach(m=>{m.onclick=h=>{e.addNoteContactIndex=Number(m.dataset.index),e.showAddNoteModal=!0,f()}});const o=document.getElementById("cancel-add-note");o&&(o.onclick=()=>{e.showAddNoteModal=!1,e.addNoteContactIndex=null,f()}),document.querySelectorAll(".restore-backup-btn").forEach(m=>{m.onclick=()=>H(m.dataset.fecha)});const d=document.getElementById("restore-local-backup");d&&(d.onclick=restaurarBackupLocal)}let D=null;function U(){const n=document.getElementById("tag-filter");n&&n.addEventListener("input",i=>{clearTimeout(D),D=setTimeout(()=>{e.tagFilter=n.value,f();const l=document.getElementById("tag-filter");l&&(l.value=e.tagFilter,l.focus(),l.setSelectionRange(e.tagFilter.length,e.tagFilter.length))},300)});const t=document.getElementById("add-contact");t&&(t.onclick=()=>{e.editing=null,e.selected=null,f(),e.editing=e.contacts.length,f()}),document.querySelectorAll(".select-contact").forEach(i=>{i.onclick=l=>{e.selected=Number(i.dataset.index),e.editing=null,f()}}),document.querySelectorAll(".edit-contact").forEach(i=>{i.onclick=l=>{e.editing=Number(i.dataset.index),e.selected=null,f()}}),document.querySelectorAll(".delete-contact").forEach(i=>{i.onclick=l=>{const r=Number(i.dataset.index),u=e.contacts[r],p=u.surname?`${u.surname}, ${u.name}`:u.name;confirm(`¿Estás seguro de eliminar el contacto "${p}"?

Esta acción no se puede deshacer.`)&&(e.contacts.splice(r,1),N(e.contacts),b("Contacto eliminado correctamente","success"),e.selected=null,f())}}),document.querySelectorAll(".pin-contact").forEach(i=>{i.onclick=l=>{const r=Number(i.dataset.index);e.contacts[r].pinned&&!confirm("¿Seguro que quieres desfijar este contacto?")||(e.contacts[r].pinned=!e.contacts[r].pinned,N(e.contacts),f())}});const c=document.getElementById("contact-form");c&&(c.onsubmit=i=>{i.preventDefault();const l=Object.fromEntries(new FormData(c)),r=I(l);if(r.length>0){b("Error de validación: "+r.join(", "),"error");return}let u=l.tags?l.tags.split(",").map(w=>w.trim()).filter(Boolean):[];delete l.tags;const p={...l};e.contacts.some((w,$)=>e.editing!==null&&$===e.editing?!1:_(w,p))&&!confirm("Ya existe un contacto similar. ¿Deseas guardarlo de todas formas?")||(e.editing!==null&&e.editing<e.contacts.length?(e.contacts[e.editing]={...e.contacts[e.editing],...l,tags:u},b("Contacto actualizado correctamente","success")):(e.contacts.push({...l,notes:{},tags:u}),b("Contacto añadido correctamente","success")),N(e.contacts),e.editing=null,f())},document.getElementById("cancel-edit").onclick=()=>{e.editing=null,f()});const s=document.getElementById("add-note-form");s&&e.addNoteContactIndex!==null&&(s.onsubmit=i=>{i.preventDefault();const l=document.getElementById("add-note-date").value,r=document.getElementById("add-note-text").value.trim();if(!l||!r){b("Por favor, selecciona una fecha y escribe una nota","warning");return}const u=C(r);if(u.length>0){b("Error en la nota: "+u.join(", "),"error");return}const p=e.addNoteContactIndex;e.contacts[p].notes||(e.contacts[p].notes={}),e.contacts[p].notes[l]?e.contacts[p].notes[l]+=`
`+r:e.contacts[p].notes[l]=r,N(e.contacts),b("Nota añadida correctamente","success"),e.showAddNoteModal=!1,e.addNoteContactIndex=null,f()});const a=document.getElementById("note-form");a&&e.selected!==null&&(a.onsubmit=i=>{i.preventDefault();const l=document.getElementById("note-date").value,r=document.getElementById("note-text").value.trim();if(!l||!r){b("Por favor, selecciona una fecha y escribe una nota","warning");return}const u=C(r);if(u.length>0){b("Error en la nota: "+u.join(", "),"error");return}e.contacts[e.selected].notes||(e.contacts[e.selected].notes={}),e.contacts[e.selected].notes[l]?e.contacts[e.selected].notes[l]+=`
`+r:e.contacts[e.selected].notes[l]=r,N(e.contacts),b("Nota guardada correctamente","success"),document.getElementById("note-text").value="",f()}),document.querySelectorAll(".edit-note").forEach(i=>{i.onclick=l=>{const r=i.dataset.date,u=document.getElementById("edit-note-modal"),p=document.getElementById("edit-note-text");p.value=e.contacts[e.selected].notes[r],u.style.display="block",document.getElementById("save-edit-note").onclick=()=>{const k=p.value.trim(),w=C(k);if(w.length>0){b("Error en la nota: "+w.join(", "),"error");return}e.contacts[e.selected].notes[r]=k,N(e.contacts),b("Nota actualizada correctamente","success"),u.style.display="none",f()},document.getElementById("cancel-edit-note").onclick=()=>{u.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(i=>{i.onclick=l=>{const r=i.dataset.date;confirm(`¿Estás seguro de eliminar la nota del ${r}?

Esta acción no se puede deshacer.`)&&(delete e.contacts[e.selected].notes[r],N(e.contacts),b("Nota eliminada correctamente","success"),f())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{W(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{Z(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{Y(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async i=>{const l=i.target.files[0];if(!l)return;const r=await l.text();let u=[];if(l.name.endsWith(".vcf"))u=z(r);else if(l.name.endsWith(".csv"))u=K(r);else if(l.name.endsWith(".json"))try{const p=JSON.parse(r);Array.isArray(p)?u=p:p&&Array.isArray(p.contacts)&&(u=p.contacts)}catch{}if(u.length){const p=[],k=[];if(u.forEach((x,S)=>{const B=I(x);B.length===0?p.push(x):k.push({index:S+1,errors:B})}),k.length>0){const x=k.map(S=>`Contacto ${S.index}: ${S.errors.join(", ")}`).join(`
`);if(!confirm(`Se encontraron ${k.length} contacto(s) con errores:

${x}

¿Deseas importar solo los contactos válidos (${p.length})?`))return}const w=x=>e.contacts.some(S=>S.name===x.name&&S.surname===x.surname&&S.phone===x.phone),$=p.filter(x=>!w(x));$.length?(e.contacts=e.contacts.concat($),N(e.contacts),b(`${$.length} contacto(s) importado(s) correctamente`,"success"),f()):b("No se han importado contactos nuevos (todos ya existen)","info")}else b("No se pudieron importar contactos del archivo seleccionado","error")};const o=document.getElementById("close-all-notes");o&&(o.onclick=()=>{e.showAllNotes=!1,e.allNotesPage=1,f()});const d=document.getElementById("show-all-notes-btn");d&&(d.onclick=()=>{e.showAllNotes=!0,e.allNotesPage=1,f()});const m=document.getElementById("prev-notes-page");m&&(m.onclick=()=>{e.allNotesPage>1&&(e.allNotesPage--,f())});const h=document.getElementById("next-notes-page");h&&(h.onclick=()=>{let i=[];e.contacts.forEach((r,u)=>{r.notes&&Object.entries(r.notes).forEach(([p,k])=>{i.push({date:p,text:k,contact:r,contactIndex:u})})});const l=Math.max(1,Math.ceil(i.length/4));e.allNotesPage<l&&(e.allNotesPage++,f())}),document.querySelectorAll(".edit-note-link").forEach(i=>{i.onclick=l=>{l.preventDefault();const r=Number(i.dataset.contact),u=i.dataset.date;e.selected=r,e.editing=null,e.showAllNotes=!1,f(),setTimeout(()=>{const p=document.querySelector(`.edit-note[data-date="${u}"]`);p&&p.click()},50)}}),document.querySelectorAll(".share-backup-btn").forEach(i=>{i.onclick=async()=>{const l=i.dataset.fecha,u=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(x=>x.fecha===l);if(!u)return alert("No se encontró la copia seleccionada.");const p=`contactos_backup_${l}.json`,k=JSON.stringify(u.datos,null,2),w=new Blob([k],{type:"application/json"}),$=document.createElement("a");if($.href=URL.createObjectURL(w),$.download=p,$.style.display="none",document.body.appendChild($),$.click(),setTimeout(()=>{URL.revokeObjectURL($.href),$.remove()},1e3),navigator.canShare&&window.File&&window.FileReader)try{const x=new File([w],p,{type:"application/json"});navigator.canShare({files:[x]})&&await navigator.share({files:[x],title:"Backup de Contactos",text:`Copia de seguridad (${l}) de ContactosDiarios`})}catch{}}});const g=document.getElementById("manage-duplicates-btn");g&&(g.onclick=()=>{e.duplicates=X(),e.duplicates.length===0?b("No se encontraron contactos duplicados","info"):(e.showDuplicateModal=!0,f())});const v=document.getElementById("validate-contacts-btn");v&&(v.onclick=()=>{const i=[];if(e.contacts.forEach((l,r)=>{const u=I(l);if(u.length>0){const p=l.surname?`${l.surname}, ${l.name}`:l.name;i.push({index:r+1,name:p,errors:u})}}),i.length===0)b(`✅ Todos los ${e.contacts.length} contactos son válidos`,"success");else{const l=i.map(r=>`${r.index}. ${r.name}: ${r.errors.join(", ")}`).join(`
`);b(`⚠️ Se encontraron ${i.length} contacto(s) con errores`,"warning"),console.log("Contactos con errores de validación:",i),confirm(`Se encontraron ${i.length} contacto(s) con errores de validación:

${l}

¿Deseas ver más detalles en la consola del navegador?`)&&console.table(i)}});const y=document.getElementById("cancel-duplicate-resolution");y&&(y.onclick=()=>{e.showDuplicateModal=!1,e.duplicates=[],f()});const E=document.getElementById("apply-resolution");E&&(E.onclick=te),document.querySelectorAll('input[name^="resolution-"]').forEach(i=>{i.addEventListener("change",()=>{const l=i.name.split("-")[1],r=document.getElementById(`merge-section-${l}`),u=document.getElementById(`individual-section-${l}`);i.value==="merge"?(r.style.display="block",u.style.display="none"):i.value==="select"?(r.style.display="none",u.style.display="block"):(r.style.display="none",u.style.display="none")})}),document.querySelectorAll('.resolution-option input[type="radio"]').forEach(i=>{i.addEventListener("change",()=>{const l=i.name;document.querySelectorAll(`input[name="${l}"]`).forEach(r=>{r.closest(".resolution-option").classList.remove("selected")}),i.closest(".resolution-option").classList.add("selected")})})}function z(n){const t=[],c=n.split("END:VCARD");for(const s of c){const a=/FN:([^\n]*)/.exec(s)?.[1]?.trim(),o=/N:.*;([^;\n]*)/.exec(s)?.[1]?.trim()||"",d=/TEL.*:(.+)/.exec(s)?.[1]?.trim(),m=/EMAIL.*:(.+)/.exec(s)?.[1]?.trim();a&&t.push({name:a,surname:o,phone:d||"",email:m||"",notes:{},tags:[]})}return t}function G(n){return n.map(t=>`BEGIN:VCARD
VERSION:3.0
FN:${t.name}
N:${t.surname||""};;;;
TEL:${t.phone||""}
EMAIL:${t.email||""}
END:VCARD`).join(`
`)}function K(n){const t=n.split(`
`).filter(Boolean),[c,...s]=t;return s.map(a=>{const[o,d,m,h,g,v]=a.split(",");return{name:o?.trim()||"",surname:d?.trim()||"",phone:m?.trim()||"",email:h?.trim()||"",notes:v?JSON.parse(v):{},tags:g?g.split(";").map(y=>y.trim()):[]}})}function W(){const n=G(e.contacts),t=new Blob([n],{type:"text/vcard"}),c=document.createElement("a");c.href=URL.createObjectURL(t),c.download="contactos.vcf",c.click()}function Z(){const n="name,surname,phone,email,tags,notes",t=e.contacts.map(o=>[o.name,o.surname,o.phone,o.email,(o.tags||[]).join(";"),JSON.stringify(o.notes||{})].map(d=>'"'+String(d).replace(/"/g,'""')+'"').join(",")),c=[n,...t].join(`
`),s=new Blob([c],{type:"text/csv"}),a=document.createElement("a");a.href=URL.createObjectURL(s),a.download="contactos.csv",a.click()}function Y(){const n=new Blob([JSON.stringify(e.contacts,null,2)],{type:"application/json"}),t=document.createElement("a");t.href=URL.createObjectURL(n),t.download="contactos.json",t.click()}function A(){const n=new Date,c=new Date(n.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);let s=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");s.find(a=>a.fecha===c)||(s.push({fecha:c,datos:e.contacts}),s.length>10&&(s=s.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(s))),localStorage.setItem("contactos_diarios_backup_fecha",c)}setInterval(A,60*60*1e3);A();function H(n){if(!confirm("¿Seguro que quieres restaurar la copia de seguridad del "+n+"? Se sobrescribirán los contactos actuales."))return;const c=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(s=>s.fecha===n);c?(e.contacts=c.datos,N(e.contacts),f(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}function _(n,t){const c=s=>s?s.toLowerCase().replace(/\s+/g," ").trim():"";return!!(c(n.name)===c(t.name)&&c(n.surname)===c(t.surname)||n.phone&&t.phone&&n.phone.replace(/\s+/g,"")===t.phone.replace(/\s+/g,"")||n.email&&t.email&&c(n.email)===c(t.email))}function X(){const n=[],t=new Set;for(let c=0;c<e.contacts.length;c++){if(t.has(c))continue;const s=[{...e.contacts[c],originalIndex:c}];t.add(c);for(let a=c+1;a<e.contacts.length;a++)t.has(a)||_(e.contacts[c],e.contacts[a])&&(s.push({...e.contacts[a],originalIndex:a}),t.add(a));s.length>1&&n.push({contacts:s})}return n}function L(n){if(n.length===0)return null;if(n.length===1)return n[0];const t={name:"",surname:"",phone:"",email:"",tags:[],notes:{},pinned:!1};let c="",s="";n.forEach(o=>{o.name&&o.name.length>c.length&&(c=o.name),o.surname&&o.surname.length>s.length&&(s=o.surname)}),t.name=c,t.surname=s,t.phone=n.find(o=>o.phone)?.phone||"",t.email=n.find(o=>o.email)?.email||"";const a=new Set;return n.forEach(o=>{o.tags&&o.tags.forEach(d=>a.add(d))}),t.tags=Array.from(a),n.forEach((o,d)=>{o.notes&&Object.entries(o.notes).forEach(([m,h])=>{t.notes[m]?t.notes[m]+=`
--- Contacto ${d+1} ---
${h}`:t.notes[m]=h})}),t.pinned=n.some(o=>o.pinned),t}function Q(n){const t=L(n);return`
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
        
        ${n.map((c,s)=>`
          <div class="duplicate-group" style="border:1px solid #ddd;border-radius:8px;padding:15px;margin:15px 0;background:#fafafa;">
            <h4>Grupo ${s+1} - ${c.contacts.length} contactos similares</h4>
            
            <!-- Opciones de resolución -->
            <div class="resolution-options">
              <label class="resolution-option">
                <input type="radio" name="resolution-${s}" value="merge" checked>
                🔗 Fusionar en un contacto
              </label>
              <label class="resolution-option">
                <input type="radio" name="resolution-${s}" value="select">
                👆 Seleccionar uno y eliminar otros
              </label>
              <label class="resolution-option">
                <input type="radio" name="resolution-${s}" value="skip">
                ⏭️ Omitir este grupo
              </label>
            </div>
            
            <!-- Vista previa de fusión (mostrar por defecto) -->
            <div class="merge-section" id="merge-section-${s}">
              ${Q(c.contacts)}
            </div>
            
            <!-- Sección de selección individual (oculta por defecto) -->
            <div class="individual-selection" id="individual-section-${s}" style="display:none;">
              <h5>Selecciona el contacto a mantener:</h5>
              ${c.contacts.map((a,o)=>`
                <label class="duplicate-contact" style="display:block;margin:8px 0;padding:12px;border:1px solid #ccc;border-radius:6px;cursor:pointer;">
                  <input type="radio" name="keep-${s}" value="${a.originalIndex}">
                  <strong>${a.surname?a.surname+", ":""}${a.name}</strong>
                  ${a.phone?`📞 ${a.phone}`:""}
                  ${a.email?`✉️ ${a.email}`:""}
                  ${a.tags&&a.tags.length>0?`<br>🏷️ ${a.tags.join(", ")}`:""}
                  ${Object.keys(a.notes||{}).length>0?`<br>📝 ${Object.keys(a.notes).length} nota(s)`:""}
                  ${a.pinned?"<br>📌 Fijado":""}
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
  `}function te(){const n=[];let t=0;if(e.duplicates.forEach((o,d)=>{const m=document.querySelector(`input[name="resolution-${d}"]:checked`),h=m?m.value:"skip";if(h==="merge")n.push({type:"merge",groupIndex:d,contacts:o.contacts}),t++;else if(h==="select"){const g=document.querySelector(`input[name="keep-${d}"]:checked`);if(g){const v=parseInt(g.value),y=o.contacts.filter(E=>E.originalIndex!==v).map(E=>E.originalIndex);n.push({type:"delete",groupIndex:d,toDelete:y,toKeep:v}),t++}}}),t===0){b("No hay operaciones que realizar","info");return}const c=n.filter(o=>o.type==="merge").length,s=n.filter(o=>o.type==="delete").length;let a=`¿Confirmar las siguientes operaciones?

`;if(c>0&&(a+=`🔗 Fusionar ${c} grupo(s) de contactos
`),s>0&&(a+=`🗑️ Eliminar duplicados en ${s} grupo(s)
`),a+=`
Esta acción no se puede deshacer.`,!confirm(a)){b("Operación cancelada","info");return}try{let o=0,d=0;const m=[];n.forEach(y=>{if(y.type==="merge"){const E=L(y.contacts);e.contacts.push(E),y.contacts.forEach(i=>{m.push(i.originalIndex)}),o++}else y.type==="delete"&&(y.toDelete.forEach(E=>{m.push(E)}),d+=y.toDelete.length)}),[...new Set(m)].sort((y,E)=>E-y).forEach(y=>{y<e.contacts.length&&e.contacts.splice(y,1)}),N(e.contacts);let g="Resolución completada: ";const v=[];o>0&&v.push(`${o} contacto(s) fusionado(s)`),d>0&&v.push(`${d} duplicado(s) eliminado(s)`),g+=v.join(" y "),b(g,"success"),e.showDuplicateModal=!1,e.duplicates=[],f()}catch(o){b("Error al aplicar resolución: "+o.message,"error")}}function b(n,t="info"){const c=document.querySelector(".notification");c&&c.remove();const s=document.createElement("div");switch(s.className=`notification ${t}`,s.textContent=n,s.style.cssText=`
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
  `,t){case"success":s.style.background="#d4edda",s.style.color="#155724",s.style.border="1px solid #c3e6cb";break;case"error":s.style.background="#f8d7da",s.style.color="#721c24",s.style.border="1px solid #f5c6cb";break;case"warning":s.style.background="#fff3cd",s.style.color="#856404",s.style.border="1px solid #ffeaa7";break;default:s.style.background="#d1ecf1",s.style.color="#0c5460",s.style.border="1px solid #bee5eb"}document.body.appendChild(s),setTimeout(()=>{s.parentNode&&(s.style.animation="slideOutNotification 0.3s ease-in forwards",setTimeout(()=>s.remove(),300))},4e3)}function I(n){const t=[];return(!n.name||n.name.trim().length===0)&&t.push("El nombre es obligatorio"),(!n.surname||n.surname.trim().length===0)&&t.push("Los apellidos son obligatorios"),n.phone&&!/^[0-9+\-() ]+$/.test(n.phone)&&t.push("El teléfono contiene caracteres no válidos"),n.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n.email)&&t.push("El formato del email no es válido"),t}function C(n){return!n||n.trim().length===0?["La nota no puede estar vacía"]:n.trim().length>500?["La nota no puede superar los 500 caracteres"]:[]}document.addEventListener("DOMContentLoaded",()=>{f();let n=null;const t=document.createElement("button");t.textContent="📲 Instalar en tu dispositivo",t.className="add-btn",t.style.display="none",t.style.position="fixed",t.style.bottom="1.5rem",t.style.left="50%",t.style.transform="translateX(-50%)",t.style.zIndex="3000",document.body.appendChild(t),window.addEventListener("beforeinstallprompt",c=>{c.preventDefault(),n=c,t.style.display="block"}),t.addEventListener("click",async()=>{if(n){n.prompt();const{outcome:c}=await n.userChoice;c==="accepted"&&(t.style.display="none"),n=null}}),window.addEventListener("appinstalled",()=>{t.style.display="none"})});
