<?php
require_once __DIR__ . '/session.php';
startSession();

// --- 1. AUTENTICACIÓN ---
if (file_exists(__DIR__ . '/auth.php')) {
    require_once __DIR__ . '/auth.php';
}

// Login (con límite de intentos por IP)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
    $wait = loginLockRemaining();
    if ($wait > 0) {
        $error = 'Demasiados intentos fallidos. Espera ' . ceil($wait / 60) . ' min.';
    } elseif (isset($stored_hash) && password_verify($_POST['password'], $stored_hash)) {
        loginSucceeded();
        loginSession();
        header('Location: ' . $_SERVER['SCRIPT_NAME']);
        exit();
    } else {
        loginFailed();
        sleep(1); // frena los intentos automáticos
        $error = "Contraseña incorrecta";
    }
}

// Logout (por POST: con GET cualquier página podía cerrar la sesión con un <img>)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['logout'])) {
    logoutSession();
    header('Location: ' . $_SERVER['SCRIPT_NAME']);
    exit();
}

// Cache-buster por fecha de modificación: el navegador reutiliza su caché
// hasta que el archivo cambia en el servidor.
function asset($file) { return $file . '?v=' . filemtime(__DIR__ . '/' . $file); }

// Opciones de categoría para los <select> (las categorías viven en config.php)
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
if (!isAuthenticated()) {
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Entrar | Gestor del Hogar</title>
        <link rel="stylesheet" href="<?php echo asset('style.css'); ?>">
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Gestor del Hogar</title>
    <link rel="stylesheet" href="<?php echo asset('style.css'); ?>">
</head>
<body>
    <canvas id="bg-canvas" aria-hidden="true"></canvas>

    <div class="app-container">
        <header class="app-topbar">
            <h1>Gestor del Hogar</h1>
            <form method="POST" class="topbar-logout-form">
                <button type="submit" name="logout" value="1" class="topbar-logout" title="Salir" aria-label="Salir">
                    <svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                </button>
            </form>
        </header>

        <!-- Falta: lo que se acabó o falta comprar (se vigila; no todo se compra) -->
        <div id="view-shopping" class="view">
            <div class="filter-chips" id="falta-filter" role="radiogroup" aria-label="Mostrar">
                <button type="button" class="chip" role="radio" data-filter="all">Todo</button>
                <button type="button" class="chip" role="radio" data-filter="regular">Regular</button>
                <button type="button" class="chip" role="radio" data-filter="once">Una vez</button>
            </div>
            <div id="shopping-list-render"></div>
        </div>

        <!-- Canasta: lo elegido para esta compra -->
        <div id="view-basket" class="view hidden">
            <div id="basket-list-render"></div>
        </div>

        <div id="view-inventory" class="view hidden">
            <div id="inventory-list-render"></div>
        </div>

        <div id="view-books" class="view hidden">
            <div id="books-list-render"></div>
        </div>
    </div>

    <!-- Barra de total (solo en Canasta) -->
    <div id="total-bar" class="total-bar">
        <div class="total-info">
            <span class="total-label">Total canasta</span>
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
            <svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/></svg>
            <span class="bn-label">Falta</span>
        </button>
        <button class="bn-item" data-view="basket" onclick="app.setTab('basket')">
            <svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/></svg>
            <span class="bn-label">Canasta</span><span class="bn-badge" id="basket-count" hidden></span>
        </button>
        <button class="bn-item" data-view="inventory" onclick="app.setTab('inventory')">
            <svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/></svg>
            <span class="bn-label">Inventario</span>
        </button>
        <button class="bn-item" data-view="books" onclick="app.setTab('books')">
            <svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>
            <span class="bn-label">Libros</span>
        </button>
        <button class="bn-item" onclick="app.openAddSheet()">
            <svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            <span class="bn-label">Agregar</span>
        </button>
    </nav>

    <!-- Backdrop de sheets -->
    <div id="sheet-backdrop" class="sheet-backdrop" onclick="app.closeSheets()"></div>

    <!-- Sheet: Agregar -->
    <div id="add-sheet" class="sheet" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="add-sheet-title">
        <div class="sheet-handle"></div>
        <h3 class="sheet-title" id="add-sheet-title">Agregar artículo</h3>
        <form class="form" onsubmit="app.addItem(event)">
            <div class="field">
                <span class="field-label">Producto <span class="opt">(opcional)</span></span>
                <div class="barcode-list" id="new-barcodes"></div>
                <button type="button" class="btn-scan" onclick="app.scanForAdd()"><svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 5v14"/><path d="M8 5v14"/><path d="M12 5v14"/><path d="M17 5v14"/><path d="M21 5v14"/></svg><span>Escanear producto</span></button>
            </div>
            <div class="field">
                <span class="field-label" id="new-icon-label">Imagen <span class="opt">(opcional)</span></span>
                <div class="icon-picker" id="new-icon-picker" role="group" aria-labelledby="new-icon-label">
                    <div class="ip-preview" aria-hidden="true"></div>
                    <div class="ip-actions">
                        <label class="ip-btn ip-camera" title="Tomar foto"><input type="file" accept="image/*" capture="environment" aria-label="Tomar foto"><svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></label>
                        <label class="ip-btn ip-upload" title="Subir imagen"><input type="file" accept="image/*" aria-label="Subir imagen"><svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg><span class="ip-upload-text">Subir</span></label>
                        <button type="button" class="ip-btn ip-crop" title="Recortar" aria-label="Recortar imagen" hidden><svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg></button>
                        <button type="button" class="ip-remove" hidden>Quitar</button>
                    </div>
                    <span class="ip-status" aria-live="polite"></span>
                </div>
            </div>
            <div class="field">
                <label for="new-name">Nombre</label>
                <input type="text" id="new-name" placeholder="Ej. Leche" required>
            </div>
            <div class="field" id="new-author-field" hidden>
                <label for="new-author">Autor <span class="opt">(opcional)</span></label>
                <input type="text" id="new-author" placeholder="Ej. Gabriel García Márquez" autocomplete="off">
            </div>
            <div class="field" id="new-cat-field">
                <label for="new-cat">Categoría</label>
                <select id="new-cat"><?php echo catOptions(array_values(array_diff(CATS, ['Libros']))); ?></select>
            </div>
            <div class="field">
                <span class="field-label" id="new-list-label">Lista</span>
                <div class="seg" id="new-list" role="radiogroup" aria-labelledby="new-list-label">
                    <button type="button" class="seg-opt" role="radio" data-list="regular">Regular <span class="seg-sub">se repone</span></button>
                    <button type="button" class="seg-opt" role="radio" data-list="once">Una vez</button>
                    <button type="button" class="seg-opt" role="radio" data-list="books">Libro</button>
                </div>
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
    <div id="edit-sheet" class="sheet" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="edit-sheet-title">
        <div class="sheet-handle"></div>
        <h3 class="sheet-title" id="edit-sheet-title">Editar artículo</h3>
        <form class="form" onsubmit="app.saveEdit(event)">
            <input type="hidden" id="edit-original-name">
            <div class="field">
                <label for="edit-name">Nombre</label>
                <input type="text" id="edit-name" required>
            </div>
            <div class="field" id="edit-author-field" hidden>
                <label for="edit-author">Autor <span class="opt">(opcional)</span></label>
                <input type="text" id="edit-author" placeholder="Ej. Gabriel García Márquez" autocomplete="off">
            </div>
            <div class="field" id="edit-cat-field">
                <label for="edit-cat">Categoría</label>
                <select id="edit-cat"><?php echo catOptions(array_values(array_diff(CATS, ['Libros']))); ?></select>
            </div>
            <div class="field">
                <span class="field-label" id="edit-list-label">Lista</span>
                <div class="seg" id="edit-list" role="radiogroup" aria-labelledby="edit-list-label">
                    <button type="button" class="seg-opt" role="radio" data-list="regular">Regular <span class="seg-sub">se repone</span></button>
                    <button type="button" class="seg-opt" role="radio" data-list="once">Una vez</button>
                    <button type="button" class="seg-opt" role="radio" data-list="books">Libro</button>
                </div>
            </div>
            <div class="field" id="edit-level-field">
                <div class="level-head">
                    <span class="field-label" id="edit-level-label">Cuánto queda en casa</span>
                    <label class="switch"><input type="checkbox" id="edit-level-on"><span class="switch-ui" aria-hidden="true"></span><span class="switch-text">Medir</span></label>
                </div>
                <div class="level-control" id="edit-level-control">
                    <input type="range" id="edit-level" min="0" max="100" step="10" value="100" aria-labelledby="edit-level-label">
                    <output id="edit-level-out" for="edit-level" class="level-out">100%</output>
                </div>
            </div>
            <div class="field">
                <label for="edit-price">Precio <span class="opt">(opcional)</span></label>
                <input type="number" id="edit-price" placeholder="0.00" step="0.01" inputmode="decimal">
            </div>
            <div class="field">
                <label for="edit-note">Nota <span class="opt">(opcional)</span></label>
                <input type="text" id="edit-note" placeholder="Marca, tamaño…">
            </div>
            <div class="field">
                <span class="field-label" id="edit-icon-label">Imagen <span class="opt">(opcional)</span></span>
                <div class="icon-picker" id="edit-icon-picker" role="group" aria-labelledby="edit-icon-label">
                    <div class="ip-preview" aria-hidden="true"></div>
                    <div class="ip-actions">
                        <label class="ip-btn ip-camera" title="Tomar foto"><input type="file" accept="image/*" capture="environment" aria-label="Tomar foto"><svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></label>
                        <label class="ip-btn ip-upload" title="Subir imagen"><input type="file" accept="image/*" aria-label="Subir imagen"><svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg><span class="ip-upload-text">Subir</span></label>
                        <button type="button" class="ip-btn ip-crop" title="Recortar" aria-label="Recortar imagen" hidden><svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg></button>
                        <button type="button" class="ip-remove" hidden>Quitar</button>
                    </div>
                    <span class="ip-status" aria-live="polite"></span>
                </div>
            </div>
            <div class="field">
                <span class="field-label">Productos <span class="opt">(códigos de barras)</span></span>
                <div class="barcode-list" id="edit-barcodes"></div>
                <button type="button" class="btn-scan" onclick="app.scanForEdit()"><svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 5v14"/><path d="M8 5v14"/><path d="M12 5v14"/><path d="M17 5v14"/><path d="M21 5v14"/></svg><span>Escanear producto</span></button>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="app.closeSheets()">Cancelar</button>
                <button type="submit" class="btn-primary">Guardar</button>
            </div>
        </form>
    </div>

    <!-- Sheet: ajustar cuánto queda -->
    <div id="level-sheet" class="sheet" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="level-sheet-title">
        <div class="sheet-handle"></div>
        <h3 class="sheet-title" id="level-sheet-title">¿Cuánto queda?</h3>
        <form class="form" onsubmit="app.saveLevel(event)">
            <input type="hidden" id="level-name">
            <output id="level-out" class="level-big" for="level-range">50%</output>
            <input type="range" id="level-range" class="level-range-big" min="0" max="100" step="10" aria-labelledby="level-sheet-title">
            <div class="level-ticks" aria-hidden="true"><span>0%</span><span>50%</span><span>100%</span></div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="app.closeSheets()">Cancelar</button>
                <button type="submit" class="btn-primary">Guardar</button>
            </div>
        </form>
    </div>

    <!-- Vista previa de la imagen de un artículo -->
    <div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-caption" hidden onclick="app.closeLightbox()">
        <button type="button" class="lightbox-close" aria-label="Cerrar vista previa"><svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
        <div class="lightbox-card" onclick="event.stopPropagation()">
            <div class="lightbox-media"><img id="lightbox-img" alt=""><span class="lightbox-noimg" id="lightbox-noimg" hidden></span></div>
            <h3 id="lightbox-caption" class="lightbox-caption"></h3>
            <p class="lightbox-sub" id="lightbox-sub"></p>
            <div class="lightbox-info" id="lightbox-info" aria-live="polite"></div>
        </div>
    </div>

    <!-- Recortar imagen -->
    <div id="cropper" class="cropper" role="dialog" aria-modal="true" aria-labelledby="cropper-title" hidden>
        <div class="scanner-top">
            <h3 id="cropper-title">Recortar imagen</h3>
            <button type="button" class="scanner-close" aria-label="Cancelar recorte" onclick="app.closeCropper(null)"><svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
        </div>
        <div class="crop-area">
            <div class="crop-stage" id="crop-stage" tabindex="0" aria-label="Imagen a recortar. Flechas para mover, más y menos para acercar.">
                <img id="crop-img" alt="" draggable="false">
                <div class="crop-frame" aria-hidden="true"></div>
            </div>
        </div>
        <div class="crop-controls">
            <label for="crop-zoom" class="crop-zoom-label">Zoom</label>
            <input type="range" id="crop-zoom" min="1" max="4" step="0.01" value="1">
        </div>
        <p class="scanner-status">Arrastra para mover · pellizca o usa la barra para acercar</p>
        <div class="crop-actions">
            <button type="button" class="crop-cancel" onclick="app.closeCropper(null)">Cancelar</button>
            <button type="button" class="crop-use" onclick="app.useCrop()">Usar recorte</button>
        </div>
    </div>

    <!-- Escáner de códigos de barras -->
    <div id="scanner" class="scanner" role="dialog" aria-modal="true" aria-labelledby="scanner-title" hidden>
        <div class="scanner-top">
            <h3 id="scanner-title">Escanear producto</h3>
            <button type="button" id="scanner-torch" class="scanner-torch" aria-label="Linterna" aria-pressed="false" onclick="app.toggleTorch()" hidden>
                <svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6c0 2-2 2-2 4v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4V2h12z"/><line x1="6" x2="18" y1="6" y2="6"/><line x1="12" x2="12" y1="12" y2="12"/></svg>
            </button>
            <button type="button" class="scanner-close" aria-label="Cerrar escáner" onclick="app.closeScanner(null)">
                <svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
        </div>
        <div class="scanner-view">
            <video id="scanner-video" playsinline muted></video>
            <div class="scanner-guide" aria-hidden="true"></div>
        </div>
        <p class="scanner-status" id="scanner-status" aria-live="polite"></p>
        <form class="scanner-manual" onsubmit="app.scanManual(event)">
            <label for="scanner-code" class="sr-only">Número del código de barras</label>
            <input type="text" id="scanner-code" inputmode="numeric" autocomplete="off" placeholder="…o escribe el número">
            <button type="submit">Usar</button>
        </form>
    </div>

    <div id="toast" class="toast" role="status" aria-live="polite">Guardado</div>

    <script><?php echo $WAVES_JS; ?></script>
    <script src="<?php echo asset('app.js'); ?>"></script>
</body>
</html>
