import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Tag,
  ExternalLink,
  Search,
  CheckCircle,
  Eye,
  User as UserIcon,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { Blog, Category } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminBlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCats, setLoadingCats] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Category Manager Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catNameInput, setCatNameInput] = useState('');
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catActionLoading, setCatActionLoading] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  // Blog Modal State
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    author: 'Comisión Editorial CICHA',
    author_role: 'Especialista en Comercio Bilateral',
    category: 'Economía & Comercio',
    tags: 'Grecia, Argentina, Comercio, Inversiones',
    read_time: '5 min de lectura',
    summary: '',
    content: '',
    image_url: '',
    published_at: new Date().toISOString().slice(0, 10),
    is_featured: 0,
    status: 'published' as 'published' | 'draft' | 'archived',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getBlogs();
      setBlogs(data || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCats(true);
    try {
      const data = await adminApi.getCategories('blogs');
      setCategories(data || []);
    } catch (err) {
      console.error('Error cargando categorías de blogs:', err);
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
          type: 'blogs',
        });
      } else {
        await adminApi.createCategory({
          name: catNameInput.trim(),
          type: 'blogs',
        });
      }
      setCatNameInput('');
      setEditingCat(null);
      await fetchCategories();
      await fetchBlogs(); // actualiza categorías en cascada
    } catch (err: any) {
      console.error('Error guardando categoría de blog:', err);
      setCatError(err?.response?.data?.messages?.name || 'Error al guardar la categoría');
    } finally {
      setCatActionLoading(false);
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    if (
      !window.confirm(
        `¿Está seguro de eliminar la categoría "${cat.name}"?\n\nLos artículos asociados se reasignarán de forma segura a "General".`
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
      await fetchBlogs();
    } catch (err: any) {
      console.error('Error eliminando categoría de blog:', err);
      setCatError('No se pudo eliminar la categoría');
    } finally {
      setCatActionLoading(false);
    }
  };

  // Blog Handlers
  const handleOpenCreateBlog = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '',
      author: 'Comisión Editorial CICHA',
      author_role: 'Especialista en Comercio Bilateral',
      category: categories.length > 0 ? categories[0].name : 'Economía & Comercio',
      tags: 'Grecia, Argentina, Comercio, Inversiones',
      read_time: '5 min de lectura',
      summary: '',
      content: '',
      image_url: '',
      published_at: new Date().toISOString().slice(0, 10),
      is_featured: 0,
      status: 'published',
    });
    setIsBlogModalOpen(true);
  };

  const handleOpenEditBlog = (b: Blog) => {
    setEditingBlog(b);
    setBlogForm({
      title: b.title,
      author: b.author,
      author_role: b.author_role || '',
      category: b.category || (categories.length > 0 ? categories[0].name : 'Economía & Comercio'),
      tags: b.tags || '',
      read_time: b.read_time || '5 min de lectura',
      summary: b.summary || '',
      content: b.content,
      image_url: b.image_url || '',
      published_at: b.published_at ? b.published_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
      is_featured: b.is_featured ? 1 : 0,
      status: b.status,
    });
    setIsBlogModalOpen(true);
  };

  const handleSubmitBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingBlog) {
        await adminApi.updateBlog(editingBlog.id, blogForm);
      } else {
        await adminApi.createBlog(blogForm);
      }
      setIsBlogModalOpen(false);
      fetchBlogs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar el artículo de blog.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBlog = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este artículo de blog?')) return;
    try {
      await adminApi.deleteBlog(id);
      fetchBlogs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar blog');
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()) ||
      (b.summary && b.summary.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <h1 className="font-serif font-bold text-2xl text-cicha-navy flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Blogs & Artículos Editoriales
          </h1>
          <p className="text-xs text-slate-500">
            Administre notas de análisis, artículos de opinión y publicaciones técnicas de la Cámara.
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

          <button
            onClick={handleOpenCreateBlog}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Nuevo Artículo de Blog
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, autor o tema..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-cicha-navy text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas ({blogs.length})
          </button>
          {categories.map((cat) => {
            const count = blogs.filter((b) => b.category === cat.name).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader size="lg" />
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-serif font-bold text-base text-slate-700">No se encontraron artículos</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search || selectedCategory !== 'all'
              ? 'No hay blogs que coincidan con los filtros aplicados.'
              : 'Comience creando la primera publicación para el blog institucional.'}
          </p>
          <button
            onClick={handleOpenCreateBlog}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Crear Primer Blog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                {/* Image */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  {b.image_url ? (
                    <img
                      src={b.image_url}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                      <BookOpen className="w-10 h-10" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-cicha-navy backdrop-blur-sm shadow-sm flex items-center gap-1">
                      <Tag className="w-3 h-3 text-blue-600" />
                      {b.category}
                    </span>
                  </div>

                  {b.is_featured ? (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      Destacado
                    </div>
                  ) : null}
                </div>

                {/* Content Details */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-3 h-3" /> {b.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {b.read_time}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
                    {b.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-light">
                    {b.summary}
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                <Badge variant={b.status === 'published' ? 'success' : 'secondary'}>
                  {b.status === 'published' ? 'Publicado' : b.status === 'draft' ? 'Borrador' : 'Archivado'}
                </Badge>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditBlog(b)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(b.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Create / Edit Modal */}
      <Modal
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
        title={editingBlog ? 'Editar Artículo de Blog' : 'Nuevo Artículo de Blog'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmitBlog} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Título del Artículo *</label>
            <input
              type="text"
              required
              value={blogForm.title}
              onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
              placeholder="Ej. Oportunidades comerciales y nuevas tendencias en el comercio heleno-argentino"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Autor de la Nota *</label>
              <input
                type="text"
                required
                value={blogForm.author}
                onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                placeholder="Nombre o Comisión Editorial"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Cargo / Afiliación del Autor</label>
              <input
                type="text"
                value={blogForm.author_role}
                onChange={(e) => setBlogForm({ ...blogForm, author_role: e.target.value })}
                placeholder="Ej. Especialista en Comercio Exterior"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">Categoría *</label>
                <button
                  type="button"
                  onClick={handleOpenCatModal}
                  className="text-[10px] text-blue-600 hover:underline font-semibold"
                >
                  + Nueva
                </button>
              </div>
              <select
                value={blogForm.category}
                onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Economía & Comercio">Economía & Comercio</option>
                    <option value="Cultura & Tradición Helénica">Cultura & Tradición Helénica</option>
                    <option value="Oportunidades de Negocios">Oportunidades de Negocios</option>
                    <option value="Geopolítica & UE">Geopolítica & UE</option>
                    <option value="Logística & Puertos">Logística & Puertos</option>
                    <option value="Tecnología & Energía">Tecnología & Energía</option>
                  </>
                )}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Tiempo de Lectura</label>
              <input
                type="text"
                value={blogForm.read_time}
                onChange={(e) => setBlogForm({ ...blogForm, read_time: e.target.value })}
                placeholder="Ej. 4 min de lectura"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Fecha de Publicación</label>
              <input
                type="date"
                value={blogForm.published_at}
                onChange={(e) => setBlogForm({ ...blogForm, published_at: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Etiquetas / Tags (separados por coma)</label>
            <input
              type="text"
              value={blogForm.tags}
              onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
              placeholder="Grecia, Argentina, Comercio Bilateral, Inversiones"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Resumen Breve *</label>
            <textarea
              rows={2}
              required
              value={blogForm.summary}
              onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
              placeholder="Breve sinopsis que aparecerá en las tarjetas y vista previa..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Image Uploader */}
          <ImageUploader
            label="Foto de Portada / Banner del Artículo"
            value={blogForm.image_url}
            onChange={(url) => setBlogForm({ ...blogForm, image_url: url })}
            helperText="Imagen destacada del blog (JPG, PNG, WEBP)"
            previewHeight="h-44"
          />

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Cuerpo del Artículo *</label>
            <textarea
              rows={7}
              required
              value={blogForm.content}
              onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
              placeholder="Contenido completo del artículo. Soporta formato estructurado..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured_blog"
                checked={blogForm.is_featured === 1}
                onChange={(e) => setBlogForm({ ...blogForm, is_featured: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <label htmlFor="is_featured_blog" className="font-bold text-slate-700 cursor-pointer">
                Marcar como Artículo Destacado (Hero)
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Estado de Publicación</label>
              <select
                value={blogForm.status}
                onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              >
                <option value="published">Publicado</option>
                <option value="draft">Borrador</option>
                <option value="archived">Archivado</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsBlogModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer transition-colors shadow-md disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : editingBlog ? 'Actualizar Artículo' : 'Publicar Artículo'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Category Management Modal */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title="Administrar Categorías de Blogs & Artículos"
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
              <span>{editingCat ? 'Editar Categoría de Blog' : 'Nueva Categoría de Blog'}</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej. Economía & Comercio, Cultura, Logística..."
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
                  const count = blogs.filter((b) => b.category === cat.name).length;
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between py-2 px-2.5 hover:bg-slate-50 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{cat.name}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {count} {count === 1 ? 'artículo' : 'artículos'}
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
