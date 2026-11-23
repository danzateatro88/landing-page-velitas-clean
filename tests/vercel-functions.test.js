import assert from 'node:assert/strict';
import { mock, test } from 'node:test';

const sessions = [];
mock.module('stripe', {
  exports: { default: class {
    constructor(key) {
      assert.equal(key, 'sk_test_mock');
      this.checkout = {
        sessions: {
          create: async (config) => {
            sessions.push(config);
            return { url: 'https://checkout.stripe.test/session' };
          }
        }
      };
    }
  } }
});

const { default: checkout } = await import('../api/create-checkout-session.js');
const { default: health } = await import('../api/health.js');
process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
delete process.env.CLIENT_URL;

function response() {
  return {
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
    end() { return this; }
  };
}

const payload = {
  kitType: 'standard',
  kitMode: 'std3',
  quantity: 3,
  words: [' Amor ', 'Salud', 'Dinero'],
  totalAmount: 22,
  shippingMethod: 'pickup',
  language: 'en'
};
const headers = {
  host: 'preview.example.vercel.app',
  origin: 'https://preview.example.vercel.app',
  'x-forwarded-proto': 'https'
};

async function post(body = payload, requestHeaders = headers) {
  const res = response();
  await checkout({ method: 'POST', headers: requestHeaders, body }, res);
  return res;
}

test('health and checkout handle methods correctly', async () => {
  const res = response();
  health({ method: 'GET' }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { ok: true, runtime: 'vercel-node' });
  for (const [handler, validMethod] of [[health, 'GET'], [checkout, 'POST']]) {
    const options = response();
    await handler({ method: 'OPTIONS' }, options);
    assert.equal(options.statusCode, 204);
    assert.equal(options.headers.Allow, `${validMethod}, OPTIONS`);
    const rejected = response();
    await handler({ method: 'DELETE' }, rejected);
    assert.equal(rejected.statusCode, 405);
  }
});

test('checkout preserves Stripe configuration and preview return URLs', async () => {
  const res = await post();
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.url, 'https://checkout.stripe.test/session');
  const session = sessions.at(-1);
  assert.equal(session.mode, 'payment');
  assert.equal(session.allow_promotion_codes, true);
  assert.equal(session.locale, 'en');
  assert.deepEqual(session.line_items, [{
    quantity: 1,
    price_data: {
      currency: 'cad',
      unit_amount: 2200,
      product_data: { name: 'Kit 3 Velas Estándar — 3 velas', description: 'Amor, Salud, Dinero' }
    }
  }]);
  assert.deepEqual(session.metadata, {
    kitType: 'standard', kitMode: 'std3', quantity: '3',
    words: JSON.stringify(payload.words), shippingMethod: 'pickup',
    language: 'en', subtotal: '22.00', shipping: '0.00'
  });
  assert.equal(session.shipping_address_collection, undefined);
  assert.deepEqual(session.phone_number_collection, { enabled: true });
  assert.equal(session.success_url, 'https://preview.example.vercel.app/?checkout=success&shipping=pickup&lang=en');
  assert.equal(session.cancel_url, 'https://preview.example.vercel.app/?checkout=cancelled#taller-velitas');
});

test('prices, shipping threshold, locale and Canadian address match existing backend', async () => {
  const cases = [
    ['std3', 3, 22, 'montreal', 27],
    ['std5', 5, 29.99, 'canada', 38.94],
    ['custom3', 3, 27, 'pickup', 27],
    ['custom5', 5, 34, 'pickup', 34],
    ['customFam', 4, 28, 'pickup', 28],
    ['customFam', 8, 55.2, 'montreal', 60.2],
    ['customFam', 9, 62, 'canada', 62],
    ['customFam', 12, 82.4, 'canada', 82.4]
  ];
  for (const [kitMode, quantity, subtotal, shippingMethod, total] of cases) {
    const res = await post({
      ...payload, kitMode, quantity, words: Array(quantity).fill('Deseo'),
      totalAmount: total, shippingMethod, language: 'FR'
    });
    assert.equal(res.statusCode, 200, kitMode);
    const session = sessions.at(-1);
    assert.equal(session.line_items[0].price_data.unit_amount, Math.round(total * 100));
    assert.equal(session.metadata.subtotal, subtotal.toFixed(2));
    assert.equal(session.metadata.shipping, (total - subtotal).toFixed(2));
    assert.equal(session.locale, 'fr');
    assert.deepEqual(session.shipping_address_collection,
      shippingMethod === 'pickup' ? undefined : { allowed_countries: ['CA'] });
  }
});

test('invalid kit, quantity, words and total do not create a session', async () => {
  const count = sessions.length;
  for (const body of [
    { ...payload, kitMode: 'invalid' },
    { ...payload, shippingMethod: 'invalid' },
    { ...payload, quantity: 5, words: Array(5).fill('x') },
    { ...payload, words: ['x'] },
    { ...payload, words: ['x'.repeat(31), 'x', 'x'] },
    { ...payload, totalAmount: 1 }
  ]) {
    assert.equal((await post(body)).statusCode, 400);
  }
  assert.equal(sessions.length, count);
});

test('return URL prefers CLIENT_URL and supports origin or forwarded host', async () => {
  process.env.CLIENT_URL = 'https://store.example.com';
  assert.equal((await post()).statusCode, 200);
  assert.match(sessions.at(-1).success_url, /^https:\/\/store\.example\.com\//);
  delete process.env.CLIENT_URL;

  assert.equal((await post(payload, { origin: 'https://preview.example.vercel.app' })).statusCode, 200);
  assert.match(sessions.at(-1).success_url, /^https:\/\/preview\.example\.vercel\.app\//);
  assert.equal((await post(payload, {
    host: 'preview.example.vercel.app', 'x-forwarded-proto': 'https'
  })).statusCode, 200);
  assert.match(sessions.at(-1).success_url, /^https:\/\/preview\.example\.vercel\.app\//);
});

test('rejects a mismatched origin without contacting Stripe', async () => {
  const count = sessions.length;
  const log = mock.method(console, 'error', () => {});
  try {
    const res = await post(payload, { ...headers, origin: 'https://other.example.com' });
    assert.equal(res.statusCode, 500);
    assert.equal(sessions.length, count);
    assert.equal(log.mock.calls.length, 1);
  } finally {
    log.mock.restore();
  }
});
