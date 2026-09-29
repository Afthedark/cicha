import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Users,
  Building,
  Images,
  Camera,
  X,
  Sparkles,
} from 'lucide-react';
import { publicApi, resolveImageUrl } from '../../services/api';
import type { EventItem } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { EventCalendar } from '../../components/common/EventCalendar';
import bgHeader from '../../assets/static/8.jpeg';
import logoSinTexto from '../../assets/images/logo_sin_texto.png';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);
  const [emptyMessage, setEmptyMessage] = useState('En este momento estamos trabajando para los próximos eventos');
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = () => {
    setLoading(true);
    publicApi
      .getEventsWithMeta(filter)
      .then((res) => {
        setEvents(res.events || []);
        if (res.empty_message) {
          setEmptyMessage(res.empty_message);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Banner */}
      <section className="relative overflow-hidden bg-cicha-navy-deep text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-cicha-sky shadow-xl text-center">
        {/* Background Static Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgHeader}
            alt="Eventos y Foros CICHA"
            className="w-full h-full object-cover object-center transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071E38]/95 via-[#005EAF]/80 to-[#071E38]/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071E38]/90 via-transparent to-black/30" />
        </div>

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <Badge variant="gold">Agenda & Networking</Badge>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight drop-shadow-md">
            Eventos, Rondas de Negocios y Foros
          </h1>
          <p className="text-slate-200 text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed drop-shadow">
            Actividades conjuntas con EUROCAMARA Argentina, la Unión Europea (Red EEN) y conferencias bilaterales.
          </p>
        </div>
      </section>

      {/* Main Events Section: Left List & Right Blue Calendar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Events List & Filters (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Filter Buttons */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-cicha-navy">
                {filter === 'upcoming' ? 'Próximos Encuentros' : 'Encuentros Anteriores'}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('upcoming')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filter === 'upcoming'
                      ? 'bg-cicha-navy text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Próximos
                </button>
                <button
                  onClick={() => setFilter('past')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filter === 'past'
                      ? 'bg-cicha-navy text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Anteriores
                </button>
              </div>
            </div>

            {loading ? (
              <Loader text="Cargando agenda de eventos..." />
            ) : events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => {
                  const eventDate = new Date(event.event_date);
                  let parsedGallery: string[] = [];
                  if (event.gallery_images) {
                    if (Array.isArray(event.gallery_images)) {
                      parsedGallery = event.gallery_images;
                    } else if (typeof event.gallery_images === 'string') {
                      try {
                        const d = JSON.parse(event.gallery_images);
                        parsedGallery = Array.isArray(d) ? d : [event.gallery_images];
                      } catch {
                        parsedGallery = [event.gallery_images];
                      }
                    }
                  }

                  return (
                    <div
                      key={event.id}
                      className="bg-gradient-to-b from-[#0E2E54] to-[#081C33] text-white rounded-3xl p-6 sm:p-7 border border-blue-800/80 shadow-2xl backdrop-blur-xl hover:border-sky-500/60 transition-all flex flex-col sm:flex-row gap-5 items-start justify-between group relative overflow-hidden"
                    >
                      {/* Glow decorativo sutil en hover */}
                      <div className="absolute -top-20 -right-20 w-48 h-48 bg-cicha-sky/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cicha-sky/20 transition-all" />

                      <div className="flex flex-col sm:flex-row gap-4 items-start flex-1 w-full relative z-10">
                        {/* Date Block */}
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#004b87] to-sky-600 text-white flex flex-col items-center justify-center shrink-0 border-2 border-amber-400 shadow-md">
                          <span className="font-serif font-extrabold text-xl text-white leading-none">
                            {eventDate.getDate()}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-amber-300 mt-0.5">
                            {eventDate.toLocaleString('es-AR', { month: 'short' })}
                          </span>
                          <span className="text-[9px] text-sky-200">{eventDate.getFullYear()}</span>
                        </div>

                        <div className="space-y-2.5 flex-1 w-full">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-400/30 capitalize">
                              {event.location_type}
                            </span>
                            {event.organizer && (
                              <span className="text-[11px] text-slate-300 font-medium">
                                Org: {event.organizer}
                              </span>
                            )}
                          </div>

                          <h3 className="font-serif font-bold text-base sm:text-lg text-white group-hover:text-sky-300 transition-colors leading-snug">
                            {event.title}
                          </h3>

                          {/* Event Photos: 1 or 2 Cover Photos */}
                          {(event.image_url || parsedGallery.length > 0) && (
                            <div className="my-3">
                              {event.image_url && parsedGallery.length > 0 ? (
                                /* 2 Photos: Grid de 2 columnas */
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div
                                    onClick={() => setSelectedPhotoModal(resolveImageUrl(event.image_url))}
                                    className="h-44 sm:h-52 rounded-2xl overflow-hidden border border-white/15 shadow-md bg-slate-950 cursor-pointer group/img relative"
                                  >
                                    <img
                                      src={resolveImageUrl(event.image_url)}
                                      alt={`${event.title} - Portada 1`}
                                      className="w-full h-full object-cover group-hover/img:scale-103 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/70 text-white text-[9px] font-bold backdrop-blur-xs">
                                      Foto 1
                                    </div>
                                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/70 text-white text-[9px] font-bold backdrop-blur-xs flex items-center gap-1 opacity-0 group-hover/img:opacity-100 transition-opacity">
                                      <Camera className="w-3 h-3 text-amber-400" />
                                      <span>Ampliar</span>
                                    </div>
                                  </div>

                                  <div
                                    onClick={() => setSelectedPhotoModal(resolveImageUrl(parsedGallery[0]))}
                                    className="h-44 sm:h-52 rounded-2xl overflow-hidden border border-white/15 shadow-md bg-slate-950 cursor-pointer group/img relative"
                                  >
                                    <img
                                      src={resolveImageUrl(parsedGallery[0])}
                                      alt={`${event.title} - Portada 2`}
                                      className="w-full h-full object-cover group-hover/img:scale-103 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/70 text-white text-[9px] font-bold backdrop-blur-xs">
                                      Foto 2
                                    </div>
                                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/70 text-white text-[9px] font-bold backdrop-blur-xs flex items-center gap-1 opacity-0 group-hover/img:opacity-100 transition-opacity">
                                      <Camera className="w-3 h-3 text-amber-400" />
                                      <span>Ampliar</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                /* 1 Photo: Full width card */
                                <div
                                  onClick={() => setSelectedPhotoModal(resolveImageUrl(event.image_url || parsedGallery[0]))}
                                  className="w-full h-44 sm:h-56 rounded-2xl overflow-hidden border border-white/15 shadow-md bg-slate-950 cursor-pointer group/img relative"
                                >
                                  <img
                                    src={resolveImageUrl(event.image_url || parsedGallery[0])}
                                    alt={event.title}
                                    className="w-full h-full object-cover group-hover/img:scale-102 transition-transform duration-500"
                                  />
                                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-950/70 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1 opacity-0 group-hover/img:opacity-100 transition-opacity">
                                    <Camera className="w-3 h-3 text-amber-400" />
                                    <span>Ver foto ampliada</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                            {event.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-sky-400" />
                              {eventDate.toLocaleTimeString('es-AR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}{' '}
                              hs
                            </span>
                            {event.location_address && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                                {event.location_address}
                              </span>
                            )}
                          </div>

                          {/* Action Buttons: Link Evento & Ver Galería de Fotos */}
                          <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-white/10 mt-2">
                            {event.registration_url && (
                              <a
                                href={event.registration_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Link Evento</span>
                              </a>
                            )}

                            {event.album_id && (
                              <Link
                                to={event.album_slug ? `/galeria/${event.album_slug}` : `/galeria/${event.album_id}`}
                                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition-all flex items-center gap-1.5 backdrop-blur-xs"
                              >
                                <Images className="w-3.5 h-3.5 text-amber-400" />
                                <span>Ver Galería de Fotos {event.photos_count ? `(${event.photos_count})` : ''}</span>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-[#0E2E54] to-[#081C33] text-white border border-blue-800/80 shadow-2xl backdrop-blur-xl text-center space-y-6 relative overflow-hidden group">
                {/* Glow decorativo de fondo */}
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-cicha-sky/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

                {/* Contenedor Central Animado estilo "Cargando / Procesando" */}
                <div className="relative z-10 mx-auto w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center">
                  {/* Onda de Radar Expansiva */}
                  <div className="absolute inset-0 rounded-full border border-sky-400/30 animate-radar-wave pointer-events-none" />

                  {/* Anillo Orbital Exterior (Giro Lento) */}
                  <div className="absolute inset-1 rounded-full border-2 border-dashed border-sky-400/40 animate-spin-slow pointer-events-none" />

                  {/* Anillo de Carga Spinner Vibrante */}
                  <div className="absolute inset-2.5 rounded-full border-2 border-transparent border-t-cicha-sky border-r-sky-300 animate-spin pointer-events-none" />

                  {/* Anillo Reverso Sutil */}
                  <div className="absolute inset-4 rounded-full border border-transparent border-b-amber-400/60 border-l-amber-300/40 animate-spin-reverse-slow pointer-events-none" />

                  {/* Disco Central Iluminado para máxima nitidez y visibilidad del Isotipo */}
                  <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white shadow-[0_0_35px_rgba(0,174,239,0.5)] flex items-center justify-center p-3.5 sm:p-4 border-2 border-white/90">
                    <img
                      src={logoSinTexto}
                      alt="CICHA"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Mensaje Institucional */}
                <div className="space-y-3 relative z-10 max-w-lg mx-auto">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-cicha-sky-light text-xs font-bold border border-white/15 backdrop-blur-xs shadow-inner">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400"></span>
                    </span>
                    <span>Agenda en Planificación</span>
                    <Sparkles className="w-3.5 h-3.5 text-cicha-gold animate-pulse" />
                  </div>

                  <h3 className="font-serif font-bold text-lg sm:text-xl text-white leading-snug tracking-wide">
                    {emptyMessage}
                  </h3>

                  {/* Barra Animada de Progreso / Carga Continua */}
                  <div className="pt-2 flex flex-col items-center gap-2">
                    <div className="w-48 sm:w-64 h-1.5 bg-blue-950/90 rounded-full overflow-hidden border border-sky-500/30 relative">
                      <div className="w-24 h-full bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-loading-bar rounded-full" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-sky-300/80 font-medium">
                      <span>Preparando agenda</span>
                      <span className="inline-flex gap-0.5">
                        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                        <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                        <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Blue Dark EventCalendar (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <EventCalendar
              events={events}
              variant="dark"
              title="Calendario Mensual"
              subtitle="Explora y selecciona una fecha para ver el cronograma"
            />
          </div>
        </div>
      </section>

      {/* Lightbox / Modal de Foto Ampliada */}
      {selectedPhotoModal && (
        <div
          onClick={() => setSelectedPhotoModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
          >
            <button
              onClick={() => setSelectedPhotoModal(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedPhotoModal}
              alt="Fotografía ampliada del evento"
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
