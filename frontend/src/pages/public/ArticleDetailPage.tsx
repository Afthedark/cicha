import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Globe2, ChevronRight } from 'lucide-react';
import { publicApi } from '../../services/api';
import type { Article } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

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
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {article.author}
            </span>
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
            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Article Body Content */}
        <div
          className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

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
    </div>
  );
};
