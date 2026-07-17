<?php
session_start();

// --- 1. AUTENTICACIÓN ---
if (file_exists('auth.php')) {
    require_once 'auth.php';
} else {
    // Hash por defecto (clave: admin) si no existe auth.php
    $stored_hash = '$2y$10$8.w.y.y.y.y.y.y.y.y.y.y.y.y.y.y.y.y.y.y.y'; 
}

// Login Logic
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
    if (isset($stored_hash) && password_verify($_POST['password'], $stored_hash)) {
        $_SESSION['authenticated'] = true;
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit();
    } else {
        $error = "Contraseña incorrecta";
    }
}

// Logout Logic
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit();
}

// Check Auth
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Login | Hogar</title>
        <style>
            body { font-family: sans-serif; background: #f0f2f5; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .login-box { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; width: 90%; max-width: 350px; }
            input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; }
            button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
            .error { color: red; margin-bottom: 10px; }
        </style>
    </head>
    <body>
        <div class="login-box">
            <h2>Gestor del Hogar</h2>
            <?php if(isset($error)) echo "<div class='error'>$error</div>"; ?>
            <form method="POST">
                <input type="password" name="password" placeholder="Contraseña" required autofocus>
                <button type="submit">Entrar</button>
            </form>
        </div>
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Hogar | Lista</title>
    <link rel="stylesheet" href="style.css?v=<?php echo time(); ?>">
</head>
<body>

    <header class="app-header">
        <h1>Gestor Hogar</h1>
        <a href="?logout" class="logout-link">Salir</a>
    </header>

    <nav class="tabs">
        <button class="tab-btn active" onclick="app.setTab('shopping')">Lista de Compra</button>
        <button class="tab-btn" onclick="app.setTab('inventory')">Inventario</button>
    </nav>

    <div id="view-shopping" class="container">
        <div id="shopping-list-render">Cargando...</div>
    </div>

    <div id="view-inventory" class="container hidden">
        <div class="add-panel">
            <h3 style="margin-top:0">Agregar Nuevo</h3>
            <form onsubmit="app.addItem(event)">
                <div class="form-group"><input type="text" id="new-name" placeholder="Nombre (ej. Leche)" required></div>
                <div class="form-group">
                    <select id="new-cat">
                        <option value="Proteínas">Proteínas</option>
                        <option value="Lácteos/Huevos">Lácteos/Huevos</option>
                        <option value="Frutas/Verduras">Frutas/Verduras</option>
                        <option value="Panadería">Panadería</option>
                        <option value="Bebidas">Bebidas</option>
                        <option value="Limpieza">Limpieza</option>
                        <option value="Despensa">Despensa</option>
                        <option value="Higiene">Higiene</option>
                        <option value="Otros">Otros</option>
                    </select>
                </div>
                <div class="form-group">
                    <input type="number" id="new-price" placeholder="Precio Estimado (opcional)" step="0.01">
                </div>
                <div class="form-group"><input type="text" id="new-note" placeholder="Nota (opcional)"></div>
                <button type="submit" class="btn-submit">Guardar</button>
            </form>
        </div>
        <div id="inventory-list-render"></div>
    </div>

    <div id="modal-overlay" class="modal-overlay hidden" onclick="app.closeModal()"></div>
    <div id="edit-modal" class="modal hidden">
        <h3>Editar Artículo</h3>
        <form onsubmit="app.saveEdit(event)">
            <input type="hidden" id="edit-original-name">
            
            <div class="form-group">
                <label style="font-size:0.8rem; font-weight:bold;">Nombre</label>
                <input type="text" id="edit-name" required>
            </div>
            <div class="form-group">
                <label style="font-size:0.8rem; font-weight:bold;">Categoría</label>
                <select id="edit-cat">
                    <option value="Proteínas">Proteínas</option>
                    <option value="Lácteos/Huevos">Lácteos/Huevos</option>
                    <option value="Frutas/Verduras">Frutas/Verduras</option>
                    <option value="Panadería">Panadería</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Limpieza">Limpieza</option>
                    <option value="Despensa">Despensa</option>
                    <option value="Higiene">Higiene</option>
                    <option value="Otros">Otros</option>
                </select>
            </div>
            <div class="form-group">
                <label style="font-size:0.8rem; font-weight:bold;">Precio Estimado</label>
                <input type="number" id="edit-price" step="0.01">
            </div>
            <div class="form-group">
                <label style="font-size:0.8rem; font-weight:bold;">Nota</label>
                <input type="text" id="edit-note" placeholder="Nota (opcional)">
            </div>
            
            <div style="display:flex; gap:10px; margin-top:20px;">
                <button type="button" class="btn-cancel" onclick="app.closeModal()">Cancelar</button>
                <button type="submit" class="btn-submit">Guardar Cambios</button>
            </div>
        </form>
    </div>

    <div id="total-bar" class="total-bar">
        <div class="total-info">
            <span class="total-label">Total Lista</span>
            <span class="total-amount" id="total-amount">$0.00</span>
            <span class="cart-subtotal" id="cart-subtotal" style="display:none;">(En carrito: $0.00)</span>
        </div>
        <button id="btn-checkout" class="btn-checkout" onclick="app.checkout()">
            Finalizar Compra
        </button>
    </div>

    <div id="toast" class="toast">Guardado</div>

    <script src="app.js?v=<?php echo time(); ?>"></script>
</body>
</html>