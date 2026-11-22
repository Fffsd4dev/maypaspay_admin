/**
 * App configuration read from environment variables (.env).
 * Every setting the team may need to change lives here, in one place.
 */

const rawApiUrl = import.meta.env.VITE_API_BASE_URL;

if (!rawApiUrl) {
  throw new Error('VITE_API_BASE_URL is missing. Copy .env.example to .env and set it.');
}

// A financial admin must never talk to its API over plain http in production.
if (import.meta.env.PROD && !rawApiUrl.startsWith('https://')) {
  throw new Error('VITE_API_BASE_URL must use https:// in production builds.');
}

export const env = {
  // Remove any trailing slash so paths like '/admin/auth/login' join cleanly.
  apiBaseUrl: rawApiUrl.replace(/\/+$/, ''),

  // Minutes of inactivity before the admin is signed out automatically.
  idleTimeoutMinutes: Number(import.meta.env.VITE_IDLE_TIMEOUT_MINUTES) || 15,

  // How long to wait for the API before giving up (milliseconds).
  requestTimeoutMs: 20000,
};
