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
import { Badge } from '../../components/common/Badge';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
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
      <section className="bg-gradient-to-br from-[#0B2545] via-[#071E38] to-[#040D1A] text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <Badge variant="gold">Atención & Consultas</Badge>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white">
            Contacto Institucional & Comercial
          </h1>
          <p className="text-slate-300 text-sm sm:text-base font-light max-w-2xl mx-auto">
            Estamos a su disposición para coordinar reuniones, consultas de comercio bilateral, afiliación y actividades con EUROCAMARA y la red EEN.
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Contact Information Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0B2545] rounded-3xl p-8 text-white border border-blue-900 shadow-xl space-y-6">
              <div>
                <h2 className="font-serif font-bold text-xl text-white">Sede Central</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Ciudad Autónoma de Buenos Aires, República Argentina
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-800 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Dirección</p>
                    <p className="text-slate-300">Av. Leandro N. Alem 1074, Piso 7 (C1001AAT)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-800 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Teléfonos de Contacto</p>
                    <p className="text-slate-300">+54 11 4328-9898 / 9899</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-800 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Correos Electrónicos</p>
                    <p className="text-slate-300">info@cicha.com.ar • comercio@cicha.com.ar</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-800 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Horario de Atención</p>
                    <p className="text-slate-300">Lunes a Viernes de 09:00 a 18:00 hs (ART)</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-blue-900/80">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  CICHA forma parte del nodo EEN (Enterprise Europe Network) y la red de cámaras europeas en Argentina.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6">
            <div>
              <h2 className="font-serif font-bold text-2xl text-[#0B2545]">
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
                  className="w-full py-3.5 rounded-xl bg-[#0B2545] hover:bg-blue-900 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-amber-400" />
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
