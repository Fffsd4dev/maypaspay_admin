/**
 * Rules and labels for roles and permissions, mirroring the API.
 * The API enforces all of these itself; this keeps the UI honest.
 */

/** Adding any of these to a role needs a second admin's approval (API answers 202). */
export const SENSITIVE_PERMISSIONS = ['settings.admins', 'settings.roles', 'settings.approve'];

// Group titles are shared with the My account page.
export { groupTitle } from '@/utils/permissions';

/** API: lowercase letters, numbers and underscores, starting with a letter, max 64. */
export const ROLE_NAME_PATTERN = /^[a-z][a-z0-9_]{0,63}$/;

/** "Finance Lead (NG)" -> "finance_lead_ng". Used to suggest a name from the label. */
export const toRoleName = (label) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^[^a-z]+/, '') // must start with a letter
    .replace(/_+$/, '')
    .slice(0, 64);

/**
 * API: you can't give a role a permission you don't hold yourself (super admins can give any).
 * Returns a function: canGrant('kyc.view') -> true/false
 */
export const makeCanGrant = (me) => (permission) => Boolean(me?.is_super_admin || me?.permissions?.includes(permission));