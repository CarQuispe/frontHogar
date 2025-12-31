// apps/frontend/src/services/api.ts
import axios from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG } from '../utils/constants';

// ===============================
// Instancia base
// ===============================
const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('accessToken');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🔹 Evitar cache SOLO en GET
    if (config.method?.toLowerCase() === 'get' && config.url) {
      const hasQuery = config.url.includes('?');
      const separator = hasQuery ? '&' : '?';
      config.url = `${config.url}${separator}_=${Date.now()}`;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

// ===============================
// RESPONSE INTERCEPTOR
// ===============================
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { 
      _retry?: boolean 
    };
    
    // 🔹 Manejo de error 401 (No autorizado)
    if (error.response?.status === 401 && !originalRequest?._retry) {
      console.warn('🔒 Token inválido o expirado');
      clearAuthData();
      
      if (!window.location.pathname.includes('/login')) {
        const currentPath = window.location.pathname + window.location.search;
        sessionStorage.setItem('redirectAfterLogin', currentPath);
        window.location.href = '/login';
      }
    }

    // 🔹 Manejar otros errores
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;
      
      console.error(`❌ Error ${status} en ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, 
        data?.message || 'Sin mensaje');
      
    } else if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Timeout: La petición tardó demasiado');
      
          
    } else {
      console.error('⚙️ Error en configuración:', error.message);
    }

    return Promise.reject(error);
  }
);

// ===============================
// Helpers
// ===============================
function clearAuthData(): void {
  const authKeys = ['accessToken', 'refreshToken', 'user', 'userRole'];
  authKeys.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
  console.log('🔓 Datos de autenticación limpiados');
}

// ===============================
// FUNCIÓN DE PRUEBA DE CONEXIÓN
// ===============================
export const testBackendConnection = async (): Promise<{
  success: boolean;
  message: string;
  data?: any;
  status?: number;
  url?: string;
}> => {
  const testUrl = '/auth/health'; // Endpoint de health check
  const fullUrl = api.defaults.baseURL + testUrl;
  
  console.log('🔍 Probando conexión con backend...');
  console.log('BaseURL configurada:', api.defaults.baseURL);
  console.log('URL completa a probar:', fullUrl);
  
  try {
    const startTime = Date.now();
    const response = await api.get(testUrl, { 
      timeout: 10000 // 10 segundos para la prueba
    });
    const endTime = Date.now();
    
    console.log(`✅ Backend conectado correctamente`);
    console.log(`⏱️  Tiempo de respuesta: ${endTime - startTime}ms`);
    console.log(`📊 Status: ${response.status}`);
    console.log(`📦 Datos:`, response.data);
    
    return {
      success: true,
      message: 'Backend conectado correctamente',
      data: response.data,
      status: response.status,
      url: fullUrl
    };
    
  } catch (error: any) {
    console.error('❌ Error conectando al backend:');
    console.error('URL intentada:', fullUrl);
    
    let errorMessage = 'Error desconocido';
    let status = 0;
    
    if (error.response) {
      status = error.response.status;
      errorMessage = `El backend respondió con error ${status}`;
      console.error('Status:', status);
      console.error('Data:', error.response.data);
      
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Timeout: El backend no respondió en 10 segundos';
      console.error('⚠️  Timeout - ¿Está corriendo el backend?');
      console.error('Verifica que el servidor esté levantado en:', api.defaults.baseURL?.replace('/api', ''));
      
    } else if (error.request) {
      errorMessage = 'No hay respuesta del servidor';
      console.error('⚠️  Sin respuesta - Verifica:');
      console.error('1. ¿El backend está corriendo?');
      console.error('2. ¿El puerto 3000 está libre?');
      console.error('3. ¿Hay un firewall bloqueando?');
      
    } else {
      errorMessage = error.message;
      console.error('Error:', error.message);
    }
    
    // Sugerencias de solución
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Ejecuta el backend: npm run start:dev');
    console.log('2. Verifica que el backend esté en http://localhost:3000');
    console.log('3. Prueba manualmente: curl http://localhost:3000/api/auth/health');
    console.log('4. Revisa que no haya errores en la consola del backend');
    
    return {
      success: false,
      message: errorMessage,
      status: status,
      url: fullUrl
    };
  }
};

// ===============================
// API CLIENT TIPADO
// ===============================
export interface ApiClient {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

export const apiClient: ApiClient = {
  get: (url, config) => api.get(url, config).then(r => r.data),
  post: (url, data, config) => api.post(url, data, config).then(r => r.data),
  put: (url, data, config) => api.put(url, data, config).then(r => r.data),
  patch: (url, data, config) => api.patch(url, data, config).then(r => r.data),
  delete: (url, config) => api.delete(url, config).then(r => r.data),
};

// ===============================
// Exportaciones
// ===============================
export default api;