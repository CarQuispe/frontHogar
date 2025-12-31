// apps/frontend/src/App.tsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/common/Layout';

// 📌 PÁGINAS EXISTENTES (asegúrate de que existen)
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import ResidentsPage from './pages/ResidentsPage';
import ProfilePage from './pages/ProfilePage';

// 📌 UTILIDADES (asegúrate de que existen)
import { initializeAppWithConnectionCheck } from './utils/testConnection';
// import ConnectionStatusBadge from './components/common/ConnectionStatusBadge'; // 🔴 Comenta si no existe

// 📌 CONSTANTES
import { ROUTES } from './utils/constants';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [connectionOk, setConnectionOk] = useState<boolean | null>(null);
  const [showConnectionWarning, setShowConnectionWarning] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      console.log('🚀 Iniciando aplicación...');
      
      try {
        // Verificar conexión con backend (si la función existe)
        const isConnected = await initializeAppWithConnectionCheck();
        setConnectionOk(isConnected);
        
        if (!isConnected) {
          setShowConnectionWarning(true);
          setTimeout(() => setShowConnectionWarning(false), 10000);
        }
      } catch (error) {
        console.warn('⚠️ No se pudo verificar la conexión:', error);
        setConnectionOk(false);
        setShowConnectionWarning(true);
      }
      
      setIsInitialized(true);
    };
    
    initApp();
  }, []);

  // Pantalla de carga inicial
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-lg font-medium text-gray-900">Iniciando aplicación</h2>
          <p className="text-gray-600 mt-2">Cargando sistema de gestión...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      {/* Banner de advertencia de conexión */}
      {showConnectionWarning && (
        <div className="bg-red-50 border-b border-red-200 p-3 text-center">
          <p className="text-red-800 text-sm">
            ⚠️ Advertencia: Problemas de conexión con el servidor. Algunas funciones pueden no estar disponibles.
          </p>
        </div>
      )}
      
      {/* Contenido principal */}
      <Routes>
        {/* Ruta pública - Login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Ruta protegida principal con Layout */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          {/* Redirigir al dashboard desde la raíz */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Dashboard - Accesible para todos los roles autenticados */}
          <Route 
            path="dashboard" 
            element={<DashboardPage />} 
          />
          
          {/* Usuarios - Solo para admin y directora */}
          <Route 
            path="usuarios" 
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'DIRECTORA']}>
                <UsersPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Residentes - Para roles específicos */}
          <Route 
            path="residentes" 
            element={
              <ProtectedRoute requiredRoles={['DIRECTORA', 'ADMIN', 'PSICOLOGA', 'TRABAJADORA_SOCIAL']}>
                <ResidentsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Perfil - Para todos los usuarios autenticados */}
          <Route 
            path="perfil" 
            element={<ProfilePage />} 
          />
          
          {/* 📌 SEDES (COMENTADO HASTA QUE CREES LA PÁGINA) */}
          {/* 
          <Route 
            path="sedes" 
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'DIRECTORA']}>
                <SedesPage />
              </ProtectedRoute>
            } 
          />
          */}
          
          {/* 📌 REPORTES (COMENTADO HASTA QUE CREES LA PÁGINA) */}
          {/* 
          <Route 
            path="reportes" 
            element={
              <ProtectedRoute requiredRoles={['DIRECTORA', 'ADMIN', 'PSICOLOGA', 'TRABAJADORA_SOCIAL']}>
                <ReportsPage />
              </ProtectedRoute>
            } 
          />
          */}
          
          {/* 📌 CONFIGURACIÓN (COMENTADO HASTA QUE CREES LA PÁGINA) */}
          {/* 
          <Route 
            path="configuracion" 
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'DIRECTORA']}>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          */}
        </Route>
        
        {/* Ruta comodín 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;