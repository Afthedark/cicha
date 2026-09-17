import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Edit2, Trash2, MapPin, Clock, ExternalLink, Images, Image as ImageIcon } from 'lucide-react';
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
    organizer: 'CICHA / Red EEN',
    is_featured: 0,
    status: 'upcoming' as 'upcoming' | 'completed' | 'cancelled',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchAlbums();
  }, []);

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

  const fetchAlbums = () => {
    adminApi
      .getAlbums()
      .then((res) => {
        setAlbums(res || []);
      })
      .catch((err) => console.error('Error loading albums:', err));
  };

  const handleOpenCreate = () => {
    setEditingEvent(null);
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
      organizer: 'CICHA / Red EEN',
      is_featured: 0,
      status: 'upcoming',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: EventItem) => {
    setEditingEvent(event);
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
      organizer: event.organizer || 'CICHA / Red EEN',
      is_featured: event.is_featured ? 1 : 0,
      status: event.status || 'upcoming',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        album_id: formData.album_id ? Number(formData.album_id) : null,
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-xl text-cicha-navy">Agenda de Eventos y Encuentros</h1>
          <p className="text-xs text-slate-500 mt-0.5">Gestión de foros, webinars, links a redes sociales y galerías fotográficas de eventos.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nuevo Evento
        </button>
      </div>

      {loading ? (
        <Loader text="Cargando agenda..." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Evento / Foto</th>
                  <th className="py-3.5 px-4">Fecha y Hora</th>
                  <th className="py-3.5 px-4">Modalidad</th>
                  <th className="py-3.5 px-4">Link Evento & Galería</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-12 rounded-xl bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                          {ev.image_url ? (
                            <img src={resolveImageUrl(ev.image_url)} alt={ev.title} className="w-full h-full object-cover" />
                          ) : (
                            <Calendar className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 leading-snug">{ev.title}</div>
                          <div className="text-[11px] text-slate-500">{ev.organizer}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {new Date(ev.event_date).toLocaleString('es-AR')}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="primary" className="capitalize">
                        {ev.location_type}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {ev.registration_url ? (
                          <a
                            href={ev.registration_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" /> Link Evento
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Sin link</span>
                        )}

                        {ev.album_title && (
                          <div className="flex items-center gap-1 text-[11px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                            <Images className="w-3 h-3 text-indigo-600" />
                            <span className="truncate max-w-[140px]">{ev.album_title}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={ev.status === 'upcoming' ? 'warning' : 'secondary'}>
                        {ev.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(ev)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                          title="Editar evento"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ev.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Eliminar evento"
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

      {/* Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Título del Evento *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-blue-500"
              placeholder="Ej: Foro Empresarial Grecia - Cono Sur 2026"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Modalidad</label>
              <select
                value={formData.location_type}
                onChange={(e) => setFormData({ ...formData, location_type: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Lugar / Dirección / Plataforma</label>
              <input
                type="text"
                value={formData.location_address}
                onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                placeholder="Ej. Sede Eurocámara / Zoom"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Link Evento (Red Social / Web)</label>
              <input
                type="url"
                value={formData.registration_url}
                onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })}
                placeholder="https://instagram.com/..., https://linkedin.com/... o web"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* 1 Foto Principal del Evento */}
          <div className="space-y-1.5">
            <ImageUploader
              label="1 Foto Principal del Evento"
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              helperText="Imagen destacada del evento (JPG, PNG, WEBP)"
              previewHeight="h-40"
            />
          </div>

          {/* Grupo de Galería de Fotos Asociado */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center gap-1.5">
              <Images className="w-4 h-4 text-indigo-600" />
              <span>Grupo de Galería de Fotos Asociado (Opcional)</span>
            </label>
            <select
              value={formData.album_id}
              onChange={(e) => setFormData({ ...formData, album_id: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
            >
              <option value="">-- Ninguna galería asociada --</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title} ({album.category} - {album.event_date})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">
              Si seleccionas un álbum de la galería, se habilitará un botón público para que los visitantes puedan ver todas las fotos del evento.
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
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
