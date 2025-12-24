// frontend/src/components/users/UserCard.tsx
import React from 'react';
import { Pencil, Trash2, Power } from 'lucide-react';
import type { User } from '../../types/user.types';

interface Props {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  isCurrentUser?: boolean;
}

const UserCard: React.FC<Props> = ({
  user,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  isCurrentUser = false,
}) => {
  // Usa nombre y apellido según tu base de datos
  const nombreCompleto = `${user.nombre || ''} ${user.apellido || ''}`.trim();
  
  const initials = nombreCompleto
    ? nombreCompleto
        .split(' ')
        .map((s) => s[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  // Función para formatear el rol a un formato más legible
  const formatRol = (rol: string) => {
    const formatMap: Record<string, string> = {
      'DIRECTORA': 'Directora',
      'PSICOLOGA': 'Psicóloga',
      'TRABAJADORA_SOCIAL': 'Trabajadora Social',
      'ADMIN': 'Administrador',
      'VOLUNTARIO': 'Voluntario'
    };
    return formatMap[rol] || rol.replace(/_/g, ' ');
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 text-white flex items-center justify-center font-bold">
            {initials}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {nombreCompleto || 'Sin nombre'}
              </h3>
                <p className="text-sm text-gray-500">
                {formatRol(user.role)}
              </p>
            </div>

            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                user.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {user.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-600">{user.email}</p>

          {/* Acciones */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => onEdit(user)}
              className="px-3 py-2 rounded-full border text-gray-700 hover:bg-gray-50 flex items-center gap-1"
            >
              <Pencil className="w-4 h-4" />
              Editar
            </button>

            {!isCurrentUser && (
              <button
                onClick={() =>
                  user.isActive
                    ? onDeactivate(user.id)
                    : onActivate(user.id)
                }
                className={`px-3 py-2 rounded-full border flex items-center gap-1 ${
                  user.isActive
                    ? 'text-orange-600 hover:bg-orange-50'
                    : 'text-green-600 hover:bg-green-50'
                }`}
              >
                <Power className="w-4 h-4" />
                {user.isActive ? 'Desactivar' : 'Activar'}
              </button>
            )}

            {!isCurrentUser && (
              <button
                onClick={() => onDelete(user.id)}
                className="px-3 py-2 rounded-full border text-red-600 hover:bg-red-50 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;