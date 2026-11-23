import Stripe from 'stripe';

const SHIPPING = { pickup: 0, montreal: 5.0, canada: 8.95 };
const FREE_SHIPPING_FROM = 60;
const LOCALES = { es: 'es', fr: 'fr', en: 'en' };
const KIT_LABELS = {
  std3: 'Kit 3 Velas Estándar',
  std5: 'Kit 5 Velas Estándar',
  custom3: 'Kit 3 Velas Personalizado',
  custom5: 'Kit 5 Velas Personalizado',
  customFam: 'Kit Familiar Personalizado'
};

const expectedSubtotal = (kitMode, quantity) => {
  switch (kitMode) {
    case 'std3':
      return quantity === 3 ? 22.0 : null;
    case 'std5':
      return quantity === 5 ? 29.99 : null;
    case 'custom3':
      return quantity === 3 ? 27.0 : null;
    case 'custom5':
      return quantity === 5 ? 34.0 : null;
    case 'customFam':
      if (!Number.isInteger(quantity) || quantity < 4 || quantity > 12) return null;
      return Math.round((4 * 7.0 + (quantity - 4) * 6.8) * 100) / 100;
    default:
      return null;
  }
};

function requestOrigin(req) {
  const { origin, host, 'x-forwarded-proto': forwardedProto } = req.headers;
  const originUrl = origin ? new URL(origin) : null;
  if (originUrl && (
    !['http:', 'https:'].includes(originUrl.protocol) ||
    originUrl.username || originUrl.password || originUrl.pathname !== '/' ||
    originUrl.search || originUrl.hash
  )) throw new Error('Invalid request origin');
  if (!host) {
    if (originUrl) return originUrl.origin;
    throw new Error('Missing request host and origin');
  }

  const protocol = forwardedProto || originUrl?.protocol.slice(0, -1) ||
    (req.socket?.encrypted ? 'https' : 'http');
  const requestUrl = new URL(`${protocol}://${host}`);
  if (
    !['http:', 'https:'].includes(requestUrl.protocol) ||
    requestUrl.username || requestUrl.password || requestUrl.pathname !== '/' ||
    requestUrl.search || requestUrl.hash
  ) {
    throw new Error('Invalid request host or protocol');
  }
  if (originUrl && originUrl.origin !== requestUrl.origin) {
    throw new Error('Request origin does not match host');
  }
  return requestUrl.origin;
}

export default async function handler(req, res) {
  res.setHeader('Allow', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { kitType, kitMode, quantity, words, totalAmount, shippingMethod, language } =
      req.body || {};

    if (!KIT_LABELS[kitMode] || !(shippingMethod in SHIPPING)) {
      return res.status(400).json({ error: 'Invalid kit or shipping method' });
    }
    if (
      !Array.isArray(words) ||
      words.length !== quantity ||
      words.some((w) => typeof w !== 'string' || w.length > 30)
    ) {
      return res.status(400).json({ error: 'Invalid words list' });
    }

    const subtotal = expectedSubtotal(kitMode, quantity);
    if (subtotal === null) {
      return res.status(400).json({ error: 'Invalid quantity for this kit' });
    }
    const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING[shippingMethod];
    const expectedTotal = Math.round((subtotal + shipping) * 100) / 100;
    if (Math.abs(Number(totalAmount) - expectedTotal) > 0.009) {
      return res.status(400).json({ error: 'Total does not match the price list' });
    }

    const locale = LOCALES[String(language || '').toLowerCase()] || 'es';
    const wordsList = words.map((w) => w.trim()).join(', ');
    const clientUrl = process.env.CLIENT_URL || requestOrigin(req);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      allow_promotion_codes: true,
      locale,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'cad',
            unit_amount: Math.round(expectedTotal * 100),
            product_data: {
              name: `${KIT_LABELS[kitMode]} — ${quantity} velas`,
              description: wordsList.slice(0, 500) || undefined
            }
          }
        }
      ],
      metadata: {
        kitType: String(kitType || ''),
        kitMode,
        quantity: String(quantity),
        words: JSON.stringify(words).slice(0, 500),
        shippingMethod,
        language: locale,
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2)
      },
      shipping_address_collection:
        shippingMethod === 'pickup' ? undefined : { allowed_countries: ['CA'] },
      phone_number_collection: { enabled: true },
      success_url: `${clientUrl}/?checkout=success&shipping=${shippingMethod}&lang=${locale}`,
      cancel_url: `${clientUrl}/?checkout=cancelled#taller-velitas`
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(500).json({ error: 'Could not create checkout session' });
  }
}
