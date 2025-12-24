// src/services/auth.service.ts
import { apiClient } from './api';
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  User
} from '../types/auth.types';

class AuthService {
  private readonly baseUrl = '/auth';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(`${this.baseUrl}/login`, credentials);
      
      if (response.accessToken) {
        this.setAuthData(response);
      }
      
      return response;
    } catch (error: any) {
      console.error('Error en login:', error);
      
      // Manejo de errores específicos
      if (error.response?.status === 401) {
        throw new Error('Credenciales inválidas');
      } else if (error.response?.status === 400) {
        throw new Error('Datos de login inválidos');
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor');
      }
      
      throw new Error('Error al iniciar sesión');
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(`${this.baseUrl}/register`, data);
      
      if (response.accessToken) {
        this.setAuthData(response);
      }
      
      return response;
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      if (error.response?.status === 409) {
        throw new Error('El usuario ya existe');
      } else if (error.response?.status === 400) {
        throw new Error('Datos de registro inválidos');
      }
      
      throw new Error('Error al registrar usuario');
    }
  }

  async logout(): Promise<void> {
    try {
      // Llamar al endpoint de logout si existe
      await apiClient.post(`${this.baseUrl}/logout`);
    } catch (error) {
      console.warn('Error al cerrar sesión en el servidor:', error);
    } finally {
      this.clearAuth();
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No hay refresh token disponible');
      }
      
      const response = await apiClient.post<{ accessToken: string }>(
        `${this.baseUrl}/refresh-token`,
        { refreshToken }
      );
      
      localStorage.setItem('accessToken', response.accessToken);
      return response.accessToken;
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }

  setAuthData(data: AuthResponse): void {
    localStorage.setItem('accessToken', data.accessToken);
    
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  clearAuth(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.clear();
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Verificar si el token está próximo a expirar
  isTokenExpiringSoon(minutes: number = 5): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convertir a milisegundos
      const now = Date.now();
      const timeLeft = exp - now;
      
      return timeLeft < (minutes * 60 * 1000);
    } catch {
      return true;
    }
  }
}

export const authService = new AuthService();
export default authService;