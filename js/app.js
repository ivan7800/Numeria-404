import { buildProfile, meaning, calculationExplanation } from "./numerology.js";
import { energyProfile, centers, readingSections } from "./bioenergy.js";
import { compareProfiles } from "./compatibility.js";
import { getProfiles, saveProfile, deleteProfile, clearProfiles, getSettings, saveSettings } from "./storage.js";
import { buildCalendar } from "./calendar.js";
import { chaldeanName as calcChaldean } from "./chaldean.js";
import { numerologyChartSVG, chartLegend } from "./chart.js";
import { downloadReport } from "./report.js";
import { validateName, validateBirthDate } from "./validation.js";

const $=(s,ctx=document)=>ctx.querySelector(s);
const $$=(s,ctx=document)=>[...ctx.querySelectorAll(s)];
let currentProfile=null;
let deferredPrompt=null;

const themes=["obsidian","aurora","amethyst","solar","emerald","cyber","minimal"];
const themeLabels={obsidian:"Obsidian",aurora:"Aurora",amethyst:"Amethyst",solar:"Solar",emerald:"Emerald",cyber:"Cyber",minimal:"Minimal"};

init();

function init(){
  try{
    bindNav(); bindProfile(); bindCalendar(); bindChaldean(); bindCompat(); bindSettings(); bindPWA();
    setDateLimits();
    applyTheme(getSettings().theme || "obsidian");
    renderSaved(); renderThemes();
    window.__NUMERIA_BOOTED__=true;
    const guard=$("#startupGuard"); if(guard) guard.classList.add("hidden");
  }catch(error){
    console.error("[Numeria 404] Error de inicialización",error);
    const guard=document.querySelector("#startupGuard");
    if(guard){guard.classList.remove("hidden");guard.dataset.state="error";guard.textContent=`No se pudo iniciar Numeria 404: ${error?.message||"error desconocido"}`;}
    throw error;
  }
}

function bindNav(){
  $$(".nav-btn").forEach(btn=>btn.addEventListener("click",()=>showView(btn.dataset.view)));
}
function showView(view){
  $$(".nav-btn").forEach(b=>{const active=b.dataset.view===view;b.classList.toggle("active",active);if(active)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");});
  $$(".view").forEach(v=>v.classList.toggle("active",v.id===`view-${view}`));
  if(view==="calendario" && currentProfile){
    $("#calendarBirthDate").value=currentProfile.birthDate;
    renderCalendar(currentProfile.birthDate);
  }
  if(view==="caldea" && currentProfile){
    $("#chaldeanName").value=currentProfile.name;
    renderChaldean(currentProfile.name);
  }
  window.scrollTo({top:0,behavior:motionBehavior()});
}

function bindProfile(){
  $("#profileForm").addEventListener("submit",e=>{
    e.preventDefault();
    const nameCheck=validateName($("#fullName").value);
    const dateCheck=validateBirthDate($("#birthDate").value);
    if(!nameCheck.ok){announce(nameCheck.message,"error");$("#fullName").focus();return;}
    if(!dateCheck.ok){announce(dateCheck.message,"error");$("#birthDate").focus();return;}
    currentProfile=buildProfile(nameCheck.value,dateCheck.value,$("#profileAlias").value);
    renderProfile(currentProfile);
    announce("Perfil calculado correctamente.","success");
  });
  $("#demoBtn").addEventListener("click",()=>{
    $("#fullName").value="Ada Lovelace";
    $("#birthDate").value="1815-12-10";
    $("#profileAlias").value="Ejemplo";
    $("#profileForm").requestSubmit();
  });
  $("#saveProfileBtn").addEventListener("click",()=>{
    if(!currentProfile)return;
    try{saveProfile(currentProfile);renderSaved();flashButton($("#saveProfileBtn"),"Guardado ✓");announce("Perfil guardado en este navegador.","success");}
    catch(error){announce(error.message||"No se pudo guardar el perfil.","error");}
  });
  $("#reportBtn").addEventListener("click",()=>{if(currentProfile) downloadReport(currentProfile)});
  $("#printBtn").addEventListener("click",()=>window.print());
  $("#exportBtn").addEventListener("click",()=>{
    if(!currentProfile)return;
    downloadJSON(currentProfile,`numeria-${slug(currentProfile.name)}.json`);
    announce("Perfil exportado a JSON.","success");
  });
  $("#closeDialog").addEventListener("click",closeExplainDialog);
  $("#explainDialog").addEventListener("click",e=>{if(e.target===$("#explainDialog"))closeExplainDialog();});
}

function renderProfile(p){
  $("#resultName").textContent=p.alias || p.name;
  $("#resultMeta").textContent=`${p.name} · ${formatDate(p.birthDate)} · Año personal ${p.personalYear}`;
  setMetric("lifePath",p.lifePath.value); setMetric("expression",p.expression.value); setMetric("soul",p.soul.value); setMetric("personality",p.personality.value);
  $("#maturityNumber").textContent=p.maturity; $("#maturityTitle").textContent=meaning(p.maturity).title; $("#lifePathText").textContent=meaning(p.lifePath.value).text;

  $("#visualChart").innerHTML=numerologyChartSVG(p);
  $("#chartLegend").innerHTML=chartLegend(p).map(([label,value,title])=>`<div class="legend-row"><span>${escapeHtml(label)} · ${escapeHtml(title)}</span><strong>${value}</strong></div>`).join("");

  const matrix=$("#matrixGrid"); matrix.innerHTML="";
  for(let i=1;i<=9;i++){
    const count=p.matrix[i]||0;
    matrix.insertAdjacentHTML("beforeend",`<div class="matrix-cell"><span>NÚMERO</span><strong>${i}</strong><div class="dots">${count?'<i class="dot"></i>'.repeat(Math.min(count,12)):'<i class="dot empty"></i>'}</div><span>${count} aparición${count===1?'':'es'}</span></div>`);
  }

  const ep=energyProfile(p);
  $("#energyBars").innerHTML=centers.map(c=>`<div class="energy-row" title="${escapeHtml(c.hint)}"><span class="energy-name">${c.name}</span><div class="energy-track"><div class="energy-fill" style="width:${ep[c.key]}%"></div></div><span class="energy-score">${ep[c.key]}%</span></div>`).join("");

  $("#secondaryNumbers").innerHTML=[
    ["NACIMIENTO",p.birthday,meaning(p.birthday).title],
    ["ACTITUD",p.attitude,meaning(p.attitude).title],
    ["AÑO PERSONAL",p.personalYear,meaning(p.personalYear).title],
    ["DEUDAS KÁRMICAS",p.karmicDebts.length?p.karmicDebts.join(" · "):"—",p.karmicDebts.length?"13 · 14 · 16 · 19 si aparecen en totales":"Sin coincidencias en totales núcleo"]
  ].map(([label,value,text])=>`<div class="secondary-item"><span>${label}</span><strong>${value}</strong><small>${escapeHtml(text)}</small></div>`).join("");

  const age=currentAge(p.birthDate);
  $("#timeline").innerHTML=p.cycles.pinnacles.map((pin,i)=>{
    const r=p.cycles.ranges[i]; const active=age>=r.from && (r.to===null || age<=r.to);
    return `<div class="cycle ${active?'active-cycle':''}"><span class="age">${r.to===null?`${r.from}+ años`:`${r.from}–${r.to} años`}</span><div class="pinnacle">${pin}</div><strong>Pináculo ${i+1}</strong><div class="challenge">Desafío ${p.cycles.challenges[i]}</div></div>`;
  }).join("");
  $("#currentPersonalYear").textContent=`AÑO PERSONAL ${p.personalYear}`;
  $("#readingGrid").innerHTML=readingSections(p).map(r=>`<div class="reading"><h4>${escapeHtml(r.title)}</h4><p>${escapeHtml(r.text)}</p></div>`).join("");
  $$(".explain-btn").forEach(b=>b.onclick=()=>showExplanation(b.dataset.key));
  $("#calendarBirthDate").value=p.birthDate; $("#chaldeanName").value=p.name;
  $("#results").classList.remove("hidden"); $("#results").scrollIntoView({behavior:motionBehavior(),block:"start"});
}

function setMetric(key,value){
  const id={lifePath:"lifePath",expression:"expressionNumber",soul:"soulNumber",personality:"personalityNumber"}[key];
  const titleId={lifePath:"lifePathTitle",expression:"expressionTitle",soul:"soulTitle",personality:"personalityTitle"}[key];
  $("#"+id).textContent=value; $("#"+titleId).textContent=meaning(value).title;
}
function showExplanation(key){
  if(!currentProfile)return;
  const x=calculationExplanation(currentProfile,key); $("#dialogTitle").textContent=x.title;
  $("#dialogBody").innerHTML=`<div class="calc-steps">${x.steps.map(s=>`<div class="calc-step">${escapeHtml(s)}</div>`).join("")}</div>`;
  const dialog=$("#explainDialog");
  if(typeof dialog.showModal==="function") dialog.showModal();
  else dialog.setAttribute("open","");
}
function closeExplainDialog(){
  const dialog=$("#explainDialog");
  if(typeof dialog.close==="function") dialog.close();
  else dialog.removeAttribute("open");
}

function bindCalendar(){
  $("#calendarForm").addEventListener("submit",e=>{e.preventDefault();const c=validateBirthDate($("#calendarBirthDate").value);if(!c.ok){announce(c.message,"error");$("#calendarBirthDate").focus();return;}renderCalendar(c.value);announce("Calendario generado.","success")});
}
function renderCalendar(dateStr){
  if(!dateStr)return;
  const years=buildCalendar(dateStr,2026,2030);
  $("#calendarResult").innerHTML=years.map(y=>`<article class="card year-card">
    <div class="year-head"><div><div class="year-number">${y.year}</div><div class="year-meaning">${escapeHtml(y.yearMeaning)}</div></div>
    <div class="year-personal"><span>AÑO<br>PERSONAL</span><strong>${y.personalYear}</strong></div></div>
    <div class="month-grid">${y.months.map(m=>`<div class="month-card" title="${escapeHtml(m.meaning)}"><span>${m.name}</span><strong>${m.value}</strong></div>`).join("")}</div>
  </article>`).join("");
}

function bindChaldean(){
  $("#chaldeanForm").addEventListener("submit",e=>{e.preventDefault();const c=validateName($("#chaldeanName").value);if(!c.ok){announce(c.message,"error");$("#chaldeanName").focus();return;}renderChaldean(c.value);announce("Cálculo caldeo generado.","success")});
}
function renderChaldean(name){
  if(!name.trim())return;
  const r=calcChaldean(name), box=$("#chaldeanResult"); box.classList.remove("hidden");
  box.innerHTML=`<article class="card chaldean-card">
    <div class="chaldean-main"><div class="chaldean-number"><strong>${r.value}</strong></div>
    <div class="chaldean-copy"><span class="kicker">RESULTADO CALDEO</span><h2>${escapeHtml(r.name)}</h2><p>${escapeHtml(r.meaning)}</p><div class="compound">Número compuesto: ${r.total} → reducción ${r.value}</div></div></div>
    <div class="letter-table">${r.letters.map((l,i)=>`<span class="letter-chip">${escapeHtml(l)}<strong>${r.values[i]||0}</strong></span>`).join("")}</div>
    <div class="notice"><strong>Sistema separado</strong><p>La tabla caldea de letras es distinta de la pitagórica. Este resultado se muestra independientemente para evitar mezclar metodologías.</p></div>
  </article>`;
}

function bindCompat(){
  $("#compatForm").addEventListener("submit",e=>{
    e.preventDefault();
    const na=validateName($("#nameA").value), nb=validateName($("#nameB").value);
    const da=validateBirthDate($("#dateA").value), db=validateBirthDate($("#dateB").value);
    if(!na.ok){announce(`Persona A: ${na.message}`,"error");$("#nameA").focus();return;}
    if(!da.ok){announce(`Persona A: ${da.message}`,"error");$("#dateA").focus();return;}
    if(!nb.ok){announce(`Persona B: ${nb.message}`,"error");$("#nameB").focus();return;}
    if(!db.ok){announce(`Persona B: ${db.message}`,"error");$("#dateB").focus();return;}
    const r=compareProfiles(na.value,da.value,nb.value,db.value);
    const box=$("#compatResult"); box.classList.remove("hidden");
    box.innerHTML=`<article class="card compat-card">
      <div class="compat-score-wrap"><div class="score-ring" style="--score:${r.score}"><strong>${r.score}%</strong></div>
      <div class="compat-copy"><span class="kicker">LECTURA COMBINADA</span><h2>${escapeHtml(r.label)}</h2><p>${escapeHtml(r.text)}</p></div></div>

      <div class="compat-layers">
        <div class="layer-card"><span>COMUNICACIÓN</span><strong>${r.layers.communication}%</strong></div>
        <div class="layer-card"><span>SINTONÍA INTERNA</span><strong>${r.layers.emotional}%</strong></div>
        <div class="layer-card"><span>RITMO DE ACCIÓN</span><strong>${r.layers.action}%</strong></div>
      </div>

      <div class="compat-dimensions">${r.dimensions.map(d=>`<div class="dimension-row">
        <div class="dimension-name"><strong>${escapeHtml(d.label)}</strong><span>${escapeHtml(d.note)} · ${d.a} × ${d.b}</span></div>
        <div class="dimension-track"><div class="dimension-fill" style="width:${d.score}%"></div></div><div class="dimension-score">${d.score}%</div>
      </div>`).join("")}</div>

      <div class="couple-card">
        <div class="couple-number"><span>NÚMERO DE PAREJA</span><strong>${r.couple.number}</strong><em>${escapeHtml(r.couple.title)}</em></div>
        <div class="couple-number"><span>EXPRESIÓN COMBINADA</span><strong>${r.couple.expression}</strong><em>${escapeHtml(r.couple.expressionTitle)}</em></div>
      </div>

      <div class="notice"><strong>Interpretación, no predicción</strong><p>Los porcentajes son una escala interna de la app para visualizar similitudes numéricas. No miden científicamente compatibilidad, estabilidad ni futuro de una relación.</p></div>
    </article>`;
    box.scrollIntoView({behavior:"smooth"});
  });
}

function renderSaved(){
  const list=getProfiles(), box=$("#savedProfiles");
  if(!list.length){box.innerHTML=`<div class="notice"><strong>No hay perfiles guardados</strong><p>Crea un perfil y pulsa “Guardar”.</p></div>`;return}
  box.innerHTML=list.map(p=>`<article class="card saved-card"><span class="kicker">${escapeHtml(p.alias||"PERFIL")}</span><h3>${escapeHtml(p.name)}</h3><p>${formatDate(p.birthDate)}</p>
    <div class="saved-meta"><span class="chip">VIDA ${p.lifePath.value}</span><span class="chip">ALMA ${p.soul.value}</span><span class="chip">AÑO ${p.personalYear}</span></div>
    <div class="saved-actions"><button class="btn ghost load-profile" data-id="${p.id}">Abrir</button><button class="btn danger delete-profile" data-id="${p.id}">Eliminar</button></div></article>`).join("");
  $$(".load-profile",box).forEach(b=>b.onclick=()=>{
    const p=getProfiles().find(x=>x.id===b.dataset.id); if(!p)return;
    currentProfile=p; $("#fullName").value=p.name; $("#birthDate").value=p.birthDate; $("#profileAlias").value=p.alias||"";
    showView("inicio"); renderProfile(p);
  });
  $$(".delete-profile",box).forEach(b=>b.onclick=()=>{try{deleteProfile(b.dataset.id);renderSaved();announce("Perfil eliminado.","success");}catch(error){announce(error.message||"No se pudo eliminar el perfil.","error");}});
}

function bindSettings(){
  $("#exportLibraryBtn").addEventListener("click",()=>{
    const profiles=getProfiles();
    downloadJSON({app:"Numeria 404",schemaVersion:2,exportedAt:new Date().toISOString(),profiles},"numeria-404-biblioteca.json");
    announce(`Biblioteca exportada: ${profiles.length} perfil${profiles.length===1?"":"es"}.`,"success");
  });
  $("#themeCycle").addEventListener("click",()=>{
    const cur=document.documentElement.dataset.theme||"obsidian"; applyTheme(themes[(themes.indexOf(cur)+1)%themes.length]);
  });
  $("#clearDataBtn").addEventListener("click",()=>{if(confirm("¿Borrar todos los perfiles guardados en este navegador? Esta acción no se puede deshacer.")){try{clearProfiles();renderSaved();announce("Perfiles locales borrados.","success");}catch(error){announce(error.message||"No se pudieron borrar los datos.","error");}}});
}
function renderThemes(){
  const box=$("#themeGrid"); box.innerHTML=themes.map(t=>`<button class="theme-swatch" data-theme="${t}"><span>${themeLabels[t]}</span><i class="swatch-line"></i></button>`).join("");
  $$(".theme-swatch").forEach(b=>b.onclick=()=>applyTheme(b.dataset.theme)); syncThemeButtons();
}
function applyTheme(theme){if(!themes.includes(theme))theme="obsidian";document.documentElement.dataset.theme=theme;try{saveSettings({theme});}catch(error){console.warn("[Numeria 404] No se pudo persistir el tema; se mantiene durante esta sesión.",error);}syncThemeButtons();}
function syncThemeButtons(){$$(".theme-swatch").forEach(b=>b.classList.toggle("active",b.dataset.theme===document.documentElement.dataset.theme));}

function bindPWA(){
  const canUseSW=(location.protocol==="https:" || location.hostname==="localhost" || location.hostname==="127.0.0.1");
  if(canUseSW && "serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js").catch(error=>console.warn("[Numeria 404] Service Worker no disponible",error));
  }
  window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("#installBtn").classList.remove("hidden")});
  $("#installBtn").addEventListener("click",async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$("#installBtn").classList.add("hidden")});
}
function downloadJSON(data,filename){
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a"); a.href=url; a.download=filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(url),700);
}
function setDateLimits(){
  const now=new Date();
  const today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  ["birthDate","calendarBirthDate","dateA","dateB"].forEach(id=>{const el=$("#"+id);if(el)el.max=today;});
}
function motionBehavior(){return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}
function announce(message,type="info"){
  const box=$("#appStatus"); if(!box)return;
  box.textContent=message; box.dataset.type=type; box.classList.add("visible");
  clearTimeout(announce._timer); announce._timer=setTimeout(()=>{box.classList.remove("visible")},5000);
}

function currentAge(dateStr){const b=new Date(dateStr+"T00:00:00"),now=new Date();let age=now.getFullYear()-b.getFullYear();const m=now.getMonth()-b.getMonth();if(m<0||(m===0&&now.getDate()<b.getDate()))age--;return age}
function formatDate(d){return new Intl.DateTimeFormat("es-ES",{day:"2-digit",month:"long",year:"numeric"}).format(new Date(d+"T00:00:00"))}
function slug(s){return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function flashButton(btn,text){const old=btn.textContent;btn.textContent=text;setTimeout(()=>btn.textContent=old,1200)}
