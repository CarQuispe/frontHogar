// src/components/residents/ResidentList.tsx
import React from 'react';
import type { Resident } from '../../types/resident.types';
import { User, Phone, Calendar, Edit, Trash2, Eye } from 'lucide-react';
import residentsService from '../../services/residents.service';

interface ResidentListProps {
  residents: Resident[];
  onEdit: (resident: Resident) => void;
  onDelete: (residentId: string) => void;
  onView: (residentId: string) => void;
  loading: boolean;
}

const ResidentList: React.FC<ResidentListProps> = ({ 
  residents, 
  onEdit, 
  onDelete, 
  onView,
  loading 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {residents.map((resident) => {
        const age = residentsService.calculateAge(resident.birthDate);
        const isEgresado = resident.status === 'EGRESADO';
        
        return (
          <div 
            key={resident.id} 
            className={`bg-white rounded-xl shadow-md overflow-hidden border-t-4 ${
              isEgresado ? 'border-orange-500' : 'border-blue-500'
            } hover:shadow-lg transition-shadow`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {resident.firstName} {resident.lastName}
                  </h3>
                  <div className="text-gray-600 mt-1">{age} años</div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onView(resident.id)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Ver perfil"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onEdit(resident)}
                    className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(resident.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                {resident.contactName && (
                  <div className="flex items-center text-gray-700">
                    <User className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm">Contacto: {resident.contactName}</span>
                  </div>
                )}
                
                {resident.contactPhone && (
                  <div className="flex items-center text-gray-700">
                    <Phone className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm">{resident.contactPhone}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-gray-600 text-sm">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                <span>Ingreso: {residentsService.formatDate(resident.admissionDate)}</span>
              </div>
              
              {isEgresado && (
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    Egresado
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResidentList;
