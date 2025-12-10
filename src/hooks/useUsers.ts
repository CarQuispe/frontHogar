import { useState, useEffect } from 'react';
import usersService from '../services/users.service';
import type{ User, UserFilters } from '../types/user.types';

export const useUsers = (initialFilters?: UserFilters) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>(initialFilters || {});

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersService.getUsers(filters);
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const createUser = async (userData: any) => {
    try {
      const newUser = await usersService.createUser(userData);
      setUsers([...users, newUser]);
      return newUser;
    } catch (err: any) {
      throw err.response?.data?.message || 'Error al crear usuario';
    }
  };

  const updateUser = async (id: string, userData: any) => {
    try {
      const updatedUser = await usersService.updateUser(id, userData);
      setUsers(users.map(user => user.id === id ? updatedUser : user));
      return updatedUser;
    } catch (err: any) {
      throw err.response?.data?.message || 'Error al actualizar usuario';
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await usersService.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (err: any) {
      throw err.response?.data?.message || 'Error al eliminar usuario';
    }
  };

  return {
    users,
    loading,
    error,
    filters,
    setFilters,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};