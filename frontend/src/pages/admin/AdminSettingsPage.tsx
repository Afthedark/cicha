import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Shield,
  Users,
  FileText,
  Globe,
  Save,
  CheckCircle,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Mail,
  Phone,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { adminApi, resolveImageUrl } from '../../services/api';
import type { Settings, User, Authority, InstitutionalSection, Alliance, Member, Banner } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminSettingsPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as 'settings' | 'banners' | 'institutional' | 'authorities' | 'alliances' | null;
  const [activeTab, setActiveTab] = useState<'settings' | 'banners' | 'institutional' | 'authorities' | 'alliances'>(
    tabParam && ['settings', 'banners', 'institutional', 'authorities', 'alliances'].includes(tabParam)
      ? tabParam
      : 'banners'
  );

  useEffect(() => {
    if (tabParam && ['settings', 'banners', 'institutional', 'authorities', 'alliances'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  const [loading, setLoading] = useState(true);

  // Settings state
  const [settings, setSettings] = useState<Settings>({});
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Banners state
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    badge_text: '',
    image_url: '',
    button_text: '',
    button_url: '',
    order_num: 1,
    is_active: 1,
  });

  const [members, setMembers] = useState<Member[]>([]);

  // Institutional state
  const [sections, setSections] = useState<InstitutionalSection[]>([]);
  const [editingSection, setEditingSection] = useState<InstitutionalSection | null>(null);
  const [sectionForm, setSectionForm] = useState({ title: '', subtitle: '', content: '' });

  // Authorities state
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [authCategoryFilter, setAuthCategoryFilter] = useState<string>('all');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editingAuth, setEditingAuth] = useState<Authority | null>(null);
  const [authForm, setAuthForm] = useState({
    name: '',
    role_title: '',
    category: 'directiva' as string,
    company: '',
    bio: '',
    photo_url: '',
    linkedin_url: '',
    order_num: 1,
    is_active: 1,
  });

  // Alliances state
  const [alliances, setAlliances] = useState<Alliance[]>([]);
  const [isAllianceModalOpen, setIsAllianceModalOpen] = useState(false);
  const [editingAlliance, setEditingAlliance] = useState<Alliance | null>(null);
  const [allianceForm, setAllianceForm] = useState({
    name: '',
    slug: '',
    category: 'institucional',
    description: '',
    website_url: '',
    logo_url: '',
    highlight_text: '',
    order_num: 1,
    is_active: 1,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    const promises: Promise<any>[] = [
      adminApi.getSettings(),
      adminApi.getBanners().catch(() => []),
      adminApi.getMembers().catch(() => []),
      adminApi.getInstitutional().catch(() => []),
      adminApi.getAuthorities().catch(() => []),
      adminApi.getAlliances().catch(() => []),
    ];

    Promise.all(promises)
      .then(([set, bnrs, mems, secs, auths, allis]) => {
        setSettings(set || {});
        setBanners(bnrs || []);
        setMembers(mems || []);
        setSections(secs || []);
        setAuthorities(auths || []);
        setAlliances(allis || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // Banner Handlers
  const handleOpenCreateBanner = () => {
    setEditingBanner(null);
    setBannerForm({
      title: '',
      subtitle: '',
      badge_text: 'Reconocimiento Oficial 1989 - 1998',
      image_url: '',
      button_text: 'Solicitar Membresía / Asociarse',
      button_url: '/asociarse',
      order_num: banners.length + 1,
      is_active: 1,
    });
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (bnr: Banner) => {
    setEditingBanner(bnr);
    setBannerForm({
      title: bnr.title,
      subtitle: bnr.subtitle || '',
      badge_text: bnr.badge_text || '',
      image_url: bnr.image_url || '',
      button_text: bnr.button_text || '',
      button_url: bnr.button_url || '',
      order_num: bnr.order_num || 1,
      is_active: typeof bnr.is_active === 'number' ? bnr.is_active : bnr.is_active ? 1 : 0,
    });
    setIsBannerModalOpen(true);
  };

  const handleSubmitBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingBanner) {
        await adminApi.updateBanner(editingBanner.id, bannerForm);
      } else {
        await adminApi.createBanner(bannerForm);
      }
      setIsBannerModalOpen(false);
      fetchData();
    } catch {
      alert('Error al guardar la portada.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBanner = async (id: number) => {
    if (!window.confirm('¿Desea eliminar esta portada?')) return;
    try {
      await adminApi.deleteBanner(id);
      fetchData();
    } catch {
      alert('Error al eliminar la portada.');
    }
  };

  // Settings Save
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

  // Institutional Handlers
  const handleOpenEditSection = (sec: InstitutionalSection) => {
    setEditingSection(sec);
    setSectionForm({
      title: sec.title,
      subtitle: sec.subtitle || '',
      content: sec.content,
    });
  };

  const handleSubmitSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;
    setSubmitting(true);
    try {
      await adminApi.updateInstitutional(editingSection.id, sectionForm);
      setEditingSection(null);
      fetchData();
    } catch {
      alert('Error al guardar sección.');
    } finally {
      setSubmitting(false);
    }
  };

  // Authority Handlers
  const handleOpenCreateAuth = () => {
    setEditingAuth(null);
    setAuthForm({
      name: '',
      role_title: '',
      category: 'directiva',
      company: '',
      bio: '',
      photo_url: '',
      linkedin_url: '',
      order_num: authorities.length + 1,
      is_active: 1,
    });
    setIsAuthModalOpen(true);
  };

  const handleOpenEditAuth = (auth: Authority) => {
    setEditingAuth(auth);
    setAuthForm({
      name: auth.name,
      role_title: auth.role_title,
      category: auth.category || 'directiva',
      company: auth.company || '',
      bio: auth.bio || '',
      photo_url: auth.photo_url || '',
      linkedin_url: auth.linkedin_url || '',
      order_num: auth.order_num || 1,
      is_active: auth.is_active ? 1 : 0,
    });
    setIsAuthModalOpen(true);
  };

  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingAuth) {
        await adminApi.updateAuthority(editingAuth.id, authForm);
      } else {
        await adminApi.createAuthority(authForm);
      }
      setIsAuthModalOpen(false);
      fetchData();
    } catch {
      alert('Error al guardar autoridad.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAuth = async (id: number) => {
    if (!window.confirm('¿Desea eliminar esta autoridad?')) return;
    try {
      await adminApi.deleteAuthority(id);
      fetchData();
    } catch {
      alert('Error al eliminar');
    }
  };

  // Alliance Handlers
  const handleOpenCreateAlliance = () => {
    setEditingAlliance(null);
    setAllianceForm({
      name: '',
      slug: '',
      category: 'institucional',
      description: '',
      website_url: '',
      logo_url: '',
      highlight_text: '',
      order_num: alliances.length + 1,
      is_active: 1,
    });
    setIsAllianceModalOpen(true);
  };

  const handleOpenEditAlliance = (all: Alliance) => {
    setEditingAlliance(all);
    setAllianceForm({
      name: all.name,
      slug: all.slug,
      category: all.category,
      description: all.description || '',
      website_url: all.website_url || '',
      logo_url: all.logo_url || '',
      highlight_text: all.highlight_text || '',
      order_num: all.order_num || 1,
      is_active: typeof all.is_active === 'number' ? all.is_active : all.is_active ? 1 : 0,
    });
    setIsAllianceModalOpen(true);
  };

  const handleSubmitAlliance = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingAlliance) {
        await adminApi.updateAlliance(editingAlliance.id, allianceForm);
      } else {
        await adminApi.createAlliance(allianceForm);
      }
      setIsAllianceModalOpen(false);
      fetchData();
    } catch {
      alert('Error al guardar alianza.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAlliance = async (id: number) => {
    if (!window.confirm('¿Desea eliminar esta alianza?')) return;
    try {
      await adminApi.deleteAlliance(id);
      fetchData();
    } catch {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-xl text-cicha-navy">Configuración Global & Gestión Institucional</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Módulo exclusivo de administración para usuarios, estatutos, autoridades y ajustes del portal.
          </p>
        </div>

        {activeTab === 'banners' ? (
          <button
            onClick={handleOpenCreateBanner}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nueva Portada
          </button>
        ) : activeTab === 'authorities' ? (
          <button
            onClick={handleOpenCreateAuth}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nueva Autoridad
          </button>
        ) : activeTab === 'alliances' ? (
          <button
            onClick={handleOpenCreateAlliance}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nueva Alianza
          </button>
        ) : null}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200">
        <button
          onClick={() => {
            setActiveTab('banners');
            setSearchParams({ tab: 'banners' });
          }}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'banners'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Portadas / Banners Home ({banners.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('settings');
            setSearchParams({ tab: 'settings' });
          }}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          Ajustes Generales
        </button>

        <button
          onClick={() => {
            setActiveTab('institutional');
            setSearchParams({ tab: 'institutional' });
          }}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'institutional'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Historia & Estatutos ({sections.filter((s) => s.section_key !== 'mision' && s.section_key !== 'objeto').length})
        </button>

        <button
          onClick={() => {
            setActiveTab('authorities');
            setSearchParams({ tab: 'authorities' });
          }}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'authorities'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Comisión Directiva ({authorities.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('alliances');
            setSearchParams({ tab: 'alliances' });
          }}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'alliances'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          Alianzas Estratégicas ({alliances.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <Loader text="Cargando configuración..." />
      ) : activeTab === 'banners' ? (
        /* Banners Tab */
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold">✨ Portadas Principales del Home</p>
              <p className="text-blue-700 mt-0.5">
                Las portadas activas se mostrarán en el Slider superior del Home antes del título institucional. Puedes subir imágenes de alta resolución, personalizar el texto y el botón.
              </p>
            </div>
            <button
              onClick={handleOpenCreateBanner}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition-all shrink-0 flex items-center gap-1.5 self-start sm:self-center"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar Portada
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {banners.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <ImageIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="font-bold text-slate-700">No hay portadas registradas</p>
                <p className="text-xs text-slate-400 mt-1">
                  Agrega tu primera portada para activar el slider visual en la página principal.
                </p>
                <button
                  onClick={handleOpenCreateBanner}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Crear Portada
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {banners.map((bnr) => (
                  <div key={bnr.id} className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      {bnr.image_url ? (
                        <img
                          src={bnr.image_url}
                          alt={bnr.title}
                          className="w-24 h-16 sm:w-32 sm:h-20 rounded-xl object-cover border border-slate-200 shrink-0 shadow-sm"
                        />
                      ) : (
                        <div className="w-24 h-16 sm:w-32 sm:h-20 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-slate-900 truncate">{bnr.title}</h3>
                          {bnr.badge_text && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              {bnr.badge_text}
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              (typeof bnr.is_active === 'number' ? bnr.is_active === 1 : bnr.is_active)
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {(typeof bnr.is_active === 'number' ? bnr.is_active === 1 : bnr.is_active) ? 'Activa' : 'Inactiva'}
                          </span>
                        </div>

                        {bnr.subtitle && (
                          <p className="text-xs text-slate-500 line-clamp-2">{bnr.subtitle}</p>
                        )}

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                          <span>Orden: <strong>#{bnr.order_num}</strong></span>
                          {bnr.button_text && (
                            <span>Botón: <strong>{bnr.button_text}</strong> ({bnr.button_url || '/'})</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => handleOpenEditBanner(bnr)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-bold flex items-center gap-1"
                        title="Editar portada"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Editar
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(bnr.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs font-bold flex items-center gap-1"
                        title="Eliminar portada"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'settings' ? (
        /* Settings Tab */
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
      ) : activeTab === 'institutional' ? (
        /* Institutional Sections Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections
            .filter((sec) => sec.section_key !== 'mision' && sec.section_key !== 'objeto')
            .map((sec) => (
              <div key={sec.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {sec.section_key}
                  </span>
                  <button
                    onClick={() => handleOpenEditSection(sec)}
                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 font-bold text-xs flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Editar
                  </button>
                </div>
                <h3 className="font-serif font-bold text-base text-cicha-navy">{sec.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{sec.content}</p>
              </div>
            ))}
        </div>
      ) : activeTab === 'authorities' ? (
        /* Authorities Tab */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="font-serif font-bold text-base text-cicha-navy">Comisión Directiva & Autoridades</h2>
              <p className="text-xs text-slate-500">Gestión de cargos, comisiones y autoridades institucionales.</p>
            </div>
            <button
              onClick={handleOpenCreateAuth}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Agregar Autoridad
            </button>
          </div>

          {/* Quick Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 text-xs">
            <button
              onClick={() => setAuthCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                authCategoryFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({authorities.length})
            </button>
            <button
              onClick={() => setAuthCategoryFilter('directiva')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                authCategoryFilter === 'directiva'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-blue-800 hover:bg-blue-100/70'
              }`}
            >
              Comisión Directiva ({authorities.filter((a) => a.category === 'directiva' || (!a.category && !a.role_title.toLowerCase().includes('revisor') && !a.role_title.toLowerCase().includes('honorario'))).length})
            </button>
            <button
              onClick={() => setAuthCategoryFilter('revisora')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                authCategoryFilter === 'revisora'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-800 hover:bg-purple-100/70'
              }`}
            >
              Comisión Revisora de Cuentas ({authorities.filter((a) => a.category === 'revisora' || a.role_title.toLowerCase().includes('revisor')).length})
            </button>
            <button
              onClick={() => setAuthCategoryFilter('honorario')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                authCategoryFilter === 'honorario'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-amber-900 hover:bg-amber-100/70'
              }`}
            >
              Presidencia Honoraria ({authorities.filter((a) => a.category === 'honorario' || a.role_title.toLowerCase().includes('honorario')).length})
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Orden</th>
                    <th className="py-3.5 px-4">Nombre</th>
                    <th className="py-3.5 px-4">Cargo / Rol</th>
                    <th className="py-3.5 px-4">Categoría / Estructura</th>
                    <th className="py-3.5 px-4">Empresa</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {authorities
                    .filter((auth) => {
                      if (authCategoryFilter === 'all') return true;
                      if (authCategoryFilter === 'revisora') {
                        return auth.category === 'revisora' || auth.role_title.toLowerCase().includes('revisor');
                      }
                      if (authCategoryFilter === 'honorario') {
                        return auth.category === 'honorario' || auth.role_title.toLowerCase().includes('honorario');
                      }
                      if (authCategoryFilter === 'directiva') {
                        return (
                          (auth.category === 'directiva' || !auth.category) &&
                          !auth.role_title.toLowerCase().includes('revisor') &&
                          !auth.role_title.toLowerCase().includes('honorario')
                        );
                      }
                      return auth.category === authCategoryFilter;
                    })
                    .sort((a, b) => (a.order_num ?? 0) - (b.order_num ?? 0))
                    .map((auth) => {
                    const resolvedPhoto = resolveImageUrl(auth.photo_url);
                    const getCatBadge = (cat?: string) => {
                      switch (cat) {
                        case 'honorario':
                          return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">Presidencia Honoraria</span>;
                        case 'revisora':
                          return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300">Comisión Revisora</span>;
                        case 'comite':
                          return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">Comité Asesor</span>;
                        default:
                          return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">Comisión Directiva</span>;
                      }
                    };

                    return (
                      <tr key={auth.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-400">#{auth.order_num}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                              {resolvedPhoto ? (
                                <img src={resolvedPhoto} alt={auth.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="font-serif text-xs font-bold text-slate-600">{auth.name.charAt(0)}</span>
                              )}
                            </div>
                            <span>{auth.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-blue-700 font-semibold">{auth.role_title}</td>
                        <td className="py-3.5 px-4">{getCatBadge(auth.category)}</td>
                        <td className="py-3.5 px-4 text-slate-500">{auth.company || '-'}</td>
                        <td className="py-3.5 px-4">
                          {auth.is_active ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              Inactivo
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditAuth(auth)}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                              title="Editar autoridad"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAuth(auth.id)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Eliminar autoridad"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Alliances Tab */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Orden</th>
                  <th className="py-3.5 px-4">Alianza / Red</th>
                  <th className="py-3.5 px-4">Categoría</th>
                  <th className="py-3.5 px-4">Destacado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {alliances.map((all) => (
                  <tr key={all.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-400">#{all.order_num}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden p-1">
                          {all.logo_url ? (
                            <img src={all.logo_url} alt={all.name} className="w-full h-full object-contain" />
                          ) : (
                            <Globe className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{all.name}</div>
                          {all.website_url && (
                            <a
                              href={all.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <Globe className="w-3 h-3" />
                              {all.website_url}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium capitalize">{all.category}</td>
                    <td className="py-3.5 px-4 text-amber-700 font-semibold">{all.highlight_text || '-'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditAlliance(all)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAlliance(all.id)}
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

      {/* Section Modal */}
      {editingSection && (
        <Modal
          isOpen={!!editingSection}
          onClose={() => setEditingSection(null)}
          title={`Editar Sección: ${editingSection.section_key}`}
          maxWidth="xl"
        >
          <form onSubmit={handleSubmitSection} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Título *</label>
              <input
                type="text"
                required
                value={sectionForm.title}
                onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Subtítulo / Bajada</label>
              <input
                type="text"
                value={sectionForm.subtitle}
                onChange={(e) => setSectionForm({ ...sectionForm, subtitle: e.target.value })}
                placeholder="Ej. Nucleamiento y representación"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Texto Estatutario Completo *</label>
              <textarea
                rows={10}
                required
                value={sectionForm.content}
                onChange={(e) => setSectionForm({ ...sectionForm, content: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                {submitting ? 'Guardando...' : 'Guardar Sección'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Authority Modal */}
      <Modal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title={editingAuth ? 'Editar Autoridad' : 'Nueva Autoridad'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitAuth} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Nombre y Apellido *</label>
            <input
              type="text"
              required
              value={authForm.name}
              onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="Ej: Ing. Jorge Cotsiopoulos"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Cargo / Rol *</label>
              <input
                type="text"
                required
                value={authForm.role_title}
                onChange={(e) => setAuthForm({ ...authForm, role_title: e.target.value })}
                placeholder="Presidente, Vocal Titular, Revisor..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Categoría / Estructura *</label>
              <select
                value={authForm.category}
                onChange={(e) => setAuthForm({ ...authForm, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="directiva">Comisión Directiva (Mesa Ejecutiva & Vocales)</option>
                <option value="revisora">Comisión Revisora de Cuentas (Órgano de Fiscalización)</option>
                <option value="honorario">Presidencia Honoraria</option>
                <option value="comite">Comité Asesor / Especial</option>
              </select>
              <p className="text-[10.5px] text-slate-500">
                {authForm.category === 'revisora'
                  ? '🛡️ Se mostrará en la sección "Comisión Revisora de Cuentas" con su línea divisoria y bloque de fiscalización.'
                  : authForm.category === 'honorario'
                  ? '⭐ Se mostrará en la sección "Presidencia Honoraria & Presidencia".'
                  : '🏛️ Se mostrará en la sección oficial de "Comisión Directiva".'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Empresa / Entidad</label>
              <input
                type="text"
                value={authForm.company}
                onChange={(e) => setAuthForm({ ...authForm, company: e.target.value })}
                placeholder="Ej: ARTEMISION SRL"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Orden de Visualización *</label>
              <input
                type="number"
                min={1}
                required
                value={authForm.order_num === 0 ? '' : authForm.order_num}
                onChange={(e) => setAuthForm({ ...authForm, order_num: e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 1 })}
                placeholder="1, 2, 3..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <p className="text-[10.5px] text-slate-500">Número menor (ej. 1, 2, 3) se muestra primero dentro de su categoría.</p>
            </div>
          </div>

          {/* Director Photo Uploader */}
          <div className="space-y-1.5">
            <ImageUploader
              label="Foto de Perfil Profesional"
              value={authForm.photo_url}
              onChange={(url) => setAuthForm({ ...authForm, photo_url: url })}
              helperText="Foto de retrato institucional (se guardará en /backend/public/uploads/)"
              previewHeight="h-32"
              aspectRatio="square"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Biografía / Perfil Breve</label>
            <textarea
              rows={2}
              value={authForm.bio}
              onChange={(e) => setAuthForm({ ...authForm, bio: e.target.value })}
              placeholder="Descripción de trayectoria profesional y funciones..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={Boolean(authForm.is_active)}
                onChange={(e) => setAuthForm({ ...authForm, is_active: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span>Autoridad Activa y Visible en el Portal Web</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : 'Guardar Autoridad'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Alliance Modal */}
      <Modal
        isOpen={isAllianceModalOpen}
        onClose={() => setIsAllianceModalOpen(false)}
        title={editingAlliance ? 'Editar Alianza' : 'Nueva Alianza Estratégica'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitAlliance} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Nombre de la Red / Alianza *</label>
            <input
              type="text"
              required
              value={allianceForm.name}
              onChange={(e) => setAllianceForm({ ...allianceForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Categoría</label>
              <select
                value={allianceForm.category}
                onChange={(e) => setAllianceForm({ ...allianceForm, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="institucional">Institucional</option>
                <option value="red_europea">Red Europea</option>
                <option value="binacional">Binacional</option>
                <option value="comercial">Comercial</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Texto Destacado (Badge)</label>
              <input
                type="text"
                value={allianceForm.highlight_text}
                onChange={(e) => setAllianceForm({ ...allianceForm, highlight_text: e.target.value })}
                placeholder="Ej. Miembro Activo desde Mayo 2017"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Sitio Web Oficial</label>
            <input
              type="url"
              value={allianceForm.website_url}
              onChange={(e) => setAllianceForm({ ...allianceForm, website_url: e.target.value })}
              placeholder="https://eurocamara.com.ar"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          {/* Alliance Logo Uploader */}
          <ImageUploader
            label="Logotipo de la Alianza / Red"
            value={allianceForm.logo_url}
            onChange={(url) => setAllianceForm({ ...allianceForm, logo_url: url })}
            helperText="Logo institucional PNG con transparencia o SVG (guardado en /backend/public/uploads/)"
            previewHeight="h-32"
            aspectRatio="square"
          />

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Descripción Institucional</label>
            <textarea
              rows={3}
              value={allianceForm.description}
              onChange={(e) => setAllianceForm({ ...allianceForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAllianceModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              {submitting ? 'Guardando...' : 'Guardar Alianza'}
            </button>
          </div>
        </form>
      </Modal>
      {/* BANNER CREATE / EDIT MODAL */}
      <Modal
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
        title={editingBanner ? 'Editar Portada del Home' : 'Nueva Portada del Home'}
        maxWidth="xl"
      >
        <form onSubmit={handleSubmitBanner} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Título Principal *</label>
            <input
              type="text"
              required
              value={bannerForm.title}
              onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
              placeholder="Ej. Impulsando el Comercio Bilateral e Inversiones"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Insignia / Badge Superior</label>
              <input
                type="text"
                value={bannerForm.badge_text}
                onChange={(e) => setBannerForm({ ...bannerForm, badge_text: e.target.value })}
                placeholder="Ej. Reconocimiento Oficial 1989 - 1998"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Orden de Visualización</label>
              <input
                type="number"
                min={1}
                value={bannerForm.order_num}
                onChange={(e) => setBannerForm({ ...bannerForm, order_num: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Banner Image Uploader */}
          <ImageUploader
            label="Imagen de Fondo de la Portada (Full HD / 1920x1080 recomendado)"
            value={bannerForm.image_url}
            onChange={(url) => setBannerForm({ ...bannerForm, image_url: url })}
            helperText="Sube fotografías de alta calidad (paisajes de Grecia, puertos comerciales, eventos diplomáticos)."
            previewHeight="h-44"
            aspectRatio="wide"
          />

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Subtítulo / Descripción</label>
            <textarea
              rows={3}
              value={bannerForm.subtitle}
              onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
              placeholder="Descripción breve de la portada o mensaje institucional..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Texto del Botón</label>
              <input
                type="text"
                value={bannerForm.button_text}
                onChange={(e) => setBannerForm({ ...bannerForm, button_text: e.target.value })}
                placeholder="Ej. Solicitar Membresía / Asociarse"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Enlace del Botón (Destino Automático)</label>
              <select
                value={
                  [
                    '',
                    '/asociarse',
                    '/comercio-bilateral',
                    '/la-camara',
                    '/institucional',
                    '/noticias',
                    '/eventos',
                    '/socios',
                    '/contacto',
                    '/portal-socios',
                  ].includes(bannerForm.button_url)
                    ? bannerForm.button_url
                    : 'custom'
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'custom') {
                    if (['/asociarse', '/la-camara', '/institucional', '/noticias', '/eventos', '/socios', '/contacto', '/portal-socios', ''].includes(bannerForm.button_url)) {
                      setBannerForm({ ...bannerForm, button_url: 'https://' });
                    }
                  } else {
                    setBannerForm({ ...bannerForm, button_url: val });
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="">-- Sin Botón / Enlace --</option>
                <optgroup label="Secciones Principales del Portal">
                  <option value="/asociarse">Membresía / Asociarse (/asociarse)</option>
                  <option value="/la-camara">La Cámara & Autoridades (/la-camara)</option>
                  <option value="/noticias">Noticias & Artículos (/noticias)</option>
                  <option value="/eventos">Agenda de Eventos (/eventos)</option>
                  <option value="/socios">Directorio de Socios (/socios)</option>
                  <option value="/contacto">Contacto Institucional (/contacto)</option>
                </optgroup>
                <optgroup label="Portal Exclusivo de Socios">
                  <option value="/portal-socios">Portal de Socios (/portal-socios)</option>
                </optgroup>
                <option value="custom">🌐 Otro enlace personalizado o URL externa...</option>
              </select>

              {/* Input libre si se selecciona personalizado */}
              {![
                '',
                '/asociarse',
                '/la-camara',
                '/institucional',
                '/noticias',
                '/eventos',
                '/socios',
                '/contacto',
                '/portal-socios',
              ].includes(bannerForm.button_url) && (
                <input
                  type="text"
                  value={bannerForm.button_url}
                  onChange={(e) => setBannerForm({ ...bannerForm, button_url: e.target.value })}
                  placeholder="Ej. https://ejemplo.com o /ruta-personalizada"
                  className="w-full mt-2 px-3.5 py-2 rounded-xl border border-blue-300 bg-blue-50/50 text-blue-900"
                />
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="font-bold text-slate-700">Estado de la Portada</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={bannerForm.is_active === 1}
                onChange={(e) => setBannerForm({ ...bannerForm, is_active: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span className="font-semibold text-slate-700">Portada Activa (Visible en Home)</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsBannerModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              {submitting ? 'Guardando...' : 'Guardar Portada'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
