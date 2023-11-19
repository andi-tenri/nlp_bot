import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import { verifyToken } from 'src/services/auth-service';

export const LoadingPage = lazy(() => import('src/pages/loading'));
export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const AuthenticatedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  const location = useLocation();

  const checkAuthentication = async (props) => {
    const authenticated = await verifyToken();

    if (!authenticated) {
      setIsAuth(false);
      return;
    }

    setIsAuth(true);
  };

  useEffect(() => {
    checkAuthentication();
  }, [location]);

  if (isAuth === null) {
    return <LoadingPage />;
  }

  if (!isAuth && !props.reverse) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default function Router() {
  const routes = useRoutes([
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
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
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

  return routes;
}
