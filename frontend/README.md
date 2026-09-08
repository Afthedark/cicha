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
- **🏛️ Módulo "La Cámara" (`/la-camara`)**:
  - Denominación oficial unificada en el menú principal (`Navbar.tsx`) y en el `Footer.tsx`.
  - Enrutamiento optimizado con redirección desde `/institucional` a `/la-camara`.
  - Visualización jerárquica en 3 bloques dinámicos ordenados por `order_num`: Presidencia Honoraria, Comisión Directiva y Comisión Revisora de Cuentas (Órgano de Fiscalización).
- **⚙️ Gestión Unificada de Comisión Directiva & Autoridades (`AdminSettingsPage.tsx`)**:
  - Pestaña de administración centralizada en **Configuración & Gestión** (`/admin/configuracion?tab=authorities`).
  - Filtros interactivos por estructura (*Todos*, *Comisión Directiva*, *Comisión Revisora*, *Presidencia Honoraria*).
  - Selector de categoría (`directiva`, `revisora`, `honorario`, `comite`) con ayuda contextual y validación de orden de visualización.
  - Redirección automática de rutas previas (`/admin/autoridades` y `/admin/alianzas` a `/admin/configuracion`).
- **👥 Gestión Especializada de Usuarios y Socios**:
  - **Staff & Administradores (`AdminUsersPage.tsx`)**: Exclusivo para administradores para dar de alta roles `admin` y `secretario`.
  - **Cuentas de Socios (`AdminPartnerUsersPage.tsx`)**: Gestionable por administradores y secretarios para dar de alta accesos al Portal de Socios de forma directa y limpia.
  - **Mostrar / Ocultar Contraseña**: Toggle interactivo con iconos `Eye` / `EyeOff` en los inputs de clave.
  - **Copiar Credenciales Inteligente**: Botón que detecta automáticamente `window.location.origin + '/admin/login'` y copia al portapapeles el usuario, contraseña y enlace con feedback visual.
- **✉️ Asunto Predeterminado Administrable ("Correos Socios")**:
  - Bloque administrable en Ajustes Generales (`AdminSettingsPage.tsx`): `member_email_subject` y `member_email_body`.
  - Configurado por defecto con `MENSAJE POR MEDIO DE LA PAGINA DE CICHA`.
  - Aplicado automáticamente en los enlaces de correo de **Socios Web Pública (`MembersDirectoryPage.tsx`)** y **Directorio B2B Privado (`PartnerDirectoryPage.tsx`)**.
- **📚 Biblioteca de Socios con Subida Dual (PDF y URL)**:
  - Soporte de subida de archivos físicos PDF o enlaces directos a normativas y guías en `AdminPartnerResourcesPage.tsx`.
- **🏷️ Categorías Dinámicas en Portal de Socios**:
  - Filtros sincronizados en tiempo real en todos los módulos de la intranet de socios consumiendo la taxonomía del CMS.
- **📱 Módulo "Post Redes Sociales" (`/redes-sociales`)**:
  - Feed dual en 2 columnas en paralelo (lado a lado) con widgets en vivo de Facebook e Instagram.
- **📰 Módulo de Blogs**:
  - Catálogo de artículos con filtros por categoría y buscador en tiempo real.
  - Vista de lectura completa con tiempo estimado de lectura, etiquetas y publicaciones relacionadas.
- **📷 Módulo de Galería de Fotos Inteligente**:
  - Selector de vistas (*Por Álbumes* vs *Mosaico Dinámico continuo*).
  - Visor **Lightbox a Pantalla Completa** con navegación interactiva por teclado (`←`, `→`, `Esc`), tira de miniaturas inferior y botón de descarga.
- **🌐 Ecosistema de Redes Sociales en Footer**:
  - Botones estilizados con efecto glassmorphism, resplandor celeste egeo (`#00AEEF`) e íconos interactivos: LinkedIn, Instagram, Facebook, X (Twitter), YouTube y TikTok.
- **🌐 Traductor Automático en Tiempo Real (`GoogleTranslate.tsx`)**:
  - Traducción automática e instantánea del 100% del portal con banderas vectoriales SVG (Español, Griego e Inglés).
- **Iconografía**: `lucide-react`.
- **Cliente HTTP**: `axios` con soporte dual de cabeceras de autorización (`Authorization` y `X-Authorization`).
- **Enrutamiento**: `react-router-dom` con protección granular por roles (`RoleRoute`).

---

## 🏛️ Estructura de Módulos y Portales

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
│   │   ├── HomePage.tsx                           # Inicio con título iluminado, contadores y Misión/Objeto
│   │   ├── InstitutionalPage.tsx                  # La Cámara (/la-camara) con nómina jerárquica
│   │   ├── PresentationPage.tsx                   # Presentación institucional
│   │   ├── ArticlesPage.tsx & ArticleDetailPage.tsx
│   │   ├── BlogsPage.tsx & BlogDetailPage.tsx
│   │   ├── GalleryPage.tsx
│   │   ├── SocialFeedPage.tsx                     # Feed Dual Facebook & Instagram
│   │   ├── EventsPage.tsx
│   │   ├── MembersDirectoryPage.tsx               # Directorio con Correos Socios dinámico
│   │   ├── MembershipApplyPage.tsx                # Solicitud con logo obligatorio
│   │   └── ContactPage.tsx
│   ├── partner/             # 5 Vistas del Portal Exclusivo de Socios
│   │   ├── PartnerDashboardPage.tsx
│   │   ├── PartnerResourcesPage.tsx               # Descargas de informes PDF y URLs
│   │   ├── PartnerOpportunitiesPage.tsx           # Oportunidades VIP con categorías dinámicas
│   │   ├── PartnerBenefitsPage.tsx                # Club de Beneficios
│   │   └── PartnerDirectoryPage.tsx               # Directorio B2B con Correos Socios dinámico
│   └── admin/               # 15 Vistas del CMS Administrativo
│       ├── AdminLoginPage.tsx
│       ├── AdminDashboardPage.tsx
│       ├── AdminArticlesPage.tsx
│       ├── AdminBlogsPage.tsx
│       ├── AdminGalleryPage.tsx
│       ├── AdminEventsPage.tsx
│       ├── AdminMembersPage.tsx                   # Búsqueda en backend optimizada
│       ├── AdminOpportunitiesPage.tsx
│       ├── AdminPartnerResourcesPage.tsx          # Subida dual de PDF / URL
│       ├── AdminUsersPage.tsx                     # Staff & Administradores (Exclusivo Admin)
│       ├── AdminPartnerUsersPage.tsx              # Cuentas de Socios (Admin & Secretario)
│       ├── AdminApplicationsPage.tsx
│       ├── AdminMessagesPage.tsx
│       ├── AdminInstitutionalPage.tsx             # Contenidos Institucionales
│       └── AdminSettingsPage.tsx                  # Comisión Directiva, Correos Socios, Portadas, Redes y Sede
├── services/
│   └── api.ts               # Clientes API: publicApi, partnerApi, adminApi (con búsqueda backend)
└── types/
    └── index.ts             # Modelos e interfaces TypeScript (Settings, User, Member, etc.)
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

| Rol | Email | Contraseña | Destino tras Iniciar Sesión | Alcance de Permisos |
| :--- | :--- | :--- | :--- | :--- |
| **Administrador** | `admin@cicha.com.ar` | `admin123` | CMS Total (`/admin/dashboard`) | Control total: Staff & Administradores, Cuentas de Socios, Ajustes, Portadas, Blogs, Galería, Noticias, Eventos y Socios. |
| **Secretaría** | `secretaria@cicha.com.ar` | `sec123` | CMS Operativo (`/admin/dashboard`) | Gestión operativa: Cuentas de Socios, Blogs, Galería, Noticias, Eventos, Oportunidades, Socios, Recursos de Socios y Ajustes. |
| **Empresa Socia** | `socio@cicha.com.ar` | `socio123` | Portal Exclusivo de Socios (`/portal-socios`) | Intranet: Informes de mercado, Oportunidades VIP, Club de beneficios y Directorio B2B. |
| **Visitante** | *(Sin login)* | - | Portal Público Institucional (`/`) | Acceso a todas las páginas públicas, blogs, galería, agenda, noticias, directorio y formularios. |
