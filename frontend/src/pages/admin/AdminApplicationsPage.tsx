import React, { useEffect, useState } from 'react';
import {
  Inbox,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Phone,
  Building,
  User,
  Globe,
  Printer,
  FileText,
  Calendar,
  ShieldCheck,
  Award,
  Download,
  AlertTriangle,
  Send,
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { MembershipApplication } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<MembershipApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  // Internal Verdict Evaluation State
  const [verdictForm, setVerdictForm] = useState({
    internal_verdict: 'pending' as 'pending' | 'approved' | 'rejected',
    internal_reasons: '',
    verdict_date: new Date().toISOString().slice(0, 10),
    approved_by_president: 'Presidente CICHA',
    approved_by_secretary: 'Secretario General CICHA',
    approved_by_treasurer: 'Tesorero CICHA',
    notes: '',
  });

  const [savingVerdict, setSavingVerdict] = useState(false);

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

  const handleOpenDetail = (app: MembershipApplication) => {
    setSelectedApp(app);
    setVerdictForm({
      internal_verdict: app.internal_verdict || (app.status === 'approved' ? 'approved' : app.status === 'rejected' ? 'rejected' : 'pending'),
      internal_reasons: app.internal_reasons || '',
      verdict_date: app.verdict_date ? app.verdict_date.slice(0, 10) : new Date().toISOString().slice(0, 10),
      approved_by_president: app.approved_by_president || 'Presidente CICHA',
      approved_by_secretary: app.approved_by_secretary || 'Secretario General CICHA',
      approved_by_treasurer: app.approved_by_treasurer || 'Tesorero CICHA',
      notes: app.notes || '',
    });
  };

  const handleSaveVerdict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setSavingVerdict(true);
    try {
      await adminApi.updateApplication(selectedApp.id, {
        status: verdictForm.internal_verdict === 'approved' ? 'approved' : verdictForm.internal_verdict === 'rejected' ? 'rejected' : 'in_review',
        ...verdictForm,
      });

      setSelectedApp((prev) => (prev ? { ...prev, ...verdictForm, status: verdictForm.internal_verdict === 'approved' ? 'approved' : verdictForm.internal_verdict === 'rejected' ? 'rejected' : 'in_review' } : null));
      fetchApplications();
      alert('Dictamen interno institucional guardado correctamente.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar dictamen interno.');
    } finally {
      setSavingVerdict(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Desea eliminar definitivamente este registro de solicitud?')) return;
    try {
      await adminApi.deleteApplication(id);
      setSelectedApp(null);
      fetchApplications();
    } catch (err) {
      alert('Error al eliminar la solicitud');
    }
  };

  const handlePrintOfficialSheet = () => {
    window.print();
  };

  const filteredApps = applications.filter((app) => {
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus || app.internal_verdict === filterStatus;
    const matchesSearch =
      app.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      app.contact_name?.toLowerCase().includes(search.toLowerCase()) ||
      app.email?.toLowerCase().includes(search.toLowerCase()) ||
      app.cuit_rut?.toLowerCase().includes(search.toLowerCase()) ||
      app.sector?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-xl text-cicha-navy flex items-center gap-2">
            <Inbox className="w-5 h-5 text-blue-600" />
            Solicitudes de Ingreso / Afiliación a CICHA
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bandeja de gestión, evaluación y dictamen oficial de aspirantes (Empresas y Personas Físicas).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterStatus === 'all' ? 'bg-cicha-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas ({applications.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterStatus === 'pending' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pendientes ({applications.filter((a) => a.status === 'pending' || a.internal_verdict === 'pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterStatus === 'approved' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Aceptadas ({applications.filter((a) => a.status === 'approved' || a.internal_verdict === 'approved').length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por Empresa, Solicitante, CUIT, Email o Sector..."
          className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
        />
      </div>

      {loading ? (
        <Loader text="Cargando solicitudes de ingreso..." />
      ) : filteredApps.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-serif font-bold text-base text-slate-700">No se encontraron solicitudes</h3>
          <p className="text-xs text-slate-500">No hay postulaciones en este criterio de búsqueda.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Fecha</th>
                  <th className="py-3.5 px-4">Tipo</th>
                  <th className="py-3.5 px-4">Solicitante / Empresa</th>
                  <th className="py-3.5 px-4">Contacto & Email</th>
                  <th className="py-3.5 px-4">Sector / Actividad</th>
                  <th className="py-3.5 px-4">Dictamen</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 font-medium whitespace-nowrap">
                      {new Date(app.created_at).toLocaleDateString('es-AR')}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        app.applicant_type === 'persona_fisica'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {app.applicant_type === 'persona_fisica' ? 'Persona Física' : 'Empresa'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        {app.company_logo_url && (
                          <img src={app.company_logo_url} alt="Logo" className="w-6 h-6 object-contain rounded" />
                        )}
                        <span>{app.company_name}</span>
                      </div>
                      {app.business_name && (
                        <div className="text-[10px] text-slate-400 font-normal">{app.business_name}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{app.contact_name}</div>
                      <div className="text-[11px] text-slate-400">{app.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{app.sector}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge
                        variant={
                          app.internal_verdict === 'approved' || app.status === 'approved'
                            ? 'success'
                            : app.internal_verdict === 'rejected' || app.status === 'rejected'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {app.internal_verdict === 'approved' || app.status === 'approved'
                          ? 'Aceptado'
                          : app.internal_verdict === 'rejected' || app.status === 'rejected'
                          ? 'No Aceptado'
                          : 'Pendiente'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(app)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Ver Ficha Completa y Dictamen"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar registro"
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

      {/* MODAL DETALLE OFICIAL (4 PÁGINAS) & DICTAMEN DE COMISIÓN DIRECTIVA */}
      {selectedApp && (
        <Modal
          isOpen={Boolean(selectedApp)}
          onClose={() => setSelectedApp(null)}
          title="Ficha Oficial de Solicitud de Ingreso a CICHA"
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs max-h-[80vh] overflow-y-auto pr-1">
            {/* Cabecera Oficial Imprimible */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="font-serif font-bold text-base text-cicha-sky">
                  Cámara de Industria y Comercio Heleno Argentina
                </div>
                <div className="text-[10px] text-slate-300">
                  Julian Alvarez 1030/40, CABA • camarahelenoargentina@gmail.com • www.cicha.com.ar
                </div>
                <div className="text-[9px] text-slate-400">
                  IGJ Res. 000900 (1989) • Reconocida por las Autoridades Griegas Dec. Presidencial N° 325 (1998)
                </div>
              </div>
              <button
                type="button"
                onClick={handlePrintOfficialSheet}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md"
              >
                <Printer className="w-4 h-4" /> Imprimir Ficha Oficial
              </button>
            </div>

            {/* PÁGINA 1: DATOS DEL SOLICITANTE */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-serif font-bold text-cicha-navy text-sm">
                  Página 1: Datos de la Empresa o Persona Física
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border">
                  {selectedApp.applicant_type === 'persona_fisica' ? 'Persona Física' : 'Empresa'}
                </span>
              </div>

              {selectedApp.company_logo_url && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                  <img src={selectedApp.company_logo_url} alt="Logo Empresa" className="w-16 h-16 object-contain rounded-lg border p-1" />
                  <div>
                    <div className="font-bold text-slate-800 text-xs">Logotipo Institucional Adjunto</div>
                    <a href={selectedApp.company_logo_url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 hover:underline">
                      Ver imagen en alta resolución
                    </a>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-medium">Nombre / Razón Social:</span>
                  <p className="font-bold text-slate-800">{selectedApp.company_name} {selectedApp.business_name && `(${selectedApp.business_name})`}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">CUIT / Documento:</span>
                  <p className="font-bold text-slate-800">{selectedApp.cuit_rut || `${selectedApp.doc_type || 'Doc'}: ${selectedApp.doc_number || 'N/A'}`}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Persona de Contacto / Cargo:</span>
                  <p className="font-bold text-slate-800">{selectedApp.contact_name} {selectedApp.contact_role && `• ${selectedApp.contact_role}`}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Sector / Profesión:</span>
                  <p className="font-bold text-slate-800">{selectedApp.sector} {selectedApp.profession && `• ${selectedApp.profession}`}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Teléfono / Celular:</span>
                  <p className="font-bold text-slate-800">{selectedApp.phone}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">E-mail:</span>
                  <p className="font-bold text-blue-600">{selectedApp.email}</p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 font-medium">Domicilio:</span>
                  <p className="font-bold text-slate-800">{selectedApp.address || 'No consignado'}</p>
                </div>
                {selectedApp.website && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 font-medium">Sitio Web / Perfil:</span>
                    <p><a href={selectedApp.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{selectedApp.website}</a></p>
                  </div>
                )}
              </div>
            </div>

            {/* PÁGINA 2: CONOCIMIENTO, SERVICIOS ADICIONALES Y CUOTA SOCIAL */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-serif font-bold text-cicha-navy text-sm block border-b border-slate-200 pb-2">
                Página 2: Conocimiento, Servicios de Interés y Modalidad de Pago
              </span>

              <div className="space-y-2">
                <div>
                  <span className="text-slate-400 font-medium">Canal de Conocimiento:</span>
                  <p className="font-bold text-slate-800">{selectedApp.referral_source || 'Página Web'}</p>
                </div>

                {selectedApp.additional_services && (
                  <div>
                    <span className="text-slate-400 font-medium">Servicios Adicionales Solicitados:</span>
                    <p className="font-bold text-slate-800 whitespace-pre-line">{selectedApp.additional_services}</p>
                  </div>
                )}

                <div>
                  <span className="text-slate-400 font-medium">Preferencia de Abono de Cuotas Sociales:</span>
                  <p className="font-bold text-emerald-700 uppercase">
                    {selectedApp.payment_preference === 'semestral' ? 'Cuota Semestral' : 'Cuota Anual'}
                  </p>
                </div>
              </div>
            </div>

            {/* PÁGINA 3: SOCIOS PRESENTANTES */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-serif font-bold text-cicha-navy text-sm block border-b border-slate-200 pb-2">
                Página 3: Presentación de Asociados Actuales (Socios Avalistas)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">Socio Presentante N° 1</span>
                  <p className="font-bold text-slate-800">{selectedApp.sponsor_1_name || 'No consignado'}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">Socio Presentante N° 2</span>
                  <p className="font-bold text-slate-800">{selectedApp.sponsor_2_name || 'No consignado'}</p>
                </div>
              </div>
            </div>

            {/* PÁGINA 4: RELACIÓN CON GRECIA */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-serif font-bold text-cicha-navy text-sm block border-b border-slate-200 pb-2">
                Página 4: Datos Informativos Adjuntos (Relación con Grecia)
              </span>

              <div>
                <span className="text-slate-400 font-medium">Tipo de Relación con la República Helénica:</span>
                <p className="font-bold text-slate-800">{selectedApp.greece_relation_type || 'Interés comercial general'}</p>
              </div>

              {selectedApp.greece_relation_details && (
                <div>
                  <span className="text-slate-400 font-medium">Detalles Declarados:</span>
                  <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200 mt-1">{selectedApp.greece_relation_details}</p>
                </div>
              )}

              {selectedApp.comments && (
                <div>
                  <span className="text-slate-400 font-medium">Comentarios / Observaciones del Solicitante:</span>
                  <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200 mt-1">{selectedApp.comments}</p>
                </div>
              )}
            </div>

            {/* DICTAMEN DE USO EXCLUSIVO INTERNO (COMISIÓN DIRECTIVA / SECRETARÍA) */}
            <form onSubmit={handleSaveVerdict} className="p-6 rounded-2xl bg-blue-50/70 border-2 border-blue-200 space-y-4">
              <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                <div className="font-serif font-bold text-cicha-navy text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  USO EXCLUSIVO INTERNO: Dictamen de Comisión Directiva
                </div>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  Admin & Secretaría
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 text-xs">Resolución del Dictamen *</label>
                  <select
                    value={verdictForm.internal_verdict}
                    onChange={(e) => setVerdictForm({ ...verdictForm, internal_verdict: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-xs"
                  >
                    <option value="pending">⏳ En Evaluación / Pendiente</option>
                    <option value="approved">✅ Aceptado / Incorporado</option>
                    <option value="rejected">❌ No Aceptado</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 text-xs">Lugar y Fecha de Resolución</label>
                  <input
                    type="date"
                    value={verdictForm.verdict_date}
                    onChange={(e) => setVerdictForm({ ...verdictForm, verdict_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 text-xs">Motivos y Fundamentos del Dictamen:</label>
                <textarea
                  rows={2}
                  value={verdictForm.internal_reasons}
                  onChange={(e) => setVerdictForm({ ...verdictForm, internal_reasons: e.target.value })}
                  placeholder="Consignar resolución de asamblea, número de acta o motivos institucionales..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                />
              </div>

              <div className="pt-2 border-t border-blue-200/80">
                <span className="font-bold text-slate-800 text-[11px] block mb-2">Firmas Institucionales Registradas:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500">Secretario General:</label>
                    <input
                      type="text"
                      value={verdictForm.approved_by_secretary}
                      onChange={(e) => setVerdictForm({ ...verdictForm, approved_by_secretary: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500">Tesorero:</label>
                    <input
                      type="text"
                      value={verdictForm.approved_by_treasurer}
                      onChange={(e) => setVerdictForm({ ...verdictForm, approved_by_treasurer: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500">Presidente:</label>
                    <input
                      type="text"
                      value={verdictForm.approved_by_president}
                      onChange={(e) => setVerdictForm({ ...verdictForm, approved_by_president: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  disabled={savingVerdict}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  {savingVerdict ? 'Guardando...' : 'Guardar Dictamen Oficial'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};
