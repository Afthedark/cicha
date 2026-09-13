import React, { useEffect, useState } from 'react';
import { Sparkles, Mail, User, Clock, ArrowRight, ShieldCheck, Filter } from 'lucide-react';
import { partnerApi, adminApi } from '../../services/api';
import type { CommercialOpportunity, Category } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const PartnerOpportunitiesPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<CommercialOpportunity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<string>('all');
  const [sector, setSector] = useState<string>('all');

  useEffect(() => {
    partnerApi
      .getCategories('members')
      .then((cats) => {
        if (cats && cats.length > 0) {
          setCategories(cats);
        }
      })
      .catch((err) => {
        console.error('Error cargando categorías para oportunidades:', err);
      });
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, [type, sector]);

  const fetchOpportunities = () => {
    setLoading(true);
    partnerApi
      .getOpportunities(type, sector)
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
      <div className="bg-gradient-to-r from-cicha-navy via-[#004b87] to-cicha-navy p-6 sm:p-8 rounded-3xl border border-blue-400/20 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="gold">Trato Directo Exclusivo</Badge>
          <h1 className="font-serif font-bold text-2xl text-white mt-1">
            Oportunidades Comerciales Bilaterales VIP
          </h1>
          <p className="text-xs text-sky-200 mt-1">
            Contactos directos, demandas y ofertas de exportación/importación sin intermediación.
          </p>
        </div>
      </div>

      {/* Category / Sector Tabs (Dinámico desde Sectores & Categorías) */}
      <div className="flex flex-wrap items-center gap-2 bg-[#003866]/85 p-3 rounded-2xl border border-blue-400/20 shadow-lg">
        <button
          onClick={() => setSector('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            sector === 'all'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md'
              : 'bg-white/5 text-sky-200 hover:bg-white/10 hover:text-white'
          }`}
        >
          Todas las Oportunidades
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSector(c.name)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              sector === c.name
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md'
                : 'bg-white/5 text-sky-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            {c.name}
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
              className="bg-[#003866]/85 rounded-3xl p-6 border border-blue-400/20 hover:border-amber-400/40 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase px-2.5 py-0.5 rounded-full bg-cicha-sky/20 text-sky-200 border border-cicha-sky/30 capitalize">
                    {opp.type}
                  </span>
                  <span className="text-amber-300 font-bold bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
                    {opp.origin_country} ➔ {opp.target_country}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-white group-hover:text-amber-300 transition-colors break-words">
                  {opp.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed break-words whitespace-pre-line">
                  {opp.description}
                </p>

                {/* VIP Unmasked Direct Contact Card */}
                <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-cicha-sky/30 text-xs space-y-1.5 shadow-inner">
                  <p className="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    Contacto Directo (Exclusivo Socio)
                  </p>
                  {opp.contact_person && (
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-sky-300" />
                      {opp.contact_person}
                    </p>
                  )}
                  {opp.contact_email && (
                    <a
                      href={`mailto:${opp.contact_email}?subject=Interés Socio CICHA: ${encodeURIComponent(opp.title)}`}
                      className="text-sky-300 hover:text-amber-300 hover:underline font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {opp.contact_email}
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-sky-200/80 font-medium">{opp.sector}</span>
                <a
                  href={`mailto:${opp.contact_email || 'comercio@cicha.com.ar'}?subject=Interés Socio: ${encodeURIComponent(opp.title)}`}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black flex items-center gap-1 shadow-md transition-all cursor-pointer"
                >
                  Contactar <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#003866]/85 rounded-3xl border border-blue-400/20 shadow-xl space-y-2">
          <Sparkles className="w-10 h-10 text-amber-400 mx-auto" />
          <p className="text-sm font-semibold text-white">No hay oportunidades para este filtro.</p>
        </div>
      )}
    </div>
  );
};
