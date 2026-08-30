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
  const cardId = fs.readFileSync(path.join(__dirname, '_last-card-session.txt'), 'utf8').trim();
  const achId = fs.readFileSync(path.join(__dirname, '_last-ach-session.txt'), 'utf8').trim();

  for (const id of [cardId, achId]) {
    const s = await stripe.checkout.sessions.retrieve(id);
    const items = await stripe.checkout.sessions.listLineItems(id);
    console.log('---');
    console.log(JSON.stringify({
      id: s.id,
      payment_method_types: s.payment_method_types,
      amount_total: s.amount_total,
      status: s.status,
      payment_status: s.payment_status,
      has_us_bank_opts: Boolean(s.payment_method_options?.us_bank_account),
      line_items: items.data.map((i) => ({
        name: i.description,
        amount_total: i.amount_total,
        quantity: i.quantity,
      })),
    }, null, 2));
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
