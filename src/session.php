<?php
// Sesión de grocman, compartida por index.php y api.php.
//
// Nombre y ruta de cookie propios para no compartir la sesión con otras apps
// del mismo dominio: payman (/pagos/) usaba también PHPSESSID con path=/ y la
// misma clave 'authenticated', así que entrar en una abría la otra.

function startSession() {
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    $path = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'])), '/') . '/';
    session_name('GROCMANSESS');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => $path,
        'secure' => $https,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function isAuthenticated() {
    return ($_SESSION['grocman_auth'] ?? false) === true;
}

function loginSession() {
    session_regenerate_id(true); // evita session fixation
    $_SESSION['grocman_auth'] = true;
}

function logoutSession() {
    $_SESSION = [];
    $p = session_get_cookie_params();
    setcookie(session_name(), '', [
        'expires' => time() - 3600,
        'path' => $p['path'],
        'secure' => $p['secure'],
        'httponly' => $p['httponly'],
        'samesite' => $p['samesite'],
    ]);
    session_destroy();
}
