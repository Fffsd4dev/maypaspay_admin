import { HORIZONTAL_MENU_ITEM, MENU_ITEMS } from '../assets/data/menu-items';
export const getMenuItems = () => {
  return MENU_ITEMS;
};
export const getHorizontalMenuItems = () => {
  return HORIZONTAL_MENU_ITEM;
};

/**
 * Removes menu items the admin isn't allowed to see.
 * Give a menu item `permission: 'settings.admins'` to hide it from admins without it,
 * or a list (`permission: ['settings.admins', 'settings.roles']`) to show it if they have ANY of them.
 * (The route itself is protected too, so this is only about a tidy menu.)
 */
export const filterMenuByPermission = (items, hasPermission) =>
  items
    .filter((item) => !item.permission || [].concat(item.permission).some(hasPermission))
    .map((item) => (item.children ? { ...item, children: filterMenuByPermission(item.children, hasPermission) } : item));
export const findAllParent = (menuItems, menuItem) => {
  let parents = [];
  const parent = findMenuItem(menuItems, menuItem.parentKey);
  if (parent) {
    parents.push(parent.key);
    if (parent.parentKey) {
      parents = [...parents, ...findAllParent(menuItems, parent)];
    }
  }
  return parents;
};
export const getMenuItemFromURL = (items, url) => {
  if (items instanceof Array) {
    for (const item of items) {
      const foundItem = getMenuItemFromURL(item, url);
      if (foundItem) {
        return foundItem;
      }
    }
  } else {
    if (items.url == url) return items;
    if (items.children != null) {
      for (const item of items.children) {
        if (item.url == url) return item;
      }
    }
  }
};
export const findMenuItem = (menuItems, menuItemKey) => {
  if (menuItems && menuItemKey) {
    for (const item of menuItems) {
      if (item.key === menuItemKey) {
        return item;
      }
      const found = findMenuItem(item.children, menuItemKey);
      if (found) return found;
    }
  }
  return null;
};