import React, { useEffect, useState } from 'react';
import { Users, Plus, Edit2, Trash2, Shield, Mail, Key } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { User, Member } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'secretario' as 'admin' | 'secretario',
    status: 'active' as 'active' | 'inactive',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    adminApi
      .getUsers('staff')
      .then((res) => {
        setUsers(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'secretario',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      password: '',
      role: (u.role === 'admin' ? 'admin' : 'secretario') as 'admin' | 'secretario',
      status: u.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: any = {
        ...formData,
        member_id: null,
      };
      if (!payload.password) delete payload.password;

      if (editingUser) {
        await adminApi.updateUser(editingUser.id, payload);
      } else {
        await adminApi.createUser(payload);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      alert(
        err.response?.data?.messages
          ? Object.values(err.response.data.messages).join(' ')
          : 'Error al guardar el usuario.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('¿Desea eliminar esta cuenta de staff?')) return;
    try {
      await adminApi.deleteUser(id);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar usuario.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-xl text-cicha-navy">Staff: Administradores & Secretarios</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200 uppercase tracking-wider">
              Exclusivo Admin
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión de credenciales de acceso para el equipo directivo y secretaría de la Cámara.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Nuevo Administrador / Secretario
        </button>
      </div>

      {loading ? (
        <Loader text="Cargando staff administrativo..." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Nombre y Apellido</th>
                  <th className="py-3.5 px-4">Correo Electrónico (Acceso)</th>
                  <th className="py-3.5 px-4">Nivel de Acceso / Rol</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={u.role === 'admin' ? 'danger' : 'primary'}
                        className="uppercase font-bold"
                      >
                        {u.role === 'admin' ? 'Administrador' : 'Secretario'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={u.status === 'active' ? 'success' : 'secondary'}>
                        {u.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {Number(u.id) !== 1 && (
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Editar Cuenta de Staff' : 'Nuevo Administrador / Secretario'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Nombre y Apellido *</label>
            <input
              type="text"
              required
              placeholder="Ej. Juan Pérez"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Correo Electrónico (Usuario de Acceso) *</label>
            <input
              type="email"
              required
              placeholder="admin@cicha.com.ar"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">
              Contraseña {editingUser && '(Dejar en blanco para mantener la actual)'}
            </label>
            <input
              type="password"
              required={!editingUser}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={editingUser ? '••••••••' : 'Mínimo 6 caracteres'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Nivel de Acceso / Rol *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="admin">Administrador (Acceso Total)</option>
                <option value="secretario">Secretario (Gestor de Contenidos & Socios)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Estado de la Cuenta</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              {submitting ? 'Guardando...' : 'Guardar Cuenta'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
