import { buildProfile, reduceNumber, meaning } from "./numerology.js";

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

export function compareProfiles(nameA,dateA,nameB,dateB){
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
