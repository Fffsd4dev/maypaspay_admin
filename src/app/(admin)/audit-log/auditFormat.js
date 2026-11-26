/**
 * Turning raw audit entries into readable text.
 */

/** "admin.login" -> "Admin login", "role.permissions_updated" -> "Role permissions updated" */
export const describeAction = (action = '') => {
  const words = action.replace(/[._]/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

/** True when the entry was done by staff ("admin_user"), false for customers. */
export const isAdminActor = (entry) => String(entry.actor_type ?? '').startsWith('admin');

/** The actor's name; "Admin #1" / "User #52" if the API sent no name; "System" when there's no actor. */
export const describeActor = (entry) => {
  if (!entry.actor_type) return 'System';
  return entry.actor_name || `${isAdminActor(entry) ? 'Admin' : 'User'} #${entry.actor_id}`;
};

/** "Role #7", or null when the entry isn't about a specific record. */
export const describeEntity = (entry) =>
  entry.entity_type ? `${describeAction(entry.entity_type)}${entry.entity_id != null ? ` #${entry.entity_id}` : ''}` : null;

/** Any value as display text: objects/arrays as compact JSON, empty as "—". */
export const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

/**
 * Lines up before_state and after_state field by field:
 * [{ field: 'status', before: 'active', after: 'suspended', changed: true }, ...]
 */
export const compareStates = (before, after) => {
  const fields = [...new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})])].sort();
  return fields.map((field) => {
    const oldValue = before?.[field];
    const newValue = after?.[field];
    return { field, before: oldValue, after: newValue, changed: JSON.stringify(oldValue) !== JSON.stringify(newValue) };
  });
};