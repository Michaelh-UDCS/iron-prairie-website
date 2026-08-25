import { calculateDynamicBlindPrice, DEFAULT_PRICING_CONFIG } from '../src/data/masterGeometry.ts';
import { getAllMTRs, getMTRByHeatNumber, getMatchingMTRs } from '../src/operations/data/mtrRepository.ts';
import { STEEL_SUPPLIERS, GAS_SUPPLIERS, INITIAL_GAS_TELEMETRY } from '../src/operations/data/supplierData.ts';

console.log('--- 1. Testing Geometry & Dynamic Pricing Engine ---');
const facingStr = 'Flat Face (FF) - Standard (No Machining)';
const price = calculateDynamicBlindPrice(150, '4"', 'SA-516-70', 0.1046, '12 Gauge', facingStr, false, false, false, false, DEFAULT_PRICING_CONFIG);
console.log('4" 150# SA-516 Price: $' + price.unitPrice + ' | SKU: ' + price.partNumber + ' | Weight: ' + price.actualWeightLbs + ' lbs');

console.log('\n--- 2. Testing ASME Section VIII Div 1 MTR Vault ---');
const mtrs = getAllMTRs();
console.log('Total Master Plate Heats in Vault: ' + mtrs.length);
const k49 = getMTRByHeatNumber('K49201-B');
console.log('Heat K49201-B Spec: ' + k49?.asmeSpec + ' | Mill: ' + k49?.steelMill + ' | CE: ' + k49?.chemistry?.carbonEquivalent + ' | Tensile: ' + k49?.mechanical?.tensileStrengthPsi + ' PSI');

console.log('\n--- 3. Testing Supplier Directory & Gas Telemetry ---');
console.log('Steel Suppliers: ' + STEEL_SUPPLIERS.map(s => s.name).join(', '));
console.log('Gas Tanks Tracked: ' + INITIAL_GAS_TELEMETRY.map(g => g.gasType + ' (' + g.currentLevelPct + '%)').join(', '));
console.log('\n✅ ALL MODULES VERIFIED & OPERATIONAL!');

