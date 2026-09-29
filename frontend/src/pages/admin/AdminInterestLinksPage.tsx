import React, { useEffect, useState } from 'react';
import {
  Link2,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  ExternalLink,
  Star,
  Globe,
  Tag,
  FolderTree,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { adminApi, resolveImageUrl } from '../../services/api';
import type { InterestLink, Category } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminInterestLinksPage: React.FC = () => {
  const [links, setLinks] = useState<InterestLink[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCats, setLoadingCats] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Link Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<InterestLink | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    category_id: '' as string | number,
    description: '',
    logo_url: '',
    order_num: 0,
    is_featured: 0,
    is_active: 1,
  });
  const [submitting, setSubmitting] = useState(false);

  // Category Manager Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catNameInput, setCatNameInput] = useState('');
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catActionLoading, setCatActionLoading] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  // Notification State
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchLinks();
    fetchCategories();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getInterestLinks();
      setLinks(data || []);
    } catch (err) {
      console.error('Error fetching interest links:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCats(true);
    try {
      const data = await adminApi.getCategories('links');
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching link categories:', err);
    } finally {
      setLoadingCats(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingLink(null);
    setFormData({
      title: '',
      url: '',
      category_id: categories.length > 0 ? categories[0].id : '',
      description: '',
      logo_url: '',
      order_num: links.length + 1,
      is_featured: 0,
      is_active: 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (link: InterestLink) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      url: link.url,
      category_id: link.category_id || '',
      description: link.description || '',
      logo_url: link.logo_url || '',
      order_num: link.order_num || 0,
      is_featured: Number(link.is_featured) === 1 ? 1 : 0,
      is_active: Number(link.is_active) === 1 ? 1 : 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (link: InterestLink) => {
    if (!window.confirm(`¿Está seguro de eliminar el enlace "${link.title}"? El registro quedará archivado (Soft Delete).`)) {
      return;
    }
    try {
      await adminApi.deleteInterestLink(link.id);
      showNotification('success', 'Enlace eliminado correctamente.');
      fetchLinks();
    } catch (err: any) {
      alert('Error al eliminar el enlace.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('El título es obligatorio.');
      return;
    }
    if (!formData.url.trim()) {
      alert('La URL de destino es obligatoria.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<InterestLink> = {
        title: formData.title.trim(),
        url: formData.url.trim(),
        category_id: formData.category_id ? Number(formData.category_id) : null,
        description: formData.description.trim() || undefined,
        logo_url: formData.logo_url.trim() || undefined,
        order_num: Number(formData.order_num) || 0,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
      };

      if (editingLink) {
        await adminApi.updateInterestLink(editingLink.id, payload);
        showNotification('success', 'Enlace actualizado exitosamente.');
      } else {
        await adminApi.createInterestLink(payload);
        showNotification('success', 'Enlace de interés creado y publicado exitosamente.');
      }
      setIsModalOpen(false);
      setEditingLink(null);
      fetchLinks();
    } catch (err: any) {
      const msg = err.response?.data?.messages?.error || err.response?.data?.message || 'Error al guardar el enlace.';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Category Manager Handlers
  const handleOpenCatModal = () => {
    setEditingCat(null);
    setCatNameInput('');
    setCatError(null);
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameInput.trim()) return;

    setCatActionLoading(true);
    setCatError(null);
    try {
      if (editingCat) {
        await adminApi.updateCategory(editingCat.id, {
          name: catNameInput.trim(),
          type: 'links',
        });
        showNotification('success', 'Categoría actualizada.');
      } else {
        await adminApi.createCategory({
          name: catNameInput.trim(),
          type: 'links',
        });
        showNotification('success', 'Categoría creada.');
      }
      setCatNameInput('');
      setEditingCat(null);
      fetchCategories();
    } catch (err: any) {
      setCatError(err?.response?.data?.message || 'Error al guardar categoría.');
    } finally {
      setCatActionLoading(false);
    }
  };

  const handleDeleteCategory = async (catId: number, catName: string) => {
    if (!window.confirm(`¿Desea eliminar la categoría "${catName}"?`)) return;
    try {
      await adminApi.deleteCategory(catId);
      showNotification('success', 'Categoría eliminada.');
      fetchCategories();
      fetchLinks();
    } catch (err: any) {
      alert('Error al eliminar categoría.');
    }
  };

  // Filtered links
  const filteredLinks = links.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.category_name && item.category_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'uncategorized' && !item.category_id) ||
      String(item.category_id) === selectedCategory;

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && Number(item.is_active) === 1) ||
      (selectedStatus === 'inactive' && Number(item.is_active) === 0);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Globe className="w-5 h-5" />
            </span>
            <h1 className="font-serif font-bold text-xl text-cicha-navy">Links de Interés</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de portales oficiales, organismos de comercio bilateral, embajadas y enlaces de utilidad pública.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenCatModal}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
          >
            <FolderTree className="w-4 h-4 text-blue-600" />
            <span>Gestionar Categorías</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Enlace</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-xs font-semibold animate-in fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Buscar por título, URL o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Categoría:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.name}
              </option>
            ))}
            <option value="uncategorized">Sin categoría</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Ocultos / Inactivos</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Loader text="Cargando enlaces de interés..." />
      ) : filteredLinks.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Enlace / Entidad</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">URL Destino</th>
                  <th className="px-6 py-4 text-center">Orden</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLinks.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.logo_url ? (
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                            <img
                              src={resolveImageUrl(item.logo_url)}
                              alt=""
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
                            <Globe className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate max-w-md flex items-center gap-1.5">
                            {item.title}
                            {Number(item.is_featured) === 1 && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 shrink-0">
                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                Destacado
                              </span>
                            )}
                          </p>
                          {item.description && (
                            <p className="text-[11px] text-slate-400 truncate max-w-sm">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.category_name ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          {item.category_name}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Sin categoría</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-mono text-[11px] text-slate-500">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline max-w-xs truncate"
                      >
                        <span className="truncate">{item.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>

                    <td className="px-6 py-4 text-center font-mono font-bold text-slate-700 whitespace-nowrap">
                      {item.order_num}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={Number(item.is_active) === 1 ? 'success' : 'secondary'}>
                        {Number(item.is_active) === 1 ? 'Activo' : 'Oculto'}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                          title="Editar enlace"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Eliminar enlace (Soft Delete)"
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
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Globe className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-serif font-bold text-slate-800">No se encontraron enlaces de interés</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm || selectedCategory !== 'all'
              ? 'Prueba modificando los filtros de búsqueda.'
              : 'Comienza agregando el primer enlace de interés para la web pública.'}
          </p>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingLink(null);
          }}
          title={editingLink ? 'Editar Enlace de Interés' : 'Nuevo Enlace de Interés'}
          maxWidth="2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Título / Nombre de la Entidad o Portal *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Embajada de Grecia en Argentina, Cancillería, Eurocámara..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">URL Completa de Destino *</label>
              <input
                type="url"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://ejemplo.gob.ar..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Categoría</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      handleOpenCatModal();
                    }}
                    className="text-[11px] text-blue-600 hover:underline font-bold"
                  >
                    + Nueva Categoría
                  </button>
                </div>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="">-- Sin Categoría --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Orden de Visualización</label>
                <input
                  type="number"
                  min="0"
                  value={formData.order_num}
                  onChange={(e) => setFormData({ ...formData, order_num: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Descripción / Resumen (Opcional)</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Breve reseña sobre los trámites, información o servicios que brinda este portal..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <ImageUploader
              label="Logo o Emblema Institucional (Opcional)"
              value={formData.logo_url}
              onChange={(url) => setFormData({ ...formData, logo_url: url })}
              helperText="Logo de la entidad u organismo (PNG, SVG, JPG)"
              previewHeight="h-24"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="is_featured_link"
                  checked={formData.is_featured === 1}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 cursor-pointer"
                />
                <label htmlFor="is_featured_link" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                  Marcar como Enlace Destacado
                </label>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-slate-700">Estado:</label>
                <select
                  value={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: parseInt(e.target.value) })}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-medium"
                >
                  <option value={1}>🟢 Activo (Visible en la Web)</option>
                  <option value={0}>🟡 Oculto / Borrador</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingLink(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
              >
                {submitting ? 'Guardando...' : editingLink ? 'Actualizar Enlace' : 'Guardar Enlace'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Category Manager Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shadow-xs">
                  <FolderTree className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-slate-900">Categorías de Links de Interés</h2>
                  <p className="text-xs text-slate-500">Agrupe los enlaces para facilitar la búsqueda en la web pública.</p>
                </div>
              </div>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              <form onSubmit={handleSaveCategory} className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>{editingCat ? `Editar Categoría: "${editingCat.name}"` : 'Nueva Categoría'}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Ej: Organismos Públicos, Comercio Exterior..."
                    value={catNameInput}
                    onChange={(e) => setCatNameInput(e.target.value)}
                    className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    disabled={catActionLoading || !catNameInput.trim()}
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
              </form>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-500 font-bold text-[11px] px-1">
                  <span>Categorías Activas ({categories.length})</span>
                  <span>Acciones</span>
                </div>

                {loadingCats ? (
                  <div className="py-8 flex justify-center">
                    <Loader text="Cargando categorías..." />
                  </div>
                ) : categories.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    No hay categorías registradas. Agrega la primera arriba.
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
                            title="Editar nombre"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
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

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCatModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 transition-all shadow-xs cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
