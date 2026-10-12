#!/usr/bin/env node
// Validate research records before any public catalog import.
import fs from 'node:fs';
const file = new URL('../docs/stage1-source-expansion-2026-10-13.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const ids = new Set(), urls = new Set(), errors = [];
for (const [i,r] of data.records.entries()) {
  const label = r.id || String(i);
  if (!r.id || ids.has(r.id)) errors.push(label + ': duplicate/missing id');
  ids.add(r.id);
  if (!r.sourceUrl || urls.has(r.sourceUrl)) errors.push(label + ': duplicate/missing source URL');
  urls.add(r.sourceUrl);
  if (!/^https:\/\//.test(r.sourceUrl || '')) errors.push(label + ': non-HTTPS source');
  if (!r.vehicle || !r.publisher) errors.push(label + ': missing vehicle/publisher');
  for (const k of ['stockPower','stockTorque','stage1Power','stage1Torque']) {
    if (!Number.isFinite(r[k]) || r[k] <= 0) errors.push(label + ': invalid ' + k);
  }
  if (!['ch','cv','hp','PS','kW'].includes(r.powerUnit)) errors.push(label + ': invalid power unit');
  if (r.torqueUnit !== 'Nm') errors.push(label + ': invalid torque unit');
  if (r.advertisedClaimMatched === true && r.sourcePageChecked !== true) errors.push(label + ': claimed match without page check');
  for (const k of ['vehicleFitmentVerified','ecuCompatibilityVerified','gearboxCompatibilityVerified','legalApprovalVerified']) {
    if (r[k] !== false) errors.push(label + ': unsupported compatibility claim ' + k);
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('PASS: ' + data.records.length + ' unique research records; source claims are not independent validation.');
