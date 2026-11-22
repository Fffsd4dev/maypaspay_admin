import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { buildSecurityHeaders } from './security-headers.js';
import { buildIcons } from './scripts/build-icons.mjs';

/**
 * Keeps src/assets/icons.json in sync with the icons used in the code:
 * when dev/build starts, and every time a .js/.jsx file in src/ is saved.
 */
const bundleIcons = () => ({
  name: 'bundle-icons',
  buildStart() {
    buildIcons();
  },
  configureServer(server) {
    const onChange = (file) => {
      if (/[\\/]src[\\/].*\.jsx?$/.test(file)) buildIcons();
    };
    server.watcher.on('change', onChange);
    server.watcher.on('add', onChange);
  },
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const apiOrigin = env.VITE_API_BASE_URL ? new URL(env.VITE_API_BASE_URL).origin : '';
  const securityHeaders = buildSecurityHeaders({ apiOrigin });

  return {
    plugins: [react(), bundleIcons()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },

    // `npm run dev`: the full CSP is left out because Vite's hot reload needs inline scripts.
    // Every other header is applied, so dev behaves close to production.
    server: {
      headers: Object.fromEntries(
        Object.entries(securityHeaders).filter(([name]) => name !== 'Content-Security-Policy'),
      ),
    },

    // `npm run preview`: serves the production build with ALL headers, including the CSP.
    preview: {
      headers: securityHeaders,
    },

    build: {
      // Don't ship source maps: they would let anyone read the original source code.
      sourcemap: false,
    },

    esbuild: {
      // In production builds remove debugger statements and console.log/info/debug calls,
      // so no data is printed to the browser console. console.warn/error are kept.
      drop: mode === 'production' ? ['debugger'] : [],
      pure: mode === 'production' ? ['console.log', 'console.info', 'console.debug'] : [],
    },
  };
});
