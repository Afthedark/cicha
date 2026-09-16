# CICHA - Portal Web Institucional, Intranet de Socios & CMS

Plataforma digital integral para la **Cámara de Industria y Comercio Heleno Argentina (CICHA)**, miembro activo de la **EUROCAMARA Argentina** (desde mayo 2017), nodo de la red **Enterprise Europe Network (EEN)** de la Unión Europea y miembro de la **Unión de Cámaras Comerciales Extranjeras Binacionales (UCCEB)** compuesta por 32 cámaras binacionales.

> **Reconocimientos Oficiales:**
> - 🏛️ **Gobierno Argentino:** 1 de Noviembre de 1989
> - 🇬🇷 **Gobierno Griego:** 18 de Septiembre de 1998

---

## 🌟 Principales Módulos y Nuevas Características

### 1. 🤝 Módulo de "Reuniones B2B & Resultados" (`/reuniones-b2b`, `/portal-socios/reuniones-b2b` y `/admin/reuniones-b2b`)
- **Diferenciación de Acceso por Nivel de Usuario**:
  - 🌐 **Web Pública (`B2BMeetingsPublicPage.tsx`)**: Versión ejecutiva y básica para visitantes con títulos, fechas, sectores, sedes, modalidades (Presencial, Híbrido, Virtual), resumen público, contadores macro (empresas participantes, reuniones 1-a-1 y acuerdos) y modal de ficha pública con invitación/CTA al Portal de Socios.
  - 🔒 **Portal de Socios (`PartnerB2BMeetingsPage.tsx`)**: Versión detallada y exclusiva con **Informe Exhaustivo de Resultados y Acuerdos Comerciales**, lista de empresas contrapartes (Grecia / UE / Cono Sur) con perfiles de interés, conclusiones estratégicas y recomendaciones, botón de **Descarga de Dossier Oficial en PDF** y canal directo de seguimiento con la Secretaría de Comercio Exterior.
  - ⚙️ **CMS Admin (`AdminB2BMeetingsPage.tsx`)**: Formulario organizado en 2 pestañas (*1. Datos Públicos* y *2. Informe Exclusivo para Socios*) con CRUD completo y control de publicación.

### 2. 📑 Categorización Dinámica de Actas de Socios (`/admin/decretos` y `/portal-socios/actas`)
- **Gestión de Categorías desde Administración de Decretos (`AdminDecreesPage.tsx`)**: Botón *"Categorías de Actas"* con modal interactivo para que Administradores y Secretaría puedan dar de alta, editar y eliminar categorías de actas (`type = 'minutes'`), tales como *Asamblea General, Comité Ejecutivo, Comisión Revisora, Acuerdos Comerciales, Resoluciones Institucionales* y *Sesiones Extraordinarias*.
- **Portal de Socios (`PartnerMinutesPage.tsx`)**: Selector dinámico de categorías al subir/compartir nuevas actas (PDF o URL), barra de filtrado por categoría horizontal y badge temático en cada tarjeta.

### 3. 🎁 Categorización Dinámica del Club de Beneficios (`/admin/recursos-socios` y `/portal-socios/beneficios`)
- **Gestión de Categorías en CMS (`AdminPartnerResourcesPage.tsx`)**: En la pestaña *Club de Convenios & Beneficios*, acceso al gestor de categorías (`type = 'benefits'`) para rubros como *Logística & Transporte, Networking Internacional, Servicios Profesionales, Comercio Exterior, Asesoría Legal & Tributaria, Hotelería & Eventos*.
- **Selector en Formulario**: Sustitución del texto libre por un `<select>` dinámico vinculado a las categorías registradas.
- **Portal de Socios (`PartnerBenefitsPage.tsx`)**: Barra de pestañas dinámicas para filtrar convenios y beneficios por sector.

### 4. 🏢 Directorio de Socios & Visualización Optimizada (`/socios`, `/portal-socios/directorio` y `/admin/socios`)
- **Truncamiento Inteligente en Tarjetas**: Aplicación de `line-clamp-3` en descripciones extensas para preservar la estética y alineación uniforme de la grilla.
- **Enlace Interactivo "Ver más..."**: En descripciones largas, el botón abre directamente el modal detallado de la empresa socia con texto íntegro, scroll formateado, representantes y datos de contacto.
- **Campos de Contacto Directo**: Dirección física (`address`), teléfono con marcado directo (`phone`), correo electrónico prellenado y visor web integrado (*In-App Browser*).
- **Asignación Multicategoría en CMS**: Selector interactivo de múltiples sectores por empresa con badges de eliminación rápida (`X`).

### 5. 🌐 Traducciones Manuales Bilaterales (Griego & Inglés) (`/admin/traducciones` y Web Pública)
- **Administración en 3 Columnas (`AdminTranslationsPage.tsx`)**: Módulo individual en el CMS para gestionar traducciones de los textos solemnes de la Cámara. Muestra:
  - 🇦🇷 **Español (Referencia)**: Texto base inmutable de guía.
  - 🇬🇷 **Griego Moderno (`text_el`)**: Totalmente editable con bandera griega.
  - 🇬🇧 **Inglés Internacional (`text_en`)**: Totalmente editable con bandera británica.
- **Acreditaciones Oficiales del Header Integradas**: Textos solemnes de acreditaciones gubernamentales (1989 / 1998), EUROCAMARA, EEN y UCCEB sincronizados en el motor multilingüe.
- **Respaldo Estático & Sincronización en Vivo (`LanguageContext.tsx`)**: Diccionarios estáticos pre-cargados para evitar parpadeos (*FOUC*) y consumo dinámico de endpoints `/public/translations/el` y `/public/translations/en`.

### 6. 📰 Módulo de Boletín de Noticias para Socios (`/admin/boletin-socios` y `/portal-socios/boletin`)
- **Exclusivo para la Comunidad de Socios**: Canal informativo enfocado en novedades bilaterales, circulares gremiales y comunicados internos.
- **CMS de Gestión (`AdminPartnerNewsPage.tsx`)**: Publicación con imagen de portada, título, resumen, cuerpo con formato enriquecido, selector de categorías y toggle de publicación.
- **Portal de Socios (`PartnerNewsPage.tsx` y `PartnerNewsDetailPage.tsx`)**: Visualización tipo magazine con buscador por palabra clave, filtrado por categorías temáticas y vista de lectura con artículos relacionados.

### 7. 🏛️ Módulo de "Decretos Oficiales" (`/admin/decretos` y `/portal-socios/decretos`)
- **Administración CMS (`AdminDecreesPage.tsx`)**: Módulo independiente para `admin` y `secretario` para publicar y gestionar decretos oficiales con logo/escudo oficial (preview interactivo), selector dual entre **Subir Archivo PDF** (hasta 30MB) o **Pegar Enlace URL**, fecha de promulgación y switch de publicación.
- **Portal de Socios (`PartnerDecreesPage.tsx`)**: Consulta exclusiva con buscador en tiempo real, insignia institucional, tarjetas con el logo/escudo destacado y botones de descarga de PDF o enlace web.

### 8. 📅 Cartelera Informativa de Eventos y Calendario Mensual (`EventsPage.tsx` y `EventCalendar.tsx`)
- **Cartelera Informativa Solemne**: Módulo enfocado en la difusión de agenda bilateral y foros oficiales.
- **Calendario Reutilizable**: Calendario interactivo con selector de meses/años, badges de eventos por fecha y panel de detalles; integrado en **Inicio (`HomePage.tsx`)** como tarjeta de *Agenda Bilateral* y en **Eventos (`EventsPage.tsx`)** a 2 columnas.

### 9. 🗂️ Sidebar del CMS Reorganizado en 5 Grupos Temáticos (`AdminLayout.tsx`)
- Navegación lateral optimizada mapeada directamente con la cabecera pública y el portal de socios:
  - **Resumen General**: Panel Principal (`/admin/dashboard`).
  - **Web Pública & Contenidos**: Portadas & Banners, Historia & Estatutos, Comisión Directiva, Noticias & Prensa, Blogs & Artículos, Galería Fotográfica, Agenda de Eventos, Reuniones B2B & Resultados, Directorio de Socios, Alianzas Estratégicas, Traducción Griego / Inglés.
  - **Portal de Socios & Intranet**: Cuentas de Socios, Decretos Oficiales, Boletín para Socios, Documentos & Informes, Oportunidades VIP.
  - **Gestión & Contacto**: Solicitudes de Ingreso, Bandeja de Contacto.
  - **Sistema & Staff**: Ajustes Generales, Staff & Administradores.

### 10. ✨ Header Bicapa del Portal de Socios (`PartnerLayout.tsx`)
- **Franja Superior (Blanca)**: Logo oficial (`logo oficial 3.png`), badge distintivo `Portal Socios`, slogan oficial *"PUENTES QUE GENERAN OPORTUNIDADES"*, banderas vectoriales bilaterales, reconocimientos de gobiernos (1989 / 1998), sellos de EUROCAMARA y EEN, píldora de usuario con estado **"Socio Verificado"**, enlace directo a la Web Pública y botón Salir.
- **Franja Inferior (Azul Egeo `#004b87`)**: Barra de navegación horizontal institucional para los 9 módulos del socio (*Panel Socio, Boletín de Noticias, Reuniones B2B, Documentos & Informes, Actas, Decretos, Oportunidades VIP, Club de Beneficios, Socios*).

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
│   ├── src/                 # Componentes, Páginas públicas (13), Intranet de socios (9) y CMS (20)
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

# 1. Ejecutar las migraciones de base de datos (21 tablas)
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
| **Administrador** | `admin@cicha.com.ar` | `admin123` | CMS Total (`/admin/dashboard`) | Control total: Staff & Administradores, Cuentas de Socios, Reuniones B2B, Decretos, Boletín de Socios, Categorías, Traducciones (Griego/Inglés), Ajustes, Portadas, Blogs, Galería, Noticias, Eventos y Socios. |
| **Secretaría** | `secretaria@cicha.com.ar` | `sec123` | CMS Operativo (`/admin/dashboard`) | Gestión operativa: Reuniones B2B, Decretos, Boletín de Socios, Categorías de Actas/Beneficios, Traducciones, Cuentas de Socios, Blogs, Galería, Noticias, Eventos, Oportunidades, Socios, Recursos y Ajustes. |
| **Empresa Socia** | `socio@cicha.com.ar` | `socio123` | Portal Exclusivo de Socios (`/portal-socios`) | Intranet: **Informes B2B detallados & acuerdos**, Boletín de noticias interno, Informes de mercado, Actas colaborativas categorizadas, Decretos oficiales, Oportunidades VIP, Club de beneficios y Directorio de Socios. |
| **Visitante** | *(Sin login)* | - | Portal Público Institucional (`/`) | Acceso a todas las páginas públicas, **Reuniones B2B públicas (resumen básico)**, traducción en vivo (ES/EL/EN), blogs, galería, agenda con calendario interactivo, noticias, directorio y formularios. |

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
