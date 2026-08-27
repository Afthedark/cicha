# CICHA - Portal Web Institucional, Intranet de Socios & CMS

Plataforma digital integral para la **Cámara de Industria y Comercio Heleno Argentina (CICHA)**, miembro activo de la **EUROCAMARA Argentina** (desde mayo 2017), nodo de la red **Enterprise Europe Network (EEN)** de la Unión Europea y miembro de la **Unión de Cámaras Comerciales Extranjeras Binacionales (UCCEB)** compuesta por 32 cámaras binacionales.

> **Reconocimientos Oficiales:**
> - 🏛️ **Gobierno Argentino:** 1 de Noviembre de 1989
> - 🇬🇷 **Gobierno Griego:** 18 de Septiembre de 1998

---

## 🌟 Nuevas Características y Actualizaciones

1. **🌐 Traductor Automático Global en Tiempo Real (`GoogleTranslate.tsx`)**:
   - Traducción automática e instantánea del 100% de la web (incluyendo noticias, eventos, perfiles de socios y oportunidades comerciales cargadas dinámicamente desde MySQL).
   - Selector visual con banderas vectoriales de alta definición:
     - 🇦🇷 **Español (Argentina)**: Idioma nativo original.
     - 🇬🇷 **Ελληνικά (Grecia)**: Traducción completa al griego para contrapartes helénicas.
     - 🇬🇧 **English (Reino Unido / Internacional)**: Traducción completa al inglés para comercio exterior.
   - Eliminación total de barras superiores grises, tooltips e iframes de Google mediante CSS moderno y limpio.
   - Integrado en **Portal Público**, **Intranet de Socios** y **Panel CMS**.

2. **🛡️ Control de Acceso Basado en Roles (RBAC)**:
   - Matriz de permisos con 4 roles: `admin` (superusuario), `secretario` (gestor de contenidos), `socio` (intranet privada) y `visitante` (público general).
   - Filtro de autorización en backend (`RoleFilter.php`) con protección HTTP `401 Unauthorized` y `403 Forbidden`.

3. **🏛️ Portal Exclusivo de Socios (`/portal-socios`)**:
   - Intranet privada para empresas socias de CICHA con biblioteca de informes de mercado bilateral, guías arancelarias y legales UE-Argentina, oportunidades comerciales VIP con datos de contacto directo de contrapartes, club de beneficios (descuentos en fletes y eventos) y directorio privado B2B para networking.

4. **⚙️ Panel de Administración CMS con Menú Dinámico (`/admin`)**:
   - Módulo de **Gestión de Usuarios y Roles** (`/admin/usuarios`).
   - Módulo de **Recursos y Beneficios de Socios** (`/admin/recursos-socios`).
   - Filtrado contextual del menú según el rol del usuario autenticado.

---

## 🏗️ Arquitectura del Proyecto

El sistema está estructurado como un monorepo dividido en dos componentes principales:

```
cicha/
├── backend/                 # API REST en CodeIgniter 4 (PHP 8.2 + MySQL 8.0)
│   ├── app/                 # Controladores, Modelos, Filtros y Migraciones
│   ├── tests/               # Scripts de verificación automatizada y RBAC
│   ├── README.md            # Documentación técnica completa de la API
│   └── ...
├── frontend/                # Aplicación SPA en React + Vite + TypeScript + Tailwind CSS v4
│   ├── src/                 # Componentes, Páginas públicas, Intranet de socios y CMS
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

# 1. Ejecutar las migraciones
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

| Rol | Email | Contraseña | Destino tras Iniciar Sesión |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@cicha.com.ar` | `admin123` | CMS Total (`/admin/dashboard`) |
| **Secretaría** | `secretaria@cicha.com.ar` | `sec123` | CMS Operativo (`/admin/dashboard`) |
| **Empresa Socia** | `socio@cicha.com.ar` | `socio123` | Portal Exclusivo de Socios (`/portal-socios`) |
| **Visitante** | *(Sin login)* | - | Portal Público Institucional (`/`) |

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

- **[Documentación del Backend](file:///d:/myProjects/cicha/backend/README.md)**: Base de datos, modelos, filtros JWT, RBAC y tabla completa de endpoints.
- **[Documentación del Frontend](file:///d:/myProjects/cicha/frontend/README.md)**: Componentes, GoogleTranslate con banderas, Tailwind v4, vistas públicas, intranet de socios y CMS.
- **[Walkthrough y Reporte de Entrega](file:///C:/Users/Tito/.gemini/antigravity-ide/brain/06eb8492-f0bc-412a-bca8-87d793ebaee8/walkthrough.md)**: Resumen ejecutivo del sistema implementado.
