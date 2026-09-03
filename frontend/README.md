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
    - `@keyframes zoomFromCenter`: animación expansiva del título principal institucional desde el centro.
    - Contadores dinámicos cíclicos (`CounterDisplay`) con curva cúbica suave (`easeOut`) e intervalos periódicos.
    - Efectos de glassmorphism con soporte WebKit Safari (`-webkit-backdrop-filter`) y diseño 100% responsivo para móviles e iOS (iPhone / iPad).
- **📱 Módulo "Post Redes Sociales" (`/redes-sociales`)**:
  - Feed dual en 2 columnas en paralelo (lado a lado):
    - **Facebook Oficial**: Widget embebido de la página oficial de CICHA con publicaciones en tiempo real.
    - **Instagram Oficial**: Feed interactivo de publicaciones de `@camarahelenoargentina` con botón directo para seguir la cuenta.
- **📰 Módulo de Blogs**:
  - Catálogo de artículos con filtros por categoría y buscador en tiempo real.
  - Vista de lectura completa con tiempo estimado de lectura, etiquetas y publicaciones relacionadas.
- **📷 Módulo de Galería de Fotos Inteligente**:
  - Selector de vistas (*Por Álbumes* vs *Mosaico Dinámico continuo*).
  - Visor **Lightbox a Pantalla Completa** con navegación interactiva por teclado (`←`, `→`, `Esc`), tira de miniaturas inferior y botón de descarga en alta resolución.
- **🌐 Ecosistema de Redes Sociales en Footer**:
  - Botones estilizados con efecto glassmorphism, resplandor celeste egeo (`#00AEEF`) e íconos interactivos: LinkedIn, Instagram, Facebook, X (Twitter), YouTube y TikTok.
  - Bloque centralizado simétrico para pantallas de escritorio y dispositivos móviles.
- **🌐 Traductor Automático en Tiempo Real (`GoogleTranslate.tsx`)**:
  - Traducción automática e instantánea del 100% del portal (incluyendo datos dinámicos provenientes de MySQL).
  - Selector desplegable con banderas vectoriales SVG nítidas:
    - 🇦🇷 **Español (Argentina)**: Idioma base nativo.
    - 🇬🇷 **Ελληνικά (Grecia)**: Traducción para el ecosistema helénico.
    - 🇬🇧 **English (Reino Unido / Internacional)**: Traducción para comercio exterior.
  - Integrado en **Portal Público**, **Intranet de Socios** y **CMS**.
- **Iconografía**: `lucide-react`.
- **Cliente HTTP**: `axios` con soporte dual de cabeceras de autorización (`Authorization` y `X-Authorization`) para compatibilidad con servidores cPanel FastCGI.
- **Enrutamiento**: `react-router-dom` con protección granular por roles (`RoleRoute`).

---

## 🏛️ Estructura de Módulos y Portales

La aplicación se compone de 3 áreas principales:

```
frontend/src/
├── components/
│   ├── common/              # Modales, Badges de estado, Loaders, ImageUploader, GoogleTranslate
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Loader.tsx
│   │   ├── ImageUploader.tsx
│   │   └── GoogleTranslate.tsx
│   └── layout/
│       ├── Navbar.tsx       # Cabecera pública con barra diplomática, traductor, logo sin texto y accesos
│       ├── Footer.tsx       # Pie de página institucional, redes sociales centradas, alianzas y mailto dinámico
│       ├── PartnerLayout.tsx# Intranet privada exclusiva para empresas socias
│       └── AdminLayout.tsx  # CMS administrativo con menú dinámico por rol
├── context/
│   └── AuthContext.tsx      # Gestión de autenticación, JWT y helpers de rol (isAdmin, isSecretary, isSocio)
├── pages/
│   ├── public/              # 12 Vistas del Portal Público (Visitante)
│   │   ├── HomePage.tsx                           # 👈 Inicio con contadores cíclicos y Misión/Objeto
│   │   ├── InstitutionalPage.tsx
│   │   ├── TradeBilateralPage.tsx
│   │   ├── ArticlesPage.tsx & ArticleDetailPage.tsx
│   │   ├── BlogsPage.tsx & BlogDetailPage.tsx     # 👈 Módulo de Blogs
│   │   ├── GalleryPage.tsx                        # 👈 Módulo de Galería
│   │   ├── SocialFeedPage.tsx                     # 👈 Feed Dual Facebook & Instagram
│   │   ├── EventsPage.tsx
│   │   ├── MembersDirectoryPage.tsx
│   │   ├── MembershipApplyPage.tsx                # 👈 Solicitud con logo obligatorio
│   │   └── ContactPage.tsx                        # 👈 Contacto con mailto dinámico
│   ├── partner/             # 5 Vistas del Portal Exclusivo de Socios
│   │   ├── PartnerDashboardPage.tsx
│   │   ├── PartnerResourcesPage.tsx
│   │   ├── PartnerOpportunitiesPage.tsx
│   │   ├── PartnerBenefitsPage.tsx
│   │   └── PartnerDirectoryPage.tsx
│   └── admin/               # 14 Vistas del CMS Administrativo
│       ├── AdminLoginPage.tsx
│       ├── AdminDashboardPage.tsx
│       ├── AdminArticlesPage.tsx
│       ├── AdminBlogsPage.tsx                     # 👈 Gestión de Blogs
│       ├── AdminGalleryPage.tsx                   # 👈 Gestión de Galería
│       ├── AdminEventsPage.tsx
│       ├── AdminMembersPage.tsx
│       ├── AdminOpportunitiesPage.tsx
│       ├── AdminPartnerResourcesPage.tsx
│       ├── AdminUsersPage.tsx
│       ├── AdminAuthoritiesPage.tsx
│       ├── AdminInstitutionalPage.tsx
│       ├── AdminAlliancesPage.tsx
│       ├── AdminApplicationsPage.tsx
│       ├── AdminMessagesPage.tsx
│       └── AdminSettingsPage.tsx (Redes con TikTok, Asuntos/Cuerpo de Correo, Portadas y Sede)
├── services/
│   └── api.ts               # Clientes API: publicApi, partnerApi, adminApi
└── types/
    └── index.ts             # Modelos e interfaces TypeScript (Blog, PhotoAlbum, Settings con TikTok, etc.)
```

---

## 🚀 Instalación y Ejecución

### 1. Instalar Dependencias
En la carpeta `frontend/`:

```bash
npm install
```

### 2. Variables de Entorno (Opcional)
Por defecto, el frontend se conecta a la API en `http://127.0.0.1:8080/index.php/api` (o a `https://api.cicha.com.ar/index.php/api` según `api.ts`). Si se requiere modificar la URL:

```ini
VITE_API_URL=http://127.0.0.1:8080/index.php/api
```

### 3. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```

El portal estará disponible en: [http://localhost:5173/](http://localhost:5173/)

### 4. Compilación para Producción
Para verificar tipos de TypeScript y generar el paquete optimizado (`dist/`):

```bash
npm run build
```

Para previsualizar la versión de producción localmente:
```bash
npm run preview
```

---

## 🔑 Cuentas de Acceso y Demostración

En la pantalla de login ([http://localhost:5173/admin/login](http://localhost:5173/admin/login)), se dispone de botones de acceso rápido para probar los 3 perfiles:

1. **Administrador (`admin@cicha.com.ar` / `admin123`)**:
   - Acceso total a todos los módulos: Gestión de Usuarios, Roles, Configuración General, Portadas / Banners, Misión & Estatutos, Blogs, Galería, Noticias, Eventos, Socios y Solicitudes.
2. **Secretaría (`secretaria@cicha.com.ar` / `sec123`)**:
   - Acceso operativo completo a Blogs, Galería de Fotos, Noticias, Agenda de Eventos, Oportunidades Comerciales, Directorio de Socios, Recursos de Socios y Bandejas de Mensajes y Afiliaciones.
   - *Oculta y restringe módulos críticos exclusivos como Gestión de Usuarios.*
3. **Empresa Socia (`socio@cicha.com.ar` / `socio123`)**:
   - Redirección automática a la intranet privada (`/portal-socios`).
   - Acceso a descargas de informes sectoriales, oportunidades comerciales VIP con datos de contacto directo de contrapartes, club de convenios y directorio B2B para networking.
