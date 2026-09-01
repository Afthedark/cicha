# 🚀 Guía Directa de Despliegue del Backend en cPanel (`api.cicha.com.ar` • PHP 8.2)

Esta guía explica paso a paso cómo desplegar la API Backend de **CICHA (CodeIgniter 4 + PHP 8.2 + MySQL)** colocando **todo el proyecto directamente dentro de la carpeta raíz de tu subdominio `/api.cicha.com.ar/`**, de la forma más simple y sin crear carpetas adicionales.

---

## 🌐 1. Arquitectura Directa en cPanel

| Módulo | Dominio / Subdominio | Carpeta en cPanel |
| :--- | :--- | :--- |
| **Backend API Completo** | **`https://api.cicha.com.ar`** | **`/api.cicha.com.ar/`** |
| **Frontend (React SPA)** | `https://cicha.com.ar` | `/public_html/` |

---

## 📋 2. Requisitos Previos de PHP 8.2 en cPanel

1. Ingresa a tu **cPanel ➔ Administrador MultiPHP (MultiPHP Manager)** o **Select PHP Version**.
2. Selecciona **PHP 8.2** para el subdominio `api.cicha.com.ar`.
3. En **Extensiones de PHP**, asegúrate de tener activas:
   - ✅ `mysqli` o `pdo_mysql` (Conexión a Base de Datos)
   - ✅ `intl` (Internacionalización)
   - ✅ `mbstring` (Cadenas UTF-8)
   - ✅ `fileinfo` (Validación de subida de imágenes)
   - ✅ `gd` o `imagick` (Procesamiento de imágenes)
   - ✅ `json` y `curl`
   - ✅ `openssl` (Autenticación JWT)

---

## 🗄️ 3. Paso 1: Configurar la Base de Datos MySQL en cPanel

1. En cPanel, entra a **Bases de Datos MySQL (MySQL Databases)**.
2. **Crear Base de Datos**:
   - Nombre: `cpaneluser_cicha` (ej. `cicha_db`).
3. **Crear Usuario de Base de Datos**:
   - Usuario: `cpaneluser_cicha_user`.
   - Contraseña: *(Genera una contraseña segura y anótala)*.
4. **Asignar Usuario a la Base de Datos**:
   - Selecciona el usuario y la base de datos que creaste y presiona **Añadir**.
   - Marca la casilla **TODOS LOS PRIVILEGIOS (ALL PRIVILEGES)** y guarda los cambios.
5. **Importar la Base de Datos Completa (`cicha_database.sql`)**:
   - En tu repositorio ya tienes generado el archivo listo para producción: **[`backend/cicha_database.sql`](file:///d:/myProjects/cicha/backend/cicha_database.sql)**.
   - En tu cPanel, abre la herramienta **phpMyAdmin**.
   - En la columna izquierda, haz clic sobre el nombre de tu base de datos recién creada (ej. `cpaneluser_cicha`).
   - En el menú superior, haz clic en la pestaña **Importar (Import)**.
   - Presiona el botón **Seleccionar archivo (Choose File)** y elige el archivo `d:\myProjects\cicha\backend\cicha_database.sql`.
   - Baja hasta el final de la página y presiona el botón **Importar / Continuar (Go / Import)**.
   - *¡Listo! Este archivo crea automáticamente las 15 tablas completas, usuarios con contraseñas seguras (Admin, Secretario, Socio), el nuevo Comité Directivo, contenidos de la Cámara, noticias y configuraciones.*

---

## 🏗️ 4. Paso 2: Crear el Subdominio `api.cicha.com.ar` en cPanel

1. En tu cPanel, entra en **Dominios (Domains)** o **Subdominios (Subdomains)**.
2. Crea el subdominio:
   - **Subdominio**: `api`
   - **Dominio**: `cicha.com.ar`
   - **Raíz del documento (Document Root)**: `api.cicha.com.ar`
3. Presiona **Crear / Enviar**.

### Estructura Final dentro de `/api.cicha.com.ar/`:
```
/api.cicha.com.ar/                 <-- 🌐 Todo el Backend va aquí adentro
│   ├── .htaccess                  <-- ⚠️ Redirige el tráfico hacia /public/
│   ├── .env                       <-- ⚙️ Configuración y credenciales de BD
│   ├── app/
│   ├── system/
│   ├── vendor/
│   ├── writable/                  <-- ⚠️ Permisos 775 o 777 (Logs y Cache)
│   └── public/                    <-- Carpeta pública interna de CodeIgniter
│       ├── index.php
│       ├── .htaccess
│       └── uploads/               <-- ⚠️ Imágenes subidas por usuarios (Permisos 755)
```

---

## 📤 5. Paso 3: Subida y Configuración de Archivos en `api.cicha.com.ar`

1. En tu máquina local, comprime toda la carpeta `backend/` en un archivo `backend_cicha.zip`:
   - Incluyendo `app/`, `system/`, `vendor/`, `writable/`, `public/`, `composer.json`, `env`.
2. En el Administrador de Archivos de cPanel, entra a la carpeta de tu subdominio `api.cicha.com.ar/` y sube/extrae `backend_cicha.zip`.
3. Asegúrate de que la carpeta `writable/` tenga permisos `775` o `777`.
4. Asegúrate de que la carpeta `public/uploads/` tenga permisos `755` o `775`.

---

## ⚙️ 6. Paso 4: Redirección Automática a `/public` (`.htaccess` Raíz)

Para que al entrar a `https://api.cicha.com.ar/` el servidor cargue directamente la carpeta `/public` sin mostrar las carpetas internas, crea o coloca este archivo **`.htaccess` en la raíz de `/api.cicha.com.ar/.htaccess`**:

```apache
# php -- BEGIN cPanel-generated handler, do not edit
# Set the “ea-php82” package as the default “PHP” programming language.
<IfModule mime_module>
  AddHandler application/x-httpd-ea-php82 .php .php8 .phtml
</IfModule>
# php -- END cPanel-generated handler, do not edit

<IfModule mod_rewrite.c>
    RewriteEngine On

    # Pasar el Header Authorization (JWT) en cPanel / FastCGI
    SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Si la petición no entra ya a /public/, redirigir internamente a /public/
    RewriteCond %{REQUEST_URI} !^/public/
    RewriteRule ^(.*)$ public/$1 [L,QSA]
</IfModule>

# Proteger archivos sensibles
<FilesMatch "^\.env|composer\.(json|lock)">
    Order allow,deny
    Deny from all
</FilesMatch>
```

Y en **`/api.cicha.com.ar/public/.htaccess`** asegúrate de tener:
```apache
# php -- BEGIN cPanel-generated handler, do not edit
# Set the “ea-php82” package as the default “PHP” programming language.
<IfModule mime_module>
  AddHandler application/x-httpd-ea-php82 .php .php8 .phtml
</IfModule>
# php -- END cPanel-generated handler, do not edit

Options -Indexes
<IfModule mod_rewrite.c>
    Options +FollowSymlinks
    RewriteEngine On

    # Pasar el Header Authorization (JWT) en cPanel / FastCGI
    SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^([\s\S]*)$ index.php/$1 [L,NC,QSA]
</IfModule>

# CORS activo para el Frontend
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-KEY, Access-Control-Request-Method"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS"
</IfModule>
```

---

## 🔐 7. Paso 5: Configurar Base de Datos en `.env`

En la raíz de `/api.cicha.com.ar/`, renombra `env` a `.env` (o edítalo) con tus credenciales:

```ini
#--------------------------------------------------------------------
# ENTORNO
#--------------------------------------------------------------------
CI_ENVIRONMENT = production

#--------------------------------------------------------------------
# URL BASE DE LA API
#--------------------------------------------------------------------
app.baseURL = 'https://api.cicha.com.ar/'

#--------------------------------------------------------------------
# BASE DE DATOS MYSQL (cPanel)
#--------------------------------------------------------------------
database.default.hostname = localhost
database.default.database = cpaneluser_cicha
database.default.username = cpaneluser_cicha_user
database.default.password = TuContraseñaSegura123!
database.default.DBDriver = MySQLi
database.default.DBPrefix =
database.default.port = 3306
database.default.charset = utf8mb4
database.default.DBCollat = utf8mb4_general_ci

#--------------------------------------------------------------------
# SEGURIDAD JWT (Genera una clave secreta propia)
#--------------------------------------------------------------------
JWT_SECRET_KEY = "clave_secreta_super_segura_de_produccion_cicha_2026"
```

---

## 🔗 8. Paso 6: Conectar el Frontend con `api.cicha.com.ar`

1. Abre [`frontend/src/services/api.ts`](file:///d:/myProjects/cicha/frontend/src/services/api.ts) y coloca la URL del subdominio:
   ```typescript
   const API_BASE_URL = 'https://api.cicha.com.ar/index.php/api';
   ```
2. Ejecuta en la terminal de tu frontend:
   ```bash
   npm run build
   ```
3. Sube el contenido de `frontend/dist/` a la carpeta principal `public_html/` de tu cPanel.

---

## 🧪 9. Paso 7: Comprobación del Despliegue

Abre tu navegador y prueba directamente estos enlaces para verificar que la API está respondiendo en vivo:

1. **Test Principal de Inicio (Comprobar API y Base de Datos)**:
   👉 **`https://api.cicha.com.ar/index.php/api/public/home`**
   *Debe responder `HTTP 200 OK` con el JSON de noticias destacadas, eventos y autoridades.*

2. **Otros Endpoints Públicos de Prueba**:
   - **Noticias**: `https://api.cicha.com.ar/index.php/api/public/articles`
   - **Socios**: `https://api.cicha.com.ar/index.php/api/public/members`
   - **Institucional**: `https://api.cicha.com.ar/index.php/api/public/institutional`

3. **Subida Dinámica de Imágenes**:
   - Al subir fotos en el CMS, se guardarán automáticamente en `api.cicha.com.ar/public/uploads/` y responderán en la URL pública: `https://api.cicha.com.ar/uploads/nombre_imagen.png`.

---

## 🔄 10. Procedimiento Rápido para Actualizar Nuevas Versiones (Sin SSH ni Terminal)

> [!NOTE]
> Este procedimiento está diseñado **100% para planes de hosting cPanel sin acceso a SSH ni Terminal**. No necesitas consola de comandos ni ejecutar sentencias SQL manuales en phpMyAdmin.

Cuando hagas cambios en el código local o agreguemos nuevas funciones / tablas:

### Paso 1: Subir la Actualización de Código
1. En tu computadora, comprime únicamente la carpeta `backend/app/` en un archivo `app_update.zip`.
2. En el Administrador de Archivos de cPanel, entra a `/api.cicha.com.ar/` y sube/extrae `app_update.zip` (reemplazará los archivos de `app/` al instante).
3. 🛑 **NUNCA toques ni reemplaces**:
   - `public/uploads/` (imágenes subidas por usuarios).
   - `.env` (conexión y claves de la base de datos).
   - `writable/` (logs y caché).

---

### Paso 2: Auto-Migración de Base de Datos (1 Clic)
Si la nueva versión incluye tablas nuevas (por ejemplo: `banners` o nuevos campos):

Abre este enlace directamente en tu navegador:
👉 **`https://api.cicha.com.ar/index.php/api/admin/migrate?secret=cicha_migration_secret_key_2026`**

**¿Qué hace este link automáticamente?**
- ✅ CodeIgniter revisa el historial de la base de datos.
- ✅ Si hay tablas nuevas pendientes, las crea en **menos de 1 segundo**.
- ✅ **NO toca ni borra** ningún dato existente de tus usuarios, noticias ni socios.
- ✅ Te devuelve una respuesta JSON de confirmación:
  ```json
  {
    "status": 200,
    "success": true,
    "message": "✅ Base de datos actualizada con éxito.",
    "timestamp": "2026-08-29 17:35:00"
  }
  ```

---

### 💡 Resumen:
- **Actualización normal de código**: Solo ejecutas el **Paso 1**.
- **Actualización con tablas nuevas**: Ejecutas **Paso 1** y luego abres el link del **Paso 2**. ¡Listo!
