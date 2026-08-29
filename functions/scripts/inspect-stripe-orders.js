/**
 * Inspect live Stripe checkout sessions, payment intents, and webhook deliveries.
 * Does not print secret keys.
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

function money(cents) {
  return `$${((cents || 0) / 100).toFixed(2)}`;
}

function ts(unix) {
  return unix ? new Date(unix * 1000).toISOString() : '';
}

(async () => {
  const sessions = await stripe.checkout.sessions.list({ limit: 8, expand: ['data.line_items'] });
  console.log('\n=== CHECKOUT SESSIONS ===');
  for (const s of sessions.data) {
    console.log(JSON.stringify({
      id: s.id,
      status: s.status,
      payment_status: s.payment_status,
      amount_total: money(s.amount_total),
      currency: s.currency,
      payment_intent: s.payment_intent,
      payment_method_types: s.payment_method_types,
      customer_email: s.customer_details?.email || s.customer_email,
      customer_name: s.customer_details?.name,
      shipping: s.shipping_details?.address
        ? `${s.shipping_details.address.line1}, ${s.shipping_details.address.city}, ${s.shipping_details.address.state} ${s.shipping_details.address.postal_code}`
        : s.metadata?.deliveryAddress,
      metadata: s.metadata,
      created: ts(s.created),
      line_items: (s.line_items?.data || []).map((li) => ({
        desc: li.description,
        qty: li.quantity,
        amount: money(li.amount_total)
      }))
    }, null, 2));
  }

  const intents = await stripe.paymentIntents.list({ limit: 8 });
  console.log('\n=== PAYMENT INTENTS ===');
  for (const p of intents.data) {
    console.log(JSON.stringify({
      id: p.id,
      status: p.status,
      amount: money(p.amount),
      amount_received: money(p.amount_received),
      payment_method_types: p.payment_method_types,
      receipt_email: p.receipt_email,
      metadata: p.metadata,
      last_payment_error: p.last_payment_error?.message || null,
      created: ts(p.created)
    }, null, 2));
  }

  const hooks = await stripe.webhookEndpoints.list({ limit: 5 });
  console.log('\n=== WEBHOOK ENDPOINTS ===');
  for (const w of hooks.data) {
    console.log(JSON.stringify({
      id: w.id,
      url: w.url,
      status: w.status,
      enabled_events: w.enabled_events
    }, null, 2));
  }

  const events = await stripe.events.list({
    limit: 20,
    types: ['checkout.session.completed', 'payment_intent.succeeded', 'payment_intent.processing', 'payment_intent.processing']
  });
  console.log('\n=== RECENT EVENTS ===');
  for (const e of events.data) {
    const obj = e.data.object;
    console.log(JSON.stringify({
      id: e.id,
      type: e.type,
      created: ts(e.created),
      pending_webhooks: e.pending_webhooks,
      object_id: obj.id,
      payment_status: obj.payment_status || obj.status,
      amount: money(obj.amount_total || obj.amount),
      metadata: obj.metadata || null
    }));
  }
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
