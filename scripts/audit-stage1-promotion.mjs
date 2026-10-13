#!/usr/bin/env node
// Research-only Stage 1 publication gate. This script NEVER modifies the live catalogue.
import fs from 'node:fs';
const research = JSON.parse(fs.readFileSync(new URL('../docs/stage1-source-expansion-2026-10-13.json', import.meta.url),'utf8')).records;
const live = JSON.parse(fs.readFileSync(new URL('../dist/assets/6006-stage1-references.json', import.meta.url),'utf8')).examples;
const canonical = value => {
  if (typeof value !== 'string' || !/^https:\/\//i.test(value)) return null;
  try {
    const u = new URL(value);
    if (!u.hostname) return null;
    return u.hostname.toLowerCase().replace(/^www\./,'') + u.pathname.replace(/\/+$/,'').toLowerCase();
  } catch { return null; }
};
const liveUrls = new Set(live.map(r=>canonical(r.sourceUrl)).filter(Boolean));
// Duplicate URLs must also agree with the values already published. A mismatch
// signals source drift or a transcription error; never silently accept it.
const liveByUrl = new Map(live.filter(r=>canonical(r.sourceUrl)).map(r=>[canonical(r.sourceUrl),r]));
const liveIds = new Set(live.map(r=>r.id).filter(Boolean));
const seenIds = new Set(), seenUrls = new Set(), held = [], errors = [];
for (const r of research) {
  const reasons = [];
  const flagError = message => { errors.push(message + ': ' + (r.id || '<missing id>')); reasons.push(message); };
  if (!r.id || seenIds.has(r.id)) flagError('duplicate/missing research ID');
  if (r.id) seenIds.add(r.id);
  if (!r.vehicle || typeof r.vehicle !== 'string' || !r.publisher || typeof r.publisher !== 'string') flagError('missing vehicle/publisher evidence');
  // A checked advertisement without an explicit model year is not enough to
  // prove that the advertised figures apply to the requested model generation.
  // This is a manual-review hold, not an assertion that the source lacks a year.
  if (!/\b(?:19|20)\d{2}\b/.test(r.vehicle || ''))
    reasons.push('research vehicle label lacks a model year; verify publisher year/variant before publication');
  const url = canonical(r.sourceUrl);
  if (!url) flagError('invalid HTTPS source URL');
  else {
    if (seenUrls.has(url)) flagError('duplicate research URL');
    seenUrls.add(url);
    if (liveUrls.has(url)) {
      reasons.push('already in live catalogue (source URL)');
      const published = liveByUrl.get(url);
      for (const [researchField,liveField] of [
        ['stockPower','sourceStockHp'],['stockTorque','sourceStockNm'],
        ['stage1Power','publishedStage1Ps'],['stage1Torque','publishedStage1Nm']
      ]) {
        if (r[researchField] !== published[liveField]) flagError('live/research numeric mismatch: ' + researchField);
      }
    }
  }
  if (r.id && liveIds.has(r.id)) reasons.push('already in live catalogue (record ID)');
  // Editorial exclusions must remain binding even if numeric thresholds change.
  if (r.excludedFromPublish === true) reasons.push('explicit editorial exclusion from publication');
  if (typeof r.reviewHoldReason === 'string' && r.reviewHoldReason.trim()) reasons.push('manual review hold: ' + r.reviewHoldReason.trim());
  // A numeric value without its original unit cannot be compared or promoted safely.
  if (!['cv','ch','PS'].includes(r.powerUnit) || r.torqueUnit !== 'Nm') flagError('unsupported or missing advertised units');
  for (const field of ['stockPower','stockTorque','stage1Power','stage1Torque']) {
    if (!Number.isFinite(r[field]) || r[field] <= 0) flagError('invalid ' + field);
  }
  if (Number.isFinite(r.stage1Power) && Number.isFinite(r.stockPower) && r.stage1Power <= r.stockPower) reasons.push('non-positive advertised power gain requires review');
  if (Number.isFinite(r.stage1Torque) && Number.isFinite(r.stockTorque) && r.stage1Torque <= r.stockTorque) reasons.push('non-positive advertised torque gain requires review');
  if (r.stage1Power / r.stockPower > 1.65) reasons.push('power gain exceeds 65% manual review threshold');
  if (r.stage1Torque / r.stockTorque > 1.8) reasons.push('torque gain exceeds 80% manual review threshold');
  if (r.sourcePageChecked !== true || r.advertisedClaimMatched !== true) reasons.push('publisher claim not marked checked');
  if (r.vehicleFitmentVerified !== false || r.ecuCompatibilityVerified !== false ||
      r.gearboxCompatibilityVerified !== false || r.legalApprovalVerified !== false) flagError('unsupported approval claim');
  if (reasons.length) held.push({id:r.id,reasons});
}
// Invalid records are always held; do not count them as promotion candidates.
const mechanicallyUnflagged = research.length - held.length;
console.log(JSON.stringify({liveCount:live.length,researchCount:research.length,held,mechanicallyUnflagged,
  notice:'Mechanically unflagged is NOT publication-approved. Manual source/vehicle/year/stock figures, independent legal suitability, and UI/CI tests are still required.'},null,2));
if (errors.length) { console.error(errors.join('\n')); process.exitCode=1; }
