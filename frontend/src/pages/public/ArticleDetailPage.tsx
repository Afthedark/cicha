import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Globe2,
  ChevronRight,
  Link2,
  ExternalLink,
  FileText,
  Eye,
  Download,
} from 'lucide-react';
import { publicApi, resolveImageUrl } from '../../services/api';
import type { Article, ArticleSourceLink } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { PdfViewerModal } from '../../components/common/PdfViewerModal';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    publicApi
      .getArticleBySlug(slug)
      .then((res) => {
        setArticle(res.article);
        setRelated(res.related || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  // Helper to parse sources
  const getSourceLinks = (): ArticleSourceLink[] => {
    if (!article?.source_links) return [];
    if (Array.isArray(article.source_links)) return article.source_links;
    if (typeof article.source_links === 'string') {
      try {
        const parsed = JSON.parse(article.source_links);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const sourceLinks = getSourceLinks();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader text="Cargando artículo..." size="lg" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center space-y-4">
        <h1 className="font-serif font-bold text-2xl text-slate-800">Artículo no encontrado</h1>
        <p className="text-xs text-slate-500">El contenido solicitado no existe o ha sido despublicado.</p>
        <Link
          to="/noticias"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a Noticias
        </Link>
      </div>
    );
  }

  const hasPdf = Boolean(article.file_url);

  return (
    <div className="space-y-12 pb-20">
      {/* Top Breadcrumb */}
      <div className="bg-slate-100 border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8 text-xs text-slate-600">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-blue-700">Inicio</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/noticias" className="hover:text-blue-700">Noticias</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold truncate max-w-xs">{article.title}</span>
        </div>
      </div>

      {/* Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header info */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {article.category_name && <Badge variant="primary">{article.category_name}</Badge>}
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {new Date(article.published_at).toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Author & Organization Header Info */}
            <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
              {article.author_avatar_url ? (
                <img
                  src={resolveImageUrl(article.author_avatar_url)}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover border border-slate-300"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
              <span className="text-xs font-semibold text-slate-700">{article.author}</span>
              {article.logo_url && (
                <img
                  src={resolveImageUrl(article.logo_url)}
                  alt="Logo"
                  className="w-5 h-5 rounded object-contain border border-slate-200 bg-white"
                  title="Entidad asociada"
                />
              )}
            </div>
          </div>

          <h1 className="font-serif font-extrabold text-2xl sm:text-3xl lg:text-4xl text-cicha-navy leading-tight">
            {article.title}
          </h1>

          {article.summary && (
            <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed italic border-l-4 border-cicha-sky pl-4 py-1 bg-amber-50/50 rounded-r-lg">
              {article.summary}
            </p>
          )}
        </div>

        {/* Featured Image */}
        {article.image_url && (
          <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 max-h-[480px]">
            <img src={resolveImageUrl(article.image_url)} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* PDF Document Bar if attached */}
        {hasPdf && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm text-slate-900">
                  {article.file_name || 'Documento Oficial Adjunto (PDF)'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {article.file_size ? `${article.file_size} • ` : ''}Disponible para lectura interactiva y descarga oficial.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setPdfModalOpen(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Ver en Visor PDF</span>
              </button>

              <a
                href={resolveImageUrl(article.file_url)}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs transition-all"
                title="Descargar archivo"
              >
                <Download className="w-4 h-4 text-slate-500" />
              </a>
            </div>
          </div>
        )}

        {/* Article Body Content */}
        {article.content && (
          <div
            className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}

        {/* Sources and Reference Links Section */}
        {sourceLinks.length > 0 && (
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-50/80 via-sky-50/50 to-slate-50 border border-blue-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-cicha-navy font-serif font-bold text-sm sm:text-base border-b border-blue-200/60 pb-2">
              <Link2 className="w-4 h-4 text-blue-600" />
              <span>Fuentes & Enlaces Consultados</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {sourceLinks.map((src, idx) => (
                <a
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 text-xs text-slate-800 hover:text-blue-700 transition-all shadow-2xs group"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-bold block truncate group-hover:text-blue-700">
                      {src.title || 'Enlace de referencia'}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate font-mono mt-0.5">
                      {src.url}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer info & Back */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/noticias"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-900"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al catálogo de noticias
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Cámara de Industria y Comercio Heleno Argentina</span>
          </div>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="pt-12 space-y-6">
            <h3 className="font-serif font-bold text-xl text-cicha-navy">Noticias Relacionadas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/noticias/${rel.slug}`}
                  className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 transition-all space-y-2 group block"
                >
                  <p className="text-[11px] text-slate-500">
                    {new Date(rel.published_at).toLocaleDateString('es-AR')}
                  </p>
                  <h4 className="font-serif font-bold text-xs text-slate-900 group-hover:text-blue-700 leading-snug line-clamp-2">
                    {rel.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* PDF Modal Viewer */}
      {hasPdf && (
        <PdfViewerModal
          isOpen={pdfModalOpen}
          onClose={() => setPdfModalOpen(false)}
          url={resolveImageUrl(article.file_url)}
          title={article.title}
          fileName={article.file_name}
          fileSize={article.file_size}
        />
      )}
    </div>
  );
};
