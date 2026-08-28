import React, { useEffect, useState } from 'react';
import { FileDown, Download, FileText, Filter, Search, CheckCircle } from 'lucide-react';
import { partnerApi } from '../../services/api';
import type { PartnerResource } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const PartnerResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<PartnerResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    fetchResources();
  }, [category]);

  const fetchResources = () => {
    setLoading(true);
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
  };

  const handleDownload = async (res: PartnerResource) => {
    setDownloadingId(res.id);
    try {
      const response = await partnerApi.downloadResource(res.id);
      window.open(response.url, '_blank');
      // Update local download count
      setResources((prev) =>
        prev.map((r) => (r.id === res.id ? { ...r, downloads: r.downloads + 1 } : r))
      );
    } catch (err) {
      alert('Descarga iniciada: ' + res.title);
      window.open(res.file_url, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  const categories = [
    { label: 'Todos los Documentos', value: 'all' },
    { label: 'Informes de Mercado', value: 'informe_mercado' },
    { label: 'Guías Legales & Tributarias', value: 'guia_legal' },
    { label: 'Minutas de Asamblea & Eurocámara', value: 'minuta_asamblea' },
    { label: 'Circulares Comerciales', value: 'circular_comercial' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="gold">Biblioteca Exclusiva</Badge>
          <h1 className="font-serif font-bold text-2xl text-cicha-navy mt-1">
            Informes, Guías y Circulares Comerciales
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Documentación estratégica confidencial reservada para socios de la Cámara.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              category === cat.value
                ? 'bg-cicha-navy text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat.label}
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
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    {res.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{res.file_size}</span>
                </div>

                <h3 className="font-serif font-bold text-base text-cicha-navy group-hover:text-blue-700 transition-colors">
                  {res.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{res.downloads} descargas registradas</span>
                <button
                  onClick={() => handleDownload(res)}
                  disabled={downloadingId === res.id}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  {downloadingId === res.id ? 'Descargando...' : 'Descargar Archivo'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-2">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No hay documentos en esta categoría.</p>
          <p className="text-xs text-slate-500">Pronto se cargarán nuevos informes sectoriales.</p>
        </div>
      )}
    </div>
  );
};
