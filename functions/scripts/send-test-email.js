/**
 * Live test of Iron Prairie transactional email dispatch.
 * Loads functions/.env and posts one HTML receipt via Resend (or SMTP).
 *
 * Usage: node scripts/send-test-email.js
 */
const fs = require('fs');
const path = require('path');

function loadEnv(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv(path.join(__dirname, '..', '.env'));

const SALES_EMAIL = 'Sales@ironprairiefabrication.com';
const CC_EMAIL = 'Alicia@ironprairiefabrication.com';
const CUSTOMER_EMAIL = process.argv[2] || 'michael@universal-dynamic.com';
const FROM = process.env.EMAIL_FROM || 'Iron Prairie Sales <Sales@ironprairiefabrication.com>';

const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:20px;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
    <div style="background:#0f172a;padding:24px;color:#fff;">
      <div style="color:#fbbf24;font-size:11px;font-weight:700;letter-spacing:1px;">IRON PRAIRIE FABRICATION GROUP LLC • BAY CITY, TX</div>
      <h1 style="margin:8px 0 0 0;font-size:22px;">Test Order Receipt #IPG-319157</h1>
    </div>
    <div style="padding:24px;font-size:14px;line-height:1.6;">
      <p>This is a live dispatch test from the Iron Prairie Cloud Functions mailer.</p>
      <p><strong>Customer:</strong> Michael Huerta<br>
      <strong>Email:</strong> ${CUSTOMER_EMAIL}<br>
      <strong>Ship to:</strong> 327 Redwood ST, Lake Jackson, TX 77566<br>
      <strong>Total:</strong> $57.00<br>
      <strong>Payment:</strong> ACH Direct Debit (processing)</p>
      <p>If you received this, outbound email is configured and production receipts can go to the buyer, Sales@, and Alicia@.</p>
    </div>
    <div style="background:#0f172a;padding:16px 24px;color:#94a3b8;font-size:11px;text-align:center;">
      Iron Prairie Fabrication Group LLC • 200 County Rd 170, Bay City, TX 77414 • 979-248-9266
    </div>
  </div>
</body>
</html>`;

async function main() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('RESEND_API_KEY is not set in functions/.env');
    process.exit(1);
  }

  const payload = {
    from: FROM,
    to: Array.from(new Set([CUSTOMER_EMAIL, SALES_EMAIL])),
    cc: [CC_EMAIL],
    reply_to: CUSTOMER_EMAIL,
    subject: 'TEST: Iron Prairie Order Receipt #IPG-319157 ($57.00)',
    html,
    text: `TEST order receipt #IPG-319157 for ${CUSTOMER_EMAIL}. Total $57.00 ACH processing.`
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) {
    console.error('Resend rejected the test send:', response.status, data);
    process.exit(1);
  }
  console.log('Test email accepted by Resend:', data);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
