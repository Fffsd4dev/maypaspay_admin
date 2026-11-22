/**
 * Where the signed-in session (token + admin profile) is kept.
 *
 * WHY sessionStorage (and not localStorage or a normal cookie):
 *  - It is cleared when the tab or browser closes, so a session never outlives the visit.
 *  - It is NOT shared between tabs, so every new tab must sign in (good for a finance admin).
 *  - It survives a page refresh, so admins don't lose work on F5.
 *
 * Trade-off: like any JS-readable storage, a successful XSS attack could read it.
 * The safest option is an httpOnly cookie set by the backend. If the API ever
 * supports that, only this file and api/client.js need to change.
 *
 * Never put passwords or 2FA codes in here.
 */

const STORAGE_KEY = 'mp_admin_session';

export function saveSession({ token, expiresAt, admin }) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ token, expiresAt, admin }));
}

/** Returns the saved session, or null if there is none, it is broken, or it has expired. */
export function loadSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw);
    if (!session?.token || isExpired(session.expiresAt)) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function isExpired(expiresAt) {
  const expiryTime = new Date(expiresAt).getTime();
  // Treat a missing or invalid date as expired, to be safe.
  return Number.isNaN(expiryTime) || expiryTime <= Date.now();
}
