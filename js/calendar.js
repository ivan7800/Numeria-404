import { personalYear, reduceNumber } from "./numerology.js";

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

export function personalMonth(dateStr, year, month){
  const py=personalYear(dateStr,year);
  return reduceNumber(py+month,true).value;
}

export function buildCalendar(dateStr,startYear=2026,endYear=2030){
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

export function cycleMeaning(n){
  return cycleMeanings[n] || cycleMeanings[reduceNumber(n,false).value] || "";
}
