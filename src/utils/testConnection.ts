// apps/frontend/src/utils/testConnection.ts

import { testBackendConnection } from '../services/api';


/**
 * Función para inicializar y verificar la conexión con el backend
 * Útil para llamar al inicio de la aplicación
 */
export const initializeAppWithConnectionCheck = async (): Promise<boolean> => {
  console.log('🚀 Inicializando aplicación con verificación de conexión...');
  
  const result = await testBackendConnection();
  
  if (result.success) {
    console.log('✅ Aplicación lista para usar');
    console.log(`📍 Backend en: ${result.url}`);
    return true;
  } else {
    console.warn('⚠️  Aplicación cargada pero sin conexión al backend');
    console.warn(`❌ Error: ${result.message}`);
    
    // Puedes mostrar una notificación al usuario
    showConnectionWarning(result.message);
    return false;
  }
};

/**
 * Muestra una advertencia al usuario sobre problemas de conexión
 */
const showConnectionWarning = (message: string): void => {
  // Puedes implementar un modal, toast o alerta
  console.warn('Mostrando advertencia al usuario:', message);
  
  // Ejemplo con alerta nativa (puedes reemplazar con tu UI)
  if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
    setTimeout(() => {
      alert(`⚠️ Problema de conexión\n\n${message}\n\nPor favor, verifica que el servidor esté funcionando.`);
    }, 1000);
  }
};

/**
 * Prueba una ruta específica del backend
 */
export const testSpecificEndpoint = async (endpoint: string): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const response = await fetch(`http://localhost:3000/api${endpoint}`);
    const data = await response.json();
    
    console.log(`🔍 Probando ${endpoint}:`, response.status);
    
    return {
      success: response.ok,
      data: data
    };
  } catch (error: any) {
    console.error(`❌ Error probando ${endpoint}:`, error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Prueba múltiples endpoints para diagnóstico
 */
export const runConnectionDiagnostics = async (): Promise<void> => {
  console.log('🩺 Iniciando diagnóstico de conexión...');
  
  const endpoints = [
    '/auth/health',
    '/auth/login',  // Solo prueba si responde, no hace login real
    '/users',
    '/residents'
  ];
  
  for (const endpoint of endpoints) {
    const result = await testSpecificEndpoint(endpoint);
    console.log(`${result.success ? '✅' : '❌'} ${endpoint}: ${result.success ? 'OK' : result.error}`);
  }
  
  console.log('🩺 Diagnóstico completado');
};