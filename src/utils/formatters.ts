// Formateadores para diferentes tipos de datos

// Formatear RUT chileno (12.345.678-9)
export const formatRUT = (rut: string): string => {
  if (!rut) return '';
  
  // Limpiar el RUT
  const cleanRut = rut.replace(/\./g, '').replace('-', '').toUpperCase();
  
  if (cleanRut.length < 2) return rut;
  
  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);
  
  // Formatear con puntos
  let formatted = '';
  for (let i = body.length; i > 0; i -= 3) {
    const start = Math.max(0, i - 3);
    formatted = '.' + body.slice(start, i) + formatted;
  }
  
  return formatted.slice(1) + '-' + dv;
};

// Formatear teléfono chileno
export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 9) {
    return `+56 ${cleanPhone.slice(0, 1)} ${cleanPhone.slice(1, 5)} ${cleanPhone.slice(5)}`;
  } else if (cleanPhone.length === 12 && cleanPhone.startsWith('56')) {
    return `+${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 3)} ${cleanPhone.slice(3, 7)} ${cleanPhone.slice(7)}`;
  }
  
  return phone;
};

// Formatear fecha (DD/MM/YYYY)
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

// Formatear fecha y hora
export const formatDateTime = (date: string | Date): string => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// Formatear moneda (CLP)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(amount);
};

// Formatear nombre completo (Capitalizar)
export const formatFullName = (firstName: string, lastName: string, middleName?: string): string => {
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  
  const parts = [capitalize(firstName)];
  if (middleName) parts.push(capitalize(middleName));
  parts.push(capitalize(lastName));
  
  return parts.join(' ');
};

// Formatear edad desde fecha de nacimiento
export const formatAge = (birthDate: string | Date): string => {
  if (!birthDate) return '';
  
  const birth = new Date(birthDate);
  const today = new Date();
  
  if (isNaN(birth.getTime())) return '';
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return `${age} años`;
};

// Formatear texto a título (Cada Palabra Capitalizada)
export const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Formatear iniciales
export const getInitials = (name: string): string => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

// Formatear tiempo relativo (hace X tiempo)
export const timeAgo = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  const intervals = {
    año: 31536000,
    mes: 2592000,
    semana: 604800,
    día: 86400,
    hora: 3600,
    minuto: 60,
    segundo: 1
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `hace ${interval} ${unit}${interval !== 1 ? 's' : ''}`;
    }
  }
  
  return 'justo ahora';
};

// Formatear porcentaje
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Truncar texto largo
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Formatear estado booleano
export const formatBoolean = (value: boolean, trueText: string = 'Sí', falseText: string = 'No'): string => {
  return value ? trueText : falseText;
};