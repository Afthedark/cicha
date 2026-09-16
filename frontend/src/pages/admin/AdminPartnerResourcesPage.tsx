import React, { useEffect, useState } from 'react';
import { FileDown, Plus, Edit2, Trash2, Gift, Download, Tag, FolderCog, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { PartnerResource, PartnerBenefit, Category } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminPartnerResourcesPage: React.FC = () => {
  const [tab, setTab] = useState<'resources' | 'benefits'>('resources');
  const [resources, setResources] = useState<PartnerResource[]>([]);
  const [benefits, setBenefits] = useState<PartnerBenefit[]>([]);
  const [benefitCategories, setBenefitCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCats, setLoadingCats] = useState(false);

  // Category Manager Modal state
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catNameInput, setCatNameInput] = useState('');
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catActionLoading, setCatActionLoading] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  // Resource modal state
  const [isResModalOpen, setIsResModalOpen] = useState(false);
  const [editingRes, setEditingRes] = useState<PartnerResource | null>(null);
  const [resForm, setResForm] = useState({
    title: '',
    category: 'informe_mercado' as any,
    description: '',
    file_url: '',
    file_type: 'PDF',
    file_size: '1.5 MB',
    is_active: 1,
  });

  // Benefit modal state
  const [isBenModalOpen, setIsBenModalOpen] = useState(false);
  const [editingBen, setEditingBen] = useState<PartnerBenefit | null>(null);
  const [benForm, setBenForm] = useState({
    title: '',
    provider_company: '',
    category: 'Logística & Transporte',
    discount_description: '',
    how_to_claim: '',
    valid_until: '',
    is_active: 1,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
    fetchBenefitCategories();
  }, []);

  const fetchBenefitCategories = () => {
    setLoadingCats(true);
    adminApi
      .getCategories('benefits')
      .then((data) => {
        if (data && data.length > 0) {
          setBenefitCategories(data);
        } else {
          const defaults: Category[] = [
            { id: 1, name: 'Logística & Transporte', slug: 'logistica-transporte', type: 'benefits' },
            { id: 2, name: 'Networking Internacional', slug: 'networking-internacional', type: 'benefits' },
            { id: 3, name: 'Servicios Profesionales', slug: 'servicios-profesionales', type: 'benefits' },
            { id: 4, name: 'Comercio Exterior', slug: 'comercio-exterior', type: 'benefits' },
            { id: 5, name: 'Asesoría Legal & Tributaria', slug: 'asesoria-legal-tributaria', type: 'benefits' },
            { id: 6, name: 'Hotelería & Eventos', slug: 'hoteleria-eventos', type: 'benefits' },
            { id: 7, name: 'Comercial', slug: 'comercial', type: 'benefits' },
          ];
          setBenefitCategories(defaults);
        }
      })
      .catch(() => {
        setBenefitCategories([
          { id: 1, name: 'Logística & Transporte', slug: 'logistica-transporte', type: 'benefits' },
          { id: 2, name: 'Networking Internacional', slug: 'networking-internacional', type: 'benefits' },
          { id: 3, name: 'Servicios Profesionales', slug: 'servicios-profesionales', type: 'benefits' },
          { id: 4, name: 'Comercio Exterior', slug: 'comercio-exterior', type: 'benefits' },
          { id: 5, name: 'Asesoría Legal & Tributaria', slug: 'asesoria-legal-tributaria', type: 'benefits' },
          { id: 6, name: 'Hotelería & Eventos', slug: 'hoteleria-eventos', type: 'benefits' },
          { id: 7, name: 'Comercial', slug: 'comercial', type: 'benefits' },
        ]);
      })
      .finally(() => {
        setLoadingCats(false);
      });
  };

  const fetchData = () => {
    setLoading(true);
    Promise.all([adminApi.getPartnerResources(), adminApi.getPartnerBenefits()])
      .then(([resList, benList]) => {
        setResources(resList || []);
        setBenefits(benList || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // Resource handlers
  const handleOpenCreateRes = () => {
    setEditingRes(null);
    setResForm({
      title: '',
      category: 'informe_mercado',
      description: '',
      file_url: '',
      file_type: 'PDF',
      file_size: '1.5 MB',
      is_active: 1,
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
      is_active: res.is_active ? 1 : 0,
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
    } catch (err) {
      alert('Error al guardar documento de socio.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRes = async (id: number) => {
    if (!window.confirm('¿Desea eliminar este documento?')) return;
    try {
      await adminApi.deletePartnerResource(id);
      fetchData();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  // Benefit handlers
  const handleOpenCreateBen = () => {
    setEditingBen(null);
    setBenForm({
      title: '',
      provider_company: '',
      category: benefitCategories.length > 0 ? benefitCategories[0].name : 'Logística & Transporte',
      discount_description: '',
      how_to_claim: '',
      valid_until: '',
      is_active: 1,
    });
    setIsBenModalOpen(true);
  };

  const handleOpenEditBen = (ben: PartnerBenefit) => {
    setEditingBen(ben);
    setBenForm({
      title: ben.title,
      provider_company: ben.provider_company,
      category: ben.category || (benefitCategories.length > 0 ? benefitCategories[0].name : 'Logística & Transporte'),
      discount_description: ben.discount_description,
      how_to_claim: ben.how_to_claim || '',
      valid_until: ben.valid_until || '',
      is_active: ben.is_active ? 1 : 0,
    });
    setIsBenModalOpen(true);
  };

  const handleSubmitBen = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingBen) {
        await adminApi.updatePartnerBenefit(editingBen.id, benForm);
      } else {
        await adminApi.createPartnerBenefit(benForm);
      }
      setIsBenModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Error al guardar beneficio.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBen = async (id: number) => {
    if (!window.confirm('¿Desea eliminar este beneficio?')) return;
    try {
      await adminApi.deletePartnerBenefit(id);
      fetchData();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-xl text-cicha-navy">Recursos & Beneficios del Portal de Socios</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión de biblioteca de informes sectoriales, minutas y convenios exclusivos para socios.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {tab === 'benefits' && (
            <button
              onClick={() => {
                setCatError(null);
                setCatNameInput('');
                setEditingCat(null);
                setIsCatModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Tag className="w-4 h-4 text-cicha-navy" /> Categorías de Beneficios
            </button>
          )}

          <button
            onClick={tab === 'resources' ? handleOpenCreateRes : handleOpenCreateBen}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> {tab === 'resources' ? 'Nuevo Documento' : 'Nuevo Beneficio'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200">
        <button
          onClick={() => setTab('resources')}
          className={`pb-3 px-2 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            tab === 'resources'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileDown className="w-4 h-4" />
          Documentos & Informes ({resources.length})
        </button>
        <button
          onClick={() => setTab('benefits')}
          className={`pb-3 px-2 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            tab === 'benefits'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Gift className="w-4 h-4" />
          Club de Convenios & Beneficios ({benefits.length})
        </button>
      </div>

      {loading ? (
        <Loader text="Cargando contenidos..." />
      ) : tab === 'resources' ? (
        /* Resources Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Documento / Informe</th>
                  <th className="py-3.5 px-4">Categoría</th>
                  <th className="py-3.5 px-4">Formato / Peso</th>
                  <th className="py-3.5 px-4">Descargas</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resources.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{res.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{res.description}</div>
                    </td>
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
      ) : (
        /* Benefits Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Convenio / Beneficio</th>
                  <th className="py-3.5 px-4">Empresa Proveedora</th>
                  <th className="py-3.5 px-4">Categoría</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {benefits.map((ben) => (
                  <tr key={ben.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{ben.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{ben.discount_description}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-blue-700">{ben.provider_company}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="success">{ben.category}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditBen(ben)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBen(ben.id)}
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

      {/* Resource Modal */}
      <Modal
        isOpen={isResModalOpen}
        onClose={() => setIsResModalOpen(false)}
        title={editingRes ? 'Editar Documento' : 'Nuevo Documento para Socios'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitRes} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Título del Documento / Informe *</label>
            <input
              type="text"
              required
              value={resForm.title}
              onChange={(e) => setResForm({ ...resForm, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Categoría</label>
              <select
                value={resForm.category}
                onChange={(e) => setResForm({ ...resForm, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="informe_mercado">Informe de Mercado</option>
                <option value="guia_legal">Guía Legal & Tributaria</option>
                <option value="minuta_asamblea">Minuta de Asamblea</option>
                <option value="circular_comercial">Circular Comercial</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Formato</label>
              <input
                type="text"
                value={resForm.file_type}
                onChange={(e) => setResForm({ ...resForm, file_type: e.target.value })}
                placeholder="PDF, XLSX..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Tamaño</label>
              <input
                type="text"
                value={resForm.file_size}
                onChange={(e) => setResForm({ ...resForm, file_size: e.target.value })}
                placeholder="2.1 MB"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">URL del Archivo / Enlace de Descarga *</label>
            <input
              type="url"
              required
              value={resForm.file_url}
              onChange={(e) => setResForm({ ...resForm, file_url: e.target.value })}
              placeholder="https://cicha.com.ar/docs/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Descripción / Resumen</label>
            <textarea
              rows={3}
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
        isOpen={isBenModalOpen}
        onClose={() => setIsBenModalOpen(false)}
        title={editingBen ? 'Editar Beneficio' : 'Nuevo Beneficio para Socios'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitBen} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Título del Convenio / Beneficio *</label>
            <input
              type="text"
              required
              value={benForm.title}
              onChange={(e) => setBenForm({ ...benForm, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Empresa Proveedora / Red *</label>
              <input
                type="text"
                required
                value={benForm.provider_company}
                onChange={(e) => setBenForm({ ...benForm, provider_company: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex items-center justify-between">
                <span>Rubro / Categoría *</span>
                <button
                  type="button"
                  onClick={() => {
                    setCatError(null);
                    setCatNameInput('');
                    setEditingCat(null);
                    setIsCatModalOpen(true);
                  }}
                  className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
                >
                  + Administrar categorías
                </button>
              </label>
              <select
                required
                value={benForm.category}
                onChange={(e) => setBenForm({ ...benForm, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden transition-all"
              >
                {benefitCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Descripción del Beneficio / Descuento *</label>
            <textarea
              rows={3}
              required
              value={benForm.discount_description}
              onChange={(e) => setBenForm({ ...benForm, discount_description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Instrucciones para acceder al beneficio</label>
            <textarea
              rows={2}
              value={benForm.how_to_claim}
              onChange={(e) => setBenForm({ ...benForm, how_to_claim: e.target.value })}
              placeholder="Presentar credencial de socio o enviar email a..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsBenModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              {submitting ? 'Guardando...' : 'Guardar Beneficio'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Category Manager Modal for Benefits */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs">
                  <FolderCog className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-cicha-navy">
                    Gestión de Categorías de Beneficios
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Cree y administre los rubros para clasificar convenios de socios.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              {/* Add / Edit Category Form */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>{editingCat ? `Editar Categoría: "${editingCat.name}"` : 'Nueva Categoría de Beneficio'}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ej: Logística & Transporte, Asesoría Legal, Hotelería..."
                    value={catNameInput}
                    onChange={(e) => setCatNameInput(e.target.value)}
                    className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    disabled={catActionLoading || !catNameInput.trim()}
                    onClick={async () => {
                      if (!catNameInput.trim()) return;
                      setCatActionLoading(true);
                      setCatError(null);
                      try {
                        if (editingCat) {
                          await adminApi.updateCategory(editingCat.id, {
                            name: catNameInput.trim(),
                            type: 'benefits',
                          });
                        } else {
                          await adminApi.createCategory({
                            name: catNameInput.trim(),
                            type: 'benefits',
                          });
                        }
                        setCatNameInput('');
                        setEditingCat(null);
                        fetchBenefitCategories();
                      } catch (err: any) {
                        setCatError(err?.response?.data?.message || 'Error al guardar categoría.');
                      } finally {
                        setCatActionLoading(false);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-cicha-navy hover:bg-[#003866] text-white font-bold transition-all disabled:opacity-50 shrink-0 cursor-pointer shadow-xs"
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
                      className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
                {catError && <p className="text-[11px] text-rose-600 font-medium">{catError}</p>}
              </div>

              {/* List of categories */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-500 font-bold text-[11px] px-1">
                  <span>Categorías Activas ({benefitCategories.length})</span>
                  <span>Acciones</span>
                </div>

                {loadingCats ? (
                  <div className="py-8 flex justify-center">
                    <Loader text="Cargando categorías..." />
                  </div>
                ) : benefitCategories.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    No hay categorías registradas. Agrega la primera arriba.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {benefitCategories.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                          <span className="font-bold text-slate-800">{cat.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({cat.slug})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCat(cat);
                              setCatNameInput(cat.name);
                              setCatError(null);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-all cursor-pointer"
                            title="Editar categoría"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!window.confirm(`¿Eliminar la categoría "${cat.name}"?`)) return;
                              setCatActionLoading(true);
                              try {
                                await adminApi.deleteCategory(cat.id);
                                fetchBenefitCategories();
                              } catch (err: any) {
                                alert(err?.response?.data?.message || 'Error al eliminar categoría');
                              } finally {
                                setCatActionLoading(false);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            title="Eliminar categoría"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCatModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-cicha-navy hover:bg-[#003866] text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
              >
                Listo / Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
