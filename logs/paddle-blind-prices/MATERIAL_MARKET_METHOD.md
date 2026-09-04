# Material Market Pricing Method — Iron Prairie Paddle Blinds

Internal playbook for adjusting catalog `$/lb` when mill / distributor plate costs move.
**Do not edit SKU prices by hand.** Always move material rates, then re-export the matrix.

Related files:
- Ledger: `logs/paddle-blind-prices/materialCostLedger.json` (**internal only** — never shipped to the live website)
- Apply tool: `scripts/apply-material-market-adjustment.mjs`
- Matrix export: `scripts/export-paddle-blind-price-matrix.mjs`
- Frozen catalogs: `logs/paddle-blind-prices/baseline-*.csv`

---

## 1. What we track

| Field | Meaning |
|---|---|
| **Anchor baseline** | Catalog `$/lb` on a freeze date (e.g. 2026-09-04). Never overwrite — append history. |
| **Market quote** | What you actually pay or are quoted ($/lb plate delivered Bay City / Houston). |
| **Market index** | `100 × (quote_now / quote_at_anchor)`. Anchor date = 100. |
| **Applied catalog rate** | What the storefront / ERP uses today. |
| **Pass-through %** | How much of a mill move we pass into the catalog (CS less, SS/Al more). |

Carbon steel is relatively stable. Stainless (nickel) and aluminum surge. The ledger encodes that as different **review cadence**, **pass-through**, and **deadband** per grade.

---

## 2. Fair adjustment formula

For each grade:

```
raw_delta_per_lb = market_quote_now - market_quote_at_anchor
candidate_rate   = anchor_catalog_rate + (pass_through_pct/100) * raw_delta_per_lb
```

Then apply guards (**same rules for raises and cuts** — the formula is signed):

1. **Deadband** — if `|candidate − applied| / applied < deadband_pct`, do nothing (ignore noise either direction).
2. **Min tick** — round to nearest `$0.01`.
3. **Max step per review** — cap one move (e.g. CS ±$0.10, SS ±$0.45) so a one-day nickel spike **or crash** doesn’t reprice overnight. If the market keeps climbing *or* falling, take another step at the next review.
4. **Floor** — never below `anchor_catalog_rate × 0.85` without an owner override note (protects margin if mills dump hard). Cuts are allowed down to that floor.
5. **Surge / relief alerts** — index ≥ surge threshold → “surge mode”; index ≤ 90 → “relief mode” (consider passing the cut to stay competitive).

**Bidirectional by design:** when mills drop, `raw_delta` is negative → catalog `$/lb` comes down. We do **not** ratchet prices only upward.

After rates change: run matrix export → commit ledger history → deploy when ready.

---

## 3. Volatility bands (defaults in the ledger)

| Grade | Stability | Review | Pass-through | Deadband | Max step / review |
|---|---|---|---:|---:|---:|
| SA-36 | High (CS) | Monthly | 60% | 2.0% | $0.10 |
| SA-516-70 | High (CS) | Monthly | 65% | 2.0% | $0.12 |
| 304 | Volatile (Ni) | Biweekly | 85% | 1.5% | $0.35 |
| 304L | Volatile (Ni) | Biweekly | 85% | 1.5% | $0.35 |
| 316L | High Ni / Mo | Weekly if surging | 90% | 1.0% | $0.45 |
| AL-6061 | Volatile (Al) | Biweekly | 80% | 2.0% | $0.30 |

**Across-the-board mill moves** (up *or* down): use `--across 3` or `--across -3`. Same % market weather; each grade’s pass-through still produces a different catalog delta. Cuts use identical deadband / max-step / floor rules.

---

## 4. Worked examples

### Example A — Single grade surge (316L / nickel)

- Anchor catalog (2026-09-04): **$7.48/lb**
- Market quote at anchor: **$6.20/lb** (hypothetical mill)
- Market quote now: **$7.10/lb** (+$0.90 mill)
- Pass-through 90% → catalog delta = `0.90 × 0.90 = $0.81`
- Candidate = `7.48 + 0.81 = $8.29`
- Within max step $0.45? **No** → apply **$7.48 + $0.45 = $7.93** this week, log remainder, revisit next week.

Fair outcome: nickel shock hits 316 hardest; A36 unchanged this cycle.

### Example D — Nickel relief (bring 316L back down)

- Applied catalog after a prior surge step: **$7.93/lb**
- Market quote falls from $7.10 → **$6.40/lb**
- vs anchor market $6.20 → raw mill delta = +$0.20
- Pass-through 90% → candidate = `7.48 + 0.20×0.90 = $7.66`
- vs applied $7.93 → **cut of $0.27** (within max step $0.45) → apply **$7.66**

If mills crash below anchor (e.g. market $5.50):
- raw delta = −$0.70 → candidate = `7.48 − 0.63 = $6.85`
- Floor = `7.48 × 0.85 ≈ $6.36` → $6.85 is allowed
- From $7.93, first review cuts by max $0.45 → **$7.48**, remainder scheduled next review

Same tool, opposite sign: `--quote 316L=5.50 --propose` then `--apply`.

### Example B — Across-the-board +3% plate inflation

Market quotes all up 3% from anchor:

| Grade | Anchor catalog | +3% mill × pass-through | New catalog (rounded) |
|---|---:|---:|---:|
| SA-36 | 1.87 | 1.87 + (0.03×1.87×0.60) ≈ +0.03 | **1.90** |
| SA-516-70 | 2.18 | +0.04 | **2.22** |
| 304 | 5.55 | +0.14 | **5.69** |
| 304L | 6.01 | +0.15 | **6.16** |
| 316L | 7.48 | +0.20 | **7.68** |
| AL-6061 | 5.10 | +0.12 | **5.22** |

Same market weather, **different catalog rain** — that’s the fair incremental raise.

### Example C — CS quiet, SS surges

Only 304/304L/316 quotes up; CS flat inside deadband → **only stainless rates move**. Small A36 utility blinds stay put; acid-grade 316 turnaround packages absorb the nickel.

---

## 5. Operating cadence

1. Enter new **market quotes** in the ledger (or via the CLI).
2. Run `node scripts/apply-material-market-adjustment.mjs --propose` → see candidates.
3. Review; then `--apply --note "Ni surge week of …"` to write history + print the rates to paste into `DEFAULT_PRICING_CONFIG` (script can patch files when `--write-config` is passed).
4. Run `node scripts/export-paddle-blind-price-matrix.mjs` (update that script’s `NEW_RATES` / treat ledger as source of truth over time).
5. Spot-check one small CS and one large 316L SKU; deploy.

---

## 6. What “baseline” means here

- **Catalog baseline** = customer-facing `$/lb` freeze (matrix CSVs).
- **Market baseline** = mill quote on that same freeze date (index = 100).
- Both live in `logs/paddle-blind-prices/materialCostLedger.json` (internal). History is append-only so you always know where you started.
- **Timestamps / MCH audit trails stay in `logs/` only. Do not render them on the live website.**
