# CICHA - Portal Web Institucional, Intranet de Socios & CMS

Plataforma digital integral para la **Cámara de Industria y Comercio Heleno Argentina (CICHA)**, miembro activo de la **EUROCAMARA Argentina** (desde mayo 2017), nodo de la red **Enterprise Europe Network (EEN)** de la Unión Europea y miembro de la **Unión de Cámaras Comerciales Extranjeras Binacionales (UCCEB)** compuesta por 32 cámaras binacionales.

> **Reconocimientos Oficiales:**
> - 🏛️ **Gobierno Argentino:** 1 de Noviembre de 1989
> - 🇬🇷 **Gobierno Griego:** 18 de Septiembre de 1998

---

## 🌟 Principales Módulos y Nuevas Características

1. **📰 Módulo de Blogs & Artículos Editoriales (`/blogs` y `/admin/blogs`)**:
   - Módulo independiente para artículos de análisis, notas de opinión y publicaciones técnicas de la Cámara.
   - Administrable por roles **`admin`** y **`secretario`**: autor con cargo, tiempo de lectura, etiquetas (tags), categorías, estados (`published`, `draft`, `archived`) y destacado.
   - Vista pública para visitantes con catálogo filtrable por temática, buscador en vivo y lectura completa con artículos recomendados.

2. **📷 Módulo de Galería de Fotos Inteligente (`/galeria` y `/admin/galeria`)**:
   - Registro visual y memoria fotográfica de encuentros, misiones comerciales, foros empresariales y visitas diplomáticas.
   - Administrable por roles **`admin`** y **`secretario`**: creación de álbumes/grupos con título, descripción, fecha, categoría y subida de fotos por lotes.
   - Vista pública interactiva con selector de visualización (*Por Álbumes / Eventos* vs *Mosaico Dinámico continuo*) y visor **Lightbox a Pantalla Completa** con navegación por teclado (`←`, `→`, `Esc`) y botón de descarga.

3. **🖼️ Gestión Dinámica de Portadas / Banners del Home (`/admin/configuracion`)**:
   - Gestor visual para crear, editar, ordenar y activar/desactivar slides de cabecera con imágenes en alta resolución.
   - Selector dinámico de rutas del sistema (`/asociarse`, `/comercio-bilateral`, `/blogs`, `/galeria`, etc.) y soporte para enlaces externos.

4. **🏛️ Contenidos Institucionales 100% Administrables en CMS**:
   - Misión, Objeto estatutario, las 12 Actividades Estatutarias Reglamentarias, los 5 pilares de Comercio Exterior & EEN y los 14 Beneficios de Socios.
   - Edición en tiempo real desde el CMS de la **Sede Central** (*Julián Alvarez 1030*), **Teléfono Oficial** (*(+54 9 11) 6757.3851*) y **Correos Oficiales** (*camarahelenoargentina@gmail.com* e *info@camarahelenoargentina.org*).

5. **⚡ Endpoint de Auto-Migración de Base de Datos con 1 Clic**:
   - Endpoint HTTP seguro (`GET /api/admin/migrate?secret=...`) diseñado para hosting cPanel sin acceso a consola SSH ni terminal.

6. **🌐 Traductor Automático Global en Tiempo Real (`GoogleTranslate.tsx`)**:
   - Traducción automática e instantánea del 100% de la web (incluyendo datos dinámicos provenientes de MySQL).
   - Selector visual con banderas vectoriales: 🇦🇷 **Español**, 🇬🇷 **Ελληνικά (Griego)** y 🇬🇧 **English (Inglés)**.
   - Integrado en **Portal Público**, **Intranet de Socios** y **Panel CMS**.

7. **🛡️ Control de Acceso Basado en Roles (RBAC)**:
   - Matriz de permisos con 4 roles: `admin` (superusuario), `secretario` (gestor de contenidos y publicaciones), `socio` (intranet privada) y `visitante` (público general).
   - Filtro de autorización en backend (`RoleFilter.php`) con protección HTTP `401 Unauthorized` y `403 Forbidden`.

8. **🏛️ Portal Exclusivo de Socios (`/portal-socios`)**:
   - Intranet privada para empresas socias de CICHA con biblioteca de informes de mercado bilateral, guías arancelarias y legales UE-Argentina, oportunidades comerciales VIP con datos de contacto directo de contrapartes, club de beneficios y directorio B2B.

---

## 🏗️ Arquitectura del Proyecto

El sistema está estructurado como un monorepo dividido en dos componentes principales:

```
cicha/
├── backend/                 # API REST en CodeIgniter 4 (PHP 8.2 + MySQL 8.0)
│   ├── app/                 # Controladores (Admin/Public/Partner), Modelos, Filtros y Migraciones
│   ├── tests/               # Scripts de verificación automatizada y RBAC
│   ├── GUIA_DEPLOY_CPANEL_BACKEND.md # Guía paso a paso para hosting cPanel
│   ├── README.md            # Documentación técnica completa de la API
│   └── ...
├── frontend/                # Aplicación SPA en React 19 + Vite 8 + TypeScript + Tailwind CSS v4
│   ├── src/                 # Componentes, Páginas públicas (11), Intranet de socios (5) y CMS (14)
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

# 1. Ejecutar las migraciones de base de datos
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

En la pantalla de inicio de sesión ([http://localhost:5173/admin/login](http://localhost:5173/admin/login)) dispone de botones de acceso rápido para probar los 3 roles:

| Rol | Email | Contraseña | Destino tras Iniciar Sesión | Alcance de Permisos |
| :--- | :--- | :--- | :--- | :--- |
| **Administrador** | `admin@cicha.com.ar` | `admin123` | CMS Total (`/admin/dashboard`) | Control total: Usuarios, Roles, Ajustes, Portadas, Blogs, Galería, Noticias, Eventos y Socios. |
| **Secretaría** | `secretaria@cicha.com.ar` | `sec123` | CMS Operativo (`/admin/dashboard`) | Gestión operativa: Blogs, Galería de Fotos, Noticias, Eventos, Oportunidades, Socios y Bandejas. |
| **Empresa Socia** | `socio@cicha.com.ar` | `socio123` | Portal Exclusivo de Socios (`/portal-socios`) | Intranet: Informes de mercado, Oportunidades VIP, Club de beneficios y Directorio B2B. |
| **Visitante** | *(Sin login)* | - | Portal Público Institucional (`/`) | Acceso a todas las páginas públicas, blogs, galería, agenda, noticias y formularios. |

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
- **[Documentación del Frontend](file:///d:/myProjects/cicha/frontend/README.md)**: Componentes, GoogleTranslate, Tailwind v4, vistas públicas, galería inteligente, blogs, intranet de socios y CMS.
- **[Guía de Deploy en cPanel](file:///d:/myProjects/cicha/backend/GUIA_DEPLOY_CPANEL_BACKEND.md)**: Manual de despliegue paso a paso sin SSH y actualización con 1 clic.
- **[Walkthrough y Reporte de Entrega](file:///C:/Users/Tito/.gemini/antigravity-ide/brain/06eb8492-f0bc-412a-bca8-87d793ebaee8/walkthrough.md)**: Resumen ejecutivo del sistema implementado.
