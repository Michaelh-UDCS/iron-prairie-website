/**
 * Audit ACH #IPG-319157, rotate Stripe webhook signing secret into .env,
 * and backfill the missing confirmation email.
 */
const fs = require('fs');
const path = require('path');

function loadEnv(filePath) {
  const env = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const i = trimmed.indexOf('=');
    let value = trimmed.slice(i + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[trimmed.slice(0, i).trim()] = value;
  }
  return env;
}

const envPath = path.join(__dirname, '..', '.env');
const env = loadEnv(envPath);
Object.assign(process.env, env);

const stripe = require('stripe')(env.STRIPE_SECRET_KEY);
const SESSION_ID = 'cs_live_b1sLiApZeP7Huo6OyM3q9Sk7oW6489f7oX1P9jESpSz0NtVFx3qcKI0nH9';

async function ensureWebhookSecret() {
  const existing = await stripe.webhookEndpoints.list({ limit: 10 });
  const targetUrl = 'https://iron-prairie-website.web.app/api/stripe-webhook';
  for (const endpoint of existing.data) {
    if (endpoint.url === targetUrl) {
      console.log('Deleting existing webhook', endpoint.id);
      await stripe.webhookEndpoints.del(endpoint.id);
    }
  }

  const created = await stripe.webhookEndpoints.create({
    url: targetUrl,
    enabled_events: [
      'checkout.session.completed',
      'payment_intent.succeeded',
      'payment_intent.payment_failed',
      'payment_intent.processing'
    ],
    description: 'Iron Prairie production checkout + ACH email dispatch'
  });

  let envText = fs.readFileSync(envPath, 'utf8');
  if (/^STRIPE_WEBHOOK_SECRET=/m.test(envText)) {
    envText = envText.replace(/^STRIPE_WEBHOOK_SECRET=.*$/m, `STRIPE_WEBHOOK_SECRET=${created.secret}`);
  } else {
    envText = `${envText.trimEnd()}\nSTRIPE_WEBHOOK_SECRET=${created.secret}\n`;
  }
  fs.writeFileSync(envPath, envText);

  console.log(JSON.stringify({
    webhookId: created.id,
    url: created.url,
    events: created.enabled_events,
    secretPrefix: `${created.secret.slice(0, 10)}...`
  }, null, 2));

  return created.secret;
}

async function backfillReceipt() {
  const session = await stripe.checkout.sessions.retrieve(SESSION_ID, {
    expand: ['line_items', 'payment_intent']
  });

  const pi = session.payment_intent;
  const lines = (session.line_items?.data || []).map((item) => ({
    description: item.description,
    quantity: item.quantity,
    amount: (item.amount_total || 0) / 100
  }));

  const lineRows = lines.map((item) => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #e2e8f0;font-size:12px;">${item.description}</td>
      <td style="padding:10px;border-bottom:1px solid #e2e8f0;font-size:12px;">${item.quantity}</td>
      <td style="padding:10px;border-bottom:1px solid #e2e8f0;font-size:12px;text-align:right;font-weight:700;">$${item.amount.toFixed(2)}</td>
    </tr>`).join('');

  const ship = session.shipping_details?.address || session.customer_details?.address;
  const shipLine = ship
    ? `${ship.line1}, ${ship.city}, ${ship.state} ${ship.postal_code}`
    : (session.metadata?.deliveryAddress || 'Direct Shipping');

  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:20px;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <div style="max-width:720px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
    <div style="background:#0f172a;padding:24px;color:#fff;">
      <div style="color:#fbbf24;font-size:11px;font-weight:700;letter-spacing:1px;">IRON PRAIRIE FABRICATION GROUP LLC - BAY CITY, TX</div>
      <h1 style="margin:8px 0 0 0;font-size:22px;">ACH Authorized - Order Queued for Production</h1>
    </div>
    <div style="background:#f1f5f9;padding:16px 24px;border-bottom:1px solid #e2e8f0;font-size:13px;">
      <strong>PO:</strong> IPG-319157 |
      <strong>Total:</strong> $57.00 |
      <strong>Payment:</strong> ACH Direct Debit (processing)
    </div>
    <div style="padding:20px 24px;font-size:13px;line-height:1.55;">
      <p>
        <strong>Customer:</strong> ${session.metadata?.companyName || 'Customer'}<br>
        <strong>Buyer:</strong> ${session.customer_details?.name || session.metadata?.buyerName}<br>
        <strong>Email:</strong> ${session.customer_details?.email || session.metadata?.buyerEmail}<br>
        <strong>Ship To:</strong> ${shipLine}<br>
        <strong>Session:</strong> ${session.id}<br>
        <strong>Payment Intent:</strong> ${pi?.id || 'n/a'} (status: ${pi?.status || 'n/a'})
      </p>
      <p style="background:#fff7ed;border-left:4px solid #f59e0b;padding:12px;margin:16px 0;">
        This is the <strong>backfilled</strong> confirmation for the ACH checkout that completed before outbound email was connected.
        Bank transfer is authorized and currently <em>processing</em> (funds typically clear in 1-3 business days).
        A second email will fire when Stripe reports <code>payment_intent.succeeded</code>.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <thead>
          <tr style="background:#f1f5f9;font-size:11px;text-transform:uppercase;color:#475569;">
            <th style="padding:8px 10px;text-align:left;">Line Item</th>
            <th style="padding:8px 10px;text-align:left;">Qty</th>
            <th style="padding:8px 10px;text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>${lineRows}</tbody>
      </table>
    </div>
    <div style="background:#0f172a;padding:16px 24px;color:#94a3b8;font-size:11px;text-align:center;">
      Iron Prairie Fabrication Group LLC - 200 County Rd 170, Bay City, TX 77414 - 979-248-9266 - Sales@ironprairiefabrication.com
    </div>
  </div>
</body>
</html>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM || 'Iron Prairie Sales <Sales@ironprairiefabrication.com>',
      to: ['michael@universal-dynamic.com', 'Sales@ironprairiefabrication.com'],
      cc: ['Alicia@ironprairiefabrication.com'],
      reply_to: 'michael@universal-dynamic.com',
      subject: 'NEW STRIPE ORDER #IPG-319157 - Universal Dynamic Consulting Services LLC ($57.00) [BACKFILL]',
      html,
      text: [
        'ACH order #IPG-319157 for $57.00 is authorized and processing.',
        `Buyer: ${session.customer_details?.email}`,
        `Ship to: ${shipLine}`,
        `PI: ${pi?.id} (${pi?.status})`
      ].join('\n')
    })
  });

  const data = await response.json();
  console.log('BACKFILL_EMAIL', response.status, JSON.stringify(data));
  if (!response.ok) process.exit(1);

  console.log('SESSION_STATUS', JSON.stringify({
    sessionStatus: session.status,
    paymentStatus: session.payment_status,
    piStatus: pi?.status,
    amount: (session.amount_total || 0) / 100,
    orderRefId: session.metadata?.orderRefId,
    lineItems: lines
  }, null, 2));
}

(async () => {
  await ensureWebhookSecret();
  await backfillReceipt();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
