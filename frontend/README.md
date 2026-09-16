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

### 1. 🤝 Módulo de "Reuniones B2B & Resultados" (`B2BMeetingsPublicPage.tsx`, `PartnerB2BMeetingsPage.tsx` y `AdminB2BMeetingsPage.tsx`)
- **Web Pública (`/reuniones-b2b`)**:
  - Hero institucional con contadores de impacto comercial (Reuniones 1-a-1, Empresas participantes, Acuerdos alcanzados).
  - Filtros por sector (*Alimentos & Bebidas, Logística Portuaria, Tecnología & Energía, Multisectorial*) y buscador en vivo.
  - Tarjetas con imagen de portada, badges de estado, fecha, modalidad, resumen ejecutivo y métricas.
  - Modal de **Ficha Pública** con resumen del encuentro.
  - Banner interactivo con botón Call-to-Action al Portal de Socios.
- **Portal de Socios (`/portal-socios/reuniones-b2b`)**:
  - Estética VIP con badge de acceso exclusivo.
  - Modal exhaustivo con:
    - 📊 Métricas cuantitativas de la ronda.
    - 📝 **Informe Detallado de Resultados y Acuerdos Comerciales** celebrados.
    - 🏢 **Empresas Participantes & Contrapartes** con demandas identificadas.
    - 💡 **Conclusiones Estratégicas y Recomendaciones**.
    - 📑 **Descarga de Dossier / Minuta Oficial en PDF**.
    - 🤝 **Canal Directo de Seguimiento** con Secretaría de Comercio Exterior.
- **CMS Admin (`/admin/reuniones-b2b`)**: Formulario organizado en dos pestañas (*1. Datos Públicos* y *2. Informe Exclusivo para Socios*) con CRUD completo y control de publicación.

### 2. 📑 Categorización Dinámica de Actas de Socios (`PartnerMinutesPage.tsx` y `AdminDecreesPage.tsx`)
- **Gestor en CMS (`/admin/decretos`)**: Modal interactivo para que Administradores y Secretaría administren categorías de actas (`type = 'minutes'`).
- **Formulario de Carga**: Selector dinámico de categorías al compartir actas (PDF o URL).
- **Filtros por Categoría**: Pestañas de filtrado horizontal y badge con icono `Tag` en cada tarjeta.

### 3. 🎁 Categorización Dinámica de Beneficios (`PartnerBenefitsPage.tsx` y `AdminPartnerResourcesPage.tsx`)
- **Gestor en CMS (`/admin/recursos-socios`)**: Modal en la pestaña *Club de Convenios & Beneficios* para crear, editar y eliminar categorías (`type = 'benefits'`).
- **Formulario de Beneficio**: Selector `<select>` dinámico vinculado a las categorías registradas.
- **Portal de Socios (`/portal-socios/beneficios`)**: Filtros dinámicos por rubros comerciales (*Logística & Transporte, Networking Internacional, Servicios Profesionales, etc.*).

### 4. 🏢 Directorio de Socios & Contacto Directo (`AdminMembersPage.tsx`, `MembersDirectoryPage.tsx` y `PartnerDirectoryPage.tsx`)
- **Truncamiento Inteligente en Tarjetas**: Aplicación de `line-clamp-3` en descripciones extensas para preservar la estética y alineación uniforme de la grilla.
- **Enlace Interactivo "Ver más..."**: En descripciones largas, el botón abre directamente el modal detallado de la empresa socia con texto íntegro, scroll formateado, representantes y datos de contacto.
- **Campos de Dirección (`address`) y Teléfono (`phone`)**: Información de contacto directo exhibida claramente en las fichas del socio.
- **Asignación Múltiple en CMS (`/admin/socios`)**: Selector interactivo de sectores y categorías con buscador, badges con eliminación rápida (`X`) y soporte para asignar uno o más rubros comerciales por socio.
- **Modal de Detalle Completo & Visor Web Integrado (In-App Browser)**: Perfil ampliado con scroll vertical (`max-h-72 overflow-y-auto`) y modal seguro para navegar sitios oficiales dentro de CICHA con fallback automático.

### 5. 🌐 Traducciones Manuales en Vivo (Griego & Inglés) (`LanguageContext.tsx` y `AdminTranslationsPage.tsx`)
- **Administración CMS (`/admin/traducciones`)**: Panel con 3 columnas en paralelo:
  - 🇦🇷 **Español (Referencia)**: Texto original inmutable que sirve de guía al traductor.
  - 🇬🇷 **Griego Moderno (`text_el`)**: Editor en tiempo real con bandera de Grecia.
  - 🇬🇧 **Inglés Internacional (`text_en`)**: Editor en tiempo real con bandera de Reino Unido.
- **Acreditaciones del Header Integradas**: Textos solemnes de acreditaciones oficiales (1989 / 1998), EUROCAMARA, EEN y UCCEB sincronizados en el motor multilingüe.
- **Contexto de Idioma Reactivo (`LanguageContext.tsx`)**: Integración fluida con diccionarios de respaldo estáticos y consumo asíncrono de los endpoints `/public/translations/el` y `/public/translations/en`.

### 6. 📰 Boletín de Noticias para Socios (`AdminPartnerNewsPage.tsx`, `PartnerNewsPage.tsx` y `PartnerNewsDetailPage.tsx`)
- **Módulo CMS (`/admin/boletin-socios`)**: Módulo de administración para crear, editar y eliminar noticias exclusivas de socios, con subida de imagen de portada, categorías, editor enriquecido y switch de visibilidad.
- **Portal de Socios (`/portal-socios/boletin`)**: Cartelera informativa de noticias internas para empresas socias con buscador en vivo, filtrado por categorías y vista detallada de lectura con noticias sugeridas.

### 7. 🏛️ Módulo de "Decretos Oficiales" (`AdminDecreesPage.tsx` y `PartnerDecreesPage.tsx`)
- **CMS Admin (`/admin/decretos`)**: CRUD completo para `admin` y `secretario` con selector de logo/escudo oficial (preview interactivo), subida dual de archivo PDF (hasta 30MB) o enlace URL, número de decreto/expediente, descripción, fecha de emisión y switch de visibilidad.
- **Portal de Socios (`/portal-socios/decretos`)**: Visualización institucional de decretos en tarjetas con el logo/escudo destacado a la izquierda, buscador en tiempo real y botones para descargar PDF o abrir enlace oficial.

### 8. 📅 Cartelera Informativa de Eventos y Calendario Mensual (`EventsPage.tsx` y `EventCalendar.tsx`)
- **Cartelera Informativa Solemne**: Módulo enfocado en la difusión de agenda bilateral y foros oficiales.
- **Calendario Reutilizable**: Calendario interactivo con selector de meses/años, badges de eventos por fecha y panel de detalles; integrado en **Inicio (`HomePage.tsx`)** como tarjeta de *Agenda Bilateral* y en **Eventos (`EventsPage.tsx`)** a 2 columnas.

### 9. 🗂️ Sidebar del CMS Reorganizado en 5 Grupos Temáticos (`AdminLayout.tsx`)
- Menú de administración modularizado y agrupado lógicamente:
  - **RESUMEN GENERAL**: Panel Principal (`/admin/dashboard`).
  - **WEB PÚBLICA & CONTENIDOS**: Portadas & Banners, Historia & Estatutos, Comisión Directiva, Noticias & Prensa, Blogs & Artículos, Galería Fotográfica, Agenda de Eventos, Reuniones B2B & Resultados, Directorio de Socios, Alianzas Estratégicas, Traducción Griego / Inglés (`AdminTranslationsPage.tsx`).
  - **PORTAL DE SOCIOS & INTRANET**: Cuentas de Socios, Decretos Oficiales, Boletín para Socios (`AdminPartnerNewsPage.tsx`), Documentos & Informes, Oportunidades VIP.
  - **GESTIÓN & CONTACTO**: Solicitudes de Ingreso, Bandeja de Contacto.
  - **SISTEMA & STAFF**: Ajustes Generales, Staff & Administradores.

### 10. ✨ Header Bicapa del Portal de Socios (`PartnerLayout.tsx`)
- **Franja Superior (Blanca)**: Logo oficial (`logo oficial 3.png`), badge `Portal Socios`, slogan oficial, banderas diplomáticas de Argentina y Grecia, reconocimientos de gobiernos (1989 / 1998), sellos de EUROCAMARA y EEN, tarjeta de socio activo con badge dorado **"Socio Verificado"**, enlace a Web Pública y botón Salir.
- **Franja Inferior (Azul Egeo `#004b87`)**: Barra de navegación con indicador activo dorado para los 9 módulos del socio (*Panel Socio, Boletín de Noticias, Reuniones B2B, Documentos & Informes, Actas, Decretos, Oportunidades VIP, Club de Beneficios, Socios*).

---

## 🏛️ Estructura de Módulos y Portales

```
frontend/src/
├── components/
│   ├── common/              # Modales, Badges, Loaders, EventCalendar, GoogleTranslate, DocumentUploader
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Loader.tsx
│   │   ├── EventCalendar.tsx# Componente de calendario interactivo
│   │   ├── DocumentUploader.tsx # Subida dual PDF nativo o enlace URL externo
│   │   ├── ImageUploader.tsx
│   │   └── GoogleTranslate.tsx # Selector de idioma y banderas vectoriales (ES, EL, EN)
│   └── layout/
│       ├── Navbar.tsx       # Cabecera pública con botón dorado Ingreso Socios y traductor celeste
│       ├── Footer.tsx       # Pie institucional con botón dorado "Acceso Administración Web CMS"
│       ├── PartnerLayout.tsx# Cabecera bicapa e intranet exclusiva para socios (9 módulos)
│       └── AdminLayout.tsx  # CMS con navegación lateral organizada en 5 grupos temáticos (20 módulos)
├── context/
│   ├── AuthContext.tsx      # Autenticación JWT y helpers de rol (isAdmin, isSecretary, isSocio)
│   └── LanguageContext.tsx  # Motor de traducciones manuales (Español, Griego, Inglés)
├── pages/
│   ├── public/              # 13 Vistas del Portal Público
│   │   ├── HomePage.tsx                           # Inicio con tarjetas independientes de Trayectoria y Agenda
│   │   ├── InstitutionalPage.tsx                  # La Cámara (/la-camara) con nómina jerárquica
│   │   ├── PresentationPage.tsx                   # Presentación institucional Full-Width
│   │   ├── ArticlesPage.tsx & ArticleDetailPage.tsx
│   │   ├── BlogsPage.tsx & BlogDetailPage.tsx
│   │   ├── GalleryPage.tsx
│   │   ├── SocialFeedPage.tsx                     # Feed Dual Facebook & Instagram
│   │   ├── EventsPage.tsx                         # Agenda de eventos con calendario interactivo
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
│   └── admin/               # 20 Módulos Administrativos del CMS
│       ├── AdminLoginPage.tsx
│       ├── AdminDashboardPage.tsx
│       ├── AdminArticlesPage.tsx
│       ├── AdminBlogsPage.tsx
│       ├── AdminGalleryPage.tsx
│       ├── AdminEventsPage.tsx
│       ├── AdminB2BMeetingsPage.tsx               # Gestión de Reuniones B2B & Resultados
│       ├── AdminMembersPage.tsx
│       ├── AdminOpportunitiesPage.tsx
│       ├── AdminPartnerResourcesPage.tsx          # Recursos & Club de Beneficios (Categorías)
│       ├── AdminPartnerUsersPage.tsx
│       ├── AdminApplicationsPage.tsx
│       ├── AdminMessagesPage.tsx
│       ├── AdminBannersPage.tsx
│       ├── AdminInstitutionalPage.tsx             # Gestión de Contenidos Institucionales
│       ├── AdminTranslationsPage.tsx              # Traducción Manual Griego / Inglés
│       ├── AdminPartnerNewsPage.tsx               # Boletín de Noticias para Socios
│       ├── AdminDecreesPage.tsx                   # Gestión de Decretos Oficiales & Categorías de Actas
│       ├── AdminAuthoritiesPage.tsx
│       ├── AdminAlliancesPage.tsx
│       ├── AdminSettingsPage.tsx
│       └── AdminUsersPage.tsx                     # Gestión de Staff con protección Super Admin
```
