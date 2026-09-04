// scripts/export-paddle-blind-price-matrix.mjs
// Freeze paddle-blind catalog prices (baseline → after → delta) for graduated $/lb raises.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'logs', 'paddle-blind-prices');
const STAMP = new Date().toISOString().slice(0, 10);

const NPS_SIZES = [
  '1/2"', '3/4"', '1"', '1-1/4"', '1-1/2"', '2"', '2-1/2"', '3"', '4"',
  '6"', '8"', '10"', '12"', '14"', '16"', '18"', '20"', '24"'
];

const PRESSURE_CLASSES = [150, 300, 600, 900, 1500];

const THICKNESS_OPTIONS = [
  { label: '11 Gauge', thickness: 0.1196 },
  { label: '1/8"', thickness: 0.125 },
  { label: '3/16"', thickness: 0.1875 },
  { label: '1/4"', thickness: 0.250 },
  { label: '5/16"', thickness: 0.3125 },
  { label: '3/8"', thickness: 0.375 },
  { label: '1/2"', thickness: 0.500 },
  { label: '5/8"', thickness: 0.625 },
  { label: '3/4"', thickness: 0.750 },
  { label: '7/8"', thickness: 0.875 },
  { label: '1"', thickness: 1.000 },
  { label: '1-1/8"', thickness: 1.125 },
  { label: '1-1/4"', thickness: 1.250 },
  { label: '1-3/8"', thickness: 1.375 },
  { label: '1-1/2"', thickness: 1.500 },
  { label: '1-5/8"', thickness: 1.625 },
  { label: '1-3/4"', thickness: 1.750 },
  { label: '1-7/8"', thickness: 1.875 },
  { label: '2"', thickness: 2.000 },
  { label: '2-1/4"', thickness: 2.250 },
  { label: '2-1/2"', thickness: 2.500 },
  { label: '3"', thickness: 3.000 },
];

const MATERIAL_META = {
  'SA-36': { density1InchSqFt: 40.84 },
  'SA-516-70': { density1InchSqFt: 40.84 },
  '304': { density1InchSqFt: 42.665 },
  '304L': { density1InchSqFt: 42.665 },
  '316L': { density1InchSqFt: 43.15 },
  'AL-6061': { density1InchSqFt: 14.39 },
};

/** Rates before this raise — frozen for the baseline log. */
const BASELINE_RATES = {
  'SA-36': 1.85,
  'SA-516-70': 2.15,
  '304': 5.50,
  '304L': 5.95,
  '316L': 7.40,
  'AL-6061': 5.00,
};

/** Graduated slight material-cost raise (approved schedule). */
const NEW_RATES = {
  'SA-36': 1.87,       // +0.02
  'SA-516-70': 2.18,   // +0.03
  '304': 5.55,         // +0.05
  '304L': 6.01,        // +0.06
  '316L': 7.48,        // +0.08
  'AL-6061': 5.10,     // +0.10
};

const RATE_BUMPS = Object.fromEntries(
  Object.keys(BASELINE_RATES).map((k) => [k, +(NEW_RATES[k] - BASELINE_RATES[k]).toFixed(2)])
);

const LABOR_HOURS = {
  '1/2"': 0.35, '3/4"': 0.35, '1"': 0.35, '1-1/4"': 0.35, '1-1/2"': 0.35,
  '2"': 0.35, '2-1/2"': 0.35, '3"': 0.35, '4"': 0.35, '6"': 0.35,
  '8"': 0.35, '10"': 0.35, '12"': 0.38, '14"': 0.42, '16"': 0.47,
  '18"': 0.52, '20"': 0.56, '24"': 0.61
};

const MASTER_GEOMETRY = {
  150: {
    '1/2"': { od: 1.755, boltCircle: 2.380 }, '3/4"': { od: 2.125, boltCircle: 2.750 },
    '1"': { od: 2.495, boltCircle: 3.120 }, '1-1/4"': { od: 2.875, boltCircle: 3.500 },
    '1-1/2"': { od: 3.255, boltCircle: 3.880 }, '2"': { od: 4.000, boltCircle: 4.750 },
    '2-1/2"': { od: 4.750, boltCircle: 5.500 }, '3"': { od: 5.250, boltCircle: 6.000 },
    '4"': { od: 6.750, boltCircle: 7.500 }, '6"': { od: 8.625, boltCircle: 9.500 },
    '8"': { od: 10.875, boltCircle: 11.750 }, '10"': { od: 13.250, boltCircle: 14.250 },
    '12"': { od: 16.000, boltCircle: 17.000 }, '14"': { od: 17.625, boltCircle: 18.750 },
    '16"': { od: 20.125, boltCircle: 21.250 }, '18"': { od: 21.500, boltCircle: 22.750 },
    '20"': { od: 23.750, boltCircle: 25.000 }, '24"': { od: 28.125, boltCircle: 29.500 },
  },
  300: {
    '1/2"': { od: 1.995, boltCircle: 2.620 }, '3/4"': { od: 2.500, boltCircle: 3.250 },
    '1"': { od: 2.750, boltCircle: 3.500 }, '1-1/4"': { od: 3.125, boltCircle: 3.880 },
    '1-1/2"': { od: 3.625, boltCircle: 4.500 }, '2"': { od: 4.250, boltCircle: 5.000 },
    '2-1/2"': { od: 5.005, boltCircle: 5.880 }, '3"': { od: 5.745, boltCircle: 6.620 },
    '4"': { od: 7.005, boltCircle: 7.880 }, '6"': { od: 9.745, boltCircle: 10.620 },
    '8"': { od: 12.000, boltCircle: 13.000 }, '10"': { od: 14.125, boltCircle: 15.250 },
    '12"': { od: 16.500, boltCircle: 17.750 }, '14"': { od: 19.000, boltCircle: 20.250 },
    '16"': { od: 21.125, boltCircle: 22.500 }, '18"': { od: 23.375, boltCircle: 24.750 },
    '20"': { od: 25.625, boltCircle: 27.000 }, '24"': { od: 30.375, boltCircle: 32.000 },
  },
  600: {
    '1/2"': { od: 1.995, boltCircle: 2.620 }, '3/4"': { od: 2.500, boltCircle: 3.250 },
    '1"': { od: 2.750, boltCircle: 3.500 }, '1-1/4"': { od: 3.125, boltCircle: 3.880 },
    '1-1/2"': { od: 3.625, boltCircle: 4.500 }, '2"': { od: 4.250, boltCircle: 5.000 },
    '2-1/2"': { od: 5.005, boltCircle: 5.880 }, '3"': { od: 5.745, boltCircle: 6.620 },
    '4"': { od: 7.500, boltCircle: 8.500 }, '6"': { od: 10.375, boltCircle: 11.500 },
    '8"': { od: 12.500, boltCircle: 13.750 }, '10"': { od: 15.625, boltCircle: 17.000 },
    '12"': { od: 17.875, boltCircle: 19.250 }, '14"': { od: 19.250, boltCircle: 20.750 },
    '16"': { od: 22.125, boltCircle: 23.750 }, '18"': { od: 24.000, boltCircle: 25.750 },
    '20"': { od: 26.750, boltCircle: 28.500 }, '24"': { od: 31.000, boltCircle: 33.000 },
  },
  900: {
    '1/2"': { od: 2.375, boltCircle: 3.250 }, '3/4"': { od: 2.625, boltCircle: 3.500 },
    '1"': { od: 3.000, boltCircle: 4.000 }, '1-1/4"': { od: 3.375, boltCircle: 4.380 },
    '1-1/2"': { od: 3.755, boltCircle: 4.880 }, '2"': { od: 5.500, boltCircle: 6.500 },
    '2-1/2"': { od: 6.375, boltCircle: 7.500 }, '3"': { od: 6.500, boltCircle: 7.500 },
    '4"': { od: 8.000, boltCircle: 9.250 }, '6"': { od: 11.250, boltCircle: 12.500 },
    '8"': { od: 14.000, boltCircle: 15.500 }, '10"': { od: 17.000, boltCircle: 18.500 },
    '12"': { od: 19.500, boltCircle: 21.000 }, '14"': { od: 20.375, boltCircle: 22.000 },
    '16"': { od: 22.500, boltCircle: 24.250 }, '18"': { od: 25.000, boltCircle: 27.000 },
    '20"': { od: 27.375, boltCircle: 29.500 }, '24"': { od: 32.875, boltCircle: 35.500 },
  },
  1500: {
    '1/2"': { od: 2.375, boltCircle: 3.250 }, '3/4"': { od: 2.625, boltCircle: 3.500 },
    '1"': { od: 3.000, boltCircle: 4.000 }, '1-1/4"': { od: 3.375, boltCircle: 4.380 },
    '1-1/2"': { od: 3.755, boltCircle: 4.880 }, '2"': { od: 5.500, boltCircle: 6.500 },
    '2-1/2"': { od: 6.375, boltCircle: 7.500 }, '3"': { od: 6.750, boltCircle: 8.000 },
    '4"': { od: 8.125, boltCircle: 9.500 }, '6"': { od: 11.000, boltCircle: 12.500 },
    '8"': { od: 13.750, boltCircle: 15.500 }, '10"': { od: 17.000, boltCircle: 19.000 },
    '12"': { od: 20.375, boltCircle: 22.500 }, '14"': { od: 22.625, boltCircle: 25.000 },
    '16"': { od: 25.125, boltCircle: 27.750 }, '18"': { od: 27.625, boltCircle: 30.500 },
    '20"': { od: 29.625, boltCircle: 32.750 }, '24"': { od: 35.375, boltCircle: 39.000 },
  },
};

const LABOR_RATE = 83.85;
const BASE_HANDLING = 5.00;
const SCRAP = 1.40;
const LIST_BUFFER = 1.10; // publicListBufferPct 10%

function calculateRow(pClass, nps, matCode, thicknessVal, thicknessLabel, pricePerLb) {
  const geom = MASTER_GEOMETRY[pClass][nps];
  const mat = MATERIAL_META[matCode];
  const laborHrs = LABOR_HOURS[nps] || 0.35;
  const handleWidth = Math.max(1.0, geom.od * 0.25);
  const handleLength = Math.max(3.5, geom.boltCircle - geom.od / 2 + 1.5);
  const totalAreaSqFt = ((Math.PI * Math.pow(geom.od / 2, 2)) + (handleWidth * handleLength)) / 144.0;
  const actualWt = Math.round(totalAreaSqFt * (mat.density1InchSqFt * thicknessVal) * 100) / 100;
  const adjustedWt = Math.round(actualWt * SCRAP * 100) / 100;
  const matPrice = adjustedWt * pricePerLb;
  const laborPrice = laborHrs * LABOR_RATE;
  const subtotal = matPrice + laborPrice + BASE_HANDLING;
  const wholesale = Math.max(25, Math.ceil(subtotal));
  const list = Math.max(wholesale, Math.ceil(wholesale * LIST_BUFFER));

  const classCode = pClass === 1500 ? 'C1500' : `CX${pClass}`;
  const sizeCode = `S${nps.replace('"', '')}`;
  const thkClean = thicknessLabel.replace(/["\s()]/g, '').replace('Gauge', 'GA');
  const partNumber = `PB${matCode.replace('-', '')}-${classCode}T${thkClean}${sizeCode}`;

  return {
    partNumber,
    nps,
    pressureClass: pClass,
    material: matCode,
    thicknessLabel,
    thicknessIn: thicknessVal,
    pricePerLb,
    actualWeightLbs: Math.max(0.1, actualWt),
    adjustedWeightLbs: Math.max(0.15, adjustedWt),
    wholesalePrice: wholesale,
    listPrice: list,
  };
}

function buildMatrix(rates) {
  const rows = [];
  for (const pClass of PRESSURE_CLASSES) {
    for (const nps of NPS_SIZES) {
      for (const thk of THICKNESS_OPTIONS) {
        for (const matCode of Object.keys(MATERIAL_META)) {
          rows.push(calculateRow(pClass, nps, matCode, thk.thickness, thk.label, rates[matCode]));
        }
      }
    }
  }
  return rows;
}

function toCsv(rows) {
  const headers = [
    'partNumber', 'nps', 'pressureClass', 'material', 'thicknessLabel', 'thicknessIn',
    'pricePerLb', 'actualWeightLbs', 'adjustedWeightLbs', 'wholesalePrice', 'listPrice',
  ];
  const escape = (v) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))].join('\n');
}

function summarize(rows, rates) {
  const byMat = {};
  for (const r of rows) {
    if (!byMat[r.material]) byMat[r.material] = { count: 0, minWholesale: Infinity, maxWholesale: 0, sumWholesale: 0 };
    const b = byMat[r.material];
    b.count += 1;
    b.minWholesale = Math.min(b.minWholesale, r.wholesalePrice);
    b.maxWholesale = Math.max(b.maxWholesale, r.wholesalePrice);
    b.sumWholesale += r.wholesalePrice;
  }
  for (const k of Object.keys(byMat)) {
    byMat[k].avgWholesale = Math.round((byMat[k].sumWholesale / byMat[k].count) * 100) / 100;
    delete byMat[k].sumWholesale;
  }
  return {
    skuCount: rows.length,
    rates,
    byMaterial: byMat,
    spotChecks: [
      rows.find((r) => r.nps === '1/2"' && r.pressureClass === 150 && r.material === 'SA-36' && r.thicknessLabel === '11 Gauge'),
      rows.find((r) => r.nps === '4"' && r.pressureClass === 150 && r.material === 'SA-516-70' && r.thicknessLabel === '11 Gauge'),
      rows.find((r) => r.nps === '8"' && r.pressureClass === 300 && r.material === '304L' && r.thicknessLabel === '1/2"'),
      rows.find((r) => r.nps === '24"' && r.pressureClass === 1500 && r.material === '316L' && r.thicknessLabel === '3"'),
      rows.find((r) => r.nps === '6"' && r.pressureClass === 150 && r.material === 'AL-6061' && r.thicknessLabel === '11 Gauge'),
    ].filter(Boolean),
  };
}

function buildDelta(before, after) {
  const map = new Map(before.map((r) => [r.partNumber, r]));
  const deltas = [];
  let unchanged = 0;
  let raised = 0;
  let totalWholesaleDelta = 0;
  let maxDelta = { partNumber: null, delta: 0 };

  for (const a of after) {
    const b = map.get(a.partNumber);
    if (!b) continue;
    const dWholesale = a.wholesalePrice - b.wholesalePrice;
    const dList = a.listPrice - b.listPrice;
    if (dWholesale === 0 && dList === 0) unchanged += 1;
    else raised += 1;
    totalWholesaleDelta += dWholesale;
    if (dWholesale > maxDelta.delta) maxDelta = { partNumber: a.partNumber, delta: dWholesale };
    if (dWholesale !== 0 || dList !== 0) {
      deltas.push({
        partNumber: a.partNumber,
        nps: a.nps,
        pressureClass: a.pressureClass,
        material: a.material,
        thicknessLabel: a.thicknessLabel,
        wholesaleBefore: b.wholesalePrice,
        wholesaleAfter: a.wholesalePrice,
        wholesaleDelta: dWholesale,
        listBefore: b.listPrice,
        listAfter: a.listPrice,
        listDelta: dList,
      });
    }
  }

  return {
    meta: {
      stamp: STAMP,
      rateBumps: RATE_BUMPS,
      baselineRates: BASELINE_RATES,
      newRates: NEW_RATES,
      skuCount: after.length,
      skusUnchangedWholesale: unchanged,
      skusRaisedWholesale: raised,
      pctUnchanged: Math.round((unchanged / after.length) * 1000) / 10,
      totalWholesaleDeltaAcrossMatrix: totalWholesaleDelta,
      avgWholesaleDeltaWhenChanged: raised ? Math.round((totalWholesaleDelta / raised) * 100) / 100 : 0,
      maxWholesaleDelta: maxDelta,
    },
    changedRows: deltas,
  };
}

function writeJson(name, data) {
  const p = path.join(OUT_DIR, name);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
  console.log('Wrote', p);
}

function writeCsv(name, rows) {
  const p = path.join(OUT_DIR, name);
  fs.writeFileSync(p, toCsv(rows));
  console.log('Wrote', p);
}

function writeDeltaCsv(name, deltas) {
  const headers = [
    'partNumber', 'nps', 'pressureClass', 'material', 'thicknessLabel',
    'wholesaleBefore', 'wholesaleAfter', 'wholesaleDelta',
    'listBefore', 'listAfter', 'listDelta',
  ];
  const escape = (v) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const body = [headers.join(','), ...deltas.map((r) => headers.map((h) => escape(r[h])).join(','))].join('\n');
  const p = path.join(OUT_DIR, name);
  fs.writeFileSync(p, body);
  console.log('Wrote', p);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const baselineRows = buildMatrix(BASELINE_RATES);
const afterRows = buildMatrix(NEW_RATES);
const delta = buildDelta(baselineRows, afterRows);

writeJson(`baseline-${STAMP}.json`, {
  generatedAt: new Date().toISOString(),
  note: 'Frozen catalog prices BEFORE graduated material $/lb raise. Paddle Blind, RF facing, no add-ons.',
  rates: BASELINE_RATES,
  summary: summarize(baselineRows, BASELINE_RATES),
  rows: baselineRows,
});
writeCsv(`baseline-${STAMP}.csv`, baselineRows);

writeJson(`after-${STAMP}.json`, {
  generatedAt: new Date().toISOString(),
  note: 'Catalog prices AFTER graduated material $/lb raise.',
  rates: NEW_RATES,
  rateBumps: RATE_BUMPS,
  summary: summarize(afterRows, NEW_RATES),
  rows: afterRows,
});
writeCsv(`after-${STAMP}.csv`, afterRows);

writeJson(`delta-${STAMP}.json`, delta);
writeDeltaCsv(`delta-${STAMP}.csv`, delta.changedRows);

writeJson(`summary-${STAMP}.json`, {
  generatedAt: new Date().toISOString(),
  rateBumps: RATE_BUMPS,
  baselineSummary: summarize(baselineRows, BASELINE_RATES),
  afterSummary: summarize(afterRows, NEW_RATES),
  deltaMeta: delta.meta,
});

console.log('\n=== Delta summary ===');
console.log(JSON.stringify(delta.meta, null, 2));
console.log('\nSpot checks (wholesale before → after):');
for (const spot of summarize(baselineRows, BASELINE_RATES).spotChecks) {
  const after = afterRows.find((r) => r.partNumber === spot.partNumber);
  console.log(
    `  ${spot.partNumber}: $${spot.wholesalePrice} → $${after.wholesalePrice} (Δ $${after.wholesalePrice - spot.wholesalePrice})`
  );
}
