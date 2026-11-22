import { AuthProvider } from '@/context/useAuthContext';
import { LayoutProvider } from '@/context/useLayoutContext';
import { ToastContainer } from 'react-toastify';

const AppProvidersWrapper = ({
  children
}) => {
  return <>
        <AuthProvider>
          <LayoutProvider>
            {children}
            <ToastContainer theme="colored" />
          </LayoutProvider>
        </AuthProvider>
    </>;
};
export default AppProvidersWrapper;