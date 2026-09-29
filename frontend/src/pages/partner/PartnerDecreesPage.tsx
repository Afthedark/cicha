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
  Eye,
  BookOpen,
  Layers,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { partnerApi, resolveImageUrl } from '../../services/api';
import type { Decree } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { PdfViewerModal } from '../../components/common/PdfViewerModal';

export const PartnerDecreesPage: React.FC = () => {
  const [decrees, setDecrees] = useState<Decree[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Reading Modal for Text or Both
  const [readingDecree, setReadingDecree] = useState<Decree | null>(null);
  const [copied, setCopied] = useState(false);

  // PDF Viewer Modal
  const [pdfModal, setPdfModal] = useState<{ isOpen: boolean; url: string; title: string; fileName?: string; fileSize?: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

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

  const handleOpenDocument = (decree: Decree) => {
    if (decree.document_type === 'text') {
      setCopied(false);
      setReadingDecree(decree);
      return;
    }

    if (decree.document_type === 'url') {
      window.open(decree.file_url, '_blank', 'noopener,noreferrer');
      return;
    }

    setPdfModal({
      isOpen: true,
      url: resolveImageUrl(decree.file_url),
      title: decree.title,
      fileName: decree.file_name,
      fileSize: decree.file_size,
    });
  };

  const handleCopyContent = () => {
    if (!readingDecree?.content) return;
    navigator.clipboard.writeText(readingDecree.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cicha-navy via-[#004b87] to-cicha-navy p-6 sm:p-8 rounded-3xl border border-blue-400/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="gold">Marco Normativo & Validez Oficial</Badge>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-200 bg-cicha-sky/20 border border-cicha-sky/30 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              Documentación Oficial
            </span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-white tracking-tight">
            Decretos Oficiales & Resoluciones
          </h1>
          <p className="text-xs sm:text-sm text-sky-200 max-w-2xl">
            Repositorio de decretos de reconocimiento gubernamental en Argentina y Grecia,
            personería jurídica y resoluciones ministeriales bilaterales que respaldan a la Cámara.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-3 p-3 bg-white/10 border border-white/20 rounded-2xl shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-md">
            <Scroll className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <p className="text-[11px] font-bold text-white">Reconocimientos</p>
            <p className="text-[10px] text-sky-200">Arg. 1989 • Grecia 1998</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#003866]/85 p-4 rounded-2xl border border-blue-400/20 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-sky-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar decretos por título, número o descripción..."
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

        <div className="text-xs text-sky-200 font-medium">
          Mostrando <strong className="text-white font-bold">{decrees.length}</strong> {decrees.length === 1 ? 'decreto oficial' : 'decretos oficiales'}
        </div>
      </div>

      {/* Decrees Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader text="Cargando decretos oficiales..." />
        </div>
      ) : decrees.length === 0 ? (
        <div className="bg-[#003866]/85 rounded-3xl p-12 text-center border border-blue-400/20 shadow-xl space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-sky-300">
            <Scroll className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-white">
              {searchQuery ? 'No se encontraron decretos' : 'Aún no hay decretos publicados'}
            </h3>
            <p className="text-xs text-sky-200 mt-1">
              {searchQuery
                ? 'Intenta con otro término de búsqueda o limpia el filtro.'
                : 'La administración de la Cámara publicará próximamente los decretos y resoluciones oficiales.'}
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decrees.map((decree) => {
            const isPdf = decree.document_type === 'file';
            const isText = decree.document_type === 'text';
            const isBoth = decree.document_type === 'both';

            return (
              <div
                key={decree.id}
                className="bg-[#003866]/85 rounded-2xl border border-blue-400/20 shadow-xl hover:shadow-2xl hover:border-cicha-sky/40 transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 group"
              >
                <div className="space-y-4">
                  {/* Top Logo & Badges */}
                  <div className="flex items-start gap-4">
                    {/* Official Logo / Emblem Container */}
                    <div className="w-14 h-14 rounded-2xl bg-white/95 border border-white/40 p-2 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
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
                        {isBoth ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-200 border border-purple-400/30 font-bold text-[10px] uppercase">
                            <Layers className="w-3 h-3 text-purple-300" />
                            Texto + PDF
                          </span>
                        ) : isText ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-200 border border-amber-400/30 font-bold text-[10px] uppercase">
                            <FileText className="w-3 h-3 text-amber-300" />
                            Texto Digital
                          </span>
                        ) : isPdf ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-200 border border-rose-400/30 font-bold text-[10px] uppercase">
                            <FileText className="w-3 h-3 text-rose-300" />
                            PDF Oficial
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 font-bold text-[10px] uppercase">
                            <Link2 className="w-3 h-3 text-cyan-300" />
                            Enlace Web
                          </span>
                        )}

                        {decree.decree_number && (
                          <span className="font-mono text-[10.5px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded">
                            {decree.decree_number}
                          </span>
                        )}
                      </div>

                      {decree.issue_date && (
                        <div className="flex items-center gap-1 text-[11px] text-sky-200/80">
                          <Calendar className="w-3 h-3 text-sky-300" />
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

                  {/* Optional Cover Image */}
                  {(decree.cover_image_url || decree.image_url) && (
                    <div className="h-32 rounded-xl overflow-hidden border border-white/10 bg-slate-900">
                      <img
                        src={resolveImageUrl(decree.cover_image_url || decree.image_url)}
                        alt={decree.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors leading-snug break-words">
                      {decree.title}
                    </h3>
                    {(decree.summary || decree.description) && (
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed break-words whitespace-pre-line line-clamp-3">
                        {decree.summary || decree.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                  {/* Author / Entity line */}
                  {(decree.author || decree.author_avatar_url) && (
                    <div className="flex items-center gap-2 text-[11px] text-sky-200">
                      {decree.author_avatar_url ? (
                        <img
                          src={resolveImageUrl(decree.author_avatar_url)}
                          alt=""
                          className="w-5 h-5 rounded-full object-cover border border-white/20"
                        />
                      ) : null}
                      <span className="truncate">{decree.author || 'Poder Ejecutivo / CICHA'}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[10px] text-sky-200/70 font-mono">
                      {decree.file_size || (isPdf ? 'Documento PDF' : 'Resolución Oficial')}
                    </div>

                    {isBoth ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setCopied(false);
                            setReadingDecree(decree);
                          }}
                          className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer"
                        >
                          Texto
                        </button>
                        <button
                          onClick={() => handleOpenDocument(decree)}
                          className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black py-2 px-3.5 rounded-xl transition-all shadow-md cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-950" />
                          <span>Ver PDF</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenDocument(decree)}
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black py-2.5 px-4 rounded-xl transition-all shadow-md group/btn shrink-0 cursor-pointer"
                      >
                        {isText ? (
                          <>
                            <BookOpen className="w-3.5 h-3.5 text-slate-950" />
                            <span>Leer Decreto</span>
                          </>
                        ) : isPdf ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                            <span>Abrir Visor PDF</span>
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                            <span>Abrir Enlace Oficial</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Lector de Decreto Digital Completo */}
      {readingDecree && (
        <Modal
          isOpen={Boolean(readingDecree)}
          onClose={() => setReadingDecree(null)}
          title="Transcripción Oficial del Decreto / Resolución"
        >
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {readingDecree.decree_number && (
                  <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs font-mono">
                    {readingDecree.decree_number}
                  </span>
                )}
                {readingDecree.issue_date && (
                  <span className="text-xs text-blue-900 font-semibold">
                    Fecha de Emisión: {readingDecree.issue_date}
                  </span>
                )}
              </div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-cicha-navy leading-snug">
                {readingDecree.title}
              </h2>
              {(readingDecree.summary || readingDecree.description) && (
                <p className="text-xs text-slate-600 italic border-l-2 border-blue-400 pl-3">
                  {readingDecree.summary || readingDecree.description}
                </p>
              )}
            </div>

            {/* Texto Completo */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 max-h-[55vh] overflow-y-auto space-y-4 font-serif text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line select-text">
              {readingDecree.content}
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
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
                onClick={() => setReadingDecree(null)}
                className="px-5 py-2 rounded-xl bg-cicha-navy hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Cerrar
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

export default PartnerDecreesPage;
