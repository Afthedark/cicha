import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Tag,
  Newspaper,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { partnerApi } from '../../services/api';
import type { PartnerNewsItem } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const PartnerNewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<PartnerNewsItem | null>(null);
  const [related, setRelated] = useState<PartnerNewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      partnerApi
        .getNewsDetail(slug)
        .then((res) => {
          setItem(res.item);
          setRelated(res.related || []);
          setLoading(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Loader text="Cargando comunicado oficial..." size="lg" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="bg-[#003866]/85 rounded-3xl p-12 border border-blue-400/20 text-center space-y-4 max-w-xl mx-auto my-12">
        <Newspaper className="w-12 h-12 text-sky-300/40 mx-auto" />
        <h2 className="font-serif font-bold text-xl text-white">Comunicado no encontrado</h2>
        <p className="text-xs text-sky-200">
          El artículo o boletín seleccionado no existe o fue despublicado.
        </p>
        <Link
          to="/portal-socios/boletin"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Boletín</span>
        </Link>
      </div>
    );
  }

  const paragraphs = (item.content || '').split('\n').filter((p) => p.trim().length > 0);

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          to="/portal-socios/boletin"
          className="inline-flex items-center gap-2 text-xs font-bold text-sky-300 hover:text-white transition-colors bg-[#003866]/60 px-4 py-2 rounded-xl border border-blue-400/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Boletín de Socios</span>
        </Link>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Información Exclusiva para Socios
        </span>
      </div>

      {/* Main Article Container */}
      <article className="bg-[#003866]/90 rounded-3xl border border-blue-400/25 overflow-hidden shadow-2xl">
        {/* Hero Header */}
        <div className="p-6 sm:p-10 space-y-5 border-b border-white/10 bg-gradient-to-b from-[#004b87]/60 to-transparent">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-sm">
              {item.category}
            </span>
            <span className="text-xs text-sky-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {item.published_at ? item.published_at.slice(0, 10) : 'Fecha reciente'}
            </span>
            <span className="text-white/30">•</span>
            <span className="text-xs text-sky-200 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-300" />
              {item.author}
            </span>
          </div>

          <h1 className="font-serif font-bold text-2xl sm:text-4xl lg:text-[40px] text-white leading-tight tracking-tight">
            {item.title}
          </h1>

          {item.summary && (
            <p className="text-sm sm:text-base text-sky-100 font-medium leading-relaxed italic border-l-3 border-amber-400 pl-4 bg-white/5 py-2 rounded-r-xl">
              {item.summary}
            </p>
          )}
        </div>

        {/* Featured Image */}
        {item.image_url && (
          <div className="w-full max-h-[460px] bg-slate-950 overflow-hidden relative">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 sm:p-12 space-y-6 text-slate-100 leading-relaxed text-sm sm:text-base font-sans">
          {paragraphs.map((p, idx) => (
            <p key={idx} className="[overflow-wrap:anywhere] text-justify leading-loose">
              {p}
            </p>
          ))}
        </div>

        {/* Footer info box */}
        <div className="p-6 sm:p-8 bg-[#002b4d] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-sky-200">
            <Newspaper className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Publicado por la Secretaría de Comercio & Prensa de la Cámara Heleno Argentina (CICHA).</span>
          </div>

          <Link
            to="/portal-socios/boletin"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all shrink-0"
          >
            Ver más comunicados
          </Link>
        </div>
      </article>

      {/* Related News Carousel / Grid */}
      {related.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Otros Comunicados Recientes
            </h3>
            <Link
              to="/portal-socios/boletin"
              className="text-xs font-bold text-sky-300 hover:text-white transition-colors"
            >
              Ver todos &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((rel) => (
              <Link
                key={rel.id}
                to={`/portal-socios/boletin/${rel.slug}`}
                className="bg-[#003866]/85 p-5 rounded-2xl border border-blue-400/20 hover:border-amber-400/40 transition-all space-y-3 block group"
              >
                <div className="flex items-center justify-between text-[10px] text-sky-200">
                  <span className="font-bold text-amber-400">{rel.category}</span>
                  <span>{rel.published_at ? rel.published_at.slice(0, 10) : '—'}</span>
                </div>
                <h4 className="font-serif font-bold text-sm text-white group-hover:text-sky-300 transition-colors line-clamp-2">
                  {rel.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 [overflow-wrap:anywhere]">
                  {rel.summary || rel.content}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
