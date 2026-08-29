import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Globe2,
  Ship,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Mail,
  FileCheck,
} from 'lucide-react';
import { publicApi } from '../../services/api';
import type { CommercialOpportunity } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import bgHeader from '../../assets/static/3.jpeg';

export const TradeBilateralPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<CommercialOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    fetchOpportunities();
  }, [activeFilter]);

  const fetchOpportunities = () => {
    setLoading(true);
    const type = activeFilter === 'all' ? undefined : activeFilter;
    publicApi
      .getOpportunities(type)
      .then((res) => {
        setOpportunities(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden bg-cicha-navy-deep text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-cicha-sky shadow-xl text-center">
        {/* Background Static Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgHeader}
            alt="Comercio Bilateral Grecia Argentina"
            className="w-full h-full object-cover object-center transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071E38]/95 via-[#005EAF]/80 to-[#071E38]/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071E38]/90 via-transparent to-black/30" />
        </div>

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <Badge variant="gold">Comercio Bilateral & EEN</Badge>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight drop-shadow-md">
            Plataforma de Negocios e Inversión Grecia - Argentina
          </h1>
          <p className="text-slate-200 text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed drop-shadow">
            Oportunidades de exportación, importación y transferencia tecnológica mediante el nodo oficial Enterprise Europe Network (EEN) de la Unión Europea.
          </p>
        </div>
      </section>

      {/* 2. EEN Node Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-cicha-navy rounded-3xl p-8 sm:p-12 text-white border border-blue-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 text-xs font-bold">
              <Globe2 className="w-4 h-4 text-blue-400" />
              Enterprise Europe Network (EEN)
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
              ¿Qué es el nodo EEN en CICHA?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              La Enterprise Europe Network es la mayor red mundial de apoyo a empresas con proyección internacional. A través de CICHA, las empresas argentinas y griegas acceden a financiamiento europeo, búsqueda de socios estratégicos, patentes e innovación.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cicha-sky" />
                <span>Búsqueda directa de importadores/exportadores</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cicha-sky" />
                <span>Vinculación con más de 600 nodos en 60 países</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cicha-sky" />
                <span>Asesoramiento en regulaciones de la UE</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cicha-sky" />
                <span>Rondas de negocios en Eurocámara</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-blue-950/80 rounded-2xl p-6 border border-blue-800 space-y-4 text-center">
            <Ship className="w-12 h-12 text-cicha-sky mx-auto" />
            <h3 className="font-serif font-bold text-base text-white">Mesa de Comercio Exterior</h3>
            <p className="text-xs text-slate-300">
              ¿Tiene una propuesta de inversión o desea colocar sus productos en Grecia o Argentina?
            </p>
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md"
            >
              <Mail className="w-4 h-4" />
              Contactar al Desk Comercial
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Opportunities Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="font-serif font-bold text-2xl text-cicha-navy">
              Oportunidades de Negocio Activas
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Filtradas por tipo de transacción comercial y sector productivo
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'Todas', value: 'all' },
              { label: 'Exportación', value: 'export' },
              { label: 'Importación', value: 'import' },
              { label: 'Inversión', value: 'investment' },
              { label: 'Alianzas Tecnológicas', value: 'partnership' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeFilter === tab.value
                    ? 'bg-cicha-navy text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Loader text="Cargando oportunidades..." />
        ) : opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 capitalize">
                      {opp.type}
                    </span>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {opp.origin_country} ➔ {opp.target_country}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-cicha-navy group-hover:text-blue-700 transition-colors">
                    {opp.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {opp.description}
                  </p>

                  {opp.requirements && (
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <p className="font-bold text-slate-700 flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                        Requisitos:
                      </p>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{opp.requirements}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">{opp.sector}</span>
                  <Link
                    to={`/contacto?asunto=${encodeURIComponent('Consulta: ' + opp.title)}`}
                    className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-amber-600 transition-colors"
                  >
                    Postular / Consultar <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
            <Sparkles className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No hay oportunidades para este filtro.</p>
            <p className="text-xs text-slate-500">Intente seleccionando otra categoría o contacte a nuestro desk.</p>
          </div>
        )}
      </section>
    </div>
  );
};
