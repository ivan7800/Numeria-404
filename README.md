# Numeria 404 · v2.2.0 BUTTON FIX

Versión corregida tras investigar el fallo de botones/acciones. Mantiene la arquitectura modular como código fuente, pero el navegador carga un **runtime clásico empaquetado** para que el arranque no dependa de ES Modules cuando se abre `index.html` directamente.

## Causas corregidas

1. **Arranque con `file://`**: la versión anterior cargaba `js/app.js` mediante `<script type="module">`. La interfaz HTML podía verse aunque los imports del módulo no arrancasen, dejando los listeners sin registrar. La v2.2.0 carga `js/numeria.runtime.v2.2.0.js` como script clásico.
2. **Caché antigua en GitHub Pages**: el Service Worker anterior era `cache-first` para JavaScript/CSS. Después de una publicación podía mezclarse `index.html` nuevo con recursos antiguos. Ahora el runtime y CSS tienen nombre versionado y JS/CSS usan estrategia **network-first**.
3. **`localStorage` bloqueado**: guardar el tema podía lanzar una excepción durante `init()` y abortar parte del arranque. Ahora esa persistencia es no crítica: la app continúa funcionando aunque el navegador bloquee el almacenamiento.
4. **Diagnóstico de arranque**: se añadió una guardia visible que avisa si el motor JavaScript no inicia, en lugar de dejar una interfaz aparentemente normal con controles muertos.

## Ejecutar

### Windows / PWA completa

```text
ABRIR_NUMERIA_404.bat
```

O:

```bash
python -m http.server 8080
```

Después abre `http://localhost:8080`.

### Apertura directa

También puedes abrir `index.html` directamente. Los controles ya no dependen de imports ES Module. En `file://` no se registra Service Worker y, por tanto, no hay instalación/offline PWA; para esas funciones usa localhost, HTTPS o GitHub Pages.

## Tests

```bash
node tests/engine.test.mjs
node tests/v2.test.mjs
node tests/validation.test.mjs
node tests/storage.test.mjs
node tests/sw.test.mjs
python tests/selectors.test.py
python tests/github_pages_paths.test.py
python tests/storage_blocked_boot.chromium.py
python tests/buttons.e2e.chromium.py
```

La batería de botones se ejecutó también a 375×812 mediante `VIEW_W=375 VIEW_H=812`.

## GitHub Pages

Todas las referencias críticas son relativas y se han probado bajo una subcarpeta HTTP equivalente a un repositorio de GitHub Pages. El Service Worker solo elimina cachés cuyo nombre empieza por `numeria404-`.

## Limitaciones verificadas

- El navegador Chromium disponible en este entorno tiene una política administrada `URLBlocklist=["*"]`; por ello no se pudo navegar desde Chromium a un servidor HTTP local ni ejecutar el Service Worker dentro de ese navegador en esta sesión.
- Los flujos de interfaz sí se ejecutaron en el motor Chromium real usando un documento de prueba equivalente con CSS/runtime inline.
- La resolución de rutas bajo subcarpeta se comprobó con servidor HTTP real y peticiones a todos los recursos críticos.
- No se afirma publicación real en GitHub Pages, instalación PWA física, Safari ni Firefox.

## Alcance

La numerología, compatibilidad y bioenergía son marcos simbólicos e interpretativos. No constituyen diagnóstico médico ni predicción garantizada.
