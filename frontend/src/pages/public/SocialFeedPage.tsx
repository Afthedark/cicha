import React, { useEffect, useState } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export const SocialFeedPage: React.FC = () => {
  const [fbIframeLoaded, setFbIframeLoaded] = useState(false);
  const [igIframeLoaded, setIgIframeLoaded] = useState(false);

  const fbPageUrl = 'https://www.facebook.com/camarahelenoargentina';
  const igPageUrl = 'https://www.instagram.com/camarahelenoargentina?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==';

  // Codificar URL para el plugin oficial de Facebook
  const encodedFbUrl = encodeURIComponent(fbPageUrl);
  const fbIframeSrc = `https://www.facebook.com/plugins/page.php?href=${encodedFbUrl}&tabs=timeline&width=500&height=850&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=`;

  // Iframe para Instagram Embed
  const igEmbedSrc = 'https://www.instagram.com/camarahelenoargentina/embed';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B2545] via-[#005EAF] to-[#00AEEF] text-white py-10 px-6 sm:px-10 rounded-3xl shadow-xl border border-white/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/30 text-white text-xs font-bold shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#F5A623]" />
            <span>Publicaciones Oficiales en Vivo • Facebook & Instagram</span>
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            Post & Redes Sociales
          </h1>

          <p className="text-white/90 text-sm sm:text-base font-light leading-relaxed">
            Manténgase al día con las últimas actividades, foros comerciales, recepciones diplomáticas y novedades comunitarias de la <strong>Cámara de Industria y Comercio Heleno Argentina</strong>.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <a
              href={fbPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs sm:text-sm shadow-lg transition-all hover:scale-105"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook Oficial
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={igPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg transition-all hover:scale-105"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram Oficial
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Grid: Facebook Feed + Instagram Feed Lado a Lado */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Columna 1: Muro Oficial de Facebook */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div>
                <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900 leading-tight">
                  Facebook Oficial
                </h2>
                <p className="text-xs text-slate-500">@camarahelenoargentina</p>
              </div>
            </div>

            <Badge variant="primary">En Vivo</Badge>
          </div>

          {/* Facebook Widget Container */}
          <div className="relative w-full overflow-hidden flex justify-center bg-slate-50 rounded-2xl border border-slate-200 p-2 min-h-[650px]">
            {!fbIframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-slate-50 z-10 text-slate-500">
                <div className="w-8 h-8 border-4 border-[#1877F2] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-medium">Cargando muro de Facebook...</p>
              </div>
            )}

            <iframe
              src={fbIframeSrc}
              width="500"
              height="850"
              style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              title="Muro de Facebook Oficial de CICHA"
              onLoad={() => setFbIframeLoaded(true)}
              className="rounded-xl w-full"
            />
          </div>
        </div>

        {/* Columna 2: Feed Oficial de Instagram */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <div>
                <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900 leading-tight">
                  Instagram Oficial
                </h2>
                <p className="text-xs text-slate-500">@camarahelenoargentina</p>
              </div>
            </div>

            <a
              href={igPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold px-3 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100 transition-colors flex items-center gap-1"
            >
              Seguir
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Instagram Embed Container */}
          <div className="relative w-full overflow-hidden flex justify-center bg-slate-50 rounded-2xl border border-slate-200 p-2 min-h-[650px]">
            {!igIframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-slate-50 z-10 text-slate-500">
                <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-medium">Cargando publicaciones de Instagram...</p>
              </div>
            )}

            <iframe
              src={igEmbedSrc}
              width="500"
              height="850"
              style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              title="Feed de Instagram Oficial de CICHA"
              onLoad={() => setIgIframeLoaded(true)}
              className="rounded-xl w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
