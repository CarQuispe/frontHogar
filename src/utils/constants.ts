// Constantes de la aplicación
// apps/frontend/src/utils/constants.ts

// ===============================
// Roles del sistema
// ===============================
export const USER_ROLES = {
  DIRECTORA: 'DIRECTORA',
  PSICOLOGA: 'PSICOLOGA',
  TRABAJADORA_SOCIAL: 'TRABAJADORA_SOCIAL',
  ADMIN: 'ADMIN',
  VOLUNTARIO: 'VOLUNTARIO'
} as const;

export type UserRole = keyof typeof USER_ROLES;

// ===============================
// Estados de residentes
// ===============================
export const RESIDENT_STATUS = {
  ACTIVE: 'ACTIVO',
  INACTIVE: 'INACTIVO',
  EGRESSED: 'EGRESADO',
  TRANSFERRED: 'TRANSFERIDO'
} as const;

export type ResidentStatus = keyof typeof RESIDENT_STATUS;

// ===============================
// Tipos de documentos
// ===============================
export const DOCUMENT_TYPES = {
  ID: 'CEDULA_IDENTIDAD',
  PASSPORT: 'PASAPORTE',
  BIRTH_CERTIFICATE: 'ACTA_NACIMIENTO',
  OTHER: 'OTRO'
} as const;

export type DocumentType = keyof typeof DOCUMENT_TYPES;

// ===============================
// Niveles de educación
// ===============================
export const EDUCATION_LEVELS = {
  NONE: 'NINGUNA',
  BASIC: 'BASICA',
  MIDDLE: 'MEDIA',
  TECHNICAL: 'TECNICA',
  UNIVERSITY: 'UNIVERSITARIA',
  POSTGRADUATE: 'POSTGRADO'
} as const;

export type EducationLevel = keyof typeof EDUCATION_LEVELS;

// ===============================
// Tipos de sedes
// ===============================
export const SEDE_TYPES = {
  CASA_ACOGIDA: 'CASA_ACOGIDA',
  CENTRO_DIA: 'CENTRO_DIA',
  RESIDENCIA: 'RESIDENCIA',
  OTRO: 'OTRO'
} as const;

export type SedeType = keyof typeof SEDE_TYPES;

// ===============================
// Estados civiles
// ===============================
export const MARITAL_STATUS = {
  SINGLE: 'SOLTERO/A',
  MARRIED: 'CASADO/A',
  DIVORCED: 'DIVORCIADO/A',
  WIDOWED: 'VIUDO/A',
  SEPARATED: 'SEPARADO/A'
} as const;

export type MaritalStatus = keyof typeof MARITAL_STATUS;

// ===============================
// Rutas de la aplicación
// ===============================
export const ROUTES = {
  // 🔹 RUTAS PÚBLICAS
  LOGIN: '/login',
  FORGOT_PASSWORD: '/olvide-contrasena',
  RESET_PASSWORD: '/restablecer-contrasena',
  
  // 🔹 RUTAS PROTEGIDAS
  DASHBOARD: '/dashboard',
  USERS: '/usuarios',
  RESIDENTS: '/residentes',
  PROFILE: '/perfil',
  SEDES: '/sedes',
  REPORTS: '/reportes',
  SETTINGS: '/configuracion',
  
  // 🔹 RUTAS DINÁMICAS
  RESIDENT_DETAIL: (id: string) => `/residentes/${id}`,
  USER_DETAIL: (id: string) => `/usuarios/${id}`,
  SEDE_DETAIL: (id: string) => `/sedes/${id}`,
  REPORT_DETAIL: (id: string) => `/reportes/${id}`,
} as const;

// ===============================
// Colores para estados
// ===============================
export const STATUS_COLORS = {
  ACTIVE: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    dot: 'bg-green-500'
  },
  INACTIVE: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    dot: 'bg-red-500'
  },
  PENDING: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    dot: 'bg-yellow-500'
  },
  WARNING: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
    dot: 'bg-orange-500'
  },
  INFO: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    dot: 'bg-blue-500'
  },
  SUCCESS: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500'
  }
} as const;

// ===============================
// Configuración de paginación
// ===============================
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 20, 50, 100],
  MAX_VISIBLE_PAGES: 5,
  DEFAULT_PAGE: 1
} as const;

// ===============================
// Tiempos en milisegundos
// ===============================
export const TIME_IN_MS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000
} as const;

// ===============================
// Formatos de fecha
// ===============================
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  DISPLAY_FULL: 'DD/MM/YYYY HH:mm:ss',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss',
  API_WITH_TIMEZONE: 'YYYY-MM-DDTHH:mm:ssZ',
  FILE_NAME: 'YYYYMMDD_HHmmss',
  MONTH_YEAR: 'MM/YYYY',
  TIME_ONLY: 'HH:mm'
} as const;

// ===============================
// Tipos MIME permitidos para uploads
// ===============================
export const ALLOWED_MIME_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ],
  ALL: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ]
} as const;

// ===============================
// Tamaños máximos de archivos (en bytes)
// ===============================
export const MAX_FILE_SIZES = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  GENERAL: 15 * 1024 * 1024, // 15MB
  AVATAR: 2 * 1024 * 1024 // 2MB para avatares
} as const;

// ===============================
// Mensajes de error comunes
// ===============================
export const ERROR_MESSAGES = {
  REQUIRED: 'Este campo es requerido',
  INVALID_EMAIL: 'Ingrese un email válido',
  INVALID_PHONE: 'Ingrese un teléfono válido',
  INVALID_RUT: 'Ingrese un RUT válido',
  INVALID_DATE: 'Ingrese una fecha válida',
  PASSWORD_TOO_WEAK: 'La contraseña debe tener al menos 8 caracteres con mayúsculas, minúsculas, números y caracteres especiales',
  PASSWORDS_DONT_MATCH: 'Las contraseñas no coinciden',
  NETWORK_ERROR: 'Error de conexión. Verifique su internet',
  SERVER_ERROR: 'Error del servidor. Intente nuevamente',
  UNAUTHORIZED: 'No autorizado. Inicie sesión nuevamente',
  FORBIDDEN: 'No tiene permisos para realizar esta acción',
  NOT_FOUND: 'Recurso no encontrado',
  VALIDATION_ERROR: 'Error de validación. Revise los datos ingresados',
  FILE_TOO_LARGE: (maxSize: number) => `El archivo excede el tamaño máximo de ${maxSize / 1024 / 1024}MB`,
  INVALID_FILE_TYPE: 'Tipo de archivo no permitido'
} as const;

// ===============================
// Mensajes de éxito comunes
// ===============================
export const SUCCESS_MESSAGES = {
  SAVED: 'Datos guardados exitosamente',
  UPDATED: 'Datos actualizados exitosamente',
  DELETED: 'Registro eliminado exitosamente',
  CREATED: 'Registro creado exitosamente',
  UPLOADED: 'Archivo subido exitosamente',
  LOGGED_IN: 'Inicio de sesión exitoso',
  LOGGED_OUT: 'Sesión cerrada exitosamente',
  PASSWORD_CHANGED: 'Contraseña cambiada exitosamente',
  PROFILE_UPDATED: 'Perfil actualizado exitosamente'
} as const;

// ===============================
// Configuración de API - CORREGIDO DEFINITIVAMENTE
// ===============================
export const API_CONFIG = {
  // 🔹 CRUCIAL: Tu backend en NestJS usa '/api' como prefijo global
  // ✅ DEBE terminar con '/api' para desarrollo local
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // ❌ INCORRECTO (causa timeout):
  // BASE_URL: 'https://backendhogar.onrender.com'
  // BASE_URL: 'http://localhost:3000'
  
  // ✅ Para producción (cuando esté listo):
  // BASE_URL: 'https://backendhogar.onrender.com/api'
  
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  UPLOAD_TIMEOUT: 60000
} as const;

// ===============================
// Configuración de localStorage keys
// ===============================
export const STORAGE_KEYS = {
  // 🔹 Tokens de autenticación
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_EXPIRY: 'tokenExpiry',
  
  // 🔹 Datos de usuario
  USER_DATA: 'user',
  USER_ROLE: 'userRole',
  USER_PERMISSIONS: 'userPermissions',
  
  // 🔹 Preferencias de UI
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  
  // 🔹 Datos de sesión
  LAST_VISITED_PATH: 'last_visited_path',
  RECENT_SEARCHES: 'recent_searches',
  FORM_DRAFTS: 'form_drafts'
} as const;

// ===============================
// Configuración de breakpoints
// ===============================
export const BREAKPOINTS = {
  XS: 0,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const;

// ===============================
// Opciones para selects
// ===============================
export const SELECT_OPTIONS = {
  YES_NO: [
    { value: true, label: 'Sí' },
    { value: false, label: 'No' }
  ],
  GENDERS: [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
    { value: 'OTHER', label: 'Otro' },
    { value: 'PREFER_NOT_TO_SAY', label: 'Prefiero no decirlo' }
  ],
  BLOOD_TYPES: [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
    { value: 'UNKNOWN', label: 'Desconocido' }
  ],
  MARITAL_STATUSES: Object.entries(MARITAL_STATUS).map(([key, value]) => ({
    value: key,
    label: value
  })),
  EDUCATION_LEVELS: Object.entries(EDUCATION_LEVELS).map(([key, value]) => ({
    value: key,
    label: value
  })),
  USER_ROLES: Object.entries(USER_ROLES).map(([key, value]) => ({
    value: key,
    label: value.replace('_', ' ')
  })),
  RESIDENT_STATUSES: Object.entries(RESIDENT_STATUS).map(([key, value]) => ({
    value: key,
    label: value
  })),
  DOCUMENT_TYPES: Object.entries(DOCUMENT_TYPES).map(([key, value]) => ({
    value: key,
    label: value.replace('_', ' ')
  })),
  SEDE_TYPES: Object.entries(SEDE_TYPES).map(([key, value]) => ({
    value: key,
    label: value.replace('_', ' ')
  }))
} as const;

// ===============================
// Endpoints de la API
// ===============================
export const API_ENDPOINTS = {
  // 🔹 AUTENTICACIÓN
  AUTH: {
    LOGIN: '/auth/login',            // Ruta FINAL: http://localhost:3000/api/auth/login
    REGISTER: '/auth/register',      // Ruta FINAL: http://localhost:3000/api/auth/register
    ME: '/auth/me',                  // Ruta FINAL: http://localhost:3000/api/auth/me
    LOGOUT: '/auth/logout',          // Ruta FINAL: http://localhost:3000/api/auth/logout
    REFRESH_TOKEN: '/auth/refresh',  // Ruta FINAL: http://localhost:3000/api/auth/refresh
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_TOKEN: '/auth/verify-token',
    HEALTH: '/auth/health'           // Para probar conexión
  },

  // 🔹 USUARIOS
  USERS: {
    BASE: '/users',                  // Ruta FINAL: http://localhost:3000/api/users
    BY_ID: (id: string) => `/users/${id}`,
    PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    SEARCH: '/users/search',
    STATISTICS: '/users/statistics'
  },

  // 🔹 RESIDENTES
  RESIDENTS: {
    BASE: '/residents',              // Ruta FINAL: http://localhost:3000/api/residents
    BY_ID: (id: string) => `/residents/${id}`,
    CREATE: '/residents',
    UPDATE: (id: string) => `/residents/${id}`,
    DELETE: (id: string) => `/residents/${id}`,
    IMPORT: '/residents/import',
    EXPORT: '/residents/export',
    STATISTICS: '/residents/statistics',
    SEARCH: '/residents/search',
    FILTER: '/residents/filter'
  },

  // 🔹 SEDES
  SEDES: {
    BASE: '/sedes',                  // Ruta FINAL: http://localhost:3000/api/sedes
    BY_ID: (id: string) => `/sedes/${id}`,
    STATISTICS: '/sedes/statistics'
  },

  // 🔹 REPORTES
  REPORTS: {
    BASE: '/reports',                // Ruta FINAL: http://localhost:3000/api/reports
    GENERATE: '/reports/generate',
    TYPES: '/reports/types',
    BY_ID: (id: string) => `/reports/${id}`,
    DOWNLOAD: (id: string) => `/reports/${id}/download`
  },

  // 🔹 UPLOADS
  UPLOADS: {
    BASE: '/uploads',                // Ruta FINAL: http://localhost:3000/api/uploads
    AVATAR: '/uploads/avatar',
    DOCUMENT: '/uploads/document',
    RESIDENT_PHOTO: (id: string) => `/uploads/residents/${id}/photo`
  },

  // 🔹 DASHBOARD
  DASHBOARD: {
    STATS: '/dashboard/stats',       // Ruta FINAL: http://localhost:3000/api/dashboard/stats
    RECENT_ACTIVITIES: '/dashboard/activities',
    CHARTS: '/dashboard/charts'
  }
} as const;

// ===============================
// Constantes de validación
// ===============================
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  RUT_REGEX: /^\d{1,8}-[\dkK]$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  NAME_REGEX: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  NUMERIC_REGEX: /^\d+$/
} as const;

// ===============================
// Navegación del dashboard
// ===============================
export const NAVIGATION = {
  SIDEBAR: [
    {
      title: 'Dashboard',
      icon: 'Home',
      path: ROUTES.DASHBOARD,
      roles: Object.keys(USER_ROLES) as UserRole[]
    },
    {
      title: 'Residentes',
      icon: 'Users',
      path: ROUTES.RESIDENTS,
      roles: ['DIRECTORA', 'PSICOLOGA', 'TRABAJADORA_SOCIAL', 'ADMIN']
    },
    {
      title: 'Usuarios',
      icon: 'UserCog',
      path: ROUTES.USERS,
      roles: ['DIRECTORA', 'ADMIN']
    },
    {
      title: 'Sedes',
      icon: 'Building',
      path: ROUTES.SEDES,
      roles: ['DIRECTORA', 'ADMIN']
    },
    {
      title: 'Reportes',
      icon: 'FileText',
      path: ROUTES.REPORTS,
      roles: ['DIRECTORA', 'PSICOLOGA', 'TRABAJADORA_SOCIAL', 'ADMIN']
    },
    {
      title: 'Configuración',
      icon: 'Settings',
      path: ROUTES.SETTINGS,
      roles: ['DIRECTORA', 'ADMIN']
    }
  ]
} as const;

// ===============================
// Exportar todos los tipos
// ===============================
export type ApiEndpoint = typeof API_ENDPOINTS;
export type Route = typeof ROUTES;
export type StatusColor = keyof typeof STATUS_COLORS;
export type SelectOption = typeof SELECT_OPTIONS;