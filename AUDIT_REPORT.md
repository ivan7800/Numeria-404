# Auditoría de botones · Numeria 404 v2.2.0

## Resultado

Se investigó el fallo antes de modificar. La causa no era un `z-index` o un selector aislado: existían dos rutas de arranque capaces de dejar la UI visible con JavaScript ausente u obsoleto. Se corrigió el arranque y se volvió a probar cada acción.

## Causa raíz

### 1. ES Modules al abrir `index.html` directamente

La v2.1.1 usaba:

```html
<script type="module" src="./js/app.js"></script>
```

`app.js` importaba nueve módulos. Si el navegador bloquea imports desde `file://`, el HTML y CSS siguen apareciendo, pero `init()` no se ejecuta y ningún listener se registra. Síntoma: **todos o casi todos los botones parecen no funcionar**.

**Corrección:** el runtime de navegador se empaqueta en `js/numeria.runtime.v2.2.0.js`, script clásico sin imports. Los módulos originales se mantienen como fuente mantenible y para tests.

### 2. Mezcla de HTML nuevo con JavaScript/CSS antiguo

El Service Worker v2.1.1 era `network-first` para navegación, pero `cache-first` para el resto. Tras desplegar una versión podía llegar `index.html` nuevo mientras el SW activo devolvía `app.js`/CSS antiguos. Síntoma: **solo algunos botones o secciones fallan** por desalineación entre DOM y runtime.

**Corrección:** `numeria.runtime.v2.2.0.js` y `app.v2.2.0.css` están versionados; JS/CSS críticos son `network-first` con `cache: "no-store"`; la caché pasa a `numeria404-v2.2.0`.

### 3. Persistencia de tema podía abortar `init()`

Si `localStorage` estaba bloqueado, `saveSettings()` podía lanzar durante `applyTheme()` y detener la fase final de inicialización.

**Corrección:** persistir el tema es ahora una operación no crítica; se conserva visualmente aunque no pueda guardarse.

## Elementos investigados

| Área | Resultado |
|---|---|
| Consola/runtime | Sin excepciones en la batería E2E final |
| Carga de scripts | Corregida: runtime clásico versionado |
| Listeners | Probados por acción real |
| Selectores | 47 ID verificados; 0 inexistentes |
| Capas superpuestas | No bloquean los clics probados |
| pointer-events | Hit-target real correcto en los clics E2E |
| z-index | Sin bloqueo de controles; fondos usan `pointer-events:none` |
| Estado | Navegación, resultados, guardados y temas verificados |
| Rutas | Recursos críticos HTTP 200 en subcarpeta |
| Service Worker | Caché propia aislada; estrategia crítica network-first |
| Caché antigua | Mitigada con nombres de assets y caché versionados |
| GitHub Pages | Rutas relativas/subcarpeta verificadas; despliegue real no ejecutado |

## Botones/acciones probados individualmente

- Perfil, Calendario, Caldea, Pareja, Guardados y Ajustes.
- Cambiar tema de cabecera.
- Cargar ejemplo.
- Calcular perfil.
- Ver cálculo: Camino de Vida, Expresión, Alma, Personalidad y Madurez.
- Cerrar cada diálogo de cálculo.
- Guardar perfil.
- Generar Informe HTML.
- Imprimir/PDF (manejador).
- Exportar perfil JSON.
- Generar calendario 2026–2030.
- Calcular numerología caldea.
- Analizar pareja.
- Abrir perfil guardado.
- Eliminar perfil guardado.
- Los 7 skins: Obsidian, Aurora, Amethyst, Solar, Emerald, Cyber y Minimal.
- Exportar biblioteca JSON.
- Borrar todos los perfiles con confirmación.
- Instalar PWA: manejador y prompt simulados.

Cada acción anterior terminó en PASS tanto en el flujo E2E de escritorio como en el flujo de 375 px. La batería contabiliza además visibilidad y hitbox, por eso informa **190/190 aserciones** por viewport.

## Evidencia ejecutada

- Node: `engine.test.mjs`, `v2.test.mjs`, `validation.test.mjs`, `storage.test.mjs`, `sw.test.mjs` → OK.
- `node --check` sobre módulos/runtime/SW → OK.
- `selectors.test.py` → 47 ID selectors y 6 vistas, OK.
- `github_pages_paths.test.py` → recursos críticos resueltos bajo subcarpeta, OK.
- `storage_blocked_boot.chromium.py` → arranque y navegación con almacenamiento no disponible, OK.
- `buttons.e2e.chromium.py` 1440×1000 → 190/190.
- `buttons.e2e.chromium.py` 375×812 → 190/190.

## Limitación del entorno

Chromium está configurado por el sistema con `URLBlocklist=["*"]`, por lo que una navegación Chromium a localhost/HTTPS queda bloqueada antes de cargar la app. No se afirma una prueba de Service Worker dentro de Chromium ni una publicación real de GitHub Pages en esta sesión. Se usó Chromium real para DOM/eventos/hit-testing mediante documento inline, y servidor HTTP real separado para comprobar rutas de subcarpeta.
