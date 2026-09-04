/**
 * Firebase Cloud Functions for Iron Prairie Fabrication Group LLC
 * Stripe Checkout Session Engine & ERP Automation Webhooks
 * Payout Destination: Bluevine Business Checking
 */

const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const SALES_EMAIL = 'Sales@ironprairiefabrication.com';
const CC_EMAIL = 'Alicia@ironprairiefabrication.com';
const DEFAULT_FROM = 'Iron Prairie Sales <Sales@ironprairiefabrication.com>';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function uniqueEmails(list) {
  const seen = new Set();
  return (list || [])
    .filter(Boolean)
    .map((email) => String(email).trim())
    .filter((email) => {
      const key = email.toLowerCase();
      if (!email || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function buildRecipientLists(customerEmail) {
  const cc = uniqueEmails([CC_EMAIL]);
  const ccLower = new Set(cc.map((email) => email.toLowerCase()));
  const to = uniqueEmails([SALES_EMAIL, customerEmail]).filter(
    (email) => !ccLower.has(email.toLowerCase())
  );
  return { to, cc };
}

function formatMoney(amount) {
  return `$${(Number(amount) || 0).toFixed(2)}`;
}

function normalizeLineItems(cartItems, stripeLineItems) {
  if (Array.isArray(cartItems) && cartItems.length) {
    return cartItems.map((item) => {
      const quantity = Number(item.quantity) || 1;
      const unitPrice = Number(item.unitPrice) || 0;
      const nps = item.nps || item.npsSize || item.nominalSizeInches || '';
      const klass = item.pressureClass ? `${item.pressureClass}#` : '';
      return {
        partNumber: item.partNumber || item.id || item.name || 'Custom Fabrication Part',
        spec: [nps ? `${String(nps).replace(/"/g, '')}"` : '', klass].filter(Boolean).join(' ') || 'ASME B16.48',
        material: item.materialName || item.material || item.materialCode || 'SA-516-70',
        thickness: item.thicknessLabel || (item.thickness ? `${item.thickness}"` : ''),
        quantity,
        weight: Number(item.totalFinishedWeight) || (Number(item.actualWeightLbs) * quantity) || Number(item.weightLbs) || 0,
        stamp: item.handleStamp || item.handleStamping || '',
        mtr: Boolean(item.includeMTR || item.requireMTR),
        lineTotal: Number(item.lineTotal) || unitPrice * quantity
      };
    });
  }

  return (stripeLineItems || []).map((item) => ({
    partNumber: item.description || item.price?.product?.name || 'Line Item',
    spec: '',
    material: '',
    thickness: '',
    quantity: item.quantity || 1,
    weight: 0,
    stamp: '',
    mtr: false,
    lineTotal: (item.amount_total || 0) / 100
  }));
}

function buildOrderReceiptHtml(order) {
  const rows = (order.lines || []).map((item) => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #e2e8f0;font-family:ui-monospace,Consolas,monospace;font-size:12px;font-weight:700;color:#0f172a;">${escapeHtml(item.partNumber)}</td>
        <td style="padding:10px;border-bottom:1px solid #e2e8f0;font-size:12px;">${escapeHtml(item.spec)}</td>
        <td style="padding:10px;border-bottom:1px solid #e2e8f0;font-size:12px;">${escapeHtml(item.material)}</td>
        <td style="padding:10px;border-bottom:1px solid #e2e8f0;font-size:12px;">${escapeHtml(item.thickness)}</td>
        <td style="padding:10px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;color:#0369a1;">${escapeHtml(item.quantity)}</td>
        <td style="padding:10px;border-bottom:1px solid #e2e8f0;font-size:12px;">${item.weight ? `${Number(item.weight).toFixed(1)} lbs` : '—'}</td>
        <td style="padding:10px;border-bottom:1px solid #e2e8f0;font-size:12px;text-align:right;font-weight:700;">${formatMoney(item.lineTotal)}</td>
      </tr>`).join('');

  const isAch = /ach|bank/i.test(String(order.paymentMethod || ''));
  const banner = order.kind === 'payment_cleared'
    ? 'Payment Cleared — Funds Received'
    : isAch
      ? 'ACH Authorized — Order Queued for Production'
      : 'Order Confirmed — Paid in Full';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${escapeHtml(order.subjectTitle || 'Iron Prairie Order')}</title>
  <style type="text/css">
    body { margin:0; padding:0; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
    .email-shell { width:100%; max-width:760px; margin:0 auto; }
    .stack-column { vertical-align:top; }
    .word-wrap { word-wrap:break-word; overflow-wrap:break-word; word-break:break-word; }
    @media only screen and (max-width:600px) {
      .outer-pad { padding:12px !important; }
      .header-pad { padding:18px 16px !important; }
      .section-pad { padding:16px !important; }
      .stack-column {
        display:block !important;
        width:100% !important;
        max-width:100% !important;
        padding-left:0 !important;
        padding-right:0 !important;
        padding-bottom:12px !important;
      }
      .meta-sep { display:none !important; }
      .meta-item { display:block !important; margin-bottom:4px !important; }
      .banner-title { font-size:18px !important; line-height:1.3 !important; }
      .line-items-wrap { display:block !important; width:100% !important; overflow-x:auto !important; -webkit-overflow-scrolling:touch; }
      .line-items-table { min-width:520px; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div class="outer-pad" style="padding:20px;">
    <div class="email-shell" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <div class="header-pad" style="background:#0f172a;padding:24px;color:#ffffff;">
        <div style="color:#fbbf24;font-size:11px;font-family:ui-monospace,Consolas,monospace;font-weight:700;letter-spacing:1px;text-transform:uppercase;">IRON PRAIRIE FABRICATION GROUP LLC • BAY CITY, TX</div>
        <h1 class="banner-title" style="margin:8px 0 0 0;font-size:22px;font-weight:800;letter-spacing:-0.4px;">${escapeHtml(banner)}</h1>
      </div>
      <div class="section-pad meta-strip" style="background:#f1f5f9;padding:16px 24px;border-bottom:1px solid #e2e8f0;font-size:13px;line-height:1.5;">
        <span class="meta-item"><strong>PO:</strong> <span style="font-family:ui-monospace,Consolas,monospace;color:#0369a1;">${escapeHtml(order.orderRefId)}</span></span>
        <span class="meta-sep">&nbsp;|&nbsp;</span>
        <span class="meta-item"><strong>Total:</strong> ${escapeHtml(formatMoney(order.totalAmount))}</span>
        <span class="meta-sep">&nbsp;|&nbsp;</span>
        <span class="meta-item"><strong>Payment:</strong> ${escapeHtml(order.paymentMethod || 'Stripe')} (${escapeHtml(order.paymentStatus || '')})</span>
      </div>
      <div class="section-pad" style="padding:20px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-size:13px;">
          <tr>
            <td class="stack-column" width="50%" valign="top" style="padding:0 12px 12px 0;">
              <div style="background:#f8fafc;padding:16px;border-radius:8px;border:1px solid #e2e8f0;">
                <div style="font-size:11px;text-transform:uppercase;color:#64748b;font-weight:700;margin-bottom:4px;">Customer / Buyer</div>
                <div class="word-wrap" style="font-size:15px;font-weight:700;color:#0f172a;">${escapeHtml(order.customerName)}</div>
                <div class="word-wrap">${escapeHtml(order.buyerEmail || '')}</div>
              </div>
            </td>
            <td class="stack-column" width="50%" valign="top" style="padding:0 0 12px 12px;">
              <div style="background:#f8fafc;padding:16px;border-radius:8px;border:1px solid #e2e8f0;">
                <div style="font-size:11px;text-transform:uppercase;color:#64748b;font-weight:700;margin-bottom:4px;">Ship To</div>
                <div class="word-wrap" style="font-weight:700;color:#0f172a;">${escapeHtml(order.deliveryAddress || 'Direct Shipping')}</div>
                <div class="word-wrap" style="margin-top:8px;color:#15803d;font-weight:700;">Payout: Bluevine Business Checking</div>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <div class="section-pad" style="padding:0 24px 24px 24px;">
        <div style="font-size:13px;font-weight:700;text-transform:uppercase;color:#334155;margin-bottom:10px;">Cut Sheet / Line Items</div>
        <div class="line-items-wrap">
          <table class="line-items-table" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;text-align:left;">
            <thead>
              <tr style="background:#f1f5f9;color:#475569;font-size:11px;text-transform:uppercase;">
                <th style="padding:8px 10px;text-align:left;">Part</th>
                <th style="padding:8px 10px;text-align:left;">Size / Class</th>
                <th style="padding:8px 10px;text-align:left;">Metal</th>
                <th style="padding:8px 10px;text-align:left;">Thk</th>
                <th style="padding:8px 10px;text-align:left;">Qty</th>
                <th style="padding:8px 10px;text-align:left;">Weight</th>
                <th style="padding:8px 10px;text-align:right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${rows || '<tr><td colspan="7" style="padding:12px;color:#64748b;">No line items were attached to this checkout session.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
      <div class="section-pad" style="background:#0f172a;padding:16px 24px;color:#94a3b8;font-size:11px;text-align:center;line-height:1.5;">
        Iron Prairie Fabrication Group LLC • <a href="https://maps.app.goo.gl/ipFsC9qtHyKwZZS39" target="_blank" rel="noopener noreferrer" style="color:#94a3b8;text-decoration:underline;">200 County Rd 170, Bay City, TX 77414</a> • 979-248-9266 • ${SALES_EMAIL}
      </div>
    </div>
  </div>
</body>
</html>`;
}

function buildOrderReceiptText(order) {
  const lines = (order.lines || []).map((item, idx) => (
    `${idx + 1}. ${item.partNumber} | ${item.spec} | ${item.material} | Qty ${item.quantity} | ${formatMoney(item.lineTotal)}`
  )).join('\n');

  return `
IRON PRAIRIE FABRICATION — ${order.kind === 'payment_cleared' ? 'PAYMENT CLEARED' : 'ORDER CONFIRMATION'}
==================================================
Order:    ${order.orderRefId}
Customer: ${order.customerName}
Email:    ${order.buyerEmail}
Address:  ${order.deliveryAddress}
Total:    ${formatMoney(order.totalAmount)}
Payment:  ${order.paymentMethod} (${order.paymentStatus})
MTR:      ${order.mtrRequired ? 'YES - MTR PACKET REQUIRED' : 'No'}
Session:  ${order.stripeSessionId || ''}
==================================================
${lines || 'No line items attached.'}
==================================================
ACTION: Pull stock plate, queue CNC plasma table, stamp heat numbers, and stage for carrier pickup.
  `.trim();
}

async function sendViaResend({ to, cc, subject, html, text, replyTo, idempotencyKey }) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return { skipped: true, reason: 'RESEND_API_KEY is not configured' };
  }

  const headers = {
    Authorization: `Bearer ${resendApiKey}`,
    'Content-Type': 'application/json'
  };
  if (idempotencyKey) {
    headers['Idempotency-Key'] = String(idempotencyKey).slice(0, 256);
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || DEFAULT_FROM,
      to,
      cc: cc && cc.length ? cc : undefined,
      reply_to: replyTo || SALES_EMAIL,
      subject,
      html: html || undefined,
      text
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error('Resend API error:', response.status, data);
    return { ok: false, provider: 'resend', status: response.status, data };
  }
  return { ok: true, provider: 'resend', data };
}

async function sendViaSmtp({ to, cc, subject, html, text, replyTo }) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    return { skipped: true, reason: 'SMTP is not configured' };
  }

  let nodemailer;
  try {
    nodemailer = require('nodemailer');
  } catch (err) {
    return { skipped: true, reason: 'nodemailer is not installed' };
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || DEFAULT_FROM,
    to: Array.isArray(to) ? to.join(', ') : to,
    cc: cc && cc.length ? cc.join(', ') : undefined,
    replyTo: replyTo || SALES_EMAIL,
    subject,
    html,
    text
  });

  return { ok: true, provider: 'smtp', data: { id: info.messageId } };
}

async function sendTransactionalEmail(opts) {
  const resendResult = await sendViaResend(opts);
  if (resendResult.ok) return resendResult;
  if (!resendResult.skipped) {
    const smtpFallback = await sendViaSmtp(opts);
    if (smtpFallback.ok) return smtpFallback;
    return resendResult;
  }
  const smtpResult = await sendViaSmtp(opts);
  if (smtpResult.ok) return smtpResult;
  return {
    ok: false,
    skipped: true,
    reason: resendResult.reason || smtpResult.reason || 'No email provider configured'
  };
}

async function hasSuccessfulSend(orderRefId, kind) {
  if (!orderRefId) return false;
  const snap = await db.collection('email_receipts').doc(`${orderRefId}:${kind}`).get();
  return Boolean(snap.exists && snap.data()?.result?.ok);
}

async function markEmailSend(orderRefId, kind, result) {
  if (!orderRefId) return;
  await db.collection('email_receipts').doc(`${orderRefId}:${kind}`).set({
    orderRefId,
    kind,
    result,
    sentAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}

async function assembleOrderFromSession(stripe, session, extras = {}) {
  const orderRefId = session.metadata?.orderRefId || extras.orderRefId || extras.paymentIntentId || `STRIPE-${Date.now().toString().slice(-6)}`;
  let cartItems = extras.cartItems || [];
  if (!cartItems.length) {
    try {
      const cartSnap = await db.collection('checkout_carts').doc(orderRefId).get();
      if (cartSnap.exists) {
        cartItems = cartSnap.data().cartItems || [];
      }
    } catch (err) {
      console.error('checkout_carts lookup failed:', err);
    }
  }

  let stripeLineItems = extras.stripeLineItems || session.line_items?.data || [];
  if (!stripeLineItems.length && session.id) {
    try {
      const full = await stripe.checkout.sessions.retrieve(session.id, { expand: ['line_items'] });
      stripeLineItems = full.line_items?.data || [];
      session = { ...session, ...full };
    } catch (err) {
      console.error('Failed to expand Stripe line items:', err);
    }
  }

  const shipping = session.shipping_details?.address
    || session.collected_information?.shipping_details?.address
    || session.customer_details?.address;
  const deliveryAddress = shipping?.line1
    ? `${shipping.line1}${shipping.line2 ? `, ${shipping.line2}` : ''}, ${shipping.city}, ${shipping.state} ${shipping.postal_code}`
    : (session.metadata?.deliveryAddress || extras.deliveryAddress || 'Direct Shipping');

  const metaPay = String(session.metadata?.paymentType || extras.paymentType || '').toLowerCase();
  const paymentTypes = session.payment_method_types || [];
  const isAch = metaPay === 'ach'
    || (metaPay !== 'card' && paymentTypes.length === 1 && paymentTypes.includes('us_bank_account'));
  const paymentMethod = extras.paymentMethod
    || (isAch ? 'ACH Direct Debit' : 'Credit Card');

  return {
    orderRefId,
    stripeSessionId: session.id,
    stripePaymentIntent: typeof session.payment_intent === 'string'
      ? session.payment_intent
      : (session.payment_intent?.id || extras.paymentIntentId || ''),
    customerName: session.metadata?.companyName || session.customer_details?.name || extras.customerName || 'Stripe Customer',
    buyerEmail: session.customer_details?.email || session.metadata?.buyerEmail || extras.buyerEmail || '',
    deliveryAddress,
    totalAmount: extras.totalAmount ?? ((session.amount_total || 0) / 100),
    mtrRequired: session.metadata?.hasMTR === 'true',
    paymentMethod,
    paymentStatus: extras.paymentStatus || session.payment_status || 'processing',
    lines: normalizeLineItems(cartItems, stripeLineItems)
  };
}

async function dispatchOrderEmail({ order, kind }) {
  if (await hasSuccessfulSend(order.orderRefId, kind)) {
    console.log(`Skipping duplicate ${kind} email for ${order.orderRefId}`);
    return { skipped: true, reason: 'already_sent' };
  }

  const { to, cc } = buildRecipientLists(order.buyerEmail);
  if (!to.length) {
    return { ok: false, reason: 'No recipients' };
  }

  const isCleared = kind === 'payment_cleared';
  const subject = isCleared
    ? `PAYMENT CLEARED #${order.orderRefId} - ${order.customerName} (${formatMoney(order.totalAmount)})`
    : `NEW STRIPE ORDER #${order.orderRefId} - ${order.customerName} (${formatMoney(order.totalAmount)})`;

  const payload = {
    ...order,
    kind,
    subjectTitle: subject
  };

  const result = await sendTransactionalEmail({
    to,
    cc,
    subject,
    html: buildOrderReceiptHtml(payload),
    text: buildOrderReceiptText(payload),
    replyTo: order.buyerEmail || SALES_EMAIL,
    idempotencyKey: `ipg-${order.orderRefId}-${kind}`
  });

  await markEmailSend(order.orderRefId, kind, {
    ok: Boolean(result.ok),
    provider: result.provider || null,
    id: result.data?.id || null,
    reason: result.reason || result.data?.message || null,
    to,
    cc
  });

  if (result.ok) {
    console.log(`${kind} email dispatched for ${order.orderRefId} via ${result.provider} to ${to.join(', ')}`);
  } else {
    console.error(`${kind} email failed for ${order.orderRefId}:`, result);
  }
  return result;
}

const STATUS_RANK = { open: 0, cancelled: 1, expired: 1, completed: 2, paid: 3 };

const DEFAULT_OPS_PASSKEYS = [
  'IPG-EXEC-2026-TEXAS-FAB',
  'IronPrairie979!',
  'RUSSELL-979-IPG',
  'ALICIA-979-IPG',
  'MICHAEL-979-IPG',
  'IPG-RH-1979',
  'IPG-AH-2026',
  'IPG-MH-8849',
  '979248',
  '1979',
  '2026'
];

function getOpsPasskeys() {
  const fromEnv = String(process.env.IPG_OPS_PASSKEYS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return fromEnv.length ? fromEnv : DEFAULT_OPS_PASSKEYS;
}

function isValidOpsKey(key) {
  const trimmed = String(key || '').trim();
  return Boolean(trimmed) && getOpsPasskeys().includes(trimmed);
}

function toIso(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  if (value._seconds != null) return new Date(value._seconds * 1000).toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function summarizeCartItems(cartItems) {
  if (!Array.isArray(cartItems)) return [];
  return cartItems.slice(0, 40).map((item) => {
    const quantity = Number(item.quantity) || 1;
    const unitPrice = Number(item.unitPrice) || 0;
    return {
      partNumber: item.partNumber || item.id || item.sku || item.name || 'Paddle Blind',
      nps: item.nps || item.npsSize || item.nominalSizeInches || '',
      pressureClass: item.pressureClass || '',
      material: item.materialName || item.material || item.materialCode || '',
      facing: item.facing || '',
      thickness: item.thicknessLabel || item.thickness || '',
      quantity,
      unitPrice,
      lineTotal: Number(item.lineTotal) || unitPrice * quantity
    };
  });
}

function computeCheckoutTotals(cartItems, shippingCost, hotShotFee, paymentType) {
  const itemsSubtotal = (cartItems || []).reduce(
    (sum, item) => sum + (Number(item.lineTotal) || (Number(item.unitPrice) * Number(item.quantity)) || 0),
    0
  );
  const shipping = Math.max(0, Number(shippingCost) || 0);
  const hotShot = Math.max(0, Number(hotShotFee) || 0);
  const pay = String(paymentType || '').toLowerCase();
  const cardSurcharge = (pay === 'card' || pay === 'credit_card')
    ? Math.round((itemsSubtotal + shipping + hotShot) * 0.035 * 100) / 100
    : 0;
  return {
    itemsSubtotal: Math.round(itemsSubtotal * 100) / 100,
    shippingCost: shipping,
    hotShotFee: hotShot,
    cardSurcharge,
    totalAmount: Math.round((itemsSubtotal + shipping + hotShot + cardSurcharge) * 100) / 100
  };
}

async function markLeadsStatus(orderRefId, status, extra = {}) {
  if (!orderRefId) return;
  const snap = await db.collection('checkout_leads')
    .where('orderRefId', '==', String(orderRefId))
    .limit(10)
    .get();
  if (snap.empty) return;
  const batch = db.batch();
  snap.docs.forEach((doc) => {
    batch.update(doc.ref, {
      status,
      ...extra,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  await batch.commit();
}

async function upsertCheckoutCart(orderRefId, data) {
  if (!orderRefId) return;
  const ref = db.collection('checkout_carts').doc(String(orderRefId).slice(0, 80));
  const snap = await ref.get();
  const payload = {
    ...data,
    orderRefId: String(orderRefId).slice(0, 80),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  if (!snap.exists) {
    payload.createdAt = admin.firestore.FieldValue.serverTimestamp();
  }
  await ref.set(payload, { merge: true });
}

async function updateCheckoutStatus(orderRefId, nextStatus, extra = {}) {
  if (!orderRefId) return;
  const ref = db.collection('checkout_carts').doc(String(orderRefId).slice(0, 80));
  const snap = await ref.get();
  const current = snap.exists ? snap.data().status : null;
  const payload = {
    ...extra,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  const currentRank = STATUS_RANK[current] ?? -1;
  const nextRank = STATUS_RANK[nextStatus] ?? 0;
  if (!current || nextRank >= currentRank) {
    payload.status = nextStatus;
    if (nextStatus === 'cancelled') payload.cancelledAt = admin.firestore.FieldValue.serverTimestamp();
    if (nextStatus === 'expired') payload.expiredAt = admin.firestore.FieldValue.serverTimestamp();
    if (nextStatus === 'completed' || nextStatus === 'paid') {
      payload.completedAt = admin.firestore.FieldValue.serverTimestamp();
    }
  }
  if (!snap.exists) {
    payload.orderRefId = String(orderRefId).slice(0, 80);
    payload.createdAt = admin.firestore.FieldValue.serverTimestamp();
  }
  await ref.set(payload, { merge: true });
  try {
    await markLeadsStatus(orderRefId, payload.status || nextStatus);
  } catch (err) {
    console.error('Failed to update checkout_leads status:', err);
  }
}

function normalizeLeadStatus(status) {
  const value = String(status || 'open').toLowerCase();
  if (value === 'initiated' || value === 'checkout_initiated') return 'open';
  if (value === 'paid' || value === 'paid_in_full' || value === 'complete') return 'completed';
  if (STATUS_RANK[value] != null) return value;
  return 'open';
}

function mergeCheckoutRecords(into, incoming) {
  const key = incoming.orderRefId || incoming.stripeSessionId;
  if (!key) return;
  const existing = into.get(key);
  if (!existing) {
    into.set(key, incoming);
    return;
  }
  const incomingRank = STATUS_RANK[incoming.status] ?? 0;
  const existingRank = STATUS_RANK[existing.status] ?? 0;
  into.set(key, {
    ...existing,
    ...incoming,
    companyName: incoming.companyName || existing.companyName,
    buyerName: incoming.buyerName || existing.buyerName,
    buyerEmail: incoming.buyerEmail || existing.buyerEmail,
    buyerPhone: incoming.buyerPhone || existing.buyerPhone,
    deliveryAddress: incoming.deliveryAddress || existing.deliveryAddress,
    cartItems: (incoming.cartItems && incoming.cartItems.length)
      ? incoming.cartItems
      : existing.cartItems,
    totalAmount: incoming.totalAmount || existing.totalAmount,
    createdAt: incoming.createdAt || existing.createdAt,
    status: incomingRank >= existingRank ? incoming.status : existing.status,
    sources: Array.from(new Set([...(existing.sources || [existing.source]), incoming.source].filter(Boolean)))
  });
}

function recordFromCartData(id, data) {
  const totals = computeCheckoutTotals(
    data.cartItems,
    data.shippingCost,
    data.hotShotFee,
    data.paymentType
  );
  return {
    id,
    orderRefId: data.orderRefId || id,
    stripeSessionId: data.stripeSessionId || '',
    stripeStatus: data.stripeStatus || '',
    stripePaymentStatus: data.stripePaymentStatus || '',
    status: normalizeLeadStatus(data.status),
    companyName: data.companyName || '',
    buyerName: data.buyerName || '',
    buyerEmail: data.buyerEmail || '',
    buyerPhone: data.buyerPhone || '',
    deliveryAddress: data.deliveryAddress || '',
    paymentType: data.paymentType || '',
    cartItems: summarizeCartItems(data.cartItems || data.cartSnapshot),
    itemsSubtotal: Number(data.itemsSubtotal) || totals.itemsSubtotal,
    shippingCost: Number(data.shippingCost) || totals.shippingCost,
    hotShotFee: Number(data.hotShotFee) || totals.hotShotFee,
    totalAmount: Number(data.totalAmount) || Number(data.grandTotal) || totals.totalAmount,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    cancelledAt: toIso(data.cancelledAt),
    source: data.source || 'checkout_carts'
  };
}

function isDiagnosticCheckout(record) {
  const ref = String(record.orderRefId || '');
  return /diag|verify|harden|key-api|key-verify|cc-live|cc-diag|ach-diag|cc-harden/i.test(ref);
}

function recordFromStripeSession(session) {
  let status = 'open';
  if (session.status === 'expired') status = 'expired';
  if (session.status === 'complete') status = 'completed';
  return {
    id: session.metadata?.orderRefId || session.id,
    orderRefId: session.metadata?.orderRefId || session.id,
    stripeSessionId: session.id,
    stripeStatus: session.status || '',
    stripePaymentStatus: session.payment_status || '',
    status,
    companyName: session.metadata?.companyName || '',
    buyerName: session.metadata?.buyerName || session.customer_details?.name || '',
    buyerEmail: session.customer_details?.email || session.metadata?.buyerEmail || session.customer_email || '',
    buyerPhone: session.metadata?.buyerPhone || session.customer_details?.phone || '',
    deliveryAddress: session.metadata?.deliveryAddress || '',
    paymentType: session.metadata?.paymentType || '',
    cartItems: [],
    itemsSubtotal: 0,
    shippingCost: 0,
    hotShotFee: 0,
    totalAmount: (session.amount_total || 0) / 100,
    createdAt: session.created ? new Date(session.created * 1000).toISOString() : null,
    updatedAt: null,
    cancelledAt: null,
    source: 'stripe'
  };
}

async function loadCollectionDocs(name, limitCount = 80) {
  try {
    const snap = await db.collection(name).orderBy('createdAt', 'desc').limit(limitCount).get();
    return snap.docs;
  } catch (err) {
    console.warn(`orderBy createdAt unavailable for ${name}, falling back:`, err.message);
    const snap = await db.collection(name).limit(limitCount).get();
    return snap.docs;
  }
}

/**
 * 1. CREATE STRIPE CHECKOUT SESSION
 * POST /createStripeCheckoutSession
 * Body: { cartItems, buyerEmail, buyerName, companyName, deliveryAddress, paymentType, shippingCost, hasMTR }
 */
exports.createStripeCheckoutSession = onRequest({ cors: true }, async (req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error('Missing STRIPE_SECRET_KEY in environment variables.');
      return res.status(500).json({
        error: 'Stripe is not yet configured on the server. Please set STRIPE_SECRET_KEY.'
      });
    }

    const stripe = require('stripe')(stripeSecretKey);

    try {
      const {
        cartItems = [],
        buyerEmail,
        buyerName = '',
        buyerPhone = '',
        companyName = '',
        deliveryAddress = '',
        paymentType = 'all', // 'card' | 'ach' | 'all'
        shippingCost = 0,
        shippingMethod = 'Standard Freight',
        hotShotFee = 0,
        hasMTR = false,
        originUrl,
        orderRefId: clientOrderRefId
      } = req.body;

      if (!cartItems.length) {
        return res.status(400).json({ error: 'Cart is empty. Cannot initiate checkout.' });
      }

      const clientOrigin = originUrl || req.headers.origin || 'https://iron-prairie-website.web.app';
      const itemsSubtotal = cartItems.reduce((sum, i) => sum + (Number(i.lineTotal) || (Number(i.unitPrice) * Number(i.quantity)) || 0), 0);
      const normalizedShipping = Math.max(0, Number(shippingCost) || 0);
      const normalizedHotShot = Math.max(0, Number(hotShotFee) || 0);
      const feeBase = itemsSubtotal + normalizedShipping + normalizedHotShot;

      // Build Stripe Line Items
      const line_items = cartItems.map((item) => {
        const qty = Math.max(1, Number(item.quantity) || 1);
        const unitPrice = Number(item.unitPrice) || (Number(item.lineTotal) / qty) || 0;
        const unitAmount = Math.round(unitPrice * 100);
        if (!Number.isFinite(unitAmount) || unitAmount < 1) {
          throw new Error(`Invalid unit price for cart item "${item.partNumber || item.id || 'unknown'}".`);
        }
        const npsVal = item.nps || item.npsSize || item.nominalSizeInches;
        const matVal = item.materialName || item.material || item.materialCode || 'SA-516-70 Carbon Steel';
        const thickVal = item.thicknessLabel || (item.thickness ? `${item.thickness}"` : '0.375"');
        const weightVal = Number(item.totalFinishedWeight) || (Number(item.actualWeightLbs) * qty) || Number(item.weightLbs) || 0;
        
        let productName = item.name;
        if (!productName && npsVal && item.pressureClass) {
          const cleanNps = String(npsVal).replace(/"/g, '').trim();
          productName = `${cleanNps}" ${item.pressureClass}# Paddle Blind (${matVal})`;
        } else if (!productName) {
          productName = item.partNumber || item.id || 'Custom Iron Prairie Fabrication Part';
        }

        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName.slice(0, 250),
              description: `Spec: ASME B16.48 | Thk: ${thickVal} | Qty: ${qty} | Weight: ${weightVal.toFixed(1)} lbs`.slice(0, 500),
              metadata: {
                partNumber: String(item.partNumber || item.id || 'PADDLE-BLIND').slice(0, 40),
                mtrIncluded: String(item.includeMTR || item.requireMTR || hasMTR)
              }
            },
            unit_amount: unitAmount,
          },
          quantity: qty,
        };
      });

      // Add Shipping Line Item if present
      if (normalizedShipping > 0) {
        line_items.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Freight Dispatch (${shippingMethod})`,
              description: 'Insured industrial freight carrier with tracking',
            },
            unit_amount: Math.round(normalizedShipping * 100),
          },
          quantity: 1,
        });
      }

      if (normalizedHotShot > 0) {
        line_items.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Hot Shot Emergency Rush Fee',
              description: 'Priority CNC plasma allocation and expedited dispatch',
            },
            unit_amount: Math.round(normalizedHotShot * 100),
          },
          quantity: 1,
        });
      }

      // Add Explicit 3.5% Credit Card Processing Surcharge when Card is chosen
      if (paymentType === 'card') {
        const cardSurcharge = Math.round(feeBase * 0.035 * 100) / 100;
        if (cardSurcharge > 0) {
          line_items.push({
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Credit Card Processing Surcharge (3.5%)',
                description: 'Payment card interchange fee. Zero surcharge when paying via Stripe ACH Bank Transfer.',
              },
              unit_amount: Math.round(cardSurcharge * 100),
            },
            quantity: 1,
          });
        }
      }

      // Force a single method so card and ACH each get a clean Stripe Checkout surface
      let payment_method_types = ['card', 'us_bank_account'];
      if (paymentType === 'card') payment_method_types = ['card'];
      if (paymentType === 'ach') payment_method_types = ['us_bank_account'];

      const orderRefId = (typeof clientOrderRefId === 'string' && clientOrderRefId.trim())
        ? clientOrderRefId.trim().slice(0, 64)
        : `IPG-${Date.now().toString().slice(-6)}`;

      const sessionParams = {
        payment_method_types,
        customer_email: buyerEmail || undefined,
        line_items,
        mode: 'payment',
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: ['US'],
        },
        success_url: `${clientOrigin}/storefront?session_id={CHECKOUT_SESSION_ID}&order_status=paid&po=${orderRefId}`,
        cancel_url: `${clientOrigin}/storefront?order_status=cancelled&po=${orderRefId}&session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
          orderRefId,
          companyName: (companyName || buyerName || 'Direct Industrial Buyer').slice(0, 500),
          buyerName: String(buyerName || '').slice(0, 500),
          buyerEmail: String(buyerEmail || '').slice(0, 500),
          buyerPhone: String(buyerPhone || '').slice(0, 40),
          deliveryAddress: String(deliveryAddress || '').slice(0, 500),
          hasMTR: String(hasMTR),
          paymentType: String(paymentType || 'all'),
          payoutTarget: 'Bluevine Business Checking'
        },
        payment_intent_data: {
          receipt_email: buyerEmail || undefined,
          metadata: {
            orderRefId,
            companyName: (companyName || buyerName || 'Direct Industrial Buyer').slice(0, 500),
            buyerEmail: String(buyerEmail || '').slice(0, 500),
            paymentType: String(paymentType || 'all')
          }
        }
      };

      // ACH-only: enable Financial Connections. Omit for card so Checkout stays card-focused.
      if (payment_method_types.includes('us_bank_account')) {
        sessionParams.payment_method_options = {
          us_bank_account: {
            financial_connections: {
              permissions: ['payment_method'],
            },
          },
        };
      }

      const session = await stripe.checkout.sessions.create(sessionParams);

      try {
        const totals = computeCheckoutTotals(cartItems, normalizedShipping, normalizedHotShot, paymentType);
        await upsertCheckoutCart(orderRefId, {
          stripeSessionId: session.id,
          stripeStatus: session.status || 'open',
          stripePaymentStatus: session.payment_status || 'unpaid',
          status: 'open',
          cartItems,
          buyerEmail: buyerEmail || '',
          buyerName,
          buyerPhone: buyerPhone || '',
          companyName,
          deliveryAddress,
          paymentType,
          shippingCost: normalizedShipping,
          hotShotFee: normalizedHotShot,
          shippingMethod,
          hasMTR,
          originUrl: clientOrigin,
          itemsSubtotal: totals.itemsSubtotal,
          cardSurcharge: totals.cardSurcharge,
          totalAmount: totals.totalAmount,
          source: 'storefront_stripe_checkout'
        });
      } catch (persistErr) {
        console.error('Failed to persist checkout cart snapshot:', persistErr);
      }

      return res.status(200).json({
        id: session.id,
        url: session.url,
        orderRefId: orderRefId
      });
    } catch (error) {
      console.error('Error creating Stripe session:', error);
      return res.status(500).json({
        error: error.message || 'Internal error creating Stripe checkout session.'
      });
    }
  });
});

/**
 * 2. STRIPE WEBHOOK HANDLER
 * POST /stripeWebhook
 * Listens for checkout.session.completed, checkout.session.expired, & payment_intent.succeeded
 * Automatically writes paid order to Firestore & queues CNC Plasma job
 */
exports.stripeWebhook = onRequest({ cors: false }, async (req, res) => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey) {
    return res.status(500).send('Stripe secret key missing.');
  }

  const stripe = require('stripe')(stripeSecretKey);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    if (webhookSecret && sig) {
      const rawBody = req.rawBody
        || (typeof req.body === 'string' ? Buffer.from(req.body) : null)
        || (Buffer.isBuffer(req.body) ? req.body : null);
      if (!rawBody) {
        console.error('Stripe webhook missing rawBody; cannot verify signature.');
        return res.status(400).send('Webhook Error: Missing raw request body for signature verification.');
      }
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else {
      console.warn('STRIPE_WEBHOOK_SECRET missing — accepting unverified webhook payload.');
      event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log(`Checkout completed for ${session.id}, Order ${session.metadata?.orderRefId}`);

      const order = await assembleOrderFromSession(stripe, session, {
        paymentStatus: session.payment_status === 'paid' ? 'PAID_IN_FULL' : 'ACH_AUTHORIZED'
      });

      const jobRecord = {
        id: `job-${order.orderRefId.toLowerCase()}`,
        poNumber: order.orderRefId,
        stripeSessionId: order.stripeSessionId,
        stripePaymentIntent: order.stripePaymentIntent,
        customerName: order.customerName,
        buyerEmail: order.buyerEmail,
        deliveryAddress: order.deliveryAddress,
        orderDate: new Date().toISOString().split('T')[0],
        status: 'queued',
        totalAmount: order.totalAmount,
        mtrRequired: order.mtrRequired,
        millHeatNumber: 'A516-HEAT-' + Math.floor(1000 + Math.random() * 9000),
        heatCertNumber: order.mtrRequired ? `MTR-TX-${Date.now().toString().slice(-5)}` : null,
        payoutBank: 'Bluevine Business Checking',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod
      };

      await db.collection('orders').doc(jobRecord.id).set(jobRecord, { merge: true });
      await updateCheckoutStatus(order.orderRefId, 'completed', {
        stripeSessionId: session.id,
        stripeStatus: session.status || 'complete',
        stripePaymentStatus: session.payment_status || 'paid',
        totalAmount: order.totalAmount,
        buyerEmail: order.buyerEmail,
        companyName: order.customerName
      });
      await dispatchOrderEmail({ order, kind: 'confirmation' });
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object;
      const orderRefId = session.metadata?.orderRefId || session.id;
      console.log(`Checkout expired for ${session.id}, Order ${orderRefId}`);
      await updateCheckoutStatus(orderRefId, 'expired', {
        stripeSessionId: session.id,
        stripeStatus: 'expired',
        stripePaymentStatus: session.payment_status || 'unpaid',
        totalAmount: (session.amount_total || 0) / 100,
        buyerEmail: session.customer_details?.email || session.metadata?.buyerEmail || '',
        companyName: session.metadata?.companyName || '',
        buyerName: session.metadata?.buyerName || ''
      });
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent succeeded ${paymentIntent.id}`);

      let session = {};
      try {
        const listed = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
          limit: 1
        });
        session = listed.data[0] || {};
      } catch (err) {
        console.error('Failed to look up checkout session for payment intent:', err);
        session = {};
      }

      const order = await assembleOrderFromSession(stripe, session, {
        orderRefId: session.metadata?.orderRefId || paymentIntent.metadata?.orderRefId,
        paymentIntentId: paymentIntent.id,
        buyerEmail: paymentIntent.receipt_email || session.customer_details?.email,
        customerName: session.metadata?.companyName || paymentIntent.shipping?.name,
        totalAmount: (paymentIntent.amount_received || paymentIntent.amount || 0) / 100,
        paymentMethod: (
          paymentIntent.metadata?.paymentType === 'ach'
          || paymentIntent.payment_method_types?.includes('us_bank_account')
        ) ? 'ACH Direct Debit' : 'Credit Card',
        paymentStatus: 'PAID_IN_FULL'
      });

      await db.collection('orders').doc(`job-${order.orderRefId.toLowerCase()}`).set({
        paymentStatus: 'PAID_IN_FULL',
        stripePaymentIntent: paymentIntent.id,
        fundsClearedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      await updateCheckoutStatus(order.orderRefId, 'completed', {
        stripePaymentIntent: paymentIntent.id,
        stripePaymentStatus: 'paid'
      });

      await dispatchOrderEmail({ order, kind: 'payment_cleared' });
    }
  } catch (handlerErr) {
    console.error(`Webhook handler failed for ${event.type}:`, handlerErr);
  }

  return res.status(200).json({ received: true });
});

/**
 * 2b. MARK CHECKOUT CANCELLED
 * POST /markCheckoutCancelled
 * Called when a buyer returns from Stripe cancel_url without paying.
 */
exports.markCheckoutCancelled = onRequest({ cors: true }, async (req, res) => {
  return cors(req, res, async () => {
    if (req.method === 'OPTIONS') return res.status(204).send('');
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    }

    try {
      let { orderRefId, sessionId, reason } = req.body || {};
      orderRefId = String(orderRefId || '').trim().slice(0, 80);
      sessionId = String(sessionId || '').trim();

      if (!orderRefId && sessionId && process.env.STRIPE_SECRET_KEY) {
        try {
          const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
          const session = await stripe.checkout.sessions.retrieve(sessionId);
          orderRefId = session.metadata?.orderRefId || sessionId;
        } catch (err) {
          console.error('Failed to resolve cancelled session:', err.message);
        }
      }

      if (!orderRefId) {
        return res.status(400).json({ error: 'orderRefId or sessionId is required.' });
      }

      await updateCheckoutStatus(orderRefId, 'cancelled', {
        stripeSessionId: sessionId || '',
        cancelReason: String(reason || 'buyer_cancelled').slice(0, 80),
        cancelledFrom: 'storefront_cancel_url'
      });

      return res.status(200).json({ ok: true, orderRefId, status: 'cancelled' });
    } catch (err) {
      console.error('markCheckoutCancelled failed:', err);
      return res.status(500).json({ error: err.message || 'Failed to record checkout cancellation.' });
    }
  });
});

/**
 * 2c. ERP STOREFRONT FEED
 * POST /getErpStorefrontFeed
 * Authenticated ops dashboard feed of incomplete + recent completed checkouts.
 */
exports.getErpStorefrontFeed = onRequest({ cors: true }, async (req, res) => {
  return cors(req, res, async () => {
    if (req.method === 'OPTIONS') return res.status(204).send('');
    if (req.method !== 'GET' && req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed.' });
    }

    const opsKey = req.headers['x-ipg-ops-key'] || req.body?.opsKey || req.query?.opsKey;
    if (!isValidOpsKey(opsKey)) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    try {
      const merged = new Map();

      const cartDocs = await loadCollectionDocs('checkout_carts', 80);
      cartDocs.forEach((doc) => mergeCheckoutRecords(merged, recordFromCartData(doc.id, doc.data() || {})));

      const leadDocs = await loadCollectionDocs('checkout_leads', 80);
      leadDocs.forEach((doc) => {
        const data = doc.data() || {};
        mergeCheckoutRecords(merged, recordFromCartData(data.orderRefId || doc.id, {
          ...data,
          cartItems: data.cartItems || data.cartSnapshot || [],
          source: data.source || 'checkout_leads'
        }));
      });

      if (process.env.STRIPE_SECRET_KEY) {
        try {
          const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
          const listed = await stripe.checkout.sessions.list({ limit: 40 });
          listed.data.forEach((session) => mergeCheckoutRecords(merged, recordFromStripeSession(session)));
        } catch (err) {
          console.error('Stripe session list for ERP feed failed:', err.message);
        }
      }

      const records = Array.from(merged.values())
        .filter((row) => !isDiagnosticCheckout(row))
        .sort((a, b) => {
        const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
        const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
        return bTime - aTime;
      });

      const incomplete = records.filter((row) => row.status === 'open' || row.status === 'cancelled' || row.status === 'expired');
      const completed = records.filter((row) => row.status === 'completed' || row.status === 'paid');

      return res.status(200).json({
        ok: true,
        generatedAt: new Date().toISOString(),
        incomplete,
        completed,
        counts: {
          incomplete: incomplete.length,
          completed: completed.length,
          cancelled: incomplete.filter((row) => row.status === 'cancelled').length,
          expired: incomplete.filter((row) => row.status === 'expired').length,
          open: incomplete.filter((row) => row.status === 'open').length
        }
      });
    } catch (err) {
      console.error('getErpStorefrontFeed failed:', err);
      return res.status(500).json({ error: err.message || 'Failed to load storefront feed.' });
    }
  });
});

/**
 * 3. SEND EMAIL NOTIFICATION (Order / Proposal Dispatch)
 * POST /sendEmailNotification
 */
exports.sendEmailNotification = onRequest({ cors: true }, async (req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    }

    try {
      const {
        to,
        subject,
        html,
        text,
        clientEmail,
        proposalId,
        orderId,
        poNumber
      } = req.body;

      console.log(`Email notification trigger received for ${to} | Subject: ${subject}`);

      const { to: targetRecipients, cc: ccList } = buildRecipientLists(clientEmail);
      const extraTo = uniqueEmails(Array.isArray(to) ? to : (to ? [to] : []));
      const ccLower = new Set(ccList.map((email) => email.toLowerCase()));
      const recipients = uniqueEmails([...targetRecipients, ...extraTo]).filter(
        (email) => !ccLower.has(email.toLowerCase())
      );

      const receiptKey = orderId || poNumber || proposalId || null;
      const kind = proposalId ? 'proposal' : 'confirmation';
      if (receiptKey && await hasSuccessfulSend(receiptKey, kind)) {
        return res.status(200).json({
          success: true,
          provider: 'already_sent',
          orderId: receiptKey
        });
      }

      const result = await sendTransactionalEmail({
        to: recipients,
        cc: ccList,
        subject: subject || 'Iron Prairie Notification',
        html: html || (text ? `<pre>${escapeHtml(text)}</pre>` : undefined),
        text: text || '',
        replyTo: clientEmail || SALES_EMAIL,
        idempotencyKey: receiptKey ? `ipg-${receiptKey}-${kind}` : undefined
      });

      if (receiptKey) {
        await markEmailSend(receiptKey, kind, {
          ok: Boolean(result.ok),
          provider: result.provider || 'none',
          id: result.data?.id || null,
          reason: result.reason || result.data?.message || null
        });
      }

      if (result.ok) {
        return res.status(200).json({
          success: true,
          provider: result.provider,
          data: result.data
        });
      }

      const docRef = await db.collection('notifications').add({
        to: recipients,
        cc: ccList,
        subject: subject || 'Order Notification',
        clientEmail: clientEmail || '',
        proposalId: proposalId || null,
        orderId: orderId || poNumber || null,
        text: text || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: result.skipped ? 'LOGGED_NO_PROVIDER' : 'PROVIDER_FAILED',
        providerError: result.reason || result.data || null
      });

      return res.status(result.skipped ? 200 : 502).json({
        success: false,
        emailDelivered: false,
        provider: result.skipped ? 'firestore_log' : (result.provider || 'none'),
        id: docRef.id,
        error: result.reason || result.data?.message || 'Email provider failed'
      });
    } catch (err) {
      console.error('Error dispatching email notification:', err);
      return res.status(500).json({ error: err.message });
    }
  });
});

/**
 * CSP violation reports (Reporting-Endpoints / report-uri).
 * Accepts browser reports; logs compact summary; always 204.
 */
exports.cspReport = onRequest({ cors: false }, async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'content-type');
    return res.status(204).send('');
  }
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const reports = Array.isArray(body) ? body : [body];
    for (const entry of reports.slice(0, 20)) {
      const csp = entry['csp-report'] || entry.body || entry;
      console.warn('[csp-report]', JSON.stringify({
        documentURI: csp.documentURI || csp['document-uri'] || csp.sourceFile,
        violatedDirective: csp.violatedDirective || csp['violated-directive'] || csp.effectiveDirective,
        blockedURI: csp.blockedURI || csp['blocked-uri'],
        disposition: csp.disposition,
      }));
    }
  } catch (err) {
    console.warn('[csp-report] parse error', err.message);
  }
  return res.status(204).send('');
});

