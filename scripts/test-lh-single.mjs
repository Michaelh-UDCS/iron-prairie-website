import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

import zlib from 'node:zlib';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(distDir, req.url.split('?')[0]);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  if (!fs.existsSync(filePath)) {
    filePath = path.join(distDir, 'index.html');
  }
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME_TYPES[ext] || 'application/octet-stream';
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

server.listen(4173, () => {
  console.log('Server up on 4173. Running single lighthouse on /...');
  const child = exec('npx lighthouse "http://localhost:4173/" --form-factor=mobile --output=json --output-path="./lh-single.json" --chrome-flags="--headless=new --no-sandbox --disable-gpu" --only-categories=performance,accessibility,best-practices,seo,agentic-browsing', { cwd: path.resolve(__dirname, '..') });
  
  child.stdout.on('data', d => process.stdout.write(d));
  child.stderr.on('data', d => process.stderr.write(d));
  child.on('exit', code => {
    console.log('Lighthouse exited with code:', code);
    if (fs.existsSync('./lh-single.json')) {
      const rep = JSON.parse(fs.readFileSync('./lh-single.json', 'utf8'));
      console.log('Scores:', {
        perf: rep.categories.performance?.score,
        a11y: rep.categories.accessibility?.score,
        bp: rep.categories['best-practices']?.score,
        seo: rep.categories.seo?.score,
        agentic: rep.categories['agentic-browsing']?.score
      });
      fs.unlinkSync('./lh-single.json');
    }
    server.close();
    process.exit(0);
  });
});
