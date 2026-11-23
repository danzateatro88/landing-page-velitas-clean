import Stripe from 'stripe';

const handledEvents = new Set([
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'checkout.session.expired'
]);

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, {
        status: 405,
        headers: { Allow: 'POST' }
      });
    }

    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      console.error('Stripe webhook secret is not configured');
      return Response.json({ error: 'Webhook not configured' }, { status: 503 });
    }

    let rawBody;
    try {
      rawBody = Buffer.from(await request.arrayBuffer());
    } catch (error) {
      console.error('Could not read Stripe webhook request:', error.message);
      return Response.json({ error: 'Could not read request' }, { status: 500 });
    }

    let event;
    try {
      event = Stripe.webhooks.constructEvent(rawBody, request.headers.get('stripe-signature'), secret);
    } catch (error) {
      console.error('Stripe webhook signature validation failed:', error.message);
      return Response.json({ error: 'Invalid webhook signature or payload' }, { status: 400 });
    }

    if (handledEvents.has(event.type)) {
      const session = event.data.object;
      console.log('Stripe checkout event:', {
        eventId: event.id,
        type: event.type,
        sessionId: session.id,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total,
        currency: session.currency,
        email: session.customer_details?.email ?? session.customer_email ?? null,
        metadata: session.metadata
      });
    }

    return Response.json({ received: true });
  }
};
