# CICHA Backend - REST API & CMS Engine

Backend RESTful y motor de gestión de contenidos desarrollado con **CodeIgniter 4**, autenticación **JWT** y control de acceso basado en roles (**RBAC**) para la **Cámara de Industria y Comercio Heleno Argentina (CICHA)**.

---

## 📋 Requisitos del Sistema

- **PHP**: Versión `8.1` o superior (probado en PHP 8.2 con XAMPP).
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
Crea todas las tablas estructurales (12 tablas principales + 2 tablas de intranet de socios):

```bash
php spark migrate
```

Tablas generadas:
- `users`: Usuarios, roles (`admin`, `secretario`, `socio`) y vinculación a socios.
- `settings`: Configuración institucional, contactos, redes sociales y metadatos SEO.
- `institutional_sections`: Misión, Objeto estatutario, Historia y reconocimientos diplomáticos.
- `authorities`: Comisión Directiva y autoridades de la Cámara.
- `alliances`: Redes estratégicas (EUROCAMARA, EEN Unión Europea, UCCEB, Embajada).
- `categories`: Taxonomía para noticias, eventos y socios.
- `articles`: Noticias, prensa y comunicados institucionales.
- `events`: Agenda de foros, webinars y rondas de negocios.
- `members`: Directorio de empresas socias de CICHA.
- `commercial_opportunities`: Demandas y ofertas bilaterales Grecia-Argentina.
- `partner_resources`: Biblioteca de informes sectoriales, guías y minutas con control de descargas.
- `partner_benefits`: Convenios corporativos y club de beneficios para socios.
- `membership_applications`: Bandeja de solicitudes de afiliación con gestión de estados.
- `contact_messages`: Bandeja de mensajes de contacto y consultas.

### 3. Poblar la Base de Datos con Seeders
Inserta datos institucionales fidedignos, noticias iniciales, empresas socias y cuentas de acceso por rol:

```bash
php spark db:seed CichaSeeder
php spark db:seed RolesAndPartnersSeeder
```

---

## 🔐 Seguridad y Control de Acceso (RBAC)

La API cuenta con una arquitectura de seguridad por capas:
- **`CorsFilter.php`**: Permite peticiones seguras de orígenes cruzados (CORS) con soporte para preflight `OPTIONS`.
- **`JwtAuthFilter.php`**: Valida y decodifica el token Bearer en cabecera `Authorization: Bearer <token>` mediante la librería `firebase/php-jwt`.
- **`RoleFilter.php`**: Middleware que verifica que el rol del usuario (`admin`, `secretario`, `socio`) tenga autorización para ejecutar la acción solicitada; de lo contrario, responde con HTTP `403 Forbidden`.

### Cuentas de Acceso Preconfiguradas:
| Rol | Email | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **`admin`** | `admin@cicha.com.ar` | `admin123` | Control total del sistema, gestión de usuarios, roles, configuraciones y portal de socios. |
| **`secretario`** | `secretaria@cicha.com.ar` | `sec123` | Gestión de contenidos (noticias, eventos, oportunidades, socios, recursos de socios, bandejas de mensajes y solicitudes). |
| **`socio`** | `socio@cicha.com.ar` | `socio123` | Intranet de socios: descargas de informes, oportunidades VIP con contacto directo, club de beneficios y directorio B2B. |

---

## 📡 Referencia de Endpoints REST

La URL base de la API es: `http://127.0.0.1:8080/index.php/api/`

### 1. Autenticación (`/api/auth`)
| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Inicia sesión y retorna token JWT con rol y member_id | Público |
| `GET` | `/auth/me` | Retorna los datos del usuario autenticado | JWT |
| `POST` | `/auth/profile` | Actualiza nombre, contraseña o avatar | JWT |

### 2. Portal Público (`/api/public`)
| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `GET` | `/public/home` | Datos completos de portada (hero, misión, estadísticas, destacados) | Público |
| `GET` | `/public/institutional` | Secciones institucionales, comisión directiva y alianzas | Público |
| `GET` | `/public/articles` | Noticias y comunicados con filtros por categoría y búsqueda | Público |
| `GET` | `/public/articles/{slug}` | Detalle de noticia por slug con artículos relacionados | Público |
| `GET` | `/public/events` | Agenda de eventos con filtros (próximos, anteriores) | Público |
| `GET` | `/public/members` | Catálogo de empresas socias filtrable por sector | Público |
| `GET` | `/public/opportunities` | Oportunidades comerciales abiertas | Público |
| `GET` | `/public/alliances` | Convenios y alianzas estratégicas (Eurocámara, EEN, UCCEB) | Público |
| `GET` | `/public/settings` | Configuración pública, teléfonos, emails y redes sociales | Público |
| `POST` | `/public/contact` | Envía mensaje de contacto general | Público |
| `POST` | `/public/apply` | Envía solicitud de afiliación a la Cámara | Público |

### 3. Portal Exclusivo de Socios (`/api/partner`)
*Requiere JWT con rol `socio`, `admin` o `secretario`.*
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/partner/dashboard` | Resumen de intranet, bienvenida corporativa, KPIs y últimas novedades |
| `GET` | `/partner/resources` | Biblioteca de informes de mercado, guías y minutas |
| `POST` | `/partner/resources/{id}/download` | Registra la descarga e incrementa el contador |
| `GET` | `/partner/opportunities` | Oportunidades comerciales VIP con datos de contacto directo de contrapartes |
| `GET` | `/partner/benefits` | Club de beneficios y convenios con descuentos exclusivos |
| `GET` | `/partner/directory` | Directorio privado B2B para networking directo entre directivos |

### 4. CMS Administrativo (`/api/admin`)
*Requiere JWT con rol `admin` o `secretario`.*
| Método | Endpoint | Descripción | Rol Requerido |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/dashboard` | Métricas y contadores de leads | `admin`, `secretario` |
| `CRUD` | `/admin/articles` | Gestión completa de noticias y prensa | `admin`, `secretario` |
| `CRUD` | `/admin/events` | Gestión de agenda de eventos | `admin`, `secretario` |
| `CRUD` | `/admin/members` | Gestión del directorio de empresas socias | `admin`, `secretario` |
| `CRUD` | `/admin/opportunities` | Gestión de oportunidades comerciales | `admin`, `secretario` |
| `CRUD` | `/admin/partner-resources` | Gestión de documentos descargables de socios | `admin`, `secretario` |
| `CRUD` | `/admin/partner-benefits` | Gestión de convenios y beneficios de socios | `admin`, `secretario` |
| `CRUD` | `/admin/applications` | Bandeja y estados de solicitudes de afiliación | `admin`, `secretario` |
| `CRUD` | `/admin/messages` | Bandeja y seguimiento de mensajes de contacto | `admin`, `secretario` |
| `POST` | `/admin/upload` | Subida de imágenes de portada | `admin`, `secretario` |
| `CRUD` | `/admin/users` | Administración de usuarios y asignación de roles | **`admin` únicamente** |
| `CRUD` | `/admin/authorities` | Gestión de Comisión Directiva | **`admin` únicamente** |
| `CRUD` | `/admin/alliances` | Gestión de convenios y redes | **`admin` únicamente** |
| `GET/PUT`| `/admin/institutional`| Edición de Misión, Objeto e Historia | **`admin` únicamente** |
| `GET/POST`| `/admin/settings` | Configuración global y metadatos SEO | **`admin` únicamente** |

---

## 🚀 Ejecución del Servidor Backend

Para iniciar el servidor local de desarrollo:

```bash
cd backend
php -S 127.0.0.1:8080 -t public
```

---

## 🧪 Pruebas Automatizadas

El backend incluye scripts de pruebas automáticas que validan el 100% de la funcionalidad:

```bash
# Probar API pública, envíos de formulario y CRUD del CMS
php backend/tests/verify_all.php

# Probar matriz de roles y control de acceso (RBAC)
php backend/tests/verify_rbac.php
```
