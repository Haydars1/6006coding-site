#!/usr/bin/env node
// Research-only Stage 1 publication gate. This script NEVER modifies the live catalogue.
import fs from 'node:fs';
const research = JSON.parse(fs.readFileSync(new URL('../docs/stage1-source-expansion-2026-10-13.json', import.meta.url),'utf8')).records;
const live = JSON.parse(fs.readFileSync(new URL('../dist/assets/6006-stage1-references.json', import.meta.url),'utf8')).examples;
const canonical = url => { const u = new URL(url); return u.hostname.toLowerCase() + u.pathname.replace(/\/$/, ''); };
const liveUrls = new Set(live.map(r=>canonical(r.sourceUrl)));
const seenIds = new Set(), seenUrls = new Set(), held = [], errors = [];
for (const r of research) {
  const reasons = [];
  if (!r.id || seenIds.has(r.id)) errors.push('duplicate/missing research ID: '+r.id);
  seenIds.add(r.id);
  if (!r.sourceUrl || !/^https:\/\//.test(r.sourceUrl)) { errors.push('invalid source URL: '+r.id); continue; }
  const url = canonical(r.sourceUrl);
  if (seenUrls.has(url)) errors.push('duplicate research URL: '+r.id);
  seenUrls.add(url);
  if (liveUrls.has(url)) reasons.push('already in live catalogue');
  if (r.stage1Power / r.stockPower > 1.65) reasons.push('power gain exceeds 65% manual review threshold');
  if (r.stage1Torque / r.stockTorque > 1.8) reasons.push('torque gain exceeds 80% manual review threshold');
  for (const field of ['stockPower','stockTorque','stage1Power','stage1Torque']) {
    if (!Number.isFinite(r[field]) || r[field] <= 0) errors.push('invalid '+field+': '+r.id);
  }
  if (r.sourcePageChecked !== true || r.advertisedClaimMatched !== true) reasons.push('publisher claim not marked checked');
  if (r.vehicleFitmentVerified !== false || r.ecuCompatibilityVerified !== false ||
      r.gearboxCompatibilityVerified !== false || r.legalApprovalVerified !== false) errors.push('unsupported approval claim: '+r.id);
  if (reasons.length) held.push({id:r.id,reasons});
}
const mechanicallyUnflagged = research.length - held.length;
console.log(JSON.stringify({liveCount:live.length,researchCount:research.length,held,mechanicallyUnflagged,
  notice:'Mechanically unflagged is NOT publication-approved. Manual source/vehicle/year/stock figures, independent legal suitability, and UI/CI tests are still required.'},null,2));
if (errors.length) { console.error(errors.join('\n')); process.exitCode=1; }
