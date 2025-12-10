// src/components/residents/PsychologicalNotes.tsx
import React from 'react';
import { X } from 'lucide-react';

interface PsychologicalNotesProps {
  residentId: string;
  onClose: () => void;
}

const PsychologicalNotes: React.FC<PsychologicalNotesProps> = ({ residentId, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Notas Psicológicas</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p>Notas para residente: {residentId}</p>
        </div>
      </div>
    </div>
  );
};

export default PsychologicalNotes;