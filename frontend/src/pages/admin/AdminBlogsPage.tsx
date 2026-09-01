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
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { Blog } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminBlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getBlogs();
      setBlogs(data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateBlog = () => {
    setEditingBlog(null);
    setBlogForm({
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
      category: b.category,
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

  const categories = Array.from(new Set(blogs.map((b) => b.category).filter(Boolean)));

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

        <button
          onClick={handleOpenCreateBlog}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Nuevo Artículo de Blog
        </button>
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
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-cicha-navy text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas ({blogs.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
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
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
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
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-cicha-navy backdrop-blur-sm shadow-sm">
                      {b.category}
                    </span>
                    {b.is_featured ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-sm">
                        Destacado
                      </span>
                    ) : null}
                  </div>

                  <div className="absolute top-3 right-3">
                    <Badge variant={b.status === 'published' ? 'success' : 'secondary'} className="text-[10px]">
                      {b.status === 'published' ? 'Publicado' : b.status === 'draft' ? 'Borrador' : 'Archivado'}
                    </Badge>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {b.published_at ? new Date(b.published_at).toLocaleDateString('es-AR') : 'Sin fecha'}
                    </span>
                    <span>•</span>
                    <span>{b.read_time || '5 min'}</span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-cicha-navy line-clamp-2 leading-snug">
                    {b.title}
                  </h3>

                  {b.summary && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {b.summary}
                    </p>
                  )}

                  <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500">
                    <UserIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-medium truncate">{b.author}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`/blogs/${b.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-blue-600"
                >
                  <Eye className="w-3.5 h-3.5" /> Ver en Portal
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditBlog(b)}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                    title="Editar Blog"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(b.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Eliminar Blog"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Creación / Edición */}
      <Modal
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
        title={editingBlog ? 'Editar Artículo de Blog' : 'Publicar Nuevo Artículo de Blog'}
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Cargo / Afiliación del Autor</label>
              <input
                type="text"
                value={blogForm.author_role}
                onChange={(e) => setBlogForm({ ...blogForm, author_role: e.target.value })}
                placeholder="Ej. Especialista en Comercio Exterior"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Categoría *</label>
              <input
                type="text"
                required
                value={blogForm.category}
                onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                placeholder="Ej. Economía, Cultura, Comercio"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Tiempo de Lectura</label>
              <input
                type="text"
                value={blogForm.read_time}
                onChange={(e) => setBlogForm({ ...blogForm, read_time: e.target.value })}
                placeholder="Ej. 4 min de lectura"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Fecha de Publicación</label>
              <input
                type="date"
                value={blogForm.published_at}
                onChange={(e) => setBlogForm({ ...blogForm, published_at: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Etiquetas / Tags (Separadas por comas)</label>
            <input
              type="text"
              value={blogForm.tags}
              onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
              placeholder="Grecia, Argentina, Agroindustria, Exportaciones"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <ImageUploader
              label="Foto de Portada del Artículo"
              value={blogForm.image_url}
              onChange={(url) => setBlogForm({ ...blogForm, image_url: url })}
              helperText="Imagen de alta calidad en formato JPG, PNG o WEBP."
              previewHeight="h-36"
              aspectRatio="video"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Resumen / Bajada (Extracto breve)</label>
            <textarea
              rows={2}
              value={blogForm.summary}
              onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
              placeholder="Breve introducción que se mostrará en las tarjetas del catálogo..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Contenido Completo del Artículo *</label>
            <textarea
              rows={10}
              required
              value={blogForm.content}
              onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
              placeholder="Escriba aquí el cuerpo completo de la publicación..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-sans leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Estado de Publicación</label>
              <select
                value={blogForm.status}
                onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="published">Publicado (Visible en portal)</option>
                <option value="draft">Borrador (Privado)</option>
                <option value="archived">Archivado</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={blogForm.is_featured === 1}
                  onChange={(e) => setBlogForm({ ...blogForm, is_featured: e.target.checked ? 1 : 0 })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                Marcar como Artículo Destacado
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsBlogModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
            >
              {submitting ? 'Guardando...' : editingBlog ? 'Actualizar Artículo' : 'Publicar Artículo'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
