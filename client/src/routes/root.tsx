import AuthProvider from '@/authentication/AuthContext';
import DefaultLayout from '@/layouts/Default';
import { Outlet } from 'react-router-dom';
import { ModalsProvider } from '@mantine/modals';

type RootType = {};
const Root = ({}: RootType) => {
  return (
    <AuthProvider>
      <ModalsProvider>
        <DefaultLayout>
          <Outlet />
        </DefaultLayout>
      </ModalsProvider>
    </AuthProvider>
  );
};

export default Root;
