import AuthProvider from '@/authentication/AuthContext';
import DefaultLayout from '@/layouts/Default';
import { Outlet } from 'react-router-dom';

type RootType = {};
const Root = ({}: RootType) => {
  return (
    <AuthProvider>
      <DefaultLayout>
        <Outlet />
      </DefaultLayout>
    </AuthProvider>
  );
};

export default Root;
