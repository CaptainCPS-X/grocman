<?php
session_start();
header('Content-Type: application/json');

// Proteger API: Si no está logueado, error 401
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit();
}

// La "base de datos" vive en su propio directorio, separado del código.
$dataFile = __DIR__ . '/data/items.json';

// Guarda la DB asegurando que el directorio exista.
function saveDB($data) {
    global $dataFile;
    $dir = dirname($dataFile);
    if (!is_dir($dir)) { @mkdir($dir, 0755, true); }
    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
}

// Función para leer DB
function getDB() {
    global $dataFile;
    if (!file_exists($dataFile)) {
        $initialData = [
            'version' => 1,
            'items' => [
                ['name' => 'Leche', 'category' => 'Lácteos/Huevos', 'status' => 'needed', 'note' => ''],
                ['name' => 'Pan', 'category' => 'Panadería', 'status' => 'stocked', 'note' => '']
            ]
        ];
        saveDB($initialData);
        return $initialData;
    }
    return json_decode(file_get_contents($dataFile), true);
}

// Manejar GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(getDB());
    exit();
}

// Manejar POST (Guardar)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $currentDB = getDB();
    
    // Optimistic Locking: Verificar versión
    if ((int)$input['version'] !== (int)$currentDB['version']) {
        http_response_code(409); // Conflicto
        echo json_encode(['status' => 'conflict', 'latest' => $currentDB]);
        exit();
    }
    
    $newState = [
        'version' => $currentDB['version'] + 1,
        'items' => $input['items']
    ];

    saveDB($newState);
    echo json_encode(['status' => 'success', 'newVersion' => $newState['version']]);
    exit();
}
?>