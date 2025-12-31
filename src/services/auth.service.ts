// apps/frontend/src/services/auth.service.ts
import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/constants';
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string; // ✅ Siempre 'name', no 'nombre'
  email: string;
  password: string;
  confirmPassword?: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string; // ✅ Opcional - backend puede no enviarlo
  user: {
    id: string;
    name: string; // ✅ Siempre 'name'
    email: string;
    role?: string;
  };
}

export interface User {
  id: string;
  name: string; // ✅ Campo unificado
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

class AuthService {
  // ✅ Login simplificado y robusto
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 Intentando login en:', API_ENDPOINTS.AUTH.LOGIN);
      
      const response = await apiClient.post<any>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      console.log('✅ Respuesta del login:', response);

      // ✅ Determinar estructura de respuesta
      let authData: AuthResponse;

      if (response.accessToken) {
        // Estructura directa: { accessToken, user }
        authData = {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: response.user
        };
      } else if (response.token) {
        // Backend usa 'token' en lugar de 'accessToken'
        authData = {
          accessToken: response.token,
          refreshToken: response.refreshToken,
          user: response.user
        };
      } else if (response.data?.accessToken) {
        // Respuesta anidada en 'data'
        authData = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          user: response.data.user
        };
      } else {
        console.error(' Formato de respuesta no reconocido:', response);
        throw new Error('Formato de respuesta del servidor no válido');
      }

      // ✅ Validar que tenemos datos mínimos
      if (!authData.accessToken || !authData.user) {
        throw new Error('Datos de autenticación incompletos');
      }

      // ✅ Guardar datos
      this.setAuthData(authData, credentials.rememberMe);

      return authData;

    } catch (error: any) {
      console.error('❌ Error en login:', error);

      // ✅ Manejo específico de errores HTTP
      if (error.response?.status === 401) {
        throw new Error('Credenciales inválidas');
      } else if (error.response?.status === 404) {
        throw new Error('Endpoint de login no encontrado. Verifica la configuración');
      } else if (error.response?.status === 400) {
        const serverMessage = error.response?.data?.message || 
                             error.response?.data?.error;
        throw new Error(serverMessage || 'Datos de login inválidos');
      } else if (!error.response) {
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
      }

      // ✅ Error genérico con mensaje del servidor si existe
      const serverMessage = error.response?.data?.message;
      throw new Error(serverMessage || 'Error al iniciar sesión');
    }
  }

  // ✅ Registro
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Remover confirmPassword si existe
      const { confirmPassword, ...data } = userData;

      console.log('📝 Enviando registro:', data);

      const response = await apiClient.post<any>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      );

      console.log('✅ Respuesta del registro:', response);

      // ✅ Misma lógica de parsing que en login
      let authData: AuthResponse;

      if (response.accessToken) {
        authData = {
          accessToken: response.accessToken,
          user: response.user
        };
      } else if (response.token) {
        authData = {
          accessToken: response.token,
          user: response.user
        };
      } else if (response.data?.accessToken) {
        authData = {
          accessToken: response.data.accessToken,
          user: response.data.user
        };
      } else {
        // Registro sin auto-login (común en verificación por email)
        throw new Error('Por favor, verifica tu email para activar la cuenta');
      }

      // ✅ Guardar datos si hay token
      if (authData.accessToken) {
        this.setAuthData(authData, true);
      }

      return authData;

    } catch (error: any) {
      console.error('❌ Error en registro:', error);

      if (error.response?.status === 409) {
        throw new Error('El email ya está registrado');
      } else if (error.response?.status === 400) {
        const serverMessage = error.response?.data?.message;
        throw new Error(serverMessage || 'Datos de registro inválidos');
      }

      throw new Error(error.message || 'Error al registrarse');
    }
  }

  // ✅ Obtener información del usuario actual
  async getCurrentUser(): Promise<User> {
    try {
      // ✅ Solo si tenemos token
      if (!this.isAuthenticated()) {
        throw new Error('No autenticado');
      }

      return await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
    } catch (error: any) {
      console.error('❌ Error al obtener usuario:', error);
      
      if (error.response?.status === 401) {
        this.clearAuthData();
        throw new Error('Sesión expirada');
      }
      
      throw new Error('Error al obtener información del usuario');
    }
  }

  // ✅ Cerrar sesión
  async logout(): Promise<void> {
    try {
      // ✅ Solo intentar si el endpoint existe
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      console.log('✅ Logout exitoso en servidor');
    } catch (error) {
      // ✅ No es crítico si falla - logout local es suficiente
      console.warn('⚠️ Logout en servidor falló (puede ser normal si no existe endpoint):', error);
    } finally {
      this.clearAuthData();
    }
  }

  // ✅ CORRECCIÓN: Sin refresh token por ahora
  // async refreshToken(): Promise<string> { ... } // ❌ Comentado - no implementado en backend

  // ✅ Guardar datos de autenticación
  private setAuthData(data: AuthResponse, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;

    // ✅ Guardar accessToken
    storage.setItem('accessToken', data.accessToken);

    // ✅ Guardar refreshToken si existe (opcional)
    if (data.refreshToken) {
      storage.setItem('refreshToken', data.refreshToken);
    }

    // ✅ Guardar usuario
    storage.setItem('user', JSON.stringify(data.user));

    console.log('💾 Datos guardados en:', rememberMe ? 'localStorage' : 'sessionStorage');
  }

  // ✅ Limpiar datos de autenticación
  clearAuthData(): void {
    ['accessToken', 'refreshToken', 'user'].forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    console.log('🧹 Datos de autenticación limpiados');
  }

  // ✅ Obtener usuario del almacenamiento
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (!userStr) return null;

    try {
      const user = JSON.parse(userStr);
      
      // ✅ Validar estructura básica
      if (user && typeof user === 'object' && user.id && user.name && user.email) {
        return user;
      }
      
      console.warn('⚠️ Usuario en storage con estructura inválida:', user);
      return null;
    } catch (error) {
      console.error('❌ Error al parsear usuario:', error);
      return null;
    }
  }

  // ✅ Obtener token del almacenamiento
  getStoredToken(): string | null {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  }

  // ✅ Verificar si el usuario está autenticado (basado en token)
  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    return !!token; // ✅ Simple y efectivo
  }

  // ✅ Verificar token próximo a expirar (opcional)
  isTokenExpiringSoon(minutes: number = 30): boolean {
    const token = this.getStoredToken();
    
    if (!token) return true;
    
    try {
      // Decodificar JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // milisegundos
      const now = Date.now();
      const timeLeft = exp - now;
      
      return timeLeft < (minutes * 60 * 1000);
    } catch (error) {
      console.warn('⚠️ Error al decodificar token:', error);
      return false; // ✅ No expirar automáticamente si hay error
    }
  }
}

// ✅ Exportar instancia única
export const authService = new AuthService();
export default authService;
