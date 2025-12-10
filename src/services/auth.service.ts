// src/services/auth.service.ts
import axios from 'axios';
import type { LoginCredentials, RegisterData } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL || 'VITE_API_UR';

const authService = {
  async login(credentials: LoginCredentials) {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);

    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  async register(data: RegisterData) {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }
};

export default authService;
