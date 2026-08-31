import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';

export function AdminRoute({
  children,
}: {
  children: ReactNode;
}) {
  const location = useLocation();

  const {
    user,
    loading,
    error,
  } = useCurrentUser();

  // Enquanto verifica o usuário
  if (loading) {
    return <p>Verificando permissões...</p>;
  }

  // Erro ou usuário inexistente
  if (error || !user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Usuário autenticado, mas não é admin
  if (user.role?.name !== 'admin') {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <>{children}</>;
}