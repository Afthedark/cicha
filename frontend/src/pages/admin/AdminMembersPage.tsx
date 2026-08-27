import React, { useEffect, useState } from 'react';
import { Building, Plus, Edit2, Trash2, Globe, Mail, Phone } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { Member } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminMembersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [formData, setFormData] = useState({
    company_name: '',
    sector: '',
    description: '',
    services: '',
    logo_url: '',
    website_url: '',
    contact_email: '',
    contact_phone: '',
    country: 'Argentina',
    is_featured: 0,
    status: 'active' as 'active' | 'inactive',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = () => {
    setLoading(true);
    adminApi
      .getMembers()
      .then((res) => {
        setMembers(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleOpenCreate = () => {
    setEditingMember(null);
    setFormData({
      company_name: '',
      sector: '',
      description: '',
      services: '',
      logo_url: '',
      website_url: '',
      contact_email: '',
      contact_phone: '',
      country: 'Argentina',
      is_featured: 0,
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      company_name: member.company_name,
      sector: member.sector,
      description: member.description || '',
      services: member.services || '',
      logo_url: member.logo_url || '',
      website_url: member.website_url || '',
      contact_email: member.contact_email || '',
      contact_phone: member.contact_phone || '',
      country: member.country || 'Argentina',
      is_featured: member.is_featured ? 1 : 0,
      status: member.status || 'active',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingMember) {
        await adminApi.updateMember(editingMember.id, formData);
      } else {
        await adminApi.createMember(formData);
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (err) {
      alert('Error al guardar el socio.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Desea eliminar este socio del directorio?')) return;
    try {
      await adminApi.deleteMember(id);
      fetchMembers();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-xl text-[#0B2545]">Directorio de Empresas Socias</h1>
          <p className="text-xs text-slate-500 mt-0.5">Gestión de empresas asociadas a la Cámara.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Agregar Socio
        </button>
      </div>

      {loading ? (
        <Loader text="Cargando socios..." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Empresa</th>
                  <th className="py-3.5 px-4">Sector</th>
                  <th className="py-3.5 px-4">País</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((mem) => (
                  <tr key={mem.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{mem.company_name}</div>
                      <div className="text-[11px] text-slate-500">{mem.contact_email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{mem.sector}</td>
                    <td className="py-3.5 px-4 text-slate-500">{mem.country}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={mem.status === 'active' ? 'success' : 'secondary'}>
                        {mem.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(mem)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(mem.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Member Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? 'Editar Socio' : 'Nuevo Socio'}
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Razón Social / Nombre de la Empresa *</label>
            <input
              type="text"
              required
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Sector / Rubro *</label>
              <input
                type="text"
                required
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                placeholder="Ej. Marítimo, Agroindustria, Legal"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">País / Origen</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Email de Contacto</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Teléfono</label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Sitio Web</label>
            <input
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Descripción de la Empresa</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Servicios Ofrecidos</label>
            <textarea
              rows={2}
              value={formData.services}
              onChange={(e) => setFormData({ ...formData, services: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="mem_featured"
              checked={formData.is_featured === 1}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked ? 1 : 0 })}
              className="rounded text-blue-600"
            />
            <label htmlFor="mem_featured" className="font-semibold text-slate-700 cursor-pointer">
              Destacar en la portada principal (Home)
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
              {submitting ? 'Guardando...' : 'Guardar Socio'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
