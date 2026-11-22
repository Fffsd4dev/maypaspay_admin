/**
 * Number formatting for money, counts and percentages.
 * Change CURRENCY / LOCALE here if the platform's base currency changes.
 */
const LOCALE = 'en-NG';
const CURRENCY = 'NGN';

/** ₦1,250,000.00 — or ₦1.25M with { compact: true } */
export const formatMoney = (amount, { compact = false, currency = CURRENCY } = {}) =>
  new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency,
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 2 : 2,
    minimumFractionDigits: compact ? 0 : 2,
  }).format(amount ?? 0);

/** 12,480 — or 12.5K with { compact: true } */
export const formatNumber = (value, { compact = false } = {}) =>
  new Intl.NumberFormat(LOCALE, { notation: compact ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(value ?? 0);

/** 0.042 -> "4.2%" */
export const formatPercent = (ratio, digits = 1) =>
  new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: digits }).format(ratio ?? 0);


/** "Ayo Oluwatobi" -> "AO" (for avatars) */
export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');