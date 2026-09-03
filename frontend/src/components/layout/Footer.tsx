import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import cichaLogo from '../../assets/images/logo.png';
import { publicApi } from '../../services/api';
import type { Settings } from '../../types';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    publicApi.getSettings().then((res) => {
      if (res) setSettings(res);
    }).catch(() => {});
  }, []);

  const getMailtoLink = (email: string) => {
    const subject = encodeURIComponent(settings.email_prefilled_subject || 'Consulta desde la Web Oficial de CICHA');
    const body = encodeURIComponent(settings.email_prefilled_body || 'Hola, vengo de la web de CICHA y me gustaría solicitar información sobre...');
    return `mailto:${email}?subject=${subject}&body=${body}`;
  };
  return (
    <footer className="bg-gradient-to-b from-[#0066CC] to-[#0A4988] text-white pt-16 pb-8 border-t-4 border-[#00AEEF] shadow-2xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00AEEF]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4EEFC]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/20">
          {/* Column 1: Institutional */}
          <div className="space-y-4">
            <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-[#D4EEFC] inline-flex items-center justify-center">
              <img
                src={cichaLogo}
                alt="CICHA - Cámara de Industria y Comercio Heleno Argentina"
                className="h-16 sm:h-20 md:h-22 w-auto object-contain"
              />
            </div>
            <p className="text-xs leading-relaxed text-white/90 font-light">
              Fuerza creadora de negocios sustentables, inversiones y comercio bilateral entre la República Argentina y la República Helénica.
            </p>
            <div className="p-3.5 rounded-xl bg-black/15 border border-white/25 text-xs space-y-1 backdrop-blur-sm">
              <p className="flex items-center gap-1.5 text-[#F5A623] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#00AEEF] shrink-0" />
                Reconocimientos Oficiales
              </p>
              <p className="text-white/90 text-[11px] font-medium leading-tight">
                • Gobierno Argentino: 1 de Noviembre 1989<br />
                • Gobierno Griego: 18 de Septiembre 1998
              </p>
            </div>

          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base tracking-wider uppercase border-b-2 border-[#00AEEF]/50 pb-2">
              Secciones
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/institucional" className="text-white/90 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00AEEF]" />
                  Misión, Objeto e Historia
                </Link>
              </li>
              <li>
                <Link to="/institucional#autoridades" className="text-white/90 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00AEEF]" />
                  Comisión Directiva y Autoridades
                </Link>
              </li>
              <li>
                <Link to="/comercio-bilateral" className="text-white/90 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00AEEF]" />
                  Comercio Bilateral & Red EEN
                </Link>
              </li>
              <li>
                <Link to="/socios" className="text-white/90 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00AEEF]" />
                  Directorio de Empresas Socias
                </Link>
              </li>
              <li>
                <Link to="/noticias" className="text-white/90 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00AEEF]" />
                  Noticias & Comunicados
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-white/90 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00AEEF]" />
                  Blogs & Artículos Editoriales
                </Link>
              </li>
              <li>
                <Link to="/galeria" className="text-white/90 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00AEEF]" />
                  Galería Fotográfica Institucional
                </Link>
              </li>
              <li>
                <Link to="/eventos" className="text-white/90 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00AEEF]" />
                  Agenda de Eventos y Rondas
                </Link>
              </li>
              <li>
                <Link to="/asociarse" className="hover:text-white transition-colors flex items-center gap-1.5 font-bold text-[#F5A623]">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00AEEF]" />
                  Solicitud de Afiliación
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Alliances & Networks */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base tracking-wider uppercase border-b-2 border-[#00AEEF]/50 pb-2">
              Redes & Alianzas
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white/10 border border-white/20 hover:border-[#00AEEF] transition-colors">
                <p className="font-bold text-white flex items-center justify-between">
                  EUROCAMARA Argentina
                  <ExternalLink className="w-3.5 h-3.5 text-[#00AEEF]" />
                </p>
                <p className="text-[11px] text-[#D4EEFC] mt-0.5">Miembro Activo desde Mayo 2017</p>
              </div>

              <div className="p-3 rounded-xl bg-white/10 border border-white/20 hover:border-[#00AEEF] transition-colors">
                <p className="font-bold text-white flex items-center justify-between">
                  Enterprise Europe Network
                  <Globe2 className="w-3.5 h-3.5 text-[#00AEEF]" />
                </p>
                <p className="text-[11px] text-[#D4EEFC] mt-0.5">Nodo Oficial en Argentina (Unión Europea)</p>
              </div>

              <div className="p-3 rounded-xl bg-white/10 border border-white/20 hover:border-[#00AEEF] transition-colors">
                <p className="font-bold text-white flex items-center justify-between">
                  UCCEB (32 Cámaras)
                  <Building2 className="w-3.5 h-3.5 text-[#F5A623]" />
                </p>
                <p className="text-[11px] text-[#D4EEFC] mt-0.5">Unión de Cámaras Comerciales Extranjeras Binacionales</p>
              </div>
            </div>
          </div>

          {/* Column 4: Contact info */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base tracking-wider uppercase border-b-2 border-[#00AEEF]/50 pb-2">
              Sede & Contacto
            </h4>
            <div className="space-y-2.5 text-xs text-white/90 font-light">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00AEEF] shrink-0 mt-0.5" />
                <span>
                  {settings.address_street || 'Julián Alvarez 1030 (C1414)'}{settings.address_city ? `, ${settings.address_city}` : ', C.A.B.A., Argentina'}
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#00AEEF] shrink-0" />
                <a href={`tel:${(settings.phone_primary || '+5491167573851').replace(/[^0-9+]/g, '')}`} className="hover:text-[#00AEEF] transition-colors">
                  {settings.phone_primary || '(+54 9 11) 6757.3851'}
                </a>
              </p>
              <p className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#00AEEF] shrink-0 mt-0.5" />
                <span className="leading-tight">
                  <a
                    href={getMailtoLink(settings.contact_email || 'camarahelenoargentina@gmail.com')}
                    className="hover:text-[#00AEEF] block transition-colors"
                    title="Enviar correo a CICHA"
                  >
                    {settings.contact_email || 'camarahelenoargentina@gmail.com'}
                  </a>
                  {settings.contact_email_secondary && (
                    <a
                      href={getMailtoLink(settings.contact_email_secondary)}
                      className="hover:text-[#00AEEF] block text-white/70 transition-colors"
                      title="Enviar correo a CICHA"
                    >
                      {settings.contact_email_secondary}
                    </a>
                  )}
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#00AEEF] shrink-0" />
                <span>{settings.office_hours || 'Lun a Vie 09:00 a 18:00 hs (ART)'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Centered Social Media Section (Escritorio y Celular) */}
        {(settings.social_linkedin || settings.social_instagram || settings.social_facebook || settings.social_twitter || settings.social_youtube || settings.social_tiktok) && (
          <div className="py-6 border-b border-white/20 flex flex-col items-center justify-center text-center space-y-3">
            <p className="text-xs font-bold text-[#D4EEFC] uppercase tracking-wider flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00AEEF] animate-pulse"></span>
              Redes Sociales
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {settings.social_linkedin && (
                <a
                  href={settings.social_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-[#00AEEF] text-white border border-white/20 hover:border-[#00AEEF] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                  title="LinkedIn Oficial"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.22a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
                  </svg>
                </a>
              )}

              {settings.social_instagram && (
                <a
                  href={settings.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-[#00AEEF] text-white border border-white/20 hover:border-[#00AEEF] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                  title="Instagram Oficial"
                  aria-label="Instagram"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}

              {settings.social_facebook && (
                <a
                  href={settings.social_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-[#00AEEF] text-white border border-white/20 hover:border-[#00AEEF] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                  title="Facebook Oficial"
                  aria-label="Facebook"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}

              {settings.social_twitter && (
                <a
                  href={settings.social_twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-[#00AEEF] text-white border border-white/20 hover:border-[#00AEEF] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                  title="X / Twitter Oficial"
                  aria-label="Twitter / X"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}

              {settings.social_youtube && (
                <a
                  href={settings.social_youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-[#00AEEF] text-white border border-white/20 hover:border-[#00AEEF] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                  title="YouTube Oficial"
                  aria-label="YouTube"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}

              {settings.social_tiktok && (
                <a
                  href={settings.social_tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-[#00AEEF] text-white border border-white/20 hover:border-[#00AEEF] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                  title="TikTok Oficial"
                  aria-label="TikTok"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/80">
          <p>© {new Date().getFullYear()} Cámara de Industria y Comercio Heleno Argentina (CICHA). Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <Link to="/contacto" className="hover:text-white transition-colors font-medium">Privacidad & Términos</Link>
            <Link to="/admin/login" className="hover:text-white transition-colors text-white/60 font-medium">Panel CMS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
