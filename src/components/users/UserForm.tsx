// src/components/users/UserForm.tsx
import React, { useEffect, useState } from 'react';
import type { User, CreateUserDto, UserRole } from '../../types/user.types';
import { X } from 'lucide-react';

interface Props {
  user?: User | null;
  onSubmit: (data: CreateUserDto | Partial<User>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

// Definir un tipo para el formulario
interface UserFormData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rut: string;
  telefono: string;
  role: UserRole;
  sedeId: string;
  isActive: boolean;
}

const defaultForm: UserFormData = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  rut: '',
  telefono: '',
  role: 'VOLUNTARIO',
  sedeId: '',
  isActive: true,
};

const UserForm: React.FC<Props> = ({ user, onSubmit, onCancel, isEditing = false }) => {
  const [form, setForm] = useState<UserFormData>(defaultForm);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 🔁 Cargar datos si es edición
  useEffect(() => {
    if (user) {
      setForm({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        password: '', // No cargamos contraseña por seguridad
        rut: user.rut || '',
        telefono: user.telefono || '',
        role: user.role,
        sedeId: user.sedeId || '',
        isActive: user.isActive,
      });
    } else {
      setForm(defaultForm);
    }
  }, [user]);

  // Validar contraseña al crear usuario
  useEffect(() => {
    if (!isEditing && form.password && confirmPassword) {
      if (form.password !== confirmPassword) {
        setPasswordError('Las contraseñas no coinciden');
      } else if (form.password.length < 6) {
        setPasswordError('La contraseña debe tener al menos 6 caracteres');
      } else {
        setPasswordError('');
      }
    }
  }, [form.password, confirmPassword, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!form.nombre || !form.email || !form.role) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    // Validar contraseña para nuevo usuario
    if (!isEditing && (!form.password || passwordError)) {
      alert('Por favor ingrese una contraseña válida');
      return;
    }

    // Preparar datos para enviar
    const submitData: any = {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      email: form.email.trim(),
      role: form.role,
      isActive: form.isActive,
    };

    // Solo incluir campos si tienen valor
    if (form.rut.trim()) submitData.rut = form.rut.trim();
    if (form.telefono.trim()) submitData.telefono = form.telefono.trim();
    if (form.sedeId.trim()) submitData.sedeId = form.sedeId.trim();
    
    // Solo incluir contraseña si es creación o si se cambió en edición
    if (!isEditing || form.password) {
      submitData.password = form.password;
    }

    onSubmit(submitData);
  };

  const handleInputChange = (field: keyof UserFormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Lista de roles para el select
  const roleOptions = [
    { value: 'DIRECTORA', label: 'Directora' },
    { value: 'PSICOLOGA', label: 'Psicóloga' },
    { value: 'TRABAJADORA_SOCIAL', label: 'Trabajadora Social' },
    { value: 'ADMIN', label: 'Administrador/a' },
    { value: 'VOLUNTARIO', label: 'Voluntario/a' }
  ];

  // Lista de sedes (deberías obtener esto de tu backend)
  const sedeOptions = [
    { value: 'sede1', label: 'Sede Central' },
    { value: 'sede2', label: 'Sede Norte' },
    { value: 'sede3', label: 'Sede Sur' }
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-xl p-6 shadow-lg max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Editar usuario' : 'Nuevo usuario'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {isEditing ? 'Actualiza la información del usuario' : 'Complete todos los campos requeridos'}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Campos en dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna 1: Información personal */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Información personal</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: María"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                value={form.apellido}
                onChange={(e) => handleInputChange('apellido', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: González"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RUT
              </label>
              <input
                type="text"
                value={form.rut}
                onChange={(e) => handleInputChange('rut', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 12.345.678-9"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={form.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: +569 1234 5678"
              />
            </div>
          </div>

          {/* Columna 2: Información de cuenta */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Información de cuenta</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.role}
                onChange={(e) => handleInputChange('role', e.target.value as UserRole)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sede
              </label>
              <select
                value={form.sedeId}
                onChange={(e) => handleInputChange('sedeId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar sede</option>
                {sedeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Contraseña */}
            {!isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mínimo 6 caracteres"
                />
                <div className="mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirmar contraseña"
                  />
                  {passwordError && (
                    <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                  )}
                </div>
                <label className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                  />
                  Mostrar contraseña
                </label>
              </div>
            )}

            {/* Cambio de contraseña en edición */}
            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva contraseña (opcional)
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Dejar en blanco para no cambiar"
                />
                <label className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                  />
                  Mostrar contraseña
                </label>
              </div>
            )}

            {/* Estado activo (solo en edición) */}
            {isEditing && (
              <div className="pt-2">
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700">Usuario activo</span>
                  <span className="text-gray-500 text-sm">(El usuario podrá acceder al sistema)</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Notas */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Nota:</span> Los campos marcados con <span className="text-red-500">*</span> son obligatorios.
            {isEditing && " Para cambiar la contraseña, ingrese una nueva. De lo contrario, déjelo en blanco."}
          </p>
        </div>

        {/* Acciones */}
        <div className="mt-8 flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!isEditing && passwordError ? true : false}
            className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
              !isEditing && passwordError
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isEditing ? 'Actualizar usuario' : 'Crear usuario'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;