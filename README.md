# CICHA - Portal Web Institucional, Intranet de Socios & CMS

Plataforma digital integral para la **Cámara de Industria y Comercio Heleno Argentina (CICHA)**, miembro activo de la **EUROCAMARA Argentina** (desde mayo 2017), nodo de la red **Enterprise Europe Network (EEN)** de la Unión Europea y miembro de la **Unión de Cámaras Comerciales Extranjeras Binacionales (UCCEB)** compuesta por 32 cámaras binacionales.

> **Reconocimientos Oficiales:**
> - 🏛️ **Gobierno Argentino:** 1 de Noviembre de 1989
> - 🇬🇷 **Gobierno Griego:** 18 de Septiembre de 1998

---

## 🌟 Principales Módulos y Nuevas Características

### 1. 🏛️ "Contenido Administrable Web" y Traducción 100% Independiente (`Inicio`, `Presentación` y `La Cámara`)
- **Renombrado Intuitivo en CMS (`AdminInstitutionalSectionsPage.tsx` / `/admin/institucional`)**:
  - Módulo unificado bajo el nombre **"Contenido Administrable Web"** (reemplazando denominaciones anteriores).
  - Pestañas organizadas por página objetivo (`page_target`):
    - **Inicio (`/`)**: Tarjetas de misión, reconocimientos y el bloque **Oportunidades Comerciales Bilaterales** (`home_oportunidades`).
    - **Presentación (`/presentacion`)**: Historia fundacional de Aristóteles Onassis (1940), Decretos Presidenciales y Marco Institucional (`presentacion.*`).
    - **La Cámara (`/la-camara`)**: Trayectoria, pilares estratégicos, comisiones y autoridades (`camara.*`).
- **Oportunidades Comerciales Bilaterales Administrables (`home_oportunidades`)**:
  - Tag superior (*"Comercio Exterior & Inversión Egea"*), Título (*"Oportunidades Comerciales Bilaterales"*) y Descripción administrables desde el CMS.
  - El botón CTA *"Asociarse"* permanece fijo vinculando a `/asociarse`.
  - Soporte integrado de traducción en 3 idiomas (Español, Griego e Inglés) bajo las claves `home.opp_tag`, `home.opp_title` y `home.opp_subtitle`.
- **Edición del Texto Original en Español en Traducciones Manuales (`AdminTranslationsPage.tsx`)**:
  - El campo **Original en Español** es editable en el panel de 3 columnas (Español | Griego | Inglés), permitiendo sincronizar textos solemnes directamente en base de datos.

### 2. 🎁 Módulo de "Beneficios & Convenios" con CRUD de Categorías y Buscador (`/beneficios`, `/admin/beneficios` y `/portal-socios/beneficios`)
- **Página Pública (`BenefitsPage.tsx`)**:
  - Catálogo interactivo de convenios institucionales, bonificaciones en comercio exterior, logística, servicios profesionales y hotelería.
  - Buscador de convenios en tiempo real y selector dinámico de categorías por rubro comercial.
  - Tarjetas con logotipo/icono de la empresa proveedora, badge temático, recuadro destacado de descuento/beneficio, vigencia y botón CTA *"Asociarme para Acceder"*.
- **CMS de Gestión Directa & CRUD de Categorías (`AdminBenefitsPage.tsx`)**:
  - Módulo administrativo dedicado en `/admin/beneficios` con control de visibilidad (Público / Oculto).
  - **CRUD Completo de Categorías de Beneficios**: Modal integrado para crear, editar y eliminar categorías (`type = 'benefits'`) con actualización inmediata.
  - **Buscador de Categorías en Formulario**: Filtro en tiempo real para seleccionar rápidamente categorías al registrar o modificar un beneficio.
- **Portal de Socios (`PartnerBenefitsPage.tsx`)**:
  - Acceso privado para socios con visualización de códigos promocionales, contactos directos e instrucciones de reclamo (`how_to_claim`).

### 3. 📅 Gestión Avanzada de Eventos (Hasta 2 Fotos de Portada, Buscador de Álbumes y Link Evento)
- **Soporte Dual de Fotos Principales**:
  - Posibilidad de subir hasta **2 Fotos de Portada / Principales** (`image_url` e `image_url_2`) mediante componentes dedicados `ImageUploader` con previsualización en miniatura.
- **Buscador Asíncrono de Álbumes Fotográficos Asociados (`album_id`)**:
  - Búsqueda en tiempo real desde el backend para vincular cualquier álbum de fotos a un evento, facilitando la selección en catálogos extensos.
  - En la página pública (`/eventos`), botón interactivo **"Ver Galería de Fotos ({photos_count})"** que redirige fluidamente al álbum y enfoca el mosaico de imágenes.
- **Link Evento (Redes Sociales / Enlaces Externos)**:
  - Enlace directo a publicaciones de Instagram, LinkedIn, Facebook o plataformas de inscripción.

### 4. 🖼️ Galería Fotográfica con Categorías Administrables en Línea (`/admin/galeria` y `/galeria`)
- **Gestión Directa de Categorías de Galería (`type = 'gallery'`)**:
  - Modal integrado dentro del mismo CMS de Álbumes para dar de alta, editar y eliminar categorías temáticas sin salir de la pantalla de gestión.
  - Selector dinámico de categorías al crear o editar álbumes.
- **Visualización Pública Optimizada (`GalleryPage.tsx`)**:
  - Mosaico responsivo con selector de categorías, visualización de álbumes, visor lightbox de alta resolución y conteo exacto de fotos.

### 5. 🤝 Módulo de "Reuniones B2B & Resultados" (`/reuniones-b2b`, `/portal-socios/reuniones-b2b` y `/admin/reuniones-b2b`)
- **Web Pública Optimizada (`B2BMeetingsPublicPage.tsx`)**:
  - Presentación ejecutiva y limpia, sin contadores fijos redundantes en la cabecera.
  - Filtros por sector, buscador en vivo, tarjetas con modalidad (Presencial, Híbrido, Virtual), resumen público y ficha informativa con invitación al Portal de Socios.
- **Portal de Socios VIP (`PartnerB2BMeetingsPage.tsx`)**:
  - Acceso confidencial al **Informe Exhaustivo de Resultados y Acuerdos Comerciales**, listado de empresas contrapartes (Grecia / UE / Cono Sur), conclusiones estratégicas, recomendaciones y descarga directa de **Dossier Oficial en PDF**.
- **CMS Admin (`AdminB2BMeetingsPage.tsx`)**: Formulario organizado en 2 pestañas (*1. Datos Públicos* y *2. Informe Exclusivo para Socios*) con CRUD completo.

### 6. 🏢 Directorio de Socios con Visualización y Ficha Mejorada (`/socios`, `/portal-socios/directorio` y `/admin/socios`)
- **Diseño Armónico en Grilla Pública**:
  - Tarjetas con altura uniforme, soporte multilogo, truncamiento inteligente de descripciones (`line-clamp-3`) y botón interactivo *"Ver más..."*.
  - Modal detallado de empresa socia con texto completo, autoridades, teléfono directo (`phone`), dirección (`address`) y visor web seguro.
- **CMS de Gestión Multicategoría (`AdminMembersPage.tsx`)**:
  - Selector de múltiples sectores por empresa con badges de remoción rápida (`X`) y control de orden jerárquico (`order_num`).

### 7. 📑 Categorización Dinámica de Actas de Socios (`/admin/decretos` y `/portal-socios/actas`)
- **Gestión de Categorías desde Administración de Decretos (`AdminDecreesPage.tsx`)**: Botón *"Categorías de Actas"* con modal interactivo para dar de alta, editar y eliminar categorías de actas (`type = 'minutes'`).
- **Portal de Socios (`PartnerMinutesPage.tsx`)**: Selector dinámico de categorías al subir/compartir nuevas actas (PDF o URL), barra de filtrado por categoría horizontal y badge temático.

### 8. 🌐 Traducciones Manuales Bilaterales (Griego & Inglés) (`/admin/traducciones` y Web Pública)
- **Administración en 3 Columnas (`AdminTranslationsPage.tsx`)**: Módulo individual en el CMS para gestionar traducciones de los textos solemnes de la Cámara (Español editable, Griego `text_el`, Inglés `text_en`).
- **Sincronización con Secciones Institucionales**: Claves de Inicio (`home.*` incluyendo `home.opp_*`), Presentación (`presentacion.*`), La Cámara (`camara.*`) y Acreditaciones Oficiales del Header.

### 9. 📰 Módulo de Boletín de Noticias para Socios (`/admin/boletin-socios` y `/portal-socios/boletin`)
- **Exclusivo para la Comunidad de Socios**: Novedades bilaterales, circulares gremiales y comunicados internos con soporte multimedia.

### 10. 🏛️ Módulo de "Decretos Oficiales" (`/admin/decretos` y `/portal-socios/decretos`)
- **Administración CMS**: Carga dual de PDF (hasta 30MB) o URL externa, escudo/logo oficial y fecha de promulgación.

### 11. 🗂️ Sidebar del CMS Reorganizado en 5 Grupos Temáticos (`AdminLayout.tsx`)
- Navegación optimizada en 5 grupos:
  - **Resumen General**: Panel Principal (`/admin/dashboard`).
  - **Web Pública & Contenidos**: Portadas & Banners, Contenido Administrable Web, Beneficios & Convenios, Comisión Directiva, Noticias & Prensa, Blogs & Artículos, Galería Fotográfica, Agenda de Eventos, Reuniones B2B & Resultados, Directorio de Socios, Alianzas Estratégicas, Traducción Griego / Inglés.
  - **Portal de Socios & Intranet**: Cuentas de Socios, Decretos Oficiales, Boletín para Socios, Documentos & Informes, Oportunidades VIP.
  - **Gestión & Contacto**: Solicitudes de Ingreso, Bandeja de Contacto.
  - **Sistema & Staff**: Ajustes Generales, Staff & Administradores.

---

## 🏗️ Arquitectura del Proyecto

```
cicha/
├── backend/                 # API REST en CodeIgniter 4 (PHP 8.2 + MySQL 8.0)
│   ├── app/                 # Controladores (Admin/Public/Partner), Modelos, Filtros y Migraciones
│   ├── tests/               # Scripts de verificación automatizada y RBAC
│   ├── GUIA_DEPLOY_CPANEL_BACKEND.md # Guía paso a paso para hosting cPanel
│   ├── README.md            # Documentación técnica completa de la API
│   └── ...
├── frontend/                # Aplicación SPA en React 19 + Vite 8 + TypeScript + Tailwind CSS v4
│   ├── src/                 # Componentes, Páginas públicas (14), Intranet de socios (9) y CMS (21)
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

# 1. Ejecutar las migraciones de base de datos (tablas y columnas actualizadas)
php spark migrate

# 2. Cargar datos institucionales y cuentas por rol
php spark db:seed CichaSeeder
php spark db:seed RolesAndPartnersSeeder
```

### Paso 2: Iniciar el Backend (CodeIgniter 4)
```bash
cd backend
php -S 127.0.0.1:8080 -t public
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
| **Administrador** | `admin@cicha.com.ar` | `admin123` | CMS Total (`/admin/dashboard`) | Control total: Staff & Administradores, Cuentas de Socios, Reuniones B2B, Beneficios, Decretos, Boletín de Socios, Categorías, Traducciones (Griego/Inglés/Español), Ajustes, Portadas, Blogs, Galería, Noticias, Eventos y Socios. |
| **Secretaría** | `secretaria@cicha.com.ar` | `sec123` | CMS Operativo (`/admin/dashboard`) | Gestión operativa: Reuniones B2B, Beneficios, Decretos, Boletín de Socios, Categorías de Actas/Beneficios, Traducciones, Cuentas de Socios, Blogs, Galería, Noticias, Eventos, Oportunidades, Socios, Recursos y Ajustes. |
| **Empresa Socia** | `socio@cicha.com.ar` | `socio123` | Portal Exclusivo de Socios (`/portal-socios`) | Intranet: **Informes B2B detallados & acuerdos**, Boletín de noticias interno, Informes de mercado, Actas colaborativas categorizadas, Decretos oficiales, Oportunidades VIP, Club de beneficios y Directorio de Socios. |
| **Visitante** | *(Sin login)* | - | Portal Público Institucional (`/`) | Acceso a todas las páginas públicas (14), **Beneficios y convenios**, **Eventos con links a redes y galerías vinculadas**, **Reuniones B2B públicas**, traducción en vivo (ES/EL/EN), blogs, galería, agenda con calendario interactivo, noticias, directorio y formularios. |

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
