import React from 'react';
import { Link } from 'react-router-dom';
import {
  Globe2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import cichaLogo from '../../assets/images/logo.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-[#0066CC] to-[#0A4988] text-white pt-16 pb-8 border-t-4 border-[#00AEEF] shadow-2xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00AEEF]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4EEFC]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/20">
          {/* Column 1: Institutional */}
          <div className="space-y-4">
            <div className="bg-white p-2.5 rounded-2xl shadow-lg border border-[#D4EEFC] inline-flex items-center justify-center">
              <img
                src={cichaLogo}
                alt="CICHA - Cámara de Industria y Comercio Heleno Argentina"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>
            <p className="text-xs leading-relaxed text-white/90 font-light">
              Fuerza creadora de negocios sustentables, inversiones y comercio bilateral entre la República Argentina y la República Helénica.
            </p>
            <div className="p-3.5 rounded-xl bg-black/15 border border-white/25 text-xs space-y-1 backdrop-blur-sm">
              <p className="flex items-center gap-1.5 text-[#F5A623] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#00AEEF] shrink-0" />
                Reconocimientos Oficiales
              </p>
              <p className="text-white/90 text-[11px] font-medium leading-tight">
                • Gobierno Argentino: 1 de Noviembre 1989<br />
                • Gobierno Griego: 18 de Septiembre 1998
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base tracking-wider uppercase border-b-2 border-[#00AEEF]/50 pb-2">
              Secciones
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/institucional" className="text-white/90 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00AEEF]" />
                  Misión, Objeto e Historia
                </Link>
              </li>
              <li>
                <Link to="/institucional#autoridades" className="text-white/90 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00AEEF]" />
                  Comisión Directiva y Autoridades
                </Link>
              </li>
              <li>
                <Link to="/comercio-bilateral" className="text-white/90 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00AEEF]" />
                  Comercio Bilateral & Red EEN
                </Link>
              </li>
              <li>
                <Link to="/socios" className="text-white/90 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00AEEF]" />
                  Directorio de Empresas Socias
                </Link>
              </li>
              <li>
                <Link to="/noticias" className="text-white/90 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00AEEF]" />
                  Noticias & Comunicados
                </Link>
              </li>
              <li>
                <Link to="/eventos" className="text-white/90 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00AEEF]" />
                  Agenda de Eventos y Rondas
                </Link>
              </li>
              <li>
                <Link to="/asociarse" className="hover:text-white transition-colors flex items-center gap-1.5 font-bold text-[#F5A623]">
                  <ChevronRight className="w-3.5 h-3.5 text-[#00AEEF]" />
                  Solicitud de Afiliación
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Alliances & Networks */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base tracking-wider uppercase border-b-2 border-[#00AEEF]/50 pb-2">
              Redes & Alianzas
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white/10 border border-white/20 hover:border-[#00AEEF] transition-colors">
                <p className="font-bold text-white flex items-center justify-between">
                  EUROCAMARA Argentina
                  <ExternalLink className="w-3.5 h-3.5 text-[#00AEEF]" />
                </p>
                <p className="text-[11px] text-[#D4EEFC] mt-0.5">Miembro Activo desde Mayo 2017</p>
              </div>

              <div className="p-3 rounded-xl bg-white/10 border border-white/20 hover:border-[#00AEEF] transition-colors">
                <p className="font-bold text-white flex items-center justify-between">
                  Enterprise Europe Network
                  <Globe2 className="w-3.5 h-3.5 text-[#00AEEF]" />
                </p>
                <p className="text-[11px] text-[#D4EEFC] mt-0.5">Nodo Oficial en Argentina (Unión Europea)</p>
              </div>

              <div className="p-3 rounded-xl bg-white/10 border border-white/20 hover:border-[#00AEEF] transition-colors">
                <p className="font-bold text-white flex items-center justify-between">
                  UCCEB (32 Cámaras)
                  <Building2 className="w-3.5 h-3.5 text-[#F5A623]" />
                </p>
                <p className="text-[11px] text-[#D4EEFC] mt-0.5">Unión de Cámaras Binacionales</p>
              </div>
            </div>
          </div>

          {/* Column 4: Contact info */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base tracking-wider uppercase border-b-2 border-[#00AEEF]/50 pb-2">
              Sede & Contacto
            </h4>
            <div className="space-y-2.5 text-xs text-white/90 font-light">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00AEEF] shrink-0 mt-0.5" />
                <span>Av. Leandro N. Alem 1074, Piso 7, Ciudad Autónoma de Buenos Aires, Argentina</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#00AEEF] shrink-0" />
                <span>+54 11 4328-9898 / 9899</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#00AEEF] shrink-0" />
                <span>info@cicha.com.ar • comercio@cicha.com.ar</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#00AEEF] shrink-0" />
                <span>Lun a Vie 09:00 a 18:00 hs</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/80">
          <p>© {new Date().getFullYear()} Cámara de Industria y Comercio Heleno Argentina (CICHA). Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <Link to="/contacto" className="hover:text-white transition-colors font-medium">Privacidad & Términos</Link>
            <Link to="/admin/login" className="hover:text-white transition-colors text-white/60 font-medium">Panel CMS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
