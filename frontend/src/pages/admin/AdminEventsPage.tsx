import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Edit2, Trash2, MapPin, Clock } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { EventItem } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const [formData, setFormData] = useState({
    category_id: 3,
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

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData({
      category_id: 3,
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
      if (editingEvent) {
        await adminApi.updateEvent(editingEvent.id, formData);
      } else {
        await adminApi.createEvent(formData);
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
          <p className="text-xs text-slate-500 mt-0.5">Gestión de foros, webinars y rondas de negocios.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
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
                  <th className="py-3.5 px-4">Evento</th>
                  <th className="py-3.5 px-4">Fecha y Hora</th>
                  <th className="py-3.5 px-4">Modalidad</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{ev.title}</div>
                      <div className="text-[11px] text-slate-500">{ev.organizer}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {new Date(ev.event_date).toLocaleString('es-AR')}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="primary" className="capitalize">
                        {ev.location_type}
                      </Badge>
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
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ev.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
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
              <label className="font-bold text-slate-700">Enlace de Registro / Inscripción</label>
              <input
                type="url"
                value={formData.registration_url}
                onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Descripción del Evento</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
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
              {submitting ? 'Guardando...' : 'Guardar Evento'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
