import React, { useEffect, useState } from 'react';
import { FileText, Edit2, Save, CheckCircle } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { InstitutionalSection } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';

export const AdminInstitutionalPage: React.FC = () => {
  const [sections, setSections] = useState<InstitutionalSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSec, setEditingSec] = useState<InstitutionalSection | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
  });
  const [submitting, setSubmitting] = useState(false);

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

  const handleOpenEdit = (sec: InstitutionalSection) => {
    setEditingSec(sec);
    setFormData({
      title: sec.title,
      subtitle: sec.subtitle || '',
      content: sec.content,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSec) return;
    setSubmitting(true);
    try {
      await adminApi.updateInstitutional(editingSec.id, formData);
      setEditingSec(null);
      fetchSections();
    } catch (err) {
      alert('Error al guardar la sección.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="font-serif font-bold text-xl text-cicha-navy">Contenidos Institucionales</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Edición de la Misión, Objeto, Historia y Redes estratégicas de CICHA.
        </p>
      </div>

      {loading ? (
        <Loader text="Cargando secciones..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((sec) => (
            <div
              key={sec.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    Clave: {sec.section_key}
                  </span>
                  <button
                    onClick={() => handleOpenEdit(sec)}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center gap-1 text-xs font-bold"
                  >
                    <Edit2 className="w-4 h-4 text-blue-600" />
                    Editar
                  </button>
                </div>

                <h2 className="font-serif font-bold text-lg text-cicha-navy">{sec.title}</h2>
                {sec.subtitle && (
                  <p className="text-xs font-semibold text-amber-600">{sec.subtitle}</p>
                )}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                  {sec.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {editingSec && (
        <Modal
          isOpen={!!editingSec}
          onClose={() => setEditingSec(null)}
          title={`Editar Sección: ${editingSec.section_key}`}
          maxWidth="xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Título de la Sección *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Subtítulo / Bajada</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Texto Institucional Completo *</label>
              <textarea
                rows={8}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingSec(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                {submitting ? 'Guardando...' : 'Guardar Sección'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
