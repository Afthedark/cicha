# CICHA Backend - REST API & CMS Engine

Backend RESTful y motor de gestión de contenidos desarrollado con **CodeIgniter 4**, autenticación **JWT** y control de acceso basado en roles (**RBAC**) para la **Cámara de Industria y Comercio Heleno Argentina (CICHA)**.

---

## 📋 Requisitos del Sistema

- **PHP**: Versión `8.1` o superior (probado y compatible con PHP 8.2 en entornos locales y cPanel FastCGI).
- **Extensiones PHP Requeridas**:
  - `intl` (habilitada en `php.ini` con `extension=intl`)
  - `zip` (habilitada en `php.ini` con `extension=zip`)
  - `mysqli` / `pdo_mysql`
  - `openssl`
  - `mbstring`
  - `curl`
- **Base de Datos**: MySQL `8.0` / MariaDB `10.4+` en puerto `3306`.
- **Gestor de Paquetes**: Composer `2.0+`.

---

## 🛠️ Instalación y Configuración

### 1. Configuración de Base de Datos y Entorno
El archivo `.env` en la raíz de `backend/` tiene configuradas las siguientes variables:

```ini
CI_ENVIRONMENT = development

app.baseURL = 'http://127.0.0.1:8080/index.php/api/'
app.forceGlobalSecureRequests = false

database.default.hostname = 127.0.0.1
database.default.database = cicha
database.default.username = root
database.default.password = 
database.default.DBDriver = MySQLi
database.default.DBPrefix = 
database.default.port = 3306
```

### 2. Ejecutar Migraciones de Base de Datos
Crea todas las tablas estructurales (21 tablas principales):

```bash
php spark migrate
```

Tablas generadas en la base de datos:
- `users`: Usuarios, roles (`admin`, `secretario`, `socio`) y vinculación a socios.
- `settings`: Configuración institucional, contactos, teléfonos, sede, redes sociales y metadatos SEO.
- `institutional_sections`: Misión, Objeto estatutario, Historia y reconocimientos diplomáticos.
- `authorities`: Comisión Directiva, Comisión Revisora y autoridades de la Cámara.
- `alliances`: Redes estratégicas (EUROCAMARA, EEN Unión Europea, UCCEB, Embajada).
- `categories`: Taxonomía para noticias, eventos, rubros de socios, oportunidades comerciales, actas (`minutes`) y beneficios (`benefits`).
- `articles`: Noticias, prensa y comunicados institucionales.
- `blogs`: Módulo editorial de artículos de análisis, opinión y notas técnicas.
- `photo_albums`: Álbumes y grupos temáticos de la galería fotográfica.
- `gallery_photos`: Fotografías individuales vinculadas a los álbumes con eliminación en cascada.
- `banners`: Portadas y slides dinámicos del Home con selector de rutas.
- `events`: Agenda de foros, webinars y rondas de negocios oficiales.
- `b2b_meetings`: **Reuniones B2B & Resultados (campos públicos y confidenciales de socios con informes de acuerdos y dossiers PDF)**.
- `members`: Directorio de empresas socias (soporta múltiples categorías/sectores, campos `address`, `phone` y orden `order_num`).
- `commercial_opportunities`: Demandas y ofertas bilaterales Grecia-Argentina.
- `partner_resources`: Biblioteca de informes sectoriales y guías con control de descargas (PDF / URL).
- `partner_minutes`: Actas institucionales y resoluciones colaborativas entre socios categorizadas (PDF / URL).
- `partner_news`: **Boletín informativo y noticias exclusivas para la comunidad de socios**.
- `decrees`: Decretos oficiales y resoluciones gubernamentales administrables (PDF / URL).
- `greek_translations`: **Traducciones manuales de textos solemnes y acreditaciones a Griego (`text_el`) e Inglés (`text_en`) con referencia en Español (`original_es`)**.
- `partner_benefits`: Convenios corporativos y club de beneficios para socios categorizados.
- `membership_applications`: Bandeja de solicitudes de afiliación con gestión de estados.
- `contact_messages`: Bandeja de mensajes de contacto y consultas.

### 3. Auto-Migración con 1 Clic para Producción (Sin SSH)
Para entornos de hosting cPanel sin consola de comandos:
- **Endpoint**: `GET /api/admin/migrate?secret=cicha_migration_secret_key_2026`
- Ejecuta automáticamente todas las migraciones pendientes sin afectar los datos existentes de usuarios ni socios.

### 4. Poblar la Base de Datos con Seeders
Inserta datos institucionales fidedignos, noticias iniciales, empresas socias y cuentas de acceso por rol:

```bash
php spark db:seed CichaSeeder
php spark db:seed RolesAndPartnersSeeder
```

---

## 🔐 Seguridad y Control de Acceso (RBAC)

La API cuenta con una arquitectura de seguridad por capas:
- **`CorsFilter.php`**: Permite peticiones seguras de orígenes cruzados (CORS) con soporte para preflight `OPTIONS` y cabeceras duales (`Authorization` y `X-Authorization`).
- **`JwtAuthFilter.php`**: Valida y decodifica el token Bearer mediante la librería `firebase/php-jwt`.
- **`RoleFilter.php`**: Middleware que verifica que el rol del usuario (`admin`, `secretario`, `socio`) tenga autorización para ejecutar la acción solicitada; de lo contrario, responde con HTTP `403 Forbidden`.
- **Aislamiento de Super Administrador (`UsersController.php`)**: Regla de seguridad estricta para impedir que administradores estándar visualicen, editen o eliminen las credenciales del Super Administrador.

### Cuentas de Acceso Preconfiguradas:
| Rol | Email | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **`admin`** | `admin@cicha.com.ar` | `admin123` | Control total: Staff (`admin`, `secretario`), Reuniones B2B, Decretos, Boletín Socios, Traducciones (Griego/Inglés), Categorías, Cuentas de Socios (`socio`), Ajustes, Portadas, Blogs, Galería, Noticias, Eventos, Socios y Portal de Socios. |
| **`secretario`** | `secretaria@cicha.com.ar` | `sec123` | Gestión de contenidos: Reuniones B2B, Decretos, Boletín Socios, Categorías de Actas/Beneficios, Traducciones, Blogs, Galería de Fotos, Noticias, Eventos, Oportunidades, Socios, Recursos (PDFs/URLs), Bandejas y **Cuentas de Socios (`role=socio`)**. |
| **`socio`** | `socio@cicha.com.ar` | `socio123` | Intranet de socios: **Informes B2B detallados & acuerdos**, **Boletín de noticias exclusivo**, Biblioteca de recursos, **Actas colaborativas categorizadas**, **Decretos oficiales**, oportunidades VIP, club de beneficios y directorio de socios. |

---

## 📡 Referencia de Endpoints REST

La URL base de la API es: `http://127.0.0.1:8080/index.php/api/` (o `https://api.cicha.com.ar/index.php/api/` en producción).

### 1. Autenticación (`/api/auth`)
| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Inicia sesión y retorna token JWT con rol y member_id | Público |
| `GET` | `/auth/me` | Retorna los datos del usuario autenticado | JWT |
| `POST` | `/auth/profile` | Actualiza nombre, contraseña o avatar | JWT |

### 2. Portal Público (`/api/public`)
| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `GET` | `/public/home` | Datos de portada (hero, misión, estadísticas, destacados) | Público |
| `GET` | `/public/banners` | Lista de portadas/banners activos para el carrusel | Público |
| `GET` | `/public/institutional` | Secciones institucionales, comisión directiva y alianzas | Público |
| `GET` | `/public/translations/el` | **Diccionario dinámico de traducciones en Griego moderno (Ελληνικά)** | Público |
| `GET` | `/public/translations/en` | **Diccionario dinámico de traducciones en Inglés (English)** | Público |
| `GET` | `/public/articles` | Noticias y comunicados con filtros por categoría y búsqueda | Público |
| `GET` | `/public/articles/{slug}` | Detalle de noticia por slug con artículos relacionados | Público |
| `GET` | `/public/blogs` | Catálogo de blogs con filtros por categoría y buscador | Público |
| `GET` | `/public/blogs/{slug}` | Detalle de artículo de blog con posts recomendados | Público |
| `GET` | `/public/gallery` | Álbumes fotográficos activos, mosaico de fotos y categorías | Público |
| `GET` | `/public/gallery/{slug}` | Detalle de álbum con todas sus fotografías en alta resolución | Público |
| `GET` | `/public/events` | Agenda de eventos con filtros (próximos, anteriores) | Público |
| `GET` | `/public/b2b-meetings` | **Listado de reuniones B2B (versión pública básica: resumen, sectores y métricas)** | Público |
| `GET` | `/public/b2b-meetings/{slug}` | **Ficha pública de reunión B2B por slug** | Público |
| `GET` | `/public/members` | Catálogo de empresas socias (incluye dirección y teléfono), filtrable por sector y búsqueda (`?search=...`), ordenado por `order_num` | Público |
| `GET` | `/public/opportunities` | Oportunidades comerciales abiertas | Público |
| `GET` | `/public/alliances` | Convenios y alianzas estratégicas (Eurocámara, EEN, UCCEB) | Público |
| `GET` | `/public/settings` | Configuración pública, teléfonos, emails, redes sociales y plantillas de correos a socios | Público |
| `POST` | `/public/contact` | Envía mensaje de contacto general | Público |
| `POST` | `/public/apply` | Envía solicitud de afiliación a la Cámara (logo obligatorio) | Público |

### 3. Portal Exclusivo de Socios (`/api/partner`)
*Requiere JWT con rol `socio`, `admin` o `secretario`.*
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/partner/dashboard` | Resumen de intranet, bienvenida corporativa, KPIs y últimas novedades |
| `GET` | `/partner/news` | **Boletín de noticias exclusivo para socios con categorías y buscador** |
| `GET` | `/partner/news/{slug}` | **Detalle de noticia del boletín con artículos relacionados** |
| `GET` | `/partner/b2b-meetings` | **Reuniones B2B con informes detallados de resultados, acuerdos y contrapartes** |
| `GET` | `/partner/b2b-meetings/{slugOrId}` | **Detalle de reunión B2B con informe confidencial y enlace a dossier PDF** |
| `GET` | `/partner/resources` | Biblioteca de informes de mercado y guías (soporta PDF y enlace web externo) |
| `POST` | `/partner/resources/{id}/download` | Registra la descarga del recurso e incrementa el contador |
| `GET` | `/partner/minutes` | Listado de actas y resoluciones compartidas entre socios con filtro por categoría |
| `POST` | `/partner/minutes` | Publicar nueva acta (subida de PDF hasta 30MB o enlace URL externo con categoría) |
| `DELETE`| `/partner/minutes/{id}` | Eliminar acta (autor original o administradores) |
| `POST` | `/partner/minutes/{id}/download` | Registra acceso a acta e incrementa contador |
| `GET` | `/partner/decrees` | Listado de Decretos Oficiales de la Cámara para consulta de socios |
| `POST` | `/partner/decrees/{id}/download` | Registra descarga/apertura de decreto oficial |
| `GET` | `/partner/opportunities` | Oportunidades comerciales VIP con datos de contacto directo |
| `GET` | `/partner/benefits` | Club de beneficios y convenios con descuentos exclusivos (categorías dinámicas) |
| `GET` | `/partner/directory` | Directorio privado de socios con dirección, teléfono y correo prellenado |
| `GET` | `/partner/categories` | Consulta de categorías de actas, beneficios y miembros |

### 4. CMS Administrativo (`/api/admin`)
*Requiere JWT con rol `admin` o `secretario`. Organizado en 5 grupos temáticos coincidentes con el Sidebar del CMS:*

#### A. Resumen General
| Método | Endpoint | Descripción | Rol Requerido |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/dashboard` | Métricas generales, leads y accesos rápidos | `admin`, `secretario` |

#### B. Web Pública & Contenidos
| Método | Endpoint | Descripción | Rol Requerido |
| :--- | :--- | :--- | :--- |
| `CRUD` | `/admin/banners` | Gestión de portadas y banners del Home | `admin`, `secretario` |
| `CRUD` | `/admin/institutional`| **Gestión de secciones institucionales (Historia, Estatutos, Redes)** | `admin`, `secretario` |
| `GET`  | `/admin/translations` | **Catálogo completo de frases para traducción manual** | `admin`, `secretario` |
| `PUT`  | `/admin/translations/{id}` | **Actualiza traducción de una frase en Griego (`text_el`) o Inglés (`text_en`)** | `admin`, `secretario` |
| `POST` | `/admin/translations/batch`| **Actualización masiva por lote de todas las traducciones** | `admin`, `secretario` |
| `CRUD` | `/admin/authorities` | Gestión de Comisión Directiva, Comisión Revisora y autoridades | `admin`, `secretario` |
| `CRUD` | `/admin/articles` | Gestión completa de noticias y comunicados | `admin`, `secretario` |
| `CRUD` | `/admin/blogs` | Gestión de artículos de blogs editoriales | `admin`, `secretario` |
| `CRUD` | `/admin/gallery` | Gestión de álbumes fotográficos | `admin`, `secretario` |
| `POST` | `/admin/gallery/{id}/photos`| Subida de fotos individuales a un álbum | `admin`, `secretario` |
| `DELETE`| `/admin/gallery/photos/{id}`| Eliminación de una foto de álbum | `admin`, `secretario` |
| `CRUD` | `/admin/events` | Agenda de eventos y encuentros | `admin`, `secretario` |
| `CRUD` | `/admin/b2b-meetings` | **Gestión de Reuniones B2B (Datos Públicos e Informes Exclusivos Socios)** | `admin`, `secretario` |
| `CRUD` | `/admin/members` | Catálogo de empresas socias (dirección, teléfono, sectores, `order_num`) | `admin`, `secretario` |
| `CRUD` | `/admin/categories` | **Gestión de categorías (noticias, eventos, miembros, actas y beneficios)** | `admin`, `secretario` |
| `CRUD` | `/admin/alliances` | Convenios y alianzas estratégicas | `admin`, `secretario` |

#### C. Portal de Socios & Intranet
| Método | Endpoint | Descripción | Rol Requerido |
| :--- | :--- | :--- | :--- |
| `CRUD` | `/admin/decrees` | **Gestión de Decretos Oficiales de la Cámara y Categorías de Actas** | `admin`, `secretario` |
| `CRUD` | `/admin/partner-news`| **Gestión del Boletín de Noticias para Socios** | `admin`, `secretario` |
| `CRUD` | `/admin/partner-resources`| Gestión de biblioteca de informes de mercado (PDF / URL) | `admin`, `secretario` |
| `CRUD` | `/admin/partner-benefits` | **Gestión del Club de Convenios y Beneficios con categorías dinámicas** | `admin`, `secretario` |
| `CRUD` | `/admin/opportunities` | Oportunidades comerciales y demandas bilaterales VIP | `admin`, `secretario` |

#### D. Gestión & Contacto
| Método | Endpoint | Descripción | Rol Requerido |
| :--- | :--- | :--- | :--- |
| `GET`/`PUT`/`DELETE` | `/admin/applications` | Gestión de solicitudes de afiliación con cambio de estado | `admin`, `secretario` |
| `GET`/`PUT`/`DELETE` | `/admin/messages` | Bandeja de mensajes de contacto y consultas generales | `admin`, `secretario` |

#### E. Sistema & Staff
| Método | Endpoint | Descripción | Rol Requerido |
| :--- | :--- | :--- | :--- |
| `GET`/`POST` | `/admin/settings` | Ajustes institucionales, redes sociales y plantillas de correo | `admin`, `secretario` |
| `CRUD` | `/admin/users` | **Gestión de usuarios y accesos (con aislamiento estricto de Super Admin)** | `admin` (Staff), `secretario` (Socios) |
| `POST` | `/admin/upload` | Subida de archivos e imágenes (soporta documentos hasta 30MB) | `admin`, `secretario` |

---

## 🧪 Pruebas Automatizadas

El backend incluye suites de pruebas automatizadas:

```bash
# Ejecutar verificación de todos los módulos y endpoints
php backend/tests/verify_all.php

# Ejecutar verificación de seguridad y aislamiento por roles (RBAC)
php backend/tests/verify_rbac.php
```

---

## 📦 Despliegue en Servidores de Producción (cPanel / Apache)

Consulte la guía completa paso a paso en:  
👉 **[`GUIA_DEPLOY_CPANEL_BACKEND.md`](file:///d:/myProjects/cicha/backend/GUIA_DEPLOY_CPANEL_BACKEND.md)**
