// src/types/user.types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'DIRECTORA' | 'PSICOLOGA' | 'TRABAJADORA_SOCIAL' | 'ADMIN' | 'VOLUNTARIO';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role: User['role'];
}

export interface UpdateUserDto {
  name?: string;
  role?: User['role'];
  isActive?: boolean;
}

export interface UserFilters {
  role?: User['role'];
  isActive?: boolean;
  search?: string;
}