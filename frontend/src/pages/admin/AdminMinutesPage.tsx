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
  FileCheck2,
  Tag,
  FolderTree,
  Check,
  Building2,
  User,
  Eye,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { adminApi, resolveImageUrl } from '../../services/api';
import type { PartnerMinute, Category } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ImageUploader } from '../../components/common/ImageUploader';
import { DocumentUploader } from '../../components/common/DocumentUploader';
import { PdfViewerModal } from '../../components/common/PdfViewerModal';

export const parseMinuteCategories = (minute: PartnerMinute): string[] => {
  if (Array.isArray(minute.categories)) {
    return minute.categories.filter(Boolean);
  }
  if (typeof minute.categories === 'string' && minute.categories.trim()) {
    try {
      const parsed = JSON.parse(minute.categories);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter(Boolean);
      }
    } catch {
      // not JSON
    }
  }
  if (minute.category && minute.category.trim()) {
    return minute.category.split(',').map((c) => c.trim()).filter(Boolean);
  }
  return ['Asamblea General'];
};

export const AdminMinutesPage: React.FC = () => {
  const [minutes, setMinutes] = useState<PartnerMinute[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMinute, setEditingMinute] = useState<PartnerMinute | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // PDF Preview State
  const [pdfPreview, setPdfPreview] = useState<{ isOpen: boolean; url: string; title: string; fileName?: string; fileSize?: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  // Categories Management State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [loadingCats, setLoadingCats] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catNameInput, setCatNameInput] = useState('');
  const [catActionLoading, setCatActionLoading] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  // Form State
  const [documentMode, setDocumentMode] = useState<'text' | 'file' | 'both' | 'url'>('text');
  const [title, setTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Asamblea General']);
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchCategories = () => {
    setLoadingCats(true);
    adminApi
      .getCategories('minutes')
      .then((data) => {
        if (data && data.length > 0) {
          setCategories(data);
          setSelectedCategories((prev) => (prev.length > 0 ? prev : [data[0].name]));
        } else {
          const defaults = [
            { id: 1, name: 'Asamblea General', slug: 'asamblea-general', type: 'minutes' },
            { id: 2, name: 'Comisión Directiva', slug: 'comision-directiva', type: 'minutes' },
            { id: 3, name: 'Resoluciones Institucionales', slug: 'resoluciones-institucionales', type: 'minutes' },
            { id: 4, name: 'TEAM EUROPE', slug: 'team-europe', type: 'minutes' },
            { id: 5, name: 'UCCEB', slug: 'ucceb', type: 'minutes' },
            { id: 6, name: 'ECA', slug: 'eca', type: 'minutes' },
          ];
          setCategories(defaults as Category[]);
        }
      })
      .catch(() => {
        setCategories([
          { id: 1, name: 'Asamblea General', slug: 'asamblea-general', type: 'minutes' },
          { id: 2, name: 'Comisión Directiva', slug: 'comision-directiva', type: 'minutes' },
          { id: 3, name: 'Resoluciones Institucionales', slug: 'resoluciones-institucionales', type: 'minutes' },
          { id: 4, name: 'TEAM EUROPE', slug: 'team-europe', type: 'minutes' },
          { id: 5, name: 'UCCEB', slug: 'ucceb', type: 'minutes' },
          { id: 6, name: 'ECA', slug: 'eca', type: 'minutes' },
        ] as Category[]);
      })
      .finally(() => setLoadingCats(false));
  };

  const fetchMinutes = (q?: string, cat?: string) => {
    setLoading(true);
    adminApi
      .getMinutes(q, cat)
      .then((data) => {
        setMinutes(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching minutes:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
    fetchMinutes();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMinutes(searchQuery, selectedCategory);
  };

  const handleFilterCategory = (cat: string) => {
    setSelectedCategory(cat);
    fetchMinutes(searchQuery, cat);
  };

  const toggleCategory = (catName: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(catName)) {
        if (prev.length === 1) return prev; // Keep at least one category
        return prev.filter((c) => c !== catName);
      } else {
        return [...prev, catName];
      }
    });
  };

  const resetForm = () => {
    setEditingMinute(null);
    setTitle('');
    setSelectedCategories([categories.length > 0 ? categories[0].name : 'Asamblea General']);
    setDescription('');
    setContent('');
    setCoverImageUrl('');
    setAuthorAvatarUrl('');
    setLogoUrl('');
    setMeetingDate(new Date().toISOString().split('T')[0]);
    setDocumentMode('text');
    setFileUrl('');
    setFileName('');
    setFileSize('');
    setIsActive(true);
    setErrorMessage(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (minute: PartnerMinute) => {
    setEditingMinute(minute);
    setTitle(minute.title);
    const parsedCats = parseMinuteCategories(minute);
    setSelectedCategories(parsedCats.length > 0 ? parsedCats : ['Asamblea General']);
    setDescription(minute.description || '');
    setContent(minute.content || '');
    setCoverImageUrl(minute.cover_image_url || '');
    setAuthorAvatarUrl(minute.author_avatar_url || '');
    setLogoUrl(minute.logo_url || '');
    setMeetingDate(minute.meeting_date || new Date().toISOString().split('T')[0]);
    setDocumentMode((minute.document_type as any) || (minute.content && minute.file_url ? 'both' : minute.content ? 'text' : 'file'));
    setFileUrl(minute.file_url || '');
    setFileName(minute.file_name || '');
    setFileSize(minute.file_size || '');
    setIsActive(minute.is_active !== undefined ? Boolean(minute.is_active) : true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setErrorMessage('El título del acta es obligatorio.');
      return;
    }

    const finalCategories = selectedCategories.length > 0 ? selectedCategories : ['Asamblea General'];

    if (documentMode === 'text' && !content.trim()) {
      setErrorMessage('Debe ingresar el texto completo del acta.');
      return;
    }

    if (documentMode === 'file' && !fileUrl.trim()) {
      setErrorMessage('Debe adjuntar un archivo PDF o ingresar su enlace.');
      return;
    }

    const payload: Partial<PartnerMinute> = {
      title: title.trim(),
      category: finalCategories.join(', '),
      categories: finalCategories,
      description: description.trim() || undefined,
      content: (documentMode === 'text' || documentMode === 'both') ? content.trim() : undefined,
      cover_image_url: coverImageUrl.trim() || undefined,
      author_avatar_url: authorAvatarUrl.trim() || undefined,
      logo_url: logoUrl.trim() || undefined,
      meeting_date: meetingDate,
      document_type: documentMode,
      file_url: (documentMode !== 'text') ? fileUrl.trim() || undefined : undefined,
      file_name: fileName || (documentMode === 'text' ? 'Acta Digital' : undefined),
      file_size: fileSize || (documentMode === 'text' ? `${content.trim().split(/\s+/).filter(Boolean).length} palabras` : undefined),
      is_active: isActive ? 1 : 0,
    };

    setActionLoading(true);
    try {
      if (editingMinute) {
        await adminApi.updateMinute(editingMinute.id, payload);
        setSuccessMessage('Acta institucional actualizada exitosamente.');
      } else {
        await adminApi.createMinute(payload);
        setSuccessMessage('Acta institucional registrada y publicada exitosamente.');
      }
      setIsModalOpen(false);
      fetchMinutes(searchQuery, selectedCategory);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.response?.data?.messages?.error || err.response?.data?.message || 'Error al guardar el acta.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number, minuteTitle: string) => {
    if (!window.confirm(`¿Está seguro de eliminar el acta "${minuteTitle}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await adminApi.deleteMinute(id);
      setSuccessMessage('Acta eliminada correctamente.');
      fetchMinutes(searchQuery, selectedCategory);
    } catch (err: any) {
      console.error(err);
      alert('Error al eliminar el acta.');
    }
  };

  // Category Management Handlers
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameInput.trim()) return;
    setCatActionLoading(true);
    setCatError(null);
    try {
      await adminApi.createCategory({
        name: catNameInput.trim(),
        type: 'minutes',
      });
      setCatNameInput('');
      fetchCategories();
    } catch (err: any) {
      setCatError('Error al crear la categoría.');
    } finally {
      setCatActionLoading(false);
    }
  };

  const handleUpdateCategory = async (id: number) => {
    if (!catNameInput.trim()) return;
    setCatActionLoading(true);
    setCatError(null);
    try {
      await adminApi.updateCategory(id, {
        name: catNameInput.trim(),
        type: 'minutes',
      });
      setEditingCat(null);
      setCatNameInput('');
      fetchCategories();
    } catch (err: any) {
      setCatError('Error al actualizar la categoría.');
    } finally {
      setCatActionLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (!window.confirm(`¿Desea eliminar la categoría "${name}"?`)) return;
    try {
      await adminApi.deleteCategory(id);
      fetchCategories();
    } catch (err: any) {
      alert('Error al eliminar la categoría.');
    }
  };

  // Statistics
  const totalMinutes = minutes.length;
  const activeMinutes = minutes.filter((m) => m.is_active !== 0).length;
  const totalDownloads = minutes.reduce((acc, m) => acc + (m.downloads || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
              <FileCheck2 className="w-5 h-5" />
            </span>
            <h1 className="font-serif font-bold text-xl text-cicha-navy">
              Actas Institucionales & Resoluciones
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Administre y certifique las actas de asambleas, comités y resoluciones directivas para el Portal de Socios.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setCatError(null);
              setCatNameInput('');
              setEditingCat(null);
              setIsCategoryModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 shadow-xs transition-all cursor-pointer"
          >
            <FolderTree className="w-3.5 h-3.5 text-blue-600" />
            <span>Gestionar Categorías</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Acta Oficial</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Actas</span>
            <p className="text-xl font-bold text-slate-800">{totalMinutes}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Activas / Visibles</span>
            <p className="text-xl font-bold text-emerald-700">{activeMinutes}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Descargas</span>
            <p className="text-xl font-bold text-indigo-700">{totalDownloads}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Categorías</span>
            <p className="text-xl font-bold text-amber-700">{categories.length}</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => handleFilterCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-cicha-navy text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas ({totalMinutes})
          </button>
          {categories.map((cat) => {
            const count = minutes.filter((m) => m.category === cat.name).length;
            return (
              <button
                key={cat.id}
                onClick={() => handleFilterCategory(cat.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'bg-cicha-navy text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título o contenido..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Minutes Table */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader size="lg" />
        </div>
      ) : minutes.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-600 text-sm font-semibold">No se encontraron actas registradas</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Haga clic en <strong>"Nueva Acta Oficial"</strong> para registrar la primera acta institucional de CICHA.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Acta & Sesión</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Documento</th>
                  <th className="p-4">Publicado Por</th>
                  <th className="p-4 text-center">Descargas</th>
                  <th className="p-4 text-center">Estado</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {minutes.map((minute) => {
                  const isPdf = minute.document_type === 'file';
                  return (
                    <tr key={minute.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="space-y-1 max-w-md">
                          <p className="font-bold text-slate-800 text-sm line-clamp-1">{minute.title}</p>
                          {minute.description && (
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                              {minute.description}
                            </p>
                          )}
                          <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Calendar className="w-3.5 h-3.5 text-blue-500" />
                            <span>Sesión del: {minute.meeting_date || 'N/A'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-[220px]">
                          {parseMinuteCategories(minute).map((catName, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-100 text-[10px] whitespace-nowrap shadow-2xs"
                            >
                              {catName}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {minute.document_type === 'text' ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1.5 text-amber-700 font-bold">
                              <FileText className="w-3.5 h-3.5 text-amber-500" />
                              <span>Acta Digital (Texto)</span>
                            </span>
                            <p className="text-[10px] text-slate-400">
                              {minute.content ? `${minute.content.split(/\s+/).filter(Boolean).length} palabras` : 'Texto Oficial'}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (minute.file_url) {
                                  setPdfPreview({
                                    isOpen: true,
                                    url: minute.file_url,
                                    title: minute.title,
                                    fileName: minute.file_name,
                                    fileSize: minute.file_size,
                                  });
                                }
                              }}
                              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-rose-500" />
                              <span>{minute.file_name || (minute.document_type === 'both' ? 'Texto + PDF' : 'Documento PDF')}</span>
                              <Eye className="w-3 h-3" />
                            </button>
                            {minute.file_size && (
                              <p className="text-[10px] text-slate-400">{minute.file_size}</p>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <p className="font-medium text-slate-700">{minute.user_name || 'Secretaría General'}</p>
                          <p className="text-[10px] text-slate-400">
                            {minute.created_at ? new Date(minute.created_at).toLocaleDateString() : ''}
                          </p>
                        </div>
                      </td>

                      <td className="p-4 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                          {minute.downloads || 0}
                        </span>
                      </td>

                      <td className="p-4 text-center whitespace-nowrap">
                        {minute.is_active !== 0 ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            Activo
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px]">
                            Borrador
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {minute.file_url && (
                            <button
                              type="button"
                              onClick={() => setPdfPreview({
                                isOpen: true,
                                url: minute.file_url!,
                                title: minute.title,
                                fileName: minute.file_name,
                                fileSize: minute.file_size,
                              })}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                              title="Ver documento PDF"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(minute)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Editar Acta"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(minute.id, minute.title)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Eliminar Acta"
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

      {/* Modal Crear / Editar Acta */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMinute ? 'Editar Acta Institucional' : 'Registrar Nueva Acta Oficial'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Título */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              Título Oficial del Acta / Resolución *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Acta N° 45 - Asamblea General Ordinaria 2026"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              required
            />
          </div>

          {/* Modalidad de Publicación */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Modalidad de Publicación</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                  Redacción directa
                </span>
              </button>

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
                  Link externo
                </span>
              </button>
            </div>
          </div>

          {/* Categorías Multiselección y Fecha de Sesión */}
          <div className="space-y-4">
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Categorías Institucionales Asignadas *
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Seleccione una o varias categorías (ej. Asambleas, Comisión Directiva, TEAM EUROPE, UCCEB, ECA).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCatError(null);
                    setCatNameInput('');
                    setEditingCat(null);
                    setIsCategoryModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-blue-600 font-bold text-[11px] border border-slate-300 shadow-2xs transition-all cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Crear Categoría</span>
                </button>
              </div>

              {/* Chips de Categorías Seleccionables */}
              <div className="flex flex-wrap gap-2 pt-1">
                {categories.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.name);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.name)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <Tag className="w-3 h-3 text-slate-400" />
                      )}
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              {selectedCategories.length === 0 && (
                <p className="text-[11px] text-rose-500 font-bold">
                  * Debe seleccionar al menos una categoría.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Fecha de Sesión / Asamblea *
              </label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Autores, Foto de Autor y Logo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <ImageUploader
                label="Foto del Firmante / Autor / Persona (Opcional)"
                value={authorAvatarUrl}
                onChange={(url) => setAuthorAvatarUrl(url)}
                helperText="Retrato o avatar del secretario/autor (JPG, PNG)"
                previewHeight="h-24"
              />
            </div>

            <div>
              <ImageUploader
                label="Logo / Imagen Relacionada (Opcional)"
                value={logoUrl}
                onChange={(url) => setLogoUrl(url)}
                helperText="Logo institucional o de la entidad (TEAM EUROPE, etc.)"
                previewHeight="h-24"
              />
            </div>
          </div>

          {/* Resumen Breve */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              Pequeña descripción / Resumen o Puntos Clave (Opcional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describa los acuerdos principales aprobados en la asamblea..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Portada / Tapa */}
          <ImageUploader
            label="Imagen de Portada / Tapa del Acta (Opcional)"
            value={coverImageUrl}
            onChange={(url) => setCoverImageUrl(url)}
            helperText="Tapa del documento o gacetilla (JPG, PNG, WEBP)"
            previewHeight="h-32"
          />

          {/* Subida o Enlace de PDF (si modalidad es file o both o url) */}
          {(documentMode === 'file' || documentMode === 'both' || documentMode === 'url') && (
            <div className="p-4 bg-blue-50/50 border border-blue-200/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-blue-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Documento PDF / Archivo Certificado</span>
                </label>
                {fileUrl && (
                  <button
                    type="button"
                    onClick={() => setPdfPreview({
                      isOpen: true,
                      url: fileUrl,
                      title: title || 'Vista Previa del Acta',
                      fileName: fileName,
                      fileSize: fileSize,
                    })}
                    className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-bold underline"
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
                  setFileName(newUrl.split('/').pop() || 'acta.pdf');
                }}
                helperText="El visor interactivo permitirá a los socios leer, rotar, descargar e imprimir este PDF directamente."
              />
            </div>
          )}

          {/* Cuerpo / Transcripción del Acta (si modalidad es text o both) */}
          {(documentMode === 'text' || documentMode === 'both') && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">
                  Transcripción / Texto Completo del Acta {documentMode === 'text' ? '*' : '(Opcional)'}
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {content.trim().split(/\s+/).filter(Boolean).length} palabras
                </span>
              </div>
              <textarea
                rows={8}
                required={documentMode === 'text'}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`En la Ciudad Autónoma de Buenos Aires, a los ... días del mes de ... de 2026, se reúne la Comisión Directiva de la Cámara de Industria, Comercio y Afines Argentino-Helénica (CICHA)...\n\nORDEN DEL DÍA:\n1. Lectura y aprobación del acta anterior.\n2. Informe de Presidencia y Secretaría General.\n3. Acuerdos y Resoluciones tomadas...\n\nRESOLUCIÓN N° 1: Se aprueba por unanimidad...`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all"
              />
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActiveMinute"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="isActiveMinute" className="text-xs font-bold text-slate-700 cursor-pointer">
              Publicar inmediatamente en el Portal de Socios (Activo)
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {actionLoading ? (
                <>
                  <Loader size="sm" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{editingMinute ? 'Guardar Cambios' : 'Publicar Acta Oficial'}</span>
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
        fileUrl={pdfPreview.url}
        title={pdfPreview.title}
        fileName={pdfPreview.fileName}
        fileSize={pdfPreview.fileSize}
      />

      {/* Modal Gestionar Categorías de Actas */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Gestionar Categorías de Actas"
      >
        <div className="space-y-5">
          <p className="text-xs text-slate-500">
            Administre las categorías disponibles para clasificar las actas oficiales en el Portal de Socios.
          </p>

          {catError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{catError}</span>
            </div>
          )}

          {/* Form Crear / Editar Categoría */}
          <form
            onSubmit={(e) => {
              if (editingCat) {
                e.preventDefault();
                handleUpdateCategory(editingCat.id);
              } else {
                handleCreateCategory(e);
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Nombre de la categoría (ej: Comisión Revisora)..."
              value={catNameInput}
              onChange={(e) => setCatNameInput(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            {editingCat && (
              <button
                type="button"
                onClick={() => {
                  setEditingCat(null);
                  setCatNameInput('');
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={catActionLoading}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              {catActionLoading ? 'Guardando...' : editingCat ? 'Actualizar' : 'Agregar'}
            </button>
          </form>

          {/* Lista de Categorías */}
          {loadingCats ? (
            <div className="py-6 flex justify-center">
              <Loader size="md" />
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
              {categories.map((cat) => (
                <div key={cat.id} className="p-3 flex items-center justify-between hover:bg-slate-50 text-xs">
                  <span className="font-semibold text-slate-700">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingCat(cat);
                        setCatNameInput(cat.name);
                      }}
                      className="p-1 rounded-md text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                      title="Editar nombre"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1 rounded-md text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Eliminar categoría"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
