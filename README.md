# Grocman — Gestor del Hogar

Aplicación web personal para la **lista de compra** y el **inventario** de casa.
PHP puro (sin framework) + JavaScript vanilla + CSS. Los datos se guardan en un
archivo JSON plano.

## Secciones

- **Lista de compra:** los artículos por comprar, agrupados por categoría.
  Tocar un artículo lo pasa al **carrito** (✓); "Finalizar compra" mueve el
  carrito al inventario. Muestra el total y el subtotal del carrito.
- **Inventario:** todos los artículos con su categoría y precio. Marca
  "Ya tengo" / "+ Pedir" para mover entre en casa (`stocked`) y por comprar
  (`needed`). Alta, edición y borrado.

Cada artículo tiene un estado: `needed` (por comprar) → `in_cart` (en el
carrito) → `stocked` (en casa).

## Estructura

| Archivo | Rol |
|---|---|
| `src/index.php` | Login (sesión PHP) y renderizado de la SPA. |
| `src/auth.php` | Hash bcrypt de la contraseña. **No versionado.** |
| `src/api.php` | API JSON: `GET` lee, `POST` guarda. Versionado optimista con `409 Conflict`. |
| `src/app.js` | Lógica de UI: lista, inventario, carrito, totales, CRUD. |
| `src/style.css` | Estilos. |
| `src/data/` | Directorio de la base de datos, separado del código. |
| `src/data/items.json` | "Base de datos" (artículos). **No versionado.** |
| `src/data/.htaccess` | Bloquea el acceso web directo a la base de datos. |

> La base de datos vive en `src/data/` para que al subir el código al servidor
> puedas sobreescribir los archivos de `src/` sin tocar `src/data/`.

## Puesta en marcha

1. Copia las plantillas y complétalas:
   ```sh
   cp src/auth.sample.php src/auth.php
   cp src/data/items.sample.json src/data/items.json
   ```
2. Genera el hash de tu contraseña y ponlo en `src/auth.php`:
   ```sh
   php -r "echo password_hash('TU_CONTRASENA', PASSWORD_DEFAULT), PHP_EOL;"
   ```
3. Sirve `src/` con PHP:
   ```sh
   php -S localhost:8000 -t src
   ```
4. Abre http://localhost:8000 e ingresa la contraseña.

## Notas

- `data/items.json` y `auth.php` están en `.gitignore`: contienen datos reales
  y la credencial de acceso. La copia viva de producción reside en el servidor.
- Al desplegar, sube solo los archivos de código de `src/`. No sobreescribas
  `src/data/items.json`.
