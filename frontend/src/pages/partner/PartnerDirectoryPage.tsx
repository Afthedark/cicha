import React, { useEffect, useState } from 'react';
import { Users, Search, Globe, Mail, Phone, ExternalLink, Building2, Filter } from 'lucide-react';
import { partnerApi, publicApi, adminApi, resolveImageUrl } from '../../services/api';
import type { Member, Category, Settings } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const PartnerDirectoryPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState<string>('all');

  useEffect(() => {
    partnerApi
      .getCategories('members')
      .then((cats) => {
        if (cats && cats.length > 0) {
          setCategories(cats);
        }
      })
      .catch((err) => {
        console.error('Error cargando categorías para directorio:', err);
      });

    publicApi
      .getSettings()
      .then((st) => {
        setSettings(st || {});
      })
      .catch((err) => {
        console.error('Error cargando settings en directorio partner:', err);
      });
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [search, sector]);

  const fetchMembers = () => {
    setLoading(true);
    partnerApi
      .getDirectory(search, sector === 'all' ? undefined : sector)
      .then((res) => {
        setMembers(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="gold">Networking Privado B2B</Badge>
          <h1 className="font-serif font-bold text-2xl text-cicha-navy mt-1">
            Directorio de Socios para Vinculación Directa
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Comunidad de empresas miembros de CICHA con datos de contacto directo para alianzas comerciales.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Buscar por empresa o sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Dynamic Sector Filter Tabs from categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-blue-700 px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Sector:
          </span>
          <button
            onClick={() => setSector('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              sector === 'all'
                ? 'bg-cicha-navy text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todos los Sectores
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSector(c.name)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                sector === c.name
                  ? 'bg-cicha-navy text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <Loader text="Cargando directorio de empresas socias..." />
      ) : members.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((mem) => {
            const resolvedLogo = resolveImageUrl(mem.logo_url);
            return (
              <div
                key={mem.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Top Logo Showcase Header */}
                  <div className="relative bg-gradient-to-b from-slate-50/90 via-white to-slate-50/40 p-4 border-b border-slate-100/90 flex flex-col items-center justify-center min-h-[110px] group-hover:from-blue-50/40 group-hover:to-white transition-colors">
                    {/* Badges Overlay */}
                    <div className="w-full flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/80 truncate max-w-[150px] shadow-2xs">
                        {mem.sector}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{mem.country}</span>
                    </div>

                    {/* Logo Showcase Container */}
                    <div className="w-full h-16 sm:h-20 flex items-center justify-center p-1.5">
                      {resolvedLogo ? (
                        <img
                          src={resolvedLogo}
                          alt={mem.company_name}
                          className="max-h-full max-w-[85%] object-contain filter drop-shadow-xs group-hover:scale-108 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                            (e.target as HTMLElement).parentElement?.classList.add('fallback-icon');
                          }}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-blue-50/80 flex items-center justify-center border border-blue-100">
                          <Building2 className="w-7 h-7 text-blue-700/70" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6 space-y-3">
                    <h3 className="font-serif font-bold text-lg text-cicha-navy group-hover:text-blue-700 transition-colors leading-snug">
                      {mem.company_name}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {mem.description}
                    </p>

                    {/* Direct B2B Contact Box */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                      {mem.contact_email && (() => {
                        const subject = encodeURIComponent(settings?.member_email_subject || 'MENSAJE POR MEDIO DE LA PAGINA DE CICHA');
                        const body = encodeURIComponent(settings?.member_email_body || '');
                        const mailtoUrl = `mailto:${mem.contact_email}?subject=${subject}${body ? `&body=${body}` : ''}`;
                        return (
                          <p className="flex items-center justify-between gap-2 text-slate-700">
                            <span className="flex items-center gap-2 min-w-0">
                              <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <a
                                href={mailtoUrl}
                                className="text-blue-700 font-medium hover:underline truncate"
                                title="Contactar vía correo"
                              >
                                {mem.contact_email}
                              </a>
                            </span>
                            <a
                              href={mailtoUrl}
                              className="text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200/60 transition-colors shrink-0"
                            >
                              Contactar
                            </a>
                          </p>
                        );
                      })()}
                      {mem.contact_phone && (
                        <p className="flex items-center gap-2 text-slate-700">
                          <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="font-medium">{mem.contact_phone}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs">
                  {mem.website_url ? (
                    <a
                      href={mem.website_url.startsWith('http') ? mem.website_url : `https://${mem.website_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 transition-colors"
                    >
                      Sitio Web <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-slate-400">Socio Verificado</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-2">
          <Users className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No se encontraron socios.</p>
        </div>
      )}
    </div>
  );
};
