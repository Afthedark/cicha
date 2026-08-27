import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Globe2,
  Menu,
  X,
  Building2,
  Phone,
  Mail,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  Lock,
} from 'lucide-react';
import { GoogleTranslate } from '../common/GoogleTranslate';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Institucional', path: '/institucional' },
    { name: 'Comercio Bilateral & EEN', path: '/comercio-bilateral' },
    { name: 'Noticias', path: '/noticias' },
    { name: 'Eventos', path: '/eventos' },
    { name: 'Socios', path: '/socios' },
    { name: 'Contacto', path: '/contacto' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Diplomatic Bar */}
      <div className="bg-[#0B2545] text-slate-300 text-xs py-2 border-b border-blue-950/80 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Alliance Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-300">
            <span className="inline-flex items-center gap-1.5 font-medium text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Reconocimiento Oficial: Argentina 1989 • Grecia 1998
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="inline-flex items-center gap-1 text-slate-300">
              <Globe2 className="w-3.5 h-3.5 text-blue-400" />
              Miembro EUROCAMARA • Nodo EEN Unión Europea • UCCEB (32 Cámaras)
            </span>
          </div>

          {/* Quick Contact, Language Selector, Portal Socios & Admin Link */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a href="tel:+541143289898" className="hover:text-amber-400 transition-colors hidden md:flex items-center gap-1">
              <Phone className="w-3 h-3" />
              +54 11 4328-9898
            </a>
            <a href="mailto:info@cicha.com.ar" className="hover:text-amber-400 transition-colors hidden sm:flex items-center gap-1">
              <Mail className="w-3 h-3" />
              info@cicha.com.ar
            </a>

            {/* Google Translate Flag Selector */}
            <div className="notranslate">
              <GoogleTranslate variant="diplomatic" align="right" />
            </div>

            <Link
              to="/portal-socios"
              className="text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30"
            >
              <Briefcase className="w-3 h-3" />
              Portal Socios
            </Link>
            <Link
              to="/admin/login"
              className="text-xs text-blue-300 hover:text-amber-400 transition-colors flex items-center gap-1 border-l border-slate-700 pl-3"
            >
              <Lock className="w-3 h-3" />
              Acceso CMS
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0B2545]/95 backdrop-blur-md shadow-xl py-3 border-b border-blue-900/50'
            : 'bg-[#0B2545] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0D5EAF] to-[#0B2545] border-2 border-amber-400/80 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <span className="font-serif font-bold text-lg text-amber-300 tracking-wider">C</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-extrabold text-xl text-white tracking-widest leading-none">
                  CICHA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-500/30">
                  AR • GR
                </span>
              </div>
              <span className="text-[11px] text-slate-300 font-medium tracking-tight mt-0.5 hidden sm:block">
                Cámara de Industria y Comercio Heleno Argentina
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-amber-400 bg-white/10 shadow-inner font-semibold'
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* CTA Button */}
            <Link
              to="/asociarse"
              className="ml-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md hover:shadow-amber-500/20 transition-all hover:scale-105"
            >
              <Briefcase className="w-4 h-4" />
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
          <div className="lg:hidden bg-[#071E38] border-t border-blue-900/60 px-4 pt-3 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
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
            <div className="pt-3 flex items-center justify-between gap-2 border-t border-blue-900/60 notranslate">
              <span className="text-xs font-semibold text-slate-300">Idioma / Language:</span>
              <GoogleTranslate variant="compact" align="right" />
            </div>

            <div className="pt-2">
              <Link
                to="/asociarse"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-md"
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
