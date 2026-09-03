import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe2,
  Building2,
  TrendingUp,
  ShieldCheck,
  Award,
  ArrowRight,
  Calendar,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Briefcase,
  Users,
  ExternalLink,
  Sparkles,
  Target,
} from 'lucide-react';
import { publicApi } from '../../services/api';
import type { HomeData, Banner } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

// Componente de Contador Animado Cíclico y Elegante
const CounterDisplay: React.FC<{
  target: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}> = ({ target, prefix = '', suffix = '', className = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 2000; // 2s animación fluida
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing out cubic para sensación premium
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    // Ciclo elegante que reinicia el contador suavemente cada 10 segundos
    const cycleInterval = setInterval(() => {
      startTimestamp = null;
      animationFrameId = requestAnimationFrame(step);
    }, 10000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(cycleInterval);
    };
  }, [target]);

  return (
    <p className={`${className} tabular-nums tracking-tight transition-all duration-300`}>
      {prefix}{count}{suffix}
    </p>
  );
};

export const HomePage: React.FC = () => {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    publicApi
      .getHomeData()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading home data:', err);
        setLoading(false);
      });
  }, []);

  const activeBanners = data?.banners && data.banners.length > 0
    ? data.banners.filter((b) => (typeof b.is_active === 'number' ? b.is_active === 1 : b.is_active))
    : [];

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const handlePrevBanner = () => {
    if (activeBanners.length === 0) return;
    setCurrentBannerIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1));
  };

  const handleNextBanner = () => {
    if (activeBanners.length === 0) return;
    setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader text="Cargando portal institucional..." size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      {/* 1. HERO SECTION WITH INTEGRATED TOP BANNER SLIDER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cicha-navy via-cicha-aegean/90 to-cicha-navy-deep text-white py-12 lg:py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-cicha-sky">
        {/* Decorative Aegean Glow & Marine Light */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-cicha-sky/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-cicha-turquoise/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-6 sm:space-y-8">
          {/* TITLE ABOVE TOP BANNERS CON ANIMACIÓN EXPANSIVA DESDE EL CENTRO */}
          <div className="text-center py-2 sm:py-3">
            <h2 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#071E38] tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)] px-2 animate-zoom-center inline-block">
              CÁMARA DE INDUSTRIA Y COMERCIO HELENO ARGENTINA
            </h2>
          </div>

          {/* TOP BANNER SLIDER / PORTADAS CAROUSEL */}
          {activeBanners.length > 0 && (
            <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900/40 backdrop-blur-md group">
              {activeBanners.map((bnr, idx) => {
                const isActive = idx === currentBannerIndex;
                return (
                  <div
                    key={bnr.id}
                    className={`transition-all duration-700 ease-in-out ${
                      isActive ? 'opacity-100 relative z-10 block' : 'opacity-0 absolute inset-0 z-0 hidden pointer-events-none'
                    }`}
                  >
                    <div className="relative min-h-[300px] sm:min-h-[360px] lg:min-h-[420px] flex items-center">
                      {/* Banner Image / Background */}
                      {bnr.image_url ? (
                        <div className="absolute inset-0 z-0">
                          <img
                            src={bnr.image_url}
                            alt={bnr.title}
                            className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-1000"
                          />
                          {/* Rich Gradient Overlay for maximum text readability */}
                          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-slate-900 to-cicha-navy-deep z-0" />
                      )}

                      {/* Content inside Banner */}
                      <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl space-y-4">
                        {bnr.badge_text && (
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-cicha-sky-light text-xs font-bold shadow-sm backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5 text-cicha-gold" />
                            <span>{bnr.badge_text}</span>
                          </div>
                        )}

                        <h2 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight drop-shadow-md">
                          {bnr.title}
                        </h2>

                        {bnr.subtitle && (
                          <p className="text-slate-200 text-sm sm:text-base leading-relaxed line-clamp-3 font-light drop-shadow">
                            {bnr.subtitle}
                          </p>
                        )}

                        {bnr.button_text && (
                          <div className="pt-2">
                            <Link
                              to={bnr.button_url || '/asociarse'}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cicha-sky hover:bg-cicha-sky-hover text-white font-bold text-xs sm:text-sm shadow-lg shadow-cicha-sky/30 transition-all hover:scale-105"
                            >
                              <span>{bnr.button_text}</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Slider Controls (Prev / Next & Dots) */}
              {activeBanners.length > 1 && (
                <>
                  <button
                    onClick={handlePrevBanner}
                    aria-label="Portada anterior"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 transition-all hover:scale-110"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextBanner}
                    aria-label="Siguiente portada"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 transition-all hover:scale-110"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Indicators / Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                    {activeBanners.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => setCurrentBannerIndex(dotIdx)}
                        aria-label={`Ir a portada ${dotIdx + 1}`}
                        className={`transition-all rounded-full ${
                          dotIdx === currentBannerIndex
                            ? 'w-6 h-2 bg-cicha-sky shadow-sm'
                            : 'w-2 h-2 bg-white/50 hover:bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* MAIN BILATERAL HERO SECTION (JUSTO DEBAJO DE LAS PORTADAS Y EN CONJUNTO) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-2">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Diplomatic Badges */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-cicha-sky-light/40 text-cicha-sky-light text-xs font-semibold shadow-inner backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-cicha-sky" />
                <span>Reconocida por Gobiernos de Argentina (1989) y Grecia (1998)</span>
              </div>

              <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                Impulsando el Comercio Bilateral e Inversiones entre{' '}
                <span className="text-[#072B54] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                  Grecia y Argentina
                </span>
              </h1>

              <div className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-2xl font-light space-y-3 text-justify">
                <p>
                  La <strong>Cámara de Industria y Comercio Heleno Argentina</strong>, desde <strong>Mayo 2017</strong> es <strong>miembro activo de la EUROCAMARA Argentina</strong>, y compone nodo de la red <strong>EEN (Europe Enterprise Network)</strong> de la <strong>Unión Europea</strong>.
                </p>
                <p>
                  Desde hace más de una década, es <strong>miembro activo de la UCCEB</strong> (<strong>Unión de Cámaras Comerciales Extranjeras Binacionales</strong>), compuesta actualmente de <strong>32 cámaras</strong>.
                </p>
                <p>
                  La <strong>Cámara de Industria y Comercio Heleno Argentina</strong>, reconocida por el <strong>gobierno griego el 18 de septiembre de 1998</strong>, y por el <strong>gobierno argentino el 1 de noviembre de 1989</strong>, cada día está tomando mayor relevancia y su misión ha sido definida de la siguiente manera:
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/asociarse"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cicha-sky to-cicha-aegean hover:from-cicha-sky-hover hover:to-cicha-blue text-white font-bold text-sm shadow-xl shadow-cicha-sky/25 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  Solicitar Membresía / Asociarse
                </Link>

                <Link
                  to="/comercio-bilateral"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-cicha-sky-light/30 font-semibold text-sm backdrop-blur-sm transition-all flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4 text-cicha-sky" />
                  Oportunidades Comerciales
                </Link>
              </div>

              {/* Strategic Node Highlights */}
              <div className="pt-4 border-t border-blue-900/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cicha-sky shrink-0" />
                  <span>Miembro EUROCAMARA (2017)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Nodo EEN Unión Europea</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Miembro UCCEB (32 Cámaras)</span>
                </div>
              </div>
            </div>

            {/* Right Card / Statistics */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-b from-[#0E2E54] to-[#081C33] rounded-3xl p-6 sm:p-8 border border-blue-800/80 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-blue-800 pb-4">
                  <h2 className="font-serif font-bold text-lg text-white">Trayectoria & Representación</h2>
                  <Badge variant="gold">Oficial</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-900/80 hover:border-cicha-sky/40 transition-all flex flex-col justify-center">
                    <CounterDisplay target={38} prefix="+" className="text-3xl font-extrabold text-[#00AEEF] font-serif" />
                    <p className="text-xs text-slate-300 mt-1 font-medium">Años de Trayectoria Bilateral (1989)</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-900/80 hover:border-blue-400/40 transition-all flex flex-col justify-center">
                    <CounterDisplay target={32} className="text-3xl font-extrabold text-blue-400 font-serif" />
                    <p className="text-xs text-slate-300 mt-1 font-medium">Cámaras Binacionales en UCCEB</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-900/80 hover:border-white/40 transition-all flex flex-col justify-center">
                    <CounterDisplay target={60} suffix="+" className="text-3xl font-extrabold text-white font-serif" />
                    <p className="text-xs text-slate-300 mt-1 font-medium">Países en Red Enterprise Europe Network</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-900/80 hover:border-[#F5A623]/40 transition-all flex flex-col justify-center">
                    <CounterDisplay target={100} suffix="%" className="text-3xl font-extrabold text-[#F5A623] font-serif" />
                    <p className="text-xs text-slate-300 mt-1 font-medium">Articulación Público-Privada</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MISIÓN & OBJETO INSTITUCIONAL EXPANDIDO */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tarjeta de Misión */}
            <div className="bg-gradient-to-br from-[#0B2545]/90 to-[#07172A]/90 p-6 sm:p-7 rounded-3xl border border-cicha-sky/30 shadow-xl space-y-3 backdrop-blur-md relative overflow-hidden group hover:border-cicha-sky/60 transition-all">
              <div className="w-2 rounded-full h-8 bg-[#00AEEF] absolute left-0 top-6" />
              <div className="flex items-center gap-2 text-[#00AEEF]">
                <Target className="w-5 h-5 text-[#00AEEF]" />
                <h3 className="font-serif font-bold text-lg text-white uppercase tracking-wider">
                  Misión
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light text-justify">
                La misión de la Cámara de Industria y Comercio Heleno Argentina, es ser una fuerza creadora -entre Argentina y Grecia- en un ambiente de negocios que contribuya al desarrollo de nuestra sociedad, enmarcando con justicia e igualdad de oportunidades. Promover el desarrollo de negocios sustentables, comercio bilateral, inversión productiva genuina, alentando emprendimientos privados y una economía de mercado, todo eso enmarcado con responsabilidad, ética y transparencia. Articular foros de conocimiento entre sus socios y facilitar el diálogo entre los sectores públicos y privados.
              </p>
            </div>

            {/* Tarjeta de Objeto */}
            <div className="bg-gradient-to-br from-[#0B2545]/90 to-[#07172A]/90 p-6 sm:p-7 rounded-3xl border border-cicha-sky/30 shadow-xl space-y-3 backdrop-blur-md relative overflow-hidden group hover:border-cicha-sky/60 transition-all">
              <div className="w-2 rounded-full h-8 bg-[#F5A623] absolute left-0 top-6" />
              <div className="flex items-center gap-2 text-[#F5A623]">
                <ShieldCheck className="w-5 h-5 text-[#F5A623]" />
                <h3 className="font-serif font-bold text-lg text-white uppercase tracking-wider">
                  Objeto
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light text-justify">
                La Cámara de Industria y Comercio Heleno Argentina, tiene como nucleamiento y representación del empresariado griego o de ascendencia griega, residente en la Argentina, así como en general, de ambos o de terceros países con intereses, operaciones o inversiones en Grecia y/o Argentina.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STRATEGIC ALLIANCES & NETWORKS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <Badge variant="primary">Redes Internacionales</Badge>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-cicha-navy">
            Alianzas Estratégicas y Nodos Globales
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            CICHA articula de manera permanente con los principales organismos y redes empresariales europeas y binacionales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data?.alliances?.map((alliance) => (
            <div
              key={alliance.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                    <Globe2 className="w-6 h-6" />
                  </div>
                  {alliance.highlight_text && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                      {alliance.highlight_text}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-cicha-navy group-hover:text-blue-700 transition-colors">
                    {alliance.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                    {alliance.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Conocer más <ChevronRight className="w-4 h-4" />
                </span>
                {alliance.website_url && (
                  <a
                    href={alliance.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-blue-700 p-1"
                    title="Sitio Oficial"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BILATERAL COMMERCIAL OPPORTUNITIES */}
      <section className="bg-gradient-to-br from-cicha-navy-dark via-cicha-navy to-cicha-navy-deep text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto border-2 border-cicha-sky/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cicha-sky/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-cicha-sky/20">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-cicha-sky text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              Comercio Exterior & Inversión Egea
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
              Oportunidades Comerciales Bilaterales
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-light">
              Demandas y ofertas comerciales activas gestionadas a través de CICHA y el nodo Enterprise Europe Network.
            </p>
          </div>

          <Link
            to="/comercio-bilateral"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cicha-sky to-cicha-aegean hover:from-cicha-sky-hover hover:to-cicha-blue text-white text-xs font-bold shadow-lg shadow-cicha-sky/20 transition-all shrink-0"
          >
            Ver Todas las Oportunidades
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data?.opportunities?.map((opp) => (
            <div
              key={opp.id}
              className="bg-cicha-navy/90 rounded-2xl p-6 border border-cicha-sky/30 hover:border-cicha-sky transition-all flex flex-col justify-between group shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-cicha-sky-light text-cicha-aegean font-bold border border-cicha-sky/30 capitalize">
                    {opp.type}
                  </span>
                  <span className="text-cicha-gold font-medium">
                    {opp.origin_country} ➔ {opp.target_country}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-white group-hover:text-cicha-sky-light transition-colors leading-snug">
                  {opp.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {opp.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-blue-900/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{opp.sector}</span>
                <Link
                  to={`/comercio-bilateral`}
                  className="text-cicha-sky hover:text-cicha-sky-light font-bold flex items-center gap-1"
                >
                  Consultar <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. NEWS & UPCOMING EVENTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Latest Articles (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Actualidad</span>
                <h2 className="font-serif font-bold text-2xl text-cicha-navy">Noticias & Comunicados</h2>
              </div>
              <Link
                to="/noticias"
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
              >
                Ver más noticias <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {data?.featured_articles?.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 group"
                >
                  {article.image_url && (
                    <div className="w-full sm:w-44 h-32 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="flex-1 flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        {article.category_name && (
                          <span className="text-blue-700 font-semibold">{article.category_name}</span>
                        )}
                        <span>•</span>
                        <span>{new Date(article.published_at).toLocaleDateString('es-AR')}</span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-cicha-navy group-hover:text-blue-700 transition-colors leading-snug">
                        <Link to={`/noticias/${article.slug}`}>{article.title}</Link>
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>

                    <Link
                      to={`/noticias/${article.slug}`}
                      className="text-xs font-bold text-blue-700 hover:text-amber-600 transition-colors inline-flex items-center gap-1 pt-1"
                    >
                      Leer artículo completo <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right: Upcoming Events (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Agenda</span>
                <h2 className="font-serif font-bold text-2xl text-cicha-navy">Próximos Eventos</h2>
              </div>
              <Link
                to="/eventos"
                className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1"
              >
                Ver agenda <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {data?.upcoming_events && data.upcoming_events.length > 0 ? (
                data.upcoming_events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-all flex gap-4"
                  >
                    {/* Date Badge */}
                    <div className="w-16 h-16 rounded-xl bg-cicha-navy text-white flex flex-col items-center justify-center shrink-0 border-2 border-amber-400 shadow-sm">
                      <span className="text-lg font-bold font-serif leading-none text-cicha-sky-light">
                        {new Date(event.event_date).getDate()}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-slate-300">
                        {new Date(event.event_date).toLocaleString('es-AR', { month: 'short' })}
                      </span>
                    </div>

                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 capitalize">
                          {event.location_type}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-sm text-cicha-navy leading-snug">
                        {event.title}
                      </h3>

                      <div className="text-xs text-slate-600 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {new Date(event.event_date).toLocaleTimeString('es-AR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          hs
                        </span>
                      </div>

                      {event.registration_url && (
                        <a
                          href={event.registration_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 pt-1"
                        >
                          Inscribirse al evento <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                  No hay eventos programados en este momento.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. MEMBERS DIRECTORY HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 to-cicha-navy rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="gold">Comunidad Empresarial</Badge>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
              Súmese a la Red Empresarial Heleno Argentina
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Integre una comunidad influyente con acceso a Eurocámara, rondas comerciales de la Unión Europea y vínculos institucionales directos con Grecia y el Cono Sur.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 shrink-0">
            <Link
              to="/asociarse"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              Solicitar Afiliación
            </Link>
            <Link
              to="/socios"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-cicha-sky-light" />
              Ver Empresas Socias
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
