import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  Globe2,
} from 'lucide-react';
import { publicApi } from '../../services/api';
import type { Settings } from '../../types';
import { Badge } from '../../components/common/Badge';
import bgHeader from '../../assets/static/9.jpeg';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [settings, setSettings] = useState<Settings>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: searchParams.get('asunto') || '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    publicApi.getSettings().then((res) => {
      if (res) setSettings(res);
    }).catch(() => {});
  }, []);

  const getMailtoLink = (email: string) => {
    const subject = encodeURIComponent(settings.email_prefilled_subject || 'Consulta desde la Web Oficial de CICHA');
    const body = encodeURIComponent(settings.email_prefilled_body || 'Hola, vengo de la web de CICHA y me gustaría solicitar información sobre...');
    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  useEffect(() => {
    const asunto = searchParams.get('asunto');
    if (asunto) {
      setFormData((prev) => ({ ...prev, subject: asunto }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await publicApi.submitContact(formData);
      setSubmitted(true);
    } catch (err: any) {
      setError(
        err.response?.data?.messages
          ? Object.values(err.response.data.messages).join(' ')
          : 'Ocurrió un error al enviar el mensaje. Intente nuevamente.'
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
            alt="Contacto Institucional CICHA"
            className="w-full h-full object-cover object-center transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071E38]/95 via-[#005EAF]/80 to-[#071E38]/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071E38]/90 via-transparent to-black/30" />
        </div>

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <Badge variant="gold">Canal Oficial</Badge>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight drop-shadow-md">
            Contacto & Atención Institucional
          </h1>
          <p className="text-slate-200 text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed drop-shadow">
            Estamos a disposición de empresas, diplomáticos y emprendedores interesados en el intercambio comercial y cultural bilateral.
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Contact Information Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-cicha-navy rounded-3xl p-8 text-white border border-blue-900 shadow-xl space-y-6">
              <div>
                <h2 className="font-serif font-bold text-xl text-white">Sede Central - Κεντρικά Γραφεία</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Ciudad Autónoma de Buenos Aires, República Argentina
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-800 flex items-center justify-center text-cicha-sky shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Dirección / Headquarters</p>
                    <p className="text-slate-300">
                      {settings.address_street || 'Julián Alvarez 1030 (C1414)'}{settings.address_city ? `, ${settings.address_city}` : ', C.A.B.A., Argentina'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-800 flex items-center justify-center text-cicha-sky shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Contacto - Επικοινωνία</p>
                    <a
                      href={`tel:${(settings.phone_primary || '+5491167573851').replace(/[^0-9+]/g, '')}`}
                      className="text-cicha-sky hover:underline font-mono text-xs"
                    >
                      Tel.: {settings.phone_primary || '(+54 9 11) 6757.3851'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-800 flex items-center justify-center text-cicha-sky shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Correos Oficiales</p>
                    <div className="space-y-0.5">
                      <a
                        href={getMailtoLink(settings.contact_email || 'camarahelenoargentina@gmail.com')}
                        className="block text-cicha-sky hover:underline font-mono"
                        title="Enviar correo a CICHA"
                      >
                        {settings.contact_email || 'camarahelenoargentina@gmail.com'}
                      </a>
                      {settings.contact_email_secondary && (
                        <a
                          href={getMailtoLink(settings.contact_email_secondary)}
                          className="block text-slate-300 hover:underline font-mono"
                          title="Enviar correo a CICHA"
                        >
                          {settings.contact_email_secondary}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-800 flex items-center justify-center text-cicha-sky shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Horario de Atención</p>
                    <p className="text-slate-300">{settings.office_hours || 'Lunes a Viernes de 09:00 a 18:00 hs (ART)'}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-blue-900/80">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  CICHA es miembro activo de EUROCAMARA Argentina, integra la UCCEB (32 cámaras) y forma parte del nodo EEN (Enterprise Europe Network) de la Unión Europea.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6">
            <div>
              <h2 className="font-serif font-bold text-2xl text-cicha-navy">
                Envíenos un Mensaje
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Responderemos a su consulta en menos de 24 horas hábiles.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-serif font-bold text-lg text-emerald-950">¡Mensaje Enviado con Éxito!</h3>
                <p className="text-xs text-emerald-800">
                  Hemos recibido su mensaje correctamente. Nuestro equipo se pondrá en contacto a la brevedad.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Nombre y Apellido *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Su nombre"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="suemail@ejemplo.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Teléfono (Opcional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+54 11 ...."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Asunto *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Motivo de la consulta"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mensaje / Consulta *</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Escriba aquí su mensaje detallado..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-cicha-navy hover:bg-blue-900 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-cicha-sky" />
                  {loading ? 'Enviando mensaje...' : 'Enviar Mensaje'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
