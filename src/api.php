<?php
require_once __DIR__ . '/session.php';
startSession();
header('Content-Type: application/json');
header('Cache-Control: no-store');

function fail($code, $message) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'error' => $message]);
    exit();
}

// Proteger API: si no está logueado, error 401. El poll automático de la lista
// (?poll=1) no cuenta como uso para la caducidad por inactividad.
// Tampoco cargar imágenes (?icon=), que ocurre al redibujar la lista tras el poll.
if (!isAuthenticated(!isset($_GET['poll']) && !isset($_GET['icon']))) { fail(401, 'No autorizado'); }

// La "base de datos" vive en su propio directorio, separado del código.
$dataFile = __DIR__ . '/data/items.json';
$lockFile = __DIR__ . '/data/items.lock';
$backupDir = __DIR__ . '/data/backups';
$backupKeep = 30; // días de backups diarios que se conservan

// --- Imágenes de los artículos ---
// Viven en data/icons/ (data/ está bloqueado por .htaccess) y se sirven solo con
// sesión, vía api.php?icon=<id>. Dos tamaños por imagen, con el mismo id:
//   <id>.png   miniatura 128×128 (fondo transparente) para las filas
//   <id>-l.jpg versión grande (hasta 640px) para la vista previa
// El navegador ya las manda ajustadas; aquí se valida que sean imágenes reales
// y se recodifican con GD si está disponible.
$iconDir = __DIR__ . '/data/icons';
const ICON_MAX_BYTES = 200000;
const ICON_MAX_SIDE = 256;
const ICON_LARGE_MAX_BYTES = 400000;
const ICON_LARGE_MAX_SIDE = 1024;
const ICON_ORPHAN_GRACE = 3600; // una imagen subida pero aún no guardada vive 1h

function iconIdValid($id) { return is_string($id) && preg_match('/^[a-f0-9]{16}$/', $id); }
function iconPath($id) { global $iconDir; return $iconDir . '/' . $id . '.png'; }
function iconLargePath($id) { global $iconDir; return $iconDir . '/' . $id . '-l.jpg'; }

function sendImage($path, $type, $cache) {
    session_write_close(); // libera la sesión: las imágenes se sirven en paralelo
    header_remove('Pragma');
    header_remove('Expires');
    header('Content-Type: ' . $type);
    header('Content-Length: ' . filesize($path));
    header('X-Content-Type-Options: nosniff');
    header("Content-Security-Policy: default-src 'none'; sandbox");
    header('Cache-Control: ' . $cache);
    readfile($path);
    exit();
}

function serveIcon($id, $large) {
    if (!iconIdValid($id)) { fail(400, 'Imagen inválida.'); }
    $path = $large ? iconLargePath($id) : iconPath($id);
    if (!is_file($path)) { fail(404, 'Imagen no encontrada.'); }
    // El id es único por imagen (otra subida genera otro id): se cachea sin
    // miedo en el navegador, pero solo de forma privada.
    sendImage($path, $large ? 'image/jpeg' : 'image/png', 'private, max-age=31536000, immutable');
}

// Decodifica y valida una imagen enviada como data URL. Devuelve los bytes
// (recodificados con GD si está disponible) o termina con 400.
function decodeUpload($dataUrl, $mime, $imageType, $maxBytes, $maxSide) {
    $prefix = 'data:' . $mime . ';base64,';
    if (!is_string($dataUrl) || strpos($dataUrl, $prefix) !== 0) { fail(400, 'Formato de imagen no válido.'); }
    $bin = base64_decode(substr($dataUrl, strlen($prefix)), true);
    if ($bin === false || strlen($bin) === 0 || strlen($bin) > $maxBytes) { fail(400, 'La imagen es demasiado grande o está dañada.'); }
    $info = @getimagesizefromstring($bin);
    if (!$info || $info[2] !== $imageType || $info[0] < 1 || $info[1] < 1 || $info[0] > $maxSide || $info[1] > $maxSide) {
        fail(400, 'El archivo no es una imagen válida.');
    }
    if (function_exists('imagecreatefromstring')) {
        $im = @imagecreatefromstring($bin);
        if (!$im) { fail(400, 'El archivo no es una imagen válida.'); }
        ob_start();
        if ($imageType === IMAGETYPE_PNG) {
            imagealphablending($im, false);
            imagesavealpha($im, true);
            imagepng($im);
        } else {
            imagejpeg($im, null, 85);
        }
        $bin = ob_get_clean();
        imagedestroy($im);
    }
    return $bin;
}

// Guarda la miniatura (obligatoria) y la versión grande (opcional); devuelve el id.
function saveIcon($thumbUrl, $largeUrl) {
    global $iconDir;
    $thumb = decodeUpload($thumbUrl, 'image/png', IMAGETYPE_PNG, ICON_MAX_BYTES, ICON_MAX_SIDE);
    $large = $largeUrl === null ? null : decodeUpload($largeUrl, 'image/jpeg', IMAGETYPE_JPEG, ICON_LARGE_MAX_BYTES, ICON_LARGE_MAX_SIDE);
    if (!is_dir($iconDir) && !@mkdir($iconDir, 0755, true)) { fail(500, 'No se pudo guardar la imagen.'); }
    $id = bin2hex(random_bytes(8));
    if (@file_put_contents(iconPath($id), $thumb) !== strlen($thumb)) { fail(500, 'No se pudo guardar la imagen.'); }
    if ($large !== null && @file_put_contents(iconLargePath($id), $large) !== strlen($large)) {
        @unlink(iconPath($id));
        fail(500, 'No se pudo guardar la imagen.');
    }
    return $id;
}

// Borra las imágenes que ningún artículo usa (artículos borrados, imágenes
// reemplazadas o subidas que nunca se guardaron), con un margen de 1h.
function cleanupIcons($items) {
    global $iconDir;
    if (!is_dir($iconDir)) { return; }
    $used = [];
    foreach ($items as $it) { if (isset($it['icon'])) { $used[$it['icon']] = true; } }
    foreach (glob($iconDir . '/*') ?: [] as $file) {
        if (!preg_match('/^([a-f0-9]{16})(-l\.jpg|\.png)$/', basename($file), $m)) { continue; }
        if (!isset($used[$m[1]]) && filemtime($file) < time() - ICON_ORPHAN_GRACE) { @unlink($file); }
    }
}

// --- Búsqueda de productos en UPCitemdb (respaldo de Open Food Facts) ---
// Open Food/Beauty/Products Facts casi no tienen productos de limpieza o de
// cuidado personal de EE. UU.; UPCitemdb sí. Su API no permite consultas
// directas desde el navegador (CORS), así que la hace el servidor. El plan
// gratuito admite 100 consultas al día y no muy seguidas: cada código se
// consulta una sola vez y la respuesta queda en data/products.json.
// GROCMAN_UPC_URL / GROCMAN_ALLOW_PRIVATE_IMAGES solo se usan en las pruebas.
$productCacheFile = __DIR__ . '/data/products.json';
const PRODUCT_NOT_FOUND_TTL = 2592000; // un "no encontrado" se vuelve a consultar a los 30 días
const PRODUCT_IMAGE_MAX_BYTES = 3000000;

// Recorta texto UTF-8 sin partir caracteres (mbstring puede no estar instalado).
function cutText($s, $max) {
    if (function_exists('mb_substr')) { return mb_substr($s, 0, $max); }
    return preg_match('/^.{0,' . (int)$max . '}/us', $s, $m) ? $m[0] : '';
}

function upcLookupUrl() {
    return (getenv('GROCMAN_UPC_URL') ?: 'https://api.upcitemdb.com/prod/trial/lookup') . '?upc=';
}

// Lee y modifica la caché de productos con bloqueo. $fn recibe la caché por referencia.
function withProductCache(callable $fn) {
    global $productCacheFile;
    $cache = [];
    $fh = @fopen($productCacheFile, 'c+');
    if (!$fh || !flock($fh, LOCK_EX)) { return $fn($cache); }
    $cache = json_decode(stream_get_contents($fh), true) ?: [];
    $before = $cache;
    $result = $fn($cache);
    if ($cache !== $before) {
        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, json_encode($cache, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        fflush($fh);
    }
    flock($fh, LOCK_UN);
    fclose($fh);
    return $result;
}

// Categoría de grocman a partir de la ruta de categorías de UPCitemdb
// (p. ej. "Home & Garden > Household Supplies > Household Cleaning Supplies").
function categoryFromUpc($category, $title) {
    $t = strtolower($category . ' ' . $title);
    $rules = [
        'Limpieza y Hogar' => '/clean|household|laundry|dish|detergent|bleach|disinfect|trash bag|paper towel|sponge/',
        'Cuidado Personal' => '/personal care|health & beauty|bath|body wash|shampoo|conditioner|deodorant|toothpaste|oral care|soap|lotion|razor|shav|toilet paper/',
        'Bebidas' => '/beverage|drink|juice|soda|water|coffee|tea/',
        'Lácteos y Huevos' => '/dairy|milk|cheese|yogurt|egg/',
        'Carnes y Mariscos' => '/meat|poultry|chicken|beef|pork|fish|seafood/',
        'Panadería' => '/bread|bakery|tortilla/',
        'Frutas y Verduras' => '/fruit|vegetable|produce/',
    ];
    if (preg_match('/vitamin|supplement|pain reliev|medicine|first aid|pharmacy|alcohol/', $t)) { return 'Salud y Farmacia'; }
    foreach ($rules as $cat => $re) { if (preg_match($re, $t)) { return $cat; } }
    return preg_match('/food|grocery|snack|pantry/', $t) ? 'Despensa' : 'Otros';
}

function httpGet($url, $maxBytes) {
    $ch = curl_init($url);
    $body = '';
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => false,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_USERAGENT => 'grocman/1.0 (lista de compra personal)',
        CURLOPT_PROTOCOLS => CURLPROTO_HTTP | CURLPROTO_HTTPS,
        CURLOPT_HTTPHEADER => ['Accept: application/json, image/*'],
        // Corta la descarga si pasa del límite.
        CURLOPT_WRITEFUNCTION => function ($ch, $chunk) use (&$body, $maxBytes) {
            $body .= $chunk;
            return strlen($body) > $maxBytes ? 0 : strlen($chunk);
        },
    ]);
    $ok = curl_exec($ch);
    $res = [
        'ok' => $ok !== false,
        'status' => curl_getinfo($ch, CURLINFO_HTTP_CODE),
        'type' => (string)curl_getinfo($ch, CURLINFO_CONTENT_TYPE),
        'location' => (string)curl_getinfo($ch, CURLINFO_REDIRECT_URL),
        'body' => $body,
    ];
    curl_close($ch);
    return $res;
}

// Consulta un código en UPCitemdb (o en la caché). Devuelve la entrada de caché.
function lookupProduct($code) {
    return withProductCache(function (&$cache) use ($code) {
        $hit = $cache[$code] ?? null;
        // Entradas encontradas de antes de guardar la descripción (v < 2): se
        // vuelven a consultar una vez para tener la información de la vista previa.
        if ($hit && (($hit['found'] && ($hit['v'] ?? 1) >= 2) || (!$hit['found'] && time() - $hit['t'] < PRODUCT_NOT_FOUND_TTL))) { return $hit; }
        if (!function_exists('curl_init')) { fail(503, 'La búsqueda de productos no está disponible.'); }
        $r = httpGet(upcLookupUrl() . $code, 500000);
        $json = json_decode($r['body'], true);
        if ($r['status'] === 429 || in_array($json['code'] ?? '', ['TOO_FAST', 'EXCEED_LIMIT'], true)) {
            fail(503, 'La búsqueda de productos está ocupada; intenta en un momento.');
        }
        if (!$r['ok'] || !is_array($json) || ($json['code'] ?? '') !== 'OK') { fail(502, 'No se pudo consultar el producto.'); }
        $item = $json['items'][0] ?? null;
        $entry = ['t' => time(), 'found' => false];
        if (is_array($item) && trim((string)($item['title'] ?? '')) !== '') {
            $images = array_values(array_filter((array)($item['images'] ?? []), function ($u) {
                return is_string($u) && preg_match('#^https?://#i', $u);
            }));
            $entry = [
                't' => time(),
                'v' => 2,
                'found' => true,
                'title' => trim(preg_replace('/\s+/', ' ', (string)$item['title'])),
                'brand' => trim((string)($item['brand'] ?? '')),
                'category' => categoryFromUpc((string)($item['category'] ?? ''), (string)$item['title']),
                'images' => array_slice($images, 0, 3),
                'description' => cutText(trim(preg_replace('/\s+/', ' ', (string)($item['description'] ?? ''))), 700),
                'size' => trim((string)($item['size'] ?? '')),
            ];
        }
        $cache[$code] = $entry;
        return $entry;
    });
}

// ¿La URL apunta a un servidor público? (evita que el proxy de fotos se use
// para llegar a la red interna del hosting).
function publicHttpUrl($url) {
    $p = parse_url($url);
    if (!$p || !in_array(strtolower($p['scheme'] ?? ''), ['http', 'https'], true) || empty($p['host'])) { return false; }
    if (getenv('GROCMAN_ALLOW_PRIVATE_IMAGES')) { return true; }
    $ips = @gethostbynamel($p['host']) ?: [];
    if (!$ips) { return false; }
    foreach ($ips as $ip) {
        if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) { return false; }
    }
    return true;
}

// Foto del producto de UPCitemdb, a través del servidor (esas fotos vienen de
// sitios de tiendas sin CORS). Solo sirve URLs que UPCitemdb devolvió para ese
// código, nunca una URL arbitraria.
function serveProductImage($code) {
    $entry = withProductCache(function (&$cache) use ($code) { return $cache[$code] ?? null; });
    if (!$entry || empty($entry['images'])) { fail(404, 'El producto no tiene foto.'); }
    foreach ($entry['images'] as $url) {
        for ($hops = 0; $hops < 3 && $url; $hops++) { // redirecciones, validando cada destino
            if (!publicHttpUrl($url)) { break; }
            $r = httpGet($url, PRODUCT_IMAGE_MAX_BYTES);
            if ($r['status'] >= 300 && $r['status'] < 400 && $r['location']) { $url = $r['location']; continue; }
            $info = $r['ok'] && $r['status'] === 200 ? @getimagesizefromstring($r['body']) : false;
            if ($info && in_array($info[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP, IMAGETYPE_GIF], true)) {
                session_write_close();
                header('Content-Type: ' . $info['mime']);
                header('Content-Length: ' . strlen($r['body']));
                header('X-Content-Type-Options: nosniff');
                header("Content-Security-Policy: default-src 'none'; sandbox");
                header('Cache-Control: private, max-age=86400');
                echo $r['body'];
                exit();
            }
            break;
        }
    }
    fail(404, 'No se pudo obtener la foto del producto.');
}

// --- Google Books (fuente principal para buscar libros) ---
// La clave vive solo en el servidor, en google.php (no se versiona):
//   <?php const GOOGLE_BOOKS_KEY = '...';
// Sin clave (o si Google falla / se acaba la cuota) se responde available:false
// y la app usa solo Open Library.
if (file_exists(__DIR__ . '/google.php')) { require_once __DIR__ . '/google.php'; }
function gbooksKey() { return defined('GOOGLE_BOOKS_KEY') ? (string)GOOGLE_BOOKS_KEY : ''; }
function gbooksApiUrl() { return getenv('GROCMAN_GBOOKS_URL') ?: 'https://www.googleapis.com/books/v1/volumes'; }
function gbooksCoverUrl() { return getenv('GROCMAN_GBOOKS_COVER_URL') ?: 'https://books.google.com/books/content'; }
const GBOOKS_PER_PAGE = 10;

// Busca libros. $q: texto libre o "isbn:<13 dígitos>". Devuelve la lista normalizada.
function searchGoogleBooks($q, $page) {
    $key = gbooksKey();
    if ($key === '' || !function_exists('curl_init')) { return ['available' => false, 'results' => [], 'total' => 0]; }
    $fields = 'totalItems,items(id,volumeInfo(title,subtitle,authors,publishedDate,pageCount,publisher,industryIdentifiers,imageLinks/thumbnail,description))';
    $url = gbooksApiUrl() . '?' . http_build_query([
        'q' => $q, 'printType' => 'books', 'maxResults' => GBOOKS_PER_PAGE,
        'startIndex' => ($page - 1) * GBOOKS_PER_PAGE, 'fields' => $fields, 'key' => $key,
    ]);
    $r = httpGet($url, 1000000);
    $json = json_decode($r['body'], true);
    if (!$r['ok'] || $r['status'] !== 200 || !is_array($json)) { return ['available' => false, 'results' => [], 'total' => 0]; }
    $out = [];
    foreach ((array)($json['items'] ?? []) as $it) {
        $id = (string)($it['id'] ?? '');
        $v = $it['volumeInfo'] ?? [];
        $title = trim(preg_replace('/\s+/', ' ', (string)($v['title'] ?? '')));
        if (!gbooksIdValid($id) || $title === '') { continue; }
        $isbn13 = ''; $isbn10 = '';
        foreach ((array)($v['industryIdentifiers'] ?? []) as $ii) {
            if (($ii['type'] ?? '') === 'ISBN_13' && preg_match('/^97[89]\d{10}$/', (string)($ii['identifier'] ?? ''))) { $isbn13 = $ii['identifier']; }
            if (($ii['type'] ?? '') === 'ISBN_10' && preg_match('/^\d{9}[\dX]$/', (string)($ii['identifier'] ?? ''))) { $isbn10 = $ii['identifier']; }
        }
        $authors = array_values(array_filter(array_map(function ($a) { return is_string($a) ? cutText(trim($a), 200) : ''; }, (array)($v['authors'] ?? []))));
        $out[] = [
            'id' => $id,
            'title' => cutText($title, 240),
            'subtitle' => cutText(trim((string)($v['subtitle'] ?? '')), 240),
            'authors' => array_slice($authors, 0, 5),
            'year' => (preg_match('/^\d{4}/', (string)($v['publishedDate'] ?? ''), $m) ? $m[0] : ''),
            'pages' => (int)($v['pageCount'] ?? 0) ?: null,
            'publisher' => cutText(trim((string)($v['publisher'] ?? '')), 200),
            'isbn' => $isbn13 ?: $isbn10,
            'cover' => !empty($v['imageLinks']['thumbnail']),
            'description' => cutText(trim(preg_replace('/\s+/', ' ', strip_tags(html_entity_decode((string)($v['description'] ?? ''), ENT_QUOTES | ENT_HTML5, 'UTF-8')))), 1200),
        ];
    }
    return ['available' => true, 'results' => $out, 'total' => (int)($json['totalItems'] ?? 0)];
}
function gbooksIdValid($id) { return is_string($id) && preg_match('/^[A-Za-z0-9_-]{6,20}$/', $id); }

// Portada de un volumen de Google Books, a través del servidor (sin CORS no se
// podría guardar como imagen). Solo books.google.com con un id válido.
// $size: 's' miniatura (para la lista de resultados) o 'l' la más grande posible.
function serveGoogleCover($id, $size) {
    if (!gbooksIdValid($id)) { fail(400, 'Id de libro inválido.'); }
    if (!function_exists('curl_init')) { fail(503, 'No disponible.'); }
    foreach ($size === 'l' ? [3, 2, 1] : [1] as $zoom) {
        $url = gbooksCoverUrl() . '?' . http_build_query(['id' => $id, 'printsec' => 'frontcover', 'img' => 1, 'zoom' => $zoom]);
        $r = httpGet($url, PRODUCT_IMAGE_MAX_BYTES);
        $info = $r['ok'] && $r['status'] === 200 ? @getimagesizefromstring($r['body']) : false;
        // Google devuelve un aviso "sin imagen" pequeño cuando no tiene ese tamaño.
        if (!$info || !in_array($info[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP, IMAGETYPE_GIF], true) || $info[0] < 40) { continue; }
        session_write_close();
        header('Content-Type: ' . $info['mime']);
        header('Content-Length: ' . strlen($r['body']));
        header('X-Content-Type-Options: nosniff');
        header("Content-Security-Policy: default-src 'none'; sandbox");
        header('Cache-Control: private, max-age=604800');
        echo $r['body'];
        exit();
    }
    fail(404, 'Sin portada.');
}

// Bloqueo exclusivo durante todo el ciclo leer → comprobar versión → escribir,
// para que dos guardados simultáneos no pasen ambos la comprobación de versión.
// Se libera solo al terminar el script.
function lockDB() {
    global $lockFile;
    $dir = dirname($lockFile);
    if (!is_dir($dir)) { @mkdir($dir, 0755, true); }
    $fh = @fopen($lockFile, 'c');
    if (!$fh || !flock($fh, LOCK_EX)) { fail(503, 'La lista está ocupada; intenta de nuevo.'); }
    $GLOBALS['dbLockHandle'] = $fh;
}

// Función para leer DB
function getDB() {
    global $dataFile;
    if (!file_exists($dataFile)) {
        return [
            'version' => 1,
            'items' => [
                ['name' => 'Leche', 'category' => 'Lácteos/Huevos', 'status' => 'needed', 'note' => '', 'price' => 0],
                ['name' => 'Pan', 'category' => 'Panadería', 'status' => 'stocked', 'note' => '', 'price' => 0]
            ],
            'lists' => DEFAULT_LISTS,
        ];
    }
    // Si el archivo existe pero no se puede leer, se aborta: nunca se sigue con
    // datos vacíos que el siguiente guardado escribiría encima de la lista real.
    $raw = @file_get_contents($dataFile);
    $db = ($raw === false) ? null : json_decode($raw, true);
    if (!is_array($db) || !isset($db['items']) || !is_array($db['items'])) {
        fail(500, 'No se pudo leer la lista. No se guardó nada.');
    }
    $db['version'] = (int)($db['version'] ?? 1);
    $db['lists'] = cleanLists($db['lists'] ?? null) ?? DEFAULT_LISTS;
    foreach ($db['items'] as &$it) {
        if (is_array($it)) { $it['category'] = (($it['list'] ?? '') === 'books') ? 'Libros' : categoryOf($it['category'] ?? null); }
    }
    unset($it);
    return $db;
}

// Copia puntual del estado actual (p. ej. antes de borrar una lista).
function backupSnapshot($label) {
    global $dataFile, $backupDir;
    if (!file_exists($dataFile)) { return; }
    if (!is_dir($backupDir) && !@mkdir($backupDir, 0755, true)) { return; }
    @copy($dataFile, $backupDir . '/items-' . $label . '-' . date('Ymd-His') . '.json');
}

// Copia del estado actual una vez al día (antes del primer guardado del día).
function backupDaily() {
    global $dataFile, $backupDir, $backupKeep;
    if (!file_exists($dataFile)) { return; }
    if (!is_dir($backupDir) && !@mkdir($backupDir, 0755, true)) { return; }
    $target = $backupDir . '/items-' . date('Y-m-d') . '.json';
    if (file_exists($target)) { return; }
    @copy($dataFile, $target);
    $files = glob($backupDir . '/items-*.json');
    sort($files);
    while (count($files) > $backupKeep) { @unlink(array_shift($files)); }
}

// Escritura atómica: temporal completo + rename, así ninguna lectura (el poll
// de 10 s) ve nunca un archivo vacío o a medias. Requiere lockDB().
function saveDB($data) {
    global $dataFile;
    $dir = dirname($dataFile);
    if (!is_dir($dir)) { @mkdir($dir, 0755, true); }
    $json = json_encode($data, JSON_PRETTY_PRINT);
    if ($json === false) { fail(500, 'No se pudieron codificar los datos. No se guardó nada.'); }
    backupDaily();
    $tmp = $dataFile . '.tmp';
    if (@file_put_contents($tmp, $json) !== strlen($json)) {
        @unlink($tmp);
        fail(500, 'No se pudo escribir la lista. No se guardó nada.');
    }
    @chmod($tmp, 0644);
    if (!@rename($tmp, $dataFile)) {
        @unlink($tmp);
        fail(500, 'No se pudo guardar la lista. No se guardó nada.');
    }
}

// Código de barras de producto (GTIN) normalizado: solo dígitos; un UPC-A de 12
// dígitos pasa a EAN-13 con un 0 delante y un GTIN-14 que empieza en 0 pasa a
// 13, para que el mismo producto tenga siempre el mismo código sin importar
// qué lector lo leyó. Devuelve null si no es un GTIN válido (8, 13 o 14 dígitos
// con su dígito de control correcto).
function normalizeBarcode($code) {
    if (!is_string($code) || !preg_match('/^[0-9]{8,14}$/', $code)) { return null; }
    if (strlen($code) === 12) { $code = '0' . $code; }
    if (strlen($code) === 14 && $code[0] === '0') { $code = substr($code, 1); }
    if (!in_array(strlen($code), [8, 13, 14], true)) { return null; }
    $sum = 0;
    for ($i = strlen($code) - 2, $w = 3; $i >= 0; $i--, $w = 4 - $w) { $sum += (int)$code[$i] * $w; }
    return ((10 - $sum % 10) % 10) === (int)substr($code, -1) ? $code : null;
}

// Categoría válida (traduce los nombres antiguos; lo desconocido va a "Otros").
function categoryOf($c) {
    if (is_string($c) && isset(LEGACY_CATS[$c])) { return LEGACY_CATS[$c]; }
    return in_array($c, CATS, true) ? $c : 'Otros';
}

// Datos de un libro (de Open Library): autores, año, páginas, editorial.
function cleanBook($b) {
    if (!is_array($b)) { return null; }
    $out = [];
    $authors = array_values(array_filter((array)($b['authors'] ?? []), function ($a) { return is_string($a) && trim($a) !== '' && strlen($a) <= 200; }));
    if ($authors) { $out['authors'] = array_map('trim', array_slice($authors, 0, 5)); }
    if (isset($b['year']) && preg_match('/^\d{3,4}$/', (string)$b['year'])) { $out['year'] = (string)$b['year']; }
    if (isset($b['pages']) && filter_var($b['pages'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 20000]]) !== false) { $out['pages'] = (int)$b['pages']; }
    if (isset($b['publisher']) && is_string($b['publisher']) && trim($b['publisher']) !== '' && strlen($b['publisher']) <= 300) { $out['publisher'] = trim($b['publisher']); }
    return $out ?: null;
}

// Valida las listas; null si son inválidas. Hogar ('regular') debe existir y
// es siempre del tipo "se repone".
function cleanLists($lists) {
    if (!is_array($lists) || array_values($lists) !== $lists || !$lists || count($lists) > LISTS_MAX) { return null; }
    $out = []; $ids = []; $names = [];
    foreach ($lists as $l) {
        if (!is_array($l)) { return null; }
        $id = $l['id'] ?? null;
        $name = is_string($l['name'] ?? null) ? trim($l['name']) : '';
        if (!is_string($id) || !preg_match('/^[a-z0-9-]{1,40}$/', $id) || isset($ids[$id])) { return null; }
        if ($name === '' || strlen($name) > 240 || isset($names[strtolower($name)])) { return null; }
        $type = in_array($l['type'] ?? null, LIST_TYPES, true) ? $l['type'] : null;
        if ($type === null) { return null; }
        if ($id === 'regular') { $type = 'restock'; }
        $ids[$id] = true; $names[strtolower($name)] = true;
        $out[] = [
            'id' => $id, 'name' => $name, 'type' => $type,
            'icon' => in_array($l['icon'] ?? null, LIST_ICONS, true) ? $l['icon'] : 'tag',
            'color' => (is_string($l['color'] ?? null) && preg_match('/^#[0-9a-f]{6}$/i', $l['color'])) ? strtolower($l['color']) : '#64748b',
        ];
    }
    return isset($ids['regular']) ? $out : null;
}

// Valida y normaliza los artículos que envía el cliente; null si son inválidos.
// $lists: las listas vigentes (para el tipo de cada una).
function cleanItems($items, $lists = DEFAULT_LISTS) {
    $typeOf = [];
    foreach ($lists as $l) { $typeOf[$l['id']] = $l['type']; }
    if (!is_array($items) || array_values($items) !== $items) { return null; }
    $out = [];
    $seen = [];
    $seenCodes = [];
    foreach ($items as $it) {
        if (!is_array($it) || !is_string($it['name'] ?? null)) { return null; }
        $name = trim($it['name']);
        if ($name === '' || strlen($name) > ITEM_NAME_MAX * 4) { return null; }
        $key = strtolower($name);
        if (isset($seen[$key])) { return null; } // nombres únicos (identifican al artículo)
        $seen[$key] = true;
        $price = $it['price'] ?? 0;
        if ($price === '' || $price === null) { $price = 0; }
        if (!is_numeric($price) || $price < 0) { return null; }
        $note = is_string($it['note'] ?? null) ? $it['note'] : '';
        if (strlen($note) > ITEM_NOTE_MAX * 4) { return null; }
        // Productos (códigos de barras) asociados: cada código pertenece a un solo artículo.
        $barcodes = [];
        $rawCodes = $it['barcodes'] ?? [];
        if (!is_array($rawCodes) || count($rawCodes) > ITEM_BARCODES_MAX) { return null; }
        foreach ($rawCodes as $b) {
            $code = normalizeBarcode(is_array($b) ? ($b['code'] ?? null) : null);
            if ($code === null || isset($seenCodes[$code])) { return null; }
            $seenCodes[$code] = true;
            $label = is_string($b['label'] ?? null) ? trim($b['label']) : '';
            if (strlen($label) > BARCODE_LABEL_MAX * 4) { return null; }
            $barcodes[] = ['code' => $code, 'label' => $label];
        }
        $clean = [
            'name' => $name,
            'category' => categoryOf($it['category'] ?? null),
            'status' => in_array($it['status'] ?? null, STATUSES, true) ? $it['status'] : 'needed',
            'note' => trim($note),
            'price' => round((float)$price, 2),
        ];
        if ($barcodes) { $clean['barcodes'] = $barcodes; }
        // Lista: 'regular' (se repone; no se guarda el campo) o 'once' (compra de una vez).
        // Lista: debe existir; si no (otro teléfono la borró), va a Hogar.
        $list = $it['list'] ?? 'regular';
        if (!is_string($list)) { return null; }
        if (!isset($typeOf[$list])) { $list = 'regular'; }
        $type = $typeOf[$list];
        if ($list !== 'regular') { $clean['list'] = $list; }
        if ($list === 'books') { $clean['category'] = 'Libros'; }
        if ($type === 'collection') {
            // Colección: lo quiero / lo tengo; sin canasta ni carrito.
            if ($clean['status'] === 'in_cart') { $clean['status'] = 'needed'; }
            $book = cleanBook($it['book'] ?? null);
            if ($book) { $clean['book'] = $book; }
        }
        // Canasta: por comprar y elegido para esta compra. "En el carrito" ya
        // implica estar en la canasta; lo que está en casa no puede estarlo.
        if (!empty($it['basket']) && $clean['status'] === 'needed' && $type !== 'collection') { $clean['basket'] = true; }
        // Nivel en casa (0–100, de 10 en 10); ausente = sin seguimiento.
        if (isset($it['level']) && $type === 'restock') {
            $level = filter_var($it['level'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 0, 'max_range' => 100]]);
            if ($level === false || $level % 10 !== 0) { return null; }
            $clean['level'] = $level;
        }
        // Imagen: solo se conserva si apunta a un archivo existente.
        if (iconIdValid($it['icon'] ?? null) && is_file(iconPath($it['icon']))) { $clean['icon'] = $it['icon']; }
        $out[] = $clean;
    }
    return $out;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['icon'])) { serveIcon($_GET['icon'], ($_GET['size'] ?? '') === 'l'); }
    if (isset($_GET['lookup']) || isset($_GET['productImage'])) {
        $code = normalizeBarcode((string)($_GET['lookup'] ?? $_GET['productImage']));
        if ($code === null) { fail(400, 'Código de barras inválido.'); }
        if (isset($_GET['productImage'])) { serveProductImage($code); }
        $p = lookupProduct($code);
        echo json_encode($p['found']
            ? ['found' => true, 'name' => $p['title'], 'brand' => $p['brand'], 'category' => $p['category'], 'hasImage' => !empty($p['images']),
               'description' => $p['description'] ?? '', 'size' => $p['size'] ?? '']
            : ['found' => false]);
        exit();
    }
    if (isset($_GET['books'])) {
        $q = trim((string)$_GET['books']);
        $page = max(1, min(10, (int)($_GET['page'] ?? 1)));
        if ($q === '' || strlen($q) > 200) { fail(400, 'Búsqueda inválida.'); }
        session_write_close();
        echo json_encode(searchGoogleBooks($q, $page), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit();
    }
    if (isset($_GET['bookCover'])) { serveGoogleCover((string)$_GET['bookCover'], ($_GET['size'] ?? '') === 'l' ? 'l' : 's'); }
    echo json_encode(getDB());
    exit();
}

if ($method === 'POST') {
    // Solo JSON: un formulario de otro sitio no puede enviar este Content-Type
    // sin un preflight CORS que este servidor no autoriza.
    if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) { fail(415, 'Se esperaba JSON.'); }
    $input = json_decode(file_get_contents('php://input'), true);

    // Subida de la imagen de un artículo (no toca la lista)
    if (is_array($input) && isset($input['iconUpload'])) {
        echo json_encode(['status' => 'success', 'icon' => saveIcon($input['iconUpload'], $input['iconLarge'] ?? null)]);
        exit();
    }
    if (!is_array($input) || !isset($input['version']) || !is_numeric($input['version'])) { fail(400, 'Datos de entrada inválidos.'); }
    lockDB();
    $currentDB = getDB();
    // Listas: si no se envían, se conservan las actuales.
    $lists = array_key_exists('lists', $input) ? cleanLists($input['lists']) : $currentDB['lists'];
    if ($lists === null) { fail(400, 'Listas inválidas.'); }
    $items = cleanItems($input['items'] ?? null, $lists);
    if ($items === null) { fail(400, 'Artículos inválidos.'); }

    // Optimistic Locking: verificar versión (dentro del bloqueo)
    if ((int)$input['version'] !== $currentDB['version']) {
        http_response_code(409); // Conflicto
        echo json_encode(['status' => 'conflict', 'latest' => $currentDB]);
        exit();
    }

    // Se borra una lista: copia de seguridad antes de guardar.
    $newIds = array_column($lists, 'id');
    if (array_diff(array_column($currentDB['lists'], 'id'), $newIds)) { backupSnapshot('antes-borrar-lista'); }
    $newState = ['version' => $currentDB['version'] + 1, 'items' => $items, 'lists' => $lists];
    saveDB($newState);
    cleanupIcons($items);
    echo json_encode(['status' => 'success', 'newVersion' => $newState['version'], 'items' => $items, 'lists' => $lists]);
    exit();
}

header('Allow: GET, POST');
fail(405, 'Método no permitido.');
