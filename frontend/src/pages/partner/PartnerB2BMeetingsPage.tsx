import React, { useEffect, useState } from 'react';
import {
  Handshake,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  FileCheck2,
  Download,
  Search,
  ExternalLink,
  ShieldCheck,
  Building2,
  Mail,
  FileText,
  CheckCircle2,
  Sparkles,
  X,
  Tag,
  ArrowRight,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { partnerApi, resolveImageUrl } from '../../services/api';
import type { B2BMeeting } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const PartnerB2BMeetingsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<B2BMeeting[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedMeeting, setSelectedMeeting] = useState<B2BMeeting | null>(null);

  useEffect(() => {
    fetchMeetings();
  }, [selectedSector]);

  const fetchMeetings = () => {
    setLoading(true);
    partnerApi
      .getB2BMeetings(selectedSector === 'all' ? undefined : selectedSector, searchQuery || undefined)
      .then((res: any) => {
        if (res && typeof res === 'object' && 'meetings' in res) {
          setMeetings(res.meetings || []);
          setCategories(res.categories || []);
        } else if (Array.isArray(res)) {
          setMeetings(res);
        } else {
          setMeetings([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando reuniones B2B para socios:', err);
        setLoading(false);
      });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMeetings();
  };

  const dynamicSectors = [
    'all',
    ...categories.map((c) => c.name),
  ];
  // Fallback si no hay cargadas aún
  const sectors = dynamicSectors.length > 1 ? dynamicSectors : [
    'all',
    'Alimentos & Bebidas',
    'Logística Portuaria',
    'Tecnología & Energía',
    'Servicios Profesionales',
    'Comercio Exterior',
    'Multisectorial',
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">Ronda Concluida</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">En Desarrollo</span>;
      case 'upcoming':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-blue-500/20 text-sky-200 border border-blue-400/30">Convocatoria Activa</span>;
      default:
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-slate-500/20 text-slate-300">Finalizada</span>;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header VIP */}
      <div className="bg-gradient-to-r from-cicha-navy via-[#004b87] to-cicha-navy p-6 sm:p-8 rounded-3xl border border-blue-400/20 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="gold">Portal de Socios • Acceso Exclusivo</Badge>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Informes Completos
            </span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white mt-2">
            Reuniones B2B & Resultados Comerciales
          </h1>
          <p className="text-xs sm:text-sm text-sky-200 mt-1 max-w-3xl leading-relaxed">
            Balances detallados de rondas comerciales bilaterales, contrapartes participantes con perfiles de interés, acuerdos marco de distribución y dossiers oficiales de seguimiento.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-3 shrink-0 bg-white/10 p-3.5 rounded-2xl border border-white/15 backdrop-blur-xs text-white text-xs">
          <ShieldCheck className="w-8 h-8 text-amber-400 shrink-0" />
          <div>
            <div className="font-bold text-white">Canal de Seguimiento</div>
            <div className="text-[11px] text-sky-200">Asistencia comercial CICHA</div>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#003866]/85 p-4 rounded-2xl border border-blue-400/20 shadow-lg">
        {/* Sectors Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSector === sec
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-white/5 text-sky-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              {sec === 'all' ? 'Todos los Rubros' : sec}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Buscar por acuerdo, empresa o sede..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900/60 border border-blue-400/30 text-white placeholder-sky-300/50 rounded-xl focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400/40 transition-all"
          />
          <Search className="w-4 h-4 text-sky-300/70 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Meetings Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader text="Cargando informes de reuniones B2B..." />
        </div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-20 bg-[#003866]/85 rounded-3xl border border-blue-400/20 p-8 space-y-3 shadow-xl">
          <Handshake className="w-12 h-12 text-sky-300 mx-auto" />
          <h3 className="font-serif font-bold text-white text-base">No hay informes B2B disponibles</h3>
          <p className="text-xs text-sky-200/70 max-w-md mx-auto">
            No se encontraron registros con los filtros seleccionados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-[#003866]/85 rounded-3xl border border-blue-400/20 hover:border-amber-400/50 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Cover Photo */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <img
                  src={resolveImageUrl(meeting.cover_image_url) || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80'}
                  alt={meeting.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003866] via-transparent to-transparent" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/80 text-amber-400 border border-amber-400/30 backdrop-blur-xs">
                    {meeting.sector}
                  </span>
                  {getStatusBadge(meeting.status)}
                </div>

                <div className="absolute bottom-3 left-3 text-[11px] text-sky-200 font-medium flex items-center gap-1.5 drop-shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span className="line-clamp-1">{meeting.location || 'Buenos Aires / Atenas'}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {meeting.meeting_date && (
                    <div className="flex items-center gap-1.5 text-[11px] text-sky-300 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{new Date(meeting.meeting_date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  )}

                  <h3 className="font-serif font-bold text-base text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
                    {meeting.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {meeting.public_summary || 'Resumen de la ronda de negocios bilateral y empresas participantes.'}
                  </p>
                </div>

                {/* Macro metrics summary */}
                <div className="grid grid-cols-3 gap-2 text-center bg-slate-900/70 p-2.5 rounded-2xl border border-blue-400/20 shadow-inner">
                  <div>
                    <div className="text-xs font-bold text-white">{meeting.participants_count || 0}</div>
                    <div className="text-[10px] text-sky-300 uppercase font-semibold">Empresas</div>
                  </div>
                  <div className="border-x border-blue-400/20">
                    <div className="text-xs font-bold text-amber-400">{meeting.meetings_count || 0}</div>
                    <div className="text-[10px] text-sky-300 uppercase font-semibold">Reuniones</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-400">{meeting.agreements_count || 0}</div>
                    <div className="text-[10px] text-sky-300 uppercase font-semibold">Acuerdos</div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-300 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Informe Exclusivo
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedMeeting(meeting)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Ver Informe & Acuerdos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Partner Report Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 text-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-blue-400/30 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#003866] to-cicha-navy flex items-start justify-between gap-4 shrink-0">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-950">
                    {selectedMeeting.sector}
                  </span>
                  <span className="text-xs text-sky-200">
                    {selectedMeeting.meeting_date ? new Date(selectedMeeting.meeting_date).toLocaleDateString('es-AR') : ''}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Acceso Socios Acreditados
                  </span>
                </div>
                <h2 className="font-serif font-bold text-lg sm:text-xl text-white leading-tight">
                  {selectedMeeting.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedMeeting(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs text-slate-200">
              {/* Quantitative Metrics Bar */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <div>
                  <div className="text-xl font-black text-white">{selectedMeeting.participants_count || 0}</div>
                  <div className="text-[10px] text-sky-200 font-semibold uppercase">Empresas Participantes</div>
                </div>
                <div className="border-x border-white/10">
                  <div className="text-xl font-black text-amber-400">{selectedMeeting.meetings_count || 0}</div>
                  <div className="text-[10px] text-sky-200 font-semibold uppercase">Reuniones 1-a-1</div>
                </div>
                <div>
                  <div className="text-xl font-black text-emerald-400">{selectedMeeting.agreements_count || 0}</div>
                  <div className="text-[10px] text-sky-200 font-semibold uppercase">Acuerdos / LOIs</div>
                </div>
              </div>

              {/* Resumen General */}
              {selectedMeeting.public_summary && (
                <div className="space-y-1.5 p-4 rounded-2xl bg-[#003866]/40 border border-blue-400/20">
                  <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Resumen de la Convocatoria
                  </h4>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    {selectedMeeting.public_summary}
                  </p>
                </div>
              )}

              {/* 1. Informe Detallado de Resultados & Acuerdos */}
              <div className="space-y-2 p-5 rounded-2xl bg-white/5 border border-emerald-400/30">
                <h4 className="font-serif font-bold text-emerald-300 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Informe Detallado de Resultados & Acuerdos Comerciales
                </h4>
                <div className="text-slate-200 leading-relaxed text-xs space-y-2 whitespace-pre-line font-sans">
                  {selectedMeeting.partner_detailed_report || 'Informe en proceso de consolidación por la Secretaría de Comercio Exterior.'}
                </div>
              </div>

              {/* 2. Lista de Empresas Participantes & Contrapartes */}
              {selectedMeeting.partner_companies_list && (
                <div className="space-y-2 p-5 rounded-2xl bg-white/5 border border-blue-400/30">
                  <h4 className="font-serif font-bold text-sky-300 text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-sky-400" />
                    Empresas Contrapartes & Perfiles de Demanda
                  </h4>
                  <div className="text-slate-200 leading-relaxed text-xs space-y-1.5 whitespace-pre-line font-mono bg-slate-950/60 p-3.5 rounded-xl border border-white/10">
                    {selectedMeeting.partner_companies_list}
                  </div>
                </div>
              )}

              {/* 3. Conclusiones Estratégicas */}
              {selectedMeeting.partner_conclusions && (
                <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-amber-400/20">
                  <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Conclusiones & Próximos Pasos
                  </h4>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    {selectedMeeting.partner_conclusions}
                  </p>
                </div>
              )}

              {/* 4. Documento Descargable / Dossier & Contacto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Dossier PDF Download */}
                {selectedMeeting.partner_document_url ? (
                  <a
                    href={selectedMeeting.partner_document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-gradient-to-r from-blue-600/30 to-blue-700/30 hover:from-blue-600/40 hover:to-blue-700/40 border border-blue-400/40 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-white text-xs flex items-center gap-1.5">
                        <Download className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                        Dossier Completo (PDF)
                      </div>
                      <div className="text-[10px] text-sky-200">Descargar informe oficial firmado</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  </a>
                ) : (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 text-slate-400 text-xs">
                    <FileText className="w-4 h-4" />
                    <span>Dossier impreso disponible en Secretaría</span>
                  </div>
                )}

                {/* Contacto de Seguimiento */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-amber-400" /> Canal de Seguimiento
                  </div>
                  <div className="text-xs font-bold text-white line-clamp-1">
                    {selectedMeeting.partner_contact_info || 'comercioexterior@cicha.com.ar'}
                  </div>
                  <div className="text-[10px] text-slate-400">Solicitá asistencia para contactar contrapartes</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-slate-950 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Información confidencial para empresas socias de CICHA
              </span>
              <button
                type="button"
                onClick={() => setSelectedMeeting(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Cerrar Informe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
