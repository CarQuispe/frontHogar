// apps/frontend/src/components/users/UserList.tsx
import React from 'react';
import type { User } from '../../types/user.types';
import UserCard from './UserCard';

interface Props {
  users: User[];
  loading: boolean;
  currentUserId?: string;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
}

const PAGE_SIZE = 6;

const UserList: React.FC<Props> = ({
  users,
  loading,
  currentUserId,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
}) => {
  const [page, setPage] = React.useState(1);

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const start = (page - 1) * PAGE_SIZE;
  const pagedUsers = users.slice(start, start + PAGE_SIZE);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No se encontraron usuarios</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pagedUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
            isCurrentUser={user.id === currentUserId}
          />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="pt-6 flex justify-center items-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg ${
              page === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border hover:bg-gray-50 text-gray-700'
            }`}
          >
            Anterior
          </button>

          <span className="text-gray-700">
            Página <strong>{page}</strong> de <strong>{totalPages}</strong>{' '}
            <span className="text-gray-500">({users.length} usuarios)</span>
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg ${
              page === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border hover:bg-gray-50 text-gray-700'
            }`}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default UserList;
