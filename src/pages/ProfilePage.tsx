import React, { useState } from 'react';
import { useAuth} from '../context/AuthContext';
import type { UserRole } from '../types/user.types';
import { User, Mail, Shield, Calendar, Edit, Save, X } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth(); // obtener el usuario completo
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.nombre || '',
    email: user?.email || '',
  });

  const handleSave = () => {
    alert('Cambios guardados (demo, sin API)');
    setIsEditing(false);
  };

  const roleDisplayMap: Record<UserRole, string> = {
    DIRECTORA: 'Directora',
    PSICOLOGA: 'Psicóloga',
    TRABAJADORA_SOCIAL: 'Trabajadora Social',
    ADMIN: 'Administradora',
    VOLUNTARIO: 'Voluntario/a',
  };

  const allRolesDisplay = user?.role
    ? roleDisplayMap[user.role]
    : 'Sin rol asignado';

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
                {user?.nombre?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user?.nombre || 'Usuario'}</h1>
                <p className="text-blue-100 mt-1">{allRolesDisplay}</p>
                <p className="text-blue-200 mt-2">Hogar Santa Emilia</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50"
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" />
                  Cancelar
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  Editar Perfil
                </>
              )}
            </button>
          </div>
        </div>

        {/* Información Personal */}
        <div className="p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Información Personal
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-700">Nombre completo</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-900">{user?.nombre}</p>
              )}
            </div>

            {/* Email */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-700">Correo electrónico</span>
              </div>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
              )}
            </div>

            {/* Roles */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-700">Roles en el sistema</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 font-medium rounded-full text-sm">
                  {allRolesDisplay}
                </span>
              </div>
            </div>

            {/* Miembro desde */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-700">Miembro desde</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString('es-BO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {isEditing && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
              >
                <Save className="w-5 h-5" />
                Guardar Cambios
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
