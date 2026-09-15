import React, { useEffect, useState } from 'react';
import {
  Building2,
  Search,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  Users,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  Loader2,
  UserCheck,
  Filter,
  MapPin,
} from 'lucide-react';
import { partnerApi, publicApi, resolveImageUrl } from '../../services/api';
import type { Member, Settings } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const PartnerDirectoryPage: React.FC = () => {
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
    partnerApi
      .getDirectory()
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
    partnerApi
      .getDirectory(search, sector)
      .then((res) => {
        setMembers(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // Extraer sectores únicos individuales de los socios registrados más los oficiales
  const defaultSectors = [
    'Marítimo & Logística',
    'Agroindustria & Alimentos',
    'Energía & Sustentabilidad',
    'Servicios Jurídicos & Finanzas',
  ];

  const extractedSectorsFromMembers = allMembers
    .flatMap((m) => (m.sector ? m.sector.split(',').map((s) => s.trim()) : []))
    .filter(Boolean);

  const dynamicSectorNames = Array.from(
    new Set([...defaultSectors, ...extractedSectorsFromMembers])
  );

  const sectors = [
    { label: 'Todos los Sectores', value: 'all' },
    ...dynamicSectorNames.map((sec) => ({
      label: sec,
      value: sec,
    })),
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner Exclusivo del Portal */}
      <div className="bg-gradient-to-r from-cicha-navy via-[#004b87] to-cicha-navy p-6 sm:p-8 rounded-3xl border border-blue-400/20 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="gold">Networking & Comunidad B2B</Badge>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white mt-1">
            Directorio Exclusivo de Socios
          </h1>
          <p className="text-xs text-sky-200 mt-1 max-w-2xl">
            Comunidad de empresas miembros de CICHA con datos de contacto directo para alianzas comerciales y acuerdos bilaterales.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Buscar por empresa o sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder:text-sky-200/60 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-cicha-sky transition-all"
          />
          <Search className="w-4 h-4 text-sky-300 absolute left-3 top-3" />
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-[#003866]/85 rounded-2xl p-4 sm:p-5 border border-blue-400/20 shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 w-full">
          <span className="text-xs font-bold text-amber-300 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" /> Sector:
          </span>
          {sectors.map((sec) => (
            <button
              key={sec.value}
              onClick={() => setSelectedSector(sec.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedSector === sec.value
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-white/5 text-sky-200 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <Loader text="Cargando directorio de socios..." />
      ) : members.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {members.map((member) => {
            const resolvedLogo = resolveImageUrl(member.logo_url);
            return (
              <div
                key={member.id}
                onClick={() => setActiveMember(member)}
                className="bg-[#003866]/85 rounded-3xl border border-blue-400/20 hover:border-cicha-sky/40 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between cursor-pointer group relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row h-full">
                  {/* Left Column: Independent Large Logo Showcase (Fondo blanco nítido protegido) */}
                  <div className="w-full sm:w-44 md:w-48 lg:w-52 bg-white/95 group-hover:bg-white p-4 sm:p-5 border-b sm:border-b-0 sm:border-r border-blue-400/20 flex flex-col items-center justify-center shrink-0 min-h-[140px] sm:min-h-[190px] relative overflow-hidden transition-colors">
                    {resolvedLogo ? (
                      <div className="w-full h-24 sm:h-32 flex items-center justify-center p-2">
                        <img
                          src={resolvedLogo}
                          alt={member.company_name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-sm transform transition-all duration-300 ease-out group-hover:scale-120 group-hover:-translate-y-1 group-hover:drop-shadow-md"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                            (e.target as HTMLElement).parentElement?.classList.add('fallback-icon');
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 text-[#004b87]">
                        <Building2 className="w-10 h-10 transform transition-transform duration-300 group-hover:scale-120" />
                      </div>
                    )}

                    {/* Sub-badge in logo section if featured */}
                    {member.is_featured && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="gold">Destacada</Badge>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Member Details, Badges & Footer */}
                  <div className="flex-1 flex flex-col justify-between p-5 sm:p-6 space-y-4">
                    <div className="space-y-3">
                      {/* Sector Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1.5">
                          {member.sector
                            ? member.sector
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean)
                                .map((sec) => (
                                  <span
                                    key={sec}
                                    className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-cicha-navy text-sky-200 border border-cicha-sky/30 shadow-xs"
                                  >
                                    {sec}
                                  </span>
                                ))
                            : null}
                        </div>
                        <span className="text-sky-200/80 text-xs flex items-center gap-1 font-medium shrink-0">
                          <Globe className="w-3.5 h-3.5 text-amber-400" />
                          {member.country}
                        </span>
                      </div>

                      {/* Title / Company Name */}
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-white group-hover:text-amber-300 transition-colors leading-snug break-words">
                        {member.company_name}
                      </h3>

                      {/* Representative, Phone & Address Info */}
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        {member.representative_name && (
                          <div className="flex items-center gap-1.5 text-xs text-sky-200 font-semibold bg-white/10 border border-white/15 px-2.5 py-1 rounded-xl w-fit shadow-xs">
                            <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">Rep.: <strong className="text-white">{member.representative_name}</strong></span>
                          </div>
                        )}
                        {(member.contact_phone || member.phone) && (
                          <div className="flex items-center gap-1.5 text-xs text-sky-100 font-medium bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl w-fit shadow-xs">
                            <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{member.contact_phone || member.phone}</span>
                          </div>
                        )}
                        {member.address && (
                          <div className="flex items-center gap-1.5 text-xs text-sky-100 font-medium bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl w-fit shadow-xs">
                            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span className="truncate max-w-[260px]">{member.address}</span>
                          </div>
                        )}
                      </div>

                      {/* Full Description (Sin truncamiento / Sin Ver más) */}
                      <div className="pt-1">
                        <p className="text-xs text-slate-300 leading-relaxed break-words whitespace-pre-line [overflow-wrap:anywhere]">
                          {member.description || 'Miembro oficial de la Cámara Heleno Argentina.'}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer Button */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-end">
                      <span className="text-xs font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-1.5 transition-colors">
                        Ver Perfil Completo <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#003866]/85 rounded-3xl border border-blue-400/20 shadow-xl space-y-2">
          <Users className="w-10 h-10 text-sky-300 mx-auto" />
          <p className="text-sm font-semibold text-white">No se encontraron socios.</p>
          <p className="text-xs text-sky-200/70">Pruebe ajustando el filtro de búsqueda.</p>
        </div>
      )}

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
                <div className="flex items-start gap-2 text-slate-700 text-xs font-medium p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <MapPin className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                  <span className="[overflow-wrap:anywhere]">{activeMember.address}</span>
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
