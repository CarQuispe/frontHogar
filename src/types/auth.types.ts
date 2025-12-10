// src/types/auth.types.ts

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role:
    | 'DIRECTORA'
    | 'PSICOLOGA'
    | 'TRABAJADORA_SOCIAL'
    | 'ADMIN'
    | 'VOLUNTARIO';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}
