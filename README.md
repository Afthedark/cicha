# CICHA - Portal Web Institucional, Intranet de Socios & CMS

Plataforma digital integral para la **Cámara de Industria y Comercio Heleno Argentina (CICHA)**, miembro activo de la **EUROCAMARA Argentina** (desde mayo 2017), nodo de la red **Enterprise Europe Network (EEN)** de la Unión Europea y miembro de la **Unión de Cámaras Comerciales Extranjeras Binacionales (UCCEB)** compuesta por 32 cámaras binacionales.

> **Reconocimientos Oficiales:**
> - 🏛️ **Gobierno Argentino:** 1 de Noviembre de 1989
> - 🇬🇷 **Gobierno Griego:** 18 de Septiembre de 1998

---

## 🌟 Principales Módulos y Nuevas Características

1. **🏢 Directorio de Socios & Gestión Multicategoría (`/admin/socios`, `/socios` y `/portal-socios/directorio`)**:
   - **Asignación Múltiple en CMS (`AdminMembersPage.tsx`)**: Permite asignar una o más categorías/sectores a cada empresa socia mediante chips/badges interactivos con eliminación rápida (`X`) y menú de búsqueda.
   - **Tarjetas en 2 Columnas con "Ver más / Ver menos"**: Showcase amplio de logo a la izquierda con fondo protegido y columna derecha con badges múltiples, representante (`Rep.:`), país, rotura forzada de texto (`break-words break-all [overflow-wrap:anywhere]`) y botón dinámico **"Ver más / Ver menos"** para descripciones extensas.
   - **Modal de Detalle Completo**: Perfil ampliado con contenedor scroll vertical (`max-h-72 overflow-y-auto`), servicios y accesos de contacto directo (correo prellenado y teléfono).
   - **Visor Web Integrado (In-App Browser)**: Modal seguro para navegar el sitio web de cualquier empresa socia dentro de la plataforma con detección automática de fallback.
   - **Portal de Socios Sincronizado (`PartnerDirectoryPage.tsx`)**: Mismo diseño, tarjetas de dos columnas, modales y filtros, adaptado con la paleta **azul nocturno egeo (`#003866`/85)** y detalles dorados.

2. **🏛️ Módulo de "Decretos Oficiales" (`/admin/decretos` y `/portal-socios/decretos`)**:
   - **Administración CMS (`AdminDecreesPage.tsx`)**: Módulo independiente para `admin` y `secretario` para publicar y gestionar decretos oficiales con logo/escudo oficial (preview interactivo), selector dual entre **Subir Archivo PDF** (hasta 30MB) o **Pegar Enlace URL**, fecha de promulgación y switch de publicación.
   - **Portal de Socios (`PartnerDecreesPage.tsx`)**: Consulta exclusiva con buscador en tiempo real, insignia institucional, tarjetas con el logo/escudo destacado a la izquierda y botones de descarga de PDF o apertura de enlace web.

3. **📑 Módulo de "Actas de Socios" (`/portal-socios/actas`)**:
   - **Espacio Colaborativo Inter-Socios (`PartnerMinutesPage.tsx`)**: Permite a los socios publicar y compartir actas de asambleas, reuniones de comité o acuerdos.
   - **Subida Dual**: Soporte para cargar documentos PDF nativos o pegar enlaces directos en la nube (Google Drive, OneDrive, Dropbox).
   - **Buscador & Permisos**: Búsqueda instantánea, identificación del socio emisor con fecha/hora y permiso de eliminación exclusivo para el socio autor o administradores.

4. **📅 Cartelera Informativa de Eventos y Calendario Mensual (`EventsPage.tsx` y `EventCalendar.tsx`)**:
   - **Cartelera Informativa Solemne**: Módulo exclusivamente enfocado en la difusión de agenda bilateral y foros oficiales (sin botones de inscripción redundantes).
   - **Calendario Reutilizable**: Calendario interactivo con selector de meses/años, badges de eventos por fecha y panel de detalles; integrado en **Inicio (`HomePage.tsx`)** como tarjeta independiente de *Agenda Bilateral* y en **Eventos (`EventsPage.tsx`)** a 2 columnas.

5. **🗂️ Sidebar del CMS Reorganizado en 5 Grupos Temáticos (`AdminLayout.tsx`)**:
   - Navegación lateral optimizada y ergonómica mapeada directamente con la cabecera pública y el portal de socios:
     - **Resumen General**: Panel Principal (`/admin/dashboard`).
     - **Web Pública & Contenidos**: Portadas & Banners, Historia & Estatutos, Comisión Directiva, Noticias & Comunicados, Blogs Editoriales, Galería de Fotos, Agenda de Eventos, Directorio de Socios, Alianzas Estratégicas.
     - **Portal de Socios & Intranet**: Decretos Oficiales, Recursos & Informes, Oportunidades VIP, Club de Beneficios.
     - **Gestión & Contacto**: Solicitudes de Afiliación, Mensajes de Contacto.
     - **Sistema & Staff**: Ajustes Generales, Cuentas de Socios, Staff & Administradores.
   - Contenedor con scroll interno (`overflow-y-auto`) y sincronización total en el menú lateral móvil.

6. **✨ Header Bicapa del Portal de Socios (`PartnerLayout.tsx`)**:
   - **Franja Superior (Blanca)**: Logo oficial (`logo oficial 3.png`), badge distintivo `Portal Socios`, slogan oficial *"PUENTES QUE GENERAN OPORTUNIDADES"*, banderas vectoriales bilaterales, reconocimientos de gobiernos (1989 / 1998), sellos de EUROCAMARA y EEN, píldora de usuario con estado **"Socio Verificado"**, enlace directo a la Web Pública y botón Salir.
   - **Franja Inferior (Azul Egeo `#004b87`)**: Barra de navegación horizontal institucional con iconos y línea dorada activa para los 7 módulos del socio (*Panel Socio, Documentos & Informes, Actas, Decretos, Oportunidades VIP, Club de Beneficios, Directorio B2B*).
   - Drawer responsive para dispositivos móviles.

7. **🔘 Optimización de Headers y Botones de Acceso**:
   - **Header Móvil Público (`Navbar.tsx`)**: Ocultamiento del botón redundante "Ingreso Socios" en la barra superior móvil (`hidden sm:inline-flex`), manteniéndolo accesible al desplegar el menú móvil.
   - **Botón Dorado en Footer (`Footer.tsx`)**: Botón destacado en degradado dorado (`from-amber-400 to-amber-500`) con acceso directo a la Administración Web CMS (`/admin/login`).
   - **Limpieza de Traductor en CMS y Portal**: Retiro del botón de traducción en los headers privados de administración y socios, preservándolo activo en la Web Pública.

8. **🏛️ Vista Institucional "Presentación" Refinada (`PresentationPage.tsx`)**:
   - Layout en formato *Full-Width* enfocado en la lectura clara y solemne de la trayectoria histórica y el marco bilateral.

9. **🛡️ Aislamiento Estricto de Seguridad para Super Administradores**:
   - Protección en backend (`UsersController.php`) y frontend (`AdminUsersPage.tsx`) para impedir que administradores estándar visualicen, editen o eliminen las credenciales del Super Administrador.

10. **🏛️ Módulo "La Cámara" (`/la-camara` & `/institucional`)**:
    - Denominación oficial unificada como **"La Cámara"** en el Header y Footer con redirección automática desde `/institucional`.
    - Visualización jerárquica en 3 bloques dinámicos: *Presidencia Honoraria & Presidencia*, *Comisión Directiva* y *Comisión Revisora de Cuentas*.

11. **👥 Gestión Segmentada de Cuentas de Acceso**:
    - **Staff & Administradores (`/admin/usuarios`)**: Módulo para administrar credenciales del CMS.
    - **Cuentas de Socios (`/admin/usuarios-socios`)**: Módulo para crear accesos al Portal de Socios.
    - **Login Seguro sin Cuentas de Demostración (`/admin/login`)**.
    - **Toggle Ver/Ocultar Contraseña** y **Copiar Credenciales Inteligente con 1 Clic**.

12. **✉️ Asunto Predeterminado para Correos de Socios ("Correos Socios")**:
    - Configurado en Ajustes Generales (`/admin/configuracion`): `MENSAJE POR MEDIO DE LA PAGINA DE CICHA`.

13. **📱 Módulo de Post & Redes Sociales con Feed Dual (`/redes-sociales`)**:
    - Widgets en vivo de Facebook e Instagram oficial lado a lado en 2 columnas.

14. **📰 Módulo de Blogs & Artículos Editoriales (`/blogs` y `/admin/blogs`)**.
15. **📷 Módulo de Galería de Fotos Inteligente con Lightbox a Pantalla Completa (`/galeria` y `/admin/galeria`)**.
16. **🌐 Traductor Automático Global en Tiempo Real (`GoogleTranslate.tsx`)** (Español, Griego, Inglés en Web Pública).

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
│   ├── src/                 # Componentes, Páginas públicas (12), Intranet de socios (7) y CMS (18)
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

# 1. Ejecutar las migraciones de base de datos (18 tablas)
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
| **Administrador** | `admin@cicha.com.ar` | `admin123` | CMS Total (`/admin/dashboard`) | Control total: Staff & Administradores, Cuentas de Socios, Decretos, Ajustes, Portadas, Blogs, Galería, Noticias, Eventos y Socios. |
| **Secretaría** | `secretaria@cicha.com.ar` | `sec123` | CMS Operativo (`/admin/dashboard`) | Gestión operativa: Decretos, Cuentas de Socios, Blogs, Galería, Noticias, Eventos, Oportunidades, Socios, Recursos de Socios y Ajustes. |
| **Empresa Socia** | `socio@cicha.com.ar` | `socio123` | Portal Exclusivo de Socios (`/portal-socios`) | Intranet: Informes de mercado, Actas colaborativas, Decretos oficiales, Oportunidades VIP, Club de beneficios y Directorio B2B. |
| **Visitante** | *(Sin login)* | - | Portal Público Institucional (`/`) | Acceso a todas las páginas públicas, blogs, galería, agenda con calendario interactivo, noticias, directorio y formularios. |

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
