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

### 1. 🏛️ "Contenido Administrable Web" y Traducciones Independientes (`AdminInstitutionalSectionsPage.tsx`, `HomePage.tsx`, `PresentationPage.tsx` y `InstitutionalPage.tsx`)
- **Renombrado Oficial del Módulo**: Módulo accesible desde `/admin/institucional` unificado bajo el nombre **"Contenido Administrable Web"**.
- **Segmentación por Página (`page_target`)**:
  - 🏠 **Inicio (`/`)**: Tarjetas de Misión, Objeto Estatutario, Reseña Histórica, Trayectoria, Reconocimientos y bloque **Oportunidades Comerciales Bilaterales** (`home_oportunidades`).
  - 📜 **Presentación (`/presentacion`)**: Documento fundacional ampliado, hitos históricos (Fundación Onassis 1940, Reconocimiento 1989/1998) y marco bilateral.
  - 🏛️ **La Cámara (`/la-camara`)**: Nómina de autoridades, comisiones directivas, estatutos y alianzas estratégicas.
  - 🌐 **Todas las Secciones**: Vista general para administradores con filtros por pestaña.
- **Oportunidades Comerciales Bilaterales (`home_oportunidades`)**:
  - Encabezado 100% dinámico: Tag superior (*"Comercio Exterior & Inversión Egea"*), Título principal (*"Oportunidades Comerciales Bilaterales"*) y Descripción administrables desde el CMS y traducibles a Griego e Inglés.
  - Botón fijo *"Asociarse"* con enlace permanente a `/asociarse`.

### 2. 🎁 Módulo de "Beneficios & Convenios" con CRUD de Categorías y Buscador (`BenefitsPage.tsx` y `AdminBenefitsPage.tsx`)
- **Web Pública (`/beneficios`)**:
  - Hero visual con estética greco-argentina y buscador por palabra clave en tiempo real.
  - Pestañas de filtrado horizontal por categorías comerciales (*Logística, Comercio Exterior, Servicios Profesionales, Hotelería & Viajes, Tecnología*).
  - Tarjetas de beneficio con imagen/logo de empresa, porcentaje o tipo de descuento destacado, vigencia, requisitos y botones de canje o contacto directo.
- **CMS Admin (`/admin/beneficios`)**:
  - Módulo completo para dar de alta convenios comerciales, cargar imagen de portada o logotipo del aliado, asignar categorías dinámicas y controlar visibilidad pública o exclusiva para socios.
  - **CRUD Directo de Categorías de Beneficios**: Modal emergente para dar de alta, modificar y eliminar categorías (`type = 'benefits'`).
  - **Buscador en el Selector de Categorías**: Permite escribir y encontrar rápidamente la categoría deseada al crear o editar el beneficio.

### 3. 📅 Gestión Avanzada de Eventos con Doble Foto & Buscador de Álbumes (`AdminEventsPage.tsx`, `EventsPage.tsx` y `HomePage.tsx`)
- **Soporte de Hasta 2 Fotos Principales**: Componentes dedicados `ImageUploader` para subir y previsualizar Foto Principal 1 (`image_url`) y Foto Principal 2 (`image_url_2`).
- **Link Evento (Redes Sociales / Enlace Externo)**: Enlace optimizado para Instagram, LinkedIn, Facebook o registro directo.
- **Buscador Asíncrono de Álbum Fotográfico Vinculado (`album_id`)**:
  - Selector con búsqueda en tiempo real conectado al endpoint de búsqueda de álbumes del backend.
  - En la Web Pública (**Agenda de Eventos** e **Inicio**), badge interactivo **"Ver Galería de Fotos ({photos_count})"** con redirección fluida a `/galeria/:slug`.

### 4. 🖼️ Galería Fotográfica con Gestión de Categorías en Línea (`AdminGalleryPage.tsx` y `GalleryPage.tsx`)
- **Administración de Categorías Integrada**: Modal dentro del CMS de Galería para gestionar categorías temáticas (`type = 'gallery'`) en tiempo real sin abandonar la vista de álbumes.
- **Visualización Pública**: Mosaico con filtros por categoría, lightbox de alta resolución y conteo dinámico de imágenes por álbum.

### 5. 🌐 Traducciones Manuales con Edición de Español Original (`LanguageContext.tsx` y `AdminTranslationsPage.tsx`)
- **Panel de Traducción Tripartito**:
  - 🇦🇷 **Texto Original en Español (`original_es`)**: Totalmente editable por el administrador para corregir o actualizar la redacción base en castellano.
  - 🇬🇷 **Griego Moderno (`text_el`)**: Editor sincronizado en tiempo real.
  - 🇬🇧 **Inglés Internacional (`text_en`)**: Editor sincronizado en tiempo real.
- **Filtros por Página**: Pestañas para `Inicio` (incluyendo `home.opp_*`), `Presentación`, `La Cámara`, `Acreditaciones Header` y `General`.
- **Guardado Individual y Masivo**: Guardado rápido individual y botón flotante de **"Guardar Todas las Traducciones"** por lote.

### 6. 🤝 Módulo de "Reuniones B2B & Resultados" (`B2BMeetingsPublicPage.tsx`, `PartnerB2BMeetingsPage.tsx` y `AdminB2BMeetingsPage.tsx`)
- **Web Pública Optimizada (`/reuniones-b2b`)**:
  - Cabecera limpia y ejecutiva (sin contadores fijos redundantes).
  - Filtros por sector y buscador en vivo.
  - Tarjetas con imagen, badges de modalidad (Presencial, Híbrido, Virtual), resumen ejecutivo y modal de **Ficha Pública**.
- **Portal de Socios (`/portal-socios/reuniones-b2b`)**:
  - Acceso exclusivo con informe exhaustivo de acuerdos, empresas contrapartes, conclusiones y **Descarga de Dossier en PDF**.
- **CMS Admin (`/admin/reuniones-b2b`)**: Formulario en 2 pestañas (*1. Datos Públicos* y *2. Informe Exclusivo para Socios*).

### 7. 🏢 Directorio de Socios & Fichas Optimizadas (`AdminMembersPage.tsx`, `MembersDirectoryPage.tsx` y `PartnerDirectoryPage.tsx`)
- **Diseño Armónico en Grilla Pública**:
  - Tarjetas de altura simétrica con truncamiento inteligente (`line-clamp-3`) y botón *"Ver más..."*.
  - Modal detallado con teléfono directo (`phone`), dirección (`address`), autoridades y visor web seguro (*In-App Browser*).
- **Asignación Múltiple en CMS (`/admin/socios`)**: Selector interactivo de sectores y categorías con buscador y badges con eliminación rápida (`X`).

### 8. 📑 Categorización Dinámica de Actas de Socios (`PartnerMinutesPage.tsx` y `AdminDecreesPage.tsx`)
- **Gestor en CMS (`/admin/decretos`)**: Modal interactivo para administrar categorías de actas (`type = 'minutes'`).
- **Formulario de Carga**: Selector dinámico de categorías al compartir actas (PDF o URL).
- **Filtros por Categoría**: Pestañas de filtrado horizontal y badge temático.

### 9. 📰 Boletín de Noticias para Socios (`AdminPartnerNewsPage.tsx`, `PartnerNewsPage.tsx` y `PartnerNewsDetailPage.tsx`)
- **Módulo CMS (`/admin/boletin-socios`)**: Creación y edición de noticias exclusivas con imagen de portada, categorías y switch de visibilidad.
- **Portal de Socios (`/portal-socios/boletin`)**: Cartelera informativa tipo magazine para empresas socias.

### 10. 🏛️ Módulo de "Decretos Oficiales" (`AdminDecreesPage.tsx` y `PartnerDecreesPage.tsx`)
- **CMS Admin (`/admin/decretos`)**: Carga dual de PDF o URL externa con logo/escudo oficial y fecha de emisión.
- **Portal de Socios (`/portal-socios/decretos`)**: Visualización institucional con buscador en tiempo real y descarga de PDF o enlace web.

### 11. 🗂️ Sidebar del CMS en 5 Grupos Temáticos (21 Módulos) (`AdminLayout.tsx`)
- Menú de administración lateral modularizado:
  - **RESUMEN GENERAL**: Panel Principal (`/admin/dashboard`).
  - **WEB PÚBLICA & CONTENIDOS**: Portadas & Banners, Contenido Administrable Web (`/admin/institucional`), Beneficios & Convenios (`/admin/beneficios`), Comisión Directiva, Noticias & Prensa, Blogs & Artículos, Galería Fotográfica, Agenda de Eventos, Reuniones B2B & Resultados, Directorio de Socios, Alianzas Estratégicas, Traducción Griego / Inglés (`AdminTranslationsPage.tsx`).
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
│   │   ├── HomePage.tsx                           # Inicio con tarjetas de Trayectoria, Oportunidades y Agenda
│   │   ├── InstitutionalPage.tsx                  # La Cámara (/la-camara) con nómina jerárquica
│   │   ├── PresentationPage.tsx                   # Presentación institucional Full-Width
│   │   ├── BenefitsPage.tsx                       # Beneficios y Convenios (/beneficios)
│   │   ├── ArticlesPage.tsx & ArticleDetailPage.tsx
│   │   ├── BlogsPage.tsx & BlogDetailPage.tsx
│   │   ├── GalleryPage.tsx
│   │   ├── SocialFeedPage.tsx                     # Feed Dual Facebook & Instagram
│   │   ├── EventsPage.tsx                         # Agenda con 2 fotos, Link Evento y galería vinculada
│   │   ├── B2BMeetingsPublicPage.tsx              # Reuniones B2B & Resultados (Versión Pública limpia)
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
│       ├── AdminInstitutionalSectionsPage.tsx     # Contenido Administrable Web (Inicio, Presentación, La Cámara)
│       ├── AdminBenefitsPage.tsx                  # Gestión de Beneficios, Convenios y Categorías
│       ├── AdminArticlesPage.tsx
│       ├── AdminBlogsPage.tsx
│       ├── AdminGalleryPage.tsx                   # Galería de Fotos & Categorías en línea
│       ├── AdminEventsPage.tsx                    # Agenda de Eventos con 2 Fotos, Link Evento y Álbum vinculado
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
