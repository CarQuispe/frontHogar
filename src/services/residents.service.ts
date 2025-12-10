// src/services/residents.service.ts
import type { Resident } from '../types/resident.types';

export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-BO');
};

export const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const mockResidents: Resident[] = [
  {
    id: '1',
    firstName: 'Ana',
    lastName: 'García',
    birthDate: '2012-03-15',
    gender: 'FEMENINO',
    contactName: 'María García',
    contactPhone: '71234567',
    admissionDate: '2023-01-10',
    notes: 'Notas...',
    status: 'ACTIVO'
  }
];

export default {
  formatDate,
  calculateAge,
  mockResidents
};