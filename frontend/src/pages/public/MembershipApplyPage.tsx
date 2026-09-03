import React, { useState } from 'react';
import {
  Building2,
  User,
  CheckCircle,
  Mail,
  Phone,
  Globe,
  FileText,
  ShieldCheck,
  Send,
  HelpCircle,
  CreditCard,
  Users,
  Compass,
  Building,
  Upload,
} from 'lucide-react';
import { publicApi } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { ImageUploader } from '../../components/common/ImageUploader';
import bgHeader from '../../assets/static/7.webp';

export const MembershipApplyPage: React.FC = () => {
  const [applicantType, setApplicantType] = useState<'empresa' | 'persona_fisica'>('empresa');

  const [formData, setFormData] = useState({
    // Empresa / Persona
    company_name: '',
    business_name: '',
    company_logo_url: '',
    cuit_rut: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    contact_name: '',
    contact_role: '',

    // Persona Física específicos
    birth_date: '',
    doc_type: 'DNI',
    doc_number: '',
    nationality: 'Argentina',
    profession: '',
    sector: '',

    // Canal de conocimiento
    referral_source: 'web',
    referral_socio_name: '',
    referral_other: '',

    // Servicios adicionales solicitados (1, 2, 3)
    service_1: '',
    service_2: '',
    service_3: '',

    // Cuota social
    payment_preference: 'anual' as 'anual' | 'semestral',

    // Socios presentantes
    sponsor_1_name: '',
    sponsor_2_name: '',

    // Relación con Grecia
    greece_relations: [] as string[],
    greece_relation_details: '',

    // Aceptación estatutaria
    accept_statutes: false,
    signature_clarification: '',
    comments: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const greeceOptions = [
    'Pertenece a descendientes griegos',
    'Opera comercialmente con Grecia (Importación / Exportación)',
    'Representa empresas griegas en Argentina / Cono Sur',
    'Tiene sucursales o filial en Grecia',
    'Interés en comercio bilateral y misiones comerciales',
    'Otra relación institucional o profesional',
  ];

  const handleGreeceToggle = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      greece_relations: prev.greece_relations.includes(item)
        ? prev.greece_relations.filter((i) => i !== item)
        : [...prev.greece_relations, item],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar subida obligatoria de Logo / Imagen
    if (!formData.company_logo_url || formData.company_logo_url.trim() === '') {
      if (applicantType === 'empresa') {
        alert('Por favor, suba el logotipo obligatorio de la empresa para continuar con la solicitud.');
      } else {
        alert('Por favor, suba el logotipo obligatorio de su emprendimiento personal o foto de perfil para continuar con la solicitud.');
      }
      return;
    }

    if (!formData.accept_statutes) {
      alert('Debe aceptar y adherir a los fines estatutarios y reglamentos de la Cámara para continuar.');
      return;
    }

    setError(null);
    setLoading(true);

    const payload = {
      applicant_type: applicantType,
      company_name: applicantType === 'empresa' ? formData.company_name : formData.contact_name,
      business_name: formData.business_name,
      company_logo_url: formData.company_logo_url,
      contact_name: formData.contact_name,
      contact_role: formData.contact_role,
      birth_date: formData.birth_date,
      doc_type: formData.doc_type,
      doc_number: formData.doc_number,
      nationality: formData.nationality,
      address: formData.address,
      profession: formData.profession,
      sector: formData.sector || (applicantType === 'empresa' ? 'Empresarial' : 'Profesional'),
      email: formData.email,
      phone: formData.phone,
      cuit_rut: formData.cuit_rut,
      website: formData.website,
      referral_source:
        formData.referral_source === 'socio'
          ? `Por medio del Socio: ${formData.referral_socio_name}`
          : formData.referral_source === 'otro'
          ? `Otro: ${formData.referral_other}`
          : 'Página Web Oficial de la Cámara',
      referral_socio_name: formData.referral_socio_name,
      additional_services: [formData.service_1, formData.service_2, formData.service_3].filter(Boolean),
      payment_preference: formData.payment_preference,
      sponsor_1_name: formData.sponsor_1_name,
      sponsor_2_name: formData.sponsor_2_name,
      greece_relation_type: formData.greece_relations,
      greece_relation_details: formData.greece_relation_details,
      comments: formData.comments,
    };

    try {
      await publicApi.submitApplication(payload as any);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(
        err.response?.data?.messages
          ? Object.values(err.response.data.messages).join(' ')
          : 'Ocurrió un error al procesar su solicitud. Verifique los datos e intente nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-24">
      {/* 1. Official Diplomatic Header */}
      <section className="relative overflow-hidden bg-cicha-navy-deep text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-cicha-sky shadow-xl text-center">
        <div className="absolute inset-0 z-0">
          <img
            src={bgHeader}
            alt="Solicitud de Afiliación CICHA"
            className="w-full h-full object-cover object-center transform scale-105 opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cicha-navy-deep/95 via-cicha-navy/85 to-cicha-navy-deep/95" />
          <div className="absolute inset-0 bg-gradient-to-t from-cicha-navy-deep via-transparent to-black/40" />
        </div>

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <Badge variant="gold">Trámite Oficial de Incorporación</Badge>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight drop-shadow-md">
            Solicitud de Ingreso / Afiliación
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm font-light max-w-2xl mx-auto leading-relaxed drop-shadow">
            Cámara de Industria y Comercio Heleno Argentina • Sede Central: Julián Alvarez 1030/40, CABA.
          </p>
          <div className="inline-flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] text-slate-300 bg-black/40 px-4 py-2 rounded-2xl backdrop-blur-sm border border-white/10 max-w-3xl mx-auto">
            <span>Constituida 15/XI/1988</span>
            <span>•</span>
            <span>IGJ Exp. C.-1.506.696 Res. N° 000900 (1/XI/1989)</span>
            <span>•</span>
            <span>Reconocimiento República Helénica Dec. Presidencial N° 325 (18/IX/1998)</span>
          </div>
        </div>
      </section>

      {/* 2. Form Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {submitted ? (
          <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-cicha-navy">
                ¡Solicitud de Ingreso Registrada con Éxito!
              </h2>
              <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
                Su presentación formal ha sido remitida a la <strong>Comisión Directiva</strong> de la Cámara de Industria y Comercio Heleno Argentina para su correspondiente evaluación estatutaria.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 max-w-lg mx-auto text-left space-y-2">
              <div className="font-bold text-cicha-navy text-sm border-b border-slate-200 pb-2">
                Próximos pasos del trámite:
              </div>
              <p>• La Secretaría General cotejará los antecedentes aportados.</p>
              <p>• Se emitirá el dictamen de ingreso con las firmas del Presidente, Secretario y Tesorero.</p>
              <p>• Nos contactaremos a la brevedad a su correo (<strong>{formData.email}</strong>) para la confirmación de alta.</p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                window.location.reload();
              }}
              className="px-8 py-3 rounded-xl bg-cicha-navy hover:bg-cicha-navy-light text-white font-bold text-xs shadow-md transition-colors"
            >
              Completar otra solicitud
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10">
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Selector Tipo de Solicitante */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <label className="font-serif font-bold text-base text-cicha-navy block">
                Seleccione el Tipo de Solicitante:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setApplicantType('empresa')}
                  className={`p-5 rounded-2xl border-2 text-left flex items-start gap-4 transition-all ${
                    applicantType === 'empresa'
                      ? 'border-blue-600 bg-blue-50/50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${applicantType === 'empresa' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Persona Jurídica (Empresa / Entidad)</div>
                    <div className="text-xs text-slate-500 mt-1">Sociedades comerciales, pymes, corporaciones o firmas representadas.</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setApplicantType('persona_fisica')}
                  className={`p-5 rounded-2xl border-2 text-left flex items-start gap-4 transition-all ${
                    applicantType === 'persona_fisica'
                      ? 'border-blue-600 bg-blue-50/50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${applicantType === 'persona_fisica' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Persona Física (Profesional / Particular)</div>
                    <div className="text-xs text-slate-500 mt-1">Profesionales independientes, consultores, académicos o empresarios a título individual.</div>
                  </div>
                </button>
              </div>
            </div>

            {/* SECCIÓN 1: DATOS DE LA EMPRESA O PERSONA FÍSICA */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Página 1 de 4</span>
                  <h3 className="font-serif font-bold text-xl text-cicha-navy">
                    {applicantType === 'empresa' ? 'Datos de la Empresa Solicitante' : 'Datos Personales del Solicitante'}
                  </h3>
                </div>
                <Building className="w-6 h-6 text-slate-400" />
              </div>

              {applicantType === 'empresa' ? (
                /* Formulario Empresa */
                <div className="space-y-5 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Nombre Fantasía / Comercial de la Empresa *</label>
                      <input
                        type="text"
                        required
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        placeholder="Ej. Aegean Logistics S.A."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Razón Social *</label>
                      <input
                        type="text"
                        required
                        value={formData.business_name}
                        onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                        placeholder="Ej. Aegean Logistics Sociedad Anónima"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">CUIT / RUT *</label>
                      <input
                        type="text"
                        required
                        value={formData.cuit_rut}
                        onChange={(e) => setFormData({ ...formData, cuit_rut: e.target.value })}
                        placeholder="30-XXXXXXXX-X"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Sector / Rubro de Actividad *</label>
                      <input
                        type="text"
                        required
                        value={formData.sector}
                        onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                        placeholder="Ej. Alimentos & Bebidas, Marítimo, Minería, Tecnología"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Domicilio Legal y Comercial *</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Calle, Número, Piso/Oficina, Ciudad, Provincia, Código Postal"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Teléfonos / Fax *</label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(+54 11) 4000-0000"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">E-mail Corporativo *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contacto@empresa.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Página Web (URL)</label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://www.empresa.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Persona de Contacto (Nombre y Apellido) *</label>
                      <input
                        type="text"
                        required
                        value={formData.contact_name}
                        onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                        placeholder="Ej. Juan Pérez"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Cargo / Posición en la Empresa *</label>
                      <input
                        type="text"
                        required
                        value={formData.contact_role}
                        onChange={(e) => setFormData({ ...formData, contact_role: e.target.value })}
                        placeholder="Ej. Director General, Gerente de Comercio Exterior"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  {/* Logo de la Empresa */}
                  <div className="pt-2 border-t border-slate-100">
                    <ImageUploader
                      label="Logo de la Empresa (Obligatorio) *"
                      value={formData.company_logo_url}
                      onChange={(url) => setFormData({ ...formData, company_logo_url: url })}
                      helperText="Suba el logotipo corporativo oficial para la ficha institucional, directorio de socios y documentación oficial."
                      previewHeight="h-28"
                      aspectRatio="square"
                    />
                  </div>
                </div>
              ) : (
                /* Formulario Persona Física */
                <div className="space-y-5 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Nombre Completo y Apellidos *</label>
                      <input
                        type="text"
                        required
                        value={formData.contact_name}
                        onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                        placeholder="Ej. Constantino Papadópulos"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Fecha de Nacimiento *</label>
                      <input
                        type="date"
                        required
                        value={formData.birth_date}
                        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Tipo de Documento</label>
                      <select
                        value={formData.doc_type}
                        onChange={(e) => setFormData({ ...formData, doc_type: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
                      >
                        <option value="DNI">D.N.I.</option>
                        <option value="Pasaporte">Pasaporte</option>
                        <option value="LC/LE">L.C. / L.E.</option>
                        <option value="CI">Cédula de Identidad</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Número de Documento *</label>
                      <input
                        type="text"
                        required
                        value={formData.doc_number}
                        onChange={(e) => setFormData({ ...formData, doc_number: e.target.value })}
                        placeholder="XX.XXX.XXX"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Nacionalidad *</label>
                      <input
                        type="text"
                        required
                        value={formData.nationality}
                        onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                        placeholder="Ej. Argentina, Griega"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Profesión / Ocupación *</label>
                      <input
                        type="text"
                        required
                        value={formData.profession}
                        onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                        placeholder="Ej. Abogado, Ingeniero, Consultor en Negocios"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Sector / Rubro Laboral *</label>
                      <input
                        type="text"
                        required
                        value={formData.sector}
                        onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                        placeholder="Ej. Servicios Profesionales, Comercio Exterior"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Domicilio Particular *</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Calle, Número, Localidad, Código Postal"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Teléfonos / Celular *</label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(+54 9 11) XXXX-XXXX"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">E-mail Personal / Profesional *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="nombre@correo.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Página Web / LinkedIn</label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  {/* Logo de Emprendimiento Personal / Foto para Persona Física */}
                  <div className="pt-2 border-t border-slate-100">
                    <ImageUploader
                      label="Logo de su Emprendimiento Personal / Marca Profesional / Foto (Obligatorio) *"
                      value={formData.company_logo_url}
                      onChange={(url) => setFormData({ ...formData, company_logo_url: url })}
                      helperText="Suba el logo de su emprendimiento personal, marca profesional o fotografía de perfil institucional (Requerido para la ficha y acreditación)."
                      previewHeight="h-28"
                      aspectRatio="square"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECCIÓN 2: CONOCIMIENTO, SERVICIOS ADICIONALES Y PAGO */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Página 2 de 4</span>
                  <h3 className="font-serif font-bold text-xl text-cicha-navy">
                    Conocimiento, Servicios y Preferencias
                  </h3>
                </div>
                <Compass className="w-6 h-6 text-slate-400" />
              </div>

              <div className="space-y-6 text-xs">
                {/* Canal de conocimiento */}
                <div className="space-y-3">
                  <label className="font-bold text-slate-800 text-sm block">
                    Tomé conocimiento de la existencia de la Cámara de Industria y Comercio Heleno Argentina:
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="radio"
                        name="referral_source"
                        value="web"
                        checked={formData.referral_source === 'web'}
                        onChange={(e) => setFormData({ ...formData, referral_source: e.target.value })}
                        className="text-blue-600"
                      />
                      <span className="font-medium text-slate-700">Por medio de la Página Web de la Cámara</span>
                    </label>

                    <label className="flex flex-col sm:flex-row sm:items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="referral_source"
                          value="socio"
                          checked={formData.referral_source === 'socio'}
                          onChange={(e) => setFormData({ ...formData, referral_source: e.target.value })}
                          className="text-blue-600"
                        />
                        <span className="font-medium text-slate-700">Por medio del Socio:</span>
                      </div>
                      {formData.referral_source === 'socio' && (
                        <input
                          type="text"
                          value={formData.referral_socio_name}
                          onChange={(e) => setFormData({ ...formData, referral_socio_name: e.target.value })}
                          placeholder="Nombre y Apellido o Empresa del Socio"
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs mt-2 sm:mt-0"
                        />
                      )}
                    </label>

                    <label className="flex flex-col sm:flex-row sm:items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="referral_source"
                          value="otro"
                          checked={formData.referral_source === 'otro'}
                          onChange={(e) => setFormData({ ...formData, referral_source: e.target.value })}
                          className="text-blue-600"
                        />
                        <span className="font-medium text-slate-700">Por medio de:</span>
                      </div>
                      {formData.referral_source === 'otro' && (
                        <input
                          type="text"
                          value={formData.referral_other}
                          onChange={(e) => setFormData({ ...formData, referral_other: e.target.value })}
                          placeholder="Indique evento, cámara colega o medio"
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs mt-2 sm:mt-0"
                        />
                      )}
                    </label>
                  </div>
                </div>

                {/* Servicios adicionales */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <label className="font-bold text-slate-800 text-sm block">
                    Si piensa que la Cámara de Industria y Comercio Heleno Argentina puede brindarle algún otro servicio adicional a los que ofrece actualmente, le rogamos nos lo indique a continuación:
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.service_1}
                      onChange={(e) => setFormData({ ...formData, service_1: e.target.value })}
                      placeholder="1. Servicio de interés adicional..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                    />
                    <input
                      type="text"
                      value={formData.service_2}
                      onChange={(e) => setFormData({ ...formData, service_2: e.target.value })}
                      placeholder="2. Servicio de interés adicional..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                    />
                    <input
                      type="text"
                      value={formData.service_3}
                      onChange={(e) => setFormData({ ...formData, service_3: e.target.value })}
                      placeholder="3. Servicio de interés adicional..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                {/* Preferencia de pago */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <label className="font-bold text-slate-800 text-sm block">
                    ¿De qué manera prefiere Ud. abonar las cuotas sociales?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className={`p-4 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                      formData.payment_preference === 'anual' ? 'border-blue-600 bg-blue-50/40 font-bold text-blue-950' : 'border-slate-200 text-slate-700'
                    }`}>
                      <input
                        type="radio"
                        name="payment_preference"
                        value="anual"
                        checked={formData.payment_preference === 'anual'}
                        onChange={() => setFormData({ ...formData, payment_preference: 'anual' })}
                        className="text-blue-600"
                      />
                      <div>
                        <div>Cuota Anual</div>
                        <div className="text-[11px] text-slate-500 font-normal">Abono anual con bonificación preferencial</div>
                      </div>
                    </label>

                    <label className={`p-4 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                      formData.payment_preference === 'semestral' ? 'border-blue-600 bg-blue-50/40 font-bold text-blue-950' : 'border-slate-200 text-slate-700'
                    }`}>
                      <input
                        type="radio"
                        name="payment_preference"
                        value="semestral"
                        checked={formData.payment_preference === 'semestral'}
                        onChange={() => setFormData({ ...formData, payment_preference: 'semestral' })}
                        className="text-blue-600"
                      />
                      <div>
                        <div>Cuota Semestral</div>
                        <div className="text-[11px] text-slate-500 font-normal">Abono fraccionado cada 6 meses</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: PRESENTACIÓN DE ASOCIADOS ACTUALES (SOCIOS PRESENTANTES) */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Página 3 de 4</span>
                  <h3 className="font-serif font-bold text-xl text-cicha-navy">
                    Presentación de Asociados Actuales (Opcional)
                  </h3>
                </div>
                <Users className="w-6 h-6 text-slate-400" />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Socios de la entidad que presentan o avalan esta solicitud, conforme a las normas estatutarias de CICHA:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="font-bold text-cicha-navy block border-b border-slate-200 pb-1">
                    Socio Presentante N° 1
                  </span>
                  <div className="space-y-1.5">
                    <label className="text-slate-600 font-medium">Nombre / Razón Social del Socio:</label>
                    <input
                      type="text"
                      value={formData.sponsor_1_name}
                      onChange={(e) => setFormData({ ...formData, sponsor_1_name: e.target.value })}
                      placeholder="Nombre del socio o empresa socia"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="font-bold text-cicha-navy block border-b border-slate-200 pb-1">
                    Socio Presentante N° 2
                  </span>
                  <div className="space-y-1.5">
                    <label className="text-slate-600 font-medium">Nombre / Razón Social del Socio:</label>
                    <input
                      type="text"
                      value={formData.sponsor_2_name}
                      onChange={(e) => setFormData({ ...formData, sponsor_2_name: e.target.value })}
                      placeholder="Nombre del socio o empresa socia"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 4: RELACIÓN CON GRECIA & DECLARACIÓN ESTATUTARIA */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Página 4 de 4</span>
                  <h3 className="font-serif font-bold text-xl text-cicha-navy">
                    Datos Informativos Adjuntos: Relación con Grecia
                  </h3>
                </div>
                <Globe className="w-6 h-6 text-slate-400" />
              </div>

              <div className="space-y-5 text-xs">
                <label className="font-bold text-slate-800 text-sm block">
                  ¿Qué tipo de relación con Grecia tiene la empresa o solicitante?
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {greeceOptions.map((opt) => (
                    <label
                      key={opt}
                      className={`p-3.5 rounded-2xl border flex items-start gap-2.5 cursor-pointer transition-colors ${
                        formData.greece_relations.includes(opt)
                          ? 'border-blue-600 bg-blue-50/50 text-blue-950 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.greece_relations.includes(opt)}
                        onChange={() => handleGreeceToggle(opt)}
                        className="mt-0.5 rounded text-blue-600"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="font-bold text-slate-700">Detalles de la relación con Grecia / Actividad Comercial:</label>
                  <textarea
                    rows={3}
                    value={formData.greece_relation_details}
                    onChange={(e) => setFormData({ ...formData, greece_relation_details: e.target.value })}
                    placeholder="Detalles sobre vínculos comerciales, productos de intercambio, representaciones o ascendencia familiar..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="font-bold text-slate-700">Comentarios u Observaciones Adicionales:</label>
                  <textarea
                    rows={2}
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    placeholder="Cualquier información adicional que desee transmitir a la Comisión Directiva..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                {/* Conformidad estatutaria */}
                <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4 pt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.accept_statutes}
                      onChange={(e) => setFormData({ ...formData, accept_statutes: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded text-blue-600 border-amber-300"
                    />
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        "Adhiero y expreso mi plena conformidad con los fines estatutarios y reglamentos de la Cámara de Industria y Comercio Heleno Argentina."
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Declaro bajo juramento que los datos consignados en esta presentación son verídicos y autorizo a la Cámara a su correspondiente tratamiento institucional conforme a las leyes vigentes.
                      </p>
                    </div>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-amber-200/60">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-800 text-[11px]">Firma / Aclaración del Solicitante *</label>
                      <input
                        type="text"
                        required
                        value={formData.signature_clarification || formData.contact_name}
                        onChange={(e) => setFormData({ ...formData, signature_clarification: e.target.value })}
                        placeholder="Nombre y Apellido completo"
                        className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-800 text-[11px]">Fecha de Suscripción</label>
                      <input
                        type="text"
                        disabled
                        value={new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
                        className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-amber-100/50 text-xs text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-serif font-bold text-base shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
              >
                {loading ? (
                  'Procesando Solicitud...'
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Solicitud Oficial de Ingreso
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-400 mt-2">
                Trámite seguro y confidencial • Cámara de Industria y Comercio Heleno Argentina
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
