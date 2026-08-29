import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { publicApi } from '../../services/api';
import type { Article } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import bgHeader from '../../assets/static/4.jpeg';

export const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Array<{ id: number; name: string; slug: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    fetchArticles();
  }, [searchParams]);

  const fetchArticles = () => {
    setLoading(true);
    const category = searchParams.get('category') || undefined;
    const q = searchParams.get('q') || undefined;

    publicApi
      .getArticles(category, q)
      .then((res) => {
        setArticles(res.articles || []);
        setCategories(res.categories || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleCategoryClick = (slug: string) => {
    if (slug === activeCategory) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
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

  return (
    <div className="space-y-16 pb-20">
      {/* Banner */}
      <section className="relative overflow-hidden bg-cicha-navy-deep text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-cicha-sky text-center shadow-xl">
        {/* Background Static Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgHeader}
            alt="Noticias y Prensa CICHA"
            className="w-full h-full object-cover object-center transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071E38]/95 via-[#005EAF]/80 to-[#071E38]/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071E38]/90 via-transparent to-black/30" />
        </div>

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <Badge variant="primary" className="bg-white/20 text-white border-white/30 backdrop-blur-md">
            Prensa & Novedades Helénicas
          </Badge>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight drop-shadow-md">
            Noticias y Comunicados Institucionales
          </h1>
          <p className="text-slate-200 text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed drop-shadow">
            Actualidad sobre relaciones bilaterales, acuerdos comerciales, actividades en Eurocámara y la red Enterprise Europe Network.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search and Filters Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Categories Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => {
                searchParams.delete('category');
                setSearchParams(searchParams);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                !activeCategory
                  ? 'bg-cicha-navy text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat.slug
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Buscar noticias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <Loader text="Cargando noticias..." />
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {article.image_url ? (
                    <div className="h-48 overflow-hidden bg-slate-100">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-32 bg-gradient-to-br from-blue-900 to-cicha-navy flex items-center justify-center text-cicha-sky-light font-serif font-bold text-2xl">
                      CICHA
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      {article.category_name && (
                        <span className="text-blue-700 font-bold">{article.category_name}</span>
                      )}
                      <span>•</span>
                      <span>{new Date(article.published_at).toLocaleDateString('es-AR')}</span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-cicha-navy group-hover:text-blue-700 transition-colors leading-snug">
                      <Link to={`/noticias/${article.slug}`}>{article.title}</Link>
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {article.author}
                  </span>
                  <Link
                    to={`/noticias/${article.slug}`}
                    className="font-bold text-blue-700 hover:text-amber-600 flex items-center gap-1 transition-colors"
                  >
                    Leer nota <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-2">
            <p className="text-sm font-semibold text-slate-700">No se encontraron artículos.</p>
            <p className="text-xs text-slate-500">Intente con otros términos de búsqueda.</p>
          </div>
        )}
      </section>
    </div>
  );
};
