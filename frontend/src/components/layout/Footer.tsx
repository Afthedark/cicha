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

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#071E38] text-slate-300 pt-16 pb-8 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-blue-900/60">
          {/* Column 1: Institutional */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0D5EAF] to-[#0B2545] border-2 border-amber-400 flex items-center justify-center text-white font-serif font-bold text-lg text-amber-300">
                C
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-white tracking-wide">CICHA</h3>
                <p className="text-xs text-slate-400">Cámara Heleno Argentina</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              Fuerza creadora de negocios sustentables, inversiones y comercio bilateral entre la República Argentina y la República Helénica.
            </p>
            <div className="p-3 rounded-lg bg-blue-950/60 border border-blue-900 text-xs space-y-1">
              <p className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                Reconocimientos Oficiales
              </p>
              <p className="text-slate-300 text-[11px]">
                • Gobierno Argentino: 1 de Noviembre 1989<br />
                • Gobierno Griego: 18 de Septiembre 1998
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base tracking-wider uppercase border-b border-blue-800/60 pb-2">
              Secciones
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/institucional" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  Misión, Objeto e Historia
                </Link>
              </li>
              <li>
                <Link to="/institucional#autoridades" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  Comisión Directiva y Autoridades
                </Link>
              </li>
              <li>
                <Link to="/comercio-bilateral" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  Comercio Bilateral & Red EEN
                </Link>
              </li>
              <li>
                <Link to="/socios" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  Directorio de Empresas Socias
                </Link>
              </li>
              <li>
                <Link to="/noticias" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  Noticias & Comunicados
                </Link>
              </li>
              <li>
                <Link to="/eventos" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  Agenda de Eventos y Rondas
                </Link>
              </li>
              <li>
                <Link to="/asociarse" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 font-bold text-amber-400">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  Solicitud de Afiliación
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Alliances & Networks */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base tracking-wider uppercase border-b border-blue-800/60 pb-2">
              Redes & Alianzas
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-900/80">
                <p className="font-bold text-white flex items-center justify-between">
                  EUROCAMARA Argentina
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Miembro Activo desde Mayo 2017</p>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-900/80">
                <p className="font-bold text-white flex items-center justify-between">
                  Enterprise Europe Network
                  <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Nodo Oficial en Argentina (Unión Europea)</p>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-900/80">
                <p className="font-bold text-white flex items-center justify-between">
                  UCCEB (32 Cámaras)
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Unión de Cámaras Binacionales</p>
              </div>
            </div>
          </div>

          {/* Column 4: Contact info */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base tracking-wider uppercase border-b border-blue-800/60 pb-2">
              Sede & Contacto
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Av. Leandro N. Alem 1074, Piso 7, Ciudad Autónoma de Buenos Aires, Argentina</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+54 11 4328-9898 / 9899</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>info@cicha.com.ar • comercio@cicha.com.ar</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Lun a Vie 09:00 a 18:00 hs</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Cámara de Industria y Comercio Heleno Argentina (CICHA). Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <Link to="/contacto" className="hover:text-amber-400 transition-colors">Privacidad & Términos</Link>
            <Link to="/admin/login" className="hover:text-amber-400 transition-colors text-slate-500">Panel CMS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
