import React, { useEffect, useState } from 'react';
import { Globe, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { Alliance } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminAlliancesPage: React.FC = () => {
  const [alliances, setAlliances] = useState<Alliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlliance, setEditingAlliance] = useState<Alliance | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'institucional',
    description: '',
    website_url: '',
    highlight_text: '',
    order_num: 0,
    is_active: 1,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAlliances();
  }, []);

  const fetchAlliances = () => {
    setLoading(true);
    adminApi
      .getAlliances()
      .then((res) => {
        setAlliances(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleOpenCreate = () => {
    setEditingAlliance(null);
    setFormData({
      name: '',
      category: 'institucional',
      description: '',
      website_url: '',
      highlight_text: '',
      order_num: alliances.length + 1,
      is_active: 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (alliance: Alliance) => {
    setEditingAlliance(alliance);
    setFormData({
      name: alliance.name,
      category: alliance.category || 'institucional',
      description: alliance.description || '',
      website_url: alliance.website_url || '',
      highlight_text: alliance.highlight_text || '',
      order_num: alliance.order_num || 0,
      is_active: alliance.is_active ? 1 : 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingAlliance) {
        await adminApi.updateAlliance(editingAlliance.id, formData);
      } else {
        await adminApi.createAlliance(formData);
      }
      setIsModalOpen(false);
      fetchAlliances();
    } catch (err) {
      alert('Error al guardar la alianza.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Desea eliminar esta alianza?')) return;
    try {
      await adminApi.deleteAlliance(id);
      fetchAlliances();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-xl text-cicha-navy">Alianzas y Redes Estratégicas</h1>
          <p className="text-xs text-slate-500 mt-0.5">Gestión de convenios, EUROCAMARA, nodo EEN y UCCEB.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Agregar Alianza
        </button>
      </div>

      {loading ? (
        <Loader text="Cargando alianzas..." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Alianza / Red</th>
                  <th className="py-3.5 px-4">Destacado / Rol</th>
                  <th className="py-3.5 px-4">Sitio Web</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {alliances.map((all) => (
                  <tr key={all.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{all.name}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{all.description}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {all.highlight_text && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                          {all.highlight_text}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-blue-600">
                      {all.website_url && (
                        <a href={all.website_url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                          {all.website_url} <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(all)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(all.id)}
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

      {/* Alliance Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAlliance ? 'Editar Alianza' : 'Nueva Alianza'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Nombre de la Entidad / Red *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Texto Destacado</label>
            <input
              type="text"
              value={formData.highlight_text}
              onChange={(e) => setFormData({ ...formData, highlight_text: e.target.value })}
              placeholder="Ej. Miembro Activo desde Mayo 2017"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Sitio Web Oficial</label>
            <input
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Descripción</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              {submitting ? 'Guardando...' : 'Guardar Alianza'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
