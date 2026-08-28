import React, { useEffect, useState } from 'react';
import { Sparkles, Mail, User, Clock, ArrowRight, ShieldCheck, FileCheck } from 'lucide-react';
import { partnerApi } from '../../services/api';
import type { CommercialOpportunity } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const PartnerOpportunitiesPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<CommercialOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<string>('all');

  useEffect(() => {
    fetchOpportunities();
  }, [type]);

  const fetchOpportunities = () => {
    setLoading(true);
    partnerApi
      .getOpportunities(type)
      .then((res) => {
        setOpportunities(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="gold">Trato Directo Exclusivo</Badge>
          <h1 className="font-serif font-bold text-2xl text-cicha-navy mt-1">
            Oportunidades Comerciales Bilaterales VIP
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Contactos directos, demandas y ofertas de exportación/importación sin intermediación.
          </p>
        </div>
      </div>

      {/* Type filters */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        {[
          { label: 'Todas', value: 'all' },
          { label: 'Exportación', value: 'export' },
          { label: 'Importación', value: 'import' },
          { label: 'Inversión', value: 'investment' },
          { label: 'Alianzas Tecnológicas', value: 'partnership' },
        ].map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              type === t.value
                ? 'bg-cicha-navy text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <Loader text="Cargando oportunidades VIP..." />
      ) : opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 capitalize">
                    {opp.type}
                  </span>
                  <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {opp.origin_country} ➔ {opp.target_country}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-cicha-navy group-hover:text-blue-700 transition-colors">
                  {opp.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {opp.description}
                </p>

                {/* VIP Unmasked Direct Contact Card */}
                <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs space-y-1.5">
                  <p className="text-[10px] uppercase font-bold text-blue-900 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                    Contacto Directo (Exclusivo Socio)
                  </p>
                  {opp.contact_person && (
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      {opp.contact_person}
                    </p>
                  )}
                  {opp.contact_email && (
                    <a
                      href={`mailto:${opp.contact_email}?subject=Interés Socio CICHA: ${encodeURIComponent(opp.title)}`}
                      className="text-blue-700 hover:underline font-semibold flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {opp.contact_email}
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{opp.sector}</span>
                <a
                  href={`mailto:${opp.contact_email || 'comercio@cicha.com.ar'}?subject=Interés Socio: ${encodeURIComponent(opp.title)}`}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1 shadow-xs"
                >
                  Contactar <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-2">
          <Sparkles className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No hay oportunidades para este filtro.</p>
        </div>
      )}
    </div>
  );
};
