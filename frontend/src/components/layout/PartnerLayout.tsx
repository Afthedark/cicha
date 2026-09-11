import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileDown,
  Sparkles,
  Gift,
  Users,
  LogOut,
  Globe,
  Building2,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  FileCheck2,
  Scroll,
} from 'lucide-react';
import cichaLogo from '../../assets/images/logo oficial 3.png';
import { GoogleTranslate, ArgentinaFlag, GreeceFlag } from '../common/GoogleTranslate';

export const PartnerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Panel Socio', path: '/portal-socios', icon: LayoutDashboard },
    { name: 'Documentos & Informes', path: '/portal-socios/recursos', icon: FileDown },
    { name: 'Actas', path: '/portal-socios/actas', icon: FileCheck2 },
    { name: 'Decretos', path: '/portal-socios/decretos', icon: Scroll },
    { name: 'Oportunidades VIP', path: '/portal-socios/oportunidades', icon: Sparkles, badge: 'VIP' },
    { name: 'Club de Beneficios', path: '/portal-socios/beneficios', icon: Gift },
    { name: 'Directorio B2B', path: '/portal-socios/directorio', icon: Users },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/portal-socios') {
      return location.pathname === '/portal-socios';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Intranet Header with 2-Tier Design (Similar to Public Header) */}
      <header className="sticky top-0 z-50 w-full bg-white transition-all duration-300 shadow-md">
        {/* 1. TOP BAR: Identity, Slogan, Bilateral Flags, Accreditations, User Profile & Actions */}
        <div className="bg-white border-b border-slate-200/80 py-2.5 sm:py-3 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-5">
            
            {/* Left: Logo + Typography + Portal Socios Badge + Slogan + Flags + Accreditations */}
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 min-w-0">
              {/* Brand Logo & Name */}
              <Link to="/portal-socios" className="flex items-center shrink-0 group">
                <img
                  src={cichaLogo}
                  alt="CICHA - Cámara de Industria y Comercio Heleno Argentina"
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform group-hover:scale-102"
                />
              </Link>

              {/* Portal Socios Badge */}
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-xs border border-amber-300/80">
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
                Portal Socios
              </span>

              {/* Slogan */}
              <div className="hidden xl:flex items-center gap-3 border-l border-slate-300/80 pl-4">
                <span className="text-xs italic font-serif text-slate-500 tracking-wide">
                  &ldquo;PUENTES QUE GENERAN OPORTUNIDADES&rdquo;
                </span>
              </div>

              {/* Bilateral Flags (Greece & Argentina) */}
              <div className="hidden md:flex items-center gap-2 pl-1 shrink-0">
                <div title="Grecia" className="flex items-center">
                  <GreeceFlag className="w-7 h-5 shadow-2xs rounded-xs" />
                </div>
                <div title="Argentina" className="flex items-center">
                  <ArgentinaFlag className="w-7 h-5 shadow-2xs rounded-xs" />
                </div>
              </div>

              {/* Accreditations Text */}
              <div className="hidden 2xl:flex flex-col border-l border-slate-300/80 pl-4 leading-tight">
                <span className="text-[10.5px] text-slate-500 font-medium">
                  Reconocimiento Oficial: <strong className="text-slate-700 font-semibold">Argentina 1989 &bull; Grecia 1998</strong>
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  Miembro EUROCAMARA &bull; Nodo EEN Unión Europea
                </span>
              </div>
            </div>

            {/* Right: Language Selector + User Info Pill + Public Web Link + Logout + Mobile Menu Button */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Language Selector */}
              <div className="notranslate">
                <GoogleTranslate variant="celeste" align="right" />
              </div>

              {/* User Profile Pill */}
              <div className="hidden lg:flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 transition-colors pl-2.5 pr-3.5 py-1 rounded-full border border-slate-200/90 shadow-2xs">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#004b87] to-sky-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : 'SC'}
                </div>
                <div className="text-left leading-tight">
                  <p className="text-xs font-bold text-slate-800 max-w-[130px] truncate" title={user?.name || 'Empresa Socia'}>
                    {user?.name || 'Empresa Socia'}
                  </p>
                  <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>Verificado</span>
                  </span>
                </div>
              </div>

              {/* Web Pública CTA */}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all"
                title="Ver Portal Público CICHA"
              >
                <Globe className="w-3.5 h-3.5 text-[#004b87]" />
                <span className="hidden md:inline">Web Pública</span>
              </a>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all cursor-pointer"
                title="Cerrar Sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Salir</span>
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-[#004b87]" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* 2. BOTTOM BAR: Classic Aegean/Navy Blue Navigation Bar for Partner Modules */}
        <nav className="bg-[#004b87] text-white shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            
            {/* Desktop Horizontal Navigation Links */}
            <div className="hidden lg:flex items-center flex-nowrap gap-x-1 xl:gap-x-2 overflow-hidden">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative py-3.5 px-3 xl:px-4 text-[12.5px] xl:text-[13.5px] font-semibold whitespace-nowrap transition-colors hover:text-amber-300 flex items-center gap-2 ${
                      active
                        ? 'text-white font-bold after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-amber-400'
                        : 'text-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-amber-300' : 'text-sky-200'}`} />
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Tag in bottom bar */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-sky-200 font-medium py-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Sesión Activa</span>
            </div>
          </div>

          {/* Mobile Dropdown Drawer */}
          {isMobileMenuOpen && (
            <div className="lg:hidden bg-[#003666] border-t border-white/10 px-4 pt-3 pb-6 space-y-3 max-h-[85vh] overflow-y-auto shadow-2xl animate-in fade-in duration-200">
              {/* User info in mobile */}
              <div className="p-3 bg-white/10 rounded-xl border border-white/15 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#004b87] to-sky-400 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : 'SC'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{user?.name || 'Empresa Socia'}</p>
                  <p className="text-[10.5px] text-emerald-300 font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Socio Activo Verificado
                  </p>
                </div>
              </div>

              {/* Navigation links */}
              <div className="space-y-1 pt-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? 'text-white bg-white/15 font-bold border-l-4 border-amber-400'
                          : 'text-slate-100 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? 'text-amber-300' : 'text-sky-300'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge ? (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">
                          {item.badge}
                        </span>
                      ) : (
                        <ChevronRight className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-white/40'}`} />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Actions */}
              <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-center text-xs font-bold border border-white/15 flex items-center justify-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-sky-300" />
                  Web Pública
                </a>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2 rounded-lg bg-rose-500/30 hover:bg-rose-500/40 text-rose-200 text-center text-xs font-bold border border-rose-400/30 flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Intranet Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <Outlet />
      </main>

      {/* Partner Intranet Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Cámara de Industria y Comercio Heleno Argentina (CICHA) - Portal de Socios</p>
          <p className="text-[11px] text-slate-400">Soporte a Socios: <a href="mailto:socios@cicha.com.ar" className="text-blue-600 hover:underline">socios@cicha.com.ar</a></p>
        </div>
      </footer>
    </div>
  );
};
