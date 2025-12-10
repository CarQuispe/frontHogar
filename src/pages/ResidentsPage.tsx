import React, { useState } from "react";
import { Eye, Edit3, X } from "lucide-react";

// Tipos
interface Resident {
  id: number;
  name: string;
  age: number;
  gender: "Masculino" | "Femenino";
  status: "Activo" | "En Transición" | "Egresado";
  ingreso: string;
  encargado: string;
  emoji: string;
}

// Colores según estado
const statusColors: Record<Resident["status"], string> = {
  Activo: "text-green-600",
  "En Transición": "text-orange-500",
  Egresado: "text-gray-500",
};

const ResidentsPage: React.FC = () => {
  const [residents, setResidents] = useState<Resident[]>([
    {
      id: 1,
      name: "Juan Carlos Pérez",
      age: 12,
      gender: "Masculino",
      status: "Activo",
      ingreso: "19/03/2023",
      encargado: "Ana Torres",
      emoji: "👦",
    },
    {
      id: 2,
      name: "María Fernanda López",
      age: 6,
      gender: "Femenino",
      status: "Activo",
      ingreso: "14/01/2024",
      encargado: "Luis Fernández",
      emoji: "👧",
    },
    {
      id: 3,
      name: "Sofía Martínez",
      age: 10,
      gender: "Femenino",
      status: "En Transición",
      ingreso: "21/08/2023",
      encargado: "Ana Torres",
      emoji: "👧",
    },
    {
      id: 4,
      name: "Diego Hernández",
      age: 7,
      gender: "Masculino",
      status: "Activo",
      ingreso: "09/02/2024",
      encargado: "Luis Fernández",
      emoji: "👦",
    },
  ]);

  const [viewResident, setViewResident] = useState<Resident | null>(null);
  const [editResident, setEditResident] = useState<Resident | null>(null);

  // Guardar edición
  const handleSaveEdit = () => {
    if (!editResident) return;
    setResidents((prev) =>
      prev.map((r) => (r.id === editResident.id ? editResident : r))
    );
    setEditResident(null);
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Residentes</h1>
        <p className="text-gray-600">Listado de residentes del hogar</p>
      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {residents.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl shadow-md overflow-hidden bg-gradient-to-br from-blue-50 to-green-50"
          >
            {/* Encabezado con emoji */}
            <div className="flex flex-col items-center p-6">
              <div className="text-6xl">{r.emoji}</div>
            </div>

            {/* Info */}
            <div className="bg-white px-6 py-4 rounded-t-3xl">
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold">{r.name}</h2>
                <span className={`text-sm font-semibold ${statusColors[r.status]}`}>
                  {r.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm">
                {r.age} años • {r.gender}
              </p>

              <p className="text-gray-600 text-sm mt-2">
                <span className="font-medium">Ingreso:</span> {r.ingreso}
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Encargado:</span> {r.encargado}
              </p>

              {/* Botones */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setViewResident(r)}
                  className="flex items-center justify-center gap-2 w-1/2 border border-blue-600 text-blue-600 py-1.5 rounded-full"
                >
                  <Eye size={18} /> Ver
                </button>

                <button
                  onClick={() => setEditResident(r)}
                  className="flex items-center justify-center gap-2 w-1/2 text-gray-700 py-1.5 rounded-full"
                >
                  <Edit3 size={18} /> Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL VER */}
      {viewResident && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-xl animate-fade">
            <button
              onClick={() => setViewResident(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>

            <div className="text-center">
              <div className="text-7xl mb-4">{viewResident.emoji}</div>
              <h2 className="text-2xl font-bold">{viewResident.name}</h2>
              <p className="text-gray-600">{viewResident.age} años • {viewResident.gender}</p>

              <div className="mt-4 text-left space-y-2">
                <p><strong>Estado:</strong> {viewResident.status}</p>
                <p><strong>Ingreso:</strong> {viewResident.ingreso}</p>
                <p><strong>Encargado:</strong> {viewResident.encargado}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {editResident && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-xl">
            <button
              onClick={() => setEditResident(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-4">Editar Residente</h2>

            <input
              type="text"
              value={editResident.name}
              onChange={(e) =>
                setEditResident({ ...editResident, name: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg mb-3"
            />

            <input
              type="number"
              value={editResident.age}
              onChange={(e) =>
                setEditResident({
                  ...editResident,
                  age: Number(e.target.value),
                })
              }
              className="w-full px-4 py-2 border rounded-lg mb-3"
            />

            <select
              value={editResident.status}
              onChange={(e) =>
                setEditResident({
                  ...editResident,
                  status: e.target.value as Resident["status"],
                })
              }
              className="w-full px-4 py-2 border rounded-lg mb-3"
            >
              <option value="Activo">Activo</option>
              <option value="En Transición">En Transición</option>
              <option value="Egresado">Egresado</option>
            </select>

            <button
              onClick={handleSaveEdit}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentsPage;

