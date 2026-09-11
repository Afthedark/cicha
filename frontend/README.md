# CICHA Frontend - Portal Web, Intranet de Socios & CMS

Frontend SPA reactivo desarrollado con **React 19**, **Vite 8**, **TypeScript**, **Tailwind CSS v4**, **Google Translate** con selector de banderas vectoriales y **Lucide React** para la **Cámara de Industria y Comercio Heleno Argentina (CICHA)**.

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

### 1. 🏛️ Módulo de "Decretos Oficiales" (`AdminDecreesPage.tsx` y `PartnerDecreesPage.tsx`)
- **CMS Admin (`/admin/decretos`)**: CRUD completo para `admin` y `secretario` con selector de logo/escudo oficial (preview interactivo), subida dual de archivo PDF (hasta 30MB) o enlace URL, número de decreto/expediente, descripción, fecha de emisión y switch de visibilidad.
- **Portal de Socios (`/portal-socios/decretos`)**: Visualización institucional de decretos en tarjetas con el logo/escudo destacado a la izquierda, buscador en tiempo real y botones para descargar PDF o abrir enlace oficial.

### 2. 📑 Módulo de "Actas de Socios" (`PartnerMinutesPage.tsx`)
- **Espacio Colaborativo Inter-Socios (`/portal-socios/actas`)**: Permite a las empresas socias compartir actas de reuniones y asambleas.
- **Subida Dual**: Soporte para cargar documentos PDF nativos o pegar enlaces directos a carpetas en la nube (Google Drive, OneDrive, Dropbox).
- **Control de Autoría**: Muestra el socio/empresa emisor con fecha/hora y permite eliminar únicamente al autor original o a administradores.

### 3. 🗂️ Sidebar del CMS Reorganizado en 5 Grupos Temáticos (`AdminLayout.tsx`)
- Menú de administración modularizado y agrupado lógicamente:
  - **RESUMEN GENERAL**: Panel Principal (`/admin/dashboard`).
  - **WEB PÚBLICA & CONTENIDOS**: Portadas & Banners (`AdminBannersPage.tsx`), Historia & Estatutos (`AdminInstitutionalPage.tsx`), Comisión Directiva (`AdminAuthoritiesPage.tsx`), Noticias & Comunicados (`AdminArticlesPage.tsx`), Blogs Editoriales (`AdminBlogsPage.tsx`), Galería de Fotos (`AdminGalleryPage.tsx`), Agenda de Eventos (`AdminEventsPage.tsx`), Directorio de Socios (`AdminMembersPage.tsx`), Alianzas Estratégicas (`AdminAlliancesPage.tsx`).
  - **PORTAL DE SOCIOS & INTRANET**: Decretos Oficiales (`AdminDecreesPage.tsx`), Recursos & Informes (`AdminPartnerResourcesPage.tsx`), Oportunidades VIP (`AdminOpportunitiesPage.tsx`), Club de Beneficios (`AdminPartnerBenefitsPage.tsx`).
  - **GESTIÓN & CONTACTO**: Solicitudes de Afiliación (`AdminApplicationsPage.tsx`), Mensajes de Contacto (`AdminMessagesPage.tsx`).
  - **SISTEMA & STAFF**: Ajustes Generales (`AdminSettingsPage.tsx`), Cuentas de Socios (`AdminPartnerUsersPage.tsx`), Staff & Administradores (`AdminUsersPage.tsx`).
- Menú lateral sticky con scroll dedicado y sincronización completa con el Drawer móvil.

### 4. ✨ Header Bicapa del Portal de Socios (`PartnerLayout.tsx`)
- **Franja Superior (Blanca)**: Logo oficial (`logo oficial 3.png`), badge `Portal Socios`, slogan oficial, banderas diplomáticas de Argentina y Grecia, reconocimientos de gobiernos (1989 / 1998), sellos de EUROCAMARA y EEN, selector de idiomas, tarjeta de socio activo con badge dorado **"Socio Verificado"**, enlace a Web Pública y botón Salir.
- **Franja Inferior (Azul Egeo `#004b87`)**: Barra de navegación con indicador activo dorado (`after:bg-amber-400`) para los 7 módulos del socio (*Panel Socio, Documentos & Informes, Actas, Decretos, Oportunidades VIP, Club de Beneficios, Directorio B2B*).
- Drawer menú móvil adaptado.

### 5. 📅 Calendario de Eventos Reutilizable (`EventCalendar.tsx`)
- Componente interactivo de calendario mensual con navegación de meses, badges de eventos por fecha, selector de categorías y panel de detalles.
- **Inicio (`HomePage.tsx`)**: Integrado como tarjeta independiente y estilizada de **Agenda Bilateral**, desacoplada de la tarjeta de *Trayectoria & Representación*.
- **Eventos (`EventsPage.tsx`)**: Disposición en 2 columnas: listado de encuentros a la izquierda y calendario interactivo a la derecha.

### 6. 🔘 Botón Dorado "Acceso Administración Web CMS" en Footer (`Footer.tsx`)
- Botón/badge destacado en degradado dorado (`from-amber-400 to-amber-500`) con icono de candado/seguridad para acceso directo al CMS (`/admin/login`).

### 7. 🏛️ Vista Institucional "Presentación" Refinada (`PresentationPage.tsx`)
- Presentación institucional en formato *Full-Width*, centrada en la trayectoria histórica de la Cámara y el marco bilateral.

### 8. 🏢 Directorio de Socios con Tarjetas Horizontales (`MembersDirectoryPage.tsx`)
- Tarjetas horizontales de alta legibilidad con logo independiente a la izquierda de gran tamaño (64x64px), marco blanco con borde suave y animación interactiva `group-hover:scale-110`.

### 9. 🔘 Botón Dorado "Ingreso Socios" en Navbar Público (`Navbar.tsx`)
- Botón destacado en dorado institucional (`bg-gradient-to-r from-amber-400 to-amber-500`) con enlace a `/admin/login`.

### 10. 🛡️ Aislamiento Estricto de Seguridad para Super Administradores
- Restricción en `AdminUsersPage.tsx` para que administradores estándar no puedan ver ni editar los datos del Super Admin.

### 11. 🏛️ Módulo "La Cámara" (`/la-camara`)
- Denominación oficial unificada en el menú principal (`Navbar.tsx`) y en el `Footer.tsx`.
- Enrutamiento optimizado con redirección desde `/institucional` a `/la-camara`.
- Visualización jerárquica en 3 bloques dinámicos ordenados por `order_num`: Presidencia Honoraria, Comisión Directiva y Comisión Revisora de Cuentas.

### 12. 👥 Gestión Especializada de Usuarios y Socios
- **Staff & Administradores (`AdminUsersPage.tsx`)**: Para gestionar administradores y secretarios.
- **Cuentas de Socios (`AdminPartnerUsersPage.tsx`)**: Para registrar accesos al Portal de Socios.
- **Mostrar / Ocultar Contraseña**: Toggle interactivo con iconos `Eye` / `EyeOff`.
- **Copiar Credenciales Inteligente**: Botón que copia usuario, clave y enlace de acceso listo para enviar.

### 13. ✉️ Asunto Predeterminado Administrable ("Correos Socios")
- Bloque administrable en Ajustes Generales: `member_email_subject` y `member_email_body`.
- Configurado por defecto con `MENSAJE POR MEDIO DE LA PAGINA DE CICHA`.

### 14. 📱 Módulo "Post Redes Sociales" (`/redes-sociales`)
- Feed dual en 2 columnas en paralelo con widgets de Facebook e Instagram oficial.

### 15. 📰 Módulo de Blogs & Artículos Editoriales (`/blogs` y `/admin/blogs`).
### 16. 📷 Módulo de Galería de Fotos Inteligente con Lightbox a Pantalla Completa (`/galeria` y `/admin/galeria`).
### 17. 🌐 Traductor Automático en Tiempo Real (`GoogleTranslate.tsx`) con selector celeste egeo y banderas vectoriales SVG.

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
│   │   └── GoogleTranslate.tsx
│   └── layout/
│       ├── Navbar.tsx       # Cabecera pública con botón dorado Ingreso Socios y traductor celeste
│       ├── Footer.tsx       # Pie institucional con botón dorado "Acceso Administración Web CMS"
│       ├── PartnerLayout.tsx# Cabecera bicapa e intranet exclusiva para socios
│       └── AdminLayout.tsx  # CMS con navegación lateral organizada en 5 grupos temáticos
├── context/
│   └── AuthContext.tsx      # Autenticación JWT y helpers de rol (isAdmin, isSecretary, isSocio)
├── pages/
│   ├── public/              # 12 Vistas del Portal Público
│   │   ├── HomePage.tsx                           # Inicio con tarjetas independientes de Trayectoria y Agenda
│   │   ├── InstitutionalPage.tsx                  # La Cámara (/la-camara) con nómina jerárquica
│   │   ├── PresentationPage.tsx                   # Presentación institucional Full-Width
│   │   ├── ArticlesPage.tsx & ArticleDetailPage.tsx
│   │   ├── BlogsPage.tsx & BlogDetailPage.tsx
│   │   ├── GalleryPage.tsx
│   │   ├── SocialFeedPage.tsx                     # Feed Dual Facebook & Instagram
│   │   ├── EventsPage.tsx                         # Agenda de eventos con calendario interactivo
│   │   ├── MembersDirectoryPage.tsx               # Directorio con tarjetas horizontales y logos grandes
│   │   ├── MembershipApplyPage.tsx
│   │   ├── TradeBilateralPage.tsx
│   │   └── ContactPage.tsx
│   ├── partner/             # 7 Módulos Exclusivos del Portal de Socios
│   │   ├── PartnerDashboardPage.tsx
│   │   ├── PartnerResourcesPage.tsx               # Documentos & Informes
│   │   ├── PartnerMinutesPage.tsx                 # Actas & Resoluciones (PDF / URL)
│   │   ├── PartnerDecreesPage.tsx                 # Decretos Oficiales (PDF / URL)
│   │   ├── PartnerOpportunitiesPage.tsx           # Oportunidades VIP
│   │   ├── PartnerBenefitsPage.tsx                # Club de Beneficios
│   │   └── PartnerDirectoryPage.tsx               # Directorio B2B
│   └── admin/               # 18 Módulos Administrativos del CMS
│       ├── AdminLoginPage.tsx
│       ├── AdminDashboardPage.tsx
│       ├── AdminArticlesPage.tsx
│       ├── AdminBlogsPage.tsx
│       ├── AdminGalleryPage.tsx
│       ├── AdminEventsPage.tsx
│       ├── AdminMembersPage.tsx
│       ├── AdminOpportunitiesPage.tsx
│       ├── AdminPartnerResourcesPage.tsx
│       ├── AdminPartnerUsersPage.tsx
│       ├── AdminApplicationsPage.tsx
│       ├── AdminMessagesPage.tsx
│       ├── AdminBannersPage.tsx
│       ├── AdminInstitutionalPage.tsx
│       ├── AdminDecreesPage.tsx                   # Gestión de Decretos Oficiales
│       ├── AdminAuthoritiesPage.tsx
│       ├── AdminAlliancesPage.tsx
│       ├── AdminSettingsPage.tsx
│       └── AdminUsersPage.tsx                     # Gestión de Staff con protección Super Admin
```
