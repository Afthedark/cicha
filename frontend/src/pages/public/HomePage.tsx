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
  CheckCircle2,
  Briefcase,
  Users,
  ExternalLink,
} from 'lucide-react';
import { publicApi } from '../../services/api';
import type { HomeData } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const HomePage: React.FC = () => {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader text="Cargando portal institucional..." size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B2545] via-[#071E38] to-[#040D1A] text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Diplomatic Badges */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-amber-400/40 text-amber-300 text-xs font-semibold shadow-inner">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Reconocida por Gobiernos de Argentina (1989) y Grecia (1998)</span>
              </div>

              <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                Impulsando el Comercio Bilateral e Inversiones entre{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300">
                  Grecia y Argentina
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
                {data?.mision?.content ||
                  'Fuerza creadora en un ambiente de negocios que contribuye al desarrollo de nuestra sociedad con responsabilidad, ética y transparencia. Nucleamos el empresariado heleno y articulamos foros de conocimiento y diálogo.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/asociarse"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  Solicitar Membresía / Asociarse
                </Link>

                <Link
                  to="/comercio-bilateral"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm backdrop-blur-sm transition-all flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  Oportunidades Comerciales
                </Link>
              </div>

              {/* Strategic Node Highlights */}
              <div className="pt-4 border-t border-blue-900/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
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
                  <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-900">
                    <p className="text-3xl font-extrabold text-amber-400 font-serif">+35</p>
                    <p className="text-xs text-slate-300 mt-1 font-medium">Años de Trayectoria Bilateral (1989)</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-900">
                    <p className="text-3xl font-extrabold text-blue-400 font-serif">32</p>
                    <p className="text-xs text-slate-300 mt-1 font-medium">Cámaras Binacionales en UCCEB</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-900">
                    <p className="text-3xl font-extrabold text-emerald-400 font-serif">60+</p>
                    <p className="text-xs text-slate-300 mt-1 font-medium">Países en Red Enterprise Europe Network</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-900">
                    <p className="text-3xl font-extrabold text-purple-400 font-serif">100%</p>
                    <p className="text-xs text-slate-300 mt-1 font-medium">Articulación Público-Privada</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-900/30 border border-blue-700/50 space-y-2">
                  <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    Objeto de la Cámara
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Nucleamiento y representación del empresariado griego o de ascendencia griega en Argentina, y empresas de ambos países con intereses e inversiones en Grecia y Argentina.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STRATEGIC ALLIANCES & NETWORKS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <Badge variant="primary">Redes Internacionales</Badge>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#0B2545]">
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
                  <h3 className="font-serif font-bold text-lg text-[#0B2545] group-hover:text-blue-700 transition-colors">
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
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto border border-blue-900 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-blue-800">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              Comercio Exterior & Inversión
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
              Oportunidades Comerciales Bilaterales
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Demandas y ofertas comerciales activas gestionadas a través de CICHA y el nodo Enterprise Europe Network.
            </p>
          </div>

          <Link
            to="/comercio-bilateral"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shrink-0"
          >
            Ver Todas las Oportunidades
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data?.opportunities?.map((opp) => (
            <div
              key={opp.id}
              className="bg-[#0B2545] rounded-2xl p-6 border border-blue-800/80 hover:border-amber-400/60 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-900 text-blue-300 font-semibold border border-blue-700 capitalize">
                    {opp.type}
                  </span>
                  <span className="text-amber-400 font-medium">
                    {opp.origin_country} ➔ {opp.target_country}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-white group-hover:text-amber-300 transition-colors leading-snug">
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
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
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
                <h2 className="font-serif font-bold text-2xl text-[#0B2545]">Noticias & Comunicados</h2>
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

                      <h3 className="font-serif font-bold text-base text-[#0B2545] group-hover:text-blue-700 transition-colors leading-snug">
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
                <h2 className="font-serif font-bold text-2xl text-[#0B2545]">Próximos Eventos</h2>
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
                    <div className="w-16 h-16 rounded-xl bg-[#0B2545] text-white flex flex-col items-center justify-center shrink-0 border-2 border-amber-400 shadow-sm">
                      <span className="text-lg font-bold font-serif leading-none text-amber-300">
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

                      <h3 className="font-serif font-bold text-sm text-[#0B2545] leading-snug">
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
        <div className="bg-gradient-to-r from-blue-900 to-[#0B2545] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
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
              <Users className="w-4 h-4 text-amber-300" />
              Ver Empresas Socias
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
