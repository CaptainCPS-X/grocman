# Grocman — Gestor del Hogar

Aplicación web personal para la **lista de compra** y el **inventario** de casa.
PHP puro (sin framework) + JavaScript vanilla + CSS. Los datos se guardan en un
archivo JSON plano.

## Secciones

- **Lista de compra:** los artículos por comprar, agrupados por categoría.
  Tocar un artículo lo pasa al **carrito** (✓); "Finalizar compra" mueve el
  carrito al inventario. Muestra el total y el subtotal del carrito.
- **Inventario:** los artículos que se reponen, con su categoría y precio.
  Marca "Ya tengo" / "+ Pedir" para mover entre en casa (`stocked`) y por
  comprar (`needed`). Alta, edición y borrado. Si se mide **cuánto queda**
  (Editar → "Medir", de 10 en 10 %), se ve una barrita con borde animado
  (verde / ámbar / rojo); tocarla abre un ajuste rápido. Al comprar el
  artículo vuelve a 100 %.
- **Una vez:** compras que no se reponen (un escurridor, etc.). Mientras están
  por comprar aparecen también en la lista normal con la etiqueta "Una vez";
  al finalizar la compra quedan guardadas aquí para volver a pedirlas. Un
  artículo cambia de lista desde Editar → "Lista".

Cada artículo tiene un estado: `needed` (por comprar) → `in_cart` (en el
carrito) → `stocked` (en casa).

### Productos y escáner de códigos de barras

Cada artículo puede tener varios **productos equivalentes** asociados por su
código de barras (p. ej. "Leche" → galón Horizon, galón Great Value). En
*Agregar* o *Editar* → **Escanear producto** se abre la cámara:

- Lector nativo del navegador (`BarcodeDetector`, Android/Chrome) o, si no
  existe (iPhone), **ZXing** (`src/vendor/`, Apache-2.0), que se carga solo al
  abrir el escáner. También se puede escribir el número.
- Se aceptan EAN-13, EAN-8, UPC-A, UPC-E e ITF-14 con dígito de control válido,
  normalizados (UPC-A → EAN-13, UPC-E → UPC-A) para que el mismo producto tenga
  siempre el mismo código. Cada código pertenece a un solo artículo.
- El nombre del producto se busca en **Open Food Facts** (y, si no está, en Open
  Beauty Facts y Open Products Facts) directamente desde el navegador; solo se
  envía el número del código. En *Agregar* rellena el nombre y la categoría.
- Si no está en ninguna (casi siempre: limpieza y cuidado personal), el
  servidor consulta **UPCitemdb** (`api.php?lookup=<código>`; su API no permite
  CORS). Plan gratuito: 100 consultas/día, así que cada código se consulta una
  sola vez y la respuesta queda en `data/products.json`. Sus fotos se sirven a
  través del servidor (`api.php?productImage=<código>`), solo las URL que
  UPCitemdb devolvió para ese código y solo hacia servidores públicos.
- El nombre del producto se puede escribir o corregir en su ficha.

### Imágenes de los artículos

Cada artículo puede tener una imagen (`[imagen] Leche` en la lista y el
inventario); sin imagen se muestra el icono de su categoría. Tocar la imagen
la muestra en grande (vista previa). Se sube desde
*Agregar* / *Editar* (galería o cámara) o, al escanear un producto, se usa su
foto del producto si el artículo aún no tiene imagen. El teléfono la ajusta
a 128×128 (PNG, `data/icons/<id>.png`) y a 640 px (JPEG, `<id>-l.jpg`, para la
vista previa); se sirve solo con
sesión (`api.php?icon=<id>`). Las imágenes que ningún artículo usa se borran
solas tras 1 h. No entran en el backup diario de `items.json`.

## Estructura

| Archivo | Rol |
|---|---|
| `src/index.php` | Login (sesión PHP) y renderizado de la SPA. |
| `src/config.php` | Categorías, estados y límites (sesión, login). |
| `src/session.php` | Sesión propia (`GROCMANSESS`, ruta `/compra/`, guardada en `data/sessions/`), caducidad tras 7 días sin uso y límite de intentos de login. |
| `src/auth.php` | Hash bcrypt de la contraseña. **No versionado.** |
| `src/api.php` | API JSON: `GET` lee, `POST` guarda (solo `application/json`, artículos validados). Versionado optimista con `409 Conflict`; escritura atómica con bloqueo y backup diario. |
| `src/app.js` | Lógica de UI: lista, inventario, carrito, totales, CRUD. Guardado en cola con reintento automático ante conflictos; poll de 10 s (pausado en segundo plano). |
| `src/style.css` | Estilos. |
| `src/data/` | Directorio de la base de datos, separado del código. |
| `src/data/items.json` | "Base de datos" (artículos). **No versionado.** |
| `src/vendor/` | ZXing (lector de códigos de barras para navegadores sin lector nativo). |
| `src/data/.htaccess` | Bloquea el acceso web directo a la base de datos. |
| `tests/smoke.mjs` | Prueba de humo de la API y el login: `node tests/smoke.mjs`. |

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
