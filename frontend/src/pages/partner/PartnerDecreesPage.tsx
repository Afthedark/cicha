import React, { useEffect, useState } from 'react';
import {
  Search,
  ExternalLink,
  Download,
  Calendar,
  FileText,
  Link2,
  Scroll,
  X,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { partnerApi, resolveImageUrl } from '../../services/api';
import type { Decree } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const PartnerDecreesPage: React.FC = () => {
  const [decrees, setDecrees] = useState<Decree[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const fetchDecrees = (q?: string) => {
    partnerApi
      .getDecrees(q)
      .then((data) => {
        setDecrees(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching partner decrees:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDecrees();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDecrees(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchDecrees('');
  };

  const handleOpenDocument = async (decree: Decree) => {
    setDownloadingId(decree.id);
    try {
      const response = await partnerApi.downloadDecree(decree.id);
      const urlToOpen =
        decree.document_type === 'url'
          ? response.url
          : resolveImageUrl(response.url || decree.file_url);

      window.open(urlToOpen, '_blank', 'noopener,noreferrer');
      setDecrees((prev) =>
        prev.map((d) => (d.id === decree.id ? { ...d, downloads: (d.downloads || 0) + 1 } : d))
      );
    } catch (err) {
      const fallbackUrl =
        decree.document_type === 'url' ? decree.file_url : resolveImageUrl(decree.file_url);
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="gold">Marco Jurídico Institucional</Badge>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-cicha-navy" />
              Documentación Oficial
            </span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-cicha-navy tracking-tight">
            Decretos & Resoluciones Oficiales
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Repositorio de decretos de reconocimiento gubernamental en Argentina y Grecia,
            personería jurídica y resoluciones ministeriales bilaterales que respaldan a la Cámara.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl shrink-0">
          <div className="w-10 h-10 rounded-xl bg-cicha-navy text-amber-400 flex items-center justify-center shadow-xs">
            <Scroll className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-[11px] font-bold text-slate-700">Reconocimientos</p>
            <p className="text-[10px] text-slate-500">Arg. 1989 • Grecia 1998</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar decretos por título, número o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cicha-navy/20 focus:border-cicha-navy transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        <div className="text-xs text-slate-500 font-medium">
          Mostrando <strong className="text-cicha-navy">{decrees.length}</strong> {decrees.length === 1 ? 'decreto oficial' : 'decretos oficiales'}
        </div>
      </div>

      {/* Decrees Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader text="Cargando decretos oficiales..." />
        </div>
      ) : decrees.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Scroll className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-800">
              {searchQuery ? 'No se encontraron decretos' : 'Aún no hay decretos publicados'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery
                ? 'Intenta con otro término de búsqueda o limpia el filtro.'
                : 'La administración de la Cámara publicará próximamente los decretos y resoluciones oficiales.'}
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="inline-flex items-center gap-2 text-xs font-bold text-cicha-navy bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-all"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decrees.map((decree) => {
            const isPdf = decree.document_type === 'file';

            return (
              <div
                key={decree.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 group hover:border-slate-300"
              >
                <div className="space-y-4">
                  {/* Top Logo & Badges */}
                  <div className="flex items-start gap-4">
                    {/* Official Logo / Emblem */}
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200/80 p-2 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      {decree.logo_url ? (
                        <img
                          src={resolveImageUrl(decree.logo_url)}
                          alt={decree.title}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Scroll className="w-7 h-7 text-cicha-navy" />
                      )}
                    </div>

                    {/* Badges & Meta */}
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {isPdf ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px] uppercase">
                            <FileText className="w-3 h-3 text-rose-600" />
                            PDF Oficial
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold text-[10px] uppercase">
                            <Link2 className="w-3 h-3 text-cyan-600" />
                            Enlace Web
                          </span>
                        )}

                        {decree.decree_number && (
                          <span className="font-mono text-[10.5px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {decree.decree_number}
                          </span>
                        )}
                      </div>

                      {decree.issue_date && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>
                            {new Date(decree.issue_date).toLocaleDateString('es-AR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-cicha-navy group-hover:text-[#004b87] transition-colors leading-snug line-clamp-2">
                      {decree.title}
                    </h3>
                    {decree.description && (
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {decree.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-[10px] text-slate-400 font-mono">
                    {decree.file_size || (isPdf ? 'Documento PDF' : 'Enlace Oficial')}
                  </div>

                  <button
                    onClick={() => handleOpenDocument(decree)}
                    disabled={downloadingId === decree.id}
                    className="inline-flex items-center justify-center gap-2 bg-cicha-navy hover:bg-[#003866] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-xs hover:shadow group/btn shrink-0"
                  >
                    {downloadingId === decree.id ? (
                      <span>Abriendo...</span>
                    ) : isPdf ? (
                      <>
                        <Download className="w-3.5 h-3.5 text-amber-400 group-hover/btn:translate-y-0.5 transition-transform" />
                        <span>Ver / Descargar PDF</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover/btn:translate-x-0.5 transition-transform" />
                        <span>Abrir Enlace Oficial</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
