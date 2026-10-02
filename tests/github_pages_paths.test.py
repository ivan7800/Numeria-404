from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
from urllib.request import urlopen
from urllib.parse import urljoin
from bs4 import BeautifulSoup
import json, re

root=Path(__file__).resolve().parents[1]
parent=root.parent
handler=partial(SimpleHTTPRequestHandler,directory=str(parent))
server=ThreadingHTTPServer(('127.0.0.1',0),handler)
Thread(target=server.serve_forever,daemon=True).start()
port=server.server_address[1]
base=f'http://127.0.0.1:{port}/{root.name}/'
try:
    with urlopen(base,timeout=5) as r:
        html=r.read().decode(); assert r.status==200
    soup=BeautifulSoup(html,'html.parser')
    refs=[]
    for tag,attr in [('script','src'),('link','href')]:
        for node in soup.find_all(tag):
            v=node.get(attr)
            if v and not v.startswith(('http:','https:','#','data:')): refs.append(v)
    # critical explicit resources and every relative script/link resolve under subfolder
    required=['./js/numeria.runtime.v2.2.0.js','./css/app.v2.2.0.css','./manifest.webmanifest','./sw.js']
    refs += ['./sw.js']
    for ref in sorted(set(refs+required)):
        with urlopen(urljoin(base,ref),timeout=5) as r:
            assert r.status==200, (ref,r.status)
    assert '<script type="module"' not in html
    assert './js/numeria.runtime.v2.2.0.js' in html
    runtime=(root/'js/numeria.runtime.v2.2.0.js').read_text()
    assert not re.search(r'^\s*import\s',runtime,re.M)
    assert not re.search(r'^\s*export\s',runtime,re.M)
    manifest=json.loads((root/'manifest.webmanifest').read_text())
    assert manifest['start_url']=='./' and manifest['scope']=='./' and manifest['id']=='./'
    print('GitHub Pages subpath/static runtime test: OK')
finally:
    server.shutdown(); server.server_close()
