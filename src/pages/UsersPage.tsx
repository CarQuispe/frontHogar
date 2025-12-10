// src/pages/UsersPage.tsx
import React, { useState } from 'react';
import { useAuth, type UserRole } from '../context/AuthContext';
import { useUsers } from '../hooks/useUsers';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import { Plus, Search, Filter } from 'lucide-react'; // ✅ Filter incluido

const UsersPage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const { users, loading, createUser, updateUser, deleteUser } = useUsers();

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false); // ✅ Estado para mostrar/ocultar filtros

  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all',
  });

  if (!user) return <div>No autorizado</div>;

  const handleCreateUser = async (userData: any) => {
    await createUser(userData);
    setShowForm(false);
  };

  const handleUpdateUser = async (userData: any) => {
    if (editingUser) {
      await updateUser(editingUser.id, userData);
      setEditingUser(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filters.search) {
      const text = filters.search.toLowerCase();
      if (!u.name.toLowerCase().includes(text) && !u.email.toLowerCase().includes(text)) {
        return false;
      }
    }

    if (filters.role !== 'all' && u.role !== filters.role) return false;

    if (filters.status !== 'all') {
      const isActive = filters.status === 'active';
      if (u.isActive !== isActive) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* === TÍTULO === */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Usuarios</h1>
        <p className="text-gray-600 mt-2">Colaboradores del sistema</p>
      </div>

      {/* === FILTROS === */}
      <div className="space-y-4">
        {/* Barra de búsqueda y botones */}
        <div className="flex items-center gap-4">
          {/* Búsqueda */}
          <div className="flex-1 flex items-center gap-2 border rounded-lg px-3 py-2">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              className="w-full outline-none"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          {/* Botón Filtros (mobile/opcional) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden border rounded-lg px-3 py-2 flex items-center gap-2"
          >
            <Filter size={18} />
            Filtros
          </button>

          {/* Botón Nuevo Usuario */}
          {hasRole('DIRECTORA' as UserRole) && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={18} /> Nuevo Usuario
            </button>
          )}
        </div>

        {/* Filtros avanzados */}
        {(showFilters || window.innerWidth >= 768) && (
          <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
            {/* Roles */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Rol:</label>
              <select
                className="border rounded-lg px-3 py-2"
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              >
                <option value="all">Todos los roles</option>
                <option value="DIRECTORA">Directora</option>
                <option value="PSICOLOGA">Psicóloga</option>
                <option value="TRABAJADORA_SOCIAL">Trabajadora Social</option>
                <option value="ADMIN">Administrador</option>
                <option value="VOLUNTARIO">Voluntario</option>
              </select>
            </div>

            {/* Estado */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Estado:</label>
              <select
                className="border rounded-lg px-3 py-2"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>

            {/* Botón limpiar filtros */}
            <button
              onClick={() => setFilters({ search: '', role: 'all', status: 'all' })}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* === LISTA DE USUARIOS === */}
      <UserList
        users={filteredUsers}
        loading={loading}
        onView={(userId) => {
          const userToView = users.find(u => u.id === userId);
          console.log('Ver usuario:', userToView);
          // Aquí podrías abrir un modal o redirigir
        }}
        onEdit={(user) => setEditingUser(user)}
        onDelete={(userId) => {
          if (window.confirm('¿Eliminar usuario?')) deleteUser(userId);
        }}
      />

      {/* === MODAL DE FORMULARIO === */}
      {(showForm || editingUser) && hasRole('DIRECTORA' as UserRole) && (
        <UserForm
          user={editingUser}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          onCancel={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UsersPage;