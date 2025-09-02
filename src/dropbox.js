// Minimal Dropbox PKCE client and sync helpers for ContactosDiarios
// This module works entirely in the browser (no secrets required).

const AUTH_STORAGE_KEY = 'contactos_diarios_dropbox_auth';
const STATE_STORAGE_KEY = 'contactos_diarios_dropbox_state';
const SETTINGS_STORAGE_KEY = 'contactos_diarios_dropbox_settings';

// Default path inside the Dropbox App folder
const DEFAULT_REMOTE_PATH = '/contactos_diarios.json';

function getSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY)) || {}; } catch { return {}; }
}
function setSettings(patch) {
  const cur = getSettings();
  const next = { ...cur, ...patch };
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
  return next;
}

function getAppKey() {
  // Priority: local settings -> Vite env -> global window var
  const settings = getSettings();
  return (
    settings.appKey ||
    (import.meta?.env?.VITE_DROPBOX_APP_KEY) ||
    (typeof window !== 'undefined' ? window.DROPBOX_APP_KEY : undefined)
  );
}

function getRemotePath() {
  const settings = getSettings();
  return settings.remotePath || DEFAULT_REMOTE_PATH;
}

function baseUrl() {
  // import.meta.env.BASE_URL is defined by Vite; fallback to '/'
  const base = (import.meta?.env?.BASE_URL) || '/';
  try {
    const url = new URL(base, location.origin);
    return url.toString();
  } catch {
    return location.origin + base;
  }
}

function redirectUri() {
  // Priority: user-configured -> env -> baseUrl
  const settings = getSettings();
  if (settings.redirectUri) return settings.redirectUri;
  const envUri = (import.meta?.env?.VITE_DROPBOX_REDIRECT_URI);
  if (envUri) return envUri;
  // Use app base as redirect target
  // Example: https://user.github.io/ContactosDiarios/
  return baseUrl();
}

function getAuth() {
  try { return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)) || null; } catch { return null; }
}
function setAuth(auth) {
  if (auth) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  else localStorage.removeItem(AUTH_STORAGE_KEY);
}
function getState() {
  try { return JSON.parse(localStorage.getItem(STATE_STORAGE_KEY)) || {}; } catch { return {}; }
}
function setState(patch) {
  const cur = getState();
  const next = { ...cur, ...patch };
  localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(next));
  return next;
}

function isConnected() {
  const auth = getAuth();
  return !!(auth && (auth.refresh_token || auth.access_token));
}

// Simple 32-bit hash to detect changes without heavy deps
function hashString(str) {
  let h = 2166136261 >>> 0; // FNV-1a
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

async function sha256Base64Url(input) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  let b64 = btoa(String.fromCharCode.apply(null, bytes));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function randomString(len = 64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let out = '';
  const array = new Uint8Array(len);
  crypto.getRandomValues(array);
  for (let i = 0; i < len; i++) out += chars[array[i] % chars.length];
  return out;
}

// PKCE OAuth
async function beginAuth() {
  const appKey = getAppKey();
  if (!appKey) throw new Error('Falta configurar Dropbox App Key');

  const codeVerifier = randomString(64);
  const codeChallenge = await sha256Base64Url(codeVerifier);
  const state = randomString(16);

  sessionStorage.setItem('dropbox_code_verifier', codeVerifier);
  sessionStorage.setItem('dropbox_oauth_state', state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: appKey,
    redirect_uri: redirectUri(),
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    token_access_type: 'offline', // so we get refresh_token
    state,
  });
  const url = `https://www.dropbox.com/oauth2/authorize?${params.toString()}`;
  location.assign(url);
}

async function exchangeCodeForToken(code) {
  const appKey = getAppKey();
  const codeVerifier = sessionStorage.getItem('dropbox_code_verifier');
  if (!appKey || !codeVerifier) throw new Error('Auth contexto incompleto');

  const form = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: appKey,
    redirect_uri: redirectUri(),
    code_verifier: codeVerifier,
  });

  const resp = await fetch('https://api.dropboxapi.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  });
  if (!resp.ok) {
    throw new Error(`Token exchange failed: ${resp.status} ${await resp.text()}`);
  }
  const data = await resp.json();
  // data: access_token, token_type, expires_in, refresh_token, scope, account_id, uid
  const auth = {
    access_token: data.access_token,
    refresh_token: data.refresh_token, // may be undefined if not requested
    expires_at: Date.now() + (data.expires_in ? data.expires_in * 1000 : 3600 * 1000) - 30000,
    account_id: data.account_id,
    uid: data.uid,
    scope: data.scope,
  };
  setAuth(auth);
  sessionStorage.removeItem('dropbox_code_verifier');
  sessionStorage.removeItem('dropbox_oauth_state');
  return auth;
}

async function refreshAccessToken() {
  const appKey = getAppKey();
  const auth = getAuth();
  if (!appKey || !auth?.refresh_token) return null;

  const form = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: auth.refresh_token,
    client_id: appKey,
  });
  const resp = await fetch('https://api.dropboxapi.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  });
  if (!resp.ok) throw new Error(`Refresh failed: ${resp.status} ${await resp.text()}`);
  const data = await resp.json();
  const next = {
    ...auth,
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in ? data.expires_in * 1000 : 3600 * 1000) - 30000,
    scope: data.scope || auth.scope,
  };
  setAuth(next);
  return next;
}

async function getAccessToken() {
  let auth = getAuth();
  if (!auth) return null;
  if (!auth.expires_at || Date.now() > auth.expires_at) {
    auth = await refreshAccessToken();
  }
  return auth?.access_token || null;
}

async function handleRedirectIfNeeded() {
  const url = new URL(location.href);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const savedState = sessionStorage.getItem('dropbox_oauth_state');
  if (code) {
    if (savedState && state !== savedState) {
      // State mismatch; abort
      console.warn('Dropbox OAuth state mismatch');
    } else {
      await exchangeCodeForToken(code);
      setState({ lastAuthAt: Date.now() });
    }
    // Clean query params
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    history.replaceState({}, '', url.toString());
  }
}

// Dropbox Content/Files helpers
async function dbxFetch(url, options = {}) {
  const token = await getAccessToken();
  if (!token) throw new Error('No autorizado con Dropbox');
  const headers = Object.assign({}, options.headers || {}, { Authorization: `Bearer ${token}` });
  const resp = await fetch(url, { ...options, headers });
  return resp;
}

async function ensureAppFolder() {
  // Not strictly necessary for simple file in app folder; no-op
  return true;
}

async function downloadFile(path = getRemotePath()) {
  const resp = await dbxFetch('https://content.dropboxapi.com/2/files/download', {
    method: 'POST',
    headers: {
      'Dropbox-API-Arg': JSON.stringify({ path }),
    },
  });
  if (resp.status === 409) return { exists: false };
  if (!resp.ok) throw new Error(`Download failed: ${resp.status}`);
  // Metadata is in header 'Dropbox-API-Result'
  const metaHeader = resp.headers.get('Dropbox-API-Result');
  const meta = metaHeader ? JSON.parse(metaHeader) : {};
  const text = await resp.text();
  return { exists: true, text, meta };
}

async function uploadFile(contents, rev = undefined, path = getRemotePath()) {
  const arg = {
    path,
    mode: rev ? { '.tag': 'update', update: rev } : 'overwrite',
    autorename: false,
    mute: false,
    strict_conflict: false,
  };
  const resp = await dbxFetch('https://content.dropboxapi.com/2/files/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify(arg),
    },
    body: contents,
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Upload failed: ${resp.status} ${text}`);
  }
  const meta = await resp.json();
  return meta; // contains .rev
}

// Merge strategy: by name+surname identity; keep most recent lastEdited; union tags; union notes by date
function mergeContacts(localContacts, remoteContacts) {
  const key = (c) => `${(c.name||'').trim().toLowerCase()}|${(c.surname||'').trim().toLowerCase()}`;
  const map = new Map();
  const add = (c) => {
    const k = key(c);
    if (!map.has(k)) { map.set(k, JSON.parse(JSON.stringify(c))); return; }
    const cur = map.get(k);
    const aTime = Number(cur.lastEdited) || 0;
    const bTime = Number(c.lastEdited) || 0;
    // Pick most recently edited fields
    if (bTime > aTime) {
      cur.name = c.name || cur.name;
      cur.surname = c.surname || cur.surname;
      cur.phone = c.phone || cur.phone;
      cur.email = c.email || cur.email;
    }
    // pinned if any true
    cur.pinned = !!(cur.pinned || c.pinned);
    // tags union
    const tags = new Set([...(cur.tags||[]), ...(c.tags||[])]);
    cur.tags = Array.from(tags);
    // notes union by date; if same date, prefer newer lastEdited owner
    cur.notes = cur.notes || {};
    const dates = Object.keys(c.notes || {});
    for (const d of dates) {
      if (!(d in cur.notes)) cur.notes[d] = c.notes[d];
      else if (bTime >= aTime) cur.notes[d] = c.notes[d];
    }
    // lastEdited max
    cur.lastEdited = Math.max(aTime, bTime);
  };
  (localContacts||[]).forEach(add);
  (remoteContacts||[]).forEach(add);
  return Array.from(map.values());
}

function stableStringify(obj) {
  // Deterministic stringify to avoid spurious hash changes
  return JSON.stringify(obj, Object.keys(obj).sort());
}

// Public API
export async function initDropbox() {
  await handleRedirectIfNeeded();
}

export function isDropboxConfigured() {
  return !!getAppKey();
}

export function isDropboxConnected() {
  return isConnected();
}

export function getDropboxState() {
  const s = getState();
  return {
    lastSync: s.lastSync || null,
    lastRev: s.lastRev || null,
    lastHash: s.lastHash || null,
    remotePath: getRemotePath(),
    appKeyPresent: !!getAppKey(),
  };
}

export function saveDropboxSettings({ appKey, remotePath, redirectUri: ruri } = {}) {
  const patch = {};
  if (appKey !== undefined) patch.appKey = appKey.trim();
  if (remotePath !== undefined) patch.remotePath = remotePath.trim() || DEFAULT_REMOTE_PATH;
  if (ruri !== undefined) patch.redirectUri = ruri.trim();
  return setSettings(patch);
}

export async function connectDropbox() {
  await beginAuth();
}

export function disconnectDropbox() {
  setAuth(null);
  setState({ lastRev: null, lastSync: null });
}

export async function revokeDropboxToken() {
  const token = await getAccessToken();
  if (!token) { disconnectDropbox(); return; }
  try {
    const resp = await fetch('https://api.dropboxapi.com/2/auth/token/revoke', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    // 200 on success; ignore body
    if (!resp.ok) throw new Error(`Revocar falló: ${resp.status}`);
  } catch (e) {
    // Log but still clear local session
    console.warn('Dropbox revoke error:', e.message);
  } finally {
    disconnectDropbox();
  }
}

export async function downloadDropboxContacts() {
  const res = await downloadFile();
  if (!res.exists) return { contacts: null, rev: null };
  try {
    const parsed = JSON.parse(res.text);
    // Accept both {contacts: []} and [] forms
    const contacts = Array.isArray(parsed) ? parsed : (parsed.contacts || []);
    return { contacts, rev: res.meta?.rev || null };
  } catch (e) {
    throw new Error('Contenido remoto inválido');
  }
}

export async function uploadDropboxContacts(contacts) {
  const state = getState();
  const body = JSON.stringify({ contacts }, null, 2);
  const meta = await uploadFile(body, state.lastRev || undefined);
  setState({ lastRev: meta.rev, lastSync: Date.now(), lastHash: hashString(body) });
  return meta;
}

export async function syncDropbox(localContacts) {
  await ensureAppFolder();
  const remote = await downloadDropboxContacts().catch(e => {
    // If not found or other error, treat as no remote
    return { contacts: null, rev: null };
  });
  if (!remote.contacts) {
    // Nothing remote: just upload local
    const meta = await uploadDropboxContacts(localContacts || []);
    return { merged: localContacts || [], uploaded: true, rev: meta.rev };
  }
  const merged = mergeContacts(localContacts || [], remote.contacts || []);
  const body = JSON.stringify({ contacts: merged }, null, 2);
  try {
    const meta = await uploadFile(body, remote.rev || undefined);
    setState({ lastRev: meta.rev, lastSync: Date.now(), lastHash: hashString(body) });
    return { merged, uploaded: true, rev: meta.rev };
  } catch (e) {
    // On conflict or error, fallback to overwrite
    const meta = await uploadFile(body, undefined);
    setState({ lastRev: meta.rev, lastSync: Date.now(), lastHash: hashString(body) });
    return { merged, uploaded: true, rev: meta.rev };
  }
}

let uploadTimer = null;
export function scheduleAutoUpload(localContacts, delayMs = 2000) {
  if (!isConnected()) return; // only when connected
  clearTimeout(uploadTimer);
  uploadTimer = setTimeout(async () => {
    try { await syncDropbox(localContacts || []); } catch (e) { console.warn('Dropbox autosync error:', e.message); }
  }, delayMs);
}

export const __test = { mergeContacts, hashString, stableStringify };
