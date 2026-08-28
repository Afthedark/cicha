import React, { useEffect, useState } from 'react';
import {
  Building,
  Sparkles,
  FileDown,
  Gift,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { Member, CommercialOpportunity, PartnerResource, PartnerBenefit } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminMembersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'members' | 'opportunities' | 'resources'>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [opportunities, setOpportunities] = useState<CommercialOpportunity[]>([]);
  const [resources, setResources] = useState<PartnerResource[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberForm, setMemberForm] = useState({
    company_name: '',
    sector: '',
    description: '',
    services: '',
    website_url: '',
    contact_email: '',
    contact_phone: '',
    country: 'Argentina',
    logo_url: '',
    is_featured: 0,
    status: 'active' as 'active' | 'inactive',
  });

  const [isOppModalOpen, setIsOppModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<CommercialOpportunity | null>(null);
  const [oppForm, setOppForm] = useState({
    title: '',
    type: 'export' as any,
    origin_country: 'Grecia',
    target_country: 'Argentina',
    sector: '',
    description: '',
    contact_person: '',
    contact_email: 'comercio@cicha.com.ar',
    status: 'open' as any,
  });

  const [isResModalOpen, setIsResModalOpen] = useState(false);
  const [editingRes, setEditingRes] = useState<PartnerResource | null>(null);
  const [resForm, setResForm] = useState({
    title: '',
    category: 'informe_mercado' as any,
    description: '',
    file_url: '',
    file_type: 'PDF',
    file_size: '1.5 MB',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      adminApi.getMembers(),
      adminApi.getOpportunities(),
      adminApi.getPartnerResources(),
    ])
      .then(([mems, opps, resList]) => {
        setMembers(mems || []);
        setOpportunities(opps || []);
        setResources(resList || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // Member Handlers
  const handleOpenCreateMember = () => {
    setEditingMember(null);
    setMemberForm({
      company_name: '',
      sector: '',
      description: '',
      services: '',
      website_url: '',
      contact_email: '',
      contact_phone: '',
      country: 'Argentina',
      logo_url: '',
      is_featured: 0,
      status: 'active',
    });
    setIsMemberModalOpen(true);
  };

  const handleOpenEditMember = (m: Member) => {
    setEditingMember(m);
    setMemberForm({
      company_name: m.company_name,
      sector: m.sector,
      description: m.description || '',
      services: m.services || '',
      website_url: m.website_url || '',
      contact_email: m.contact_email || '',
      contact_phone: m.contact_phone || '',
      country: m.country || 'Argentina',
      logo_url: m.logo_url || '',
      is_featured: m.is_featured ? 1 : 0,
      status: m.status || 'active',
    });
    setIsMemberModalOpen(true);
  };

  const handleSubmitMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingMember) {
        await adminApi.updateMember(editingMember.id, memberForm);
      } else {
        await adminApi.createMember(memberForm);
      }
      setIsMemberModalOpen(false);
      fetchData();
    } catch {
      alert('Error al guardar socio.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (!window.confirm('¿Desea eliminar este socio?')) return;
    try {
      await adminApi.deleteMember(id);
      fetchData();
    } catch {
      alert('Error al eliminar');
    }
  };

  // Opportunity Handlers
  const handleOpenCreateOpp = () => {
    setEditingOpp(null);
    setOppForm({
      title: '',
      type: 'export',
      origin_country: 'Grecia',
      target_country: 'Argentina',
      sector: '',
      description: '',
      contact_person: '',
      contact_email: 'comercio@cicha.com.ar',
      status: 'open',
    });
    setIsOppModalOpen(true);
  };

  const handleOpenEditOpp = (opp: CommercialOpportunity) => {
    setEditingOpp(opp);
    setOppForm({
      title: opp.title,
      type: opp.type,
      origin_country: opp.origin_country || 'Grecia',
      target_country: opp.target_country || 'Argentina',
      sector: opp.sector,
      description: opp.description,
      contact_person: opp.contact_person || '',
      contact_email: opp.contact_email || 'comercio@cicha.com.ar',
      status: opp.status || 'open',
    });
    setIsOppModalOpen(true);
  };

  const handleSubmitOpp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingOpp) {
        await adminApi.updateOpportunity(editingOpp.id, oppForm);
      } else {
        await adminApi.createOpportunity(oppForm);
      }
      setIsOppModalOpen(false);
      fetchData();
    } catch {
      alert('Error al guardar oportunidad.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOpp = async (id: number) => {
    if (!window.confirm('¿Desea eliminar esta oportunidad?')) return;
    try {
      await adminApi.deleteOpportunity(id);
      fetchData();
    } catch {
      alert('Error al eliminar');
    }
  };

  // Resource Handlers
  const handleOpenCreateRes = () => {
    setEditingRes(null);
    setResForm({
      title: '',
      category: 'informe_mercado',
      description: '',
      file_url: '',
      file_type: 'PDF',
      file_size: '1.5 MB',
    });
    setIsResModalOpen(true);
  };

  const handleOpenEditRes = (res: PartnerResource) => {
    setEditingRes(res);
    setResForm({
      title: res.title,
      category: res.category,
      description: res.description || '',
      file_url: res.file_url,
      file_type: res.file_type || 'PDF',
      file_size: res.file_size || '1.5 MB',
    });
    setIsResModalOpen(true);
  };

  const handleSubmitRes = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingRes) {
        await adminApi.updatePartnerResource(editingRes.id, resForm);
      } else {
        await adminApi.createPartnerResource(resForm);
      }
      setIsResModalOpen(false);
      fetchData();
    } catch {
      alert('Error al guardar recurso.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRes = async (id: number) => {
    if (!window.confirm('¿Desea eliminar este documento?')) return;
    try {
      await adminApi.deletePartnerResource(id);
      fetchData();
    } catch {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-xl text-cicha-navy">Gestión de Socios & Negocios Bilaterales</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Administración unificada del directorio de empresas socias, oportunidades comerciales y biblioteca de socios.
          </p>
        </div>

        <button
          onClick={
            activeTab === 'members'
              ? handleOpenCreateMember
              : activeTab === 'opportunities'
              ? handleOpenCreateOpp
              : handleOpenCreateRes
          }
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'members'
            ? 'Nuevo Socio'
            : activeTab === 'opportunities'
            ? 'Nueva Oportunidad'
            : 'Nuevo Documento'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('members')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'members'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          Directorio de Socios ({members.length})
        </button>

        <button
          onClick={() => setActiveTab('opportunities')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'opportunities'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Oportunidades Comerciales ({opportunities.length})
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'resources'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileDown className="w-4 h-4" />
          Biblioteca de Socios ({resources.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <Loader text="Cargando módulo de socios..." />
      ) : activeTab === 'members' ? (
        /* Members Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Empresa</th>
                  <th className="py-3.5 px-4">Sector</th>
                  <th className="py-3.5 px-4">País</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((mem) => (
                  <tr key={mem.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden p-1">
                          {mem.logo_url ? (
                            <img src={mem.logo_url} alt={mem.company_name} className="w-full h-full object-contain" />
                          ) : (
                            <Building className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{mem.company_name}</div>
                          <div className="text-[11px] text-slate-500">{mem.contact_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{mem.sector}</td>
                    <td className="py-3.5 px-4 text-slate-500">{mem.country}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={mem.status === 'active' ? 'success' : 'secondary'}>
                        {mem.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditMember(mem)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(mem.id)}
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
      ) : activeTab === 'opportunities' ? (
        /* Opportunities Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Título</th>
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
                          onClick={() => handleOpenEditOpp(opp)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOpp(opp.id)}
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
      ) : (
        /* Resources Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Documento</th>
                  <th className="py-3.5 px-4">Categoría</th>
                  <th className="py-3.5 px-4">Formato / Peso</th>
                  <th className="py-3.5 px-4">Descargas</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resources.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{res.title}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="primary" className="capitalize">
                        {res.category.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {res.file_type} ({res.file_size})
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{res.downloads}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditRes(res)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRes(res.id)}
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

      {/* Member Modal */}
      <Modal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        title={editingMember ? 'Editar Socio' : 'Nuevo Socio'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitMember} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Razón Social *</label>
            <input
              type="text"
              required
              value={memberForm.company_name}
              onChange={(e) => setMemberForm({ ...memberForm, company_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Sector / Rubro *</label>
              <input
                type="text"
                required
                value={memberForm.sector}
                onChange={(e) => setMemberForm({ ...memberForm, sector: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Email de Contacto</label>
              <input
                type="email"
                value={memberForm.contact_email}
                onChange={(e) => setMemberForm({ ...memberForm, contact_email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Sitio Web</label>
            <input
              type="url"
              value={memberForm.website_url}
              onChange={(e) => setMemberForm({ ...memberForm, website_url: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          {/* Company Logo Uploader */}
          <ImageUploader
            label="Logo de la Empresa Socia"
            value={memberForm.logo_url}
            onChange={(url) => setMemberForm({ ...memberForm, logo_url: url })}
            helperText="Formato PNG transparente, SVG o JPG (se guardará en /backend/public/uploads/)"
            previewHeight="h-32"
            aspectRatio="square"
          />

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Descripción</label>
            <textarea
              rows={3}
              value={memberForm.description}
              onChange={(e) => setMemberForm({ ...memberForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsMemberModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              {submitting ? 'Guardando...' : 'Guardar Socio'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Opportunity Modal */}
      <Modal
        isOpen={isOppModalOpen}
        onClose={() => setIsOppModalOpen(false)}
        title={editingOpp ? 'Editar Oportunidad' : 'Nueva Oportunidad'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitOpp} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Título de la Oportunidad *</label>
            <input
              type="text"
              required
              value={oppForm.title}
              onChange={(e) => setOppForm({ ...oppForm, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Tipo</label>
              <select
                value={oppForm.type}
                onChange={(e) => setOppForm({ ...oppForm, type: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="export">Exportación</option>
                <option value="import">Importación</option>
                <option value="investment">Inversión</option>
                <option value="partnership">Alianza</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">País Origen</label>
              <input
                type="text"
                value={oppForm.origin_country}
                onChange={(e) => setOppForm({ ...oppForm, origin_country: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">País Destino</label>
              <input
                type="text"
                value={oppForm.target_country}
                onChange={(e) => setOppForm({ ...oppForm, target_country: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Descripción *</label>
            <textarea
              rows={3}
              required
              value={oppForm.description}
              onChange={(e) => setOppForm({ ...oppForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsOppModalOpen(false)}
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

      {/* Resource Modal */}
      <Modal
        isOpen={isResModalOpen}
        onClose={() => setIsResModalOpen(false)}
        title={editingRes ? 'Editar Documento' : 'Nuevo Documento'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitRes} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Título del Documento *</label>
            <input
              type="text"
              required
              value={resForm.title}
              onChange={(e) => setResForm({ ...resForm, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">URL del Archivo *</label>
            <input
              type="url"
              required
              value={resForm.file_url}
              onChange={(e) => setResForm({ ...resForm, file_url: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsResModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              {submitting ? 'Guardando...' : 'Guardar Documento'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
