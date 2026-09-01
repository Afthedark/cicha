import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Clock,
  User as UserIcon,
  Search,
  ChevronRight,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { publicApi } from '../../services/api';
import type { Blog } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import bgHeader from '../../assets/static/7.webp';

export const BlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await publicApi.getBlogs(
        selectedCategory === 'all' ? undefined : selectedCategory,
        search || undefined
      );
      setBlogs(data.blogs);
      if (data.categories && data.categories.length > 0) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Error loading blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBlogs();
  };

  const featuredBlog = blogs.find((b) => b.is_featured);
  const regularBlogs = blogs.filter((b) => b.id !== featuredBlog?.id);

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Scenic Static Header */}
      <section className="relative bg-[#071E38] text-white py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden min-h-[300px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src={bgHeader}
            alt="Blogs y Artículos Editoriales CICHA"
            className="w-full h-full object-cover object-center transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071E38]/95 via-[#005EAF]/80 to-[#071E38]/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071E38]/90 via-transparent to-black/30" />
        </div>

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <Badge variant="gold">Publicaciones & Análisis</Badge>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight drop-shadow-md">
            Blogs & Artículos Editoriales
          </h1>
          <p className="text-slate-200 text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed drop-shadow">
            Perspectivas, análisis de mercado bilateral e informes especializados de la Cámara de Industria y Comercio Heleno Argentina.
          </p>
        </div>
      </section>

      {/* 2. Main Container with Filter & Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-cicha-navy text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Todos los Artículos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar en los artículos..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </form>
        </div>

        {/* 3. Loading State */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader size="lg" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-serif font-bold text-xl text-cicha-navy">No se encontraron artículos</h3>
            <p className="text-xs text-slate-500">
              No hay publicaciones disponibles para los criterios de búsqueda aplicados.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearch('');
              }}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Blog Highlight (if exists) */}
            {featuredBlog && selectedCategory === 'all' && !search && (
              <div className="bg-gradient-to-br from-cicha-navy via-slate-900 to-cicha-navy rounded-3xl overflow-hidden border border-blue-900 shadow-2xl text-white grid grid-cols-1 lg:grid-cols-12 items-center group">
                <div className="lg:col-span-7 h-64 sm:h-96 relative overflow-hidden bg-slate-800">
                  {featuredBlog.image_url ? (
                    <img
                      src={featuredBlog.image_url}
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <BookOpen className="w-16 h-16" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-md">
                      Artículo Destacado
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-8 sm:p-10 space-y-4">
                  <div className="flex items-center gap-3 text-xs text-cicha-sky-light">
                    <span className="font-bold uppercase tracking-wider">{featuredBlog.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredBlog.read_time || '5 min'}
                    </span>
                  </div>

                  <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white leading-tight">
                    {featuredBlog.title}
                  </h2>

                  {featuredBlog.summary && (
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                      {featuredBlog.summary}
                    </p>
                  )}

                  <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
                    <UserIcon className="w-4 h-4 text-cicha-sky shrink-0" />
                    <span>{featuredBlog.author}</span>
                    {featuredBlog.author_role && <span>({featuredBlog.author_role})</span>}
                  </div>

                  <div className="pt-4">
                    <Link
                      to={`/blogs/${featuredBlog.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cicha-sky to-cicha-aegean hover:from-cicha-sky-hover hover:to-cicha-blue text-white text-xs font-bold shadow-lg transition-all"
                    >
                      Leer Artículo Completo <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Blogs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(featuredBlog && selectedCategory === 'all' && !search ? regularBlogs : blogs).map((b) => (
                <Link
                  key={b.id}
                  to={`/blogs/${b.slug}`}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Cover Photo */}
                    <div className="relative h-52 bg-slate-100 overflow-hidden">
                      {b.image_url ? (
                        <img
                          src={b.image_url}
                          alt={b.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                          <BookOpen className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 text-cicha-navy shadow-sm backdrop-blur-sm">
                          {b.category}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {b.published_at ? new Date(b.published_at).toLocaleDateString('es-AR') : ''}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {b.read_time || '5 min'}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-lg text-cicha-navy group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                        {b.title}
                      </h3>

                      {b.summary && (
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {b.summary}
                        </p>
                      )}

                      <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 border-t border-slate-100">
                        <UserIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="font-medium truncate">{b.author}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                    <span>Leer publicación</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
