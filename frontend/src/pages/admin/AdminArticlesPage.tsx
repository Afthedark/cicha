import React, { useEffect, useState } from 'react';
import {
  Newspaper,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Clock,
  MapPin,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { Article, EventItem } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminArticlesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'articles' | 'events'>('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Article Modal
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    category_id: 1,
    summary: '',
    content: '',
    image_url: '',
    author: 'Comisión de Prensa CICHA',
    published_at: new Date().toISOString().slice(0, 10),
    is_featured: 0,
    status: 'published' as 'published' | 'draft',
  });

  // Event Modal
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: new Date().toISOString().slice(0, 16),
    location_type: 'presencial' as any,
    location_address: '',
    registration_url: '',
    organizer: 'CICHA / Red EEN',
    status: 'upcoming' as any,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([adminApi.getArticles(), adminApi.getEvents()])
      .then(([arts, evts]) => {
        setArticles(arts || []);
        setEvents(evts || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // Article Handlers
  const handleOpenCreateArticle = () => {
    setEditingArticle(null);
    setArticleForm({
      title: '',
      category_id: 1,
      summary: '',
      content: '',
      image_url: '',
      author: 'Comisión de Prensa CICHA',
      published_at: new Date().toISOString().slice(0, 10),
      is_featured: 0,
      status: 'published',
    });
    setIsArticleModalOpen(true);
  };

  const handleOpenEditArticle = (art: Article) => {
    setEditingArticle(art);
    setArticleForm({
      title: art.title,
      category_id: art.category_id || 1,
      summary: art.summary || '',
      content: art.content,
      image_url: art.image_url || '',
      author: art.author || 'CICHA',
      published_at: art.published_at || new Date().toISOString().slice(0, 10),
      is_featured: art.is_featured ? 1 : 0,
      status: art.status || 'published',
    });
    setIsArticleModalOpen(true);
  };

  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingArticle) {
        await adminApi.updateArticle(editingArticle.id, articleForm);
      } else {
        await adminApi.createArticle(articleForm);
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

  // Event Handlers
  const handleOpenCreateEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      event_date: new Date().toISOString().slice(0, 16),
      location_type: 'presencial',
      location_address: '',
      registration_url: '',
      organizer: 'CICHA / Red EEN',
      status: 'upcoming',
    });
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (evt: EventItem) => {
    setEditingEvent(evt);
    setEventForm({
      title: evt.title,
      description: evt.description,
      event_date: evt.event_date ? evt.event_date.replace(' ', 'T').slice(0, 16) : '',
      location_type: evt.location_type || 'presencial',
      location_address: evt.location_address || '',
      registration_url: evt.registration_url || '',
      organizer: evt.organizer || 'CICHA',
      status: evt.status || 'upcoming',
    });
    setIsEventModalOpen(true);
  };

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingEvent) {
        await adminApi.updateEvent(editingEvent.id, eventForm);
      } else {
        await adminApi.createEvent(eventForm);
      }
      setIsEventModalOpen(false);
      fetchData();
    } catch {
      alert('Error al guardar evento.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!window.confirm('¿Desea eliminar este evento?')) return;
    try {
      await adminApi.deleteEvent(id);
      fetchData();
    } catch {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-xl text-cicha-navy">Prensa & Agenda de Eventos</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Publicación y administración de comunicados, noticias del sector bilateral y agenda de encuentros.
          </p>
        </div>

        <button
          onClick={activeTab === 'articles' ? handleOpenCreateArticle : handleOpenCreateEvent}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'articles' ? 'Nueva Noticia' : 'Nuevo Evento'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('articles')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'articles'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          Noticias & Prensa ({articles.length})
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'events'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Agenda de Eventos ({events.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <Loader text="Cargando publicaciones..." />
      ) : activeTab === 'articles' ? (
        /* Articles Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Título</th>
                  <th className="py-3.5 px-4">Fecha</th>
                  <th className="py-3.5 px-4">Autor</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((art) => (
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
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditArticle(art)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(art.id)}
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
      ) : (
        /* Events Table */
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
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                          {ev.image_url ? (
                            <img src={ev.image_url} alt={ev.title} className="w-full h-full object-cover" />
                          ) : (
                            <Calendar className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{ev.title}</div>
                          <div className="text-[11px] text-slate-500">{ev.organizer}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {new Date(ev.event_date).toLocaleString('es-AR')}
                    </td>
                    <td className="py-3.5 px-4 capitalize">
                      <Badge variant="primary">{ev.location_type}</Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={ev.status === 'upcoming' ? 'warning' : 'secondary'}>
                        {ev.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditEvent(ev)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
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

      {/* Article Modal */}
      <Modal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        title={editingArticle ? 'Editar Noticia' : 'Nueva Noticia'}
        maxWidth="xl"
      >
        <form onSubmit={handleSubmitArticle} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Título de la Noticia *</label>
            <input
              type="text"
              required
              value={articleForm.title}
              onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Resumen Breve</label>
            <textarea
              rows={2}
              value={articleForm.summary}
              onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          {/* Article Cover Image Uploader */}
          <ImageUploader
            label="Foto de Portada de la Noticia"
            value={articleForm.image_url}
            onChange={(url) => setArticleForm({ ...articleForm, image_url: url })}
            helperText="Se guardará en /backend/public/uploads/ (JPG, PNG, WEBP)"
            previewHeight="h-44"
          />

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Cuerpo del Artículo *</label>
            <textarea
              rows={6}
              required
              value={articleForm.content}
              onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsArticleModalOpen(false)}
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

      {/* Event Modal */}
      <Modal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        title={editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitEvent} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Título del Evento *</label>
            <input
              type="text"
              required
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          {/* Event Banner Image Uploader */}
          <ImageUploader
            label="Flyer / Banner del Evento"
            value={eventForm.location_address.startsWith('http') ? '' : ''}
            onChange={(url) => setEventForm({ ...eventForm, description: eventForm.description })}
            helperText="Banner promocional para la agenda pública"
            previewHeight="h-36"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Fecha y Hora *</label>
              <input
                type="datetime-local"
                required
                value={eventForm.event_date}
                onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Modalidad</label>
              <select
                value={eventForm.location_type}
                onChange={(e) => setEventForm({ ...eventForm, location_type: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Lugar / Enlace</label>
            <input
              type="text"
              value={eventForm.location_address}
              onChange={(e) => setEventForm({ ...eventForm, location_address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEventModalOpen(false)}
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
