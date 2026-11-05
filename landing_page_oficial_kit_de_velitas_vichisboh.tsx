import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Sparkles,
  Flame,
  MessageCircle,
  Instagram,
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  Gift,
  CreditCard,
  ShoppingCart,
  X,
  Plus,
  Minus,
  Heart,
  Star,
  Sliders
} from 'lucide-react';
import vickyphoto from './foto vicky .jpeg';
import velitasImage from './velitas .jpg';

// ============================================================================
// 1. BRAND ASSETS & CUSTOM SVGs (STRICT RULES FROM VICTORIA'S DOC)
// - Logo: "vichisboh" in Baloo 2 Bold + 10-petal daisy asterisk replacing "o"
// - Clean Procreate botanical illustrations ("Begonia Vichi" & "Bouquet" - NO splatters)
// - Exact 5.5" (14cm) straight white taper candle with champagne gold shimmer vinyl
// ============================================================================

const DaisyAsterisk = ({
  size = 24,
  petalColor = '#C56A79',
  centerColor = '#C6A77E',
  className = ''
}) => {
  const petals = Array.from({ length: 10 }, (_, i) => i * 36);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`inline-block select-none ${className}`}
      aria-hidden="true"
    >
      <g transform="translate(50,50)">
        {petals.map((angle) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-28"
            rx="10.5"
            ry="21"
            fill={petalColor}
            transform={`rotate(${angle})`}
          />
        ))}
        <circle cx="0" cy="0" r="14.5" fill={centerColor} />
        <circle cx="-3" cy="-3" r="3" fill="#FAF6F0" opacity="0.45" />
      </g>
    </svg>
  );
};

const VichisbohoLogo = ({ variant = 'rose-on-cream', size = 'md' }) => {
  const styles = {
    'rose-on-cream': {
      text: '#C56A79',
      petal: '#EAB4BB',
      center: '#C6A77E'
    },
    'rose-on-olive': {
      text: '#EAB4BB',
      petal: '#EAB4BB',
      center: '#C6A77E'
    },
    'olive-on-cream': {
      text: '#61602D',
      petal: '#C56A79',
      center: '#C6A77E'
    }
  }[variant];

  const sizeMap = {
    sm: { font: 'text-2xl', daisy: 22 },
    md: { font: 'text-3xl sm:text-4xl', daisy: 28 },
    lg: { font: 'text-4xl sm:text-5xl', daisy: 38 }
  }[size];

  return (
    <div className="inline-flex flex-col items-start leading-none group">
      <div
        className={`inline-flex items-baseline font-baloo font-extrabold tracking-tight ${sizeMap.font}`}
        style={{ color: styles.text }}
      >
        <span>vichisboh</span>
        <span className="inline-flex items-center translate-y-[3px] ml-[1px] transition-transform duration-500 group-hover:rotate-45">
          <DaisyAsterisk
            size={sizeMap.daisy}
            petalColor={styles.petal}
            centerColor={styles.center}
          />
        </span>
      </div>
    </div>
  );
};

// Clean line-art botanical illustration ("Begonia Vichi" & "Bouquet" - clean version, zero splatters)
const CleanBotanicalSVG = ({ className = '', color = '#61602D', accent = '#EAB4BB' }) => (
  <svg
    viewBox="0 0 220 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M110 245 C110 190 102 140 85 75"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M110 225 C125 175 145 135 162 85"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M105 185 C80 165 58 145 48 115"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M48 115 C25 105 22 72 48 68 C68 65 82 88 74 112 C68 128 55 122 48 115 Z"
      fill={accent}
      fillOpacity="0.35"
      stroke={color}
      strokeWidth="2.2"
    />
    <path
      d="M52 110 L44 82 M52 100 L64 88 M48 92 L35 90"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M162 85 C185 72 195 45 170 36 C148 28 132 54 142 78 C148 92 156 89 162 85 Z"
      fill="#A0964C"
      fillOpacity="0.25"
      stroke={color}
      strokeWidth="2.2"
    />
    <path
      d="M158 80 L168 50 M162 68 L148 58"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <g transform="translate(85, 65)">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
        <ellipse
          key={rot}
          cx="0"
          cy="-18"
          rx="7"
          ry="13"
          fill={accent}
          stroke={color}
          strokeWidth="1.8"
          transform={`rotate(${rot})`}
        />
      ))}
      <circle cx="0" cy="0" r="9" fill="#C6A77E" stroke={color} strokeWidth="1.8" />
    </g>
    <path
      d="M96 212 C82 202 74 218 94 220 C108 221 112 220 126 220 C146 218 138 202 124 212"
      stroke="#C56A79"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

// Realistic 5.5-inch (14 cm) straight white taper candle with slightly tapered tip + champagne gold shimmer vinyl
// Set to Victoria's photo (e.g. '/victoria.jpg'); empty shows the botanical illustration.
const VICTORIA_PHOTO_URL = vickyphoto;

// Scalloped (bubble / flower) outline in objectBoundingBox units (0..1)
const buildScallopPath = (bumps = 14) => {
  const R = 0.43;
  const chord = 2 * R * Math.sin(Math.PI / bumps);
  const arcR = (chord * 0.56).toFixed(4);
  const pt = (i: number) => {
    const a = (i / bumps) * Math.PI * 2 - Math.PI / 2;
    return [0.5 + R * Math.cos(a), 0.5 + R * Math.sin(a)];
  };
  let d = '';
  for (let i = 0; i < bumps; i++) {
    const [x, y] = pt(i);
    const [nx, ny] = pt(i + 1);
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(4)} ${y.toFixed(4)} A${arcR} ${arcR} 0 0 1 ${nx.toFixed(4)} ${ny.toFixed(4)} `;
  }
  return d + 'Z';
};
const SCALLOP_PATH = buildScallopPath(14);

// Reusable wave edge: a repeating tile so the curve never stretches on mobile.
const WaveDivider = ({
  color,
  id,
  className = ''
}: {
  color: string;
  id: string;
  className?: string;
}) => (
  <div className="w-full overflow-hidden leading-none">
    <svg
      aria-hidden="true"
      focusable="false"
      className={`w-full min-w-[1440px] h-7 block ${className}`}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id={id} x="0" y="0" width="56" height="28" patternUnits="userSpaceOnUse">
          <path d="M0 14 C9 0 19 0 28 14 S47 28 56 14 V28 H0 Z" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  </div>
);

const CandleIllustration = ({
  words = ['Amor', 'Salud', 'Dinero'],
  customNames = [],
  showBox = true,
  compact = false,
  lit = true,
  onToggleFlame = null,
  measureBadgeText = '✨ Así brillarán tus velitas el 7 de diciembre · Altura real: 14 cm (5,5")'
}) => {
  const displayItems = words.map((word, idx) => {
    const name = customNames[idx]?.trim();
    return name ? `${name} · ${word}` : word;
  });

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none">
      {/* Measurement & Interactive Flame Toggle Bar */}
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        <div className="inline-flex max-w-full items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#C6A77E]/50 text-[#61602D] text-xs font-medium shadow-sm">
          <span className="break-words text-center">{measureBadgeText}</span>
        </div>

        {onToggleFlame && (
          <button
            type="button"
            onClick={onToggleFlame}
            className={`animate-float-slow inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border-2 border-[#90414D] shadow-[3px_3px_0px_#90414D] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#90414D] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${
              lit ? 'bg-[#C56A79] text-white' : 'bg-[#FAF6F0] text-[#61602D]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{lit ? 'Llama encendida' : 'Encender velitas'}</span>
          </button>
        )}
      </div>

      <div
        className={`relative w-full ${
          compact ? 'max-w-md py-4' : 'max-w-lg py-6'
        } px-3 sm:px-4 max-w-full overflow-hidden rounded-3xl bg-gradient-to-b from-[#FAF6F0] to-[#F4EDE2] border-2 border-[#EAB4BB]/60 shadow-inner flex flex-col items-center`}
      >
        {/* 14cm height guide on the left */}
        <div className="hidden sm:flex flex-col items-center justify-between h-52 absolute left-5 top-12 text-[11px] font-garamond italic text-[#61602D]/80">
          <span>— 14 cm —</span>
          <div className="w-[1px] h-36 bg-[#C6A77E]/60" />
          <span>5,5 in</span>
        </div>

        {/* Candles Row */}
        <div className="flex flex-wrap items-end justify-center gap-x-2 gap-y-3 sm:gap-x-5 z-10 pt-2 pb-3 w-full max-w-full">
          {displayItems.map((label, idx) => (
            <div key={idx} className="flex flex-col items-center group shrink-0">
              {/* Warm Flame & Cotton Wick */}
              <div className="relative flex flex-col items-center mb-0.5 h-7 justify-end">
                {lit && (
                  <>
                    <div className="w-8 h-8 rounded-full bg-amber-300/40 blur-md animate-pulse absolute -top-2 left-1/2 -translate-x-1/2" />
                    <svg width="16" height="24" viewBox="0 0 16 24" className="relative z-10 animate-flame-flicker">
                      <path
                        d="M8 1 C8 1 14 9 14 15 C14 19 11.3 22 8 22 C4.7 22 2 19 2 15 C2 9 8 1 8 1 Z"
                        fill="url(#flameGrad)"
                      />
                      <path
                        d="M8 7 C8 7 11 12 11 16 C11 18.2 9.6 20 8 20 C6.4 20 5 18.2 5 16 C5 12 8 7 8 7 Z"
                        fill="#FFF9E6"
                      />
                      <defs>
                        <linearGradient
                          id="flameGrad"
                          x1="8"
                          y1="1"
                          x2="8"
                          y2="22"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#F59E0B" />
                          <stop offset="0.6" stopColor="#FBBF24" />
                          <stop offset="1" stopColor="#FEF08A" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </>
                )}
                {/* Cotton Wick */}
                <div className="w-[2px] h-2 bg-[#4A453C] -mt-0.5" />
              </div>

              {/* Tapered Tip (Small tapered crown characteristic of 5.5" Dollarama candle) */}
              <div
                className="w-8 sm:w-9 h-4 bg-gradient-to-r from-[#F3EFEA] via-[#FFFFFF] to-[#E6E0D6] border-x border-t border-[#DCD4C8]"
                style={{
                  clipPath: 'polygon(22% 0%, 78% 0%, 100% 100%, 0% 100%)'
                }}
              />

              {/* Straight Cylindrical White Body (5.5" proportion) */}
              <div className="w-8 sm:w-9 h-44 sm:h-48 bg-gradient-to-r from-[#F5F2EB] via-[#FFFFFF] to-[#E8E2D9] border-x border-b border-[#DCD4C8] rounded-b-sm shadow-md flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-y-0 left-1.5 w-1 bg-white/80 pointer-events-none" />

                {/* Metallic gold foil vinyl word + sparkle */}
                <div className="-rotate-90 w-36 sm:w-40 max-w-none shrink-0 flex items-center justify-center gap-1 select-none">
                  <span
                    className="min-w-0 truncate bg-gradient-to-t from-[#9A7432] via-[#D4AF37] to-[#AA8239] bg-clip-text text-transparent font-garamond italic font-semibold tracking-wide text-sm sm:text-base"
                    style={{ filter: 'drop-shadow(0px 1px 0px rgba(154, 116, 50, 0.3))' }}
                  >
                    {label}
                  </span>
                  <span className="shrink-0 text-[#D4AF37] text-[10px] leading-none">✦</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Kraft Box with Window + Match Vial + Ritual Card */}
        {showBox && (
          <div className="w-full max-w-md mt-1 grid grid-cols-2 gap-2 bg-[#D6B892]/35 border border-[#C6A77E] rounded-3xl p-3 shadow-sm">
            {[
              { Icon: Flame, color: 'text-[#C56A79]', title: 'Fósforos', sub: 'en frasquito', bg: 'bg-[#FAF6F0] border-[#EAB4BB]' },
              { Icon: Sparkles, color: 'text-[#A0964C]', title: 'Tarjeta Ritual', sub: '7 de diciembre', bg: 'bg-[#FAF6F0] border-[#EAB4BB]' }
            ].map(({ Icon, color, title, sub, bg }) => (
              <div
                key={title}
                className={`min-w-0 flex flex-col items-center justify-center text-center gap-1 p-3 rounded-2xl border ${bg}`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${color}`} />
                <span className="text-[11px] font-bold leading-tight text-[#61602D] break-words">{title}</span>
                <span className="text-[10px] leading-tight text-[#61602D]/80 break-words">{sub}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 2. OFFICIAL 10 GOLDEN WISH WORDS & MULTILINGUAL COPY (ES / FR / EN)
// ============================================================================

const WISH_WORDS = [
  { id: 'Amor', candle: { es: 'Amor', fr: 'Amour', en: 'Love' }, es: 'Amor', fr: 'Amour', en: 'Love' },
  { id: 'Paz', candle: { es: 'Paz', fr: 'Paix', en: 'Peace' }, es: 'Paz', fr: 'Paix', en: 'Peace' },
  { id: 'Salud', candle: { es: 'Salud', fr: 'Santé', en: 'Health' }, es: 'Salud', fr: 'Santé', en: 'Health' },
  { id: 'Prosperidad', candle: { es: 'Prosperidad', fr: 'Prospérité', en: 'Prosperity' }, es: 'Prosperidad', fr: 'Prospérité', en: 'Prosperity' },
  { id: 'Familia', candle: { es: 'Familia', fr: 'Famille', en: 'Family' }, es: 'Familia', fr: 'Famille', en: 'Family' },
  { id: 'Gratitud', candle: { es: 'Gratitud', fr: 'Gratitude', en: 'Gratitude' }, es: 'Gratitud', fr: 'Gratitude', en: 'Gratitude' },
  { id: 'Abundancia', candle: { es: 'Abundancia', fr: 'Abondance', en: 'Abundance' }, es: 'Abundancia', fr: 'Abondance', en: 'Abundance' },
  { id: 'Esperanza', candle: { es: 'Esperanza', fr: 'Espoir', en: 'Hope' }, es: 'Esperanza', fr: 'Espoir', en: 'Hope' },
  { id: 'Fe', candle: { es: 'Fe', fr: 'Foi', en: 'Faith' }, es: 'Fe', fr: 'Foi', en: 'Faith' },
  { id: 'Viajes', candle: { es: 'Viajes', fr: 'Voyages', en: 'Travel' }, es: 'Viajes', fr: 'Voyages', en: 'Travel' }
];

// Official personalized pricing (CAD)
const CUSTOM3_PRICE = 27.0;
const CUSTOM5_PRICE = 34.0;
const FAMILY_MIN = 4;
const FAMILY_MAX = 12;
const FAMILY_BASE_PRICE = 7.0; // each of the first 4 candles
const FAMILY_EXTRA_PRICE = 6.8; // each candle from the 5th on

const getFamilyPrice = (qty) => {
  const base = Math.min(qty, FAMILY_MIN) * FAMILY_BASE_PRICE;
  const extra = Math.max(0, qty - FAMILY_MIN) * FAMILY_EXTRA_PRICE;
  return Math.round((base + extra) * 100) / 100;
};

const TRANSLATIONS = {
  es: {
    topBarPickup: 'Recogida gratis en Montreal',
    topBar: 'Pedidos abiertos hasta el fin de semana del 5 de diciembre para el Día de Velitas (7 de dic.)',
    nav: {
      ritual: 'El Ritual',
      includes: 'Qué Incluye',
      studio: 'Arma tu Kit',
      shipping: 'Envíos',
      whatsappCta: 'Comprar ahora'
    },
    hero: {
      badge: 'Día de Velitas · 7 de Diciembre · Hecho a mano en Montreal',
      title: 'Enciende un deseo hecho',
      titleHighlight: 'especialmente para los tuyos',
      subtitle:
        'Kits rituales del 7 de diciembre preparados uno a uno en mi mesa de taller: velas blancas reales de 5,5 pulgadas (14 cm) con deseos y nombres en vinilo dorado.',
      ctaPrimary: 'Personalizar mi Kit',
      ctaSecondary: 'Comprar ahora',
      measureBadge: '✨ Así brillarán tus velitas el 7 de diciembre · Altura real: 14 cm (5,5")',
      familyNamesBadge: '✨ También con los nombres de tu familia',
      priceChip3: '🕯️ Kit 3 Velas Estándar:',
      priceChip5: '🕯️ Kit 5 Velas Estándar:'
    },
    includesSection: {
      eyebrow: 'Cuidado artesanal en cada detalle',
      title: '¿Qué incluye cada Kit de Día de Velitas?',
      subtitle:
        'Todo viene listo dentro de su caja para que el 7 de diciembre solo tengas que reunir a tu familia, abrir la caja y encender la primera llama.',
      items: [
        {
          title: 'Velas Cónicas Blancas de 5,5" (14 cm)',
          desc: 'Cuerpo recto clásico con punta ligeramente afinada y mecha de algodón, personalizadas con vinilo permanente dorado champaña shimmer.'
        },
        {
          title: 'Caja Kraft con Ventana',
          desc: 'Presentación cálida que deja ver los deseos dorados desde afuera, ideal para regalar o poner en el centro de tu mesa.'
        },
        {
          title: 'Tarjeta Ritual del 7 de Diciembre',
          desc: 'Explica el significado de la noche de velitas e incluye un espacio para pausar y declarar tu intención familiar.'
        },
        {
          title: 'Frasquito con Fósforos',
          desc: 'Para que tengas todo a mano en el momento de encender las velitas sin buscar encendedores.'
        },
        {
          title: 'Sello Artesanal vichisboh*',
          desc: 'Hecho a mano en mi estudio en Montreal'
        }
      ]
    },
    studio: {
      eyebrow: 'El Taller de Velitas · Dos Gamas',
      title: '¿Cómo quieres encender tus deseos este año?',
      subtitle:
        'Elige nuestros deseos favoritos listos para llevar, o escribe tú mismo el nombre y deseo de cada persona de tu familia.',
      tabStd: '🕯️ Deseos Clásicos (Listos para elegir)',
      tabCustom: '✍️ Con nuestros nombres (100% a tu gusto)',
      std3Title: 'Cajita de 3 Velitas',
      std3Desc: '3 velas: elige un deseo dorado para cada una.',
      wishSelectLabel: 'Deseo de la vela',
      std5Title: 'Cajita de 5 Velitas',
      std5Desc: '5 velas: elige un deseo dorado para cada una.',
      custom3Title: 'Personalizado 3 Velas',
      custom3Desc: '3 velas con el texto que tú escribas: nombres, deseos propios o ambos.',
      custom5Title: 'Personalizado 5 Velas',
      custom5Desc: '5 velas con el texto que tú escribas: nombres, deseos propios o ambos.',
      customFamTitle: 'Kit Familiar a Medida',
      customFamDesc: 'Una vela por integrante (4 a 12), con la palabra exacta que tú elijas.',
      custom3Badge: '3 velas · texto libre',
      custom5Badge: '5 velas · texto libre',
      customFamBadge: 'Una vela por persona',
      customFreeTitle: 'Tú eliges el 100% del texto.',
      customFreeNote:
        'En esta gama no hay palabras predefinidas: escribe en cada vela el nombre de un familiar o un deseo propio. Los diseños personalizados no se mezclan con los estándar.',
      customStepHint: 'Escribe la palabra exacta que quieres en cada vela (máx. 18 caracteres):',
      customInputPlaceholder: 'Escribe aquí tu texto',
      customInputLabel: 'Texto de la vela',
      customPlaceholderPreview: 'Tu texto',
      famQtyTitle: 'Número de velas del kit familiar',
      famQtyHint: 'Cada vela lleva el texto que tú escribas',
      customPendingBadge:
        'Kit 3: 27,00 $ · Kit 5: 34,00 $ · Familiar: 7,00 $ c/u las primeras 4 velas y 6,80 $ por cada vela adicional (máx. 12)',
      stepWords: '✨ Elige qué dirá cada una de tus velitas:',
      stockBadge: 'Listo para encender',
      favBadge: 'Favorito Familiar',
      stepShipping: 'Elige tu opción de entrega en Montreal o Canadá:',
      shipPickup: 'Recogida Montreal',
      shipMontreal: 'Domicilio Montreal',
      shipCanada: 'Resto de Canadá',
      freeLabel: 'GRATIS',
      deliveryLabel: 'Entrega',
      summaryTitle: 'Resumen de tu Kit de Velitas',
      buyNow: 'Comprar ahora · Pagar con tarjeta',
      supportLink: '¿Tienes dudas? Escríbenos',
      processing: 'Procesando...',
      successTitle: '¡Gracias por tu compra!',
      successClose: 'Cerrar',
      successMsg: {
        canada: 'Pago exitoso. Tu pedido será enviado por Canada Post.',
        montreal: 'Pago exitoso. Tu pedido será entregado el sábado siguiente a tu pago.',
        pickup: 'Pago exitoso. Puedes recoger tu pedido en la dirección 602 12e ave H8P 2R5 dos días después de este pago.'
      },
      checkoutError: 'No pudimos abrir el pago. Inténtalo de nuevo o escríbenos.',
    },
    about: {
      eyebrow: 'Hecho a mano en Montreal · @vichisboho',
      title: 'Hola, soy Victoria (« Humana pluricreativa »)',
      p1: 'Detrás de cada caja de velitas están mis manos, mi mesa de taller en Montreal y las ganas de mantener viva la magia del 7 de diciembre cuando estamos lejos de casa.',
      p2: 'Corto cada palabra dorada una por una, armo cada cajita kraft con calma y converso directamente contigo por WhatsApp o Instagram — sin robots ni respuestas automáticas.'
    },
    shipping: {
      eyebrow: 'Entregas en Montreal y todo Canadá',
      title: 'Envíos y Cómo Comprar',
      freeBanner: '¡Envío GRATIS en pedidos desde 60,00 $ CAD!',
      cards: [
        {
          title: 'Montreal — Recogida',
          price: 'GRATIS',
          desc: 'Coordinamos por WhatsApp el punto y la hora apenas tu kit esté listo.'
        },
        {
          title: 'Montreal — A domicilio',
          price: '5,00 $ CAD',
          desc: 'Entrega local directa en Montreal hasta la puerta de tu casa.'
        },
        {
          title: 'Resto de Canadá',
          price: '8,95 $ CAD',
          desc: 'Tarifa fija nacional empacada con cuidado para que tus velas lleguen intactas.'
        }
      ]
    }
  },
  fr: {
    topBarPickup: 'Ramassage gratuit à Montréal',
    topBar: 'Commandes ouvertes jusqu’au week-end du 5 décembre pour le Jour des Bougies (7 déc.)',
    nav: {
      ritual: 'Le Rituel',
      includes: 'Contenu du Kit',
      studio: 'Composer mon Kit',
      shipping: 'Livraison',
      whatsappCta: 'Acheter maintenant'
    },
    hero: {
      badge: 'Día de Velitas · 7 Décembre · Fait main à Montréal',
      title: 'Allumez un vœu créé',
      titleHighlight: 'spécialement pour les vôtres',
      subtitle:
        'Coffrets rituels du 7 décembre préparés un par un dans mon atelier : vraies bougies blanches de 5,5 pouces (14 cm) avec vœux et prénoms en vinyle doré.',
      ctaPrimary: 'Personnaliser mon Kit',
      ctaSecondary: 'Acheter maintenant',
      measureBadge: '✨ Voici comment brilleront vos bougies le 7 décembre · Hauteur réelle : 14 cm (5,5")',
      familyNamesBadge: '✨ Aussi avec les prénoms de ta famille',
      priceChip3: '🕯️ Kit 3 bougies standard :',
      priceChip5: '🕯️ Kit 5 bougies standard :'
    },
    includesSection: {
      eyebrow: 'Un soin artisanal dans chaque détail',
      title: 'Que contient chaque Kit Día de Velitas ?',
      subtitle:
        'Tout est prêt dans son coffret pour que le soir du 7 décembre, il ne vous reste plus qu’à réunir vos proches et allumer la première flamme.',
      items: [
        {
          title: 'Bougies Coniques Blanches de 5,5" (14 cm)',
          desc: 'Corps droit classique, pointe légèrement effilée et mèche en coton, personnalisées en vinyle doré champagne scintillant.'
        },
        {
          title: 'Boîte Kraft avec Fenêtre',
          desc: 'Présentation chaleureuse qui laisse apparaître les vœux dorés, prête à offrir ou à poser au centre de la table.'
        },
        {
          title: 'Carte Rituelle du 7 Décembre',
          desc: 'Raconte la tradition de la nuit des bougies et offre un espace pour poser votre intention familiale.'
        },
        {
          title: 'Fiole en Verre avec Allumettes',
          desc: 'Tout le nécessaire sous la main au moment d’illuminer vos vœux.'
        },
        {
          title: 'Étiquette Artisanale vichisboh*',
          desc: 'Fait main dans mon atelier à Montréal'
        }
      ]
    },
    studio: {
      eyebrow: 'L’Atelier des Bougies · Deux Gammes',
      title: 'Comment voulez-vous allumer vos vœux cette année ?',
      subtitle:
        'Choisissez nos vœux préférés, prêts à offrir, ou écrivez vous-même le prénom et le vœu de chaque membre de votre famille.',
      tabStd: '🕯️ Vœux Classiques (Prêts à choisir)',
      tabCustom: '✍️ Avec nos prénoms (100 % à votre goût)',
      std3Title: 'Petite boîte de 3 bougies',
      std3Desc: '3 bougies : choisissez un vœu doré pour chacune.',
      wishSelectLabel: 'Vœu de la bougie',
      std5Title: 'Petite boîte de 5 bougies',
      std5Desc: '5 bougies : choisissez un vœu doré pour chacune.',
      custom3Title: 'Personnalisé 3 Bougies',
      custom3Desc: '3 bougies avec le texte de votre choix : prénoms, vœux personnels ou les deux.',
      custom5Title: 'Personnalisé 5 Bougies',
      custom5Desc: '5 bougies avec le texte de votre choix : prénoms, vœux personnels ou les deux.',
      customFamTitle: 'Kit Familial sur Mesure',
      customFamDesc: 'Une bougie par personne (4 à 12), avec le mot exact que vous choisissez.',
      custom3Badge: '3 bougies · texte libre',
      custom5Badge: '5 bougies · texte libre',
      customFamBadge: 'Une bougie par personne',
      customFreeTitle: 'Vous choisissez 100 % du texte.',
      customFreeNote:
        'Dans cette gamme, aucun mot n’est prédéfini : écrivez sur chaque bougie le prénom d’un proche ou un vœu personnel. Les créations personnalisées ne se mélangent pas aux modèles standard.',
      customStepHint: 'Écrivez le mot exact souhaité sur chaque bougie (18 caractères max.) :',
      customInputPlaceholder: 'Écrivez votre texte ici',
      customInputLabel: 'Texte de la bougie',
      customPlaceholderPreview: 'Votre texte',
      famQtyTitle: 'Nombre de bougies du kit familial',
      famQtyHint: 'Chaque bougie porte le texte que vous écrivez',
      customPendingBadge:
        'Kit 3 : 27,00 $ · Kit 5 : 34,00 $ · Familial : 7,00 $ chacune pour les 4 premières bougies, puis 6,80 $ par bougie supplémentaire (max. 12)',
      stepWords: '✨ Choisissez ce que dira chacune de vos bougies :',
      stockBadge: 'Prête à allumer',
      favBadge: 'Favori des familles',
      stepShipping: 'Choisissez votre mode de livraison à Montréal ou au Canada :',
      shipPickup: 'Ramassage Montréal',
      shipMontreal: 'Livraison Montréal',
      shipCanada: 'Reste du Canada',
      freeLabel: 'GRATUIT',
      deliveryLabel: 'Livraison',
      summaryTitle: 'Résumé de votre Kit de Bougies',
      buyNow: 'Acheter maintenant · Payer par carte',
      supportLink: 'Des questions ? Écrivez-nous',
      processing: 'Traitement en cours...',
      successTitle: 'Merci pour votre achat !',
      successClose: 'Fermer',
      successMsg: {
        canada: 'Paiement réussi. Votre commande sera expédiée par Postes Canada.',
        montreal: 'Paiement réussi. Votre commande sera livrée le samedi suivant votre paiement.',
        pickup: 'Paiement réussi. Vous pouvez récupérer votre commande au 602 12e ave H8P 2R5 deux jours après ce paiement.'
      },
      checkoutError: 'Impossible d’ouvrir le paiement. Réessayez ou écrivez-nous.',
    },
    about: {
      eyebrow: 'Fait main à Montréal · @vichisboho',
      title: 'Bonjour, je suis Victoria (« Humaine pluricréative »)',
      p1: 'Derrière chaque coffret se trouvent mes mains, ma table d’atelier à Montréal et le désir de faire vivre la magie du 7 décembre.',
      p2: 'Je découpe chaque mot doré avec soin et j’échange directement avec vous sur WhatsApp ou Instagram — sans robot ni formulaire automatique.'
    },
    shipping: {
      eyebrow: 'Montréal et partout au Canada',
      title: 'Livraison et Comment Commander',
      freeBanner: 'Livraison GRATUITE dès 60,00 $ CAD d’achat !',
      cards: [
        {
          title: 'Montréal — Retrait',
          price: 'GRATUIT',
          desc: 'Nous convenons ensemble du moment sur WhatsApp dès que votre coffret est prêt.'
        },
        {
          title: 'Montréal — À domicile',
          price: '5,00 $ CAD',
          desc: 'Livraison locale directe jusqu’à votre porte à Montréal.'
        },
        {
          title: 'Reste du Canada',
          price: '8,95 $ CAD',
          desc: 'Tarif fixe national, emballé avec soin pour protéger vos bougies.'
        }
      ]
    }
  },
  en: {
    topBarPickup: 'Free pickup in Montreal',
    topBar: 'Orders open until the December 5 weekend for Día de Velitas (Dec 7)',
    nav: {
      ritual: 'The Ritual',
      includes: 'What’s Inside',
      studio: 'Build Your Kit',
      shipping: 'Shipping',
      whatsappCta: 'Buy now'
    },
    hero: {
      badge: 'Día de Velitas · December 7 · Handmade in Montreal',
      title: 'Light a wish crafted',
      titleHighlight: 'especially for your loved ones',
      subtitle:
        'December 7 ritual kits crafted one by one at my studio table: authentic 5.5-inch (14 cm) white candles with gold vinyl wishes and family names.',
      ctaPrimary: 'Customize My Kit',
      ctaSecondary: 'Buy now',
      measureBadge: '✨ This is how your candles will glow on December 7 · Real height: 14 cm (5.5")',
      familyNamesBadge: '✨ Also with your family\'s names',
      priceChip3: '🕯️ Standard 3-Candle Kit:',
      priceChip5: '🕯️ Standard 5-Candle Kit:'
    },
    includesSection: {
      eyebrow: 'Handmade care in every detail',
      title: 'What’s inside every Día de Velitas Kit?',
      subtitle:
        'Everything arrives ready in its gift box so on December 7 you simply gather your family and light the first flame.',
      items: [
        {
          title: '5.5" (14 cm) White Tapered Candles',
          desc: 'Classic straight cylindrical body with a subtly tapered crown and cotton wick, lettered in permanent champagne gold shimmer vinyl.'
        },
        {
          title: 'Windowed Kraft Box',
          desc: 'Warm presentation showcasing the golden wishes inside—ready for gifting or placing at the center of your table.'
        },
        {
          title: 'December 7 Ritual Card',
          desc: 'Shares the story behind Día de Velitas and includes space to set your family’s intention.'
        },
        {
          title: 'Glass Vial with Matches',
          desc: 'So you have everything ready the moment you light your candles together.'
        },
        {
          title: 'Artisanal vichisboh* Seal',
          desc: 'Handmade in my studio in Montreal'
        }
      ]
    },
    studio: {
      eyebrow: 'The Candle Studio · Two Lines',
      title: 'How do you want to light your wishes this year?',
      subtitle:
        'Pick our favorite ready-to-go wishes, or write the name and wish of each person in your family yourself.',
      tabStd: '🕯️ Classic Wishes (Ready to pick)',
      tabCustom: '✍️ With our names (100% your way)',
      std3Title: 'Little Box of 3 Candles',
      std3Desc: '3 candles: pick a golden wish for each one.',
      wishSelectLabel: 'Candle wish',
      std5Title: 'Little Box of 5 Candles',
      std5Desc: '5 candles: pick a golden wish for each one.',
      custom3Title: 'Personalized 3-Candle Kit',
      custom3Desc: '3 candles with whatever text you write: names, your own wishes, or both.',
      custom5Title: 'Personalized 5-Candle Kit',
      custom5Desc: '5 candles with whatever text you write: names, your own wishes, or both.',
      customFamTitle: 'Custom Family Kit',
      customFamDesc: 'One candle per family member (4 to 12), with the exact word you choose.',
      custom3Badge: '3 candles · free text',
      custom5Badge: '5 candles · free text',
      customFamBadge: 'One candle per person',
      customFreeTitle: 'You choose 100% of the text.',
      customFreeNote:
        'There are no preset words in this line: write a family member’s name or a wish of your own on each candle. Personalized designs are never mixed with standard ones.',
      customStepHint: 'Type the exact word you want on each candle (max. 18 characters):',
      customInputPlaceholder: 'Type your text here',
      customInputLabel: 'Candle text',
      customPlaceholderPreview: 'Your text',
      famQtyTitle: 'Number of candles in the family kit',
      famQtyHint: 'Each candle carries the text you write',
      customPendingBadge:
        '3-Kit: $27.00 · 5-Kit: $34.00 · Family: $7.00 each for the first 4 candles, then $6.80 per extra candle (max. 12)',
      stepWords: '✨ Choose what each of your candles will say:',
      stockBadge: 'Ready to light',
      favBadge: 'Family Favorite',
      stepShipping: 'Select your delivery option in Montreal or across Canada:',
      shipPickup: 'Montreal pickup',
      shipMontreal: 'Montreal delivery',
      shipCanada: 'Rest of Canada',
      freeLabel: 'FREE',
      deliveryLabel: 'Delivery',
      summaryTitle: 'Your Candle Kit Summary',
      buyNow: 'Buy now · Pay by card',
      supportLink: 'Questions? Message us',
      processing: 'Processing...',
      successTitle: 'Thank you for your purchase!',
      successClose: 'Close',
      successMsg: {
        canada: 'Payment successful. Your order will be shipped via Canada Post.',
        montreal: 'Payment successful. Your order will be delivered the Saturday following your payment.',
        pickup: 'Payment successful. You can pick up your order at 602 12e ave H8P 2R5 two days after this payment.'
      },
      checkoutError: 'We couldn’t open the payment page. Please try again or message us.',
    },
    about: {
      eyebrow: 'Handmade in Montreal · @vichisboho',
      title: 'Hi, I’m Victoria (“Multi-creative human”)',
      p1: 'Behind every candle box are my hands, my studio table in Montreal, and the joy of keeping the December 7 tradition glowing bright.',
      p2: 'I cut every golden word one by one, pack each kraft box with care, and chat directly with you on WhatsApp or Instagram—no bots or automated forms.'
    },
    shipping: {
      eyebrow: 'Delivery in Montreal & across Canada',
      title: 'Shipping & How to Order',
      freeBanner: 'FREE Shipping on orders of $60.00 CAD or more!',
      cards: [
        {
          title: 'Montreal — Pickup',
          price: 'FREE',
          desc: 'We coordinate pickup time and location directly on WhatsApp once your kit is ready.'
        },
        {
          title: 'Montreal — Home Delivery',
          price: '$5.00 CAD',
          desc: 'Direct local delivery right to your doorstep in Montreal.'
        },
        {
          title: 'Rest of Canada',
          price: '$8.95 CAD',
          desc: 'Flat-rate national shipping packed carefully so your candles arrive safely.'
        }
      ]
    }
  }
};

// ============================================================================
// 3. MAIN APPLICATION COMPONENT (100% FOCUSED ON KIT DE VELITAS)
// ============================================================================

export default function App() {
  const [lang, setLang] = useState('es');
  const t = TRANSLATIONS[lang];

  // Interactive Flame State
  const [candlesLit, setCandlesLit] = useState(true);

  // Studio Tab & Mode State
  // 'std3' ($22.00), 'std5' ($29.99), 'custom3' / 'custom5' / 'customFam' (every candle = free text written by the client)
  const [studioCategory, setStudioCategory] = useState('standard'); // 'standard' | 'custom'
  const [kitMode, setKitMode] = useState('std3');
  const inputsContainerRef = useRef(null);

  // Smooth scroll to inputs container when a kit is selected
  const scrollToInputs = () => {
    setTimeout(() => {
      if (inputsContainerRef.current) {
        inputsContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  };
  const [familyQty, setFamilyQty] = useState(4);

  // Selected wishes & family names for live preview
  const [selectedWishes, setSelectedWishes] = useState([
    'Amor',
    'Salud',
    'Prosperidad',
    'Paz',
    'Gratitud'
  ]);
  // Free-text lines for personalized kits (100% client-written, no predefined wishes)
  const [customTexts, setCustomTexts] = useState(['', '', '', '', '', '']);

  // Shipping selection: 'pickup' ($0), 'montreal' ($5), 'canada' ($8.95)
  const [shippingMethod, setShippingMethod] = useState('pickup');

  // Studio Kit Calculation
  const studioCalculation = useMemo(() => {
    let subtotal = 0;
    let priceBreakdown = '';
    let candleCount = 3;
    let activeWords = [];
    let activeNames = [];
    let modeTitle = '';

    if (kitMode === 'std3') {
      subtotal = 22.0;
      candleCount = 3;
      activeWords = [0, 1, 2].map((i) => selectedWishes[i] || WISH_WORDS[i].id);
      activeNames = ['', '', ''];
      modeTitle = 'Cajita de 3 Velitas';
    } else if (kitMode === 'std5') {
      subtotal = 29.99;
      candleCount = 5;
      activeWords = [0, 1, 2, 3, 4].map((i) => selectedWishes[i] || WISH_WORDS[i].id);
      activeNames = ['', '', '', '', ''];
      modeTitle = 'Cajita de 5 Velitas';
    } else {
      candleCount = kitMode === 'custom3' ? 3 : kitMode === 'custom5' ? 5 : familyQty;
      if (kitMode === 'custom3') {
        subtotal = CUSTOM3_PRICE;
      } else if (kitMode === 'custom5') {
        subtotal = CUSTOM5_PRICE;
      } else {
        subtotal = getFamilyPrice(familyQty);
        const extra = familyQty - FAMILY_MIN;
        priceBreakdown =
          `${FAMILY_MIN} × ${FAMILY_BASE_PRICE.toFixed(2)} $` +
          (extra > 0 ? ` + ${extra} × ${FAMILY_EXTRA_PRICE.toFixed(2)} $` : '');
      }
      activeWords = Array.from({ length: candleCount }, (_, i) =>
        (customTexts[i] || '').trim()
      );
      activeNames = Array.from({ length: candleCount }, () => '');
      modeTitle =
        kitMode === 'custom3'
          ? 'Kit 3 Velas Personalizado (texto 100% elegido por ti)'
          : kitMode === 'custom5'
          ? 'Kit 5 Velas Personalizado (texto 100% elegido por ti)'
          : `Kit Familiar Personalizado (${familyQty} velas, texto 100% elegido por ti)`;
    }

    const baseShipping =
      shippingMethod === 'pickup' ? 0 : shippingMethod === 'montreal' ? 5.0 : 8.95;
    const qualifiesFreeShipping = subtotal >= 60;
    const finalShipping = qualifiesFreeShipping ? 0 : baseShipping;
    const total = subtotal + finalShipping;

    return {
      subtotal,
      priceBreakdown,
      candleCount,
      activeWords,
      activeNames,
      modeTitle,
      baseShipping,
      qualifiesFreeShipping,
      finalShipping,
      total
    };
  }, [kitMode, familyQty, selectedWishes, customTexts, shippingMethod]);

  // WhatsApp is support-only (never used to place orders)
  const supportWhatsAppUrl = `https://wa.me/15142968295?text=${encodeURIComponent(
    {
      es: '¡Hola Vichi! 🌸 Tengo una duda sobre el Kit de Velitas.',
      fr: 'Bonjour Vichi ! 🌸 J’ai une question sur le Kit de Bougies.',
      en: 'Hi Vichi! 🌸 I have a question about the Candle Kit.'
    }[lang]
  )}`;

  const [successShipping, setSuccessShipping] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') !== 'success') return;
    const raw = (params.get('shipping') || '').toLowerCase();
    const method = raw === 'nacional' || raw === 'canada'
      ? 'canada'
      : raw === 'domicilio' || raw === 'montreal'
      ? 'montreal'
      : 'pickup';
    const urlLang = params.get('lang');
    if (urlLang && TRANSLATIONS[urlLang]) setLang(urlLang);
    setSuccessShipping(method);
  }, []);

  const closeSuccessModal = () => {
    setSuccessShipping(null);
    window.history.replaceState({}, '', window.location.pathname + window.location.hash);
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(false);

  const handleStripeCheckout = async () => {
    if (isProcessing) return;
    const kitType = kitMode.startsWith('std')
      ? 'estandarizado'
      : kitMode === 'customFam'
      ? 'familiar'
      : 'personalizado';
    const payload = {
      kitType,
      kitMode,
      quantity: studioCalculation.candleCount,
      words: studioCalculation.activeWords,
      language: lang,
      shippingMethod,
      totalAmount: Math.round(studioCalculation.total * 100) / 100
    };

    setIsProcessing(true);
    setCheckoutError(false);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || 'Checkout error');
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setCheckoutError(true);
      setIsProcessing(false);
    }
  };

  const handleSelectStudioCategory = (cat) => {
    setStudioCategory(cat);
    if (cat === 'standard') {
      setKitMode('std3');
    } else {
      setKitMode('custom3');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#4A4637] font-nunito selection:bg-[#EAB4BB] selection:text-[#61602D]">
      {/* Load Validated Google Fonts: Baloo 2, Nunito, EB Garamond */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=EB+Garamond:ital,wght@0,500;0,600;1,400;1,600&family=Nunito:wght@400;600;700;800&display=swap');
        
        .font-baloo {
          font-family: 'Baloo 2', cursive, sans-serif;
        }
        .font-nunito {
          font-family: 'Nunito', sans-serif;
        }
        .font-garamond {
          font-family: 'EB Garamond', Georgia, serif;
        }
        .sticker-card {
          box-shadow: 0 6px 0 0 rgba(198, 167, 126, 0.28), 0 12px 24px -6px rgba(97, 96, 45, 0.08);
        }
        .sticker-badge {
          box-shadow: 0 3px 0 0 rgba(197, 106, 121, 0.25);
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes cta-wiggle {
          0%, 80%, 100% { transform: scale(1) rotate(0deg); }
          85% { transform: scale(1.02) rotate(-0.8deg); }
          92% { transform: scale(1.02) rotate(0.8deg); }
        }
        @keyframes flame-flicker {
          0%, 100% { transform: scaleY(1) rotate(-1deg); opacity: 0.95; filter: brightness(1); }
          50% { transform: scaleY(1.06) rotate(1deg); opacity: 1; filter: brightness(1.12); }
        }
        .animate-float-slow { animation: float-slow 3.5s ease-in-out infinite; }
        .animate-cta-wiggle { animation: cta-wiggle 4s ease-in-out infinite; }
        .animate-flame-flicker { animation: flame-flicker 1.6s ease-in-out infinite; transform-origin: 50% 100%; }
        @media (prefers-reduced-motion: reduce) {
          .animate-float-slow, .animate-cta-wiggle, .animate-flame-flicker { animation: none; }
        }
      `}</style>

      {/* =====================================================================
          1. TOP ANNOUNCEMENT BAR (DECEMBER 7 DEADLINE & FREE SHIPPING)
      ===================================================================== */}
      <div className="bg-[#61602D] text-[#FAF6F0] text-xs sm:text-sm py-2.5 px-4 text-center font-medium">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#EAB4BB]" />
            <span>{t.topBar}</span>
          </span>
          <span className="hidden md:inline text-[#EAB4BB]">•</span>
          <span className="font-garamond italic text-sm text-[#EAB4BB]">
            {t.topBarPickup}
          </span>
        </div>
      </div>

      {/* =====================================================================
          STICKY HEADER WITH WORDMARK + LANGUAGE SWITCHER (ES / FR / EN)
      ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#EAB4BB]/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3">
          <a href="#top" className="min-w-0 shrink focus:outline-none">
            <VichisbohoLogo variant="rose-on-cream" size="md" />
            <span className="block truncate text-[11px] text-[#61602D] font-garamond italic -mt-1 tracking-wide">
              La tienda de Vichi · Día de Velitas
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-[#61602D]">
            <a href="#que-incluye" className="hover:text-[#C56A79] transition-colors">
              {t.nav.includes}
            </a>
            <a
              href="#taller-velitas"
              className="hover:text-[#C56A79] transition-colors flex items-center gap-1"
            >
              <Flame className="w-4 h-4 text-[#C56A79]" />
              {t.nav.studio}
            </a>
            <a href="#sobre-vichi" className="hover:text-[#C56A79] transition-colors">
              @vichisboho
            </a>
            <a href="#envios" className="hover:text-[#C56A79] transition-colors">
              {t.nav.shipping}
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* ES / FR / EN Language Switcher */}
            <div
              className="inline-flex rounded-full p-1 bg-[#F4EDE2] border border-[#C6A77E]/50"
              role="group"
              aria-label="Idioma"
            >
              {['es', 'fr', 'en'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase transition-all ${
                    lang === code
                      ? 'bg-[#C56A79] text-white shadow-sm'
                      : 'text-[#61602D] hover:text-[#C56A79]'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            <a
              href="#taller-velitas"
              aria-label={t.nav.whatsappCta}
              className="inline-flex shrink-0 items-center gap-2 px-3 sm:px-4 py-2.5 rounded-full bg-[#61602D] hover:bg-[#90414D] text-[#FAF6F0] text-xs sm:text-sm font-bold transition-all border-2 border-[#90414D] shadow-[4px_5px_0px_#90414D] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_3px_0px_#90414D] active:translate-x-[4px] active:translate-y-[5px] active:shadow-none"
            >
              <ShoppingCart aria-hidden="true" className="w-4 h-4 text-[#EAB4BB]" />
              <span className="hidden min-[420px]:inline">{t.nav.whatsappCta}</span>
            </a>
          </div>
        </div>
      </header>

      {/* =====================================================================
          2. HERO SECTION ("ENCIENDE UN DESEO HECHO PARA LOS TUYOS")
      ===================================================================== */}
      <section id="top" className="relative overflow-hidden pt-8 pb-16 sm:py-16 px-4 sm:px-6 bg-[#61602D] text-[#FAF6F0]">
        <div className="max-w-4xl mx-auto relative bg-[#FAF6F0]/10 border-2 border-[#C6A77E]/70 rounded-3xl py-12 px-6 sm:px-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-flex max-w-full items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF6F0] border border-[#EAB4BB] text-[#90414D] text-xs sm:text-sm font-bold sticker-badge animate-float-slow">
              <DaisyAsterisk size={16} petalColor="#C56A79" centerColor="#C6A77E" />
              <span className="break-words">{t.hero.badge}</span>
            </div>

            <h1 className="font-baloo font-extrabold text-3xl sm:text-5xl tracking-tight text-[#FAF6F0] leading-tight">
              {t.hero.title}{' '}
              <span className="text-[#EAB4BB] block sm:inline">{t.hero.titleHighlight}</span>
            </h1>

            {/* Product image inside the hero frame */}
            <div className="w-full max-w-2xl mx-auto p-3 sm:p-4 rounded-3xl bg-[#FAF6F0]/10 border-y-2 border-[#EAB4BB]/60">
              <img
                src={velitasImage}
                alt="Kit de Velitas vichisboh*"
                className="w-full h-auto rounded-lg object-cover shadow-sm"
              />
            </div>

            <p className="text-sm sm:text-base text-[#F4EDE2] leading-relaxed max-w-2xl mx-auto">
              {t.hero.subtitle}
            </p>

            {/* Exclusive benefit sticker */}
            <span className="animate-float-slow inline-flex max-w-full items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EAB4BB] border-2 border-[#C56A79] text-[#90414D] text-xs sm:text-sm font-extrabold -rotate-1 shadow-[3px_3px_0px_#C56A79]">
              <span className="break-words">{t.hero.familyNamesBadge}</span>
            </span>

            {/* Primary CTAs */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a
                href="#taller-velitas"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#C56A79] hover:bg-[#90414D] text-white font-bold text-sm sm:text-base transition-all border-2 border-[#90414D] shadow-[4px_5px_0px_#90414D] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_3px_0px_#90414D] active:translate-x-[4px] active:translate-y-[5px] active:shadow-none animate-cta-wiggle hover:animate-none active:animate-none"
              >
                <Flame className="w-5 h-5" />
                <span>{t.hero.ctaPrimary}</span>
              </a>

              <a
                href="#taller-velitas"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FAF6F0] hover:bg-[#EAB4BB] text-[#61602D] font-bold text-sm sm:text-base transition-all border-2 border-[#90414D] shadow-[4px_5px_0px_#90414D] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_3px_0px_#90414D] active:translate-x-[4px] active:translate-y-[5px] active:shadow-none"
              >
                <ShoppingCart className="w-5 h-5 text-[#C56A79]" />
                <span>{t.hero.ctaSecondary}</span>
              </a>
            </div>

            {/* Official Price Highlights */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
              <span className="px-3.5 py-1.5 rounded-full bg-[#F4EDE2] border border-[#C6A77E] font-bold text-[#61602D]">
                {t.hero.priceChip3} <strong className="text-[#90414D]">22,00 $ CAD</strong>
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-[#F4EDE2] border border-[#C6A77E] font-bold text-[#61602D]">
                {t.hero.priceChip5} <strong className="text-[#90414D]">29,99 $ CAD</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. WHAT EACH KIT INCLUDES (VISUAL BREAKDOWN)
      ===================================================================== */}
      <section
        id="que-incluye"
        className="relative py-14 px-4 sm:px-6 bg-[#F4EDE2] border-b border-[#C6A77E]/40"
      >
        <div className="absolute inset-x-0 -top-[27px]">
          <WaveDivider color="#F4EDE2" id="wave-includes" />
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#EAB4BB]/45 text-[#90414D] text-xs font-extrabold uppercase tracking-wider mb-2">
              {t.includesSection.eyebrow}
            </span>
            <h2 className="font-baloo font-extrabold text-3xl sm:text-4xl text-[#61602D]">
              {t.includesSection.title}
            </h2>
            <p className="text-sm sm:text-base text-[#4A4637] mt-2">
              {t.includesSection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {t.includesSection.items.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FAF6F0] rounded-3xl p-5 border-2 border-[#EAB4BB]/80 sticker-card flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-[#EAB4BB]/40 text-[#90414D] font-baloo font-extrabold text-lg flex items-center justify-center mb-3">
                    {idx + 1}
                  </div>
                  <h3 className="font-baloo font-bold text-lg text-[#61602D] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#4A4637] mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. EL TALLER DE VELITAS: TWO PRODUCT LINES + INTERACTIVE STUDIO
      ===================================================================== */}
      <section id="taller-velitas" className="py-16 px-4 sm:px-6 bg-[#61602D] text-[#FAF6F0]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAB4BB] text-[#90414D] text-xs font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              {t.studio.eyebrow}
            </span>
            <h2 className="font-baloo font-extrabold text-3xl sm:text-4xl text-[#FAF6F0]">
              {t.studio.title}
            </h2>
            <p className="text-base text-[#F4EDE2] mt-2">{t.studio.subtitle}</p>
          </div>

          {/* Category Switcher Tabs: Standardized vs Personalized */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 rounded-full bg-[#FAF6F0]/10 border-2 border-[#C6A77E]/70">
              <button
                type="button"
                onClick={() => handleSelectStudioCategory('standard')}
                className={`px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                  studioCategory === 'standard'
                    ? 'bg-[#FAF6F0] text-[#61602D] border-2 border-[#90414D] shadow-lg shadow-[#90414D]/50 scale-105'
                    : 'bg-[#FAF6F0]/20 border-2 border-[#EAB4BB]/40 text-[#FAF6F0] hover:bg-[#FAF6F0]/30 hover:border-[#EAB4BB] hover:-translate-y-1'
                }`}
              >
                {t.studio.tabStd}
              </button>
              <button
                type="button"
                onClick={() => handleSelectStudioCategory('custom')}
                className={`px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                  studioCategory === 'custom'
                    ? 'bg-[#C56A79] text-white border-2 border-[#90414D] shadow-lg shadow-[#90414D]/50 scale-105'
                    : 'bg-[#EAB4BB]/20 border-2 border-[#EAB4BB]/40 text-[#FAF6F0] hover:bg-[#EAB4BB]/30 hover:border-[#EAB4BB] hover:-translate-y-1'
                }`}
              >
                {t.studio.tabCustom}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left 7 Columns: Kit Selection & Word/Name Inputs */}
            <div className="lg:col-span-7 bg-[#FAF6F0]/10 rounded-[28px] border-2 border-[#C6A77E]/70 p-5 sm:p-7 space-y-6">
              {/* Sub-options depending on active category */}
              {studioCategory === 'standard' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Standard 3 Candles - $22.00 */}
                  <button
                    type="button"
                    onClick={() => { setKitMode('std3'); scrollToInputs(); }}
                    className={`p-5 rounded-3xl text-left min-w-0 break-words border-2 transition-all ${
                      kitMode === 'std3'
                        ? 'bg-[#FAF6F0] border-[#90414D] shadow-[4px_5px_0px_#90414D] -translate-y-0.5'
                        : 'bg-[#FAF6F0]/90 border-transparent hover:border-[#EAB4BB] hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#A0964C]/20 text-[#61602D] text-[11px] font-extrabold">
                        {t.studio.stockBadge}
                      </span>
                      <span className="font-baloo font-extrabold text-2xl text-[#90414D]">
                        22,00 $ <span className="text-xs">CAD</span>
                      </span>
                    </div>
                    <h3 className="font-baloo font-bold text-xl text-[#61602D] mt-2">
                      {t.studio.std3Title}
                    </h3>
                    <p className="text-xs text-[#4A4637] mt-1">{t.studio.std3Desc}</p>
                  </button>

                  {/* Standard 5 Candles - $29.99 */}
                  <button
                    type="button"
                    onClick={() => { setKitMode('std5'); scrollToInputs(); }}
                    className={`p-5 rounded-3xl text-left min-w-0 break-words border-2 transition-all ${
                      kitMode === 'std5'
                        ? 'bg-[#FAF6F0] border-[#90414D] shadow-[4px_5px_0px_#90414D] -translate-y-0.5'
                        : 'bg-[#FAF6F0]/90 border-transparent hover:border-[#EAB4BB] hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#C56A79]/20 text-[#90414D] text-[11px] font-extrabold">
                        {t.studio.favBadge}
                      </span>
                      <span className="font-baloo font-extrabold text-2xl text-[#90414D]">
                        29,99 $ <span className="text-xs">CAD</span>
                      </span>
                    </div>
                    <h3 className="font-baloo font-bold text-xl text-[#61602D] mt-2">
                      {t.studio.std5Title}
                    </h3>
                    <p className="text-xs text-[#4A4637] mt-1">{t.studio.std5Desc}</p>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Custom 3: 2 names + 1 wish */}
                    <button
                      type="button"
                      onClick={() => { setKitMode('custom3'); scrollToInputs(); }}
                      className={`p-4 rounded-3xl text-left min-w-0 break-words border-2 transition-all ${
                        kitMode === 'custom3'
                          ? 'bg-[#FAF6F0] border-[#90414D] shadow-[4px_5px_0px_#90414D] -translate-y-0.5'
                          : 'bg-[#FAF6F0]/90 border-transparent hover:border-[#EAB4BB] hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="text-xs font-extrabold text-[#90414D]">
                        ✨ {t.studio.custom3Badge}
                      </div>
                      <div className="font-baloo font-extrabold text-xl text-[#90414D]">
                        27,00 $ <span className="text-xs">CAD</span>
                      </div>
                      <h4 className="font-baloo font-bold text-lg text-[#61602D] mt-1">
                        {t.studio.custom3Title}
                      </h4>
                      <p className="text-[11px] text-[#4A4637] mt-0.5">
                        {t.studio.custom3Desc}
                      </p>
                    </button>

                    {/* Custom 5: 3 names + 2 wishes */}
                    <button
                      type="button"
                      onClick={() => { setKitMode('custom5'); scrollToInputs(); }}
                      className={`p-4 rounded-3xl text-left min-w-0 break-words border-2 transition-all ${
                        kitMode === 'custom5'
                          ? 'bg-[#FAF6F0] border-[#90414D] shadow-[4px_5px_0px_#90414D] -translate-y-0.5'
                          : 'bg-[#FAF6F0]/90 border-transparent hover:border-[#EAB4BB] hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="text-xs font-extrabold text-[#90414D]">
                        ✨ {t.studio.custom5Badge}
                      </div>
                      <div className="font-baloo font-extrabold text-xl text-[#90414D]">
                        34,00 $ <span className="text-xs">CAD</span>
                      </div>
                      <h4 className="font-baloo font-bold text-lg text-[#61602D] mt-1">
                        {t.studio.custom5Title}
                      </h4>
                      <p className="text-[11px] text-[#4A4637] mt-0.5">
                        {t.studio.custom5Desc}
                      </p>
                    </button>

                    {/* Custom Family: Each candle = name + wish */}
                    <button
                      type="button"
                      onClick={() => { setKitMode('customFam'); scrollToInputs(); }}
                      className={`p-4 rounded-3xl text-left min-w-0 break-words border-2 transition-all ${
                        kitMode === 'customFam'
                          ? 'bg-[#FAF6F0] border-[#90414D] shadow-[4px_5px_0px_#90414D] -translate-y-0.5'
                          : 'bg-[#FAF6F0]/90 border-transparent hover:border-[#EAB4BB] hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="text-xs font-extrabold text-[#90414D]">
                        👨‍👩‍👧‍👦 {t.studio.customFamBadge}
                      </div>
                      <div className="font-baloo font-extrabold text-xl text-[#90414D]">
                        {FAMILY_BASE_PRICE.toFixed(2).replace('.', ',')} $ <span className="text-xs">CAD c/u</span>
                      </div>
                      <h4 className="font-baloo font-bold text-lg text-[#61602D] mt-1">
                        {t.studio.customFamTitle}
                      </h4>
                      <p className="text-[11px] text-[#4A4637] mt-0.5">
                        {t.studio.customFamDesc}
                      </p>
                    </button>
                  </div>

                  {/* Respect Victoria's Pending Custom Price Rule */}
                  <div className="p-3 rounded-3xl bg-[#EAB4BB] border border-[#C56A79]/40 flex items-center gap-2 text-xs font-bold text-[#90414D]">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{t.studio.customPendingBadge}</span>
                  </div>
                  <div className="p-3 rounded-3xl bg-[#FAF6F0] border border-[#C6A77E]/60 text-xs text-[#61602D] leading-relaxed">
                    <span className="font-bold">{t.studio.customFreeTitle}</span>{' '}
                    {t.studio.customFreeNote}
                  </div>
                </div>
              )}

              {/* Family Quantity Stepper if Custom Family is active */}
              {kitMode === 'customFam' && (
                <div className="p-4 rounded-3xl min-w-0 bg-[#FAF6F0] border border-[#C6A77E] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-sm text-[#61602D]">
                      {t.studio.famQtyTitle}
                    </div>
                    <div className="text-xs text-[#4A4637]">{t.studio.famQtyHint}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFamilyQty(Math.max(FAMILY_MIN, familyQty - 1))}
                      disabled={familyQty <= FAMILY_MIN}
                      aria-label="-"
                      className="w-9 h-9 rounded-full bg-[#F4EDE2] hover:bg-[#EAB4BB] flex items-center justify-center text-[#61602D] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-baloo font-bold text-lg text-[#61602D]">
                      {familyQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFamilyQty(Math.min(FAMILY_MAX, familyQty + 1))}
                      disabled={familyQty >= FAMILY_MAX}
                      aria-label="+"
                      className="w-9 h-9 rounded-full bg-[#F4EDE2] hover:bg-[#EAB4BB] flex items-center justify-center text-[#61602D] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Candle-by-Candle Configurator */}
              <div>
                <h4 className="font-baloo font-bold text-lg text-[#FAF6F0] mb-2">
                  {t.studio.stepWords}
                </h4>
                <div ref={inputsContainerRef} className="space-y-2.5">
                  {kitMode.startsWith('custom') && (
                    <p className="text-sm text-[#EAB4BB] font-garamond italic mb-2.5">
                      {t.studio.customStepHint}
                    </p>
                  )}
                  {studioCalculation.activeWords.map((word, idx) => {
                    const isCustomKit = kitMode.startsWith('custom');

                    return (
                      <div
                        key={idx}
                        className="px-3 py-2 rounded-3xl w-full max-w-full min-w-0 bg-[#FAF6F0] border-2 border-[#EAB4BB] hover:border-[#C56A79] hover:-translate-y-0.5 transition-all flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#C56A79] text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-[#61602D]">
                            Vela {idx + 1}
                          </span>
                        </div>

                        <div className="flex flex-1 min-w-0 items-center gap-2">
                          {isCustomKit ? (
                            <input
                              type="text"
                              maxLength={18}
                              value={customTexts[idx] || ''}
                              onChange={(e) => {
                                const next = [...customTexts];
                                next[idx] = e.target.value;
                                setCustomTexts(next);
                              }}
                              placeholder={t.studio.customInputPlaceholder}
                              aria-label={`${t.studio.customInputLabel} ${idx + 1}`}
                              className="w-full min-w-0 max-w-full truncate sm:flex-1 px-4 py-2 rounded-full bg-white border-2 border-[#C6A77E] hover:border-[#C56A79] text-sm font-bold text-[#61602D] placeholder:font-normal placeholder:text-[#61602D]/50 focus:outline-none focus:border-[#C56A79]"
                            />
                          ) : null}

                          {isCustomKit ? null : (
                            <select
                              value={word}
                              aria-label={`${t.studio.wishSelectLabel} ${idx + 1}`}
                              onChange={(e) => {
                                const next = [...selectedWishes];
                                next[idx] = e.target.value;
                                setSelectedWishes(next);
                              }}
                              className="w-full min-w-0 max-w-full truncate sm:flex-1 px-4 py-1.5 rounded-full bg-white border-2 border-[#C6A77E] hover:border-[#C56A79] cursor-pointer text-xs font-bold text-[#61602D] focus:outline-none focus:border-[#C56A79]"
                            >
                              {WISH_WORDS.map((w) => (
                                <option key={w.id} value={w.id}>
                                  ✨ {w[lang]}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Selector inside Studio */}
              <div>
                <h4 className="font-baloo font-bold text-lg text-[#FAF6F0] mb-2">
                  {t.studio.stepShipping}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShippingMethod('pickup')}
                    className={`p-3 rounded-3xl border-2 text-left transition-all ${
                      shippingMethod === 'pickup'
                        ? 'bg-[#FAF6F0] border-[#61602D]'
                        : 'bg-[#FAF6F0]/90 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-extrabold text-[#61602D]">
                      <span>{t.studio.shipPickup}</span>
                      <span className="text-[#C56A79]">{t.studio.freeLabel}</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingMethod('montreal')}
                    className={`p-3 rounded-3xl border-2 text-left transition-all ${
                      shippingMethod === 'montreal'
                        ? 'bg-[#FAF6F0] border-[#61602D]'
                        : 'bg-[#FAF6F0]/90 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-extrabold text-[#61602D]">
                      <span>{t.studio.shipMontreal}</span>
                      <span className="text-[#90414D]">5,00 $</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingMethod('canada')}
                    className={`p-3 rounded-3xl border-2 text-left transition-all ${
                      shippingMethod === 'canada'
                        ? 'bg-[#FAF6F0] border-[#61602D]'
                        : 'bg-[#FAF6F0]/90 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-extrabold text-[#61602D]">
                      <span>{t.studio.shipCanada}</span>
                      <span className="text-[#90414D]">8,95 $</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Live 5.5" Candle Preview & Order Summary */}
            <div className="lg:col-span-5">
              <div className="relative h-full">
              <div className="absolute -top-5 -right-3 z-20 animate-float-slow" aria-hidden="true">
                <DaisyAsterisk size={44} petalColor="#EAB4BB" centerColor="#C6A77E" />
              </div>
              <div className="flex flex-col justify-between h-full gap-6 bg-[#FAF6F0] rounded-[28px] border-2 border-[#C56A79] p-6 sm:p-8 sticker-card">
                <div className="flex flex-1 items-center justify-center">
                <CandleIllustration
                  words={studioCalculation.activeWords.map((w) => {
                    if (kitMode.startsWith('custom')) return w || t.studio.customPlaceholderPreview;
                    const wish = WISH_WORDS.find((x) => x.id === w);
                    return wish ? wish.candle[lang] : w;
                  })}
                  customNames={studioCalculation.activeNames}
                  showBox={true}
                  compact={true}
                  lit={candlesLit}
                  onToggleFlame={() => setCandlesLit(!candlesLit)}
                  measureBadgeText={t.hero.measureBadge}
                />
                </div>

                {/* Summary Details */}
                <div className="pt-5 border-t-2 border-dashed border-[#EAB4BB] space-y-2 text-sm">
                  <div className="font-baloo font-bold text-lg text-[#61602D]">
                    {t.studio.summaryTitle}
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-[#4A4637] font-semibold">
                      {studioCalculation.modeTitle}
                    </span>
                    <span className="font-extrabold text-[#61602D]">
                      {`${studioCalculation.subtotal.toFixed(2)} $ CAD`}
                    </span>
                  </div>
                  {studioCalculation.priceBreakdown && (
                    <div className="text-[11px] text-[#4A4637] -mt-1">
                      {studioCalculation.priceBreakdown}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-[#4A4637]">{t.studio.deliveryLabel}</span>
                    <span className="font-bold text-[#61602D]">
                      {studioCalculation.finalShipping === 0
                        ? `${t.studio.freeLabel} (0,00 $)`
                        : `${studioCalculation.finalShipping.toFixed(2)} $ CAD`}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#C6A77E]/40 flex items-baseline justify-between">
                    <span className="font-bold text-[#61602D]">Total</span>
                    <span className="font-baloo font-extrabold text-2xl text-[#90414D]">
                      {`${studioCalculation.total.toFixed(2)} $ CAD`}
                    </span>
                  </div>
                </div>

                {/* Primary Conversion Button */}
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={handleStripeCheckout}
                    disabled={isProcessing}
                    className="disabled:opacity-70 disabled:cursor-wait w-full py-3.5 px-5 rounded-full bg-[#61602D] hover:bg-[#90414D] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all border-2 border-[#90414D] shadow-[4px_5px_0px_#90414D] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_3px_0px_#90414D] active:translate-x-[4px] active:translate-y-[5px] active:shadow-none animate-cta-wiggle hover:animate-none active:animate-none"
                  >
                    <ShoppingCart className="w-4 h-4 text-[#EAB4BB]" />
                    <span>{isProcessing ? t.studio.processing : t.studio.buyNow}</span>
                  </button>
                  {checkoutError && (
                    <p role="alert" className="text-center text-xs text-[#90414D] font-bold">
                      {t.studio.checkoutError}
                    </p>
                  )}
                  <a
                    href={supportWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-xs text-[#61602D]/80 hover:text-[#90414D] underline underline-offset-2"
                  >
                    {t.studio.supportLink}
                  </a>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. SOBRE VICHI (BRIEF & WARM)
      ===================================================================== */}
      <section id="sobre-vichi" className="relative pt-20 pb-16 px-4 sm:px-6">
        {/* Section divider: studio's olive flows into this section */}
        <div className="absolute inset-x-0 top-0 -mt-px rotate-180">
          <WaveDivider color="#61602D" id="wave-studio-end" />
        </div>
        <div className="max-w-5xl mx-auto bg-[#C56A79] rounded-[32px] p-6 sm:p-10 sticker-card">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 flex justify-center flex-shrink-0">
              <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
                <defs>
                  <clipPath id="scallop-frame" clipPathUnits="objectBoundingBox">
                    <path d={SCALLOP_PATH} />
                  </clipPath>
                </defs>
              </svg>
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 flex-shrink-0">
                {/* Offset sand layer behind the frame */}
                <div
                  className="absolute inset-0 translate-x-2 translate-y-3 bg-[#C6A77E]"
                  style={{ clipPath: 'url(#scallop-frame)' }}
                />
                <div
                  className="absolute inset-0 bg-[#FAF6F0] flex flex-col items-center justify-center text-center overflow-hidden"
                  style={{ clipPath: 'url(#scallop-frame)' }}
                >
                  {VICTORIA_PHOTO_URL ? (
                    <img
                      src={VICTORIA_PHOTO_URL}
                      alt="Victoria Henao"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <CleanBotanicalSVG className="w-24 h-28 sm:w-28 sm:h-32" />
                      <VichisbohoLogo variant="olive-on-cream" size="sm" />
                      <span className="mt-2 px-3 py-1 rounded-full bg-[#EAB4BB]/40 text-[#90414D] text-xs font-bold">
                        Victoria Henao · Montreal
                      </span>
                    </>
                  )}
                </div>
                <div className="absolute -top-1 -right-1 sm:top-0 sm:right-0 z-10 animate-float-slow" aria-hidden="true">
                  <DaisyAsterisk size={52} petalColor="#EAB4BB" centerColor="#C6A77E" />
                </div>
                <span
                  className="absolute bottom-3 -left-1 z-10 animate-float-slow text-[#C6A77E] text-3xl leading-none drop-shadow"
                  style={{ animationDelay: '1.2s' }}
                  aria-hidden="true"
                >
                  ✦
                </span>
              </div>
            </div>

            <div className="md:col-span-7 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FAF6F0]/85">
                {t.about.eyebrow}
              </span>
              <h2 className="font-baloo font-extrabold text-3xl sm:text-4xl text-[#FAF6F0]">
                {t.about.title}
              </h2>
              <p className="text-sm sm:text-base text-[#FAF6F0] leading-relaxed">
                {t.about.p1}
              </p>
              <p className="text-sm sm:text-base text-[#FAF6F0] leading-relaxed">
                {t.about.p2}
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="https://instagram.com/vichisboho"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FAF6F0] text-[#90414D] text-xs font-bold hover:bg-[#F4EDE2] transition-all"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@vichisboho</span>
                </a>
                <a
                  href="https://instagram.com/latiendadevichi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#61602D] text-white text-xs font-bold hover:bg-[#4A4637] transition-all"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@latiendadevichi</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. ENVÍOS EN MONTREAL Y CANADÁ + CÓMO COMPRAR
      ===================================================================== */}
      <section
        id="envios"
        className="py-16 px-4 sm:px-6 bg-[#F4EDE2]/60 border-t border-[#C6A77E]/40"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#90414D]">
              {t.shipping.eyebrow}
            </span>
            <h2 className="font-baloo font-extrabold text-3xl sm:text-4xl text-[#61602D] mt-1">
              {t.shipping.title}
            </h2>
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A0964C]/25 border border-[#61602D]/30 text-[#61602D] text-xs sm:text-sm font-bold">
              <Truck className="w-4 h-4 text-[#90414D]" />
              <span>{t.shipping.freeBanner}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.shipping.cards.map((opt, idx) => (
              <div
                key={idx}
                className="bg-[#FAF6F0] p-6 rounded-3xl border-2 border-[#C6A77E]/60 sticker-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-2xl bg-[#EAB4BB]/40 text-[#90414D] flex items-center justify-center">
                      {idx === 0 ? (
                        <MapPin className="w-5 h-5" />
                      ) : (
                        <Truck className="w-5 h-5" />
                      )}
                    </span>
                    <span className="font-baloo font-extrabold text-2xl text-[#61602D]">
                      {opt.price}
                    </span>
                  </div>
                  <h3 className="font-baloo font-bold text-xl text-[#61602D]">
                    {opt.title}
                  </h3>
                  <p className="text-sm text-[#4A4637] mt-1 leading-relaxed">
                    {opt.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          CLEAN BRAND FOOTER
      ===================================================================== */}
      <footer className="bg-[#FAF6F0] border-t border-[#EAB4BB] py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start">
            <VichisbohoLogo variant="rose-on-cream" size="sm" />
            <p className="text-xs text-[#61602D] mt-1 font-garamond italic">
              El taller en tu casa · Kit de Velitas hecho a mano en Montreal
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-bold text-[#61602D]">
            <a
              href="https://wa.me/15142968295"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C56A79] flex items-center gap-1"
            >
              <MessageCircle className="w-4 h-4 text-[#C56A79]" />
              <span className="hidden sm:inline">WhatsApp: 514-296-8295</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
            <span className="hidden sm:inline">•</span>
            <a
              href="https://instagram.com/vichisboho"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C56A79]"
            >
              @vichisboho
            </a>
            <span className="hidden sm:inline">•</span>
            <a
              href="https://instagram.com/latiendadevichi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C56A79]"
            >
              @latiendadevichi
            </a>
          </div>
        </div>
      </footer>

      {successShipping && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#61602D]/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-[#FAF6F0] rounded-3xl max-w-md w-full p-7 border-2 border-[#C6A77E] shadow-2xl text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-[#61602D] flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-[#EAB4BB]" />
            </div>
            <h3 className="font-baloo font-extrabold text-2xl text-[#61602D]">
              {t.studio.successTitle}
            </h3>
            <p className="font-garamond italic text-lg text-[#4A4637] leading-snug">
              {t.studio.successMsg[successShipping]}
            </p>
            <button
              type="button"
              onClick={closeSuccessModal}
              className="w-full py-3 px-5 rounded-full bg-[#61602D] hover:bg-[#90414D] text-[#FAF6F0] font-bold text-sm transition-all"
            >
              {t.studio.successClose}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
