import { normalizeName } from "./numerology.js";

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

export function chaldeanName(name){
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

export function chaldeanLetterValue(letter){
  return chaldeanMap[normalizeName(letter)] || 0;
}

export function chaldeanMeaning(n){
  return meanings[reduceSingle(n)] || "";
}
