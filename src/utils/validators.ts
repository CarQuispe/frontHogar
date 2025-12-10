// Validaciones para formularios

// Validar email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar teléfono chileno (opcional con +56)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+56)?[2-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

// Validar RUT chileno
export const isValidRUT = (rut: string): boolean => {
  // Eliminar puntos y guión
  const cleanRut = rut.replace(/\./g, '').replace('-', '').toUpperCase();
  
  if (cleanRut.length < 2) return false;
  
  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);
  
  // Validar que el cuerpo sean solo números
  if (!/^\d+$/.test(body)) return false;
  
  // Calcular dígito verificador
  let sum = 0;
  let multiplier = 2;
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body.charAt(i)) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const expectedDv = 11 - (sum % 11);
  let calculatedDv: string;
  
  if (expectedDv === 11) calculatedDv = '0';
  else if (expectedDv === 10) calculatedDv = 'K';
  else calculatedDv = expectedDv.toString();
  
  return calculatedDv === dv;
};

// Validar fecha (mayor de edad)
export const isAdult = (birthDate: string | Date, minAge: number = 18): boolean => {
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= minAge;
  }
  return age >= minAge;
};

// Validar que no esté vacío
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Validar longitud mínima
export const minLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

// Validar longitud máxima
export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

// Validar contraseña segura
export const isStrongPassword = (password: string): boolean => {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};

// Validar URL
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validar número positivo
export const isPositiveNumber = (value: number | string): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num >= 0;
};

// Validar fecha futura
export const isFutureDate = (date: Date): boolean => {
  return date > new Date();
};

// Validar fecha pasada
export const isPastDate = (date: Date): boolean => {
  return date < new Date();
};

// Validaciones compuestas para formularios
export const formValidators = {
  email: (value: string) => ({
    isValid: isValidEmail(value),
    message: 'Ingrese un email válido'
  }),
  
  password: (value: string) => ({
    isValid: isStrongPassword(value),
    message: 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales'
  }),
  
  required: (value: string) => ({
    isValid: isRequired(value),
    message: 'Este campo es requerido'
  }),
  
  phone: (value: string) => ({
    isValid: isValidPhone(value),
    message: 'Ingrese un teléfono válido (ej: 912345678)'
  }),
  
  rut: (value: string) => ({
    isValid: isValidRUT(value),
    message: 'Ingrese un RUT válido'
  }),
  
  minLength: (value: string, min: number) => ({
    isValid: minLength(value, min),
    message: `Mínimo ${min} caracteres`
  }),
  
  maxLength: (value: string, max: number) => ({
    isValid: maxLength(value, max),
    message: `Máximo ${max} caracteres`
  })
};