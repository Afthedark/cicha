import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Building2,
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
  Image as ImageIcon,
  Landmark,
  Scroll,
  FileCheck2,
  Sparkles,
  Layers,
  Send,
  Compass,
} from 'lucide-react';
import { GoogleTranslate } from '../common/GoogleTranslate';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  roles: ('admin' | 'secretario')[];
  badge?: string;
}

interface NavGroup {
  groupName: string;
  groupSubtitle?: string;
  icon?: React.ElementType;
  items: NavItem[];
}

export const AdminLayout: React.FC = () => {
  const { user, logout, isAdmin, isSecretary } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const currentRole = user?.role || 'secretario';

  // Navigation organized into logical thematic groups (mapped to Public Navbar and Partner Portal)
  const navGroups: NavGroup[] = [
    {
      groupName: 'Resumen General',
      items: [
        {
          name: 'Panel Principal',
          path: '/admin/dashboard',
          icon: LayoutDashboard,
          roles: ['admin', 'secretario'],
        },
      ],
    },
    {
      groupName: 'Web Pública & Contenidos',
      groupSubtitle: 'Módulos del Header Público',
      icon: Compass,
      items: [
        {
          name: 'Portadas / Banners Home',
          path: '/admin/portadas',
          icon: ImageIcon,
          roles: ['admin', 'secretario'],
        },
        {
          name: 'Historia & Estatutos',
          path: '/admin/institucional',
          icon: FileText,
          roles: ['admin', 'secretario'],
        },
        {
          name: 'Comisión Directiva',
          path: '/admin/autoridades',
          icon: Landmark,
          roles: ['admin', 'secretario'],
        },
        {
          name: 'Noticias & Prensa',
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
          name: 'Galería Fotográfica',
          path: '/admin/galeria',
          icon: Images,
          roles: ['admin', 'secretario'],
        },
        {
          name: 'Agenda de Eventos',
          path: '/admin/eventos',
          icon: Calendar,
          roles: ['admin', 'secretario'],
        },
        {
          name: 'Directorio de Socios',
          path: '/admin/socios',
          icon: Building2,
          roles: ['admin', 'secretario'],
        },
        {
          name: 'Alianzas Estratégicas',
          path: '/admin/alianzas',
          icon: Globe,
          roles: ['admin', 'secretario'],
        },
      ],
    },
    {
      groupName: 'Portal de Socios & Intranet',
      groupSubtitle: 'Módulos del Portal Socios',
      icon: Gift,
      items: [
        {
          name: 'Cuentas de Socios',
          path: '/admin/usuarios-socios',
          icon: Users,
          roles: ['admin', 'secretario'],
          badge: 'Accesos',
        },
        {
          name: 'Decretos Oficiales',
          path: '/admin/decretos',
          icon: Scroll,
          roles: ['admin', 'secretario'],
        },
        {
          name: 'Documentos & Informes',
          path: '/admin/recursos-socios',
          icon: FileDown,
          roles: ['admin', 'secretario'],
        },
        {
          name: 'Oportunidades VIP',
          path: '/admin/oportunidades',
          icon: Sparkles,
          roles: ['admin', 'secretario'],
          badge: 'VIP',
        },
      ],
    },
    {
      groupName: 'Gestión & Contacto',
      groupSubtitle: 'Bandejas y Respuestas',
      icon: Inbox,
      items: [
        {
          name: 'Solicitudes de Ingreso',
          path: '/admin/solicitudes',
          icon: FileCheck2,
          roles: ['admin', 'secretario'],
        },
        {
          name: 'Bandeja de Contacto',
          path: '/admin/mensajes',
          icon: MessageSquare,
          roles: ['admin', 'secretario'],
        },
      ],
    },
    {
      groupName: 'Sistema & Staff',
      groupSubtitle: 'Configuración y Roles',
      icon: Settings,
      items: [
        {
          name: 'Ajustes Generales',
          path: '/admin/configuracion',
          icon: Settings,
          roles: ['admin', 'secretario'],
        },
        {
          name: 'Staff & Administradores',
          path: '/admin/usuarios',
          icon: Shield,
          roles: ['admin'],
          badge: 'Admin',
        },
      ],
    },
  ];

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin/dashboard' || location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="bg-cicha-navy text-white border-b border-blue-900 sticky top-0 z-40 shadow-xs">
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
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white font-serif font-bold text-lg text-amber-300 shadow-md">
                  C
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base text-white tracking-wide">CICHA CMS</span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs ${
                        isAdmin
                          ? 'bg-rose-500 text-white border border-rose-400/50'
                          : 'bg-sky-500 text-white border border-sky-400/50'
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
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400/20 to-amber-500/20 text-amber-300 hover:bg-amber-400/30 text-xs font-bold transition-all border border-amber-400/30 shadow-xs"
              >
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                <span>Portal Socios</span>
              </Link>

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1.5 border border-white/10"
                title="Ver Sitio Público"
              >
                <ExternalLink className="w-4 h-4 text-sky-300" />
                <span className="hidden md:inline font-medium">Ver Sitio</span>
              </a>

              <div className="h-6 w-px bg-blue-900/80" />

              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-white leading-none">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{user?.email}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 transition-colors text-xs flex items-center gap-1 font-bold border border-rose-500/30"
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
        {/* Desktop Sidebar with Categorized Groups */}
        <aside className="hidden lg:block w-64 xl:w-72 bg-white border-r border-slate-200/90 p-4 space-y-6 shrink-0 shadow-xs overflow-y-auto max-h-[calc(100vh-4rem)] sticky top-16">
          {navGroups.map((group, groupIdx) => {
            const filteredItems = group.items.filter((item) =>
              item.roles.includes(currentRole as 'admin' | 'secretario')
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={groupIdx} className="space-y-1.5">
                {/* Group Header */}
                <div className="px-3 pb-1 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 font-sans">
                    {group.groupName}
                  </span>
                  {group.icon && <group.icon className="w-3.5 h-3.5 text-slate-300" />}
                </div>

                {/* Group Items */}
                <div className="space-y-0.5 pt-1">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          active
                            ? 'bg-cicha-navy text-white shadow-xs font-extrabold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-cicha-navy'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              active ? 'text-amber-400' : 'text-slate-400 group-hover:text-cicha-navy'
                            }`}
                          />
                          <span className="truncate">{item.name}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {item.badge && (
                            <span
                              className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${
                                active
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                          {active && <ChevronRight className="w-3.5 h-3.5 text-amber-300" />}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex animate-in fade-in duration-200">
            <div className="w-80 bg-white h-full p-4 space-y-6 overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cicha-navy text-amber-400 flex items-center justify-center font-bold text-xs">
                    C
                  </div>
                  <span className="font-serif font-bold text-sm text-cicha-navy">CICHA CMS</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {navGroups.map((group, groupIdx) => {
                const filteredItems = group.items.filter((item) =>
                  item.roles.includes(currentRole as 'admin' | 'secretario')
                );

                if (filteredItems.length === 0) return null;

                return (
                  <div key={groupIdx} className="space-y-1.5">
                    <div className="px-3 pb-1 border-b border-slate-100">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        {group.groupName}
                      </span>
                    </div>

                    <div className="space-y-1 pt-1">
                      {filteredItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                              active
                                ? 'bg-cicha-navy text-white font-extrabold shadow-xs'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-slate-400'}`} />
                              <span>{item.name}</span>
                            </div>
                            {item.badge && (
                              <span
                                className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                                  active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
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
