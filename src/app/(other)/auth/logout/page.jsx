/**
 * Visiting /auth/logout signs the admin out (revokes the token, clears the session)
 * and then lands on the login page with a "You have been signed out" message.
 */
import { useEffect, useRef } from 'react';
import { Spinner } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/context/useAuthContext';

const LogoutPage = () => {
  const { isAuthenticated, logout } = useAuthContext();
  const started = useRef(false); // React StrictMode runs effects twice in dev; only log out once.

  useEffect(() => {
    if (isAuthenticated && !started.current) {
      started.current = true;
      logout();
    }
  }, [isAuthenticated, logout]);

  if (!isAuthenticated) {
    return <Navigate to={started.current ? '/auth/login?reason=signed-out' : '/auth/login'} replace />;
  }

  return (
    <div className="d-flex min-vh-100 justify-content-center align-items-center gap-2 text-muted">
      <Spinner size="sm" /> Signing out…
    </div>
  );
};

export default LogoutPage;
