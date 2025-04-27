import { useAuth } from './auth/AuthContext';
import { Navigate } from 'react-router-dom';
import React from 'react'; // Asegúrate de importar React

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};