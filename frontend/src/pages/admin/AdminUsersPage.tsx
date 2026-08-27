import React, { useEffect, useState } from 'react';
import { Users, Plus, Edit2, Trash2, Shield, Mail, Key } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { User, Member } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'secretario' as 'admin' | 'secretario' | 'socio',
    member_id: '' as string | number,
    status: 'active' as 'active' | 'inactive',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
    adminApi.getMembers().then(setMembers).catch(console.error);
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    adminApi
      .getUsers()
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
      member_id: '',
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
      role: u.role,
      member_id: u.member_id || '',
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
        member_id: formData.member_id ? Number(formData.member_id) : null,
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
    if (!window.confirm('¿Desea eliminar este usuario?')) return;
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
          <h1 className="font-serif font-bold text-xl text-[#0B2545]">Gestión de Usuarios y Roles</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Administración de cuentas con roles: Admin (total), Secretario (gestor) y Socio (portal exclusivo).
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nuevo Usuario
        </button>
      </div>

      {loading ? (
        <Loader text="Cargando usuarios..." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Usuario</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Rol Asignado</th>
                  <th className="py-3.5 px-4">Empresa Socia Vinculada</th>
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
                        variant={
                          u.role === 'admin' ? 'danger' : u.role === 'secretario' ? 'primary' : 'gold'
                        }
                        className="uppercase font-bold"
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {u.member_company_name || (u.role === 'socio' ? 'Sin vincular' : '-')}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={u.status === 'active' ? 'success' : 'secondary'}>
                        {u.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {Number(u.id) !== 1 && (
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
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
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Nombre Completo *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Correo Electrónico *</label>
            <input
              type="email"
              required
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
              <label className="font-bold text-slate-700">Rol del Usuario *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="admin">Administrador (Acceso Total)</option>
                <option value="secretario">Secretario (Gestión de Contenidos & Socios)</option>
                <option value="socio">Socio (Portal Exclusivo Intranet)</option>
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

          {formData.role === 'socio' && (
            <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200">
              <label className="font-bold text-amber-900">Vincular a Empresa Socia del Directorio:</label>
              <select
                value={formData.member_id}
                onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-amber-300 bg-white text-xs"
              >
                <option value="">-- Seleccionar Empresa Socia --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.company_name} ({m.sector})
                  </option>
                ))}
              </select>
            </div>
          )}

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
              {submitting ? 'Guardando...' : 'Guardar Usuario'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
