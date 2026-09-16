import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Handshake,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  FileCheck,
  Search,
  ArrowRight,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  Lock,
  X,
  CheckCircle2,
  Building2,
  Globe2,
} from 'lucide-react';
import { publicApi, resolveImageUrl } from '../../services/api';
import type { B2BMeeting } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const B2BMeetingsPublicPage: React.FC = () => {
  const [meetings, setMeetings] = useState<B2BMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [activeModalMeeting, setActiveModalMeeting] = useState<B2BMeeting | null>(null);

  useEffect(() => {
    fetchMeetings();
  }, [selectedSector]);

  const fetchMeetings = () => {
    setLoading(true);
    publicApi
      .getB2BMeetings(selectedSector === 'all' ? undefined : selectedSector, searchQuery || undefined)
      .then((data) => {
        setMeetings(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando reuniones B2B públicas:', err);
        setLoading(false);
      });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMeetings();
  };

  const sectors = [
    'all',
    'Alimentos & Bebidas',
    'Logística Portuaria',
    'Tecnología & Energía',
    'Servicios Profesionales',
    'Multisectorial',
  ];

  // Calculate macro totals from data
  const totalParticipants = meetings.reduce((acc, m) => acc + (m.participants_count || 0), 0);
  const totalMeetings = meetings.reduce((acc, m) => acc + (m.meetings_count || 0), 0);
  const totalAgreements = meetings.reduce((acc, m) => acc + (m.agreements_count || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">Realizada</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200/80">En Curso</span>;
      case 'upcoming':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">Convocatoria Abierta</span>;
      default:
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200">Finalizada</span>;
    }
  };

  const getModalityBadge = (modality: string) => {
    switch (modality) {
      case 'presencial':
        return 'Presencial';
      case 'virtual':
        return '100% Virtual';
      case 'hibrido':
      default:
        return 'Híbrido (Presencial / Online)';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-cicha-navy via-[#002f57] to-cicha-navy text-white py-16 md:py-24 overflow-hidden border-b border-blue-900/40">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-sky-200 border border-blue-400/30 text-xs font-semibold">
              <Handshake className="w-3.5 h-3.5 text-amber-400" />
              <span>Comercio Bilateral & Rondas de Negocios</span>
            </div>
            
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Reuniones B2B & Resultados
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans font-light">
              Misiones comerciales, encuentros empresariales bilaterales y mesas de negociación directa facilitadas por CICHA para conectar importadores, exportadores e inversores de Argentina y Grecia.
            </p>
          </div>

          {/* Key Public Impact Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
            <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white">+{totalMeetings || 320}</div>
                  <div className="text-[11px] text-slate-300">Reuniones 1-a-1</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-400/20 text-sky-400 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white">+{totalParticipants || 135}</div>
                  <div className="text-[11px] text-slate-300">Empresas Participantes</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white">+{totalAgreements || 45}</div>
                  <div className="text-[11px] text-slate-300">Acuerdos Comerciales</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-400/20 text-purple-400 flex items-center justify-center font-bold">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white">32</div>
                  <div className="text-[11px] text-slate-300">Cámaras EUROCAMARA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        {/* Filters and Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-lg border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Sector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSector === sec
                    ? 'bg-cicha-navy text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {sec === 'all' ? 'Todos los Sectores' : sec}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Buscar ronda o palabra clave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cicha-navy/20 focus:border-cicha-navy transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </form>
        </div>

        {/* Partner Exclusivity Notice Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-blue-500/10 border border-amber-300/60 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                Informes Detallados & Acuerdos Exclusivos para Socios
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Esta sección pública muestra el resumen general de las rondas B2B. Los socios acreditados de CICHA pueden acceder en el <strong>Portal de Socios</strong> a los informes detallados, listas de contrapartes, minutas y dossiers descargables en PDF.
              </p>
            </div>
          </div>

          <Link
            to="/admin/login"
            className="px-5 py-2.5 rounded-xl bg-cicha-navy hover:bg-[#003866] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 self-end md:self-auto cursor-pointer"
          >
            <span>Acceder al Portal Socios</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Meetings Grid */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader text="Cargando encuentros B2B..." />
          </div>
        ) : meetings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-3">
            <Handshake className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-serif font-bold text-slate-700 text-base">No se encontraron encuentros B2B</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Prueba cambiando los filtros o la búsqueda para encontrar otras rondas comerciales.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400/40 transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Image Cover */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={resolveImageUrl(meeting.cover_image_url) || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80'}
                    alt={meeting.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-cicha-navy backdrop-blur-xs shadow-xs">
                      {meeting.sector}
                    </span>
                    {getStatusBadge(meeting.status)}
                  </div>

                  {/* Modality pill bottom */}
                  <div className="absolute bottom-3 left-3 text-[11px] text-sky-200 font-medium flex items-center gap-1.5 drop-shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span className="line-clamp-1">{getModalityBadge(meeting.modality)}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {meeting.meeting_date && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>{new Date(meeting.meeting_date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    )}

                    <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                      {meeting.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-sans">
                      {meeting.public_summary || 'Resumen del encuentro comercial y agenda bilateral.'}
                    </p>
                  </div>

                  {/* Macro Metrics Counter Bar */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center bg-slate-50/80 p-2.5 rounded-2xl">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{meeting.participants_count || 0}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Empresas</div>
                    </div>
                    <div className="border-x border-slate-200">
                      <div className="text-xs font-bold text-blue-700">{meeting.meetings_count || 0}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Reuniones</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-600">{meeting.agreements_count || 0}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Acuerdos</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModalMeeting(meeting)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver Ficha Pública</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <Link
                      to="/admin/login"
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold transition-all flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3 text-amber-600" />
                      <span>Informe Socio</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Public Meeting Details Modal */}
      {activeModalMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="relative h-48 sm:h-56 bg-slate-900 shrink-0">
              <img
                src={resolveImageUrl(activeModalMeeting.cover_image_url) || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1000&q=80'}
                alt={activeModalMeeting.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <button
                onClick={() => setActiveModalMeeting(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-black/40 hover:bg-black/60 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 space-y-1 text-white">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                    {activeModalMeeting.sector}
                  </span>
                  <span className="text-xs text-sky-200 font-medium">
                    {activeModalMeeting.meeting_date ? new Date(activeModalMeeting.meeting_date).toLocaleDateString('es-AR') : ''}
                  </span>
                </div>
                <h2 className="font-serif font-bold text-lg sm:text-xl leading-tight">
                  {activeModalMeeting.title}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              {/* Overview Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Ubicación / Sede</span>
                  <p className="font-bold text-slate-800">{activeModalMeeting.location || 'Buenos Aires / Atenas'}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Modalidad</span>
                  <p className="font-bold text-slate-800">{getModalityBadge(activeModalMeeting.modality)}</p>
                </div>
              </div>

              {/* Public Summary */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Resumen Ejecutivo de la Convocatoria</h4>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-[13px]">
                  {activeModalMeeting.public_summary}
                </p>
              </div>

              {/* Macro stats */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-center">
                <div>
                  <div className="text-base font-bold text-cicha-navy">{activeModalMeeting.participants_count || 0}</div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Empresas Participantes</div>
                </div>
                <div className="border-x border-blue-200/80">
                  <div className="text-base font-bold text-blue-700">{activeModalMeeting.meetings_count || 0}</div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Reuniones Celebradas</div>
                </div>
                <div>
                  <div className="text-base font-bold text-emerald-600">{activeModalMeeting.agreements_count || 0}</div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Acuerdos / Cartas LOI</div>
                </div>
              </div>

              {/* Partner Lock CTA */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/80 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Informe Detallado de Resultados & Contrapartes (Solo Socios)</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Los datos detallados de las empresas contrapartes (Grecia / UE), acuerdos de distribución específicos, minutas estratégicas y el dossier oficial en PDF están reservados para los socios activos de CICHA.
                </p>
                <div className="pt-1">
                  <Link
                    to="/admin/login"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xs transition-all"
                  >
                    <span>Iniciar sesión en Portal Socios</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setActiveModalMeeting(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
