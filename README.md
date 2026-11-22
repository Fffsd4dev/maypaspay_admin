# MaypasPay Admin

Admin dashboard for MaypasPay. React 19 + Vite + React Bootstrap (styling based on the Greeva template).

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

| Variable                    | What it does                                         |
| --------------------------- | ---------------------------------------------------- |
| `VITE_API_BASE_URL`         | API base URL, no trailing slash. Must be `https://` in production builds. |
| `VITE_IDLE_TIMEOUT_MINUTES` | Sign the admin out after this many idle minutes (default 15). |

Never commit `.env`. It is already in `.gitignore`. Use **npm** only, so everyone installs the same versions from `package-lock.json`.

## Where things live

```
security-headers.js        security headers + Content Security Policy (one source of truth)
scripts/build-icons.mjs    bundles the icons we use (runs before dev/build)
src/
  config/env.js            all settings read from .env
  api/client.js            the ONE axios instance (token, 401 handling, error messages)
  api/auth.js              auth endpoints
  api/admins.js            admin (staff) endpoints
  api/roles.js             roles endpoints
  auth/sessionStore.js     where the session is stored (sessionStorage)
  auth/redirect.js         safe "redirect after login" check
  context/useAuthContext.jsx  auth state + login / verifyCode / logout / hasPermission
  hooks/useIdleTimer.js    inactivity sign-out
  routes/index.jsx         every page in the app (add new pages here)
  routes/guards.jsx        ProtectedRoute and GuestRoute
  assets/data/menu-items.js   sidebar + top menu
  components/auth/AuthCard.jsx  shared layout for auth and error screens
  components/TablePagination.jsx  pagination for any API list
  app/(other)/auth/        login, verify (2FA code), logout
  app/(other)/errors/      403, 404, 500
  app/(admin)/dashboard/   home page
  app/(admin)/settings/admins/          Admins module (list, details, actions)
  app/(admin)/settings/change-password/
```

## Icons

Icons are bundled with the app, not loaded from Iconify's servers. Use them as usual:

```jsx
<IconifyIcon icon="tabler:users" />
```

`scripts/build-icons.mjs` finds every `'set:name'` string in `src/` and copies just those icons into `src/assets/icons.json`. Vite runs it automatically when dev/build starts **and every time you save a `.js`/`.jsx` file**, so new icons just appear.

- An icon not showing? The browser console says which one. Check the name on the Iconify site, or run `npm run icons`.
- Using a new icon set (e.g. `lucide:...`)? Install it first: `npm install -D @iconify-json/lucide`.
- Browse icons at https://icon-sets.iconify.design (we use the **tabler** set).

## How sign-in works

1. **Login** (`/auth/login`) posts email + password to `/admin/auth/login`. The API emails a code.
2. **Verify** (`/auth/verify`) posts email + code to `/admin/auth/2fa` and gets back the token, `expires_at` and the admin profile.
   - The page says "check your registered email". It never shows the address.
   - The email is kept in memory only between steps 1 and 2, so refreshing this page restarts sign-in.
3. The session (token, expiry, admin) is saved in **sessionStorage**, so it ends when the tab closes and isn't shared with other tabs.

The admin is signed out automatically when:

- the token reaches `expires_at`,
- they are inactive for `VITE_IDLE_TIMEOUT_MINUTES`, or
- any API call returns `401`.

The login page then explains why ("Your session has expired…" or "…because of inactivity").

## Security rules for contributors

- **Always use `api` from `@/api/client`** for requests. Never use axios or fetch directly, or you lose the token and 401 handling.
- **Never store** passwords, 2FA codes or sensitive customer data in localStorage, sessionStorage, cookies or the URL.
- **Show errors with `getErrorMessage(err)`.** Never render raw server responses.
- **Login errors stay generic** ("Invalid email or password") so the form never reveals which emails exist.
- **Permissions in the UI are only for showing or hiding things.** The backend must check every request.
- Don't use `dangerouslySetInnerHTML` with API data.

## Adding a protected page

1. Create the page in `src/app/(admin)/your-page/page.jsx`.
2. Add it to `appRoutes` in `src/routes/index.jsx`. To restrict it to a permission, add `permission`:

```js
{ path: '/users', name: 'Users', element: <Users />, permission: 'users.view' }
```

All routes in `appRoutes` require sign-in automatically. Admins without the permission are sent to the 403 page.

3. Add a menu entry in `src/assets/data/menu-items.js` with the same `permission`, so it's hidden from admins who can't open it.

To hide UI parts, use the same permissions:

```jsx
const { hasPermission } = useAuthContext();
{hasPermission('kyc.reveal') && <RevealButton />}
```

## Security headers

The headers (including the Content Security Policy) are defined once in `security-headers.js`.

- `npm run dev` applies all of them except the CSP, because Vite's hot reload needs inline scripts.
- `npm run build && npm run preview` applies all of them. **Test here before every release.**
- The hosting server must send the same headers in production.

If something stops loading, the browser console will say "Refused to load … Content Security Policy" and name the URL. Only add a domain to the policy if we really trust it.

Production builds ship without source maps and with `console.log/info/debug` removed.
