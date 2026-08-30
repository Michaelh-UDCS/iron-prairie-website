/**
 * List recent Checkout Sessions (masked IDs) for diagnostics.
 */
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
  const sessions = await stripe.checkout.sessions.list({ limit: 20 });
  for (const s of sessions.data) {
    console.log(
      JSON.stringify({
        id: s.id.slice(0, 28) + '…',
        status: s.status,
        payment_status: s.payment_status,
        payment_method_types: s.payment_method_types,
        amount_total: s.amount_total,
        created: new Date(s.created * 1000).toISOString(),
        orderRef: s.metadata?.orderRefId || null,
      })
    );
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
