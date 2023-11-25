import { lazy, Suspense } from 'react';
import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import AuthenticatedRoute from './components/authenticated-route';
import DeviceDetailPage from 'src/sections/device/view/device-detail-view';

export const LoadingPage = lazy(() => import('src/pages/loading'));
export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const DevicePage = lazy(() => import('src/pages/device'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const routes = createBrowserRouter([
  {
    element: (
      <AuthenticatedRoute>
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthenticatedRoute>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'device', element: <DevicePage /> },
      { path: 'device/:id', element: <DeviceDetailPage /> },
    ],
  },
  {
    path: 'login',
    element: (
      <AuthenticatedRoute reverse={true}>
        <LoginPage />
      </AuthenticatedRoute>
    ),
  },
  {
    path: '404',
    element: <Page404 />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]);

export default routes;
