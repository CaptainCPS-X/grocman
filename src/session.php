<?php
// Sesión de grocman, compartida por index.php y api.php.
//
// Nombre y ruta de cookie propios para no compartir la sesión con otras apps
// del mismo dominio: payman (/pagos/) usaba también PHPSESSID con path=/ y la
// misma clave 'authenticated', así que entrar en una abría la otra.
require_once __DIR__ . '/config.php';

function sessionDir() { return __DIR__ . '/data/sessions'; }

function startSession() {
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    $path = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'])), '/') . '/';
    // Sesiones en data/sessions (bloqueado por .htaccess). En el directorio
    // compartido del hosting el recolector de PHP las borraba a los ~24 min,
    // y la app dejaba de funcionar con el teléfono bloqueado un rato.
    $dir = sessionDir();
    if (!is_dir($dir)) { @mkdir($dir, 0700, true); }
    if (is_dir($dir) && is_writable($dir)) {
        session_save_path($dir);
        ini_set('session.gc_maxlifetime', (string)SESSION_IDLE_LIMIT);
    }
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

// ¿Hay sesión iniciada? Caduca tras SESSION_IDLE_LIMIT sin usar la app.
// $touch = false para las consultas automáticas (el poll de la lista), que no
// cuentan como uso: si no, una pestaña abierta mantendría la sesión para siempre.
function isAuthenticated($touch = true) {
    if (($_SESSION['grocman_auth'] ?? false) !== true) { return false; }
    if (time() - ($_SESSION['last_activity'] ?? 0) > SESSION_IDLE_LIMIT) {
        logoutSession();
        return false;
    }
    if ($touch) { $_SESSION['last_activity'] = time(); }
    return true;
}

function loginSession() {
    session_regenerate_id(true); // evita session fixation
    $_SESSION['grocman_auth'] = true;
    $_SESSION['last_activity'] = time();
    // Limpieza de sesiones viejas de data/sessions (el hosting puede tener el
    // recolector de PHP desactivado para rutas propias).
    foreach (glob(sessionDir() . '/sess_*') ?: [] as $f) {
        if (filemtime($f) < time() - SESSION_IDLE_LIMIT) { @unlink($f); }
    }
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

// --- Límite de intentos de login (por IP, en data/login_attempts.json) ---
// $fn recibe el mapa { ip: { fails, last, until } } por referencia.
function withLoginAttempts(callable $fn) {
    $all = [];
    $fh = @fopen(__DIR__ . '/data/login_attempts.json', 'c+');
    if (!$fh || !flock($fh, LOCK_EX)) { return $fn($all); }
    $all = json_decode(stream_get_contents($fh), true) ?: [];
    $now = time();
    foreach ($all as $ip => $a) {
        if (($a['last'] ?? 0) < $now - 86400 && ($a['until'] ?? 0) < $now) { unset($all[$ip]); }
    }
    $result = $fn($all);
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($all));
    fflush($fh);
    flock($fh, LOCK_UN);
    fclose($fh);
    return $result;
}

function clientIp() { return $_SERVER['REMOTE_ADDR'] ?? 'unknown'; }

// Segundos que faltan para poder intentar de nuevo (0 = puede intentar).
function loginLockRemaining() {
    return withLoginAttempts(function (&$all) {
        return max(($all[clientIp()]['until'] ?? 0) - time(), 0);
    });
}

function loginFailed() {
    withLoginAttempts(function (&$all) {
        $ip = clientIp();
        $a = $all[$ip] ?? ['fails' => 0];
        $a['fails'] = ($a['fails'] ?? 0) + 1;
        $a['last'] = time();
        if ($a['fails'] >= LOGIN_MAX_FAILS) {
            $a['until'] = time() + LOGIN_LOCK_SECONDS;
            $a['fails'] = 0;
        }
        $all[$ip] = $a;
    });
}

function loginSucceeded() {
    withLoginAttempts(function (&$all) { unset($all[clientIp()]); });
}
