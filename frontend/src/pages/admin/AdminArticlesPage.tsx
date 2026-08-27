import React, { useEffect, useState } from 'react';
import {
  Newspaper,
  Plus,
  Edit2,
  Trash2,
  Image,
  Upload,
  Calendar,
  User,
  CheckCircle,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { Article } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const [formData, setFormData] = useState({
    category_id: 1,
    title: '',
    summary: '',
    content: '',
    image_url: '',
    author: 'CICHA Institucional',
    published_at: new Date().toISOString().split('T')[0],
    is_featured: 0,
    status: 'published' as 'published' | 'draft',
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = () => {
    setLoading(true);
    adminApi
      .getArticles()
      .then((res) => {
        setArticles(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setFormData({
      category_id: 1,
      title: '',
      summary: '',
      content: '',
      image_url: '',
      author: 'CICHA Institucional',
      published_at: new Date().toISOString().split('T')[0],
      is_featured: 0,
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      category_id: article.category_id || 1,
      title: article.title,
      summary: article.summary || '',
      content: article.content,
      image_url: article.image_url || '',
      author: article.author || 'CICHA Institucional',
      published_at: article.published_at || new Date().toISOString().split('T')[0],
      is_featured: article.is_featured ? 1 : 0,
      status: article.status || 'published',
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await adminApi.uploadFile(file);
      setFormData((prev) => ({ ...prev, image_url: res.url }));
    } catch (err) {
      alert('Error al subir la imagen. Intente ingresando una URL directa.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingArticle) {
        await adminApi.updateArticle(editingArticle.id, formData);
      } else {
        await adminApi.createArticle(formData);
      }
      setIsModalOpen(false);
      fetchArticles();
    } catch (err) {
      alert('Error al guardar el artículo. Verifique los campos obligatorios.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar esta noticia?')) return;
    try {
      await adminApi.deleteArticle(id);
      fetchArticles();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-xl text-[#0B2545]">Gestión de Noticias y Prensa</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Publicación, edición y administración de comunicados institucionales.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Noticia
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <Loader text="Cargando noticias..." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Noticia / Título</th>
                  <th className="py-3.5 px-4">Categoría</th>
                  <th className="py-3.5 px-4">Fecha</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {art.image_url ? (
                          <img
                            src={art.image_url}
                            alt=""
                            className="w-12 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                            <Newspaper className="w-5 h-5" />
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <p className="font-bold text-slate-900 truncate max-w-sm">{art.title}</p>
                          <p className="text-[11px] text-slate-500 truncate max-w-xs">{art.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="primary">{art.category_name || 'General'}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">{art.published_at}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={art.status === 'published' ? 'success' : 'secondary'}>
                        {art.status === 'published' ? 'Publicado' : 'Borrador'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(art)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(art.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar"
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

      {/* Editor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingArticle ? 'Editar Noticia' : 'Crear Nueva Noticia'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Título de la Noticia *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Categoría</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value={1}>Comercio Bilateral</option>
                <option value={2}>Eurocámara & EEN</option>
                <option value={3}>Institucional</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Fecha de Publicación</label>
              <input
                type="date"
                value={formData.published_at}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              >
              </input>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Estado</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="published">Publicado</option>
                <option value="draft">Borrador</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Imagen de Portada (URL o Subir Archivo)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
              <label className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer flex items-center gap-1.5 shrink-0">
                <Upload className="w-4 h-4" />
                {uploading ? 'Subiendo...' : 'Subir'}
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Resumen / Bajada</label>
            <textarea
              rows={2}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Breve resumen del artículo..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Contenido Completo (HTML o Texto) *</label>
            <textarea
              rows={8}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Escriba el cuerpo del artículo..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured === 1}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked ? 1 : 0 })}
              className="rounded text-blue-600"
            />
            <label htmlFor="is_featured" className="font-semibold text-slate-700 cursor-pointer">
              Destacar en la portada principal (Home)
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              {submitting ? 'Guardando...' : 'Guardar Noticia'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
