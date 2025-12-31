import { useState, useCallback } from 'react';
import { testBackendConnection } from '../services/api';

/**
 * Hook personalizado para probar la conexión con el backend
 * 
 * @returns {Object} Objeto con estado y funciones para probar conexión
 * @property {boolean | null} isConnected - Estado de conexión (null = no verificado)
 * @property {boolean} isTesting - Si está en proceso de prueba
 * @property {string | null} error - Mensaje de error si hay
 * @property {Function} testConnection - Función para probar conexión
 * @property {Function} reset - Función para resetear estado
 */
export const useConnectionTest = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Prueba la conexión con el backend
   */
  const testConnection = useCallback(async (): Promise<boolean> => {
    setIsTesting(true);
    setError(null);
    
    try {
      const result = await testBackendConnection();
      setIsConnected(result.success);
      
      if (!result.success) {
        setError(result.message);
      }
      
      return result.success;
    } catch (error: any) {
      setIsConnected(false);
      setError(error.message || 'Error desconocido al probar conexión');
      return false;
    } finally {
      setIsTesting(false);
    }
  }, []);
  
  /**
   * Resetea el estado del hook
   */
  const reset = useCallback(() => {
    setIsConnected(null);
    setIsTesting(false);
    setError(null);
  }, []);
  
  return {
    isConnected,
    isTesting,
    error,
    testConnection,
    reset
  };
};

/**
 * Hook para monitorear conexión automáticamente
 */
export const useConnectionMonitor = (interval: number = 30000) => {
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [checks, setChecks] = useState<Array<{timestamp: Date; success: boolean}>>([]);
  
  const { isConnected, isTesting, error, testConnection } = useConnectionTest();
  
  const monitor = useCallback(async () => {
    const success = await testConnection();
    const now = new Date();
    
    setLastCheck(now);
    setChecks(prev => {
      const newChecks = [...prev, { timestamp: now, success }];
      // Mantener solo los últimos 10 checks
      return newChecks.slice(-10);
    });
    
    return success;
  }, [testConnection]);
  
  return {
    isConnected,
    isTesting,
    error,
    lastCheck,
    checks,
    monitor
  };
};