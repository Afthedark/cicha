import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Search,
  Globe,
  Mail,
  Phone,
  Briefcase,
  ExternalLink,
  Users,
  Maximize2,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Loader2,
  UserCheck,
  MapPin,
  Filter,
  X,
  ChevronRight,
} from 'lucide-react';
import { publicApi, resolveImageUrl } from '../../services/api';
import type { Member, Settings } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import bgHeader from '../../assets/static/3.jpeg';

export const MembersDirectoryPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [activeMember, setActiveMember] = useState<Member | null>(null);

  // In-App Web Viewer Modal state with fallback detection
  const [webViewer, setWebViewer] = useState<{
    isOpen: boolean;
    url: string;
    companyName: string;
    logoUrl?: string | null;
    loading: boolean;
    isBlocked: boolean;
  }>({
    isOpen: false,
    url: '',
    companyName: '',
    logoUrl: null,
    loading: true,
    isBlocked: false,
  });

  // Temporizador de seguridad: Si el iframe no completa onLoad en 4.5s (bloqueado por CSP / GoDaddy / X-Frame-Options), activar fallback amigable
  useEffect(() => {
    if (!webViewer.isOpen || !webViewer.loading) return;

    const timer = setTimeout(() => {
      if (webViewer.loading) {
        setWebViewer((prev) => ({
          ...prev,
          loading: false,
          isBlocked: true,
        }));
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [webViewer.isOpen, webViewer.loading, webViewer.url]);

  // Cargar lista completa y settings al inicio
  useEffect(() => {
    publicApi
      .getMembers()
      .then((res) => {
        setAllMembers(res || []);
      })
      .catch(console.error);

    publicApi
      .getSettings()
      .then((st) => {
        setSettings(st || {});
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [selectedSector, search]);

  const fetchMembers = () => {
    setLoading(true);
    const sector = selectedSector === 'all' ? undefined : selectedSector;
    publicApi
      .getMembers(sector, search)
      .then((res) => {
        setMembers(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // Sectores principales destacados para acceso rápido
  const primarySectors = [
    { label: 'Todos los Sectores', value: 'all' },
    { label: 'Marítimo & Logística', value: 'Marítimo & Logística' },
    { label: 'Agroindustria & Alimentos', value: 'Agroindustria & Alimentos' },
    { label: 'Energía & Sustentabilidad', value: 'Energía & Sustentabilidad' },
    { label: 'Servicios Jurídicos & Finanzas', value: 'Servicios Jurídicos & Finanzas' },
    { label: 'Turismo & Comercio Exterior', value: 'Turismo & Comercio Exterior' },
  ];

  // Extraer todos los sectores individuales ordenados para el selector completo
  const allUniqueSectors = useMemo(() => {
    const defaultSectors = [
      'Marítimo & Logística',
      'Agroindustria & Alimentos',
      'Energía & Sustentabilidad',
      'Servicios Jurídicos & Finanzas',
      'Turismo & Comercio Exterior',
    ];
    const extracted = allMembers
      .flatMap((m) => (m.sector ? m.sector.split(',').map((s) => s.trim()) : []))
      .filter(Boolean);
    const set = Array.from(new Set([...defaultSectors, ...extracted]));
    return set.sort((a, b) => a.localeCompare(b));
  }, [allMembers]);

  return (
    <div className="space-y-12 pb-24 bg-slate-50/50 min-h-screen">
      {/* 1. Header Banner / Portada Directorio de Socios con espacio superior amplio */}
      <section className="relative overflow-hidden bg-[#004b87] text-white pt-16 sm:pt-20 lg:pt-24 pb-14 sm:pb-18 lg:pb-20 px-4 sm:px-6 lg:px-12 border-b-4 border-amber-400 shadow-2xl">
        {/* Background Static Image 3.jpeg */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgHeader}
            alt="Santorini Grecia - Directorio de Socios CICHA"
            className="w-full h-full object-cover object-[center_35%]"
          />
          {/* Gradients: Left darkening for high-contrast text, clear right for Santorini view */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#002b54]/95 via-[#004077]/85 to-[#004077]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001c38]/80 via-transparent to-black/30" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Tagline, Title, Subtitle */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-5">
            {/* Top decorative line + Sub-slogan */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-1 bg-amber-400 rounded-full" />
              <p className="text-xs sm:text-sm font-bold tracking-widest text-amber-400 uppercase leading-none">
                NUESTROS SOCIOS
              </p>
            </div>

            {/* Main Title */}
            <h1 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[50px] text-white tracking-tight leading-[1.12] drop-shadow-lg">
              EMPRESAS QUE<br />
              CONSTRUYEN PUENTES
            </h1>

            {/* Description */}
            <p className="text-slate-100 text-sm sm:text-base md:text-lg font-normal max-w-2xl leading-relaxed drop-shadow">
              Una red de empresas y profesionales comprometidos con el desarrollo del intercambio comercial, cultural y productivo heleno-argentino.
            </p>
          </div>

          {/* Right Column: Cursive artistic slogan */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="text-center lg:text-right space-y-1 relative bg-black/20 lg:bg-transparent backdrop-blur-xs lg:backdrop-blur-none p-4 rounded-2xl border border-white/10 lg:border-none">
              <span className="block text-2xl sm:text-3xl lg:text-4xl text-white font-serif italic tracking-wide drop-shadow-lg [text-shadow:_0_2px_12px_rgba(0,0,0,0.6)]">
                Más negocios
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl text-sky-200 font-serif italic tracking-wide drop-shadow-lg [text-shadow:_0_2px_12px_rgba(0,0,0,0.6)]">
                Más cooperación
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl text-amber-300 font-serif italic tracking-wide drop-shadow-lg [text-shadow:_0_2px_12px_rgba(0,0,0,0.6)]">
                Un mismo horizonte
              </span>
              {/* Decorative dynamic curve */}
              <div className="mt-2 flex justify-center lg:justify-end">
                <svg className="w-36 sm:w-44 h-3 text-sky-300/90" viewBox="0 0 160 12" fill="none">
                  <path d="M2 10C50 2 110 2 158 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory Grid & Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Modern Filter Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
          {/* Top Row: Search Input + Sector Dropdown + Clear Filters */}
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por empresa, servicio, representante o país..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                  title="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dropdown Selector for all sectors */}
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full appearance-none pl-9 pr-8 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-2xs"
                >
                  <option value="all">Todos los Sectores ({allUniqueSectors.length})</option>
                  {allUniqueSectors.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
                <Filter className="w-4 h-4 text-blue-600 absolute left-3 top-3.5 pointer-events-none" />
                <div className="absolute right-3 top-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 w-0 h-0" />
              </div>

              {/* Reset Button when filters active */}
              {(selectedSector !== 'all' || search.trim() !== '') && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSector('all');
                    setSearch('');
                  }}
                  className="px-3.5 py-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                  title="Restablecer filtros"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Limpiar</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Quick Sector Pills (Scrollable horizontally) */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-slate-200 w-full">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
                Sectores:
              </span>
              {primarySectors.map((sec) => {
                const isActive = selectedSector === sec.value;
                return (
                  <button
                    key={sec.value}
                    onClick={() => setSelectedSector(sec.value)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cicha-navy text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    {sec.label}
                  </button>
                );
              })}
            </div>

            {/* Results Count Badge */}
            <div className="shrink-0 hidden md:block">
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                {members.length} {members.length === 1 ? 'socio' : 'socios'}
              </span>
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        {loading ? (
          <div className="py-16">
            <Loader text="Cargando directorio de socios..." />
          </div>
        ) : members.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {members.map((member) => {
              const resolvedLogo = resolveImageUrl(member.logo_url);
              return (
                <div
                  key={member.id}
                  onClick={() => setActiveMember(member)}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400/80 transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
                >
                  {/* Card Main Body */}
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Header: Logo + Title + Country & Featured */}
                    <div className="flex items-start gap-4">
                      {/* Logo Container */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-slate-200/90 p-2 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs group-hover:border-blue-300 transition-colors">
                        {resolvedLogo ? (
                          <img
                            src={resolvedLogo}
                            alt={member.company_name}
                            className="max-h-full max-w-full object-contain filter drop-shadow-xs transform transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full rounded-xl bg-blue-50/80 flex items-center justify-center text-blue-700">
                            <Building2 className="w-8 h-8 group-hover:scale-110 transition-transform" />
                          </div>
                        )}
                      </div>

                      {/* Title & Top Metadata */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          {member.country && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                              <Globe className="w-3 h-3 text-blue-600" />
                              {member.country}
                            </span>
                          )}
                          {member.is_featured && (
                            <Badge variant="gold">Destacada</Badge>
                          )}
                        </div>

                        <h3 className="font-serif font-bold text-lg sm:text-xl text-cicha-navy group-hover:text-blue-700 transition-colors leading-snug line-clamp-2">
                          {member.company_name}
                        </h3>

                        {member.representative_name && (
                          <div className="inline-flex items-center gap-1.5 text-xs text-blue-900 font-semibold bg-blue-50/90 border border-blue-100 px-2.5 py-0.5 rounded-md max-w-full">
                            <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate">Rep.: {member.representative_name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sector Badges */}
                    {member.sector && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {member.sector
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map((sec) => (
                            <span
                              key={sec}
                              className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/70"
                            >
                              {sec}
                            </span>
                          ))}
                      </div>
                    )}

                    {/* Contact Pills */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {(member.contact_phone || member.phone) && (
                        <div className="flex items-center gap-1 text-slate-600 bg-slate-50 border border-slate-200/80 px-2 py-1 rounded-md">
                          <Phone className="w-3 h-3 text-blue-600 shrink-0" />
                          <span>{member.contact_phone || member.phone}</span>
                        </div>
                      )}
                      {member.address && (
                        <div className="flex items-center gap-1 text-slate-600 bg-slate-50 border border-slate-200/80 px-2 py-1 rounded-md max-w-full">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                          <span className="truncate">{member.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Truncated Description */}
                    <div className="pt-1">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 [overflow-wrap:anywhere]">
                        {member.description || 'Miembro oficial de la Cámara de Industria y Comercio Heleno-Argentina.'}
                      </p>
                      {member.description && member.description.length > 100 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMember(member);
                          }}
                          className="mt-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                        >
                          Ver más detalles...
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-5 sm:px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                    {member.website_url ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const cleanUrl = member.website_url?.startsWith('http')
                            ? member.website_url
                            : `https://${member.website_url}`;
                          setWebViewer({
                            isOpen: true,
                            url: cleanUrl,
                            companyName: member.company_name,
                            logoUrl: member.logo_url,
                            loading: true,
                            isBlocked: false,
                          });
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors cursor-pointer"
                      >
                        <Globe className="w-3.5 h-3.5 text-blue-600" />
                        <span>Sitio Web</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">Socio Oficial CICHA</span>
                    )}

                    <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 group-hover:text-blue-900 transition-colors">
                      <span>Ver Perfil y Contacto</span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-base font-bold text-slate-700">No se encontraron socios</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No hay empresas que coincidan con los criterios de búsqueda o sector seleccionado.
            </p>
            {(selectedSector !== 'all' || search) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedSector('all');
                  setSearch('');
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-cicha-navy text-white text-xs font-bold hover:bg-blue-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Restablecer Búsqueda
              </button>
            )}
          </div>
        )}
      </section>

      {/* Member Details Modal */}
      {activeMember && (
        <Modal
          isOpen={!!activeMember}
          onClose={() => setActiveMember(null)}
          title={activeMember.company_name}
          maxWidth="xl"
        >
          <div className="space-y-6 text-slate-800">
            {/* Header with Logo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border border-slate-200/90 shrink-0 p-3 flex items-center justify-center overflow-hidden shadow-xs">
                {activeMember.logo_url ? (
                  <img
                    src={resolveImageUrl(activeMember.logo_url)}
                    alt={activeMember.company_name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-blue-700/60" />
                )}
              </div>
              <div className="space-y-2 min-w-0 flex-1">
                <h3 className="font-serif font-bold text-xl text-cicha-navy leading-snug break-words">
                  {activeMember.company_name}
                </h3>
                {activeMember.representative_name && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900 bg-white border border-blue-200/80 px-2.5 py-1 rounded-lg w-fit shadow-xs">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Representante: <strong className="text-slate-900">{activeMember.representative_name}</strong></span>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {activeMember.sector
                    ? activeMember.sector
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((sec) => (
                          <span key={sec} className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200/60">
                            {sec}
                          </span>
                        ))
                    : null}
                  <span className="text-xs font-medium text-slate-500 ml-1">
                    {activeMember.country}
                  </span>
                  {activeMember.is_featured ? (
                    <Badge variant="gold">Destacada</Badge>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif font-bold text-sm text-cicha-navy uppercase tracking-wider text-[12px]">Descripción de la Empresa</h4>
              <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 max-h-72 overflow-y-auto">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-words break-all whitespace-pre-line [overflow-wrap:anywhere]">
                  {activeMember.description || 'Sin descripción disponible.'}
                </p>
              </div>
            </div>

            {activeMember.services && (
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-cicha-navy uppercase tracking-wider text-[12px]">Servicios & Oferta Comercial</h4>
                <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 max-h-60 overflow-y-auto">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-words break-all whitespace-pre-line [overflow-wrap:anywhere]">
                    {activeMember.services}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {activeMember.website_url && (
                <button
                  type="button"
                  onClick={() => {
                    const cleanUrl = activeMember.website_url?.startsWith('http')
                      ? activeMember.website_url
                      : `https://${activeMember.website_url}`;
                    setWebViewer({
                      isOpen: true,
                      url: cleanUrl,
                      companyName: activeMember.company_name,
                      logoUrl: activeMember.logo_url,
                      loading: true,
                      isBlocked: false,
                    });
                  }}
                  className="flex items-center justify-between gap-2 text-blue-700 hover:text-white hover:bg-blue-600 font-semibold p-2.5 rounded-xl bg-blue-50/90 border border-blue-200/80 transition-all group text-left shadow-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Globe className="w-4 h-4 shrink-0 text-blue-600 group-hover:text-white" />
                    <span className="truncate">{activeMember.website_url}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100/90 text-blue-800 group-hover:bg-white group-hover:text-blue-700 shrink-0">
                    Abrir Web
                  </span>
                </button>
              )}
              {activeMember.contact_email && (() => {
                const subject = encodeURIComponent(settings?.member_email_subject || 'MENSAJE POR MEDIO DE LA PAGINA DE CICHA');
                const body = encodeURIComponent(settings?.member_email_body || '');
                const mailtoUrl = `mailto:${activeMember.contact_email}?subject=${subject}${body ? `&body=${body}` : ''}`;
                return (
                  <a
                    href={mailtoUrl}
                    className="flex items-center justify-between gap-2 text-slate-700 hover:text-blue-700 font-medium p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors group"
                    title="Enviar correo a la empresa socia"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="w-4 h-4 shrink-0 text-blue-600" />
                      <span className="truncate">{activeMember.contact_email}</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60 shrink-0">
                      Contactar
                    </span>
                  </a>
                );
              })()}
              {(activeMember.contact_phone || activeMember.phone) && (
                <a
                  href={`tel:${activeMember.contact_phone || activeMember.phone}`}
                  className="flex items-center justify-between gap-2 text-slate-700 hover:text-blue-700 font-medium p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors group"
                  title="Llamar a la empresa socia"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Phone className="w-4 h-4 shrink-0 text-blue-600" />
                    <span className="truncate">{activeMember.contact_phone || activeMember.phone}</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60 shrink-0">
                    Llamar
                  </span>
                </a>
              )}
              {activeMember.address && (
                <div className="flex items-center gap-2 text-slate-700 font-medium p-2.5 rounded-xl bg-slate-50 border border-slate-200 col-span-1 sm:col-span-2">
                  <MapPin className="w-4 h-4 shrink-0 text-rose-500" />
                  <span className="truncate">{activeMember.address}</span>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* In-App Browser Modal (Visor Web Integrado dentro de CICHA) */}
      {webViewer.isOpen && (
        <Modal
          isOpen={webViewer.isOpen}
          onClose={() => setWebViewer({ ...webViewer, isOpen: false })}
          title={`Sitio Oficial: ${webViewer.companyName}`}
          maxWidth="3xl"
        >
          <div className="space-y-3 -mt-2">
            {/* Browser Navigation Bar */}
            <div className="bg-slate-100/90 p-2.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 min-w-0 flex-1 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-400 select-none text-[11px]">https://</span>
                <span className="text-slate-800 font-mono font-medium truncate">
                  {webViewer.url.replace(/^https?:\/\//, '')}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setWebViewer((prev) => ({ ...prev, loading: true, isBlocked: false }))}
                  title="Recargar página"
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Recargar</span>
                </button>

                <a
                  href={webViewer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  title="Abrir en pestaña externa segura"
                >
                  <span>Abrir en pestaña nueva</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Iframe / Fallback Viewport */}
            <div className="relative w-full h-[65vh] sm:h-[72vh] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner flex flex-col items-center justify-center">
              {/* Spinner de carga inicial */}
              {webViewer.loading && !webViewer.isBlocked && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-10">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <div className="text-center px-4">
                    <p className="text-xs font-bold text-slate-800">Conectando con el portal oficial de {webViewer.companyName}...</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{webViewer.url}</p>
                  </div>
                </div>
              )}

              {/* Fallback Inteligente cuando el sitio bloquea iframe por CSP/X-Frame-Options */}
              {webViewer.isBlocked ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-50 to-blue-50/40 space-y-5">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-blue-100 shadow-md flex items-center justify-center p-2.5">
                    {webViewer.logoUrl ? (
                      <img
                        src={resolveImageUrl(webViewer.logoUrl)}
                        alt={webViewer.companyName}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-blue-600" />
                    )}
                  </div>

                  <div className="max-w-md space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      <span>Sitio con Protección de Seguridad Externa</span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-cicha-navy">
                      {webViewer.companyName}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      El servidor oficial de esta empresa cuenta con políticas de seguridad avanzadas (<em>CSP / X-Frame-Options</em>) que impiden visualizarse incrustado dentro de otra web.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <a
                      href={webViewer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Ingresar al Sitio Web Oficial</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setWebViewer((prev) => ({ ...prev, loading: true, isBlocked: false }))}
                      className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reintentar en CICHA</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Tu navegación se mantiene abierta en la Cámara Heleno Argentina sin perder la sesión.
                  </p>
                </div>
              ) : (
                <iframe
                  key={webViewer.url + (webViewer.loading ? '_loading' : '')}
                  src={webViewer.url}
                  title={webViewer.companyName}
                  onLoad={() => setWebViewer((prev) => ({ ...prev, loading: false, isBlocked: false }))}
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
                  loading="lazy"
                />
              )}
            </div>

            {/* Helper Notice footer */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span className="flex items-center gap-1.5 text-slate-500">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                Navegación protegida dentro de la Cámara Heleno Argentina (CICHA).
              </span>
              <button
                type="button"
                onClick={() => setWebViewer({ ...webViewer, isOpen: false })}
                className="font-bold text-blue-700 hover:text-blue-900"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
