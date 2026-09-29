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
  ExternalLink,
  Tag,
  User,
  Sparkles,
  FileText,
  Layers,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { PartnerNewsItem } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ImageUploader } from '../../components/common/ImageUploader';
import { DocumentUploader } from '../../components/common/DocumentUploader';
import { PdfViewerModal } from '../../components/common/PdfViewerModal';

const CATEGORY_OPTIONS = [
  'Comunicado Oficial',
  'Comercio Bilateral',
  'Acuerdos & Alianzas',
  'Reunión de Directorio',
  'Análisis & Normativas',
  'Eventos & Encuentros',
];

export const AdminPartnerNewsPage: React.FC = () => {
  const [news, setNews] = useState<PartnerNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

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
    category: 'Comunicado Oficial',
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
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getPartnerNews();
      setNews(data || []);
    } catch (err) {
      console.error('Error loading partner news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Comunicado Oficial',
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
    setFormData({
      title: item.title,
      category: item.category || 'Comunicado Oficial',
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

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Desea eliminar esta noticia del boletín de socios? Esta acción no se puede deshacer.')) return;
    try {
      await adminApi.deletePartnerNews(id);
      fetchNews();
    } catch (err) {
      alert('Error al eliminar la noticia.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('El título es obligatorio.');
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

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.summary && item.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
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
            Publicación de comunicados oficiales, circulares, avisos corporativos y novedades privadas para asociados con soporte multimedia y visor PDF.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Comunicado / Noticia</span>
        </button>
      </div>

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
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="all">Todos los estados</option>
            <option value="published">Publicados</option>
            <option value="draft">Borradores</option>
          </select>
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
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Autor & Entidad</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNews.map((item) => (
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {item.category}
                      </span>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={item.status === 'published' ? 'success' : 'secondary'}>
                        {item.status === 'published' ? 'Publicado' : 'Borrador'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
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
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                            title="Ver PDF"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
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
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-serif font-bold text-slate-800">No se encontraron noticias en el boletín</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm || selectedCategory !== 'all'
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Categoría *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
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
                      className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-bold underline"
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
                  className="w-4 h-4 text-blue-600 rounded-sm border-slate-300"
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
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs"
              >
                {submitting ? 'Guardando...' : editingItem ? 'Actualizar Noticia' : 'Publicar en Boletín'}
              </button>
            </div>
          </form>
        </Modal>
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
