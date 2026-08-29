import React, { useEffect, useState } from 'react';
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
import { adminApi } from '../../services/api';
import type { Settings, User, Authority, InstitutionalSection, Alliance, Member, Banner } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminSettingsPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'settings' | 'banners' | 'users' | 'institutional' | 'authorities' | 'alliances'>('banners');
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

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'secretario' as 'admin' | 'secretario' | 'socio',
    member_id: '' as string | number,
    status: 'active' as 'active' | 'inactive',
  });

  // Institutional state
  const [sections, setSections] = useState<InstitutionalSection[]>([]);
  const [editingSection, setEditingSection] = useState<InstitutionalSection | null>(null);
  const [sectionForm, setSectionForm] = useState({ title: '', subtitle: '', content: '' });

  // Authorities state
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editingAuth, setEditingAuth] = useState<Authority | null>(null);
  const [authForm, setAuthForm] = useState({
    name: '',
    role_title: '',
    category: 'directiva' as any,
    company: '',
    bio: '',
    photo_url: '',
    linkedin_url: '',
    order_num: 1,
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
      isAdmin ? adminApi.getUsers().catch(() => []) : Promise.resolve([]),
      adminApi.getMembers().catch(() => []),
      adminApi.getInstitutional().catch(() => []),
      adminApi.getAuthorities().catch(() => []),
      adminApi.getAlliances().catch(() => []),
    ];

    Promise.all(promises)
      .then(([set, bnrs, usrs, mems, secs, auths, allis]) => {
        setSettings(set || {});
        setBanners(bnrs || []);
        setUsers(usrs || []);
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
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch {
      alert('Error al guardar configuraciones.');
    } finally {
      setSavingSettings(false);
    }
  };

  // User Handlers
  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setUserForm({
      name: '',
      email: '',
      password: '',
      role: 'secretario',
      member_id: '',
      status: 'active',
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (u: User) => {
    setEditingUser(u);
    setUserForm({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      member_id: u.member_id || '',
      status: u.status,
    });
    setIsUserModalOpen(true);
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: any = {
        ...userForm,
        member_id: userForm.member_id ? Number(userForm.member_id) : null,
      };
      if (!payload.password) delete payload.password;

      if (editingUser) {
        await adminApi.updateUser(editingUser.id, payload);
      } else {
        await adminApi.createUser(payload);
      }
      setIsUserModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar usuario.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string | number) => {
    if (!window.confirm('¿Desea eliminar este usuario?')) return;
    try {
      await adminApi.deleteUser(id);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar');
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
    });
    setIsAuthModalOpen(true);
  };

  const handleOpenEditAuth = (auth: Authority) => {
    setEditingAuth(auth);
    setAuthForm({
      name: auth.name,
      role_title: auth.role_title,
      category: auth.category,
      company: auth.company || '',
      bio: auth.bio || '',
      photo_url: auth.photo_url || '',
      linkedin_url: auth.linkedin_url || '',
      order_num: auth.order_num || 1,
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
        ) : activeTab === 'users' ? (
          <button
            onClick={handleOpenCreateUser}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nuevo Usuario
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
          onClick={() => setActiveTab('banners')}
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
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          Ajustes Generales
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            Usuarios & Roles ({users.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab('institutional')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'institutional'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Misión & Estatutos ({sections.length})
        </button>

        <button
          onClick={() => setActiveTab('authorities')}
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
          onClick={() => setActiveTab('alliances')}
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
                <label className="font-bold text-slate-700">Email Institucional</label>
                <input
                  type="email"
                  value={settings.contact_email || ''}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Teléfono Principal</label>
                <input
                  type="text"
                  value={settings.phone_primary || ''}
                  onChange={(e) => setSettings({ ...settings, phone_primary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Dirección Sede</label>
                <input
                  type="text"
                  value={settings.address_street || ''}
                  onChange={(e) => setSettings({ ...settings, address_street: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
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
      ) : activeTab === 'users' ? (
        /* Users Tab */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Usuario</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Rol</th>
                  <th className="py-3.5 px-4">Empresa Socia</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={u.role === 'admin' ? 'danger' : u.role === 'secretario' ? 'primary' : 'gold'}
                        className="uppercase"
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{u.member_company_name || '-'}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={u.status === 'active' ? 'success' : 'secondary'}>{u.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditUser(u)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {Number(u.id) !== 1 && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'institutional' ? (
        /* Institutional Sections Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((sec) => (
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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Orden</th>
                  <th className="py-3.5 px-4">Nombre</th>
                  <th className="py-3.5 px-4">Cargo</th>
                  <th className="py-3.5 px-4">Empresa</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {authorities.map((auth) => (
                  <tr key={auth.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-400">#{auth.order_num}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                          {auth.photo_url ? (
                            <img src={auth.photo_url} alt={auth.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-serif text-xs font-bold text-slate-600">{auth.name.charAt(0)}</span>
                          )}
                        </div>
                        <span>{auth.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-blue-700 font-semibold">{auth.role_title}</td>
                    <td className="py-3.5 px-4 text-slate-500">{auth.company || '-'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditAuth(auth)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAuth(auth.id)}
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

      {/* User Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitUser} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Nombre Completo *</label>
            <input
              type="text"
              required
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Correo Electrónico *</label>
            <input
              type="email"
              required
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">
              Contraseña {editingUser && '(En blanco para mantener)'}
            </label>
            <input
              type="password"
              required={!editingUser}
              value={userForm.password}
              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              placeholder={editingUser ? '••••••••' : 'Mínimo 6 caracteres'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Rol *</label>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="admin">Administrador (Total)</option>
                <option value="secretario">Secretario (Operativo)</option>
                <option value="socio">Socio (Intranet)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Estado</label>
              <select
                value={userForm.status}
                onChange={(e) => setUserForm({ ...userForm, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>

          {userForm.role === 'socio' && (
            <div className="space-y-1.5 p-3 rounded-xl bg-amber-50 border border-amber-200">
              <label className="font-bold text-amber-900">Vincular a Empresa Socia:</label>
              <select
                value={userForm.member_id}
                onChange={(e) => setUserForm({ ...userForm, member_id: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white"
              >
                <option value="">-- Seleccionar Empresa --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.company_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsUserModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              {submitting ? 'Guardando...' : 'Guardar Usuario'}
            </button>
          </div>
        </form>
      </Modal>

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
              <label className="font-bold text-slate-700">Texto Estatutario Completo *</label>
              <textarea
                rows={8}
                required
                value={sectionForm.content}
                onChange={(e) => setSectionForm({ ...sectionForm, content: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
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
            <label className="font-bold text-slate-700">Nombre *</label>
            <input
              type="text"
              required
              value={authForm.name}
              onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Cargo *</label>
              <input
                type="text"
                required
                value={authForm.role_title}
                onChange={(e) => setAuthForm({ ...authForm, role_title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Empresa</label>
              <input
                type="text"
                value={authForm.company}
                onChange={(e) => setAuthForm({ ...authForm, company: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Director Photo Uploader */}
          <ImageUploader
            label="Foto de Perfil Profesional"
            value={authForm.photo_url}
            onChange={(url) => setAuthForm({ ...authForm, photo_url: url })}
            helperText="Foto de retrato institucional (se guardará en /backend/public/uploads/)"
            previewHeight="h-36"
            aspectRatio="square"
          />

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Biografía / Perfil Breve</label>
            <textarea
              rows={2}
              value={authForm.bio}
              onChange={(e) => setAuthForm({ ...authForm, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
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
                    if (['/asociarse', '/comercio-bilateral', '/institucional', '/noticias', '/eventos', '/socios', '/contacto', '/portal-socios', ''].includes(bannerForm.button_url)) {
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
                  <option value="/comercio-bilateral">Comercio Bilateral & EEN (/comercio-bilateral)</option>
                  <option value="/institucional">Institucional & Autoridades (/institucional)</option>
                  <option value="/noticias">Noticias & Artículos (/noticias)</option>
                  <option value="/eventos">Agenda de Eventos (/eventos)</option>
                  <option value="/socios">Directorio de Socios (/socios)</option>
                  <option value="/contacto">Contacto Institucional (/contacto)</option>
                </optgroup>
                <optgroup label="Portal Exclusivo de Socios">
                  <option value="/portal-socios">Intranet / Portal de Socios (/portal-socios)</option>
                </optgroup>
                <option value="custom">🌐 Otro enlace personalizado o URL externa...</option>
              </select>

              {/* Input libre si se selecciona personalizado */}
              {![
                '',
                '/asociarse',
                '/comercio-bilateral',
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
