import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/root';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
