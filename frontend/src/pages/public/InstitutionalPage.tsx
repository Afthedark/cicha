import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Award,
  Globe2,
  Users,
  Building2,
  ExternalLink,
  Handshake,
  TrendingUp,
  Lightbulb,
} from 'lucide-react';
import { publicApi, resolveImageUrl } from '../../services/api';
import type { InstitutionalSection, Authority, Alliance } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import bgHeader from '../../assets/static/3.jpeg';

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
  const historia = getSection('historia');
  const redes = getSection('redes_estrategicas');

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Header Banner / Portada Institucional */}
      <section className="relative overflow-hidden bg-[#004b87] text-white py-14 sm:py-18 lg:py-20 px-4 sm:px-6 lg:px-12 border-b-4 border-amber-400/80 shadow-2xl">
        {/* Background Static Image 3.jpeg */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgHeader}
            alt="Santorini Grecia - Institucional CICHA"
            className="w-full h-full object-cover object-[center_35%]"
          />
          {/* Gradients: Left darkening for high-contrast text, clear right for Santorini view */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#003666]/95 via-[#004b87]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00284d]/60 via-transparent to-black/20" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Tagline, Title, Subtitle, Pillars */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-5">
            {/* Top decorative line + Sub-slogan */}
            <div className="space-y-1.5">
              <div className="w-10 h-0.5 bg-amber-400 rounded-full" />
              <p className="text-[11px] sm:text-xs font-bold tracking-widest text-slate-200 uppercase leading-snug">
                ARGENTINA Y GRECIA,<br />
                MÁS CERCA, MÁS LEJOS JUNTOS
              </p>
            </div>

            {/* Main Title */}
            <h1 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[52px] text-white tracking-tight leading-[1.08] drop-shadow-md">
              COMITÉ DIRECTIVO &amp;<br />
              COMISIÓN REVISORA
            </h1>

            {/* Description */}
            <p className="text-slate-100 text-xs sm:text-sm md:text-base font-normal max-w-2xl leading-relaxed drop-shadow">
              Nómina oficial de directivos y empresarios comprometidos con el intercambio bilateral heleno-argentino.
            </p>

            {/* 4 Pillars Horizontal Bar */}
            <div className="pt-3 sm:pt-4 flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 text-white/95">
              {/* Pillar 1 */}
              <div className="flex items-center gap-2">
                <Handshake className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider leading-tight">
                  COMERCIO<br />BILATERAL
                </span>
              </div>

              {/* Pillar 2 */}
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider leading-tight">
                  DESARROLLO<br />SUSTENTABLE
                </span>
              </div>

              {/* Pillar 3 */}
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider leading-tight">
                  INNOVACIÓN<br />Y CONOCIMIENTO
                </span>
              </div>

              {/* Pillar 4 */}
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider leading-tight">
                  REDES<br />INTERNACIONALES
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Cursive artistic slogan */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="text-center lg:text-right space-y-1 relative pr-2">
              <span className="block text-2xl sm:text-3xl lg:text-4xl text-white font-serif italic tracking-wide drop-shadow-lg opacity-95 [text-shadow:_0_2px_10px_rgba(0,0,0,0.5)]">
                Dos culturas
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl text-white font-serif italic tracking-wide drop-shadow-lg opacity-95 [text-shadow:_0_2px_10px_rgba(0,0,0,0.5)]">
                un mismo futuro
              </span>
              {/* Decorative dynamic curve */}
              <div className="mt-2 flex justify-center lg:justify-end">
                <svg className="w-32 sm:w-40 h-3 text-sky-300/80" viewBox="0 0 160 12" fill="none">
                  <path d="M2 10C50 2 110 2 158 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Board of Directors / Authorities (Comité Directivo & Comisión Revisora) */}
      <section id="autoridades" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <Badge variant="primary">Liderazgo Institucional</Badge>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-cicha-navy">
            Comité Directivo & Comisión Revisora
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Nómina oficial de directivos y empresarios comprometidos con el intercambio bilateral heleno-argentino.
          </p>
        </div>

        {/* 2.1 Presidente Honorario & Presidente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {authorities
            .filter((a) => a.category === 'honorario' || a.role_title === 'Presidente')
            .map((auth) => (
              <div
                key={auth.id}
                className="bg-gradient-to-br from-white via-slate-50 to-blue-50/30 rounded-3xl p-6 sm:p-8 border-2 border-amber-400/80 shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-cicha-sky shadow-md bg-slate-100 shrink-0">
                  {auth.photo_url ? (
                    <img src={auth.photo_url} alt={auth.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-900 text-white font-serif font-bold text-2xl">
                      {auth.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                    {auth.role_title}
                  </span>
                  <h3 className="font-serif font-bold text-xl text-cicha-navy">{auth.name}</h3>
                  {auth.company && (
                    <p className="text-xs font-bold text-blue-800 tracking-wide">{auth.company}</p>
                  )}
                  {auth.bio && <p className="text-xs text-slate-600 leading-relaxed">{auth.bio}</p>}
                </div>
              </div>
            ))}
        </div>

        {/* 2.2 Mesa Ejecutiva & Vocales */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-lg text-cicha-navy border-b border-slate-200 pb-2">
            Mesa Ejecutiva y Vocales
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorities
              .filter(
                (a) =>
                  a.category === 'directiva' &&
                  a.role_title !== 'Presidente'
              )
              .map((auth) => (
                <div
                  key={auth.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-start gap-4 group"
                >
                  {/* Photo or Initials Avatar */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-sm">
                    {auth.photo_url ? (
                      <img src={auth.photo_url} alt={auth.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-900 font-serif font-bold text-lg">
                        {auth.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-blue-700 block truncate">{auth.role_title}</span>
                    <h4 className="font-serif font-bold text-base text-cicha-navy group-hover:text-blue-700 transition-colors truncate">
                      {auth.name}
                    </h4>
                    {auth.company && (
                      <p className="text-xs font-semibold text-amber-700 truncate">{auth.company}</p>
                    )}
                    {auth.bio && <p className="text-xs text-slate-500 line-clamp-2 mt-1">{auth.bio}</p>}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 2.3 Comisión Revisora de Cuentas */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-lg text-cicha-navy border-b border-slate-200 pb-2">
            Comisión Revisora de Cuentas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {authorities
              .filter((a) => a.category === 'revisora')
              .map((auth) => (
                <div
                  key={auth.id}
                  className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1.5"
                >
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">
                    {auth.role_title}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-cicha-navy">{auth.name}</h4>
                  {auth.company && (
                    <p className="text-xs text-blue-800 font-semibold">{auth.company}</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* 3. Strategic Alliances Detail (Redes y Alianzas Multilaterales) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <Badge variant="gold">Cooperación Internacional</Badge>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-cicha-navy">
            Redes y Alianzas Multilaterales
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Nodos globales y cámaras binacionales articuladas de manera estratégica con CICHA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alliances.map((alliance) => {
            const resolvedLogo = resolveImageUrl(alliance.logo_url);
            return (
              <div
                key={alliance.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center gap-5"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-slate-200/90 shrink-0 p-2.5 flex items-center justify-center overflow-hidden shadow-xs">
                  {resolvedLogo ? (
                    <img
                      src={resolvedLogo}
                      alt={alliance.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                        (e.target as HTMLElement).parentElement?.classList.add('fallback-icon');
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
                      <Globe2 className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif font-bold text-base text-cicha-navy leading-snug">{alliance.name}</h3>
                    {alliance.website_url && (
                      <a
                        href={alliance.website_url.startsWith('http') ? alliance.website_url : `https://${alliance.website_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-blue-700 p-1 shrink-0"
                        title="Visitar sitio oficial"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  {alliance.highlight_text && (
                    <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80">
                      {alliance.highlight_text}
                    </span>
                  )}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{alliance.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Statutory Activities / Actividades Reglamentarias */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg space-y-6">
          <div className="space-y-2">
            <Badge variant="gold">Estatuto & Acciones Oficiales</Badge>
            <h3 className="font-serif font-bold text-2xl text-cicha-navy">
              Actividades Estatutarias de la Cámara
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Para el cumplimiento de su misión y objeto, la Cámara desarrolla entre otras las siguientes actividades:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
            {[
              'AUSPICIAR MEDIDAS QUE BENEFICIEN Y PROTEJAN EL INTERCAMBIO COMERCIAL, INDUSTRIAL Y TECNOLÓGICO HELENO-ARGENTINO.',
              'REPRESENTAR A LAS COMUNIDADES EN CUANTO A SUS RELACIONES DE INTERCAMBIO ECONÓMICO, TECNOLÓGICO Y CULTURAL.',
              'PETICIONAR A LAS AUTORIDADES PÚBLICAS QUE CORRESPONDA, EL DICTADO DE NORMAS LEGALES Y ADMINISTRATIVAS.',
              'REPRESENTAR A SUS ASOCIADOS A PEDIDO DE ÉSTOS ANTE LAS AUTORIDADES, REPARTICIONES PÚBLICAS, O ENTIDADES DE AMBOS PAÍSES.',
              'RECOGER Y DISTRIBUIR INFORMACIÓN ESTADÍSTICA, TÉCNICA, JURÍDICA, CULTURAL Y TURÍSTICA CON FINES DE ASESORAMIENTO Y DIFUSIÓN.',
              'ASISTIR Y ASESORAR A MIEMBROS Y PERSONAS INTERESADAS RESPECTO A FORMAS DE INVERSIÓN E INTERCAMBIO COMERCIAL Y TECNOLÓGICO.',
              'RESGUARDAR EL PRESTIGIO DE AMBAS COMUNIDADES, JERARQUIZANDO Y ENALTECIENDO LA IMAGEN DE LOS REPRESENTADOS.',
              'MANTENER RELACIONES Y COOPERACIÓN ACTIVA CON OTRAS CÁMARAS DE COMERCIO Y ORGANIZACIONES EMPRESARIALES.',
              'MANTENER RELACIONES INSTITUCIONALES FLUIDAS E INTERCAMBIAR INFORMACIONES CON INSTITUCIONES HELÉNICAS.',
              'OTORGAR BECAS Y APOYO A GRIEGOS Y SUS DESCENDIENTES PARA REALIZAR ESTUDIOS E INVESTIGACIONES DE IMPORTANCIA JUSTIFICADA.',
              'ORGANIZAR Y PARTICIPAR EN CONFERENCIAS, CONGRESOS Y FOROS CUYOS TEMAS SEAN DE INTERÉS BILATERAL.',
              'CREAR Y DESARROLLAR BAJO SU CUIDADO INSTITUTOS CULTURALES, SOCIALES Y DEPORTIVOS CONFORME AL INTERÉS DE LOS ASOCIADOS.',
            ].map((act, index) => (
              <div key={index} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50/50 transition-colors">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  {index + 1}
                </span>
                <span className="leading-relaxed font-semibold text-[11px] text-slate-800 tracking-wide">{act}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. History & Institutional Trajectory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-cicha-navy to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-blue-900 shadow-2xl">
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
                <div className="flex items-center gap-2 text-cicha-sky font-bold text-sm">
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
    </div>
  );
};
