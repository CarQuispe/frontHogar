// src/components/common/Layout.tsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/useAuth';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo y menú izquierdo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">
                  Sistema de Residencias
                </h1>
              </div>
              
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {/* Dashboard siempre visible */}
                <a
                  href="/dashboard"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </a>
                
                {/* Residentes (si tiene permiso) */}
                {permissions.canManageResidents && (
                  <a
                    href="/residentes"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Residentes
                  </a>
                )}
                
                {/* Usuarios (si es admin o directora) */}
                {permissions.canManageUsers && (
                  <a
                    href="/usuarios"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Usuarios
                  </a>
                )}
              </div>
            </div>

            {/* Menú derecho (usuario y logout) */}
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                {/* Información del usuario */}
                <div className="hidden md:block">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">
                        {user?.nombre || 'Usuario'}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user?.role?.toLowerCase() || 'Sin rol'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Enlace al perfil */}
                <a
                  href="/perfil"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Perfil
                </a>
                
                {/* Botón de logout */}
                <button
                  onClick={handleLogout}
                  className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;


