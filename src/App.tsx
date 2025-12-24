// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/common/Layout';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import ResidentsPage from './pages/ResidentsPage';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
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
          </Route>
          
          {/* Ruta comodín 404 */}
         
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;



