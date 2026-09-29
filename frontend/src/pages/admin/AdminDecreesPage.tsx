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
  FolderTree,
  Tag,
  Eye,
  Layers,
} from 'lucide-react';
import { adminApi, resolveImageUrl } from '../../services/api';
import type { Decree, Category } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ImageUploader } from '../../components/common/ImageUploader';
import { DocumentUploader } from '../../components/common/DocumentUploader';
import { PdfViewerModal } from '../../components/common/PdfViewerModal';

export const AdminDecreesPage: React.FC = () => {
  const [decrees, setDecrees] = useState<Decree[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDecree, setEditingDecree] = useState<Decree | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // PDF Preview State
  const [pdfPreview, setPdfPreview] = useState<{ isOpen: boolean; url: string; title: string; fileName?: string; fileSize?: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  // Form State
  const [title, setTitle] = useState('');
  const [decreeNumber, setDecreeNumber] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [documentMode, setDocumentMode] = useState<'text' | 'file' | 'both' | 'url'>('file');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [isActive, setIsActive] = useState(true);

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
    setContent('');
    setCoverImageUrl('');
    setAuthor('Presidencia de la Nación / Cancillería');
    setAuthorAvatarUrl('');
    setLogoUrl('');
    setDocumentMode('file');
    setFileUrl('');
    setFileName('');
    setFileSize('');
    setIssueDate(new Date().toISOString().split('T')[0]);
    setIsActive(true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (decree: Decree) => {
    setEditingDecree(decree);
    setTitle(decree.title);
    setDecreeNumber(decree.decree_number || '');
    setDescription(decree.description || '');
    setContent(decree.content || '');
    setCoverImageUrl(decree.cover_image_url || '');
    setAuthor(decree.author || '');
    setAuthorAvatarUrl(decree.author_avatar_url || '');
    setLogoUrl(decree.logo_url || '');
    setDocumentMode((decree.document_type as any) || (decree.content && decree.file_url ? 'both' : decree.content ? 'text' : 'file'));
    setFileUrl(decree.file_url || '');
    setFileName(decree.file_name || '');
    setFileSize(decree.file_size || '');
    setIssueDate(decree.issue_date || '');
    setIsActive(Boolean(decree.is_active));
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('El título del decreto es obligatorio.');
      return;
    }

    if (documentMode === 'text' && !content.trim()) {
      setErrorMessage('Debe ingresar el texto redactado del decreto.');
      return;
    }

    if (documentMode === 'file' && !fileUrl.trim()) {
      setErrorMessage('Debe adjuntar un archivo PDF para el decreto.');
      return;
    }

    setActionLoading(true);

    try {
      const payload: Partial<Decree> = {
        title: title.trim(),
        decree_number: decreeNumber.trim() || undefined,
        description: description.trim() || undefined,
        content: (documentMode === 'text' || documentMode === 'both') ? content.trim() : undefined,
        cover_image_url: coverImageUrl.trim() || undefined,
        author: author.trim() || undefined,
        author_avatar_url: authorAvatarUrl.trim() || undefined,
        logo_url: logoUrl.trim() || undefined,
        document_type: documentMode,
        file_url: (documentMode !== 'text') ? fileUrl.trim() || undefined : undefined,
        file_name: fileName || (documentMode === 'text' ? 'Decreto Digital' : (documentMode === 'url' ? 'Documento Enlace' : undefined)),
        file_size: fileSize || (documentMode === 'text' ? `${content.trim().split(/\s+/).filter(Boolean).length} palabras` : undefined),
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
          className="inline-flex items-center gap-2 bg-cicha-navy hover:bg-[#003866] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all hover:scale-102 shrink-0 cursor-pointer"
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

                          {decree.file_url && (
                            <button
                              type="button"
                              onClick={() => setPdfPreview({
                                isOpen: true,
                                url: decree.file_url!,
                                title: decree.title,
                                fileName: decree.file_name,
                                fileSize: decree.file_size,
                              })}
                              className="text-cicha-navy hover:text-blue-700 p-1 hover:bg-blue-50 rounded cursor-pointer"
                              title="Ver documento PDF"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <a
                            href={isPdf ? resolveImageUrl(decree.file_url) : decree.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cicha-navy hover:text-blue-700 p-1 hover:bg-blue-50 rounded"
                            title="Abrir en pestaña nueva"
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
                          {decree.file_url && (
                            <button
                              type="button"
                              onClick={() => setPdfPreview({
                                isOpen: true,
                                url: decree.file_url!,
                                title: decree.title,
                                fileName: decree.file_name,
                                fileSize: decree.file_size,
                              })}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                              title="Ver documento PDF"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => openEditModal(decree)}
                            className="p-1.5 text-slate-400 hover:text-cicha-navy hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                            title="Editar decreto"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(decree)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
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
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDecree ? 'Editar Decreto Oficial' : 'Nuevo Decreto Oficial'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Title & Decree Number */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700">
                Título del Decreto / Resolución *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Reconocimiento Oficial Gobierno Argentino"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">N° / Expediente</label>
              <input
                type="text"
                placeholder="Ej: Dec. 204/1989"
                value={decreeNumber}
                onChange={(e) => setDecreeNumber(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Modalidad de Contenido */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Modalidad de Contenido</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setDocumentMode('file')}
                className={`py-2 px-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                  documentMode === 'file'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>📄 Solo PDF</span>
                <span className={`text-[10px] font-normal ${documentMode === 'file' ? 'text-blue-100' : 'text-slate-400'}`}>
                  Documento adjunto
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDocumentMode('text')}
                className={`py-2 px-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                  documentMode === 'text'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>📝 Solo Texto</span>
                <span className={`text-[10px] font-normal ${documentMode === 'text' ? 'text-blue-100' : 'text-slate-400'}`}>
                  Transcripción directa
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDocumentMode('both')}
                className={`py-2 px-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                  documentMode === 'both'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>📦 Ambos</span>
                <span className={`text-[10px] font-normal ${documentMode === 'both' ? 'text-blue-100' : 'text-slate-400'}`}>
                  Texto + PDF visor
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDocumentMode('url')}
                className={`py-2 px-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                  documentMode === 'url'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🔗 Enlace Web</span>
                <span className={`text-[10px] font-normal ${documentMode === 'url' ? 'text-blue-100' : 'text-slate-400'}`}>
                  Boletín oficial / Link
                </span>
              </button>
            </div>
          </div>

          {/* Autores, Foto de Autor y Logo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Entidad / Autor / Firmante</label>
              <input
                type="text"
                placeholder="Ej. Cancillería / Presidencia"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <ImageUploader
                label="Foto del Firmante / Autor (Opcional)"
                value={authorAvatarUrl}
                onChange={(url) => setAuthorAvatarUrl(url)}
                helperText="Retrato o avatar (JPG, PNG)"
                previewHeight="h-24"
              />
            </div>

            <div>
              <ImageUploader
                label="Logo / Escudo Oficial (Opcional)"
                value={logoUrl}
                onChange={(url) => setLogoUrl(url)}
                helperText="Logo o emblema oficial"
                previewHeight="h-24"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Pequeña descripción / Resumen o Alcance (Opcional)</label>
            <textarea
              rows={2}
              placeholder="Detalle o resumen legal del decreto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Cover Image */}
          <ImageUploader
            label="Imagen de Portada / Tapa del Decreto (Opcional)"
            value={coverImageUrl}
            onChange={(url) => setCoverImageUrl(url)}
            helperText="Tapa del documento o gacetilla (JPG, PNG, WEBP)"
            previewHeight="h-32"
          />

          {/* Date & Active Switch */}
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
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>Publicado para Socios (Activo)</span>
              </label>
            </div>
          </div>

          {/* Subida o Enlace de PDF (si modalidad es file o both o url) */}
          {(documentMode === 'file' || documentMode === 'both' || documentMode === 'url') && (
            <div className="p-4 bg-blue-50/50 border border-blue-200/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-blue-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Documento PDF / Archivo Oficial</span>
                </label>
                {fileUrl && (
                  <button
                    type="button"
                    onClick={() => setPdfPreview({
                      isOpen: true,
                      url: fileUrl,
                      title: title || 'Vista Previa del Decreto',
                      fileName: fileName,
                      fileSize: fileSize,
                    })}
                    className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Probar Visor PDF
                  </button>
                )}
              </div>

              <DocumentUploader
                label="Subir PDF o pegar enlace directo"
                fileUrl={fileUrl}
                fileSize={fileSize}
                onChange={({ fileUrl: newUrl, fileSize: newSize }) => {
                  setFileUrl(newUrl);
                  setFileSize(newSize || '');
                  setFileName(newUrl.split('/').pop() || 'decreto.pdf');
                }}
                helperText="El visor interactivo permitirá a los socios leer, rotar, descargar e imprimir este PDF directamente."
              />
            </div>
          )}

          {/* Cuerpo / Texto del Decreto (si modalidad es text o both) */}
          {(documentMode === 'text' || documentMode === 'both') && (
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">
                Texto Completo del Decreto {documentMode === 'text' ? '*' : '(Opcional)'}
              </label>
              <textarea
                rows={8}
                required={documentMode === 'text'}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escriba o pegue el texto completo, articulado y considerandos del decreto..."
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-cicha-navy hover:bg-[#003866] text-white font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
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
      </Modal>

      {/* PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={pdfPreview.isOpen}
        onClose={() => setPdfPreview({ ...pdfPreview, isOpen: false })}
        url={pdfPreview.url}
        title={pdfPreview.title}
        fileName={pdfPreview.fileName}
        fileSize={pdfPreview.fileSize}
      />
    </div>
  );
};

