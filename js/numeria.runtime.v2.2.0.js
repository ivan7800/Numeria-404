/* Numeria 404 v2.2.0 - runtime bundle. Generated from modular source to support HTTP/HTTPS and direct file:// opening. */
"use strict";

/* --- numerology.js --- */
const __numeria_numerology = (() => {
const MASTER = new Set([11,22,33]);

const meanings = {
  1:{title:"El Iniciador",text:"Independencia, decisión y capacidad de abrir camino. Su reto simbólico es liderar sin aislarse ni convertir la autonomía en rigidez."},
  2:{title:"El Mediador",text:"Sensibilidad, cooperación y lectura fina de los vínculos. Su reto simbólico es conservar límites propios sin perder armonía."},
  3:{title:"El Comunicador",text:"Expresión, creatividad y sociabilidad. Su reto simbólico es dar estructura al talento y evitar dispersarse entre demasiados estímulos."},
  4:{title:"El Constructor",text:"Orden, constancia y sentido práctico. Su reto simbólico es sostener la disciplina sin quedar atrapado en lo previsible."},
  5:{title:"El Explorador",text:"Cambio, curiosidad y necesidad de movimiento. Su reto simbólico es usar la libertad con dirección y no como huida permanente."},
  6:{title:"El Cuidador",text:"Responsabilidad, vínculo y búsqueda de armonía. Su reto simbólico es ayudar sin cargar con todo ni confundir cuidado con control."},
  7:{title:"El Investigador",text:"Análisis, introspección y búsqueda de significado. Su reto simbólico es compartir lo aprendido y no convertir la profundidad en distancia."},
  8:{title:"El Estratega",text:"Gestión, ambición, poder material y capacidad ejecutiva. Su reto simbólico es equilibrar eficacia, ética y vida personal."},
  9:{title:"El Humanista",text:"Visión amplia, sensibilidad social y cierre de ciclos. Su reto simbólico es soltar lo que termina sin dramatizar cada despedida."},
  11:{title:"El Inspirador",text:"Número maestro asociado simbólicamente con intuición, inspiración y sensibilidad elevada. Requiere enraizamiento para no vivir en sobrecarga."},
  22:{title:"El Gran Constructor",text:"Número maestro asociado con visión a gran escala y capacidad de materialización. Su reto es convertir la ambición en estructura sostenible."},
  33:{title:"El Maestro Compasivo",text:"Número maestro ligado simbólicamente a servicio, comunicación y cuidado. Su reto es no asumir responsabilidades imposibles."}
};

const letterMap = {
 A:1,J:1,S:1,B:2,K:2,T:2,C:3,L:3,U:3,D:4,M:4,V:4,E:5,N:5,W:5,
 F:6,O:6,X:6,G:7,P:7,Y:7,H:8,Q:8,Z:8,I:9,R:9
};

const vowels = new Set(["A","E","I","O","U"]);

function normalizeName(name){
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().replace(/[^A-Z]/g,"");
}

function reduceNumber(n, keepMasters=true){
  n = Math.abs(Number(n)||0);
  const steps = [n];
  while(n > 9 && !(keepMasters && MASTER.has(n))){
    n = String(n).split("").reduce((a,b)=>a+Number(b),0);
    steps.push(n);
  }
  return {value:n,steps};
}

function sumDigitsText(text){
  return [...String(text)].filter(c=>/\d/.test(c)).reduce((a,b)=>a+Number(b),0);
}

function numberFromName(name, mode="all"){
  const letters = normalizeName(name).split("");
  const filtered = letters.filter(ch=>{
    if(mode==="vowels") return vowels.has(ch);
    if(mode==="consonants") return !vowels.has(ch);
    return true;
  });
  const values = filtered.map(ch=>letterMap[ch]||0);
  const total = values.reduce((a,b)=>a+b,0);
  const reduced = reduceNumber(total,true);
  return {value:reduced.value,total,letters:filtered,values,steps:reduced.steps};
}

function lifePathFromDate(dateStr){
  const digits = dateStr.replace(/\D/g,"");
  const total = sumDigitsText(digits);
  const reduced = reduceNumber(total,true);
  return {value:reduced.value,total,digits:[...digits].map(Number),steps:reduced.steps};
}

function birthdayNumber(dateStr){
  const d = Number(dateStr.split("-")[2]);
  return reduceNumber(d,true).value;
}

function attitudeNumber(dateStr){
  const [y,m,d] = dateStr.split("-").map(Number);
  return reduceNumber(m+d,true).value;
}

function maturityNumber(life, expression){
  return reduceNumber(life+expression,true).value;
}

function karmicDebts(rawTotals){
  const debts=[13,14,16,19];
  return [...new Set(rawTotals.filter(n=>debts.includes(n)))];
}

function personalYear(dateStr, year=new Date().getFullYear()){
  const [,m,d]=dateStr.split("-").map(Number);
  const yrSum = String(year).split("").reduce((a,b)=>a+Number(b),0);
  return reduceNumber(m+d+yrSum,true).value;
}

function pinnaclesAndChallenges(dateStr, lifePath){
  const [year,month,day]=dateStr.split("-").map(Number);
  const m=reduceNumber(month,false).value;
  const d=reduceNumber(day,false).value;
  const y=reduceNumber(String(year).split("").reduce((a,b)=>a+Number(b),0),false).value;
  const p1=reduceNumber(m+d,true).value;
  const p2=reduceNumber(d+y,true).value;
  const p3=reduceNumber(p1+p2,true).value;
  const p4=reduceNumber(m+y,true).value;
  const c1=Math.abs(d-m);
  const c2=Math.abs(d-y);
  const c3=Math.abs(c1-c2);
  const c4=Math.abs(m-y);
  const end1=36-reduceNumber(lifePath,false).value;
  return {
    pinnacles:[p1,p2,p3,p4],
    challenges:[c1,c2,c3,c4],
    ranges:[
      {from:0,to:end1},
      {from:end1+1,to:end1+9},
      {from:end1+10,to:end1+18},
      {from:end1+19,to:null}
    ]
  };
}

function frequencyMatrix(name,dateStr){
  const counts={1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
  for(const v of numberFromName(name).values){ if(v>=1&&v<=9) counts[v]++; }
  for(const ch of dateStr.replace(/\D/g,"")){ const n=Number(ch); if(n>=1&&n<=9) counts[n]++; }
  return counts;
}

function buildProfile(name,dateStr,alias=""){
  const life=lifePathFromDate(dateStr);
  const expression=numberFromName(name,"all");
  const soul=numberFromName(name,"vowels");
  const personality=numberFromName(name,"consonants");
  const maturity=maturityNumber(life.value,expression.value);
  const cycles=pinnaclesAndChallenges(dateStr,life.value);
  const py=personalYear(dateStr);
  const debts=karmicDebts([life.total,expression.total,soul.total,personality.total]);
  return {
    id:globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2,10)}`,
    name:name.trim(), alias:alias.trim(), birthDate:dateStr,
    createdAt:new Date().toISOString(),
    lifePath:life,
    expression,soul,personality,maturity,
    birthday:birthdayNumber(dateStr),
    attitude:attitudeNumber(dateStr),
    personalYear:py,
    cycles,
    matrix:frequencyMatrix(name,dateStr),
    karmicDebts:debts
  };
}

function meaning(n){ return meanings[n] || meanings[reduceNumber(n,false).value] || meanings[1]; }

function calculationExplanation(profile,key){
  const map={
    lifePath:{
      title:"Camino de Vida",
      steps:[
        `Fecha: ${profile.birthDate}`,
        `Suma de dígitos: ${profile.lifePath.digits.join(" + ")} = ${profile.lifePath.total}`,
        `Reducción: ${profile.lifePath.steps.join(" → ")}`,
        `Resultado: ${profile.lifePath.value}${MASTER.has(profile.lifePath.value) ? " · número maestro" : ""}`
      ]
    },
    expression:{
      title:"Destino / Expresión",
      steps:[
        `Nombre normalizado: ${profile.expression.letters.join("")}`,
        `Valores: ${profile.expression.values.join(" + ")} = ${profile.expression.total}`,
        `Reducción: ${profile.expression.steps.join(" → ")}`,
        `Resultado: ${profile.expression.value}`
      ]
    },
    soul:{
      title:"Alma",
      steps:[
        `Vocales: ${profile.soul.letters.join(" · ") || "—"}`,
        `Valores: ${profile.soul.values.join(" + ")} = ${profile.soul.total}`,
        `Reducción: ${profile.soul.steps.join(" → ")}`,
        `Resultado: ${profile.soul.value}`
      ]
    },
    personality:{
      title:"Personalidad",
      steps:[
        `Consonantes: ${profile.personality.letters.join(" · ") || "—"}`,
        `Valores: ${profile.personality.values.join(" + ")} = ${profile.personality.total}`,
        `Reducción: ${profile.personality.steps.join(" → ")}`,
        `Resultado: ${profile.personality.value}`
      ]
    },
    maturity:{
      title:"Madurez",
      steps:[
        `Camino de Vida (${profile.lifePath.value}) + Expresión (${profile.expression.value})`,
        `Suma: ${profile.lifePath.value + profile.expression.value}`,
        `Resultado reducido: ${profile.maturity}`
      ]
    }
  };
  return map[key];
}
return { meanings, letterMap, normalizeName, reduceNumber, numberFromName, lifePathFromDate, birthdayNumber, attitudeNumber, maturityNumber, karmicDebts, personalYear, pinnaclesAndChallenges, frequencyMatrix, buildProfile, meaning, calculationExplanation };
})();

/* --- validation.js --- */
const __numeria_validation = (() => {
  const { normalizeName } = __numeria_numerology;

const MAX_NAME_LENGTH = 120;

function validateName(name){
  const raw=String(name ?? "");
  const trimmed=raw.trim();
  if(!trimmed) return {ok:false,message:"Introduce un nombre que contenga letras."};
  if(trimmed.length>MAX_NAME_LENGTH) return {ok:false,message:`El nombre no puede superar ${MAX_NAME_LENGTH} caracteres.`};
  if(!normalizeName(trimmed)) return {ok:false,message:"El nombre debe contener al menos una letra A–Z (se admiten tildes y ñ)."};
  return {ok:true,value:trimmed};
}

function validateBirthDate(dateStr,{allowFuture=false}={}){
  const value=String(dateStr ?? "");
  const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if(!m) return {ok:false,message:"Introduce una fecha válida."};
  const y=Number(m[1]), mo=Number(m[2]), d=Number(m[3]);
  const date=new Date(Date.UTC(y,mo-1,d));
  if(date.getUTCFullYear()!==y || date.getUTCMonth()!==mo-1 || date.getUTCDate()!==d){
    return {ok:false,message:"La fecha indicada no existe."};
  }
  if(!allowFuture){
    const now=new Date();
    const today=Date.UTC(now.getFullYear(),now.getMonth(),now.getDate());
    if(date.getTime()>today) return {ok:false,message:"La fecha de nacimiento no puede estar en el futuro."};
  }
  return {ok:true,value};
}

function isValidSavedProfile(value){
  if(!value || typeof value!=="object") return false;
  return validateName(value.name).ok && validateBirthDate(value.birthDate).ok;
}
return { MAX_NAME_LENGTH, validateName, validateBirthDate, isValidSavedProfile };
})();

/* --- storage.js --- */
const __numeria_storage = (() => {
  const { buildProfile } = __numeria_numerology;
  const { isValidSavedProfile } = __numeria_validation;

const KEY="numeria404.profiles.v2";
const LEGACY_KEY="numeria404.profiles.v1";
const SETTINGS="numeria404.settings.v2";
const LEGACY_SETTINGS="numeria404.settings.v1";
const SCHEMA_VERSION=2;

class StorageError extends Error{
  constructor(message,cause){super(message,{cause});this.name="StorageError";}
}

function safeGet(key){try{return localStorage.getItem(key);}catch{return null}}
function parseArray(raw){
  try{const value=JSON.parse(raw||"[]");return Array.isArray(value)?value:[];}catch{return []}
}
function parseObject(raw){
  try{const value=JSON.parse(raw||"{}");return value && typeof value==="object" && !Array.isArray(value)?value:{};}catch{return {}}
}
function toStored(profile){
  return {
    schemaVersion:SCHEMA_VERSION,
    id:String(profile.id||""),
    name:String(profile.name||"").trim(),
    alias:String(profile.alias||"").trim(),
    birthDate:String(profile.birthDate||""),
    createdAt:String(profile.createdAt||new Date().toISOString())
  };
}
function hydrate(raw){
  if(!isValidSavedProfile(raw)) return null;
  const p=buildProfile(raw.name,raw.birthDate,raw.alias||"");
  p.id=String(raw.id||p.id);
  p.createdAt=String(raw.createdAt||p.createdAt);
  return p;
}
function rawProfiles(){
  const current=parseArray(safeGet(KEY));
  if(current.length) return current;
  const legacy=parseArray(safeGet(LEGACY_KEY));
  if(!legacy.length) return [];
  const migrated=legacy.filter(isValidSavedProfile).map(toStored);
  if(migrated.length){
    try{localStorage.setItem(KEY,JSON.stringify(migrated));}catch{/* lectura sigue disponible aunque falle la migración */}
  }
  return migrated;
}
function writeProfiles(list){
  try{localStorage.setItem(KEY,JSON.stringify(list));}
  catch(error){throw new StorageError("No se pudieron guardar los perfiles. El almacenamiento del navegador puede estar lleno o bloqueado.",error);}
}

function getProfiles(){
  return rawProfiles().map(hydrate).filter(Boolean).slice(0,100);
}
function saveProfile(profile){
  if(!isValidSavedProfile(profile)) throw new StorageError("El perfil no contiene un nombre o fecha válidos.");
  const raw=rawProfiles().filter(isValidSavedProfile).map(toStored);
  const item=toStored(profile);
  const same=raw.findIndex(p=>p.name===item.name && p.birthDate===item.birthDate);
  if(same>=0) item.id=raw[same].id || item.id;
  if(same>=0) raw[same]=item; else raw.unshift(item);
  writeProfiles(raw.slice(0,100));
  return getProfiles();
}
function deleteProfile(id){
  const raw=rawProfiles().filter(isValidSavedProfile).map(toStored).filter(p=>p.id!==id);
  writeProfiles(raw);
  return getProfiles();
}
function clearProfiles(){
  try{localStorage.removeItem(KEY);localStorage.removeItem(LEGACY_KEY);}
  catch(error){throw new StorageError("No se pudieron borrar los perfiles locales.",error);}
}
function getSettings(){
  const current=parseObject(safeGet(SETTINGS));
  if(Object.keys(current).length) return current;
  return parseObject(safeGet(LEGACY_SETTINGS));
}
function saveSettings(data){
  const safe=data && typeof data==="object" && !Array.isArray(data)?data:{};
  try{localStorage.setItem(SETTINGS,JSON.stringify({...getSettings(),...safe}));}
  catch(error){throw new StorageError("No se pudieron guardar los ajustes locales.",error);}
}
return { StorageError, getProfiles, saveProfile, deleteProfile, clearProfiles, getSettings, saveSettings };
})();

/* --- bioenergy.js --- */
const __numeria_bioenergy = (() => {
  const { reduceNumber } = __numeria_numerology;

const centers = [
  {key:"root",name:"Raíz",numbers:[1,4,8],hint:"estructura, presencia y capacidad de sostener"},
  {key:"sacral",name:"Sacro",numbers:[2,5],hint:"vínculo, deseo de cambio y sensibilidad"},
  {key:"solar",name:"Plexo",numbers:[1,8],hint:"voluntad, dirección y poder personal"},
  {key:"heart",name:"Corazón",numbers:[2,6,9],hint:"cuidado, cooperación y amplitud emocional"},
  {key:"throat",name:"Garganta",numbers:[3,5],hint:"expresión, creatividad y comunicación"},
  {key:"brow",name:"Visión",numbers:[7,9,11],hint:"análisis, intuición y perspectiva"},
  {key:"crown",name:"Corona",numbers:[7,11,22,33],hint:"sentido, integración y visión global"}
];

function energyProfile(profile){
  const core=[profile.lifePath.value,profile.expression.value,profile.soul.value,profile.personality.value,profile.maturity,profile.birthday,profile.attitude];
  const result={};
  centers.forEach(c=>{
    let hits=0;
    core.forEach(n=>{
      const base=reduceNumber(n,false).value;
      if(c.numbers.includes(n) || c.numbers.includes(base)) hits++;
    });
    const matrixBoost=c.numbers.reduce((sum,n)=>sum+(profile.matrix[reduceNumber(n,false).value]||0),0);
    result[c.key]=Math.min(100,Math.round(20 + hits*10 + Math.min(matrixBoost,8)*5));
  });
  return result;
}

function readingSections(profile){
  const lp=profile.lifePath.value, ex=profile.expression.value, so=profile.soul.value, pe=profile.personality.value;
  return [
    {title:"Identidad",text:`Tu eje principal combina Camino ${lp} con Expresión ${ex}. Simbólicamente, esto describe cómo se relacionan tu impulso vital y la forma en que tiendes a desplegar capacidades.`},
    {title:"Mundo interno",text:`El número de Alma ${so} representa motivaciones privadas. Conviene compararlo con Personalidad ${pe}: cuanto más distintos sean, más posible es que lo que muestras y lo que necesitas internamente sigan ritmos diferentes.`},
    {title:"Trabajo y acción",text:`Madurez ${profile.maturity} y Actitud ${profile.attitude} sugieren el estilo con el que puedes consolidar experiencia: combina el aprendizaje acumulado con la manera de abordar situaciones nuevas.`},
    {title:"Ciclo actual",text:`Tu Año Personal es ${profile.personalYear}. En numerología se interpreta como un clima simbólico anual, útil para reflexión y planificación, no como predicción de hechos.`},
    {title:"Fortalezas dominantes",text:dominantText(profile.matrix)},
    {title:"Puntos de atención",text:missingText(profile.matrix)}
  ];
}

function dominantText(matrix){
  const arr=Object.entries(matrix).sort((a,b)=>b[1]-a[1]);
  const max=arr[0][1];
  const dom=arr.filter(([,v])=>v===max).map(([k])=>k);
  return max ? `Los números con mayor presencia en tu matriz son ${dom.join(", ")}. Dentro del sistema se leen como energías o patrones especialmente repetidos.` : "No hay dominantes claros en la matriz.";
}
function missingText(matrix){
  const miss=Object.entries(matrix).filter(([,v])=>v===0).map(([k])=>k);
  return miss.length ? `Los números ausentes son ${miss.join(", ")}. En este marco se consideran áreas que quizá requieran más aprendizaje consciente, sin implicar carencias reales.` : "No aparecen números ausentes en la matriz.";
}
return { centers, energyProfile, readingSections };
})();

/* --- calendar.js --- */
const __numeria_calendar = (() => {
  const { personalYear, reduceNumber } = __numeria_numerology;

const monthNames=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

const cycleMeanings={
  1:"Inicio, decisión y siembra de nuevas líneas de acción.",
  2:"Cooperación, espera activa y atención a los vínculos.",
  3:"Expresión, creatividad, conversación y visibilidad.",
  4:"Orden, trabajo, mantenimiento y construcción.",
  5:"Cambio, movimiento, prueba y adaptación.",
  6:"Responsabilidad, hogar, acuerdos y cuidado.",
  7:"Análisis, revisión, estudio y profundidad.",
  8:"Gestión, resultados, recursos y ejecución.",
  9:"Cierre, depuración, entrega y finalización.",
  11:"Inspiración, sensibilidad y percepción intensificada.",
  22:"Construcción a gran escala, sistema y materialización.",
  33:"Servicio, cuidado y comunicación con responsabilidad."
};

function personalMonth(dateStr, year, month){
  const py=personalYear(dateStr,year);
  return reduceNumber(py+month,true).value;
}

function buildCalendar(dateStr,startYear=2026,endYear=2030){
  const years=[];
  for(let year=startYear;year<=endYear;year++){
    const py=personalYear(dateStr,year);
    years.push({
      year,
      personalYear:py,
      yearMeaning:cycleMeanings[py] || cycleMeanings[reduceNumber(py,false).value],
      months:monthNames.map((name,i)=>{
        const value=personalMonth(dateStr,year,i+1);
        return {month:i+1,name,value,meaning:cycleMeanings[value] || cycleMeanings[reduceNumber(value,false).value]};
      })
    });
  }
  return years;
}

function cycleMeaning(n){
  return cycleMeanings[n] || cycleMeanings[reduceNumber(n,false).value] || "";
}
return { personalMonth, buildCalendar, cycleMeaning };
})();

/* --- chaldean.js --- */
const __numeria_chaldean = (() => {
  const { normalizeName } = __numeria_numerology;

const chaldeanMap = {
  A:1,I:1,J:1,Q:1,Y:1,
  B:2,K:2,R:2,
  C:3,G:3,L:3,S:3,
  D:4,M:4,T:4,
  E:5,H:5,N:5,X:5,
  U:6,V:6,W:6,
  O:7,Z:7,
  F:8,P:8
};

const meanings = {
  1:"Iniciativa, identidad y dirección personal.",
  2:"Cooperación, sensibilidad y diplomacia.",
  3:"Expresión, imaginación y sociabilidad.",
  4:"Estructura, método y trabajo constante.",
  5:"Cambio, movimiento y adaptabilidad.",
  6:"Responsabilidad, vínculos y armonía.",
  7:"Análisis, introspección y búsqueda interior.",
  8:"Gestión, poder material y disciplina.",
  9:"Visión amplia, cierre y servicio."
};

function reduceSingle(n){
  let value=Math.abs(Number(n)||0);
  while(value>9) value=String(value).split("").reduce((a,b)=>a+Number(b),0);
  return value;
}

function chaldeanName(name){
  const letters=normalizeName(name).split("");
  const values=letters.map(ch=>chaldeanMap[ch]||0).filter(Boolean);
  const total=values.reduce((a,b)=>a+b,0);
  const reduced=reduceSingle(total);
  return {
    name:name.trim(),
    letters,
    values,
    total,
    value:reduced,
    meaning:meanings[reduced] || "Lectura simbólica del nombre."
  };
}

function chaldeanLetterValue(letter){
  return chaldeanMap[normalizeName(letter)] || 0;
}

function chaldeanMeaning(n){
  return meanings[reduceSingle(n)] || "";
}
return { chaldeanName, chaldeanLetterValue, chaldeanMeaning };
})();

/* --- chart.js --- */
const __numeria_chart = (() => {
  const { meaning } = __numeria_numerology;

function numerologyChartSVG(profile){
  const nodes=[
    {key:"Camino",value:profile.lifePath.value,angle:-90},
    {key:"Expresión",value:profile.expression.value,angle:-30},
    {key:"Alma",value:profile.soul.value,angle:30},
    {key:"Personalidad",value:profile.personality.value,angle:90},
    {key:"Madurez",value:profile.maturity,angle:150},
    {key:"Actitud",value:profile.attitude,angle:210}
  ];
  const cx=250,cy=250,r=170;
  const points=nodes.map(n=>{
    const a=n.angle*Math.PI/180;
    return {...n,x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r};
  });
  const polygon=points.map(p=>`${p.x},${p.y}`).join(" ");
  return `<svg class="numerology-wheel" viewBox="0 0 500 500" role="img" aria-label="Carta numerológica visual">
    <circle class="wheel-ring" cx="250" cy="250" r="190"/>
    <circle class="wheel-ring wheel-ring-inner" cx="250" cy="250" r="112"/>
    ${points.map(p=>`<line class="wheel-line" x1="250" y1="250" x2="${p.x}" y2="${p.y}"/>`).join("")}
    <polygon class="wheel-polygon" points="${polygon}"/>
    <circle class="wheel-core" cx="250" cy="250" r="62"/>
    <text class="wheel-core-number" x="250" y="247" text-anchor="middle">${profile.lifePath.value}</text>
    <text class="wheel-core-label" x="250" y="274" text-anchor="middle">CAMINO</text>
    ${points.map(p=>`<g class="wheel-node">
      <circle cx="${p.x}" cy="${p.y}" r="34"/>
      <text class="wheel-node-number" x="${p.x}" y="${p.y+5}" text-anchor="middle">${p.value}</text>
      <text class="wheel-node-label" x="${p.x}" y="${p.y+54}" text-anchor="middle">${p.key.toUpperCase()}</text>
    </g>`).join("")}
  </svg>`;
}

function chartLegend(profile){
  return [
    ["Camino de Vida",profile.lifePath.value,meaning(profile.lifePath.value).title],
    ["Expresión",profile.expression.value,meaning(profile.expression.value).title],
    ["Alma",profile.soul.value,meaning(profile.soul.value).title],
    ["Personalidad",profile.personality.value,meaning(profile.personality.value).title],
    ["Madurez",profile.maturity,meaning(profile.maturity).title],
    ["Actitud",profile.attitude,meaning(profile.attitude).title]
  ];
}
return { numerologyChartSVG, chartLegend };
})();

/* --- compatibility.js --- */
const __numeria_compatibility = (() => {
  const { buildProfile, reduceNumber, meaning } = __numeria_numerology;

function base(n){return reduceNumber(n,false).value}
function circularDistance(a,b){
  a=base(a); b=base(b);
  const d=Math.abs(a-b);
  return Math.min(d,9-d);
}
function pairScore(a,b){
  const d=circularDistance(a,b);
  return [100,89,78,66,54][Math.min(d,4)];
}
function avg(...nums){return Math.round(nums.reduce((a,b)=>a+b,0)/nums.length)}

function compareProfiles(nameA,dateA,nameB,dateB){
  const A=buildProfile(nameA,dateA), B=buildProfile(nameB,dateB);
  const dimensions=[
    {label:"Ritmo vital",a:A.lifePath.value,b:B.lifePath.value,score:pairScore(A.lifePath.value,B.lifePath.value),note:"Camino de Vida"},
    {label:"Expresión",a:A.expression.value,b:B.expression.value,score:pairScore(A.expression.value,B.expression.value),note:"Forma de desplegar capacidades"},
    {label:"Mundo interno",a:A.soul.value,b:B.soul.value,score:pairScore(A.soul.value,B.soul.value),note:"Número de Alma"},
    {label:"Proyección",a:A.personality.value,b:B.personality.value,score:pairScore(A.personality.value,B.personality.value),note:"Personalidad"},
    {label:"Madurez",a:A.maturity,b:B.maturity,score:pairScore(A.maturity,B.maturity),note:"Tendencia de integración"}
  ];
  const score=avg(...dimensions.map(d=>d.score));
  const communication=avg(pairScore(A.expression.value,B.personality.value),pairScore(B.expression.value,A.personality.value));
  const emotional=avg(pairScore(A.soul.value,B.soul.value),pairScore(A.soul.value,B.lifePath.value),pairScore(B.soul.value,A.lifePath.value));
  const action=avg(pairScore(A.lifePath.value,B.lifePath.value),pairScore(A.maturity,B.maturity));
  let label="Dinámica de contraste";
  if(score>=88) label="Afinidad simbólica muy alta";
  else if(score>=78) label="Afinidad simbólica alta";
  else if(score>=68) label="Buena complementariedad";
  else if(score>=58) label="Afinidad con contrastes";
  const coupleNumber=reduceNumber(A.lifePath.value+B.lifePath.value,true).value;
  const coupleExpression=reduceNumber(A.expression.value+B.expression.value,true).value;
  const text=`${A.name} (${meaning(A.lifePath.value).title}) y ${B.name} (${meaning(B.lifePath.value).title}) obtienen una afinidad simbólica global del ${score}%. Se comparan cinco dimensiones numerológicas; no es una medida científica ni una predicción de la relación.`;
  return {
    A,B,score,label,text,dimensions,
    layers:{communication,emotional,action},
    couple:{
      number:coupleNumber,
      title:meaning(coupleNumber).title,
      expression:coupleExpression,
      expressionTitle:meaning(coupleExpression).title
    }
  };
}
return { compareProfiles };
})();

/* --- report.js --- */
const __numeria_report = (() => {
  const { meaning } = __numeria_numerology;
  const { energyProfile, centers, readingSections } = __numeria_bioenergy;
  const { buildCalendar } = __numeria_calendar;
  const { chaldeanName } = __numeria_chaldean;

const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));

function buildReportHTML(profile){
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

function downloadReport(profile){
  const blob=new Blob([buildReportHTML(profile)],{type:"text/html;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=`informe-numeria-${slug(profile.name)}.html`;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),700);
}
function slug(s){return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}
return { buildReportHTML, downloadReport };
})();

/* --- app.js --- */
const __numeria_app = (() => {
  const { buildProfile, meaning, calculationExplanation } = __numeria_numerology;
  const { energyProfile, centers, readingSections } = __numeria_bioenergy;
  const { compareProfiles } = __numeria_compatibility;
  const { getProfiles, saveProfile, deleteProfile, clearProfiles, getSettings, saveSettings } = __numeria_storage;
  const { buildCalendar } = __numeria_calendar;
  const { chaldeanName: calcChaldean } = __numeria_chaldean;
  const { numerologyChartSVG, chartLegend } = __numeria_chart;
  const { downloadReport } = __numeria_report;
  const { validateName, validateBirthDate } = __numeria_validation;

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
return {};
})();
