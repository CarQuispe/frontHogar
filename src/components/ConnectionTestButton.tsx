import React from 'react';
import { useConnectionTest } from '../hooks/useConnectionTest';

const ConnectionTestButton: React.FC = () => {
  const { isConnected, isTesting, error, testConnection, reset } = useConnectionTest();
  
  const handleClick = async () => {
    await testConnection();
  };
  
  const getStatusColor = () => {
    if (isConnected === null) return 'bg-gray-100 text-gray-800';
    if (isConnected) return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };
  
  const getStatusText = () => {
    if (isTesting) return '🔄 Probando...';
    if (isConnected === null) return '🔍 Prueba de conexión';
    if (isConnected) return '✅ Conectado';
    return '❌ Desconectado';
  };
  
  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <button
          onClick={handleClick}
          disabled={isTesting}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            isTesting 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {getStatusText()}
        </button>
        
        <button
          onClick={reset}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
        >
          Resetear
        </button>
      </div>
      
      {isConnected !== null && (
        <div className={`px-3 py-2 rounded ${getStatusColor()}`}>
          <div className="font-medium">
            {isConnected ? '✅ Conexión exitosa' : '❌ Error de conexión'}
          </div>
          {error && (
            <div className="text-sm mt-1">{error}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionTestButton;