// scripts/micro-bump-catalog-rates.mjs
// Internal-only gradual catalog $/lb bump ($0.02 → $0.06), cheapest → most expensive.
// No website UI. Logs to ledger + logs/paddle-blind-prices/.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LEDGER_PATH = path.join(ROOT, 'logs', 'paddle-blind-prices', 'materialCostLedger.json');
const OUT_DIR = path.join(ROOT, 'logs', 'paddle-blind-prices');
const STAMP = new Date().toISOString().slice(0, 10);

// Catalog cost order (least → most expensive)
const GRADE_ORDER = ['SA-36', 'SA-516-70', 'AL-6061', '304', '304L', '316L'];
const BUMP_LO = 0.02;
const BUMP_HI = 0.06;

const CONFIG_KEYS = {
  'SA-36': 'sa36PricePerLb',
  'SA-516-70': 'sa516PricePerLb',
  '304': 'ss304PricePerLb',
  '304L': 'ss304LPricePerLb',
  '316L': 'ss316LPricePerLb',
  'AL-6061': 'alPricePerLb',
};

const DENSITY = {
  'SA-36': 40.84,
  'SA-516-70': 40.84,
  '304': 42.665,
  '304L': 42.665,
  '316L': 43.15,
  'AL-6061': 14.39,
};

function round2(n) {
  return Math.round(n * 100) / 100;
}

function randBetween(a, b) {
  const buf = crypto.randomBytes(4);
  const u = buf.readUInt32BE(0) / 0xffffffff;
  return a + u * (b - a);
}

function makeBumps() {
  const n = GRADE_ORDER.length;
  const bumps = {};
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : i / (n - 1);
    const center = BUMP_LO + (BUMP_HI - BUMP_LO) * t;
    // Small randomness within ±$0.005, clamped to [0.02, 0.06]
    const jitter = randBetween(-0.005, 0.005);
    bumps[GRADE_ORDER[i]] = round2(Math.min(BUMP_HI, Math.max(BUMP_LO, center + jitter)));
  }
  // Enforce non-decreasing along grade ladder (fairness)
  let prev = BUMP_LO;
  for (const g of GRADE_ORDER) {
    if (bumps[g] < prev) bumps[g] = prev;
    bumps[g] = round2(bumps[g]);
    prev = bumps[g];
  }
  return bumps;
}

function wholesale(nps, mat, thk, ratePerLb) {
  const geom = {
    '1/2"': { od: 1.755, boltCircle: 2.38 },
    '2"': { od: 4.0, boltCircle: 4.75 },
    '4"': { od: 6.75, boltCircle: 7.5 },
    '6"': { od: 8.625, boltCircle: 9.5 },
  }[nps];
  const laborHrs = 0.35;
  const hw = Math.max(1.0, geom.od * 0.25);
  const hl = Math.max(3.5, geom.boltCircle - geom.od / 2 + 1.5);
  const area = (Math.PI * Math.pow(geom.od / 2, 2) + hw * hl) / 144;
  const actual = Math.round(area * (DENSITY[mat] * thk) * 100) / 100;
  const adj = Math.round(actual * 1.4 * 100) / 100;
  const sub = adj * ratePerLb + laborHrs * 83.85 + 5.0;
  return {
    adjustedLbs: adj,
    subtotal: round2(sub),
    wholesale: Math.max(25, Math.ceil(sub)),
  };
}

function patchRates(rates) {
  const files = [
    path.join(ROOT, 'src', 'data', 'masterGeometry.ts'),
    path.join(ROOT, 'src', 'App.tsx'),
    path.join(ROOT, 'IPG-Custom-ERP', 'src', 'data', 'masterGeometry.ts'),
  ];
  for (const file of files) {
    let s = fs.readFileSync(file, 'utf8');
    for (const [grade, key] of Object.entries(CONFIG_KEYS)) {
      const val = rates[grade];
      s = s.replace(new RegExp(`${key}:\\s*[0-9.]+`, 'g'), `${key}: ${val.toFixed(2)}`);
      const re = new RegExp(
        `(code:\\s*'${grade.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[\\s\\S]*?defaultPricePerLb:\\s*)[0-9.]+`,
        'm'
      );
      if (re.test(s)) s = s.replace(re, `$1${val.toFixed(2)}`);
    }
    fs.writeFileSync(file, s);
    console.log('Patched', path.relative(ROOT, file));
  }

  // paddleBlindMasterData pricePerLb
  for (const rel of [
    'src/data/paddleBlindMasterData.ts',
    'IPG-Custom-ERP/src/data/paddleBlindMasterData.ts',
  ]) {
    const file = path.join(ROOT, rel);
    let s = fs.readFileSync(file, 'utf8');
    for (const [grade, val] of Object.entries(rates)) {
      const re = new RegExp(
        `(code:\\s*'${grade.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[\\s\\S]*?pricePerLb:\\s*)[0-9.]+`,
        'm'
      );
      if (re.test(s)) s = s.replace(re, `$1${val.toFixed(2)}`);
    }
    fs.writeFileSync(file, s);
    console.log('Patched', rel);
  }
}

const ledger = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));
const before = {};
for (const g of GRADE_ORDER) {
  before[g] = ledger.current.grades[g].catalogRatePerLb;
}

const bumps = makeBumps();
const after = {};
for (const g of GRADE_ORDER) {
  after[g] = round2(before[g] + bumps[g]);
}

// Sample basic blinds (RF/FF, no add-ons, 11 ga, Class 150)
const samples = [
  { nps: '4"', mat: 'SA-516-70', thk: 0.1196, label: '4" 150# 11ga SA-516-70 (common utility)' },
  { nps: '2"', mat: 'SA-36', thk: 0.1196, label: '2" 150# 11ga SA-36' },
  { nps: '6"', mat: '304L', thk: 0.1196, label: '6" 150# 11ga 304L' },
  { nps: '4"', mat: '316L', thk: 0.1196, label: '4" 150# 11ga 316L' },
].map((s) => {
  const b = wholesale(s.nps, s.mat, s.thk, before[s.mat]);
  const a = wholesale(s.nps, s.mat, s.thk, after[s.mat]);
  return {
    ...s,
    adjustedLbs: b.adjustedLbs,
    wholesaleBefore: b.wholesale,
    wholesaleAfter: a.wholesale,
    delta: a.wholesale - b.wholesale,
    rateBefore: before[s.mat],
    rateAfter: after[s.mat],
    bumpPerLb: bumps[s.mat],
  };
});

const report = {
  generatedAt: new Date().toISOString(),
  type: 'micro_gradual_catalog_bump',
  note: 'Internal-only. Gradual $/lb bump $0.02→$0.06 cheapest→most expensive. Not exposed on website.',
  bumpRangeUsdPerLb: { min: BUMP_LO, max: BUMP_HI },
  gradeOrderLeastToMost: GRADE_ORDER,
  bumps,
  ratesBefore: before,
  ratesAfter: after,
  sampleBlinds: samples,
};

fs.mkdirSync(OUT_DIR, { recursive: true });
const reportPath = path.join(OUT_DIR, `micro-bump-${STAMP}.json`);
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');

// Update ledger current + history (files only)
for (const g of GRADE_ORDER) {
  ledger.current.grades[g].catalogRatePerLb = after[g];
}
ledger.current.asOf = STAMP;
ledger.current.alignedWithCodeDefaults = true;
ledger.history.push({
  id: `evt-micro-bump-${STAMP}`,
  at: new Date().toISOString(),
  type: 'micro_gradual_catalog_bump',
  note: 'Slight gradual raise $0.02→$0.06/lb least→most expensive grade. Internal log only; no website price adjuster UI.',
  bumps,
  ratesBefore: before,
  ratesApplied: after,
  sampleBlinds: samples,
});
fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2) + '\n');

patchRates(after);

console.log('\n=== $/lb before → after (bump) ===\n');
for (const g of GRADE_ORDER) {
  console.log(`${g.padEnd(12)} $${before[g].toFixed(2)} → $${after[g].toFixed(2)}  (+$${bumps[g].toFixed(2)}/lb)`);
}
console.log('\n=== Sample basic paddle blinds (wholesale) ===\n');
for (const s of samples) {
  console.log(`${s.label}`);
  console.log(`  ${s.adjustedLbs} lb adj × $${s.rateBefore} → $${s.rateAfter}/lb`);
  console.log(`  Wholesale: $${s.wholesaleBefore} → $${s.wholesaleAfter} (Δ $${s.delta})`);
}
console.log('\nLogged:', path.relative(ROOT, reportPath));
console.log('Ledger:', path.relative(ROOT, LEDGER_PATH));
