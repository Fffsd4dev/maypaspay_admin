/**
 * Auth state for the whole app.
 *
 * Sign-in is two steps:
 *   1. login(email, password)  -> API emails a code
 *   2. verifyCode(code)        -> API returns the token, we start the session
 *
 * Between step 1 and 2 the email is kept in memory only (never in storage or the URL).
 * Refreshing the code page therefore sends the admin back to step 1, by design.
 *
 * The admin's profile and permissions are refreshed from GET /admin/auth/me when the app loads
 * and when the admin comes back to the tab, so role changes show up without signing in again.
 *
 * Usage in any component:
 *   const { admin, isAuthenticated, hasPermission, logout, refreshAdmin } = useAuthContext();
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as authApi from '@/api/auth';
import { setUnauthorizedHandler } from '@/api/client';
import { clearSession, loadSession, saveSession } from '@/auth/sessionStore';
import { env } from '@/config/env';
import useIdleTimer from '@/hooks/useIdleTimer';

const AuthContext = createContext(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadSession());
  const [pendingLogin, setPendingLogin] = useState(null); // { email, redirectTo } between step 1 and 2
  const [signOutReason, setSignOutReason] = useState(null); // why the last session ended

  /**
   * Clears the session locally. We don't navigate here: the route guards see that the
   * admin is signed out and send them to the login page, showing a message for `reason`
   * ('expired' | 'idle' | 'signed-out'). One redirect, in one place.
   */
  const endSession = useCallback((reason) => {
    clearSession();
    setSession(null);
    setPendingLogin(null);
    setSignOutReason(reason ?? null);
  }, []);

  // Step 1
  const login = useCallback(async ({ email, password, redirectTo }) => {
    await authApi.login(email, password);
    setPendingLogin({ email, redirectTo });
  }, []);

  // Step 2
  const verifyCode = useCallback(
    async (code) => {
      if (!pendingLogin) throw new Error('No sign-in in progress.');

      const data = await authApi.verifyTwoFactor(pendingLogin.email, code);
      const newSession = { token: data.token, expiresAt: data.expires_at, admin: data.admin };

      saveSession(newSession);
      setSession(newSession);
      setPendingLogin(null);
      setSignOutReason(null);
      return pendingLogin.redirectTo;
    },
    [pendingLogin],
  );

  const cancelPendingLogin = useCallback(() => setPendingLogin(null), []);

  /** Revoke the token on the server, then clear locally (even if the server call fails). */
  const logout = useCallback(
    async (reason = 'signed-out') => {
      try {
        await authApi.logout();
      } catch {
        // Ignore: we still sign out locally.
      } finally {
        endSession(reason);
      }
    },
    [endSession],
  );

    /** Reloads the signed-in admin from the server (role, permissions, status). */
  const refreshAdmin = useCallback(async () => {
    const admin = await authApi.getMe();
    const current = loadSession();
    if (!current) return null; // signed out while the request was running
    if (!admin?.uuid) return current.admin; // unexpected answer: keep what we have rather than wiping it
    const next = { ...current, admin };
    saveSession(next);
    setSession(next);
    return admin;
  }, []);

    // Keep the admin's permissions current: refresh on load (also confirms the token still works;
  // a 401 signs them out) and when they return to the tab, at most once a minute.
  // The last-refresh time lives in a ref so it survives React re-running the effect
  // (StrictMode does this in development), which would otherwise call /me twice.
  const isAuthenticated = Boolean(session);
  const lastRefreshRef = useRef(0);
  useEffect(() => {
    if (!isAuthenticated) {
      lastRefreshRef.current = 0; // next sign-in refreshes straight away
      return;
    }
    const REFRESH_GAP_MS = 60 * 1000;

    const refresh = () => {
      if (document.visibilityState !== 'visible' || Date.now() - lastRefreshRef.current < REFRESH_GAP_MS) return;
      lastRefreshRef.current = Date.now();
      refreshAdmin().catch(() => {}); // network errors are ignored; a 401 is handled by the API client
    };

    refresh();
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [isAuthenticated, refreshAdmin]);

  // If any API call returns 401, the token is no longer valid.
  useEffect(() => {
    setUnauthorizedHandler(() => endSession('expired'));
    return () => setUnauthorizedHandler(null);
  }, [endSession]);

  // Sign out automatically when the token reaches its expiry time (expires_at).
  useEffect(() => {
    if (!session) return;

    const msLeft = new Date(session.expiresAt).getTime() - Date.now();
    if (!(msLeft > 0)) {
      endSession('expired');
      return;
    }
    // setTimeout can't handle delays above ~24.8 days, so cap it.
    const timer = setTimeout(() => endSession('expired'), Math.min(msLeft, 2 ** 31 - 1));
    return () => clearTimeout(timer);
  }, [session, endSession]);

  // Sign out after a period of inactivity.
  useIdleTimer({
    enabled: Boolean(session),
    timeoutMs: env.idleTimeoutMinutes * 60 * 1000,
    onIdle: () => logout('idle'),
  });

  /**
   * For showing/hiding UI only. The backend must still check permissions on every request.
   * Example: hasPermission('kyc.reveal')
   */
  const hasPermission = useCallback(
    (permission) => Boolean(session?.admin?.is_super_admin || session?.admin?.permissions?.includes(permission)),
    [session],
  );

  const value = useMemo(
    () => ({
      admin: session?.admin ?? null,
      isAuthenticated,
      signOutReason,
      pendingLogin,
      login,
      verifyCode,
      cancelPendingLogin,
      logout,
      hasPermission,
      refreshAdmin
    }),
    [session, isAuthenticated, signOutReason, pendingLogin, login, verifyCode, cancelPendingLogin, logout, hasPermission, refreshAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
