import assert from "node:assert/strict";
import { chaldeanName } from "../js/chaldean.js";
import { buildCalendar, personalMonth } from "../js/calendar.js";
import { buildProfile } from "../js/numerology.js";
import { compareProfiles } from "../js/compatibility.js";
import { numerologyChartSVG } from "../js/chart.js";
import { buildReportHTML } from "../js/report.js";

const ch=chaldeanName("Ada Lovelace");
assert.equal(ch.letters.length,11);
assert.equal(ch.values.length,11);
assert.ok(ch.total>0);
assert.ok(ch.value>=1 && ch.value<=9);

const cal=buildCalendar("1978-05-09",2026,2030);
assert.equal(cal.length,5);
assert.equal(cal[0].year,2026);
assert.equal(cal[4].year,2030);
assert.equal(cal[0].months.length,12);
assert.ok(personalMonth("1978-05-09",2026,1)>=1);

const p=buildProfile("Ada Lovelace","1815-12-10");
const svg=numerologyChartSVG(p);
assert.ok(svg.includes("<svg"));
assert.ok(svg.includes("CAMINO"));

const c=compareProfiles("Ada Lovelace","1815-12-10","Alan Turing","1912-06-23");
assert.equal(c.dimensions.length,5);
assert.ok(c.score>=0 && c.score<=100);
assert.ok(c.layers.communication>=0 && c.layers.communication<=100);
assert.ok(c.couple.number>=1);

const report=buildReportHTML(p);
assert.ok(report.includes("Informe Numeria"));
assert.ok(report.includes("Calendario numerológico 2026–2030"));

console.log("Numeria 404 V2 tests: OK");
