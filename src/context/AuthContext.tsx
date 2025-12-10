// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// -----------------------------
// Tipos
// -----------------------------
export type UserRole =
  | 'DIRECTORA'
  | 'PSICOLOGA'
  | 'TRABAJADORA_SOCIAL'
  | 'ADMIN'
  | 'VOLUNTARIO';

export interface User {
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user?: User;
  login: (email: string, role: UserRole, name: string) => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

// -----------------------------
// Contexto
// -----------------------------
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  hasRole: () => false,
});

// -----------------------------
// Provider
// -----------------------------
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Login
  const login = (email: string, role: UserRole, name: string) => {
    setIsAuthenticated(true);
    setUser({ email, role, name });
    navigate('/dashboard');
  };

  // Logout
  const logout = () => {
    setIsAuthenticated(false);
    setUser(undefined);
    navigate('/login');
  };

  // Verificar rol
  const hasRole = (role: UserRole) => user?.role === role;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// -----------------------------
// Hook para usar contexto
// -----------------------------
export const useAuth = () => useContext(AuthContext);



