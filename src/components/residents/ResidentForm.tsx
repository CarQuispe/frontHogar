import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

const residentSchema = z.object({
  firstName: z.string().min(2, 'Nombre es requerido'),
  lastName: z.string().min(2, 'Apellido es requerido'),
  birthDate: z.string().refine((val) => {
    const birthDate = new Date(val);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 2 && age <= 18;
  }, 'La edad debe estar entre 2 y 18 años'),
  gender: z.enum(['MASCULINO', 'FEMENINO', 'OTRO']),
  contactName: z.string().min(2, 'Nombre de contacto es requerido'),
  contactPhone: z.string().min(8, 'Teléfono es requerido'),
  admissionDate: z.string().min(1, 'Fecha de ingreso es requerida'),
  notes: z.string().optional(),
});

type ResidentFormData = z.infer<typeof residentSchema>;

interface ResidentFormProps {
  onSubmit: (data: ResidentFormData) => Promise<void>;
  onCancel: () => void;
}

const ResidentForm: React.FC<ResidentFormProps> = ({ onSubmit, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResidentFormData>({
    resolver: zodResolver(residentSchema),
    defaultValues: {
      gender: 'FEMENINO',
      admissionDate: new Date().toISOString().split('T')[0],
    },
  });

  const handleFormSubmit = async (data: ResidentFormData) => {
    setIsLoading(true);
    setError('');
    try {
      await onSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Error al guardar residente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Registrar Nuevo Residente</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500 p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-4 border border-red-200">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                {...register('firstName')}
                type="text"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.firstName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nombre"
              />
              {errors.firstName && (
                <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellidos *
              </label>
              <input
                {...register('lastName')}
                type="text"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Apellidos"
              />
              {errors.lastName && (
                <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Nacimiento *
              </label>
              <input
                {...register('birthDate')}
                type="date"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.birthDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.birthDate && (
                <p className="mt-2 text-sm text-red-600">{errors.birthDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Género *
              </label>
              <select
                {...register('gender')}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.gender ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="FEMENINO">Femenino</option>
                <option value="MASCULINO">Masculino</option>
                <option value="OTRO">Otro</option>
              </select>
              {errors.gender && (
                <p className="mt-2 text-sm text-red-600">{errors.gender.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contacto de Emergencia *
              </label>
              <input
                {...register('contactName')}
                type="text"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.contactName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nombre del contacto"
              />
              {errors.contactName && (
                <p className="mt-2 text-sm text-red-600">{errors.contactName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono de Contacto *
              </label>
              <input
                {...register('contactPhone')}
                type="tel"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.contactPhone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="+591 12345678"
              />
              {errors.contactPhone && (
                <p className="mt-2 text-sm text-red-600">{errors.contactPhone.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Ingreso *
            </label>
            <input
              {...register('admissionDate')}
              type="date"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.admissionDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.admissionDate && (
              <p className="mt-2 text-sm text-red-600">{errors.admissionDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas Adicionales
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Información adicional sobre el residente..."
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Guardando...' : 'Guardar Residente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResidentForm;