import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import type { User } from '../../types/user.types';

interface Props {
  user: User;
  onView: (id: string) => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const UserCard: React.FC<Props> = ({ user, onView, onEdit, onDelete }) => {
  const initials = user.name
    .split(' ')
    .map(s => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 text-white flex items-center justify-center font-bold">
            {initials}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{user.role}</p>
            </div>

            <span
              className={`text-sm font-medium px-2 py-1 rounded-full ${
                user.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {user.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>

          <div className="mt-3 text-sm text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M21 10v6a2 2 0 0 1-2 2H7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{user.email}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => onView(user.id)}
              className="flex-1 px-3 py-2 border rounded-full text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" /> Ver
            </button>

            <button
              onClick={() => onEdit(user)}
              className="px-3 py-2 rounded-full text-gray-700 border hover:bg-gray-50 flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDelete(user.id)}
              className="px-3 py-2 rounded-full text-red-600 border hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;