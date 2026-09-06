# CICHA - Portal Web Institucional, Intranet de Socios & CMS

Plataforma digital integral para la **Cámara de Industria y Comercio Heleno Argentina (CICHA)**, miembro activo de la **EUROCAMARA Argentina** (desde mayo 2017), nodo de la red **Enterprise Europe Network (EEN)** de la Unión Europea y miembro de la **Unión de Cámaras Comerciales Extranjeras Binacionales (UCCEB)** compuesta por 32 cámaras binacionales.

> **Reconocimientos Oficiales:**
> - 🏛️ **Gobierno Argentino:** 1 de Noviembre de 1989
> - 🇬🇷 **Gobierno Griego:** 18 de Septiembre de 1998

---

## 🌟 Principales Módulos y Nuevas Características

1. **👥 Gestión Segmentada y Especializada de Cuentas de Acceso**:
   - **Staff & Administradores (`/admin/usuarios`)**: Módulo exclusivo para el rol **`admin`** para crear y gestionar credenciales de administradores y secretarios del CMS.
   - **Cuentas de Socios (`/admin/usuarios-socios`)**: Módulo administrable por **`admin`** y **`secretario`** para registrar cuentas de acceso directo al Portal de Socios.
   - **Copiar Credenciales con 1 Clic**: Botón inteligente que detecta la URL actual del frontend (`/admin/login`) y copia al portapapeles el Nombre, Usuario (Email), Contraseña y Enlace de acceso en formato listo para compartir.
   - **Mostrar / Ocultar Contraseña**: Toggle visual interactivo (`Eye` / `EyeOff`) en los formularios de creación y edición.

2. **✉️ Asunto Predeterminado para Correos de Socios ("Correos Socios")**:
   - Sección administrable en **Configuración & Gestión** (`/admin/configuracion`): **"Correos Socios: Asunto & Mensaje Predeterminado"** (`member_email_subject` y `member_email_body`).
   - Asunto predefinido: `MENSAJE POR MEDIO DE LA PAGINA DE CICHA`.
   - Aplicado de forma automática al presionar el correo de cualquier socio en **Socios Web Pública (`/socios`)** y en el **Directorio B2B Privado (`/portal-socios/directorio`)**.
   - Administrable por roles **`admin`** y **`secretario`**.

3. **📚 Biblioteca de Socios con Subida Dual (PDF y URL Externa)**:
   - Soporte para subida directa de archivos PDF/documentos al servidor y/o registro de enlaces externos para normativas, acuerdos comerciales e informes bilaterales.

4. **🏷️ Categorías Dinámicas y Sincronizadas en el Portal de Socios**:
   - Filtros por sector y rubro en *Documentos & Informes*, *Oportunidades VIP*, *Club de Beneficios* y *Directorio B2B* conectados en tiempo real con el módulo **Sectores & Categorías** del CMS.

5. **🔍 Búsqueda en Base de Datos a Nivel de Backend**:
   - Endpoint optimizado `GET /api/admin/members?search=...` con búsqueda SQL `LIKE` sobre nombre de empresa, sector, representante y país.

6. **📱 Módulo de Post & Redes Sociales con Feed Dual (`/redes-sociales`)**:
   - Pestaña de acceso directo en la barra de navegación del Header.
   - **Feed Dual en 2 Columnas (Lado a Lado)**: Facebook Oficial embebido e Instagram Oficial con enlace directo a `@camarahelenoargentina`.

7. **📰 Módulo de Blogs & Artículos Editoriales (`/blogs` y `/admin/blogs`)**:
   - Módulo independiente para artículos de análisis, notas de opinión y publicaciones técnicas de la Cámara.
   - Administrable por **`admin`** y **`secretario`**: autor, tiempo de lectura, tags, categorías, estados (`published`, `draft`, `archived`) y destacado.

8. **📷 Módulo de Galería de Fotos Inteligente (`/galeria` y `/admin/galeria`)**:
   - Registro visual de encuentros y misiones con subida por lotes.
   - Visor **Lightbox a Pantalla Completa** con navegación por teclado (`←`, `→`, `Esc`) y descarga en alta calidad.

9. **🌐 Ecosistema de Redes Sociales Administrables & Footer Centralizado**:
   - Gestión en CMS (`/admin/configuracion`): soporte para LinkedIn, Instagram, Facebook, X (Twitter), YouTube y **TikTok** oficial.
   - Pie de página institucional ([`Footer.tsx`](file:///d:/myProjects/cicha/frontend/src/components/layout/Footer.tsx)) con botones glassmorphism y resplandor celeste egeo (`#00AEEF`).

10. **🏛️ Inicio Renovado con Alta Estética e Identidad Institucional**:
    - Título institucional en azul diplomático con animación de entrada (`animate-zoom-center`).
    - Trayectoria actualizada a **`+38`** años con contadores animados cíclicos (`CounterDisplay`).
    - Tarjetas de cristal dedicadas para **MISIÓN** y **OBJETO** de la Cámara.

11. **📝 Solicitud de Afiliación con Logo Obligatorio (`/asociarse`)**:
    - Requisito obligatorio de subida de logo/marca para personas jurídicas y físicas, validado en frontend y backend.

12. **🖼️ Portadas / Banners Dinámicos del Home (`/admin/configuracion`)**:
    - Gestor visual para crear, editar, ordenar y activar/desactivar portadas con enlaces internos y externos.

13. **🌐 Traductor Automático Global en Tiempo Real (`GoogleTranslate.tsx`)**:
    - Traducción automática del 100% de la web con banderas vectoriales: 🇦🇷 **Español**, 🇬🇷 **Ελληνικά (Griego)** y 🇬🇧 **English (Inglés)**.

14. **🛡️ Control de Acceso Basado en Roles (RBAC)**:
    - Matriz de permisos con roles: `admin` (superusuario), `secretario` (gestor de contenidos y cuentas de socios), `socio` (intranet privada) y `visitante` (público general).

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
│   ├── src/                 # Componentes, Páginas públicas (12), Intranet de socios (5) y CMS (15)
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
| **Administrador** | `admin@cicha.com.ar` | `admin123` | CMS Total (`/admin/dashboard`) | Control total: Staff & Administradores, Cuentas de Socios, Ajustes, Portadas, Blogs, Galería, Noticias, Eventos y Socios. |
| **Secretaría** | `secretaria@cicha.com.ar` | `sec123` | CMS Operativo (`/admin/dashboard`) | Gestión operativa: Cuentas de Socios, Blogs, Galería, Noticias, Eventos, Oportunidades, Socios, Recursos de Socios y Ajustes. |
| **Empresa Socia** | `socio@cicha.com.ar` | `socio123` | Portal Exclusivo de Socios (`/portal-socios`) | Intranet: Informes de mercado, Oportunidades VIP, Club de beneficios y Directorio B2B. |
| **Visitante** | *(Sin login)* | - | Portal Público Institucional (`/`) | Acceso a todas las páginas públicas, blogs, galería, agenda, noticias, directorio y formularios. |

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
