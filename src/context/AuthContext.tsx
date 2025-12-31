// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '../services/auth.service'; // ✅ Importación de tipos

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = authService.getStoredUser();
        
        if (storedUser && authService.isAuthenticated()) {
          setUser(storedUser);
        } else {
          authService.clearAuthData();
          setUser(null);
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        authService.clearAuthData();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const register = useCallback(async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Error al cerrar sesión en el servidor:', error);
    } finally {
      authService.clearAuthData();
      setUser(null);
      setError(null);
      navigate('/login', { replace: true });
      setIsLoading(false);
    }
  }, [navigate]);

  const clearError = useCallback(() => setError(null), []);

  const isAuthenticated = authService.isAuthenticated();

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};

// ✅ Exportar el AuthContext
export { AuthContext };