// src/services/api.ts
import axios from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

// URL base de tu API NestJS
const API_URL = import.meta.env.VITE_API_URL || 'https://backendhogar.onrender.com';

// Crear instancia de axios con configuración base
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Cambiar a true si usas cookies
});

// Interceptor para agregar token JWT automáticamente
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken') || 
                  sessionStorage.getItem('accessToken');
    
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Agregar timestamp para evitar cache solo en GET
    if (config.method?.toLowerCase() === 'get' && config.url && !config.url.includes('?')) {
      config.url = `${config.url}?_t=${Date.now()}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    
    // Si el error es 401 y no hemos intentado refrescar el token
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Intentar refrescar el token
        const refreshToken = localStorage.getItem('refreshToken') || 
                            sessionStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken
          });
          
          const { accessToken } = response.data;
          
          // Guardar nuevo token
          localStorage.setItem('accessToken', accessToken);
          
          // Reintentar la petición original
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error al refrescar token:', refreshError);
      }
      
      // Si no se pudo refrescar, redirigir a login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('user');
      
      // Redirigir a login solo si no estamos ya en esa página
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Manejo de otros errores comunes
    if (error.response) {
      switch (error.response.status) {
        case 403:
          console.error('Acceso denegado: No tienes permisos para esta acción');
          break;
        case 404:
          console.error('Recurso no encontrado');
          break;
        case 500:
          console.error('Error interno del servidor');
          break;
        case 429:
          console.error('Demasiadas peticiones. Por favor, espere un momento.');
          break;
      }
      
      // Extraer mensaje de error del servidor
      if (error.response.data) {
        const serverError = error.response.data as any;
        error.message = serverError.message || 
                        serverError.error || 
                        error.message;
      }
    } else if (error.request) {
      // Error de red o servidor no responde
      console.error('Error de red: No se pudo conectar con el servidor');
      error.message = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
    }
    
    return Promise.reject(error);
  }
);

// Tipos para los métodos de API
export interface ApiClient {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<T>;
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>;
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>;
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>;
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<T>;
}

// Métodos helper para tipos de datos comunes
export const apiClient: ApiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    api.get<T>(url, config).then(response => response.data),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.post<T>(url, data, config).then(response => response.data),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.put<T>(url, data, config).then(response => response.data),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.patch<T>(url, data, config).then(response => response.data),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
    api.delete<T>(url, config).then(response => response.data),
};

export default api;