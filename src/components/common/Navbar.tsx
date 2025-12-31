// src/components/common/Navbar.tsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, User, LogOut, Home, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { User as UserType } from '../../types/user.types';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsMenuOpen(false);
    }
  };

  // Si estamos en la página de login, no mostrar el navbar
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  // ✅ CORRECCIÓN: Función para obtener el nombre del usuario
  const getUserDisplayName = (user: UserType | null): string => {
    if (!user) return 'Usuario';
    
    // ✅ Backend devuelve 'name', no 'nombre'
    if (user.nombre) {
      // Si name contiene nombre y apellido juntos
      return user.nombre.trim();
    }
    
    // Fallback a email si no hay nombre
    return user.email?.split('@')[0] || 'Usuario';
  };

  // ✅ Obtener nombre para mostrar
  const userName = getUserDisplayName(user);
  const userRole = user?.role || 'Usuario';

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y navegación izquierda */}
          <div className="flex items-center">
            <button
              className="md:hidden p-2 rounded-md text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            <Link to="/" className="flex items-center ml-4 md:ml-0">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HSE</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900 hidden md:block">
                Hogar Santa Emilia
              </span>
              <span className="ml-3 text-xl font-semibold text-gray-900 md:hidden">
                HSE
              </span>
            </Link>

            {/* Navegación principal (desktop) - Solo mostrar si está autenticado */}
            {isAuthenticated && (
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link
                  to="/"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    location.pathname === '/'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <Home className="h-4 w-4 mr-1" />
                  Inicio
                </Link>
                <Link
                  to="/usuarios"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    location.pathname.startsWith('/usuarios')
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <Users className="h-4 w-4 mr-1" />
                  Usuarios
                </Link>
                <Link
                  to="/residentes"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    location.pathname.startsWith('/residentes')
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <Users className="h-4 w-4 mr-1" />
                  Residentes
                </Link>
              </div>
            )}
          </div>

          {/* Navegación derecha - Perfil de usuario */}
          {isAuthenticated && user && (
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Menú de usuario"
                  aria-expanded={isMenuOpen}
                >
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left hidden md:block">
                    {/* ✅ CORREGIDO: Usar userName (basado en user.name) */}
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500 capitalize">{userRole.toLowerCase()}</p>
                  </div>
                </button>

                {/* Dropdown menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                    <Link
                      to="/perfil"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Mi Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mostrar botón de login si no está autenticado */}
          {!isAuthenticated && location.pathname !== '/login' && (
            <div className="flex items-center">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Iniciar Sesión
              </Link>
            </div>
          )}
        </div>

        {/* Navegación móvil */}
        {isMenuOpen && (
          <div className="md:hidden border-t mt-2 pt-4 pb-3">
            {/* Solo mostrar enlaces si está autenticado */}
            {isAuthenticated && (
              <div className="space-y-1">
                <Link
                  to="/"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Home className="h-5 w-5 mr-3" />
                    Inicio
                  </div>
                </Link>
                <Link
                  to="/usuarios"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname.startsWith('/usuarios')
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3" />
                    Usuarios
                  </div>
                </Link>
                <Link
                  to="/residentes"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname.startsWith('/residentes')
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3" />
                    Residentes
                  </div>
                </Link>
                <Link
                  to="/perfil"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3" />
                    Mi Perfil
                  </div>
                </Link>
              </div>
            )}

            {/* Información del usuario en móvil */}
            {isAuthenticated && user && (
              <>
                <div className="pt-4 pb-3 border-t mt-3">
                  <div className="flex items-center px-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      {/* ✅ CORREGIDO: Usar userName (basado en user.name) */}
                      <p className="text-sm font-medium text-gray-900">{userName}</p>
                      <p className="text-xs text-gray-500 capitalize">{userRole.toLowerCase()}</p>
                    </div>
                  </div>
                </div>
                
                {/* Botón de logout en móvil */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 mt-2"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-3" />
                    Cerrar Sesión
                  </div>
                </button>
              </>
            )}

            {/* Mostrar enlace de login si no está autenticado */}
            {!isAuthenticated && (
              <div className="pt-4 border-t mt-3">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;