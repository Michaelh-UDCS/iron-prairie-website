/**
 * Quick key connectivity check — no MCP auth required.
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

const secret = process.env.STRIPE_SECRET_KEY || '';
const stripe = require('../node_modules/stripe')(secret);

(async () => {
  const acct = await stripe.accounts.retrieve();
  console.log('ACCOUNT_OK', JSON.stringify({
    id: acct.id,
    charges_enabled: acct.charges_enabled,
    payouts_enabled: acct.payouts_enabled,
    country: acct.country,
    display: acct.settings?.dashboard?.display_name || acct.business_profile?.name || null,
    secret_mode: secret.startsWith('sk_live_') ? 'live' : secret.startsWith('sk_test_') ? 'test' : 'unknown',
    secret_prefix: secret.slice(0, 10)
  }));

  // Prove card checkout session creation works with these keys
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'KEY VERIFY — do not pay' },
        unit_amount: 50
      },
      quantity: 1
    }],
    success_url: 'https://ironprairiefabrication.com/?order_status=paid',
    cancel_url: 'https://ironprairiefabrication.com/?order_status=cancelled',
    metadata: { orderRefId: 'KEY-VERIFY', purpose: 'connectivity_check' }
  });

  console.log('CARD_SESSION_OK', JSON.stringify({
    id: session.id,
    url_present: Boolean(session.url),
    payment_method_types: session.payment_method_types,
    amount_total: session.amount_total,
    livemode: session.livemode,
    status: session.status
  }));

  // Expire immediately so it cannot be paid
  const expired = await stripe.checkout.sessions.expire(session.id);
  console.log('SESSION_EXPIRED', expired.status);

  const hooks = await stripe.webhookEndpoints.list({ limit: 3 });
  for (const w of hooks.data) {
    console.log('WEBHOOK', JSON.stringify({ id: w.id, url: w.url, status: w.status, events: w.enabled_events }));
  }
})().catch((err) => {
  console.error('VERIFY_FAIL', err.message);
  process.exit(1);
});
