import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/common/Layout';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import ResidentsPage from './pages/ResidentsPage';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Redirigir al dashboard desde la raíz */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Rutas internas */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="usuarios" element={<UsersPage />} />
        <Route path="residentes" element={<ResidentsPage />} />
        <Route path="perfil" element={<ProfilePage />} />
      </Route>

      {/* Ruta comodín 404: redirigir al dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;




