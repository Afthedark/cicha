import React, { useEffect, useState } from 'react';
import { MessageSquare, Eye, Trash2, Mail, Phone, Calendar, CheckCircle } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { ContactMessage } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    setLoading(true);
    adminApi
      .getMessages()
      .then((res) => {
        setMessages(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMsg(msg);
    if (!msg.is_read) {
      await adminApi.updateMessage(msg.id, { is_read: 1 });
      fetchMessages();
    }
  };

  const handleToggleStatus = async (status: string) => {
    if (!selectedMsg) return;
    try {
      await adminApi.updateMessage(selectedMsg.id, { status });
      setSelectedMsg((prev) => (prev ? { ...prev, status: status as any } : null));
      fetchMessages();
    } catch (err) {
      alert('Error al actualizar estado.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Desea eliminar este mensaje?')) return;
    try {
      await adminApi.deleteMessage(id);
      setSelectedMsg(null);
      fetchMessages();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="font-serif font-bold text-xl text-[#0B2545]">Mensajes y Consultas de Contacto</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Bandeja de entrada de consultas recibidas a través del portal institucional.
        </p>
      </div>

      {loading ? (
        <Loader text="Cargando mensajes..." />
      ) : (
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
                      !msg.is_read ? 'bg-blue-50/30 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 text-slate-500">
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
                          onClick={() => handleDelete(msg.id)}
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
                <p className="font-bold text-sm text-[#0B2545]">{selectedMsg.name}</p>
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
                  onClick={() => handleToggleStatus('responded')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold"
                >
                  Marcar como Respondido
                </button>
                <button
                  onClick={() => handleToggleStatus('archived')}
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
                Responder por Email
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
