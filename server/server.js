require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:4173';

// CORS configuration: allow requests from local dev, Vercel production, and other authorized origins
const allowedOrigins = [
  CLIENT_URL,
  CLIENT_URL.replace('localhost', '127.0.0.1'),
  'https://landing-page-velitas-clean-six.vercel.app',
  'https://vichisbohovelitas.vercel.app', // Production Vercel URL
  ...(process.env.EXTRA_ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Official prices (CAD) — the server never trusts the amount sent by the browser.
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

app.post('/api/create-checkout-session', async (req, res) => {
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

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
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
      success_url: `${CLIENT_URL}/?checkout=success&shipping=${shippingMethod}&lang=${locale}`,
      cancel_url: `${CLIENT_URL}/?checkout=cancelled#taller-velitas`
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(500).json({ error: 'Could not create checkout session' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
