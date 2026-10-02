from pathlib import Path
from playwright.sync_api import sync_playwright
import json, sys, os

ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'css/app.v2.2.0.css').read_text(encoding='utf-8')
js=(ROOT/'js/numeria.runtime.v2.2.0.js').read_text(encoding='utf-8')

shim=r'''<script>
window.__test={downloads:[],prints:0,confirms:0,promptCalls:0};
(()=>{
  const data=new Map();
  const storage={
    getItem:k=>data.has(String(k))?data.get(String(k)):null,
    setItem:(k,v)=>data.set(String(k),String(v)),
    removeItem:k=>data.delete(String(k)),
    clear:()=>data.clear(),
    key:i=>[...data.keys()][i]??null,
    get length(){return data.size;}
  };
  try{Object.defineProperty(window,'localStorage',{value:storage,configurable:true});}catch(e){}
})();
window.print=()=>window.__test.prints++;
window.confirm=()=>{window.__test.confirms++;return true;};
try{URL.createObjectURL=()=>`blob:test-${Math.random()}`;URL.revokeObjectURL=()=>{};}catch(e){}
HTMLAnchorElement.prototype.click=function(){window.__test.downloads.push(this.download||this.href||'anchor-click');};
</script>'''
html=html.replace('<body>', '<body>'+shim, 1)
html=html.replace('<link rel="stylesheet" href="./css/app.v2.2.0.css">',f'<style>{css}</style>')
html=html.replace('<script defer src="./js/numeria.runtime.v2.2.0.js"></script>',f'<script>{js}</script>')

results=[]
def ok(name, condition, evidence=''):
    results.append((name, bool(condition), evidence))
    if not condition:
        raise AssertionError(f'{name}: {evidence}')

def click(page, selector, name):
    loc=page.locator(selector)
    ok(name+' visible', loc.is_visible(), selector)
    box=loc.bounding_box()
    ok(name+' hitbox', bool(box and box['width']>0 and box['height']>0), str(box))
    # Playwright real click performs hit-target / pointer-events / overlay checks.
    loc.click(timeout=3000)
    results.append((name,True,selector))

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    width=int(os.environ.get('VIEW_W','1440')); height=int(os.environ.get('VIEW_H','1000')); page=browser.new_page(viewport={'width':width,'height':height})
    console_errors=[]; page_errors=[]
    page.on('console', lambda m: console_errors.append(m.text) if m.type=='error' else None)
    page.on('pageerror', lambda e: page_errors.append(str(e)))
    page.set_content(html, wait_until='load')
    page.wait_for_timeout(60)

    ok('Arranque JavaScript', page.evaluate('window.__NUMERIA_BOOTED__===true'), 'window.__NUMERIA_BOOTED__')
    ok('Guardia de arranque oculta', page.locator('#startupGuard').evaluate("e=>e.classList.contains('hidden')"), 'startupGuard hidden')

    # Main navigation buttons
    for view,label in [('calendario','Calendario'),('caldea','Caldea'),('compatibilidad','Pareja'),('guardados','Guardados'),('ajustes','Ajustes'),('inicio','Perfil')]:
        click(page,f'.nav-btn[data-view="{view}"]',f'Nav {label}')
        ok(f'Vista {label} activa', page.locator(f'#view-{view}').evaluate("e=>e.classList.contains('active')"), view)

    # Theme cycle
    before=page.locator('html').get_attribute('data-theme')
    click(page,'#themeCycle','Cambiar tema (cabecera)')
    after=page.locator('html').get_attribute('data-theme')
    ok('Tema cambia', before!=after, f'{before}->{after}')

    # Demo / profile submit
    click(page,'#demoBtn','Cargar ejemplo')
    ok('Resultados visibles tras demo', not page.locator('#results').evaluate("e=>e.classList.contains('hidden')"), '#results')
    ok('Camino demo calculado', page.locator('#lifePath').inner_text().strip()=='1', page.locator('#lifePath').inner_text())

    # Explicit Calculate button
    page.locator('#fullName').fill('Nikola Tesla')
    page.locator('#birthDate').fill('1856-07-10')
    click(page,'#profileForm button[type="submit"]','Calcular perfil')
    ok('Perfil explícito renderizado', 'Nikola Tesla' in page.locator('#resultMeta').inner_text(), page.locator('#resultMeta').inner_text())

    # Explanation buttons individually
    for key in ['lifePath','expression','soul','personality','maturity']:
        click(page,f'.explain-btn[data-key="{key}"]',f'Cálculo {key}')
        ok(f'Diálogo {key} abierto', page.locator('#explainDialog').evaluate("e=>e.hasAttribute('open')"), key)
        click(page,'#closeDialog',f'Cerrar diálogo {key}')
        ok(f'Diálogo {key} cerrado', not page.locator('#explainDialog').evaluate("e=>e.hasAttribute('open')"), key)

    # Save / report / print / profile JSON
    click(page,'#saveProfileBtn','Guardar perfil')
    ok('Perfil persistido', page.evaluate("JSON.parse(localStorage.getItem('numeria404.profiles.v2')).length===1"), 'localStorage v2')
    click(page,'#reportBtn','Informe HTML')
    ok('Informe genera descarga', page.evaluate("window.__test.downloads.some(x=>x.endsWith('.html'))"), str(page.evaluate('window.__test.downloads')))
    click(page,'#printBtn','Imprimir/PDF')
    ok('Imprimir invocado', page.evaluate('window.__test.prints===1'), str(page.evaluate('window.__test.prints')))
    click(page,'#exportBtn','Exportar perfil JSON')
    ok('Perfil JSON genera descarga', page.evaluate("window.__test.downloads.some(x=>x.endsWith('.json'))"), str(page.evaluate('window.__test.downloads')))

    # Calendar
    click(page,'.nav-btn[data-view="calendario"]','Abrir Calendario')
    page.locator('#calendarBirthDate').fill('1978-05-09')
    click(page,'#calendarForm button[type="submit"]','Generar calendario 2026-2030')
    ok('Cinco años generados', page.locator('#calendarResult .year-card').count()==5, str(page.locator('#calendarResult .year-card').count()))

    # Chaldean
    click(page,'.nav-btn[data-view="caldea"]','Abrir Caldea')
    page.locator('#chaldeanName').fill('Nikola Tesla')
    click(page,'#chaldeanForm button[type="submit"]','Calcular Caldea')
    ok('Resultado caldeo visible', not page.locator('#chaldeanResult').evaluate("e=>e.classList.contains('hidden')"), '#chaldeanResult')
    ok('Resultado caldeo contiene número', bool(page.locator('#chaldeanResult .chaldean-number strong').inner_text().strip()), page.locator('#chaldeanResult .chaldean-number strong').inner_text())

    # Couple
    click(page,'.nav-btn[data-view="compatibilidad"]','Abrir Pareja')
    page.locator('#nameA').fill('Ada Lovelace'); page.locator('#dateA').fill('1815-12-10')
    page.locator('#nameB').fill('Nikola Tesla'); page.locator('#dateB').fill('1856-07-10')
    click(page,'#compatForm button[type="submit"]','Analizar pareja')
    ok('Resultado pareja visible', not page.locator('#compatResult').evaluate("e=>e.classList.contains('hidden')"), '#compatResult')
    ok('Resultado pareja con porcentaje', '%' in page.locator('#compatResult .score-ring strong').inner_text(), page.locator('#compatResult .score-ring strong').inner_text())

    # Saved: open and delete dynamic buttons
    click(page,'.nav-btn[data-view="guardados"]','Abrir Guardados')
    ok('Tarjeta guardada presente', page.locator('#savedProfiles .saved-card').count()==1, str(page.locator('#savedProfiles .saved-card').count()))
    click(page,'#savedProfiles .load-profile','Abrir perfil guardado')
    ok('Abrir guardado vuelve a Perfil', page.locator('#view-inicio').evaluate("e=>e.classList.contains('active')"), 'view-inicio')
    click(page,'.nav-btn[data-view="guardados"]','Volver a Guardados')
    click(page,'#savedProfiles .delete-profile','Eliminar perfil guardado')
    ok('Perfil eliminado', page.locator('#savedProfiles .saved-card').count()==0, str(page.locator('#savedProfiles .saved-card').count()))

    # Settings theme buttons individually + library export + clear
    # create one profile again so library operations have data
    click(page,'.nav-btn[data-view="inicio"]','Volver a Perfil para guardar')
    page.locator('#fullName').fill('Ada Lovelace'); page.locator('#birthDate').fill('1815-12-10')
    click(page,'#profileForm button[type="submit"]','Recalcular para biblioteca')
    click(page,'#saveProfileBtn','Guardar para biblioteca')
    click(page,'.nav-btn[data-view="ajustes"]','Abrir Ajustes')
    themes=['obsidian','aurora','amethyst','solar','emerald','cyber','minimal']
    for theme in themes:
        click(page,f'.theme-swatch[data-theme="{theme}"]',f'Skin {theme}')
        ok(f'Skin {theme} aplicada', page.locator('html').get_attribute('data-theme')==theme, page.locator('html').get_attribute('data-theme'))
    click(page,'#exportLibraryBtn','Exportar biblioteca JSON')
    ok('Biblioteca JSON genera descarga', page.evaluate("window.__test.downloads.filter(x=>x==='numeria-404-biblioteca.json').length===1"), str(page.evaluate('window.__test.downloads')))
    click(page,'#clearDataBtn','Borrar todos los perfiles')
    ok('Confirmación de borrado invocada', page.evaluate('window.__test.confirms>=1'), str(page.evaluate('window.__test.confirms')))
    ok('Biblioteca vacía tras borrado', page.evaluate("localStorage.getItem('numeria404.profiles.v2')===null && localStorage.getItem('numeria404.profiles.v1')===null"), 'storage cleared')

    # Install button via synthetic beforeinstallprompt-like event
    page.evaluate('''() => { const e=new Event('beforeinstallprompt'); e.prompt=()=>{window.__test.promptCalls++}; e.userChoice=Promise.resolve({outcome:'accepted'}); window.dispatchEvent(e); }''')
    ok('Botón instalar se muestra al evento', page.locator('#installBtn').is_visible(), '#installBtn')
    click(page,'#installBtn','Instalar PWA (manejador simulado)')
    page.wait_for_timeout(20)
    ok('Prompt de instalación invocado', page.evaluate('window.__test.promptCalls===1'), str(page.evaluate('window.__test.promptCalls')))
    ok('Botón instalar se oculta tras elección', not page.locator('#installBtn').is_visible(), '#installBtn hidden')

    ok('Sin excepciones JavaScript', len(page_errors)==0, repr(page_errors))
    ok('Sin console.error', len(console_errors)==0, repr(console_errors))
    browser.close()

passed=sum(1 for _,v,_ in results if v)
print(f'BUTTON_E2E viewport={width}x{height} {passed}/{len(results)} OK')
for name,status,evidence in results:
    if name.endswith(' visible') or name.endswith(' hitbox'):
        continue
    print(('PASS' if status else 'FAIL')+' | '+name+' | '+evidence)
