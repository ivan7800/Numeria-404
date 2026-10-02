const MASTER = new Set([11,22,33]);

export const meanings = {
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

export const letterMap = {
 A:1,J:1,S:1,B:2,K:2,T:2,C:3,L:3,U:3,D:4,M:4,V:4,E:5,N:5,W:5,
 F:6,O:6,X:6,G:7,P:7,Y:7,H:8,Q:8,Z:8,I:9,R:9
};

const vowels = new Set(["A","E","I","O","U"]);

export function normalizeName(name){
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().replace(/[^A-Z]/g,"");
}

export function reduceNumber(n, keepMasters=true){
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

export function numberFromName(name, mode="all"){
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

export function lifePathFromDate(dateStr){
  const digits = dateStr.replace(/\D/g,"");
  const total = sumDigitsText(digits);
  const reduced = reduceNumber(total,true);
  return {value:reduced.value,total,digits:[...digits].map(Number),steps:reduced.steps};
}

export function birthdayNumber(dateStr){
  const d = Number(dateStr.split("-")[2]);
  return reduceNumber(d,true).value;
}

export function attitudeNumber(dateStr){
  const [y,m,d] = dateStr.split("-").map(Number);
  return reduceNumber(m+d,true).value;
}

export function maturityNumber(life, expression){
  return reduceNumber(life+expression,true).value;
}

export function karmicDebts(rawTotals){
  const debts=[13,14,16,19];
  return [...new Set(rawTotals.filter(n=>debts.includes(n)))];
}

export function personalYear(dateStr, year=new Date().getFullYear()){
  const [,m,d]=dateStr.split("-").map(Number);
  const yrSum = String(year).split("").reduce((a,b)=>a+Number(b),0);
  return reduceNumber(m+d+yrSum,true).value;
}

export function pinnaclesAndChallenges(dateStr, lifePath){
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

export function frequencyMatrix(name,dateStr){
  const counts={1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
  for(const v of numberFromName(name).values){ if(v>=1&&v<=9) counts[v]++; }
  for(const ch of dateStr.replace(/\D/g,"")){ const n=Number(ch); if(n>=1&&n<=9) counts[n]++; }
  return counts;
}

export function buildProfile(name,dateStr,alias=""){
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

export function meaning(n){ return meanings[n] || meanings[reduceNumber(n,false).value] || meanings[1]; }

export function calculationExplanation(profile,key){
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
