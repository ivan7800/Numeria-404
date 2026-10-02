import { meaning } from "./numerology.js";
import { energyProfile, centers, readingSections } from "./bioenergy.js";
import { buildCalendar } from "./calendar.js";
import { chaldeanName } from "./chaldean.js";

const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));

export function buildReportHTML(profile){
  const energy=energyProfile(profile);
  const cal=buildCalendar(profile.birthDate,2026,2030);
  const ch=chaldeanName(profile.name);
  const readings=readingSections(profile);
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Informe Numeria 404 · ${esc(profile.name)}</title>
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;margin:0;background:#f4f5f2;color:#171915;line-height:1.55}
    main{max-width:980px;margin:auto;padding:48px 24px}.hero{padding:38px;background:#11150f;color:white;border-radius:24px}
    .tag{font-size:11px;letter-spacing:.15em;color:#b8ff5a;font-weight:800}.hero h1{font-size:48px;margin:8px 0}
    .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:18px 0}.card{background:#fff;border:1px solid #ddd;border-radius:18px;padding:20px}
    .num{font-size:38px;font-weight:900}.muted{color:#666;font-size:13px}.section{margin-top:28px}.section h2{margin-bottom:10px}
    .bars{display:grid;gap:8px}.bar{display:grid;grid-template-columns:110px 1fr 40px;gap:10px;align-items:center}.track{height:8px;background:#e4e6df;border-radius:99px;overflow:hidden}.fill{height:100%;background:#273326}
    table{width:100%;border-collapse:collapse;background:#fff}th,td{border:1px solid #ddd;padding:8px;text-align:center;font-size:12px}th{background:#eef0ea}
    .notice{border-left:4px solid #273326;padding:12px 16px;background:#fff;margin-top:28px}.reading{margin-bottom:12px}
    @media print{body{background:white}main{padding:0}.hero{border-radius:0}}
    @media(max-width:700px){.grid{grid-template-columns:1fr 1fr}.hero h1{font-size:34px}}
  </style></head><body><main>
  <section class="hero"><div class="tag">NUMERIA 404 · INFORME PERSONAL</div><h1>${esc(profile.alias||profile.name)}</h1><div>${esc(profile.name)} · ${esc(profile.birthDate)}</div></section>
  <div class="grid">
    ${metric("Camino de Vida",profile.lifePath.value)}
    ${metric("Expresión",profile.expression.value)}
    ${metric("Alma",profile.soul.value)}
    ${metric("Personalidad",profile.personality.value)}
    ${metric("Madurez",profile.maturity)}
    ${metric("Actitud",profile.attitude)}
    ${metric("Nacimiento",profile.birthday)}
    ${metric("Año personal",profile.personalYear)}
  </div>
  <section class="section"><h2>Lectura principal</h2>${readings.map(r=>`<div class="card reading"><strong>${esc(r.title)}</strong><div class="muted">${esc(r.text)}</div></div>`).join("")}</section>
  <section class="section"><h2>Perfil bioenergético simbólico</h2><div class="card bars">${centers.map(c=>`<div class="bar"><span>${esc(c.name)}</span><div class="track"><div class="fill" style="width:${energy[c.key]}%"></div></div><span>${energy[c.key]}%</span></div>`).join("")}</div></section>
  <section class="section"><h2>Sistema caldeo separado</h2><div class="card"><strong>Total compuesto ${ch.total} → ${ch.value}</strong><div class="muted">${esc(ch.meaning)}</div></div></section>
  <section class="section"><h2>Calendario numerológico 2026–2030</h2>${cal.map(y=>`<h3>${y.year} · Año personal ${y.personalYear}</h3><table><tr>${y.months.map(m=>`<th>${m.name.slice(0,3)}</th>`).join("")}</tr><tr>${y.months.map(m=>`<td>${m.value}</td>`).join("")}</tr></table>`).join("")}</section>
  <div class="notice"><strong>Alcance</strong><div class="muted">Este informe usa numerología y correspondencias bioenergéticas como marcos simbólicos e interpretativos. No es diagnóstico médico, tratamiento, asesoramiento psicológico ni predicción garantizada.</div></div>
  </main></body></html>`;
}
function metric(label,value){return `<div class="card"><div class="muted">${esc(label)}</div><div class="num">${value}</div><div class="muted">${esc(meaning(value).title)}</div></div>`}

export function downloadReport(profile){
  const blob=new Blob([buildReportHTML(profile)],{type:"text/html;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=`informe-numeria-${slug(profile.name)}.html`;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),700);
}
function slug(s){return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}
