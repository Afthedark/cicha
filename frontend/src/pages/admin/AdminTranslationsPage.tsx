import React, { useEffect, useState } from 'react';
import {
  Languages,
  Globe,
  Save,
  CheckCircle2,
  RefreshCw,
  Search,
  BookOpen,
  Sparkles,
  Layers,
  FileText,
  Phone,
  Landmark,
  Compass,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { GreeceFlag, ArgentinaFlag, UkFlag } from '../../components/common/GoogleTranslate';
import { useLanguage } from '../../context/LanguageContext';

export interface GreekTranslationItem {
  id: number;
  section: string;
  translation_key: string;
  original_es: string;
  text_el: string;
  text_en?: string;
  description?: string;
  order_num?: number;
  updated_at?: string;
}

export const AdminTranslationsPage: React.FC = () => {
  const { refreshTranslations } = useLanguage();
  const [translations, setTranslations] = useState<GreekTranslationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savingAll, setSavingAll] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTranslations = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getTranslations();
      if (res && res.data) {
        setTranslations(res.data);
      }
    } catch (err: any) {
      console.error('Error fetching translations:', err);
      setErrorMessage(err.message || 'Error al cargar traducciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranslations();
  }, []);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  const handleSpanishChange = (id: number, newText: string) => {
    setTranslations((prev) =>
      prev.map((t) => (t.id === id ? { ...t, original_es: newText } : t))
    );
  };

  const handleGreekChange = (id: number, newText: string) => {
    setTranslations((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text_el: newText } : t))
    );
  };

  const handleEnglishChange = (id: number, newText: string) => {
    setTranslations((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text_en: newText } : t))
    );
  };

  const handleSaveSingle = async (item: GreekTranslationItem) => {
    try {
      setSavingId(item.id);
      setErrorMessage(null);
      await adminApi.updateTranslation(item.id, {
        original_es: item.original_es,
        text_el: item.text_el,
        text_en: item.text_en,
      });
      await refreshTranslations();
      showNotification(`"${item.translation_key}" actualizada con éxito.`);
    } catch (err: any) {
      console.error('Error saving translation:', err);
      setErrorMessage(err.message || 'Error al guardar la traducción');
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSavingAll(true);
      setErrorMessage(null);
      await adminApi.updateTranslationsBatch(
        translations.map((t) => ({ id: t.id, original_es: t.original_es, text_el: t.text_el, text_en: t.text_en }))
      );
      await refreshTranslations();
      showNotification('Todas las traducciones (Español, Griego e Inglés) han sido guardadas y sincronizadas.');
    } catch (err: any) {
      console.error('Error saving all translations:', err);
      setErrorMessage(err.message || 'Error al guardar los cambios en lote');
    } finally {
      setSavingAll(false);
    }
  };

  const sectionTabs = [
    { key: 'all', label: 'Todas las Secciones', icon: Layers, count: translations.length },
    {
      key: 'header',
      label: 'Cabecera / Header',
      icon: Sparkles,
      count: translations.filter((t) => t.section === 'header').length,
    },
    {
      key: 'presentacion',
      label: 'Presentación',
      icon: BookOpen,
      count: translations.filter((t) => t.section === 'presentacion').length,
    },
    {
      key: 'la_camara',
      label: 'La Cámara',
      icon: Landmark,
      count: translations.filter((t) => t.section === 'la_camara').length,
    },
    {
      key: 'home',
      label: 'Inicio (Home)',
      icon: Compass,
      count: translations.filter((t) => t.section === 'home').length,
    },
    {
      key: 'contacto',
      label: 'Contacto',
      icon: Phone,
      count: translations.filter((t) => t.section === 'contacto').length,
    },
  ];

  const filteredTranslations = translations.filter((item) => {
    const matchesTab = activeTab === 'all' || item.section === activeTab;
    const matchesSearch =
      !searchTerm ||
      item.translation_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.original_es && item.original_es.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.text_el && item.text_el.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.text_en && item.text_en.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const getSectionBadge = (section: string) => {
    switch (section) {
      case 'header':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">Cabecera</span>;
      case 'presentacion':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-300">Presentación</span>;
      case 'la_camara':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-900 border border-indigo-300">La Cámara</span>;
      case 'home':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">Inicio</span>;
      case 'contacto':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-900 border border-purple-300">Contacto</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">{section}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#003866] via-[#004b87] to-[#0A2540] rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-blue-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs uppercase tracking-wider border border-blue-400/30 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Internacionalización
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-400/30">
              Web Pública
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Languages className="w-8 h-8 text-amber-400" />
            Traducciones Manuales (Griego & Inglés)
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Administra los textos, párrafos solemnes, títulos y lemas en griego moderno (Ελληνικά) e inglés (English) para la web pública. Los cambios se sincronizan en vivo con el selector de idiomas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchTranslations}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            title="Recargar traducciones"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Recargar
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={savingAll || loading}
            className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {savingAll ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Guardando Todo...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Todo
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center gap-3 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-semibold">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-300 text-rose-900 px-4 py-3 rounded-xl flex items-center gap-3 shadow-xs animate-in fade-in duration-200">
          <p className="text-sm font-semibold">{errorMessage}</p>
        </div>
      )}

      {/* Controls: Search & Tabs */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por clave, español, griego o inglés..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium self-end sm:self-center">
            Mostrando <strong>{filteredTranslations.length}</strong> de {translations.length} frases
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-t border-slate-100 pt-3">
          {sectionTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#004b87] text-white shadow-md shadow-blue-900/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Translations List */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm p-12">
          <Loader text="Cargando catálogo de traducciones..." size="lg" />
        </div>
      ) : filteredTranslations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center space-y-3">
          <Globe className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No se encontraron traducciones</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No hay frases registradas que coincidan con los filtros o el término de búsqueda actual.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTranslations.map((item) => {
            const isLongText =
              (item.original_es && item.original_es.length > 80) ||
              (item.text_el && item.text_el.length > 80) ||
              (item.text_en && item.text_en.length > 80);
            const isSavingThis = savingId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 sm:p-6 space-y-4"
              >
                {/* Item Meta & Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {getSectionBadge(item.section)}
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      {item.translation_key}
                    </span>
                    {item.description && (
                      <span className="text-xs text-slate-500 italic hidden md:inline">
                        &bull; {item.description}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveSingle(item)}
                    disabled={isSavingThis}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#004b87] hover:bg-[#003866] text-white transition-all shadow-xs flex items-center gap-1.5 self-end sm:self-center cursor-pointer disabled:opacity-50"
                  >
                    {isSavingThis ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        Guardar Frase
                      </>
                    )}
                  </button>
                </div>

                {/* 3 Column Layout: Spanish (Reference) | Greek (Editable) | English (Editable) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Spanish Editable Column */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <ArgentinaFlag className="w-4 h-3 rounded-2xs" />
                      <span>Original en Español:</span>
                    </label>
                    {isLongText ? (
                      <textarea
                        rows={4}
                        value={item.original_es || ''}
                        onChange={(e) => handleSpanishChange(item.id, e.target.value)}
                        placeholder="Escribe el texto original en español..."
                        className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white text-slate-900 leading-relaxed transition-all font-sans"
                      />
                    ) : (
                      <input
                        type="text"
                        value={item.original_es || ''}
                        onChange={(e) => handleSpanishChange(item.id, e.target.value)}
                        placeholder="Escribe el texto original en español..."
                        className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white text-slate-900 leading-relaxed transition-all font-sans"
                      />
                    )}
                  </div>

                  {/* Greek Editable Column */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <GreeceFlag className="w-4 h-3 rounded-2xs" />
                      <span>Griego (Ελληνικά):</span>
                    </label>
                    {isLongText ? (
                      <textarea
                        rows={4}
                        value={item.text_el || ''}
                        onChange={(e) => handleGreekChange(item.id, e.target.value)}
                        placeholder="Escribe la traducción en griego..."
                        className="w-full p-3 text-xs sm:text-sm rounded-xl border border-blue-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-blue-50/20 text-slate-900 leading-relaxed transition-all font-sans"
                      />
                    ) : (
                      <input
                        type="text"
                        value={item.text_el || ''}
                        onChange={(e) => handleGreekChange(item.id, e.target.value)}
                        placeholder="Escribe la traducción en griego..."
                        className="w-full p-3 text-xs sm:text-sm rounded-xl border border-blue-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-blue-50/20 text-slate-900 leading-relaxed transition-all font-sans"
                      />
                    )}
                  </div>

                  {/* English Editable Column */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <UkFlag className="w-4 h-3 rounded-2xs" />
                      <span>Inglés (English):</span>
                    </label>
                    {isLongText ? (
                      <textarea
                        rows={4}
                        value={item.text_en || ''}
                        onChange={(e) => handleEnglishChange(item.id, e.target.value)}
                        placeholder="Type English translation..."
                        className="w-full p-3 text-xs sm:text-sm rounded-xl border border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 bg-emerald-50/20 text-slate-900 leading-relaxed transition-all font-sans"
                      />
                    ) : (
                      <input
                        type="text"
                        value={item.text_en || ''}
                        onChange={(e) => handleEnglishChange(item.id, e.target.value)}
                        placeholder="Type English translation..."
                        className="w-full p-3 text-xs sm:text-sm rounded-xl border border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 bg-emerald-50/20 text-slate-900 leading-relaxed transition-all font-sans"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
