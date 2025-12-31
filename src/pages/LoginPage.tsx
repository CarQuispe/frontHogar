// src/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');

  const { login, register, isLoading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Manejar envío de formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      if (isRegistering) {
        if (password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres');
        await register({ name, email, password });
      } else {
        await login({ email, password, rememberMe });
      }
    } catch (err) {
      console.log('Error capturado en LoginPage:', err);
    }
  };

  // Función de test de conexión al backend
  const testConnection = async () => {
    try {
      const response = await fetch('https://backendhogar.onrender.com/health');
      const data = await response.text();
      alert(`✅ Conexión exitosa: ${data}`);
    } catch (err) {
      alert(`❌ Error de conexión: ${err}`);
    }
  };

  // Detectar si estamos en desarrollo
  const isDev = import.meta.env.MODE === 'development';

  return (
    <div style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '30px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
      </h2>

      {error && (
        <div style={{
          color: '#d32f2f',
          backgroundColor: '#ffebee',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #ef9a9a'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="Tu nombre completo"
            />
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="ejemplo@email.com"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="••••••••"
          />
          {isRegistering && (
            <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
              Mínimo 6 caracteres
            </small>
          )}
        </div>

        {!isRegistering && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                style={{ marginRight: '8px' }}
              />
              Recordar sesión
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isLoading ? '#ccc' : '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s'
          }}
        >
          {isLoading ? 'Procesando...' : (isRegistering ? 'Registrarse' : 'Iniciar Sesión')}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => { setIsRegistering(!isRegistering); clearError(); }}
          disabled={isLoading}
          style={{
            background: 'none',
            border: 'none',
            color: '#1976d2',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '14px'
          }}
        >
          {isRegistering 
            ? '¿Ya tienes cuenta? Inicia sesión' 
            : '¿No tienes cuenta? Regístrate aquí'}
        </button>
      </div>

      {/* Botón de debug solo en desarrollo */}
      {isDev && (
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button
            onClick={testConnection}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔧 Probar conexión al backend
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
