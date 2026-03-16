import { Navigate, Outlet } from 'react-router-dom';

function hasAccessToken(): boolean {
  return Boolean(window.localStorage.getItem('sctec.accessToken'));
}

export function AuthGuard() {
  if (!hasAccessToken()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
