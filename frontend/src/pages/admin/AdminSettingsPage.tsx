import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Save, CheckCircle, Globe, Phone, Mail, MapPin } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { Settings } from '../../types';
import { Loader } from '../../components/common/Loader';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
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
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      await adminApi.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Error al guardar las configuraciones.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Cargando configuraciones..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-xl text-[#0B2545]">Configuración General del Portal</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Información de contacto, redes sociales y metadatos SEO del sitio.
          </p>
        </div>

        {saved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle className="w-4 h-4" /> Cambios guardados
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Institutional & Contact Info */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-serif font-bold text-base text-[#0B2545] border-b border-slate-100 pb-3 flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600" />
            Datos Institucionales y de Contacto
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Nombre del Sitio</label>
              <input
                type="text"
                value={settings.site_name || ''}
                onChange={(e) => handleChange('site_name', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Sigla / Acrónimo</label>
              <input
                type="text"
                value={settings.site_acronym || ''}
                onChange={(e) => handleChange('site_acronym', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Email Institucional</label>
              <input
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Email Comercio Exterior / EEN</label>
              <input
                type="email"
                value={settings.trade_email || ''}
                onChange={(e) => handleChange('trade_email', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Teléfono Principal</label>
              <input
                type="text"
                value={settings.phone_primary || ''}
                onChange={(e) => handleChange('phone_primary', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Teléfono Secundario</label>
              <input
                type="text"
                value={settings.phone_secondary || ''}
                onChange={(e) => handleChange('phone_secondary', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-slate-700">Dirección de la Sede</label>
              <input
                type="text"
                value={settings.address_street || ''}
                onChange={(e) => handleChange('address_street', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-serif font-bold text-base text-[#0B2545] border-b border-slate-100 pb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            Redes Sociales Oficiales
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">LinkedIn</label>
              <input
                type="url"
                value={settings.social_linkedin || ''}
                onChange={(e) => handleChange('social_linkedin', e.target.value)}
                placeholder="https://linkedin.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">X (Twitter)</label>
              <input
                type="url"
                value={settings.social_twitter || ''}
                onChange={(e) => handleChange('social_twitter', e.target.value)}
                placeholder="https://twitter.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Facebook</label>
              <input
                type="url"
                value={settings.social_facebook || ''}
                onChange={(e) => handleChange('social_facebook', e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Instagram</label>
              <input
                type="url"
                value={settings.social_instagram || ''}
                onChange={(e) => handleChange('social_instagram', e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar Configuraciones'}
          </button>
        </div>
      </form>
    </div>
  );
};
