// src/components/users/UsersStats.tsx
import React from 'react';
import { Users, UserCheck, UserX, Briefcase, Shield } from 'lucide-react';
import type { User } from '../../types/user.types';

interface Props {
  users: User[];
}

const UsersStats: React.FC<Props> = ({ users }) => {
  // Cálculos de estadísticas
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;

  // Conteo por rol
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Estadísticas destacadas
  const stats = [
    {
      title: 'Total de Usuarios',
      value: totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Usuarios Activos',
      value: activeUsers,
      icon: UserCheck,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      percentage: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
    },
    {
      title: 'Usuarios Inactivos',
      value: inactiveUsers,
      icon: UserX,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      percentage: totalUsers > 0 ? Math.round((inactiveUsers / totalUsers) * 100) : 0,
    },
    {
      title: 'Voluntarios',
      value: roleCounts['VOLUNTARIO'] || 0,
      icon: Users,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      percentage: totalUsers > 0 ? Math.round(((roleCounts['VOLUNTARIO'] || 0) / totalUsers) * 100) : 0,
    },
    {
      title: 'Administradores',
      value: roleCounts['ADMIN'] || 0,
      icon: Shield,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Personal',
      value: (roleCounts['DIRECTORA'] || 0) + 
             (roleCounts['PSICOLOGA'] || 0) + 
             (roleCounts['TRABAJADORA_SOCIAL'] || 0),
      icon: Briefcase,
      color: 'bg-teal-500',
      textColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
  ];

  // Distribución por rol para gráfico visual
  const roleDistribution = [
    { role: 'Voluntarios', count: roleCounts['VOLUNTARIO'] || 0, color: 'bg-purple-500' },
    { role: 'Administradores', count: roleCounts['ADMIN'] || 0, color: 'bg-amber-500' },
    { role: 'Director/a', count: roleCounts['DIRECTORA'] || 0, color: 'bg-teal-500' },
    { role: 'Psicóloga', count: roleCounts['PSICOLOGA'] || 0, color: 'bg-blue-500' },
    { role: 'Trab. Social', count: roleCounts['TRABAJADORA_SOCIAL'] || 0, color: 'bg-green-500' },
  ].filter(item => item.count > 0);

  const maxCount = Math.max(...roleDistribution.map(r => r.count), 1);

  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} p-4 rounded-xl border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.textColor}`}>
                  {stat.value}
                </p>
                {stat.percentage !== undefined && (
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.percentage}% del total
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Distribución por rol */}
      {totalUsers > 0 && (
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Distribución por Rol
          </h3>
          
          {/* Gráfico de barras */}
          <div className="space-y-3">
            {roleDistribution.map((item) => {
              const percentage = Math.round((item.count / totalUsers) * 100);
              const barWidth = (item.count / maxCount) * 100;
              
              return (
                <div key={item.role} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{item.role}</span>
                    <span className="text-gray-600">
                      {item.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Leyenda */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex flex-wrap gap-3">
              {roleDistribution.map((item) => (
                <div key={item.role} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-600">{item.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Resumen general */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-5 rounded-xl border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-800">Resumen del Sistema</h3>
            <p className="text-sm text-gray-600 mt-1">
              {activeUsers} de {totalUsers} usuarios están activos actualmente.
              {roleCounts['VOLUNTARIO'] 
                ? ` ${roleCounts['VOLUNTARIO']} son voluntarios.` 
                : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
              <div className="text-xs text-gray-500">Activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{inactiveUsers}</div>
              <div className="text-xs text-gray-500">Inactivos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersStats;