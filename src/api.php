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
// Viven en data/icons/<id>.png (data/ está bloqueado por .htaccess) y se
// sirven solo con sesión, a través de api.php?icon=<id>. El navegador ya las
// manda como PNG de 128×128; aquí se valida que lo sean de verdad.
$iconDir = __DIR__ . '/data/icons';
const ICON_MAX_BYTES = 200000;
const ICON_MAX_SIDE = 256;
const ICON_ORPHAN_GRACE = 3600; // una imagen subida pero aún no guardada vive 1h

function iconIdValid($id) { return is_string($id) && preg_match('/^[a-f0-9]{16}$/', $id); }
function iconPath($id) { global $iconDir; return $iconDir . '/' . $id . '.png'; }

function serveIcon($id) {
    if (!iconIdValid($id)) { fail(400, 'Imagen inválida.'); }
    $path = iconPath($id);
    if (!is_file($path)) { fail(404, 'Imagen no encontrada.'); }
    session_write_close(); // libera la sesión: las imágenes se sirven en paralelo
    header_remove('Pragma');
    header_remove('Expires');
    header('Content-Type: image/png');
    header('Content-Length: ' . filesize($path));
    header('X-Content-Type-Options: nosniff');
    header("Content-Security-Policy: default-src 'none'; sandbox");
    // El id es único por imagen (otra subida genera otro id): se cachea sin
    // miedo en el navegador, pero solo de forma privada.
    header('Cache-Control: private, max-age=31536000, immutable');
    readfile($path);
    exit();
}

function saveIcon($dataUrl) {
    global $iconDir;
    if (!is_string($dataUrl) || strpos($dataUrl, 'data:image/png;base64,') !== 0) { fail(400, 'La imagen debe enviarse como PNG.'); }
    $bin = base64_decode(substr($dataUrl, 22), true);
    if ($bin === false || strlen($bin) === 0 || strlen($bin) > ICON_MAX_BYTES) { fail(400, 'La imagen es demasiado grande o está dañada.'); }
    $info = @getimagesizefromstring($bin);
    if (!$info || $info[2] !== IMAGETYPE_PNG || $info[0] < 1 || $info[1] < 1 || $info[0] > ICON_MAX_SIDE || $info[1] > ICON_MAX_SIDE) {
        fail(400, 'El archivo no es una imagen PNG válida.');
    }
    // Si el servidor tiene GD, se vuelve a codificar: descarta cualquier dato
    // extra que viniera escondido en el archivo.
    if (function_exists('imagecreatefromstring') && function_exists('imagepng')) {
        $im = @imagecreatefromstring($bin);
        if (!$im) { fail(400, 'El archivo no es una imagen PNG válida.'); }
        imagealphablending($im, false);
        imagesavealpha($im, true);
        ob_start();
        imagepng($im);
        $bin = ob_get_clean();
        imagedestroy($im);
    }
    if (!is_dir($iconDir) && !@mkdir($iconDir, 0755, true)) { fail(500, 'No se pudo guardar la imagen.'); }
    $id = bin2hex(random_bytes(8));
    if (@file_put_contents(iconPath($id), $bin) !== strlen($bin)) { fail(500, 'No se pudo guardar la imagen.'); }
    return $id;
}

// Borra las imágenes que ningún artículo usa (artículos borrados, imágenes
// reemplazadas o subidas que nunca se guardaron), con un margen de 1h.
function cleanupIcons($items) {
    global $iconDir;
    if (!is_dir($iconDir)) { return; }
    $used = [];
    foreach ($items as $it) { if (isset($it['icon'])) { $used[$it['icon']] = true; } }
    foreach (glob($iconDir . '/*.png') ?: [] as $file) {
        $id = basename($file, '.png');
        if (!isset($used[$id]) && filemtime($file) < time() - ICON_ORPHAN_GRACE) { @unlink($file); }
    }
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
            ]
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
    return $db;
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

// Valida y normaliza los artículos que envía el cliente; null si son inválidos.
function cleanItems($items) {
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
            'category' => in_array($it['category'] ?? null, CATS, true) ? $it['category'] : 'Otros',
            'status' => in_array($it['status'] ?? null, STATUSES, true) ? $it['status'] : 'needed',
            'note' => trim($note),
            'price' => round((float)$price, 2),
        ];
        if ($barcodes) { $clean['barcodes'] = $barcodes; }
        // Imagen: solo se conserva si apunta a un archivo existente.
        if (iconIdValid($it['icon'] ?? null) && is_file(iconPath($it['icon']))) { $clean['icon'] = $it['icon']; }
        $out[] = $clean;
    }
    return $out;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['icon'])) { serveIcon($_GET['icon']); }
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
        echo json_encode(['status' => 'success', 'icon' => saveIcon($input['iconUpload'])]);
        exit();
    }
    if (!is_array($input) || !isset($input['version']) || !is_numeric($input['version'])) { fail(400, 'Datos de entrada inválidos.'); }
    $items = cleanItems($input['items'] ?? null);
    if ($items === null) { fail(400, 'Artículos inválidos.'); }

    lockDB();
    $currentDB = getDB();

    // Optimistic Locking: verificar versión (dentro del bloqueo)
    if ((int)$input['version'] !== $currentDB['version']) {
        http_response_code(409); // Conflicto
        echo json_encode(['status' => 'conflict', 'latest' => $currentDB]);
        exit();
    }

    $newState = ['version' => $currentDB['version'] + 1, 'items' => $items];
    saveDB($newState);
    cleanupIcons($items);
    echo json_encode(['status' => 'success', 'newVersion' => $newState['version'], 'items' => $items]);
    exit();
}

header('Allow: GET, POST');
fail(405, 'Método no permitido.');
