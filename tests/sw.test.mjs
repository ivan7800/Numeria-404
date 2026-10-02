import assert from "node:assert/strict";
let listeners={},waited,deleted=[];
globalThis.self={
  location:{origin:"https://example.test"},
  clients:{claim:async()=>{}},skipWaiting(){},
  addEventListener(type,cb){listeners[type]=cb;}
};
globalThis.caches={
  keys:async()=>["numeria404-v1.0.0","otherapp-v9","numeria404-v2.0.0","numeria404-v2.1.1"],
  delete:async key=>{deleted.push(key);return true;},
  open:async()=>({addAll:async()=>{},put:async()=>{}}),match:async()=>null
};
await import(`../sw.js?test=${Date.now()}`);
listeners.activate({waitUntil(p){waited=p;}});
await waited;
assert.deepEqual(deleted.sort(),["numeria404-v1.0.0","numeria404-v2.0.0","numeria404-v2.1.1"].sort());
assert.ok(!deleted.includes("otherapp-v9"),"El SW no debe borrar cachés de otras apps del mismo origen");
console.log("Numeria 404 service-worker cache isolation test: OK");

const source = await (await import('node:fs/promises')).readFile(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(source,/CACHE_PREFIX}v2\.2\.0/,'La versión de caché debe incrementarse');
assert.match(source,/numeria\.runtime\.v2\.2\.0\.js/,'El runtime versionado debe estar en el app shell');
assert.match(source,/app\.v2\.2\.0\.css/,'El CSS versionado debe estar en el app shell');
assert.ok(source.includes('const critical=/\\.(?:js|css)$/.test(url.pathname);'),'JS/CSS deben tratarse como recursos críticos');
assert.match(source,/networkFirst\(request\)/,'Los recursos críticos deben usar network-first para evitar runtime obsoleto');
console.log('Numeria 404 SW freshness strategy test: OK');
