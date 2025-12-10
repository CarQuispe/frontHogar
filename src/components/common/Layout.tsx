// src/components/common/Layout.tsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">Hogar de Niños</h1>
        <nav className="space-x-4">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/usuarios">Usuarios</Link>
          <Link to="/residentes">Residentes</Link>
          <Link to="/perfil">Perfil</Link>
        </nav>
      </header>

      <main className="flex-1 p-6">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white text-center p-4">
        Sistema Hogar de Niños - Todos los derechos reservados
      </footer>
    </div>
  );
};

export default Layout;



