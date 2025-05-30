
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { currentUser } = useAppContext();

  // Se não há usuário logado, redireciona para login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Se requer admin e o usuário não é admin, redireciona para home
  if (requireAdmin && currentUser.id !== 'user-1') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
