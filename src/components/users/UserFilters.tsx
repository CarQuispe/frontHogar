// src/components/users/UserFilters.tsx
import React from 'react';
import { Filter, X } from 'lucide-react';
import type { UserFilters as FiltersType, UserRole } from '../../types/user.types';

interface Props {
  filters: FiltersType;
  onFilterChange: (filters: FiltersType) => void;
  onClearFilters: () => void;
}

const UserFilters: React.FC<Props> = ({ filters, onFilterChange, onClearFilters }) => {
  const roleOptions: Array<{ value: UserRole | '', label: string }> = [
    { value: '', label: 'Todos los roles' },
    { value: 'DIRECTORA', label: 'Directora' },
    { value: 'PSICOLOGA', label: 'Psicóloga' },
    { value: 'TRABAJADORA_SOCIAL', label: 'Trabajadora Social' },
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'VOLUNTARIO', label: 'Voluntario' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'active', label: 'Solo activos' },
    { value: 'inactive', label: 'Solo inactivos' },
  ];

  const handleRoleChange = (role: UserRole | '') => {
    if (role === '') {
      const { role: _, ...rest } = filters;
      onFilterChange(rest);
    } else {
      onFilterChange({ ...filters, role });
    }
  };

  const handleStatusChange = (status: string) => {
    if (status === 'all') {
      const { isActive: _, ...rest } = filters;
      onFilterChange(rest);
    } else if (status === 'active') {
      onFilterChange({ ...filters, isActive: true });
    } else if (status === 'inactive') {
      onFilterChange({ ...filters, isActive: false });
    }
  };

  const handleSedeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sedeId = e.target.value;
    if (sedeId === '') {
      const { sedeId: _, ...rest } = filters;
      onFilterChange(rest);
    } else {
      onFilterChange({ ...filters, sedeId });
    }
  };

  // Contar filtros activos (excluyendo propiedades undefined)
  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key as keyof FiltersType] !== undefined
  ).length;

  // Obtener el valor del filtro de rol de manera segura
  const currentRole = filters.role || '';

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-medium text-gray-700">Filtros</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {activeFiltersCount} activo{activeFiltersCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtro por Rol */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rol
          </label>
          <div className="flex flex-wrap gap-2">
            {roleOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleRoleChange(option.value as UserRole | '')}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  currentRole === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${option.value === '' ? 'font-medium' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtro por Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => {
              let isActive = false;
              if (option.value === 'all' && filters.isActive === undefined) {
                isActive = true;
              } else if (option.value === 'active' && filters.isActive === true) {
                isActive = true;
              } else if (option.value === 'inactive' && filters.isActive === false) {
                isActive = true;
              }

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleStatusChange(option.value)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtro por Sede */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sede
          </label>
          <select
            value={filters.sedeId || ''}
            onChange={handleSedeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Todas las sedes</option>
            <option value="sede1">Sede Central</option>
            <option value="sede2">Sede Norte</option>
            <option value="sede3">Sede Sur</option>
            <option value="sede4">Sede Oriente</option>
          </select>
        </div>
      </div>

      {/* Mostrar filtros activos */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600 mb-2">Filtros aplicados:</p>
          <div className="flex flex-wrap gap-2">
            {filters.role && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Rol: {roleOptions.find(r => r.value === filters.role)?.label}
                <button
                  onClick={() => handleRoleChange('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {filters.isActive !== undefined && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Estado: {filters.isActive ? 'Activo' : 'Inactivo'}
                <button
                  onClick={() => handleStatusChange('all')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {filters.sedeId && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Sede: {filters.sedeId}
                <button
                  onClick={() => handleSedeChange({ target: { value: '' } } as React.ChangeEvent<HTMLSelectElement>)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Búsqueda: "{filters.search}"
                <button
                  onClick={() => onFilterChange({ ...filters, search: undefined })}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilters;