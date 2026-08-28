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
import { GoogleTranslate } from '../common/GoogleTranslate';

export const PartnerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Inicio Intranet', path: '/portal-socios', icon: LayoutDashboard },
    { name: 'Documentos & Informes', path: '/portal-socios/recursos', icon: FileDown },
    { name: 'Oportunidades VIP', path: '/portal-socios/oportunidades', icon: Sparkles },
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
      {/* Top Intranet Header */}
      <header className="bg-cicha-navy text-white border-b-2 border-amber-400 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo & Partner Badge */}
            <div className="flex items-center gap-4">
              <Link to="/portal-socios" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D5EAF] to-cicha-navy border border-amber-400/80 flex items-center justify-center text-white font-serif font-bold text-lg text-amber-300 shadow-md">
                  C
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-lg text-white">CICHA</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 uppercase tracking-wider">
                      Portal Exclusivo de Socios
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-200">Intranet de Comercio Bilateral & Servicios</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-white/15 text-amber-300 shadow-inner'
                        : 'text-slate-200 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Profile, Google Translate & Actions */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Google Translate Selector */}
              <div className="notranslate">
                <GoogleTranslate variant="compact" align="right" />
              </div>

              <div className="h-8 w-px bg-blue-800" />

              <div className="text-right">
                <p className="text-xs font-bold text-white">{user?.name || 'Empresa Socia'}</p>
                <span className="text-[10px] font-semibold text-emerald-400 flex items-center justify-end gap-1">
                  <ShieldCheck className="w-3 h-3" /> Socio Verificado
                </span>
              </div>

              <div className="h-8 w-px bg-blue-800" />

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1"
                title="Ver Portal Público"
              >
                <Globe className="w-4 h-4" />
              </a>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 transition-colors text-xs flex items-center gap-1.5 font-bold"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Salir</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#071E38] border-t border-blue-900 px-4 py-4 space-y-2">
            <div className="p-3 bg-blue-950 rounded-xl mb-3 border border-blue-800">
              <p className="text-xs font-bold text-white">{user?.name}</p>
              <p className="text-[10px] text-amber-400 font-semibold">Socio Activo de CICHA</p>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl text-xs font-semibold ${
                    isActive(item.path) ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              );
            })}

            <div className="pt-3 border-t border-blue-900 flex items-center justify-between">
              <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-300 hover:underline">
                Portal Público
              </a>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold"
              >
                Cerrar Sesión
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
          <p>© {new Date().getFullYear()} Cámara de Industria y Comercio Heleno Argentina (CICHA) - Intranet de Socios</p>
          <p className="text-[11px] text-slate-400">Soporte a Socios: <a href="mailto:socios@cicha.com.ar" className="text-blue-600 hover:underline">socios@cicha.com.ar</a></p>
        </div>
      </footer>
    </div>
  );
};
