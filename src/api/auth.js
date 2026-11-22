/**
 * Auth endpoints. Each function returns the response body (`data`).
 */
import { api } from './client';

/** Step 1: check email + password. On success the API emails a 2FA code. */
export async function login(email, password) {
  const { data } = await api.post('/admin/auth/login', { email, password }, { skipAuthRedirect: true });
  return data;
}

/** Step 2: verify the emailed code. Returns { token, token_type, expires_at, admin }. */
export async function verifyTwoFactor(email, code) {
  const { data } = await api.post('/admin/auth/2fa', { email, code }, { skipAuthRedirect: true });
  return data;
}

/** The signed-in admin, fresh from the server: { uuid, name, email, status, role, is_super_admin, permissions, ... } */
export async function getMe() {
  const { data } = await api.get('/admin/auth/me');
  // Accept { admin } or { data: { admin } } or { data: admin }, depending on how the API wraps it.
  return data.admin ?? data.data?.admin ?? data.data ?? null;
}

/** Revokes the current token on the server. */
export async function logout() {
  const { data } = await api.post('/admin/auth/logout', null, { skipAuthRedirect: true });
  return data;
}

/** Changes the signed-in admin's password. */
export async function changePassword({ currentPassword, password, passwordConfirmation }) {
  const { data } = await api.post('/admin/auth/password', {
    current_password: currentPassword,
    password,
    password_confirmation: passwordConfirmation,
  });
  return data;
}
