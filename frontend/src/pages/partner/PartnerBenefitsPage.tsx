import React, { useEffect, useState } from 'react';
import { Gift, CheckCircle, Tag, ExternalLink, ShieldCheck } from 'lucide-react';
import { partnerApi } from '../../services/api';
import type { PartnerBenefit } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const PartnerBenefitsPage: React.FC = () => {
  const [benefits, setBenefits] = useState<PartnerBenefit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    partnerApi
      .getBenefits()
      .then((res) => {
        setBenefits(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="gold">Club de Convenios & Beneficios</Badge>
          <h1 className="font-serif font-bold text-2xl text-cicha-navy mt-1">
            Beneficios Exclusivos para Socios CICHA
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Descuentos comerciales, bonificaciones en logística, asesoramiento legal y pases para foros EUROCAMARA.
          </p>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <Loader text="Cargando convenios..." />
      ) : benefits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((ben) => (
            <div
              key={ben.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {ben.category}
                  </span>
                  {ben.valid_until && (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Válido hasta: {new Date(ben.valid_until).toLocaleDateString('es-AR')}
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-base text-cicha-navy leading-snug">
                  {ben.title}
                </h3>

                <p className="text-xs font-bold text-blue-700">
                  Proveedor: {ben.provider_company}
                </p>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {ben.discount_description}
                </p>

                {ben.how_to_claim && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <p className="font-bold text-slate-700 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      ¿Cómo acceder?
                    </p>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{ben.how_to_claim}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Convenio Activo
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-2">
          <Gift className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No hay convenios en este momento.</p>
        </div>
      )}
    </div>
  );
};
