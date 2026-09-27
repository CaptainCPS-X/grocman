// Prueba de humo de la API y el login. Sin dependencias: Node 18+ y PHP en el PATH.
//   node tests/smoke.mjs
// Copia src/ a una carpeta temporal con datos de ejemplo y una contraseña de
// prueba, levanta `php -S` y ejercita la API. Nunca toca src/data/items.json.
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');
// realpath: en Windows tmpdir() puede ser una ruta corta (ADMINI~1).
const TMP = fs.realpathSync.native(fs.mkdtempSync(path.join(os.tmpdir(), 'grocman-smoke-')));
const WEB = path.join(TMP, 'web');
const DATA_DIR = path.join(WEB, 'data');
const DATA = path.join(DATA_DIR, 'items.json');
const SESS = path.join(DATA_DIR, 'sessions');
const PORT = 8290 + Math.floor(Math.random() * 100);
const BASE = `http://127.0.0.1:${PORT}`;
const PASSWORD = 'smoke-test';

// --- Preparar copia aislada ---
fs.mkdirSync(DATA_DIR, { recursive: true });
for (const f of fs.readdirSync(SRC)) {
    if (/\.(php|js|css)$/.test(f) && !['auth.php', 'auth.sample.php'].includes(f)) fs.copyFileSync(path.join(SRC, f), path.join(WEB, f));
}
fs.copyFileSync(path.join(SRC, 'data', 'items.sample.json'), DATA);
const hash = execFileSync('php', ['-r', `echo password_hash('${PASSWORD}', PASSWORD_DEFAULT);`]).toString();
fs.writeFileSync(path.join(WEB, 'auth.php'), `<?php $stored_hash = '${hash}';`);

const server = spawn('php', ['-S', `127.0.0.1:${PORT}`, '-t', WEB], { stdio: 'ignore' });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// --- Mini cliente HTTP con cookies ---
const jar = {};
const cookieHeader = () => Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; ');
const clearJar = () => { for (const k in jar) delete jar[k]; };
const request = async (url, opts = {}) => {
    const headers = { ...(opts.headers || {}) };
    if (!opts.noCookies && Object.keys(jar).length) headers.Cookie = cookieHeader();
    const res = await fetch(BASE + url, { redirect: 'manual', ...opts, headers });
    const setCookies = res.headers.getSetCookie();
    for (const c of setCookies) { const [kv] = c.split(';'); const [k, v] = kv.split('='); if (v === 'deleted' || v === '') delete jar[k.trim()]; else jar[k.trim()] = v; }
    const text = await res.text();
    let json = null; try { json = JSON.parse(text); } catch { }
    return { status: res.status, text, json, setCookies };
};
const form = (body) => request('/index.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
const login = (password) => form(`password=${encodeURIComponent(password)}`);
const post = (body, contentType = 'application/json') => request('/api.php', { method: 'POST', headers: { 'Content-Type': contentType }, body: typeof body === 'string' ? body : JSON.stringify(body) });
const readData = () => JSON.parse(fs.readFileSync(DATA, 'utf8'));
const sessFile = () => path.join(SESS, `sess_${jar.GROCMANSESS}`);

let failed = 0, passed = 0;
const check = (name, cond, detail = '') => {
    if (cond) { passed++; console.log(`  ok   ${name}`); }
    else { failed++; console.log(`  FAIL ${name}${detail ? ' — ' + detail : ''}`); }
};

try {
    for (let i = 0; i < 50; i++) { try { await fetch(BASE + '/index.php'); break; } catch { await sleep(100); } }

    console.log('Sesión y login');
    check('API sin sesión → 401', (await request('/api.php')).status === 401);
    clearJar();
    const pre = await request('/index.php');
    const cookie = pre.setCookies.find(c => c.startsWith('GROCMANSESS=')) || '';
    check('cookie GROCMANSESS HttpOnly + SameSite=Lax', /HttpOnly/i.test(cookie) && /SameSite=Lax/i.test(cookie), cookie);
    const preId = jar.GROCMANSESS;
    check('contraseña incorrecta no entra', (await login('mala')).status === 200 && (await request('/api.php')).status === 401);
    check('login correcto → 302', (await login(PASSWORD)).status === 302);
    check('login regenera el id de sesión', jar.GROCMANSESS && jar.GROCMANSESS !== preId);
    check('API con sesión → 200', (await request('/api.php')).status === 200);
    check('sesiones en data/sessions (no en el directorio compartido)', fs.existsSync(sessFile()));
    const act0 = fs.readFileSync(sessFile(), 'utf8').match(/last_activity\|i:(\d+)/)?.[1];
    fs.writeFileSync(sessFile(), fs.readFileSync(sessFile(), 'utf8').replace(/last_activity\|i:\d+/, 'last_activity|i:1000'));
    await request('/api.php?poll=1');
    check('el poll no cuenta como uso (no renueva last_activity)... y 7 días sin uso caducan', (await request('/api.php')).status === 401, act0);
    await login(PASSWORD);
    await request('/api.php?poll=1');
    const act1 = +fs.readFileSync(sessFile(), 'utf8').match(/last_activity\|i:(\d+)/)[1];
    check('una sesión activa sigue viva con el poll', (await request('/api.php?poll=1')).status === 200 && act1 > 1000);
    check('logout por GET ya no cierra la sesión', (await request('/index.php?logout')).status === 200 && (await request('/api.php')).status === 200);

    console.log('Validación de la API');
    const v = () => readData().version;
    const item = (o = {}) => ({ name: 'Leche', category: 'Lácteos/Huevos', status: 'needed', note: '', price: 0, ...o });
    check('POST sin Content-Type JSON → 415', (await post(JSON.stringify({ version: v(), items: [] }), 'text/plain')).status === 415);
    check('POST sin versión → 400', (await post({ items: [] })).status === 400);
    check('PUT → 405', (await request('/api.php', { method: 'PUT' })).status === 405);
    const before = fs.readFileSync(DATA, 'utf8');
    for (const [label, items] of [
        ['items no es lista', { a: 1 }],
        ['nombre vacío', [item({ name: '  ' })]],
        ['nombres duplicados', [item(), item({ name: 'leche' })]],
        ['precio negativo', [item({ price: -1 })]],
        ['precio no numérico', [item({ price: 'abc' })]],
    ]) check(`POST ${label} → 400`, (await post({ version: v(), items })).status === 400);
    check('POST inválido no modifica la base', fs.readFileSync(DATA, 'utf8') === before);

    console.log('Guardado');
    const save = await post({ version: v(), items: [item({ name: ' Pan ', category: 'Inventada', status: 'raro', price: '2.505', extra: 'x' })] });
    check('POST válido → 200', save.status === 200, save.text);
    const it = readData().items[0];
    check('normaliza: nombre recortado, categoría → Otros, estado → needed, precio número', it.name === 'Pan' && it.category === 'Otros' && it.status === 'needed' && it.price === 2.51 && !('extra' in it), JSON.stringify(it));
    check('la respuesta trae la lista guardada', Array.isArray(save.json?.items) && save.json.items[0].name === 'Pan');
    const conflict = await post({ version: v() - 1, items: [] });
    check('versión vieja → 409 con la lista más reciente', conflict.status === 409 && conflict.json?.latest?.items?.[0]?.name === 'Pan');
    check('backup diario creado', fs.existsSync(path.join(DATA_DIR, 'backups')) && fs.readdirSync(path.join(DATA_DIR, 'backups')).length === 1);
    check('no quedan temporales', !fs.existsSync(DATA + '.tmp'));

    console.log('Guardados simultáneos (misma versión)');
    const base = v();
    const results = await Promise.all([1, 2, 3, 4].map(n => post({ version: base, items: [item({ name: `Cosa ${n}` })] })));
    const codes = results.map(r => r.status).sort().join(',');
    check('misma versión: solo uno gana, los demás reciben 409', codes === '200,409,409,409', codes);

    console.log('Base de datos corrupta');
    const good = fs.readFileSync(DATA);
    fs.writeFileSync(DATA, '{"version": 3, "ite');
    check('GET con base corrupta → 500', (await request('/api.php')).status === 500);
    check('POST con base corrupta → 500', (await post({ version: 3, items: [] })).status === 500);
    check('base corrupta no se sobrescribe', fs.readFileSync(DATA, 'utf8') === '{"version": 3, "ite');
    fs.writeFileSync(DATA, good);

    console.log('Logout y límite de intentos');
    const out = await form('logout=1');
    check('logout por POST → 302 y cierra la sesión', out.status === 302 && (await request('/api.php')).status === 401);
    clearJar();
    for (let i = 0; i < 5; i++) await login('mala');
    const locked = await login(PASSWORD);
    check('tras 5 fallos, ni la contraseña correcta entra', locked.status === 200 && /Demasiados intentos/.test(locked.text));
} finally {
    server.kill();
    await sleep(200);
    fs.rmSync(TMP, { recursive: true, force: true });
}

console.log(`\n${passed} ok, ${failed} fallos`);
process.exit(failed ? 1 : 0);
