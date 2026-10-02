from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text(); css=(root/'css/app.v2.2.0.css').read_text(); js=(root/'js/numeria.runtime.v2.2.0.js').read_text()
html=html.replace('<link rel="stylesheet" href="./css/app.v2.2.0.css">',f'<style>{css}</style>').replace('<script defer src="./js/numeria.runtime.v2.2.0.js"></script>',f'<script>{js}</script>')
with sync_playwright() as p:
    b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=b.new_page(); errs=[]; page.on('pageerror',lambda e: errs.append(str(e)))
    page.set_content(html,wait_until='load'); page.wait_for_timeout(30)
    assert page.evaluate('window.__NUMERIA_BOOTED__===true')
    assert page.locator('.theme-swatch').count()==7
    assert not errs, errs
    page.locator('.nav-btn[data-view="calendario"]').click()
    assert page.locator('#view-calendario').evaluate("e=>e.classList.contains('active')")
    print('Blocked/unavailable localStorage boot resilience test: OK')
    b.close()
