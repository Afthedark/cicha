import React, { useEffect, useState } from 'react';
import { FileDown, Plus, Edit2, Trash2, Gift, Tag, FolderCog, RotateCcw, AlertTriangle, X, Check, Search } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { PartnerResource, PartnerBenefit, Category } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminPartnerResourcesPage: React.FC = () => {
  const [tab, setTab] = useState<'resources' | 'benefits'>('resources');
  const [resources, setResources] = useState<PartnerResource[]>([]);
  const [benefits, setBenefits] = useState<PartnerBenefit[]>([]);
  const [resourceCategories, setResourceCategories] = useState<Category[]>([]);
  const [benefitCategories, setBenefitCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCats, setLoadingCats] = useState(false);

  // Trash state for resources
  const [showTrash, setShowTrash] = useState(false);
  const [trashResources, setTrashResources] = useState<PartnerResource[]>([]);
  const [loadingTrash, setLoadingTrash] = useState(false);

  // Category Manager Modal state
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catType, setCatType] = useState<'resources' | 'benefits'>('resources');
  const [catNameInput, setCatNameInput] = useState('');
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catActionLoading, setCatActionLoading] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  // Resource modal state
  const [isResModalOpen, setIsResModalOpen] = useState(false);
  const [editingRes, setEditingRes] = useState<PartnerResource | null>(null);
  const [resForm, setResForm] = useState({
    title: '',
    categories: [] as string[],
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
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoadingCats(true);
    Promise.all([
      adminApi.getCategories('resources'),
      adminApi.getCategories('benefits'),
    ])
      .then(([resCats, benCats]) => {
        setResourceCategories(resCats || []);
        setBenefitCategories(benCats || []);
      })
      .catch((err) => {
        console.error('Error cargando categorías', err);
      })
      .finally(() => {
        setLoadingCats(false);
      });
  };

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      adminApi.getPartnerResources(),
      adminApi.getPartnerBenefits(),
      adminApi.getPartnerResources({ trash: true }),
    ])
      .then(([resList, benList, trashList]) => {
        setResources(resList || []);
        setBenefits(benList || []);
        setTrashResources(trashList || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchTrashResources = () => {
    setLoadingTrash(true);
    adminApi
      .getPartnerResources({ trash: true })
      .then((trashList) => {
        setTrashResources(trashList || []);
        setLoadingTrash(false);
      })
      .catch(() => setLoadingTrash(false));
  };

  // Resource handlers
  const handleOpenCreateRes = () => {
    setEditingRes(null);
    const defaultCat = resourceCategories.length > 0 ? [resourceCategories[0].name] : ['Informes de Mercado'];
    setResForm({
      title: '',
      categories: defaultCat,
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
    let cats: string[] = [];
    if (Array.isArray(res.categories) && res.categories.length > 0) {
      cats = res.categories;
    } else if (res.category) {
      cats = [res.category];
    } else if (resourceCategories.length > 0) {
      cats = [resourceCategories[0].name];
    }
    setResForm({
      title: res.title,
      categories: cats,
      description: res.description || '',
      file_url: res.file_url,
      file_type: res.file_type || 'PDF',
      file_size: res.file_size || '1.5 MB',
      is_active: res.is_active ? 1 : 0,
    });
    setIsResModalOpen(true);
  };

  const toggleResourceCategory = (catName: string) => {
    setResForm((prev) => {
      const exists = prev.categories.includes(catName);
      if (exists) {
        if (prev.categories.length === 1) return prev; // Keep at least one
        return { ...prev, categories: prev.categories.filter((c) => c !== catName) };
      } else {
        return { ...prev, categories: [...prev.categories, catName] };
      }
    });
  };

  const handleSubmitRes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resForm.categories.length === 0) {
      alert('Debe seleccionar al menos una categoría para el documento.');
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
    } catch (err) {
      alert('Error al guardar documento de socio.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRes = async (id: number) => {
    if (!window.confirm('¿Desea enviar este documento a la papelera (Soft Delete)?')) return;
    try {
      await adminApi.deletePartnerResource(id);
      fetchData();
    } catch (err) {
      alert('Error al eliminar recurso.');
    }
  };

  const handleRestoreRes = async (id: number) => {
    try {
      await adminApi.restorePartnerResource(id);
      fetchData();
      fetchTrashResources();
    } catch (err) {
      alert('Error al restaurar recurso.');
    }
  };

  const handleForceDeleteRes = async (id: number) => {
    if (!window.confirm('⚠️ ¿Eliminar permanentemente este documento? Esta acción no se puede deshacer.')) return;
    try {
      await adminApi.forceDeletePartnerResource(id);
      fetchData();
      fetchTrashResources();
    } catch (err) {
      alert('Error al eliminar permanentemente.');
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

  const currentCats = catType === 'resources' ? resourceCategories : benefitCategories;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-xl text-cicha-navy">Recursos & Beneficios del Portal de Socios</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión de biblioteca de informes, regulaciones, minutas y convenios con soporte multicategoría y papelera.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setCatType(tab);
              setCatError(null);
              setCatNameInput('');
              setEditingCat(null);
              setIsCatModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Tag className="w-4 h-4 text-cicha-navy" />
            Categorías de {tab === 'resources' ? 'Recursos' : 'Beneficios'}
          </button>

          <button
            onClick={tab === 'resources' ? handleOpenCreateRes : handleOpenCreateBen}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> {tab === 'resources' ? 'Nuevo Documento' : 'Nuevo Beneficio'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setTab('resources');
              setShowTrash(false);
            }}
            className={`pb-3 px-2 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              tab === 'resources'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileDown className="w-4 h-4" />
            Documentos & Informes ({resources.length})
          </button>
          <button
            onClick={() => {
              setTab('benefits');
              setShowTrash(false);
            }}
            className={`pb-3 px-2 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              tab === 'benefits'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Gift className="w-4 h-4" />
            Club de Convenios & Beneficios ({benefits.length})
          </button>
        </div>

        {tab === 'resources' && (
          <div className="flex items-center gap-1.5 pb-2">
            <button
              onClick={() => setShowTrash(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !showTrash
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Activos ({resources.length})
            </button>
            <button
              onClick={() => {
                setShowTrash(true);
                fetchTrashResources();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                showTrash
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'text-slate-500 hover:text-rose-600'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" /> Papelera ({trashResources.length})
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <Loader text="Cargando contenidos..." />
      ) : tab === 'resources' ? (
        /* Resources Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {showTrash && (
            <div className="p-3.5 bg-rose-50 border-b border-rose-100 flex items-center justify-between text-xs text-rose-800">
              <div className="flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Viendo documentos en la <strong>Papelera</strong> (Soft Delete). Puede restaurarlos en 1 clic o eliminarlos definitivamente.</span>
              </div>
              <button
                onClick={() => setShowTrash(false)}
                className="font-bold underline text-rose-900 hover:text-rose-700 cursor-pointer"
              >
                Volver a Activos
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Documento / Informe</th>
                  <th className="py-3.5 px-4">Categorías Asignadas</th>
                  <th className="py-3.5 px-4">Formato / Peso</th>
                  <th className="py-3.5 px-4">Descargas</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(showTrash ? trashResources : resources).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      {showTrash ? 'La papelera está vacía.' : 'No hay documentos cargados en este momento.'}
                    </td>
                  </tr>
                ) : (
                  (showTrash ? trashResources : resources).map((res) => {
                    const itemCats = Array.isArray(res.categories) && res.categories.length > 0 
                      ? res.categories 
                      : (res.category ? [res.category] : []);
                    return (
                      <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{res.title}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{res.description}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1.5 max-w-xs">
                            {itemCats.map((c, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100"
                              >
                                {c.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {res.file_type} ({res.file_size})
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">{res.downloads}</td>
                        <td className="py-3.5 px-4 text-right">
                          {showTrash ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleRestoreRes(res.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                                title="Restaurar a Activos"
                              >
                                <RotateCcw className="w-3.5 h-3.5" /> Restaurar
                              </button>
                              <button
                                onClick={() => handleForceDeleteRes(res.id)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Eliminar Definitivamente"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditRes(res)}
                                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteRes(res.id)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Enviar a Papelera"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
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
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBen(ben.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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

      {/* Resource Modal with Multi-Category Selection */}
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              placeholder="Ej: Informe Trimestral de Intercambio Bilateral..."
            />
          </div>

          {/* Multi-Category Selector */}
          <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1.5 text-xs">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>Categorías del Documento (Seleccione una o varias) *</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setCatType('resources');
                  setCatError(null);
                  setCatNameInput('');
                  setEditingCat(null);
                  setIsCatModalOpen(true);
                }}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
              >
                + Administrar categorías
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {resourceCategories.map((cat) => {
                const isSelected = resForm.categories.includes(cat.name);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleResourceCategory(cat.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {resForm.categories.length === 0 && (
              <p className="text-[11px] text-amber-600 font-medium pt-1">
                ⚠️ Seleccione al menos una categoría para este documento.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Formato del Archivo</label>
              <input
                type="text"
                value={resForm.file_type}
                onChange={(e) => setResForm({ ...resForm, file_type: e.target.value })}
                placeholder="PDF, XLSX, DOCX..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Tamaño Estimado</label>
              <input
                type="text"
                value={resForm.file_size}
                onChange={(e) => setResForm({ ...resForm, file_size: e.target.value })}
                placeholder="Ej: 2.1 MB"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">URL del Archivo / Enlace de Descarga o Visualización *</label>
            <input
              type="url"
              required
              value={resForm.file_url}
              onChange={(e) => setResForm({ ...resForm, file_url: e.target.value })}
              placeholder="https://cicha.com.ar/docs/informe.pdf"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Descripción / Resumen</label>
            <textarea
              rows={3}
              value={resForm.description}
              onChange={(e) => setResForm({ ...resForm, description: e.target.value })}
              placeholder="Breve reseña del contenido del documento para los socios..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsResModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-md disabled:opacity-50"
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
                    setCatType('benefits');
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

      {/* Category Manager Modal for Resources & Benefits */}
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
                    Gestión de Categorías de {catType === 'resources' ? 'Recursos & Documentos' : 'Beneficios'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Cree y administre las categorías temáticas dinámicas.
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
                  <span>{editingCat ? `Editar Categoría: "${editingCat.name}"` : `Nueva Categoría (${catType === 'resources' ? 'Recursos' : 'Beneficios'})`}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={catType === 'resources' ? 'Ej: Informes de Mercado, Regulaciones...' : 'Ej: Logística, Hotelería...'}
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
                            type: catType,
                          });
                        } else {
                          await adminApi.createCategory({
                            name: catNameInput.trim(),
                            type: catType,
                          });
                        }
                        setCatNameInput('');
                        setEditingCat(null);
                        fetchCategories();
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
                  <span>Categorías Activas ({currentCats.length})</span>
                  <span>Acciones</span>
                </div>

                {loadingCats ? (
                  <div className="py-8 flex justify-center">
                    <Loader text="Cargando categorías..." />
                  </div>
                ) : currentCats.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    No hay categorías registradas. Agrega la primera arriba.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {currentCats.map((cat) => (
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
                                fetchCategories();
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
