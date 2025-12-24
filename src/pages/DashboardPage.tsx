import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  UserCircle,
  FileText,
  Calendar
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Usuarios Activos',
      value: '48',
      change: '+2.3% vs. mes anterior',
      color: 'bg-blue-600',
      textColor: 'text-blue-600',
      icon: Users,
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Proyectos Activos',
      value: '20',
      change: '+8.1% vs. mes anterior',
      color: 'bg-green-600',
      textColor: 'text-green-600',
      icon: UserCircle,
      iconBg: 'bg-green-100'
    },
    {
      title: 'Informes SEDEPOS',
      value: '15',
      change: '+1.9% vs. mes anterior',
      color: 'bg-orange-600',
      textColor: 'text-orange-600',
      icon: FileText,
      iconBg: 'bg-orange-100'
    },
    {
      title: 'Documentos Pendientes',
      value: '8',
      change: 'Actualizado hoy',
      color: 'bg-purple-600',
      textColor: 'text-purple-600',
      icon: Calendar,
      iconBg: 'bg-purple-100'
    }
  ];

  return (
    <div className="space-y-8">

      {/* TÍTULO */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido/a, {user?.nombre || 'Usuario'}
        </h1>
        <p className="text-gray-600 mt-1">
          Sistema de Gestión — Hogar de Niños
        </p>
      </div>

      {/* CARDS DE ESTADÍSTICAS (como imagen) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl p-5 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${item.iconBg}`}>
                <item.icon className={`h-7 w-7 ${item.textColor}`} />
              </div>

              <span className="text-xs text-gray-400">Actualizado</span>
            </div>

            <h3 className="text-sm mt-3 text-gray-600 font-medium">
              {item.title}
            </h3>

            <div className="mt-1">
              <p className="text-3xl font-bold text-gray-900">{item.value}</p>
              <p className={`text-sm font-medium mt-1 ${item.textColor}`}>
                {item.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* SECCIÓN INFERIOR (gráficas - estructura) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Gráfica principal */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 col-span-2 h-[420px]">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Estado de Residentes
          </h2>
          <p className="text-sm text-gray-500 mb-4">Distribución actual</p>

          <div className="w-full h-full flex items-center justify-center">
            {/* Aquí irá tu gráfica (Chart.js, Recharts, etc.) */}
            <span className="text-gray-400 text-sm">[Gráfica de líneas]</span>
          </div>
        </div>

        {/* Gráfica lateral derecha */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 h-[420px]">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Estado Residentes
          </h2>
          <p className="text-sm text-gray-500 mb-4">Distribución actual</p>

          <div className="w-full h-full flex items-center justify-center">
            {/* Aquí irá tu pie chart */}
            <span className="text-gray-400 text-sm">[Gráfica de torta]</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;

