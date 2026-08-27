import React, { useEffect, useState } from 'react';
import { Users, Plus, Edit2, Trash2 } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { Authority } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminAuthoritiesPage: React.FC = () => {
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuth, setEditingAuth] = useState<Authority | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role_title: '',
    category: 'directiva' as 'directiva' | 'honorario' | 'comite',
    company: '',
    bio: '',
    photo_url: '',
    linkedin_url: '',
    order_num: 0,
    is_active: 1,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAuthorities();
  }, []);

  const fetchAuthorities = () => {
    setLoading(true);
    adminApi
      .getAuthorities()
      .then((res) => {
        setAuthorities(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleOpenCreate = () => {
    setEditingAuth(null);
    setFormData({
      name: '',
      role_title: '',
      category: 'directiva',
      company: '',
      bio: '',
      photo_url: '',
      linkedin_url: '',
      order_num: authorities.length + 1,
      is_active: 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (auth: Authority) => {
    setEditingAuth(auth);
    setFormData({
      name: auth.name,
      role_title: auth.role_title,
      category: auth.category || 'directiva',
      company: auth.company || '',
      bio: auth.bio || '',
      photo_url: auth.photo_url || '',
      linkedin_url: auth.linkedin_url || '',
      order_num: auth.order_num || 0,
      is_active: auth.is_active ? 1 : 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingAuth) {
        await adminApi.updateAuthority(editingAuth.id, formData);
      } else {
        await adminApi.createAuthority(formData);
      }
      setIsModalOpen(false);
      fetchAuthorities();
    } catch (err) {
      alert('Error al guardar la autoridad.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Desea eliminar este miembro de la comisión directiva?')) return;
    try {
      await adminApi.deleteAuthority(id);
      fetchAuthorities();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-xl text-[#0B2545]">Comisión Directiva & Autoridades</h1>
          <p className="text-xs text-slate-500 mt-0.5">Gestión de cargos y autoridades de la Cámara.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Agregar Autoridad
        </button>
      </div>

      {loading ? (
        <Loader text="Cargando autoridades..." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Orden</th>
                  <th className="py-3.5 px-4">Nombre</th>
                  <th className="py-3.5 px-4">Cargo</th>
                  <th className="py-3.5 px-4">Empresa / Entidad</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {authorities.map((auth) => (
                  <tr key={auth.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-400">#{auth.order_num}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden shrink-0">
                          {auth.photo_url ? (
                            <img src={auth.photo_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-900 text-white font-bold">
                              {auth.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-slate-900">{auth.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-blue-700">{auth.role_title}</td>
                    <td className="py-3.5 px-4 text-slate-600">{auth.company || '-'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(auth)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(auth.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Authority Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAuth ? 'Editar Autoridad' : 'Nueva Autoridad'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Nombre y Apellido *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Cargo / Rol *</label>
              <input
                type="text"
                required
                value={formData.role_title}
                onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                placeholder="Presidente, Vicepresidente, etc."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Orden de Visualización</label>
              <input
                type="number"
                value={formData.order_num}
                onChange={(e) => setFormData({ ...formData, order_num: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Empresa / Entidad</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">URL de la Foto</label>
            <input
              type="url"
              value={formData.photo_url}
              onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Breve Biografía</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
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
              {submitting ? 'Guardando...' : 'Guardar Autoridad'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
