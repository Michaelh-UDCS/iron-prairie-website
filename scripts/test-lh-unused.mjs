import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const server = http.createServer((req, res) => {
  let filePath = path.join(distDir, req.url.split('?')[0]);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, 'index.html');
  if (!fs.existsSync(filePath)) filePath = path.join(distDir, 'index.html');
  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === '.html' ? 'text/html' : ext === '.js' ? 'text/javascript' : ext === '.css' ? 'text/css' : ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime });
  res.end(fs.readFileSync(filePath));
});

server.listen(4176, () => {
  const child = exec('npx lighthouse "http://localhost:4176/" --form-factor=mobile --output=json --output-path="./lh-unused.json" --chrome-flags="--headless=new --no-sandbox --disable-gpu" --only-audits=unused-javascript,network-dependency-tree-insight,lcp-breakdown', { cwd: path.resolve(__dirname, '..') });
  
  child.on('exit', code => {
    if (fs.existsSync('./lh-unused.json')) {
      const rep = JSON.parse(fs.readFileSync('./lh-unused.json', 'utf8'));
      console.log('Unused JS:', JSON.stringify(rep.audits['unused-javascript']?.details?.items, null, 2));
      console.log('LCP breakdown:', JSON.stringify(rep.audits['lcp-breakdown']?.details?.items, null, 2));
      fs.unlinkSync('./lh-unused.json');
    }
    server.close();
    process.exit(0);
  });
});
