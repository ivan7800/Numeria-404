# QA Checklist · Numeria 404 v2.2.0 BUTTON FIX

## Verificado en esta corrección

- [x] Sintaxis de módulos, runtime empaquetado y Service Worker.
- [x] Tests de motor, V2, validación, almacenamiento y aislamiento/frescura de caché.
- [x] 47 selectores ID del runtime apuntan a elementos existentes.
- [x] 6 botones de navegación apuntan a vistas existentes.
- [x] Runtime de producción sin `import`/`export` y `index.html` sin `type=module`.
- [x] Recursos críticos resuelven con HTTP 200 bajo subcarpeta.
- [x] Chromium 1440×1000: 190/190 aserciones E2E.
- [x] Chromium 375×812: 190/190 aserciones E2E.
- [x] Cada clic E2E pasa comprobación de visibilidad/hit-target de Playwright, descartando overlays/pointer-events para los controles probados.
- [x] Inicio resistente cuando `localStorage` no está disponible.
- [x] Descargas de informe, perfil JSON y biblioteca JSON invocadas.
- [x] Impresión invocada mediante su manejador.
- [x] Prompt PWA probado mediante evento simulado.
- [x] Service Worker conserva cachés de otras aplicaciones.
- [x] JS/CSS críticos usan `network-first` y nombres versionados.

## No ejecutado en esta sesión

- [ ] Navegación Chromium por HTTP/HTTPS real: bloqueada por política administrada del entorno (`URLBlocklist=*`).
- [ ] Instalación PWA real en dispositivo.
- [ ] Publicación real en GitHub Pages.
- [ ] Safari.
- [ ] Firefox.

No se convierte ningún punto pendiente en “verificado” por inferencia.
