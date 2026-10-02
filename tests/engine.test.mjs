import assert from "node:assert/strict";
import {
  reduceNumber, lifePathFromDate, numberFromName,
  buildProfile, pinnaclesAndChallenges
} from "../js/numerology.js";

assert.equal(reduceNumber(29, true).value, 11, "29 debe reducir a 11 conservando maestros");
assert.equal(reduceNumber(38, true).value, 11, "38 debe reducir a 11");
assert.equal(reduceNumber(22, true).value, 22, "22 debe conservarse");
assert.equal(reduceNumber(22, false).value, 4, "22 debe reducirse a 4 sin maestros");

const life = lifePathFromDate("1815-12-10");
assert.equal(life.value, 1, "Camino de Vida de Ada Lovelace esperado: 1");

const expression = numberFromName("Ada Lovelace", "all");
assert.equal(expression.value, 9, "Expresión de Ada Lovelace esperada: 9");

const profile = buildProfile("Ada Lovelace", "1815-12-10", "QA");
assert.equal(profile.lifePath.value, 1);
assert.equal(profile.expression.value, 9);
assert.equal(profile.soul.value, 1);
assert.equal(profile.personality.value, 8);
assert.equal(profile.maturity, 1);
assert.equal(profile.attitude, 22);

const cycles = pinnaclesAndChallenges("1815-12-10", 1);
assert.deepEqual(cycles.pinnacles, [4,7,11,9]);
assert.deepEqual(cycles.challenges, [2,5,3,3]);

console.log("Numeria 404 engine tests: OK");
