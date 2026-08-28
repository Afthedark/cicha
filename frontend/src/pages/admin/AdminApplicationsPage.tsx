import React, { useEffect, useState } from 'react';
import { Inbox, Eye, Trash2, CheckCircle, Clock, XCircle, Mail, Phone, Building } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { MembershipApplication } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<MembershipApplication | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    setLoading(true);
    adminApi
      .getApplications()
      .then((res) => {
        setApplications(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleUpdateStatus = async (status: string, notes?: string) => {
    if (!selectedApp) return;
    setUpdating(true);
    try {
      await adminApi.updateApplication(selectedApp.id, { status, notes });
      setSelectedApp((prev) => (prev ? { ...prev, status: status as any, notes: notes ?? prev.notes } : null));
      fetchApplications();
    } catch (err) {
      alert('Error al actualizar el estado de la solicitud.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Desea eliminar este registro de solicitud?')) return;
    try {
      await adminApi.deleteApplication(id);
      setSelectedApp(null);
      fetchApplications();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="font-serif font-bold text-xl text-cicha-navy">Solicitudes de Afiliación</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Bandeja de empresas y profesionales que solicitan asociarse a CICHA.
        </p>
      </div>

      {loading ? (
        <Loader text="Cargando solicitudes..." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Fecha</th>
                  <th className="py-3.5 px-4">Empresa</th>
                  <th className="py-3.5 px-4">Contacto</th>
                  <th className="py-3.5 px-4">Sector</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {new Date(app.created_at).toLocaleDateString('es-AR')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{app.company_name}</td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{app.contact_name}</div>
                      <div className="text-[11px] text-slate-400">{app.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{app.sector}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          app.status === 'pending'
                            ? 'warning'
                            : app.status === 'approved'
                            ? 'success'
                            : app.status === 'contacted'
                            ? 'info'
                            : 'secondary'
                        }
                      >
                        {app.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 font-semibold flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Revisar
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
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

      {/* Details Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Solicitud: ${selectedApp.company_name}`}
          maxWidth="xl"
        >
          <div className="space-y-6 text-xs text-slate-800">
            {/* Status Change Bar */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Estado Actual:</span>
                <Badge
                  variant={
                    selectedApp.status === 'pending'
                      ? 'warning'
                      : selectedApp.status === 'approved'
                      ? 'success'
                      : 'info'
                  }
                >
                  {selectedApp.status}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  disabled={updating}
                  onClick={() => handleUpdateStatus('in_review')}
                  className="px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold"
                >
                  En Revisión
                </button>
                <button
                  disabled={updating}
                  onClick={() => handleUpdateStatus('contacted')}
                  className="px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold"
                >
                  Contactado
                </button>
                <button
                  disabled={updating}
                  onClick={() => handleUpdateStatus('approved')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Aprobar Afiliación
                </button>
                <button
                  disabled={updating}
                  onClick={() => handleUpdateStatus('rejected')}
                  className="px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold"
                >
                  Rechazar
                </button>
              </div>
            </div>

            {/* Company and Person Profile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <h3 className="font-serif font-bold text-sm text-cicha-navy flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-blue-600" />
                  Datos de la Empresa
                </h3>
                <p><strong>Razón Social:</strong> {selectedApp.company_name}</p>
                <p><strong>CUIT / ID:</strong> {selectedApp.cuit_rut || 'No informado'}</p>
                <p><strong>Sector:</strong> {selectedApp.sector}</p>
                <p><strong>Sitio Web:</strong> {selectedApp.website || 'No informado'}</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <h3 className="font-serif font-bold text-sm text-cicha-navy flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-blue-600" />
                  Contacto Responsable
                </h3>
                <p><strong>Nombre:</strong> {selectedApp.contact_name}</p>
                <p><strong>Cargo:</strong> {selectedApp.contact_role || 'No informado'}</p>
                <p><strong>Email:</strong> {selectedApp.email}</p>
                <p><strong>Teléfono:</strong> {selectedApp.phone}</p>
              </div>
            </div>

            {selectedApp.interests && (
              <div className="space-y-1">
                <h4 className="font-bold text-slate-700">Áreas de Interés:</h4>
                <p className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 text-slate-700">
                  {selectedApp.interests}
                </p>
              </div>
            )}

            {selectedApp.comments && (
              <div className="space-y-1">
                <h4 className="font-bold text-slate-700">Comentarios de la Empresa:</h4>
                <p className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                  {selectedApp.comments}
                </p>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <label className="font-bold text-slate-700">Notas Internas de la Cámara:</label>
              <textarea
                rows={3}
                defaultValue={selectedApp.notes || ''}
                onBlur={(e) => handleUpdateStatus(selectedApp.status, e.target.value)}
                placeholder="Escriba notas internas (seguimiento, cuota societaria, etc.)..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
