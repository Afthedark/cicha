import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight, ArrowLeft, Users, Shield, Briefcase } from 'lucide-react';
import { adminApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@cicha.com.ar');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await adminApi.login({ email, password });
      login(res.token, res.user);

      if (res.user.role === 'socio') {
        navigate('/portal-socios');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Credenciales incorrectas. Verifique su email y contraseña.'
      );
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B2545] via-[#071E38] to-[#040D1A] flex flex-col justify-center items-center p-4 sm:p-6 text-white font-sans relative">
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Sitio Público
        </Link>
      </div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0D5EAF] to-[#0B2545] border-2 border-amber-400 flex items-center justify-center text-white font-serif font-bold text-2xl text-amber-300 mx-auto shadow-xl">
            C
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl text-white">Ingreso a la Plataforma</h1>
            <p className="text-xs text-blue-300 mt-0.5">
              Cámara de Industria y Comercio Heleno Argentina
            </p>
          </div>
        </div>

        {/* Quick Demo Credentials Switcher */}
        <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-[11px]">
          <p className="text-slate-400 font-semibold text-center mb-2">Cuentas de demostración disponibles:</p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setDemoAccount('admin@cicha.com.ar', 'admin123')}
              className={`p-1.5 rounded-lg font-bold text-center transition-all ${
                email === 'admin@cicha.com.ar' ? 'bg-rose-600 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/15'
              }`}
            >
              Admin Total
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('secretaria@cicha.com.ar', 'sec123')}
              className={`p-1.5 rounded-lg font-bold text-center transition-all ${
                email === 'secretaria@cicha.com.ar' ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/15'
              }`}
            >
              Secretaría
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('socio@cicha.com.ar', 'socio123')}
              className={`p-1.5 rounded-lg font-bold text-center transition-all ${
                email === 'socio@cicha.com.ar' ? 'bg-amber-500 text-slate-950' : 'bg-white/10 text-slate-300 hover:bg-white/15'
              }`}
            >
              Socio Intranet
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-blue-900 text-white text-xs focus:bg-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-blue-900 text-white text-xs focus:bg-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
          >
            {loading ? 'Validando...' : 'Ingresar'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Acceso seguro con cifrado JWT & control RBAC</span>
        </div>
      </div>
    </div>
  );
};
