// src/services/residents.service.ts

// CORREGIDO: Una sola línea de importación
import  type{ Resident, CreateResidentDTO, UpdateResidentDTO }  from '../types/resident.types';

/**
 * Servicio para manejar todas las operaciones relacionadas con residentes
 * Incluye funciones de utilidad, filtrado, cálculo y gestión de datos
 */

// ============================================
// 1. FUNCIONES DE FORMATO Y CÁLCULO
// ============================================

/**
 * Formatea una fecha para mostrar en formato legible
 * @param dateString - Fecha en formato ISO string
 * @returns Fecha formateada en español
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    return date.toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return dateString;
  }
};

/**
 * Formatea una fecha para input type="date" (YYYY-MM-DD)
 * @param dateString - Fecha en cualquier formato
 * @returns Fecha en formato YYYY-MM-DD
 */
export const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formateando fecha para input:', error);
    return '';
  }
};

/**
 * Calcula la edad exacta a partir de la fecha de nacimiento
 * @param birthDate - Fecha de nacimiento en formato ISO string
 * @returns Edad en años
 */
export const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  
  try {
    const birth = new Date(birthDate);
    const today = new Date();
    
    // Verificar fechas válidas
    if (isNaN(birth.getTime())) {
      return 0;
    }
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    // Si no ha pasado el mes de cumpleaños este año, restar un año
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return Math.max(0, age); // No devolver edades negativas
  } catch (error) {
    console.error('Error calculando edad:', error);
    return 0;
  }
};

/**
 * Obtiene la fecha de nacimiento para una edad específica
 * @param age - Edad deseada
 * @returns Fecha de nacimiento aproximada
 */
export const getBirthDateForAge = (age: number): string => {
  const today = new Date();
  const birthYear = today.getFullYear() - age;
  const birthDate = new Date(birthYear, today.getMonth(), today.getDate());
  return birthDate.toISOString().split('T')[0];
};

/**
 * Valida si un residente es mayor de edad
 * @param birthDate - Fecha de nacimiento
 * @returns true si es mayor de 18 años
 */
export const isAdult = (birthDate: string): boolean => {
  return calculateAge(birthDate) >= 18;
};

/**
 * Valida si un residente está en el rango de edad del hogar (2-18 años)
 * @param birthDate - Fecha de nacimiento
 * @returns true si está en el rango válido
 */
export const isValidAgeRange = (birthDate: string): boolean => {
  const age = calculateAge(birthDate);
  return age >= 2 && age <= 18;
};

// ============================================
// 2. FUNCIONES DE FORMATO DE DATOS
// ============================================

/**
 * Formatea un número de teléfono para mostrar
 * @param phone - Número de teléfono
 * @returns Teléfono formateado
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  try {
    // Eliminar caracteres no numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 0) return '';
    
    // Formato para Bolivia
    if (cleaned.length === 8) {
      // Ejemplo: 71234567 -> 7123 4567
      return `${cleaned.substring(0, 4)} ${cleaned.substring(4)}`;
    } else if (cleaned.startsWith('591') && cleaned.length === 11) {
      // Ejemplo: 59171234567 -> +591 7123 4567
      return `+591 ${cleaned.substring(3, 7)} ${cleaned.substring(7)}`;
    } else if (cleaned.length === 9) {
      // Ejemplo: 712345678 -> 712 345 678
      return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
    }
    
    // Si no coincide con ningún formato, devolver original
    return phone;
  } catch (error) {
    console.error('Error formateando teléfono:', error);
    return phone;
  }
};

/**
 * Obtiene el nombre completo de un residente
 * @param resident - Objeto residente o nombre/apellido
 * @returns Nombre completo
 */
export const getFullName = (
  resident: Resident | { firstName: string; lastName: string }
): string => {
  if (!resident) return '';
  
  const firstName = 'firstName' in resident ? resident.firstName : '';
  const lastName = 'lastName' in resident ? resident.lastName : '';
  
  return `${firstName} ${lastName}`.trim();
};

/**
 * Obtiene las iniciales del nombre
 * @param firstName - Nombre
 * @param lastName - Apellido
 * @returns Iniciales (ej: "JP" para Juan Pérez)
 */
export const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.charAt(0) || '';
  const last = lastName?.charAt(0) || '';
  return `${first}${last}`.toUpperCase();
};

/**
 * Formatea el género para mostrar
 * @param gender - Código de género
 * @returns Género formateado
 */
export const formatGender = (gender: string): string => {
  const genderMap: Record<string, string> = {
    'MASCULINO': 'Masculino',
    'FEMENINO': 'Femenino',
    'OTRO': 'Otro',
    'M': 'Masculino',
    'F': 'Femenino',
    'O': 'Otro'
  };
  
  return genderMap[gender] || gender;
};

// ============================================
// 3. FUNCIONES DE FILTRADO Y BÚSQUEDA
// ============================================

/**
 * Filtra residentes por múltiples criterios
 */
export const filterResidents = (
  residents: Resident[],
  filters: {
    searchTerm?: string;
    status?: 'ACTIVO' | 'EGRESADO' | 'TODOS';
    gender?: string;
    minAge?: number;
    maxAge?: number;
    admissionDateFrom?: string;
    admissionDateTo?: string;
  }
): Resident[] => {
  if (!residents || residents.length === 0) {
    return [];
  }
  
  return residents.filter(resident => {
    // Filtro por término de búsqueda
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase().trim();
      if (searchLower) {
        const fullName = getFullName(resident).toLowerCase();
        const contactName = resident.contactName?.toLowerCase() || '';
        const notes = resident.notes?.toLowerCase() || '';
        
        const matchesSearch = 
          fullName.includes(searchLower) ||
          contactName.includes(searchLower) ||
          notes.includes(searchLower) ||
          resident.contactPhone?.includes(searchLower);
        
        if (!matchesSearch) {
          return false;
        }
      }
    }
    
    // Filtro por estado
    if (filters.status && filters.status !== 'TODOS') {
      if (resident.status !== filters.status) {
        return false;
      }
    }
    
    // Filtro por género
    if (filters.gender && filters.gender !== 'TODOS') {
      if (resident.gender !== filters.gender) {
        return false;
      }
    }
    
    // Filtro por edad
    const age = calculateAge(resident.birthDate);
    if (filters.minAge !== undefined && age < filters.minAge) {
      return false;
    }
    if (filters.maxAge !== undefined && age > filters.maxAge) {
      return false;
    }
    
    // Filtro por fecha de ingreso
    if (filters.admissionDateFrom) {
      const admissionDate = new Date(resident.admissionDate);
      const fromDate = new Date(filters.admissionDateFrom);
      
      if (admissionDate < fromDate) {
        return false;
      }
    }
    
    if (filters.admissionDateTo) {
      const admissionDate = new Date(resident.admissionDate);
      const toDate = new Date(filters.admissionDateTo);
      
      if (admissionDate > toDate) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Ordena residentes por diferentes criterios
 */
export const sortResidents = (
  residents: Resident[],
  sortBy: 'name' | 'age' | 'admissionDate' | 'status',
  order: 'asc' | 'desc' = 'asc'
): Resident[] => {
  const sorted = [...residents];
  
  sorted.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        const nameA = getFullName(a).toLowerCase();
        const nameB = getFullName(b).toLowerCase();
        comparison = nameA.localeCompare(nameB);
        break;
        
      case 'age':
        const ageA = calculateAge(a.birthDate);
        const ageB = calculateAge(b.birthDate);
        comparison = ageA - ageB;
        break;
        
      case 'admissionDate':
        const dateA = new Date(a.admissionDate).getTime();
        const dateB = new Date(b.admissionDate).getTime();
        comparison = dateA - dateB;
        break;
        
      case 'status':
        const statusOrder = { 'ACTIVO': 1, 'EGRESADO': 2 };
        comparison = (statusOrder[a.status] || 3) - (statusOrder[b.status] || 3);
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
};

// ============================================
// 4. FUNCIONES DE VALIDACIÓN
// ============================================

/**
 * Valida los datos de un residente antes de guardar
 */
export const validateResident = (resident: CreateResidentDTO): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  // Validar nombre
  if (!resident.firstName?.trim()) {
    errors.push('El nombre es requerido');
  } else if (resident.firstName.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  }
  
  // Validar apellido
  if (!resident.lastName?.trim()) {
    errors.push('El apellido es requerido');
  } else if (resident.lastName.trim().length < 2) {
    errors.push('El apellido debe tener al menos 2 caracteres');
  }
  
  // Validar fecha de nacimiento
  if (!resident.birthDate) {
    errors.push('La fecha de nacimiento es requerida');
  } else {
    const age = calculateAge(resident.birthDate);
    if (age < 2) {
      errors.push('El residente debe tener al menos 2 años');
    } else if (age > 18) {
      errors.push('El residente no puede tener más de 18 años');
    }
  }
  
  // Validar género
  const validGenders = ['MASCULINO', 'FEMENINO', 'OTRO'];
  if (!resident.gender || !validGenders.includes(resident.gender)) {
    errors.push('Género inválido');
  }
  
  // Validar contacto
  if (!resident.contactName?.trim()) {
    errors.push('El nombre de contacto es requerido');
  }
  
  // Validar teléfono
  if (!resident.contactPhone?.trim()) {
    errors.push('El teléfono de contacto es requerido');
  } else if (resident.contactPhone.replace(/\D/g, '').length < 7) {
    errors.push('El teléfono debe tener al menos 7 dígitos');
  }
  
  // Validar fecha de ingreso
  if (!resident.admissionDate) {
    errors.push('La fecha de ingreso es requerida');
  } else {
    const admissionDate = new Date(resident.admissionDate);
    const birthDate = new Date(resident.birthDate);
    
    if (admissionDate < birthDate) {
      errors.push('La fecha de ingreso no puede ser anterior a la fecha de nacimiento');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ============================================
// 5. FUNCIONES DE TRANSFORMACIÓN DE DATOS
// ============================================

/**
 * Prepara datos para enviar a la API
 */
export const prepareResidentForAPI = (
  data: CreateResidentDTO | UpdateResidentDTO
): any => {
  const cleanData = { ...data };
  
  // Limpiar strings
  if (cleanData.firstName) cleanData.firstName = cleanData.firstName.trim();
  if (cleanData.lastName) cleanData.lastName = cleanData.lastName.trim();
  if (cleanData.contactName) cleanData.contactName = cleanData.contactName.trim();
  if (cleanData.contactPhone) {
    // Mantener solo números
    cleanData.contactPhone = cleanData.contactPhone.replace(/\D/g, '');
  }
  if (cleanData.notes) cleanData.notes = cleanData.notes.trim();
  
  return cleanData;
};

/**
 * Calcula estadísticas de residentes
 */
export const calculateResidentStats = (residents: Resident[]) => {
  const stats = {
    total: residents.length,
    active: 0,
    egresados: 0,
    averageAge: 0,
    byGender: {
      MASCULINO: 0,
      FEMENINO: 0,
      OTRO: 0
    },
    byAgeGroup: {
      '2-5': 0,
      '6-12': 0,
      '13-18': 0
    }
  };
  
  let totalAge = 0;
  
  residents.forEach(resident => {
    // Contar por estado
    if (resident.status === 'ACTIVO') {
      stats.active++;
    } else {
      stats.egresados++;
    }
    
    // Contar por género
    stats.byGender[resident.gender as keyof typeof stats.byGender] =
      (stats.byGender[resident.gender as keyof typeof stats.byGender] || 0) + 1;
    
    // Calcular edad y agrupar
    const age = calculateAge(resident.birthDate);
    totalAge += age;
    
    if (age >= 2 && age <= 5) {
      stats.byAgeGroup['2-5']++;
    } else if (age >= 6 && age <= 12) {
      stats.byAgeGroup['6-12']++;
    } else if (age >= 13 && age <= 18) {
      stats.byAgeGroup['13-18']++;
    }
  });
  
  // Calcular edad promedio
  stats.averageAge = stats.total > 0 ? Math.round(totalAge / stats.total) : 0;
  
  return stats;
};

// ============================================
// 6. DATOS DE EJEMPLO PARA DESARROLLO
// ============================================

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
    notes: 'Alergia a la penicilina. Le gusta leer y pintar.',
    status: 'ACTIVO',
    createdAt: '2023-01-10T10:00:00Z',
    updatedAt: '2023-01-10T10:00:00Z'
  },
  {
    id: '2',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    birthDate: '2010-07-22',
    gender: 'MASCULINO',
    contactName: 'Juan Rodríguez',
    contactPhone: '78765432',
    admissionDate: '2022-11-05',
    notes: 'Requiere atención psicológica semanal. Buen desempeño escolar.',
    status: 'ACTIVO',
    createdAt: '2022-11-05T14:30:00Z',
    updatedAt: '2023-06-15T09:20:00Z'
  },
  {
    id: '3',
    firstName: 'Lucía',
    lastName: 'Fernández',
    birthDate: '2015-11-30',
    gender: 'FEMENINO',
    contactName: 'Pedro Fernández',
    contactPhone: '65551234',
    admissionDate: '2024-02-20',
    notes: 'Nueva residente. En proceso de adaptación.',
    status: 'ACTIVO',
    createdAt: '2024-02-20T08:15:00Z',
    updatedAt: '2024-02-20T08:15:00Z'
  },
  {
    id: '4',
    firstName: 'Miguel',
    lastName: 'López',
    birthDate: '2008-05-18',
    gender: 'MASCULINO',
    contactName: 'Ana López',
    contactPhone: '74445678',
    admissionDate: '2021-08-15',
    notes: 'Egresó para reunificación familiar. Mantener seguimiento.',
    status: 'EGRESADO',
    createdAt: '2021-08-15T11:45:00Z',
    updatedAt: '2023-12-10T16:20:00Z'
  },
  {
    id: '5',
    firstName: 'Sofía',
    lastName: 'Martínez',
    birthDate: '2014-09-12',
    gender: 'FEMENINO',
    contactName: 'Roberto Martínez',
    contactPhone: '69998877',
    admissionDate: '2023-03-25',
    notes: 'Participa en actividades deportivas. Excelente comportamiento.',
    status: 'ACTIVO',
    createdAt: '2023-03-25T09:10:00Z',
    updatedAt: '2023-10-05T14:35:00Z'
  },
  {
    id: '6',
    firstName: 'Diego',
    lastName: 'Pérez',
    birthDate: '2011-02-28',
    gender: 'MASCULINO',
    contactName: 'Claudia Pérez',
    contactPhone: '76665544',
    admissionDate: '2022-06-18',
    notes: 'Necesita apoyo en matemáticas. Asiste a tutorías.',
    status: 'ACTIVO',
    createdAt: '2022-06-18T13:20:00Z',
    updatedAt: '2023-11-30T10:45:00Z'
  }
];

// ============================================
// 7. FUNCIONES DE EXPORTACIÓN
// ============================================

/**
 * Exporta residentes a formato CSV
 */
export const exportToCSV = (residents: Resident[]): string => {
  const headers = [
    'ID',
    'Nombre',
    'Apellido',
    'Fecha Nacimiento',
    'Edad',
    'Género',
    'Contacto',
    'Teléfono',
    'Fecha Ingreso',
    'Estado',
    'Notas'
  ];
  
  const rows = residents.map(resident => [
    resident.id,
    resident.firstName,
    resident.lastName,
    formatDate(resident.birthDate),
    calculateAge(resident.birthDate).toString(),
    formatGender(resident.gender),
    resident.contactName,
    formatPhoneNumber(resident.contactPhone),
    formatDate(resident.admissionDate),
    resident.status === 'ACTIVO' ? 'Activo' : 'Egresado',
    resident.notes || ''
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
};

// ============================================
// 8. OBJETO PRINCIPAL DEL SERVICIO
// ============================================

const residentsService = {
  // Funciones de formato y cálculo
  formatDate,
  formatDateForInput,
  calculateAge,
  getBirthDateForAge,
  isAdult,
  isValidAgeRange,
  
  // Funciones de formato de datos
  formatPhoneNumber,
  getFullName,
  getInitials,
  formatGender,
  
  // Funciones de filtrado y búsqueda
  filterResidents,
  sortResidents,
  
  // Funciones de validación
  validateResident,
  
  // Funciones de transformación
  prepareResidentForAPI,
  calculateResidentStats,
  
  // Datos de ejemplo
  mockResidents,
  
  // Exportación
  exportToCSV
};

export default residentsService;