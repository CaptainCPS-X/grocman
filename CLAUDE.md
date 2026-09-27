# CLAUDE.md — Guía del proyecto (grocman)

App personal de lista de compra + inventario del hogar (PHP + JS vanilla).
Ver `README.md` para la arquitectura. Este archivo documenta convenciones.

## Atribución de commits
Los commits van **solo como CaptainCPS-X** (`user.name = CaptainCPS-X`,
`user.email = captaincpsx@gmail.com`). **Nunca** añadir `Co-Authored-By: Claude`
ni ninguna línea de Claude al mensaje del commit.

## Credenciales y datos
- `src/auth.php` (hash de la contraseña) y `src/data/items.json` (datos reales)
  están en `.gitignore`. Nunca se versionan ni se suben a GitHub.
- Las credenciales de despliegue (FTP/SFTP), cuando existan, van en
  **`deploy.local.ini`** (también ignorado por git), con este formato:
  ```
  [sftp]
  host=...
  port=22
  user=...
  password=...
  remote_path=./ruta/en/el/servidor/
  ```

## Despliegue (DreamHost, SFTP)

Mismo servidor que **payman**, en el directorio remoto `./jezerart.com/compra/`.
Sitio en vivo: https://jezerart.com/compra/. Credenciales en `deploy.local.ini`
(ignorado por git). Se usa `curl` con libssh2 (no interactivo; `sshpass` no está).

Leer credenciales y definir base remota:
```sh
HOST=$(grep '^host=' deploy.local.ini | cut -d= -f2)
USER=$(grep '^user=' deploy.local.ini | cut -d= -f2)
PASS=$(grep '^password=' deploy.local.ini | cut -d= -f2)
BASE="sftp://$HOST/~/jezerart.com/compra"
```

- **Listar:**   `curl -s --user "$USER:$PASS" "$BASE/data/"`
- **Descargar:** `curl -s --user "$USER:$PASS" "$BASE/app.js" -o /tmp/app.js`
- **Subir código:** `curl -sS --user "$USER:$PASS" -T src/app.js "$BASE/app.js"`

### Reglas
- Subir SOLO archivos de código: `index.php`, `api.php`, `config.php`,
  `session.php`, `app.js`, `style.css` y `vendor/` (lector ZXing para el
  escáner). Orden: primero `config.php`, `session.php` y `vendor/` (los demás
  los usan), al final `app.js`.
- **NUNCA** subir/sobrescribir `data/items.json` (datos reales) ni `auth.php`.
- La DB vive en el servidor en `data/items.json` (movida ahí desde la raíz el
  2026-07-17). `data/.htaccess` niega el acceso web directo y **debe existir**:
  tras cada despliegue comprobar que
  `curl -s -o /dev/null -w "%{http_code}\n" https://jezerart.com/compra/data/items.json`
  responda **403**.
- En `data/` la app crea sola (NO tocar): `items.lock` (bloqueo de escritura),
  `backups/` (copia diaria, 30 días), `sessions/` (sesiones de login),
  `icons/` (imágenes de los artículos), `products.json` (caché de búsquedas
  de productos en UPCitemdb) y
  `login_attempts.json` (intentos fallidos por IP).
- Antes de subir: `node tests/smoke.mjs` (prueba de humo local, no toca datos).
- Verificar tras subir: descargar el archivo y `cmp` contra `src/`.
- El cache-buster (`?v=<filemtime>`) hace que el navegador tome el CSS/JS
  nuevo en cuanto cambia el archivo en el servidor.
