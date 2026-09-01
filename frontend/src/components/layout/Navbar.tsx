import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Globe2,
  Menu,
  X,
  Building2,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Briefcase,
  Lock,
  Sparkles,
  FileDown,
  Gift,
  Users,
} from 'lucide-react';
import cichaLogo from '../../assets/images/logo_header.png';
import { useAuth } from '../../context/AuthContext';
import { GoogleTranslate } from '../common/GoogleTranslate';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPartnerMenuOpen, setIsPartnerMenuOpen] = useState(false);
  const partnerMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (partnerMenuRef.current && !partnerMenuRef.current.contains(event.target as Node)) {
        setIsPartnerMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Public Visible Modules for all visitors
  const publicNavLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Institucional', path: '/institucional' },
    { name: 'Comercio Bilateral & EEN', path: '/comercio-bilateral' },
    { name: 'Noticias', path: '/noticias' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Galería', path: '/galeria' },
    { name: 'Eventos', path: '/eventos' },
    { name: 'Socios', path: '/socios' },
    { name: 'Contacto', path: '/contacto' },
  ];

  // Exclusive Partner Modules
  const partnerLinks = [
    { name: 'Intranet / Dashboard Socio', path: '/portal-socios', icon: Building2, desc: 'Panel principal de la empresa socia' },
    { name: 'Informes & Normativas', path: '/portal-socios/recursos', icon: FileDown, desc: 'Informes sectoriales y guías arancelarias' },
    { name: 'Oportunidades VIP', path: '/portal-socios/oportunidades', icon: Sparkles, desc: 'Contactos directos de contrapartes' },
    { name: 'Club de Beneficios', path: '/portal-socios/beneficios', icon: Gift, desc: 'Descuentos en fletes y eventos' },
    { name: 'Networking B2B', path: '/portal-socios/directorio', icon: Users, desc: 'Directorio privado de directivos' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      <div className="bg-gradient-to-r from-cicha-navy via-cicha-aegean to-cicha-sky text-white text-xs py-2 px-4 sm:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap items-center justify-center gap-3 text-white">
            <span className="inline-flex items-center gap-1.5 font-bold text-cicha-gold-light">
              <ShieldCheck className="w-3.5 h-3.5 text-cicha-gold" />
              Reconocimiento Oficial: Argentina 1989 • Grecia 1998
            </span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="inline-flex items-center gap-1 text-white/90 font-medium">
              <Globe2 className="w-3.5 h-3.5 text-cicha-sky-light" />
              Miembro EUROCAMARA • Nodo EEN Unión Europea • UCCEB (32 Cámaras)
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a href="tel:+5491167573851" className="hover:text-cicha-gold-light transition-colors hidden md:flex items-center gap-1 font-mono text-[11px]">
              <Phone className="w-3 h-3 text-cicha-gold" />
              (+54 9 11) 6757-3851
            </a>
            <a href="mailto:camarahelenoargentina@gmail.com" className="hover:text-cicha-gold-light transition-colors hidden sm:flex items-center gap-1 font-mono text-[11px]">
              <Mail className="w-3 h-3 text-cicha-sky-light" />
              camarahelenoargentina@gmail.com
            </a>

            <div className="notranslate">
              <GoogleTranslate variant="diplomatic" align="right" />
            </div>

            <Link
              to="/admin/login"
              className="text-xs text-white/90 hover:text-white font-medium transition-colors flex items-center gap-1 border-l border-white/30 pl-3"
            >
              <Lock className="w-3 h-3 text-cicha-gold" />
              Acceso CMS
            </Link>
          </div>
        </div>
      </div>

      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-cicha-sky/10 py-2.5 border-b-2 border-cicha-sky/30'
            : 'bg-white py-3 border-b-2 border-cicha-sky-light'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group py-1">
            <img
              src={cichaLogo}
              alt="CICHA - Cámara de Industria y Comercio Heleno Argentina"
              className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {publicNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-cicha-aegean bg-cicha-sky-light shadow-inner font-semibold'
                    : 'text-slate-700 hover:text-cicha-aegean hover:bg-cicha-sky-light/50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="relative ml-2" ref={partnerMenuRef}>
              <button
                onClick={() => setIsPartnerMenuOpen(!isPartnerMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  location.pathname.startsWith('/portal-socios')
                    ? 'bg-cicha-aegean text-white border-cicha-aegean shadow-md'
                    : 'bg-cicha-sky-light/40 hover:bg-cicha-sky-light text-cicha-navy border-cicha-sky/30'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Portal Socios</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isPartnerMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isPartnerMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-cicha-aegean bg-cicha-sky-light px-2 py-0.5 rounded-full">
                      Exclusivo Empresas Socias
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">Servicios e inteligencia comercial reservada</p>
                  </div>

                  <div className="p-1 space-y-0.5">
                    {partnerLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsPartnerMenuOpen(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-50/70 transition-colors group"
                        >
                          <div className="p-2 rounded-lg bg-blue-100/70 text-blue-800 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-slate-500">{item.desc}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Link
              to="/asociarse"
              className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cicha-sky to-cicha-aegean hover:from-cicha-sky-hover hover:to-cicha-blue text-white font-extrabold text-xs shadow-md shadow-cicha-sky/25 transition-all hover:scale-105"
            >
              <Building2 className="w-3.5 h-3.5" />
              Asociarse
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Abrir menú"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="lg:hidden bg-[#071E38] border-t border-blue-900/60 px-4 pt-3 pb-6 space-y-2 max-h-[80vh] overflow-y-auto">
            {/* Public Links */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-4">Módulos Públicos</span>
              {publicNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                    isActive(link.path)
                      ? 'text-amber-400 bg-white/10 font-bold'
                      : 'text-slate-200 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Exclusive Partner Section in Mobile */}
            <div className="pt-2 border-t border-blue-900/60 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-4">Área Exclusiva de Socios</span>
              {partnerLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-4 py-2 rounded-lg text-xs font-semibold text-amber-200 hover:bg-white/5"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400/60" />
                  </Link>
                );
              })}
            </div>

            {/* Google Translate in Mobile */}
            <div className="pt-3 flex items-center justify-between gap-2 border-t border-blue-900/60 notranslate px-2">
              <span className="text-xs font-semibold text-slate-300">Idioma / Language:</span>
              <GoogleTranslate variant="compact" align="right" />
            </div>

            {/* CTA in Mobile */}
            <div className="pt-2">
              <Link
                to="/asociarse"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-md"
              >
                <Building2 className="w-4 h-4" />
                Solicitar Afiliación / Asociarse
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
