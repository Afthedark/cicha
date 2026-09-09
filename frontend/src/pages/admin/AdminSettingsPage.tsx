import React, { useEffect, useState } from 'react';
import { Save, CheckCircle, Mail, Globe, Settings as SettingsIcon } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { Settings } from '../../types';
import { Loader } from '../../components/common/Loader';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = () => {
    setLoading(true);
    adminApi
      .getSettings()
      .then((res) => {
        setSettings(res || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await adminApi.updateSettings(settings);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3500);
    } catch (err: any) {
      console.error('Error al guardar configuraciones:', err);
      const msg = err.response?.data?.message || err.response?.data?.messages?.error || 'Error al guardar configuraciones.';
      alert(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="font-serif font-bold text-xl text-cicha-navy flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-blue-600" />
          Ajustes Generales & Datos Institucionales
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configuración de contacto, correos predeterminados, logotipo, redes sociales y textos institucionales del portal.
        </p>
      </div>

      {loading ? (
        <Loader text="Cargando ajustes generales..." />
      ) : (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-base text-cicha-navy border-b border-slate-100 pb-3 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" /> Datos Institucionales y de Contacto
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Nombre del Portal</label>
                <input
                  type="text"
                  value={settings.site_name || ''}
                  onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Teléfono Oficial (+54 9 11 6757-3851)</label>
                <input
                  type="text"
                  value={settings.phone_primary || ''}
                  onChange={(e) => setSettings({ ...settings, phone_primary: e.target.value })}
                  placeholder="(+54 9 11) 6757.3851"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Email Institucional Principal</label>
                <input
                  type="email"
                  value={settings.contact_email || ''}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  placeholder="camarahelenoargentina@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Email Secundario / Alternativo</label>
                <input
                  type="email"
                  value={settings.contact_email_secondary || ''}
                  onChange={(e) => setSettings({ ...settings, contact_email_secondary: e.target.value })}
                  placeholder="info@camarahelenoargentina.org"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Dirección Sede Central (Calle y Altura)</label>
                <input
                  type="text"
                  value={settings.address_street || ''}
                  onChange={(e) => setSettings({ ...settings, address_street: e.target.value })}
                  placeholder="Julián Alvarez 1030 (C1414)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Ciudad y País</label>
                <input
                  type="text"
                  value={settings.address_city || ''}
                  onChange={(e) => setSettings({ ...settings, address_city: e.target.value })}
                  placeholder="C.A.B.A., Argentina"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-slate-700">Email Desk Comercio Exterior</label>
                <input
                  type="email"
                  value={settings.trade_email || ''}
                  onChange={(e) => setSettings({ ...settings, trade_email: e.target.value })}
                  placeholder="info@camarahelenoargentina.org"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              {/* Prefilled Email Subject & Body (Correos Institucionales) */}
              <div className="space-y-1.5 sm:col-span-2 pt-3 border-t border-slate-100">
                <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  Asunto Predeterminado al presionar Correos Institucionales de la Web (Subject)
                </label>
                <input
                  type="text"
                  value={settings.email_prefilled_subject || ''}
                  onChange={(e) => setSettings({ ...settings, email_prefilled_subject: e.target.value })}
                  placeholder="Ej. Consulta desde la Web Oficial de CICHA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
                <p className="text-[11px] text-slate-400">
                  Asunto que se completará automáticamente al presionar los correos institucionales de contacto de CICHA.
                </p>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-slate-800 text-xs">
                  Mensaje / Cuerpo Predeterminado al presionar Correos Institucionales (Body)
                </label>
                <textarea
                  rows={2}
                  value={settings.email_prefilled_body || ''}
                  onChange={(e) => setSettings({ ...settings, email_prefilled_body: e.target.value })}
                  placeholder="Ej. Hola, vengo de la web de CICHA y me gustaría solicitar información sobre..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
                <p className="text-[11px] text-slate-400">
                  Texto precargado en el cuerpo del correo institucional listo para que el usuario escriba su consulta.
                </p>
              </div>

              {/* Correos Socios: Mensaje Predeterminado (Directorio Web & B2B) */}
              <div className="space-y-1.5 sm:col-span-2 pt-4 border-t-2 border-blue-100 bg-blue-50/50 p-3.5 rounded-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1 rounded-lg bg-blue-600 text-white">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Correos Socios: Asunto & Mensaje Predeterminado</h4>
                    <p className="text-[11px] text-slate-500">
                      Configuración del asunto y cuerpo que se abrirá al hacer clic en el correo de cualquier socio en <strong>Socios Web Pública</strong> y <strong>Directorio B2B Privado</strong>.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 text-xs">
                      Asunto Predeterminado para Correos de Socios (Subject) *
                    </label>
                    <input
                      type="text"
                      value={settings.member_email_subject !== undefined ? settings.member_email_subject : 'MENSAJE POR MEDIO DE LA PAGINA DE CICHA'}
                      onChange={(e) => setSettings({ ...settings, member_email_subject: e.target.value })}
                      placeholder="MENSAJE POR MEDIO DE LA PAGINA DE CICHA"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-blue-900 focus:ring-2 focus:ring-blue-600"
                    />
                    <p className="text-[10.5px] text-slate-500">
                      Asunto predeterminado: <em>MENSAJE POR MEDIO DE LA PAGINA DE CICHA</em>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 text-xs">
                      Mensaje / Cuerpo Opcional para Correos de Socios (Body)
                    </label>
                    <textarea
                      rows={2}
                      value={settings.member_email_body || ''}
                      onChange={(e) => setSettings({ ...settings, member_email_body: e.target.value })}
                      placeholder="Ej. Estimados, nos comunicamos a través del Directorio de Socios de CICHA..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Comercio Exterior Text */}
            <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs">
              <label className="font-bold text-slate-700">Texto Institucional de Comercio Exterior & Inversiones</label>
              <textarea
                rows={4}
                value={settings.trade_description || ''}
                onChange={(e) => setSettings({ ...settings, trade_description: e.target.value })}
                placeholder="Descripción del asesoramiento en comercio exterior, análisis de mercado y búsqueda de proveedores..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            {/* Member Benefits Text */}
            <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs">
              <label className="font-bold text-slate-700">Texto / Lista de Beneficios para Miembros de la Cámara</label>
              <textarea
                rows={6}
                value={settings.member_benefits_text || ''}
                onChange={(e) => setSettings({ ...settings, member_benefits_text: e.target.value })}
                placeholder="Detalle de beneficios por ser miembro de CICHA (servicios gratuitos, difusión, traducción, bolsa de trabajo)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            {/* Official Logo Uploader */}
            <div className="pt-3 border-t border-slate-100">
              <ImageUploader
                label="Logotipo Oficial de CICHA"
                value={settings.logo_url || ''}
                onChange={(url) => setSettings({ ...settings, logo_url: url })}
                helperText="Logotipo oficial con fondo transparente PNG o SVG (guardado en /backend/public/uploads/)"
                previewHeight="h-28"
                aspectRatio="square"
              />
            </div>

            {/* Redes Sociales Oficiales */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="font-serif font-bold text-sm text-cicha-navy flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" /> Redes Sociales Oficiales (Visibles en el Footer)
              </h3>
              <p className="text-slate-500 text-xs">
                Ingrese las direcciones web completas de las redes oficiales. Solo los campos completados mostrarán su icono en el pie de página.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    LinkedIn Institucional
                  </label>
                  <input
                    type="url"
                    value={settings.social_linkedin || ''}
                    onChange={(e) => setSettings({ ...settings, social_linkedin: e.target.value })}
                    placeholder="https://www.linkedin.com/company/cicha-argentina"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-600"></span>
                    Instagram Oficial
                  </label>
                  <input
                    type="url"
                    value={settings.social_instagram || ''}
                    onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                    placeholder="https://instagram.com/cicha_argentina"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-700"></span>
                    Facebook Oficial
                  </label>
                  <input
                    type="url"
                    value={settings.social_facebook || ''}
                    onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })}
                    placeholder="https://facebook.com/cicha.argentina"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                    X / Twitter Oficial
                  </label>
                  <input
                    type="url"
                    value={settings.social_twitter || ''}
                    onChange={(e) => setSettings({ ...settings, social_twitter: e.target.value })}
                    placeholder="https://x.com/cicha_arg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    Canal de YouTube Oficial
                  </label>
                  <input
                    type="url"
                    value={settings.social_youtube || ''}
                    onChange={(e) => setSettings({ ...settings, social_youtube: e.target.value })}
                    placeholder="https://youtube.com/@cicha-argentina"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-neutral-900"></span>
                    TikTok Oficial
                  </label>
                  <input
                    type="url"
                    value={settings.social_tiktok || ''}
                    onChange={(e) => setSettings({ ...settings, social_tiktok: e.target.value })}
                    placeholder="https://tiktok.com/@cicha_argentina"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {settingsSaved && (
              <span className="text-emerald-700 text-xs font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle className="w-4 h-4" /> Ajustes guardados con éxito
              </span>
            )}
            <button
              type="submit"
              disabled={savingSettings}
              className="ml-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {savingSettings ? 'Guardando...' : 'Guardar Ajustes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
