import { MantineProvider } from '@mantine/core';
import './styles/index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { theme } from './theme';
import Root from './routes/root';
import { Welcome } from './components/Welcome/Welcome';
import ResetPassword from './components/ResetPassword/ResetPassword';
import UserProfile from './components/UserProfile/UserProfile';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import ProfileDetails from './components/UserProfile/ProfileDetails/ProfileDetails';
import AccountDetails from './components/UserProfile/AccountDetails/AccountDetails';
import MyContributions from './components/UserProfile/MyContributions/MyContributions';
import AddUpdateContribution from './components/AddUpdateContribution/AddUpdateContribution';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Welcome />,
      },
      {
        path: '/profile',
        element: <UserProfile />,
        children: [
          {
            index: true,
            // path: 'details',
            element: <ProfileDetails />,
          },
          {
            path: 'account',
            element: <AccountDetails />,
          },
          {
            path: 'contributions',
            element: <MyContributions />,
          },
        ],
      },
      {
        path: '/contributions/:id',
        element: <AddUpdateContribution />,
      },
      {
        path: '/reset/:id',
        element: <ResetPassword />,
      },
    ],
  },
]);

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  );
}
