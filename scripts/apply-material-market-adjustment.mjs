// scripts/apply-material-market-adjustment.mjs
// Propose / apply fair catalog $/lb moves from market plate quotes using materialCostLedger.json
//
// Usage:
//   node scripts/apply-material-market-adjustment.mjs --propose
//   node scripts/apply-material-market-adjustment.mjs --propose --quote 316L=7.10 --quote 304=4.80
//   node scripts/apply-material-market-adjustment.mjs --propose --across 3
//   node scripts/apply-material-market-adjustment.mjs --apply --note "Ni surge" --quote 316L=7.10
//   node scripts/apply-material-market-adjustment.mjs --apply --write-config --note "Ni surge" --quote 316L=7.10
//
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LEDGER_PATH = path.join(ROOT, 'logs', 'paddle-blind-prices', 'materialCostLedger.json');

function parseArgs(argv) {
  const out = { propose: false, apply: false, writeConfig: false, note: '', quotes: {}, acrossPct: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--propose') out.propose = true;
    else if (a === '--apply') out.apply = true;
    else if (a === '--write-config') out.writeConfig = true;
    else if (a === '--note') out.note = argv[++i] || '';
    else if (a === '--across') out.acrossPct = parseFloat(argv[++i]);
    else if (a === '--quote') {
      const raw = argv[++i] || '';
      const [grade, val] = raw.split('=');
      if (!grade || val == null || Number.isNaN(parseFloat(val))) {
        throw new Error(`Bad --quote "${raw}". Use GRADE=number e.g. 316L=7.10`);
      }
      out.quotes[grade] = parseFloat(val);
    } else if (a === '--help' || a === '-h') out.help = true;
  }
  if (!out.propose && !out.apply) out.propose = true;
  return out;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function computeCandidate(grade, anchor, current, policy, marketNow) {
  const marketAtAnchor = anchor.marketQuotePerLb;
  const rawDelta = marketNow - marketAtAnchor;
  const uncapped = anchor.catalogRatePerLb + (policy.passThroughPct / 100) * rawDelta;
  const index = round2(100 * (marketNow / marketAtAnchor));

  let candidate = uncapped;
  const floor = anchor.catalogRatePerLb * (policy.floorPctOfAnchor / 100);
  if (candidate < floor) candidate = floor;

  const applied = current.catalogRatePerLb;
  const step = candidate - applied;
  const absStep = Math.abs(step);
  const deadbandAbs = applied * (policy.deadbandPct / 100);

  let action = 'hold';
  let nextRate = applied;
  let capped = false;
  let remainder = 0;

  if (absStep < deadbandAbs) {
    action = 'hold_deadband';
  } else if (absStep > policy.maxStepPerReview) {
    nextRate = round2(applied + Math.sign(step) * policy.maxStepPerReview);
    capped = true;
    remainder = round2(candidate - nextRate);
    action = step > 0 ? 'raise_capped' : 'cut_capped';
  } else {
    nextRate = round2(candidate);
    action = step > 0 ? 'raise' : step < 0 ? 'cut' : 'hold';
  }

  return {
    grade,
    family: policy.family,
    stability: policy.stability,
    reviewCadence: policy.reviewCadence,
    marketQuoteAtAnchor: marketAtAnchor,
    marketQuoteNow: marketNow,
    marketIndex: index,
    surgeIndexAlert: index >= policy.surgeIndexAlert,
    reliefAlert: index <= 90,
    allowCuts: true,
    anchorCatalog: anchor.catalogRatePerLb,
    appliedCatalog: applied,
    passThroughPct: policy.passThroughPct,
    uncappedCandidate: round2(uncapped),
    nextCatalog: nextRate,
    delta: round2(nextRate - applied),
    capped,
    remainder,
    action,
  };
}

function loadLedger() {
  return JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));
}

function patchConfigFiles(rates) {
  const map = {
    sa36PricePerLb: rates['SA-36'],
    sa516PricePerLb: rates['SA-516-70'],
    ss304PricePerLb: rates['304'],
    ss304LPricePerLb: rates['304L'],
    ss316LPricePerLb: rates['316L'],
    alPricePerLb: rates['AL-6061'],
  };
  const defaultMap = {
    'SA-36': rates['SA-36'],
    'SA-516-70': rates['SA-516-70'],
    '304': rates['304'],
    '304L': rates['304L'],
    '316L': rates['316L'],
    'AL-6061': rates['AL-6061'],
  };

  const files = [
    path.join(ROOT, 'src', 'data', 'masterGeometry.ts'),
    path.join(ROOT, 'src', 'App.tsx'),
    path.join(ROOT, 'IPG-Custom-ERP', 'src', 'data', 'masterGeometry.ts'),
  ];

  for (const file of files) {
    let s = fs.readFileSync(file, 'utf8');
    for (const [key, val] of Object.entries(map)) {
      s = s.replace(new RegExp(`${key}:\\s*[0-9.]+`, 'g'), `${key}: ${val.toFixed(2)}`);
    }
    // defaultPricePerLb blocks follow material order — patch carefully by nearby code labels
    for (const [grade, val] of Object.entries(defaultMap)) {
      const re = new RegExp(
        `(code:\\s*'${grade.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[\\s\\S]*?defaultPricePerLb:\\s*)[0-9.]+`,
        'm'
      );
      if (re.test(s)) s = s.replace(re, `$1${val.toFixed(2)}`);
    }
    fs.writeFileSync(file, s);
    console.log('Patched', path.relative(ROOT, file));
  }
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(`See header comment in ${path.basename(fileURLToPath(import.meta.url))}`);
    return;
  }

  const ledger = loadLedger();
  const grades = Object.keys(ledger.anchorBaseline.grades);
  const proposals = [];

  for (const grade of grades) {
    const anchor = ledger.anchorBaseline.grades[grade];
    const current = ledger.current.grades[grade];
    const policy = ledger.policy.grades[grade];

    let marketNow = current.marketQuotePerLb;
    if (args.quotes[grade] != null) marketNow = args.quotes[grade];
    else if (args.acrossPct != null) {
      marketNow = round2(anchor.marketQuotePerLb * (1 + args.acrossPct / 100));
    }

    proposals.push(computeCandidate(grade, anchor, current, policy, marketNow));
  }

  console.log('\n=== Material market adjustment proposal ===\n');
  console.table(
    proposals.map((p) => ({
      grade: p.grade,
      family: p.family,
      mktIdx: p.marketIndex,
      mktNow: p.marketQuoteNow,
      catalogNow: p.appliedCatalog,
      next: p.nextCatalog,
      delta: p.delta,
      action: p.action,
      surge: p.surgeAlert ? 'YES' : '',
      relief: p.reliefAlert ? 'YES' : '',
    }))
  );

  const moving = proposals.filter((p) => p.delta !== 0);
  console.log(`\n${moving.length} grade(s) would move; ${proposals.length - moving.length} hold.`);
  for (const p of proposals.filter((p) => p.surgeAlert)) {
    console.log(`  SURGE ALERT: ${p.grade} market index ${p.marketIndex} (threshold ${ledger.policy.grades[p.grade].surgeIndexAlert})`);
  }
  for (const p of proposals.filter((p) => p.reliefAlert)) {
    console.log(`  RELIEF ALERT: ${p.grade} market index ${p.marketIndex} — consider passing the cut`);
  }
  for (const p of proposals.filter((p) => p.action === 'cut' || p.action === 'cut_capped')) {
    console.log(`  CUT: ${p.grade} $${p.appliedCatalog} → $${p.nextCatalog} (Δ ${p.delta})`);
  }
  for (const p of proposals.filter((p) => p.capped)) {
    console.log(`  CAPPED: ${p.grade} — applied Δ ${p.delta}, remainder ${p.remainder} for next review`);
  }

  // Worked example print when --across 3 with no custom quotes
  if (args.acrossPct === 3 && Object.keys(args.quotes).length === 0) {
    console.log('\n(Example B style) Across-the-board +3% mill move → differential catalog deltas above.');
  }

  if (!args.apply) {
    console.log('\nDry run only. Re-run with --apply [--write-config] --note "…" to commit to the ledger.');
    return;
  }

  const now = new Date().toISOString();
  const ratesApplied = {};
  for (const p of proposals) {
    ratesApplied[p.grade] = p.nextCatalog;
    ledger.current.grades[p.grade] = {
      catalogRatePerLb: p.nextCatalog,
      marketQuotePerLb: p.marketQuoteNow,
      marketIndex: p.marketIndex,
    };
  }
  ledger.current.asOf = now.slice(0, 10);
  ledger.current.alignedWithCodeDefaults = Boolean(args.writeConfig);
  ledger.history.push({
    id: `evt-${now.replace(/[:.]/g, '-')}`,
    at: now,
    type: 'market_adjustment',
    note: args.note || 'Market adjustment applied',
    acrossPct: args.acrossPct,
    quotes: args.quotes,
    proposal: proposals,
    ratesApplied,
  });

  fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2) + '\n');
  console.log('\nLedger updated:', path.relative(ROOT, LEDGER_PATH));

  if (args.writeConfig) {
    patchConfigFiles(ratesApplied);
    console.log('Config defaults patched. Re-export matrix + spot-check before deploy.');
  } else {
    console.log('Rates NOT written to App/masterGeometry. Pass --write-config to sync code defaults.');
    console.log('Target catalog $/lb:', ratesApplied);
  }
}

main();
