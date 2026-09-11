import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ExternalLink,
  Users,
  Sparkles,
  Info,
} from 'lucide-react';
import type { EventItem } from '../../types';
import { publicApi } from '../../services/api';

interface EventCalendarProps {
  events?: EventItem[];
  variant?: 'dark' | 'light';
  compact?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
  onSelectEvent?: (event: EventItem) => void;
}

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const EventCalendar: React.FC<EventCalendarProps> = ({
  events: propEvents,
  variant = 'dark',
  compact = false,
  title = 'Calendario de Actividades y Eventos',
  subtitle = 'Explora nuestras conferencias, rondas de negocios y foros bilaterales',
  className = '',
  onSelectEvent,
}) => {
  const [events, setEvents] = useState<EventItem[]>(propEvents || []);
  const [loading, setLoading] = useState<boolean>(!propEvents);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDayEvents, setSelectedDayEvents] = useState<EventItem[] | null>(null);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  useEffect(() => {
    if (propEvents) {
      setEvents(propEvents);
      setLoading(false);
    } else {
      setLoading(true);
      publicApi
        .getEvents('all')
        .then((res) => {
          setEvents(res || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching calendar events:', err);
          setLoading(false);
        });
    }
  }, [propEvents]);

  // Helper para normalizar fecha YYYY-MM-DD
  const formatEventDateKey = (date: Date | string): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Mapear eventos por día
  const eventsByDate = React.useMemo(() => {
    const map: Record<string, EventItem[]> = {};
    events.forEach((ev) => {
      const key = formatEventDateKey(ev.event_date);
      if (key) {
        if (!map[key]) map[key] = [];
        map[key].push(ev);
      }
    });
    return map;
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navegación de mes
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Cálculo de días del mes
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // En JS: 0=Domingo, 1=Lunes, ... Queremos que la semana empiece en Lunes (0) a Domingo (6)
  let startingDay = firstDayOfMonth.getDay() - 1;
  if (startingDay === -1) startingDay = 6;

  const totalDays = lastDayOfMonth.getDate();

  // Días del mes previo para rellenar
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const daysArray: Array<{
    dayNumber: number;
    isCurrentMonth: boolean;
    dateKey: string;
    events: EventItem[];
  }> = [];

  // Días del mes anterior
  for (let i = startingDay - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    const prevDate = new Date(year, month - 1, d);
    const dateKey = formatEventDateKey(prevDate);
    daysArray.push({
      dayNumber: d,
      isCurrentMonth: false,
      dateKey,
      events: eventsByDate[dateKey] || [],
    });
  }

  // Días del mes actual
  for (let i = 1; i <= totalDays; i++) {
    const curDate = new Date(year, month, i);
    const dateKey = formatEventDateKey(curDate);
    daysArray.push({
      dayNumber: i,
      isCurrentMonth: true,
      dateKey,
      events: eventsByDate[dateKey] || [],
    });
  }

  // Días del mes siguiente para completar la cuadrícula (múltiplo de 7)
  const remaining = 7 - (daysArray.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      const dateKey = formatEventDateKey(nextDate);
      daysArray.push({
        dayNumber: i,
        isCurrentMonth: false,
        dateKey,
        events: eventsByDate[dateKey] || [],
      });
    }
  }

  const todayKey = formatEventDateKey(new Date());

  // Eventos del mes visible
  const currentMonthEvents = React.useMemo(() => {
    return events
      .filter((ev) => {
        const d = new Date(ev.event_date);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
  }, [events, year, month]);

  const handleDayClick = (dateKey: string, dayEvents: EventItem[]) => {
    if (dayEvents && dayEvents.length > 0) {
      setSelectedDayEvents(dayEvents);
      setSelectedDateStr(dateKey);
    } else {
      setSelectedDayEvents(null);
      setSelectedDateStr(null);
    }
  };

  const isDark = variant === 'dark';

  return (
    <div
      className={`rounded-3xl transition-all ${
        isDark
          ? 'bg-gradient-to-b from-[#0E2E54] to-[#081C33] text-white border border-blue-800/80 shadow-2xl backdrop-blur-xl'
          : 'bg-white text-slate-800 border border-slate-200 shadow-xl'
      } ${compact ? 'p-4 sm:p-5' : 'p-6 sm:p-8'} ${className}`}
    >
      {/* Header del Calendario */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
          compact ? 'pb-3 mb-3' : 'pb-6 mb-6'
        } border-b border-white/10`}
      >
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span
              className={`p-1.5 rounded-lg ${
                isDark
                  ? 'bg-cicha-sky/20 text-cicha-sky-light border border-cicha-sky/30'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              <CalendarIcon className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
            </span>
            <h3
              className={`font-serif font-bold ${
                compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'
              } ${isDark ? 'text-white' : 'text-cicha-navy'}`}
            >
              {title}
            </h3>
          </div>
          {subtitle && (
            <p
              className={`text-xs ${
                isDark ? 'text-slate-300' : 'text-slate-500'
              } font-light`}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Controles de Navegación del Mes */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={handleToday}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Hoy
          </button>
          <div
            className={`flex items-center gap-0.5 rounded-xl p-0.5 ${
              isDark ? 'bg-black/30 border border-white/10' : 'bg-slate-100'
            }`}
          >
            <button
              onClick={handlePrevMonth}
              className={`p-1 rounded-lg transition-colors ${
                isDark
                  ? 'hover:bg-white/10 text-slate-300 hover:text-white'
                  : 'hover:bg-white text-slate-600 hover:text-slate-900 shadow-2xs'
              }`}
              title="Mes Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span
              className={`font-serif font-bold text-xs sm:text-sm px-2 min-w-[110px] text-center ${
                isDark ? 'text-cicha-sky-light' : 'text-cicha-navy'
              }`}
            >
              {MONTH_NAMES[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className={`p-1 rounded-lg transition-colors ${
                isDark
                  ? 'hover:bg-white/10 text-slate-300 hover:text-white'
                  : 'hover:bg-white text-slate-600 hover:text-slate-900 shadow-2xs'
              }`}
              title="Mes Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid del Calendario */}
      <div className="space-y-3">
        {/* Nombres de los Días de la Semana */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAYS_OF_WEEK.map((day, idx) => (
            <div
              key={day}
              className={`text-center font-bold text-[10px] sm:text-xs py-0.5 uppercase tracking-wider ${
                idx >= 5
                  ? isDark
                    ? 'text-amber-400/80'
                    : 'text-amber-600'
                  : isDark
                  ? 'text-slate-400'
                  : 'text-slate-500'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Días del Mes */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {daysArray.map((cell, idx) => {
            const hasEvents = cell.events.length > 0;
            const isToday = cell.dateKey === todayKey;
            const isSelected = selectedDateStr === cell.dateKey;

            return (
              <button
                key={`${cell.dateKey}-${idx}`}
                onClick={() => handleDayClick(cell.dateKey, cell.events)}
                disabled={!hasEvents && !cell.isCurrentMonth}
                className={`${
                  compact ? 'min-h-[38px] sm:min-h-[44px]' : 'min-h-[58px] sm:min-h-[68px]'
                } rounded-xl p-1 sm:p-1.5 flex flex-col justify-between items-start transition-all relative group text-left border ${
                  !cell.isCurrentMonth
                    ? isDark
                      ? 'opacity-20 bg-transparent border-transparent'
                      : 'opacity-30 bg-slate-50/50 border-transparent'
                    : isSelected
                    ? isDark
                      ? 'bg-cicha-sky/25 border-cicha-sky shadow-md shadow-cicha-sky/20 ring-1 ring-cicha-sky/50'
                      : 'bg-blue-50 border-blue-600 shadow-md ring-1 ring-blue-400/40'
                    : hasEvents
                    ? isDark
                      ? 'bg-gradient-to-br from-blue-900/80 to-[#0c2e59] border-amber-400/70 shadow-sm shadow-amber-500/20 hover:border-amber-300'
                      : 'bg-gradient-to-br from-amber-50 to-blue-50 border-amber-300 hover:border-amber-500'
                    : isDark
                    ? 'bg-blue-950/40 border-blue-900/40 hover:bg-blue-900/40 hover:border-blue-800'
                    : 'bg-slate-50/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <span
                    className={`text-[11px] sm:text-xs font-bold rounded px-1 py-0.2 ${
                      isToday
                        ? 'bg-[#F5A623] text-slate-950 font-extrabold shadow-xs'
                        : isDark
                        ? cell.isCurrentMonth
                          ? 'text-white'
                          : 'text-slate-500'
                        : cell.isCurrentMonth
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {hasEvents && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                </div>

                {/* Si no es compact muestra titulos breves */}
                {!compact && hasEvents && (
                  <div className="w-full mt-0.5 space-y-0.5">
                    {cell.events.slice(0, 1).map((ev) => (
                      <div
                        key={ev.id}
                        className={`text-[9px] truncate px-1 py-0.2 rounded font-medium border ${
                          isDark
                            ? 'bg-amber-400/20 text-amber-200 border-amber-400/30'
                            : 'bg-amber-100 text-amber-900 border-amber-200'
                        }`}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Detalle de eventos (del día seleccionado o el más próximo) */}
        {(() => {
          const displayList = selectedDayEvents || currentMonthEvents;

          if (loading) {
            return (
              <p
                className={`text-xs py-2 text-center ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Cargando eventos...
              </p>
            );
          }

          if (displayList.length === 0) {
            return null;
          }

          return (
            <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {selectedDayEvents
                    ? `Actividades para el ${new Date(
                        selectedDateStr + 'T12:00:00'
                      ).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'short',
                      })}`
                    : `Próximo Evento Destacado`}
                </span>
                {selectedDayEvents && (
                  <button
                    onClick={() => {
                      setSelectedDayEvents(null);
                      setSelectedDateStr(null);
                    }}
                    className="text-[10px] text-cicha-sky-light hover:underline"
                  >
                    Cerrar
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {displayList.slice(0, compact ? 2 : 4).map((ev) => {
                  const evDate = new Date(ev.event_date);
                  return (
                    <div
                      key={ev.id}
                      onClick={() => onSelectEvent && onSelectEvent(ev)}
                      className={`rounded-xl p-2.5 sm:p-3 border transition-all ${
                        isDark
                          ? 'bg-blue-950/60 border-blue-900/80 hover:border-cicha-sky/40'
                          : 'bg-white border-slate-200 hover:border-amber-400 shadow-2xs'
                      } flex flex-col sm:flex-row sm:items-center justify-between gap-2`}
                    >
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            {ev.location_type}
                          </span>
                          <span className="text-[10px] text-slate-300 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            {evDate.toLocaleDateString('es-AR', {
                              day: 'numeric',
                              month: 'short',
                            })}{' '}
                            -{' '}
                            {evDate.toLocaleTimeString('es-AR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            hs
                          </span>
                        </div>
                        <h5
                          className={`font-serif font-bold text-xs leading-snug ${
                            isDark ? 'text-white' : 'text-cicha-navy'
                          }`}
                        >
                          {ev.title}
                        </h5>
                      </div>

                      {ev.registration_url && (
                        <a
                          href={ev.registration_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 shrink-0 self-end sm:self-auto"
                        >
                          Inscribirme
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
