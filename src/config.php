<?php
// Configuración compartida por index.php y api.php.

// Categorías (única fuente de verdad: los <select> y la validación de la API).
const CATS = ['Proteínas', 'Lácteos/Huevos', 'Frutas/Verduras', 'Panadería', 'Bebidas', 'Limpieza', 'Despensa', 'Higiene', 'Otros'];
const STATUSES = ['needed', 'in_cart', 'stocked'];

const SESSION_IDLE_LIMIT = 604800;   // 7 días sin usar la app → hay que volver a entrar
const LOGIN_MAX_FAILS = 5;           // intentos fallidos antes de bloquear
const LOGIN_LOCK_SECONDS = 900;      // bloqueo de 15 minutos

const ITEM_NAME_MAX = 120;
const ITEM_NOTE_MAX = 500;
