/**
 * Local verification of hardened card Checkout Session params (no deploy needed).
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
  const itemsSubtotal = 37;
  const shippingCost = 18;
  const hotShotFee = 0;
  const feeBase = itemsSubtotal + shippingCost + hotShotFee;
  const cardSurcharge = Math.round(feeBase * 0.035 * 100) / 100;

  const line_items = [
    {
      price_data: {
        currency: 'usd',
        product_data: { name: '2" 150# Paddle Blind (SA-516-70)' },
        unit_amount: 3700,
      },
      quantity: 1,
    },
    {
      price_data: {
        currency: 'usd',
        product_data: { name: 'Freight Dispatch (UPS Ground Parcel)' },
        unit_amount: 1800,
      },
      quantity: 1,
    },
    {
      price_data: {
        currency: 'usd',
        product_data: { name: 'Credit Card Processing Surcharge (3.5%)' },
        unit_amount: Math.round(cardSurcharge * 100),
      },
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: 'card-verify@example.com',
    line_items,
    billing_address_collection: 'required',
    shipping_address_collection: { allowed_countries: ['US'] },
    success_url: 'https://ironprairiefabrication.com/storefront?order_status=paid',
    cancel_url: 'https://ironprairiefabrication.com/storefront?order_status=cancelled',
    metadata: { orderRefId: 'CC-HARDEN-VERIFY', paymentType: 'card' },
    payment_intent_data: {
      metadata: { orderRefId: 'CC-HARDEN-VERIFY', paymentType: 'card' },
    },
  });

  console.log(JSON.stringify({
    id: session.id,
    payment_method_types: session.payment_method_types,
    amount_total: session.amount_total,
    has_us_bank_opts: Boolean(session.payment_method_options?.us_bank_account),
    url_present: Boolean(session.url),
    metadata_paymentType: session.metadata?.paymentType,
  }, null, 2));

  await stripe.checkout.sessions.expire(session.id);
  console.log('EXPIRED_OK');
})().catch((e) => {
  console.error('FAIL', e.message);
  process.exit(1);
});
