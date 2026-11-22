/**
 * Admin (staff account) endpoints. All need the `settings.admins` permission
 * and every action is written to the audit log by the backend.
 */
import { api } from './client';

/** params: { status, role_id, search, per_page, page }. Returns { data, meta }. */
export async function listAdmins(params) {
  const { data } = await api.get('/admin/admins', { params });
  return data;
}

export async function getAdmin(uuid) {
  const { data } = await api.get(`/admin/admins/${encodeURIComponent(uuid)}`);
  return data.data;
}

/** { name, email, role_id, reason? }. Returns the axios response so callers can check for 202 (needs approval). */
export function inviteAdmin(body) {
  return api.post('/admin/admins', body);
}

/** { role_id, reason }. Returns the axios response (202 = needs a second admin's approval). */
export function changeAdminRole(uuid, body) {
  return api.put(`/admin/admins/${encodeURIComponent(uuid)}/role`, body);
}

// Simple POST actions. `body` is { reason } where the action takes one.
const postAction = (action) => (uuid, body) => api.post(`/admin/admins/${encodeURIComponent(uuid)}/${action}`, body);

export const resendInvite = postAction('resend-invite');
export const suspendAdmin = postAction('suspend');
export const reactivateAdmin = postAction('reactivate');
export const unlockAdmin = postAction('unlock');
export const signOutAdminEverywhere = postAction('sign-out');
