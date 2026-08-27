import React, { useEffect, useState } from 'react';
import { TrendingUp, Plus, Edit2, Trash2 } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { CommercialOpportunity } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminOpportunitiesPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<CommercialOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<CommercialOpportunity | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'export' as 'export' | 'import' | 'investment' | 'partnership' | 'een_node',
    origin_country: 'Grecia',
    target_country: 'Argentina',
    sector: '',
    description: '',
    requirements: '',
    contact_person: '',
    contact_email: 'comercio@cicha.com.ar',
    status: 'open' as 'open' | 'in_negotiation' | 'closed',
    deadline: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = () => {
    setLoading(true);
    adminApi
      .getOpportunities()
      .then((res) => {
        setOpportunities(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleOpenCreate = () => {
    setEditingOpp(null);
    setFormData({
      title: '',
      type: 'export',
      origin_country: 'Grecia',
      target_country: 'Argentina',
      sector: '',
      description: '',
      requirements: '',
      contact_person: '',
      contact_email: 'comercio@cicha.com.ar',
      status: 'open',
      deadline: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (opp: CommercialOpportunity) => {
    setEditingOpp(opp);
    setFormData({
      title: opp.title,
      type: opp.type,
      origin_country: opp.origin_country || 'Grecia',
      target_country: opp.target_country || 'Argentina',
      sector: opp.sector,
      description: opp.description,
      requirements: opp.requirements || '',
      contact_person: opp.contact_person || '',
      contact_email: opp.contact_email || 'comercio@cicha.com.ar',
      status: opp.status || 'open',
      deadline: opp.deadline || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingOpp) {
        await adminApi.updateOpportunity(editingOpp.id, formData);
      } else {
        await adminApi.createOpportunity(formData);
      }
      setIsModalOpen(false);
      fetchOpportunities();
    } catch (err) {
      alert('Error al guardar la oportunidad comercial.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Desea eliminar esta oportunidad?')) return;
    try {
      await adminApi.deleteOpportunity(id);
      fetchOpportunities();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-xl text-[#0B2545]">Oportunidades Comerciales Bilaterales</h1>
          <p className="text-xs text-slate-500 mt-0.5">Gestión de ofertas exportables, importación e inversiones.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nueva Oportunidad
        </button>
      </div>

      {loading ? (
        <Loader text="Cargando oportunidades..." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Oportunidad / Título</th>
                  <th className="py-3.5 px-4">Tipo</th>
                  <th className="py-3.5 px-4">Flujo Bilateral</th>
                  <th className="py-3.5 px-4">Sector</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{opp.title}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="primary" className="capitalize">
                        {opp.type}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {opp.origin_country} ➔ {opp.target_country}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{opp.sector}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={opp.status === 'open' ? 'success' : 'secondary'}>
                        {opp.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(opp)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(opp.id)}
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

      {/* Opportunity Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOpp ? 'Editar Oportunidad' : 'Nueva Oportunidad Comercial'}
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Título de la Oportunidad *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="export">Exportación</option>
                <option value="import">Importación</option>
                <option value="investment">Inversión</option>
                <option value="partnership">Alianza Tecnológica</option>
                <option value="een_node">Nodo EEN</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">País Origen</label>
              <input
                type="text"
                value={formData.origin_country}
                onChange={(e) => setFormData({ ...formData, origin_country: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">País Destino</label>
              <input
                type="text"
                value={formData.target_country}
                onChange={(e) => setFormData({ ...formData, target_country: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Sector / Rubro *</label>
              <input
                type="text"
                required
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                placeholder="Ej. Alimentos Gourmet, Energía Solar, Software"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Email de Contacto</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Descripción Detallada *</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Requisitos Técnicos / Normativos</label>
            <textarea
              rows={2}
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              placeholder="Certificaciones requeridas, condiciones comerciales..."
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
              {submitting ? 'Guardando...' : 'Guardar Oportunidad'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
