import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { adminApi, resolveImageUrl } from '../../services/api';
import type { Banner } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';
import { ImageUploader } from '../../components/common/ImageUploader';

const INTERNAL_ROUTES = [
  '',
  '/asociarse',
  '/la-camara',
  '/institucional',
  '/noticias',
  '/eventos',
  '/socios',
  '/contacto',
  '/portal-socios',
];

export const AdminBannersPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    badge_text: '',
    image_url: '',
    button_text: '',
    button_url: '',
    order_num: 1,
    is_active: 1,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = () => {
    setLoading(true);
    adminApi
      .getBanners()
      .then((res) => {
        setBanners(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleOpenCreate = () => {
    setEditingBanner(null);
    setForm({
      title: '',
      subtitle: '',
      badge_text: 'Reconocimiento Oficial 1989 - 1998',
      image_url: '',
      button_text: 'Solicitar Membresía / Asociarse',
      button_url: '/asociarse',
      order_num: banners.length + 1,
      is_active: 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (bnr: Banner) => {
    setEditingBanner(bnr);
    setForm({
      title: bnr.title,
      subtitle: bnr.subtitle || '',
      badge_text: bnr.badge_text || '',
      image_url: bnr.image_url || '',
      button_text: bnr.button_text || '',
      button_url: bnr.button_url || '',
      order_num: bnr.order_num || 1,
      is_active: typeof bnr.is_active === 'number' ? bnr.is_active : bnr.is_active ? 1 : 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingBanner) {
        await adminApi.updateBanner(editingBanner.id, form);
      } else {
        await adminApi.createBanner(form);
      }
      setIsModalOpen(false);
      fetchBanners();
    } catch {
      alert('Error al guardar la portada.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Desea eliminar esta portada?')) return;
    try {
      await adminApi.deleteBanner(id);
      fetchBanners();
    } catch {
      alert('Error al eliminar la portada.');
    }
  };

  const isActive = (bnr: Banner) =>
    typeof bnr.is_active === 'number' ? bnr.is_active === 1 : bnr.is_active;

  const isInternalRoute = (url?: string) => INTERNAL_ROUTES.includes(url || '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-xl text-cicha-navy">Portadas / Banners del Home</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión del slider visual de la portada principal del sitio institucional.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Nueva Portada
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="font-bold">Portadas Principales del Home</p>
          <p className="text-blue-700 mt-0.5">
            Las portadas activas se mostrarán en el Slider superior del Home. Puedes subir imágenes de alta resolución, personalizar el texto y el botón.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition-all shrink-0 flex items-center gap-1.5 self-start sm:self-center"
        >
          <Plus className="w-3.5 h-3.5" /> Agregar Portada
        </button>
      </div>

      {/* List */}
      {loading ? (
        <Loader text="Cargando portadas..." />
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-12 text-center text-slate-500">
          <ImageIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="font-bold text-slate-700">No hay portadas registradas</p>
          <p className="text-xs text-slate-400 mt-1">
            Agrega tu primera portada para activar el slider visual en la página principal.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
          >
            Crear Portada
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {banners.map((bnr) => {
              const resolved = resolveImageUrl(bnr.image_url);
              return (
                <div
                  key={bnr.id}
                  className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {resolved ? (
                      <div className="w-24 h-16 sm:w-32 sm:h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                        <img src={resolved} alt={bnr.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-24 h-16 sm:w-32 sm:h-20 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm text-slate-900 truncate">{bnr.title}</h3>
                        {bnr.badge_text && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            {bnr.badge_text}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive(bnr) ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isActive(bnr) ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>

                      {bnr.subtitle && (
                        <p className="text-xs text-slate-500 line-clamp-2">{bnr.subtitle}</p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span>Orden: <strong>#{bnr.order_num}</strong></span>
                        {bnr.button_text && (
                          <span>
                            Botón: <strong>{bnr.button_text}</strong> ({bnr.button_url || '/'})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleOpenEdit(bnr)}
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-bold flex items-center gap-1"
                      title="Editar portada"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(bnr.id)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs font-bold flex items-center gap-1"
                      title="Eliminar portada"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBanner ? 'Editar Portada del Home' : 'Nueva Portada del Home'}
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Título Principal *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ej. Impulsando el Comercio Bilateral e Inversiones"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Insignia / Badge Superior</label>
              <input
                type="text"
                value={form.badge_text}
                onChange={(e) => setForm({ ...form, badge_text: e.target.value })}
                placeholder="Ej. Reconocimiento Oficial 1989 - 1998"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Orden de Visualización</label>
              <input
                type="number"
                min={1}
                value={form.order_num}
                onChange={(e) => setForm({ ...form, order_num: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <ImageUploader
            label="Imagen de Fondo de la Portada (Full HD / 1920x1080 recomendado)"
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url })}
            helperText="Sube fotografías de alta calidad (paisajes de Grecia, puertos comerciales, eventos diplomáticos)."
            previewHeight="h-44"
            aspectRatio="wide"
          />

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Subtítulo / Descripción</label>
            <textarea
              rows={3}
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="Descripción breve de la portada o mensaje institucional..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Texto del Botón</label>
              <input
                type="text"
                value={form.button_text}
                onChange={(e) => setForm({ ...form, button_text: e.target.value })}
                placeholder="Ej. Solicitar Membresía / Asociarse"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Enlace del Botón (Destino Automático)</label>
              <select
                value={INTERNAL_ROUTES.includes(form.button_url || '') ? form.button_url || '' : 'custom'}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'custom') {
                    if (INTERNAL_ROUTES.includes(form.button_url || '')) {
                      setForm({ ...form, button_url: 'https://' });
                    }
                  } else {
                    setForm({ ...form, button_url: val });
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="">-- Sin Botón / Enlace --</option>
                <optgroup label="Secciones Principales del Portal">
                  <option value="/asociarse">Membresía / Asociarse (/asociarse)</option>
                  <option value="/la-camara">La Cámara & Autoridades (/la-camara)</option>
                  <option value="/noticias">Noticias & Artículos (/noticias)</option>
                  <option value="/eventos">Agenda de Eventos (/eventos)</option>
                  <option value="/socios">Directorio de Socios (/socios)</option>
                  <option value="/contacto">Contacto Institucional (/contacto)</option>
                </optgroup>
                <optgroup label="Portal Exclusivo de Socios">
                  <option value="/portal-socios">Portal de Socios (/portal-socios)</option>
                </optgroup>
                <option value="custom">🌐 Otro enlace personalizado o URL externa...</option>
              </select>

              {!isInternalRoute(form.button_url) && (
                <input
                  type="text"
                  value={form.button_url}
                  onChange={(e) => setForm({ ...form, button_url: e.target.value })}
                  placeholder="Ej. https://ejemplo.com o /ruta-personalizada"
                  className="w-full mt-2 px-3.5 py-2 rounded-xl border border-blue-300 bg-blue-50/50 text-blue-900"
                />
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="font-bold text-slate-700">Estado de la Portada</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active === 1}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span className="font-semibold text-slate-700">Portada Activa (Visible en Home)</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              {submitting ? 'Guardando...' : 'Guardar Portada'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
