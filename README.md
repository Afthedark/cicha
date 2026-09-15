# CICHA - Portal Web Institucional, Intranet de Socios & CMS

Plataforma digital integral para la **Cámara de Industria y Comercio Heleno Argentina (CICHA)**, miembro activo de la **EUROCAMARA Argentina** (desde mayo 2017), nodo de la red **Enterprise Europe Network (EEN)** de la Unión Europea y miembro de la **Unión de Cámaras Comerciales Extranjeras Binacionales (UCCEB)** compuesta por 32 cámaras binacionales.

> **Reconocimientos Oficiales:**
> - 🏛️ **Gobierno Argentino:** 1 de Noviembre de 1989
> - 🇬🇷 **Gobierno Griego:** 18 de Septiembre de 1998

---

## 🌟 Principales Módulos y Nuevas Características

1. **🌐 Traducciones Manuales Bilaterales (Griego & Inglés) (`/admin/traducciones` y Web Pública)**:
   - **Administración en 3 Columnas (`AdminTranslationsPage.tsx`)**: Módulo individual en el CMS para gestionar traducciones de los textos solemnes de la Cámara. Muestra:
     - 🇦🇷 **Español (Referencia)**: Texto base inmutable de guía.
     - 🇬🇷 **Griego Moderno (`text_el`)**: Totalmente editable con bandera griega.
     - 🇬🇧 **Inglés Internacional (`text_en`)**: Totalmente editable con bandera británica.
   - **Guardado Individual y Masivo**: Permite guardar frase por frase o actualizar el catálogo completo con *Guardar Todo*.
   - **Respaldo Estático & Carga Dinámica (`LanguageContext.tsx`)**: Diccionarios estáticos pre-cargados para evitar parpadeos (*FOUC*) y sincronización en vivo con endpoints `GET /public/translations/el` y `GET /public/translations/en`.

2. **📰 Módulo de Boletín de Noticias para Socios (`/admin/boletin-socios` y `/portal-socios/noticias`)**:
   - **Exclusivo para la Comunidad de Socios**: Canal informativo enfocado en novedades bilaterales, circulares gremiales y comunicados internos.
   - **CMS de Gestión (`AdminPartnerNewsPage.tsx`)**: Publicación con imagen de portada, título, resumen, cuerpo con formato enriquecido, selector de categorías y toggle de publicación.
   - **Portal de Socios (`PartnerNewsPage.tsx` y `PartnerNewsDetailPage.tsx`)**: Visualización tipo magazine con buscador por palabra clave, filtrado por categorías temáticas y vista de lectura con artículos relacionados.

3. **🏢 Directorio de Socios & Gestión Multicategoría (`/admin/socios`, `/socios` y `/portal-socios/directorio`)**:
   - **Nuevos Campos de Contacto Directo**: Incorporación de **Dirección (`address`)** y **Teléfono (`phone`)** visibles en las fichas del directorio.
   - **Asignación Múltiple en CMS (`AdminMembersPage.tsx`)**: Permite asignar una o más categorías/sectores a cada empresa socia mediante chips/badges interactivos con eliminación rápida (`X`) y menú de búsqueda.
   - **Tarjetas en 2 Columnas Optimizadas**: Showcase amplio de logo a la izquierda con fondo blanco protegido y columna derecha con badges múltiples, representante (`Rep.:`), país, dirección física, teléfono con marcado directo y botón de correo prellenado.
   - **Modal de Detalle Completo & Visor Web Integrado (In-App Browser)**: Perfil ampliado con scroll vertical (`max-h-72 overflow-y-auto`) y modal seguro para navegar el sitio web de cualquier empresa socia.
   - **Portal de Socios Sincronizado (`PartnerDirectoryPage.tsx`)**: Renombrado a **"Socios"** en la navegación con paleta azul nocturno egeo (`#003866`/85) y detalles dorados.

4. **🏛️ Contenidos Institucionales Administrables (`/admin/institucional`, `/presentacion` y `/la-camara`)**:
   - **Gestión Integral de Secciones**: Módulo CMS para administrar Historia, Trayectoria, Marco Estatutario y Redes Estratégicas (`institutional_sections`).
   - **Acciones Flexibles**: Agregar, editar, eliminar, activar y ocultar secciones en tiempo real.
   - **Traducción Vinculada**: Textos solemnes y pilares bilaterales sincronizados con el motor de traducción manual.

5. **🏛️ Módulo de "Decretos Oficiales" (`/admin/decretos` y `/portal-socios/decretos`)**:
   - **Administración CMS (`AdminDecreesPage.tsx`)**: Módulo independiente para `admin` y `secretario` para publicar y gestionar decretos oficiales con logo/escudo oficial (preview interactivo), selector dual entre **Subir Archivo PDF** (hasta 30MB) o **Pegar Enlace URL**, fecha de promulgación y switch de publicación.
   - **Portal de Socios (`PartnerDecreesPage.tsx`)**: Consulta exclusiva con buscador en tiempo real, insignia institucional, tarjetas con el logo/escudo destacado y botones de descarga de PDF o enlace web.

6. **📑 Módulo de "Actas de Socios" (`/portal-socios/actas`)**:
   - **Espacio Colaborativo Inter-Socios (`PartnerMinutesPage.tsx`)**: Permite a los socios publicar y compartir actas de asambleas, reuniones de comité o acuerdos.
   - **Subida Dual**: Soporte para cargar documentos PDF nativos o pegar enlaces directos en la nube (Google Drive, OneDrive, Dropbox).
   - **Buscador & Permisos**: Búsqueda instantánea, identificación del socio emisor con fecha/hora y permiso de eliminación exclusivo para el autor o administradores.

7. **📅 Cartelera Informativa de Eventos y Calendario Mensual (`EventsPage.tsx` y `EventCalendar.tsx`)**:
   - **Cartelera Informativa Solemne**: Módulo enfocado en la difusión de agenda bilateral y foros oficiales.
   - **Calendario Reutilizable**: Calendario interactivo con selector de meses/años, badges de eventos por fecha y panel de detalles; integrado en **Inicio (`HomePage.tsx`)** como tarjeta de *Agenda Bilateral* y en **Eventos (`EventsPage.tsx`)** a 2 columnas.

8. **🗂️ Sidebar del CMS Reorganizado en 5 Grupos Temáticos (`AdminLayout.tsx`)**:
   - Navegación lateral optimizada mapeada directamente con la cabecera pública y el portal de socios:
     - **Resumen General**: Panel Principal (`/admin/dashboard`).
     - **Web Pública & Contenidos**: Portadas & Banners, Historia & Estatutos, Comisión Directiva, Noticias & Prensa, Blogs & Artículos, Galería Fotográfica, Agenda de Eventos, Directorio de Socios, Alianzas Estratégicas, Traducción Griego / Inglés.
     - **Portal de Socios & Intranet**: Cuentas de Socios, Decretos Oficiales, Boletín para Socios, Documentos & Informes, Oportunidades VIP.
     - **Gestión & Contacto**: Solicitudes de Ingreso, Bandeja de Contacto.
     - **Sistema & Staff**: Ajustes Generales, Staff & Administradores.

9. **✨ Header Bicapa del Portal de Socios (`PartnerLayout.tsx`)**:
   - **Franja Superior (Blanca)**: Logo oficial (`logo oficial 3.png`), badge distintivo `Portal Socios`, slogan oficial *"PUENTES QUE GENERAN OPORTUNIDADES"*, banderas vectoriales bilaterales, reconocimientos de gobiernos (1989 / 1998), sellos de EUROCAMARA y EEN, píldora de usuario con estado **"Socio Verificado"**, enlace directo a la Web Pública y botón Salir.
   - **Franja Inferior (Azul Egeo `#004b87`)**: Barra de navegación horizontal institucional para los 8 módulos del socio (*Panel Socio, Boletín de Noticias, Documentos & Informes, Actas, Decretos, Oportunidades VIP, Club de Beneficios, Socios*).

10. **🛡️ Seguridad & Aislamiento Estricto para Super Administradores**:
    - Protección en backend (`UsersController.php`) y frontend (`AdminUsersPage.tsx`) para impedir que administradores estándar visualicen, editen o eliminen las credenciales del Super Administrador.

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
│   ├── src/                 # Componentes, Páginas públicas (12), Intranet de socios (8) y CMS (19)
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

# 1. Ejecutar las migraciones de base de datos (20 tablas)
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
| **Administrador** | `admin@cicha.com.ar` | `admin123` | CMS Total (`/admin/dashboard`) | Control total: Staff & Administradores, Cuentas de Socios, Decretos, Boletín de Socios, Traducciones (Griego/Inglés), Ajustes, Portadas, Blogs, Galería, Noticias, Eventos y Socios. |
| **Secretaría** | `secretaria@cicha.com.ar` | `sec123` | CMS Operativo (`/admin/dashboard`) | Gestión operativa: Decretos, Boletín de Socios, Traducciones, Cuentas de Socios, Blogs, Galería, Noticias, Eventos, Oportunidades, Socios, Recursos de Socios y Ajustes. |
| **Empresa Socia** | `socio@cicha.com.ar` | `socio123` | Portal Exclusivo de Socios (`/portal-socios`) | Intranet: Boletín de noticias interno, Informes de mercado, Actas colaborativas, Decretos oficiales, Oportunidades VIP, Club de beneficios y Directorio de Socios. |
| **Visitante** | *(Sin login)* | - | Portal Público Institucional (`/`) | Acceso a todas las páginas públicas, traducción en vivo (ES/EL/EN), blogs, galería, agenda con calendario interactivo, noticias, directorio y formularios. |

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

- **[Documentación del Backend](file:///d:/myProjects/cicha/backend/README.md)**: Base de datos, modelos, filtros JWT, RBAC, auto-migración y tabla completa de endpoints REST.
- **[Documentación del Frontend](file:///d:/myProjects/cicha/frontend/README.md)**: Componentes, GoogleTranslate, LanguageContext, Tailwind v4, vistas públicas, galería inteligente, blogs, intranet de socios y CMS.
- **[Guía de Deploy en cPanel](file:///d:/myProjects/cicha/backend/GUIA_DEPLOY_CPANEL_BACKEND.md)**: Manual de despliegue paso a paso sin SSH y actualización con 1 clic.
- **[Walkthrough y Reporte de Entrega](file:///C:/Users/Tito/.gemini/antigravity-ide/brain/06eb8492-f0bc-412a-bca8-87d793ebaee8/walkthrough.md)**: Resumen ejecutivo del sistema implementado.
