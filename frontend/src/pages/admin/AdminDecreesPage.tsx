import React, { useEffect, useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  Download,
  Trash2,
  Edit2,
  Calendar,
  UploadCloud,
  Link2,
  CheckCircle2,
  AlertCircle,
  X,
  Scroll,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { adminApi, resolveImageUrl } from '../../services/api';
import type { Decree } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const AdminDecreesPage: React.FC = () => {
  const [decrees, setDecrees] = useState<Decree[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDecree, setEditingDecree] = useState<Decree | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [decreeNumber, setDecreeNumber] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [documentMode, setDocumentMode] = useState<'file' | 'url'>('file');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Upload States
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [selectedDocFile, setSelectedDocFile] = useState<File | null>(null);

  const fetchDecrees = (q?: string) => {
    adminApi
      .getDecrees(q)
      .then((data) => {
        setDecrees(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching decrees:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDecrees();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDecrees(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchDecrees('');
  };

  const openCreateModal = () => {
    setEditingDecree(null);
    setTitle('');
    setDecreeNumber('');
    setDescription('');
    setLogoUrl('');
    setDocumentMode('file');
    setFileUrl('');
    setFileName('');
    setFileSize('');
    setIssueDate(new Date().toISOString().split('T')[0]);
    setIsActive(true);
    setSelectedDocFile(null);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (decree: Decree) => {
    setEditingDecree(decree);
    setTitle(decree.title);
    setDecreeNumber(decree.decree_number || '');
    setDescription(decree.description || '');
    setLogoUrl(decree.logo_url || '');
    setDocumentMode(decree.document_type || 'file');
    setFileUrl(decree.file_url || '');
    setFileName(decree.file_name || '');
    setFileSize(decree.file_size || '');
    setIssueDate(decree.issue_date || '');
    setIsActive(Boolean(decree.is_active));
    setSelectedDocFile(null);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const res = await adminApi.uploadFile(file);
      setLogoUrl(res.url);
    } catch (err: any) {
      setErrorMessage('Error al subir el logo/emblema del decreto.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleDocFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setErrorMessage('Por favor seleccione un archivo en formato PDF.');
        setSelectedDocFile(null);
        return;
      }
      if (file.size > 30 * 1024 * 1024) {
        setErrorMessage('El archivo PDF no debe superar los 30 MB.');
        setSelectedDocFile(null);
        return;
      }
      setErrorMessage(null);
      setSelectedDocFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('El título del decreto es obligatorio.');
      return;
    }

    if (documentMode === 'file' && !selectedDocFile && !fileUrl) {
      setErrorMessage('Debe adjuntar un archivo PDF para el decreto.');
      return;
    }

    if (documentMode === 'url' && !fileUrl.trim()) {
      setErrorMessage('Debe ingresar un enlace URL válido para el decreto.');
      return;
    }

    setActionLoading(true);

    try {
      let finalFileUrl = fileUrl.trim();
      let finalFileName = fileName;
      let finalFileSize = fileSize;

      if (documentMode === 'file' && selectedDocFile) {
        setUploadingDoc(true);
        const uploadRes = await adminApi.uploadFile(selectedDocFile);
        finalFileUrl = uploadRes.url;
        finalFileName = uploadRes.filename || selectedDocFile.name;
        finalFileSize = uploadRes.file_size || `${(selectedDocFile.size / (1024 * 1024)).toFixed(1)} MB`;
        setUploadingDoc(false);
      }

      const payload: Partial<Decree> = {
        title: title.trim(),
        decree_number: decreeNumber.trim() || undefined,
        description: description.trim() || undefined,
        logo_url: logoUrl.trim() || undefined,
        document_type: documentMode,
        file_url: finalFileUrl,
        file_name: finalFileName || (documentMode === 'url' ? 'Documento Enlace' : undefined),
        file_size: finalFileSize || undefined,
        issue_date: issueDate || undefined,
        is_active: isActive ? 1 : 0,
      };

      if (editingDecree) {
        await adminApi.updateDecree(editingDecree.id, payload);
        setSuccessMessage('Decreto actualizado exitosamente.');
      } else {
        await adminApi.createDecree(payload);
        setSuccessMessage('Decreto creado y publicado exitosamente.');
      }

      setIsModalOpen(false);
      fetchDecrees(searchQuery);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err?.response?.data?.messages?.error ||
          err?.response?.data?.message ||
          'Error al guardar el decreto. Intente nuevamente.'
      );
    } finally {
      setActionLoading(false);
      setUploadingDoc(false);
    }
  };

  const handleDelete = async (decree: Decree) => {
    if (!window.confirm(`¿Está seguro de que desea eliminar el decreto "${decree.title}"?`)) {
      return;
    }

    try {
      await adminApi.deleteDecree(decree.id);
      setDecrees((prev) => prev.filter((d) => d.id !== decree.id));
      setSuccessMessage('Decreto eliminado exitosamente.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Error al eliminar el decreto.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
              <Scroll className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">Administración de Decretos</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de decretos oficiales, resoluciones ministeriales y marcos jurídicos bilaterales visibles para los socios.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-cicha-navy hover:bg-[#003866] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all hover:scale-102 shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Nuevo Decreto</span>
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título, número de decreto o descripción..."
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
          Total: <strong className="text-cicha-navy">{decrees.length}</strong> {decrees.length === 1 ? 'decreto' : 'decretos'}
        </div>
      </div>

      {/* Content Table / Cards */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader text="Cargando decretos oficiales..." />
        </div>
      ) : decrees.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Scroll className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-700 text-sm">
            {searchQuery ? 'No se encontraron decretos' : 'No hay decretos registrados'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'Intenta con otro término de búsqueda o limpia el filtro.'
              : 'Haz clic en "Nuevo Decreto" para registrar el primer decreto oficial con su PDF/enlace y logo.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Decreto / Emblema</th>
                  <th className="py-3.5 px-4">Número / Fecha</th>
                  <th className="py-3.5 px-4">Tipo & Documento</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  <th className="py-3.5 px-4 text-center">Descargas</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {decrees.map((decree) => {
                  const isPdf = decree.document_type === 'file';
                  return (
                    <tr key={decree.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Logo + Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            {decree.logo_url ? (
                              <img
                                src={resolveImageUrl(decree.logo_url)}
                                alt={decree.title}
                                className="w-full h-full object-contain p-1"
                              />
                            ) : (
                              <Scroll className="w-6 h-6 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs sm:max-w-md">
                            <p className="font-bold text-slate-900 line-clamp-1">{decree.title}</p>
                            {decree.description && (
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {decree.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Number & Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {decree.decree_number || 'S/N'}
                        </span>
                        {decree.issue_date && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(decree.issue_date).toLocaleDateString('es-AR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        )}
                      </td>

                      {/* Document info */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {isPdf ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10.5px]">
                              <FileText className="w-3 h-3" /> PDF
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold text-[10.5px]">
                              <Link2 className="w-3 h-3" /> URL Web
                            </span>
                          )}

                          <a
                            href={isPdf ? resolveImageUrl(decree.file_url) : decree.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cicha-navy hover:text-blue-700 p-1 hover:bg-blue-50 rounded"
                            title="Abrir documento"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {Boolean(decree.is_active) ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                            Borrador
                          </span>
                        )}
                      </td>

                      {/* Downloads */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700 whitespace-nowrap">
                        {decree.downloads || 0}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(decree)}
                            className="p-1.5 text-slate-400 hover:text-cicha-navy hover:bg-slate-100 rounded-lg transition-all"
                            title="Editar decreto"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(decree)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Eliminar decreto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Crear / Editar Decreto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cicha-navy text-amber-400 flex items-center justify-center shadow-xs">
                  <Scroll className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-slate-900">
                    {editingDecree ? 'Editar Decreto Oficial' : 'Nuevo Decreto Oficial'}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Visible en el Portal de Socios para consulta y descarga.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {errorMessage && (
                <div className="flex items-start gap-2.5 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Title & Decree Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">
                    Título del Decreto <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Reconocimiento Oficial Gobierno Argentino"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cicha-navy/20 focus:border-cicha-navy transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">N° / Expediente</label>
                  <input
                    type="text"
                    placeholder="Ej: Dec. 204/1989"
                    value={decreeNumber}
                    onChange={(e) => setDecreeNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cicha-navy/20 focus:border-cicha-navy transition-all font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Descripción / Alcance Institucional</label>
                <textarea
                  rows={2}
                  placeholder="Detalle o resumen legal del decreto..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cicha-navy/20 focus:border-cicha-navy transition-all resize-none"
                />
              </div>

              {/* Logo / Emblem Upload */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cicha-navy" />
                    Logo / Escudo Oficial
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    (PNG, JPG o WEBP)
                  </span>
                </label>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                    {logoUrl ? (
                      <img
                        src={resolveImageUrl(logoUrl)}
                        alt="Preview"
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      id="decree-logo-upload"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="decree-logo-upload"
                        className="cursor-pointer px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] transition-all inline-flex items-center gap-1.5"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        {uploadingLogo ? 'Subiendo...' : 'Seleccionar Imagen'}
                      </label>
                      {logoUrl && (
                        <button
                          type="button"
                          onClick={() => setLogoUrl('')}
                          className="text-rose-500 hover:text-rose-700 font-semibold text-[11px]"
                        >
                          Quitar logo
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="O pegue una URL directa de la imagen del logo..."
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Issue Date & Active Switch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Fecha de Emisión / Promulgación
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cicha-navy/20 focus:border-cicha-navy transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cicha-navy"></div>
                    <span className="ml-2.5 font-bold text-slate-700 text-xs">
                      Publicado para Socios
                    </span>
                  </label>
                </div>
              </div>

              {/* Mode Toggle (PDF vs URL) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-700 flex items-center justify-between">
                  <span>Documento del Decreto <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Elija subir archivo PDF o pegar link
                  </span>
                </label>

                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setDocumentMode('file');
                      setErrorMessage(null);
                    }}
                    className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg font-bold text-xs transition-all ${
                      documentMode === 'file'
                        ? 'bg-white text-cicha-navy shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-rose-500" />
                    <span>Subir Archivo PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDocumentMode('url');
                      setErrorMessage(null);
                    }}
                    className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg font-bold text-xs transition-all ${
                      documentMode === 'url'
                        ? 'bg-white text-cicha-navy shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Pegar Enlace URL</span>
                  </button>
                </div>
              </div>

              {/* Option 1: File Upload */}
              {documentMode === 'file' && (
                <div className="space-y-2">
                  <div className="border-2 border-dashed border-slate-200 hover:border-cicha-navy/40 rounded-xl p-4 text-center transition-colors bg-slate-50/50">
                    <input
                      type="file"
                      id="decree-doc-upload"
                      accept="application/pdf,.pdf"
                      onChange={handleDocFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="decree-doc-upload"
                      className="cursor-pointer flex flex-col items-center justify-center space-y-1"
                    >
                      <div className="w-9 h-9 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shadow-xs">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <p className="font-bold text-slate-800 text-xs">
                        {selectedDocFile
                          ? selectedDocFile.name
                          : fileUrl
                          ? `Archivo actual: ${fileName || 'Documento PDF'}`
                          : 'Haga clic para seleccionar archivo PDF'}
                      </p>
                      <p className="text-[10px] text-slate-400">PDF hasta 30MB</p>
                      {selectedDocFile && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Nuevo archivo seleccionado
                        </span>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {/* Option 2: External URL */}
              {documentMode === 'url' && (
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Link2 className="w-3.5 h-3.5 text-cyan-600" />
                    Enlace / URL del Decreto
                  </label>
                  <input
                    type="url"
                    placeholder="https://boletinoficial.gob.ar/... o https://drive.google.com/..."
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-mono"
                  />
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || uploadingDoc || uploadingLogo}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-cicha-navy hover:bg-[#003866] text-white font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  {actionLoading ? (
                    <span>Guardando...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-amber-400" />
                      <span>{editingDecree ? 'Actualizar Decreto' : 'Crear Decreto'}</span>
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
