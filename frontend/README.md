# CICHA Frontend - Portal Web, Intranet de Socios & CMS

Frontend SPA reactivo desarrollado con **React 19**, **Vite 8**, **TypeScript**, **Tailwind CSS v4**, **Google Translate** con selector de banderas vectoriales, **LanguageContext** para traducciones manuales y **Lucide React** para la **Cámara de Industria y Comercio Heleno Argentina (CICHA)**.

---

## 🎨 Características Visuales y Tecnologías

- **Framework**: React 19 + TypeScript + Vite 8.
- **Motor de Estilos**: **Tailwind CSS v4** (`@tailwindcss/vite` y `@theme`).
  - Paleta cromática oficial greco-argentina:
    - Azul Egeo: `#0D5EAF` (Código oficial AP82-4)
    - Azul Marino Diplomático: `#0B2545`
    - Celeste Brisa Egeo: `#00AEEF` / `#D4EEFC`
    - Dorado Metálico: `#F5A623` / `#D4AF37`
  - Tipografías: *Inter* para lectura corporativa y *Cinzel* para títulos solemnes institucionales.
  - Micro-animaciones:
    - `@keyframes glowBlinkWhite`: resplandor blanco sutil y elegante con efecto de parpadeo suave sobre el título principal en Inicio.
    - `@keyframes zoomFromCenter`: animación expansiva del título principal institucional desde el centro.
    - Contadores dinámicos cíclicos (`CounterDisplay`) con curva cúbica suave (`easeOut`) e intervalos periódicos.
    - Efectos de glassmorphism con soporte WebKit Safari (`-webkit-backdrop-filter`) y diseño 100% responsivo para móviles e iOS.

---

## 🌟 Principales Módulos y Nuevas Características

### 1. 🏛️ Gestión Independiente de Contenidos Institucionales (`AdminInstitutionalPage.tsx`, `HomePage.tsx`, `PresentationPage.tsx` y `InstitutionalPage.tsx`)
- **Segmentación por Página (`page_target`)**: Cada sección institucional se administra de manera independiente:
  - 🏠 **Inicio (`/`)**: Tarjetas de Misión, Objeto Estatutario, Reseña Histórica, Trayectoria y Reconocimientos Oficiales.
  - 📜 **Presentación (`/presentacion`)**: Documento fundacional ampliado, hitos históricos (Fundación Onassis 1940, Reconocimiento 1989/1998) y marco bilateral.
  - 🏛️ **La Cámara (`/la-camara`)**: Nómina de autoridades, comisiones directivas, estatutos y alianzas estratégicas.
  - 🌐 **Todas las Secciones**: Vista general para administradores con filtros por pestaña.
- **Control Total en CMS**: Crear nuevas tarjetas, editar contenido, cambiar icono decorativo (`Award`, `Globe`, `Building`, etc.), alternar orden numérico y eliminar o pausar secciones con efecto inmediato en la web pública.

### 2. 🎁 Módulo Público y CMS de "Beneficios" (`BenefitsPage.tsx` y `AdminBenefitsPage.tsx`)
- **Web Pública (`/beneficios`)**:
  - Hero visual con estética greco-argentina y buscador por palabra clave en tiempo real.
  - Pestañas de filtrado horizontal por categorías comerciales (*Logística, Comercio Exterior, Servicios Profesionales, Hotelería & Viajes, Tecnología*).
  - Tarjetas de beneficio con imagen/logo de empresa, porcentaje o tipo de descuento destacado, vigencia, requisitos y botones de canje o contacto directo.
- **CMS Admin (`/admin/beneficios`)**:
  - Módulo completo para dar de alta convenios comerciales, cargar imagen de portada o logotipo del aliado, asignar categorías dinámicas, definir términos y condiciones y controlar visibilidad pública o exclusiva para socios.

### 3. 📅 Gestión Avanzada de Eventos & Galería Vinculada (`AdminEventsPage.tsx`, `EventsPage.tsx` y `HomePage.tsx`)
- **Subida de Foto de Portada**: Integración de `ImageUploader` para cargar 1 imagen representativa de alta calidad por evento.
- **Link Evento (Redes Sociales / Enlace Externo)**: Campo `registration_url` renombrado a **"Link Evento"**, permitiendo enlazar publicaciones de Instagram, LinkedIn, Facebook, plataformas de streaming o páginas de inscripción directa.
- **Selector de Álbum Fotográfico Vinculado (`album_id`)**:
  - En el CMS, selector desplegable de los álbumes fotográficos existentes creados en `/admin/galeria`.
  - En la Web Pública (**Agenda de Eventos** e **Inicio**), si el evento posee un álbum vinculado, exhibe badge con contador de fotos y botón directo **"Ver Galería de Fotos"** con navegación directa a `/galeria/:slug`.

### 4. 🌐 Traducciones Manuales con Edición de Español Original (`LanguageContext.tsx` y `AdminTranslationsPage.tsx`)
- **Panel de Traducción Tripartito**:
  - 🇦🇷 **Texto Original en Español (`original_es`)**: Totalmente editable por el administrador para corregir o actualizar la redacción base en castellano.
  - 🇬🇷 **Griego Moderno (`text_el`)**: Editor sincronizado en tiempo real.
  - 🇬🇧 **Inglés Internacional (`text_en`)**: Editor sincronizado en tiempo real.
- **Filtros por Página**: Pestañas de navegación rápida para filtrar frases solemnes por `Inicio`, `Presentación`, `La Cámara`, `Acreditaciones Header` y `General`.
- **Guardado Individual y Masivo**: Botón de guardado rápido por tarjeta y botón flotante de **"Guardar Todas las Traducciones"** por lote.

### 5. 🤝 Módulo de "Reuniones B2B & Resultados" (`B2BMeetingsPublicPage.tsx`, `PartnerB2BMeetingsPage.tsx` y `AdminB2BMeetingsPage.tsx`)
- **Web Pública (`/reuniones-b2b`)**:
  - Hero institucional con contadores de impacto comercial (Reuniones 1-a-1, Empresas participantes, Acuerdos alcanzados).
  - Filtros por sector (*Alimentos & Bebidas, Logística Portuaria, Tecnología & Energía, Multisectorial*) y buscador en vivo.
  - Tarjetas con imagen de portada, badges de estado, fecha, modalidad, resumen ejecutivo y métricas.
  - Modal de **Ficha Pública** con resumen del encuentro.
- **Portal de Socios (`/portal-socios/reuniones-b2b`)**:
  - Estética VIP con badge de acceso exclusivo.
  - Modal exhaustivo con:
    - 📊 Métricas cuantitativas de la ronda.
    - 📝 **Informe Detallado de Resultados y Acuerdos Comerciales** celebrados.
    - 🏢 **Empresas Participantes & Contrapartes** con demandas identificadas.
    - 💡 **Conclusiones Estratégicas y Recomendaciones**.
    - 📑 **Descarga de Dossier / Minuta Oficial en PDF**.
- **CMS Admin (`/admin/reuniones-b2b`)**: Formulario organizado en dos pestañas (*1. Datos Públicos* y *2. Informe Exclusivo para Socios*) con CRUD completo.

### 6. 📑 Categorización Dinámica de Actas de Socios (`PartnerMinutesPage.tsx` y `AdminDecreesPage.tsx`)
- **Gestor en CMS (`/admin/decretos`)**: Modal interactivo para que Administradores y Secretaría administren categorías de actas (`type = 'minutes'`).
- **Formulario de Carga**: Selector dinámico de categorías al compartir actas (PDF o URL).
- **Filtros por Categoría**: Pestañas de filtrado horizontal y badge con icono `Tag` en cada tarjeta.

### 7. 🏢 Directorio de Socios & Contacto Directo (`AdminMembersPage.tsx`, `MembersDirectoryPage.tsx` y `PartnerDirectoryPage.tsx`)
- **Truncamiento Inteligente en Tarjetas**: Aplicación de `line-clamp-3` en descripciones extensas para preservar la estética uniforme de la grilla.
- **Enlace Interactivo "Ver más..."**: Abre directamente el modal detallado de la empresa socia con texto íntegro, scroll formateado, representantes y datos de contacto.
- **Campos de Dirección (`address`) y Teléfono (`phone`)**: Información de contacto directo exhibida claramente en las fichas del socio.
- **Asignación Múltiple en CMS (`/admin/socios`)**: Selector interactivo de sectores y categorías con buscador y badges con eliminación rápida (`X`).
- **Visor Web Integrado (In-App Browser)**: Modal seguro para navegar sitios oficiales dentro de CICHA con fallback automático.

### 8. 📰 Boletín de Noticias para Socios (`AdminPartnerNewsPage.tsx`, `PartnerNewsPage.tsx` y `PartnerNewsDetailPage.tsx`)
- **Módulo CMS (`/admin/boletin-socios`)**: Módulo de administración para crear, editar y eliminar noticias exclusivas de socios, con subida de imagen de portada, categorías, editor enriquecido y switch de visibilidad.
- **Portal de Socios (`/portal-socios/boletin`)**: Cartelera informativa de noticias internas para empresas socias con buscador en vivo, filtrado por categorías y vista detallada de lectura.

### 9. 🏛️ Módulo de "Decretos Oficiales" (`AdminDecreesPage.tsx` y `PartnerDecreesPage.tsx`)
- **CMS Admin (`/admin/decretos`)**: CRUD completo con selector de logo/escudo oficial, subida dual de archivo PDF (hasta 30MB) o enlace URL, número de decreto/expediente, descripción, fecha de emisión y visibilidad.
- **Portal de Socios (`/portal-socios/decretos`)**: Visualización institucional de decretos en tarjetas con logo/escudo destacado, buscador en tiempo real y descarga de PDF o apertura de enlace oficial.

### 10. 🗂️ Sidebar del CMS en 5 Grupos Temáticos (21 Módulos) (`AdminLayout.tsx`)
- Menú de administración lateral modularizado:
  - **RESUMEN GENERAL**: Panel Principal (`/admin/dashboard`).
  - **WEB PÚBLICA & CONTENIDOS**: Portadas & Banners, Contenidos Institucionales (`/admin/institucional`), Beneficios & Convenios (`/admin/beneficios`), Comisión Directiva, Noticias & Prensa, Blogs & Artículos, Galería Fotográfica, Agenda de Eventos, Reuniones B2B & Resultados, Directorio de Socios, Alianzas Estratégicas, Traducción Griego / Inglés (`AdminTranslationsPage.tsx`).
  - **PORTAL DE SOCIOS & INTRANET**: Cuentas de Socios, Decretos Oficiales, Boletín para Socios, Documentos & Informes, Oportunidades VIP.
  - **GESTIÓN & CONTACTO**: Solicitudes de Ingreso, Bandeja de Contacto.
  - **SISTEMA & STAFF**: Ajustes Generales, Staff & Administradores.

---

## 🏛️ Estructura de Módulos y Portales

```
frontend/src/
├── components/
│   ├── common/              # Modales, Badges, Loaders, EventCalendar, GoogleTranslate, DocumentUploader, ImageUploader
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Loader.tsx
│   │   ├── EventCalendar.tsx    # Componente de calendario interactivo
│   │   ├── DocumentUploader.tsx # Subida dual PDF nativo o enlace URL externo
│   │   ├── ImageUploader.tsx    # Subida y preview de imágenes fotográficas
│   │   └── GoogleTranslate.tsx  # Selector de idioma y banderas vectoriales (ES, EL, EN)
│   └── layout/
│       ├── Navbar.tsx       # Cabecera pública con botón dorado Ingreso Socios, menú Beneficios y traductor
│       ├── Footer.tsx       # Pie institucional con botón dorado "Acceso Administración Web CMS"
│       ├── PartnerLayout.tsx# Cabecera bicapa e intranet exclusiva para socios (9 módulos)
│       └── AdminLayout.tsx  # CMS con navegación lateral organizada en 5 grupos temáticos (21 módulos)
├── context/
│   ├── AuthContext.tsx      # Autenticación JWT y helpers de rol (isAdmin, isSecretary, isSocio)
│   └── LanguageContext.tsx  # Motor de traducciones manuales (Español editable, Griego, Inglés)
├── pages/
│   ├── public/              # 14 Vistas del Portal Público
│   │   ├── HomePage.tsx                           # Inicio con tarjetas independientes de Trayectoria y Agenda
│   │   ├── InstitutionalPage.tsx                  # La Cámara (/la-camara) con nómina jerárquica
│   │   ├── PresentationPage.tsx                   # Presentación institucional Full-Width
│   │   ├── BenefitsPage.tsx                       # Beneficios y Convenios (/beneficios)
│   │   ├── ArticlesPage.tsx & ArticleDetailPage.tsx
│   │   ├── BlogsPage.tsx & BlogDetailPage.tsx
│   │   ├── GalleryPage.tsx
│   │   ├── SocialFeedPage.tsx                     # Feed Dual Facebook & Instagram
│   │   ├── EventsPage.tsx                         # Agenda de eventos con foto, Link Evento y galería vinculada
│   │   ├── B2BMeetingsPublicPage.tsx              # Reuniones B2B & Resultados (Versión Pública)
│   │   ├── MembersDirectoryPage.tsx               # Directorio con tarjetas y datos de contacto directo
│   │   ├── MembershipApplyPage.tsx
│   │   ├── TradeBilateralPage.tsx
│   │   └── ContactPage.tsx
│   ├── partner/             # 9 Módulos Exclusivos del Portal de Socios
│   │   ├── PartnerDashboardPage.tsx
│   │   ├── PartnerNewsPage.tsx & PartnerNewsDetailPage.tsx # Boletín de Noticias para Socios
│   │   ├── PartnerB2BMeetingsPage.tsx             # Reuniones B2B & Resultados (Informes Detallados)
│   │   ├── PartnerResourcesPage.tsx               # Documentos & Informes
│   │   ├── PartnerMinutesPage.tsx                 # Actas & Resoluciones (PDF / URL con Categorías)
│   │   ├── PartnerDecreesPage.tsx                 # Decretos Oficiales (PDF / URL)
│   │   ├── PartnerOpportunitiesPage.tsx           # Oportunidades VIP
│   │   ├── PartnerBenefitsPage.tsx                # Club de Beneficios (Categorías dinámicas)
│   │   └── PartnerDirectoryPage.tsx               # Directorio de Socios ("Socios")
│   └── admin/               # 21 Módulos Administrativos del CMS
│       ├── AdminLoginPage.tsx
│       ├── AdminDashboardPage.tsx
│       ├── AdminInstitutionalPage.tsx             # Gestión de Contenidos Institucionales (Inicio, Presentación, La Cámara)
│       ├── AdminBenefitsPage.tsx                  # Gestión de Beneficios y Convenios Comerciales
│       ├── AdminArticlesPage.tsx
│       ├── AdminBlogsPage.tsx
│       ├── AdminGalleryPage.tsx
│       ├── AdminEventsPage.tsx                    # Agenda de Eventos con Foto, Link Evento y Álbum vinculado
│       ├── AdminB2BMeetingsPage.tsx               # Gestión de Reuniones B2B & Resultados
│       ├── AdminMembersPage.tsx
│       ├── AdminOpportunitiesPage.tsx
│       ├── AdminPartnerResourcesPage.tsx          # Recursos & Documentos de Socios
│       ├── AdminPartnerUsersPage.tsx              # Cuentas de Socios
│       ├── AdminApplicationsPage.tsx
│       ├── AdminMessagesPage.tsx
│       ├── AdminBannersPage.tsx
│       ├── AdminTranslationsPage.tsx              # Traducción Manual (Español editable, Griego, Inglés)
│       ├── AdminPartnerNewsPage.tsx               # Boletín de Noticias para Socios
│       ├── AdminDecreesPage.tsx                   # Gestión de Decretos Oficiales & Categorías de Actas
│       ├── AdminAuthoritiesPage.tsx
│       ├── AdminAlliancesPage.tsx
│       ├── AdminSettingsPage.tsx
│       └── AdminUsersPage.tsx                     # Gestión de Staff con protección Super Admin
```
