(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const p of r.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&s(p)}).observe(document,{childList:!0,subtree:!0});function n(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(a){if(a.ep)return;a.ep=!0;const r=n(a);fetch(a.href,r)}})();const je="modulepreload",Ue=function(e){return"/ContactosDiarios/"+e},pe={},ze=function(t,n,s){let a=Promise.resolve();if(n&&n.length>0){let c=function(g){return Promise.all(g.map(f=>Promise.resolve(f).then(b=>({status:"fulfilled",value:b}),b=>({status:"rejected",reason:b}))))};var p=c;document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),i=d?.nonce||d?.getAttribute("nonce");a=c(n.map(g=>{if(g=Ue(g),g in pe)return;pe[g]=!0;const f=g.endsWith(".css"),b=f?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${g}"]${b}`))return;const E=document.createElement("link");if(E.rel=f?"stylesheet":je,f||(E.as="script"),E.crossOrigin="",E.href=g,i&&E.setAttribute("nonce",i),document.head.appendChild(E),f)return new Promise((x,k)=>{E.addEventListener("load",x),E.addEventListener("error",()=>k(new Error(`Unable to preload CSS for ${g}`)))})}))}function r(d){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=d,window.dispatchEvent(i),!i.defaultPrevented)throw d}return a.then(d=>{for(const i of d||[])i.status==="rejected"&&r(i.reason);return t().catch(r)})},H="0.1.09",be={},X="contactos_diarios_dropbox_auth",ye="contactos_diarios_dropbox_state",ve="contactos_diarios_dropbox_settings",xe="/contactos_diarios.json";function q(){try{return JSON.parse(localStorage.getItem(ve))||{}}catch{return{}}}function We(e){const n={...q(),...e};return localStorage.setItem(ve,JSON.stringify(n)),n}function P(){return q().appKey||be?.VITE_DROPBOX_APP_KEY||(typeof window<"u"?window.DROPBOX_APP_KEY:void 0)}function te(){return q().remotePath||xe}function Fe(){const e="/ContactosDiarios/";try{return new URL(e,location.origin).toString()}catch{return location.origin+e}}function we(){const e=q();if(e.redirectUri)return e.redirectUri;const t=be?.VITE_DROPBOX_REDIRECT_URI;return t||Fe()}function oe(){try{return JSON.parse(localStorage.getItem(X))||null}catch{return null}}function ne(e){e?localStorage.setItem(X,JSON.stringify(e)):localStorage.removeItem(X)}function ae(){try{return JSON.parse(localStorage.getItem(ye))||{}}catch{return{}}}function M(e){const n={...ae(),...e};return localStorage.setItem(ye,JSON.stringify(n)),n}function Ee(){const e=oe();return!!(e&&(e.refresh_token||e.access_token))}function Y(e){let t=2166136261;for(let n=0;n<e.length;n++)t^=e.charCodeAt(n),t=Math.imul(t,16777619);return(t>>>0).toString(16)}async function Ve(e){const t=new TextEncoder().encode(e),n=await crypto.subtle.digest("SHA-256",t),s=new Uint8Array(n);return btoa(String.fromCharCode.apply(null,s)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function me(e=64){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";let n="";const s=new Uint8Array(e);crypto.getRandomValues(s);for(let a=0;a<e;a++)n+=t[s[a]%t.length];return n}async function qe(){const e=P();if(!e)throw new Error("Falta configurar Dropbox App Key");const t=me(64),n=await Ve(t),s=me(16);sessionStorage.setItem("dropbox_code_verifier",t),sessionStorage.setItem("dropbox_oauth_state",s);const r=`https://www.dropbox.com/oauth2/authorize?${new URLSearchParams({response_type:"code",client_id:e,redirect_uri:we(),code_challenge:n,code_challenge_method:"S256",token_access_type:"offline",state:s}).toString()}`;location.assign(r)}async function Je(e){const t=P(),n=sessionStorage.getItem("dropbox_code_verifier");if(!t||!n)throw new Error("Auth contexto incompleto");const s=new URLSearchParams({grant_type:"authorization_code",code:e,client_id:t,redirect_uri:we(),code_verifier:n}),a=await fetch("https://api.dropboxapi.com/oauth2/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:s});if(!a.ok)throw new Error(`Token exchange failed: ${a.status} ${await a.text()}`);const r=await a.json(),p={access_token:r.access_token,refresh_token:r.refresh_token,expires_at:Date.now()+(r.expires_in?r.expires_in*1e3:3600*1e3)-3e4,account_id:r.account_id,uid:r.uid,scope:r.scope};return ne(p),sessionStorage.removeItem("dropbox_code_verifier"),sessionStorage.removeItem("dropbox_oauth_state"),p}async function He(){const e=P(),t=oe();if(!e||!t?.refresh_token)return null;const n=new URLSearchParams({grant_type:"refresh_token",refresh_token:t.refresh_token,client_id:e}),s=await fetch("https://api.dropboxapi.com/oauth2/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:n});if(!s.ok)throw new Error(`Refresh failed: ${s.status} ${await s.text()}`);const a=await s.json(),r={...t,access_token:a.access_token,expires_at:Date.now()+(a.expires_in?a.expires_in*1e3:3600*1e3)-3e4,scope:a.scope||t.scope};return ne(r),r}async function Se(){let e=oe();return e?((!e.expires_at||Date.now()>e.expires_at)&&(e=await He()),e?.access_token||null):null}async function Ke(){const e=new URL(location.href),t=e.searchParams.get("code"),n=e.searchParams.get("state"),s=sessionStorage.getItem("dropbox_oauth_state");t&&(s&&n!==s?console.warn("Dropbox OAuth state mismatch"):(await Je(t),M({lastAuthAt:Date.now()})),e.searchParams.delete("code"),e.searchParams.delete("state"),history.replaceState({},"",e.toString()))}async function ke(e,t={}){const n=await Se();if(!n)throw new Error("No autorizado con Dropbox");const s=Object.assign({},t.headers||{},{Authorization:`Bearer ${n}`});return await fetch(e,{...t,headers:s})}async function Ge(){return!0}async function Xe(e=te()){const t=await ke("https://content.dropboxapi.com/2/files/download",{method:"POST",headers:{"Dropbox-API-Arg":JSON.stringify({path:e})}});if(t.status===409)return{exists:!1};if(!t.ok)throw new Error(`Download failed: ${t.status}`);const n=t.headers.get("Dropbox-API-Result"),s=n?JSON.parse(n):{};return{exists:!0,text:await t.text(),meta:s}}async function Z(e,t=void 0,n=te()){const a=await ke("https://content.dropboxapi.com/2/files/upload",{method:"POST",headers:{"Content-Type":"application/octet-stream","Dropbox-API-Arg":JSON.stringify({path:n,mode:t?{".tag":"update",update:t}:"overwrite",autorename:!1,mute:!1,strict_conflict:!1})},body:e});if(!a.ok){const p=await a.text();throw new Error(`Upload failed: ${a.status} ${p}`)}return await a.json()}function Ye(e,t){const n=r=>`${(r.name||"").trim().toLowerCase()}|${(r.surname||"").trim().toLowerCase()}`,s=new Map,a=r=>{const p=n(r);if(!s.has(p)){s.set(p,JSON.parse(JSON.stringify(r)));return}const d=s.get(p),i=Number(d.lastEdited)||0,c=Number(r.lastEdited)||0;c>i&&(d.name=r.name||d.name,d.surname=r.surname||d.surname,d.phone=r.phone||d.phone,d.email=r.email||d.email),d.pinned=!!(d.pinned||r.pinned);const g=new Set([...d.tags||[],...r.tags||[]]);d.tags=Array.from(g),d.notes=d.notes||{};const f=Object.keys(r.notes||{});for(const b of f)b in d.notes?c>=i&&(d.notes[b]=r.notes[b]):d.notes[b]=r.notes[b];d.lastEdited=Math.max(i,c)};return(e||[]).forEach(a),(t||[]).forEach(a),Array.from(s.values())}async function $e(){await Ke()}function Ie(){return!!P()}function se(){return Ee()}function Ne(){const e=ae();return{lastSync:e.lastSync||null,lastRev:e.lastRev||null,lastHash:e.lastHash||null,remotePath:te(),appKeyPresent:!!P()}}function Ae({appKey:e,remotePath:t,redirectUri:n}={}){const s={};return e!==void 0&&(s.appKey=e.trim()),t!==void 0&&(s.remotePath=t.trim()||xe),n!==void 0&&(s.redirectUri=n.trim()),We(s)}async function De(){await qe()}function F(){ne(null),M({lastRev:null,lastSync:null})}async function Ze(){const e=await Se();if(!e){F();return}try{const t=await fetch("https://api.dropboxapi.com/2/auth/token/revoke",{method:"POST",headers:{Authorization:`Bearer ${e}`}});if(!t.ok)throw new Error(`Revocar falló: ${t.status}`)}catch(t){console.warn("Dropbox revoke error:",t.message)}finally{F()}}async function re(){const e=await Xe();if(!e.exists)return{contacts:null,rev:null};try{const t=JSON.parse(e.text);return{contacts:Array.isArray(t)?t:t.contacts||[],rev:e.meta?.rev||null}}catch{throw new Error("Contenido remoto inválido")}}async function ie(e){const t=ae(),n=JSON.stringify({contacts:e},null,2),s=await Z(n,t.lastRev||void 0);return M({lastRev:s.rev,lastSync:Date.now(),lastHash:Y(n)}),s}async function J(e){await Ge();const t=await re().catch(a=>({contacts:null,rev:null}));if(!t.contacts){const a=await ie(e||[]);return{merged:e||[],uploaded:!0,rev:a.rev}}const n=Ye(e||[],t.contacts||[]),s=JSON.stringify({contacts:n},null,2);try{const a=await Z(s,t.rev||void 0);return M({lastRev:a.rev,lastSync:Date.now(),lastHash:Y(s)}),{merged:n,uploaded:!0,rev:a.rev}}catch{const r=await Z(s,void 0);return M({lastRev:r.rev,lastSync:Date.now(),lastHash:Y(s)}),{merged:n,uploaded:!0,rev:r.rev}}}let ge=null;function Ce(e,t=2e3){Ee()&&(clearTimeout(ge),ge=setTimeout(async()=>{try{await J(e||[])}catch(n){console.warn("Dropbox autosync error:",n.message)}},t))}const Qe=Object.freeze(Object.defineProperty({__proto__:null,connectDropbox:De,disconnectDropbox:F,downloadDropboxContacts:re,getDropboxState:Ne,initDropbox:$e,isDropboxConfigured:Ie,isDropboxConnected:se,revokeDropboxToken:Ze,saveDropboxSettings:Ae,scheduleAutoUpload:Ce,syncDropbox:J,uploadDropboxContacts:ie},Symbol.toStringTag,{value:"Module"}));let R=!1,B=[];const fe=50,C=console.log;function et(e,t="info"){const n=new Date().toLocaleTimeString(),s={timestamp:n,message:typeof e=="object"?JSON.stringify(e,null,2):e,type:t};B.unshift(s),B.length>fe&&(B=B.slice(0,fe)),R&&le(),C(`[${n}] ${e}`)}console.log=function(...e){et(e.join(" "),"info"),C.apply(console,e)};function ce(){C("🐛 Toggling mobile logs, current state:",R),R=!R;let e=document.getElementById("mobile-logs-panel");R?(C("📱 Mostrando panel de logs móvil"),e||(e=document.createElement("div"),e.id="mobile-logs-panel",e.innerHTML=`
        <div class="mobile-logs-header">
          <span>📱 Debug Logs</span>
          <button id="copy-logs-btn">📋</button>
          <button id="clear-logs-btn">🗑️</button>
          <button id="close-logs-btn">❌</button>
        </div>
        <div id="mobile-logs-content"></div>
      `,document.body.appendChild(e),document.getElementById("copy-logs-btn").addEventListener("click",Lt),document.getElementById("clear-logs-btn").addEventListener("click",_e),document.getElementById("close-logs-btn").addEventListener("click",ce),C("📱 Panel de logs creado")),e.style.display="block",le()):(C("📱 Ocultando panel de logs móvil"),e&&(e.style.display="none"))}function le(){const e=document.getElementById("mobile-logs-content");e&&(e.innerHTML=B.map(t=>`
    <div class="mobile-log-entry mobile-log-${t.type}">
      <span class="mobile-log-time">${t.timestamp}</span>
      <pre class="mobile-log-message">${t.message}</pre>
    </div>
  `).join(""))}function _e(){C("🗑️ Limpiando logs móviles"),B=[],le()}window.toggleMobileLogs=ce;window.clearMobileLogs=_e;(function(){try{const t="contactos_diarios_app_version",n=localStorage.getItem(t);if(n&&n!==H){console.log(`🔧 Actualizando ContactosDiarios de v${n} a v${H}`);const s=localStorage.getItem("contactos_diarios"),a=localStorage.getItem("contactos_diarios_backups"),r=localStorage.getItem("contactos_diarios_backup_fecha"),p=localStorage.getItem("contactos_diarios_webdav_config"),d=[t,"contactos_diarios_backups","contactos_diarios_backup_fecha","contactos_diarios_webdav_config"];console.log("🧹 Limpiando SOLO claves de ContactosDiarios:",d),d.forEach(i=>{localStorage.removeItem(i)}),"caches"in window&&caches.keys().then(i=>{i.forEach(c=>{(c.includes("contactosdiarios")||c.includes("contactos-diarios"))&&(console.log("🗑️ Eliminando caché de ContactosDiarios:",c),caches.delete(c))})}),"serviceWorker"in navigator&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistrations().then(i=>{i.forEach(c=>{c.scope.includes("/ContactosDiarios/")||c.active?.scriptURL.includes("ContactosDiarios")||c.active?.scriptURL.includes("contactosdiarios")?(console.log("🔧 Desregistrando service worker de ContactosDiarios:",c.scope),c.unregister()):console.log("✅ Preservando service worker de otra aplicación:",c.scope)})}),s&&localStorage.setItem("contactos_diarios",s),a&&localStorage.setItem("contactos_diarios_backups",a),r&&localStorage.setItem("contactos_diarios_backup_fecha",r),p&&localStorage.setItem("contactos_diarios_webdav_config",p),console.log("✅ Datos de ContactosDiarios restaurados, recargando..."),location.reload()}localStorage.setItem(t,H)}catch(t){console.error("❌ Error en limpieza de ContactosDiarios:",t)}})();function tt({contacts:e,filter:t,onSelect:n,onDelete:s}){let a=t?e.filter(i=>{const c=t.toLowerCase(),g=i.notes?Object.values(i.notes).join(" ").toLowerCase():"";return i.tags?.some(f=>f.toLowerCase().includes(c))||i.name?.toLowerCase().includes(c)||i.surname?.toLowerCase().includes(c)||g.includes(c)}):e;console.log("🔄 INICIANDO ORDENACIÓN - Estado inicial:",a.length,"contactos"),a.forEach((i,c)=>{(!i.lastEdited||isNaN(Number(i.lastEdited)))&&(console.log(`⚠️ Contacto sin fecha válida: ${i.name} - lastEdited: ${i.lastEdited}`),a[c].lastEdited=0)});for(let i=0;i<2;i++)console.log(`🔄 Pasada de ordenación #${i+1}`),a=a.slice().sort((c,g)=>{const f=/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),b=window.location.hostname==="sasogu.github.io";if(c.pinned!==g.pinned){const I=c.pinned?-1:1;return(f||b)&&console.log(`📌 Fijado: ${c.pinned?c.name:g.name} va arriba (resultado: ${I})`),I}const E=Number(c.lastEdited)||0,x=Number(g.lastEdited)||0,k=x-E;return(f||b)&&i===0&&console.log(`📅 ${c.name}(${E}) vs ${g.name}(${x}) = ${k} (${k>0?g.name:k<0?c.name:"igual"} primero)`),k});console.log("✅ ORDENACIÓN COMPLETADA"),console.log("🔍 VALIDANDO ORDEN FINAL...");const r=a.filter(i=>i.pinned),p=a.filter(i=>!i.pinned);console.log(`📌 Contactos fijados: ${r.length}`),console.log(`📄 Contactos no fijados: ${p.length}`);let d=!0;for(let i=0;i<p.length-1;i++){const c=p[i],g=p[i+1],f=Number(c.lastEdited)||0,b=Number(g.lastEdited)||0;f<b?(console.log(`❌ ERROR: ${c.name} (${f}) debería ir DESPUÉS de ${g.name} (${b})`),d=!1):console.log(`✅ OK: ${c.name} (${f}) antes que ${g.name} (${b})`)}if(d||(console.log("🔧 FORZANDO CORRECCIÓN DEL ORDEN..."),p.sort((i,c)=>{const g=Number(i.lastEdited)||0;return(Number(c.lastEdited)||0)-g}),a=[...r,...p],console.log("✅ ORDEN CORREGIDO")),(window.location.hostname==="sasogu.github.io"||/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))&&console.log("📱 ORDEN FINAL:",a.slice(0,8).map((i,c)=>`${c+1}. ${i.pinned?"📌":"📄"} ${i.name} (${i.lastEdited?new Date(i.lastEdited).toLocaleString():"Sin fecha"})`)),window.location.hostname==="sasogu.github.io"||/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){console.log("📱 DEBUG MÓVIL - Orden contactos:",a.slice(0,5).map(c=>`${c.pinned?"📌":"📄"} ${c.name} (${c.lastEdited?new Date(c.lastEdited).toLocaleString():"Sin fecha"})`));const i=a.filter(c=>!c.pinned);console.log("📄 DEBUG - Contactos NO fijados ordenados:",i.slice(0,5).map(c=>`${c.name} (${c.lastEdited?new Date(c.lastEdited).toLocaleString():"Sin fecha"}) [${c.lastEdited}]`));for(let c=0;c<i.length-1;c++){const g=i[c],f=i[c+1],b=Number(g.lastEdited)||0,E=Number(f.lastEdited)||0;b<E?console.log(`❌ ERROR ORDEN: ${g.name} (${b}) debería ir DESPUÉS de ${f.name} (${E})`):console.log(`✅ ORDEN OK: ${g.name} (${b}) está antes que ${f.name} (${E})`)}}return`
    <div class="contact-list">
      <h2>Contactos</h2>
      <input id="tag-filter" class="tag-filter" placeholder="Buscar nombre, apellidos, etiqueta o nota..." value="${t||""}" />
      <ul>
        ${a.length===0?'<li class="empty">Sin contactos</li>':a.map((i,c)=>{const g=Date.now(),f=24*60*60*1e3,b=i.lastEdited&&g-i.lastEdited<f,E=b&&!i.pinned?" recently-edited":"";let x="";if(i.lastEdited){const k=g-i.lastEdited,I=Math.floor(k/(60*60*1e3)),L=Math.floor(k%(60*60*1e3)/(60*1e3));I<1?x=L<1?"Ahora":`${L}m`:I<24?x=`${I}h`:x=`${Math.floor(I/24)}d`}return`
          <li${i.pinned?' class="pinned"':E}>
            <div class="contact-main">
              <button class="select-contact" data-index="${e.indexOf(i)}">
                ${b&&!i.pinned?"🆕 ":""}${i.surname?i.surname+", ":""}${i.name}
                ${x&&b?`<span class="time-ago">(${x})</span>`:""}
              </button>
              <span class="tags">${(i.tags||[]).map(k=>`<span class='tag'>${k}</span>`).join(" ")}</span>
              <button class="pin-contact" data-index="${e.indexOf(i)}" title="${i.pinned?"Desfijar":"Fijar"}">${i.pinned?"📌":"📍"}</button>
            </div>
            <div class="contact-info">
              ${i.phone?`<a href="tel:${i.phone}" class="contact-link" title="Llamar"><span>📞</span> ${i.phone}</a>`:""}
              ${i.email?`<a href="mailto:${i.email}" class="contact-link" title="Enviar correo"><span>✉️</span> ${i.email}</a>`:""}
            </div>
            <div class="contact-actions">
              <button class="add-note-contact" data-index="${e.indexOf(i)}" title="Añadir nota">📝</button>
              <button class="edit-contact" data-index="${e.indexOf(i)}" title="Editar">✏️</button>
              <button class="delete-contact" data-index="${e.indexOf(i)}" title="Eliminar">🗑️</button>
            </div>
          </li>
          `}).join("")}
      </ul>
    </div>
  `}function ot({contact:e}){return`
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
  `}function nt({notes:e}){if(!V())return`
      <div class="notes-area">
        <h3>🔒 Notas privadas protegidas</h3>
        <div style="text-align:center;padding:20px;background:#f8f9fa;border-radius:8px;margin:20px 0;">
          <p style="margin-bottom:15px;color:#666;">
            Las notas están protegidas con contraseña para mantener tu privacidad.
          </p>
          <button id="unlock-notes-btn" style="background:#3a4a7c;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;">
            🔓 Desbloquear notas
          </button>
          ${V()?`
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
        ${Object.entries(e||{}).sort((a,r)=>r[0].localeCompare(a[0])).map(([a,r])=>`
          <li>
            <b>${a}</b>:
            <span class="note-content" data-date="${a}">${r}</span>
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
  `}function at({}){return`
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
  `}function st(){const e=Ne(),t=Ie(),n=se(),s=e.lastSync?new Date(e.lastSync).toLocaleString():"—",a=(()=>{try{return JSON.parse(localStorage.getItem("contactos_diarios_dropbox_settings"))||{}}catch{return{}}})();return`
    <div style="border:1px solid #e7e7e7;padding:12px;border-radius:8px;margin-top:1rem;background:#f9fafb;">
      <h3 style="margin:0 0 8px 0;">🔄 Sincronización Dropbox</h3>
      ${t?`
        <div style="font-size:0.95em;margin-bottom:8px;color:${n?"#155724":"#856404"};">
          Estado: <strong>${n?"Conectado":"No conectado"}</strong>
        </div>
        <div style="font-size:0.85em;color:#555;margin-bottom:8px;">
          Archivo remoto: <code>${e.remotePath}</code><br/>
          Última sync: ${s}
        </div>
        ${n?`
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <button id="dropbox-sync" style="background:#3a4a7c;color:#fff;">🔁 Sincronizar</button>
            <button id="dropbox-download" style="background:#0d6efd;color:#fff;">⬇️ Descargar</button>
            <button id="dropbox-upload" style="background:#198754;color:#fff;">⬆️ Subir</button>
            <span style="flex:1 1 auto"></span>
            <button id="dropbox-revoke" style="background:#6c757d;color:#fff;">🛑 Revocar sesión</button>
            <button id="dropbox-disconnect" style="background:#dc3545;color:#fff;">🚪 Desconectar</button>
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
          <label>App Key <input id="dropbox-app-key" placeholder="dbx_app_key" value="${a.appKey||""}"/></label>
          <label>Ruta remota <input id="dropbox-remote-path" placeholder="/contactos_diarios.json" value="${a.remotePath||"/contactos_diarios.json"}"/></label>
          <label>Redirect URI <input id="dropbox-redirect-uri" placeholder="https://<user>.github.io/ContactosDiarios/" value="${a.redirectUri||""}"/></label>
          <button id="dropbox-save-settings" style="background:#6c757d;color:#fff;max-width:160px;">Guardar</button>
        </div>
      </details>
    </div>
  `}function rt({contacts:e,visible:t,page:n=1}){let s=[];e.forEach((c,g)=>{c.notes&&Object.entries(c.notes).forEach(([f,b])=>{s.push({date:f,text:b,contact:c,contactIndex:g})})}),s.sort((c,g)=>g.date.localeCompare(c.date));const a=4,r=Math.max(1,Math.ceil(s.length/a)),p=Math.min(Math.max(n,1),r),d=(p-1)*a,i=s.slice(d,d+a);return`
    <div id="all-notes-modal" class="modal" style="display:${t?"flex":"none"}">
      <div class="modal-content" style="max-width: 500px;">
        <h3>Notas de todos los contactos</h3>
        <ul class="note-history">
          ${s.length===0?"<li>No hay notas registradas.</li>":i.map(c=>`
            <li>
              <b>${c.date}</b> — <span style="color:#3a4a7c">${c.contact.surname?c.contact.surname+", ":""}${c.contact.name}</span><br/>
              <span>${c.text}</span>
              <a href="#" class="edit-note-link" data-contact="${c.contactIndex}" data-date="${c.date}" style="margin-left:0.5em;color:#646cff;font-size:0.95em;">Editar nota</a>
            </li>
          `).join("")}
        </ul>
        <div class="pagination" style="display:flex;justify-content:center;align-items:center;gap:1em;margin:1em 0;">
          <button id="prev-notes-page" ${p===1?"disabled":""}>&lt; Anterior</button>
          <span>Página ${p} de ${r}</span>
          <button id="next-notes-page" ${p===r?"disabled":""}>Siguiente &gt;</button>
        </div>
        <div class="form-actions">
          <button id="close-all-notes">Cerrar</button>
        </div>
      </div>
    </div>
  `}function it({visible:e,backups:t}){return`
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
  `}function ct({visible:e,contactIndex:t}){const n=t!==null?o.contacts[t]:null,s=new Date,r=new Date(s.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10);return`
    <div id="add-note-modal" class="modal" style="display:${e?"flex":"none"};z-index:4000;">
      <div class="modal-content" style="max-width:500px;">
        <h3>Añadir nota diaria</h3>
        ${n?`<p><strong>${n.surname?n.surname+", ":""}${n.name}</strong></p>`:""}
        <form id="add-note-form">
          <label>Fecha <input type="date" id="add-note-date" value="${r}" required /></label>
          <label>Nota <textarea id="add-note-text" rows="4" placeholder="Escribe una nota para este contacto..." required></textarea></label>
          <div class="form-actions">
            <button type="submit">Guardar nota</button>
            <button type="button" id="cancel-add-note">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `}function h(e,t="info"){let n=document.getElementById("notification-container");n||(n=document.createElement("div"),n.id="notification-container",n.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
      pointer-events: none;
    `,document.body.appendChild(n));const s=document.createElement("div");s.style.cssText=`
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
  `;const a=t==="success"?"✅":t==="error"?"❌":t==="warning"?"⚠️":"ℹ️";s.innerHTML=`${a} ${e}`,n.appendChild(s),setTimeout(()=>{s.style.opacity="1",s.style.transform="translateX(0)"},10);const r=()=>{s.style.opacity="0",s.style.transform="translateX(100%)",setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},300)};s.onclick=r,setTimeout(r,4e3)}function lt(e){console.log("📢 Mostrando notificación de actualización para versión:",e);const t=document.createElement("div");t.id="update-notification",t.innerHTML=`
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
  `;const n=document.getElementById("update-notification");n&&n.remove(),document.body.appendChild(t),setTimeout(()=>{document.getElementById("update-notification")&&dt()},1e4)}function dt(){const e=document.getElementById("update-notification");e&&(e.style.transform="translateX(100%)",e.style.transition="transform 0.3s ease",setTimeout(()=>e.remove(),300))}function K(e){const t=[];return!e.name||e.name.trim().length===0?t.push("El nombre es obligatorio"):e.name.trim().length<2?t.push("El nombre debe tener al menos 2 caracteres"):e.name.trim().length>50&&t.push("El nombre no puede tener más de 50 caracteres"),e.surname&&e.surname.trim().length>50&&t.push("Los apellidos no pueden tener más de 50 caracteres"),e.phone&&e.phone.trim().length>0&&(/^[\d\s\-\+\(\)\.]{6,20}$/.test(e.phone.trim())||t.push("El teléfono debe contener solo números, espacios y caracteres válidos (6-20 caracteres)")),e.email&&e.email.trim().length>0&&(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email.trim())?e.email.trim().length>100&&t.push("El email no puede tener más de 100 caracteres"):t.push("El email debe tener un formato válido")),t}function G(e){const t=[];return!e||e.trim().length===0?(t.push("La nota no puede estar vacía"),t):(e.trim().length>1e3&&t.push("La nota no puede tener más de 1000 caracteres"),e.trim().length<3&&t.push("La nota debe tener al menos 3 caracteres"),/^[\w\s\.\,\;\:\!\?\-\(\)\[\]\"\'\/\@\#\$\%\&\*\+\=\<\>\{\}\|\~\`\ñÑáéíóúÁÉÍÓÚüÜ]*$/.test(e)||t.push("La nota contiene caracteres no permitidos"),t)}const Q="contactos_diarios";let o={contacts:ut(),selected:null,notes:"",editing:null,tagFilter:"",showAllNotes:!1,showBackupModal:!1,showAddNoteModal:!1,addNoteContactIndex:null,allNotesPage:1,duplicates:[],showDuplicateModal:!1,showAuthModal:!1,authMode:"login",pendingAction:null};function ut(){try{return JSON.parse(localStorage.getItem(Q))||[]}catch{return[]}}function A(e){if(!e||!Array.isArray(e)){console.error("❌ ERROR: Intentando guardar contactos inválidos:",e);return}if(e.length===0){const t=localStorage.getItem(Q);if(t&&t!=="[]"){console.error("❌ ERROR: Intentando sobrescribir contactos existentes con array vacío. Operación cancelada."),console.log("📊 Contactos existentes:",t);return}console.log("ℹ️ Guardando array vacío (primera vez o limpieza intencional)")}console.log(`💾 Guardando ${e.length} contactos en localStorage`),localStorage.setItem(Q,JSON.stringify(e));try{Ce(e)}catch{}}function j(e){const t=new Date(new Date().toLocaleString("en-US",{timeZone:"Europe/Madrid"})),n=r=>String(r).padStart(2,"0"),s=r=>String(r).padStart(3,"0");return`${e} ${n(t.getHours())}:${n(t.getMinutes())}:${n(t.getSeconds())}.${s(t.getMilliseconds())}`}function y(){console.log("🎨 Iniciando render...");try{const e=document.querySelector("#app");if(!e){console.error("❌ ERROR: No se encontró el elemento #app");return}console.log("✅ Elemento #app encontrado:",e);const t=o.editing!==null?o.contacts[o.editing]:null,n=o.selected!==null?o.contacts[o.selected].notes||{}:{};console.log("📊 Estado actual:",{editing:o.editing,selected:o.selected,contactsCount:o.contacts.length}),e.innerHTML=`
    <h1>Diario de Contactos</h1>
    <button id="show-all-notes-btn" style="background:#3a4a7c;color:#fff;margin-bottom:1.2rem;">📝 Ver todas las notas</button>
    <div class="main-grid">
      <div>
        
        ${tt({contacts:o.contacts,filter:o.tagFilter})}
        <button id="show-backup-modal" class="add-btn" style="width:100%;margin-top:0.7rem;background:#06b6d4;">Restaurar copia local</button>
        <div style="margin-top:1rem;">
        <button id="add-contact" class="add-btn">➕ Nuevo contacto</button>
          <button id="import-btn" style="background:#6f42c1;color:#fff;margin:0 10px 1.2rem 0;">📂 Importar contactos</button>
          <button id="export-btn" style="background:#fd7e14;color:#fff;margin:0 10px 1.2rem 0;">💾 Exportar contactos</button>
          <button id="manage-duplicates-btn" style="background:#dc3545;color:#fff;margin:0 10px 1.2rem 0;">🔍 Gestionar duplicados</button>
          <button id="validate-contacts-btn" style="background:#28a745;color:#fff;margin:0 10px 1.2rem 0;">✅ Validar contactos</button>
        </div>
        ${st()}
      </div>
      <div>
        ${o.editing!==null?ot({contact:t}):""}
        ${o.selected!==null&&o.editing===null?nt({notes:n}):""}
      </div>
    </div>
    ${rt({contacts:o.contacts,visible:o.showAllNotes,page:o.allNotesPage})}
    ${it({visible:o.showBackupModal,backups:JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]")})} <!-- Modal de backup -->
    ${ct({visible:o.showAddNoteModal,contactIndex:o.addNoteContactIndex})} <!-- Modal añadir nota -->
    ${St({duplicates:o.duplicates,visible:o.showDuplicateModal})} <!-- Modal de gestión de duplicados -->
    ${Dt({visible:o.showAuthModal,mode:o.authMode})} <!-- Modal de autenticación -->
    ${at({})}
  `,pt(),Ot();const s=document.getElementById("show-backup-modal");s&&(s.onclick=()=>{o.showBackupModal=!0,y()});const a=document.getElementById("close-backup-modal");a&&(a.onclick=()=>{o.showBackupModal=!1,y()}),document.querySelectorAll(".add-note-contact").forEach(x=>{x.onclick=k=>{const I=Number(x.dataset.index);if(!V()){o.pendingAction={type:"addNote",contactIndex:I},ee()?o.authMode="login":o.authMode="setup",o.showAuthModal=!0,y();return}o.addNoteContactIndex=I,o.showAddNoteModal=!0,y()}});const r=document.getElementById("cancel-add-note");r&&(r.onclick=()=>{o.showAddNoteModal=!1,o.addNoteContactIndex=null,y()}),document.querySelectorAll(".restore-backup-btn").forEach(x=>{x.onclick=()=>xt(x.dataset.fecha)});const p=document.getElementById("restore-local-backup");p&&(p.onclick=restaurarBackupLocal);const d=document.getElementById("dropbox-connect");d&&(d.onclick=async()=>{try{await De()}catch(x){h("Error iniciando Dropbox: "+x.message,"error")}});const i=document.getElementById("dropbox-disconnect");i&&(i.onclick=()=>{F(),y(),h("Desconectado de Dropbox","info")});const c=document.getElementById("dropbox-sync");c&&(c.onclick=async()=>{try{h("Sincronizando con Dropbox...","info");const x=await J(o.contacts);JSON.stringify(x.merged)!==JSON.stringify(o.contacts)&&(o.contacts=x.merged,A(o.contacts),y()),h("Sincronización completada","success")}catch(x){h("Error de sincronización: "+x.message,"error")}});const g=document.getElementById("dropbox-download");g&&(g.onclick=async()=>{try{const x=await re();if(!x.contacts){h("No hay datos remotos en Dropbox","warning");return}if(!confirm("Esto reemplazará tus contactos locales con los remotos. ¿Continuar?"))return;o.contacts=x.contacts,A(o.contacts),y(),h("Datos descargados desde Dropbox","success")}catch(x){h("Error al descargar: "+x.message,"error")}});const f=document.getElementById("dropbox-upload");f&&(f.onclick=async()=>{try{await ie(o.contacts),h("Datos subidos a Dropbox","success")}catch(x){h("Error al subir: "+x.message,"error")}});const b=document.getElementById("dropbox-revoke");b&&(b.onclick=async()=>{try{h("Revocando sesión en Dropbox...","info");const{revokeDropboxToken:x}=await ze(async()=>{const{revokeDropboxToken:k}=await Promise.resolve().then(()=>Qe);return{revokeDropboxToken:k}},void 0);await x(),y(),h("Sesión de Dropbox revocada","success")}catch(x){h("No se pudo revocar: "+x.message,"error")}});const E=document.getElementById("dropbox-save-settings");E&&(E.onclick=()=>{const x=document.getElementById("dropbox-app-key")?.value||"",k=document.getElementById("dropbox-remote-path")?.value||"",I=document.getElementById("dropbox-redirect-uri")?.value||"";Ae({appKey:x,remotePath:k,redirectUri:I}),h("Configuración Dropbox guardada","success"),y()}),console.log("✅ Render completado exitosamente")}catch(e){console.error("❌ ERROR en render:",e),console.error("Stack trace:",e.stack);const t=document.querySelector("#app");t&&(t.innerHTML=`
        <div style="padding: 20px; background: #ffebee; border: 1px solid #f44336; border-radius: 8px; margin: 20px;">
          <h2 style="color: #d32f2f;">❌ Error de la aplicación</h2>
          <p><strong>Error:</strong> ${e.message}</p>
          <p><strong>Línea:</strong> ${e.stack}</p>
          <button onclick="location.reload()" style="background: #2196F3; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
            🔄 Recargar aplicación
          </button>
        </div>
      `)}}let he=null;function pt(){const e=document.getElementById("tag-filter");e&&e.addEventListener("input",u=>{clearTimeout(he),he=setTimeout(()=>{o.tagFilter=e.value,y();const l=document.getElementById("tag-filter");l&&(l.value=o.tagFilter,l.focus(),l.setSelectionRange(o.tagFilter.length,o.tagFilter.length))},300)});const t=document.getElementById("add-contact");t&&(t.onclick=()=>{o.editing=null,o.selected=null,y(),o.editing=o.contacts.length,y()}),document.querySelectorAll(".select-contact").forEach(u=>{u.onclick=l=>{l.preventDefault(),l.stopPropagation(),z(u)&&(o.selected=Number(u.dataset.index),o.editing=null,y())}}),document.querySelectorAll(".edit-contact").forEach(u=>{u.onclick=l=>{l.preventDefault(),l.stopPropagation(),z(u)&&(o.editing=Number(u.dataset.index),o.selected=null,y())}}),document.querySelectorAll(".delete-contact").forEach(u=>{u.onclick=l=>{if(l.preventDefault(),l.stopPropagation(),!z(u))return;const m=Number(u.dataset.index),v=o.contacts[m],w=v.surname?`${v.surname}, ${v.name}`:v.name;confirm(`¿Estás seguro de eliminar el contacto "${w}"?

Esta acción no se puede deshacer.`)&&(o.contacts.splice(m,1),A(o.contacts),h("Contacto eliminado correctamente","success"),o.selected=null,y())}}),document.querySelectorAll(".pin-contact").forEach(u=>{u.onclick=l=>{if(l.preventDefault(),l.stopPropagation(),!z(u))return;const m=Number(u.dataset.index);o.contacts[m].pinned&&!confirm("¿Seguro que quieres desfijar este contacto?")||(o.contacts[m].pinned=!o.contacts[m].pinned,A(o.contacts),y())}});const n=document.getElementById("contact-form");n&&(n.onsubmit=u=>{u.preventDefault();const l=Object.fromEntries(new FormData(n)),m=K(l);if(m.length>0){h("Error de validación: "+m.join(", "),"error");return}let v=l.tags?l.tags.split(",").map(N=>N.trim()).filter(Boolean):[];delete l.tags;const w={...l};o.contacts.some((N,D)=>o.editing!==null&&D===o.editing?!1:Be(N,w))&&!confirm("Ya existe un contacto similar. ¿Deseas guardarlo de todas formas?")||(o.editing!==null&&o.editing<o.contacts.length?(o.contacts[o.editing]={...o.contacts[o.editing],...l,tags:v,lastEdited:Date.now()},(window.location.hostname==="sasogu.github.io"||/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))&&console.log("📱 CONTACTO EDITADO:",o.contacts[o.editing].name,"Nueva fecha:",new Date().toLocaleString()),h("Contacto actualizado correctamente","success")):(o.contacts.push({...l,notes:{},tags:v,lastEdited:Date.now(),createdAt:Date.now()}),h("Contacto añadido correctamente","success")),A(o.contacts),o.editing=null,y())},document.getElementById("cancel-edit").onclick=()=>{o.editing=null,y()});const s=document.getElementById("add-note-form");if(s&&o.addNoteContactIndex!==null){const u=l=>{l.preventDefault();const m=document.getElementById("add-note-date").value,v=document.getElementById("add-note-text").value.trim();if(!m||!v){h("Por favor, selecciona una fecha y escribe una nota","warning");return}const w=G(v);if(w.length>0){h("Error en la nota: "+w.join(", "),"error");return}const S=o.addNoteContactIndex;o.contacts[S].notes||(o.contacts[S].notes={});let N=j(m);for(;o.contacts[S].notes[N];)N=j(m);o.contacts[S].notes[N]=v,o.contacts[S].lastEdited=Date.now(),(window.location.hostname==="sasogu.github.io"||/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))&&console.log(`📝 MÓVIL - Nota añadida a ${o.contacts[S].name}, lastEdited: ${o.contacts[S].lastEdited}`),A(o.contacts),h("Nota añadida correctamente","success"),o.showAddNoteModal=!1,o.addNoteContactIndex=null,y()};s.onsubmit=u}const a=document.getElementById("note-form");if(a&&o.selected!==null){const u=l=>{l.preventDefault();const m=document.getElementById("note-date").value,v=document.getElementById("note-text").value.trim();if(!m||!v){h("Por favor, selecciona una fecha y escribe una nota","warning");return}const w=G(v);if(w.length>0){h("Error en la nota: "+w.join(", "),"error");return}o.contacts[o.selected].notes||(o.contacts[o.selected].notes={});let S=j(m);for(;o.contacts[o.selected].notes[S];)S=j(m);o.contacts[o.selected].notes[S]=v,o.contacts[o.selected].lastEdited=Date.now(),A(o.contacts),h("Nota guardada correctamente","success"),document.getElementById("note-text").value="",y()};a.onsubmit=u}document.querySelectorAll(".edit-note").forEach(u=>{u.onclick=l=>{const m=u.dataset.date,v=document.getElementById("edit-note-modal"),w=document.getElementById("edit-note-text");w.value=o.contacts[o.selected].notes[m],v.style.display="block",document.getElementById("save-edit-note").onclick=()=>{const S=w.value.trim(),N=G(S);if(N.length>0){h("Error en la nota: "+N.join(", "),"error");return}o.contacts[o.selected].notes[m]=S,o.contacts[o.selected].lastEdited=Date.now(),A(o.contacts),h("Nota actualizada correctamente","success"),v.style.display="none",y()},document.getElementById("cancel-edit-note").onclick=()=>{v.style.display="none"}}}),document.querySelectorAll(".delete-note").forEach(u=>{u.onclick=l=>{const m=u.dataset.date;confirm(`¿Estás seguro de eliminar la nota del ${m}?

Esta acción no se puede deshacer.`)&&(delete o.contacts[o.selected].notes[m],A(o.contacts),h("Nota eliminada correctamente","success"),y())}}),document.getElementById("import-btn").onclick=()=>{document.getElementById("import-file").click()},document.getElementById("export-btn").onclick=()=>{document.getElementById("export-modal").style.display="flex",document.getElementById("export-vcf").onclick=()=>{ht(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-csv").onclick=()=>{bt(),document.getElementById("export-modal").style.display="none"},document.getElementById("export-json").onclick=()=>{yt(),document.getElementById("export-modal").style.display="none"},document.getElementById("cancel-export").onclick=()=>{document.getElementById("export-modal").style.display="none"}},document.getElementById("import-file").onchange=async u=>{const l=u.target.files[0];if(!l)return;const m=await l.text();let v=[];if(l.name.endsWith(".vcf"))v=mt(m);else if(l.name.endsWith(".csv"))v=ft(m);else if(l.name.endsWith(".json"))try{const w=JSON.parse(m);Array.isArray(w)?v=w:w&&Array.isArray(w.contacts)&&(v=w.contacts)}catch{}if(v.length){const w=[],S=[];if(v.forEach(($,O)=>{const ue=K($);ue.length===0?w.push($):S.push({index:O+1,errors:ue})}),S.length>0){const $=S.map(O=>`Contacto ${O.index}: ${O.errors.join(", ")}`).join(`
`);if(!confirm(`Se encontraron ${S.length} contacto(s) con errores:

${$}

¿Deseas importar solo los contactos válidos (${w.length})?`))return}const N=$=>o.contacts.some(O=>O.name===$.name&&O.surname===$.surname&&O.phone===$.phone),D=w.filter($=>!N($));D.length?(o.contacts=o.contacts.concat(D),A(o.contacts),h(`${D.length} contacto(s) importado(s) correctamente`,"success"),y()):h("No se han importado contactos nuevos (todos ya existen)","info")}else h("No se pudieron importar contactos del archivo seleccionado","error")};const r=document.getElementById("close-all-notes");r&&(r.onclick=()=>{o.showAllNotes=!1,o.allNotesPage=1,y()});const p=document.getElementById("show-all-notes-btn");p&&(p.onclick=()=>{if(!V()){o.pendingAction={type:"showAllNotes"},ee()?o.authMode="login":o.authMode="setup",o.showAuthModal=!0,y();return}o.showAllNotes=!0,o.allNotesPage=1,y()});const d=document.getElementById("prev-notes-page");d&&(d.onclick=()=>{o.allNotesPage>1&&(o.allNotesPage--,y())});const i=document.getElementById("next-notes-page");i&&(i.onclick=()=>{let u=[];o.contacts.forEach((m,v)=>{m.notes&&Object.entries(m.notes).forEach(([w,S])=>{u.push({date:w,text:S,contact:m,contactIndex:v})})});const l=Math.max(1,Math.ceil(u.length/4));o.allNotesPage<l&&(o.allNotesPage++,y())}),document.querySelectorAll(".edit-note-link").forEach(u=>{u.onclick=l=>{l.preventDefault();const m=Number(u.dataset.contact),v=u.dataset.date;o.selected=m,o.editing=null,o.showAllNotes=!1,y(),setTimeout(()=>{const w=document.querySelector(`.edit-note[data-date="${v}"]`);w&&w.click()},50)}}),document.querySelectorAll(".share-backup-btn").forEach(u=>{u.onclick=async()=>{const l=u.dataset.fecha,v=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find($=>$.fecha===l);if(!v)return alert("No se encontró la copia seleccionada.");const w=`contactos_backup_${l}.json`,S=JSON.stringify(v.datos,null,2),N=new Blob([S],{type:"application/json"}),D=document.createElement("a");if(D.href=URL.createObjectURL(N),D.download=w,D.style.display="none",document.body.appendChild(D),D.click(),setTimeout(()=>{URL.revokeObjectURL(D.href),D.remove()},1e3),navigator.canShare&&window.File&&window.FileReader)try{const $=new File([N],w,{type:"application/json"});navigator.canShare({files:[$]})&&await navigator.share({files:[$],title:"Backup de Contactos",text:`Copia de seguridad (${l}) de ContactosDiarios`})}catch{}}});const c=document.getElementById("manage-duplicates-btn");c&&(c.onclick=()=>{o.duplicates=wt(),o.duplicates.length===0?h("No se encontraron contactos duplicados","info"):(o.showDuplicateModal=!0,y())});const g=document.getElementById("validate-contacts-btn");g&&(g.onclick=()=>{const u=[];if(o.contacts.forEach((l,m)=>{const v=K(l);if(v.length>0){const w=l.surname?`${l.surname}, ${l.name}`:l.name;u.push({index:m+1,name:w,errors:v})}}),u.length===0)h(`✅ Todos los ${o.contacts.length} contactos son válidos`,"success");else{const l=u.map(m=>`${m.index}. ${m.name}: ${m.errors.join(", ")}`).join(`
`);h(`⚠️ Se encontraron ${u.length} contacto(s) con errores`,"warning"),console.log("Contactos con errores de validación:",u),confirm(`Se encontraron ${u.length} contacto(s) con errores de validación:

${l}

¿Deseas ver más detalles en la consola del navegador?`)&&console.table(u)}});const f=document.getElementById("cancel-duplicate-resolution");f&&(f.onclick=()=>{o.showDuplicateModal=!1,o.duplicates=[],y()});const b=document.getElementById("apply-resolution");b&&(b.onclick=kt),document.querySelectorAll('input[name^="resolution-"]').forEach(u=>{u.addEventListener("change",()=>{const l=u.name.split("-")[1],m=document.getElementById(`merge-section-${l}`),v=document.getElementById(`individual-section-${l}`);u.value==="merge"?(m.style.display="block",v.style.display="none"):u.value==="select"?(m.style.display="none",v.style.display="block"):(m.style.display="none",v.style.display="none")})}),document.querySelectorAll('.resolution-option input[type="radio"]').forEach(u=>{u.addEventListener("change",()=>{const l=u.name;document.querySelectorAll(`input[name="${l}"]`).forEach(m=>{m.closest(".resolution-option").classList.remove("selected")}),u.closest(".resolution-option").classList.add("selected")})});const E=document.getElementById("unlock-notes-btn");E&&(E.onclick=()=>{o.selected!==null&&(o.pendingAction={type:"showContactNotes",contactIndex:o.selected}),ee()?o.authMode="login":o.authMode="setup",o.showAuthModal=!0,y()});const x=document.getElementById("logout-btn");x&&(x.onclick=()=>{At(),y()});const k=document.getElementById("auth-form");k&&!k.hasAttribute("data-handler-added")&&(k.setAttribute("data-handler-added","true"),k.onsubmit=u=>{u.preventDefault();const l=document.getElementById("auth-password").value.trim();if(!l){h("Por favor, introduce una contraseña","warning");return}if(o.authMode==="setup"){const m=document.getElementById("auth-password-confirm").value.trim();if(l!==m){h("Las contraseñas no coinciden","error");return}if(l.length<4){h("La contraseña debe tener al menos 4 caracteres","warning");return}$t(l),_.isAuthenticated=!0,_.sessionExpiry=Date.now()+30*60*1e3,o.showAuthModal=!1,k.reset(),setTimeout(()=>{Te()},100),y()}else Nt(l)?(o.showAuthModal=!1,k.reset(),y()):(document.getElementById("auth-password").value="",document.getElementById("auth-password").focus())});const I=document.getElementById("cancel-auth");I&&(I.onclick=()=>{o.showAuthModal=!1,o.pendingAction=null,y()});const L=document.getElementById("auth-modal");if(L){L.onclick=m=>{m.target===L&&(o.showAuthModal=!1,o.pendingAction=null,y())};const u=document.getElementById("auth-password");if(u){const m=window.innerWidth<=700?300:100;setTimeout(()=>{u.focus(),window.innerWidth<=700&&u.scrollIntoView({behavior:"smooth",block:"center"})},m)}const l=m=>{m.key==="Escape"&&o.showAuthModal&&(o.showAuthModal=!1,o.pendingAction=null,y())};document.addEventListener("keydown",l)}}function mt(e){const t=[],n=e.split("END:VCARD");for(const s of n){const a=/FN:([^\n]*)/.exec(s)?.[1]?.trim(),r=/N:.*;([^;\n]*)/.exec(s)?.[1]?.trim()||"",p=/TEL.*:(.+)/.exec(s)?.[1]?.trim(),d=/EMAIL.*:(.+)/.exec(s)?.[1]?.trim();a&&t.push({name:a,surname:r,phone:p||"",email:d||"",notes:{},tags:[]})}return t}function gt(e){return e.map(t=>`BEGIN:VCARD
VERSION:3.0
FN:${t.name}
N:${t.surname||""};;;;
TEL:${t.phone||""}
EMAIL:${t.email||""}
END:VCARD`).join(`
`)}function ft(e){const t=e.split(`
`).filter(Boolean),[n,...s]=t;return s.map(a=>{const[r,p,d,i,c,g]=a.split(",");return{name:r?.trim()||"",surname:p?.trim()||"",phone:d?.trim()||"",email:i?.trim()||"",notes:g?JSON.parse(g):{},tags:c?c.split(";").map(f=>f.trim()):[]}})}function ht(){const e=gt(o.contacts),t=new Blob([e],{type:"text/vcard"}),n=document.createElement("a");n.href=URL.createObjectURL(t),n.download="contactos.vcf",n.click()}function bt(){const e="name,surname,phone,email,tags,notes",t=o.contacts.map(r=>[r.name,r.surname,r.phone,r.email,(r.tags||[]).join(";"),JSON.stringify(r.notes||{})].map(p=>'"'+String(p).replace(/"/g,'""')+'"').join(",")),n=[e,...t].join(`
`),s=new Blob([n],{type:"text/csv"}),a=document.createElement("a");a.href=URL.createObjectURL(s),a.download="contactos.csv",a.click()}function yt(){const e=new Blob([JSON.stringify(o.contacts,null,2)],{type:"application/json"}),t=document.createElement("a");t.href=URL.createObjectURL(e),t.download="contactos.json",t.click()}function Oe(){console.log("🔄 Ejecutando backup automático diario...");const e=new Date,n=new Date(e.toLocaleString("en-US",{timeZone:"Europe/Madrid"})).toISOString().slice(0,10),s=localStorage.getItem("contactos_diarios");if(!s){console.log("⚠️ No hay contactos para hacer backup");return}try{const a=JSON.parse(s);if(!Array.isArray(a)||a.length===0){console.log("⚠️ Los datos de contactos están vacíos, saltando backup");return}let r=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]");r.find(p=>p.fecha===n)?console.log(`📅 Ya existe backup para ${n}`):(console.log(`💾 Creando backup para ${n} con ${a.length} contactos`),r.push({fecha:n,datos:a}),r.length>10&&(console.log(`🗂️ Limitando backups a los últimos 10 (había ${r.length})`),r=r.slice(-10)),localStorage.setItem("contactos_diarios_backups",JSON.stringify(r)),console.log(`✅ Backup diario creado exitosamente para ${n}`)),localStorage.setItem("contactos_diarios_backup_fecha",n)}catch(a){console.error("❌ Error en backup automático:",a)}}setInterval(Oe,60*60*1e3);Oe();function vt(){const e=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]"),t=document.getElementById("backup-info");t&&(e.length===0?t.textContent="Sin copias locales.":t.innerHTML="Últimas copias locales: "+e.map(n=>`<button class="restore-backup-btn" data-fecha="${n.fecha}">${n.fecha}</button>`).join(" "))}function xt(e){if(!confirm("¿Seguro que quieres restaurar la copia de seguridad del "+e+"? Se sobrescribirán los contactos actuales."))return;const n=JSON.parse(localStorage.getItem("contactos_diarios_backups")||"[]").find(s=>s.fecha===e);n?(o.contacts=n.datos,A(o.contacts),y(),alert("Backup restaurado correctamente.")):alert("No se encontró la copia seleccionada.")}function Be(e,t){const n=s=>s?s.toLowerCase().replace(/\s+/g," ").trim():"";return!!(n(e.name)===n(t.name)&&n(e.surname)===n(t.surname)||e.phone&&t.phone&&e.phone.replace(/\s+/g,"")===t.phone.replace(/\s+/g,"")||e.email&&t.email&&n(e.email)===n(t.email))}function wt(){const e=[],t=new Set;for(let n=0;n<o.contacts.length;n++){if(t.has(n))continue;const s=[{...o.contacts[n],originalIndex:n}];t.add(n);for(let a=n+1;a<o.contacts.length;a++)t.has(a)||Be(o.contacts[n],o.contacts[a])&&(s.push({...o.contacts[a],originalIndex:a}),t.add(a));s.length>1&&e.push({contacts:s})}return e}function Le(e){if(e.length===0)return null;if(e.length===1)return e[0];const t={name:"",surname:"",phone:"",email:"",tags:[],notes:{},pinned:!1};let n="",s="";e.forEach(r=>{r.name&&r.name.length>n.length&&(n=r.name),r.surname&&r.surname.length>s.length&&(s=r.surname)}),t.name=n,t.surname=s,t.phone=e.find(r=>r.phone)?.phone||"",t.email=e.find(r=>r.email)?.email||"";const a=new Set;return e.forEach(r=>{r.tags&&r.tags.forEach(p=>a.add(p))}),t.tags=Array.from(a),e.forEach((r,p)=>{r.notes&&Object.entries(r.notes).forEach(([d,i])=>{t.notes[d]?t.notes[d]+=`
--- Contacto ${p+1} ---
${i}`:t.notes[d]=i})}),t.pinned=e.some(r=>r.pinned),t}function Et(e){const t=Le(e);return`
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
  `}function St({duplicates:e,visible:t}){return!t||e.length===0?'<div id="duplicate-modal" class="modal" style="display:none"></div>':`
    <div id="duplicate-modal" class="modal" style="display:flex;z-index:5000;">
      <div class="modal-content" style="max-width:800px;max-height:90vh;overflow-y:auto;">
        <h3>🔍 Gestión de contactos duplicados</h3>
        <p>Se encontraron <strong>${e.length}</strong> grupo(s) de contactos duplicados. 
           Para cada grupo, elige cómo resolverlo:</p>
        
        ${e.map((n,s)=>`
          <div class="duplicate-group" style="border:1px solid #ddd;border-radius:8px;padding:15px;margin:15px 0;background:#fafafa;">
            <h4>Grupo ${s+1} - ${n.contacts.length} contactos similares</h4>
            
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
              ${Et(n.contacts)}
            </div>
            
            <!-- Sección de selección individual (oculta por defecto) -->
            <div class="individual-selection" id="individual-section-${s}" style="display:none;">
              <h5>Selecciona el contacto a mantener:</h5>
              ${n.contacts.map((a,r)=>`
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
  `}function kt(){const e=[];let t=0;if(o.duplicates.forEach((r,p)=>{const d=document.querySelector(`input[name="resolution-${p}"]:checked`),i=d?d.value:"skip";if(i==="merge")e.push({type:"merge",groupIndex:p,contacts:r.contacts}),t++;else if(i==="select"){const c=document.querySelector(`input[name="keep-${p}"]:checked`);if(c){const g=parseInt(c.value),f=r.contacts.filter(b=>b.originalIndex!==g).map(b=>b.originalIndex);e.push({type:"delete",groupIndex:p,toDelete:f,toKeep:g}),t++}}}),t===0){h("No hay operaciones que realizar","info");return}const n=e.filter(r=>r.type==="merge").length,s=e.filter(r=>r.type==="delete").length;let a=`¿Confirmar las siguientes operaciones?

`;if(n>0&&(a+=`🔗 Fusionar ${n} grupo(s) de contactos
`),s>0&&(a+=`🗑️ Eliminar duplicados en ${s} grupo(s)
`),a+=`
Esta acción no se puede deshacer.`,!confirm(a)){h("Operación cancelada","info");return}try{let r=0,p=0;const d=[];e.forEach(f=>{if(f.type==="merge"){const b=Le(f.contacts);o.contacts.push(b),f.contacts.forEach(E=>{d.push(E.originalIndex)}),r++}else f.type==="delete"&&(f.toDelete.forEach(b=>{d.push(b)}),p+=f.toDelete.length)}),[...new Set(d)].sort((f,b)=>b-f).forEach(f=>{f<o.contacts.length&&o.contacts.splice(f,1)}),A(o.contacts);let c="Resolución completada: ";const g=[];r>0&&g.push(`${r} contacto(s) fusionado(s)`),p>0&&g.push(`${p} duplicado(s) eliminado(s)`),c+=g.join(" y "),h(c,"success"),o.showDuplicateModal=!1,o.duplicates=[],y()}catch(r){h("Error al aplicar resolución: "+r.message,"error")}}const de="contactos_diarios_auth";let _={isAuthenticated:!1,sessionExpiry:null};function Re(e){let t=0;for(let n=0;n<e.length;n++){const s=e.charCodeAt(n);t=(t<<5)-t+s,t=t&t}return t.toString()}function $t(e){const t=Re(e);localStorage.setItem(de,t),h("Contraseña establecida correctamente","success")}function It(e){const t=localStorage.getItem(de);return t?Re(e)===t:!1}function ee(){return localStorage.getItem(de)!==null}function Nt(e){return It(e)?(_.isAuthenticated=!0,_.sessionExpiry=Date.now()+30*60*1e3,h("Autenticación exitosa","success"),setTimeout(()=>{Te()},100),!0):(h("Contraseña incorrecta","error"),!1)}function V(){return _.isAuthenticated?Date.now()>_.sessionExpiry?(_.isAuthenticated=!1,_.sessionExpiry=null,!1):!0:!1}function At(){_.isAuthenticated=!1,_.sessionExpiry=null,h("Sesión cerrada","info")}function Te(){if(!o.pendingAction)return;const e=o.pendingAction;switch(o.pendingAction=null,e.type){case"showAllNotes":o.showAllNotes=!0,o.allNotesPage=1;break;case"addNote":o.addNoteContactIndex=e.contactIndex,o.showAddNoteModal=!0;break;case"showContactNotes":o.selected=e.contactIndex,o.editing=null;break}y()}function Dt({visible:e,mode:t="login"}){return`
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
  `}async function Me(){console.log("🧹 Limpiando cache y forzando actualización...");try{if("caches"in window){const e=await caches.keys();await Promise.all(e.map(t=>(console.log("🗑️ Eliminando cache:",t),caches.delete(t))))}if("serviceWorker"in navigator){const e=await navigator.serviceWorker.getRegistrations();await Promise.all(e.map(t=>(console.log("🔄 Desregistrando SW:",t.scope),t.unregister())))}console.log("✅ Cache limpiado, recargando..."),window.location.reload()}catch(e){console.error("❌ Error limpiando cache:",e),window.location.reload()}}window.clearCacheAndReload=Me;document.addEventListener("keydown",e=>{e.ctrlKey&&e.shiftKey&&e.key==="R"&&(e.preventDefault(),Me())});async function Ct(){console.log("🔍 Obteniendo versión del Service Worker...");try{if("serviceWorker"in navigator&&navigator.serviceWorker.controller){console.log("📡 Intentando comunicación directa con SW...");const n=new MessageChannel,s=new Promise((r,p)=>{const d=setTimeout(()=>{p(new Error("Timeout en comunicación con SW"))},3e3);n.port1.onmessage=i=>{clearTimeout(d),i.data&&i.data.type==="VERSION_RESPONSE"?(console.log("✅ Versión recibida del SW:",i.data.version),r(i.data.version)):p(new Error("Respuesta inválida del SW"))}});return navigator.serviceWorker.controller.postMessage({type:"GET_VERSION"},[n.port2]),await s}console.log("📄 SW no disponible, intentando fetch...");const e=`${Date.now()}-${Math.random().toString(36).substr(2,9)}`,t=[`/sw.js?v=${e}`,`/ContactosDiarios/sw.js?v=${e}`,`./sw.js?v=${e}`];for(const n of t)try{console.log(`🌐 Intentando fetch: ${n}`);const s=await fetch(n,{cache:"no-cache",headers:{"Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0"}});if(s.ok){const a=await s.text();console.log("📄 Código SW obtenido, longitud:",a.length);const r=[/CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/const\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/let\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/var\s+CACHE_VERSION\s*=\s*['"`]([^'"`]+)['"`]/,/version['":]?\s*['"`]([0-9.]+)['"`]/i,/v?([0-9]+\.[0-9]+\.[0-9]+)/];for(const p of r){const d=a.match(p);if(d&&d[1])return console.log("✅ Versión encontrada:",d[1]),d[1]}console.log("⚠️ No se encontró versión en el código SW")}}catch(s){console.log(`❌ Error fetch ${n}:`,s.message)}return console.log("🔄 Usando versión fallback..."),"0.0.91"}catch(e){return console.error("❌ Error general obteniendo versión SW:",e),"0.0.91"}}async function U(){console.log("📋 Mostrando versión del Service Worker...");let e=document.getElementById("sw-version-info");e||(e=document.createElement("div"),e.id="sw-version-info",e.style.cssText=`
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
  `;try{const t=await Ct();e.innerHTML=`
      <p class="version-text">Service Worker v${t}</p>
    `,console.log("✅ Versión del SW mostrada:",t)}catch(t){console.error("❌ Error mostrando versión SW:",t),e.innerHTML=`
      <p class="version-text">Service Worker v0.0.87</p>
    `}}async function _t(){console.log("🚀 Inicializando aplicación...");const e=U(),t=new Promise(s=>setTimeout(()=>s("timeout"),5e3));if(await Promise.race([e,t])==="timeout"){console.log("⏰ Timeout obteniendo versión SW, usando fallback");let s=document.getElementById("sw-version-info");s&&(s.innerHTML=`
        <p class="version-text">Service Worker v0.0.91</p>
      `)}"serviceWorker"in navigator&&(navigator.serviceWorker.addEventListener("controllerchange",()=>{console.log("🔄 Service Worker actualizado, refrescando versión..."),setTimeout(()=>U(),500)}),navigator.serviceWorker.ready.then(()=>{console.log("✅ Service Worker listo, actualizando versión..."),setTimeout(()=>U(),2e3)}).catch(s=>{console.log("❌ Error esperando SW ready:",s)}),navigator.serviceWorker.addEventListener("message",s=>{s.data&&s.data.type==="SW_UPDATED"&&(console.log("📢 Service Worker actualizado a versión:",s.data.version),lt(s.data.version),U())}))}let Pe=0,T=!1;function Ot(){let e=null;window.addEventListener("scroll",()=>{T=!0,clearTimeout(e),e=setTimeout(()=>{T=!1},100)},{passive:!0}),document.addEventListener("touchstart",()=>{Pe=Date.now()},{passive:!0}),document.addEventListener("touchmove",()=>{T=!0},{passive:!0}),document.addEventListener("touchend",()=>{setTimeout(()=>{T=!1},100)},{passive:!0})}function z(e){if(e&&(e.classList.contains("add-note-contact")||e.classList.contains("edit-contact")||e.classList.contains("delete-contact")||e.classList.contains("pin-contact")||e.classList.contains("select-contact")))return!0;const t=Date.now()-Pe;return!T&&t>150}document.addEventListener("DOMContentLoaded",async()=>{try{console.log("=== 📱 INICIO DEBUG MÓVIL ==="),console.log("🌐 URL:",window.location.href),console.log("📱 User Agent:",navigator.userAgent),console.log("📊 Screen:",screen.width+"x"+screen.height),console.log("🖥️ Viewport:",window.innerWidth+"x"+window.innerHeight),console.log("🗂️ localStorage disponible:",!!window.localStorage),console.log("⚙️ Service Worker:","serviceWorker"in navigator),console.log("=================================");const e=document.getElementById("debug-trigger");e?(e.addEventListener("click",ce),console.log("🐛 Botón de debug configurado")):console.log("❌ No se encontró el botón de debug"),console.log("🔄 Iniciando migración de contactos..."),Bt(),console.log("✅ Migración completada");try{await $e()}catch(t){console.warn("Dropbox init:",t.message)}console.log("🎨 Iniciando render inicial..."),y(),console.log("✅ Render inicial completado"),console.log("⚙️ Inicializando app..."),_t(),console.log("✅ App inicializada"),se()&&setTimeout(async()=>{try{const t=await J(o.contacts);JSON.stringify(t.merged)!==JSON.stringify(o.contacts)&&(o.contacts=t.merged,A(o.contacts),y()),h("Dropbox sincronizado","success")}catch(t){console.warn("Auto-sync Dropbox:",t.message)}},800),console.log("💾 Mostrando info de backup..."),vt(),console.log("✅ Info backup mostrada"),console.log("📱 ContactosDiarios iniciado correctamente"),console.log("🆕 Nueva funcionalidad: Contactos recientemente editados"),console.log("💡 Usa Ctrl+Shift+R para limpiar cache y forzar actualización"),console.log("🔧 También disponible: window.clearCacheAndReload()")}catch(e){console.error("💥 ERROR CRÍTICO EN INICIALIZACIÓN:",e),console.error("Stack trace:",e.stack);const t=document.querySelector("#app");t&&(t.innerHTML=`
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
      `)}});function Bt(){let e=!1;const t=Date.now();o.contacts.forEach((n,s)=>{n.lastEdited||(n.lastEdited=n.createdAt||t-(o.contacts.length-s)*1e3*60*60,e=!0),n.createdAt||(n.createdAt=n.lastEdited,e=!0)}),e&&A(o.contacts)}async function Lt(){try{const e={timestamp:new Date().toISOString(),url:window.location.href,userAgent:navigator.userAgent,screen:`${screen.width}x${screen.height}`,viewport:`${window.innerWidth}x${window.innerHeight}`,localStorage:!!window.localStorage,serviceWorker:"serviceWorker"in navigator,logs:B},t=`=== 📱 DEBUG MÓVIL EXPORT ===
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
=== FIN DEBUG ===`;if(navigator.clipboard&&navigator.clipboard.writeText)await navigator.clipboard.writeText(t),C("✅ Debug copiado al portapapeles"),W("📋 Debug copiado al portapapeles");else{const n=document.createElement("textarea");n.value=t,n.style.position="fixed",n.style.top="0",n.style.left="0",n.style.width="2em",n.style.height="2em",n.style.padding="0",n.style.border="none",n.style.outline="none",n.style.boxShadow="none",n.style.background="transparent",document.body.appendChild(n),n.focus(),n.select();try{if(document.execCommand("copy"))C("✅ Debug copiado al portapapeles (fallback)"),W("📋 Debug copiado (selecciona y copia manualmente si no funcionó)");else throw new Error("execCommand failed")}catch(s){C("❌ Error copiando al portapapeles:",s),W("❌ Error copiando. Selecciona todo el texto manualmente")}document.body.removeChild(n)}}catch(e){C("❌ Error en copyMobileLogsToClipboard:",e),W("❌ Error copiando logs")}}function W(e){const t=document.createElement("div");t.style.cssText=`
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
