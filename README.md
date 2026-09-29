# Grocman — Gestor del Hogar

Aplicación web personal para la **lista de compra** y el **inventario** de casa.
PHP puro (sin framework) + JavaScript vanilla + CSS. Los datos se guardan en un
archivo JSON plano.

## Secciones

Barra inferior: **Falta · Canasta · Inventario · Listas · Agregar**.

**Navegación tipo app:** el botón / gesto **Atrás** del teléfono retrocede un
nivel dentro de la app (visor → vista previa → hoja → detalle de la lista →
sección anterior) en vez de salir; en Falta sin nada abierto, sale. Editar
abierto desde la vista previa vuelve a ella. La sección y la lista abiertas van
en la URL (`#listas/books`): al recargar se vuelve al mismo lugar.

- **Falta:** lo que se acabó o falta comprar (se vigila; no todo se compra).
  Agrupado por categoría (plegables) y con un filtro por lista (**Todo**, Hogar,
  Una vez y las listas que se creen); en una lista de compra única también
  aparecen sus artículos ya guardados ("+ Pedir"). Cada fila tiene
  **"+ Canasta"** para elegir lo que se compra esta vez.
- **Canasta:** solo lo elegido para esta compra, con su total. En la tienda se
  marca ✓ lo que va al carrito; **Finalizar** pasa lo marcado a "en casa" (nivel
  a 100 %) y lo no encontrado se queda en la canasta. ✕ lo devuelve a Falta.
- **Inventario:** los artículos que se reponen, por categoría. "Ya tengo" /
  "+ Pedir" mueven entre en casa y Falta. Si se mide **cuánto queda** (Editar →
  "Medir", de 10 en 10 %), se ve una barrita con borde animado; tocarla abre un
  ajuste rápido.
- **Listas:** tarjetas con cada lista (icono, color, tipo y resumen). Al abrir
  una se ven sus artículos y "Agregar a …". Se pueden **crear**, **editar**
  (nombre, tipo, icono, color) y **borrar** desde el menú ⋯ de la lista. Hay tres
  tipos:
  - **Se repone** (`restock`, p. ej. Hogar): Falta + Inventario, con nivel.
  - **Compra única** (`single`, p. ej. Una vez): en Falta con su etiqueta hasta
    comprarla; luego queda guardada.
  - **Colección / deseos** (`collection`, p. ej. Libros): solo en su sección,
    "Lo quiero" / "Lo tengo". Con dos vistas (se recuerda por lista):
    **Portadas** (cuadrícula de portadas verticales; ✓ en la esquina marca
    "Lo tengo") y **Lista** (filas con la portada vertical). Al escanear un ISBN (978/979) se buscan título,
    autor, año, páginas, editorial y portada en **Open Library** y va a Libros.
    Sin el libro a mano, **Buscar libro** (en Agregar al elegir una colección,
    o junto a "Agregar a …" en su detalle) busca por título y/o autor en
    **Google Books** (principal) y **Open Library** (secundaria), sin repetir
    y con los que tienen portada primero; al elegir uno se llenan título,
    autor, año, páginas, editorial, ISBN y portada para revisarlos antes de
    guardar. Los que ya están aparecen marcados "Ya está en …". Si se escribe un
    **ISBN** (13 o 10 dígitos, con o sin guiones) se busca como ISBN; si no
    está en ninguna base, **"Agregar con este ISBN"** abre Agregar con el
    código ya asociado. Al escanear
    un ISBN, si Open Library no tiene portada o sinopsis, se completan con
    Google Books.

    Google Books se consulta desde el servidor (`api.php?books=`,
    `?bookCover=`) con la clave de `src/google.php`
    (`<?php const GOOGLE_BOOKS_KEY = '...';`, no se versiona). Sin clave, o si
    se acaba la cuota diaria, la app usa solo Open Library.

  **Hogar** es la lista base: se puede editar, pero no borrar ni cambiar de
  tipo. Borrar una lista pide escribir su nombre exacto; por defecto sus
  artículos se **mueven** (a Hogar u otra lista). Si se eligen borrar también,
  se pide una confirmación más. El servidor guarda una copia
  (`data/backups/items-antes-borrar-lista-*.json`) antes de borrar una lista.
  Un artículo cambia de lista desde Editar → "Lista".
**Buscar** (en Agregar y junto a "Agregar a …" en cada lista) tiene dos modos:
**Productos** — por nombre en Open Food Facts (alimentos), **Best Buy**
(electrónica, videojuegos, juguetes…, con precio; clave en `src/bestbuy.php`,
`<?php const BESTBUY_KEY = '...';`, no se versiona) y UPCitemdb, vía el
servidor (`api.php?productSearch=`). UPCitemdb (100 consultas/día **por IP**,
compartidas en el hosting) solo se consulta al tocar Buscar / Enter o "Buscar
también en UPCitemdb"; cada búsqueda se guarda 7 días en `products.json` (Best
Buy, 1 día). Al final: "¿No está? Buscar «…» en" las tiendas. Por código de
barras (si no está: "Agregar con este código"); al escanear, Best Buy se
consulta antes que UPCitemdb — y **Libros** (ver arriba). El
modo inicial depende de la lista. Junto a cada código de producto hay copiar,
Google y **Tiendas** (Walmart, Target, Best Buy, Amazon, Costco, eBay,
UPCitemdb), que buscan el UPC de 12 dígitos.

Tocar un artículo abre su **vista previa** (el botón ✎ lleva a Editar; tocar la
imagen la abre sola a pantalla completa, con zoom al pellizcar o con doble
toque) con su información:
libros (Open Library: autor, año, páginas, editorial, sinopsis, temas), comida
(Open Food Facts: marca, cantidad, Nutri-Score, NOVA, nutrición por 100 g,
ingredientes, alérgenos) y otros productos (UPCitemdb: marca, tamaño,
descripción). Junto a cada ISBN (vista previa y códigos en Agregar/Editar) hay botones
para **copiarlo** y **buscarlo en Google o Amazon**. La información se pide al
abrir la vista previa; no se guarda en
`items.json`.

Cada artículo tiene un estado: `needed` (falta; con `basket: true` si está en
la canasta) → `in_cart` (en el carrito) → `stocked` (en casa). Listas:
`list` es el id de una lista (`regular` = Hogar, no se guarda el campo); las
listas están en `items.json` (`lists: [{id, name, type, icon, color}]`; si no
hay, se usan `DEFAULT_LISTS` de `config.php`). Un artículo de una lista que ya
no existe va a Hogar. Los libros llevan `book: {authors, year, pages,
publisher}`. Categorías en `config.php` (`CATS`); los nombres antiguos
se traducen solos (`LEGACY_CATS`).

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
inventario), que llena su cuadro; sin imagen se muestra el icono de su
categoría. Tocar la imagen la muestra en grande (vista previa). En el editor:
**cámara**, **subir** y **recortar** (arrastrar y acercar con pellizco, rueda o
la barra de zoom; la miniatura es el recorte y la vista previa, la foto entera). Se sube desde
*Agregar* / *Editar* (galería o cámara) o, al escanear un producto, se usa su
foto del producto si el artículo aún no tiene imagen. El teléfono la ajusta
a 128×128 (PNG, `data/icons/<id>.png`) y a 1600 px (JPEG, `<id>-l.jpg`, para la
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
