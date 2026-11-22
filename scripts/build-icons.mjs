/**
 * Bundles the icons we use, so the app never loads icons from Iconify's servers.
 *
 * It scans src/ for icon names like 'tabler:users' and writes only those icons to
 * src/assets/icons.json.
 *
 * You normally never run this yourself: vite.config.js runs it when dev/build starts
 * and again whenever you save a .js/.jsx file. Run `npm run icons` to do it by hand.
 *
 * Using a new icon set (e.g. 'lucide:...')? Install it first: npm install -D @iconify-json/lucide
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getIcons } from '@iconify/utils';

const require = createRequire(import.meta.url);
const SRC_DIR = 'src';
const OUTPUT = 'src/assets/icons.json';
const ICON_NAME = /['"`]([a-z0-9]+(?:-[a-z0-9]+)*):([a-z0-9]+(?:-[a-z0-9]+)*)['"`]/g;
const NOT_ICONS = new Set(['http', 'https', 'data', 'mailto', 'blob']);

/** Finds every icon name used in the code: Map(prefix -> Set(names)) */
function findUsedIcons(dir, used = new Map()) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) findUsedIcons(path, used);
    else if (['.js', '.jsx'].includes(extname(path))) {
      for (const [, prefix, name] of readFileSync(path, 'utf8').matchAll(ICON_NAME)) {
        if (NOT_ICONS.has(prefix)) continue;
        if (!used.has(prefix)) used.set(prefix, new Set());
        used.get(prefix).add(name);
      }
    }
  }
  return used;
}

/**
 * Writes src/assets/icons.json. Only touches the file when the icon list actually changed,
 * so it doesn't trigger pointless reloads. Returns true if the file changed.
 */
export function buildIcons({ silent = false } = {}) {
  const collections = [];
  for (const [prefix, names] of findUsedIcons(SRC_DIR)) {
    let set;
    try {
      set = require(`@iconify-json/${prefix}/icons.json`);
    } catch {
      continue; // a "something:something" string that isn't an icon, or a set we haven't installed
    }
    const subset = getIcons(set, [...names]);
    if (!subset) continue;

    const found = new Set([...Object.keys(subset.icons ?? {}), ...Object.keys(subset.aliases ?? {})]);
    for (const name of names) {
      if (!found.has(name)) console.warn(`[icons] Icon not found: ${prefix}:${name}`);
    }
    collections.push(subset);
  }

  const json = JSON.stringify(collections);
  if (existsSync(OUTPUT) && readFileSync(OUTPUT, 'utf8') === json) return false;

  writeFileSync(OUTPUT, json);
  if (!silent) {
    const total = collections.reduce((n, c) => n + Object.keys(c.icons).length, 0);
    console.log(`[icons] Bundled ${total} icons into ${OUTPUT}`);
  }
  return true;
}

// `node scripts/build-icons.mjs` (npm run icons)
if (process.argv[1] === fileURLToPath(import.meta.url)) buildIcons();