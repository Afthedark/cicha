import React, { useEffect, useState } from 'react';
import {
  Images,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Tag,
  Search,
  CheckCircle,
  Eye,
  Camera,
  X,
  UploadCloud,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { PhotoAlbum, GalleryPhoto } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminGalleryPage: React.FC = () => {
  const [albums, setAlbums] = useState<PhotoAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Album Modal
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<PhotoAlbum | null>(null);
  const [albumForm, setAlbumForm] = useState({
    title: '',
    category: 'Institucional',
    event_date: new Date().toISOString().slice(0, 10),
    description: '',
    cover_image_url: '',
    order_num: 0,
    is_active: 1,
    photos: [] as Array<{ image_url: string; caption?: string }>,
  });

  // Current new photo URL input for batch adding
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAlbums();
      setAlbums(data);
    } catch (err) {
      console.error('Error fetching photo albums:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateAlbum = () => {
    setEditingAlbum(null);
    setAlbumForm({
      title: '',
      category: 'Institucional',
      event_date: new Date().toISOString().slice(0, 10),
      description: '',
      cover_image_url: '',
      order_num: 0,
      is_active: 1,
      photos: [],
    });
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setIsAlbumModalOpen(true);
  };

  const handleOpenEditAlbum = async (alb: PhotoAlbum) => {
    setEditingAlbum(alb);
    try {
      const fullAlbum = await adminApi.getAlbum(alb.id);
      setAlbumForm({
        title: fullAlbum.title,
        category: fullAlbum.category,
        event_date: fullAlbum.event_date ? fullAlbum.event_date.slice(0, 10) : new Date().toISOString().slice(0, 10),
        description: fullAlbum.description || '',
        cover_image_url: fullAlbum.cover_image_url || '',
        order_num: fullAlbum.order_num || 0,
        is_active: fullAlbum.is_active ? 1 : 0,
        photos: (fullAlbum.photos || []).map((p) => ({
          image_url: p.image_url,
          caption: p.caption || '',
        })),
      });
    } catch {
      setAlbumForm({
        title: alb.title,
        category: alb.category,
        event_date: alb.event_date ? alb.event_date.slice(0, 10) : new Date().toISOString().slice(0, 10),
        description: alb.description || '',
        cover_image_url: alb.cover_image_url || '',
        order_num: alb.order_num || 0,
        is_active: alb.is_active ? 1 : 0,
        photos: (alb.photos || []).map((p) => ({
          image_url: p.image_url,
          caption: p.caption || '',
        })),
      });
    }
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setIsAlbumModalOpen(true);
  };

  const handleAddPhotoToBatch = (url: string) => {
    if (!url) return;
    setAlbumForm((prev) => ({
      ...prev,
      cover_image_url: prev.cover_image_url || url, // If no cover, set first photo as cover
      photos: [...prev.photos, { image_url: url, caption: newPhotoCaption }],
    }));
    setNewPhotoUrl('');
    setNewPhotoCaption('');
  };

  const handleRemovePhotoFromBatch = (index: number) => {
    setAlbumForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumForm.title.trim()) {
      alert('Por favor ingrese el título del álbum.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingAlbum) {
        await adminApi.updateAlbum(editingAlbum.id, albumForm);
      } else {
        await adminApi.createAlbum(albumForm);
      }
      setIsAlbumModalOpen(false);
      fetchAlbums();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar el álbum de fotos.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAlbum = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este grupo de fotos y todas sus imágenes?')) return;
    try {
      await adminApi.deleteAlbum(id);
      fetchAlbums();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar el álbum');
    }
  };

  const filteredAlbums = albums.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      (a.description && a.description.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(albums.map((a) => a.category).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <h1 className="font-serif font-bold text-2xl text-cicha-navy flex items-center gap-2.5">
            <Images className="w-6 h-6 text-blue-600" />
            Galería de Fotos & Álbumes
          </h1>
          <p className="text-xs text-slate-500">
            Administre álbumes, eventos institucionales, visitas diplomáticas y rondas de negocios en fotos.
          </p>
        </div>

        <button
          onClick={handleOpenCreateAlbum}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Nuevo Álbum de Fotos
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
            placeholder="Buscar por título, categoría o evento..."
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
            Todos ({albums.length})
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

      {/* Albums Grid */}
      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader size="lg" />
        </div>
      ) : filteredAlbums.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <Images className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-serif font-bold text-base text-slate-700">No se encontraron álbumes de fotos</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search || selectedCategory !== 'all'
              ? 'No hay álbumes que coincidan con la búsqueda.'
              : 'Comience creando el primer álbum de fotos para la galería fotográfica.'}
          </p>
          <button
            onClick={handleOpenCreateAlbum}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
          >
            <Plus className="w-4 h-4" /> Crear Primer Álbum
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((alb) => (
            <div
              key={alb.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                {/* Cover Image */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  {alb.cover_image_url ? (
                    <img
                      src={alb.cover_image_url}
                      alt={alb.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                      <Camera className="w-12 h-12" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-cicha-navy backdrop-blur-sm shadow-sm">
                      {alb.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-black/75 text-white backdrop-blur-sm flex items-center gap-1 shadow-md">
                      <Camera className="w-3.5 h-3.5 text-cicha-sky" />
                      {alb.photos_count || (alb.photos ? alb.photos.length : 0)} fotos
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{alb.event_date ? new Date(alb.event_date).toLocaleDateString('es-AR') : 'Sin fecha'}</span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-cicha-navy line-clamp-2 leading-snug">
                    {alb.title}
                  </h3>

                  {alb.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {alb.description}
                    </p>
                  )}

                  {/* Thumbnail mini preview of photos */}
                  {alb.photos && alb.photos.length > 0 && (
                    <div className="pt-2 flex items-center gap-1.5 overflow-hidden">
                      {alb.photos.slice(0, 5).map((p, pIdx) => (
                        <div key={pIdx} className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                          <img src={p.image_url} alt="Miniatura" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {alb.photos.length > 5 && (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
                          +{alb.photos.length - 5}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`/galeria`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-blue-600"
                >
                  <Eye className="w-3.5 h-3.5" /> Ver en Portal
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditAlbum(alb)}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                    title="Editar Álbum y Fotos"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAlbum(alb.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Eliminar Álbum"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Creación / Edición de Álbum con Fotos */}
      <Modal
        isOpen={isAlbumModalOpen}
        onClose={() => setIsAlbumModalOpen(false)}
        title={editingAlbum ? 'Editar Álbum y Gestión de Fotos' : 'Crear Nuevo Álbum de Fotos'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmitAlbum} className="space-y-5 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Título del Grupo / Evento *</label>
            <input
              type="text"
              required
              value={albumForm.title}
              onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
              placeholder="Ej. Foro Económico Bilateral Heleno-Argentino 2026"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Categoría *</label>
              <input
                type="text"
                required
                value={albumForm.category}
                onChange={(e) => setAlbumForm({ ...albumForm, category: e.target.value })}
                placeholder="Ej. Institucional, Visitas, Rondas de Negocios"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Fecha del Evento</label>
              <input
                type="date"
                value={albumForm.event_date}
                onChange={(e) => setAlbumForm({ ...albumForm, event_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Descripción / Contexto del Álbum</label>
            <textarea
              rows={3}
              value={albumForm.description}
              onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
              placeholder="Detalles sobre las autoridades presentes, temáticas tratadas y marco del encuentro..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <ImageUploader
              label="Foto de Portada Principal del Álbum"
              value={albumForm.cover_image_url}
              onChange={(url) => setAlbumForm({ ...albumForm, cover_image_url: url })}
              helperText="Imagen representativa que se mostrará en la tarjeta del álbum."
              previewHeight="h-32"
              aspectRatio="video"
            />
          </div>

          {/* Batch Photo Uploader */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-blue-600" />
                Fotografías del Álbum ({albumForm.photos.length})
              </h4>
              <span className="text-[11px] text-slate-500">Suba imágenes para este grupo</span>
            </div>

            {/* Upload One More Photo to Batch */}
            <div className="space-y-3">
              <ImageUploader
                label="Agregar Fotografía al Álbum"
                value={newPhotoUrl}
                onChange={(url) => {
                  setNewPhotoUrl(url);
                  handleAddPhotoToBatch(url);
                }}
                helperText="Seleccione o arrastre una imagen para agregarla directamente a la lista."
                previewHeight="h-24"
                aspectRatio="video"
              />
            </div>

            {/* List of current photos in album */}
            {albumForm.photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {albumForm.photos.map((p, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 bg-white group h-24 shadow-sm">
                    <img src={p.image_url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhotoFromBatch(idx)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 shadow-md transition-opacity"
                      title="Quitar foto"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {albumForm.cover_image_url === p.image_url && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold">
                        Portada
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAlbumModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
            >
              {submitting ? 'Guardando...' : editingAlbum ? 'Actualizar Álbum' : 'Publicar Álbum'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
