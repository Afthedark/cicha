import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Gift,
  Tag,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Percent,
  Layers,
  Award,
} from 'lucide-react';
import { publicApi, resolveImageUrl } from '../../services/api';
import type { PartnerBenefit, Category } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { useLanguage } from '../../context/LanguageContext';
import bgHeader from '../../assets/static/4.jpeg';

export const BenefitsPage: React.FC = () => {
  const { t } = useLanguage();
  const [benefits, setBenefits] = useState<PartnerBenefit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBenefits = () => {
    setLoading(true);
    publicApi
      .getBenefits(
        selectedCategory === 'all' ? undefined : selectedCategory,
        searchQuery.trim() || undefined
      )
      .then((res) => {
        if (res) {
          setBenefits(res.benefits || []);
          if (res.categories && res.categories.length > 0) {
            setCategories(res.categories);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando beneficios públicos:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBenefits();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBenefits();
  };

  const getCategoryColor = (catName?: string) => {
    switch (catName?.toLowerCase()) {
      case 'logística & transporte':
      case 'logistica & transporte':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'networking internacional':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'servicios profesionales':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'comercio exterior':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'asesoría legal & tributaria':
      case 'asesoria legal & tributaria':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'hotelería & eventos':
      case 'hoteleria & eventos':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-16 pb-24">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden bg-cicha-navy-deep text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-400 shadow-2xl text-center">
        <div className="absolute inset-0 z-0">
          <img
            src={bgHeader}
            alt="Beneficios y Convenios CICHA"
            className="w-full h-full object-cover object-center transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071E38]/95 via-[#005EAF]/85 to-[#071E38]/95" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071E38]/95 via-transparent to-black/40" />
        </div>

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <Badge variant="gold">
            <Gift className="w-3.5 h-3.5 inline mr-1" />
            {t('benefits.badge', 'Red de Beneficios & Convenios')}
          </Badge>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight drop-shadow-md">
            {t('benefits.title', 'Club de Beneficios y Alianzas Comerciales')}
          </h1>
          <p className="text-slate-200 text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed drop-shadow">
            {t(
              'benefits.subtitle',
              'Acuerdos preferenciales, bonificaciones en comercio exterior, logística, asesoría técnica y ventajas exclusivas impulsadas por la red de empresas socias de CICHA.'
            )}
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* 2. Search & Category Filters Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por beneficio, empresa o rubro..."
                className="w-full pl-11 pr-24 py-3 rounded-2xl border border-slate-300 focus:border-[#005EAF] focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm text-slate-800 transition-all outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-[#004b87] hover:bg-[#071E38] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Buscar
              </button>
            </form>

            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3.5 py-2 rounded-xl">
                {benefits.length} {benefits.length === 1 ? 'convenio activo' : 'convenios activos'}
              </span>
              <Link
                to="/asociarse"
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Asociarme para Acceder
              </Link>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#004b87] text-white shadow-md shadow-blue-900/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              Todos los Convenios
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'bg-[#004b87] text-white shadow-md shadow-blue-900/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Benefits Grid */}
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <Loader text="Cargando convenios y beneficios..." size="lg" />
          </div>
        ) : benefits.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center space-y-4">
            <Gift className="w-16 h-16 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No se encontraron beneficios en esta categoría</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Intenta cambiar la categoría o prueba buscando con otro término.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 bg-[#004b87] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#071E38] transition-all cursor-pointer"
            >
              Ver todos los beneficios
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {benefits.map((ben) => {
              const catClass = getCategoryColor(ben.category);
              return (
                <div
                  key={ben.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400/80 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Top */}
                  <div className="p-6 sm:p-7 space-y-4">
                    {/* Header: Provider Logo / Icon + Category */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 text-[#004b87] flex items-center justify-center font-bold shrink-0 shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
                        {ben.logo_url ? (
                          <img
                            src={resolveImageUrl(ben.logo_url)}
                            alt={ben.provider_company}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 className="w-6 h-6 text-[#004b87]" />
                        )}
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${catClass}`}
                      >
                        {ben.category || 'Convenio'}
                      </span>
                    </div>

                    {/* Titles */}
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                        {ben.provider_company}
                      </p>
                      <h3 className="font-serif font-bold text-lg text-slate-900 leading-snug group-hover:text-[#004b87] transition-colors">
                        {ben.title}
                      </h3>
                    </div>

                    {/* Discount Highlight Box */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300/40 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-amber-700 font-extrabold text-xs">
                        <Percent className="w-4 h-4" />
                        <span>Beneficio / Descuento:</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                        {ben.discount_description}
                      </p>
                    </div>

                    {/* Validity if present */}
                    {ben.valid_until && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium pt-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Vigencia: Hasta el {new Date(ben.valid_until).toLocaleDateString('es-AR')}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom / CTA */}
                  <div className="p-4 sm:p-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Exclusivo Socios</span>
                    </div>

                    <Link
                      to="/asociarse"
                      className="px-3.5 py-2 bg-[#004b87] hover:bg-[#071E38] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <span>Obtener</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. Bottom CTA: Sumar Convenios a CICHA */}
        <section className="bg-gradient-to-r from-[#071E38] via-[#004b87] to-[#071E38] rounded-3xl p-8 sm:p-12 text-white border border-blue-700/80 shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl relative z-10">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-400/30">
              ¿Tu empresa ofrece servicios bilaterales?
            </span>
            <h3 className="font-serif font-extrabold text-2xl sm:text-3xl text-white">
              Publica un Beneficio Exclusivo en la Red CICHA
            </h3>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Forma parte del catálogo institucional de convenios y posiciona tus servicios ante directivos de empresas helénicas y argentinas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 relative z-10">
            <Link
              to="/contacto"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all text-center"
            >
              Contactar al Directorio
            </Link>
            <Link
              to="/asociarse"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs shadow-lg transition-all text-center"
            >
              Solicitar Membresía
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
