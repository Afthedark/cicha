import React, { useEffect, useState } from 'react';
import {
  Handshake,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  FileCheck2,
  Search,
  ExternalLink,
  ShieldCheck,
  Building2,
  Lock,
  Globe2,
  X,
  AlertCircle,
  FileText,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { adminApi, resolveImageUrl } from '../../services/api';
import type { B2BMeeting } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminB2BMeetingsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<B2BMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<B2BMeeting | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFormTab, setActiveFormTab] = useState<'public' | 'partner'>('public');

  // Form State
  const [form, setForm] = useState({
    title: '',
    slug: '',
    sector: 'Alimentos & Bebidas',
    meeting_date: new Date().toISOString().split('T')[0],
    location: 'Buenos Aires / Atenas (Híbrido)',
    modality: 'hibrido',
    status: 'completed',
    cover_image_url: '',
    public_summary: '',
    participants_count: 0,
    meetings_count: 0,
    agreements_count: 0,
    partner_detailed_report: '',
    partner_companies_list: '',
    partner_conclusions: '',
    partner_document_url: '',
    partner_contact_info: 'comercioexterior@cicha.com.ar',
    is_active: 1,
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = () => {
    setLoading(true);
    adminApi
      .getB2BMeetings()
      .then((data) => {
        setMeetings(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando reuniones B2B admin:', err);
        setLoading(false);
      });
  };

  const handleOpenCreate = () => {
    setEditingMeeting(null);
    setForm({
      title: '',
      slug: '',
      sector: 'Alimentos & Bebidas',
      meeting_date: new Date().toISOString().split('T')[0],
      location: 'Buenos Aires / Atenas (Híbrido)',
      modality: 'hibrido',
      status: 'completed',
      cover_image_url: '',
      public_summary: '',
      participants_count: 0,
      meetings_count: 0,
      agreements_count: 0,
      partner_detailed_report: '',
      partner_companies_list: '',
      partner_conclusions: '',
      partner_document_url: '',
      partner_contact_info: 'comercioexterior@cicha.com.ar',
      is_active: 1,
    });
    setActiveFormTab('public');
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: B2BMeeting) => {
    setEditingMeeting(m);
    setForm({
      title: m.title,
      slug: m.slug || '',
      sector: m.sector || 'Multisectorial',
      meeting_date: m.meeting_date || '',
      location: m.location || '',
      modality: m.modality || 'hibrido',
      status: m.status || 'completed',
      cover_image_url: m.cover_image_url || '',
      public_summary: m.public_summary || '',
      participants_count: m.participants_count || 0,
      meetings_count: m.meetings_count || 0,
      agreements_count: m.agreements_count || 0,
      partner_detailed_report: m.partner_detailed_report || '',
      partner_companies_list: m.partner_companies_list || '',
      partner_conclusions: m.partner_conclusions || '',
      partner_document_url: m.partner_document_url || '',
      partner_contact_info: m.partner_contact_info || '',
      is_active: m.is_active ? 1 : 0,
    });
    setActiveFormTab('public');
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setErrorMessage('El título es requerido.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    try {
      if (editingMeeting) {
        await adminApi.updateB2BMeeting(editingMeeting.id, form);
      } else {
        await adminApi.createB2BMeeting(form);
      }
      setIsModalOpen(false);
      fetchMeetings();
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Error al guardar la reunión B2B.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar esta reunión B2B?')) return;
    try {
      await adminApi.deleteB2BMeeting(id);
      fetchMeetings();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Error al eliminar reunión B2B.');
    }
  };

  const filteredMeetings = meetings.filter((m) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.sector.toLowerCase().includes(q) ||
      (m.location && m.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-xl text-cicha-navy flex items-center gap-2">
            <Handshake className="w-5 h-5 text-blue-600" />
            <span>Reuniones B2B & Resultados</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión de rondas de negocios bilaterales. La versión básica se publica en la Web y el informe detallado en el Portal de Socios.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-cicha-navy hover:bg-[#003866] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-400" /> Nueva Ronda B2B
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Buscar por título, sector o lugar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cicha-navy/20 focus:border-cicha-navy transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total de Rondas: <strong className="text-slate-800">{filteredMeetings.length}</strong>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Loader text="Cargando reuniones B2B..." />
      ) : filteredMeetings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 p-6 space-y-2">
          <Handshake className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No hay reuniones B2B registradas</p>
          <p className="text-xs text-slate-400">Haga clic en &quot;Nueva Ronda B2B&quot; para agregar la primera.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Ronda Comercial / Encuentro</th>
                  <th className="py-3.5 px-4">Sector</th>
                  <th className="py-3.5 px-4">Fecha & Modalidad</th>
                  <th className="py-3.5 px-4 text-center">Métricas (Part. / Reun. / Acuerdos)</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMeetings.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 line-clamp-1">{m.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{m.location}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="primary">{m.sector}</Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-700">
                        {m.meeting_date ? new Date(m.meeting_date).toLocaleDateString('es-AR') : 'Sin fecha'}
                      </div>
                      <div className="text-[11px] text-slate-400 capitalize">{m.modality}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 font-mono text-[11px]">
                        <span className="text-slate-800" title="Participantes">{m.participants_count || 0}p</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-blue-700 font-bold" title="Reuniones">{m.meetings_count || 0}r</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-emerald-700 font-bold" title="Acuerdos">{m.agreements_count || 0}a</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {m.status === 'completed' ? (
                        <Badge variant="success">Realizada</Badge>
                      ) : m.status === 'in_progress' ? (
                        <Badge variant="warning">En Curso</Badge>
                      ) : (
                        <Badge variant="info">Convocatoria</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Eliminar"
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

      {/* Create / Edit Modal with 2 Tabs (Público vs Socios) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMeeting ? 'Editar Ronda B2B & Resultados' : 'Nueva Ronda B2B & Resultados'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveFormTab('public')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeFormTab === 'public'
                  ? 'bg-white text-cicha-navy shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe2 className="w-4 h-4 text-blue-600" />
              <span>1. Datos Públicos (Web)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFormTab('partner')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeFormTab === 'partner'
                  ? 'bg-white text-cicha-navy shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lock className="w-4 h-4 text-amber-500" />
              <span>2. Informe Exclusivo (Portal Socios)</span>
            </button>
          </div>

          {/* TAB 1: DATOS PÚBLICOS */}
          {activeFormTab === 'public' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">
                  Título de la Ronda B2B <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Ronda Bilateral Agroalimentaria & Vinos de Autor Atenas 2026"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cicha-navy/20 focus:border-cicha-navy transition-all"
                />
              </div>

              {/* Sector, Date, Modality */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Sector / Rubro</label>
                  <select
                    value={form.sector}
                    onChange={(e) => setForm({ ...form, sector: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Alimentos & Bebidas">Alimentos & Bebidas</option>
                    <option value="Logística Portuaria">Logística Portuaria</option>
                    <option value="Tecnología & Energía">Tecnología & Energía</option>
                    <option value="Servicios Profesionales">Servicios Profesionales</option>
                    <option value="Comercio Exterior">Comercio Exterior</option>
                    <option value="Multisectorial">Multisectorial</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Fecha del Encuentro</label>
                  <input
                    type="date"
                    value={form.meeting_date}
                    onChange={(e) => setForm({ ...form, meeting_date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Modalidad</label>
                  <select
                    value={form.modality}
                    onChange={(e) => setForm({ ...form, modality: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="hibrido">Híbrido (Presencial/Virtual)</option>
                    <option value="presencial">Presencial</option>
                    <option value="virtual">100% Virtual</option>
                  </select>
                </div>
              </div>

              {/* Location & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Sede / Ubicación</label>
                  <input
                    type="text"
                    placeholder="Ej: Salón Libertador CICHA, Buenos Aires"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Estado de la Ronda</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="completed">Realizada / Concluida</option>
                    <option value="in_progress">En Curso / Activa</option>
                    <option value="upcoming">Convocatoria Abierta</option>
                  </select>
                </div>
              </div>

              {/* Cover Image URL */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">URL Imagen de Portada</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={form.cover_image_url}
                  onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Public Summary */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Resumen Ejecutivo Público (Visible para visitantes)</label>
                <textarea
                  rows={3}
                  placeholder="Descripción general de los temas tratados, objetivos de la misión comercial y cámaras intervinientes..."
                  value={form.public_summary}
                  onChange={(e) => setForm({ ...form, public_summary: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              {/* Quantitative Metrics */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" /> Métricas Cuantitativas
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600">Empresas Participantes</label>
                    <input
                      type="number"
                      min="0"
                      value={form.participants_count}
                      onChange={(e) => setForm({ ...form, participants_count: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-center font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600">Reuniones 1-a-1</label>
                    <input
                      type="number"
                      min="0"
                      value={form.meetings_count}
                      onChange={(e) => setForm({ ...form, meetings_count: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-center font-bold text-blue-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600">Acuerdos / LOIs</label>
                    <input
                      type="number"
                      min="0"
                      value={form.agreements_count}
                      onChange={(e) => setForm({ ...form, agreements_count: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-center font-bold text-emerald-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INFORME EXCLUSIVO SOCIOS */}
          {activeFormTab === 'partner' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-[11px] leading-relaxed">
                <strong>🔒 Exclusivo para el Portal de Socios:</strong> Estos campos no se muestran en la web pública. Son accesibles únicamente para las empresas socias autenticadas.
              </div>

              {/* Detailed Report */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">
                  Informe Detallado de Resultados & Acuerdos Comerciales
                </label>
                <textarea
                  rows={5}
                  placeholder="Detalle exhaustivo de acuerdos cerrados, líneas arancelarias, proyectos de inversión y acuerdos marco..."
                  value={form.partner_detailed_report}
                  onChange={(e) => setForm({ ...form, partner_detailed_report: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl resize-none font-sans"
                />
              </div>

              {/* Companies List */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">
                  Listado de Empresas Contrapartes & Perfiles de Demanda
                </label>
                <textarea
                  rows={4}
                  placeholder="- Hellenic Gourmet Imports (Atenas) - Interés: Vinos Reserva&#10;- Mediterranean Olive Trading (El Pireo) - Interés: Frutos secos"
                  value={form.partner_companies_list}
                  onChange={(e) => setForm({ ...form, partner_companies_list: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] resize-none"
                />
              </div>

              {/* Conclusions */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Conclusiones & Próximos Pasos</label>
                <textarea
                  rows={3}
                  placeholder="Recomendaciones operativas y estratégicas para los socios que deseen ingresar al mercado..."
                  value={form.partner_conclusions}
                  onChange={(e) => setForm({ ...form, partner_conclusions: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              {/* Document URL & Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">URL del Dossier Oficial (PDF)</label>
                  <input
                    type="url"
                    placeholder="https://cicha.com.ar/docs/informe-ronda-..."
                    value={form.partner_document_url}
                    onChange={(e) => setForm({ ...form, partner_document_url: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Contacto de Seguimiento</label>
                  <input
                    type="text"
                    placeholder="comercioexterior@cicha.com.ar"
                    value={form.partner_contact_info}
                    onChange={(e) => setForm({ ...form, partner_contact_info: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Modal Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-cicha-navy hover:bg-[#003866] text-white font-bold transition-all disabled:opacity-50 cursor-pointer shadow-md"
            >
              {submitting ? 'Guardando...' : editingMeeting ? 'Actualizar Ronda B2B' : 'Publicar Ronda B2B'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
