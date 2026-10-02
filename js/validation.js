import { normalizeName } from "./numerology.js";

export const MAX_NAME_LENGTH = 120;

export function validateName(name){
  const raw=String(name ?? "");
  const trimmed=raw.trim();
  if(!trimmed) return {ok:false,message:"Introduce un nombre que contenga letras."};
  if(trimmed.length>MAX_NAME_LENGTH) return {ok:false,message:`El nombre no puede superar ${MAX_NAME_LENGTH} caracteres.`};
  if(!normalizeName(trimmed)) return {ok:false,message:"El nombre debe contener al menos una letra A–Z (se admiten tildes y ñ)."};
  return {ok:true,value:trimmed};
}

export function validateBirthDate(dateStr,{allowFuture=false}={}){
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

export function isValidSavedProfile(value){
  if(!value || typeof value!=="object") return false;
  return validateName(value.name).ok && validateBirthDate(value.birthDate).ok;
}
