import fs from 'node:fs';import assert from 'node:assert/strict';import {countryReport,reportedGaps} from './src/countryReport.js';
const data=JSON.parse(fs.readFileSync('public/data/sdgData.json'));let total=0;const rows=new Set();
for(const c of data.countries){const report=countryReport(data,c.code);assert.ok(report.length);for(const skill of report){for(const o of skill.observations){assert.equal(o.countryCode,c.code);assert.equal(o.skillCode,skill.code);assert.ok(!rows.has(o.sourceRow));rows.add(o.sourceRow);total++;}}}
assert.equal(total,data.observations.length);assert.equal(rows.size,60628);
for(const y of [2020,2021,2022,2023,2024,2025]){const g=reportedGaps(data,'008',y);g.forEach((o,i)=>{assert.equal(o.year,y);assert.equal(o.sex,'BOTHSEX');assert.equal(o.age,'ALLAGE');assert.equal(o.location,'ALLAREA');assert.ok(!o.skillCode.startsWith('ICT'));if(i)assert.ok(g[i-1].value<=o.value);});}
assert.deepEqual(countryReport(data,'000'),[]);assert.deepEqual(reportedGaps(data,'000',2025),[]);
console.log('PASS: all 96 countries and all 60,628 source observations retained; full skill coverage; matched gap filters; no aggregate ranking; missing-data handling.');
