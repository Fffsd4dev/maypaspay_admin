/**
 * Route guards.
 *
 * <ProtectedRoute>  only signed-in admins (optionally with a permission).
 * <GuestRoute>      only signed-out visitors (e.g. the login page).
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/context/useAuthContext';

export const ProtectedRoute = ({ permission, children }) => {
  const { isAuthenticated, signOutReason, hasPermission } = useAuthContext();
  const location = useLocation();

  if (!isAuthenticated) {
    // Remember where they were going, so we can bring them back after sign-in,
    // and why they were signed out (if they were), so the login page can say so.
    const params = new URLSearchParams({ redirectTo: location.pathname + location.search });
    if (signOutReason) params.set('reason', signOutReason);
    return <Navigate to={`/auth/login?${params}`} replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/errors/error-403" replace />;
  }

  return children;
};

export const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};
