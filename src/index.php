<?php
session_start();

// --- 1. AUTENTICACIÓN ---
if (file_exists(__DIR__ . '/auth.php')) {
    require_once __DIR__ . '/auth.php';
}

// Login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
    if (isset($stored_hash) && password_verify($_POST['password'], $stored_hash)) {
        $_SESSION['authenticated'] = true;
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit();
    } else {
        $error = "Contraseña incorrecta";
    }
}

// Logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit();
}

// Categorías (única fuente de verdad para los <select>)
$CATS = ['Proteínas', 'Lácteos/Huevos', 'Frutas/Verduras', 'Panadería', 'Bebidas', 'Limpieza', 'Despensa', 'Higiene', 'Otros'];
function catOptions($cats) {
    $out = '';
    foreach ($cats as $c) {
        $e = htmlspecialchars($c, ENT_QUOTES);
        $out .= "<option value=\"$e\">$e</option>";
    }
    return $out;
}

// Script del fondo de olas (compartido por login y app)
$WAVES_JS = <<<'JS'
// --- Fondo dinámico de olas (canvas), estilo PS3-XMB, con la paleta glass ---
(function () {
    var c = document.getElementById('bg-canvas'); if (!c) return;
    var ctx = c.getContext('2d');
    var reduced = matchMedia('(prefers-reduced-motion: reduce)');
    // Paleta acorde al tema: azul (acento), lila y cian sobre base clara.
    var PAL = { waves: ['0,123,255', '150,110,255', '60,195,230'], part: '90,130,235' };
    var t = Math.random() * 100, parts = [], raf = 0;
    function seed() { var n = Math.round(Math.min(70, innerWidth / 20)); parts = []; for (var i = 0; i < n; i++) parts.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: .8 + Math.random() * 2, vx: .08 + Math.random() * .25, vy: -(.03 + Math.random() * .14), p: Math.random() * Math.PI * 2 }); }
    function resize() { var dpr = Math.min(devicePixelRatio || 1, 2); c.width = Math.round(innerWidth * dpr); c.height = Math.round(innerHeight * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); seed(); }
    // Una cinta translúcida: cresta sinusoidal rellena hasta el borde inferior.
    function ribbon(yMid, amp, freq, speed, phase, rgb, alpha) { var W = innerWidth, H = innerHeight; ctx.beginPath(); ctx.moveTo(0, H); for (var x = 0; x <= W; x += 8) { var k = x / W; var y = yMid + Math.sin(k * freq * Math.PI * 2 + t * speed + phase) * amp + Math.sin(k * freq * 4.7 + t * speed * 1.6 + phase * 2) * amp * .35; ctx.lineTo(x, y); } ctx.lineTo(W, H); ctx.closePath(); var g = ctx.createLinearGradient(0, yMid - amp, 0, H); g.addColorStop(0, 'rgba(' + rgb + ',' + alpha + ')'); g.addColorStop(1, 'rgba(' + rgb + ',0)'); ctx.fillStyle = g; ctx.fill(); }
    function frame() { var W = innerWidth, H = innerHeight; ctx.clearRect(0, 0, W, H); ribbon(H * .55, H * .06, 1.1, .35, 0, PAL.waves[0], .22); ribbon(H * .62, H * .05, 1.6, .5, 2.1, PAL.waves[1], .18); ribbon(H * .70, H * .04, 2.2, .7, 4.2, PAL.waves[2], .14); for (var i = 0; i < parts.length; i++) { var p = parts[i]; p.x += p.vx; p.y += p.vy; p.p += .02; if (p.x > W + 10) p.x = -10; if (p.y < -10) p.y = H + 10; ctx.beginPath(); ctx.fillStyle = 'rgba(' + PAL.part + ',' + (.12 + .35 * (.5 + Math.sin(p.p) / 2)).toFixed(3) + ')'; ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); } t += .016; }
    function loop() { frame(); raf = requestAnimationFrame(loop); }
    resize(); if (reduced.matches) frame(); else loop();
    addEventListener('resize', function () { resize(); if (reduced.matches) frame(); });
    document.addEventListener('visibilitychange', function () { if (reduced.matches) return; cancelAnimationFrame(raf); if (!document.hidden) loop(); });
})();
JS;

// --- 2. PANTALLA DE LOGIN ---
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Entrar | Gestor del Hogar</title>
        <link rel="stylesheet" href="style.css?v=<?php echo time(); ?>">
    </head>
    <body>
        <canvas id="bg-canvas" aria-hidden="true"></canvas>
        <div class="login-container">
            <div class="login-box">
                <div class="login-logo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                </div>
                <h2>Gestor del Hogar</h2>
                <p>Lista de compra e inventario</p>
                <?php if (isset($error)) echo "<div class='error'>" . htmlspecialchars($error) . "</div>"; ?>
                <form method="POST">
                    <input type="password" name="password" placeholder="Contraseña" required autofocus autocomplete="current-password">
                    <button type="submit">Entrar</button>
                </form>
            </div>
        </div>
        <script><?php echo $WAVES_JS; ?></script>
    </body>
    </html>
    <?php
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Gestor del Hogar</title>
    <link rel="stylesheet" href="style.css?v=<?php echo time(); ?>">
</head>
<body>
    <canvas id="bg-canvas" aria-hidden="true"></canvas>

    <div class="app-container">
        <header class="app-topbar">
            <h1>Gestor del Hogar</h1>
            <a href="?logout" class="topbar-logout" title="Salir" aria-label="Salir">
                <svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            </a>
        </header>

        <div id="view-shopping" class="view">
            <div id="shopping-list-render"></div>
        </div>

        <div id="view-inventory" class="view hidden">
            <div id="inventory-list-render"></div>
        </div>
    </div>

    <!-- Barra de total (solo en Lista) -->
    <div id="total-bar" class="total-bar">
        <div class="total-info">
            <span class="total-label">Total lista</span>
            <span class="total-amount" id="total-amount">$0.00</span>
            <span class="cart-subtotal" id="cart-subtotal" style="display:none;">En carrito: $0.00</span>
        </div>
        <button id="btn-checkout" class="btn-checkout" onclick="app.checkout()" style="display:none;">
            <svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span id="checkout-label">Finalizar</span>
        </button>
    </div>

    <!-- Barra inferior flotante -->
    <nav class="bottom-nav">
        <button class="bn-item active" data-view="shopping" onclick="app.setTab('shopping')">
            <svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            <span class="bn-label">Lista</span>
        </button>
        <button class="bn-item" data-view="inventory" onclick="app.setTab('inventory')">
            <svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/></svg>
            <span class="bn-label">Inventario</span>
        </button>
        <button class="bn-item" onclick="app.openAddSheet()">
            <svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            <span class="bn-label">Agregar</span>
        </button>
    </nav>

    <!-- Backdrop de sheets -->
    <div id="sheet-backdrop" class="sheet-backdrop" onclick="app.closeSheets()"></div>

    <!-- Sheet: Agregar -->
    <div id="add-sheet" class="sheet">
        <div class="sheet-handle"></div>
        <h3 class="sheet-title">Agregar artículo</h3>
        <form class="form" onsubmit="app.addItem(event)">
            <div class="field">
                <label for="new-name">Nombre</label>
                <input type="text" id="new-name" placeholder="Ej. Leche" required>
            </div>
            <div class="field">
                <label for="new-cat">Categoría</label>
                <select id="new-cat"><?php echo catOptions($CATS); ?></select>
            </div>
            <div class="field">
                <label for="new-price">Precio <span class="opt">(opcional)</span></label>
                <input type="number" id="new-price" placeholder="0.00" step="0.01" inputmode="decimal">
            </div>
            <div class="field">
                <label for="new-note">Nota <span class="opt">(opcional)</span></label>
                <input type="text" id="new-note" placeholder="Marca, tamaño…">
            </div>
            <button type="submit" class="btn-primary">Agregar a la lista</button>
        </form>
    </div>

    <!-- Sheet: Editar -->
    <div id="edit-sheet" class="sheet">
        <div class="sheet-handle"></div>
        <h3 class="sheet-title">Editar artículo</h3>
        <form class="form" onsubmit="app.saveEdit(event)">
            <input type="hidden" id="edit-original-name">
            <div class="field">
                <label for="edit-name">Nombre</label>
                <input type="text" id="edit-name" required>
            </div>
            <div class="field">
                <label for="edit-cat">Categoría</label>
                <select id="edit-cat"><?php echo catOptions($CATS); ?></select>
            </div>
            <div class="field">
                <label for="edit-price">Precio <span class="opt">(opcional)</span></label>
                <input type="number" id="edit-price" placeholder="0.00" step="0.01" inputmode="decimal">
            </div>
            <div class="field">
                <label for="edit-note">Nota <span class="opt">(opcional)</span></label>
                <input type="text" id="edit-note" placeholder="Marca, tamaño…">
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="app.closeSheets()">Cancelar</button>
                <button type="submit" class="btn-primary">Guardar</button>
            </div>
        </form>
    </div>

    <div id="toast" class="toast">Guardado</div>

    <script><?php echo $WAVES_JS; ?></script>
    <script src="app.js?v=<?php echo time(); ?>"></script>
</body>
</html>
