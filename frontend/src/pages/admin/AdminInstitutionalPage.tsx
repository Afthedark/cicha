import React, { useEffect, useState } from 'react';
import {
  FileText,
  Edit2,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  HelpCircle,
  LayoutGrid,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { InstitutionalSection } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';

export const AdminInstitutionalPage: React.FC = () => {
  const [sections, setSections] = useState<InstitutionalSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSec, setEditingSec] = useState<InstitutionalSection | null>(null);
  const [formData, setFormData] = useState({
    section_key: '',
    title: '',
    subtitle: '',
    content: '',
    order_num: 1,
    is_active: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = () => {
    setLoading(true);
    adminApi
      .getInstitutional()
      .then((res) => {
        setSections(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleOpenCreate = () => {
    setEditingSec(null);
    setFormData({
      section_key: '',
      title: '',
      subtitle: '',
      content: '',
      order_num: sections.length + 1,
      is_active: 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sec: InstitutionalSection) => {
    setEditingSec(sec);
    setFormData({
      section_key: sec.section_key,
      title: sec.title,
      subtitle: sec.subtitle || '',
      content: sec.content || '',
      order_num: sec.order_num ?? 1,
      is_active: Number(sec.is_active) === 1 ? 1 : 0,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (sec: InstitutionalSection) => {
    const currentActive = Number(sec.is_active) === 1;
    const newActive = currentActive ? 0 : 1;
    setTogglingId(sec.id);
    try {
      await adminApi.updateInstitutional(sec.id, { is_active: newActive });
      setSections((prev) =>
        prev.map((s) => (s.id === sec.id ? { ...s, is_active: newActive } : s))
      );
    } catch (err) {
      alert('Error al cambiar el estado de la sección.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (sec: InstitutionalSection) => {
    if (!window.confirm(`¿Estás seguro de eliminar la sección "${sec.title}" (${sec.section_key})? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await adminApi.deleteInstitutional(sec.id);
      fetchSections();
    } catch (err) {
      alert('Error al eliminar la sección institucional.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.section_key.trim()) {
      alert('La clave de sección y el título son obligatorios.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingSec) {
        await adminApi.updateInstitutional(editingSec.id, formData);
      } else {
        await adminApi.createInstitutional(formData);
      }
      setIsModalOpen(false);
      setEditingSec(null);
      fetchSections();
    } catch (err: any) {
      const msg = err.response?.data?.messages?.error || err.response?.data?.message || 'Error al guardar la sección.';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-xl text-cicha-navy">Contenidos Institucionales</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión completa de Historia, Trayectoria, Redes Estratégicas y Presentación de CICHA.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Sección</span>
        </button>
      </div>

      {loading ? (
        <Loader text="Cargando secciones institucionales..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((sec) => {
            const isActive = Number(sec.is_active) === 1;
            const isToggling = togglingId === sec.id;

            return (
              <div
                key={sec.id}
                className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between space-y-4 shadow-xs ${
                  isActive ? 'border-slate-200 hover:border-blue-200' : 'border-slate-200/60 bg-slate-50/70 opacity-80'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar Badges and Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
                        Clave: {sec.section_key}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        Orden #{sec.order_num ?? 1}
                      </span>
                    </div>

                    {/* Quick State Toggle */}
                    <button
                      type="button"
                      disabled={isToggling}
                      onClick={() => handleToggleActive(sec)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border cursor-pointer ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                      }`}
                      title={isActive ? 'Click para ocultar de la web pública' : 'Click para activar en la web pública'}
                    >
                      {isActive ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                          <span>Oculto</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Section Title & Subtitle */}
                  <div>
                    <h2 className="font-serif font-bold text-lg text-cicha-navy">{sec.title}</h2>
                    {sec.subtitle && (
                      <p className="text-xs font-semibold text-amber-600 mt-0.5">{sec.subtitle}</p>
                    )}
                  </div>

                  {/* Body Content Preview */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-4 [overflow-wrap:anywhere] bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {sec.content || <em className="text-slate-400">Sin contenido de texto redactado</em>}
                  </p>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">
                    {isActive ? 'Mostrándose en web' : 'Oculto al público'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(sec)}
                      className="px-3 py-1.5 rounded-lg text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-200 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => handleDelete(sec)}
                      className="px-3 py-1.5 rounded-lg text-slate-700 bg-slate-50 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 hover:border-rose-200 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
                      title="Eliminar sección"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSec(null);
          }}
          title={editingSec ? `Editar Sección: ${editingSec.title}` : 'Nueva Sección Institucional'}
          maxWidth="2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  Clave Única (Slug) *
                  <span className="text-[10px] text-slate-400 font-normal">ej: historia, redes_estrategicas</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.section_key}
                  onChange={(e) => setFormData({ ...formData, section_key: e.target.value })}
                  placeholder="ej. historia"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Prioridad / Orden Numérico</label>
                <input
                  type="number"
                  min={1}
                  value={formData.order_num}
                  onChange={(e) => setFormData({ ...formData, order_num: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Título de la Sección *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="ej. Historia & Trayectoria"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Subtítulo / Bajada Institucional</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="ej. Forjando puentes comerciales bilaterales desde 1940"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Texto Institucional Completo *</label>
              <textarea
                rows={8}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Escribe aquí los párrafos explicativos de la sección..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Visibility toggle switch */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-xs">Visibilidad Pública</p>
                <p className="text-[11px] text-slate-500">
                  {formData.is_active ? 'La sección se mostrará visiblemente en la web pública.' : 'La sección permanecerá oculta al público general.'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active === 1}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingSec(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-xs cursor-pointer"
              >
                {submitting ? 'Guardando...' : editingSec ? 'Actualizar Sección' : 'Crear Sección'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

