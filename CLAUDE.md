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

## Despliegue
- Subir SOLO archivos de código: `index.php`, `api.php`, `app.js`, `style.css`.
- **NUNCA** subir/sobrescribir `data/items.json` (datos reales) ni `auth.php`.
- Verificar tras subir: descargar el archivo y `diff` contra `src/`.
