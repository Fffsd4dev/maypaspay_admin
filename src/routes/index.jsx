/**
 * Every page in the app.
 *
 * appRoutes     need sign-in. Add `permission: '...'` to also require a permission.
 * guestRoutes   only for signed-out visitors.
 * publicRoutes  open to everyone.
 */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// auth
const Login = lazy(() => import('@/app/(other)/auth/login/page'));
const VerifyCode = lazy(() => import('@/app/(other)/auth/verify/page'));
const Logout = lazy(() => import('@/app/(other)/auth/logout/page'));
const AcceptInvite = lazy(() => import('@/app/(other)/auth/accept-invite/page'));

// errors
const Error403 = lazy(() => import('@/app/(other)/errors/ErrorPage').then((m) => ({ default: m.Error403 })));
const Error404 = lazy(() => import('@/app/(other)/errors/ErrorPage').then((m) => ({ default: m.Error404 })));
const Error500 = lazy(() => import('@/app/(other)/errors/ErrorPage').then((m) => ({ default: m.Error500 })));

// admin area
const Dashboard = lazy(() => import('@/app/(admin)/dashboard/page'));
const Account = lazy(() => import('@/app/(admin)/account/page'));
const ChangePassword = lazy(() => import('@/app/(admin)/settings/change-password/page'));
const Admins = lazy(() => import('@/app/(admin)/settings/admins/page'));
const AdminDetails = lazy(() => import('@/app/(admin)/settings/admins/details/page'));
const Roles = lazy(() => import('@/app/(admin)/settings/roles/page'));
const RoleEditor = lazy(() => import('@/app/(admin)/settings/roles/editor/page'));
const AuditLog = lazy(() => import('@/app/(admin)/audit-log/page'));

export const appRoutes = [
  { path: '/', name: 'Home', element: <Navigate to="/dashboard" replace /> },
  { path: '/dashboard', name: 'Dashboard', element: <Dashboard /> },
  { path: '/account', name: 'My Account', element: <Account /> },

  // settings
  { path: '/settings/change-password', name: 'Change Password', element: <ChangePassword /> },
  { path: '/settings/admins', name: 'Admins', element: <Admins />, permission: 'settings.admins' },
  { path: '/settings/admins/:uuid', name: 'Admin Details', element: <AdminDetails />, permission: 'settings.admins' },
  { path: '/settings/roles', name: 'Roles', element: <Roles />, permission: 'settings.roles' },
  { path: '/settings/roles/new', name: 'New Role', element: <RoleEditor />, permission: 'settings.roles' },
  { path: '/settings/roles/:id', name: 'Edit Role', element: <RoleEditor key="edit" />, permission: 'settings.roles' },
  { path: '/audit-log', name: 'Audit Log', element: <AuditLog />, permission: 'audit.view' },
];

export const guestRoutes = [{ path: '/auth/login', name: 'Login', element: <Login /> }];

export const publicRoutes = [
  { path: '/auth/verify', name: 'Verify Code', element: <VerifyCode /> },
  { path: '/auth/logout', name: 'Logout', element: <Logout /> },
  { path: '/accept-invite', name: 'Accept Invite', element: <AcceptInvite /> },
  { path: '/errors/error-403', name: '403 Forbidden', element: <Error403 /> },
  { path: '/errors/error-404', name: '404 Not Found', element: <Error404 /> },
  { path: '/errors/error-500', name: '500 Server Error', element: <Error500 /> },
];
