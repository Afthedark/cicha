import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileDown,
  Sparkles,
  Gift,
  Users,
  Building,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Download,
  ExternalLink,
} from 'lucide-react';
import { partnerApi } from '../../services/api';
import type { PartnerDashboardData } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const PartnerDashboardPage: React.FC = () => {
  const [data, setData] = useState<PartnerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    partnerApi
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
    return <Loader text="Cargando portal de socios..." size="lg" />;
  }

  const member = data?.member_info;
  const stats = data?.stats;

  return (
    <div className="space-y-8">
      {/* 1. Welcome Member Banner */}
      <div className="bg-gradient-to-r from-cicha-navy via-[#0E3360] to-cicha-blue text-white rounded-3xl p-6 sm:p-10 border border-blue-900 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Membresía Activa • Red EUROCAMARA & EEN
          </div>

          <h1 className="font-serif font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white leading-tight">
            Bienvenido, <span className="text-amber-300">{data?.user.name}</span>
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 font-light leading-relaxed">
            {member
              ? `Acceda a los informes de inteligencia comercial bilateral, beneficios corporativos y oportunidades exclusivas para ${member.company_name}.`
              : 'Acceda a los informes de inteligencia comercial bilateral, beneficios corporativos y oportunidades exclusivas para empresas socias de CICHA.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/portal-socios/recursos"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              Descargar Informes Sectoriales
            </Link>
            <Link
              to="/portal-socios/oportunidades"
              className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Oportunidades VIP
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Partner Quick KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/portal-socios/recursos"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-700">Documentos</span>
            <FileDown className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-serif">{stats?.total_resources || 0}</p>
          <p className="text-[11px] text-slate-500 font-medium">Informes y minutas disponibles</p>
        </Link>

        <Link
          to="/portal-socios/oportunidades"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-700">Oportunidades VIP</span>
            <Sparkles className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-serif">{stats?.total_opportunities || 0}</p>
          <p className="text-[11px] text-slate-500 font-medium">Comercio Grecia - Argentina</p>
        </Link>

        <Link
          to="/portal-socios/beneficios"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-700">Club de Beneficios</span>
            <Gift className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-serif">{stats?.total_benefits || 0}</p>
          <p className="text-[11px] text-slate-500 font-medium">Convenios activos</p>
        </Link>

        <Link
          to="/portal-socios/directorio"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-700">Red de Socios</span>
            <Users className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-serif">{stats?.total_members || 0}</p>
          <p className="text-[11px] text-slate-500 font-medium">Empresas en comunidad</p>
        </Link>
      </div>

      {/* 3. Two Column Area: Latest Resources & VIP Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Latest Resources (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Inteligencia Comercial</span>
              <h2 className="font-serif font-bold text-xl text-cicha-navy">Informes & Documentos Exclusivos</h2>
            </div>
            <Link
              to="/portal-socios/recursos"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              Ver biblioteca <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.latest_resources?.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200 transition-all flex items-center justify-between gap-4"
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {res.file_type}
                    </span>
                    <span className="text-[11px] text-slate-400">{res.file_size}</span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 truncate">{res.title}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{res.description}</p>
                </div>

                <a
                  href={res.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Right: VIP Commercial Opportunities (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Trato Directo</span>
              <h2 className="font-serif font-bold text-xl text-cicha-navy">Oportunidades VIP</h2>
            </div>
            <Link
              to="/portal-socios/oportunidades"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.vip_opportunities?.map((opp) => (
              <div
                key={opp.id}
                className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/40 to-slate-50 border border-amber-200/60 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-800 capitalize bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                    {opp.type}
                  </span>
                  <span className="text-slate-500 font-semibold">{opp.origin_country} ➔ {opp.target_country}</span>
                </div>
                <h3 className="font-serif font-bold text-xs text-slate-900 leading-snug">{opp.title}</h3>
                {opp.contact_person && (
                  <p className="text-[11px] text-blue-700 font-semibold flex items-center gap-1">
                    Contacto: {opp.contact_person}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
