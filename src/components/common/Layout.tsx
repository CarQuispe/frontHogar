import React, { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/useAuth';
import { ROUTES, USER_ROLES } from '../../utils/constants';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const permissions = usePermissions();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Determinar el color según el rol
  const getRoleColor = (role: string) => {
    switch (role) {
      case USER_ROLES.DIRECTORA:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case USER_ROLES.ADMIN:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case USER_ROLES.PSICOLOGA:
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case USER_ROLES.TRABAJADORA_SOCIAL:
        return 'bg-green-100 text-green-800 border-green-200';
      case USER_ROLES.VOLUNTARIO:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const roleColor = user?.role ? getRoleColor(user.role) : 'bg-gray-100 text-gray-800 border-gray-200';

  // Navegación principal
  const navigationItems = [
    {
      name: 'Dashboard',
      path: ROUTES.DASHBOARD,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      visible: true,
    },
    {
      name: 'Residentes',
      path: ROUTES.RESIDENTS,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 1.198a6 6 0 00-9-5.197" />
        </svg>
      ),
      visible: permissions.canManageResidents,
    },
    {
      name: 'Usuarios',
      path: ROUTES.USERS,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 1.198a6 6 0 00-9-5.197" />
        </svg>
      ),
      visible: permissions.canManageUsers,
    },
    {
      name: 'Sedes',
      path: ROUTES.SEDES,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      visible: permissions.canManageUsers, // Mismo permiso que usuarios
    },
    {
      name: 'Reportes',
      path: ROUTES.REPORTS,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      visible: permissions.canManageResidents, // Mismo permiso que residentes
    },
    {
      name: 'Configuración',
      path: ROUTES.SETTINGS,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      visible: permissions.canManageUsers, // Mismo permiso que usuarios
    },
  ];

  // Filtrar elementos visibles
  const visibleNavigationItems = navigationItems.filter(item => item.visible);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar para desktop */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col ${sidebarOpen ? '' : 'lg:w-20'}`}>
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold">🏠</span>
              </div>
              {sidebarOpen && (
                <h1 className="ml-3 text-lg font-semibold text-gray-900">
                  Sistema Residencias
                </h1>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="ml-auto p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Navegación */}
          <nav className="mt-8 flex-1 flex flex-col px-2 space-y-1">
            {visibleNavigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  } ${!sidebarOpen ? 'justify-center' : ''}`
                }
              >
                <div className="flex items-center">
                  {item.icon}
                  {sidebarOpen && (
                    <span className="ml-3">{item.name}</span>
                  )}
                </div>
              </NavLink>
            ))}
          </nav>

          {/* Información del usuario en sidebar */}
          {sidebarOpen && user && (
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <p className={`text-xs px-2 py-1 rounded-full border ${roleColor}`}>
                    {user.role?.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className={`flex flex-col min-h-screen ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}>
        {/* Top navbar para mobile */}
        <div className="sticky top-0 z-10 lg:hidden flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Abrir sidebar</span>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <h1 className="text-lg font-semibold text-gray-900 self-center">
                Sistema Residencias
              </h1>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              {/* Perfil dropdown mobile */}
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                    <p className={`text-xs px-2 py-1 rounded-full border ${roleColor}`}>
                      {user?.role?.toLowerCase()}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                  >
                    Salir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menú</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <nav className="px-2 py-4 space-y-1">
                {visibleNavigationItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className="w-full group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <div className="mr-3">
                      {item.icon}
                    </div>
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
            
            {user && (
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{user.name}</p>
                    <p className={`text-xs px-2 py-1 rounded-full border ${roleColor} inline-block mt-1`}>
                      {user.role?.toLowerCase()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => handleNavigation(ROUTES.PROFILE)}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Mi Perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-700 hover:bg-red-50 rounded-md"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header del contenido */}
              <div className="md:flex md:items-center md:justify-between mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                    {window.location.pathname.includes('dashboard') && 'Dashboard'}
                    {window.location.pathname.includes('residentes') && 'Residentes'}
                    {window.location.pathname.includes('usuarios') && 'Usuarios'}
                    {window.location.pathname.includes('sedes') && 'Sedes'}
                    {window.location.pathname.includes('reportes') && 'Reportes'}
                    {window.location.pathname.includes('configuracion') && 'Configuración'}
                    {window.location.pathname.includes('perfil') && 'Mi Perfil'}
                  </h2>
                  {user && (
                    <p className="mt-1 text-sm text-gray-500">
                      Bienvenido/a, {user.name}. Rol: <span className="font-medium">{user.role?.toLowerCase()}</span>
                    </p>
                  )}
                </div>
                
                {/* Botón de logout para desktop */}
                <div className="hidden lg:flex mt-4 md:mt-0 md:ml-4">
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
              
              {/* Contenido de la página */}
              <div className="bg-white shadow-sm rounded-lg">
                <Outlet />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Sistema de Gestión de Residencias. Todos los derechos reservados.
              </p>
              <div className="mt-2 md:mt-0">
                <p className="text-sm text-gray-500">
                  Usuario: <span className="font-medium">{user?.name}</span> • 
                  Rol: <span className={`px-2 py-1 rounded-full text-xs border ${roleColor}`}>
                    {user?.role?.toLowerCase()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;