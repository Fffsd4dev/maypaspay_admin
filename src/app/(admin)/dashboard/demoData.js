/**
 * SAMPLE DATA for the dashboard.
 *
 * Every widget that reads from this file shows a "Demo data" badge.
 * When an endpoint is ready, replace the matching export with an API call
 * (see useStaffSummary.js for the pattern) and remove the widget's badge.
 *
 * Numbers are generated from fixed formulas (not random), so they don't jump around on refresh.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

// A smooth, repeatable "random-looking" wave for sample charts.
const wave = (i, base, swing, period = 7, phase = 0) =>
  Math.round(base + swing * Math.sin((i + phase) * ((2 * Math.PI) / period)) + (swing / 3) * Math.cos(i * 1.7));

/** Daily deposits and withdrawals (NGN) for the last 90 days, oldest first. */
export const dailyVolume = Array.from({ length: 90 }, (_, i) => {
  const date = new Date(Date.now() - (89 - i) * DAY_MS);
  return {
    date: date.toISOString().slice(0, 10),
    deposits: wave(i, 182_000_000, 38_000_000) + i * 450_000,
    withdrawals: wave(i, 141_000_000, 30_000_000, 7, 2) + i * 300_000,
  };
});

/** Headline numbers for today, with yesterday's value for the change indicator. */
export const todayStats = {
  volume: { today: 348_920_000, yesterday: 321_400_000 },
  transactions: { today: 12_480, yesterday: 12_910 },
  activeCustomers: { today: 48_216, yesterday: 47_830 },
  pendingKyc: { today: 137, yesterday: 152 },
};

/** Today's transaction volume (NGN) by channel. */
export const volumeByChannel = [
  { channel: 'Bank transfer', volume: 162_300_000 },
  { channel: 'Wallet', volume: 88_750_000 },
  { channel: 'Card', volume: 61_420_000 },
  { channel: 'Crypto', volume: 36_450_000 },
];

/** Latest transactions. status: 'successful' | 'pending' | 'failed' | 'flagged' */
export const recentTransactions = [
  { reference: 'MPY-7F3K2Q', customer: 'Adaeze Okafor', type: 'Deposit', channel: 'Bank transfer', amount: 2_500_000, status: 'successful', minutesAgo: 2 },
  { reference: 'MPY-7F3JZ8', customer: 'Tunde Bakare', type: 'Withdrawal', channel: 'Bank transfer', amount: 750_000, status: 'pending', minutesAgo: 5 },
  { reference: 'MPY-7F3JX1', customer: 'Ngozi Eze', type: 'Crypto buy', channel: 'Crypto', amount: 1_200_000, status: 'flagged', minutesAgo: 9 },
  { reference: 'MPY-7F3JV4', customer: 'Ibrahim Musa', type: 'Card payment', channel: 'Card', amount: 48_500, status: 'successful', minutesAgo: 12 },
  { reference: 'MPY-7F3JT0', customer: 'Folake Adeyemi', type: 'Transfer', channel: 'Wallet', amount: 310_000, status: 'failed', minutesAgo: 18 },
  { reference: 'MPY-7F3JR7', customer: 'Chinedu Obi', type: 'Deposit', channel: 'Wallet', amount: 95_000, status: 'successful', minutesAgo: 24 },
];

/** Open compliance alerts. severity: 'critical' | 'serious' | 'warning' */
export const complianceAlerts = [
  { id: 1, title: 'Transaction above ₦10M threshold', detail: 'Ngozi Eze · crypto purchase', severity: 'critical', minutesAgo: 9 },
  { id: 2, title: 'Possible sanctions match', detail: 'New customer screening hit', severity: 'critical', minutesAgo: 41 },
  { id: 3, title: 'Rapid repeated transfers', detail: '14 transfers in 10 minutes', severity: 'serious', minutesAgo: 73 },
  { id: 4, title: 'Login from new country', detail: 'Customer account · UK', severity: 'warning', minutesAgo: 120 },
];

/** KYC review queue counts. */
export const kycQueue = {
  awaitingReview: 137,
  inReview: 22,
  approvedToday: 318,
  rejectedToday: 41,
  oldestWaitingHours: 19,
};

/** Health of the services the platform depends on. status: 'operational' | 'degraded' | 'down' */
export const systemStatus = [
  { name: 'Core banking API', status: 'operational' },
  { name: 'Card processor', status: 'operational' },
  { name: 'Bank transfer (NIP)', status: 'degraded', note: 'Slower than usual' },
  { name: 'Crypto node sync', status: 'operational' },
  { name: 'KYC provider', status: 'operational' },
];