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
(function () {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W, H, dpr;
    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = canvas.width = innerWidth * dpr;
        H = canvas.height = innerHeight * dpr;
        canvas.style.width = innerWidth + 'px';
        canvas.style.height = innerHeight + 'px';
    }
    resize();
    addEventListener('resize', resize);
    const ribbons = [
        { amp: 0.10, len: 0.9, speed: 0.00022, y: 0.44, hue: 'rgba(99,140,255,0.20)', off: 0 },
        { amp: 0.08, len: 1.2, speed: 0.00030, y: 0.56, hue: 'rgba(160,120,255,0.17)', off: 2 },
        { amp: 0.12, len: 0.7, speed: 0.00018, y: 0.70, hue: 'rgba(110,210,255,0.15)', off: 4 }
    ];
    const particles = Array.from({ length: 34 }, () => ({
        x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + 0.5, s: Math.random() * 0.00006 + 0.00002
    }));
    function draw(t) {
        ctx.clearRect(0, 0, W, H);
        ribbons.forEach(function (r) {
            ctx.beginPath();
            const baseY = H * r.y;
            for (let i = 0; i <= 40; i++) {
                const x = (i / 40) * W;
                const y = baseY + Math.sin(t * r.speed + i * r.len * 0.35 + r.off) * H * r.amp;
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
            ctx.fillStyle = r.hue; ctx.fill();
        });
        particles.forEach(function (p) {
            p.y -= p.s * (reduce ? 0 : 1);
            if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
            ctx.beginPath();
            ctx.arc(p.x * W, p.y * H, p.r * dpr, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
        });
    }
    let raf, running = true;
    function loop(t) { if (!running) return; draw(t); raf = requestAnimationFrame(loop); }
    if (reduce) { draw(0); }
    else {
        loop(0);
        document.addEventListener('visibilitychange', function () {
            running = !document.hidden;
            if (running) raf = requestAnimationFrame(loop); else cancelAnimationFrame(raf);
        });
    }
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
