// src/components/users/UserForm.tsx
import React, { useState } from 'react';
import type { User } from '../../types/user.types';
import { X } from 'lucide-react';


interface Props {
user?: User | null;
onSubmit: (data: Partial<User>) => void;
onCancel: () => void;
}


const UserForm: React.FC<Props> = ({ user, onSubmit, onCancel }) => {
const [form, setForm] = useState<Partial<User>>({
name: user?.name || '',
email: user?.email || '',
role: user?.role || 'VOLUNTARIO',
isActive: user?.isActive ?? true,
});


const submit = (e: React.FormEvent) => {
e.preventDefault();
onSubmit(form);
};


return (
<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
<form onSubmit={submit} className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg">
<div className="flex items-center justify-between mb-4">
<h3 className="text-lg font-semibold">{user ? 'Editar usuario' : 'Nuevo usuario'}</h3>
<button type="button" onClick={onCancel} className="text-gray-500 hover:text-gray-700"><X /></button>
</div>


<div className="space-y-3">
<label className="block text-sm">Nombre</label>
<input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border rounded" />


<label className="block text-sm">Email</label>
<input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border rounded" />


<label className="block text-sm">Rol</label>
<select value={form.role} onChange={(e) => setForm({...form, role: e.target.value as User['role']})} className="w-full px-3 py-2 border rounded">
<option value="DIRECTORA">Directora</option>
<option value="PSICOLOGA">Psicóloga</option>
<option value="TRABAJADORA_SOCIAL">Trabajadora Social</option>
<option value="ADMIN">Administradora</option>
<option value="VOLUNTARIO">Voluntario/a</option>
</select>


<label className="flex items-center gap-2">
<input type="checkbox" checked={!!form.isActive} onChange={(e) => setForm({...form, isActive: e.target.checked})} /> Activo
</label>
</div>


<div className="mt-6 flex justify-end gap-2">
<button type="button" onClick={onCancel} className="px-4 py-2 rounded border">Cancelar</button>
<button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Guardar</button>
</div>
</form>
</div>
);
};


export default UserForm;