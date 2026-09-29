import React, { useEffect, useState } from 'react';
import {
  FileText,
  Search,
  ExternalLink,
  Download,
  Calendar,
  User,
  CheckCircle2,
  X,
  FileCheck2,
  Tag,
  Filter,
  Link2,
  BookOpen,
  Printer,
  Copy,
  Check,
  Eye,
  Layers,
} from 'lucide-react';
import { partnerApi, resolveImageUrl } from '../../services/api';
import type { PartnerMinute, Category } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { PdfViewerModal } from '../../components/common/PdfViewerModal';

export const parseMinuteCategories = (minute: PartnerMinute): string[] => {
  if (Array.isArray(minute.categories)) {
    return minute.categories.filter(Boolean);
  }
  if (typeof minute.categories === 'string' && minute.categories.trim()) {
    try {
      const parsed = JSON.parse(minute.categories);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter(Boolean);
      }
    } catch {
      // not JSON
    }
  }
  if (minute.category && minute.category.trim()) {
    return minute.category.split(',').map((c) => c.trim()).filter(Boolean);
  }
  return ['Asamblea General'];
};

export const PartnerMinutesPage: React.FC = () => {
  const [minutes, setMinutes] = useState<PartnerMinute[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'title_asc' | 'category'>('date_desc');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Reading Modal State (For Text or Both)
  const [readingMinute, setReadingMinute] = useState<PartnerMinute | null>(null);
  const [copied, setCopied] = useState(false);

  // PDF Viewer Modal State
  const [pdfModal, setPdfModal] = useState<{ isOpen: boolean; url: string; title: string; fileName?: string; fileSize?: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  const fetchCategories = () => {
    partnerApi
      .getCategories('minutes')
      .then((data) => {
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          const defaults = [
            { id: 1, name: 'Asamblea General', slug: 'asamblea-general', type: 'minutes' },
            { id: 2, name: 'Comisión Directiva', slug: 'comision-directiva', type: 'minutes' },
            { id: 3, name: 'Resoluciones Institucionales', slug: 'resoluciones-institucionales', type: 'minutes' },
            { id: 4, name: 'TEAM EUROPE', slug: 'team-europe', type: 'minutes' },
            { id: 5, name: 'UCCEB', slug: 'ucceb', type: 'minutes' },
            { id: 6, name: 'ECA', slug: 'eca', type: 'minutes' },
          ];
          setCategories(defaults as Category[]);
        }
      })
      .catch(() => {
        setCategories([
          { id: 1, name: 'Asamblea General', slug: 'asamblea-general', type: 'minutes' },
          { id: 2, name: 'Comisión Directiva', slug: 'comision-directiva', type: 'minutes' },
          { id: 3, name: 'Resoluciones Institucionales', slug: 'resoluciones-institucionales', type: 'minutes' },
          { id: 4, name: 'TEAM EUROPE', slug: 'team-europe', type: 'minutes' },
          { id: 5, name: 'UCCEB', slug: 'ucceb', type: 'minutes' },
          { id: 6, name: 'ECA', slug: 'eca', type: 'minutes' },
        ] as Category[]);
      });
  };

  const fetchMinutes = (q?: string) => {
    setLoading(true);
    partnerApi
      .getMinutes(q)
      .then((data) => {
        setMinutes(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching partner minutes:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
    fetchMinutes();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMinutes(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchMinutes('');
  };

  // Client-side multi-category filtering & sorting
  const filteredMinutes = minutes
    .filter((m) => {
      if (selectedCategory === 'all') return true;
      const cats = parseMinuteCategories(m);
      return cats.includes(selectedCategory);
    })
    .sort((a, b) => {
      if (sortBy === 'date_desc') {
        return (b.meeting_date || b.created_at || '').localeCompare(a.meeting_date || a.created_at || '');
      }
      if (sortBy === 'date_asc') {
        return (a.meeting_date || a.created_at || '').localeCompare(b.meeting_date || b.created_at || '');
      }
      if (sortBy === 'title_asc') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'category') {
        const catA = parseMinuteCategories(a)[0] || '';
        const catB = parseMinuteCategories(b)[0] || '';
        return catA.localeCompare(catB);
      }
      return 0;
    });

  const handleOpenDocument = (minute: PartnerMinute) => {
    if (minute.document_type === 'text') {
      setCopied(false);
      setReadingMinute(minute);
      return;
    }

    if (minute.document_type === 'url') {
      window.open(minute.file_url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Open in interactive PDF Viewer modal
    setPdfModal({
      isOpen: true,
      url: resolveImageUrl(minute.file_url),
      title: minute.title,
      fileName: minute.file_name,
      fileSize: minute.file_size,
    });
  };

  const handleCopyContent = () => {
    if (!readingMinute?.content) return;
    navigator.clipboard.writeText(readingMinute.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cicha-navy via-[#004b87] to-cicha-navy p-6 sm:p-8 rounded-3xl border border-blue-400/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="gold">Módulo Exclusivo de Socios</Badge>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-200 bg-cicha-sky/20 border border-cicha-sky/30 px-2.5 py-0.5 rounded-full">
              <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
              Certificado por Secretaría General
            </span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-white tracking-tight">
            Actas & Resoluciones Institucionales
          </h1>
          <p className="text-xs sm:text-sm text-sky-200 max-w-2xl">
            Espacio oficial de consulta y lectura de resúmenes de: Actas de asambleas, reuniones de comisión directiva y resoluciones certificadas por la Cámara, como también resúmenes de reuniones con otras entidades tales como TEAM EUROPE, UCCEB, ECA etc.
          </p>
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div className="bg-[#003866]/85 p-4 rounded-2xl border border-blue-400/20 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-sky-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título, contenido o fecha..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-white/10 text-white placeholder:text-sky-200/60 border border-white/10 rounded-xl focus:bg-white/15 focus:outline-hidden focus:ring-2 focus:ring-cicha-sky focus:border-cicha-sky transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sky-300 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs text-sky-200 font-medium whitespace-nowrap">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl text-xs bg-white/10 text-white border border-white/15 focus:bg-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="date_desc" className="bg-slate-900 text-white">Más recientes</option>
              <option value="date_asc" className="bg-slate-900 text-white">Más antiguas</option>
              <option value="title_asc" className="bg-slate-900 text-white">Título (A-Z)</option>
              <option value="category" className="bg-slate-900 text-white">Por Categoría</option>
            </select>
          </div>

          <div className="text-xs text-sky-200 font-medium whitespace-nowrap">
            Mostrando <strong className="text-white font-bold">{filteredMinutes.length}</strong> {filteredMinutes.length === 1 ? 'acta' : 'actas'}
          </div>
        </div>
      </div>

      {/* Filter bar by Categories */}
      <div className="bg-[#003866]/85 rounded-2xl p-4 sm:p-5 border border-blue-400/20 shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 w-full">
          <span className="text-xs font-bold text-amber-300 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" /> Categoría:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md'
                : 'bg-white/5 text-sky-200 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            Todas ({minutes.length})
          </button>
          {categories.map((cat) => {
            const count = minutes.filter((m) => parseMinuteCategories(m).includes(cat.name)).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.name
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-white/5 text-sky-200 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat.name ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-white/10 text-sky-200'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Minutes List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader text="Cargando actas de socios..." />
        </div>
      ) : filteredMinutes.length === 0 ? (
        <div className="bg-[#003866]/85 rounded-3xl p-12 text-center border border-blue-400/20 shadow-xl space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-sky-300">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-white">
              {searchQuery || selectedCategory !== 'all' ? 'No se encontraron actas con ese criterio' : 'No hay actas disponibles en esta sección'}
            </h3>
            <p className="text-xs text-sky-200 mt-1">
              {searchQuery || selectedCategory !== 'all'
                ? 'Intenta con otro término de búsqueda o limpia el filtro.'
                : 'Las nuevas actas y resoluciones oficiales serán publicadas por la Secretaría General.'}
            </p>
          </div>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                handleClearSearch();
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMinutes.map((minute) => {
            const isText = minute.document_type === 'text';
            const isPdf = minute.document_type === 'file';
            const isBoth = minute.document_type === 'both';
            const minuteCats = parseMinuteCategories(minute);

            return (
              <div
                key={minute.id}
                className="bg-[#003866]/85 rounded-2xl border border-blue-400/20 shadow-xl hover:shadow-2xl hover:border-cicha-sky/40 transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 group"
              >
                <div className="space-y-4">
                  {/* Top Badges & Document Type */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {minuteCats.map((catName, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold text-[10px] uppercase tracking-wider"
                        >
                          <Tag className="w-2.5 h-2.5 text-amber-400" />
                          {catName}
                        </span>
                      ))}

                      {isBoth ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-200 border border-purple-400/30 font-bold text-[10px] uppercase tracking-wider">
                          <Layers className="w-2.5 h-2.5 text-purple-300" />
                          Texto + PDF
                        </span>
                      ) : isText ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-400/30 font-bold text-[10px] uppercase tracking-wider">
                          <FileText className="w-3 h-3 text-amber-300" />
                          Acta Digital
                        </span>
                      ) : isPdf ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-200 border border-rose-400/30 font-bold text-[10px] uppercase tracking-wider">
                          <FileText className="w-3 h-3 text-rose-300" />
                          PDF Oficial
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 font-bold text-[10px] uppercase tracking-wider">
                          <Link2 className="w-3 h-3 text-cyan-300" />
                          Enlace Externo
                        </span>
                      )}

                      {minute.meeting_date && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-sky-200 bg-white/10 px-2 py-0.5 rounded-md font-medium">
                          <Calendar className="w-3.5 h-3.5 text-sky-300" />
                          {new Date(minute.meeting_date).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Optional Cover Image */}
                  {(minute.cover_image_url || minute.image_url) && (
                    <div className="h-32 rounded-xl overflow-hidden border border-white/10 bg-slate-900">
                      <img
                        src={resolveImageUrl(minute.cover_image_url || minute.image_url)}
                        alt={minute.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors leading-snug break-words">
                      {minute.title}
                    </h3>
                    {(minute.summary || minute.description) && (
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed break-words whitespace-pre-line line-clamp-3">
                        {minute.summary || minute.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Meta & Action Button */}
                <div className="mt-6 pt-4 border-t border-white/10 space-y-4">
                  {/* Partner / Author Details with Avatar and Logo */}
                  <div className="flex items-center justify-between text-[11px] text-sky-200">
                    <div className="flex items-center gap-2 min-w-0">
                      {minute.author_avatar_url ? (
                        <img
                          src={resolveImageUrl(minute.author_avatar_url)}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover border border-white/20 shrink-0"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 font-bold text-xs shrink-0 overflow-hidden">
                          <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
                        </div>
                      )}
                      <div className="min-w-0 truncate">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-white truncate">
                            {minute.user_name || minute.author || 'Secretaría General CICHA'}
                          </p>
                          {minute.logo_url && (
                            <img
                              src={resolveImageUrl(minute.logo_url)}
                              alt="Logo"
                              className="w-4 h-4 rounded object-contain bg-white/90 p-0.5 shrink-0"
                            />
                          )}
                        </div>
                        <p className="text-[10px] text-sky-300/70 truncate">
                          Publicado el{' '}
                          {new Date(minute.created_at).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {minute.file_size && (
                      <span className="text-[10px] text-sky-200 font-mono bg-white/10 px-1.5 py-0.5 rounded shrink-0 border border-white/10">
                        {minute.file_size}
                      </span>
                    )}
                  </div>

                  {/* Actions depending on modality */}
                  {isBoth ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setCopied(false);
                          setReadingMinute(minute);
                        }}
                        className="inline-flex items-center justify-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all border border-white/20 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                        <span>Leer Texto</span>
                      </button>
                      <button
                        onClick={() => handleOpenDocument(minute)}
                        className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black py-2.5 px-3 rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-950" />
                        <span>Ver PDF</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenDocument(minute)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black py-2.5 px-4 rounded-xl transition-all shadow-md group/btn cursor-pointer"
                    >
                      {isText ? (
                        <>
                          <BookOpen className="w-4 h-4 text-slate-950" />
                          <span>Leer Resumen / Acta</span>
                        </>
                      ) : isPdf ? (
                        <>
                          <Eye className="w-4 h-4 text-slate-950" />
                          <span>Abrir Visor PDF Oficial</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4 text-slate-950" />
                          <span>Ver Documento Oficial</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Lector de Acta Digital Completa (para texto o ambos) */}
      {readingMinute && (
        <Modal
          isOpen={Boolean(readingMinute)}
          onClose={() => setReadingMinute(null)}
          title="Transcripción Oficial del Acta"
        >
          <div className="space-y-5">
            {/* Header del Acta */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {parseMinuteCategories(readingMinute).map((catName, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs">
                      {catName}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-blue-900 font-semibold">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Sesión del: {readingMinute.meeting_date || 'N/A'}</span>
                </div>
              </div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-cicha-navy leading-snug">
                {readingMinute.title}
              </h2>
              {(readingMinute.summary || readingMinute.description) && (
                <p className="text-xs text-slate-600 italic border-l-2 border-blue-400 pl-3">
                  {readingMinute.summary || readingMinute.description}
                </p>
              )}
            </div>

            {/* Cuerpo del Acta en Formato Institucional */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 max-h-[55vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs text-slate-500 font-medium">
                <span>Certificación: Secretaría General CICHA</span>
                <span>
                  {readingMinute.content ? `${readingMinute.content.split(/\s+/).filter(Boolean).length} palabras` : ''}
                </span>
              </div>
              <div className="font-serif text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line select-text">
                {readingMinute.content}
              </div>
            </div>

            {/* Footer de Acciones del Lector */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyContent}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir</span>
                </button>
                {readingMinute.file_url && (
                  <button
                    type="button"
                    onClick={() => {
                      const min = readingMinute;
                      setReadingMinute(null);
                      setPdfModal({
                        isOpen: true,
                        url: resolveImageUrl(min.file_url),
                        title: min.title,
                        fileName: min.file_name,
                        fileSize: min.file_size,
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-all border border-blue-200 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>Ver PDF Adjunto</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setReadingMinute(null)}
                className="px-5 py-2 rounded-xl bg-cicha-navy hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Cerrar Lectura
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* PDF Interactive Viewer Modal */}
      <PdfViewerModal
        isOpen={pdfModal.isOpen}
        onClose={() => setPdfModal({ isOpen: false, url: '', title: '' })}
        url={pdfModal.url}
        title={pdfModal.title}
        fileName={pdfModal.fileName}
        fileSize={pdfModal.fileSize}
      />
    </div>
  );
};

export default PartnerMinutesPage;
