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
if (!isAuthenticated(!isset($_GET['poll']))) { fail(401, 'No autorizado'); }

// La "base de datos" vive en su propio directorio, separado del código.
$dataFile = __DIR__ . '/data/items.json';
$lockFile = __DIR__ . '/data/items.lock';
$backupDir = __DIR__ . '/data/backups';
$backupKeep = 30; // días de backups diarios que se conservan

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

// Valida y normaliza los artículos que envía el cliente; null si son inválidos.
function cleanItems($items) {
    if (!is_array($items) || array_values($items) !== $items) { return null; }
    $out = [];
    $seen = [];
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
        $out[] = [
            'name' => $name,
            'category' => in_array($it['category'] ?? null, CATS, true) ? $it['category'] : 'Otros',
            'status' => in_array($it['status'] ?? null, STATUSES, true) ? $it['status'] : 'needed',
            'note' => trim($note),
            'price' => round((float)$price, 2),
        ];
    }
    return $out;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    echo json_encode(getDB());
    exit();
}

if ($method === 'POST') {
    // Solo JSON: un formulario de otro sitio no puede enviar este Content-Type
    // sin un preflight CORS que este servidor no autoriza.
    if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) { fail(415, 'Se esperaba JSON.'); }
    $input = json_decode(file_get_contents('php://input'), true);
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
    echo json_encode(['status' => 'success', 'newVersion' => $newState['version'], 'items' => $items]);
    exit();
}

header('Allow: GET, POST');
fail(405, 'Método no permitido.');
