import { Navigate, Route, Routes } from 'react-router-dom';
import { useLayoutContext } from '@/context/useLayoutContext';
import AdminLayout from '@/layouts/AdminLayout';
import HorizontalLayout from '@/layouts/HorizontalLayout';
import OtherLayout from '@/layouts/OtherLayout';
import { appRoutes, guestRoutes, publicRoutes } from '@/routes/index';
import { GuestRoute, ProtectedRoute } from '@/routes/guards';

const AppRouter = () => {
  const { layoutOrientation } = useLayoutContext();
  const Layout = layoutOrientation === 'vertical' ? AdminLayout : HorizontalLayout;

  return (
    <Routes>
      {/* Only for signed-out visitors (login) */}
      {guestRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <GuestRoute>
              <OtherLayout>{route.element}</OtherLayout>
            </GuestRoute>
          }
        />
      ))}

      {/* Open to everyone (2FA code, logout, error pages) */}
      {publicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={<OtherLayout>{route.element}</OtherLayout>} />
      ))}

      {/* Signed-in admins only. Add `permission: 'users.view'` to a route to restrict it further. */}
      {appRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <ProtectedRoute permission={route.permission}>
              <Layout>{route.element}</Layout>
            </ProtectedRoute>
          }
        />
      ))}

      <Route path="*" element={<Navigate to="/errors/error-404" replace />} />
    </Routes>
  );
};

export default AppRouter;
