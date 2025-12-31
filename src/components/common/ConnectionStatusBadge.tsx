// src/components/common/ConnectionStatusBadge.tsx
import React, { useEffect, useState } from 'react';

interface ConnectionStatusBadgeProps {
  showDetails?: boolean;       // Mostrar detalles del estado
  autoCheck?: boolean;         // Verificar conexión automáticamente
  checkInterval?: number;      // Intervalo de verificación en ms
}

const ConnectionStatusBadge: React.FC<ConnectionStatusBadgeProps> = ({
  showDetails = true,
  autoCheck = true,
  checkInterval = 60000, // 1 minuto
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkConnection = async () => {
    setChecking(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/health`);
      setIsConnected(res.ok);
    } catch {
      setIsConnected(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    // Verificación inicial
    checkConnection();

    if (autoCheck) {
      const interval = window.setInterval(checkConnection, checkInterval);
      return () => clearInterval(interval);
    }
  }, [autoCheck, checkInterval]);

  const getBadgeColor = () => {
    if (isConnected === null) return 'bg-gray-300 text-gray-700';
    return isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className={`px-3 py-1 rounded-full font-semibold text-sm ${getBadgeColor()} shadow-sm flex items-center gap-2`}>
      <span>
        {checking ? 'Verificando...' : isConnected ? 'Conectado ✅' : 'Desconectado ❌'}
      </span>
      {showDetails && isConnected === false && (
        <button
          onClick={checkConnection}
          className="ml-2 px-2 py-0.5 bg-red-200 text-red-900 rounded hover:bg-red-300 transition-colors text-xs"
        >
          Reintentar
        </button>
      )}
    </div>
  );
};

export default ConnectionStatusBadge;

