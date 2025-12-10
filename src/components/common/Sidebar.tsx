// src/components/common/Sidebar.tsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';

// Iconos necesarios
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaUserCircle, 
  FaFileAlt,
  FaProjectDiagram,
  FaCalendarAlt,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
  FaCubes
} from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();  // 👈 SIN roles

  // 🔹 VERSIÓN BETA: TODAS LAS OPCIONES SON VISIBLES
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FaTachometerAlt },
    { name: 'Residentes', href: '/residentes', icon: FaUserCircle },
    { name: 'Usuarios', href: '/usuarios', icon: FaUsers },
    { name: 'SEDEPOS', href: '/sedepos', icon: FaFileAlt },
    { name: 'Proyectos', href: '/proyectos', icon: FaProjectDiagram },
    { name: 'Calendario', href: '/calendario', icon: FaCalendarAlt },
    { name: 'Reportes', href: '/reportes', icon: FaClipboardList },
    { name: 'Inventario', href: '/inventario', icon: FaCubes },
    { name: 'Configuración', href: '/configuracion', icon: FaCog },
  ];

  const handleNavigation = (path: string) => {
    localStorage.setItem('currentPage', path);
    
    if (path === '/dashboard') {
      window.location.href = '/';
    } else {
      alert(`Navegando a: ${path}\n(Implementa react-router-dom para enrutamiento real)`);
    }
  };

  const getActivePage = () => {
    return localStorage.getItem('currentPage') || '/dashboard';
  };

  return (
    <div className="w-64 bg-gradient-to-b from-blue-50 to-white shadow-xl h-screen sticky top-0 border-r border-gray-200">
      
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
            SE
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Santa Emilia</h1>
            <p className="text-xs text-gray-500 mt-1">Centro de Acogida</p>
          </div>
        </div>
        
        {/* Usuario */}
        <div className="mt-6 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'correo@demo.com'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menú */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Navegación
          </h3>
        </div>

        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.href)}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 mb-1 transition-all duration-200 ${
              getActivePage() === item.href
                ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <item.icon 
              className={`mr-3 text-lg ${
                getActivePage() === item.href ? 'text-white' : 'text-gray-400'
              }`}
            />
            {item.name}

            {getActivePage() === item.href && (
              <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow hover:shadow-md"
        >
          <FaSignOutAlt className="mr-2" />
          Cerrar Sesión
        </button>
        
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500">
            <span className="font-semibold">15</span> residentes activas
          </div>
          <div className="text-[10px] text-gray-400 mt-1">
            Sistema v1.0 • Hogar Santa Emilia
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


