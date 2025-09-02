(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const u of i.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&a(u)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}})();const V="0.1.09",ue={},H="contactos_diarios_dropbox_auth",pe="contactos_diarios_dropbox_state",me="contactos_diarios_dropbox_settings",ge="/contactos_diarios.json";function F(){try{return JSON.parse(localStorage.getItem(me))||{}}catch{return{}}}function Ce(e){const n={...F(),...e};return localStorage.setItem(me,JSON.stringify(n)),n}function P(){return F().appKey||ue?.VITE_DROPBOX_APP_KEY||(typeof window<"u"?window.DROPBOX_APP_KEY:void 0)}function Z(){return F().remotePath||ge}function De(){const e="/ContactosDiarios/";try{return new URL(e,location.origin).toString()}catch{return location.origin+e}}function fe(){const e=F();if(e.redirectUri)return e.redirectUri;const t=ue?.VITE_DROPBOX_REDIRECT_URI;return t||De()}function Q(){try{return JSON.parse(localStorage.getItem(H))||null}catch{return null}}function ee(e){e?localStorage.setItem(H,JSON.stringify(e)):localStorage.removeItem(H)}function te(){try{return JSON.parse(localStorage.getItem(pe))||{}}catch{return{}}}function M(e){const n={...te(),...e};return localStorage.setItem(pe,JSON.stringify(n)),n}function he(){const e=Q();return!!(e&&(e.refresh_token||e.access_token))}function G(e){let t=2166136261;for(let n=0;n<e.length;n++)t^=e.charCodeAt(n),t=Math.imul(t,16777619);return(t>>>0).toString(16)}async function _e(e){const t=new TextEncoder().encode(e),n=await crypto.subtle.digest("SHA-256",t),a=new Uint8Array(n);return btoa(String.fromCharCode.apply(null,a)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function re(e=64){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";let n="";const a=new Uint8Array(e);crypto.getRandomValues(a);for(let s=0;s<e;s++)n+=t[a[s]%t.length];return n}async function Oe(){const e=P();if(!e)throw new Error("Falta configurar Dropbox App Key");const t=re(64),n=await _e(t),a=re(16);sessionStorage.setItem("dropbox_code_verifier",t),sessionStorage.setItem("dropbox_oauth_state",a);const i=`https://www.dropbox.com/oauth2/authorize?${new URLSearchParams({response_type:"code",client_id:e,redirect_uri:fe(),code_challenge:n,code_challenge_method:"S256",token_access_type:"offline",state:a}).toString()}`;location.assign(i)}async function Be(e){const t=P(),n=sessionStorage.getItem("dropbox_code_verifier");if(!t||!n)throw new Error("Auth contexto incompleto");const a=new URLSearchParams({grant_type:"authorization_code",code:e,client_id:t,redirect_uri:fe(),code_verifier:n}),s=await fetch("https://api.dropboxapi.com/oauth2/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:a});if(!s.ok)throw new Error(`Token exchange failed: ${s.status} ${await s.text()}`);const i=await s.json(),u={access_token:i.access_token,refresh_token:i.refresh_token,expires_at:Date.now()+(i.expires_in?i.expires_in*1e3:3600*1e3)-3e4,account_id:i.account_id,uid:i.uid,scope:i.scope};return ee(u),sessionStorage.removeItem("dropbox_code_verifier"),sessionStorage.removeItem("dropbox_oauth_state"),u}async function Le(){const e=P(),t=Q();if(!e||!t?.refresh_token)return null;const n=new URLSearchParams({grant_type:"refresh_token",refresh_token:t.refresh_token,client_id:e}),a=await fetch("https://api.dropboxapi.com/oauth2/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:n});if(!a.ok)throw new Error(`Refresh failed: ${a.status} ${await a.text()}`);const s=await a.json(),i={...t,access_token:s.access_token,expires_at:Date.now()+(s.expires_in?s.expires_in*1e3:3600*1e3)-3e4,scope:s.scope||t.scope};return ee(i),i}async function Re(){let e=Q();return e?((!e.expires_at||Date.now()>e.expires_at)&&(e=await Le()),e?.access_token||null):null}async function Te(){const e=new URL(location.href),t=e.searchParams.get("code"),n=e.searchParams.get("state"),a=sessionStorage.getItem("dropbox_oauth_state");t&&(a&&n!==a?console.warn("Dropbox OAuth state mismatch"):(await Be(t),M({lastAuthAt:Date.now()})),e.searchParams.delete("code"),e.searchParams.delete("state"),history.replaceState({},"",e.toString()))}async function be(e,t={}){const n=await Re();if(!n)throw new Error("No autorizado con Dropbox");const a=Object.assign({},t.headers||{},{Authorization:`Bearer ${n}`});return await fetch(e,{...t,headers:a})}async function Me(){return!0}async function Pe(e=Z()){const t=await be("https://content.dropboxapi.com/2/files/download",{method:"POST",headers:{"Dropbox-API-Arg":JSON.stringify({path:e})}});if(t.status===409)return{exists:!1};if(!t.ok)throw new Error(`Download failed: ${t.status}`);const n=t.headers.get("Dropbox-API-Result"),a=n?JSON.parse(n):{};return{exists:!0,text:await t.text(),meta:a}}async function K(e,t=void 0,n=Z()){const s=await be("https://content.dropboxapi.com/2/files/upload",{method:"POST",headers:{"Content-Type":"application/octet-stream","Dropbox-API-Arg":JSON.stringify({path:n,mode:t?{".tag":"update",update:t}:"overwrite",autorename:!1,mute:!1,strict_conflict:!1})},body:e});if(!s.ok){const u=await s.text();throw new Error(`Upload failed: ${s.status} ${u}`)}return await s.json()}function je(e,t){const n=i=>`${(i.name||"").trim().toLowerCase()}|${(i.surname||"").trim().toLowerCase()}`,a=new Map,s=i=>{const u=n(i);if(!a.has(u)){a.set(u,JSON.parse(JSON.stringify(i)));return}const m=a.get(u),r=Number(m.lastEdited)||0,c=Number(i.lastEdited)||0;c>r&&(m.name=i.name||m.name,m.surname=i.surname||m.surname,m.phone=i.phone||m.phone,m.email=i.email||m.email),m.pinned=!!(m.pinned||i.pinned);const g=new Set([...m.tags||[],...i.tags||[]]);m.tags=Array.from(g),m.notes=m.notes||{};const y=Object.keys(i.notes||{});for(const v of y)v in m.notes?c>=r&&(m.notes[v]=i.notes[v]):m.notes[v]=i.notes[v];m.lastEdited=Math.max(r,c)};return(e||[]).forEach(s),(t||[]).forEach(s),Array.from(a.values())}async function Ue(){await Te()}function ze(){return!!P()}function ye(){return he()}function We(){const e=te();return{lastSync:e.lastSync||null,lastRev:e.lastRev||null,lastHash:e.lastHash||null,remotePath:Z(),appKeyPresent:!!P()}}function Fe({appKey:e,remotePath:t,redirectUri:n}={}){const a={};return e!==void 0&&(a.appKey=e.trim()),t!==void 0&&(a.remotePath=t.trim()||ge),n!==void 0&&(a.redirectUri=n.trim()),Ce(a)}async function Ve(){await Oe()}function qe(){ee(null),M({lastRev:null,lastSync:null})}async function ve(){const e=await Pe();if(!e.exists)return{contacts:null,rev:null};try{const t=JSON.parse(e.text);return{contacts:Array.isArray(t)?t:t.contacts||[],rev:e.meta?.rev||null}}catch{throw new Error("Contenido remoto inválido")}}async function xe(e){const t=te(),n=JSON.stringify({contacts:e},null,2),a=await K(n,t.lastRev||void 0);return M({lastRev:a.rev,lastSync:Date.now(),lastHash:G(n)}),a}async function oe(e){await Me();const t=await ve().catch(s=>({contacts:null,rev:null}));if(!t.contacts){const s=await xe(e||[]);return{merged:e||[],uploaded:!0,rev:s.rev}}const n=je(e||[],t.contacts||[]),a=JSON.stringify({contacts:n},null,2);try{const s=await K(a,t.rev||void 0);return M({lastRev:s.rev,lastSync:Date.now(),lastHash:G(a)}),{merged:n,uploaded:!0,rev:s.rev}}catch{const i=await K(a,void 0);return M({lastRev:i.rev,lastSync:Date.now(),lastHash:G(a)}),{merged:n,uploaded:!0,rev:i.rev}}}let ce=null;function Je(e,t=2e3){he()&&(clearTimeout(ce),ce=setTimeout(async()=>{try{await oe(e||[])}catch(n){console.warn("Dropbox autosync error:",n.message)}},t))}let R=!1,B=[];const le=50,C=console.log;function He(e,t="info"){const n=new Date().toLocaleTimeString(),a={timestamp:n,message:typeof e=="object"?JSON.stringify(e,null,2):e,type:t};B.unshift(a),B.length>le&&(B=B.slice(0,le)),R&&ae(),C(`[${n}] ${e}`)}console.log=function(...e){He(e.join(" "),"info"),C.apply(console,e)};function ne(){C("🐛 Toggling mobile logs, current state:",R),R=!R;let e=document.getElementById("mobile-logs-panel");R?(C("📱 Mostrando panel de logs móvil"),e||(e=document.createElement("div"),e.id="mobile-logs-panel",e.innerHTML=`
        <div class="mobile-logs-header">
          <span>📱 Debug Logs</span>
          <button id="copy-logs-btn">📋</button>
          <button id="clear-logs-btn">🗑️</button>
          <button id="close-logs-btn">❌</button>
        </div>
        <div id="mobile-logs-content"></div>
      `,document.body.appendChild(e),document.getElementById("copy-logs-btn").addEventListener("click",Nt),document.getElementById("clear-logs-btn").addEventListener("click",we),document.getElementById("close-logs-btn").addEventListener("click",ne),C("📱 Panel de logs creado")),e.style.display="block",ae()):(C("📱 Ocultando panel de logs móvil"),e&&(e.style.display="none"))}function ae(){const e=document.getElementById("mobile-logs-content");e&&(e.innerHTML=B.map(t=>`
    <div class="mobile-log-entry mobile-log-${t.type}">
      <span class="mobile-log-time">${t.timestamp}</span>
      <pre class="mobile-log-message">${t.message}</pre>
    </div>
  `).join(""))}function we(){C("🗑️ Limpiando logs móviles"),B=[],ae()}window.toggleMobileLogs=ne;window.clearMobileLogs=we;(function(){try{const t="contactos_diarios_app_version",n=localStorage.getItem(t);if(n&&n!==V){console.log(`🔧 Actualizando ContactosDiarios de v${n} a v${V}`);const a=localStorage.getItem("contactos_diarios"),s=localStorage.getItem("contactos_diarios_backups"),i=localStorage.getItem("contactos_diarios_backup_fecha"),u=localStorage.getItem("contactos_diarios_webdav_config"),m=[t,"contactos_diarios_backups","contactos_diarios_backup_fecha","contactos_diarios_webdav_config"];console.log("🧹 Limpiando SOLO claves de ContactosDiarios:",m),m.forEach(r=>{localStorage.removeItem(r)}),"caches"in window&&caches.keys().then(r=>{r.forEach(c=>{(c.includes("contactosdiarios")||c.includes("contactos-diarios"))&&(console.log("🗑️ Eliminando caché de ContactosDiarios:",c),caches.delete(c))})}),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(r=>{r.forEach(c=>{c.scope.includes("/ContactosDiarios/")||c.active?.scriptURL.includes("ContactosDiarios")||c.active?.scriptURL.includes("contactosdiarios")?(console.log("🔧 Desregistrando service worker de ContactosDiarios:",c.scope),c.unregister()):console.log("✅ Preservando service worker de otra aplicación:",c.scope)})}),a&&localStorage.setItem("contactos_diarios",a),s&&localStorage.setItem("contactos_diarios_backups",s),i&&localStorage.setItem("contactos_diarios_backup_fecha",i),u&&localStorage.setItem("contactos_diarios_webdav_config",u),console.log("✅ Datos de ContactosDiarios restaurados, recargando..."),location.reload()}localStorage.setItem(t,V)}catch(t){console.error("❌ Error en limpieza de ContactosDiarios:",t)}})();function Ge({contacts:e,filter:t,onSelect:n,onDelete:a}){let s=t?e.filter(r=>{const c=t.toLowerCase(),g=r.notes?Object.values(r.notes).join(" ").toLowerCase():"";return r.tags?.some(y=>y.toLowerCase().includes(c))||r.name?.toLowerCase().includes(c)||r.surname?.toLowerCase().includes(c)||g.includes(c)}):e;console.log("🔄 INICIANDO ORDENACIÓN - Estado inicial:",s.length,"contactos"),s.forEach((r,c)=>{(!r.lastEdited||isNaN(Number(r.lastEdited)))&&(console.log(`⚠️ Contacto sin fecha válida: ${r.name} - lastEdited: ${r.lastEdited}`),s[c].lastEdited=0)});for(let r=0;r<2;r++)console.log(`🔄 Pasada de ordenación #${r+1}`),s=s.slice().sort((c,g)=>{const y=/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),v=window.location.hostname==="sasogu.github.io";if(c.pinned!==g.pinned){const D=c.pinned?-1:1;return(y||v)&&console.log(`📌 Fijado: ${c.pinned?c.name:g.name} va arriba (resultado: ${D})`),D}const x=Number(c.lastEdited)||0,k=Number(g.lastEdited)||0,E=k-x;return(y||v)&&r===0&&console.log(`📅 ${c.name}(${x}) vs ${g.name}(${k}) = ${E} (${E>0?g.name:E<0?c.name:"igual"} primero)`),E});console.log("✅ ORDENACIÓN COMPLETADA"),console.log("🔍 VALIDANDO ORDEN FINAL...");const i=s.filter(r=>r.pinned),u=s.filter(r=>!r.pinned);console.log(`📌 Contactos fijados: ${i.length}`),console.log(`📄 Contactos no fijados: ${u.length}`);let m=!0;for(let r=0;r<u.length-1;r++){const c=u[r],g=u[r+1],y=Number(c.lastEdited)||0,v=Number(g.lastEdited)||0;y<v?(console.log(`❌ ERROR: ${c.name} (${y}) debería ir DESPUÉS de ${g.name} (${v})`),m=!1):console.log(`✅ OK: ${c.name} (${y}) antes que ${g.name} (${v})`)}if(m||(console.log("🔧 FORZANDO CORRECCIÓN DEL ORDEN..."),u.sort((r,c)=>{const g=Number(r.lastEdited)||0;return(Number(c.lastEdited)||0)-g}),s=[...i,...u],console.log("✅ ORDEN CORREGIDO")),(window.location.hostname==="sasogu.github.io"||/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))&&console.log("📱 ORDEN FINAL:",s.slice(0,8).map((r,c)=>`${c+1}. ${r.pinned?"📌":"📄"} ${r.name} (${r.lastEdited?new Date(r.lastEdited).toLocaleString():"Sin fecha"})`)),window.location.hostname==="sasogu.github.io"||/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){console.log("📱 DEBUG MÓVIL - Orden contactos:",s.slice(0,5).map(c=>`${c.pinned?"📌":"📄"} ${c.name} (${c.lastEdited?new Date(c.lastEdited).toLocaleString():"Sin fecha"})`));const r=s.filter(c=>!c.pinned);console.log("📄 DEBUG - Contactos NO fijados ordenados:",r.slice(0,5).map(c=>`${c.name} (${c.lastEdited?new Date(c.lastEdited).toLocaleString():"Sin fecha"}) [${c.lastEdited}]`));for(let c=0;c<r.length-1;c++){const g=r[c],y=r[c+1],v=Number(g.lastEdited)||0,x=Number(y.lastEdited)||0;v<x?console.log(`❌ ERROR ORDEN: ${g.name} (${v}) debería ir DESPUÉS de ${y.name} (${x})`):console.log(`✅ ORDEN OK: ${g.name} (${v}) está antes que ${y.name} (${x})`)}}return`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${t||""}" />
      <ul>
        ${s.length===0?'<li class="empty">Sin contactos</li>':s.map((r,c)=>{const g=Date.now(),y=24*60*60*1e3,v=r.lastEdited&&g-r.lastEdited<y,x=v&&!r.pinned?" recently-edited":"";let k="";if(r.lastEdited){const E=g-r.lastEdited,D=Math.floor(E/(60*60*1e3)),L=Math.floor(E%(60*60*1e3)/(60*1e3));D<1?k=L<1?"Ahora":`${L}m`:D<24?k=`${D}h`:k=`${Math.floor(D/24)}d`}return`
          <li${r.pinned?' class="pinned"':x}>
            <div class="contact-main">
              <button class="select-contact" data-index="${e.indexOf(r)}">
                ${v&&!r.pinned?"🆕 ":""}${r.surname?r.surname+", ":""}${r.name}
                ${k&&v?`<span class="time-ago">(${k})</span>`:""}
              </button>
              <span class="tags">${(r.tags||[]).map(E=>`<span class='tag'>${E}</span>`).join(" ")}</span>
              <button class="pin-contact" data-index="${e.indexOf(r)}" title="${r.pinned?"Desfijar":"Fijar"}">${r.pinned?"📌":"📍"}</button>
            </div>
            <div class="contact-info">
              ${r.phone?`<a href="tel:${r.phone}" class="contact-link" title="Llamar"><span>📞</span> ${r.phone}</a>`:""}
              ${r.email?`<a href="mailto:${r.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${r.email}</a>`:""}
            </div>
            <div class="contact-actions">
              <button class="add-note-contact" data-index="${e.indexOf(r)}" title="Añadir nota">📝</button>
              <button class="edit-contact" data-index="${e.indexOf(r)}" title="Editar">✏️</button>
              <button class="delete-contact" data-index="${e.indexOf(r)}" title="Eliminar">🗑️</button>
            </div>
          </li>
          `}).join("")}
      </ul>
    </div>
  `}function Ke({contact:e}){return`
    <form id="contact-form">
      <h2>${e?"Editar":"Nuevo"} contacto</h2>
      <label>Nombre <input name="name" placeholder="Nombre" value="${e?.name||""}" required /></label>
      <label>Apellidos <input name="surname" placeholder="Apellidos" value="${e?.surname||""}" required /></label>
      <label>Teléfono <input name="phone" placeholder="Teléfono" value="${e?.phone||""}" pattern="[0-9+-() ]*" /></label>
      <label>Email <input name="email" placeholder="Email" value="${e?.email||""}" type="email" /></label>
      <label>Etiquetas <input name="tags" placeholder="Ej: familia, trabajo" value="${e?.tags?.join(", ")||""}" /></label>
      <div class="form-actions">
        <button type="submit">Guardar</button>
        <button type="button" id="cancel-edit">Cancelar</button>
      </div>
    </form>
  `}function Xe({notes:e}){if(!W())return`
      <div class="notes-area">
        <h3>🔒 Notas privadas protegidas</h3>
        <div style="text-align:center;padding:20px;background:#f8f9fa;border-radius:8px;margin:20px 0;">
          <p style="margin-bottom:15px;color:#666;">
            Las notas están protegidas con contraseña para mantener tu privacidad.
          </p>
          <button id="unlock-notes-btn" style="background:#3a4a7c;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;">
            🔓 Desbloquear notas
          </button>
          ${W()?`
            <button id="logout-btn" style="background:#dc3545;color:white;padding:8px 15px;border:none;border-radius:5px;cursor:pointer;margin-left:10px;">
              🚪 Cerrar sesión
            </button>
          `:""}
        </div>
      </div>
    `;const t=new Date;return`
    <div class="notes-area">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
        <h3>Notas diarias</h3>
        <button id="logout-btn" style="background:#dc3545;color:white;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;font-size:0.8em;">
          🚪 Cerrar sesión
        </button>
      </div>
      <form id="note-form">
        <input type="date" id="note-date" value="${new Date(t.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10)}" required />
        <textarea id="note-text" rows="3" placeholder="Escribe una nota para la fecha seleccionada..."></textarea>
        <button type="submit">Guardar nota</button>
      </form>
      <ul class="note-history">
        ${Object.entries(e||{}).sort((s,i)=>i[0].localeCompare(s[0])).map(([s,i])=>`
          <li>
            <b>${s}</b>:
            <span class="note-content" data-date="${s}">${i}</span>
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
  `}function Ye({}){return`
    <input type="file" id="import-file" accept=".vcf,.csv,.json" style="display:none" />
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
  `}function Ze(){const e=We(),t=ze(),n=ye(),a=e.lastSync?new Date(e.lastSync).toLocaleString():"—",s=(()=>{try{return JSON.parse(localStorage.getItem("contactos_diarios_dropbox_settings"))||{}}catch{return{}}})();return`
    <div style="border:1px solid #e7e7e7;padding:12px;border-radius:8px;margin-top:1rem;background:#f9fafb;">
      <h3 style="margin:0 0 8px 0;">🔄 Sincronización Dropbox</h3>
      ${t?`
        <div style="font-size:0.95em;margin-bottom:8px;color:${n?"#155724":"#856404"};">
          Estado: <strong>${n?"Conectado":"No conectado"}</strong>
        </div>
        <div style="font-size:0.85em;color:#555;margin-bottom:8px;">
          Archivo remoto: <code>${e.remotePath}</code><br/>
          Última sync: ${a}
        </div>
        ${n?`
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <button id="dropbox-sync" style="background:#3a4a7c;color:#fff;">🔁 Sincronizar</button>
            <button id="dropbox-download" style="background:#0d6efd;color:#fff;">⬇️ Descargar</button>
            <button id="dropbox-upload" style="background:#198754;color:#fff;">⬆️ Subir</button>
            <button id="dropbox-disconnect" style="background:#dc3545;color:#fff;margin-left:auto;">🚪 Desconectar</button>
          </div>
        `:`
          <button id="dropbox-connect" class="add-btn" style="width:100%;">Conectar con Dropbox</button>
        `}
      `:`
        <div style="font-size:0.95em;margin-bottom:8px;">Configura tu App Key de Dropbox para activar la sincronización.</div>
      `}
      <details style="margin-top:10px;">
        <summary>Configuración avanzada</summary>
        <div style="margin-top:8px;display:grid;gap:8px;">
          <label>App Key <input id="dropbox-app-key" placeholder="dbx_app_key" value="${s.appKey||""}"/></label>
          <label>Ruta remota <input id="dropbox-remote-path" placeholder="/contactos_diarios.json" value="${s.remotePath||"/contactos_diarios.json"}"/></label>
          <label>Redirect URI <input id="dropbox-redirect-uri" placeholder="https://<user>.github.io/ContactosDiarios/" value="${s.redirectUri||""}"/></label>
          <button id="dropbox-save-settings" style="background:#6c757d;color:#fff;max-width:160px;">Guardar</button>
        </div>
      </details>
    </div>
  `}function Qe({contacts:e,visible:t,page:n=1}){let a=[];e.forEach((c,g)=>{c.notes&&Object.entries(c.notes).forEach(([y,v])=>{a.push({date:y,text:v,contact:c,contactIndex:g})})}),a.sort((c,g)=>g.date.localeCompare(c.date));const s=4,i=Math.max(1,Math.ceil(a.length/s)),u=Math.min(Math.max(n,1),i),m=(u-1)*s,r=a.slice(m,m+s);return`
    <div id="all-notes-modal" class="modal" style="display:${t?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${a.length===0?"<li>No hay notas registradas.</li>":r.map(c=>`
            <li>
              <b>${c.date}</b> — <span style="color:#3a4a7c">${c.contact.surname?c.contact.surname+", ":""}${c.contact.name}</span><br/>
              <span>${c.text}</span>
              <a href="#" class="edit-note-link" data-contact="${c.contactIndex}" data-date="${c.date}" style="margin-left:0.5em;color:#646cff;font-size:0.95em;">Editar nota</a>
            </li>
          `).join("")}
        </ul>
        <div class="pagination" style="display:flex;justify-content:center;align-items:center;gap:1em;margin:1em 0;">
          <button id="prev-notes-page" ${u===1?"disabled":""}>&lt; Anterior</button>
          <span>Página ${u} de ${i}</span>
          <button id="next-notes-page" ${u===i?"disabled":""}>Siguiente &gt;</button>
        </div>
        <div class="form-actions">
          <button id="close-all-notes">Cerrar</button>
        </div>
      </div>
    </div>
  `}function et({visible:e,backups:t}){return`
    <div id="backup-modal" class="modal" style="display:${e?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:400px;">
        <h3>Restaurar copia local</h3>
        <div class="backup-btns" style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;">
          ${t.length===0?"<span>Sin copias locales.</span>":t.map(n=>`
            <div class="backup-btn-group" style="display:flex;align-items:center;gap:0.3rem;">
              <button class="restore-backup-btn" data-fecha="${n.fecha}">${n.fecha}</button>
              <button class="share-backup-btn" data-fecha="${n.fecha}" title="Compartir backup" style="background:#06b6d4;padding:0.4rem 0.7rem;font-size:1.1em;">📤</button>
            </div>
          `).join("")}
        </div>
        <div class="form-actions" style="margin-top:1.2rem;"><button id="close-backup-modal">Cerrar</button></div>
      </div>
    </div>
  `}function tt({visible:e,contactIndex:t}){const n=t!==null?o.contacts[t]:null,a=new Date,i=new Date(a.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);return`
    <div id="add-note-modal" class="modal" style="display:${e?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:500px;">
        <h3>Añadir nota diaria</h3>
        ${n?`<p><strong>${n.surname?n.surname+", ":""}${n.name}</strong></p>`:""}
        <form id="add-note-form">
          <label>Fecha <input type="date" id="add-note-date" value="${i}" required /></label>
          <label>Nota <textarea id="add-note-text" rows="4" placeholder="Escribe una nota para este contacto..." required></textarea></label>
          <div class="form-actions">
            <button type="submit">Guardar nota</button>
            <button type="button" id="cancel-add-note">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `}function b(e,t="info"){let n=document.getElementById("notification-container");n||(n=document.createElement("div"),n.id="notification-container",n.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
      pointer-events: none;
    `,document.body.appendChild(n));const a=document.createElement("div");a.style.cssText=`
    background: ${t==="success"?"#d4edda":t==="error"?"#f8d7da":t==="warning"?"#fff3cd":"#d1ecf1"};
    color: ${t==="success"?"#155724":t==="error"?"#721c24":t==="warning"?"#856404":"#0c5460"};
    border: 1px solid ${t==="success"?"#c3e6cb":t==="error"?"#f5c6cb":t==="warning"?"#ffeaa7":"#bee5eb"};
    padding: 12px 16px;
    border-radius: 6px;
    margin-bottom: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    font-size: 14px;
    line-height: 1.4;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease-in-out;
    pointer-events: auto;
    cursor: pointer;
  `;const s=t==="success"?"✅":t==="error"?"❌":t==="warning"?"⚠️":"ℹ️";a.innerHTML=`${s} ${e}`,n.appendChild(a),setTimeout(()=>{a.style.opacity="1",a.style.transform="translateX(0)"},10);const i=()=>{a.style.opacity="0",a.style.transform="translateX(100%)",setTimeout(()=>{a.parentNode&&a.parentNode.removeChild(a)},300)};a.onclick=i,setTimeout(i,4e3)}function ot(e){console.log("📢 Mostrando notificación de actualización para versión:",e);const t=document.createElement("div");t.id="update-notification",t.innerHTML=`
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      max-width: 300px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="font-weight: bold; margin-bottom: 8px;">
        🆕 Nueva versión disponible
      </div>
      <div style="font-size: 14px; margin-bottom: 12px;">
        Versión ${e} lista para usar
      </div>
      <div style="display: flex; gap: 10px;">
        <button onclick="reloadApp()" style="
          background: white;
          color: #4CAF50;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 12px;
        ">
          Actualizar ahora
        </button>
        <button onclick="dismissUpdate()" style="
          background: transparent;
          color: white;
          border: 1px solid white;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        ">
          Más tarde
        </button>
      </div>
    </div>
  `;const n=document.getElementById("update-notification");n&&n.remove(),document.body.appendChild(t),setTimeout(()=>{document.getElementById("update-notification")&&nt()},1e4)}function nt(){const e=document.getElementById("update-notification");e&&(e.style.transform="translateX(100%)",e.style.transition="transform 0.3s ease",setTimeout(()=>e.remove(),300))}function q(e){const t=[];return!e.name||e.name.trim().length===0?t.push("El nombre es obligatorio"):e.name.trim().length<2?t.push("El nombre debe tener al menos 2 caracteres"):e.name.trim().length>50&&t.push("El nombre no puede tener más de 50 caracteres"),e.surname&&e.surname.trim().length>50&&t.push("Los apellidos no pueden tener más de 50 caracteres"),e.phone&&e.phone.trim().length>0&&(/^[\d\s\-\+\(\)\.]{6,20}$/.test(e.phone.trim())||t.push("El teléfono debe contener solo números, espacios y caracteres válidos (6-20 caracteres)")),e.email&&e.email.trim().length>0&&(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email.trim())?e.email.trim().length>100&&t.push("El email no puede tener más de 100 caracteres"):t.push("El email debe tener un formato válido")),t}function J(e){const t=[];return!e||e.trim().length===0?(t.push("La nota no puede estar vacía"),t):(e.trim().length>1e3&&t.push("La nota no puede tener más de 1000 caracteres"),e.trim().length<3&&t.push("La nota debe tener al menos 3 caracteres"),/^[\w\s\.\,\;\:\!\?\-\(\)\[\]\"\'\/\@\#\$\%\&\*\+\=\<\>\{\}\|\~\`\ñÑáéíóúÁÉÍÓÚüÜ]*$/.test(e)||t.push("La nota contiene caracteres no permitidos"),t)}const X="contactos_diarios";let o={contacts:at(),selected:null,notes:"",editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1,showAddNoteModal:!1,addNoteContactIndex:null,allNotesPage:1,duplicates:[],showDuplicateModal:!1,showAuthModal:!1,authMode:"login",pendingAction:null};function at(){try{return JSON.parse(localStorage.getItem(X))||[]}catch{return[]}}function I(e){if(!e||!Array.isArray(e)){console.error("❌ ERROR: Intentando guardar contactos inválidos:",e);return}if(e.length===0){const t=localStorage.getItem(X);if(t&&t!=="[]"){console.error("❌ ERROR: Intentando sobrescribir contactos existentes con array vacío. Operación cancelada."),console.log("📊 Contactos existentes:",t);return}console.log("ℹ️ Guardando array vacío (primera vez o limpieza intencional)")}console.log(`💾 Guardando ${e.length} contactos en localStorage`),localStorage.setItem(X,JSON.stringify(e));try{Je(e)}catch{}}function f(){console.log("🎨 Iniciando render...");try{const e=document.querySelector("#app");if(!e){console.error("❌ ERROR: No se encontró el elemento #app");return}console.log("✅ Elemento #app encontrado:",e);const t=o.editing!==null?o.contacts[o.editing]:null,n=o.selected!==null?o.contacts[o.selected].notes||{}:{};console.log("📊 Estado actual:",{editing:o.editing,selected:o.selected,contactsCount:o.contacts.length}),e.innerHTML=`
    <h1>Diario de Contactos</h1>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <div class="main-grid">
      <div>
        
        ${Ge({contacts:o.contacts,filter:o.tagFilter})}
        <button id="show-backup-modal" class="add-btn" style="width:100%;margin-top:0.7rem;background:#06b6d4;">Restaurar copia local</button>
        <div style="margin-top:1rem;">
        <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
          <button id="import-btn" style="background:#6f42c1;color:#fff;margin:0 10px 1.2rem 0;">📂 Importar contactos</button>
          <button id="export-btn" style="background:#fd7e14;color:#fff;margin:0 10px 1.2rem 0;">💾 Exportar contactos</button>
          <button id="manage-duplicates-btn" style="background:#dc3545;color:#fff;margin:0 10px 1.2rem 0;">🔍 Gestionar duplicados</button>
          <button id="validate-contacts-btn" style="background:#28a745;color:#fff;margin:0 10px 1.2rem 0;">✅ Validar contactos</button>
        </div>
        ${Ze()}
      </div>
      <div>
        ${o.editing!==null?Ke({contact:t}):""}
        ${o.selected!==null&&o.editing===null?Xe({notes:n}):""}
      </div>
    </div>
    ${Qe({contacts:o.contacts,visible:o.showAllNotes,page:o.allNotesPage})}
    ${et({visible:o.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})} <!-- Modal de backup -->
    ${tt({visible:o.showAddNoteModal,contactIndex:o.addNoteContactIndex})} <!-- Modal añadir nota -->
    ${ht({duplicates:o.duplicates,visible:o.showDuplicateModal})} <!-- Modal de gestión de duplicados -->
    ${Et({visible:o.showAuthModal,mode:o.authMode})} <!-- Modal de autenticación -->
    ${Ye({})}
  `,st(),kt();const a=document.getElementById("show-backup-modal");a&&(a.onclick=()=>{o.showBackupModal=!0,f()});const s=document.getElementById("close-backup-modal");s&&(s.onclick=()=>{o.showBackupModal=!1,f()}),document.querySelectorAll(".add-note-contact").forEach(x=>{x.onclick=k=>{const E=Number(x.dataset.index);if(!W()){o.pendingAction={type:"addNote",contactIndex:E},Y()?o.authMode="login":o.authMode="setup",o.showAuthModal=!0,f();return}o.addNoteContactIndex=E,o.showAddNoteModal=!0,f()}});const i=document.getElementById("cancel-add-note");i&&(i.onclick=()=>{o.showAddNoteModal=!1,o.addNoteContactIndex=null,f()}),document.querySelectorAll(".restore-backup-btn").forEach(x=>{x.onclick=()=>mt(x.dataset.fecha)});const u=document.getElementById("restore-local-backup");u&&(u.onclick=restaurarBackupLocal);const m=document.getElementById("dropbox-connect");m&&(m.onclick=async()=>{try{await Ve()}catch(x){b("Error iniciando Dropbox: "+x.message,"error")}});const r=document.getElementById("dropbox-disconnect");r&&(r.onclick=()=>{qe(),f(),b("Desconectado de Dropbox","info")});const c=document.getElementById("dropbox-sync");c&&(c.onclick=async()=>{try{b("Sincronizando con Dropbox...","info");const x=await oe(o.contacts);JSON.stringify(x.merged)!==JSON.stringify(o.contacts)&&(o.contacts=x.merged,I(o.contacts),f()),b("Sincronización completada","success")}catch(x){b("Error de sincronización: "+x.message,"error")}});const g=document.getElementById("dropbox-download");g&&(g.onclick=async()=>{try{const x=await ve();if(!x.contacts){b("No hay datos remotos en Dropbox","warning");return}if(!confirm("Esto reemplazará tus contactos locales con los remotos. ¿Continuar?"))return;o.contacts=x.contacts,I(o.contacts),f(),b("Datos descargados desde Dropbox","success")}catch(x){b("Error al descargar: "+x.message,"error")}});const y=document.getElementById("dropbox-upload");y&&(y.onclick=async()=>{try{await xe(o.contacts),b("Datos subidos a Dropbox","success")}catch(x){b("Error al subir: "+x.message,"error")}});const v=document.getElementById("dropbox-save-settings");v&&(v.onclick=()=>{const x=document.getElementById("dropbox-app-key")?.value||"",k=document.getElementById("dropbox-remote-path")?.value||"",E=document.getElementById("dropbox-redirect-uri")?.value||"";Fe({appKey:x,remotePath:k,redirectUri:E}),b("Configuración Dropbox guardada","success"),f()}),console.log("✅ Render completado exitosamente")}catch(e){console.error("❌ ERROR en render:",e),console.error("Stack trace:",e.stack);const t=document.querySelector("#app");t&&(t.innerHTML=`
        <div style="padding: 20px; background: #ffebee; border: 1px solid #f44336; border-radius: 8px; margin: 20px;">
          <h2 style="color: #d32f2f;">❌ Error de la aplicación</h2>
          <p><strong>Error:</strong> ${e.message}</p>
          <p><strong>Línea:</strong> ${e.stack}</p>
          <button onclick="location.reload()" style="background: #2196F3; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
            🔄 Recargar aplicación
          </button>
        </div>
      `)}}let de=null;function st(){const e=document.getElementById("tag-filter");e&&e.addEventListener("input",d=>{clearTimeout(de),de=setTimeout(()=>{o.tagFilter=e.value,f();const l=document.getElementById("tag-filter");l&&(l.value=o.tagFilter,l.focus(),l.setSelectionRange(o.tagFilter.length,o.tagFilter.length))},300)});const t=document.getElementById("add-contact");t&&(t.onclick=()=>{o.editing=null,o.selected=null,f(),o.editing=o.contacts.length,f()}),document.querySelectorAll(".select-contact").forEach(d=>{d.onclick=l=>{l.preventDefault(),l.stopPropagation(),U(d)&&(o.selected=Number(d.dataset.index),o.editing=null,f())}}),document.querySelectorAll(".edit-contact").forEach(d=>{d.onclick=l=>{l.preventDefault(),l.stopPropagation(),U(d)&&(o.editing=Number(d.dataset.index),o.selected=null,f())}}),document.querySelectorAll(".delete-contact").forEach(d=>{d.onclick=l=>{if(l.preventDefault(),l.stopPropagation(),!U(d))return;const p=Number(d.dataset.index),h=o.contacts[p],w=h.surname?`${h.surname}, ${h.name}`:h.name;confirm(`¿Estás seguro de eliminar el contacto "${w}"?

Esta acción no se puede deshacer.`)&&(o.contacts.splice(p,1),I(o.contacts),b("Contacto eliminado correctamente","success"),o.selected=null,f())}}),document.querySelectorAll(".pin-contact").forEach(d=>{d.onclick=l=>{if(l.preventDefault(),l.stopPropagation(),!U(d))return;const p=Number(d.dataset.index);o.contacts[p].pinned&&!confirm("¿Seguro que quieres desfijar este contacto?")||(o.contacts[p].pinned=!o.contacts[p].pinned,I(o.contacts),f())}});const n=document.getElementById("contact-form");n&&(n.onsubmit=d=>{d.preventDefault();const l=Object.fromEntries(new FormData(n)),p=q(l);if(p.length>0){b("Error de validación: "+p.join(", "),"error");return}let h=l.tags?l.tags.split(",").map(A=>A.trim()).filter(Boolean):[];delete l.tags;const w={...l};o.contacts.some((A,N)=>o.editing!==null&&N===o.editing?!1:Se(A,w))&&!confirm("Ya existe un contacto similar. ¿Deseas guardarlo de todas formas?")||(o.editing!==null&&o.editing<o.contacts.length?(o.contacts[o.editing]={...o.contacts[o.editing],...l,tags:h,lastEdited:Date.now()},(window.location.hostname==="sasogu.github.io"||/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))&&console.log("📱 CONTACTO EDITADO:",o.contacts[o.editing].name,"Nueva fecha:",new Date().toLocaleString()),b("Contacto actualizado correctamente","success")):(o.contacts.push({...l,notes:{},tags:h,lastEdited:Date.now(),createdAt:Date.now()}),b("Contacto añadido correctamente","success")),I(o.contacts),o.editing=null,f())},document.getElementById("cancel-edit").onclick=()=>{o.editing=null,f()});const a=document.getElementById("add-note-form");if(a&&o.addNoteContactIndex!==null){const d=l=>{l.preventDefault();const p=document.getElementById("add-note-date").value,h=document.getElementById("add-note-text").value.trim();if(!p||!h){b("Por favor, selecciona una fecha y escribe una nota","warning");return}const w=J(h);if(w.length>0){b("Error en la nota: "+w.join(", "),"error");return}const S=o.addNoteContactIndex;o.contacts[S].notes||(o.contacts[S].notes={}),o.contacts[S].notes[p]?o.contacts[S].notes[p]+=`
`+h:o.contacts[S].notes[p]=h,o.contacts[S].lastEdited=Date.now(),(window.location.hostname==="sasogu.github.io"||/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))&&console.log(`📝 MÓVIL - Nota añadida a ${o.contacts[S].name}, lastEdited: ${o.contacts[S].lastEdited}`),I(o.contacts),b("Nota añadida correctamente","success"),o.showAddNoteModal=!1,o.addNoteContactIndex=null,f()};a.onsubmit=d}const s=document.getElementById("note-form");if(s&&o.selected!==null){const d=l=>{l.preventDefault();const p=document.getElementById("note-date").value,h=document.getElementById("note-text").value.trim();if(!p||!h){b("Por favor, selecciona una fecha y escribe una nota","warning");return}const w=J(h);if(w.length>0){b("Error en la nota: "+w.join(", "),"error");return}o.contacts[o.selected].notes||(o.contacts[o.selected].notes={}),o.contacts[o.selected].notes[p]?o.contacts[o.selected].notes[p]+=`
`+h:o.contacts[o.selected].notes[p]=h,o.contacts[o.selected].lastEdited=Date.now(),I(o.contacts),b("Nota guardada correctamente","success"),document.getElementById("note-text").value="",f()};s.onsubmit=d}document.querySelectorAll(".edit-note").forEach(d=>{d.onclick=l=>{const p=d.dataset.date,h=document.getElementById("edit-note-modal"),w=document.getElementById("edit-note-text");w.value=o.contacts[o.selected].notes[p],h.style.display="block",document.getElementById("save-edit-note").onclick=()=>{const S=w.value.trim(),A=J(S);if(A.length>0){b("Error en la nota: "+A.join(", "),"error");return}o.contacts[o.selected].notes[p]=S,o.contacts[o.selected].lastEdited=Date.now(),I(o.contacts),b("Nota actualizada correctamente","success"),h.style.display="none",f()},document.getElementById("cancel-edit-note").onclick=()=>{h.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(d=>{d.onclick=l=>{const p=d.dataset.date;confirm(`¿Estás seguro de eliminar la nota del ${p}?

Esta acción no se puede deshacer.`)&&(delete o.contacts[o.selected].notes[p],I(o.contacts),b("Nota eliminada correctamente","success"),f())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{lt(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{dt(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{ut(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async d=>{const l=d.target.files[0];if(!l)return;const p=await l.text();let h=[];if(l.name.endsWith(".vcf"))h=it(p);else if(l.name.endsWith(".csv"))h=ct(p);else if(l.name.endsWith(".json"))try{const w=JSON.parse(p);Array.isArray(w)?h=w:w&&Array.isArray(w.contacts)&&(h=w.contacts)}catch{}if(h.length){const w=[],S=[];if(h.forEach(($,O)=>{const ie=q($);ie.length===0?w.push($):S.push({index:O+1,errors:ie})}),S.length>0){const $=S.map(O=>`Contacto ${O.index}: ${O.errors.join(", ")}`).join(`
`);if(!confirm(`Se encontraron ${S.length} contacto(s) con errores:

${$}

¿Deseas importar solo los contactos válidos (${w.length})?`))return}const A=$=>o.contacts.some(O=>O.name===$.name&&O.surname===$.surname&&O.phone===$.phone),N=w.filter($=>!A($));N.length?(o.contacts=o.contacts.concat(N),I(o.contacts),b(`${N.length} contacto(s) importado(s) correctamente`,"success"),f()):b("No se han importado contactos nuevos (todos ya existen)","info")}else b("No se pudieron importar contactos del archivo seleccionado","error")};const i=document.getElementById("close-all-notes");i&&(i.onclick=()=>{o.showAllNotes=!1,o.allNotesPage=1,f()});const u=document.getElementById("show-all-notes-btn");u&&(u.onclick=()=>{if(!W()){o.pendingAction={type:"showAllNotes"},Y()?o.authMode="login":o.authMode="setup",o.showAuthModal=!0,f();return}o.showAllNotes=!0,o.allNotesPage=1,f()});const m=document.getElementById("prev-notes-page");m&&(m.onclick=()=>{o.allNotesPage>1&&(o.allNotesPage--,f())});const r=document.getElementById("next-notes-page");r&&(r.onclick=()=>{let d=[];o.contacts.forEach((p,h)=>{p.notes&&Object.entries(p.notes).forEach(([w,S])=>{d.push({date:w,text:S,contact:p,contactIndex:h})})});const l=Math.max(1,Math.ceil(d.length/4));o.allNotesPage<l&&(o.allNotesPage++,f())}),document.querySelectorAll(".edit-note-link").forEach(d=>{d.onclick=l=>{l.preventDefault();const p=Number(d.dataset.contact),h=d.dataset.date;o.selected=p,o.editing=null,o.showAllNotes=!1,f(),setTimeout(()=>{const w=document.querySelector(`.edit-note[data-date="${h}"]`);w&&w.click()},50)}}),document.querySelectorAll(".share-backup-btn").forEach(d=>{d.onclick=async()=>{const l=d.dataset.fecha,h=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find($=>$.fecha===l);if(!h)return alert("No se encontró la copia seleccionada.");const w=`contactos_backup_${l}.json`,S=JSON.stringify(h.datos,null,2),A=new Blob([S],{type:"application/json"}),N=document.createElement("a");if(N.href=URL.createObjectURL(A),N.download=w,N.style.display="none",document.body.appendChild(N),N.click(),setTimeout(()=>{URL.revokeObjectURL(N.href),N.remove()},1e3),navigator.canShare&&window.File&&window.FileReader)try{const $=new File([A],w,{type:"application/json"});navigator.canShare({files:[$]})&&await navigator.share({files:[$],title:"Backup de Contactos",text:`Copia de seguridad (${l}) de ContactosDiarios`})}catch{}}});const c=document.getElementById("manage-duplicates-btn");c&&(c.onclick=()=>{o.duplicates=gt(),o.duplicates.length===0?b("No se encontraron contactos duplicados","info"):(o.showDuplicateModal=!0,f())});const g=document.getElementById("validate-contacts-btn");g&&(g.onclick=()=>{const d=[];if(o.contacts.forEach((l,p)=>{const h=q(l);if(h.length>0){const w=l.surname?`${l.surname}, ${l.name}`:l.name;d.push({index:p+1,name:w,errors:h})}}),d.length===0)b(`✅ Todos los ${o.contacts.length} contactos son válidos`,"success");else{const l=d.map(p=>`${p.index}. ${p.name}: ${p.errors.join(", ")}`).join(`
`);b(`⚠️ Se encontraron ${d.length} contacto(s) con errores`,"warning"),console.log("Contactos con errores de validación:",d),confirm(`Se encontraron ${d.length} contacto(s) con errores de validación:

${l}

¿Deseas ver más detalles en la consola del navegador?`)&&console.table(d)}});const y=document.getElementById("cancel-duplicate-resolution");y&&(y.onclick=()=>{o.showDuplicateModal=!1,o.duplicates=[],f()});const v=document.getElementById("apply-resolution");v&&(v.onclick=bt),document.querySelectorAll('input[name^="resolution-"]').forEach(d=>{d.addEventListener("change",()=>{const l=d.name.split("-")[1],p=document.getElementById(`merge-section-${l}`),h=document.getElementById(`individual-section-${l}`);d.value==="merge"?(p.style.display="block",h.style.display="none"):d.value==="select"?(p.style.display="none",h.style.display="block"):(p.style.display="none",h.style.display="none")})}),document.querySelectorAll('.resolution-option input[type="radio"]').forEach(d=>{d.addEventListener("change",()=>{const l=d.name;document.querySelectorAll(`input[name="${l}"]`).forEach(p=>{p.closest(".resolution-option").classList.remove("selected")}),d.closest(".resolution-option").classList.add("selected")})});const x=document.getElementById("unlock-notes-btn");x&&(x.onclick=()=>{o.selected!==null&&(o.pendingAction={type:"showContactNotes",contactIndex:o.selected}),Y()?o.authMode="login":o.authMode="setup",o.showAuthModal=!0,f()});const k=document.getElementById("logout-btn");k&&(k.onclick=()=>{wt(),f()});const E=document.getElementById("auth-form");E&&!E.hasAttribute("data-handler-added")&&(E.setAttribute("data-handler-added","true"),E.onsubmit=d=>{d.preventDefault();const l=document.getElementById("auth-password").value.trim();if(!l){b("Por favor, introduce una contraseña","warning");return}if(o.authMode==="setup"){const p=document.getElementById("auth-password-confirm").value.trim();if(l!==p){b("Las contraseñas no coinciden","error");return}if(l.length<4){b("La contraseña debe tener al menos 4 caracteres","warning");return}yt(l),_.isAuthenticated=!0,_.sessionExpiry=Date.now()+30*60*1e3,o.showAuthModal=!1,E.reset(),setTimeout(()=>{Ie()},100),f()}else xt(l)?(o.showAuthModal=!1,E.reset(),f()):(document.getElementById("auth-password").value="",document.getElementById("auth-password").focus())});const D=document.getElementById("cancel-auth");D&&(D.onclick=()=>{o.showAuthModal=!1,o.pendingAction=null,f()});const L=document.getElementById("auth-modal");if(L){L.onclick=p=>{p.target===L&&(o.showAuthModal=!1,o.pendingAction=null,f())};const d=document.getElementById("auth-password");if(d){const p=window.innerWidth<=700?300:100;setTimeout(()=>{d.focus(),window.innerWidth<=700&&d.scrollIntoView({behavior:"smooth",block:"center"})},p)}const l=p=>{p.key==="Escape"&&o.showAuthModal&&(o.showAuthModal=!1,o.pendingAction=null,f())};document.addEventListener("keydown",l)}}function it(e){const t=[],n=e.split("END:VCARD");for(const a of n){const s=/FN:([^\n]*)/.exec(a)?.[1]?.trim(),i=/N:.*;([^;\n]*)/.exec(a)?.[1]?.trim()||"",u=/TEL.*:(.+)/.exec(a)?.[1]?.trim(),m=/EMAIL.*:(.+)/.exec(a)?.[1]?.trim();s&&t.push({name:s,surname:i,phone:u||"",email:m||"",notes:{},tags:[]})}return t}function rt(e){return e.map(t=>`BEGIN:VCARD
VERSION:3.0
FN:${t.name}
N:${t.surname||""};;;;
TEL:${t.phone||""}
EMAIL:${t.email||""}
END:VCARD`).join(`
`)}function ct(e){const t=e.split(`
`).filter(Boolean),[n,...a]=t;return a.map(s=>{const[i,u,m,r,c,g]=s.split(",");return{name:i?.trim()||"",surname:u?.trim()||"",phone:m?.trim()||"",email:r?.trim()||"",notes:g?JSON.parse(g):{},tags:c?c.split(";").map(y=>y.trim()):[]}})}function lt(){const e=rt(o.contacts),t=new Blob([e],{type:"text/vcard"}),n=document.createElement("a");n.href=URL.createObjectURL(t),n.download="contactos.vcf",n.click()}function dt(){const e="name,surname,phone,email,tags,notes",t=o.contacts.map(i=>[i.name,i.surname,i.phone,i.email,(i.tags||[]).join(";"),JSON.stringify(i.notes||{})].map(u=>'"'+String(u).replace(/"/g,'""')+'"').join(",")),n=[e,...t].join(`
`),a=new Blob([n],{type:"text/csv"}),s=document.createElement("a");s.href=URL.createObjectURL(a),s.download="contactos.csv",s.click()}function ut(){const e=new Blob([JSON.stringify(o.contacts,null,2)],{type:"application/json"}),t=document.createElement("a");t.href=URL.createObjectURL(e),t.download="contactos.json",t.click()}function Ee(){console.log("🔄 Ejecutando backup automático diario...");const e=new Date,n=new Date(e.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10),a=localStorage.getItem("contactos_diarios");if(!a){console.log("⚠️ No hay contactos para hacer backup");return}try{const s=JSON.parse(a);if(!Array.isArray(s)||s.length===0){console.log("⚠️ Los datos de contactos están vacíos, saltando backup");return}let i=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");i.find(u=>u.fecha===n)?console.log(`📅 Ya existe backup para ${n}`):(console.log(`💾 Creando backup para ${n} con ${s.length} contactos`),i.push({fecha:n,datos:s}),i.length>10&&(console.log(`🗂️ Limitando backups a los últimos 10 (había ${i.length})`),i=i.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(i)),console.log(`✅ Backup diario creado exitosamente para ${n}`)),localStorage.setItem("contactos_diarios_backup_fecha",n)}catch(s){console.error("❌ Error en backup automático:",s)}}setInterval(Ee,60*60*1e3);Ee();function pt(){const e=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]"),t=document.getElementById("backup-info");t&&(e.length===0?t.textContent="Sin copias locales.":t.innerHTML="Últimas copias locales: "+e.map(n=>`<button class="restore-backup-btn" data-fecha="${n.fecha}">${n.fecha}</button>`).join(" "))}function mt(e){if(!confirm("¿Seguro que quieres restaurar la copia de seguridad del "+e+"? Se sobrescribirán los contactos actuales."))return;const n=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(a=>a.fecha===e);n?(o.contacts=n.datos,I(o.contacts),f(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}function Se(e,t){const n=a=>a?a.toLowerCase().replace(/\s+/g," ").trim():"";return!!(n(e.name)===n(t.name)&&n(e.surname)===n(t.surname)||e.phone&&t.phone&&e.phone.replace(/\s+/g,"")===t.phone.replace(/\s+/g,"")||e.email&&t.email&&n(e.email)===n(t.email))}function gt(){const e=[],t=new Set;for(let n=0;n<o.contacts.length;n++){if(t.has(n))continue;const a=[{...o.contacts[n],originalIndex:n}];t.add(n);for(let s=n+1;s<o.contacts.length;s++)t.has(s)||Se(o.contacts[n],o.contacts[s])&&(a.push({...o.contacts[s],originalIndex:s}),t.add(s));a.length>1&&e.push({contacts:a})}return e}function $e(e){if(e.length===0)return null;if(e.length===1)return e[0];const t={name:"",surname:"",phone:"",email:"",tags:[],notes:{},pinned:!1};let n="",a="";e.forEach(i=>{i.name&&i.name.length>n.length&&(n=i.name),i.surname&&i.surname.length>a.length&&(a=i.surname)}),t.name=n,t.surname=a,t.phone=e.find(i=>i.phone)?.phone||"",t.email=e.find(i=>i.email)?.email||"";const s=new Set;return e.forEach(i=>{i.tags&&i.tags.forEach(u=>s.add(u))}),t.tags=Array.from(s),e.forEach((i,u)=>{i.notes&&Object.entries(i.notes).forEach(([m,r])=>{t.notes[m]?t.notes[m]+=`
--- Contacto ${u+1} ---
${r}`:t.notes[m]=r})}),t.pinned=e.some(i=>i.pinned),t}function ft(e){const t=$e(e);return`
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
            ${t.tags.map(n=>`<span class="tag">${n}</span>`).join("")}
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
  `}function ht({duplicates:e,visible:t}){return!t||e.length===0?'<div id="duplicate-modal" class="modal" style="display:none"></div>':`
    <div id="duplicate-modal" class="modal" style="display:flex;z-index:5000;">
      <div class="modal-content" style="max-width:800px;max-height:90vh;overflow-y:auto;">
        <h3>🔍 Gestión de contactos duplicados</h3>
        <p>Se encontraron <strong>${e.length}</strong> grupo(s) de contactos duplicados. 
           Para cada grupo, elige cómo resolverlo:</p>
        
        ${e.map((n,a)=>`
          <div class="duplicate-group" style="border:1px solid #ddd;border-radius:8px;padding:15px;margin:15px 0;background:#fafafa;">
            <h4>Grupo ${a+1} - ${n.contacts.length} contactos similares</h4>
            
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
              ${ft(n.contacts)}
            </div>
            
            <!-- Sección de selección individual (oculta por defecto) -->
            <div class="individual-selection" id="individual-section-${a}" style="display:none;">
              <h5>Selecciona el contacto a mantener:</h5>
              ${n.contacts.map((s,i)=>`
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
  `}function bt(){const e=[];let t=0;if(o.duplicates.forEach((i,u)=>{const m=document.querySelector(`input[name="resolution-${u}"]:checked`),r=m?m.value:"skip";if(r==="merge")e.push({type:"merge",groupIndex:u,contacts:i.contacts}),t++;else if(r==="select"){const c=document.querySelector(`input[name="keep-${u}"]:checked`);if(c){const g=parseInt(c.value),y=i.contacts.filter(v=>v.originalIndex!==g).map(v=>v.originalIndex);e.push({type:"delete",groupIndex:u,toDelete:y,toKeep:g}),t++}}}),t===0){b("No hay operaciones que realizar","info");return}const n=e.filter(i=>i.type==="merge").length,a=e.filter(i=>i.type==="delete").length;let s=`¿Confirmar las siguientes operaciones?

`;if(n>0&&(s+=`🔗 Fusionar ${n} grupo(s) de contactos
`),a>0&&(s+=`🗑️ Eliminar duplicados en ${a} grupo(s)
`),s+=`
Esta acción no se puede deshacer.`,!confirm(s)){b("Operación cancelada","info");return}try{let i=0,u=0;const m=[];e.forEach(y=>{if(y.type==="merge"){const v=$e(y.contacts);o.contacts.push(v),y.contacts.forEach(x=>{m.push(x.originalIndex)}),i++}else y.type==="delete"&&(y.toDelete.forEach(v=>{m.push(v)}),u+=y.toDelete.length)}),[...new Set(m)].sort((y,v)=>v-y).forEach(y=>{y<o.contacts.length&&o.contacts.splice(y,1)}),I(o.contacts);let c="Resolución completada: ";const g=[];i>0&&g.push(`${i} contacto(s) fusionado(s)`),u>0&&g.push(`${u} duplicado(s) eliminado(s)`),c+=g.join(" y "),b(c,"success"),o.showDuplicateModal=!1,o.duplicates=[],f()}catch(i){b("Error al aplicar resolución: "+i.message,"error")}}const se="contactos_diarios_auth";let _={isAuthenticated:!1,sessionExpiry:null};function ke(e){let t=0;for(let n=0;n<e.length;n++){const a=e.charCodeAt(n);t=(t<<5)-t+a,t=t&t}return t.toString()}function yt(e){const t=ke(e);localStorage.setItem(se,t),b("Contraseña establecida correctamente","success")}function vt(e){const t=localStorage.getItem(se);return t?ke(e)===t:!1}function Y(){return localStorage.getItem(se)!==null}function xt(e){return vt(e)?(_.isAuthenticated=!0,_.sessionExpiry=Date.now()+30*60*1e3,b("Autenticación exitosa","success"),setTimeout(()=>{Ie()},100),!0):(b("Contraseña incorrecta","error"),!1)}function W(){return _.isAuthenticated?Date.now()>_.sessionExpiry?(_.isAuthenticated=!1,_.sessionExpiry=null,!1):!0:!1}function wt(){_.isAuthenticated=!1,_.sessionExpiry=null,b("Sesión cerrada","info")}function Ie(){if(!o.pendingAction)return;const e=o.pendingAction;switch(o.pendingAction=null,e.type){case"showAllNotes":o.showAllNotes=!0,o.allNotesPage=1;break;case"addNote":o.addNoteContactIndex=e.contactIndex,o.showAddNoteModal=!0;break;case"showContactNotes":o.selected=e.contactIndex,o.editing=null;break}f()}function Et({visible:e,mode:t="login"}){return`
    <div id="auth-modal" class="modal" style="display:${e?"flex":"none"};z-index:6000;">
      <div class="modal-content" style="max-width:400px;">
        <h3>${t==="setup"?"🔐 Establecer contraseña":"🔑 Acceso a notas privadas"}</h3>
        <p>${t==="setup"?"Establece una contraseña para proteger tus notas personales:":"Introduce tu contraseña para acceder a las notas:"}</p>
        
        <form id="auth-form">
          <label>
            Contraseña
            <input type="password" id="auth-password" placeholder="Introduce tu contraseña" required autocomplete="current-password" />
          </label>
          ${t==="setup"?`
            <label>
              Confirmar contraseña
              <input type="password" id="auth-password-confirm" placeholder="Confirma tu contraseña" required autocomplete="new-password" />
            </label>
          `:""}
          <div class="form-actions" style="margin-top:20px;">
            <button type="submit">${t==="setup"?"Establecer contraseña":"Acceder"}</button>
            <button type="button" id="cancel-auth">Cancelar</button>
          </div>
        </form>
        
        ${t==="login"?`
          <div style="margin-top:15px;padding-top:15px;border-top:1px solid #ddd;">
            <p style="font-size:0.9em;color:#666;">
              💡 La contraseña se almacena de forma segura en tu dispositivo
            </p>
          </div>
        `:""}
      </div>
    </div>
  `}async function Ne(){console.log("🧹 Limpiando cache y forzando actualización...");try{if("caches"in window){const e=await caches.keys();await Promise.all(e.map(t=>(console.log("🗑️ Eliminando cache:",t),caches.delete(t))))}if("serviceWorker"in navigator){const e=await navigator.serviceWorker.getRegistrations();await Promise.all(e.map(t=>(console.log("🔄 Desregistrando SW:",t.scope),t.unregister())))}console.log("✅ Cache limpiado, recargando..."),window.location.reload()}catch(e){console.error("❌ Error limpiando cache:",e),window.location.reload()}}window.clearCacheAndReload=Ne;document.addEventListener("keydown",e=>{e.ctrlKey&&e.shiftKey&&e.key==="R"&&(e.preventDefault(),Ne())});async function St(){console.log("🔍 Obteniendo versión del Service Worker...");try{if("serviceWorker"in navigator&&navigator.serviceWorker.controller){console.log("📡 Intentando comunicación directa con SW...");const n=new MessageChannel,a=new Promise((i,u)=>{const m=setTimeout(()=>{u(new Error("Timeout en comunicación con SW"))},3e3);n.port1.onmessage=r=>{clearTimeout(m),r.data&&r.data.type==="VERSION_RESPONSE"?(console.log("✅ Versión recibida del SW:",r.data.version),i(r.data.version)):u(new Error("Respuesta inválida del SW"))}});return navigator.serviceWorker.controller.postMessage({type:"GET_VERSION"},[n.port2]),await a}console.log("📄 SW no disponible, intentando fetch...");const e=`${Date.now()}-${Math.random().toString(36).substr(2,9)}`,t=[`/sw.js?v=${e}`,`/ContactosDiarios/sw.js?v=${e}`,`./sw.js?v=${e}`];for(const n of t)try{console.log(`🌐 Intentando fetch: ${n}`);const a=await fetch(n,{cache:"no-cache",headers:{"Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0"}});if(a.ok){const s=await a.text();console.log("📄 Código SW obtenido, longitud:",s.length);const i=[/CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/const\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/let\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/var\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/version['":]?\s*['"`]([0-9.]+)['"`]/i,/v?([0-9]+\.[0-9]+\.[0-9]+)/];for(const u of i){const m=s.match(u);if(m&&m[1])return console.log("✅ Versión encontrada:",m[1]),m[1]}console.log("⚠️ No se encontró versión en el código SW")}}catch(a){console.log(`❌ Error fetch ${n}:`,a.message)}return console.log("🔄 Usando versión fallback..."),"0.0.91"}catch(e){return console.error("❌ Error general obteniendo versión SW:",e),"0.0.91"}}async function j(){console.log("📋 Mostrando versión del Service Worker...");let e=document.getElementById("sw-version-info");e||(e=document.createElement("div"),e.id="sw-version-info",e.style.cssText=`
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
      pointer-events: none;
    `,document.body.appendChild(e)),e.innerHTML=`
    <p class="version-text">SW cargando...</p>
  `;try{const t=await St();e.innerHTML=`
      <p class="version-text">Service Worker v${t}</p>
    `,console.log("✅ Versión del SW mostrada:",t)}catch(t){console.error("❌ Error mostrando versión SW:",t),e.innerHTML=`
      <p class="version-text">Service Worker v0.0.87</p>
    `}}async function $t(){console.log("🚀 Inicializando aplicación...");const e=j(),t=new Promise(a=>setTimeout(()=>a("timeout"),5e3));if(await Promise.race([e,t])==="timeout"){console.log("⏰ Timeout obteniendo versión SW, usando fallback");let a=document.getElementById("sw-version-info");a&&(a.innerHTML=`
        <p class="version-text">Service Worker v0.0.91</p>
      `)}"serviceWorker"in navigator&&(navigator.serviceWorker.addEventListener("controllerchange",()=>{console.log("🔄 Service Worker actualizado, refrescando versión..."),setTimeout(()=>j(),500)}),navigator.serviceWorker.ready.then(()=>{console.log("✅ Service Worker listo, actualizando versión..."),setTimeout(()=>j(),2e3)}).catch(a=>{console.log("❌ Error esperando SW ready:",a)}),navigator.serviceWorker.addEventListener("message",a=>{a.data&&a.data.type==="SW_UPDATED"&&(console.log("📢 Service Worker actualizado a versión:",a.data.version),ot(a.data.version),j())}))}let Ae=0,T=!1;function kt(){let e=null;window.addEventListener("scroll",()=>{T=!0,clearTimeout(e),e=setTimeout(()=>{T=!1},100)},{passive:!0}),document.addEventListener("touchstart",()=>{Ae=Date.now()},{passive:!0}),document.addEventListener("touchmove",()=>{T=!0},{passive:!0}),document.addEventListener("touchend",()=>{setTimeout(()=>{T=!1},100)},{passive:!0})}function U(e){if(e&&(e.classList.contains("add-note-contact")||e.classList.contains("edit-contact")||e.classList.contains("delete-contact")||e.classList.contains("pin-contact")||e.classList.contains("select-contact")))return!0;const t=Date.now()-Ae;return!T&&t>150}document.addEventListener("DOMContentLoaded",async()=>{try{console.log("=== 📱 INICIO DEBUG MÓVIL ==="),console.log("🌐 URL:",window.location.href),console.log("📱 User Agent:",navigator.userAgent),console.log("📊 Screen:",screen.width+"x"+screen.height),console.log("🖥️ Viewport:",window.innerWidth+"x"+window.innerHeight),console.log("🗂️ localStorage disponible:",!!window.localStorage),console.log("⚙️ Service Worker:","serviceWorker"in navigator),console.log("=================================");const e=document.getElementById("debug-trigger");e?(e.addEventListener("click",ne),console.log("🐛 Botón de debug configurado")):console.log("❌ No se encontró el botón de debug"),console.log("🔄 Iniciando migración de contactos..."),It(),console.log("✅ Migración completada");try{await Ue()}catch(t){console.warn("Dropbox init:",t.message)}console.log("🎨 Iniciando render inicial..."),f(),console.log("✅ Render inicial completado"),console.log("⚙️ Inicializando app..."),$t(),console.log("✅ App inicializada"),ye()&&setTimeout(async()=>{try{const t=await oe(o.contacts);JSON.stringify(t.merged)!==JSON.stringify(o.contacts)&&(o.contacts=t.merged,I(o.contacts),f()),b("Dropbox sincronizado","success")}catch(t){console.warn("Auto-sync Dropbox:",t.message)}},800),console.log("💾 Mostrando info de backup..."),pt(),console.log("✅ Info backup mostrada"),console.log("📱 ContactosDiarios iniciado correctamente"),console.log("🆕 Nueva funcionalidad: Contactos recientemente editados"),console.log("💡 Usa Ctrl+Shift+R para limpiar cache y forzar actualización"),console.log("🔧 También disponible: window.clearCacheAndReload()")}catch(e){console.error("💥 ERROR CRÍTICO EN INICIALIZACIÓN:",e),console.error("Stack trace:",e.stack);const t=document.querySelector("#app");t&&(t.innerHTML=`
        <div style="padding: 20px; background: #ffebee; border: 1px solid #f44336; border-radius: 8px; margin: 20px;">
          <h2 style="color: #d32f2f;">💥 Error crítico de inicialización</h2>
          <p><strong>Error:</strong> ${e.message}</p>
          <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto;">${e.stack}</pre>
          <button onclick="location.reload()" style="background: #2196F3; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">
            🔄 Recargar aplicación
          </button>
          <button onclick="localStorage.clear(); location.reload()" style="background: #ff5722; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
            🗑️ Limpiar datos y recargar
          </button>
        </div>
      `)}});function It(){let e=!1;const t=Date.now();o.contacts.forEach((n,a)=>{n.lastEdited||(n.lastEdited=n.createdAt||t-(o.contacts.length-a)*1e3*60*60,e=!0),n.createdAt||(n.createdAt=n.lastEdited,e=!0)}),e&&I(o.contacts)}async function Nt(){try{const e={timestamp:new Date().toISOString(),url:window.location.href,userAgent:navigator.userAgent,screen:`${screen.width}x${screen.height}`,viewport:`${window.innerWidth}x${window.innerHeight}`,localStorage:!!window.localStorage,serviceWorker:"serviceWorker"in navigator,logs:B},t=`=== 📱 DEBUG MÓVIL EXPORT ===
Timestamp: ${e.timestamp}
URL: ${e.url}
User Agent: ${e.userAgent}
Screen: ${e.screen}
Viewport: ${e.viewport}
LocalStorage: ${e.localStorage}
Service Worker: ${e.serviceWorker}

=== 📋 LOGS (${e.logs.length} entradas) ===
${e.logs.map(n=>`[${n.timestamp}] ${n.message}`).join(`
`)}

=== 🔍 DATOS ADICIONALES ===
Estado contactos: ${JSON.stringify(o,null,2)}
localStorage contactos: ${localStorage.getItem("contactos_diarios")}
=== FIN DEBUG ===`;if(navigator.clipboard&&navigator.clipboard.writeText)await navigator.clipboard.writeText(t),C("✅ Debug copiado al portapapeles"),z("📋 Debug copiado al portapapeles");else{const n=document.createElement("textarea");n.value=t,n.style.position="fixed",n.style.top="0",n.style.left="0",n.style.width="2em",n.style.height="2em",n.style.padding="0",n.style.border="none",n.style.outline="none",n.style.boxShadow="none",n.style.background="transparent",document.body.appendChild(n),n.focus(),n.select();try{if(document.execCommand("copy"))C("✅ Debug copiado al portapapeles (fallback)"),z("📋 Debug copiado (selecciona y copia manualmente si no funcionó)");else throw new Error("execCommand failed")}catch(a){C("❌ Error copiando al portapapeles:",a),z("❌ Error copiando. Selecciona todo el texto manualmente")}document.body.removeChild(n)}}catch(e){C("❌ Error en copyMobileLogsToClipboard:",e),z("❌ Error copiando logs")}}function z(e){const t=document.createElement("div");t.style.cssText=`
    position: fixed;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    z-index: 10001;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  `,t.textContent=e,document.body.appendChild(t),setTimeout(()=>{t.parentNode&&t.parentNode.removeChild(t)},3e3)}
