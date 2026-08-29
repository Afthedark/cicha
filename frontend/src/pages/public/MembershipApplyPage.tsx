import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle,
  Building,
  User,
  Mail,
  Phone,
  Globe,
  FileText,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { publicApi } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import bgHeader from '../../assets/static/7.webp';

export const MembershipApplyPage: React.FC = () => {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    contact_role: '',
    email: '',
    phone: '',
    cuit_rut: '',
    sector: '',
    website: '',
    interests: [] as string[],
    comments: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const interestOptions = [
    'Comercio Bilateral e Inversiones',
    'Participación en EUROCAMARA',
    'Red Enterprise Europe Network (EEN)',
    'Rondas de Negocios y Misiones Comerciales',
    'Asesoramiento Legal y Tributario Bilateral',
    'Networking con el Empresariado Heleno',
  ];

  const handleInterestToggle = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(item)
        ? prev.interests.filter((i) => i !== item)
        : [...prev.interests, item],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await publicApi.submitApplication(formData);
      setSubmitted(true);
    } catch (err: any) {
      setError(
        err.response?.data?.messages
          ? Object.values(err.response.data.messages).join(' ')
          : 'Ocurrió un error al enviar la solicitud. Verifique los datos e intente nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Banner */}
      <section className="relative overflow-hidden bg-cicha-navy-deep text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-cicha-sky shadow-xl text-center">
        {/* Background Static Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgHeader}
            alt="Membresía Empresarial CICHA"
            className="w-full h-full object-cover object-center transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071E38]/95 via-[#005EAF]/80 to-[#071E38]/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071E38]/90 via-transparent to-black/30" />
        </div>

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <Badge variant="gold">Membresía Empresarial</Badge>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight drop-shadow-md">
            Solicitud de Afiliación a CICHA
          </h1>
          <p className="text-slate-200 text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed drop-shadow">
            Únase a la Cámara de Industria y Comercio Heleno Argentina y acceda a foros de conocimiento, alianzas europeas y oportunidades de negocios bilaterales.
          </p>
        </div>
      </section>

      {/* Main Application Container */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {submitted ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-200 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif font-bold text-2xl text-cicha-navy">
                ¡Solicitud Recibida Exitosamente!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Agradecemos su interés en formar parte de la Cámara de Industria y Comercio Heleno Argentina. La Comisión Directiva revisará su presentación y nuestro equipo de secretaría se comunicará a la brevedad.
              </p>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  company_name: '',
                  contact_name: '',
                  contact_role: '',
                  email: '',
                  phone: '',
                  cuit_rut: '',
                  sector: '',
                  website: '',
                  interests: [],
                  comments: '',
                });
              }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
            >
              Enviar otra solicitud
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="font-serif font-bold text-xl text-cicha-navy">
                Formulario de Presentación Institucional
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Complete los campos para que la Comisión Directiva evalúe su perfil de empresa socia.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-600" />
                    Razón Social / Nombre de la Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="Ej. Aegean Foods S.A."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    CUIT / Tax ID (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.cuit_rut}
                    onChange={(e) => setFormData({ ...formData, cuit_rut: e.target.value })}
                    placeholder="30-XXXXXXXX-X"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    Sector / Rubro de Actividad *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    placeholder="Ej. Marítimo, Agroindustria, Energías, Tecnología, Legal"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    Sitio Web Oficial
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://suempresa.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact Person Info */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    placeholder="Ej. Dimitri Papadopoulos"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Cargo / Posición</label>
                  <input
                    type="text"
                    value={formData.contact_role}
                    onChange={(e) => setFormData({ ...formData, contact_role: e.target.value })}
                    placeholder="Director General / CEO"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    Teléfono de Contacto *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+54 11 ...."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  Correo Electrónico Corporativo *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contacto@suempresa.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              {/* Interests Checklist */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <label className="text-xs font-bold text-slate-700 block">
                  Áreas de Interés Institucional y Comercial:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {interestOptions.map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        formData.interests.includes(opt)
                          ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(opt)}
                        onChange={() => handleInterestToggle(opt)}
                        className="rounded text-blue-600 focus:ring-0"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Comentarios Adicionales o Breve Perfil de la Empresa:
                </label>
                <textarea
                  rows={4}
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  placeholder="Describa brevemente la actividad de su empresa, intereses en Grecia o Argentina..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Enviando solicitud...' : 'Enviar Solicitud de Afiliación'}
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
};
