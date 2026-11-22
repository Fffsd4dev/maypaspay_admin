import FallbackLoading from '@/components/FallbackLoading';
import Footer from '@/components/layout/Footer';
import HorizontalNavBar from '@/components/layout/HorizontalNav/page';
import { useAuthContext } from '@/context/useAuthContext';
import { filterMenuByPermission, getHorizontalMenuItems } from '@/helpers/Manu';
import { lazy, Suspense, useMemo } from 'react';
const TopNavigationBarPage = lazy(() => import('@/components/layout/TopNavigationBar/page'));
const HorizontalLayout = ({
  children
}) => {
  const { hasPermission } = useAuthContext();
  const menuItems = useMemo(() => filterMenuByPermission(getHorizontalMenuItems(), hasPermission), [hasPermission]);
  return <>
      <div className="wrapper">
        <Suspense fallback={<FallbackLoading />}>
          <TopNavigationBarPage />
        </Suspense>

        <Suspense fallback={<FallbackLoading />}>
          <HorizontalNavBar menuItems={menuItems} />
        </Suspense>

        <div className="page-content">
          <div className="page-container">{children}</div>
          <Footer />
        </div>
      </div>
    </>;
};
export default HorizontalLayout;