/**
 * App-wide icon component. Usage: <IconifyIcon icon="tabler:users" />
 *
 * Icons come from src/assets/icons.json (kept up to date automatically by vite.config.js),
 * not from Iconify's servers. The offline build never makes network requests.
 */
import { addCollection, Icon } from '@iconify/react/offline';
import collections from '@/assets/icons.json';

const loadedIcons = new Set();
collections.forEach((collection) => {
  addCollection(collection);
  Object.keys({ ...collection.icons, ...collection.aliases }).forEach((name) => loadedIcons.add(`${collection.prefix}:${name}`));
});

// In development, say clearly when an icon is missing instead of silently showing nothing.
const warned = new Set();
const warnIfMissing = (icon) => {
  if (!import.meta.env.DEV || typeof icon !== 'string' || loadedIcons.has(icon) || warned.has(icon)) return;
  warned.add(icon);
  console.warn(
    `[icons] "${icon}" isn't bundled. Save any file to refresh icons, or run "npm run icons". ` +
      'If it\'s a new icon set, install it first (e.g. npm install -D @iconify-json/lucide).',
  );
};

const IconifyIcon = (props) => {
  warnIfMissing(props.icon);
  return <Icon {...props} />;
};

export default IconifyIcon;