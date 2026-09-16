import React, { useEffect, useState } from 'react';
import { Gift, CheckCircle, Tag, ExternalLink, ShieldCheck, Filter } from 'lucide-react';
import { partnerApi, adminApi } from '../../services/api';
import type { PartnerBenefit, Category } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const PartnerBenefitsPage: React.FC = () => {
  const [benefits, setBenefits] = useState<PartnerBenefit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    partnerApi
      .getCategories('benefits')
      .then((cats) => {
        if (cats && cats.length > 0) {
          setCategories(cats);
        } else {
          setCategories([
            { id: 1, name: 'Logística & Transporte', slug: 'logistica-transporte', type: 'benefits' },
            { id: 2, name: 'Networking Internacional', slug: 'networking-internacional', type: 'benefits' },
            { id: 3, name: 'Servicios Profesionales', slug: 'servicios-profesionales', type: 'benefits' },
            { id: 4, name: 'Comercio Exterior', slug: 'comercio-exterior', type: 'benefits' },
            { id: 5, name: 'Asesoría Legal & Tributaria', slug: 'asesoria-legal-tributaria', type: 'benefits' },
            { id: 6, name: 'Hotelería & Eventos', slug: 'hoteleria-eventos', type: 'benefits' },
          ]);
        }
      })
      .catch((err) => {
        console.error('Error cargando categorías para beneficios:', err);
        setCategories([
          { id: 1, name: 'Logística & Transporte', slug: 'logistica-transporte', type: 'benefits' },
          { id: 2, name: 'Networking Internacional', slug: 'networking-internacional', type: 'benefits' },
          { id: 3, name: 'Servicios Profesionales', slug: 'servicios-profesionales', type: 'benefits' },
          { id: 4, name: 'Comercio Exterior', slug: 'comercio-exterior', type: 'benefits' },
          { id: 5, name: 'Asesoría Legal & Tributaria', slug: 'asesoria-legal-tributaria', type: 'benefits' },
          { id: 6, name: 'Hotelería & Eventos', slug: 'hoteleria-eventos', type: 'benefits' },
        ]);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    partnerApi
      .getBenefits(category)
      .then((res) => {
        setBenefits(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [category]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-cicha-navy via-[#004b87] to-cicha-navy p-6 sm:p-8 rounded-3xl border border-blue-400/20 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="gold">Club de Convenios & Beneficios</Badge>
          <h1 className="font-serif font-bold text-2xl text-white mt-1">
            Beneficios Exclusivos para Socios CICHA
          </h1>
          <p className="text-xs text-sky-200 mt-1">
            Descuentos comerciales, bonificaciones en logística, asesoramiento legal y pases para foros EUROCAMARA.
          </p>
        </div>
      </div>

      {/* Dynamic Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#003866]/85 p-3 rounded-2xl border border-blue-400/20 shadow-lg">
        <button
          onClick={() => setCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            category === 'all'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md'
              : 'bg-white/5 text-sky-200 hover:bg-white/10 hover:text-white'
          }`}
        >
          Todos los Beneficios
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.name)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              category === c.name
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
        <Loader text="Cargando convenios..." />
      ) : benefits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((ben) => (
            <div
              key={ben.id}
              className="bg-[#003866]/85 rounded-3xl p-6 border border-blue-400/20 hover:border-emerald-400/40 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {ben.category}
                  </span>
                  {ben.valid_until && (
                    <span className="text-[11px] text-sky-200/70 font-medium">
                      Válido hasta: {new Date(ben.valid_until).toLocaleDateString('es-AR')}
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-base text-white leading-snug group-hover:text-amber-300 transition-colors">
                  {ben.title}
                </h3>

                <p className="text-xs font-bold text-amber-300">
                  Proveedor: {ben.provider_company}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {ben.discount_description}
                </p>

                {ben.how_to_claim && (
                  <div className="p-3 rounded-2xl bg-slate-900/70 border border-emerald-400/20 text-xs space-y-1 shadow-inner">
                    <p className="font-bold text-emerald-300 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-emerald-400" />
                      ¿Cómo acceder?
                    </p>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{ben.how_to_claim}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-bold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Convenio Activo
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#003866]/85 rounded-3xl border border-blue-400/20 shadow-xl space-y-2">
          <Gift className="w-10 h-10 text-amber-400 mx-auto" />
          <p className="text-sm font-semibold text-white">No hay convenios en este momento.</p>
        </div>
      )}
    </div>
  );
};
