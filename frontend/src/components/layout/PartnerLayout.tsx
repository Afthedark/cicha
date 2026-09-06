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
} from 'lucide-react';
import cichaLogo from '../../assets/images/logo_sin_texto.png';
import { GoogleTranslate, ArgentinaFlag, GreeceFlag } from '../common/GoogleTranslate';

export const PartnerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Panel Socio', path: '/portal-socios', icon: LayoutDashboard },
    { name: 'Documentos & Informes', path: '/portal-socios/recursos', icon: FileDown },
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
      {/* Top Intranet Header with Premium Glass/Navy Design */}
      <header className="bg-[#00274D] text-white border-b border-amber-400/40 sticky top-0 z-40 shadow-xl backdrop-blur-md">
        {/* Subtle top ambient gradient line */}
        <div className="h-1 w-full bg-gradient-to-r from-[#004b87] via-amber-400 to-[#004b87]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Brand Logo, Official Text & Partner Badge */}
            <div className="flex items-center gap-4 shrink-0">
              <Link to="/portal-socios" className="flex items-center gap-3.5 group">
                <div className="h-12 w-12 rounded-2xl bg-white p-1.5 shadow-md shadow-slate-950/20 border border-white/90 flex items-center justify-center group-hover:scale-105 group-hover:shadow-lg transition-all duration-300">
                  <img
                    src={cichaLogo}
                    alt="CICHA"
                    className="h-full w-auto object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-black text-xl tracking-tight text-white leading-none">
                      CICHA
                    </span>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                      Portal Socios
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-medium text-sky-200/90 leading-none">
                      Cámara Heleno Argentina
                    </span>
                    <div className="hidden sm:flex items-center gap-1 opacity-80 border-l border-white/20 pl-2">
                      <GreeceFlag className="w-4 h-2.5 rounded-[2px]" />
                      <ArgentinaFlag className="w-4 h-2.5 rounded-[2px]" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links (Pill Style with Micro-interactions) */}
            <nav className="hidden xl:flex items-center gap-1.5 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-md shadow-blue-900/40 ring-1 ring-white/20'
                        : 'text-slate-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform ${active ? 'scale-110 text-amber-300' : 'text-slate-300'}`} />
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase tracking-wider ${
                        active ? 'bg-amber-400 text-slate-950' : 'bg-amber-500/30 text-amber-300 border border-amber-400/40'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User Profile, Google Translate & Actions */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              {/* Google Translate Selector */}
              <div className="notranslate">
                <GoogleTranslate variant="compact" align="right" />
              </div>

              <div className="h-8 w-px bg-white/15" />

              {/* User Profile Pill */}
              <div className="flex items-center gap-2.5 bg-white/5 pl-3 pr-4 py-1.5 rounded-2xl border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white font-bold text-xs flex items-center justify-center shadow-inner border border-white/20">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : 'SC'}
                </div>
                <div className="text-left leading-tight">
                  <p className="text-xs font-bold text-white max-w-[140px] truncate" title={user?.name || 'Empresa Socia'}>
                    {user?.name || 'Empresa Socia'}
                  </p>
                  <span className="text-[10px] font-semibold text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Socio Verificado</span>
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1.5">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all border border-white/10 hover:border-white/20 shadow-xs flex items-center gap-1.5 text-xs font-semibold"
                  title="Ver Portal Público CICHA"
                >
                  <Globe className="w-4 h-4 text-sky-300" />
                  <span className="hidden 2xl:inline text-[11px]">Web Pública</span>
                </a>

                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-100 transition-all border border-rose-500/20 hover:border-rose-500/40 shadow-xs flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline text-[11px]">Salir</span>
                </button>
              </div>
            </div>

            {/* Mobile menu toggle */}
            <div className="flex items-center gap-2 xl:hidden">
              <div className="notranslate sm:hidden">
                <GoogleTranslate variant="compact" align="right" />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl bg-white/10 text-slate-200 hover:text-white border border-white/15 transition-all"
                aria-label="Abrir menú"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu with Glassmorphism */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-[#001D3A]/95 border-t border-white/10 px-4 py-4 space-y-3 backdrop-blur-xl animate-in slide-in-from-top-3 duration-200">
            {/* User card in mobile */}
            <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center border border-white/20">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'SC'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Empresa Socia'}</p>
                <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Socio Activo Verificado
                </p>
              </div>
            </div>

            {/* Navigation links */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-md'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-amber-300' : 'text-slate-300'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Footer Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-sky-300 hover:text-white text-center text-xs font-semibold border border-white/10 flex items-center justify-center gap-1.5"
              >
                <Globe className="w-4 h-4" />
                <span>Web Pública</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-100 text-center text-xs font-bold border border-rose-500/20 flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        )}
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
