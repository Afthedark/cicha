import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Building,
  TrendingUp,
  Users,
  Shield,
  FileText,
  Globe,
  Inbox,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  Gift,
  FileDown,
  BookOpen,
  Images,
} from 'lucide-react';
import { GoogleTranslate } from '../common/GoogleTranslate';

export const AdminLayout: React.FC = () => {
  const { user, logout, isAdmin, isSecretary } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Streamlined Essential Modules
  const allNavItems = [
    {
      name: 'Panel Principal',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'secretario'],
    },
    {
      name: 'Prensa & Agenda',
      path: '/admin/noticias',
      icon: Newspaper,
      roles: ['admin', 'secretario'],
    },
    {
      name: 'Blogs & Artículos',
      path: '/admin/blogs',
      icon: BookOpen,
      roles: ['admin', 'secretario'],
    },
    {
      name: 'Galería de Fotos',
      path: '/admin/galeria',
      icon: Images,
      roles: ['admin', 'secretario'],
    },
    {
      name: 'Socios & Negocios',
      path: '/admin/socios',
      icon: Building,
      roles: ['admin', 'secretario'],
    },
    {
      name: 'Bandeja de Entrada',
      path: '/admin/mensajes',
      icon: Inbox,
      roles: ['admin', 'secretario'],
    },
    {
      name: 'Configuración & Gestión',
      path: '/admin/configuracion',
      icon: Settings,
      roles: ['admin', 'secretario'],
    },
  ];

  const currentRole = user?.role || 'secretario';
  const navItems = allNavItems.filter((item) => item.roles.includes(currentRole));

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin/dashboard' || location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="bg-cicha-navy text-white border-b border-blue-900 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link to="/admin/dashboard" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-serif font-bold text-lg text-amber-300 shadow-md">
                  C
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base text-white">CICHA CMS</span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isAdmin
                          ? 'bg-rose-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {currentRole}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Administración Heleno Argentina</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Google Translate Selector */}
              <div className="notranslate">
                <GoogleTranslate variant="diplomatic" align="right" />
              </div>

              <Link
                to="/portal-socios"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-colors"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Portal Socios</span>
              </Link>

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1"
                title="Ver Sitio Público"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden md:inline">Ver Sitio</span>
              </a>

              <div className="h-6 w-px bg-blue-900" />

              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-white leading-none">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{user?.email}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 transition-colors text-xs flex items-center gap-1 font-bold"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Salir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-slate-200 p-4 space-y-1 shrink-0">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Módulos del Sistema
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-blue-50 text-blue-700 font-extrabold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {active && <ChevronRight className="w-3.5 h-3.5 text-blue-600" />}
              </Link>
            );
          })}
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full p-4 space-y-2 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="font-serif font-bold text-sm text-cicha-navy">Navegación CMS</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold ${
                      active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Admin View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
