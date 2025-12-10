// src/types/resident.types.ts

export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  contactName: string;
  contactPhone: string;
  admissionDate: string;
  notes?: string;
  status: 'ACTIVO' | 'EGRESADO';
  createdAt?: string;
  updatedAt?: string;
}

export type CreateResidentDTO = Omit<Resident, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateResidentDTO = Partial<CreateResidentDTO>;

export interface ResidentFilters {
  searchTerm?: string;
  status?: 'ACTIVO' | 'EGRESADO' | 'TODOS';
  gender?: string;
  minAge?: number;
  maxAge?: number;
  admissionDateFrom?: string;
  admissionDateTo?: string;
}

export interface ResidentStats {
  total: number;
  active: number;
  egresados: number;
  averageAge: number;
  byGender: {
    MASCULINO: number;
    FEMENINO: number;
    OTRO: number;
  };
  byAgeGroup: {
    '2-5': number;
    '6-12': number;
    '13-18': number;
  };
}