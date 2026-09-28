// Prueba de humo de la API y el login. Sin dependencias: Node 18+ y PHP en el PATH.
//   node tests/smoke.mjs
// Copia src/ a una carpeta temporal con datos de ejemplo y una contraseña de
// prueba, levanta `php -S` y ejercita la API. Nunca toca src/data/items.json.
import { spawn, execFileSync } from 'node:child_process';
import http from 'node:http';
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

// --- UPCitemdb falso (la API real no se consulta en las pruebas) ---
const PNG_1PX = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
const UPC_PORT = PORT + 1000;
const UPC = `http://127.0.0.1:${UPC_PORT}`;
const upcCalls = {};
const upcServer = http.createServer((req, res) => {
    const url = new URL(req.url, UPC);
    const json = (status, body) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
    if (url.pathname === '/lookup') {
        const upc = url.searchParams.get('upc');
        upcCalls[upc] = (upcCalls[upc] || 0) + 1;
        if (upc === '0037000222057') return json(200, { code: 'OK', total: 1, items: [{ ean: upc, title: 'Dawn  Liquid Dish Soap  Original Scent', brand: 'Dawn', category: 'Home & Garden > Household Supplies > Household Cleaning Supplies', images: [`${UPC}/redir`, 'ftp://no-valida/x.jpg'] }] });
        if (upc === '0011111396487') return json(200, { code: 'OK', total: 1, items: [{ ean: upc, title: 'Dove Body Wash', brand: 'Dove', category: 'Health & Beauty > Personal Care > Bath & Body', images: [] }] });
        if (upc === '0078742351865') return json(429, { code: 'TOO_FAST', message: 'slow down' });
        return json(200, { code: 'OK', total: 0, items: [] });
    }
    if (url.pathname === '/redir') { res.writeHead(302, { Location: `${UPC}/img.png` }); return res.end(); }
    if (url.pathname === '/img.png') { res.writeHead(200, { 'Content-Type': 'image/png' }); return res.end(Buffer.from(PNG_1PX.split(',')[1], 'base64')); }
    res.writeHead(404); res.end();
}).listen(UPC_PORT, '127.0.0.1');

// curl hace falta para la búsqueda de productos (en DreamHost ya viene cargado).
const phpArgs = (port) => ['-d', 'extension=curl', '-S', `127.0.0.1:${port}`, '-t', WEB];
const server = spawn('php', phpArgs(PORT), { stdio: 'ignore', env: { ...process.env, GROCMAN_UPC_URL: `${UPC}/lookup`, GROCMAN_ALLOW_PRIVATE_IMAGES: '1' } });
// Segundo servidor SIN permiso de pruebas: el proxy de fotos debe bloquear direcciones internas.
const PORT2 = PORT + 500;
const server2 = spawn('php', phpArgs(PORT2), { stdio: 'ignore', env: { ...process.env, GROCMAN_UPC_URL: `${UPC}/lookup`, GROCMAN_ALLOW_PRIVATE_IMAGES: '' } });
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

    console.log('Productos (códigos de barras)');
    const bc = (code, label = '') => ({ code, label });
    const withCodes = await post({ version: v(), items: [item({ name: 'Leche', barcodes: [bc('742365264450', 'Horizon Organic · Organic Whole Milk · 1.85 l'), bc('00078742351865')] })] });
    const saved = readData().items[0].barcodes || [];
    check('guardar productos → 200', withCodes.status === 200, withCodes.text);
    check('UPC-A de 12 dígitos se guarda como EAN-13 (0 delante)', saved[0]?.code === '0742365264450' && saved[0]?.label.startsWith('Horizon'), JSON.stringify(saved));
    check('GTIN-14 con 0 delante se guarda como EAN-13', saved[1]?.code === '0078742351865', JSON.stringify(saved));
    check('dígito de control incorrecto → 400', (await post({ version: v(), items: [item({ barcodes: [bc('0742365264451')] })] })).status === 400);
    check('código no numérico → 400', (await post({ version: v(), items: [item({ barcodes: [bc('abc123')] })] })).status === 400);
    check('mismo código en dos artículos → 400', (await post({ version: v(), items: [item({ barcodes: [bc('0742365264450')] }), item({ name: 'Otra leche', barcodes: [bc('742365264450')] })] })).status === 400);
    check('etiqueta demasiado larga → 400', (await post({ version: v(), items: [item({ barcodes: [bc('0742365264450', 'x'.repeat(900))] })] })).status === 400);
    await post({ version: v(), items: [item({ name: 'Leche', barcodes: [] })] });
    check('lista de productos vacía no se guarda como campo', !('barcodes' in readData().items[0]));

    console.log('Imágenes de los artículos');
    const ICONS = path.join(DATA_DIR, 'icons');
    const up = await post({ iconUpload: PNG_1PX });
    const iconId = up.json?.icon;
    check('subir PNG → 200 con id', up.status === 200 && /^[a-f0-9]{16}$/.test(iconId || ''), up.text);
    const img = await fetch(`${BASE}/api.php?icon=${iconId}`, { headers: { Cookie: cookieHeader() } });
    check('servir imagen → 200 image/png + nosniff', img.status === 200 && img.headers.get('content-type') === 'image/png' && img.headers.get('x-content-type-options') === 'nosniff');
    check('imagen sin sesión → 401', (await fetch(`${BASE}/api.php?icon=${iconId}`)).status === 401);
    check('id malicioso (../) → 400', (await request(`/api.php?icon=${encodeURIComponent('../items')}`)).status === 400);
    check('texto disfrazado de PNG → 400', (await post({ iconUpload: 'data:image/png;base64,' + Buffer.from('<script>').toString('base64') })).status === 400);
    check('SVG → 400', (await post({ iconUpload: 'data:image/svg+xml;base64,' + Buffer.from('<svg/>').toString('base64') })).status === 400);
    await post({ version: v(), items: [item({ name: 'Leche', icon: iconId }), item({ name: 'Pan', icon: 'ffffffffffffffff' })] });
    check('el artículo guarda su imagen; un id inexistente se descarta', readData().items[0].icon === iconId && !('icon' in readData().items[1]));
    const orphan = (await post({ iconUpload: PNG_1PX })).json.icon;
    const old = new Date(Date.now() - 2 * 3600 * 1000);
    for (const idx of [iconId, orphan]) fs.utimesSync(path.join(ICONS, `${idx}.png`), old, old);
    await post({ version: v(), items: [item({ name: 'Leche', icon: iconId })] });
    check('al guardar se borran las imágenes huérfanas (>1h) y se conserva la usada', !fs.existsSync(path.join(ICONS, `${orphan}.png`)) && fs.existsSync(path.join(ICONS, `${iconId}.png`)));

    console.log('Imagen grande (vista previa)');
    const JPEG = 'data:image/jpeg;base64,' + execFileSync('php', ['-d', 'extension=gd', '-r', '$i = imagecreatetruecolor(300, 200); ob_start(); imagejpeg($i); echo base64_encode(ob_get_clean());']).toString();
    const both = await post({ iconUpload: PNG_1PX, iconLarge: JPEG });
    const bothId = both.json?.icon;
    check('subir miniatura + versión grande → 200', both.status === 200 && fs.existsSync(path.join(ICONS, `${bothId}.png`)) && fs.existsSync(path.join(ICONS, `${bothId}-l.jpg`)), both.text);
    const big = await fetch(`${BASE}/api.php?icon=${bothId}&size=l`, { headers: { Cookie: cookieHeader() } });
    check('servir versión grande → image/jpeg', big.status === 200 && big.headers.get('content-type') === 'image/jpeg');
    check('versión grande que no es JPEG → 400', (await post({ iconUpload: PNG_1PX, iconLarge: PNG_1PX.replace('image/png', 'image/jpeg') })).status === 400);
    for (const f of [`${bothId}.png`, `${bothId}-l.jpg`]) fs.utimesSync(path.join(ICONS, f), old, old);
    await post({ version: v(), items: [item({ name: 'Leche', icon: iconId })] });
    check('las huérfanas se borran en los dos tamaños', !fs.existsSync(path.join(ICONS, `${bothId}.png`)) && !fs.existsSync(path.join(ICONS, `${bothId}-l.jpg`)));

    console.log('Categorías, libros y canasta');
    await post({ version: v(), items: [item({ name: 'A', category: 'Proteínas' }), item({ name: 'B', category: 'Higiene' }), item({ name: 'C', category: 'Congelados' })] });
    let cats = readData().items.map(i => i.category);
    check('categorías antiguas se traducen (Proteínas → Carnes y Mariscos, Higiene → Cuidado Personal)', cats[0] === 'Carnes y Mariscos' && cats[1] === 'Cuidado Personal' && cats[2] === 'Congelados', JSON.stringify(cats));
    const raw = JSON.parse(fs.readFileSync(DATA, 'utf8'));
    raw.items[0].category = 'Lácteos/Huevos'; fs.writeFileSync(DATA, JSON.stringify(raw));
    check('al leer, una categoría antigua guardada llega traducida', (await request('/api.php')).json?.items?.[0]?.category === 'Lácteos y Huevos');
    await post({ version: v(), items: [item({ name: 'Mr. Fox', list: 'books', category: 'Despensa', status: 'needed', basket: true, level: 50, book: { authors: ['Roald Dahl', ''], year: 1988, pages: '96', publisher: 'Puffin', extra: 'x' } })] });
    const bk = readData().items[0];
    check('libro: categoría Libros, sin canasta ni nivel, datos limpios', bk.list === 'books' && bk.category === 'Libros' && !('basket' in bk) && !('level' in bk) && JSON.stringify(bk.book) === '{"authors":["Roald Dahl"],"year":"1988","pages":96,"publisher":"Puffin"}', JSON.stringify(bk));
    await post({ version: v(), items: [item({ name: 'X', basket: true }), item({ name: 'Y', status: 'stocked', basket: true }), item({ name: 'Z', status: 'in_cart', basket: true })] });
    const bs = readData().items.map(i => [i.name, i.status, !!i.basket]);
    check('canasta solo en "por comprar"; en casa o en el carrito no guarda la marca', JSON.stringify(bs) === '[["X","needed",true],["Y","stocked",false],["Z","in_cart",false]]', JSON.stringify(bs));

    console.log('Listas definidas por el usuario');
    const baseLists = (await request('/api.php')).json?.lists || [];
    check('listas iniciales: Hogar, Una vez, Libros', baseLists.map(l => l.id).join() === 'regular,once,books' && baseLists[0].name === 'Hogar' && baseLists[0].type === 'restock', JSON.stringify(baseLists));
    const gifts = { id: 'l-regalos', name: 'Regalos', type: 'collection', icon: 'gift', color: '#EC4899' };
    const lr = await post({ version: v(), lists: [...baseLists, gifts], items: [item({ name: 'Bufanda', list: 'l-regalos', status: 'in_cart', basket: true, level: 30 }), item({ name: 'Perdido', list: 'l-no-existe' })] });
    const d1 = readData();
    check('crear lista → se guarda (color normalizado)', lr.status === 200 && d1.lists.some(l => l.id === 'l-regalos' && l.color === '#ec4899'), lr.text);
    const buf = d1.items.find(i => i.name === 'Bufanda');
    check('colección: sin canasta, sin carrito, sin nivel', buf.list === 'l-regalos' && buf.status === 'needed' && !('basket' in buf) && !('level' in buf), JSON.stringify(buf));
    check('artículo con lista inexistente → Hogar', !('list' in d1.items.find(i => i.name === 'Perdido')));
    check('sin la lista Hogar → 400', (await post({ version: v(), lists: [gifts], items: [] })).status === 400);
    check('tipo de lista desconocido → 400', (await post({ version: v(), lists: [...baseLists, { ...gifts, type: 'rara' }], items: [] })).status === 400);
    check('nombre de lista repetido → 400', (await post({ version: v(), lists: [...baseLists, { ...gifts, name: 'hogar' }], items: [] })).status === 400);
    await post({ version: v(), lists: d1.lists.map(l => l.id === 'regular' ? { ...l, type: 'single', name: 'Casa' } : l), items: d1.items });
    const hogar = readData().lists.find(l => l.id === 'regular');
    check('Hogar se puede renombrar pero siempre es "se repone"', hogar.name === 'Casa' && hogar.type === 'restock');
    const bkBefore = fs.readdirSync(path.join(DATA_DIR, 'backups')).filter(f => f.includes('antes-borrar-lista')).length;
    await post({ version: v(), lists: readData().lists.filter(l => l.id !== 'l-regalos'), items: readData().items.map(i => ({ ...i, list: undefined })) });
    check('borrar una lista → backup automático antes', fs.readdirSync(path.join(DATA_DIR, 'backups')).filter(f => f.includes('antes-borrar-lista')).length === bkBefore + 1 && !readData().lists.some(l => l.id === 'l-regalos'));
    const noLists = await post({ version: v(), items: readData().items });
    check('guardar sin enviar listas las conserva', noLists.status === 200 && readData().lists.length === 3);

    console.log('Listas y nivel');
    const r1 = await post({ version: v(), items: [item({ name: 'Escurridor', list: 'once' }), item({ name: 'Azúcar', level: 40 }), item({ name: 'Sal', list: 'regular' })] });
    const saved2 = readData().items;
    check('lista "once" y nivel se guardan; "regular" no guarda el campo', r1.status === 200 && saved2[0].list === 'once' && saved2[1].level === 40 && !('list' in saved2[2]) && !('level' in saved2[2]), JSON.stringify(saved2));
    await post({ version: v(), items: [item({ list: 'otra' })] });
    check('lista desconocida → el artículo va a Hogar (no se pierde)', !('list' in readData().items[0]));
    check('nivel que no es múltiplo de 10 → 400', (await post({ version: v(), items: [item({ level: 45 })] })).status === 400);
    check('nivel fuera de 0–100 → 400', (await post({ version: v(), items: [item({ level: 110 })] })).status === 400);

    console.log('Búsqueda de productos (UPCitemdb falso)');
    const dawn = await request('/api.php?lookup=037000222057');
    check('producto encontrado: nombre limpio, categoría Limpieza y Hogar, con foto', dawn.status === 200 && dawn.json?.found && dawn.json.name === 'Dawn Liquid Dish Soap Original Scent' && dawn.json.category === 'Limpieza y Hogar' && dawn.json.hasImage === true, dawn.text);
    await request('/api.php?lookup=0037000222057');
    check('segunda consulta sale de la caché (UPCitemdb se consultó 1 vez)', upcCalls['0037000222057'] === 1, JSON.stringify(upcCalls));
    check('Dove → Cuidado Personal', (await request('/api.php?lookup=011111396487')).json?.category === 'Cuidado Personal');
    const photo = await fetch(`${BASE}/api.php?productImage=0037000222057`, { headers: { Cookie: cookieHeader() } });
    check('foto del producto por el servidor (sigue la redirección) → image/png', photo.status === 200 && photo.headers.get('content-type') === 'image/png');
    check('producto sin foto → 404', (await request('/api.php?productImage=011111396487')).status === 404);
    const photo2 = await fetch(`http://127.0.0.1:${PORT2}/api.php?productImage=0037000222057`, { headers: { Cookie: cookieHeader() } });
    check('sin permiso de pruebas, una foto en dirección interna se bloquea → 404', photo2.status === 404, String(photo2.status));
    const none = await request('/api.php?lookup=4006381333931');
    check('no encontrado → found:false y se recuerda', none.json?.found === false && (await request('/api.php?lookup=4006381333931')).json?.found === false && upcCalls['4006381333931'] === 1);
    check('UPCitemdb ocupado → 503 y NO se recuerda', (await request('/api.php?lookup=0078742351865')).status === 503 && (await request('/api.php?lookup=0078742351865')).status === 503 && upcCalls['0078742351865'] === 2);
    check('código inválido → 400', (await request('/api.php?lookup=123')).status === 400);
    check('búsqueda sin sesión → 401', (await fetch(`${BASE}/api.php?lookup=037000222057`)).status === 401);

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
    server2.kill();
    upcServer.close();
    await sleep(200);
    fs.rmSync(TMP, { recursive: true, force: true });
}

console.log(`\n${passed} ok, ${failed} fallos`);
process.exit(failed ? 1 : 0);
