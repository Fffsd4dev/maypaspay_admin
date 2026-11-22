/**
 * Helpers for showing permissions to people.
 * Permission names look like "area.action" (e.g. "kyc.review"); the area is the group.
 */

/** Friendly titles for permission groups. Unknown groups fall back to their key, capitalised. */
const GROUP_TITLES = {
  audit: 'Audit log',
  compliance: 'Compliance',
  crypto: 'Crypto',
  kyc: 'KYC',
  ops: 'Operations',
  settings: 'Settings',
  users: 'Users',
};

export const groupTitle = (key) => GROUP_TITLES[key] ?? key.charAt(0).toUpperCase() + key.slice(1);

/** ["kyc.view", "kyc.review", "audit.view"] -> { audit: ["audit.view"], kyc: ["kyc.review", "kyc.view"] } */
export const groupByArea = (permissions = []) =>
  [...permissions].sort().reduce((groups, permission) => {
    const area = permission.split('.')[0];
    (groups[area] ??= []).push(permission);
    return groups;
  }, {});