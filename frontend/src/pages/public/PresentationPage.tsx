import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Award,
  Globe2,
  Target,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Users,
  Compass,
  FileText,
  Network,
} from 'lucide-react';
import { publicApi } from '../../services/api';
import type { InstitutionalSection } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import bgHeader from '../../assets/static/1.jpeg';

export const PresentationPage: React.FC = () => {
  const [sections, setSections] = useState<InstitutionalSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .getInstitutional()
      .then((res) => {
        setSections(res.sections || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading presentation content:', err);
        setLoading(false);
      });
  }, []);

  const presentacionSec = sections.find((s) => s.section_key === 'presentacion');

  const defaultContent = `La Cámara de Industria y Comercio Helénico-Argentina – C.I.C.H.A - fue fundada a principios de la década de 1940 por Aristóteles Onassis y los entonces destacados empresarios griegos de Argentina. En 1988, cobra un nuevo impulso y adquiere el reconocimiento, como tal, de ambos países. Desde entonces se mantiene activa con participación creciente en eventos comerciales.

La Cámara de Industria y Comercio Helénico-Argentina, está reconocida por Decreto Presidencial del gobierno griego del 18 de septiembre de 1998 y por decreto del gobierno argentino el 1 de noviembre de 1989.

La Cámara de Industria y Comercio Helénico-Argentina (C.I.C.H.A.) cada día cobra más importancia y su misión se define de la siguiente manera:
La misión de la Cámara es constituir una fuerza creativa entre Grecia y Argentina - en un entorno empresarial que contribuya al desarrollo de nuestra sociedad, enmarcado por la justicia y la igualdad de oportunidades. Impulsar el desarrollo de negocios sostenibles, el comercio bilateral, las inversiones genuinamente productivas, el fomento de la empresa privada y la economía de mercado, todo ello enmarcado desde la responsabilidad, la ética y la transparencia. La organización de Foros para el conocimiento y la facilitación del diálogo entre el sector público y privado.`;

  const rawText = presentacionSec?.content || defaultContent;
  const paragraphs = rawText.split('\n\n').filter((p) => p.trim().length > 0);

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden bg-cicha-navy-deep text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-cicha-sky shadow-xl text-center">
        <div className="absolute inset-0 z-0">
          <img
            src={bgHeader}
            alt="Presentación Oficial CICHA"
            className="w-full h-full object-cover object-center transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071E38]/95 via-[#005EAF]/85 to-[#071E38]/95" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071E38]/95 via-transparent to-black/40" />
        </div>

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <Badge variant="gold">Presentación Institucional</Badge>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight drop-shadow-md">
            {presentacionSec?.title || 'Cámara de Industria y Comercio Heleno Argentina'}
          </h1>
          <p className="text-slate-200 text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed drop-shadow">
            {presentacionSec?.subtitle ||
              'Historia, Reconocimiento Oficial, Trayectoria Bilateral y Misión Estratégica'}
          </p>
        </div>
      </section>

      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader text="Cargando presentación institucional..." size="lg" />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* 2. Highlight Card - Aristóteles Onassis & Fundacional */}
          <div className="bg-gradient-to-br from-[#071E38] via-[#0B2E59] to-[#071E38] rounded-3xl p-8 sm:p-12 text-white border border-blue-800/80 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-400/30">
                    Legado Histórico 1940
                  </span>
                </div>
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
                  Orígenes & Fundación de C.I.C.H.A.
                </h2>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  La <strong>Cámara de Industria y Comercio Helénico-Argentina – C.I.C.H.A.</strong> fue fundada a principios de la década de <strong>1940 por Aristóteles Onassis</strong> y los entonces destacados empresarios griegos de Argentina.
                </p>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  En 1988 cobra un nuevo impulso y adquiere el pleno reconocimiento oficial de ambos países, manteniéndose desde entonces activa con una participación creciente en los flujos de comercio e inversiones bilaterales.
                </p>
              </div>

              <div className="lg:col-span-4 space-y-3">
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm">
                    <Award className="w-5 h-5 shrink-0" />
                    Decreto Argentino (1989)
                  </div>
                  <p className="text-xs text-slate-300">
                    Reconocimiento por decreto del gobierno argentino el 1 de noviembre de 1989.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-2">
                  <div className="flex items-center gap-2 text-cicha-sky font-bold text-xs sm:text-sm">
                    <Award className="w-5 h-5 shrink-0" />
                    Decreto Helénico (1998)
                  </div>
                  <p className="text-xs text-slate-300">
                    Reconocimiento por Decreto Presidencial del gobierno griego el 18 de septiembre de 1998.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Main Text Content - Clean Full Width */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-cicha-navy">
                  Marco Institucional y Trayectoria Bilateral
                </h3>
                <p className="text-xs text-slate-500">Documento de Presentación de la Cámara</p>
              </div>
            </div>

            <div className="space-y-4">
              {paragraphs.map((para, index) => (
                <p key={index} className="text-justify leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* 4. Golden Mission Card */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 rounded-3xl p-8 sm:p-12 text-slate-950 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/15 text-slate-950 font-extrabold text-xs uppercase tracking-wider">
                Misión Institucional
              </span>
            </div>
            <h3 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-950">
              Fuerza Creativa entre Grecia y Argentina
            </h3>
            <p className="text-sm sm:text-base text-slate-900 font-medium leading-relaxed max-w-4xl">
              "Constituir una fuerza creativa entre Grecia y Argentina en un entorno empresarial que contribuya al desarrollo de nuestra sociedad, enmarcado por la justicia y la igualdad de oportunidades. Impulsar el desarrollo de negocios sostenibles, el comercio bilateral, las inversiones genuinamente productivas, el fomento de la empresa privada y la economía de mercado, todo ello enmarcado desde la responsabilidad, la ética y la transparencia."
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-slate-950">
              <span className="flex items-center gap-1 bg-white/40 px-3 py-1.5 rounded-xl">
                ✓ Foros de Conocimiento
              </span>
              <span className="flex items-center gap-1 bg-white/40 px-3 py-1.5 rounded-xl">
                ✓ Articulación Público-Privada
              </span>
              <span className="flex items-center gap-1 bg-white/40 px-3 py-1.5 rounded-xl">
                ✓ Comercio Bilateral Sostenible
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
