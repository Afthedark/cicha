import React, { useEffect, useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Users,
  Building,
} from 'lucide-react';
import { publicApi } from '../../services/api';
import type { EventItem } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = () => {
    setLoading(true);
    publicApi
      .getEvents(filter)
      .then((res) => {
        setEvents(res || []);
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
      <section className="bg-gradient-to-br from-[#0B2545] via-[#071E38] to-[#040D1A] text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <Badge variant="gold">Agenda & Networking</Badge>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white">
            Eventos, Rondas de Negocios y Foros
          </h1>
          <p className="text-slate-300 text-sm sm:text-base font-light max-w-2xl mx-auto">
            Actividades conjuntas con EUROCAMARA Argentina, la Unión Europea (Red EEN) y conferencias bilaterales.
          </p>
        </div>
      </section>

      {/* Main Events List */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Toggle Filters */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <h2 className="font-serif font-bold text-2xl text-[#0B2545]">
            {filter === 'upcoming' ? 'Próximos Encuentros' : 'Eventos Realizados'}
          </h2>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'upcoming'
                  ? 'bg-[#0B2545] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Próximos
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'past'
                  ? 'bg-[#0B2545] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Anteriores
            </button>
          </div>
        </div>

        {loading ? (
          <Loader text="Cargando agenda de eventos..." />
        ) : events.length > 0 ? (
          <div className="space-y-6">
            {events.map((event) => {
              const eventDate = new Date(event.event_date);
              return (
                <div
                  key={event.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start justify-between group"
                >
                  <div className="flex flex-col sm:flex-row gap-6 items-start flex-1">
                    {/* Date Block */}
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0B2545] to-[#0D5EAF] text-white flex flex-col items-center justify-center shrink-0 border-2 border-amber-400 shadow-md">
                      <span className="font-serif font-extrabold text-2xl text-amber-300 leading-none">
                        {eventDate.getDate()}
                      </span>
                      <span className="text-xs uppercase font-bold text-slate-200 mt-1">
                        {eventDate.toLocaleString('es-AR', { month: 'short' })}
                      </span>
                      <span className="text-[10px] text-blue-200">{eventDate.getFullYear()}</span>
                    </div>

                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 capitalize">
                          {event.location_type}
                        </span>
                        {event.organizer && (
                          <span className="text-xs text-slate-500 font-medium">
                            Org: {event.organizer}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif font-bold text-lg sm:text-xl text-[#0B2545] group-hover:text-blue-700 transition-colors">
                        {event.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {eventDate.toLocaleTimeString('es-AR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          hs
                        </span>
                        {event.location_address && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            {event.location_address}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {event.registration_url && (
                    <div className="w-full md:w-auto shrink-0 pt-2 md:pt-0">
                      <a
                        href={event.registration_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all"
                      >
                        Inscribirme <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-2">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No hay eventos en esta sección.</p>
            <p className="text-xs text-slate-500">Pronto publicaremos nuevas fechas y foros.</p>
          </div>
        )}
      </section>
    </div>
  );
};
