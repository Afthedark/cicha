import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Edit2, Trash2, MapPin, Clock, ExternalLink, Images, Image as ImageIcon, Search, X, Check, Sparkles } from 'lucide-react';
import { adminApi, resolveImageUrl } from '../../services/api';
import type { EventItem, PhotoAlbum } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [albums, setAlbums] = useState<PhotoAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Backend Album Search State
  const [albumSearchQuery, setAlbumSearchQuery] = useState('');
  const [loadingAlbums, setLoadingAlbums] = useState(false);
  const [isAlbumDropdownOpen, setIsAlbumDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    category_id: 3,
    album_id: '' as string | number,
    title: '',
    description: '',
    event_date: new Date().toISOString().slice(0, 16),
    end_date: '',
    location_type: 'presencial' as 'presencial' | 'virtual' | 'hibrido',
    location_address: '',
    registration_url: '',
    image_url: '',
    secondary_image_url: '',
    organizer: 'CICHA / Red EEN',
    is_featured: 0,
    status: 'upcoming' as 'upcoming' | 'completed' | 'cancelled',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchAlbums();
  }, []);

  // Debounced backend search for photo albums
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAlbums(albumSearchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [albumSearchQuery]);

  const fetchEvents = () => {
    setLoading(true);
    adminApi
      .getEvents()
      .then((res) => {
        setEvents(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchAlbums = (search?: string) => {
    setLoadingAlbums(true);
    adminApi
      .getAlbums(search)
      .then((res) => {
        setAlbums(res || []);
      })
      .catch((err) => console.error('Error loading albums:', err))
      .finally(() => setLoadingAlbums(false));
  };

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setAlbumSearchQuery('');
    setIsAlbumDropdownOpen(false);
    setFormData({
      category_id: 3,
      album_id: '',
      title: '',
      description: '',
      event_date: new Date().toISOString().slice(0, 16),
      end_date: '',
      location_type: 'presencial',
      location_address: '',
      registration_url: '',
      image_url: '',
      secondary_image_url: '',
      organizer: 'CICHA / Red EEN',
      is_featured: 0,
      status: 'upcoming',
    });
    fetchAlbums();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: EventItem) => {
    setEditingEvent(event);
    setAlbumSearchQuery('');
    setIsAlbumDropdownOpen(false);

    let secImage = '';
    if (event.gallery_images) {
      if (Array.isArray(event.gallery_images) && event.gallery_images.length > 0) {
        secImage = event.gallery_images[0] || '';
      } else if (typeof event.gallery_images === 'string') {
        try {
          const dec = JSON.parse(event.gallery_images);
          secImage = Array.isArray(dec) && dec.length > 0 ? dec[0] : event.gallery_images;
        } catch {
          secImage = event.gallery_images;
        }
      }
    }

    setFormData({
      category_id: event.category_id || 3,
      album_id: event.album_id || '',
      title: event.title,
      description: event.description,
      event_date: event.event_date ? event.event_date.replace(' ', 'T').slice(0, 16) : '',
      end_date: event.end_date ? event.end_date.replace(' ', 'T').slice(0, 16) : '',
      location_type: event.location_type || 'presencial',
      location_address: event.location_address || '',
      registration_url: event.registration_url || '',
      image_url: event.image_url || '',
      secondary_image_url: secImage,
      organizer: event.organizer || 'CICHA / Red EEN',
      is_featured: event.is_featured ? 1 : 0,
      status: event.status || 'upcoming',
    });
    fetchAlbums();
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        album_id: formData.album_id ? Number(formData.album_id) : null,
        gallery_images: formData.secondary_image_url ? [formData.secondary_image_url] : [],
      };

      if (editingEvent) {
        await adminApi.updateEvent(editingEvent.id, payload);
      } else {
        await adminApi.createEvent(payload);
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      alert('Error al guardar el evento.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Desea eliminar este evento?')) return;
    try {
      await adminApi.deleteEvent(id);
      fetchEvents();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  // Find currently selected album details
  const selectedAlbum = albums.find((a) => String(a.id) === String(formData.album_id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-xl text-cicha-navy">Agenda de Eventos y Encuentros</h1>
          <p className="text-xs text-slate-500">Gestione foros, webinars, rondas de negocios y encuentros bilaterales</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nuevo Evento
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader size="lg" />
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-600 text-sm font-semibold">No hay eventos registrados</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Fotos / Evento</th>
                  <th className="p-4">Modalidad & Lugar</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Link Evento</th>
                  <th className="p-4">Galería Asociada</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((event) => {
                  const eventDate = new Date(event.event_date);
                  let secImg = '';
                  if (event.gallery_images) {
                    if (Array.isArray(event.gallery_images) && event.gallery_images.length > 0) {
                      secImg = event.gallery_images[0];
                    } else if (typeof event.gallery_images === 'string') {
                      try {
                        const d = JSON.parse(event.gallery_images);
                        secImg = Array.isArray(d) && d.length > 0 ? d[0] : event.gallery_images;
                      } catch {
                        secImg = event.gallery_images;
                      }
                    }
                  }

                  return (
                    <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center -space-x-2 shrink-0">
                            {event.image_url ? (
                              <img
                                src={resolveImageUrl(event.image_url)}
                                alt={event.title}
                                className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-xs"
                                title="Foto 1 (Principal)"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                                <ImageIcon className="w-4 h-4" />
                              </div>
                            )}
                            {secImg && (
                              <img
                                src={resolveImageUrl(secImg)}
                                alt="Foto 2"
                                className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-xs"
                                title="Foto 2 (Secundaria)"
                              />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block text-sm">{event.title}</span>
                            <span className="text-[11px] text-slate-400">{event.organizer}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="capitalize font-semibold text-slate-700 block">{event.location_type}</span>
                        <span className="text-[11px] text-slate-400">{event.location_address || 'Sin dirección física'}</span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 block">
                          {eventDate.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {eventDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
                        </span>
                      </td>
                      <td className="p-4">
                        {event.registration_url ? (
                          <a
                            href={event.registration_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-bold border border-blue-200 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Link Evento</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">Sin link</span>
                        )}
                      </td>
                      <td className="p-4">
                        {event.album_title ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-200">
                            <Images className="w-3 h-3 text-indigo-600" />
                            <span className="max-w-[120px] truncate">{event.album_title}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">Sin galería</span>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            event.status === 'upcoming'
                              ? 'success'
                              : event.status === 'completed'
                              ? 'secondary'
                              : 'danger'
                          }
                        >
                          {event.status === 'upcoming'
                            ? 'Próximo'
                            : event.status === 'completed'
                            ? 'Realizado'
                            : 'Cancelado'}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(event)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Crear / Editar Evento */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Título del Evento *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              placeholder="Ej. Foro Empresarial Heleno-Argentino 2026"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Fecha y Hora de Inicio *</label>
              <input
                type="datetime-local"
                required
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Fecha y Hora de Finalización</label>
              <input
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Modalidad</label>
              <select
                value={formData.location_type}
                onChange={(e) => setFormData({ ...formData, location_type: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs cursor-pointer"
              >
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual / Webinar</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Ubicación / Plataforma</label>
              <input
                type="text"
                value={formData.location_address}
                onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                placeholder="Ej. Sede CICHA / Zoom Meetings"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>Link Evento (Red Social / Web)</span>
            </label>
            <input
              type="url"
              value={formData.registration_url}
              onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              placeholder="Ej. https://instagram.com/p/... o https://linkedin.com/... o https://evento.com"
            />
            <p className="text-[11px] text-slate-400">
              Pegue el enlace directo a la publicación de la red social o al sitio oficial del evento.
            </p>
          </div>

          {/* 2 Fotos para Portada del Evento */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div>
              <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>Fotos de Portada del Evento (Máximo 2 Fotos)</span>
              </label>
              <p className="text-[11px] text-slate-500">
                Cargue la foto principal (Portada 1) y opcionalmente una segunda imagen o flyer complementario (Portada 2).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <ImageUploader
                  label="Foto 1 (Portada Principal) *"
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  helperText="Flyer principal o imagen representativa (JPG, PNG, WEBP)"
                  previewHeight="h-36"
                />
              </div>

              <div className="space-y-1.5">
                <ImageUploader
                  label="Foto 2 (Portada / Flyer Secundario)"
                  value={formData.secondary_image_url}
                  onChange={(url) => setFormData({ ...formData, secondary_image_url: url })}
                  helperText="Segunda imagen complementaria opcional (JPG, PNG, WEBP)"
                  previewHeight="h-36"
                />
              </div>
            </div>
          </div>

          {/* Grupo de Galería de Fotos Asociado con Búsqueda a Nivel Backend */}
          <div className="space-y-2 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Images className="w-4 h-4 text-indigo-600" />
                <span>Grupo de Galería de Fotos Asociado (Opcional)</span>
              </label>
              {formData.album_id && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, album_id: '' }))}
                  className="text-rose-600 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Quitar vínculo</span>
                </button>
              )}
            </div>

            {/* Álbum seleccionado actualmente */}
            {selectedAlbum && (
              <div className="p-3 bg-white rounded-xl border border-indigo-200 shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {selectedAlbum.cover_image_url ? (
                    <img
                      src={resolveImageUrl(selectedAlbum.cover_image_url)}
                      alt={selectedAlbum.title}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-400 border border-indigo-100 shrink-0">
                      <Images className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-800">
                        {selectedAlbum.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {selectedAlbum.event_date ? new Date(selectedAlbum.event_date).toLocaleDateString('es-AR') : ''}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs truncate mt-0.5">{selectedAlbum.title}</p>
                    <p className="text-[10px] text-slate-500">
                      {selectedAlbum.photos_count || (selectedAlbum.photos ? selectedAlbum.photos.length : 0)} fotos disponibles
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 shrink-0 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Vinculado</span>
                </span>
              </div>
            )}

            {/* Buscador a nivel backend de álbumes */}
            <div className="space-y-1.5 pt-1">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={albumSearchQuery}
                  onChange={(e) => {
                    setAlbumSearchQuery(e.target.value);
                    setIsAlbumDropdownOpen(true);
                  }}
                  onFocus={() => setIsAlbumDropdownOpen(true)}
                  placeholder="Buscar galería por título o categoría (búsqueda en backend)..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-hidden focus:border-indigo-500"
                />
                {albumSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setAlbumSearchQuery('');
                      fetchAlbums();
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Lista de resultados del backend */}
              {isAlbumDropdownOpen && (
                <div className="max-h-48 overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-lg divide-y divide-slate-100 p-1">
                  {loadingAlbums ? (
                    <div className="py-4 text-center text-slate-400 text-xs">
                      Buscando álbumes en el servidor...
                    </div>
                  ) : albums.length === 0 ? (
                    <div className="py-4 text-center text-slate-400 text-xs italic">
                      No se encontraron álbumes que coincidan con "{albumSearchQuery}".
                    </div>
                  ) : (
                    <>
                      <div
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, album_id: '' }));
                          setIsAlbumDropdownOpen(false);
                        }}
                        className={`p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between text-slate-600 ${
                          !formData.album_id ? 'bg-indigo-50 text-indigo-900 font-bold' : ''
                        }`}
                      >
                        <span>-- Ninguna galería asociada --</span>
                        {!formData.album_id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </div>

                      {albums.map((album) => {
                        const isSelected = String(formData.album_id) === String(album.id);
                        return (
                          <div
                            key={album.id}
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, album_id: album.id }));
                              setIsAlbumDropdownOpen(false);
                            }}
                            className={`p-2 rounded-lg hover:bg-indigo-50/60 cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                              isSelected ? 'bg-indigo-50 border border-indigo-200' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {album.cover_image_url ? (
                                <img
                                  src={resolveImageUrl(album.cover_image_url)}
                                  alt={album.title}
                                  className="w-9 h-9 rounded-md object-cover border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                  <Images className="w-4 h-4" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-bold text-slate-800 text-xs truncate">{album.title}</p>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                  <span>{album.category}</span>
                                  <span>•</span>
                                  <span>{album.photos_count || (album.photos ? album.photos.length : 0)} fotos</span>
                                </div>
                              </div>
                            </div>

                            {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-500">
              Al asociar un álbum, los visitantes podrán pulsar <strong>"Ver Galería de Fotos"</strong> en la web para explorar las fotografías del evento.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Descripción del Evento</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              placeholder="Detalles sobre los expositores, agenda temática y objetivos del encuentro..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Organizador</label>
              <input
                type="text"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Estado</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer"
              >
                <option value="upcoming">Próximo (Convocatoria Abierta)</option>
                <option value="completed">Realizado / Concluido</option>
                <option value="cancelled">Cancelado</option>
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
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : 'Guardar Evento'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
