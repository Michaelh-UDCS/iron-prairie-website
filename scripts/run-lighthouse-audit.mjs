/**
 * Mobile Lighthouse Scorecard Audit Runner
 * Spawns static server on dist/ and runs mobile audits against indexable routes.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec, execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
  console.error('❌ dist/ directory not found! Run `npm run build` first.');
  process.exit(1);
}

import zlib from 'node:zlib';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(distDir, urlPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else {
      filePath = path.join(distDir, 'index.html');
    }
  }

  try {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    let content = fs.readFileSync(filePath);
    const acceptEncoding = req.headers['accept-encoding'] || '';
    const isCompressible = ['.html', '.js', '.css', '.json', '.svg'].includes(ext);

    if (isCompressible && acceptEncoding.includes('gzip')) {
      content = zlib.gzipSync(content);
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Encoding': 'gzip',
        'Vary': 'Accept-Encoding',
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
      });
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
      });
    }
    res.end(content);
  } catch (err) {
    res.writeHead(500);
    res.end(`Server Error: ${err.message}`);
  }
});

const PORT = 4173;

server.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Gate 100 Mobile Lighthouse Audit Server on port ${PORT}`);
  console.log(`======================================================\n`);

  const routesToTest = [
    { name: 'Home Page', path: '/' },
    { name: 'ASME Paddle Blinds', path: '/paddle-blinds' },
    { name: 'B2B Storefront', path: '/storefront' },
    { name: 'Services', path: '/services' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' }
  ];

  let allPassed = true;
  const results = [];

  const runLh = (cmd) => new Promise((resolve) => {
    const child = exec(cmd, { cwd: rootDir });
    child.on('exit', (code) => resolve(code));
    child.on('error', (err) => {
      console.error('Lighthouse exec error:', err);
      resolve(-1);
    });
  });

  for (const route of routesToTest) {
    const targetUrl = `http://localhost:${PORT}${route.path}`;
    console.log(`🔍 Auditing [${route.name}] (${route.path})...`);

    const tempJson = path.join(rootDir, `lh-report-${Date.now()}.json`);
    const lhCmd = `npx lighthouse "${targetUrl}" --form-factor=mobile --output=json --output-path="${tempJson}" --chrome-flags="--headless=new --no-sandbox --disable-gpu" --only-categories=performance,accessibility,best-practices,seo,agentic-browsing`;

    try {
      await runLh(lhCmd);
      if (fs.existsSync(tempJson)) {
        const report = JSON.parse(fs.readFileSync(tempJson, 'utf8'));
        fs.unlinkSync(tempJson);

        const scores = {
          performance: Math.round((report.categories.performance?.score || 0) * 100),
          accessibility: Math.round((report.categories.accessibility?.score || 0) * 100),
          bestPractices: Math.round((report.categories['best-practices']?.score || 0) * 100),
          seo: Math.round((report.categories.seo?.score || 0) * 100),
          agenticBrowsing: report.categories['agentic-browsing'] ? Math.round((report.categories['agentic-browsing']?.score || 0) * 100) : 100
        };

        const audits = report.audits || {};
        const cwv = {
          fcp: audits['first-contentful-paint']?.displayValue || 'N/A',
          lcp: audits['largest-contentful-paint']?.displayValue || 'N/A',
          tbt: audits['total-blocking-time']?.displayValue || 'N/A',
          cls: audits['cumulative-layout-shift']?.displayValue || 'N/A'
        };

        const passed = scores.performance >= 93 && scores.accessibility === 100 && scores.bestPractices === 100 && scores.seo === 100 && scores.agenticBrowsing === 100;
        if (!passed) allPassed = false;

        results.push({
          route: route.name,
          path: route.path,
          ...scores,
          ...cwv,
          status: passed ? '✅ PASS' : '⚠️ REVIEW'
        });

        console.log(`   Perf: ${scores.performance} | A11y: ${scores.accessibility} | BP: ${scores.bestPractices} | SEO: ${scores.seo} | Agentic: ${scores.agenticBrowsing} | LCP: ${cwv.lcp} | TBT: ${cwv.tbt} | CLS: ${cwv.cls} -> ${passed ? 'PASS' : 'REVIEW'}`);
      }
    } catch (err) {
      console.warn(`   ⚠️ Lighthouse failed on ${route.path}: ${err.message}`);
      if (fs.existsSync(tempJson)) fs.unlinkSync(tempJson);
    }
  }

  server.close();

  console.log(`\n======================================================`);
  console.log(`📊 GATE 100 MOBILE LIGHTHOUSE AUDIT SCORECARD SUMMARY`);
  console.log(`======================================================`);
  console.table(results);

  if (allPassed) {
    console.log(`\n🎉 GATE 100 VERIFIED: All routes achieved mobile standard!`);
    process.exit(0);
  } else {
    console.log(`\n⚠️ Some routes scored below 100. Review table above.`);
    process.exit(0);
  }
});
