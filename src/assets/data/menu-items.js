/**
 * Sidebar (vertical) and top bar (horizontal) menus.
 * Add `permission: '...'` to hide an item from admins without that permission.
 */
export const MENU_ITEMS = [
  { key: 'navigation', label: 'Navigation', isTitle: true },
  { key: 'dashboard', label: 'Dashboard', icon: 'tabler:dashboard', url: '/dashboard' },

  { key: 'administration', label: 'Administration', isTitle: true, permission: ['settings.admins', 'settings.roles'] },
  { key: 'admins', label: 'Admins', icon: 'tabler:users', url: '/settings/admins', permission: 'settings.admins' },
  { key: 'roles', label: 'Roles & permissions', icon: 'tabler:shield-lock', url: '/settings/roles', permission: 'settings.roles' },
];

export const HORIZONTAL_MENU_ITEM = [
  { key: 'dashboard', label: 'Dashboard', icon: 'tabler:dashboard', url: '/dashboard' },
  { key: 'admins', label: 'Admins', icon: 'tabler:users', url: '/settings/admins', permission: 'settings.admins' },
  { key: 'roles', label: 'Roles', icon: 'tabler:shield-lock', url: '/settings/roles', permission: 'settings.roles' },
];