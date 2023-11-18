import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import { verifyToken } from 'src/services/auth-service';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const AuthFallback = () => <Navigate to="/login" />;

export default function Router() {
  const [isAuth, setIsAuth] = useState(false);

  const location = useLocation();

  const checkAuthentication = async () => {
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

  const routes = useRoutes([
    {
      action: () => {
        console.log("SUUUUU")
      },
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
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
      element: isAuth ? <Navigate to="/" /> : <LoginPage />,
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
