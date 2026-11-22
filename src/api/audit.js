/**
 * Audit log endpoint (needs the audit.view permission). Newest first.
 */
import { api } from './client';

/**
 * params (all optional): action, actor_type ('admin' | 'user'), actor_id, entity_type, entity_id,
 * request_id, from, to (YYYY-MM-DD), per_page, page. Returns { data, meta }.
 */
export async function listAuditLogs(params) {
  const { data } = await api.get('/admin/audit-logs', { params });
  return data;
}