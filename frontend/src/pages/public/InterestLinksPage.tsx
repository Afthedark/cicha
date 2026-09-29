import React, { useEffect, useState } from 'react';
import {
  Globe,
  Search,
  ExternalLink,
  Tag,
  Star,
  Building2,
  Landmark,
  Compass,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  X,
  Link2,
} from 'lucide-react';
import { publicApi, resolveImageUrl } from '../../services/api';
import type { InterestLink, Category } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const InterestLinksPage: React.FC = () => {
  const [links, setLinks] = useState<InterestLink[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const data = await publicApi.getInterestLinks();
      setLinks(data.links || []);
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching interest links:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  // Filter links
  const filteredLinks = links.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.category_name && item.category_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' ||
      item.category_slug === selectedCategory ||
      (selectedCategory === 'uncategorized' && !item.category_id);

    return matchesSearch && matchesCategory;
  });

  const featuredLinks = links.filter((l) => Number(l.is_featured) === 1);

  return (
    <div className="space-y-12 pb-24">
      {/* 1. Hero Header */}
      <section className="bg-gradient-to-br from-cicha-navy via-[#002f57] to-[#001f3f] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-blue-900/50 relative overflow-hidden">
        {/* Subtle decorative background elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              Directorio de Enlaces Institucionales
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-sky-200 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
              Fuentes Verificadas
            </span>
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="font-serif font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              Links de Interés & Portales Oficiales
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              Guía de acceso a organismos gubernamentales de Argentina y Grecia, embajadas, cámaras binacionales de Eurocámara, aduanas, plataformas de comercio exterior y herramientas clave para el ecosistema empresarial.
            </p>
          </div>

          {/* Search bar inside Hero */}
          <div className="pt-2 max-w-xl">
            <div className="relative">
              <Search className="w-4 h-4 text-sky-300 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar enlaces por organismo, nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-10 py-3.5 text-xs sm:text-sm rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-sky-200/60 focus:bg-white focus:text-slate-900 focus:placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400 transition-all shadow-inner font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sky-200 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Category Filter Pills */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-blue-600" /> Categorías:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-cicha-navy text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
            }`}
          >
            Todos ({links.length})
          </button>

          {categories.map((cat) => {
            const count = links.filter((l) => l.category_slug === cat.slug || l.category_id === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.slug
                    ? 'bg-cicha-navy text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    selectedCategory === cat.slug ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading / Results */}
        {loading ? (
          <div className="py-24 flex justify-center">
            <Loader text="Cargando enlaces de interés..." size="lg" />
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="py-20 px-6 text-center rounded-3xl bg-slate-50 border border-dashed border-slate-200 space-y-4 max-w-lg mx-auto">
            <Globe className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-slate-800">No se encontraron enlaces</h3>
              <p className="text-xs text-slate-500">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Intente modificar los términos de búsqueda o cambiar de categoría.'
                  : 'Próximamente se incorporarán nuevos enlaces de interés.'}
              </p>
            </div>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={handleClearSearch}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Grid of All Filtered Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLinks.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400/60 transition-all duration-300 flex flex-col justify-between p-6 group relative overflow-hidden"
                >
                  {/* Top accent border on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cicha-navy via-blue-600 to-cicha-sky opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-4">
                    {/* Top Row: Logo and Badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200/80 p-2 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        {item.logo_url ? (
                          <img
                            src={resolveImageUrl(item.logo_url)}
                            alt={item.title}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Globe className="w-7 h-7 text-blue-700" />
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {Number(item.is_featured) === 1 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            Destacado
                          </span>
                        )}
                        {item.category_name && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-100 text-right">
                            {item.category_name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2">
                      <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-light">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer Action Button */}
                  <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400 font-mono truncate max-w-[140px] sm:max-w-[180px]">
                      {item.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </span>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all shrink-0 group/btn"
                    >
                      <span>Visitar portal</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterestLinksPage;
