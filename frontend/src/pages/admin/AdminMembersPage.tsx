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
  Tags,
  Search,
  ChevronDown,
  ArrowRight,
  X,
} from 'lucide-react';
import { adminApi, resolveImageUrl } from '../../services/api';
import type { Member, CommercialOpportunity, PartnerResource, PartnerBenefit, Category } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ImageUploader } from '../../components/common/ImageUploader';
import { DocumentUploader } from '../../components/common/DocumentUploader';

export const AdminMembersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'members' | 'categories' | 'opportunities' | 'resources' | 'benefits'>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [opportunities, setOpportunities] = useState<CommercialOpportunity[]>([]);
  const [resources, setResources] = useState<PartnerResource[]>([]);
  const [benefits, setBenefits] = useState<PartnerBenefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');

  // Filtered lists based on globalSearch and activeTab
  const filteredMembers = members.filter((m) => {
    if (!globalSearch.trim()) return true;
    const term = globalSearch.toLowerCase();
    return (
      m.company_name?.toLowerCase().includes(term) ||
      m.representative_name?.toLowerCase().includes(term) ||
      m.sector?.toLowerCase().includes(term) ||
      m.contact_email?.toLowerCase().includes(term) ||
      m.country?.toLowerCase().includes(term)
    );
  });

  const filteredCategories = categories.filter((c) => {
    if (!globalSearch.trim()) return true;
    return c.name.toLowerCase().includes(globalSearch.toLowerCase());
  });

  const filteredOpportunities = opportunities.filter((o) => {
    if (!globalSearch.trim()) return true;
    const term = globalSearch.toLowerCase();
    return (
      o.title?.toLowerCase().includes(term) ||
      o.sector?.toLowerCase().includes(term) ||
      o.origin_country?.toLowerCase().includes(term) ||
      o.target_country?.toLowerCase().includes(term)
    );
  });

  const filteredResources = resources.filter((r) => {
    if (!globalSearch.trim()) return true;
    const term = globalSearch.toLowerCase();
    return (
      r.title?.toLowerCase().includes(term) ||
      r.category?.toLowerCase().includes(term) ||
      r.file_type?.toLowerCase().includes(term)
    );
  });

  const filteredBenefits = benefits.filter((b) => {
    if (!globalSearch.trim()) return true;
    const term = globalSearch.toLowerCase();
    return (
      b.title?.toLowerCase().includes(term) ||
      b.provider_company?.toLowerCase().includes(term) ||
      b.category?.toLowerCase().includes(term) ||
      b.discount_description?.toLowerCase().includes(term)
    );
  });

  // Category CRUD state
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');

  // Modals
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  // Member Sector Dropdown State
  const [sectorSearch, setSectorSearch] = useState('');
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);

  // Opportunity Sector Dropdown State
  const [oppSectorSearch, setOppSectorSearch] = useState('');
  const [isOppSectorDropdownOpen, setIsOppSectorDropdownOpen] = useState(false);

  // Resource Category Dropdown State
  const [resCatSearch, setResCatSearch] = useState('');
  const [isResCatDropdownOpen, setIsResCatDropdownOpen] = useState(false);

  // Benefit Category Dropdown State
  const [benefitCatSearch, setBenefitCatSearch] = useState('');
  const [isBenefitCatDropdownOpen, setIsBenefitCatDropdownOpen] = useState(false);

  const [memberForm, setMemberForm] = useState({
    company_name: '',
    representative_name: '',
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
    order_num: 1,
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
    requirements: '',
    contact_person: '',
    contact_email: 'comercio@cicha.com.ar',
    status: 'open' as any,
    deadline: '',
  });

  const [isResModalOpen, setIsResModalOpen] = useState(false);
  const [editingRes, setEditingRes] = useState<PartnerResource | null>(null);
  const [resForm, setResForm] = useState({
    title: '',
    category: '',
    description: '',
    file_url: '',
    file_type: 'PDF',
    file_size: '1.5 MB',
  });

  // Benefit CRUD state
  const [isBenefitModalOpen, setIsBenefitModalOpen] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<PartnerBenefit | null>(null);
  const [benefitForm, setBenefitForm] = useState({
    title: '',
    provider_company: '',
    category: '',
    discount_description: '',
    how_to_claim: '',
    logo_url: '',
    valid_until: '',
    is_active: 1,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      adminApi.getMembers(),
      adminApi.getCategories('members'),
      adminApi.getOpportunities(),
      adminApi.getPartnerResources(),
      adminApi.getPartnerBenefits(),
    ])
      .then(([mems, cats, opps, resList, benList]) => {
        setMembers(mems || []);
        if (!cats || cats.length === 0) {
          const defaultCatNames = [
            'Marítimo & Logística',
            'Agroindustria & Alimentos',
            'Energía & Sustentabilidad',
            'Servicios Jurídicos & Finanzas',
            'Tecnología & Innovación',
            'Turismo & Comercio Exterior',
            'Industria & Manufactura',
          ];
          setCategories(defaultCatNames.map((name, idx) => ({ id: idx + 1, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), type: 'members' })));
        } else {
          setCategories(cats);
        }
        setOpportunities(opps || []);
        setResources(resList || []);
        setBenefits(benList || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // Benefit Handlers
  const handleOpenCreateBenefit = () => {
    setEditingBenefit(null);
    setBenefitCatSearch('');
    setIsBenefitCatDropdownOpen(false);
    setBenefitForm({
      title: '',
      provider_company: '',
      category: categories[0]?.name || 'Marítimo & Logística',
      discount_description: '',
      how_to_claim: '',
      logo_url: '',
      valid_until: '',
      is_active: 1,
    });
    setIsBenefitModalOpen(true);
  };

  const handleOpenEditBenefit = (ben: PartnerBenefit) => {
    setEditingBenefit(ben);
    setBenefitCatSearch('');
    setIsBenefitCatDropdownOpen(false);
    setBenefitForm({
      title: ben.title,
      provider_company: ben.provider_company,
      category: ben.category,
      discount_description: ben.discount_description,
      how_to_claim: ben.how_to_claim || '',
      logo_url: ben.logo_url || '',
      valid_until: ben.valid_until || '',
      is_active: ben.is_active ? 1 : 0,
    });
    setIsBenefitModalOpen(true);
  };

  const handleSubmitBenefit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!benefitForm.category) {
      alert('Por favor seleccione una categoría/sector.');
      return;
    }
    setSubmitting(true);
    try {
      if (editingBenefit) {
        await adminApi.updatePartnerBenefit(editingBenefit.id, benefitForm);
      } else {
        await adminApi.createPartnerBenefit(benefitForm);
      }
      setIsBenefitModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.messages ? Object.values(err.response.data.messages).join(' ') : 'Error al guardar beneficio.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBenefit = async (id: number) => {
    if (!window.confirm('¿Desea eliminar este beneficio/convenio?')) return;
    try {
      await adminApi.deletePartnerBenefit(id);
      fetchData();
    } catch {
      alert('Error al eliminar beneficio.');
    }
  };

  // Category Handlers
  const handleOpenCreateCat = () => {
    setEditingCat(null);
    setCatName('');
    setIsCatModalOpen(true);
  };

  const handleOpenEditCat = (cat: Category) => {
    setEditingCat(cat);
    setCatName(cat.name);
    setIsCatModalOpen(true);
  };

  const handleSubmitCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    setSubmitting(true);
    try {
      if (editingCat) {
        await adminApi.updateCategory(editingCat.id, { name: catName.trim(), type: 'members' });
      } else {
        await adminApi.createCategory({ name: catName.trim(), type: 'members' });
      }
      setIsCatModalOpen(false);
      fetchData();
    } catch {
      alert('Error al guardar categoría/rubro.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCat = async (cat: Category) => {
    if (!window.confirm(`¿Desea eliminar la categoría "${cat.name}"?`)) return;
    try {
      await adminApi.deleteCategory(cat.id);
      fetchData();
    } catch {
      alert('Error al eliminar categoría.');
    }
  };

  // Member Handlers
  const handleOpenCreateMember = () => {
    setEditingMember(null);
    setSectorSearch('');
    setIsSectorDropdownOpen(false);
    setMemberForm({
      company_name: '',
      representative_name: '',
      sector: categories[0]?.name || '',
      description: '',
      services: '',
      website_url: '',
      contact_email: '',
      contact_phone: '',
      country: 'Argentina',
      logo_url: '',
      is_featured: 0,
      status: 'active',
      order_num: members.length + 1,
    });
    setIsMemberModalOpen(true);
  };

  const handleOpenEditMember = (m: Member) => {
    setEditingMember(m);
    setSectorSearch('');
    setIsSectorDropdownOpen(false);
    setMemberForm({
      company_name: m.company_name,
      representative_name: m.representative_name || '',
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
      order_num: m.order_num || 0,
    });
    setIsMemberModalOpen(true);
  };

  const handleSubmitMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.sector) {
      alert('Por favor seleccione un sector/categoría.');
      return;
    }
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
    setOppSectorSearch('');
    setIsOppSectorDropdownOpen(false);
    setOppForm({
      title: '',
      type: 'export',
      origin_country: 'Grecia',
      target_country: 'Argentina',
      sector: categories[0]?.name || 'Marítimo & Logística',
      description: '',
      requirements: '',
      contact_person: '',
      contact_email: 'comercio@cicha.com.ar',
      status: 'open',
      deadline: '',
    });
    setIsOppModalOpen(true);
  };

  const handleOpenEditOpp = (opp: CommercialOpportunity) => {
    setEditingOpp(opp);
    setOppSectorSearch('');
    setIsOppSectorDropdownOpen(false);
    setOppForm({
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
    setIsOppModalOpen(true);
  };

  const handleSubmitOpp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppForm.sector) {
      alert('Por favor seleccione un sector/categoría.');
      return;
    }
    setSubmitting(true);
    try {
      if (editingOpp) {
        await adminApi.updateOpportunity(editingOpp.id, oppForm);
      } else {
        await adminApi.createOpportunity(oppForm);
      }
      setIsOppModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.messages ? Object.values(err.response.data.messages).join(' ') : 'Error al guardar oportunidad.');
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
    setResCatSearch('');
    setIsResCatDropdownOpen(false);
    setResForm({
      title: '',
      category: categories[0]?.name || 'Marítimo & Logística',
      description: '',
      file_url: '',
      file_type: 'PDF',
      file_size: '1.5 MB',
    });
    setIsResModalOpen(true);
  };

  const handleOpenEditRes = (res: PartnerResource) => {
    setEditingRes(res);
    setResCatSearch('');
    setIsResCatDropdownOpen(false);
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
    if (!resForm.category) {
      alert('Por favor seleccione una categoría/sector.');
      return;
    }
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
              : activeTab === 'categories'
              ? handleOpenCreateCat
              : activeTab === 'opportunities'
              ? handleOpenCreateOpp
              : activeTab === 'resources'
              ? handleOpenCreateRes
              : handleOpenCreateBenefit
          }
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'members'
            ? 'Nuevo Socio'
            : activeTab === 'categories'
            ? 'Nuevo Sector / Rubro'
            : activeTab === 'opportunities'
            ? 'Nueva Oportunidad'
            : activeTab === 'resources'
            ? 'Nuevo Documento'
            : 'Nuevo Beneficio / Convenio'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 sm:gap-3 border-b border-slate-200 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab('members')}
          className={`pb-3 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'members'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          Directorio de Socios ({members.length})
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Tags className="w-4 h-4" />
          Sectores &amp; Categorías ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab('opportunities')}
          className={`pb-3 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
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
          className={`pb-3 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'resources'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileDown className="w-4 h-4" />
          Biblioteca de Socios ({resources.length})
        </button>

        <button
          onClick={() => setActiveTab('benefits')}
          className={`pb-3 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'benefits'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Gift className="w-4 h-4" />
          Club de Beneficios ({benefits.length})
        </button>
      </div>

      {/* Global Search Bar Contextual */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder={
              activeTab === 'members'
                ? 'Buscar por empresa, representante, sector, email o país...'
                : activeTab === 'categories'
                ? 'Buscar sector o rubro...'
                : activeTab === 'opportunities'
                ? 'Buscar oportunidad comercial, sector o país...'
                : activeTab === 'resources'
                ? 'Buscar documento o biblioteca de socios...'
                : 'Buscar beneficio, empresa proveedora o categoría...'
            }
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-400"
          />
          {globalSearch && (
            <button
              type="button"
              onClick={() => setGlobalSearch('')}
              className="absolute right-3 top-2.5 p-0.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              title="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="text-[11px] font-semibold text-slate-500 shrink-0 flex items-center gap-1.5 px-2">
          <span>Mostrando:</span>
          <span className="font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
            {activeTab === 'members'
              ? `${filteredMembers.length} de ${members.length} socios`
              : activeTab === 'categories'
              ? `${filteredCategories.length} de ${categories.length} sectores`
              : activeTab === 'opportunities'
              ? `${filteredOpportunities.length} de ${opportunities.length} oportunidades`
              : activeTab === 'resources'
              ? `${filteredResources.length} de ${resources.length} documentos`
              : `${filteredBenefits.length} de ${benefits.length} beneficios`}
          </span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Loader text="Cargando módulo de socios..." />
      ) : activeTab === 'members' ? (
        /* Members Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredMembers.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Building className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No se encontraron empresas socias</p>
              {globalSearch ? (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-400">No hay resultados para "{globalSearch}"</p>
                  <button
                    onClick={() => setGlobalSearch('')}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Limpiar búsqueda
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleOpenCreateMember}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Agregar Primer Socio
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Nº</th>
                    <th className="py-3.5 px-4">Empresa</th>
                    <th className="py-3.5 px-4">Sector</th>
                    <th className="py-3.5 px-4">País</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.map((mem, idx) => (
                    <tr key={mem.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-400">
                        #{mem.order_num || idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden p-1">
                            {mem.logo_url ? (
                              <img
                                src={resolveImageUrl(mem.logo_url)}
                                alt={mem.company_name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <Building className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{mem.company_name}</div>
                            {mem.representative_name && (
                              <div className="text-[11px] font-semibold text-blue-700 flex items-center gap-1">
                                <span>Rep.:</span> {mem.representative_name}
                              </div>
                            )}
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
          )}
        </div>
      ) : activeTab === 'categories' ? (
        /* Categories / Sectores Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-sm text-slate-800">Sectores y Rubros de Empresas Socias</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Edite, agregue o elimine las categorías que organizan el directorio y los filtros de la web pública.
            </p>
          </div>

          {filteredCategories.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Tags className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No se encontraron sectores</p>
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch('')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Nombre del Sector / Rubro</th>
                    <th className="py-3.5 px-4">Socios Asignados</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCategories.map((cat) => {
                    const count = members.filter((m) => m.sector?.toLowerCase() === cat.name.toLowerCase()).length;
                    return (
                      <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <Tags className="w-4 h-4 text-blue-600 shrink-0" />
                            <span className="font-bold text-slate-900 text-sm">{cat.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {count} {count === 1 ? 'empresa' : 'empresas'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditCat(cat)}
                              title="Editar nombre del sector"
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteCat(cat)}
                              title="Eliminar sector"
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : activeTab === 'opportunities' ? (
        /* Opportunities Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredOpportunities.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <TrendingUp className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No se encontraron oportunidades</p>
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch('')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          ) : (
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
                  {filteredOpportunities.map((opp) => (
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
          )}
        </div>
      ) : activeTab === 'resources' ? (
        /* Resources Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredResources.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <FileDown className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No se encontraron documentos</p>
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch('')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          ) : (
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
                  {filteredResources.map((res) => (
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
          )}
        </div>
      ) : (
        /* Benefits Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredBenefits.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Gift className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No se encontraron beneficios corporativos</p>
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch('')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Beneficio / Convenio</th>
                    <th className="py-3.5 px-4">Empresa Proveedora</th>
                    <th className="py-3.5 px-4">Categoría</th>
                    <th className="py-3.5 px-4">Vigencia</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBenefits.map((ben) => (
                    <tr key={ben.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{ben.title}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{ben.discount_description}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-blue-700">{ben.provider_company}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant="secondary">
                          {ben.category}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {ben.valid_until ? new Date(ben.valid_until).toLocaleDateString() : 'Permanente'}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={ben.is_active ? 'success' : 'secondary'}>
                          {ben.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditBenefit(ben)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBenefit(ben.id)}
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
          )}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Razón Social *</label>
              <input
                type="text"
                required
                placeholder="Ej. AGENCIA MARITIMA DULCE S.A."
                value={memberForm.company_name}
                onChange={(e) => setMemberForm({ ...memberForm, company_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Representante / Titular</label>
              <input
                type="text"
                placeholder="Ej. Lic. Osvaldo Benvenuto"
                value={memberForm.representative_name}
                onChange={(e) => setMemberForm({ ...memberForm, representative_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 relative">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">Sector / Rubro *</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsMemberModalOpen(false);
                    setActiveTab('categories');
                  }}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline"
                >
                  <Tags className="w-3 h-3" />
                  <span>Administrar Sectores</span>
                </button>
              </div>

              {/* Selector Estricto con Búsqueda Integrada */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSectorDropdownOpen(!isSectorDropdownOpen)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between transition-all bg-white text-xs ${
                    !memberForm.sector
                      ? 'border-slate-200 text-slate-400'
                      : 'border-blue-300 text-slate-900 font-semibold bg-blue-50/30'
                  }`}
                >
                  <span className="truncate">
                    {memberForm.sector || 'Seleccione un sector de la lista...'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isSectorDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>

                {/* Input oculto para validación required en form */}
                <input
                  type="text"
                  required
                  value={memberForm.sector}
                  onChange={() => {}}
                  className="opacity-0 absolute inset-0 pointer-events-none -z-10 h-full w-full"
                  tabIndex={-1}
                />

                {/* Dropdown Menu con Buscador */}
                {isSectorDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-2 space-y-2 max-h-64 flex flex-col animate-in fade-in zoom-in-95 duration-100">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Buscar sector / rubro..."
                        autoFocus
                        value={sectorSearch}
                        onChange={(e) => setSectorSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
                      {categories
                        .filter((c) => c.name.toLowerCase().includes(sectorSearch.toLowerCase()))
                        .map((c) => {
                          const isSelected = memberForm.sector === c.name;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setMemberForm({ ...memberForm, sector: c.name });
                                setIsSectorDropdownOpen(false);
                                setSectorSearch('');
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                                isSelected
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'text-slate-700 hover:bg-slate-100 font-medium'
                              }`}
                            >
                              <span className="truncate">{c.name}</span>
                              {isSelected && <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />}
                            </button>
                          );
                        })}

                      {categories.filter((c) => c.name.toLowerCase().includes(sectorSearch.toLowerCase())).length === 0 && (
                        <div className="p-3 text-center space-y-2">
                          <p className="text-slate-400 text-[11px]">No se encontró "{sectorSearch}"</p>
                          <button
                            type="button"
                            onClick={() => {
                              setIsSectorDropdownOpen(false);
                              setIsMemberModalOpen(false);
                              setActiveTab('categories');
                              handleOpenCreateCat();
                            }}
                            className="text-[11px] font-bold text-blue-600 hover:underline flex items-center justify-center gap-1 mx-auto"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Crear en Sectores & Categorías</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Sitio Web</label>
              <input
                type="url"
                value={memberForm.website_url}
                onChange={(e) => setMemberForm({ ...memberForm, website_url: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Orden / Posición en el Directorio *</label>
              <input
                type="number"
                min={1}
                required
                value={memberForm.order_num === 0 ? '' : memberForm.order_num}
                onChange={(e) => setMemberForm({ ...memberForm, order_num: e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 1 })}
                placeholder="1, 2, 3..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <p className="text-[10.5px] text-slate-500">Número menor (ej. 1, 2, 3) se muestra primero en el Directorio de Socios.</p>
            </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 relative">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">Sector / Categoría *</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsOppModalOpen(false);
                    setActiveTab('categories');
                  }}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline"
                >
                  <Tags className="w-3 h-3" />
                  <span>Administrar Sectores</span>
                </button>
              </div>

              {/* Selector Dinámico de Sector para Oportunidades */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsOppSectorDropdownOpen(!isOppSectorDropdownOpen)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between transition-all bg-white text-xs ${
                    !oppForm.sector
                      ? 'border-slate-200 text-slate-400'
                      : 'border-blue-300 text-slate-900 font-semibold bg-blue-50/30'
                  }`}
                >
                  <span className="truncate">
                    {oppForm.sector || 'Seleccione un sector...'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isOppSectorDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>

                <input
                  type="text"
                  required
                  value={oppForm.sector}
                  onChange={() => {}}
                  className="opacity-0 absolute inset-0 pointer-events-none -z-10 h-full w-full"
                  tabIndex={-1}
                />

                {isOppSectorDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-2 space-y-2 max-h-64 flex flex-col animate-in fade-in zoom-in-95 duration-100">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Buscar sector / rubro..."
                        autoFocus
                        value={oppSectorSearch}
                        onChange={(e) => setOppSectorSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
                      {categories
                        .filter((c) => c.name.toLowerCase().includes(oppSectorSearch.toLowerCase()))
                        .map((c) => {
                          const isSelected = oppForm.sector === c.name;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setOppForm({ ...oppForm, sector: c.name });
                                setIsOppSectorDropdownOpen(false);
                                setOppSectorSearch('');
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                                isSelected
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'text-slate-700 hover:bg-slate-100 font-medium'
                              }`}
                            >
                              <span className="truncate">{c.name}</span>
                              {isSelected && <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />}
                            </button>
                          );
                        })}

                      {categories.filter((c) => c.name.toLowerCase().includes(oppSectorSearch.toLowerCase())).length === 0 && (
                        <div className="p-3 text-center space-y-2">
                          <p className="text-slate-400 text-[11px]">No se encontró "{oppSectorSearch}"</p>
                          <button
                            type="button"
                            onClick={() => {
                              setIsOppSectorDropdownOpen(false);
                              setIsOppModalOpen(false);
                              setActiveTab('categories');
                              handleOpenCreateCat();
                            }}
                            className="text-[11px] font-bold text-blue-600 hover:underline flex items-center justify-center gap-1 mx-auto"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Crear en Sectores & Categorías</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Estado</label>
              <select
                value={oppForm.status}
                onChange={(e) => setOppForm({ ...oppForm, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="open">Abierta / Activa</option>
                <option value="in_negotiation">En Negociación</option>
                <option value="closed">Cerrada</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Descripción Detallada *</label>
            <textarea
              rows={3}
              required
              placeholder="Detalles de la demanda o propuesta comercial bilateral..."
              value={oppForm.description}
              onChange={(e) => setOppForm({ ...oppForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Requisitos / Perfil Solicitado</label>
            <textarea
              rows={2}
              placeholder="Certificaciones, volumen mínimo, condiciones arancelarias..."
              value={oppForm.requirements}
              onChange={(e) => setOppForm({ ...oppForm, requirements: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Persona de Contacto</label>
              <input
                type="text"
                placeholder="Nombre del responsable"
                value={oppForm.contact_person}
                onChange={(e) => setOppForm({ ...oppForm, contact_person: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Email de Contacto</label>
              <input
                type="email"
                value={oppForm.contact_email}
                onChange={(e) => setOppForm({ ...oppForm, contact_email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Fecha Límite (Opcional)</label>
              <input
                type="date"
                value={oppForm.deadline}
                onChange={(e) => setOppForm({ ...oppForm, deadline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
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

          <div className="space-y-1.5 relative">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">Categoría / Sector *</label>
              <button
                type="button"
                onClick={() => {
                  setIsResModalOpen(false);
                  setActiveTab('categories');
                }}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline"
              >
                <Tags className="w-3 h-3" />
                <span>Administrar Sectores</span>
              </button>
            </div>

            {/* Selector Dinámico de Categoría para Recursos */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsResCatDropdownOpen(!isResCatDropdownOpen)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between transition-all bg-white text-xs ${
                  !resForm.category
                    ? 'border-slate-200 text-slate-400'
                    : 'border-blue-300 text-slate-900 font-semibold bg-blue-50/30'
                }`}
              >
                <span className="truncate">
                  {resForm.category || 'Seleccione una categoría/sector...'}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isResCatDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
              </button>

              <input
                type="text"
                required
                value={resForm.category}
                onChange={() => {}}
                className="opacity-0 absolute inset-0 pointer-events-none -z-10 h-full w-full"
                tabIndex={-1}
              />

              {isResCatDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-2 space-y-2 max-h-64 flex flex-col animate-in fade-in zoom-in-95 duration-100">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Buscar sector / categoría..."
                      autoFocus
                      value={resCatSearch}
                      onChange={(e) => setResCatSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
                    {categories
                      .filter((c) => c.name.toLowerCase().includes(resCatSearch.toLowerCase()))
                      .map((c) => {
                        const isSelected = resForm.category === c.name;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setResForm({ ...resForm, category: c.name });
                              setIsResCatDropdownOpen(false);
                              setResCatSearch('');
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                              isSelected
                                ? 'bg-blue-600 text-white font-bold'
                                : 'text-slate-700 hover:bg-slate-100 font-medium'
                            }`}
                          >
                            <span className="truncate">{c.name}</span>
                            {isSelected && <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />}
                          </button>
                        );
                      })}

                    {categories.filter((c) => c.name.toLowerCase().includes(resCatSearch.toLowerCase())).length === 0 && (
                      <div className="p-3 text-center space-y-2">
                        <p className="text-slate-400 text-[11px]">No se encontró "{resCatSearch}"</p>
                        <button
                          type="button"
                          onClick={() => {
                            setIsResCatDropdownOpen(false);
                            setIsResModalOpen(false);
                            setActiveTab('categories');
                            handleOpenCreateCat();
                          }}
                          className="text-[11px] font-bold text-blue-600 hover:underline flex items-center justify-center gap-1 mx-auto"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Crear en Sectores & Categorías</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <DocumentUploader
              label="Documento PDF o Enlace Web *"
              fileUrl={resForm.file_url}
              fileType={resForm.file_type}
              fileSize={resForm.file_size}
              onChange={(data) => {
                setResForm((prev) => ({
                  ...prev,
                  file_url: data.fileUrl,
                  file_type: data.fileType || prev.file_type || 'PDF',
                  file_size: data.fileSize || prev.file_size || '',
                }));
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Tipo de Formato</label>
              <input
                type="text"
                placeholder="PDF, XLS, DOCX, URL"
                value={resForm.file_type}
                onChange={(e) => setResForm({ ...resForm, file_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Tamaño / Peso</label>
              <input
                type="text"
                placeholder="Ej. 2.4 MB"
                value={resForm.file_size}
                onChange={(e) => setResForm({ ...resForm, file_size: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Descripción del Documento</label>
            <textarea
              rows={2}
              placeholder="Breve reseña sobre el contenido o alcance del informe..."
              value={resForm.description}
              onChange={(e) => setResForm({ ...resForm, description: e.target.value })}
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

      {/* Benefit Modal */}
      <Modal
        isOpen={isBenefitModalOpen}
        onClose={() => setIsBenefitModalOpen(false)}
        title={editingBenefit ? 'Editar Beneficio / Convenio' : 'Nuevo Beneficio / Convenio'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitBenefit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Título del Beneficio / Convenio *</label>
            <input
              type="text"
              required
              placeholder="Ej. 25% de Descuento en Fletes y Logística Marítima"
              value={benefitForm.title}
              onChange={(e) => setBenefitForm({ ...benefitForm, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Empresa Proveedora *</label>
              <input
                type="text"
                required
                placeholder="Ej. Hellenic Shipping & Logistics"
                value={benefitForm.provider_company}
                onChange={(e) => setBenefitForm({ ...benefitForm, provider_company: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5 relative">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">Categoría / Sector *</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsBenefitModalOpen(false);
                    setActiveTab('categories');
                  }}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline"
                >
                  <Tags className="w-3 h-3" />
                  <span>Administrar Sectores</span>
                </button>
              </div>

              {/* Selector Dinámico de Categoría para Beneficios */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsBenefitCatDropdownOpen(!isBenefitCatDropdownOpen)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between transition-all bg-white text-xs ${
                    !benefitForm.category
                      ? 'border-slate-200 text-slate-400'
                      : 'border-blue-300 text-slate-900 font-semibold bg-blue-50/30'
                  }`}
                >
                  <span className="truncate">
                    {benefitForm.category || 'Seleccione un sector/categoría...'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isBenefitCatDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>

                <input
                  type="text"
                  required
                  value={benefitForm.category}
                  onChange={() => {}}
                  className="opacity-0 absolute inset-0 pointer-events-none -z-10 h-full w-full"
                  tabIndex={-1}
                />

                {isBenefitCatDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-2 space-y-2 max-h-64 flex flex-col animate-in fade-in zoom-in-95 duration-100">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Buscar sector / categoría..."
                        autoFocus
                        value={benefitCatSearch}
                        onChange={(e) => setBenefitCatSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
                      {categories
                        .filter((c) => c.name.toLowerCase().includes(benefitCatSearch.toLowerCase()))
                        .map((c) => {
                          const isSelected = benefitForm.category === c.name;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setBenefitForm({ ...benefitForm, category: c.name });
                                setIsBenefitCatDropdownOpen(false);
                                setBenefitCatSearch('');
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                                isSelected
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'text-slate-700 hover:bg-slate-100 font-medium'
                              }`}
                            >
                              <span className="truncate">{c.name}</span>
                              {isSelected && <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />}
                            </button>
                          );
                        })}

                      {categories.filter((c) => c.name.toLowerCase().includes(benefitCatSearch.toLowerCase())).length === 0 && (
                        <div className="p-3 text-center space-y-2">
                          <p className="text-slate-400 text-[11px]">No se encontró "{benefitCatSearch}"</p>
                          <button
                            type="button"
                            onClick={() => {
                              setIsBenefitCatDropdownOpen(false);
                              setIsBenefitModalOpen(false);
                              setActiveTab('categories');
                              handleOpenCreateCat();
                            }}
                            className="text-[11px] font-bold text-blue-600 hover:underline flex items-center justify-center gap-1 mx-auto"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Crear en Sectores & Categorías</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Descripción del Descuento / Beneficio *</label>
            <textarea
              rows={3}
              required
              placeholder="Detalle los beneficios o tarifas preferenciales para empresas socias..."
              value={benefitForm.discount_description}
              onChange={(e) => setBenefitForm({ ...benefitForm, discount_description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">¿Cómo acceder al beneficio? *</label>
            <input
              type="text"
              required
              placeholder="Ej. Presentar credencial de socio activo o solicitar código a secretaría"
              value={benefitForm.how_to_claim}
              onChange={(e) => setBenefitForm({ ...benefitForm, how_to_claim: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Fecha de Vigencia (Opcional)</label>
              <input
                type="date"
                value={benefitForm.valid_until}
                onChange={(e) => setBenefitForm({ ...benefitForm, valid_until: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Estado del Beneficio</label>
              <select
                value={benefitForm.is_active}
                onChange={(e) => setBenefitForm({ ...benefitForm, is_active: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value={1}>Activo (Visible para Socios)</option>
                <option value={0}>Inactivo / Pausado</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsBenefitModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              {submitting ? 'Guardando...' : editingBenefit ? 'Actualizar Beneficio' : 'Crear Beneficio'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Category / Sector Modal */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title={editingCat ? 'Editar Sector / Rubro' : 'Nuevo Sector / Rubro'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmitCat} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Nombre del Sector / Rubro *</label>
            <input
              type="text"
              required
              placeholder="Ej. Marítimo & Logística, Tecnología, etc."
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-[11px] text-slate-400">
              {editingCat
                ? 'Al actualizar el nombre, se sincronizará automáticamente con todas las empresas socias asociadas.'
                : 'Esta categoría estará disponible como botón de filtro en la web pública y en el selector de socios.'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCatModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              {submitting ? 'Guardando...' : editingCat ? 'Actualizar Sector' : 'Crear Sector'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
