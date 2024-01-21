import { MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { theme } from './theme';
import Root from './routes/root';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <div>Home</div>,
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
