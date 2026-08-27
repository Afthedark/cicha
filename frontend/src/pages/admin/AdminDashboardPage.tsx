import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  Calendar,
  Building,
  TrendingUp,
  Inbox,
  MessageSquare,
  ArrowRight,
  Plus,
  Clock,
  Eye,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { MembershipApplication, ContactMessage, Article } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<{
    stats: {
      total_articles: number;
      total_events: number;
      total_members: number;
      total_opportunities: number;
      pending_applications: number;
      unread_messages: number;
    };
    recent_applications: MembershipApplication[];
    recent_messages: ContactMessage[];
    recent_articles: Article[];
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getDashboard()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader text="Cargando métricas del panel..." />;
  }

  const stats = data?.stats;

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0B2545] to-[#0D5EAF] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-blue-900">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
            Panel de Control Institucional
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 mt-1">
            Gestión en tiempo real de contenidos, socios, oportunidades y consultas de CICHA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/noticias"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Nueva Noticia
          </Link>
          <Link
            to="/admin/oportunidades"
            className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Nueva Oportunidad
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Link
          to="/admin/solicitudes"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-700">Solicitudes</span>
            <Inbox className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 font-serif">
              {stats?.pending_applications || 0}
            </p>
            <p className="text-[10px] text-amber-700 font-semibold mt-0.5">Pendientes de revisión</p>
          </div>
        </Link>

        <Link
          to="/admin/mensajes"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-700">Consultas</span>
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 font-serif">
              {stats?.unread_messages || 0}
            </p>
            <p className="text-[10px] text-blue-700 font-semibold mt-0.5">Mensajes nuevos</p>
          </div>
        </Link>

        <Link
          to="/admin/socios"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-400 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-700">Socios</span>
            <Building className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 font-serif">
              {stats?.total_members || 0}
            </p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Empresas en directorio</p>
          </div>
        </Link>

        <Link
          to="/admin/oportunidades"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-400 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-700">Oportunidades</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 font-serif">
              {stats?.total_opportunities || 0}
            </p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Comercio bilateral</p>
          </div>
        </Link>

        <Link
          to="/admin/noticias"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-400 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-700">Noticias</span>
            <Newspaper className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 font-serif">
              {stats?.total_articles || 0}
            </p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Artículos publicados</p>
          </div>
        </Link>

        <Link
          to="/admin/eventos"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-400 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-700">Eventos</span>
            <Calendar className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 font-serif">
              {stats?.total_events || 0}
            </p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Encuentros y foros</p>
          </div>
        </Link>
      </div>

      {/* Two Column Section: Recent Applications & Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Pending / Recent Membership Applications */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-amber-500" />
              <h2 className="font-serif font-bold text-base text-[#0B2545]">
                Últimas Solicitudes de Afiliación
              </h2>
            </div>
            <Link
              to="/admin/solicitudes"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recent_applications && data.recent_applications.length > 0 ? (
              data.recent_applications.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900">{app.company_name}</p>
                    <p className="text-[11px] text-slate-500">
                      {app.contact_name} • {app.sector}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={app.status === 'pending' ? 'warning' : 'success'}>
                      {app.status}
                    </Badge>
                    <Link
                      to={`/admin/solicitudes`}
                      className="p-1 text-slate-400 hover:text-blue-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">
                No hay solicitudes pendientes en este momento.
              </p>
            )}
          </div>
        </div>

        {/* Right: Recent Inquiries */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <h2 className="font-serif font-bold text-base text-[#0B2545]">
                Mensajes de Contacto Recientes
              </h2>
            </div>
            <Link
              to="/admin/mensajes"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recent_messages && data.recent_messages.length > 0 ? (
              data.recent_messages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900 truncate max-w-[200px]">{msg.subject}</p>
                    <p className="text-[11px] text-slate-500">
                      {msg.name} ({msg.email})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={msg.is_read ? 'secondary' : 'info'}>
                      {msg.is_read ? 'Leído' : 'Nuevo'}
                    </Badge>
                    <Link
                      to={`/admin/mensajes`}
                      className="p-1 text-slate-400 hover:text-blue-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">
                No hay mensajes nuevos en la bandeja de entrada.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
