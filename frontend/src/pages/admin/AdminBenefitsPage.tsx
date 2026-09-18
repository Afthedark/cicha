import React, { useEffect, useState, useMemo } from 'react';
import {
  Gift,
  Plus,
  Edit2,
  Trash2,
  Tag,
  Search,
  CheckCircle2,
  X,
  AlertCircle,
  Building2,
  Calendar,
  PercentCircle,
  Eye,
  EyeOff,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Users,
} from 'lucide-react';
import { adminApi, resolveImageUrl } from '../../services/api';
import type { PartnerBenefit, Category, Member } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminBenefitsPage: React.FC = () => {
  const [benefits, setBenefits] = useState<PartnerBenefit[]>([]);
  const [categories, setBenefitCategories] = useState<Category[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCats, setLoadingCats] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Category Manager Modal state
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catNameInput, setCatNameInput] = useState('');
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catActionLoading, setCatActionLoading] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  // Benefit Modal state
  const [isBenModalOpen, setIsBenModalOpen] = useState(false);
  const [editingBen, setEditingBen] = useState<PartnerBenefit | null>(null);
  const [benForm, setBenForm] = useState({
    title: '',
    provider_company: '',
    category: '',
    discount_description: '',
    how_to_claim: '',
    logo_url: '',
    valid_until: '',
    is_active: 1,
  });

  // Category Dropdown Search in Benefit Modal
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [catSearchTerm, setCatSearchTerm] = useState('');

  // Provider / Member Search in Benefit Modal
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const [submitting, setSubmitting] = useState(false);

  // Cargar categorías reales desde base de datos
  const fetchBenefitCategories = async () => {
    setLoadingCats(true);
    try {
      const data = await adminApi.getCategories('benefits');
      setBenefitCategories(data || []);
    } catch (err) {
      console.error('Error fetching benefit categories:', err);
      setBenefitCategories([]);
    } finally {
      setLoadingCats(false);
    }
  };

  // Cargar socios para selección rápida al crear beneficio
  const fetchMembers = async () => {
    try {
      const data = await adminApi.getMembers();
      setMembers(data || []);
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  // Cargar beneficios
  const fetchBenefits = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getPartnerBenefits();
      setBenefits(data || []);
    } catch (err) {
      console.error('Error fetching partner benefits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenefits();
    fetchBenefitCategories();
    fetchMembers();
  }, []);

  const handleOpenCreate = () => {
    setEditingBen(null);
    setSelectedMember(null);
    setMemberSearchTerm('');
    setCatSearchTerm('');
    setIsCatDropdownOpen(false);
    setIsMemberDropdownOpen(false);
    setBenForm({
      title: '',
      provider_company: '',
      category: categories.length > 0 ? categories[0].name : 'Logística & Transporte',
      discount_description: '',
      how_to_claim: '',
      logo_url: '',
      valid_until: '',
      is_active: 1,
    });
    setIsBenModalOpen(true);
  };

  const handleOpenEdit = (ben: PartnerBenefit) => {
    setEditingBen(ben);
    setMemberSearchTerm('');
    setCatSearchTerm('');
    setIsCatDropdownOpen(false);
    setIsMemberDropdownOpen(false);
    
    // Intentar asociar con socio si coincide el nombre
    const matchedMember = members.find(
      (m) => m.company_name.trim().toLowerCase() === (ben.provider_company || '').trim().toLowerCase()
    );
    setSelectedMember(matchedMember || null);

    setBenForm({
      title: ben.title,
      provider_company: ben.provider_company,
      category: ben.category || (categories.length > 0 ? categories[0].name : 'General'),
      discount_description: ben.discount_description,
      how_to_claim: ben.how_to_claim || '',
      logo_url: ben.logo_url || '',
      valid_until: ben.valid_until ? ben.valid_until.slice(0, 10) : '',
      is_active: ben.is_active ? 1 : 0,
    });
    setIsBenModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!benForm.title.trim() || !benForm.provider_company.trim() || !benForm.discount_description.trim()) {
      alert('Título, Empresa proveedora y Descripción del beneficio son obligatorios.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingBen) {
        await adminApi.updatePartnerBenefit(editingBen.id, benForm);
      } else {
        await adminApi.createPartnerBenefit(benForm);
      }
      setIsBenModalOpen(false);
      await fetchBenefits();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar el beneficio.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (ben: PartnerBenefit) => {
    try {
      const newStatus = ben.is_active ? 0 : 1;
      await adminApi.updatePartnerBenefit(ben.id, { is_active: newStatus });
      setBenefits((prev) =>
        prev.map((b) => (b.id === ben.id ? { ...b, is_active: newStatus } : b))
      );
    } catch (err) {
      alert('Error al cambiar estado del beneficio.');
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el beneficio "${title}"?`)) return;
    try {
      await adminApi.deletePartnerBenefit(id);
      await fetchBenefits();
    } catch (err) {
      alert('Error al eliminar beneficio.');
    }
  };

  // Category CRUD Handlers
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameInput.trim()) return;
    setCatActionLoading(true);
    setCatError(null);
    try {
      const name = catNameInput.trim();
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (editingCat) {
        await adminApi.updateCategory(editingCat.id, { name, slug, type: 'benefits' });
      } else {
        await adminApi.createCategory({ name, slug, type: 'benefits' });
      }
      setCatNameInput('');
      setEditingCat(null);
      await fetchBenefitCategories();
      await fetchBenefits();
    } catch (err: any) {
      setCatError(err.response?.data?.messages?.name || err.response?.data?.message || 'Error al guardar la categoría.');
    } finally {
      setCatActionLoading(false);
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    if (!window.confirm(`¿Eliminar la categoría "${cat.name}"?`)) return;
    try {
      await adminApi.deleteCategory(cat.id);
      await fetchBenefitCategories();
      await fetchBenefits();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar categoría.');
    }
  };

  // Filtrado de socios en el selector de empresa
  const filteredMembers = useMemo(() => {
    if (!memberSearchTerm.trim()) return members.slice(0, 15);
    const q = memberSearchTerm.toLowerCase();
    return members.filter(
      (m) =>
        m.company_name.toLowerCase().includes(q) ||
        (m.representative_name && m.representative_name.toLowerCase().includes(q)) ||
        (m.sector && m.sector.toLowerCase().includes(q))
    );
  }, [members, memberSearchTerm]);

  // Filtrado de categorías en el dropdown del formulario
  const filteredFormCategories = useMemo(() => {
    if (!catSearchTerm.trim()) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(catSearchTerm.toLowerCase()));
  }, [categories, catSearchTerm]);

  // Filtrado principal de beneficios en el listado
  const filteredBenefits = useMemo(() => {
    return benefits.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        !searchTerm ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.provider_company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.discount_description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [benefits, selectedCategory, searchTerm]);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cicha-navy via-[#004b87] to-cicha-navy p-6 sm:p-8 rounded-3xl text-white border border-blue-400/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-400/30 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5" />
              Gestión Comercial
            </span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
            Club de Beneficios & Convenios
          </h1>
          <p className="text-xs sm:text-sm text-sky-200 max-w-2xl leading-relaxed">
            Administra los descuentos, alianzas institucionales y ventajas comerciales para socios de CICHA, visibles tanto en la web pública como en el portal de socios.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => {
              setCatError(null);
              setCatNameInput('');
              setEditingCat(null);
              setIsCatModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Tag className="w-4 h-4 text-amber-300" />
            <span>Categorías ({categories.length})</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Nuevo Beneficio
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por beneficio, empresa o descuento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="text-xs font-semibold text-slate-500">
            Mostrando <strong>{filteredBenefits.length}</strong> de {benefits.length} beneficios
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-cicha-navy text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({benefits.length})
          </button>
          {categories.map((c) => {
            const count = benefits.filter((b) => b.category === c.name).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.name)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === c.name
                    ? 'bg-cicha-navy text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{c.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategory === c.name ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Benefits */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center bg-white rounded-2xl border border-slate-200 p-12">
          <Loader text="Cargando catálogo de beneficios..." size="lg" />
        </div>
      ) : filteredBenefits.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Gift className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No se encontraron beneficios</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No hay registros que coincidan con la búsqueda o la categoría seleccionada.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Crear Primer Beneficio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBenefits.map((ben) => (
            <div
              key={ben.id}
              className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                ben.is_active ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-60 bg-slate-50/50'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 text-[#004b87] flex items-center justify-center font-bold shrink-0 overflow-hidden shadow-2xs p-1">
                      {ben.logo_url ? (
                        <img
                          src={resolveImageUrl(ben.logo_url)}
                          alt={ben.provider_company}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <Building2 className="w-5 h-5 text-cicha-navy" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide truncate">
                        {ben.provider_company}
                      </p>
                      <h3 className="font-serif font-bold text-base text-slate-900 leading-snug line-clamp-2">
                        {ben.title}
                      </h3>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 shrink-0">
                    {ben.category || 'Convenio'}
                  </span>
                </div>

                {/* Discount Box */}
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-slate-800 leading-relaxed space-y-1">
                  <div className="flex items-center gap-1 font-bold text-amber-800 text-[11px]">
                    <PercentCircle className="w-3.5 h-3.5" /> Descuento / Ventaja:
                  </div>
                  <p className="line-clamp-3">{ben.discount_description}</p>
                </div>

                {/* Claim instruction for partners */}
                {ben.how_to_claim && (
                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <strong className="text-slate-700">Reclamo privado:</strong> {ben.how_to_claim}
                  </div>
                )}

                {/* Validity */}
                {ben.valid_until && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Hasta: {new Date(ben.valid_until).toLocaleDateString('es-AR')}</span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleActive(ben)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    ben.is_active
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {ben.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {ben.is_active ? 'Público' : 'Oculto'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(ben)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-all cursor-pointer"
                    title="Editar beneficio"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ben.id, ben.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                    title="Eliminar beneficio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Benefit Modal with Searchable Provider & Category */}
      <Modal
        isOpen={isBenModalOpen}
        onClose={() => setIsBenModalOpen(false)}
        title={editingBen ? 'Editar Beneficio' : 'Nuevo Beneficio / Convenio'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Título del Beneficio / Convenio *
            </label>
            <input
              type="text"
              required
              value={benForm.title}
              onChange={(e) => setBenForm({ ...benForm, title: e.target.value })}
              placeholder="Ej: 20% de Descuento en Fletes Marítimos y Aéreos"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Empresa Proveedora con Buscador de Socios */}
            <div className="space-y-1.5 relative">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Empresa Proveedora / Aliada *
                </label>
                <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
                  <Users className="w-3 h-3" /> Buscar socio
                </span>
              </div>

              {/* Botón selector con buscador desplegable */}
              <div className="relative">
                <input
                  type="text"
                  required
                  value={benForm.provider_company}
                  onChange={(e) => {
                    setBenForm({ ...benForm, provider_company: e.target.value });
                    setMemberSearchTerm(e.target.value);
                    setIsMemberDropdownOpen(true);
                  }}
                  onFocus={() => setIsMemberDropdownOpen(true)}
                  placeholder="Escriba o busque en socios registrados..."
                  className="w-full px-3.5 py-2.5 pr-8 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white font-medium"
                />
                <button
                  type="button"
                  onClick={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${isMemberDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>

                {/* Dropdown de Socios */}
                {isMemberDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 p-2 space-y-2 max-h-60 flex flex-col">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Filtrar por nombre o sector..."
                        value={memberSearchTerm}
                        onChange={(e) => setMemberSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                        autoFocus
                      />
                    </div>

                    <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
                      {filteredMembers.length > 0 ? (
                        filteredMembers.map((m) => {
                          const isSelected = benForm.provider_company === m.company_name;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                setBenForm({
                                  ...benForm,
                                  provider_company: m.company_name,
                                  logo_url: m.logo_url || benForm.logo_url,
                                });
                                setSelectedMember(m);
                                setIsMemberDropdownOpen(false);
                              }}
                              className={`w-full text-left p-2 rounded-xl flex items-center justify-between gap-2 text-xs transition-colors hover:bg-blue-50/80 cursor-pointer ${
                                isSelected ? 'bg-blue-50 font-bold text-blue-700' : 'text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 shrink-0 p-0.5 flex items-center justify-center overflow-hidden">
                                  {m.logo_url ? (
                                    <img src={resolveImageUrl(m.logo_url)} alt={m.company_name} className="w-full h-full object-contain" />
                                  ) : (
                                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                                  )}
                                </div>
                                <div className="truncate">
                                  <p className="truncate font-medium">{m.company_name}</p>
                                  {m.sector && <p className="text-[10px] text-slate-400 truncate">{m.sector}</p>}
                                </div>
                              </div>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-3 text-center text-[11px] text-slate-400">
                          No se encontraron socios con ese nombre. Puedes escribir una empresa externa manualmente arriba.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Categoría con Buscador Integrado */}
            <div className="space-y-1.5 relative">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Categoría *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCatModalOpen(true);
                  }}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline"
                >
                  <Tag className="w-3 h-3" /> + Gestionar
                </button>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-left flex items-center justify-between transition-all bg-white text-xs font-medium"
                >
                  <span className="truncate">
                    {benForm.category || 'Seleccione una categoría...'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCatDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>

                {isCatDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 p-2 space-y-2 max-h-60 flex flex-col">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Buscar categoría..."
                        value={catSearchTerm}
                        onChange={(e) => setCatSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                        autoFocus
                      />
                    </div>

                    <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
                      {filteredFormCategories.length > 0 ? (
                        filteredFormCategories.map((c) => {
                          const isSelected = benForm.category === c.name;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setBenForm({ ...benForm, category: c.name });
                                setIsCatDropdownOpen(false);
                              }}
                              className={`w-full text-left p-2 rounded-xl flex items-center justify-between text-xs transition-colors hover:bg-blue-50/80 cursor-pointer ${
                                isSelected ? 'bg-blue-50 font-bold text-blue-700' : 'text-slate-700'
                              }`}
                            >
                              <span>{c.name}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-3 text-center text-[11px] text-slate-400">
                          No hay categorías coincidentes.{' '}
                          <button
                            type="button"
                            onClick={() => {
                              setIsCatDropdownOpen(false);
                              setIsCatModalOpen(true);
                            }}
                            className="text-blue-600 underline font-bold"
                          >
                            Crear nueva
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Descripción del Descuento / Beneficio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Descripción del Descuento / Beneficio *
            </label>
            <textarea
              required
              rows={3}
              value={benForm.discount_description}
              onChange={(e) => setBenForm({ ...benForm, discount_description: e.target.value })}
              placeholder="Detalla el beneficio, porcentaje de descuento o condición especial aplicable a los socios..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          {/* Instrucciones de Reclamo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Instrucciones de Reclamo (Exclusivo para Socios)
            </label>
            <input
              type="text"
              value={benForm.how_to_claim}
              onChange={(e) => setBenForm({ ...benForm, how_to_claim: e.target.value })}
              placeholder="Ej: Presentar código CICHA-VIP2026 o contactar a info@empresa.com"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Logo URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                URL del Logotipo / Imagen
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={benForm.logo_url}
                  onChange={(e) => setBenForm({ ...benForm, logo_url: e.target.value })}
                  placeholder="https://... o ruta de imagen"
                  className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
                {benForm.logo_url && (
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={resolveImageUrl(benForm.logo_url)}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Válido Hasta */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Válido Hasta (Opcional)
              </label>
              <input
                type="date"
                value={benForm.valid_until}
                onChange={(e) => setBenForm({ ...benForm, valid_until: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>

          {/* Switch Activo */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_active_ben"
              checked={benForm.is_active === 1}
              onChange={(e) => setBenForm({ ...benForm, is_active: e.target.checked ? 1 : 0 })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
            />
            <label htmlFor="is_active_ben" className="text-xs font-bold text-slate-700 cursor-pointer">
              Beneficio activo y visible en la web pública y portal de socios
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsBenModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-cicha-navy hover:bg-[#003866] text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : editingBen ? 'Actualizar Beneficio' : 'Crear Beneficio'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Category Manager Modal con CRUD 100% Real */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title="Administrar Categorías de Beneficios"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          <form onSubmit={handleSaveCategory} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Nombre de categoría (ej: Hotelería & Turismo)..."
              value={catNameInput}
              onChange={(e) => setCatNameInput(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              autoFocus
            />
            <button
              type="submit"
              disabled={catActionLoading}
              className="px-4 py-2 rounded-xl bg-cicha-navy hover:bg-[#003866] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {catActionLoading ? 'Guardando...' : editingCat ? 'Actualizar' : 'Agregar'}
            </button>
            {editingCat && (
              <button
                type="button"
                onClick={() => {
                  setEditingCat(null);
                  setCatNameInput('');
                }}
                className="px-3 py-2 rounded-xl border border-slate-300 text-slate-600 text-xs hover:bg-slate-50"
              >
                Cancelar
              </button>
            )}
          </form>

          {catError && (
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-1.5 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{catError}</span>
            </div>
          )}

          <div className="space-y-1.5 max-h-64 overflow-y-auto pt-2 border-t border-slate-100">
            {categories.length > 0 ? (
              categories.map((c) => {
                const count = benefits.filter((b) => b.category === c.name).length;
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium hover:bg-blue-50/40 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-semibold text-slate-800">{c.name}</span>
                      <span className="text-[10px] text-slate-400">({count} beneficios)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCat(c);
                          setCatNameInput(c.name);
                        }}
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Editar categoría"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(c)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                        title="Eliminar categoría"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-slate-400">
                <Tag className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                <p className="text-xs">No hay categorías registradas.</p>
                <p className="text-[11px] text-slate-400">Agrega tu primera categoría arriba.</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
