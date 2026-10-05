// API do back — fonte única de dados.
// Resolução da base: ?api=<url> (salva no navegador) > window.__API_BASE__ (config.js, gravado no deploy)
//   > localhost rápido (sala) > Render (produção).
// Back: GET /api/products, GET /api/products/:id, POST /api/checkout, GET /api/feed
const RENDER_URL = 'https://encontrabilidade-backend.onrender.com';
const LOCAL_URL = 'http://localhost:3001';

const _forced = new URLSearchParams(location.search).get('api');
if (_forced) localStorage.setItem('api_base', _forced.replace(/\/$/, ''));

let _base = null;

async function alive(url, ms) {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), ms);
    const res = await fetch(`${url}/health`, { signal: ctl.signal });
    clearTimeout(t);
    return res.ok;
  } catch {
    return false;
  }
}

async function base() {
  if (_base) return _base;
  if (window.__API_BASE__) {
    _base = window.__API_BASE__.replace(/\/$/, '');
    return _base;
  }
  const forced = localStorage.getItem('api_base');
  if (forced) {
    _base = forced;
    return forced;
  }
  _base = (await alive(LOCAL_URL, 1500)) ? LOCAL_URL : RENDER_URL;
  return _base;
}

async function apiFetch(path, opts) {
  const b = await base();
  let res;
  try {
    res = await fetch(`${b}${path}`, opts);
  } catch {
    _base = null; // libera nova resolução na próxima chamada
    throw new Error(`back offline (${b}) — suba o back local com npm start (:3001) ou aqueça o Render`);
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `API ${res.status} em ${path}`);
  }
  return res.json();
}

export async function loadProducts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const items = await apiFetch(`/api/products${qs ? '?' + qs : ''}`);
  return { items, source: 'api' };
}

export async function getProduct(id) {
  const item = await apiFetch(`/api/products/${encodeURIComponent(id)}`);
  return { item, source: 'api' };
}

// items: {id: qty} -> {order_id, total} ou {error}
export async function checkout(items) {
  const data = await apiFetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  return { ...data, source: 'api' };
}

export async function loadFeed() {
  return apiFetch('/api/feed');
}
