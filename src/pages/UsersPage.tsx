// apps/frontend/src/pages/UsersPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import { usePermissions } from '../hooks/useAuth';

import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import UserFilters from '../components/users/UserFilters';
import UsersStats from '../components/users/UsersStats';

import {
  Plus,
  Search,
  RefreshCw,
  Download,
  Users as UsersIcon,
  AlertCircle,
} from 'lucide-react';

import type { User, UserFilters as FiltersType, CreateUserDto, UpdateUserDto } from '../types/user.types';

const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const permissions = usePermissions();

  const {
    users,
    loading,
    error,
    total,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    activateUser,       // ← Usar este método
    deactivateUser,     // ← Usar este método
    clearError,
  } = useUsers();

  /* =========================
      ESTADOS
  ========================== */
  const [filters, setFilters] = useState<FiltersType>({});
  const [searchTerm, setSearchTerm] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  /* =========================
      CARGA DE USUARIOS
  ========================== */
  useEffect(() => {
    fetchUsers(filters);
  }, [filters]);

  /* =========================
      SEARCH (DEBOUNCE)
  ========================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => {
        if (searchTerm.trim()) {
          return { ...prev, search: searchTerm };
        } else {
          const { search: _, ...rest } = prev;
          return rest;
        }
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  /* =========================
      HANDLERS
  ========================== */
  const handleCreateUser = async (data: CreateUserDto | Partial<User>) => {
    try {
      await createUser(data as CreateUserDto);
      setShowForm(false);
      fetchUsers(filters);
    } catch (err) {
      console.error('Error al crear usuario:', err);
    }
  };

  const handleUpdateUser = async (data: UpdateUserDto | Partial<User>) => {
    if (!editingUser) return;
    
    try {
      await updateUser(editingUser.id, data);
      setEditingUser(null);
      setShowForm(false);
      fetchUsers(filters);
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id); // Ya tiene confirmación interna
      // No necesitas fetchUsers aquí porque deleteUser ya actualiza el estado
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    }
  };

  const handleActivateUser = async (id: string) => {
    try {
      await activateUser(id); // Usa el método específico
      // No necesitas fetchUsers aquí porque activateUser ya actualiza el estado
    } catch (err) {
      console.error('Error al activar usuario:', err);
    }
  };

  const handleDeactivateUser = async (id: string) => {
    try {
      await deactivateUser(id); // Usa el método específico
      // No necesitas fetchUsers aquí porque deactivateUser ya actualiza el estado
    } catch (err) {
      console.error('Error al desactivar usuario:', err);
    }
  };

  const handleRefresh = useCallback(() => {
    fetchUsers(filters);
  }, [fetchUsers, filters]);

  const handleExport = () => {
    console.log('Exportar usuarios', users);
    alert('Exportación en desarrollo');
  };

  /* =========================
      PERMISOS
  ========================== */
  if (!permissions.canManageUsers) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Acceso Denegado</h1>
        <p className="text-gray-600 text-center max-w-md mb-6">
          No tienes permisos para gestionar usuarios.
        </p>
        <a
          href="/dashboard"
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver al Dashboard
        </a>
      </div>
    );
  }

  /* =========================
      RENDER
  ========================== */
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <UsersIcon className="w-7 h-7 md:w-8 md:h-8" />
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600 mt-1">
            Administra los usuarios del sistema ({total} usuarios)
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>

          {permissions.canExportData && (
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          )}

          <button
            onClick={() => {
              setEditingUser(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* STATS */}
      <UsersStats users={users} />

      {/* FILTROS */}
      <UserFilters
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={() => {
          setFilters({});
          setSearchTerm('');
        }}
      />

      {/* SEARCH */}
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, email o teléfono..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>

      {/* ERROR */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-700 font-medium">Error</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-sm text-red-600 hover:text-red-800 ml-4"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* LISTA */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <UserList
          users={users}
          loading={loading}
          onEdit={(user) => {
            setEditingUser(user);
            setShowForm(true);
          }}
          onDelete={handleDeleteUser}
          onActivate={handleActivateUser}
          onDeactivate={handleDeactivateUser}
          currentUserId={currentUser?.id}
        />
      </div>

      {/* FORMULARIO */}
      {showForm && (
        <UserForm
          user={editingUser}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          onCancel={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
          isEditing={!!editingUser}
        />
      )}
    </div>
  );
};

export default UsersPage;