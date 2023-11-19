import { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { verifyToken } from '../../services/auth-service';
import LoadingPage from 'src/pages/loading';

const AuthenticatedRoute = ({ children, reverse }) => {
  const [isAuth, setIsAuth] = useState(null);

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

  if (isAuth === null) {
    return <LoadingPage />;
  }

  if (!isAuth && !reverse) {
    return <Navigate to="/login" />;
  }

  if (isAuth && reverse) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthenticatedRoute;
