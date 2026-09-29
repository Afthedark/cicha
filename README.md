# CICHA - Portal Web Institucional, Intranet de Socios & CMS

Plataforma digital integral para la **Cámara de Industria y Comercio Heleno Argentina (CICHA)**, miembro activo de la **EUROCAMARA Argentina** (desde mayo 2017), nodo de la red **Enterprise Europe Network (EEN)** de la Unión Europea y miembro de la **Unión de Cámaras Comerciales Extranjeras Binacionales (UCCEB)** compuesta por 32 cámaras binacionales.

> **Reconocimientos Oficiales:**
> - 🏛️ **Gobierno Argentino:** 1 de Noviembre de 1989
> - 🇬🇷 **Gobierno Griego:** 18 de Septiembre de 1998

---

## 🌟 Principales Módulos y Nuevas Características

### 1. 🔗 Módulo de "Links de Interés" con Categorías y Soft Delete (`/links-de-interes` y `/admin/links`)
- **Página Pública (`InterestLinksPage.tsx` - `/links-de-interes`)**:
  - Directorio oficial de portales gubernamentales de Argentina y Grecia, organismos multilaterales, embajadas, aduanas y herramientas de comercio bilateral.
  - Buscador de enlaces en tiempo real y selector dinámico de categorías mediante píldoras interactivas con conteo en vivo.
  - Tarjetas institucionales con logo de la entidad, badge temático, descripción del servicio, insignia de "Destacado" y botón de acceso externo seguro (`rel="noopener noreferrer"`).
- **CMS de Administración Directa (`AdminInterestLinksPage.tsx` - `/admin/links`)**:
  - Alta, edición y organización de enlaces con asignación de categorías, orden numérico (`order_num`), switch de visibilidad y estado destacado.
  - **Borrado Lógico (*Soft Delete*)**: Los enlaces eliminados conservan su trazabilidad en base de datos mediante la marca temporal `deleted_at`, con soporte de restauración.
  - **CRUD Completo de Categorías de Links**: Modal emergente para dar de alta, renombrar y eliminar categorías (`type = 'links'`) en línea.

### 2. 📄 Estandarización Multimedia & Visor Interactivo de PDF en 5 Módulos
Estandarización universal de campos y soporte interactivo de lectura de documentos en los 5 módulos centrales:
- **Módulos Cubiertos**:
  - *Web Pública*: **Noticias & Prensa** (`articles`) y **Blogs Editoriales** (`blogs`).
  - *Portal de Socios*: **Actas & Resoluciones** (`partner_minutes`), **Decretos Oficiales** (`decrees`) y **Boletín de Noticias** (`partner_news`).
- **Campos Estandarizados (Opcionales excepto Título)**:
  - Título institucional.
  - Resumen / Bajada breve (`summary` / `description`).
  - Imagen de Portada / Tapa del Documento (`image_url` / `cover_image_url`).
  - Foto del Autor / Firmante / Persona (`author_avatar_url`).
  - Logotipo o Escudo Institucional Relacionado (`logo_url`).
  - **Modalidad de Contenido**:
    - 📝 **Solo Texto (`text`)**: Redacción directa de contenido o transcripciones.
    - 📄 **Solo PDF (`file`)**: Subida directa de archivo oficial o enlace.
    - 📦 **Ambos (`both`)**: Texto completo y documento PDF simultáneo.
    - 🔗 **Enlace Web (`url`)**: Redirección a boletines o resoluciones externas.
- **Visor Interactivo de PDF Integrado (`PdfViewerModal.tsx`)**:
  - Lectura a pantalla completa con navegación por páginas y zoom.
  - Descarga oficial directa indicando peso del archivo (`file_size`).
  - Impresión rápida y apertura en nueva pestaña.

### 3. 📑 Actas & Resoluciones Institucionales Certificadas (`/portal-socios/actas` y `/admin/actas`)
- **Espacio Oficial de Consulta**:
  - Espacio oficial de consulta y lectura de resúmenes de: Actas de asambleas, reuniones de comisión directiva y resoluciones certificadas por la Cámara, como también resúmenes de reuniones con otras entidades tales como **TEAM EUROPE**, **UCCEB**, **ECA**, etc.
- **Categorización Múltiple & Visualización Enriquecida**:
  - Soporte de múltiples categorías por acta (`categories` en JSON/array), visualización de logotipos de entidades aliadas, fotos de autoridades y visor PDF interactivo para socios.

### 4. 🏛️ "Contenido Administrable Web" y Traducción 100% Independiente (`Inicio`, `Presentación` y `La Cámara`)
- **Renombrado Intuitivo en CMS (`AdminInstitutionalSectionsPage.tsx` / `/admin/institucional`)**:
  - Módulo unificado bajo el nombre **"Contenido Administrable Web"**.
  - Pestañas organizadas por página objetivo (`page_target`):
    - **Inicio (`/`)**: Tarjetas de misión, reconocimientos y el bloque **Oportunidades Comerciales Bilaterales** (`home_oportunidades`).
    - **Presentación (`/presentacion`)**: Historia fundacional de Aristóteles Onassis (1940), Decretos Presidenciales y Marco Institucional (`presentacion.*`).
    - **La Cámara (`/la-camara`)**: Trayectoria, pilares estratégicos, comisiones y autoridades (`camara.*`).
- **Oportunidades Comerciales Bilaterales Administrables (`home_oportunidades`)**:
  - Tag superior (*"Comercio Exterior & Inversión Egea"*), Título (*"Oportunidades Comerciales Bilaterales"*) y Descripción administrables desde el CMS con soporte de traducción en 3 idiomas (Español, Griego e Inglés).
- **Edición del Texto Original en Español en Traducciones Manuales (`AdminTranslationsPage.tsx`)**:
  - El campo **Original en Español** es editable en el panel de 3 columnas (Español | Griego | Inglés).

### 5. 🎁 Módulo de "Beneficios & Convenios" con CRUD de Categorías y Buscador (`/beneficios`, `/admin/beneficios` y `/portal-socios/beneficios`)
- **Página Pública (`BenefitsPage.tsx`)**:
  - Catálogo interactivo de convenios institucionales, bonificaciones en comercio exterior, logística, servicios profesionales y hotelería con buscador en tiempo real.
- **CMS de Gestión Directa & CRUD de Categorías (`AdminBenefitsPage.tsx`)**:
  - Control de visibilidad pública o exclusiva para socios y gestor modal de categorías (`type = 'benefits'`).
- **Portal de Socios (`PartnerBenefitsPage.tsx`)**:
  - Códigos promocionales, contactos directos e instrucciones de reclamo (`how_to_claim`).

### 6. 📅 Gestión Avanzada de Eventos (Hasta 2 Fotos de Portada, Buscador de Álbumes y Link Evento)
- **Soporte Dual de Fotos Principales**: Subida de hasta **2 Fotos de Portada** (`image_url` e `image_url_2`).
- **Buscador Asíncrono de Álbumes Fotográficos Asociados (`album_id`)**: Vinculación de eventos con álbumes de la galería pública.
- **Link Evento**: Enlace directo a redes sociales o plataformas de acreditación.

### 7. 🖼️ Galería Fotográfica con Categorías Administrables en Línea (`/admin/galeria` y `/galeria`)
- **Gestión Directa de Categorías de Galería (`type = 'gallery'`)**: Modal integrado en el CMS de Álbumes.
- **Visualización Pública Optimizada (`GalleryPage.tsx`)**: Mosaico responsivo, lightbox de alta resolución y conteo dinámico de fotos.

### 8. 🤝 Módulo de "Reuniones B2B & Resultados" con Categorías/Sectores Administrables (`/reuniones-b2b`, `/portal-socios/reuniones-b2b` y `/admin/reuniones-b2b`)
- **Web Pública Optimizada (`B2BMeetingsPublicPage.tsx`)**: Píldoras de filtrado por sector comercial (`type = 'b2b'`) y fichas ejecutivas públicas.
- **Portal de Socios VIP (`PartnerB2BMeetingsPage.tsx`)**: Informe confidencial de acuerdos, contrapartes internacionales y descarga de **Dossier Oficial en PDF**.
- **CMS Admin (`AdminB2BMeetingsPage.tsx`)**: Gestión en dos pestañas (Pública y Socios) con CRUD de sectores comerciales.

### 9. 📰 Módulo de "Noticias & Prensa" con Categorías Administrables y Safe-Delete (`/noticias` y `/admin/noticias`)
- **Web Pública (`ArticlesPage.tsx` y `ArticleDetailPage.tsx`)**: Artículos con categoría dinámica, autor con avatar, logo institucional y visor PDF adjunto.
- **CMS Admin (`AdminArticlesPage.tsx`)**: Modal de categorías (`type = 'news'`), sincronización en cascada y safe-delete.

### 10. ✍️ Módulo de "Blogs & Artículos Editoriales" (`/blogs` y `/admin/blogs`)
- **Web Pública (`BlogsPage.tsx` y `BlogDetailPage.tsx`)**: Artículos de opinión y columnas de expertos con categorías dinámicas y visor PDF.
- **CMS Admin (`AdminBlogsPage.tsx`)**: Modal de categorías (`type = 'blogs'`) y selector dinámico.

### 11. 🏢 Directorio de Socios con Ficha Optimizada (`/socios`, `/portal-socios/directorio` y `/admin/socios`)
- **Grilla Pública Responsiva**: Tarjetas uniformes, datos de contacto directo, teléfono, dirección y visor web seguro.
- **CMS Multicategoría (`AdminMembersPage.tsx`)**: Asignación de múltiples rubros comerciales con badges de eliminación rápida.

### 12. 🏛️ Módulo de "Decretos Oficiales" (`/admin/decretos` y `/portal-socios/decretos`)
- **CMS Admin & Socios**: Reconocimientos oficiales de Argentina (1989) y Grecia (1998) con visor interactivo de PDF y enlaces al Boletín Oficial.

### 13. 🌐 Traducciones Manuales Bilaterales (Griego & Inglés) (`/admin/traducciones` y Web Pública)
- **Administración en 3 Columnas (`AdminTranslationsPage.tsx`)**: Gestión de textos solemnes con español editable, griego e inglés.

### 14. 📩 Módulo de Boletín de Noticias para Socios (`/admin/boletin-socios` y `/portal-socios/boletin`)
- **Exclusivo para Socios**: Comunicados privados con soporte multimedia y visor PDF interactivo.

### 15. 🗂️ Sidebar del CMS en 5 Grupos Temáticos (22 Módulos) (`AdminLayout.tsx`)
- Navegación optimizada en 5 grupos:
  - **Resumen General**: Panel Principal (`/admin/dashboard`).
  - **Web Pública & Contenidos**: Portadas & Banners, Contenido Administrable Web, Beneficios & Convenios, Comisión Directiva, Noticias & Prensa, Blogs & Artículos, Galería Fotográfica, Agenda de Eventos, Reuniones B2B & Resultados, Directorio de Socios, Alianzas Estratégicas, Links de Interés (`/admin/links`), Traducción Griego / Inglés.
  - **Portal de Socios & Intranet**: Cuentas de Socios, Decretos Oficiales, Actas Institucionales, Boletín para Socios, Documentos & Informes, Oportunidades VIP.
  - **Gestión & Contacto**: Solicitudes de Ingreso, Bandeja de Contacto.
  - **Sistema & Staff**: Ajustes Generales, Staff & Administradores.

---

## 🏗️ Arquitectura del Proyecto

```
cicha/
├── backend/                 # API REST en CodeIgniter 4 (PHP 8.2 + MySQL 8.0)
│   ├── app/                 # Controladores (Admin/Public/Partner), Modelos con Soft Delete, Filtros y Migraciones
│   ├── tests/               # Scripts de verificación automatizada y RBAC
│   ├── GUIA_DEPLOY_CPANEL_BACKEND.md # Guía paso a paso para hosting cPanel
│   ├── README.md            # Documentación técnica completa de la API
│   └── ...
├── frontend/                # Aplicación SPA en React 19 + Vite 8 + TypeScript + Tailwind CSS v4
│   ├── src/                 # Componentes, Páginas públicas (15), Intranet de socios (9) y CMS (22)
│   ├── README.md            # Documentación técnica del Frontend
│   └── ...
└── README.md                # Guía general de inicio rápido del proyecto
```

---

## ⚡ Guía de Inicio Rápido (Quickstart)

### Paso 1: Configuración de la Base de Datos
Asegúrese de tener MySQL 8.0 en ejecución con la base de datos `cicha` (usuario `root`, sin contraseña, puerto `3306`).

Desde la carpeta `backend/`:
```bash
cd backend

# 1. Ejecutar las migraciones de base de datos (tablas, columnas y enlaces de interés)
php spark migrate

# 2. Cargar datos institucionales y cuentas por rol
php spark db:seed CichaSeeder
php spark db:seed RolesAndPartnersSeeder
```

### Paso 2: Iniciar el Backend (CodeIgniter 4)
```bash
cd backend
php spark serve --port 8080
```
*La API quedará escuchando en `http://127.0.0.1:8080/index.php/api/`.*

### Paso 3: Iniciar el Frontend (React + Vite + Tailwind v4)
En otra terminal:
```bash
cd frontend
npm install
npm run dev
```
*El sitio web estará disponible en [http://localhost:5173/](http://localhost:5173/).*

---

## 👥 Roles y Cuentas de Demostración

En la pantalla de inicio de sesión ([http://localhost:5173/admin/login](http://localhost:5173/admin/login)) las credenciales se ingresan manualmente:

| Rol | Email | Contraseña | Destino tras Iniciar Sesión | Alcance de Permisos |
| :--- | :--- | :--- | :--- | :--- |
| **Administrador** | `admin@cicha.com.ar` | `admin123` | CMS Total (`/admin/dashboard`) | Control total: Staff & Administradores, Cuentas de Socios, Reuniones B2B, Beneficios, Links de Interés, Decretos, Actas, Boletín de Socios, Categorías, Traducciones (Griego/Inglés/Español), Ajustes, Portadas, Blogs, Galería, Noticias, Eventos y Socios. |
| **Secretaría** | `secretaria@cicha.com.ar` | `sec123` | CMS Operativo (`/admin/dashboard`) | Gestión operativa: Reuniones B2B, Beneficios, Links de Interés, Decretos, Actas, Boletín de Socios, Categorías, Traducciones, Cuentas de Socios, Blogs, Galería, Noticias, Eventos, Oportunidades, Socios, Recursos y Ajustes. |
| **Empresa Socia** | `socio@cicha.com.ar` | `socio123` | Portal Exclusivo de Socios (`/portal-socios`) | Intranet: **Informes B2B detallados & acuerdos**, Boletín de noticias interno, Informes de mercado, Actas colaborativas categorizadas, Decretos oficiales, Oportunidades VIP, Club de beneficios y Directorio de Socios con visor PDF integrado. |
| **Visitante** | *(Sin login)* | - | Portal Público Institucional (`/`) | Acceso a todas las páginas públicas (15), **Links de Interés con buscador y filtros**, **Beneficios y convenios**, **Eventos con links a redes y galerías vinculadas**, **Reuniones B2B públicas**, traducción en vivo (ES/EL/EN), blogs, visor PDF de noticias, agenda, directorio y formularios. |

---

## 🧪 Pruebas Automatizadas

Para validar que todos los servicios y los filtros de seguridad RBAC funcionan con 100% de éxito:

```bash
# Probar API pública, envíos de formulario y CRUD del CMS
php backend/tests/verify_all.php

# Probar matriz de roles y control de acceso (401 / 403)
php backend/tests/verify_rbac.php
```

---

## 📖 Documentación Específica

- **[Documentación Técnica del Backend](file:///d:/myProjects/cicha/backend/README.md)**
- **[Documentación Técnica del Frontend](file:///d:/myProjects/cicha/frontend/README.md)**
- **[Guía de Despliegue en cPanel](file:///d:/myProjects/cicha/backend/GUIA_DEPLOY_CPANEL_BACKEND.md)**
