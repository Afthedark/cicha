# CICHA Frontend - Portal Web, Intranet de Socios & CMS

Frontend SPA reactivo desarrollado con **React 19**, **Vite 8**, **TypeScript**, **Tailwind CSS v4**, **Google Translate** con selector de banderas vectoriales y **Lucide React** para la **Cámara de Industria y Comercio Heleno Argentina (CICHA)**.

---

## 🎨 Características Visuales y Tecnologías

- **Framework**: React 19 + TypeScript + Vite 8.
- **Motor de Estilos**: **Tailwind CSS v4** (`@tailwindcss/vite` y `@theme`).
  - Paleta cromática oficial greco-argentina:
    - Azul Egeo: `#0D5EAF`
    - Azul Marino Diplomático: `#0B2545`
    - Dorado Metálico: `#D4AF37`
  - Tipografías: *Inter* para lectura corporativa y *Cinzel* para títulos solemnes institucionales.
  - Micro-animaciones, efectos de glassmorphism y diseño 100% responsivo para móviles, tablets y pantallas de escritorio.
- **🌐 Traductor Automático en Tiempo Real (`GoogleTranslate.tsx`)**:
  - Traducción automática e instantánea del 100% del portal (incluyendo datos dinámicos provenientes de MySQL).
  - Selector desplegable con banderas vectoriales SVG nítidas:
    - 🇦🇷 **Español (Argentina)**: Idioma base nativo.
    - 🇬🇷 **Ελληνικά (Grecia)**: Traducción para el ecosistema helénico.
    - 🇬🇧 **English (Reino Unido / Internacional)**: Traducción para comercio exterior.
  - Reglas en `src/index.css` que eliminan por completo las barras grises, tooltips e iframes predeterminados de Google.
  - Integrado en **Portal Público**, **Intranet de Socios** y **CMS**.
- **Iconografía**: `lucide-react`.
- **Cliente HTTP**: `axios` con interceptores para inyección automática de tokens JWT y expiración de sesiones.
- **Enrutamiento**: `react-router-dom` con protección granular por roles (`RoleRoute`).

---

## 🏛️ Estructura de Módulos y Portales

La aplicación se compone de 3 áreas principales:

```
frontend/src/
├── components/
│   ├── common/              # Modales, Badges de estado, Loaders, GoogleTranslate con banderas
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Loader.tsx
│   │   └── GoogleTranslate.tsx
│   └── layout/
│       ├── Navbar.tsx       # Cabecera pública con barra diplomática, traductor y acceso a socios
│       ├── Footer.tsx       # Pie de página institucional y enlaces
│       ├── PartnerLayout.tsx# Intranet privada exclusiva para empresas socias con traductor
│       └── AdminLayout.tsx  # CMS administrativo con menú dinámico por rol y traductor
├── context/
│   └── AuthContext.tsx      # Gestión de autenticación, JWT y helpers de rol (isAdmin, isSecretary, isSocio)
├── pages/
│   ├── public/              # 8 Vistas del Portal Público (Visitante)
│   │   ├── HomePage.tsx
│   │   ├── InstitutionalPage.tsx
│   │   ├── TradeBilateralPage.tsx
│   │   ├── ArticlesPage.tsx & ArticleDetailPage.tsx
│   │   ├── EventsPage.tsx
│   │   ├── MembersDirectoryPage.tsx
│   │   ├── MembershipApplyPage.tsx
│   │   └── ContactPage.tsx
│   ├── partner/             # 5 Vistas del Portal Exclusivo de Socios
│   │   ├── PartnerDashboardPage.tsx
│   │   ├── PartnerResourcesPage.tsx
│   │   ├── PartnerOpportunitiesPage.tsx
│   │   ├── PartnerBenefitsPage.tsx
│   │   └── PartnerDirectoryPage.tsx
│   └── admin/               # 12 Vistas del CMS Administrativo
│       ├── AdminLoginPage.tsx
│       ├── AdminDashboardPage.tsx
│       ├── AdminArticlesPage.tsx
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
│       └── AdminSettingsPage.tsx
├── services/
│   └── api.ts               # Clientes API: publicApi, partnerApi, adminApi
└── types/
    └── index.ts             # Modelos e interfaces TypeScript
```

---

## 🚀 Instalación y Ejecución

### 1. Instalar Dependencias
En la carpeta `frontend/`:

```bash
npm install
```

### 2. Variables de Entorno (Opcional)
Por defecto, el frontend se conecta a la API en `http://127.0.0.1:8080/index.php/api`. Si se requiere modificar la URL, se puede crear un archivo `.env` en `frontend/`:

```ini
VITE_API_URL=http://127.0.0.1:8080/index.php/api
```

### 3. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```

El portal estará disponible en: [http://localhost:5173/](http://localhost:5173/)

### 4. Compilación para Producción
Para verificar tipos y generar los archivos optimizados (`dist/`):

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
   - Acceso total a todos los módulos: Gestión de Usuarios, Configuración General, Contenidos Institucionales, Alianzas, Autoridades, Noticias, Eventos, Socios y Solicitudes.
2. **Secretaría (`secretaria@cicha.com.ar` / `sec123`)**:
   - Acceso a la gestión operativa de Noticias, Agenda de Eventos, Oportunidades Comerciales, Directorio de Socios, Recursos de Socios y Bandejas de Mensajes y Afiliaciones.
   - *Oculta y restringe módulos críticos como Configuración y Usuarios.*
3. **Empresa Socia (`socio@cicha.com.ar` / `socio123`)**:
   - Redirección automática a la intranet privada (`/portal-socios`).
   - Acceso a descargas de informes sectoriales, oportunidades comerciales VIP con datos de contacto directo de contrapartes, club de convenios y directorio B2B para networking.
