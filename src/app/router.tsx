import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthGuard } from './auth-guard';
import { LoginPage } from '../pages/login/login-page';
import { EnterprisesDashboardPage } from '../pages/dashboard/enterprises-dashboard-page';
import { getAccessToken, setAuthUser, clearAuthSession } from '../services/auth-session';
import { me } from '../services/api/auth-api';

function hasAccessToken(): boolean {
  return Boolean(getAccessToken());
}

function LoginRoute() {
  const navigate = useNavigate();

  if (hasAccessToken()) {
    return <Navigate to="/dashboard/segments" replace />;
  }

  return <LoginPage onSuccess={() => navigate('/dashboard/segments', { replace: true })} />;
}

function DashboardRoute() {
  const navigate = useNavigate();
  const { module } = useParams();
  const [isReady, setIsReady] = useState(false);

  const activeModule = module === 'segments' ? 'segments' : 'companies';

  const token = getAccessToken();

  useEffect(() => {
    if (!token) {
      setIsReady(false);
      return;
    }

    let active = true;

    void me(token)
      .then((user) => {
        if (!active) {
          return;
        }

        setAuthUser(user);
        setIsReady(true);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        clearAuthSession();
        navigate('/login', { replace: true });
      });

    return () => {
      active = false;
    };
  }, [token, navigate]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!isReady) {
    return null;
  }

  return (
    <EnterprisesDashboardPage
      activeModule={activeModule}
      onChangeModule={(nextModule) => {
        navigate(`/dashboard/${nextModule}`, { replace: true });
      }}
    />
  );
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginRoute />,
  },
  {
    element: <AuthGuard />,
    children: [
      {
        path: '/dashboard/:module',
        element: <DashboardRoute />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard/segments" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
