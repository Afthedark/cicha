import React, { useEffect, useState } from 'react';
import {
  Images,
  Calendar,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Layers,
  LayoutGrid,
  Play,
  Pause,
  RotateCw,
  Sparkles,
} from 'lucide-react';
import { publicApi } from '../../services/api';
import type { PhotoAlbum, GalleryPhoto } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import bgHeader from '../../assets/static/9.jpeg';

export const GalleryPage: React.FC = () => {
  const [albums, setAlbums] = useState<PhotoAlbum[]>([]);
  const [allPhotos, setAllPhotos] = useState<GalleryPhoto[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'albums' | 'masonry'>('albums');
  const [loading, setLoading] = useState(true);

  // Lightbox Modal State with 3D Cube Transitions & Auto-Play Slideshow
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [lightboxPhotos, setLightboxPhotos] = useState<GalleryPhoto[]>([]);
  const [lightboxTitle, setLightboxTitle] = useState<string>('');
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [playSpeed, setPlaySpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const speedDurations = {
    slow: 6500,
    medium: 4000,
    fast: 2200,
  };

  useEffect(() => {
    fetchGallery();
  }, [selectedCategory]);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const data = await publicApi.getGallery(
        selectedCategory === 'all' ? undefined : selectedCategory
      );
      setAlbums(data.albums || []);
      setAllPhotos(data.all_photos || []);
      if (data.categories && data.categories.length > 0) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Error loading gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  // Open Lightbox from an Album
  const openAlbumLightbox = (album: PhotoAlbum) => {
    setIsAutoPlay(true);
    setSlideDirection('next');
    if (!album.photos || album.photos.length === 0) {
      if (album.cover_image_url) {
        setLightboxPhotos([
          {
            image_url: album.cover_image_url,
            caption: album.title,
            album_title: album.title,
          },
        ]);
        setActivePhotoIndex(0);
        setLightboxTitle(album.title);
      }
      return;
    }

    const photosWithContext = album.photos.map((p) => ({
      ...p,
      album_title: album.title,
      event_date: album.event_date,
    }));

    setLightboxPhotos(photosWithContext);
    setActivePhotoIndex(0);
    setLightboxTitle(album.title);
  };

  // Open Lightbox from Masonry feed
  const openPhotoLightbox = (photoIndex: number) => {
    setIsAutoPlay(true);
    setSlideDirection('next');
    setLightboxPhotos(allPhotos);
    setActivePhotoIndex(photoIndex);
    setLightboxTitle(allPhotos[photoIndex]?.album_title || 'Galería CICHA');
  };

  // Lightbox navigation with directional 3D tracking
  const nextPhoto = () => {
    setSlideDirection('next');
    if (activePhotoIndex !== null && activePhotoIndex < lightboxPhotos.length - 1) {
      setActivePhotoIndex(activePhotoIndex + 1);
    } else {
      setActivePhotoIndex(0);
    }
  };

  const prevPhoto = () => {
    setSlideDirection('prev');
    if (activePhotoIndex !== null && activePhotoIndex > 0) {
      setActivePhotoIndex(activePhotoIndex - 1);
    } else {
      setActivePhotoIndex(lightboxPhotos.length - 1);
    }
  };

  // Auto-Play Slideshow Effect (Pasa automáticamente con velocidad configurable si isAutoPlay es true y no hay hover)
  useEffect(() => {
    if (activePhotoIndex === null || !isAutoPlay || isHovered || lightboxPhotos.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      nextPhoto();
    }, speedDurations[playSpeed]);

    return () => clearInterval(interval);
  }, [activePhotoIndex, isAutoPlay, isHovered, lightboxPhotos.length, playSpeed]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') setActivePhotoIndex(null);
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlay((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, lightboxPhotos]);

  const activePhoto = activePhotoIndex !== null ? lightboxPhotos[activePhotoIndex] : null;

  return (
    <div className="space-y-16 pb-24">
      {/* 1. Scenic Static Header */}
      <section className="relative bg-[#071E38] text-white py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden min-h-[300px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src={bgHeader}
            alt="Galería Institucional CICHA"
            className="w-full h-full object-cover object-center transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071E38]/95 via-[#005EAF]/80 to-[#071E38]/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071E38]/90 via-transparent to-black/30" />
        </div>

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <Badge variant="gold">Registro Visual Institucional</Badge>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight drop-shadow-md">
            Galería Fotográfica
          </h1>
          <p className="text-slate-200 text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed drop-shadow">
            Imágenes de eventos, misiones comerciales, foros empresariales y encuentros bilaterales de la Cámara Heleno Argentina.
          </p>
        </div>
      </section>

      {/* 2. Main Gallery Controls & Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-cicha-navy text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Todas las Categorías
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* View Mode Toggle (Álbumes vs Mosaico continuo) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-2xl shrink-0 self-end md:self-auto">
            <button
              onClick={() => setViewMode('albums')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'albums'
                  ? 'bg-white text-cicha-navy shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Por Álbumes
            </button>
            <button
              onClick={() => setViewMode('masonry')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'masonry'
                  ? 'bg-white text-cicha-navy shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Mosaico Dinámico
            </button>
          </div>
        </div>

        {/* 3. Loading State */}
        {loading ? (
          <div className="py-24 flex justify-center">
            <Loader size="lg" />
          </div>
        ) : albums.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-lg mx-auto">
            <Images className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-serif font-bold text-xl text-cicha-navy">No hay álbumes fotográficos</h3>
            <p className="text-xs text-slate-500">
              Próximamente se publicarán nuevas fotografías de los encuentros y actividades institucionales.
            </p>
          </div>
        ) : viewMode === 'albums' ? (
          /* 4. View Mode: ALBUMS GRID WITH 3D CUBE ELEVATION */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-container">
            {albums.map((alb) => (
              <div
                key={alb.id}
                onClick={() => openAlbumLightbox(alb)}
                className="cube-card-3d bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-3">
                  {/* Album Cover */}
                  <div className="relative h-60 bg-slate-100 overflow-hidden">
                    {alb.cover_image_url ? (
                      <img
                        src={alb.cover_image_url}
                        alt={alb.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                        <Camera className="w-12 h-12" />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 text-cicha-navy shadow-sm backdrop-blur-sm">
                        {alb.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="px-3 py-1 rounded-xl text-xs font-bold bg-black/80 text-white backdrop-blur-md flex items-center gap-1.5 shadow-md">
                        <Camera className="w-3.5 h-3.5 text-cicha-sky" />
                        {alb.photos_count || (alb.photos ? alb.photos.length : 0)} fotos
                      </span>
                    </div>
                  </div>

                  {/* Album Info */}
                  <div className="p-6 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{alb.event_date ? new Date(alb.event_date).toLocaleDateString('es-AR') : 'Reciente'}</span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-cicha-navy group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                      {alb.title}
                    </h3>

                    {alb.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {alb.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Ver álbum con efecto 3D
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 5. View Mode: MASONRY / MOSAICO DINÁMICO 3D */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 perspective-container">
            {allPhotos.map((photo, pIdx) => (
              <div
                key={pIdx}
                onClick={() => openPhotoLightbox(pIdx)}
                className="cube-card-3d relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm cursor-pointer group break-inside-avoid bg-slate-100"
              >
                <img
                  src={photo.image_url}
                  alt={photo.caption || photo.album_title || 'Foto de galería'}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Hover overlay with caption & album name */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                  {photo.album_category && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cicha-sky">
                      {photo.album_category}
                    </span>
                  )}
                  <h4 className="font-serif font-bold text-sm leading-tight text-white">
                    {photo.caption || photo.album_title}
                  </h4>
                  {photo.event_date && (
                    <p className="text-[11px] text-slate-300 pt-1">
                      {new Date(photo.event_date).toLocaleDateString('es-AR')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Visor Lightbox a Pantalla Completa 3D con Desplazamiento Automático */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn select-none">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
                  {lightboxTitle}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Cubo 3D
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Foto {(activePhotoIndex || 0) + 1} de {lightboxPhotos.length}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Speed Selector Pill (Lento, Medio, Rápido) */}
              {lightboxPhotos.length > 1 && (
                <div className="flex items-center gap-0.5 bg-white/10 p-0.5 rounded-xl border border-white/10 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setPlaySpeed('slow')}
                    className={`px-2 py-1 rounded-lg font-bold transition-all ${
                      playSpeed === 'slow'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                    title="Velocidad lenta (6.5s) con zoom suave"
                  >
                    Lento
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlaySpeed('medium')}
                    className={`px-2 py-1 rounded-lg font-bold transition-all ${
                      playSpeed === 'medium'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                    title="Velocidad media (4.0s)"
                  >
                    Medio
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlaySpeed('fast')}
                    className={`px-2 py-1 rounded-lg font-bold transition-all ${
                      playSpeed === 'fast'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                    title="Velocidad rápida (2.2s)"
                  >
                    Rápido
                  </button>
                </div>
              )}

              {/* Play / Pause Toggle Button */}
              {lightboxPhotos.length > 1 && (
                <button
                  type="button"
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    isAutoPlay
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                  }`}
                  title={isAutoPlay ? 'Pausar reproducción automática' : 'Iniciar reproducción automática'}
                >
                  {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{isAutoPlay ? 'Auto' : 'Reproducir'}</span>
                </button>
              )}

              <a
                href={activePhoto.image_url}
                target="_blank"
                rel="noreferrer"
                download
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Descargar Foto"
              >
                <Download className="w-4 h-4" />
              </a>

              <button
                onClick={() => setActivePhotoIndex(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition-colors"
                title="Cerrar visor (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Photo Area with 3D Cube Perspective Container */}
          <div
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden perspective-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Prev Button */}
            {lightboxPhotos.length > 1 && (
              <button
                onClick={prevPhoto}
                className="absolute left-2 sm:left-6 w-12 h-12 rounded-full bg-black/60 hover:bg-blue-600 text-white flex items-center justify-center z-20 backdrop-blur-sm border border-white/20 transition-all hover:scale-110 shadow-xl"
                title="Anterior (Flecha izquierda)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Photo Center con Animación de Giro 3D en Cubo y Efecto Zoom In/Out Ken-Burns */}
            <div
              key={`${activePhotoIndex}_${slideDirection}`}
              className={`max-w-5xl max-h-[75vh] flex items-center justify-center p-2 ${
                slideDirection === 'next' ? 'animate-cube-next' : 'animate-cube-prev'
              }`}
            >
              <img
                src={activePhoto.image_url}
                alt={activePhoto.caption || 'Foto ampliada'}
                className={`max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10 ${
                  isAutoPlay
                    ? playSpeed === 'slow'
                      ? 'animate-zoom-pulse-slow'
                      : playSpeed === 'fast'
                      ? 'animate-zoom-pulse-fast'
                      : 'animate-zoom-pulse'
                    : ''
                }`}
              />
            </div>

            {/* Next Button */}
            {lightboxPhotos.length > 1 && (
              <button
                onClick={nextPhoto}
                className="absolute right-2 sm:right-6 w-12 h-12 rounded-full bg-black/60 hover:bg-blue-600 text-white flex items-center justify-center z-20 backdrop-blur-sm border border-white/20 transition-all hover:scale-110 shadow-xl"
                title="Siguiente (Flecha derecha)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Caption & Thumbnails */}
          <div className="text-center text-white space-y-2.5 border-t border-white/10 pt-3">
            {activePhoto.caption && (
              <p className="text-xs sm:text-sm text-slate-200 font-serif italic max-w-xl mx-auto drop-shadow-sm">
                "{activePhoto.caption}"
              </p>
            )}

            {/* Micro Thumbnail Strip */}
            {lightboxPhotos.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1 max-w-2xl mx-auto">
                {lightboxPhotos.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSlideDirection(idx >= (activePhotoIndex || 0) ? 'next' : 'prev');
                      setActivePhotoIndex(idx);
                    }}
                    className={`w-11 h-11 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activePhotoIndex === idx
                        ? 'border-cicha-sky scale-110 shadow-lg ring-2 ring-blue-500/50'
                        : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img src={p.image_url} alt="Miniatura" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
