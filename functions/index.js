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
        originUrl
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

      const orderRefId = `IPG-${Date.now().toString().slice(-6)}`;

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
        }
      });

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
      event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } else {
      event = req.body;
    }
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment events
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log(`Payment confirmed for Checkout Session ${session.id}, Order ${session.metadata?.orderRefId}`);

    try {
      const orderRefId = session.metadata?.orderRefId || `STRIPE-${Date.now().toString().slice(-6)}`;
      const hasMTR = session.metadata?.hasMTR === 'true';

      const jobRecord = {
        id: `job-${orderRefId.toLowerCase()}`,
        poNumber: orderRefId,
        stripeSessionId: session.id,
        stripePaymentIntent: session.payment_intent,
        customerName: session.metadata?.companyName || session.customer_details?.name || 'Stripe Customer',
        buyerEmail: session.customer_details?.email || session.metadata?.buyerEmail || '',
        deliveryAddress: session.shipping_details?.address?.line1
          ? `${session.shipping_details.address.line1}, ${session.shipping_details.address.city}, ${session.shipping_details.address.state} ${session.shipping_details.address.postal_code}`
          : (session.metadata?.deliveryAddress || 'Direct Shipping'),
        orderDate: new Date().toISOString().split('T')[0],
        status: 'queued',
        totalAmount: (session.amount_total || 0) / 100,
        mtrRequired: hasMTR,
        millHeatNumber: 'A516-HEAT-' + Math.floor(1000 + Math.random() * 9000),
        heatCertNumber: hasMTR ? `MTR-TX-${Date.now().toString().slice(-5)}` : null,
        payoutBank: 'Bluevine Business Checking',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        paymentStatus: 'PAID_IN_FULL',
        paymentMethod: session.payment_method_types?.[0] || 'card'
      };

      // Persist to Firestore ERP collection
      await db.collection('orders').doc(jobRecord.id).set(jobRecord, { merge: true });
      console.log(`Successfully recorded order ${jobRecord.id} in Firestore.`);

      // Dispatch email notification to IPG shop team via Resend
      try {
        const subject = `NEW STRIPE ORDER #${orderRefId} - ${jobRecord.customerName} ($${jobRecord.totalAmount.toFixed(2)})`;
        const text = `
CONFIRMED STRIPE ORDER — IRON PRAIRIE FABRICATION
==================================================
Order:    ${orderRefId}
Customer: ${jobRecord.customerName}
Email:    ${jobRecord.buyerEmail}
Address:  ${jobRecord.deliveryAddress}
Total:    $${jobRecord.totalAmount.toFixed(2)}
Payment:  ${jobRecord.paymentMethod} (${jobRecord.paymentStatus})
MTR:      ${jobRecord.mtrRequired ? 'YES - MTR PACKET REQUIRED' : 'No'}
Session:  ${session.id}
==================================================
ACTION: Pull stock plate, queue CNC plasma table, stamp heat numbers, and stage for carrier pickup.
        `.trim();

        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
          const webhookRecipients = Array.from(new Set([
            'Sales@ironprairiefabrication.com',
            jobRecord.buyerEmail
          ]))
            .filter(Boolean)
            .filter(e => e.toLowerCase() !== 'alicia@ironprairiefabrication.com');

          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'Iron Prairie Sales <Sales@ironprairiefabrication.com>',
              to: webhookRecipients,
              cc: ['Alicia@ironprairiefabrication.com'],
              reply_to: jobRecord.buyerEmail || 'Sales@ironprairiefabrication.com',
              subject,
              text
            })
          });
          console.log(`Email notification dispatched for order ${orderRefId}`);
        }
      } catch (emailErr) {
        console.error('Email notification failed (non-fatal):', emailErr);
      }
    } catch (dbError) {
      console.error('Error writing order to Firestore:', dbError);
    }
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
      const { to, subject, html, text, clientEmail, proposalId, orderId } = req.body;
      const resendApiKey = process.env.RESEND_API_KEY;

      console.log(`Email notification trigger received for ${to} | Subject: ${subject}`);

      const ccList = ['Alicia@ironprairiefabrication.com'];

      // Assemble unified primary recipient list: Sales@ and purchaser email ONLY (exclude anyone on the CC list)
      const rawRecipients = [
        'Sales@ironprairiefabrication.com',
        ...(Array.isArray(to) ? to : (to ? [to] : [])),
        ...(clientEmail ? [clientEmail] : [])
      ];

      const targetRecipients = Array.from(new Set(
        rawRecipients
          .filter(Boolean)
          .map(e => e.trim())
          .filter(e => !ccList.map(c => c.toLowerCase()).includes(e.toLowerCase()))
      ));

      // 1. If Resend API key is configured
      if (resendApiKey) {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Iron Prairie Sales <Sales@ironprairiefabrication.com>',
            to: targetRecipients,
            cc: ccList,
            reply_to: clientEmail || 'Sales@ironprairiefabrication.com',
            subject: subject,
            html: html || `<pre>${text}</pre>`,
            text: text
          })
        });
        const data = await response.json();
        return res.status(200).json({ success: true, provider: 'resend', data });
      }

      // 2. Fallback: Log to Firestore for shop queue
      const docRef = await db.collection('notifications').add({
        to: to || 'Sales@ironprairiefabrication.com',
        subject: subject || 'Order Notification',
        clientEmail: clientEmail || '',
        proposalId: proposalId || null,
        orderId: orderId || null,
        text: text || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'LOGGED_AND_QUEUED'
      });

      return res.status(200).json({ success: true, provider: 'firestore_log', id: docRef.id });
    } catch (err) {
      console.error('Error dispatching email notification:', err);
      return res.status(500).json({ error: err.message });
    }
  });
});

