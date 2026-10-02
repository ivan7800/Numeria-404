import assert from "node:assert/strict";

class MemoryStorage{
  constructor(seed={}){this.data={...seed};this.failWrites=false;}
  getItem(k){return Object.prototype.hasOwnProperty.call(this.data,k)?this.data[k]:null;}
  setItem(k,v){if(this.failWrites)throw new Error("quota");this.data[k]=String(v);}
  removeItem(k){if(this.failWrites)throw new Error("blocked");delete this.data[k];}
}
globalThis.localStorage=new MemoryStorage({"numeria404.profiles.v2":"{}"});
const storage=await import("../js/storage.js");
assert.deepEqual(storage.getProfiles(),[],"JSON válido con forma incorrecta debe degradar a lista vacía");

localStorage.data["numeria404.profiles.v2"]=JSON.stringify([{id:"x",name:"Ada Lovelace",birthDate:"1815-12-10",alias:"QA"},{id:"bad",name:"   ",birthDate:"2099-01-01"}]);
const profiles=storage.getProfiles();
assert.equal(profiles.length,1,"Perfiles corruptos deben filtrarse");
assert.equal(profiles[0].name,"Ada Lovelace");
assert.ok(profiles[0].lifePath,"El perfil almacenado debe rehidratarse y recalcularse");
assert.notEqual(profiles[0].personalYear,99,"Los valores calculados almacenados no deben prevalecer sobre el recálculo actual");

localStorage.failWrites=true;
assert.throws(()=>storage.saveProfile(profiles[0]),storage.StorageError,"Errores de cuota/bloqueo deben propagarse de forma controlada");
console.log("Numeria 404 storage tests: OK");
