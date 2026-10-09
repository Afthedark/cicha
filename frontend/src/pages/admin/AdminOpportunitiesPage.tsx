import React, { useEffect, useState } from 'react';
import { TrendingUp, Plus, Edit2, Trash2, Tag, FolderCog, RotateCcw, AlertTriangle, X, Check, Search, Filter } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { CommercialOpportunity, Category } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminOpportunitiesPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<CommercialOpportunity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCats, setLoadingCats] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Trash state
  const [showTrash, setShowTrash] = useState(false);
  const [trashOpportunities, setTrashOpportunities] = useState<CommercialOpportunity[]>([]);
  const [loadingTrash, setLoadingTrash] = useState(false);

  // Category Manager Modal state
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catNameInput, setCatNameInput] = useState('');
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catActionLoading, setCatActionLoading] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<CommercialOpportunity | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'export' as 'export' | 'import' | 'investment' | 'partnership' | 'een_node',
    origin_country: 'Grecia',
    target_country: 'Argentina',
    categories: [] as string[],
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
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoadingCats(true);
    adminApi
      .getCategories('opportunities')
      .then((data) => {
        setCategories(data || []);
      })
      .catch((err) => {
        console.error('Error cargando categorías de oportunidades', err);
      })
      .finally(() => {
        setLoadingCats(false);
      });
  };

  const fetchOpportunities = () => {
    setLoading(true);
    Promise.all([
      adminApi.getOpportunities(),
      adminApi.getOpportunities({ trash: true }),
    ])
      .then(([opps, trashList]) => {
        setOpportunities(opps || []);
        setTrashOpportunities(trashList || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchTrashOpps = () => {
    setLoadingTrash(true);
    adminApi
      .getOpportunities({ trash: true })
      .then((trashList) => {
        setTrashOpportunities(trashList || []);
        setLoadingTrash(false);
      })
      .catch(() => setLoadingTrash(false));
  };

  const handleOpenCreate = () => {
    setEditingOpp(null);
    const defaultCat = categories.length > 0 ? [categories[0].name] : ['Agroalimentos & Bebidas'];
    setFormData({
      title: '',
      type: 'export',
      origin_country: 'Grecia',
      target_country: 'Argentina',
      categories: defaultCat,
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
    let cats: string[] = [];
    if (Array.isArray(opp.categories) && opp.categories.length > 0) {
      cats = opp.categories;
    } else if (opp.sector) {
      cats = [opp.sector];
    } else if (categories.length > 0) {
      cats = [categories[0].name];
    }

    setFormData({
      title: opp.title,
      type: opp.type,
      origin_country: opp.origin_country || 'Grecia',
      target_country: opp.target_country || 'Argentina',
      categories: cats,
      description: opp.description,
      requirements: opp.requirements || '',
      contact_person: opp.contact_person || '',
      contact_email: opp.contact_email || 'comercio@cicha.com.ar',
      status: opp.status || 'open',
      deadline: opp.deadline || '',
    });
    setIsModalOpen(true);
  };

  const toggleCategory = (catName: string) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(catName);
      if (exists) {
        if (prev.categories.length === 1) return prev; // Keep at least one
        return { ...prev, categories: prev.categories.filter((c) => c !== catName) };
      } else {
        return { ...prev, categories: [...prev.categories, catName] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.categories.length === 0) {
      alert('Debe seleccionar al menos una categoría o sector comercial.');
      return;
    }
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
    if (!window.confirm('¿Desea enviar esta oportunidad a la papelera (Soft Delete)? Podrá restaurarla si lo desea.')) return;
    try {
      await adminApi.deleteOpportunity(id);
      fetchOpportunities();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await adminApi.restoreOpportunity(id);
      fetchOpportunities();
      fetchTrashOpps();
    } catch (err) {
      alert('Error al restaurar oportunidad.');
    }
  };

  const handleForceDelete = async (id: number) => {
    if (!window.confirm('⚠️ ¿Eliminar permanentemente esta oportunidad comercial? Esta acción no se puede deshacer.')) return;
    try {
      await adminApi.forceDeleteOpportunity(id);
      fetchOpportunities();
      fetchTrashOpps();
    } catch (err) {
      alert('Error al eliminar permanentemente.');
    }
  };

  const activeList = showTrash ? trashOpportunities : opportunities;

  const filteredOpps = activeList.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (opp.description && opp.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (opp.contact_person && opp.contact_person.toLowerCase().includes(searchTerm.toLowerCase()));

    const itemCats = Array.isArray(opp.categories) && opp.categories.length > 0 
      ? opp.categories 
      : (opp.sector ? [opp.sector] : []);

    const matchesType = selectedType === 'all' || opp.type === selectedType;
    const matchesSector = selectedSector === 'all' || itemCats.includes(selectedSector) || opp.sector === selectedSector;
    const matchesStatus = selectedStatus === 'all' || opp.status === selectedStatus;

    return matchesSearch && matchesType && matchesSector && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h1 className="font-serif font-bold text-xl text-cicha-navy">Oportunidades Comerciales Bilaterales</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de demandas, ofertas exportables, inversiones y alianzas con categorización múltiple y papelera.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setCatError(null);
              setCatNameInput('');
              setEditingCat(null);
              setIsCatModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Tag className="w-4 h-4 text-cicha-navy" />
            Categorías / Sectores ({categories.length})
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Nueva Oportunidad
          </button>
        </div>
      </div>

      {/* Tabs & View Switch */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTrash(false)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              !showTrash
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Oportunidades Activas ({opportunities.length})
          </button>
          <button
            onClick={() => {
              setShowTrash(true);
              fetchTrashOpps();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              showTrash
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Papelera ({trashOpportunities.length})
          </button>
        </div>
      </div>

      {showTrash && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-800">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Mostrando oportunidades en la <strong>Papelera</strong> (Soft Delete). Puede restaurarlas con 1 clic.</span>
          </div>
          <button
            onClick={() => setShowTrash(false)}
            className="font-bold underline text-rose-900 hover:text-rose-700 cursor-pointer"
          >
            Volver a Activas
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Buscar por título, descripción o contacto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filtros:</span>
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="all">Todos los tipos</option>
            <option value="export">Exportación</option>
            <option value="import">Importación</option>
            <option value="investment">Inversión</option>
            <option value="partnership">Alianza Tecnológica</option>
            <option value="een_node">Nodo EEN</option>
          </select>

          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="all">Todos los sectores</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {!showTrash && (
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
            >
              <option value="all">Todos los estados</option>
              <option value="open">Abierta</option>
              <option value="in_negotiation">En Negociación</option>
              <option value="closed">Cerrada</option>
            </select>
          )}
        </div>
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
                  <th className="py-3.5 px-4">Sectores / Categorías</th>
                  {!showTrash && <th className="py-3.5 px-4">Estado</th>}
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOpps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      {showTrash ? 'La papelera está vacía.' : 'No se encontraron oportunidades registradas.'}
                    </td>
                  </tr>
                ) : (
                  filteredOpps.map((opp) => {
                    const itemCats = Array.isArray(opp.categories) && opp.categories.length > 0 
                      ? opp.categories 
                      : (opp.sector ? [opp.sector] : []);
                    return (
                      <tr key={opp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{opp.title}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{opp.description}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant="primary" className="capitalize">
                            {opp.type}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {opp.origin_country} ➔ {opp.target_country}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {itemCats.map((c, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>
                        {!showTrash && (
                          <td className="py-3.5 px-4">
                            <Badge variant={opp.status === 'open' ? 'success' : 'secondary'}>
                              {opp.status}
                            </Badge>
                          </td>
                        )}
                        <td className="py-3.5 px-4 text-right">
                          {showTrash ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleRestore(opp.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                                title="Restaurar a Activos"
                              >
                                <RotateCcw className="w-3.5 h-3.5" /> Restaurar
                              </button>
                              <button
                                onClick={() => handleForceDelete(opp.id)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Eliminar Definitivamente"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEdit(opp)}
                                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(opp.id)}
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
              placeholder="Ej: Demanda de Aceite de Oliva y Frutas Frescas..."
            />
          </div>

          {/* Multi-Category Selector */}
          <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1.5 text-xs">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>Sectores Comerciales / Categorías (Seleccione una o varias) *</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setCatError(null);
                  setCatNameInput('');
                  setEditingCat(null);
                  setIsCatModalOpen(true);
                }}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
              >
                + Administrar sectores
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {categories.map((cat) => {
                const isSelected = formData.categories.includes(cat.name);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.name)}
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

            {formData.categories.length === 0 && (
              <p className="text-[11px] text-amber-600 font-medium pt-1">
                ⚠️ Seleccione al menos un sector comercial para la oportunidad.
              </p>
            )}
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
              <label className="font-bold text-slate-700">Persona de Contacto</label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                placeholder="Ej. Lic. Nikos Papadopoulos"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Fecha Límite (Opcional)</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Estado</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="open">Abierta</option>
                <option value="in_negotiation">En Negociación</option>
                <option value="closed">Cerrada</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : 'Guardar Oportunidad'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Category Manager Modal for Opportunities */}
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
                    Gestión de Sectores y Categorías Comerciales
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Cree y administre los rubros para clasificar oportunidades bilaterales.
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
                  <span>{editingCat ? `Editar Sector: "${editingCat.name}"` : 'Nuevo Sector / Categoría'}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ej: Agroalimentos & Bebidas, Software, Energías..."
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
                            type: 'opportunities',
                          });
                        } else {
                          await adminApi.createCategory({
                            name: catNameInput.trim(),
                            type: 'opportunities',
                          });
                        }
                        setCatNameInput('');
                        setEditingCat(null);
                        fetchCategories();
                      } catch (err: any) {
                        setCatError(err?.response?.data?.message || 'Error al guardar sector.');
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
                  <span>Sectores Activos ({categories.length})</span>
                  <span>Acciones</span>
                </div>

                {loadingCats ? (
                  <div className="py-8 flex justify-center">
                    <Loader text="Cargando sectores..." />
                  </div>
                ) : categories.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    No hay sectores registrados. Agrega el primero arriba.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {categories.map((cat) => (
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
                            title="Editar sector"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!window.confirm(`¿Eliminar el sector "${cat.name}"?`)) return;
                              setCatActionLoading(true);
                              try {
                                await adminApi.deleteCategory(cat.id);
                                fetchCategories();
                              } catch (err: any) {
                                alert(err?.response?.data?.message || 'Error al eliminar sector');
                              } finally {
                                setCatActionLoading(false);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            title="Eliminar sector"
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
