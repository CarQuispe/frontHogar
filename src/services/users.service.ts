// src/services/users.service.ts
import { apiClient } from './api';
import type { 
  User, 
  CreateUserDto, 
  UpdateUserDto, 
  UserFilters,
  UsersResponse 
} from '../types/user.types';

class UsersService {
  private readonly baseUrl = '/users';

  async getUsers(filters?: UserFilters, page: number = 1, limit: number = 20): Promise<UsersResponse> {
    try {
      const params = {
        page,
        limit,
        ...filters
      };
      
      const response = await apiClient.get<UsersResponse>(this.baseUrl, { params });
      return response;
    } catch (error: any) {
      this.handleError(error, 'Error al obtener usuarios');
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      return await apiClient.get<User>(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      this.handleError(error, `Error al obtener usuario ${id}`);
      throw error;
    }
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      return await apiClient.post<User>(this.baseUrl, userData);
    } catch (error: any) {
      this.handleError(error, 'Error al crear usuario');
      throw error;
    }
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    try {
      return await apiClient.patch<User>(`${this.baseUrl}/${id}`, userData);
    } catch (error: any) {
      this.handleError(error, `Error al actualizar usuario ${id}`);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      this.handleError(error, `Error al eliminar usuario ${id}`);
      throw error;
    }
  }

  async activateUser(id: string): Promise<User> {
    try {
      return await apiClient.patch<User>(`${this.baseUrl}/${id}/activate`, {});
    } catch (error: any) {
      this.handleError(error, `Error al activar usuario ${id}`);
      throw error;
    }
  }

  async deactivateUser(id: string): Promise<User> {
    try {
      return await apiClient.patch<User>(`${this.baseUrl}/${id}/deactivate`, {});
    } catch (error: any) {
      this.handleError(error, `Error al desactivar usuario ${id}`);
      throw error;
    }
  }

  getRoleDisplayName(role: string): string {
    const roleNames: Record<string, string> = {
      DIRECTORA: 'Directora',
      PSICOLOGA: 'Psicóloga',
      TRABAJADORA_SOCIAL: 'Trabajadora Social',
      ADMIN: 'Administrador',
      VOLUNTARIO: 'Voluntario/a',
    };
    return roleNames[role] || role;
  }

  getRoleColor(role: string): string {
    const roleColors: Record<string, string> = {
      DIRECTORA: 'bg-purple-100 text-purple-800 border-purple-200',
      PSICOLOGA: 'bg-blue-100 text-blue-800 border-blue-200',
      TRABAJADORA_SOCIAL: 'bg-green-100 text-green-800 border-green-200',
      ADMIN: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      VOLUNTARIO: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  getStatusDisplay(isActive: boolean): string {
    return isActive ? 'Activo' : 'Inactivo';
  }

  getStatusColor(isActive: boolean): string {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  }

  private handleError(error: any, defaultMessage: string): void {
    if (error.response?.status === 401) {
      throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
    } else if (error.response?.status === 403) {
      throw new Error('No tienes permisos para realizar esta acción.');
    } else if (error.response?.status === 409) {
      throw new Error('El email o RUT ya está registrado.');
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(defaultMessage);
    }
  }
}

export const usersService = new UsersService();
export default usersService;
