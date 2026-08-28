import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Search,
  Globe,
  Mail,
  Phone,
  Briefcase,
  ExternalLink,
  Users,
} from 'lucide-react';
import { publicApi } from '../../services/api';
import type { Member } from '../../types';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const MembersDirectoryPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [activeMember, setActiveMember] = useState<Member | null>(null);

  useEffect(() => {
    fetchMembers();
  }, [selectedSector, search]);

  const fetchMembers = () => {
    setLoading(true);
    const sector = selectedSector === 'all' ? undefined : selectedSector;
    publicApi
      .getMembers(sector, search)
      .then((res) => {
        setMembers(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const sectors = [
    { label: 'Todos los Sectores', value: 'all' },
    { label: 'Marítimo & Logística', value: 'Marítimo' },
    { label: 'Agroindustria & Alimentos', value: 'Agroindustria' },
    { label: 'Energía & Sustentabilidad', value: 'Energía' },
    { label: 'Servicios Jurídicos & Finanzas', value: 'Jurídicos' },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cicha-navy via-cicha-aegean to-cicha-sky text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-cicha-sky-light shadow-lg text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <Badge variant="gold">Red de Empresas</Badge>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white">
            Directorio de Empresas Socias
          </h1>
          <p className="text-slate-300 text-sm sm:text-base font-light max-w-2xl mx-auto">
            Compañías líderes de origen griego, argentino e internacional que impulsan el desarrollo comercial bilateral.
          </p>
          <div className="pt-2">
            <Link
              to="/asociarse"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              <Briefcase className="w-4 h-4" />
              ¿Desea afiliar a su empresa? Solicite aquí
            </Link>
          </div>
        </div>
      </section>

      {/* Directory Grid & Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filter bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {sectors.map((sec) => (
              <button
                key={sec.value}
                onClick={() => setSelectedSector(sec.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedSector === sec.value
                    ? 'bg-cicha-navy text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Buscar por empresa o servicio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Directory Grid */}
        {loading ? (
          <Loader text="Cargando directorio de socios..." />
        ) : members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                onClick={() => setActiveMember(member)}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer group hover:border-blue-400"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 truncate max-w-[200px]">
                      {member.sector}
                    </span>
                    {member.is_featured && <Badge variant="gold">Destacada</Badge>}
                  </div>

                  <h3 className="font-serif font-bold text-lg text-cicha-navy group-hover:text-blue-700 transition-colors">
                    {member.company_name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {member.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{member.country}</span>
                  <span className="font-bold text-blue-700 group-hover:text-amber-600 flex items-center gap-1">
                    Ver Perfil <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-2">
            <Users className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No se encontraron socios.</p>
            <p className="text-xs text-slate-500">Pruebe ajustando el filtro de búsqueda.</p>
          </div>
        )}
      </section>

      {/* Member Details Modal */}
      {activeMember && (
        <Modal
          isOpen={!!activeMember}
          onClose={() => setActiveMember(null)}
          title={activeMember.company_name}
        >
          <div className="space-y-5 text-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-blue-100 text-blue-900">
                {activeMember.sector}
              </span>
              <span className="text-xs font-medium text-slate-500">{activeMember.country}</span>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif font-bold text-sm text-cicha-navy">Descripción de la Empresa</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeMember.description || 'Sin descripción disponible.'}
              </p>
            </div>

            {activeMember.services && (
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-cicha-navy">Servicios & Oferta Comercial</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeMember.services}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {activeMember.website_url && (
                <a
                  href={activeMember.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold p-2 rounded-lg bg-blue-50"
                >
                  <Globe className="w-4 h-4 shrink-0" />
                  <span className="truncate">{activeMember.website_url}</span>
                </a>
              )}
              {activeMember.contact_email && (
                <a
                  href={`mailto:${activeMember.contact_email}`}
                  className="flex items-center gap-2 text-slate-700 hover:text-blue-700 font-medium p-2 rounded-lg bg-slate-50"
                >
                  <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                  <span className="truncate">{activeMember.contact_email}</span>
                </a>
              )}
              {activeMember.contact_phone && (
                <div className="flex items-center gap-2 text-slate-700 font-medium p-2 rounded-lg bg-slate-50">
                  <Phone className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>{activeMember.contact_phone}</span>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
