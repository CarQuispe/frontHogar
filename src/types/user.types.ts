// src/types/user.types.ts
export type UserRole = 
  | 'DIRECTORA'
  | 'PSICOLOGA'
  | 'TRABAJADORA_SOCIAL'
  | 'ADMIN'
  | 'VOLUNTARIO';

export interface User {
  id: string;
  nombre: string;
  apellido?: string;
  email: string;
  rut?: string;
  telefono?: string;
  role: UserRole;
  isActive: boolean;
  sedeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  nombre: string;
  apellido?: string;
  email: string;
  password: string;
  rut?: string;
  telefono?: string;
  role: UserRole;
  sedeId?: string;
  isActive?: boolean;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  id?: string;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  sedeId?: string;
}

export interface UserFormData {
  nombre: string;
  apellido?: string;
  email: string;
  password?: string;
  rut?: string;
  telefono?: string;
  role: UserRole;
  sedeId?: string;
  isActive: boolean;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  currentUser: User | null;
  total: number;
  page: number;
  limit: number;
}