// src/services/users.service.ts
import axios from 'axios';
import type { User, CreateUserDto, UpdateUserDto, UserFilters } from '../types/user.types';
import authService from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const usersService = {
  async getUsers(filters?: UserFilters): Promise<User[]> {
    const token = authService.getAccessToken();
    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
      params: filters,
    });
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const token = authService.getAccessToken();
    const response = await axios.get(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async createUser(userData: CreateUserDto): Promise<User> {
    const token = authService.getAccessToken();
    const response = await axios.post(`${API_URL}/users`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    const token = authService.getAccessToken();
    const response = await axios.patch(`${API_URL}/users/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    const token = authService.getAccessToken();
    await axios.delete(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getRoleDisplayName(role: User['role']): string {
    const roleNames: Record<User['role'], string> = {
      DIRECTORA: 'Directora',
      PSICOLOGA: 'Psicóloga',
      TRABAJADORA_SOCIAL: 'Trabajadora Social',
      ADMIN: 'Administradora',
      VOLUNTARIO: 'Voluntario/a',
    };

    return roleNames[role];
  },

  getRoleColor(role: User['role']): string {
    const roleColors: Record<User['role'], string> = {
      DIRECTORA: 'bg-purple-100 text-purple-800',
      PSICOLOGA: 'bg-blue-100 text-blue-800',
      TRABAJADORA_SOCIAL: 'bg-green-100 text-green-800',
      ADMIN: 'bg-yellow-100 text-yellow-800',
      VOLUNTARIO: 'bg-gray-100 text-gray-800',
    };

    return roleColors[role];
  },
};

export default usersService;
