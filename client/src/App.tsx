import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

import '@mantine/core/styles.css';
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
      <ModalsProvider>
        <RouterProvider router={router} />
      </ModalsProvider>
    </MantineProvider>
  );
}
