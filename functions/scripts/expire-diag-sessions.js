const fs = require('fs');
const path = require('path');

function loadEnv(filePath) {
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const i = trimmed.indexOf('=');
    const key = trimmed.slice(0, i).trim();
    let value = trimmed.slice(i + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv(path.join(__dirname, '..', '.env'));
const stripe = require('../node_modules/stripe')(process.env.STRIPE_SECRET_KEY);

(async () => {
  const ids = [];
  for (const f of ['_last-card-session.txt', '_last-ach-session.txt']) {
    const p = path.join(__dirname, f);
    if (fs.existsSync(p)) ids.push(fs.readFileSync(p, 'utf8').trim());
  }
  // Also expire other open KEY/DIAG sessions
  const listed = await stripe.checkout.sessions.list({ limit: 20, status: 'open' });
  for (const s of listed.data) {
    const ref = s.metadata?.orderRefId || '';
    if (/^(KEY-|CC-DIAG|ACH-DIAG)/.test(ref) || ids.includes(s.id)) {
      ids.push(s.id);
    }
  }
  const unique = [...new Set(ids.filter(Boolean))];
  for (const id of unique) {
    try {
      const s = await stripe.checkout.sessions.expire(id);
      console.log('expired', s.id.slice(0, 28), s.status);
    } catch (e) {
      console.log('skip', id.slice(0, 28), e.message);
    }
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
