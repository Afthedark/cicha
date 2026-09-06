import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Mail, Search, ShieldCheck, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { User } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminPartnerUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    status: 'active' as 'active' | 'inactive',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    adminApi
      .getUsers('socio')
      .then((socioUsers) => {
        setUsers(socioUsers || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setShowPassword(false);
    setCopied(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setShowPassword(false);
    setCopied(false);
    setFormData({
      name: u.name,
      email: u.email,
      password: '',
      status: u.status,
    });
    setIsModalOpen(true);
  };

  const handleCopyCredentials = () => {
    if (!formData.email) {
      alert('Por favor ingrese el correo electrónico antes de copiar.');
      return;
    }

    const loginUrl = `${window.location.origin}/admin/login`;
    const passwordText = formData.password 
      ? formData.password 
      : editingUser 
        ? '(Contraseña previamente configurada)' 
        : '(Sin contraseña)';

    const textToCopy = `🏛️ ACCESO AL PORTAL DE SOCIOS - CICHA\n` +
      `--------------------------------------------------\n` +
      `Empresa / Socio: ${formData.name || 'Socio'}\n` +
      `Usuario (Email): ${formData.email}\n` +
      `Contraseña: ${passwordText}\n` +
      `Enlace de Acceso: ${loginUrl}\n` +
      `--------------------------------------------------\n` +
      `Ingrese al enlace para acceder a sus beneficios y documentos exclusivos.`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }).catch(() => {
      alert('No se pudo copiar al portapapeles.');
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        role: 'socio',
        member_id: null,
        status: formData.status,
      };
      if (formData.password) payload.password = formData.password;

      if (editingUser) {
        await adminApi.updateUser(editingUser.id, payload);
      } else {
        await adminApi.createUser(payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(
        err.response?.data?.messages
          ? Object.values(err.response.data.messages).join(' ')
          : 'Error al guardar la cuenta de socio.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('¿Desea eliminar el acceso de esta cuenta de socio?')) return;
    try {
      await adminApi.deleteUser(id);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar usuario socio.');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-xl text-cicha-navy">Cuentas de Acceso: Portal de Socios</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wider">
              Admin &amp; Secretario
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Administración de credenciales para socios y empresas habilitadas para ingresar al Portal Exclusivo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar socio por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> Registrar Cuenta de Socio
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Loader text="Cargando cuentas de socios..." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Socio / Empresa</th>
                  <th className="py-3.5 px-4">Correo Electrónico (Acceso)</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">
                      No se encontraron cuentas de socios registradas.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center border border-blue-100 shrink-0">
                            {u.name ? u.name.substring(0, 2).toUpperCase() : 'SC'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{u.name}</span>
                            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> Socio Portal
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {u.email}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={u.status === 'active' ? 'success' : 'secondary'}>
                          {u.status === 'active' ? 'Habilitado' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                            title="Editar cuenta"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Eliminar cuenta"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Partner User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Editar Cuenta de Socio' : 'Nueva Cuenta de Acceso para Socio'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Nombre del Socio / Empresa *</label>
            <input
              type="text"
              required
              placeholder="Ej. AGENCIA MARITIMA DULCE S.A."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Correo Electrónico de Acceso (Email) *</label>
            <input
              type="email"
              required
              placeholder="socio@empresa.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">
                Contraseña de Acceso {editingUser && '(Dejar en blanco para conservar la actual)'}
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" /> Ocultar
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" /> Mostrar
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required={!editingUser}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={editingUser ? '••••••••' : 'Mínimo 6 caracteres'}
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Estado de Habilitación</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
            >
              <option value="active">Activo / Habilitado para acceder al Portal</option>
              <option value="inactive">Inactivo / Bloqueado</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCopyCredentials}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 border ${
                copied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" /> ¡Credenciales Copiadas!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" /> Copiar Credenciales
                </>
              )}
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
              >
                {submitting ? 'Guardando...' : 'Guardar Cuenta de Socio'}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

