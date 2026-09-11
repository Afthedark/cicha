import React, { useEffect, useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  Download,
  Trash2,
  Calendar,
  User,
  Building2,
  UploadCloud,
  Link2,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck2,
} from 'lucide-react';
import { partnerApi, resolveImageUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import type { PartnerMinute } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const PartnerMinutesPage: React.FC = () => {
  const { user } = useAuth();
  const [minutes, setMinutes] = useState<PartnerMinute[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [documentMode, setDocumentMode] = useState<'file' | 'url'>('file');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [externalUrl, setExternalUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);

  const fetchMinutes = (q?: string) => {
    partnerApi
      .getMinutes(q)
      .then((data) => {
        setMinutes(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching partner minutes:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMinutes();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMinutes(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchMinutes('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setErrorMessage('Por favor seleccione un archivo en formato PDF.');
        setSelectedFile(null);
        return;
      }
      if (file.size > 30 * 1024 * 1024) {
        setErrorMessage('El archivo no debe superar los 30 MB.');
        setSelectedFile(null);
        return;
      }
      setErrorMessage(null);
      setSelectedFile(file);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setMeetingDate(new Date().toISOString().split('T')[0]);
    setExternalUrl('');
    setSelectedFile(null);
    setDocumentMode('file');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setErrorMessage('El título del acta es obligatorio.');
      return;
    }

    if (documentMode === 'file' && !selectedFile) {
      setErrorMessage('Debe seleccionar un archivo PDF para subir.');
      return;
    }

    if (documentMode === 'url' && !externalUrl.trim()) {
      setErrorMessage('Debe ingresar un enlace o URL válido para el documento.');
      return;
    }

    setActionLoading(true);

    try {
      let finalFileUrl = externalUrl.trim();
      let finalFileName = '';
      let finalFileSize = '';

      if (documentMode === 'file' && selectedFile) {
        setUploadProgress(true);
        const uploadRes = await partnerApi.uploadDocument(selectedFile);
        finalFileUrl = uploadRes.url;
        finalFileName = uploadRes.file_name || selectedFile.name;
        finalFileSize = uploadRes.file_size || `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`;
        setUploadProgress(false);
      }

      await partnerApi.createMinute({
        title: title.trim(),
        description: description.trim() || undefined,
        document_type: documentMode,
        file_url: finalFileUrl,
        file_name: finalFileName || (documentMode === 'url' ? 'Documento Enlace' : undefined),
        file_size: finalFileSize || undefined,
        meeting_date: meetingDate || undefined,
      });

      setSuccessMessage('¡Acta compartida exitosamente con los demás socios!');
      resetForm();
      setIsModalOpen(false);
      fetchMinutes(searchQuery);

      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err?.response?.data?.messages?.error ||
          err?.response?.data?.message ||
          'Ocurrió un error al publicar el acta. Intente nuevamente.'
      );
    } finally {
      setActionLoading(false);
      setUploadProgress(false);
    }
  };

  const handleOpenDocument = async (minute: PartnerMinute) => {
    setDownloadingId(minute.id);
    try {
      const response = await partnerApi.downloadMinute(minute.id);
      const urlToOpen =
        minute.document_type === 'url'
          ? response.url
          : resolveImageUrl(response.url || minute.file_url);

      window.open(urlToOpen, '_blank', 'noopener,noreferrer');
      setMinutes((prev) =>
        prev.map((m) => (m.id === minute.id ? { ...m, downloads: (m.downloads || 0) + 1 } : m))
      );
    } catch (err) {
      const fallbackUrl =
        minute.document_type === 'url' ? minute.file_url : resolveImageUrl(minute.file_url);
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDeleteMinute = async (id: number, title: string) => {
    if (!window.confirm(`¿Está seguro de que desea eliminar el acta "${title}"?`)) {
      return;
    }

    try {
      await partnerApi.deleteMinute(id);
      setMinutes((prev) => prev.filter((m) => m.id !== id));
      setSuccessMessage('Acta eliminada correctamente.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Error al eliminar el acta.');
    }
  };

  const canDelete = (minute: PartnerMinute) => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'secretario') return true;
    return minute.user_id === user.id;
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="gold">Módulo Exclusivo de Socios</Badge>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              <FileCheck2 className="w-3.5 h-3.5 text-cicha-navy" />
              Colaborativo B2B
            </span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-cicha-navy tracking-tight">
            Actas & Resoluciones Institucionales
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Espacio de transparencia y consulta inter-socios. Sube actas de asambleas, reuniones de
            comité o acuerdos estratégicos mediante archivo PDF o enlace externo en la nube.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-cicha-navy to-[#004b87] hover:from-[#003866] hover:to-cicha-navy text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md shadow-blue-900/10 hover:shadow-lg transition-all hover:scale-102 active:scale-98 shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Subir Nueva Acta</span>
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs sm:text-sm animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título, contenido, socio o empresa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cicha-navy/20 focus:border-cicha-navy transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        <div className="text-xs text-slate-500 font-medium">
          Mostrando <strong className="text-cicha-navy">{minutes.length}</strong> {minutes.length === 1 ? 'acta registrada' : 'actas registradas'}
        </div>
      </div>

      {/* Minutes List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader text="Cargando actas de socios..." />
        </div>
      ) : minutes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-800">
              {searchQuery ? 'No se encontraron actas con ese criterio' : 'Aún no hay actas publicadas'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery
                ? 'Intenta con otro término de búsqueda o limpia el filtro.'
                : 'Sé el primero en compartir un acta o resolución con la comunidad de socios de la Cámara.'}
            </p>
          </div>
          <button
            onClick={() => {
              if (searchQuery) handleClearSearch();
              else setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-cicha-navy bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-all"
          >
            {searchQuery ? 'Limpiar búsqueda' : 'Subir Acta Ahora'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {minutes.map((minute) => {
            const isPdf = minute.document_type === 'file';
            const userAllowedToDelete = canDelete(minute);

            return (
              <div
                key={minute.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 group hover:border-slate-300"
              >
                <div className="space-y-4">
                  {/* Top Badges & Document Type */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {isPdf ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200/80 font-bold text-[11px] uppercase tracking-wider">
                          <FileText className="w-3.5 h-3.5 text-rose-600" />
                          PDF Oficial
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-50 text-cyan-800 border border-cyan-200/80 font-bold text-[11px] uppercase tracking-wider">
                          <Link2 className="w-3.5 h-3.5 text-cyan-600" />
                          Enlace Externo
                        </span>
                      )}

                      {minute.meeting_date && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(minute.meeting_date).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </div>

                    {userAllowedToDelete && (
                      <button
                        onClick={() => handleDeleteMinute(minute.id, minute.title)}
                        title="Eliminar esta acta"
                        className="text-slate-300 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-cicha-navy group-hover:text-[#004b87] transition-colors line-clamp-2 leading-snug">
                      {minute.title}
                    </h3>
                    {minute.description && (
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {minute.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Meta & Action Button */}
                <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
                  {/* Partner / Author Details */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-cicha-navy font-bold text-xs shrink-0 overflow-hidden">
                        {minute.company_logo ? (
                          <img
                            src={resolveImageUrl(minute.company_logo)}
                            alt="Logo"
                            className="w-full h-full object-cover"
                          />
                        ) : minute.user_avatar ? (
                          <img
                            src={resolveImageUrl(minute.user_avatar)}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 truncate">
                        <p className="font-bold text-slate-800 truncate">
                          {minute.company_name || minute.user_name || 'Socio CICHA'}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          Publicado el{' '}
                          {new Date(minute.created_at).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {minute.file_size && (
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded shrink-0">
                        {minute.file_size}
                      </span>
                    )}
                  </div>

                  {/* Open / Download Button */}
                  <button
                    onClick={() => handleOpenDocument(minute)}
                    disabled={downloadingId === minute.id}
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-cicha-navy text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-xs hover:shadow group/btn"
                  >
                    {downloadingId === minute.id ? (
                      <span>Abriendo documento...</span>
                    ) : isPdf ? (
                      <>
                        <Download className="w-3.5 h-3.5 text-amber-400 group-hover/btn:translate-y-0.5 transition-transform" />
                        <span>Ver / Descargar PDF</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover/btn:translate-x-0.5 transition-transform" />
                        <span>Abrir Enlace Externo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Subir / Publicar Nueva Acta */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cicha-navy text-amber-400 flex items-center justify-center shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-slate-900">
                    Subir Nueva Acta o Resolución
                  </h2>
                  <p className="text-xs text-slate-500">
                    Visible exclusivamente para la comunidad de socios verificados.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {errorMessage && (
                <div className="flex items-start gap-2.5 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Title */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  Título del Acta / Resolución <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Acta Asamblea General Ordinaria N° 42 - Balances y Memoria"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cicha-navy/20 focus:border-cicha-navy transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">
                  Descripción / Puntos Clave Tratados (Opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Resumen de los temas aprobados, acuerdos bilaterales, comisiones designadas..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cicha-navy/20 focus:border-cicha-navy transition-all resize-none"
                />
              </div>

              {/* Meeting Date */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Fecha de la Reunión o Asamblea
                </label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cicha-navy/20 focus:border-cicha-navy transition-all"
                />
              </div>

              {/* Mode Toggle (PDF vs URL) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-700 flex items-center justify-between">
                  <span>Modalidad del Documento <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Elija subir archivo PDF o pegar link externo
                  </span>
                </label>

                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setDocumentMode('file');
                      setErrorMessage(null);
                    }}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                      documentMode === 'file'
                        ? 'bg-white text-cicha-navy shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UploadCloud className="w-4 h-4 text-rose-500" />
                    <span>Subir Archivo PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDocumentMode('url');
                      setErrorMessage(null);
                    }}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                      documentMode === 'url'
                        ? 'bg-white text-cicha-navy shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Link2 className="w-4 h-4 text-cyan-600" />
                    <span>Pegar Enlace URL</span>
                  </button>
                </div>
              </div>

              {/* Option 1: File Upload */}
              {documentMode === 'file' && (
                <div className="space-y-2">
                  <div className="border-2 border-dashed border-slate-200 hover:border-cicha-navy/40 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
                    <input
                      type="file"
                      id="pdf-upload"
                      accept="application/pdf,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                    >
                      <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-xs">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800 text-xs">
                          {selectedFile ? selectedFile.name : 'Haga clic para seleccionar archivo PDF'}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {selectedFile
                            ? `Tamaño: ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                            : 'Formato PDF (Máx. 30MB)'}
                        </p>
                      </div>
                      {selectedFile && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Archivo PDF listo para subir
                        </span>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {/* Option 2: External URL */}
              {documentMode === 'url' && (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-cyan-600" />
                    Enlace / URL Directo al Documento
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... o https://dropbox.com/..."
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cicha-navy/20 focus:border-cicha-navy transition-all font-mono"
                  />
                  <p className="text-[11px] text-slate-400">
                    Asegúrese de que el enlace tenga permisos de lectura habilitados para los socios.
                  </p>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={actionLoading}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || uploadProgress}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cicha-navy hover:bg-[#003866] text-white font-bold transition-all shadow-md shadow-blue-900/10 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <span>{uploadProgress ? 'Subiendo archivo...' : 'Publicando...'}</span>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>Publicar Acta</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
