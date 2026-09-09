import React, { useEffect, useState } from 'react';
import { Users, Plus, Edit2, Trash2, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { adminApi, resolveImageUrl } from '../../services/api';
import type { Authority } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminAuthoritiesPage: React.FC = () => {
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuth, setEditingAuth] = useState<Authority | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    name: '',
    role_title: '',
    category: 'directiva' as 'directiva' | 'honorario' | 'comite' | 'revisora' | string,
    company: '',
    bio: '',
    photo_url: '',
    linkedin_url: '',
    order_num: 1,
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

  const getCategoryBadge = (cat?: string) => {
    switch (cat) {
      case 'honorario':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">Presidencia Honoraria</span>;
      case 'revisora':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300">Comisión Revisora</span>;
      case 'comite':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">Comité Asesor</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">Comisión Directiva</span>;
    }
  };

  const matchesFilter = (auth: Authority) => {
    const title = (auth.role_title || '').toLowerCase();
    if (categoryFilter === 'directiva') {
      return auth.category === 'directiva' || (!auth.category && !title.includes('revisor') && !title.includes('honorario'));
    }
    if (categoryFilter === 'revisora') {
      return auth.category === 'revisora' || title.includes('revisor');
    }
    if (categoryFilter === 'honorario') {
      return auth.category === 'honorario' || title.includes('honorario');
    }
    return true;
  };

  const filteredAuthorities = authorities.filter(matchesFilter);

  const countCategory = (cat: string) =>
    authorities.filter((a) => {
      const t = (a.role_title || '').toLowerCase();
      if (cat === 'directiva') return a.category === 'directiva' || (!a.category && !t.includes('revisor') && !t.includes('honorario'));
      if (cat === 'revisora') return a.category === 'revisora' || t.includes('revisor');
      if (cat === 'honorario') return a.category === 'honorario' || t.includes('honorario');
      return true;
    }).length;

  const FILTERS: { key: string; label: string }[] = [
    { key: 'all', label: `Todos (${authorities.length})` },
    { key: 'directiva', label: `Comisión Directiva (${countCategory('directiva')})` },
    { key: 'revisora', label: `Comisión Revisora de Cuentas (${countCategory('revisora')})` },
    { key: 'honorario', label: `Presidencia Honoraria (${countCategory('honorario')})` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-xl text-cicha-navy">Comisión Directiva & Autoridades</h1>
          <p className="text-xs text-slate-500 mt-0.5">Gestión de cargos, comisiones y autoridades institucionales de la Cámara.</p>
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
        <>
          {/* Quick Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 text-xs">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setCategoryFilter(f.key)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  categoryFilter === f.key
                    ? f.key === 'all'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : f.key === 'directiva'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : f.key === 'revisora'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Orden</th>
                    <th className="py-3.5 px-4">Nombre</th>
                    <th className="py-3.5 px-4">Cargo / Rol</th>
                    <th className="py-3.5 px-4">Categoría / Estructura</th>
                    <th className="py-3.5 px-4">Empresa / Entidad</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAuthorities.map((auth) => {
                    const resolvedPhoto = resolveImageUrl(auth.photo_url);
                    return (
                      <tr key={auth.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-400">#{auth.order_num}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                              {resolvedPhoto ? (
                                <img src={resolvedPhoto} alt={auth.name} className="w-full h-full object-cover" />
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
                        <td className="py-3.5 px-4">{getCategoryBadge(auth.category)}</td>
                        <td className="py-3.5 px-4 text-slate-600">{auth.company || '-'}</td>
                        <td className="py-3.5 px-4">
                          {auth.is_active ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              <XCircle className="w-3 h-3 text-slate-400" /> Inactivo
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(auth)}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(auth.id)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="Ej: Ing. Jorge Cotsiopoulos"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Cargo / Rol Institucional *</label>
              <input
                type="text"
                required
                value={formData.role_title}
                onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                placeholder="Presidente, Vocal Titular, Revisor..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Categoría / Estructura *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="directiva">Comisión Directiva / Mesa Ejecutiva & Vocales</option>
                <option value="honorario">Presidencia Honoraria</option>
                <option value="revisora">Comisión Revisora de Cuentas</option>
                <option value="comite">Comité Asesor / Especial</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Empresa / Entidad</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Ej: ARTEMISION SRL"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Orden de Visualización</label>
              <input
                type="number"
                value={formData.order_num}
                onChange={(e) => setFormData({ ...formData, order_num: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <ImageUploader
              label="Fotografía Oficial del Directivo"
              value={formData.photo_url}
              onChange={(url) => setFormData({ ...formData, photo_url: url })}
              aspectRatio="square"
              previewHeight="h-32"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Breve Biografía / Trayectoria</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Descripción de trayectoria profesional y funciones en la Cámara..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={Boolean(formData.is_active)}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span>Autoridad Activa y Visible en el Portal Web</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : 'Guardar Autoridad'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
