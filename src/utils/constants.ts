// Constantes de la aplicación

// Roles del sistema
export const USER_ROLES = {
  DIRECTORA: 'DIRECTORA',
  PSICOLOGA: 'PSICOLOGA',
  TRABAJADORA_SOCIAL: 'TRABAJADORA_SOCIAL',
  ADMIN: 'ADMIN',
  VOLUNTARIO: 'VOLUNTARIO'
} as const;

export type UserRole = keyof typeof USER_ROLES;

// Estados de residentes
export const RESIDENT_STATUS = {
  ACTIVE: 'ACTIVO',
  INACTIVE: 'INACTIVO',
  EGRESSED: 'EGRESADO',
  TRANSFERRED: 'TRANSFERIDO'
} as const;

// Tipos de documentos
export const DOCUMENT_TYPES = {
  ID: 'CEDULA_IDENTIDAD',
  PASSPORT: 'PASAPORTE',
  BIRTH_CERTIFICATE: 'ACTA_NACIMIENTO',
  OTHER: 'OTRO'
} as const;

// Niveles de educación
export const EDUCATION_LEVELS = {
  NONE: 'NINGUNA',
  BASIC: 'BASICA',
  MIDDLE: 'MEDIA',
  TECHNICAL: 'TECNICA',
  UNIVERSITY: 'UNIVERSITARIA',
  POSTGRADUATE: 'POSTGRADO'
} as const;

// Tipos de sedes
export const SEDE_TYPES = {
  CASA_ACOGIDA: 'CASA_ACOGIDA',
  CENTRO_DIA: 'CENTRO_DIA',
  RESIDENCIA: 'RESIDENCIA',
  OTRO: 'OTRO'
} as const;

// Estados civiles
export const MARITAL_STATUS = {
  SINGLE: 'SOLTERO/A',
  MARRIED: 'CASADO/A',
  DIVORCED: 'DIVORCIADO/A',
  WIDOWED: 'VIUDO/A',
  SEPARATED: 'SEPARADO/A'
} as const;

// Rutas de la aplicación
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/usuarios',
  RESIDENTS: '/residentes',
  PROFILE: '/perfil',
  SEDES: '/sedes',
  REPORTS: '/reportes',
  SETTINGS: '/configuracion'
} as const;

// Colores para estados
export const STATUS_COLORS = {
  ACTIVE: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200'
  },
  INACTIVE: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200'
  },
  PENDING: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200'
  },
  WARNING: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200'
  },
  INFO: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200'
  }
} as const;

// Configuración de paginación
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 20, 50],
  MAX_VISIBLE_PAGES: 5
} as const;

// Tiempos en milisegundos
export const TIME_IN_MS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000
} as const;

// Formatos de fecha
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss',
  FILE_NAME: 'YYYYMMDD_HHmmss'
} as const;

// Tipos MIME permitidos para uploads
export const ALLOWED_MIME_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ],
  ALL: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
} as const;

// Tamaños máximos de archivos (en bytes)
export const MAX_FILE_SIZES = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  GENERAL: 15 * 1024 * 1024 // 15MB
} as const;

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  REQUIRED: 'Este campo es requerido',
  INVALID_EMAIL: 'Ingrese un email válido',
  INVALID_PHONE: 'Ingrese un teléfono válido',
  INVALID_RUT: 'Ingrese un RUT válido',
  PASSWORD_TOO_WEAK: 'La contraseña debe tener al menos 8 caracteres con mayúsculas, minúsculas, números y caracteres especiales',
  PASSWORDS_DONT_MATCH: 'Las contraseñas no coinciden',
  NETWORK_ERROR: 'Error de conexión. Verifique su internet',
  SERVER_ERROR: 'Error del servidor. Intente nuevamente',
  UNAUTHORIZED: 'No autorizado. Inicie sesión nuevamente',
  NOT_FOUND: 'Recurso no encontrado',
  VALIDATION_ERROR: 'Error de validación. Revise los datos ingresados'
} as const;

// Configuración de API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
} as const;

// Configuración de localStorage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_SEARCHES: 'recent_searches'
} as const;

// Configuración de breakpoints (Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const;

// Opciones para selects
export const SELECT_OPTIONS = {
  YES_NO: [
    { value: true, label: 'Sí' },
    { value: false, label: 'No' }
  ],
  GENDERS: [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
    { value: 'OTHER', label: 'Otro' }
  ],
  BLOOD_TYPES: [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ]
} as const;