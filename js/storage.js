import { buildProfile } from "./numerology.js";
import { isValidSavedProfile } from "./validation.js";

const KEY="numeria404.profiles.v2";
const LEGACY_KEY="numeria404.profiles.v1";
const SETTINGS="numeria404.settings.v2";
const LEGACY_SETTINGS="numeria404.settings.v1";
const SCHEMA_VERSION=2;

export class StorageError extends Error{
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

export function getProfiles(){
  return rawProfiles().map(hydrate).filter(Boolean).slice(0,100);
}
export function saveProfile(profile){
  if(!isValidSavedProfile(profile)) throw new StorageError("El perfil no contiene un nombre o fecha válidos.");
  const raw=rawProfiles().filter(isValidSavedProfile).map(toStored);
  const item=toStored(profile);
  const same=raw.findIndex(p=>p.name===item.name && p.birthDate===item.birthDate);
  if(same>=0) item.id=raw[same].id || item.id;
  if(same>=0) raw[same]=item; else raw.unshift(item);
  writeProfiles(raw.slice(0,100));
  return getProfiles();
}
export function deleteProfile(id){
  const raw=rawProfiles().filter(isValidSavedProfile).map(toStored).filter(p=>p.id!==id);
  writeProfiles(raw);
  return getProfiles();
}
export function clearProfiles(){
  try{localStorage.removeItem(KEY);localStorage.removeItem(LEGACY_KEY);}
  catch(error){throw new StorageError("No se pudieron borrar los perfiles locales.",error);}
}
export function getSettings(){
  const current=parseObject(safeGet(SETTINGS));
  if(Object.keys(current).length) return current;
  return parseObject(safeGet(LEGACY_SETTINGS));
}
export function saveSettings(data){
  const safe=data && typeof data==="object" && !Array.isArray(data)?data:{};
  try{localStorage.setItem(SETTINGS,JSON.stringify({...getSettings(),...safe}));}
  catch(error){throw new StorageError("No se pudieron guardar los ajustes locales.",error);}
}
