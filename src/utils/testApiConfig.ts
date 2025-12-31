// src/utils/testApiConfig.ts
import { API_CONFIG, API_ENDPOINTS } from './constants';

export const testApiConfiguration = () => {
  console.log('🔧 Configuración de API:');
  console.log('Base URL:', API_CONFIG.BASE_URL);
  console.log('');
  
  console.log('📡 Endpoints de ejemplo (rutas finales):');
  console.log('Login:', API_CONFIG.BASE_URL + API_ENDPOINTS.AUTH.LOGIN);
  console.log('Users:', API_CONFIG.BASE_URL + API_ENDPOINTS.USERS.BASE);
  console.log('Residents:', API_CONFIG.BASE_URL + API_ENDPOINTS.RESIDENTS.BASE);
  console.log('');
  
  // Verificar que el formato sea correcto
  const hasApiPrefix = API_CONFIG.BASE_URL.endsWith('/api');
  console.log(hasApiPrefix ? '✅ BaseURL termina con /api' : '❌ BaseURL NO termina con /api');
  
  return hasApiPrefix;
};

// Llamar en tu App.tsx
// testApiConfiguration();