import React from 'react';
import type { User } from '../../types/user.types';
import UserCard from './UserCard';

interface Props {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const PAGE_SIZE = 6;

const UserList: React.FC<Props> = ({ users, loading, onEdit, onDelete, onView }) => {
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const start = (page - 1) * PAGE_SIZE;
  const paged = users.slice(start, start + PAGE_SIZE);

  if (loading) return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Mostrar mensaje si no hay usuarios */}
      {users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron usuarios</p>
        </div>
      ) : (
        <>
          {/* Grid de usuarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paged.map((u) => (
              <UserCard 
                key={u.id} 
                user={u} 
                onEdit={onEdit} 
                onDelete={onDelete} 
                onView={onView} 
              />
            ))}
          </div>

          {/* Paginación básica */}
          {totalPages > 1 && (
            <div className="pt-6 flex justify-center items-center gap-4">
              <button
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg ${
                  page === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white border hover:bg-gray-50 text-gray-700'
                }`}
              >
                Anterior
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-700">
                  Página <strong>{page}</strong> de <strong>{totalPages}</strong>
                </span>
                <span className="text-gray-500">
                  ({users.length} usuarios)
                </span>
              </div>
              
              <button
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
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
        </>
      )}
    </div>
  );
};

export default UserList;