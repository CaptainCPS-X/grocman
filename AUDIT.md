# Audit de grocman — 2026-09-27

Lista de hallazgos para reparar, ordenada por severidad. Marcar `[x]` al
resolver cada punto (con el commit que lo resuelve).

## Ya resuelto antes de este audit

- [x] **Sesión compartida con payman.** Ambas apps usaban `PHPSESSID` con
  `path=/` y la clave `authenticated`: entrar en una abría la otra. Resuelto con
  `session.php` (cookie `GROCMANSESS`, ruta `/compra/`) — commit `f69fd2e`.
- [x] **Copia pública de la base.** `bkp/items.json` se podía descargar sin
  login. Respaldada en local y borrada del servidor (404).

## 🟠 Alto

- [x] **G1. Guardado no atómico y sin bloqueo.** `saveDB` (`api.php`) escribe
  sin `flock` ni archivo temporal: dos guardados simultáneos pasan la
  comprobación de versión y el segundo borra el cambio del primero sin avisar;
  una escritura a medias puede corromper `items.json`. Tampoco hay backups.
  Arreglo: bloqueo + temporal + `rename`, 500 si no se puede leer, backup diario.
- [x] **G2. La app se congela al caducar la sesión.** El poll de 10 s
  (`app.js` fetchData) no revisa el 401: guarda `{error}` como datos y los toques
  dejan de funcionar sin mandar al login. Arreglo: manejar 401/errores en el poll.
  Resuelto: el 401 recarga al login; además las sesiones ya no las borra el
  recolector del hosting (ver G8).
- [x] **G3. El poll deshace el último toque.** Una respuesta del poll pedida
  antes de un cambio puede llegar después y revertir la pantalla hasta 10 s.
  Arreglo: descartar respuestas del poll obsoletas o con cambios pendientes.

## 🟡 Medio

- [x] **G4. Un 409 descarta el toque.** Comprando juntos es frecuente. Arreglo:
  reintentar aplicando el mismo cambio sobre la lista más reciente; guardar en
  cola para que dos toques rápidos no choquen entre sí.
- [x] **G5. Errores 400/500 tratados como éxito.** La versión queda `undefined`
  y los guardados siguientes fallan en cadena; "¡Compra finalizada!" aparece
  aunque falle.
- [x] **G6. API sin validación.** `items` puede ser cualquier cosa; sin
  `version` PHP emite un aviso dentro del JSON; no exige `application/json` ni
  responde 405.
- [x] **G7. Login sin límite de intentos.**
- [x] **G8. Sin expiración por inactividad**, y el poll mantiene viva la sesión.
  Además las sesiones viven en el directorio compartido del hosting, donde el
  recolector de PHP las borra tras ~24 min (causa frecuente de G2).
  Resuelto: sesiones en `data/sessions/`, caducan tras 7 días sin uso; el poll
  (`?poll=1`) no cuenta como uso.

## 🟢 Bajo

- [x] **G9. Accesibilidad:** zoom bloqueado (`user-scalable=no`); checks y filas
  son `div` (no se usan con teclado); hojas sin Escape ni foco.
- [x] **G10. El poll sigue con la pestaña en segundo plano** (batería/datos).
- [x] **G11. Cache-buster `time()`**: descarga CSS/JS en cada carga.
- [x] **G12. Logout por GET**: cualquier página puede cerrar la sesión con un `<img>`.
- [x] **G13. Sin prueba de humo.** Resuelto: `node tests/smoke.mjs`
  (31 comprobaciones sobre una copia temporal con datos de ejemplo).
