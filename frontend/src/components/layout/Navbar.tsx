import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Globe2,
  Menu,
  X,
  Building2,
  ChevronRight,
  ChevronDown,
  Lock,
  Sparkles,
  FileDown,
  Gift,
  Users,
} from 'lucide-react';
import cichaLogo from '../../assets/images/logo_oficial.jpeg';
import { useAuth } from '../../context/AuthContext';
import { GoogleTranslate, ArgentinaFlag, GreeceFlag } from '../common/GoogleTranslate';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
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
    { name: 'Presentación', path: '/presentacion' },
    { name: 'La Cámara', path: '/la-camara' },
    { name: 'Noticias', path: '/noticias' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Post Redes', path: '/redes-sociales' },
    { name: 'Galería', path: '/galeria' },
    { name: 'Eventos', path: '/eventos' },
    { name: 'Socios', path: '/socios' },
    { name: 'Contacto', path: '/contacto' },
  ];

  // Exclusive Partner Modules
  const partnerLinks = [
    { name: 'Dashboard Socio', path: '/portal-socios', icon: Building2, desc: 'Panel principal de la empresa socia' },
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
    <header className="sticky top-0 z-50 w-full transition-all duration-300 shadow-md">
      {/* 1. TOP BAR: Identity, Slogan, Bilateral Flags & Official Accreditations */}
      <div className="bg-gradient-to-r from-white via-sky-50/40 to-white border-b border-slate-200/80 py-2.5 sm:py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-5">
          
          {/* Left: Logo + Typography + Slogan + Flags + Accreditations */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5 min-w-0">
            {/* Brand Logo & Name */}
            <Link to="/" className="flex items-center shrink-0 group">
              <img
                src={cichaLogo}
                alt="CICHA - Cámara de Industria y Comercio Heleno Argentina"
                className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform group-hover:scale-102"
              />
            </Link>

            {/* Slogan */}
            <div className="hidden xl:flex items-center gap-3 border-l border-slate-300/80 pl-4">
              <span className="text-xs italic font-serif text-slate-500 tracking-wide">
                &ldquo;PUENTES QUE GENERAN OPORTUNIDADES&rdquo;
              </span>
            </div>

            {/* Bilateral Flags (Greece & Argentina) */}
            <div className="hidden md:flex items-center gap-2 pl-1 shrink-0">
              <div title="Grecia" className="flex items-center">
                <GreeceFlag className="w-5.5 h-4 shadow-2xs rounded-xs" />
              </div>
              <div title="Argentina" className="flex items-center">
                <ArgentinaFlag className="w-5.5 h-4 shadow-2xs rounded-xs" />
              </div>
            </div>

            {/* Accreditations Text */}
            <div className="hidden lg:flex flex-col border-l border-slate-300/80 pl-4 leading-tight">
              <span className="text-[10.5px] text-slate-500 font-medium">
                Reconocimiento Oficial: <strong className="text-slate-700 font-semibold">Argentina 1989 &bull; Grecia 1998</strong>
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                Miembro EUROCAMARA &bull; Nodo EEN Unión Europea &bull; UCCEB (32 Cámaras)
              </span>
            </div>
          </div>

          {/* Right: Language Selector + Asociarse CTA Button + Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Selector */}
            <div className="notranslate">
              <GoogleTranslate variant="light" align="right" />
            </div>

            {/* Asociarse CTA Button */}
            <Link
              to="/asociarse"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-[#004b87] hover:bg-[#003666] text-white text-xs sm:text-[13px] font-bold shadow-xs hover:shadow transition-all duration-200"
            >
              <Users className="w-4 h-4" />
              <span className="hidden xs:inline sm:inline">Asociarse</span>
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isOpen ? <X className="w-5 h-5 text-[#004b87]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. BOTTOM BAR: Classic Aegean/Navy Blue Navigation Links & Portal Socios */}
      <nav className="bg-[#004b87] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Desktop Horizontal Navigation Links */}
          <div className="hidden lg:flex items-center flex-nowrap gap-x-0.5 xl:gap-x-1.5 overflow-hidden">
            {publicNavLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-3.5 px-1.5 lg:px-2 xl:px-2.5 text-[12px] xl:text-[13px] 2xl:text-[13.5px] font-medium whitespace-nowrap transition-colors hover:text-amber-300 ${
                    active ? 'text-white font-bold after:absolute after:bottom-0 after:left-1.5 after:right-1.5 after:h-0.5 after:bg-amber-400' : 'text-slate-100'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right: Portal Socios Dropdown */}
          <div className="hidden lg:block relative py-2" ref={partnerMenuRef}>
            <button
              onClick={() => setIsPartnerMenuOpen(!isPartnerMenuOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs xl:text-[13px] font-semibold transition-all border ${
                location.pathname.startsWith('/portal-socios')
                  ? 'bg-white/20 text-white border-white/40 shadow-inner'
                  : 'bg-white/10 hover:bg-white/15 text-white border-white/25'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>Portal Socios</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 opacity-80 ${isPartnerMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Portal Socios Dropdown Menu */}
            {isPartnerMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-900 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-[#004b87] bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full">
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
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sky-50 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-sky-100/70 text-[#004b87] group-hover:bg-[#004b87] group-hover:text-white transition-colors shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#004b87]">
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
        </div>

        {/* Mobile Dropdown Drawer */}
        {isOpen && (
          <div className="lg:hidden bg-[#003666] border-t border-white/10 px-4 pt-3 pb-6 space-y-3 max-h-[85vh] overflow-y-auto shadow-2xl animate-in fade-in duration-200">
            {/* Slogan and flags in mobile menu */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
              <span className="italic text-slate-300 text-[11px]">Puentes que generan oportunidades</span>
              <div className="flex items-center gap-1.5">
                <GreeceFlag className="w-4 h-3 rounded-xs" />
                <ArgentinaFlag className="w-4 h-3 rounded-xs" />
              </div>
            </div>

            {/* Public Links */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 px-2 flex items-center gap-1.5">
                <Globe2 className="w-3 h-3" /> Navegación Principal
              </span>
              <div className="space-y-0.5 pt-1">
                {publicNavLinks.map((link) => {
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? 'text-white bg-white/15 font-bold border-l-4 border-amber-400'
                          : 'text-slate-100 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{link.name}</span>
                        <ChevronRight className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-white/40'}`} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Exclusive Partner Section in Mobile */}
            <div className="pt-3 border-t border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 px-2 flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> Área Exclusiva de Socios
              </span>
              <div className="space-y-0.5 pt-1">
                {partnerLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-sky-300" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* CTA in Mobile */}
            <div className="pt-2">
              <Link
                to="/asociarse"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs shadow-md transition-all"
              >
                <Users className="w-4 h-4" />
                Asociarse a CICHA
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
