import assert from "node:assert/strict";
import { validateName, validateBirthDate } from "../js/validation.js";
assert.equal(validateName("   ").ok,false);
assert.equal(validateName("1234").ok,false);
assert.equal(validateName("I. Roig").ok,true);
assert.equal(validateBirthDate("2024-02-29").ok,true);
assert.equal(validateBirthDate("2023-02-29").ok,false);
assert.equal(validateBirthDate("2099-01-01").ok,false);
console.log("Numeria 404 validation tests: OK");
