import React, { useEffect } from 'react';
import { useConnectionMonitor } from '../hooks/useConnectionTest';

interface ConnectionStatusBadgeProps {
  showDetails?: boolean;
  autoCheck?: boolean;
  checkInterval?: number;
}

const ConnectionStatusBadge: React.FC<ConnectionStatusBadgeProps> = ({
  showDetails = false,
  autoCheck = true,
  checkInterval = 30000
}) => {
  const { isConnected, isTesting, error, lastCheck, monitor } = useConnectionMonitor(checkInterval);
  
  useEffect(() => {
    if (autoCheck) {
      // Prueba inicial
      monitor();
      
      // Pruebas periódicas
      const interval = setInterval(monitor, checkInterval);
      return () => clearInterval(interval);
    }
  }, [autoCheck, checkInterval, monitor]);
  
  const getStatusInfo = () => {
    if (isTesting) {
      return { text: 'Verificando...', color: 'bg-yellow-100 text-yellow-800', icon: '🔄' };
    }
    
    if (isConnected === null) {
      return { text: 'No verificado', color: 'bg-gray-100 text-gray-800', icon: '⚪' };
    }
    
    if (isConnected) {
      return { text: 'Conectado', color: 'bg-green-100 text-green-800', icon: '✅' };
    }
    
    return { text: 'Desconectado', color: 'bg-red-100 text-red-800', icon: '❌' };
  };
  
  const status = getStatusInfo();
  
  return (
    <div className="inline-flex flex-col gap-1">
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${status.color}`}>
        <span>{status.icon}</span>
        <span>{status.text}</span>
        <button
          onClick={monitor}
          disabled={isTesting}
          className="text-xs opacity-70 hover:opacity-100 disabled:opacity-50"
          title="Actualizar estado"
        >
          ↻
        </button>
      </div>
      
      {showDetails && (
        <div className="text-xs text-gray-600 space-y-1">
          {lastCheck && (
            <div>Última verificación: {lastCheck.toLocaleTimeString()}</div>
          )}
          {error && (
            <div className="text-red-600">{error}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatusBadge;