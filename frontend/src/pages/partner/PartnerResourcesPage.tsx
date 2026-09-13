import React, { useEffect, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { partnerApi, adminApi, resolveImageUrl } from '../../services/api';
import type { PartnerResource, Category } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const PartnerResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<PartnerResource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    partnerApi
      .getResources(category)
      .then((res) => {
        setResources(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [category]);

  useEffect(() => {
    partnerApi
      .getCategories('members')
      .then((cats) => {
        if (cats && cats.length > 0) {
          setCategories(cats);
        }
      })
      .catch((err) => {
        console.error('Error cargando categorías para recursos:', err);
      });
  }, []);

  const handleDownload = async (res: PartnerResource) => {
    setDownloadingId(res.id);
    try {
      const response = await partnerApi.downloadResource(res.id);
      const targetUrl = resolveImageUrl(response.url || res.file_url);
      window.open(targetUrl, '_blank');
      // Update local download count
      setResources((prev) =>
        prev.map((r) => (r.id === res.id ? { ...r, downloads: r.downloads + 1 } : r))
      );
    } catch (err) {
      window.open(resolveImageUrl(res.file_url), '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-cicha-navy via-[#004b87] to-cicha-navy p-6 sm:p-8 rounded-3xl border border-blue-400/20 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="gold">Biblioteca Exclusiva</Badge>
          <h1 className="font-serif font-bold text-2xl text-white mt-1">
            Informes, Guías y Circulares Comerciales
          </h1>
          <p className="text-xs text-sky-200 mt-1">
            Documentación estratégica confidencial reservada para socios de la Cámara.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#003866]/85 p-3 rounded-2xl border border-blue-400/20 shadow-lg">
        <button
          onClick={() => setCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            category === 'all'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md'
              : 'bg-white/5 text-sky-200 hover:bg-white/10 hover:text-white'
          }`}
        >
          Todos los Documentos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.name)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              category === cat.name
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md'
                : 'bg-white/5 text-sky-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Resources List */}
      {loading ? (
        <Loader text="Cargando biblioteca de socios..." />
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((res) => (
            <div
              key={res.id}
              className="bg-[#003866]/85 rounded-3xl p-6 border border-blue-400/20 hover:border-cicha-sky/40 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-cicha-sky/20 text-sky-200 border border-cicha-sky/30">
                    {res.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-sky-200/70 font-medium">{res.file_size}</span>
                </div>

                <h3 className="font-serif font-bold text-base text-white group-hover:text-amber-300 transition-colors break-words">
                  {res.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed break-words whitespace-pre-line">{res.description}</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-sky-200/70 font-medium">{res.downloads} descargas registradas</span>
                <button
                  onClick={() => handleDownload(res)}
                  disabled={downloadingId === res.id}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold inline-flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  {downloadingId === res.id ? 'Descargando...' : 'Descargar Archivo'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#003866]/85 rounded-3xl border border-blue-400/20 shadow-xl space-y-2">
          <FileText className="w-10 h-10 text-sky-300 mx-auto" />
          <p className="text-sm font-semibold text-white">No hay documentos en esta categoría.</p>
          <p className="text-xs text-sky-200">Pronto se cargarán nuevos informes sectoriales.</p>
        </div>
      )}
    </div>
  );
};
