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
<head><meta charset="utf-8"><title>${escapeHtml(order.subjectTitle || 'Iron Prairie Order')}</title></head>
<body style="margin:0;padding:20px;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
    <div style="background:#0f172a;padding:24px;color:#ffffff;">
      <div style="color:#fbbf24;font-size:11px;font-family:ui-monospace,Consolas,monospace;font-weight:700;letter-spacing:1px;text-transform:uppercase;">IRON PRAIRIE FABRICATION GROUP LLC • BAY CITY, TX</div>
      <h1 style="margin:8px 0 0 0;font-size:22px;font-weight:800;letter-spacing:-0.4px;">${escapeHtml(banner)}</h1>
    </div>
    <div style="background:#f1f5f9;padding:16px 24px;border-bottom:1px solid #e2e8f0;font-size:13px;">
      <strong>PO:</strong> <span style="font-family:ui-monospace,Consolas,monospace;color:#0369a1;">${escapeHtml(order.orderRefId)}</span>
      &nbsp;|&nbsp; <strong>Total:</strong> ${escapeHtml(formatMoney(order.totalAmount))}
      &nbsp;|&nbsp; <strong>Payment:</strong> ${escapeHtml(order.paymentMethod || 'Stripe')} (${escapeHtml(order.paymentStatus || '')})
    </div>
    <div style="padding:20px 24px;display:block;">
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
        <tr>
          <td width="50%" valign="top" style="padding:0 12px 12px 0;">
            <div style="background:#f8fafc;padding:16px;border-radius:8px;border:1px solid #e2e8f0;">
              <div style="font-size:11px;text-transform:uppercase;color:#64748b;font-weight:700;margin-bottom:4px;">Customer / Buyer</div>
              <div style="font-size:15px;font-weight:700;color:#0f172a;">${escapeHtml(order.customerName)}</div>
              <div>${escapeHtml(order.buyerEmail || '')}</div>
            </div>
          </td>
          <td width="50%" valign="top" style="padding:0 0 12px 12px;">
            <div style="background:#f8fafc;padding:16px;border-radius:8px;border:1px solid #e2e8f0;">
              <div style="font-size:11px;text-transform:uppercase;color:#64748b;font-weight:700;margin-bottom:4px;">Ship To</div>
              <div style="font-weight:700;color:#0f172a;">${escapeHtml(order.deliveryAddress || 'Direct Shipping')}</div>
              <div style="margin-top:8px;color:#15803d;font-weight:700;">Payout: Bluevine Business Checking</div>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div style="padding:0 24px 24px 24px;">
      <div style="font-size:13px;font-weight:700;text-transform:uppercase;color:#334155;margin-bottom:10px;">Cut Sheet / Line Items</div>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;text-align:left;">
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
    <div style="background:#0f172a;padding:16px 24px;color:#94a3b8;font-size:11px;text-align:center;">
      Iron Prairie Fabrication Group LLC • 200 County Rd 170, Bay City, TX 77414 • 979-248-9266 • ${SALES_EMAIL}
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

  const paymentTypes = session.payment_method_types || [];
  const isAch = paymentTypes.includes('us_bank_account');
  const paymentMethod = extras.paymentMethod
    || (isAch ? 'ACH Direct Debit' : (paymentTypes[0] || 'card'));

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
        companyName = '',
        deliveryAddress = '',
        paymentType = 'all', // 'card' | 'ach' | 'all'
        shippingCost = 0,
        shippingMethod = 'Standard Freight',
        hasMTR = false,
        originUrl,
        orderRefId: clientOrderRefId
      } = req.body;

      if (!cartItems.length) {
        return res.status(400).json({ error: 'Cart is empty. Cannot initiate checkout.' });
      }

      const clientOrigin = originUrl || req.headers.origin || 'https://iron-prairie-website.web.app';
      const itemsSubtotal = cartItems.reduce((sum, i) => sum + (Number(i.lineTotal) || (Number(i.unitPrice) * Number(i.quantity)) || 0), 0);
      
      // Calculate ACH 3% cash discount if ACH is explicitly selected
      const isAchExplicit = paymentType === 'ach';
      const achDiscountAmount = isAchExplicit ? Math.round(itemsSubtotal * 0.03 * 100) / 100 : 0;

      // Build Stripe Line Items
      const line_items = cartItems.map((item) => {
        const unitPrice = Number(item.unitPrice) || (Number(item.lineTotal) / (Number(item.quantity) || 1));
        const npsVal = item.nps || item.npsSize || item.nominalSizeInches;
        const matVal = item.materialName || item.material || item.materialCode || 'SA-516-70 Carbon Steel';
        const thickVal = item.thicknessLabel || (item.thickness ? `${item.thickness}"` : '0.375"');
        const weightVal = Number(item.totalFinishedWeight) || (Number(item.actualWeightLbs) * Number(item.quantity || 1)) || Number(item.weightLbs) || 0;
        
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
              name: productName,
              description: `Spec: ASME B16.48 | Thk: ${thickVal} | Qty: ${item.quantity || 1} | Weight: ${weightVal.toFixed(1)} lbs`,
              metadata: {
                partNumber: item.partNumber || item.id || 'PADDLE-BLIND',
                mtrIncluded: String(item.includeMTR || item.requireMTR || hasMTR)
              }
            },
            unit_amount: Math.round(unitPrice * 100), // Cents
          },
          quantity: item.quantity || 1,
        };
      });

      // Add Shipping Line Item if present
      if (shippingCost > 0) {
        line_items.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Freight Dispatch (${shippingMethod})`,
              description: 'Insured industrial freight carrier with tracking',
            },
            unit_amount: Math.round(shippingCost * 100),
          },
          quantity: 1,
        });
      }

      // Add Explicit 3.5% Credit Card Processing Surcharge when Card is chosen
      if (paymentType === 'card') {
        const cardSurcharge = Math.round((itemsSubtotal + shippingCost) * 0.035 * 100) / 100;
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

      // Configure Allowed Payment Method Types
      let payment_method_types = ['card', 'us_bank_account'];
      if (paymentType === 'card') payment_method_types = ['card'];
      if (paymentType === 'ach') payment_method_types = ['us_bank_account'];

      const orderRefId = (typeof clientOrderRefId === 'string' && clientOrderRefId.trim())
        ? clientOrderRefId.trim().slice(0, 64)
        : `IPG-${Date.now().toString().slice(-6)}`;

      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: payment_method_types,
        customer_email: buyerEmail || undefined,
        line_items: line_items,

        mode: 'payment',
        payment_method_options: {
          us_bank_account: {
            financial_connections: {
              permissions: ['payment_method'],
            },
          },
        },
        billing_address_collection: 'auto',
        shipping_address_collection: {
          allowed_countries: ['US'],
        },
        success_url: `${clientOrigin}/?session_id={CHECKOUT_SESSION_ID}&order_status=paid&po=${orderRefId}`,
        cancel_url: `${clientOrigin}/?order_status=cancelled`,
        metadata: {
          orderRefId: orderRefId,
          companyName: companyName || buyerName || 'Direct Industrial Buyer',
          buyerName: buyerName,
          buyerEmail: buyerEmail || '',
          deliveryAddress: deliveryAddress,
          hasMTR: String(hasMTR),
          payoutTarget: 'Bluevine Business Checking'
        },
        payment_intent_data: {
          receipt_email: buyerEmail || undefined,
          metadata: {
            orderRefId: orderRefId,
            companyName: companyName || buyerName || 'Direct Industrial Buyer',
            buyerEmail: buyerEmail || ''
          }
        }
      });

      try {
        await db.collection('checkout_carts').doc(orderRefId).set({
          orderRefId,
          stripeSessionId: session.id,
          cartItems,
          buyerEmail: buyerEmail || '',
          buyerName,
          companyName,
          deliveryAddress,
          paymentType,
          shippingCost,
          shippingMethod,
          hasMTR,
          originUrl: clientOrigin,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
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
 * Listens for checkout.session.completed & payment_intent.succeeded
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
      await dispatchOrderEmail({ order, kind: 'confirmation' });
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
        paymentMethod: paymentIntent.payment_method_types?.includes('us_bank_account')
          ? 'ACH Direct Debit'
          : (session.payment_method_types?.[0] || 'card'),
        paymentStatus: 'PAID_IN_FULL'
      });

      await db.collection('orders').doc(`job-${order.orderRefId.toLowerCase()}`).set({
        paymentStatus: 'PAID_IN_FULL',
        stripePaymentIntent: paymentIntent.id,
        fundsClearedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      await dispatchOrderEmail({ order, kind: 'payment_cleared' });
    }
  } catch (handlerErr) {
    console.error(`Webhook handler failed for ${event.type}:`, handlerErr);
  }

  return res.status(200).json({ received: true });
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
        documentURI: csp.documentURI || csp.document-uri || csp.sourceFile,
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

