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
  Tag,
} from 'lucide-react';
import { adminApi, resolveImageUrl } from '../../services/api';
import type { B2BMeeting, Category } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminB2BMeetingsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<B2BMeeting[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCats, setLoadingCats] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<B2BMeeting | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('all');
  const [activeFormTab, setActiveFormTab] = useState<'public' | 'partner'>('public');

  // Category Manager Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catNameInput, setCatNameInput] = useState('');
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catActionLoading, setCatActionLoading] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

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
    fetchCategories();
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

  const fetchCategories = async () => {
    setLoadingCats(true);
    try {
      const data = await adminApi.getCategories('b2b');
      setCategories(data || []);
    } catch (err) {
      console.error('Error cargando categorías de B2B:', err);
    } finally {
      setLoadingCats(false);
    }
  };

  // Category CRUD Handlers
  const handleOpenCatModal = () => {
    setEditingCat(null);
    setCatNameInput('');
    setCatError(null);
    setIsCatModalOpen(true);
  };

  const handleStartEditCat = (cat: Category) => {
    setEditingCat(cat);
    setCatNameInput(cat.name);
    setCatError(null);
  };

  const handleCancelEditCat = () => {
    setEditingCat(null);
    setCatNameInput('');
    setCatError(null);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameInput.trim()) {
      setCatError('El nombre del sector no puede estar vacío');
      return;
    }

    setCatActionLoading(true);
    setCatError(null);
    try {
      if (editingCat) {
        await adminApi.updateCategory(editingCat.id, {
          name: catNameInput.trim(),
          type: 'b2b',
        });
      } else {
        await adminApi.createCategory({
          name: catNameInput.trim(),
          type: 'b2b',
        });
      }
      setCatNameInput('');
      setEditingCat(null);
      await fetchCategories();
      await fetchMeetings(); // actualiza sectores en cascada
    } catch (err: any) {
      console.error('Error guardando categoría B2B:', err);
      setCatError(err?.response?.data?.messages?.name || 'Error al guardar el sector / categoría');
    } finally {
      setCatActionLoading(false);
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    if (
      !window.confirm(
        `¿Está seguro de eliminar el sector "${cat.name}"?\n\nLas reuniones B2B asociadas se reasignarán de forma segura a "Multisectorial".`
      )
    ) {
      return;
    }

    setCatActionLoading(true);
    setCatError(null);
    try {
      await adminApi.deleteCategory(cat.id);
      if (editingCat?.id === cat.id) {
        setEditingCat(null);
        setCatNameInput('');
      }
      await fetchCategories();
      await fetchMeetings();
    } catch (err: any) {
      console.error('Error eliminando categoría B2B:', err);
      setCatError('No se pudo eliminar el sector');
    } finally {
      setCatActionLoading(false);
    }
  };

  // Meeting Handlers
  const handleOpenCreate = () => {
    setEditingMeeting(null);
    setForm({
      title: '',
      slug: '',
      sector: categories.length > 0 ? categories[0].name : 'Alimentos & Bebidas',
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
    setErrorMessage(null);
    setActiveFormTab('public');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (meeting: B2BMeeting) => {
    setEditingMeeting(meeting);
    setForm({
      title: meeting.title || '',
      slug: meeting.slug || '',
      sector: meeting.sector || (categories.length > 0 ? categories[0].name : 'Alimentos & Bebidas'),
      meeting_date: meeting.meeting_date ? meeting.meeting_date.split('T')[0] : '',
      location: meeting.location || '',
      modality: meeting.modality || 'hibrido',
      status: meeting.status || 'completed',
      cover_image_url: meeting.cover_image_url || '',
      public_summary: meeting.public_summary || '',
      participants_count: meeting.participants_count || 0,
      meetings_count: meeting.meetings_count || 0,
      agreements_count: meeting.agreements_count || 0,
      partner_detailed_report: meeting.partner_detailed_report || '',
      partner_companies_list: meeting.partner_companies_list || '',
      partner_conclusions: meeting.partner_conclusions || '',
      partner_document_url: meeting.partner_document_url || '',
      partner_contact_info: meeting.partner_contact_info || 'comercioexterior@cicha.com.ar',
      is_active: meeting.is_active ? 1 : 0,
    });
    setErrorMessage(null);
    setActiveFormTab('public');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setErrorMessage('El título de la ronda B2B es obligatorio.');
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
      console.error('Error guardando reunión B2B:', err);
      setErrorMessage(err?.response?.data?.message || 'Error al guardar la reunión B2B.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar esta ronda B2B?')) return;

    try {
      await adminApi.deleteB2BMeeting(id);
      fetchMeetings();
    } catch (err) {
      console.error('Error eliminando reunión B2B:', err);
      alert('Error al eliminar la reunión B2B.');
    }
  };

  const filteredMeetings = meetings.filter((m) => {
    const matchSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.sector && m.sector.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.location && m.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchSector =
      selectedSectorFilter === 'all' || m.sector === selectedSectorFilter;

    return matchSearch && matchSector;
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

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Administrar Sectores / Categorías */}
          <button
            onClick={handleOpenCatModal}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Tag className="w-4 h-4 text-blue-600" />
            <span>Sectores ({categories.length})</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-cicha-navy hover:bg-[#003866] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-amber-400" /> Nueva Ronda B2B
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Buscar por título, sector o lugar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cicha-navy/20 focus:border-cicha-navy transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Sectors Horizontal Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedSectorFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedSectorFilter === 'all'
                ? 'bg-cicha-navy text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({meetings.length})
          </button>
          {categories.map((c) => {
            const count = meetings.filter((m) => m.sector === c.name).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedSectorFilter(c.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedSectorFilter === c.name
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
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
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200/60">
                        <Tag className="w-3 h-3" />
                        {m.sector}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-700 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {m.meeting_date}
                      </div>
                      <div className="text-[10px] text-slate-500 capitalize">{m.modality}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg font-mono text-[11px]">
                        <span title="Empresas Participantes" className="text-slate-700 font-bold">{m.participants_count}</span>
                        <span className="text-slate-300">/</span>
                        <span title="Reuniones 1-a-1" className="text-blue-600 font-bold">{m.meetings_count}</span>
                        <span className="text-slate-300">/</span>
                        <span title="Acuerdos Alcanzados" className="text-emerald-600 font-bold">{m.agreements_count}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge
                        variant={
                          m.status === 'completed'
                            ? 'success'
                            : m.status === 'in_progress'
                            ? 'warning'
                            : 'primary'
                        }
                      >
                        {m.status === 'completed'
                          ? 'Realizada'
                          : m.status === 'in_progress'
                          ? 'En Curso'
                          : 'Abierta'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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

      {/* Meeting Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMeeting ? 'Editar Ronda de Negocios B2B' : 'Nueva Ronda de Negocios B2B'}
        maxWidth="3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Tabs */}
          <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50 gap-1">
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
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">Sector / Rubro</label>
                    <button
                      type="button"
                      onClick={handleOpenCatModal}
                      className="text-[10px] text-blue-600 hover:underline font-semibold"
                    >
                      + Nuevo
                    </button>
                  </div>
                  <select
                    value={form.sector}
                    onChange={(e) => setForm({ ...form, sector: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                  >
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Alimentos & Bebidas">Alimentos & Bebidas</option>
                        <option value="Logística Portuaria">Logística Portuaria</option>
                        <option value="Tecnología & Energía">Tecnología & Energía</option>
                        <option value="Servicios Profesionales">Servicios Profesionales</option>
                        <option value="Comercio Exterior">Comercio Exterior</option>
                        <option value="Multisectorial">Multisectorial</option>
                      </>
                    )}
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
                    <option value="presencial">Presencial</option>
                    <option value="virtual">100% Virtual</option>
                    <option value="hibrido">Híbrido (Presencial & Online)</option>
                  </select>
                </div>
              </div>

              {/* Location & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Sede / Ubicación Geográfica</label>
                  <input
                    type="text"
                    placeholder="Ej: Salón Dorado Onassis, CABA / Hotel Grande Bretagne, Atenas"
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
                    <option value="completed">Realizada (Con Conclusiones)</option>
                    <option value="in_progress">En Curso / Sesiones Activas</option>
                    <option value="upcoming">Próxima / Convocatoria Abierta</option>
                  </select>
                </div>
              </div>

              {/* Cover Image URL */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">URL Foto de Portada / Banner</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... o /uploads/b2b-..."
                  value={form.cover_image_url}
                  onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Public Summary */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Resumen Público (Web Institucional)</label>
                <textarea
                  rows={3}
                  placeholder="Síntesis de la misión comercial y sectores convocados..."
                  value={form.public_summary}
                  onChange={(e) => setForm({ ...form, public_summary: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              {/* Metrics */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="font-bold text-slate-800 text-[11px] block uppercase tracking-wider">
                  Métricas de Impacto Comercial
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Empresas Participantes</label>
                    <input
                      type="number"
                      min="0"
                      value={form.participants_count}
                      onChange={(e) => setForm({ ...form, participants_count: Number(e.target.value) })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Reuniones 1-a-1</label>
                    <input
                      type="number"
                      min="0"
                      value={form.meetings_count}
                      onChange={(e) => setForm({ ...form, meetings_count: Number(e.target.value) })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-center font-bold text-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Acuerdos Comerciales</label>
                    <input
                      type="number"
                      min="0"
                      value={form.agreements_count}
                      onChange={(e) => setForm({ ...form, agreements_count: Number(e.target.value) })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-center font-bold text-emerald-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INFORME EXCLUSIVO SOCIOS */}
          {activeFormTab === 'partner' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>🔒 Exclusivo para el Portal de Socios:</strong> Estos campos no se muestran en la web pública. Son accesibles únicamente para las empresas socias autenticadas.
                </span>
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

      {/* Category Management Modal */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title="Administrar Sectores / Categorías de Rondas B2B"
        maxWidth="md"
      >
        <div className="space-y-5 text-xs">
          {catError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{catError}</span>
            </div>
          )}

          {/* Form Create / Edit Category */}
          <form onSubmit={handleSaveCategory} className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span>{editingCat ? 'Editar Sector / Categoría' : 'Nuevo Sector B2B'}</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej. Alimentos & Bebidas, Energía, Logística..."
                value={catNameInput}
                onChange={(e) => setCatNameInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                disabled={catActionLoading}
              />
              <button
                type="submit"
                disabled={catActionLoading || !catNameInput.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {editingCat ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Actualizar
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    Agregar
                  </>
                )}
              </button>
              {editingCat && (
                <button
                  type="button"
                  onClick={handleCancelEditCat}
                  className="px-2.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Categories List */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Sectores Registrados</span>
              <span>{categories.length} sectores</span>
            </div>

            {loadingCats ? (
              <div className="py-4 text-center text-slate-400">Cargando sectores...</div>
            ) : categories.length === 0 ? (
              <div className="py-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No hay sectores registrados. Crea uno arriba.
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100">
                {categories.map((cat) => {
                  const count = meetings.filter((m) => m.sector === cat.name).length;
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between py-2 px-2.5 hover:bg-slate-50 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{cat.name}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {count} {count === 1 ? 'ronda' : 'rondas'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => handleStartEditCat(cat)}
                          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => setIsCatModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
