import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Clock,
  User as UserIcon,
  ArrowLeft,
  Share2,
  Tag,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { publicApi } from '../../services/api';
import type { Blog } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchBlogDetail(slug);
    }
  }, [slug]);

  const fetchBlogDetail = async (blogSlug: string) => {
    setLoading(true);
    try {
      const data = await publicApi.getBlog(blogSlug);
      setBlog(data.blog);
      setRelated(data.related || []);
    } catch (err) {
      console.error('Error fetching blog detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="py-32 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <BookOpen className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="font-serif font-bold text-2xl text-cicha-navy">Artículo no encontrado</h2>
        <p className="text-xs text-slate-500">
          La publicación solicitada no existe o fue despublicada temporalmente.
        </p>
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="space-y-12 pb-24">
      {/* 1. Header Hero */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-blue-900">
        <div className="max-w-4xl mx-auto space-y-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-xs font-bold text-cicha-sky hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a Blogs & Artículos
          </Link>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">
                {blog.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-300">
                <Clock className="w-3.5 h-3.5" />
                {blog.read_time || '5 min de lectura'}
              </span>
            </div>

            <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
              {blog.title}
            </h1>
          </div>

          {/* Author bar */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-900 border border-blue-700 flex items-center justify-center text-cicha-sky font-bold">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">{blog.author}</p>
                {blog.author_role && <p className="text-[11px] text-slate-400">{blog.author_role}</p>}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-cicha-sky" />
                {blog.published_at ? new Date(blog.published_at).toLocaleDateString('es-AR') : ''}
              </span>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
              >
                <Share2 className="w-3.5 h-3.5" />
                {copied ? '¡Enlace Copiado!' : 'Compartir'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Cover Photo & Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {blog.image_url && (
          <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 max-h-[500px]">
            <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        {blog.summary && (
          <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 text-sm sm:text-base text-cicha-navy font-serif italic leading-relaxed">
            "{blog.summary}"
          </div>
        )}

        {/* Article Body */}
        <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-6 whitespace-pre-line font-light">
          {blog.content}
        </div>

        {/* Tags */}
        {blog.tags && (
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-2">
              <Tag className="w-3.5 h-3.5" /> Etiquetas:
            </span>
            {blog.tags.split(',').map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Author Bio Box */}
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-cicha-navy text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck className="w-8 h-8 text-cicha-sky" />
          </div>
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-base text-cicha-navy">{blog.author}</h4>
            <p className="text-xs text-blue-700 font-semibold">{blog.author_role || 'Publicación Editorial Oficial'}</p>
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              Artículo elaborado para la Cámara de Industria y Comercio Heleno Argentina (CICHA) en el marco de la integración bilateral y las redes de Eurocámara y EEN.
            </p>
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="pt-12 border-t border-slate-200 space-y-6">
            <h3 className="font-serif font-bold text-xl text-cicha-navy">
              Artículos Relacionados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/blogs/${rel.slug}`}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {rel.category}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-cicha-navy group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span>{rel.read_time || '5 min'}</span>
                    <span className="font-bold text-blue-600 flex items-center gap-0.5">
                      Leer <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
