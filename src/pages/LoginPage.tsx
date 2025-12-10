import React from 'react';
import { useAuth, type UserRole } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth(); // usar login del contexto

  const handleLogin = () => {
    // Demo: iniciar sesión con datos de prueba
    const demoEmail = 'usuario@hogar.com';
    const demoRole: UserRole = 'DIRECTORA'; // puedes cambiar el rol para probar permisos
    const demoName = 'María Pérez';

    login(demoEmail, demoRole, demoName);
    // Esto automáticamente redirige al dashboard desde AuthContext
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <p className="mb-6 text-gray-600">Acceso de prueba sin contraseña</p>
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Aceptar e ir al Dashboard
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
