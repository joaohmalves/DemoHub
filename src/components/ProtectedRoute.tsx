import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/auth';

// Redirects to /login when there is no valid session, preserving the originally
// requested path via router state so LoginPage can send the user back after
// a successful login (deep-linking preserved, per spec section 5).
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
