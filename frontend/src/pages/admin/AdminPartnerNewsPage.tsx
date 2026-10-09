import React, { useEffect, useState } from 'react';
import {
  Newspaper,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Eye,
  Star,
  Tag,
  User,
  FileText,
  Layers,
  FolderCog,
  RotateCcw,
  AlertTriangle,
  X,
  Check,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { PartnerNewsItem, Category } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ImageUploader } from '../../components/common/ImageUploader';
import { DocumentUploader } from '../../components/common/DocumentUploader';
import { PdfViewerModal } from '../../components/common/PdfViewerModal';

export const AdminPartnerNewsPage: React.FC = () => {
  const [news, setNews] = useState<PartnerNewsItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCats, setLoadingCats] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Trash state
  const [showTrash, setShowTrash] = useState(false);
  const [trashNews, setTrashNews] = useState<PartnerNewsItem[]>([]);
  const [loadingTrash, setLoadingTrash] = useState(false);

  // Category Manager Modal state
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catNameInput, setCatNameInput] = useState('');
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catActionLoading, setCatActionLoading] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  // PDF Preview Modal
  const [pdfPreview, setPdfPreview] = useState<{ isOpen: boolean; url: string; title: string; fileName?: string; fileSize?: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PartnerNewsItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    categories: [] as string[],
    summary: '',
    content: '',
    image_url: '',
    author: 'Comisión Directiva CICHA',
    author_avatar_url: '',
    logo_url: '',
    document_type: 'text' as 'text' | 'file' | 'both' | 'url',
    file_url: '',
    file_name: '',
    file_size: '',
    published_at: new Date().toISOString().slice(0, 10),
    is_featured: 0,
    status: 'published' as 'published' | 'draft' | 'archived',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoadingCats(true);
    adminApi
      .getCategories('partner_news')
      .then((data) => {
        setCategories(data || []);
      })
      .catch((err) => {
        console.error('Error cargando categorías de boletín', err);
      })
      .finally(() => {
        setLoadingCats(false);
      });
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const [data, trashList] = await Promise.all([
        adminApi.getPartnerNews(),
        adminApi.getPartnerNews({ trash: true }),
      ]);
      setNews(data || []);
      setTrashNews(trashList || []);
    } catch (err) {
      console.error('Error loading partner news:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrashNews = async () => {
    setLoadingTrash(true);
    try {
      const data = await adminApi.getPartnerNews({ trash: true });
      setTrashNews(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTrash(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    const defaultCat = categories.length > 0 ? [categories[0].name] : ['Comunicado Oficial'];
    setFormData({
      title: '',
      categories: defaultCat,
      summary: '',
      content: '',
      image_url: '',
      author: 'Comisión Directiva CICHA',
      author_avatar_url: '',
      logo_url: '',
      document_type: 'text',
      file_url: '',
      file_name: '',
      file_size: '',
      published_at: new Date().toISOString().slice(0, 10),
      is_featured: 0,
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PartnerNewsItem) => {
    setEditingItem(item);
    let cats: string[] = [];
    if (Array.isArray(item.categories) && item.categories.length > 0) {
      cats = item.categories;
    } else if (item.category) {
      cats = [item.category];
    } else if (categories.length > 0) {
      cats = [categories[0].name];
    }

    setFormData({
      title: item.title,
      categories: cats,
      summary: item.summary || '',
      content: item.content || '',
      image_url: item.image_url || '',
      author: item.author || 'Comisión Directiva CICHA',
      author_avatar_url: item.author_avatar_url || '',
      logo_url: item.logo_url || '',
      document_type: (item.document_type as any) || (item.file_url && item.content ? 'both' : item.file_url ? 'file' : 'text'),
      file_url: item.file_url || '',
      file_name: item.file_name || '',
      file_size: item.file_size || '',
      published_at: item.published_at ? item.published_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
      is_featured: Number(item.is_featured) === 1 ? 1 : 0,
      status: item.status || 'published',
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

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Desea enviar esta noticia a la papelera (Soft Delete)? Podrá restaurarla si lo desea.')) return;
    try {
      await adminApi.deletePartnerNews(id);
      fetchNews();
    } catch (err) {
      alert('Error al eliminar la noticia.');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await adminApi.restorePartnerNews(id);
      fetchNews();
      fetchTrashNews();
    } catch (err) {
      alert('Error al restaurar noticia.');
    }
  };

  const handleForceDelete = async (id: number) => {
    if (!window.confirm('⚠️ ¿Eliminar permanentemente esta noticia? Esta acción no se puede deshacer.')) return;
    try {
      await adminApi.forceDeletePartnerNews(id);
      fetchNews();
      fetchTrashNews();
    } catch (err) {
      alert('Error al eliminar permanentemente.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('El título es obligatorio.');
      return;
    }

    if (formData.categories.length === 0) {
      alert('Debe seleccionar al menos una categoría para la noticia.');
      return;
    }

    if ((formData.document_type === 'file' || formData.document_type === 'both' || formData.document_type === 'url') && !formData.file_url) {
      alert('Por favor suba o indique un archivo PDF o enlace para la modalidad seleccionada.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        await adminApi.updatePartnerNews(editingItem.id, formData);
      } else {
        await adminApi.createPartnerNews(formData);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchNews();
    } catch (err: any) {
      const msg = err.response?.data?.messages?.error || err.response?.data?.message || 'Error al guardar la noticia.';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const activeList = showTrash ? trashNews : news;

  const filteredNews = activeList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.summary && item.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase()));

    const itemCats = Array.isArray(item.categories) && item.categories.length > 0 
      ? item.categories 
      : (item.category ? [item.category] : []);

    const matchesCategory = selectedCategory === 'all' || itemCats.includes(selectedCategory) || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Newspaper className="w-5 h-5" />
            </span>
            <h1 className="font-serif font-bold text-xl text-cicha-navy">Boletín Exclusivo para Socios</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Comunicados oficiales, circulares y notas privadas para asociados con soporte multicategoría, papelera y visor PDF.
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
            Categorías ({categories.length})
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Comunicado / Noticia</span>
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
            Noticias Activas ({news.length})
          </button>
          <button
            onClick={() => {
              setShowTrash(true);
              fetchTrashNews();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              showTrash
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Papelera ({trashNews.length})
          </button>
        </div>
      </div>

      {showTrash && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-800">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Mostrando noticias en la <strong>Papelera</strong> (Soft Delete). Puede restaurarlas con 1 clic.</span>
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
            placeholder="Buscar por título, contenido o autor..."
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
              <option value="published">Publicados</option>
              <option value="draft">Borradores</option>
            </select>
          )}
        </div>
      </div>

      {/* Content Table */}
      {loading ? (
        <Loader text="Cargando boletín de socios..." />
      ) : filteredNews.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Artículo / Título</th>
                  <th className="px-6 py-4">Formato</th>
                  <th className="px-6 py-4">Categorías</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Autor & Entidad</th>
                  {!showTrash && <th className="px-6 py-4">Estado</th>}
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNews.map((item) => {
                  const itemCats = Array.isArray(item.categories) && item.categories.length > 0
                    ? item.categories
                    : (item.category ? [item.category] : []);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt=""
                              className="w-12 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
                              <Newspaper className="w-4 h-4" />
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
                            {item.summary && (
                              <p className="text-[11px] text-slate-400 truncate max-w-sm">{item.summary}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.file_url ? (
                          <button
                            onClick={() =>
                              setPdfPreview({
                                isOpen: true,
                                url: item.file_url!,
                                title: item.title,
                                fileName: item.file_name,
                                fileSize: item.file_size,
                              })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
                          >
                            <FileText className="w-3 h-3 text-purple-600" />
                            <span>{item.document_type === 'both' ? 'Texto + PDF' : 'PDF Adjunto'}</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600">
                            <Layers className="w-3 h-3 text-slate-400" />
                            <span>Solo Texto</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
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
                      <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.published_at ? item.published_at.slice(0, 10) : '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {item.author_avatar_url ? (
                            <img src={item.author_avatar_url} alt="" className="w-6 h-6 rounded-full object-cover border border-slate-200" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-[10px]">
                              <User className="w-3 h-3" />
                            </div>
                          )}
                          <span className="truncate max-w-[120px] font-medium text-slate-800">{item.author || 'CICHA'}</span>
                          {item.logo_url && (
                            <img src={item.logo_url} alt="" className="w-5 h-5 rounded object-contain border border-slate-200 bg-white" title="Logo asociado" />
                          )}
                        </div>
                      </td>
                      {!showTrash && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={item.status === 'published' ? 'success' : 'secondary'}>
                            {item.status === 'published' ? 'Publicado' : 'Borrador'}
                          </Badge>
                        </td>
                      )}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {showTrash ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleRestore(item.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                              title="Restaurar a Activos"
                            >
                              <RotateCcw className="w-3.5 h-3.5" /> Restaurar
                            </button>
                            <button
                              onClick={() => handleForceDelete(item.id)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Eliminar Definitivamente"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {item.file_url && (
                              <button
                                onClick={() =>
                                  setPdfPreview({
                                    isOpen: true,
                                    url: item.file_url!,
                                    title: item.title,
                                    fileName: item.file_name,
                                    fileSize: item.file_size,
                                  })
                                }
                                className="p-1.5 rounded-lg text-slate-600 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer"
                                title="Ver PDF"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors cursor-pointer"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Enviar a Papelera"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-serif font-bold text-slate-800">
            {showTrash ? 'La papelera está vacía' : 'No se encontraron noticias en el boletín'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {showTrash
              ? 'No hay comunicados borrados recientemente.'
              : searchTerm || selectedCategory !== 'all'
              ? 'Prueba modificando los filtros de búsqueda.'
              : 'Comienza creando la primera noticia o comunicado privado para socios.'}
          </p>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          title={editingItem ? 'Editar Noticia / Comunicado' : 'Nueva Noticia para Socios'}
          maxWidth="3xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Título de la Noticia / Comunicado *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Nuevas Oportunidades Comerciales Bilaterales 2026..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            {/* Multi-Category Selector */}
            <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 flex items-center gap-1.5 text-xs">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Categorías Temáticas (Seleccione una o varias) *</span>
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
                  + Administrar categorías
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
                  ⚠️ Seleccione al menos una categoría.
                </p>
              )}
            </div>

            {/* Content Modality Selector */}
            <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <label className="font-bold text-slate-700 block">Modalidad de Contenido</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, document_type: 'text' })}
                  className={`py-2 px-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                    formData.document_type === 'text'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>📝 Solo Texto</span>
                  <span className={`text-[10px] font-normal ${formData.document_type === 'text' ? 'text-blue-100' : 'text-slate-400'}`}>
                    Redacción directa
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, document_type: 'file' })}
                  className={`py-2 px-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                    formData.document_type === 'file'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>📄 Solo PDF</span>
                  <span className={`text-[10px] font-normal ${formData.document_type === 'file' ? 'text-blue-100' : 'text-slate-400'}`}>
                    Documento adjunto
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, document_type: 'both' })}
                  className={`py-2 px-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                    formData.document_type === 'both'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>📦 Ambos</span>
                  <span className={`text-[10px] font-normal ${formData.document_type === 'both' ? 'text-blue-100' : 'text-slate-400'}`}>
                    Texto + PDF visor
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, document_type: 'url' })}
                  className={`py-2 px-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                    formData.document_type === 'url'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>🔗 Enlace Web</span>
                  <span className={`text-[10px] font-normal ${formData.document_type === 'url' ? 'text-blue-100' : 'text-slate-400'}`}>
                    Link externo
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Fecha de Publicación</label>
              <input
                type="date"
                value={formData.published_at}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            {/* Author, Author Avatar, Logo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Autor / Firma</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Ej: Comisión Directiva CICHA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <ImageUploader
                  label="Foto del Autor / Persona (Opcional)"
                  value={formData.author_avatar_url}
                  onChange={(url) => setFormData({ ...formData, author_avatar_url: url })}
                  helperText="Avatar o retrato (JPG, PNG)"
                  previewHeight="h-24"
                />
              </div>

              <div>
                <ImageUploader
                  label="Logo / Imagen Relacionada (Opcional)"
                  value={formData.logo_url}
                  onChange={(url) => setFormData({ ...formData, logo_url: url })}
                  helperText="Logo de entidad o empresa"
                  previewHeight="h-24"
                />
              </div>
            </div>

            {/* Resumen / Bajada */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Pequeña descripción o resumen (Opcional)</label>
              <textarea
                rows={2}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Breve introducción o copete que aparecerá en el listado..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            {/* Cover Image */}
            <ImageUploader
              label="Imagen de Portada / Tapa del Documento (Opcional)"
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              helperText="Se mostrará en la cabecera del comunicado y listados"
              previewHeight="h-36"
            />

            {/* PDF Document Upload if file, both, url */}
            {(formData.document_type === 'file' || formData.document_type === 'both' || formData.document_type === 'url') && (
              <div className="p-4 bg-blue-50/50 border border-blue-200/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-blue-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Documento PDF / Archivo Adjunto</span>
                  </label>
                  {formData.file_url && (
                    <button
                      type="button"
                      onClick={() =>
                        setPdfPreview({
                          isOpen: true,
                          url: formData.file_url,
                          title: formData.title || 'Vista Previa de Documento',
                          fileName: formData.file_name,
                          fileSize: formData.file_size,
                        })
                      }
                      className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Probar Visor PDF
                    </button>
                  )}
                </div>

                <DocumentUploader
                  label="Subir PDF o pegar enlace directo"
                  fileUrl={formData.file_url}
                  fileSize={formData.file_size}
                  onChange={({ fileUrl, fileSize }) => {
                    setFormData({
                      ...formData,
                      file_url: fileUrl,
                      file_size: fileSize || '',
                      file_name: fileUrl.split('/').pop() || 'comunicado.pdf',
                    });
                  }}
                  helperText="El visor interactivo para socios permitirá leer, rotar, descargar e imprimir este PDF directamente."
                />
              </div>
            )}

            {/* Content Text if text or both */}
            {(formData.document_type === 'text' || formData.document_type === 'both') && (
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">
                  Texto Redactado {formData.document_type === 'text' ? '*' : '(Opcional)'}
                </label>
                <textarea
                  rows={8}
                  required={formData.document_type === 'text'}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Redacte aquí el comunicado institucional completo..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 leading-relaxed font-sans"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="is_featured_news"
                  checked={formData.is_featured === 1}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 cursor-pointer"
                />
                <label htmlFor="is_featured_news" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Marcar como Noticia Destacada del Boletín
                </label>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-slate-700">Estado:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-medium"
                >
                  <option value="published">Publicado (Visible a Socios)</option>
                  <option value="draft">Borrador (Oculto)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Guardando...' : editingItem ? 'Actualizar Noticia' : 'Publicar en Boletín'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Category Manager Modal */}
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
                    Gestión de Categorías del Boletín
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Cree y administre las categorías temáticas para las noticias de socios.
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
                  <span>{editingCat ? `Editar Categoría: "${editingCat.name}"` : 'Nueva Categoría de Boletín'}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ej: Comunicado Oficial, Comercio Bilateral..."
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
                            type: 'partner_news',
                          });
                        } else {
                          await adminApi.createCategory({
                            name: catNameInput.trim(),
                            type: 'partner_news',
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

      {/* PDF Interactive Viewer Modal */}
      <PdfViewerModal
        isOpen={pdfPreview.isOpen}
        onClose={() => setPdfPreview({ isOpen: false, url: '', title: '' })}
        url={pdfPreview.url}
        title={pdfPreview.title}
        fileName={pdfPreview.fileName}
        fileSize={pdfPreview.fileSize}
      />
    </div>
  );
};
