/**
 * Ensure live Stripe webhook includes checkout.session.expired.
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

const needed = [
  'checkout.session.completed',
  'checkout.session.expired',
  'payment_intent.succeeded',
  'payment_intent.processing',
];

(async () => {
  const hooks = await stripe.webhookEndpoints.list({ limit: 10 });
  for (const hook of hooks.data) {
    console.log(JSON.stringify({
      id: hook.id,
      url: hook.url,
      status: hook.status,
      enabled_events: hook.enabled_events,
    }, null, 2));

    if ((hook.enabled_events || []).includes('*')) {
      console.log('wildcard events already enabled', hook.id);
      continue;
    }

    const missing = needed.filter((eventName) => !(hook.enabled_events || []).includes(eventName));
    if (!missing.length) {
      console.log('already has needed events', hook.id);
      continue;
    }

    const next = Array.from(new Set([...(hook.enabled_events || []), ...needed]));
    const updated = await stripe.webhookEndpoints.update(hook.id, { enabled_events: next });
    console.log('updated', updated.id, missing);
  }
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
