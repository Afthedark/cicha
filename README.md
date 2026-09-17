# CICHA - Portal Web Institucional, Intranet de Socios & CMS

Plataforma digital integral para la **Cámara de Industria y Comercio Heleno Argentina (CICHA)**, miembro activo de la **EUROCAMARA Argentina** (desde mayo 2017), nodo de la red **Enterprise Europe Network (EEN)** de la Unión Europea y miembro de la **Unión de Cámaras Comerciales Extranjeras Binacionales (UCCEB)** compuesta por 32 cámaras binacionales.

> **Reconocimientos Oficiales:**
> - 🏛️ **Gobierno Argentino:** 1 de Noviembre de 1989
> - 🇬🇷 **Gobierno Griego:** 18 de Septiembre de 1998

---

## 🌟 Principales Módulos y Nuevas Características

### 1. 🎁 Nueva Sección Pública y Módulo CMS de "Beneficios" (`/beneficios`, `/admin/beneficios` y `/portal-socios/beneficios`)
- **Página Pública (`BenefitsPage.tsx`)**:
  - Catálogo interactivo de convenios institucionales, bonificaciones en comercio exterior, logística, servicios profesionales y hotelería.
  - Buscador de convenios en tiempo real y selector dinámico de categorías por rubro comercial.
  - Tarjetas con logotipo/icono de la empresa proveedora, badge temático, recuadro destacado de descuento/beneficio, vigencia y botón CTA *"Asociarme para Acceder"*.
  - Banner inferior para invitar a empresas a publicar sus propios convenios bilaterales ante la comunidad de directivos.
- **CMS de Gestión Directa (`AdminBenefitsPage.tsx`)**:
  - Módulo administrativo dedicado en `/admin/beneficios` para crear, editar, eliminar y cambiar la visibilidad (Público / Oculto) de cada convenio.
  - Modal integrado de **Gestión de Categorías de Beneficios** (`type = 'benefits'`).
- **Portal de Socios (`PartnerBenefitsPage.tsx`)**:
  - Acceso privado para socios con visualización de códigos promocionales, contactos directos e instrucciones privadas de reclamo (`how_to_claim`).

### 2. 🏛️ Gestión y Traducción 100% Independiente de Páginas Institucionales (`Inicio`, `Presentación` y `La Cámara`)
- **Separación de Secciones en Base de Datos y CMS (`page_target`)**:
  - **Inicio (`/`)**: Tarjetas de misión y objeto gestionadas con `page_target = 'home'` y claves de traducción `home.*`.
  - **Presentación (`/presentacion`)**: Historia fundacional de Aristóteles Onassis (1940), Decretos Presidenciales y Marco Institucional con `page_target = 'presentacion'` y claves `presentacion.*`.
  - **La Cámara (`/la-camara`)**: Trayectoria, pilares estratégicos, comisiones y autoridades con `page_target = 'la_camara'` y claves `camara.*`.
- **Edición del Texto Original en Español en Traducciones Manuales (`AdminTranslationsPage.tsx`)**:
  - El campo **Original en Español** es completamente editable en el panel de 3 columnas (Español | Griego | Inglés), permitiendo ajustar el texto base directamente desde este módulo y sincronizarlo en tiempo real en la base de datos.

### 3. 📅 Mejoras del Módulo de Eventos (Link Evento, 1 Foto Principal y Galería Asociada)
- **Link Evento (Redes Sociales / Enlaces Externos)**:
  - Campo renombrado de *"Enlace de Registro / Inscripción"* a **"Link Evento"**, optimizado para redirigir directamente a publicaciones de Instagram, LinkedIn, Facebook o plataformas del evento.
- **1 Foto Principal del Evento**:
  - Integración del componente `ImageUploader` en el CMS para subir y previsualizar la foto de portada del evento (JPG, PNG, WEBP), visible en la cartelera pública e Inicio.
- **Grupo de Galería de Fotos Asociado (`album_id`)**:
  - Posibilidad de vincular cualquier álbum de la galería fotográfica (`photo_albums`) al evento.
  - En la página pública (`/eventos`), botón interactivo **"Ver Galería de Fotos ({photos_count})"** que dirige al álbum correspondiente.

### 4. 🤝 Módulo de "Reuniones B2B & Resultados" (`/reuniones-b2b`, `/portal-socios/reuniones-b2b` y `/admin/reuniones-b2b`)
- **Diferenciación de Acceso por Nivel de Usuario**:
  - 🌐 **Web Pública (`B2BMeetingsPublicPage.tsx`)**: Versión ejecutiva y básica para visitantes con títulos, fechas, sectores, sedes, modalidades (Presencial, Híbrido, Virtual), resumen público, contadores macro (empresas participantes, reuniones 1-a-1 y acuerdos) y modal de ficha pública con invitación/CTA al Portal de Socios.
  - 🔒 **Portal de Socios (`PartnerB2BMeetingsPage.tsx`)**: Versión detallada y exclusiva con **Informe Exhaustivo de Resultados y Acuerdos Comerciales**, lista de empresas contrapartes (Grecia / UE / Cono Sur) con perfiles de interés, conclusiones estratégicas y recomendaciones, botón de **Descarga de Dossier Oficial en PDF** y canal directo de seguimiento con la Secretaría de Comercio Exterior.
  - ⚙️ **CMS Admin (`AdminB2BMeetingsPage.tsx`)**: Formulario organizado en 2 pestañas (*1. Datos Públicos* y *2. Informe Exclusivo para Socios*) con CRUD completo y control de publicación.

### 5. 📑 Categorización Dinámica de Actas de Socios (`/admin/decretos` y `/portal-socios/actas`)
- **Gestión de Categorías desde Administración de Decretos (`AdminDecreesPage.tsx`)**: Botón *"Categorías de Actas"* con modal interactivo para que Administradores y Secretaría puedan dar de alta, editar y eliminar categorías de actas (`type = 'minutes'`), tales como *Asamblea General, Comité Ejecutivo, Comisión Revisora, Acuerdos Comerciales, Resoluciones Institucionales* y *Sesiones Extraordinarias*.
- **Portal de Socios (`PartnerMinutesPage.tsx`)**: Selector dinámico de categorías al subir/compartir nuevas actas (PDF o URL), barra de filtrado por categoría horizontal y badge temático en cada tarjeta.

### 6. 🏢 Directorio de Socios & Visualización Optimizada (`/socios`, `/portal-socios/directorio` y `/admin/socios`)
- **Truncamiento Inteligente en Tarjetas**: Aplicación de `line-clamp-3` en descripciones extensas para preservar la estética y alineación uniforme de la grilla.
- **Enlace Interactivo "Ver más..."**: En descripciones largas, el botón abre directamente el modal detallado de la empresa socia con texto íntegro, scroll formateado, representantes y datos de contacto.
- **Campos de Contacto Directo**: Dirección física (`address`), teléfono con marcado directo (`phone`), correo electrónico prellenado y visor web integrado (*In-App Browser*).
- **Asignación Multicategoría en CMS**: Selector interactivo de múltiples sectores por empresa con badges de eliminación rápida (`X`).

### 7. 🌐 Traducciones Manuales Bilaterales (Griego & Inglés) (`/admin/traducciones` y Web Pública)
- **Administración en 3 Columnas (`AdminTranslationsPage.tsx`)**: Módulo individual en el CMS para gestionar traducciones de los textos solemnes de la Cámara. Muestra:
  - 🇦🇷 **Español (Editable)**: Texto original modificable directamente.
  - 🇬🇷 **Griego Moderno (`text_el`)**: Totalmente editable con bandera griega.
  - 🇬🇧 **Inglés Internacional (`text_en`)**: Totalmente editable con bandera británica.
- **Acreditaciones Oficiales del Header Integradas**: Textos solemnes de acreditaciones gubernamentales (1989 / 1998), EUROCAMARA, EEN y UCCEB sincronizados en el motor multilingüe.
- **Respaldo Estático & Sincronización en Vivo (`LanguageContext.tsx`)**: Diccionarios estáticos pre-cargados para evitar parpadeos (*FOUC*) y consumo dinámico de endpoints `/public/translations/el` y `/public/translations/en`.

### 8. 📰 Módulo de Boletín de Noticias para Socios (`/admin/boletin-socios` y `/portal-socios/boletin`)
- **Exclusivo para la Comunidad de Socios**: Canal informativo enfocado en novedades bilaterales, circulares gremiales y comunicados internos.
- **CMS de Gestión (`AdminPartnerNewsPage.tsx`)**: Publicación con imagen de portada, título, resumen, cuerpo con formato enriquecido, selector de categorías y toggle de publicación.
- **Portal de Socios (`PartnerNewsPage.tsx` y `PartnerNewsDetailPage.tsx`)**: Visualización tipo magazine con buscador por palabra clave, filtrado por categorías temáticas y vista de lectura con artículos relacionados.

### 9. 🏛️ Módulo de "Decretos Oficiales" (`/admin/decretos` y `/portal-socios/decretos`)
- **Administración CMS (`AdminDecreesPage.tsx`)**: Módulo independiente para `admin` y `secretario` para publicar y gestionar decretos oficiales con logo/escudo oficial (preview interactivo), selector dual entre **Subir Archivo PDF** (hasta 30MB) o **Pegar Enlace URL**, fecha de promulgación y switch de publicación.
- **Portal de Socios (`PartnerDecreesPage.tsx`)**: Consulta exclusiva con buscador en tiempo real, insignia institucional, tarjetas con el logo/escudo destacado y botones de descarga de PDF o enlace web.

### 10. 🗂️ Sidebar del CMS Reorganizado en 5 Grupos Temáticos (`AdminLayout.tsx`)
- Navegación lateral optimizada mapeada directamente con la cabecera pública y el portal de socios:
  - **Resumen General**: Panel Principal (`/admin/dashboard`).
  - **Web Pública & Contenidos**: Portadas & Banners, Historia & Estatutos, Comisión Directiva, Noticias & Prensa, Blogs & Artículos, Galería Fotográfica, Agenda de Eventos, Reuniones B2B & Resultados, Club de Beneficios, Directorio de Socios, Alianzas Estratégicas, Traducción Griego / Inglés.
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
