// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook personalizado para acceder al contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};

/**
 * Hook para verificar si el usuario tiene un rol específico
 */
export const useRole = (role: string) => {
  const { user } = useAuth();
  return user?.role === role;
};

/**
 * Hook para verificar si el usuario tiene alguno de los roles especificados
 */
export const useAnyRole = (roles: string[]) => {
  const { user } = useAuth();
  
  // Lógica directa sin conflicto de nombres
  return roles.some(role => user?.role === role);
};

/**
 * Hook para obtener permisos específicos basados en el rol
 */
export const usePermissions = () => {
  const { user } = useAuth();
  
  const permissions = {
    // Permisos generales
    canViewDashboard: true,
    canViewProfile: true,
    
    // Permisos por rol
    canManageUsers: user?.role === 'ADMIN' || user?.role === 'DIRECTORA',
    canManageResidents: ['DIRECTORA', 'PSICOLOGA', 'TRABAJADORA_SOCIAL', 'ADMIN'].includes(user?.role || ''),
    canViewReports: ['DIRECTORA', 'ADMIN', 'PSICOLOGA'].includes(user?.role || ''),
    canManageSettings: user?.role === 'ADMIN',
    canExportData: ['DIRECTORA', 'ADMIN'].includes(user?.role || ''),
    
    // Permisos específicos de funcionalidades
    canCreateResident: ['DIRECTORA', 'TRABAJADORA_SOCIAL', 'ADMIN'].includes(user?.role || ''),
    canEditResident: ['DIRECTORA', 'TRABAJADORA_SOCIAL', 'ADMIN'].includes(user?.role || ''),
    canDeleteResident: ['DIRECTORA', 'ADMIN'].includes(user?.role || ''),
    canViewAllResidents: ['DIRECTORA', 'ADMIN', 'PSICOLOGA', 'TRABAJADORA_SOCIAL'].includes(user?.role || ''),
    canAssignResponsible: ['DIRECTORA', 'TRABAJADORA_SOCIAL', 'ADMIN'].includes(user?.role || ''),
  };
  
  return permissions;
};