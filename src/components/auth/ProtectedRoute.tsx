// src/components/auth/ProtectedRoute.tsx
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode; // <-- aquí usamos React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Acceso libre demo
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <div>No autorizado</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;



