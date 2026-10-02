from pathlib import Path
from bs4 import BeautifulSoup
import re
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text(encoding='utf-8')
js=(root/'js/app.js').read_text(encoding='utf-8')
soup=BeautifulSoup(html,'html.parser')
ids={node.get('id') for node in soup.find_all(id=True)}
refs=set(re.findall(r'\$\(["\']#([A-Za-z0-9_-]+)["\']',js))
missing=sorted(refs-ids)
assert not missing, f'Selectores ID inexistentes: {missing}'
views={node.get('data-view') for node in soup.select('.nav-btn[data-view]')}
view_ids={node.get('id','').removeprefix('view-') for node in soup.select('.view[id^="view-"]')}
assert views<=view_ids, f'Vistas sin sección: {views-view_ids}'
# Runtime must no longer depend on ES-module imports at startup.
runtime=(root/'js/numeria.runtime.v2.2.0.js').read_text(encoding='utf-8')
assert not re.search(r'^\s*import\s',runtime,re.M)
assert '<script type="module"' not in html
print(f'Selector/listener startup audit: OK ({len(refs)} ID selectors; {len(views)} views)')
