// src/types/auth.types.ts

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  apellido?: string;
  email: string;
  password: string;
  rut?: string;
  telefono?: string;
  role: UserRole;
  sedeId?: string;
}

export type UserRole = 
  | 'DIRECTORA'
  | 'PSICOLOGA'
  | 'TRABAJADORA_SOCIAL'
  | 'ADMIN'
  | 'VOLUNTARIO';

export interface User {
  id: string;
  nombre: string;
  apellido?: string;
  email: string;
  rut?: string;
  telefono?: string;
  role: UserRole;
  isActive: boolean;
  sedeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface DecodedToken {
  sub: string;
  email: string;
  role: UserRole;
  exp: number;
  iat: number;
  nombre?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: AuthResponse;
}