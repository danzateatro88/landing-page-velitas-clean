import assert from 'node:assert/strict';
import { mock, test } from 'node:test';
import Stripe from 'stripe';
import webhook from '../api/webhook.js';

const secret = 'whsec_test_only_for_unit_tests';
const session = {
  id: 'cs_test_example',
  payment_status: 'paid',
  amount_total: 2200,
  currency: 'cad',
  customer_details: { email: 'buyer@example.test' },
  metadata: { kitMode: 'std3' }
};

function request(type, options = {}) {
  const payload = JSON.stringify({ id: 'evt_test', type, data: { object: session } });
  const signature = Stripe.webhooks.generateTestHeaderString({ payload, secret });
  return new Request('https://example.test/api/webhook', {
    method: 'POST',
    headers: { 'stripe-signature': options.signature ?? signature },
    body: options.body ?? payload
  });
}

test('valid signed checkout events are logged and acknowledged', async () => {
  process.env.STRIPE_WEBHOOK_SECRET = secret;
  const log = mock.method(console, 'log', () => {});
  try {
    for (const type of [
      'checkout.session.completed',
      'checkout.session.async_payment_succeeded',
      'checkout.session.expired'
    ]) {
      const res = await webhook.fetch(request(type));
      assert.equal(res.status, 200);
      assert.deepEqual(await res.json(), { received: true });
      assert.deepEqual(log.mock.calls.at(-1).arguments[1], {
        eventId: 'evt_test',
        type,
        sessionId: 'cs_test_example',
        paymentStatus: 'paid',
        amountTotal: 2200,
        currency: 'cad',
        email: 'buyer@example.test',
        metadata: { kitMode: 'std3' }
      });
    }
    assert.equal(log.mock.calls.length, 3);
  } finally {
    log.mock.restore();
    delete process.env.STRIPE_WEBHOOK_SECRET;
  }
});

test('signature validation uses the unmodified request body', async () => {
  process.env.STRIPE_WEBHOOK_SECRET = secret;
  const log = mock.method(console, 'error', () => {});
  try {
    const res = await webhook.fetch(request('checkout.session.completed', { body: '{} ' }));
    assert.equal(res.status, 400);
    assert.equal(log.mock.calls.length, 1);
  } finally {
    log.mock.restore();
    delete process.env.STRIPE_WEBHOOK_SECRET;
  }
});

test('missing configuration returns 503; missing signature returns 400', async () => {
  const log = mock.method(console, 'error', () => {});
  try {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    assert.equal((await webhook.fetch(request('checkout.session.completed'))).status, 503);
    process.env.STRIPE_WEBHOOK_SECRET = secret;
    const res = await webhook.fetch(new Request('https://example.test/api/webhook', {
      method: 'POST', body: '{}'
    }));
    assert.equal(res.status, 400);
    assert.equal(log.mock.calls.length, 2);
  } finally {
    log.mock.restore();
    delete process.env.STRIPE_WEBHOOK_SECRET;
  }
});

test('other signed events are acknowledged without logging an order', async () => {
  process.env.STRIPE_WEBHOOK_SECRET = secret;
  const log = mock.method(console, 'log', () => {});
  try {
    const res = await webhook.fetch(request('payment_intent.created'));
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { received: true });
    assert.equal(log.mock.calls.length, 0);
  } finally {
    log.mock.restore();
    delete process.env.STRIPE_WEBHOOK_SECRET;
  }
});

test('other HTTP methods return 405', async () => {
  const res = await webhook.fetch(new Request('https://example.test/api/webhook'));
  assert.equal(res.status, 405);
  assert.equal(res.headers.get('allow'), 'POST');
});
