import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Award,
  Globe2,
  Users,
  Target,
  Compass,
  CheckCircle,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { publicApi } from '../../services/api';
import type { InstitutionalSection, Authority, Alliance } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const InstitutionalPage: React.FC = () => {
  const [sections, setSections] = useState<InstitutionalSection[]>([]);
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [alliances, setAlliances] = useState<Alliance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .getInstitutional()
      .then((res) => {
        setSections(res.sections || []);
        setAuthorities(res.authorities || []);
        setAlliances(res.alliances || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading institutional data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader text="Cargando información institucional..." size="lg" />
      </div>
    );
  }

  const getSection = (key: string) => sections.find((s) => s.section_key === key);
  const mision = getSection('mision');
  const objeto = getSection('objeto');
  const historia = getSection('historia');
  const redes = getSection('redes_estrategicas');

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-br from-[#0B2545] via-[#071E38] to-[#040D1A] text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <Badge variant="gold">Institucional</Badge>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white">
            Cámara de Industria y Comercio Heleno Argentina
          </h1>
          <p className="text-slate-300 text-sm sm:text-base font-light max-w-2xl mx-auto">
            Más de 35 años uniendo lazos comerciales, industriales y culturales entre la República Argentina y la República Helénica.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4 text-xs text-amber-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Reconocimiento Arg: 1 Nov 1989
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Reconocimiento Grecia: 18 Sep 1998
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15">
              <Globe2 className="w-4 h-4 text-blue-400" />
              Eurocámara • Nodo EEN • UCCEB
            </span>
          </div>
        </div>
      </section>

      {/* 2. Mission & Object Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Misión */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="font-serif font-bold text-2xl text-[#0B2545]">
                {mision?.title || 'Nuestra Misión'}
              </h2>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                {mision?.subtitle || 'Fuerza creadora bilateral'}
              </p>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {mision?.content ||
                  'La misión de la Cámara de Industria y Comercio Heleno Argentina, es ser una fuerza creadora -entre Argentina y Grecia - en un ambiente de negocios que contribuya al desarrollo de nuestra sociedad, enmarcando con justicia e igualdad de oportunidades. Promover el desarrollo de negocios sustentables, comercio bilateral, inversión productiva genuina, alentando emprendimientos privados y una economía de mercado, todo eso enmarcado con responsabilidad, ética y transparencia. Articular foros de conocimiento entre sus socios y facilitar el diálogo entre los sectores públicos y privados.'}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-blue-700 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Compromiso con la Ética, Transparencia y Sustentabilidad
            </div>
          </div>

          {/* Objeto */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="font-serif font-bold text-2xl text-[#0B2545]">
                {objeto?.title || 'Objeto de la Cámara'}
              </h2>
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                {objeto?.subtitle || 'Nucleamiento y representación'}
              </p>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {objeto?.content ||
                  'La Cámara de Industria y Comercio Heleno Argentina, tiene como nucleamiento y representación del empresariado griego o de ascendencia griega, residente en la Argentina, así como en general, de ambos o de terceros países con intereses, operaciones o inversiones en Grecia y/o Argentina.'}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-blue-700 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Integración de la Comunidad Heleno-Argentina en el Mercosur y la UE
            </div>
          </div>
        </div>
      </section>

      {/* 3. History & Institutional Trajectory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-[#0B2545] to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-blue-900 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <Badge variant="gold">Trayectoria Histórica</Badge>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
                {historia?.title || 'Historia y Reconocimientos Oficiales'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {historia?.content ||
                  'La Cámara de Industria y Comercio Heleno Argentina fue oficialmente reconocida por el gobierno argentino el 1 de noviembre de 1989, y por el gobierno griego el 18 de septiembre de 1998. Desde sus orígenes, se ha consolidado como un puente fundamental de integración comercial, cultural y productiva entre la República Argentina y la República Helénica.'}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {redes?.content ||
                  'Desde Mayo de 2017 es miembro activo de EUROCAMARA Argentina y compone nodo de la red EEN (Enterprise Europe Network) de la Unión Europea. Asimismo, desde hace más de una década integra la UCCEB (Unión de Cámaras Comerciales Extranjeras Binacionales) de 32 cámaras.'}
              </p>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-2xl bg-blue-950/60 border border-blue-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Award className="w-5 h-5" />
                  Hito 1989
                </div>
                <p className="text-xs text-slate-300">
                  Reconocimiento oficial por el Poder Ejecutivo de la Nación Argentina (1 de Noviembre de 1989).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-950/60 border border-blue-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <Award className="w-5 h-5" />
                  Hito 1998
                </div>
                <p className="text-xs text-slate-300">
                  Reconocimiento formal por el Gobierno de la República Helénica en Atenas (18 de Septiembre de 1998).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Board of Directors / Authorities */}
      <section id="autoridades" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <Badge variant="primary">Liderazgo Institucional</Badge>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#0B2545]">
            Comisión Directiva & Autoridades
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Cuerpo directivo comprometido con la articulación público-privada y el crecimiento del intercambio comercial bilateral.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {authorities.map((auth) => (
            <div
              key={auth.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center space-y-4 group"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-amber-400/80 shadow-md bg-slate-100">
                {auth.photo_url ? (
                  <img
                    src={auth.photo_url}
                    alt={auth.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-900 text-white font-serif font-bold text-xl">
                    {auth.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-[#0B2545]">{auth.name}</h3>
                <p className="text-xs font-bold text-blue-700">{auth.role_title}</p>
                {auth.company && <p className="text-xs text-slate-500 font-medium">{auth.company}</p>}
              </div>

              {auth.bio && <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{auth.bio}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Strategic Alliances Detail */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <Badge variant="gold">Cooperación Internacional</Badge>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#0B2545]">
            Redes y Alianzas Multilaterales
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alliances.map((alliance) => (
            <div
              key={alliance.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex gap-5"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                <Globe2 className="w-7 h-7" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-[#0B2545]">{alliance.name}</h3>
                  {alliance.website_url && (
                    <a
                      href={alliance.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-blue-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                {alliance.highlight_text && (
                  <p className="text-xs font-bold text-amber-600">{alliance.highlight_text}</p>
                )}
                <p className="text-xs text-slate-600 leading-relaxed">{alliance.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
