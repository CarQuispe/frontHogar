// src/hooks/useUsers.ts
import { useState, useCallback } from 'react';
import { usersService } from '../services/users.service';
import type { 
  User, 
  CreateUserDto, 
  UpdateUserDto, 
  UserFilters 
} from '../types/user.types';

interface UseUsersReturn {
  // Estado
  users: User[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  
  // Métodos
  fetchUsers: (filters?: UserFilters, newPage?: number) => Promise<void>;
  fetchUserById: (id: string) => Promise<User>;
  createUser: (userData: CreateUserDto) => Promise<User>;
  updateUser: (id: string, userData: UpdateUserDto) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  activateUser: (id: string) => Promise<void>;
  deactivateUser: (id: string) => Promise<void>;
  
  // Utilidades
  clearError: () => void;
  resetState: () => void;
}

export const useUsers = (initialFilters?: UserFilters): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = useCallback(async (filters?: UserFilters, newPage: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await usersService.getUsers(
        { ...initialFilters, ...filters }, 
        newPage, 
        limit
      );
      
      setUsers(response.users);
      setTotal(response.total);
      setPage(response.page);
      setLimit(response.limit);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [initialFilters, limit]);

  const fetchUserById = useCallback(async (id: string): Promise<User> => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await usersService.getUserById(id);
      return user;
    } catch (err: any) {
      const errorMessage = err.message || `Error al cargar usuario ${id}`;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: CreateUserDto): Promise<User> => {
    setLoading(true);
    setError(null);
    
    try {
      const newUser = await usersService.createUser(userData);
      // Actualizar lista localmente
      setUsers(prev => [newUser, ...prev]);
      setTotal(prev => prev + 1);
      return newUser;
    } catch (err: any) {
      setError(err.message || 'Error al crear usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, userData: UpdateUserDto): Promise<User> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await usersService.updateUser(id, userData);
      // Actualizar usuario en la lista
      setUsers(prev => prev.map(user => 
        user.id === id ? updatedUser : user
      ));
      return updatedUser;
    } catch (err: any) {
      setError(err.message || `Error al actualizar usuario ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string): Promise<void> => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await usersService.deleteUser(id);
      // Remover usuario de la lista
      setUsers(prev => prev.filter(user => user.id !== id));
      setTotal(prev => prev - 1);
    } catch (err: any) {
      setError(err.message || `Error al eliminar usuario ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const activateUser = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const activatedUser = await usersService.activateUser(id);
      // Actualizar usuario en la lista
      setUsers(prev => prev.map(user => 
        user.id === id ? activatedUser : user
      ));
    } catch (err: any) {
      setError(err.message || `Error al activar usuario ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deactivateUser = useCallback(async (id: string): Promise<void> => {
    if (!window.confirm('¿Estás seguro de desactivar este usuario?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const deactivatedUser = await usersService.deactivateUser(id);
      // Actualizar usuario en la lista
      setUsers(prev => prev.map(user => 
        user.id === id ? deactivatedUser : user
      ));
    } catch (err: any) {
      setError(err.message || `Error al desactivar usuario ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetState = useCallback(() => {
    setUsers([]);
    setError(null);
    setTotal(0);
    setPage(1);
    setTotalPages(0);
  }, []);

  return {
    // Estado
    users,
    loading,
    error,
    total,
    page,
    limit,
    totalPages,
    
    // Métodos
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
    
    // Utilidades
    clearError,
    resetState,
  };
};