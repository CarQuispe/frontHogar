// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import type { 
  User, 
  UserRole, 
  LoginCredentials, 
  RegisterData 
} from '../types/auth.types';

// -----------------------------
// Tipos
// -----------------------------
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginDemo: (role: UserRole) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  clearError: () => void;
  refreshToken: () => Promise<void>;
}

// -----------------------------
// Contexto
// -----------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// -----------------------------
// Provider
// -----------------------------
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const storedUser = authService.getCurrentUser();
        const hasToken = authService.isAuthenticated();

        if (storedUser && hasToken) {
          setUser(storedUser);
          
          // Verificar si el token necesita refrescarse
          if (authService.isTokenExpiringSoon(10)) { // 10 minutos antes de expirar
            try {
              await authService.refreshToken();
              const refreshedUser = authService.getCurrentUser();
              if (refreshedUser) {
                setUser(refreshedUser);
              }
            } catch (refreshError) {
              console.warn('No se pudo refrescar el token:', refreshError);
              await handleLogout();
            }
          }
        }
      } catch (err) {
        console.error('Error cargando usuario:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Interceptor para manejar tokens expirados durante peticiones
  useEffect(() => {
    const handleTokenExpired = () => {
      if (user && !authService.isAuthenticated()) {
        handleLogout();
      }
    };

    // Escuchar eventos de storage para sincronización entre pestañas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' && !e.newValue) {
        handleLogout();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleTokenExpired, 60000); // Verificar cada minuto

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [user]);

  // Login con credenciales reales
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Error al iniciar sesión';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Login demo para desarrollo
  const loginDemo = async (role: UserRole = 'DIRECTORA') => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Datos de usuario demo
      const demoUser: User = {
        id: 'demo-id',
        nombre: 'Usuario Demo',
        email: `demo-${role.toLowerCase()}@residencia.com`,
        role,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Token demo (NO usar en producción)
      const demoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLWlkIiwiZW1haWwiOiJkZW1vQHJlc2lkZW5jaWEuY29tIiwicm9sZSI6IkRJUkVDVE9SQSIsIm5vbWJyZSI6IlVzdWFyaW8gRGVtbyIsImlhdCI6MTcxMzg5NjQwMCwiZXhwIjoxNzQ1NDMyNDAwfQ.fake-token-for-demo-only';
      
      // Guardar datos demo
      localStorage.setItem('accessToken', demoToken);
      localStorage.setItem('user', JSON.stringify(demoUser));
      
      setUser(demoUser);
      navigate('/dashboard');
    } catch (err) {
      setError('Error en login demo');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Registro
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(data);
      setUser(response.user);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Error al registrar usuario';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      await authService.logout();
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      // Limpiar local storage aunque falle
      authService.clearAuth();
      setUser(null);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar rol específico
  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  // Verificar múltiples roles
  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => user?.role === role);
  };

  // Limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Refrescar token manualmente
  const refreshToken = async () => {
    try {
      await authService.refreshToken();
      const refreshedUser = authService.getCurrentUser();
      if (refreshedUser) {
        setUser(refreshedUser);
      }
    } catch (err) {
      console.error('Error al refrescar token:', err);
      await handleLogout();
    }
  };

  const value: AuthContextType = {
    isAuthenticated: !!user && authService.isAuthenticated(),
    user,
    isLoading,
    error,
    login,
    loginDemo,
    register,
    logout: handleLogout,
    hasRole,
    hasAnyRole,
    clearError,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// EXPORTA EL CONTEXTO PARA QUE useAuth.ts PUEDA IMPORTARLO
export { AuthContext };

// -----------------------------
// Hook para usar contexto
// -----------------------------
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};