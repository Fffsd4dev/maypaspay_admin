/**
 * Roles and permissions endpoints. All need the `settings.roles` permission.
 * Roles are data (editable here). Permissions are fixed by the developers.
 */
import { api } from './client';

/** Every role with its permissions and admins_count: [{ id, name, label, description, is_system, admins_count, permissions }] */
export async function listRoles() {
  const { data } = await api.get('/admin/roles');
  return data.data;
}

export async function getRole(id) {
  const { data } = await api.get(`/admin/roles/${encodeURIComponent(id)}`);
  return data.data;
}

/** Every permission, grouped: { kyc: [{ name, label }], audit: [...] } */
export async function listPermissions() {
  const { data } = await api.get('/admin/permissions');
  return data.data;
}

/** { name, label, description?, permissions?, reason? }. Returns the axios response (202 = needs approval). */
export function createRole(body) {
  return api.post('/admin/roles', body);
}

/** { label?, description?, permissions (full list, replaces the old one), reason }. Returns the axios response. */
export function updateRole(id, body) {
  return api.put(`/admin/roles/${encodeURIComponent(id)}`, body);
}

/** { reason }. A role that still has admins, or a system role, cannot be deleted. */
export function deleteRole(id, body) {
  return api.delete(`/admin/roles/${encodeURIComponent(id)}`, { data: body });
}