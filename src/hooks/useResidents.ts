// src/hooks/useResidents.ts
import { useState, useEffect } from 'react';

interface Resident {
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
}

export const useResidents = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí deberías cargar los residentes desde tu API
    // Por ahora, usaremos datos de ejemplo
    const mockResidents: Resident[] = [
      {
        id: '1',
        firstName: 'Juan',
        lastName: 'Pérez',
        birthDate: '2010-05-15',
        gender: 'MASCULINO',
        contactName: 'María Pérez',
        contactPhone: '+591 12345678',
        admissionDate: '2023-01-15',
        status: 'ACTIVO'
      },
      // Agrega más datos de ejemplo según sea necesario
    ];
    
    setResidents(mockResidents);
    setLoading(false);
  }, []);

  const createResident = async (data: any): Promise<void> => {
    // Implementar la creación de residente
    const newResident: Resident = {
      id: Date.now().toString(),
      ...data,
      status: 'ACTIVO'
    };
    setResidents([...residents, newResident]);
  };

  return {
    residents,
    loading,
    createResident
  };
};