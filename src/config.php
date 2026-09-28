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
// Listas: las define el usuario (se guardan en items.json). Tres tipos:
//   restock    se repone: Falta + Inventario, con nivel de stock (p. ej. Hogar)
//   single     compra única: Falta hasta comprarla, luego queda guardada
//   collection colección / deseos: solo en su sección (lo quiero / lo tengo)
const LIST_TYPES = ['restock', 'single', 'collection'];
const LIST_ICONS = ['house', 'tag', 'book', 'gift', 'plane', 'heart', 'star', 'pill', 'shirt', 'wrench', 'paw', 'sprout', 'briefcase', 'gamepad', 'cart', 'utensils'];
const LISTS_MAX = 30;
// Listas iniciales. 'regular' (Hogar) es obligatoria: no se puede borrar ni cambiar de tipo.
const DEFAULT_LISTS = [
    ['id' => 'regular', 'name' => 'Hogar', 'type' => 'restock', 'icon' => 'house', 'color' => '#3b82f6'],
    ['id' => 'once', 'name' => 'Una vez', 'type' => 'single', 'icon' => 'tag', 'color' => '#8b5cf6'],
    ['id' => 'books', 'name' => 'Libros', 'type' => 'collection', 'icon' => 'book', 'color' => '#f59e0b'],
];
