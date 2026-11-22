# MaypasPay Admin

The internal administration dashboard for MaypasPay. Authorised staff use it to manage the platform: staff accounts, roles and access, and day-to-day operational oversight.

> This is a private, internal tool. Access is restricted to approved MaypasPay staff.

## Features

- **Secure sign-in** with two-step verification
- **Role-based access:** each staff member only sees and does what their role allows
- **Staff management:** invite, update and manage administrator accounts
- **Roles and permissions:** define what each role can access
- **Overview dashboard** with key figures and activity
- **My account:** profile, access summary and password management
- **Light and dark mode**, responsive on desktop, tablet and mobile

## Tech stack

- [React 19](https://react.dev) with [Vite](https://vite.dev)
- [React Bootstrap](https://react-bootstrap.github.io) and Sass for the UI
- [React Router](https://reactrouter.com) for navigation
- [React Hook Form](https://react-hook-form.com) and [Yup](https://github.com/jquense/yup) for forms
- [Recharts](https://recharts.org) for charts
- [Iconify](https://iconify.design) (Tabler icon set), bundled locally

## Getting started

**Requirements:** Node.js 20 or newer, and npm.

```bash
npm install
cp .env.example .env    # then fill in the values (ask the team lead)
npm run dev
```

The app runs at `http://localhost:5173`.

### Environment variables

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL of the MaypasPay API |
| `VITE_IDLE_TIMEOUT_MINUTES` | Minutes of inactivity before a user is signed out |

Never commit your `.env` file. It is excluded by `.gitignore`. Real values are shared privately within the team.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build locally (with production security settings) |
| `npm run icons` | Rebuild the bundled icon set (normally automatic) |

## Project structure

```
src/
  api/          communication with the backend
  app/          pages, grouped by area (auth, dashboard, settings...)
  assets/       styles, images, fonts and bundled icons
  auth/         sign-in session helpers
  components/   shared, reusable UI components
  config/       app settings read from the environment
  context/      app-wide state (auth, layout)
  hooks/        reusable React hooks
  routes/       page list and route protection
  utils/        formatting and helper functions
```

## Development guidelines

- **One API client:** all requests go through the shared client in `src/api/`, never directly.
- **Reuse shared components** (tables, pills, buttons, forms) so the UI stays consistent.
- **Protect new pages** by adding them to the route list with the access they require.
- **Keep secrets out of the code:** no keys, tokens or real credentials in source files or commits.
- **Pull before you start, commit small and often,** and write clear commit messages.

## Security

If you find a security issue, **do not open a public issue or share it in chat.** Report it privately to the project lead.

## License

Proprietary. © MaypasPay. All rights reserved. Not for redistribution.