import React, { useEffect, useState } from 'react';
import { Users, Search, Globe, Mail, Phone, ExternalLink } from 'lucide-react';
import { partnerApi } from '../../services/api';
import type { Member } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';

export const PartnerDirectoryPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMembers();
  }, [search]);

  const fetchMembers = () => {
    setLoading(true);
    partnerApi
      .getDirectory(search)
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

      {/* Grid */}
      {loading ? (
        <Loader text="Cargando directorio de empresas socias..." />
      ) : members.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((mem) => (
            <div
              key={mem.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    {mem.sector}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{mem.country}</span>
                </div>

                <h3 className="font-serif font-bold text-lg text-cicha-navy">{mem.company_name}</h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {mem.description}
                </p>

                {/* Direct B2B Contact Box */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  {mem.contact_email && (
                    <p className="flex items-center gap-1.5 text-slate-700">
                      <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <a href={`mailto:${mem.contact_email}`} className="text-blue-700 hover:underline truncate">
                        {mem.contact_email}
                      </a>
                    </p>
                  )}
                  {mem.contact_phone && (
                    <p className="flex items-center gap-1.5 text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{mem.contact_phone}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                {mem.website_url ? (
                  <a
                    href={mem.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
                  >
                    Sitio Web <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-slate-400">Socio Verificado</span>
                )}
              </div>
            </div>
          ))}
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
