/**
 * Security headers for the dashboard.
 *
 * Used by `npm run preview` (see vite.config.js) so we can test them locally.
 * When we deploy, the SAME headers must be set on the hosting server (Nginx, Vercel, etc.).
 *
 * If something stops loading after a change, open the browser console: it will say
 * "Refused to load ... because it violates the Content Security Policy" and name the URL.
 */

export function buildSecurityHeaders({ apiOrigin }) {
  const contentSecurityPolicy = [
    "default-src 'self'",
    "script-src 'self'", // no inline or third-party scripts
    "style-src 'self' 'unsafe-inline'", // React Bootstrap and charts use inline styles
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self' ${apiOrigin}`, // the app may only send requests to our own API
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'", // nobody can put this dashboard in an iframe (clickjacking)
  ].join('; ');

  return {
    'Content-Security-Policy': contentSecurityPolicy,
    'X-Frame-Options': 'DENY', // older-browser version of frame-ancestors
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
  };
}
