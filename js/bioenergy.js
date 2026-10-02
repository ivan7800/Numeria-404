import { reduceNumber } from "./numerology.js";

export const centers = [
  {key:"root",name:"Raíz",numbers:[1,4,8],hint:"estructura, presencia y capacidad de sostener"},
  {key:"sacral",name:"Sacro",numbers:[2,5],hint:"vínculo, deseo de cambio y sensibilidad"},
  {key:"solar",name:"Plexo",numbers:[1,8],hint:"voluntad, dirección y poder personal"},
  {key:"heart",name:"Corazón",numbers:[2,6,9],hint:"cuidado, cooperación y amplitud emocional"},
  {key:"throat",name:"Garganta",numbers:[3,5],hint:"expresión, creatividad y comunicación"},
  {key:"brow",name:"Visión",numbers:[7,9,11],hint:"análisis, intuición y perspectiva"},
  {key:"crown",name:"Corona",numbers:[7,11,22,33],hint:"sentido, integración y visión global"}
];

export function energyProfile(profile){
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

export function readingSections(profile){
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
