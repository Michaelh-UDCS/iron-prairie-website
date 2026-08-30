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
  const acct = await stripe.accounts.retrieve();
  console.log('CAPABILITIES', JSON.stringify(acct.capabilities, null, 2));
  console.log('CHARGES', acct.charges_enabled, 'PAYOUTS', acct.payouts_enabled);
  console.log('REQUIREMENTS', JSON.stringify({
    currently_due: acct.requirements?.currently_due,
    disabled_reason: acct.requirements?.disabled_reason,
    past_due: acct.requirements?.past_due,
  }, null, 2));

  // Payment method configs
  try {
    const configs = await stripe.paymentMethodConfigurations.list({ limit: 5 });
    for (const c of configs.data) {
      console.log('PMC', JSON.stringify({
        id: c.id,
        name: c.name,
        active: c.active,
        is_default: c.is_default,
        card: c.card,
        us_bank_account: c.us_bank_account,
        link: c.link,
      }, null, 2));
    }
  } catch (e) {
    console.log('PMC_ERR', e.message);
  }

  // Recent payment intents / charges for card failures
  const pis = await stripe.paymentIntents.list({ limit: 15 });
  for (const pi of pis.data) {
    console.log('PI', JSON.stringify({
      id: pi.id.slice(0, 24),
      status: pi.status,
      amount: pi.amount,
      currency: pi.currency,
      methods: pi.payment_method_types,
      last_error: pi.last_payment_error ? {
        code: pi.last_payment_error.code,
        decline_code: pi.last_payment_error.decline_code,
        message: pi.last_payment_error.message,
        type: pi.last_payment_error.type,
      } : null,
      created: new Date(pi.created * 1000).toISOString(),
    }));
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
