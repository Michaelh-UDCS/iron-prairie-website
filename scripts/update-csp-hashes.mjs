/**
 * Post-prerender: hash all inline <script> bodies in dist HTML and
 * rewrite firebase.json Content-Security-Policy script-src hashes.
 * Keeps script-src free of 'unsafe-inline' for static Hosting.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.resolve(root, 'dist');
const firebasePath = path.resolve(root, 'firebase.json');

function walkHtml(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function hashInlineScripts(html) {
  const hashes = new Set();
  const re = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    const attrs = match[1] || '';
    // Skip module/external; hash JSON-LD and any true inline JS
    if (/\btype\s*=\s*["']module["']/i.test(attrs)) continue;
    const body = match[2];
    const digest = crypto.createHash('sha256').update(body, 'utf8').digest('base64');
    hashes.add(`'sha256-${digest}'`);
  }
  return hashes;
}

const files = walkHtml(distDir);
const allHashes = new Set();
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  for (const h of hashInlineScripts(html)) allHashes.add(h);
}

if (allHashes.size === 0) {
  console.warn('[CSP] No inline scripts found to hash — using self-only script-src');
}

const hashList = [...allHashes].sort().join(' ');
const scriptSrc = [
  "'self'",
  hashList,
  'https://js.stripe.com',
  'https://www.googletagmanager.com',
  'https://www.google.com',
  'https://www.gstatic.com',
  'https://*.firebaseio.com',
  'https://*.googleapis.com'
].filter(Boolean).join(' ');

const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: https: https://*.google-analytics.com https://*.googletagmanager.com",
  "connect-src 'self' https://api.stripe.com https://*.googleapis.com https://*.firebaseio.com https://*.cloudfunctions.net https://api.indexnow.org https://www.google.com https://www.gstatic.com https://content-firebaseappcheck.googleapis.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com https://www.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://checkout.stripe.com",
  "object-src 'none'",
  "report-to csp-endpoint",
  "report-uri https://ironprairiefabrication.com/api/csp-report"
].join('; ');

const firebase = JSON.parse(fs.readFileSync(firebasePath, 'utf8'));
const headers = firebase.hosting.headers || [];
const global = headers.find((h) => h.source === '**');
if (!global) {
  console.error('[CSP] firebase.json missing global ** headers block');
  process.exit(1);
}

const setHeader = (key, value) => {
  const idx = global.headers.findIndex((h) => h.key === key);
  if (idx >= 0) global.headers[idx].value = value;
  else global.headers.push({ key, value });
};

setHeader('Content-Security-Policy', csp);
setHeader('Reporting-Endpoints', 'csp-endpoint="/api/csp-report"');

// Ensure obsolete XSS header is not present
global.headers = global.headers.filter((h) => h.key.toLowerCase() !== 'x-xss-protection');

firebase.hosting.headers = headers;
fs.writeFileSync(firebasePath, JSON.stringify(firebase, null, 2) + '\n', 'utf8');

console.log(`[CSP] Hashed ${allHashes.size} unique inline script(s) across ${files.length} HTML file(s)`);
console.log(`[CSP] Updated ${firebasePath}`);
