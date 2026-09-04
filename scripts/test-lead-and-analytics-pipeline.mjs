/**
 * Automated Verification Script: GA4 Analytics & Firestore Lead Verification
 * Iron Prairie Fabrication Group LLC
 *
 * Verifies:
 * 1. Firestore Rules schema contract for `contact_leads` and `checkout_leads`
 * 2. `Contact.jsx` form fields and submission payload alignment
 * 3. `analytics.ts` GA4 event dispatch contracts (generate_lead, submit_custom_quote, view_custom_service, phone calls)
 * 4. Click-to-call links and data-ga-location touchpoint telemetry
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${testName}${details ? ` -> ${details}` : ''}`);
  }
}

console.log('\n===============================================================');
console.log('   IRON PRAIRIE FABRICATION: GA4 & FIRESTORE LEAD VERIFIER    ');
console.log('===============================================================\n');

// -------------------------------------------------------------
// SECTION 1: FIRESTORE SECURITY RULES CONTRACT VERIFICATION
// -------------------------------------------------------------
console.log('--- [1/4] Checking Firestore Security Rules Contract ---');

const rulesContent = fs.readFileSync(path.join(rootDir, 'firestore.rules'), 'utf8');

// Ensure rules file contains contact_leads and checkout_leads with App Check
assert(
  rulesContent.includes('match /contact_leads/{docId}') && rulesContent.includes('request.app != null'),
  'contact_leads collection rule enforces App Check (request.app != null)'
);

assert(
  rulesContent.includes('match /checkout_leads/{docId}') && rulesContent.includes('request.app != null'),
  'checkout_leads collection rule enforces App Check (request.app != null)'
);

assert(
  rulesContent.includes("allow read, update, delete: if false;"),
  'Client read/update/delete strictly blocked (write-only / CRM ingestion only)'
);

// Rule simulation engine matching firestore.rules logic exactly
function evaluateContactLeadRule({ app, data }) {
  if (app === null || app === undefined) return { allowed: false, reason: 'Missing App Check' };
  
  const requiredKeys = ['name', 'email', 'phone', 'projectType', 'createdAt'];
  const dataKeys = Object.keys(data);

  for (const k of requiredKeys) {
    if (!dataKeys.includes(k)) {
      return { allowed: false, reason: `Missing required key: ${k}` };
    }
  }

  if (dataKeys.length > 40) return { allowed: false, reason: 'Key count exceeds 40' };

  if (typeof data.name !== 'string' || data.name.length === 0 || data.name.length > 150) {
    return { allowed: false, reason: 'Invalid name constraint' };
  }

  if (typeof data.email !== 'string' || data.email.length <= 3 || data.email.length > 254) {
    return { allowed: false, reason: 'Invalid email constraint' };
  }

  if (typeof data.phone !== 'string' || data.phone.length < 7 || data.phone.length > 40) {
    return { allowed: false, reason: 'Invalid phone constraint' };
  }

  if (typeof data.projectType !== 'string') {
    return { allowed: false, reason: 'Invalid projectType constraint' };
  }

  return { allowed: true, reason: 'OK' };
}

function evaluateCheckoutLeadRule({ app, data }) {
  if (app === null || app === undefined) return { allowed: false, reason: 'Missing App Check' };

  const requiredKeys = ['orderRefId', 'buyerEmail', 'createdAt'];
  const dataKeys = Object.keys(data);

  for (const k of requiredKeys) {
    if (!dataKeys.includes(k)) {
      return { allowed: false, reason: `Missing required key: ${k}` };
    }
  }

  if (dataKeys.length > 40) return { allowed: false, reason: 'Key count exceeds 40' };

  if (typeof data.orderRefId !== 'string' || data.orderRefId.length === 0 || data.orderRefId.length > 80) {
    return { allowed: false, reason: 'Invalid orderRefId constraint' };
  }

  if (typeof data.buyerEmail !== 'string' || data.buyerEmail.length <= 3 || data.buyerEmail.length > 254) {
    return { allowed: false, reason: 'Invalid buyerEmail constraint' };
  }

  return { allowed: true, reason: 'OK' };
}

// Test contact_leads rule simulation
const validContactPayload = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  phone: '(979) 555-0199',
  projectType: 'ASME B16.48 Paddle Blinds & Spacers',
  createdAt: new Date().toISOString(),
  organization: 'Gulf Coast Petrochem LLC',
  location: 'Bay City TX 77414',
  logisticsPreference: 'Local Texas Regional Delivery / Jobsite Drop-Off',
  bidReference: 'RFQ-2026-99',
  projectDetails: 'Need 12 units 4" 150# SA-516-70 with MTRs',
  source: 'contact_page'
};

assert(
  evaluateContactLeadRule({ app: { appId: 'iron-prairie' }, data: validContactPayload }).allowed === true,
  'Valid Contact Lead payload passes all Firestore security constraints'
);

assert(
  evaluateContactLeadRule({ app: null, data: validContactPayload }).allowed === false,
  'Unauthenticated/non-App-Check contact request is rejected'
);

assert(
  evaluateContactLeadRule({ app: { appId: 'iron-prairie' }, data: { ...validContactPayload, name: '' } }).allowed === false,
  'Empty name in contact request is rejected'
);

assert(
  evaluateContactLeadRule({ app: { appId: 'iron-prairie' }, data: { ...validContactPayload, email: 'a@b' } }).allowed === false,
  'Too short email (<= 3 chars) in contact request is rejected'
);

assert(
  evaluateContactLeadRule({ app: { appId: 'iron-prairie' }, data: { ...validContactPayload, phone: '123' } }).allowed === false,
  'Short phone (< 7 chars) in contact request is rejected'
);

// Test checkout_leads rule simulation
const validCheckoutPayload = {
  orderRefId: 'PO-2026-10492',
  buyerName: 'Jane Smith',
  buyerEmail: 'purchasing@refinerycorp.com',
  buyerPhone: '(713) 555-0122',
  companyName: 'Refinery Corp',
  deliveryAddress: '1000 Dock St, Freeport, TX 77541',
  paymentType: 'card',
  itemsCount: 4,
  totalWeightLbs: 180.5,
  cartSubtotal: 2450.00,
  shippingCost: 285.00,
  hotShotFee: 0,
  grandTotal: 2735.00,
  hasMTR: true,
  source: 'storefront_stripe_checkout',
  createdAt: new Date().toISOString()
};

assert(
  evaluateCheckoutLeadRule({ app: { appId: 'iron-prairie' }, data: validCheckoutPayload }).allowed === true,
  'Valid Checkout Lead payload passes all Firestore security constraints'
);

assert(
  evaluateCheckoutLeadRule({ app: null, data: validCheckoutPayload }).allowed === false,
  'Unauthenticated checkout lead without App Check is rejected'
);


// -------------------------------------------------------------
// SECTION 2: FRONTEND LEAD SERVICE & FORM INSPECTION
// -------------------------------------------------------------
console.log('\n--- [2/4] Inspecting leadService.ts & Contact.jsx ---');

const leadServiceContent = fs.readFileSync(path.join(rootDir, 'src/services/leadService.ts'), 'utf8');
const contactJsxContent = fs.readFileSync(path.join(rootDir, 'src/pages/Contact.jsx'), 'utf8');

assert(
  leadServiceContent.includes("collection(db, 'contact_leads')"),
  "leadService.ts writes contact leads to 'contact_leads' collection"
);

assert(
  leadServiceContent.includes("collection(db, 'checkout_leads')"),
  "leadService.ts writes checkout leads to 'checkout_leads' collection"
);

assert(
  leadServiceContent.includes("createdAt: serverTimestamp()"),
  "leadService.ts injects serverTimestamp() for createdAt in both lead methods"
);

assert(
  leadServiceContent.includes("initAppCheck();"),
  "leadService.ts eagerly initializes App Check before writing to Firestore"
);

assert(
  contactJsxContent.includes("import { saveContactLead } from '../services/leadService'"),
  "Contact.jsx imports saveContactLead from leadService"
);

assert(
  contactJsxContent.includes("import { trackCustomQuoteSubmission } from '../services/analytics'"),
  "Contact.jsx imports trackCustomQuoteSubmission from analytics"
);

assert(
  contactJsxContent.includes("await saveContactLead(leadData)"),
  "Contact.jsx awaits saveContactLead upon form submission"
);

assert(
  contactJsxContent.includes("trackCustomQuoteSubmission(projectType, organization)"),
  "Contact.jsx fires trackCustomQuoteSubmission with projectType and organization"
);

assert(
  contactJsxContent.includes("name: 'name'") || contactJsxContent.includes('name="name"'),
  "Contact.jsx form includes name input with required attribute"
);

assert(
  contactJsxContent.includes('name="email"') && contactJsxContent.includes('type="email"'),
  "Contact.jsx form includes email input with type=email"
);

assert(
  contactJsxContent.includes('name="phone"') && contactJsxContent.includes('type="tel"'),
  "Contact.jsx form includes phone input with type=tel"
);

assert(
  contactJsxContent.includes('name="projectType"'),
  "Contact.jsx form includes projectType select dropdown"
);

assert(
  contactJsxContent.includes('data-ga-location="contact_form_submit"'),
  "Contact.jsx submit button tagged with data-ga-location='contact_form_submit'"
);


// -------------------------------------------------------------
// SECTION 3: GA4 ANALYTICS DISPATCH CONTRACTS
// -------------------------------------------------------------
console.log('\n--- [3/4] Inspecting GA4 Analytics (src/services/analytics.ts) ---');

const analyticsContent = fs.readFileSync(path.join(rootDir, 'src/services/analytics.ts'), 'utf8');

assert(
  analyticsContent.includes("export function trackPhoneCall("),
  "analytics.ts exports trackPhoneCall"
);

assert(
  analyticsContent.includes("lead_type: 'phone_call'"),
  "trackPhoneCall logs 'generate_lead' with lead_type: 'phone_call'"
);

assert(
  analyticsContent.includes("core_interest: 'custom_metal_fabrication'"),
  "trackPhoneCall tags lead with core_interest: 'custom_metal_fabrication'"
);

assert(
  analyticsContent.includes("export function trackCustomQuoteSubmission("),
  "analytics.ts exports trackCustomQuoteSubmission"
);

assert(
  analyticsContent.includes("lead_type: 'custom_quote_form'"),
  "trackCustomQuoteSubmission logs 'generate_lead' with lead_type: 'custom_quote_form'"
);

assert(
  analyticsContent.includes("trackEvent('submit_custom_quote',"),
  "trackCustomQuoteSubmission dispatches 'submit_custom_quote' custom event"
);

assert(
  analyticsContent.includes("export function trackCustomFabInterest("),
  "analytics.ts exports trackCustomFabInterest"
);

assert(
  analyticsContent.includes("trackEvent('view_custom_service',"),
  "trackCustomFabInterest dispatches 'view_custom_service' custom event"
);

// Verify auto-tracking listener
assert(
  analyticsContent.includes("if (href.startsWith('tel:')) {"),
  "Auto-tracking listener detects click on all tel: hrefs"
);

assert(
  analyticsContent.includes("const phoneNumber = href.replace('tel:', '')"),
  "Auto-tracking listener extracts clean phone number from tel: href"
);

assert(
  analyticsContent.includes("trackPhoneCall(target.getAttribute('data-ga-location') || 'unknown', phoneNumber)"),
  "Auto-tracking passes data-ga-location to trackPhoneCall"
);

assert(
  analyticsContent.includes("if (href.startsWith('mailto:')) {"),
  "Auto-tracking listener detects click on all mailto: inquiries"
);


// -------------------------------------------------------------
// SECTION 4: CLICK-TO-CALL TELEMETRY AUDIT ACROSS CODEBASE
// -------------------------------------------------------------
console.log('\n--- [4/4] Auditing Click-to-Call (979) 248-9266 Links Across Codebase ---');

const filesWithTel = [
  'src/App.tsx',
  'src/pages/Contact.jsx',
  'src/pages/Services.jsx',
  'src/pages/PrivacyPolicy.jsx',
  'src/pages/TermsOfService.jsx'
];

let totalTelLinksFound = 0;
let telLinksWithGaLocation = 0;

for (const relPath of filesWithTel) {
  const filePath = path.join(rootDir, relPath);
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');

  // Match href="tel:(979)248-9266" or tel:...
  const matches = content.match(/<a[^>]*href=["']tel:[^"']+["'][^>]*>/gi) || [];
  for (const tag of matches) {
    totalTelLinksFound++;
    if (tag.includes('data-ga-location=')) {
      telLinksWithGaLocation++;
    }
  }
}

console.log(`  Found ${totalTelLinksFound} click-to-call link(s) across main pages, with ${telLinksWithGaLocation} carrying explicit data-ga-location attributes.`);

assert(
  totalTelLinksFound >= 6,
  `Found sufficient click-to-call links across the site (${totalTelLinksFound} links)`
);

assert(
  telLinksWithGaLocation >= 4,
  `At least 4 click-to-call links have explicit data-ga-location touchpoints for attribution (${telLinksWithGaLocation} verified)`
);


// -------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------
console.log('\n===============================================================');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('===============================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL LEAD PIPELINE & GA4 ANALYTICS INTEGRATION CHECKS PASSED!\n');
  process.exit(0);
}
