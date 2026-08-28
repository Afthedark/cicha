import React, { useEffect, useState } from 'react';
import {
  Inbox,
  MessageSquare,
  Building,
  Mail,
  Phone,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  ExternalLink,
  Tag,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { MembershipApplication, ContactMessage } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminMessagesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'messages' | 'applications'>('messages');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected message / application modal
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [selectedApp, setSelectedApp] = useState<MembershipApplication | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchInbox();
  }, []);

  const fetchInbox = () => {
    setLoading(true);
    Promise.all([adminApi.getMessages(), adminApi.getApplications()])
      .then(([msgs, apps]) => {
        setMessages(msgs || []);
        setApplications(apps || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // Message handlers
  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMsg(msg);
    if (!msg.is_read) {
      await adminApi.updateMessage(msg.id, { is_read: 1 });
      fetchInbox();
    }
  };

  const handleToggleMsgStatus = async (status: string) => {
    if (!selectedMsg) return;
    try {
      await adminApi.updateMessage(selectedMsg.id, { status });
      setSelectedMsg((prev) => (prev ? { ...prev, status: status as any } : null));
      fetchInbox();
    } catch {
      alert('Error al actualizar estado.');
    }
  };

  const handleDeleteMsg = async (id: number) => {
    if (!window.confirm('¿Desea eliminar este mensaje?')) return;
    try {
      await adminApi.deleteMessage(id);
      setSelectedMsg(null);
      fetchInbox();
    } catch {
      alert('Error al eliminar');
    }
  };

  // Application handlers
  const handleUpdateAppStatus = async (status: string, notes?: string) => {
    if (!selectedApp) return;
    setUpdating(true);
    try {
      await adminApi.updateApplication(selectedApp.id, { status, notes });
      setSelectedApp((prev) =>
        prev ? { ...prev, status: status as any, notes: notes ?? prev.notes } : null
      );
      fetchInbox();
    } catch {
      alert('Error al actualizar solicitud.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteApp = async (id: number) => {
    if (!window.confirm('¿Desea eliminar esta solicitud?')) return;
    try {
      await adminApi.deleteApplication(id);
      setSelectedApp(null);
      fetchInbox();
    } catch {
      alert('Error al eliminar');
    }
  };

  const unreadMsgCount = messages.filter((m) => !m.is_read).length;
  const pendingAppCount = applications.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-xl text-cicha-navy">Bandeja de Entrada Unificada</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centro de atención y seguimiento de consultas de contacto y solicitudes de afiliación societaria.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'messages'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Consultas de Contacto ({messages.length})
          {unreadMsgCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px]">
              {unreadMsgCount} nuevas
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'applications'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Inbox className="w-4 h-4" />
          Solicitudes de Afiliación ({applications.length})
          {pendingAppCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px]">
              {pendingAppCount} pendientes
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <Loader text="Cargando bandeja de entrada..." />
      ) : activeTab === 'messages' ? (
        /* Messages Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Fecha</th>
                  <th className="py-3.5 px-4">Remitente</th>
                  <th className="py-3.5 px-4">Asunto</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      !msg.is_read ? 'bg-blue-50/40 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {new Date(msg.created_at).toLocaleDateString('es-AR')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-bold">{msg.name}</div>
                      <div className="text-[11px] text-slate-500">{msg.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 truncate max-w-xs">{msg.subject}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={msg.is_read ? 'secondary' : 'info'}>
                        {msg.is_read ? 'Leído' : 'Nuevo'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenMessage(msg)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 font-semibold flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Leer
                        </button>
                        <button
                          onClick={() => handleDeleteMsg(msg.id)}
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
      ) : (
        /* Applications Table */
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
                          onClick={() => handleDeleteApp(app.id)}
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

      {/* Message Modal */}
      {selectedMsg && (
        <Modal
          isOpen={!!selectedMsg}
          onClose={() => setSelectedMsg(null)}
          title={`Mensaje: ${selectedMsg.subject}`}
          maxWidth="lg"
        >
          <div className="space-y-5 text-xs text-slate-800">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm text-cicha-navy">{selectedMsg.name}</p>
                <span className="text-slate-400">
                  {new Date(selectedMsg.created_at).toLocaleString('es-AR')}
                </span>
              </div>
              <p className="text-slate-600 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <a href={`mailto:${selectedMsg.email}`} className="text-blue-700 hover:underline">
                  {selectedMsg.email}
                </a>
              </p>
              {selectedMsg.phone && (
                <p className="text-slate-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  {selectedMsg.phone}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-700">Contenido del Mensaje:</h4>
              <div className="p-4 rounded-xl border border-slate-200 bg-white leading-relaxed text-slate-800 whitespace-pre-wrap">
                {selectedMsg.message}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleMsgStatus('responded')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold"
                >
                  Marcar Respondido
                </button>
                <button
                  onClick={() => handleToggleMsgStatus('archived')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Archivar
                </button>
              </div>

              <a
                href={`mailto:${selectedMsg.email}?subject=RE: ${encodeURIComponent(selectedMsg.subject)}`}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4" />
                Responder
              </a>
            </div>
          </div>
        </Modal>
      )}

      {/* Application Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Solicitud: ${selectedApp.company_name}`}
          maxWidth="xl"
        >
          <div className="space-y-6 text-xs text-slate-800">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Estado:</span>
                <Badge variant={selectedApp.status === 'pending' ? 'warning' : 'success'}>
                  {selectedApp.status}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  disabled={updating}
                  onClick={() => handleUpdateAppStatus('in_review')}
                  className="px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold"
                >
                  En Revisión
                </button>
                <button
                  disabled={updating}
                  onClick={() => handleUpdateAppStatus('approved')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Aprobar
                </button>
                <button
                  disabled={updating}
                  onClick={() => handleUpdateAppStatus('rejected')}
                  className="px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold"
                >
                  Rechazar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <h3 className="font-serif font-bold text-sm text-cicha-navy flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-blue-600" /> Datos de la Empresa
                </h3>
                <p><strong>Razón Social:</strong> {selectedApp.company_name}</p>
                <p><strong>CUIT / ID:</strong> {selectedApp.cuit_rut || 'No informado'}</p>
                <p><strong>Sector:</strong> {selectedApp.sector}</p>
                <p><strong>Sitio Web:</strong> {selectedApp.website || 'No informado'}</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <h3 className="font-serif font-bold text-sm text-cicha-navy flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-blue-600" /> Contacto Responsable
                </h3>
                <p><strong>Nombre:</strong> {selectedApp.contact_name}</p>
                <p><strong>Cargo:</strong> {selectedApp.contact_role || 'No informado'}</p>
                <p><strong>Email:</strong> {selectedApp.email}</p>
                <p><strong>Teléfono:</strong> {selectedApp.phone}</p>
              </div>
            </div>

            {selectedApp.comments && (
              <div className="space-y-1">
                <h4 className="font-bold text-slate-700">Comentarios:</h4>
                <p className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                  {selectedApp.comments}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
