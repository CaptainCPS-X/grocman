<?php
// Configuración compartida por index.php y api.php.

// Categorías (única fuente de verdad: los <select> y la validación de la API),
// en el orden en que se muestran. 'Libros' solo la usan los libros.
const CATS = [
    'Frutas y Verduras', 'Carnes y Mariscos', 'Lácteos y Huevos', 'Panadería', 'Congelados',
    'Granos y Pastas', 'Desayuno y Cereales', 'Bebidas', 'Especias y Condimentos', 'Salsas y Aderezos',
    'Despensa', 'Cuidado Personal', 'Salud y Farmacia', 'Limpieza y Hogar', 'Otros', 'Libros',
];
// Nombres antiguos → nuevos (los datos guardados y los teléfonos con la versión
// anterior en caché siguen funcionando: nada termina en "Otros" por el cambio).
const LEGACY_CATS = [
    'Proteínas' => 'Carnes y Mariscos',
    'Lácteos/Huevos' => 'Lácteos y Huevos',
    'Frutas/Verduras' => 'Frutas y Verduras',
    'Higiene' => 'Cuidado Personal',
    'Limpieza' => 'Limpieza y Hogar',
];
const STATUSES = ['needed', 'in_cart', 'stocked'];

const SESSION_IDLE_LIMIT = 604800;   // 7 días sin usar la app → hay que volver a entrar
const LOGIN_MAX_FAILS = 5;           // intentos fallidos antes de bloquear
const LOGIN_LOCK_SECONDS = 900;      // bloqueo de 15 minutos

const ITEM_NAME_MAX = 120;
const ITEM_NOTE_MAX = 500;
const ITEM_BARCODES_MAX = 30;       // productos asociados por artículo
const BARCODE_LABEL_MAX = 200;
const LISTS = ['regular', 'once', 'books'];   // se repone / compra de una vez / libros
