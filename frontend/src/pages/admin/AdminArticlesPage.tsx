import React, { useEffect, useState } from 'react';
import {
  Newspaper,
  Plus,
  Edit2,
  Trash2,
  Tag,
  Search,
  CheckCircle2,
  X,
  AlertCircle,
  Link2,
  ExternalLink,
  FileText,
  Eye,
  Layers,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { Article, Category, ArticleSourceLink } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ImageUploader } from '../../components/common/ImageUploader';
import { DocumentUploader } from '../../components/common/DocumentUploader';
import { PdfViewerModal } from '../../components/common/PdfViewerModal';

export const AdminArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCats, setLoadingCats] = useState(false);

  // Filter state in table
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Category Manager Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catNameInput, setCatNameInput] = useState('');
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catActionLoading, setCatActionLoading] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  // PDF Preview State
  const [pdfPreview, setPdfPreview] = useState<{ isOpen: boolean; url: string; title: string; fileName?: string; fileSize?: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  // Article Modal State
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    category_id: '' as string | number,
    summary: '',
    content: '',
    image_url: '',
    author: 'Comisión de Prensa CICHA',
    author_avatar_url: '',
    logo_url: '',
    document_type: 'text' as 'text' | 'file' | 'both' | 'url',
    file_url: '',
    file_name: '',
    file_size: '',
    published_at: new Date().toISOString().slice(0, 10),
    is_featured: 0,
    status: 'published' as 'published' | 'draft',
    source_links: [] as ArticleSourceLink[],
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const fetchData = () => {
    setLoading(true);
    adminApi.getArticles()
      .then((arts) => {
        setArticles(arts || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchCategories = async () => {
    setLoadingCats(true);
    try {
      const data = await adminApi.getCategories('news');
      setCategories(data || []);
    } catch (err) {
      console.error('Error al cargar categorías de noticias:', err);
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
      setCatError('El nombre de la categoría no puede estar vacío');
      return;
    }

    setCatActionLoading(true);
    setCatError(null);
    try {
      if (editingCat) {
        await adminApi.updateCategory(editingCat.id, {
          name: catNameInput.trim(),
          type: 'news',
        });
      } else {
        await adminApi.createCategory({
          name: catNameInput.trim(),
          type: 'news',
        });
      }
      setCatNameInput('');
      setEditingCat(null);
      await fetchCategories();
      await fetchData(); // refresca los nombres de categorías en los artículos
    } catch (err: any) {
      console.error('Error al guardar categoría:', err);
      setCatError(err?.response?.data?.messages?.name || 'Error al guardar la categoría');
    } finally {
      setCatActionLoading(false);
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    if (!window.confirm(`¿Está seguro de eliminar la categoría "${cat.name}"?\n\nLos artículos asociados se desvincularán de forma segura sin eliminarse.`)) {
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
      await fetchData();
    } catch (err: any) {
      console.error('Error al eliminar categoría:', err);
      setCatError('No se pudo eliminar la categoría');
    } finally {
      setCatActionLoading(false);
    }
  };

  // Article Handlers
  const parseSourceLinks = (raw: any): ArticleSourceLink[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const handleOpenCreateArticle = () => {
    setEditingArticle(null);
    setArticleForm({
      title: '',
      category_id: categories.length > 0 ? categories[0].id : '',
      summary: '',
      content: '',
      image_url: '',
      author: 'Comisión de Prensa CICHA',
      author_avatar_url: '',
      logo_url: '',
      document_type: 'text',
      file_url: '',
      file_name: '',
      file_size: '',
      published_at: new Date().toISOString().slice(0, 10),
      is_featured: 0,
      status: 'published',
      source_links: [],
    });
    setIsArticleModalOpen(true);
  };

  const handleOpenEditArticle = (art: Article) => {
    setEditingArticle(art);
    setArticleForm({
      title: art.title,
      category_id: art.category_id || '',
      summary: art.summary || '',
      content: art.content || '',
      image_url: art.image_url || '',
      author: art.author || 'CICHA',
      author_avatar_url: art.author_avatar_url || '',
      logo_url: art.logo_url || '',
      document_type: (art.document_type as any) || (art.file_url ? 'both' : 'text'),
      file_url: art.file_url || '',
      file_name: art.file_name || '',
      file_size: art.file_size || '',
      published_at: art.published_at || new Date().toISOString().slice(0, 10),
      is_featured: art.is_featured ? 1 : 0,
      status: art.status || 'published',
      source_links: parseSourceLinks(art.source_links),
    });
    setIsArticleModalOpen(true);
  };

  const handleAddSourceLink = () => {
    setArticleForm({
      ...articleForm,
      source_links: [...articleForm.source_links, { title: '', url: '' }],
    });
  };

  const handleUpdateSourceLink = (index: number, field: 'title' | 'url', value: string) => {
    const updated = [...articleForm.source_links];
    updated[index] = { ...updated[index], [field]: value };
    setArticleForm({ ...articleForm, source_links: updated });
  };

  const handleRemoveSourceLink = (index: number) => {
    const updated = articleForm.source_links.filter((_, idx) => idx !== index);
    setArticleForm({ ...articleForm, source_links: updated });
  };

  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title.trim()) {
      alert('El título es obligatorio.');
      return;
    }

    setSubmitting(true);
    try {
      // Filtrar fuentes vacías
      const cleanSourceLinks = articleForm.source_links.filter(
        (link) => link.title.trim() !== '' || link.url.trim() !== ''
      );

      const payload = {
        ...articleForm,
        category_id: articleForm.category_id ? Number(articleForm.category_id) : null,
        source_links: cleanSourceLinks,
      };

      if (editingArticle) {
        await adminApi.updateArticle(editingArticle.id, payload);
      } else {
        await adminApi.createArticle(payload);
      }
      setIsArticleModalOpen(false);
      fetchData();
    } catch {
      alert('Error al guardar noticia.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!window.confirm('¿Desea eliminar este artículo?')) return;
    try {
      await adminApi.deleteArticle(id);
      fetchData();
    } catch {
      alert('Error al eliminar');
    }
  };

  // Filtered Articles
  const filteredArticles = articles.filter((art) => {
    const matchSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (art.summary && art.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (art.author && art.author.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchCat =
      selectedCategoryFilter === 'all'
        ? true
        : selectedCategoryFilter === 'uncategorized'
        ? !art.category_id
        : String(art.category_id) === String(selectedCategoryFilter);

    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-xl text-cicha-navy">Noticias & Prensa</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Publicación y administración de comunicados, noticias del sector bilateral y gacetillas institucionales.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Administrar Categorías */}
          <button
            onClick={handleOpenCatModal}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Tag className="w-4 h-4 text-blue-600" />
            <span>Categorías ({categories.length})</span>
          </button>

          {/* Nueva Noticia */}
          <button
            onClick={handleOpenCreateArticle}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nueva Noticia
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título, autor o resumen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategoryFilter === 'all'
                ? 'bg-cicha-navy text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas ({articles.length})
          </button>
          {categories.map((c) => {
            const count = articles.filter((a) => String(a.category_id) === String(c.id)).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategoryFilter(String(c.id))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategoryFilter === String(c.id)
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

      {/* Content */}
      {loading ? (
        <Loader text="Cargando publicaciones..." />
      ) : (
        /* Articles Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Título</th>
                  <th className="py-3.5 px-4">Categoría</th>
                  <th className="py-3.5 px-4">Fecha</th>
                  <th className="py-3.5 px-4">Autor</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      {searchTerm || selectedCategoryFilter !== 'all'
                        ? 'No se encontraron noticias con los filtros seleccionados.'
                        : 'No hay artículos o noticias publicadas aún.'}
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((art) => {
                    const cat = categories.find((c) => String(c.id) === String(art.category_id));
                    const catName = art.category_name || cat?.name;

                    return (
                      <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-10 rounded-lg bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                              {art.image_url ? (
                                <img src={art.image_url} alt={art.title} className="w-full h-full object-cover" />
                              ) : (
                                <Newspaper className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 line-clamp-1">{art.title}</div>
                              <div className="text-[11px] text-slate-500 line-clamp-1">{art.summary}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {catName ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200/60">
                              <Tag className="w-3 h-3" />
                              {catName}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Sin categoría</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-medium whitespace-nowrap">
                          {art.published_at}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{art.author}</td>
                        <td className="py-3.5 px-4">
                          <Badge variant={art.status === 'published' ? 'success' : 'secondary'}>
                            {art.status === 'published' ? 'Publicado' : 'Borrador'}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {art.file_url && (
                              <button
                                type="button"
                                onClick={() => setPdfPreview({
                                  isOpen: true,
                                  url: art.file_url!,
                                  title: art.title,
                                  fileName: art.file_name,
                                  fileSize: art.file_size,
                                })}
                                className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                                title="Ver documento PDF"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenEditArticle(art)}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                              title="Editar artículo"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(art.id)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Eliminar artículo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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

      {/* Article Create / Edit Modal */}
      <Modal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        title={editingArticle ? 'Editar Noticia / Comunicado' : 'Nueva Noticia / Comunicado'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmitArticle} className="space-y-4 text-xs">
          {/* Título */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Título de la Noticia / Comunicado *</label>
            <input
              type="text"
              required
              placeholder="Ej. Delegación comercial visita Atenas para foros de inversión"
              value={articleForm.title}
              onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
            />
          </div>

          {/* Modalidad de Contenido */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Modalidad de Contenido</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setArticleForm({ ...articleForm, document_type: 'text' })}
                className={`py-2 px-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                  articleForm.document_type === 'text'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>📝 Solo Texto</span>
                <span className={`text-[10px] font-normal ${articleForm.document_type === 'text' ? 'text-blue-100' : 'text-slate-400'}`}>
                  Redacción directa
                </span>
              </button>

              <button
                type="button"
                onClick={() => setArticleForm({ ...articleForm, document_type: 'file' })}
                className={`py-2 px-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                  articleForm.document_type === 'file'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>📄 Solo PDF</span>
                <span className={`text-[10px] font-normal ${articleForm.document_type === 'file' ? 'text-blue-100' : 'text-slate-400'}`}>
                  Documento adjunto
                </span>
              </button>

              <button
                type="button"
                onClick={() => setArticleForm({ ...articleForm, document_type: 'both' })}
                className={`py-2 px-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                  articleForm.document_type === 'both'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>📦 Ambos</span>
                <span className={`text-[10px] font-normal ${articleForm.document_type === 'both' ? 'text-blue-100' : 'text-slate-400'}`}>
                  Texto + PDF visor
                </span>
              </button>

              <button
                type="button"
                onClick={() => setArticleForm({ ...articleForm, document_type: 'url' })}
                className={`py-2 px-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                  articleForm.document_type === 'url'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🔗 Enlace Web</span>
                <span className={`text-[10px] font-normal ${articleForm.document_type === 'url' ? 'text-blue-100' : 'text-slate-400'}`}>
                  Link externo
                </span>
              </button>
            </div>
          </div>

          {/* Categoría y Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">Categoría</label>
                <button
                  type="button"
                  onClick={handleOpenCatModal}
                  className="text-[10px] text-blue-600 hover:underline font-semibold"
                >
                  + Nueva Categoría
                </button>
              </div>
              <select
                value={articleForm.category_id}
                onChange={(e) => setArticleForm({ ...articleForm, category_id: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              >
                <option value="">-- Seleccionar Categoría --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Fecha de Publicación</label>
              <input
                type="date"
                value={articleForm.published_at}
                onChange={(e) => setArticleForm({ ...articleForm, published_at: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Autores, Foto de Autor y Logo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Autor / Entidad</label>
              <input
                type="text"
                placeholder="Ej. Comisión de Prensa CICHA"
                value={articleForm.author}
                onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <ImageUploader
                label="Foto del Autor / Persona (Opcional)"
                value={articleForm.author_avatar_url}
                onChange={(url) => setArticleForm({ ...articleForm, author_avatar_url: url })}
                helperText="Avatar o retrato (JPG, PNG)"
                previewHeight="h-24"
              />
            </div>

            <div>
              <ImageUploader
                label="Logo / Imagen Relacionada (Opcional)"
                value={articleForm.logo_url}
                onChange={(url) => setArticleForm({ ...articleForm, logo_url: url })}
                helperText="Logo institucional o de empresa"
                previewHeight="h-24"
              />
            </div>
          </div>

          {/* Resumen Breve */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Pequeña descripción o resumen (Opcional)</label>
            <textarea
              rows={2}
              placeholder="Breve introducción para la tarjeta y vistas previas..."
              value={articleForm.summary}
              onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Imagen de Portada / Tapa */}
          <ImageUploader
            label="Imagen de Portada / Tapa del Documento (Opcional)"
            value={articleForm.image_url}
            onChange={(url) => setArticleForm({ ...articleForm, image_url: url })}
            helperText="Se mostrará en la cabecera y listado (JPG, PNG, WEBP)"
            previewHeight="h-36"
          />

          {/* Subida o Enlace de PDF (si modalidad es file o both) */}
          {(articleForm.document_type === 'file' || articleForm.document_type === 'both' || articleForm.document_type === 'url') && (
            <div className="p-4 bg-blue-50/50 border border-blue-200/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-blue-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Documento PDF / Archivo Adjunto</span>
                </label>
                {articleForm.file_url && (
                  <button
                    type="button"
                    onClick={() => setPdfPreview({
                      isOpen: true,
                      url: articleForm.file_url,
                      title: articleForm.title || 'Vista Previa de Documento',
                      fileName: articleForm.file_name,
                      fileSize: articleForm.file_size,
                    })}
                    className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-bold underline"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Probar Visor PDF
                  </button>
                )}
              </div>

              <DocumentUploader
                label="Subir PDF o pegar enlace directo"
                fileUrl={articleForm.file_url}
                fileSize={articleForm.file_size}
                onChange={({ fileUrl, fileSize }) => {
                  setArticleForm({
                    ...articleForm,
                    file_url: fileUrl,
                    file_size: fileSize || '',
                    file_name: fileUrl.split('/').pop() || 'documento.pdf',
                  });
                }}
                helperText="El visor interactivo permitirá leer, rotar, descargar e imprimir este PDF directamente."
              />
            </div>
          )}

          {/* Cuerpo del Artículo (si modalidad es text o both) */}
          {(articleForm.document_type === 'text' || articleForm.document_type === 'both') && (
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">
                Texto del Artículo / Contenido Redactado {articleForm.document_type === 'text' ? '*' : '(Opcional)'}
              </label>
              <textarea
                rows={6}
                required={articleForm.document_type === 'text'}
                placeholder="Escriba o pegue el contenido completo de la noticia aquí..."
                value={articleForm.content}
                onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-sans"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Estado de Publicación</label>
              <select
                value={articleForm.status}
                onChange={(e) => setArticleForm({ ...articleForm, status: e.target.value as 'published' | 'draft' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
              >
                <option value="published">🟢 Publicado (Visible en la Web Pública)</option>
                <option value="draft">🟡 Borrador (Oculto)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={articleForm.is_featured === 1}
                  onChange={(e) => setArticleForm({ ...articleForm, is_featured: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>Destacar en Portada / Inicio</span>
              </label>
            </div>
          </div>

          {/* Sources and Reference Links Section */}
          <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Link2 className="w-4 h-4 text-blue-600" />
                  <span>Fuentes & Enlaces de Referencia</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Agregue medios de prensa, comunicados oficiales o links externos consultados.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSourceLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs transition-colors cursor-pointer border border-blue-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Fuente</span>
              </button>
            </div>

            {articleForm.source_links.length === 0 ? (
              <div className="py-3 px-4 bg-white border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs">
                Sin fuentes agregadas. Puede hacer clic en "+ Agregar Fuente" para incluir referencias externas.
              </div>
            ) : (
              <div className="space-y-2.5">
                {articleForm.source_links.map((src, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
                    <div className="w-full sm:w-1/3">
                      <input
                        type="text"
                        placeholder="Nombre / Medio (ej. Infobae, Embajada)"
                        value={src.title}
                        onChange={(e) => handleUpdateSourceLink(idx, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="https://ejemplo.com/noticia-completa"
                        value={src.url}
                        onChange={(e) => handleUpdateSourceLink(idx, 'url', e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      {src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
                          title="Probar enlace"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveSourceLink(idx)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors shrink-0 cursor-pointer"
                        title="Eliminar fuente"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsArticleModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer transition-colors"
            >
              {submitting ? 'Guardando...' : 'Guardar Noticia'}
            </button>
          </div>
        </form>
      </Modal>

      {/* PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={pdfPreview.isOpen}
        onClose={() => setPdfPreview({ ...pdfPreview, isOpen: false })}
        fileUrl={pdfPreview.url}
        title={pdfPreview.title}
        fileName={pdfPreview.fileName}
        fileSize={pdfPreview.fileSize}
      />

      {/* Category Management Modal */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title="Administrar Categorías de Noticias"
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
              <span>{editingCat ? 'Editar Categoría' : 'Nueva Categoría de Noticia'}</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej. Comercio Bilateral, Institucional, Cultura..."
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
              <span>Categorías Registradas</span>
              <span>{categories.length} categorías</span>
            </div>

            {loadingCats ? (
              <div className="py-4 text-center text-slate-400">Cargando categorías...</div>
            ) : categories.length === 0 ? (
              <div className="py-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No hay categorías registradas. Crea una arriba.
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100">
                {categories.map((cat) => {
                  const count = articles.filter((a) => String(a.category_id) === String(cat.id)).length;
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between py-2 px-2.5 hover:bg-slate-50 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{cat.name}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {count} {count === 1 ? 'noticia' : 'noticias'}
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
