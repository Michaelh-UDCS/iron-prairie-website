import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

import zlib from 'node:zlib';

const targetRoute = '/services';

const server = http.createServer((req, res) => {
  let filePath = path.join(distDir, req.url.split('?')[0]);
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
  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === '.html' ? 'text/html; charset=utf-8' : ext === '.js' ? 'text/javascript' : ext === '.css' ? 'text/css' : ext === '.webp' ? 'image/webp' : ext === '.woff2' ? 'font/woff2' : ext === '.png' ? 'image/png' : 'application/octet-stream';
  let content = fs.readFileSync(filePath);
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const isCompressible = ['.html', '.js', '.css', '.json', '.svg'].includes(ext);

  if (isCompressible && acceptEncoding.includes('gzip')) {
    content = zlib.gzipSync(content);
    res.writeHead(200, {
      'Content-Type': mime,
      'Content-Encoding': 'gzip',
      'Vary': 'Accept-Encoding',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
    });
  } else {
    res.writeHead(200, {
      'Content-Type': mime,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
    });
  }
  res.end(content);
});

server.listen(4174, () => {
  console.log(`Auditing ${targetRoute} on 4174...`);
  const child = exec(`npx lighthouse "http://localhost:4174${targetRoute}" --form-factor=mobile --output=json --output-path="./lh-detail.json" --chrome-flags="--headless=new --no-sandbox --disable-gpu" --only-categories=performance,accessibility,best-practices,seo,agentic-browsing`, { cwd: path.resolve(__dirname, '..') });
  
  child.on('exit', code => {
    if (fs.existsSync('./lh-detail.json')) {
      const rep = JSON.parse(fs.readFileSync('./lh-detail.json', 'utf8'));
      const a = rep.audits;
      console.log('Scores:', {
        perf: rep.categories.performance?.score,
        a11y: rep.categories.accessibility?.score,
        bp: rep.categories['best-practices']?.score,
        seo: rep.categories.seo?.score,
        agentic: rep.categories['agentic-browsing']?.score
      });
      console.log('Metrics:', {
        FCP: a['first-contentful-paint']?.displayValue,
        LCP: a['largest-contentful-paint']?.displayValue,
        TBT: a['total-blocking-time']?.displayValue,
        CLS: a['cumulative-layout-shift']?.displayValue,
        SI: a['speed-index']?.displayValue,
      });
      console.log('Layout Shifts Audit:', JSON.stringify(a['layout-shifts'], null, 2));

      const failed = Object.entries(a)
        .filter(([k, v]) => v.score !== null && v.score < 1 && v.scoreDisplayMode !== 'notApplicable' && v.scoreDisplayMode !== 'informative')
        .map(([k, v]) => ({
          id: k,
          title: v.title,
          score: v.score,
          displayValue: v.displayValue,
          explanation: v.explanation,
          details: v.details?.items?.slice(0, 3)
        }));
      console.log('Failed Audits (< 1.0):', JSON.stringify(failed, null, 2));
      fs.unlinkSync('./lh-detail.json');
    }
    server.close();
    process.exit(0);
  });
});
