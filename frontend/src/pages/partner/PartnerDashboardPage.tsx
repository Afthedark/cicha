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
          className="bg-[#003866]/85 hover:bg-[#004b87] p-5 rounded-2xl border border-blue-400/20 hover:border-cicha-sky/40 shadow-lg transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-sky-200">
            <span className="text-xs font-bold text-slate-100">Documentos</span>
            <FileDown className="w-5 h-5 text-sky-300 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-white font-serif">{stats?.total_resources || 0}</p>
          <p className="text-[11px] text-sky-200/80 font-medium">Informes y minutas disponibles</p>
        </Link>

        <Link
          to="/portal-socios/oportunidades"
          className="bg-[#003866]/85 hover:bg-[#004b87] p-5 rounded-2xl border border-blue-400/20 hover:border-amber-400/40 shadow-lg transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-amber-300">
            <span className="text-xs font-bold text-slate-100">Oportunidades VIP</span>
            <Sparkles className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-amber-300 font-serif">{stats?.total_opportunities || 0}</p>
          <p className="text-[11px] text-sky-200/80 font-medium">Comercio Grecia - Argentina</p>
        </Link>

        <Link
          to="/portal-socios/beneficios"
          className="bg-[#003866]/85 hover:bg-[#004b87] p-5 rounded-2xl border border-blue-400/20 hover:border-emerald-400/40 shadow-lg transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-emerald-300">
            <span className="text-xs font-bold text-slate-100">Club de Beneficios</span>
            <Gift className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-white font-serif">{stats?.total_benefits || 0}</p>
          <p className="text-[11px] text-sky-200/80 font-medium">Convenios activos</p>
        </Link>

        <Link
          to="/portal-socios/directorio"
          className="bg-[#003866]/85 hover:bg-[#004b87] p-5 rounded-2xl border border-blue-400/20 hover:border-purple-400/40 shadow-lg transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-purple-300">
            <span className="text-xs font-bold text-slate-100">Red de Socios</span>
            <Users className="w-5 h-5 text-purple-300 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-white font-serif">{stats?.total_members || 0}</p>
          <p className="text-[11px] text-sky-200/80 font-medium">Empresas en comunidad</p>
        </Link>
      </div>

      {/* 3. Two Column Area: Latest Resources & VIP Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Latest Resources (7 cols) */}
        <div className="lg:col-span-7 bg-[#003866]/85 rounded-3xl p-6 sm:p-8 border border-blue-400/20 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">Inteligencia Comercial</span>
              <h2 className="font-serif font-bold text-xl text-white">Informes & Documentos Exclusivos</h2>
            </div>
            <Link
              to="/portal-socios/recursos"
              className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 transition-colors"
            >
              Ver biblioteca <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.latest_resources?.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between gap-4 group/item"
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-cicha-sky/20 text-sky-200 border border-cicha-sky/30">
                      {res.file_type}
                    </span>
                    <span className="text-[11px] text-sky-200/70">{res.file_size}</span>
                  </div>
                  <h3 className="font-bold text-xs text-white group-hover/item:text-amber-300 transition-colors break-words">{res.title}</h3>
                  {res.description && (
                    <p className="text-[11px] text-slate-300 leading-relaxed break-words">{res.description}</p>
                  )}
                </div>

                <a
                  href={res.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cicha-sky to-[#0070ba] hover:from-[#00a0dc] hover:to-cicha-sky text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Right: VIP Commercial Opportunities (5 cols) */}
        <div className="lg:col-span-5 bg-[#003866]/85 rounded-3xl p-6 sm:p-8 border border-blue-400/20 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Trato Directo</span>
              <h2 className="font-serif font-bold text-xl text-white">Oportunidades VIP</h2>
            </div>
            <Link
              to="/portal-socios/oportunidades"
              className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 transition-colors"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.vip_opportunities?.map((opp) => (
              <div
                key={opp.id}
                className="p-4 rounded-2xl bg-gradient-to-br from-amber-400/10 to-white/5 border border-amber-400/20 space-y-2 hover:border-amber-400/40 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300 capitalize bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30 text-[10px]">
                    {opp.type}
                  </span>
                  <span className="text-sky-200 font-semibold">{opp.origin_country} ➔ {opp.target_country}</span>
                </div>
                <h3 className="font-serif font-bold text-xs text-white leading-snug">{opp.title}</h3>
                {opp.contact_person && (
                  <p className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
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
