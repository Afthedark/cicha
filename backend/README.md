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
Crea todas las tablas estructurales (16 tablas principales):

```bash
php spark migrate
```

Tablas generadas en la base de datos:
- `users`: Usuarios, roles (`admin`, `secretario`, `socio`) y vinculación a socios.
- `settings`: Configuración institucional, contactos, teléfonos, sede, redes sociales y metadatos SEO.
- `institutional_sections`: Misión, Objeto estatutario, Historia y reconocimientos diplomáticos.
- `authorities`: Comisión Directiva y autoridades de la Cámara.
- `alliances`: Redes estratégicas (EUROCAMARA, EEN Unión Europea, UCCEB, Embajada).
- `categories`: Taxonomía para noticias, eventos y socios.
- `articles`: Noticias, prensa y comunicados institucionales.
- `blogs`: Módulo editorial de artículos de análisis, opinión y notas técnicas.
- `photo_albums`: Álbumes y grupos temáticos de la galería fotográfica.
- `gallery_photos`: Fotografías individuales vinculadas a los álbumes con eliminación en cascada.
- `banners`: Portadas y slides dinámicos del Home con selector de rutas.
- `events`: Agenda de foros, webinars y rondas de negocios.
- `members`: Directorio de empresas socias de CICHA.
- `commercial_opportunities`: Demandas y ofertas bilaterales Grecia-Argentina.
- `partner_resources`: Biblioteca de informes sectoriales, guías y minutas con control de descargas.
- `partner_benefits`: Convenios corporativos y club de beneficios para socios.
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

91: ### Cuentas de Acceso Preconfiguradas:
92: | Rol | Email | Contraseña | Permisos |
93: | :--- | :--- | :--- | :--- |
94: | **`admin`** | `admin@cicha.com.ar` | `admin123` | Control total del sistema: Usuarios Staff (`admin`, `secretario`), Cuentas de Socios (`socio`), Ajustes del Sistema, Portadas, Blogs, Galería, Noticias, Eventos, Socios y Portal de Socios. |
95: | **`secretario`** | `secretaria@cicha.com.ar` | `sec123` | Gestión de contenidos institucionales, Blogs, Galería de Fotos, Noticias, Eventos, Oportunidades, Socios, Recursos (PDFs/URLs), Bandejas y **Cuentas de Acceso de Socios (`role=socio`)**. |
96: | **`socio`** | `socio@cicha.com.ar` | `socio123` | Intranet de socios: descargas de informes, oportunidades VIP con contacto directo, club de beneficios y directorio B2B. |
97: 
98: ---
99: 
100: ## 📡 Referencia de Endpoints REST
101: 
102: La URL base de la API es: `http://127.0.0.1:8080/index.php/api/` (o `https://api.cicha.com.ar/index.php/api/` en producción).
103: 
104: ### 1. Autenticación (`/api/auth`)
105: | Método | Endpoint | Descripción | Acceso |
106: | :--- | :--- | :--- | :--- |
107: | `POST` | `/auth/login` | Inicia sesión y retorna token JWT con rol y member_id | Público |
108: | `GET` | `/auth/me` | Retorna los datos del usuario autenticado | JWT |
109: | `POST` | `/auth/profile` | Actualiza nombre, contraseña o avatar | JWT |
110: 
111: ### 2. Portal Público (`/api/public`)
112: | Método | Endpoint | Descripción | Acceso |
113: | :--- | :--- | :--- | :--- |
114: | `GET` | `/public/home` | Datos de portada (hero, misión, estadísticas, destacados) | Público |
115: | `GET` | `/public/banners` | Lista de portadas/banners activos para el carrusel | Público |
116: | `GET` | `/public/institutional` | Secciones institucionales, comisión directiva y alianzas | Público |
117: | `GET` | `/public/articles` | Noticias y comunicados con filtros por categoría y búsqueda | Público |
118: | `GET` | `/public/articles/{slug}` | Detalle de noticia por slug con artículos relacionados | Público |
119: | `GET` | `/public/blogs` | Catálogo de blogs con filtros por categoría y buscador | Público |
120: | `GET` | `/public/blogs/{slug}` | Detalle de artículo de blog con posts recomendados | Público |
121: | `GET` | `/public/gallery` | Álbumes fotográficos activos, mosaico de fotos y categorías | Público |
122: | `GET` | `/public/gallery/{slug}` | Detalle de álbum con todas sus fotografías en alta resolución | Público |
123: | `GET` | `/public/events` | Agenda de eventos con filtros (próximos, anteriores) | Público |
124: | `GET` | `/public/members` | Catálogo de empresas socias filtrable por sector y búsqueda (`?search=...`) | Público |
125: | `GET` | `/public/opportunities` | Oportunidades comerciales abiertas | Público |
126: | `GET` | `/public/alliances` | Convenios y alianzas estratégicas (Eurocámara, EEN, UCCEB) | Público |
127: | `GET` | `/public/settings` | Configuración pública, teléfonos, emails, redes sociales (incluyendo TikTok y YouTube) y parámetros de correos a socios (`member_email_subject`, `member_email_body`) | Público |
128: | `POST` | `/public/contact` | Envía mensaje de contacto general | Público |
129: | `POST` | `/public/apply` | Envía solicitud de afiliación a la Cámara (**`company_logo_url` obligatorio tanto para empresas como personas físicas**) | Público |
130: 
131: ### 3. Portal Exclusivo de Socios (`/api/partner`)
132: *Requiere JWT con rol `socio`, `admin` o `secretario`.*
133: | Método | Endpoint | Descripción |
134: | :--- | :--- | :--- |
135: | `GET` | `/partner/dashboard` | Resumen de intranet, bienvenida corporativa, KPIs y últimas novedades |
136: | `GET` | `/partner/resources` | Biblioteca de informes de mercado, guías y minutas (soporta archivos PDF y enlaces web externos) |
137: | `POST` | `/partner/resources/{id}/download` | Registra la descarga e incrementa el contador |
138: | `GET` | `/partner/opportunities` | Oportunidades comerciales VIP con datos de contacto directo de contrapartes |
139: | `GET` | `/partner/benefits` | Club de beneficios y convenios con descuentos exclusivos |
140: | `GET` | `/partner/directory` | Directorio privado B2B para networking directo con correos prellenados |
141: 
142: ### 4. CMS Administrativo (`/api/admin`)
143: *Requiere JWT con rol `admin` o `secretario`.*
144: | Método | Endpoint | Descripción | Rol Requerido |
145: | :--- | :--- | :--- | :--- |
146: | `GET` | `/admin/dashboard` | Métricas y contadores de leads | `admin`, `secretario` |
147: | `CRUD` | `/admin/articles` | Gestión completa de noticias y prensa | `admin`, `secretario` |
148: | `CRUD` | `/admin/blogs` | Gestión de artículos de blogs editoriales | `admin`, `secretario` |
149: | `CRUD` | `/admin/gallery` | Gestión de álbumes fotográficos | `admin`, `secretario` |
150: | `POST` | `/admin/gallery/{id}/photos`| Subida de fotos individuales a un álbum | `admin`, `secretario` |
151: | `DELETE`| `/admin/gallery/photos/{id}`| Eliminación de una foto de álbum | `admin`, `secretario` |
152: | `CRUD` | `/admin/banners` | Gestión de portadas y slides del Home | `admin`, `secretario` |
153: | `CRUD` | `/admin/events` | Gestión de agenda de eventos | `admin`, `secretario` |
154: | `CRUD` | `/admin/members` | Gestión de empresas socias con buscador backend (`?search=...`) | `admin`, `secretario` |
155: | `CRUD` | `/admin/opportunities` | Gestión de oportunidades comerciales | `admin`, `secretario` |
156: | `CRUD` | `/admin/partner-resources` | Gestión de biblioteca de socios (soporte dual PDF local o Enlace URL externo) | `admin`, `secretario` |
157: | `CRUD` | `/admin/partner-benefits` | Gestión de convenios y beneficios de socios | `admin`, `secretario` |
158: | `CRUD` | `/admin/applications` | Bandeja y estados de solicitudes de afiliación | `admin`, `secretario` |
159: | `CRUD` | `/admin/messages` | Bandeja y seguimiento de mensajes de contacto | `admin`, `secretario` |
160: | `POST` | `/admin/upload` | Subida de archivos e imágenes a `/public/uploads/` | `admin`, `secretario` |
| `CRUD` | `/admin/authorities` | Gestión de Comisión Directiva, Comisión Revisora, Presidencia Honoraria y Comités con soporte de categorías (`category`) y orden numérico (`order_num`) | `admin`, `secretario` |
| `CRUD` | `/admin/alliances` | Gestión de convenios y redes (EUROCAMARA, EEN, UCCEB) | `admin`, `secretario` |
| `GET/PUT`| `/admin/institutional`| Edición de Misión, Objeto y Estatutos de La Cámara | `admin`, `secretario` |
| `GET/POST`| `/admin/settings` | Configuración global: sede, contactos, redes sociales (TikTok, YouTube), SEO y **plantillas de Correos Socios** (`member_email_subject`, `member_email_body`) | `admin`, `secretario` |
| `CRUD` | `/admin/users` | Administración de cuentas de usuario (`?role=admin,secretario` o `?role=socio`). Los secretarios pueden gestionar exclusivamente usuarios con rol `socio`. | `admin` (Staff), `admin`/`secretario` (Socios) |
166: 
167: ---
168: 
169: ## 🚀 Ejecución del Servidor Backend
170: 
171: Para iniciar el servidor local de desarrollo:
172: 
173: ```bash
174: cd backend
175: php -S 127.0.0.1:8080 -t public
176: ```
177: 
178: ---
179: 
180: ## 🧪 Pruebas Automatizadas
181: 
182: El backend incluye scripts de pruebas automáticas que validan el 100% de la funcionalidad:
183: 
184: ```bash
185: # Probar API pública, envíos de formulario y CRUD del CMS
186: php backend/tests/verify_all.php
187: 
188: # Probar matriz de roles y control de acceso (RBAC)
189: php backend/tests/verify_rbac.php
190: ```
