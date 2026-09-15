import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Calendar,
  User,
  ArrowRight,
  Tag,
  Newspaper,
  Sparkles,
  ShieldCheck,
  Star,
  ChevronRight,
} from 'lucide-react';
import { partnerApi } from '../../services/api';
import type { PartnerNewsItem } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const PartnerNewsPage: React.FC = () => {
  const [news, setNews] = useState<PartnerNewsItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    fetchNews();
  }, [searchParams]);

  const fetchNews = () => {
    setLoading(true);
    const category = searchParams.get('category') || undefined;
    const q = searchParams.get('q') || undefined;

    partnerApi
      .getNews(category, q)
      .then((res) => {
        setNews(res.news || []);
        setCategories(res.categories || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleCategoryClick = (cat: string) => {
    if (cat === activeCategory) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchParams.set('q', searchTerm.trim());
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

  const featuredItem = news.find((n) => Number(n.is_featured) === 1) || news[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner Exclusivo del Portal */}
      <div className="bg-gradient-to-r from-cicha-navy via-[#004b87] to-cicha-navy p-6 sm:p-10 rounded-3xl border border-blue-400/20 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <Badge variant="gold" className="bg-amber-400/20 text-amber-300 border-amber-400/40">
            Boletín Privado de Socios
          </Badge>
          <h1 className="font-serif font-bold text-2xl sm:text-4xl text-white tracking-tight">
            Boletín Informativo & Comunicados
          </h1>
          <p className="text-xs sm:text-sm text-sky-200 max-w-2xl leading-relaxed">
            Actualizaciones corporativas, acuerdos bilaterales, resoluciones de comisión y novedades estratégicas exclusivas para miembros de CICHA.
          </p>
        </div>

        {/* Search Bar in Header */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80 relative z-10">
          <input
            type="text"
            placeholder="Buscar comunicados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-xs rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-sky-200/60 focus:bg-white focus:text-slate-900 focus:placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400 transition-all shadow-inner"
          />
          <Search className="w-4 h-4 text-sky-300 absolute left-3.5 top-3.5" />
        </form>
      </div>

      {/* Category Pills Filter Bar */}
      <div className="bg-[#003866]/85 rounded-2xl p-4 sm:p-5 border border-blue-400/20 shadow-lg flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-amber-300 mr-2 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-amber-400" />
          Filtrar por Tema:
        </span>
        <button
          onClick={() => {
            searchParams.delete('category');
            setSearchParams(searchParams);
          }}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            !activeCategory
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md'
              : 'bg-white/5 text-sky-200 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          Todos los Comunicados
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md'
                : 'bg-white/5 text-sky-200 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {loading ? (
        <Loader text="Cargando boletín de noticias..." />
      ) : news.length > 0 ? (
        <div className="space-y-8">
          {/* Featured Article Card (if present and not searching/filtering specific categories) */}
          {featuredItem && !activeCategory && !searchTerm && (
            <div className="bg-[#003866]/90 rounded-3xl border border-blue-400/30 overflow-hidden shadow-2xl hover:border-amber-400/50 transition-all group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-slate-950" />
                        Destacado de la Semana
                      </span>
                      <span className="text-xs font-bold text-sky-200">{featuredItem.category}</span>
                    </div>

                    <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white group-hover:text-amber-300 transition-colors leading-tight">
                      <Link to={`/portal-socios/boletin/${featuredItem.slug}`}>{featuredItem.title}</Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed [overflow-wrap:anywhere] line-clamp-3">
                      {featuredItem.summary || featuredItem.content}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-xs text-sky-200">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{featuredItem.published_at ? featuredItem.published_at.slice(0, 10) : 'Reciente'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-sky-300" />
                        <span>{featuredItem.author}</span>
                      </div>
                    </div>

                    <Link
                      to={`/portal-socios/boletin/${featuredItem.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all group-hover:gap-3"
                    >
                      <span>Leer Comunicado Completo</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-slate-900">
                  {featuredItem.image_url ? (
                    <img
                      src={featuredItem.image_url}
                      alt={featuredItem.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-tr from-cicha-navy to-blue-900 text-sky-300">
                      <Newspaper className="w-16 h-16 opacity-30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#003866]/80 via-transparent to-transparent lg:hidden" />
                </div>
              </div>
            </div>
          )}

          {/* Regular News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {news.map((item) => (
              <article
                key={item.id}
                className="bg-[#003866]/85 rounded-3xl border border-blue-400/20 overflow-hidden shadow-lg hover:border-blue-300/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Article Image */}
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#002d52] to-[#004b87] text-sky-300">
                        <Newspaper className="w-10 h-10 opacity-40" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#002b4d]/90 text-sky-200 backdrop-blur-md border border-white/20">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-[11px] text-sky-200/80">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{item.published_at ? item.published_at.slice(0, 10) : '—'}</span>
                      </div>
                      <span className="text-white/30">•</span>
                      <div className="flex items-center gap-1 truncate max-w-[140px]">
                        <User className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                        <span className="truncate">{item.author}</span>
                      </div>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-white group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug">
                      <Link to={`/portal-socios/boletin/${item.slug}`}>{item.title}</Link>
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed [overflow-wrap:anywhere] line-clamp-3">
                      {item.summary || item.content}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 pb-6 pt-2 border-t border-white/10 flex items-center justify-between">
                  <Link
                    to={`/portal-socios/boletin/${item.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors group-hover:translate-x-1 duration-200"
                  >
                    <span>Leer comunicado</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <span className="text-[10px] font-bold text-sky-200/60 uppercase tracking-wider">
                    Exclusivo
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#003866]/85 rounded-3xl p-12 border border-blue-400/20 text-center space-y-4">
          <Newspaper className="w-12 h-12 text-sky-300/40 mx-auto" />
          <h3 className="font-serif font-bold text-xl text-white">No se encontraron comunicados</h3>
          <p className="text-xs text-sky-200 max-w-md mx-auto">
            {searchTerm || activeCategory
              ? 'No hay comunicados que coincidan con los criterios de búsqueda seleccionados.'
              : 'Próximamente se publicarán nuevas circulares y análisis de comercio en el boletín.'}
          </p>
        </div>
      )}
    </div>
  );
};
