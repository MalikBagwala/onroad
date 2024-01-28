import { MantineProvider } from '@mantine/core';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AddUpdateContribution from './components/AddUpdateContribution/AddUpdateContribution';
import { HomePageHero } from './components/HomePageHero/HomePageHero';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import ResetPassword from './components/ResetPassword/ResetPassword';
import AccountDetails from './components/UserProfile/AccountDetails/AccountDetails';
import MyContributions from './components/UserProfile/MyContributions/MyContributions';
import ProfileDetails from './components/UserProfile/ProfileDetails/ProfileDetails';
import UserProfile from './components/UserProfile/UserProfile';
import Root from './routes/root';
import './styles/index.css';
import { theme } from './theme';
import ContributionsList from './components/ContributionsList/ContributionsList';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePageHero />,
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
        path: '/contributions',
        element: <ContributionsList />,
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
