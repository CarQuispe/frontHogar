// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * Componente que protege rutas que requieren autenticación.
 * 
 * Características:
 * - Verifica si el usuario está autenticado
 * - Verifica roles si se especifican
 * - Redirige a login si no está autenticado
 * - Muestra estado de carga durante verificación
 * - Guarda la ubicación original para redirección después del login
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [], 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, isLoading, user, hasAnyRole } = useAuth();
  const location = useLocation();

  // Mostrar loader mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    // Guardar la ubicación actual para redirigir después del login
    const from = location.pathname + location.search;
    return <Navigate to={`${redirectTo}?redirect=${encodeURIComponent(from)}`} replace />;
  }

  // Si se especifican roles y el usuario no tiene ninguno, redirigir
  if (requiredRoles.length > 0 && user && !hasAnyRole(requiredRoles)) {
    // Guardar el intento de acceso para auditoría
    console.warn(
      `Intento de acceso no autorizado: Usuario ${user.email} (rol: ${user.role}) ` +
      `intentó acceder a ruta que requiere roles: ${requiredRoles.join(', ')}`
    );

    // Mostrar página de acceso denegado
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 mb-6">
            <svg
              className="w-20 h-20 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Acceso Denegado
          </h1>
          
          <p className="text-gray-600 mb-6">
            No tienes permisos para acceder a esta sección.
          </p>
          
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-semibold">Tu rol actual:</span> {user.role}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Roles requeridos:</span> {requiredRoles.join(', ')}
            </p>
          </div>
          
          <div className="space-y-3">
            <a
              href="/dashboard"
              className="block w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver al Dashboard
            </a>
            
            <button
              onClick={() => window.history.back()}
              className="block w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Volver Atrás
            </button>
          </div>
          
          <p className="mt-6 text-sm text-gray-500">
            Si crees que esto es un error, contacta al administrador del sistema.
          </p>
        </div>
      </div>
    );
  }

  // Si pasa todas las verificaciones, renderizar children
  return <>{children}</>;
};

export default ProtectedRoute;