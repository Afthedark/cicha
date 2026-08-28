-- ========================================================
-- CICHA Database Export for cPanel / phpMyAdmin
-- Generated: 2026-08-28 03:01:23
-- ========================================================

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+00:00';


-- --------------------------------------------------------
-- Table structure for table `alliances`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `alliances`;
CREATE TABLE `alliances` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'internacional',
  `description` text COLLATE utf8mb4_unicode_ci,
  `website_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `highlight_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_num` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `alliances`
INSERT INTO `alliances` (`id`, `name`, `slug`, `category`, `description`, `website_url`, `logo_url`, `highlight_text`, `order_num`, `is_active`, `created_at`, `updated_at`) VALUES ('1', 'EUROCAMARA Argentina', 'eurocamara-argentina', 'institucional', 'Cámara de Cámaras de Comercio Europeas en Argentina. CICHA es miembro activo desde mayo de 2017, participando en foros económicos bilaterales y comisiones de diálogo público-privado.', 'https://eurocamara.com.ar', 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=300&q=80', 'Miembro Activo desde Mayo 2017', '1', '1', '2026-08-24 22:51:04', '2026-08-24 22:51:04');
INSERT INTO `alliances` (`id`, `name`, `slug`, `category`, `description`, `website_url`, `logo_url`, `highlight_text`, `order_num`, `is_active`, `created_at`, `updated_at`) VALUES ('2', 'Enterprise Europe Network (EEN)', 'enterprise-europe-network', 'red_europea', 'La mayor red mundial de apoyo a pequeñas y medianas empresas con ambiciones internacionales, financiada por la Comisión Europea. CICHA compone el nodo argentino de la red.', 'https://een.ec.europa.eu', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80', 'Nodo Oficial en Argentina - Unión Europea', '2', '1', '2026-08-24 22:51:04', '2026-08-24 22:51:04');
INSERT INTO `alliances` (`id`, `name`, `slug`, `category`, `description`, `website_url`, `logo_url`, `highlight_text`, `order_num`, `is_active`, `created_at`, `updated_at`) VALUES ('3', 'UCCEB - Unión de Cámaras Binacionales', 'ucceb-argentina', 'binacional', 'Unión de Cámaras Comerciales Extranjeras Binacionales en la República Argentina, actualmente compuesta por 32 cámaras. CICHA integra la federación desde hace más de una década.', 'https://ucceb.org.ar', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80', 'Miembro Activo desde hace más de una década (32 Cámaras)', '3', '1', '2026-08-24 22:51:04', '2026-08-24 22:51:04');
INSERT INTO `alliances` (`id`, `name`, `slug`, `category`, `description`, `website_url`, `logo_url`, `highlight_text`, `order_num`, `is_active`, `created_at`, `updated_at`) VALUES ('4', 'Embajada de Grecia en Argentina', 'embajada-grecia-argentina', 'diplomatica', 'Representación diplomática oficial de la República Helénica en Buenos Aires con estrecha colaboración en misiones comerciales y culturales.', 'https://www.mfa.gr/buenosaires', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=300&q=80', 'Reconocimiento Oficial del Gobierno Griego (1998)', '4', '1', '2026-08-24 22:51:04', '2026-08-24 22:51:04');


-- --------------------------------------------------------
-- Table structure for table `articles`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int unsigned DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` text COLLATE utf8mb4_unicode_ci,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `author` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CICHA Institucional',
  `published_at` date DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('published','draft') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'published',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `articles`
INSERT INTO `articles` (`id`, `category_id`, `title`, `slug`, `summary`, `content`, `image_url`, `author`, `published_at`, `is_featured`, `status`, `created_at`, `updated_at`) VALUES ('1', '1', 'Grecia y Argentina profundizan acuerdos de cooperación comercial y energética', 'grecia-argentina-acuerdos-comercial-energetica', 'Representantes de CICHA, diplomáticos helenos y cámaras empresariales analizaron nuevos incentivos para las exportaciones alimenticias y energías limpias.', '<p>En el marco del fortalecimiento de las relaciones comerciales entre Grecia y Argentina, la Cámara de Industria y Comercio Heleno Argentina (CICHA) celebró una jornada de trabajo donde se evaluaron las principales complementariedades productivas de ambas naciones.</p><p>Entre los ejes destacados se subrayó el potencial del sector agroalimentario argentino (aceites, legumbres, carnes) y la destacada capacidad logística y naviera de Grecia como puerta de entrada estratégica de productos al sudeste europeo y la cuenca mediterránea.</p>', 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80', 'Comisión de Prensa CICHA', '2026-08-19', '1', 'published', '2026-08-24 22:51:04', '2026-08-24 22:51:04');
INSERT INTO `articles` (`id`, `category_id`, `title`, `slug`, `summary`, `content`, `image_url`, `author`, `published_at`, `is_featured`, `status`, `created_at`, `updated_at`) VALUES ('2', '2', 'CICHA impulsa la participación de PYMES argentinas en la red Enterprise Europe Network (EEN)', 'cicha-impulsa-participacion-pymes-red-een', 'Como nodo activo de la red EEN de la Unión Europea, CICHA brinda asesoramiento y vinculación tecnológica a empresas interesadas en el mercado europeo.', '<p>La red Enterprise Europe Network (EEN) es la plataforma de articulación empresarial más extensa del mundo, con presencia en más de 60 países. A través del nodo CICHA, las empresas argentinas socias pueden acceder a búsquedas directas de socios comerciales y tecnológicos en Grecia y toda la Unión Europea.</p>', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80', 'Nodo EEN Argentina', '2026-08-09', '1', 'published', '2026-08-24 22:51:04', '2026-08-24 22:51:04');
INSERT INTO `articles` (`id`, `category_id`, `title`, `slug`, `summary`, `content`, `image_url`, `author`, `published_at`, `is_featured`, `status`, `created_at`, `updated_at`) VALUES ('3', '1', 'Conmemoración de los 35 años de trayectoria institucional de CICHA en Argentina', 'conmemoracion-35-anos-cicha-argentina', 'Un recorrido histórico desde el reconocimiento por el gobierno argentino en 1989 y griego en 1998 hasta la actualidad.', '<p>Desde el 1 de noviembre de 1989, cuando la Cámara de Industria y Comercio Heleno Argentina fue reconocida por el gobierno argentino, la institución ha mantenido un compromiso inquebrantable con la ética, el desarrollo sustentable y el diálogo entre sectores públicos y privados.</p>', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80', 'Secretaría General CICHA', '2026-07-25', '0', 'published', '2026-08-24 22:51:04', '2026-08-24 22:51:04');


-- --------------------------------------------------------
-- Table structure for table `authorities`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `authorities`;
CREATE TABLE `authorities` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('directiva','honorario','comite') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'directiva',
  `company` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `photo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkedin_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_num` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `authorities`
INSERT INTO `authorities` (`id`, `name`, `role_title`, `category`, `company`, `bio`, `photo_url`, `linkedin_url`, `order_num`, `is_active`, `created_at`, `updated_at`) VALUES ('6', 'Alexandros Zymnis', 'Presidente Honorario', 'honorario', 'EGEO SACI & A', 'Presidente Honorario y referente histórico de la comunidad y el comercio bilateral heleno argentino.', 'http://127.0.0.1:8080/uploads/1787802828_60f1103196402b2cb002.webp', '', '1', '1', '2026-08-27 00:21:05', '2026-08-27 00:53:50');
INSERT INTO `authorities` (`id`, `name`, `role_title`, `category`, `company`, `bio`, `photo_url`, `linkedin_url`, `order_num`, `is_active`, `created_at`, `updated_at`) VALUES ('7', 'Georgios Souvatzis', 'Presidente', 'directiva', 'IAS GROUP / ECOINNOVA', 'Presidente de CICHA. Líder empresarial en innovación, desarrollo sustentable y comercio bilateral greco-argentino.', 'http://127.0.0.1:8080/uploads/1787802840_cd5909696e0fbc75b9b8.webp', '', '2', '1', '2026-08-27 00:21:05', '2026-08-27 00:54:01');
INSERT INTO `authorities` (`id`, `name`, `role_title`, `category`, `company`, `bio`, `photo_url`, `linkedin_url`, `order_num`, `is_active`, `created_at`, `updated_at`) VALUES ('8', 'Catalina Alejandra Gounaridis', 'Vicepresidenta 1ª', 'directiva', 'GEORGALOS HNOS S.A.I.C.A.', 'Vicepresidenta 1ª de CICHA y directiva destacada en la industria alimenticia y de consumo masivo con tradición helénica.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', '', '3', '1', '2026-08-27 00:21:05', '2026-08-27 00:21:05');
INSERT INTO `authorities` (`id`, `name`, `role_title`, `category`, `company`, `bio`, `photo_url`, `linkedin_url`, `order_num`, `is_active`, `created_at`, `updated_at`) VALUES ('9', 'Jorge Kalogiannidis', 'Vicepresidente 2º', 'directiva', 'KALOP - ACROPOLIS CABLES S.A.', 'Vicepresidente 2º de CICHA, empresario industrial del sector eléctrico, energía y manufactura avanzada.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', '', '4', '1', '2026-08-27 00:21:05', '2026-08-27 00:21:05');
INSERT INTO `authorities` (`id`, `name`, `role_title`, `category`, `company`, `bio`, `photo_url`, `linkedin_url`, `order_num`, `is_active`, `created_at`, `updated_at`) VALUES ('10', 'Alejandro Patricio Kasimis', 'Secretario General', 'directiva', 'PRODUCTOS PILAR S.A.', 'Secretario General de CICHA, articulador de vinculaciones institucionales y desarrollo de mercados.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', '', '5', '1', '2026-08-27 00:21:05', '2026-08-27 00:21:05');
INSERT INTO `authorities` (`id`, `name`, `role_title`, `category`, `company`, `bio`, `photo_url`, `linkedin_url`, `order_num`, `is_active`, `created_at`, `updated_at`) VALUES ('11', 'Gerardo Esteban Bursky', 'Tesorero', 'directiva', 'ESTUDIO SMIRNIOUDIS S.R.L.', 'Tesorero de CICHA y consultor en gestión financiera y contable corporativa.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80', '', '6', '1', '2026-08-27 00:21:05', '2026-08-27 00:21:05');
INSERT INTO `authorities` (`id`, `name`, `role_title`, `category`, `company`, `bio`, `photo_url`, `linkedin_url`, `order_num`, `is_active`, `created_at`, `updated_at`) VALUES ('12', 'Jorge Néstor Cotsiopoulos', 'Vocal Titular', 'directiva', 'ARTEMISION SRL', 'Vocal Titular de la Comisión Directiva de CICHA.', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80', '', '7', '1', '2026-08-27 00:21:05', '2026-08-27 00:21:05');
INSERT INTO `authorities` (`id`, `name`, `role_title`, `category`, `company`, `bio`, `photo_url`, `linkedin_url`, `order_num`, `is_active`, `created_at`, `updated_at`) VALUES ('13', 'Basilio Esteban Davonis', 'Vocal Titular', 'directiva', 'DAVONIS S.A.', 'Vocal Titular de la Comisión Directiva de CICHA.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', '', '8', '1', '2026-08-27 00:21:05', '2026-08-27 00:21:05');
INSERT INTO `authorities` (`id`, `name`, `role_title`, `category`, `company`, `bio`, `photo_url`, `linkedin_url`, `order_num`, `is_active`, `created_at`, `updated_at`) VALUES ('14', 'Alejandro Tomás Macipe', 'Vocal Titular', 'directiva', 'BODEGAS KRONTIRAS S.A.', 'Vocal Titular de CICHA y representante de la vitivinicultura biodinámica de raíces greco-argentinas.', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80', '', '9', '1', '2026-08-27 00:21:05', '2026-08-27 00:21:05');
INSERT INTO `authorities` (`id`, `name`, `role_title`, `category`, `company`, `bio`, `photo_url`, `linkedin_url`, `order_num`, `is_active`, `created_at`, `updated_at`) VALUES ('15', 'Mauricio Frumento', 'Vocal Titular', 'directiva', 'BANCO ICBC', 'Vocal Titular de CICHA y ejecutivo en banca corporativa y comercio exterior.', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80', '', '10', '1', '2026-08-27 00:21:05', '2026-08-27 00:21:05');
INSERT INTO `authorities` (`id`, `name`, `role_title`, `category`, `company`, `bio`, `photo_url`, `linkedin_url`, `order_num`, `is_active`, `created_at`, `updated_at`) VALUES ('16', 'Themistocles Valaouris', 'Vocal Suplente', 'directiva', 'HELLASMAR S.A.', 'Vocal Suplente de la Comisión Directiva de CICHA.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', '', '11', '1', '2026-08-27 00:21:05', '2026-08-27 00:21:05');
INSERT INTO `authorities` (`id`, `name`, `role_title`, `category`, `company`, `bio`, `photo_url`, `linkedin_url`, `order_num`, `is_active`, `created_at`, `updated_at`) VALUES ('17', 'Basilio Nicolás Polijronopoulos', 'Presidente Comisión Revisora de Cuentas', '', 'TEGA S.A.', 'Presidente de la Comisión Revisora de Cuentas de CICHA.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', '', '12', '1', '2026-08-27 00:21:05', '2026-08-27 00:21:05');
INSERT INTO `authorities` (`id`, `name`, `role_title`, `category`, `company`, `bio`, `photo_url`, `linkedin_url`, `order_num`, `is_active`, `created_at`, `updated_at`) VALUES ('18', 'George Xanthopoulos', 'Miembro Titular Revisor de Cuentas', '', 'COLEGIO SAINT MARY OF THE HILLS S.A.', 'Miembro Titular de la Comisión Revisora de Cuentas de CICHA.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', '', '13', '1', '2026-08-27 00:21:05', '2026-08-27 00:21:05');
INSERT INTO `authorities` (`id`, `name`, `role_title`, `category`, `company`, `bio`, `photo_url`, `linkedin_url`, `order_num`, `is_active`, `created_at`, `updated_at`) VALUES ('19', 'Beatriz Sofía Caravias Nazar', 'Miembro Titular Revisora de Cuentas', '', 'ESTUDIO CONTABLE', 'Miembro Titular de la Comisión Revisora de Cuentas de CICHA.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80', '', '14', '1', '2026-08-27 00:21:05', '2026-08-27 00:21:05');
INSERT INTO `authorities` (`id`, `name`, `role_title`, `category`, `company`, `bio`, `photo_url`, `linkedin_url`, `order_num`, `is_active`, `created_at`, `updated_at`) VALUES ('20', 'Alejandro Aurelio Valaouris', 'Miembro Suplente Revisor de Cuentas', '', 'HELLASMAR S.A.', 'Miembro Suplente de la Comisión Revisora de Cuentas de CICHA.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', '', '15', '1', '2026-08-27 00:21:05', '2026-08-27 00:21:05');


-- --------------------------------------------------------
-- Table structure for table `categories`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('news','events','members','opportunities') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'news',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `categories`
INSERT INTO `categories` (`id`, `name`, `slug`, `type`, `created_at`) VALUES ('1', 'Comercio Bilateral', 'comercio-bilateral', 'news', '2026-08-24 22:51:04');
INSERT INTO `categories` (`id`, `name`, `slug`, `type`, `created_at`) VALUES ('2', 'Eurocámara & EEN', 'eurocamara-een', 'news', '2026-08-24 22:51:04');
INSERT INTO `categories` (`id`, `name`, `slug`, `type`, `created_at`) VALUES ('3', 'Eventos & Networking', 'eventos-networking', 'events', '2026-08-24 22:51:04');
INSERT INTO `categories` (`id`, `name`, `slug`, `type`, `created_at`) VALUES ('4', 'Rondas de Negocios', 'rondas-de-negocios', 'events', '2026-08-24 22:51:04');
INSERT INTO `categories` (`id`, `name`, `slug`, `type`, `created_at`) VALUES ('5', 'Oportunidades de Inversión', 'oportunidades-inversion', 'opportunities', '2026-08-24 22:51:04');


-- --------------------------------------------------------
-- Table structure for table `commercial_opportunities`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `commercial_opportunities`;
CREATE TABLE `commercial_opportunities` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('export','import','investment','partnership','een_node') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'export',
  `origin_country` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Grecia',
  `target_country` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Argentina',
  `sector` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `requirements` text COLLATE utf8mb4_unicode_ci,
  `contact_person` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('open','in_negotiation','closed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `deadline` date DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `commercial_opportunities`
INSERT INTO `commercial_opportunities` (`id`, `title`, `slug`, `type`, `origin_country`, `target_country`, `sector`, `description`, `requirements`, `contact_person`, `contact_email`, `status`, `deadline`, `created_at`, `updated_at`) VALUES ('1', 'Búsqueda de importadores para Aceite de Oliva Extra Virgen DOP Kalamata', 'busqueda-importadores-aceite-oliva-kalamata', 'export', 'Grecia', 'Argentina / Cono Sur', 'Alimentos Gourmet y Agroindustria', 'Consorcio de productores de la región del Peloponeso busca socios distribuidores e importadores mayoristas en el mercado argentino con capacidad de distribución en canal retail y gastronómico.', 'Empresa con registro de importador activo en INAL/ANMAT y red logística en principales centros urbanos.', 'Dimitri Papandreou - Agregaduría Comercial', 'comercio@cicha.com.ar', 'open', '2026-10-23', '2026-08-24 22:51:04', '2026-08-24 22:51:04');
INSERT INTO `commercial_opportunities` (`id`, `title`, `slug`, `type`, `origin_country`, `target_country`, `sector`, `description`, `requirements`, `contact_person`, `contact_email`, `status`, `deadline`, `created_at`, `updated_at`) VALUES ('2', 'Oferta exportable de Legumbres y Maní argentino de alta calidad a Grecia', 'oferta-legumbres-mani-argentino-grecia', 'export', 'Argentina', 'Grecia / Unión Europea', 'Granos y Legumbres', 'Exportadores argentinos certificados ofrecen garbanzos, porotos alubia y maní confitería para la industria procesadora griega y distribución en el sudeste de Europa.', 'Certificación europea de trazabilidad fitosanitaria y cumplimiento de normativas UE.', 'Lic. Nikolaos Georgiou - CICHA', 'een@cicha.com.ar', 'open', '2026-11-22', '2026-08-24 22:51:04', '2026-08-24 22:51:04');
INSERT INTO `commercial_opportunities` (`id`, `title`, `slug`, `type`, `origin_country`, `target_country`, `sector`, `description`, `requirements`, `contact_person`, `contact_email`, `status`, `deadline`, `created_at`, `updated_at`) VALUES ('3', 'Alianza tecnológica y distribución de Software para Gestión Logística Portuaria', 'alianza-software-gestion-logistica-portuaria', 'partnership', 'Grecia', 'Argentina', 'Tecnología & Marítimo', 'Empresa tecnológica con base en El Pireo busca integradores locales en Argentina para implementar soluciones de gestión de flotas y terminales portuarias.', 'Empresas de software y servicios IT con clientes en el sector de comercio exterior y naviero.', 'Red EEN Argentina / CICHA', 'een@cicha.com.ar', 'open', '2026-10-08', '2026-08-24 22:51:04', '2026-08-24 22:51:04');


-- --------------------------------------------------------
-- Table structure for table `contact_messages`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('new','responded','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `contact_messages`
INSERT INTO `contact_messages` (`id`, `name`, `email`, `phone`, `subject`, `message`, `is_read`, `status`, `created_at`, `updated_at`) VALUES ('1', 'Empresario Heleno Test', 'test.heleno@empresa.gr', '+54 11 5555-1234', 'Interés en importación de aceite de oliva Kalamata', 'Estimada Cámara, deseamos coordinar una reunión comercial para explorar oportunidades con distribuidores argentinos.', '0', 'new', '2026-08-24 23:02:40', '2026-08-24 23:02:40');


-- --------------------------------------------------------
-- Table structure for table `events`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int unsigned DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `location_type` enum('presencial','virtual','hibrido') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'presencial',
  `location_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registration_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `organizer` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CICHA / Red EEN',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('upcoming','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'upcoming',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `events`
INSERT INTO `events` (`id`, `category_id`, `title`, `slug`, `description`, `event_date`, `end_date`, `location_type`, `location_address`, `registration_url`, `image_url`, `organizer`, `is_featured`, `status`, `created_at`, `updated_at`) VALUES ('1', '4', 'Foro de Comercio Bilateral Argentina - Grecia 2026', 'foro-comercio-bilateral-argentina-grecia-2026', 'Encuentro anual de empresarios, autoridades diplomáticas y miembros de EUROCAMARA y UCCEB. Oportunidades en agroindustria, servicios basados en el conocimiento y logística naval.', '2026-09-08 10:00:00', '2026-09-08 17:30:00', 'hibrido', 'Sede Eurocámara Argentina / Transmisión en vivo por Zoom', 'https://cicha.com.ar/registro-foro-2026', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80', 'CICHA / Eurocámara Argentina / Red EEN', '1', 'upcoming', '2026-08-24 22:51:04', '2026-08-24 22:51:04');
INSERT INTO `events` (`id`, `category_id`, `title`, `slug`, `description`, `event_date`, `end_date`, `location_type`, `location_address`, `registration_url`, `image_url`, `organizer`, `is_featured`, `status`, `created_at`, `updated_at`) VALUES ('2', '3', 'Webinar: Cómo exportar al mercado griego y la Unión Europea a través de la Red EEN', 'webinar-exportar-mercado-griego-ue-een', 'Taller práctico dictado por expertos en comercio exterior y normativas sanitarias y aduaneras de la Unión Europea.', '2026-09-21 15:00:00', '2026-09-21 16:30:00', 'virtual', 'Plataforma Virtual CICHA EEN', 'https://cicha.com.ar/webinar-een', 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=1200&q=80', 'Comisión de Comercio Exterior CICHA', '1', 'upcoming', '2026-08-24 22:51:04', '2026-08-24 22:51:04');


-- --------------------------------------------------------
-- Table structure for table `institutional_sections`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `institutional_sections`;
CREATE TABLE `institutional_sections` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `section_key` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_num` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `section_key` (`section_key`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `institutional_sections`
INSERT INTO `institutional_sections` (`id`, `section_key`, `title`, `subtitle`, `content`, `image_url`, `icon_name`, `order_num`, `is_active`, `updated_at`) VALUES ('1', 'mision', 'Nuestra Misión', 'Fuerza creadora para el desarrollo bilateral equitativo', 'La misión de la Cámara de Industria y Comercio Heleno Argentina, es ser una fuerza creadora -entre Argentina y Grecia - en un ambiente de negocios que contribuya al desarrollo de nuestra sociedad, enmarcando con justicia e igualdad de oportunidades. Promover el desarrollo de negocios sustentables, comercio bilateral, inversión productiva genuina, alentando emprendimientos privados y una economía de mercado, todo eso enmarcado con responsabilidad, ética y transparencia. Articular foros de conocimiento entre sus socios y facilitar el diálogo entre los sectores públicos y privados.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', 'Target', '1', '1', '2026-08-24 22:51:04');
INSERT INTO `institutional_sections` (`id`, `section_key`, `title`, `subtitle`, `content`, `image_url`, `icon_name`, `order_num`, `is_active`, `updated_at`) VALUES ('2', 'objeto', 'Objeto de la Cámara', 'Representación y articulación del empresariado heleno y bilateral', 'La Cámara de Industria y Comercio Heleno Argentina, tiene como nucleamiento y representación del empresariado griego o de ascendencia griega, residente en la Argentina, así como en general, de ambos o de terceros países con intereses, operaciones o inversiones en Grecia y/o Argentina. Fomenta el intercambio comercial, industrial, tecnológico y cultural entre ambas naciones.', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80', 'Compass', '2', '1', '2026-08-24 22:51:04');
INSERT INTO `institutional_sections` (`id`, `section_key`, `title`, `subtitle`, `content`, `image_url`, `icon_name`, `order_num`, `is_active`, `updated_at`) VALUES ('3', 'historia', 'Historia y Reconocimientos Oficiales', 'Más de 35 años de trayectoria uniendo lazos diplomáticos y comerciales', 'La Cámara de Industria y Comercio Heleno Argentina fue oficialmente reconocida por el gobierno argentino el 1 de noviembre de 1989, y por el gobierno griego el 18 de septiembre de 1998. Desde sus orígenes, se ha consolidado como un puente fundamental de integración comercial, cultural y productiva entre la República Argentina y la República Helénica. A lo largo de las décadas, ha articulado misiones comerciales, foros de inversión y convenios de cooperación con entidades europeas y multilaterales.', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80', 'Award', '3', '1', '2026-08-24 22:51:04');
INSERT INTO `institutional_sections` (`id`, `section_key`, `title`, `subtitle`, `content`, `image_url`, `icon_name`, `order_num`, `is_active`, `updated_at`) VALUES ('4', 'redes_estrategicas', 'Inserción Institucional y Redes Internacionales', 'EUROCAMARA Argentina, Nodo EEN de la Unión Europea y UCCEB', 'Desde Mayo de 2017, CICHA es miembro activo de la EUROCAMARA Argentina y compone nodo de la red EEN (Enterprise Europe Network) de la Unión Europea, la mayor red mundial de apoyo a empresas con proyección internacional. Asimismo, desde hace más de una década, es miembro activo de la UCCEB (Unión de Cámaras Comerciales Extranjeras Binacionales), compuesta actualmente por 32 cámaras de comercio internacionales en Argentina.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80', 'Globe2', '4', '1', '2026-08-24 22:51:04');


-- --------------------------------------------------------
-- Table structure for table `members`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `members`;
CREATE TABLE `members` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `company_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sector` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `services` text COLLATE utf8mb4_unicode_ci,
  `logo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_phone` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Argentina',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `members`
INSERT INTO `members` (`id`, `company_name`, `slug`, `sector`, `description`, `services`, `logo_url`, `website_url`, `contact_email`, `contact_phone`, `country`, `is_featured`, `status`, `created_at`, `updated_at`) VALUES ('1', 'Hellenic Shipping & Logistics', 'hellenic-shipping-logistics', 'Transporte Marítimo y Logística Internacional', 'Líder en fletes marítimos, consolidación de cargas a granel y logística portuaria entre el Mediterráneo y el Atlántico Sur.', 'Transporte marítimo internacional, desaduanamiento, depósitos fiscales, asesoramiento logístico.', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=300&q=80', 'https://hellenicshipping.com', 'operaciones@hellenicshipping.com', '+54 11 4800-1122', 'Argentina / Grecia', '1', 'active', '2026-08-24 22:51:04', '2026-08-24 22:51:04');
INSERT INTO `members` (`id`, `company_name`, `slug`, `sector`, `description`, `services`, `logo_url`, `website_url`, `contact_email`, `contact_phone`, `country`, `is_featured`, `status`, `created_at`, `updated_at`) VALUES ('2', 'Aegean Olive & Fine Foods S.A.', 'aegean-olive-fine-foods', 'Agroindustria y Alimentos Premium', 'Importadora y distribuidora de aceites de oliva con Denominación de Origen Protegida (Kalamata), aceitunas y especialidades griegas en Argentina.', 'Importación, distribución mayorista, canal horeca, retail gourmet.', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80', 'https://aegeanfoods.com.ar', 'ventas@aegeanfoods.com.ar', '+54 11 4755-3344', 'Argentina', '1', 'active', '2026-08-24 22:51:04', '2026-08-24 22:51:04');
INSERT INTO `members` (`id`, `company_name`, `slug`, `sector`, `description`, `services`, `logo_url`, `website_url`, `contact_email`, `contact_phone`, `country`, `is_featured`, `status`, `created_at`, `updated_at`) VALUES ('3', 'Olympus Renewable Energy', 'olympus-renewable-energy', 'Energías Renovables y Tecnología', 'Desarrollo de proyectos fotovoltaicos y eólicos con transferencia de tecnología europea y financiamiento bilateral.', 'Ingeniería EPC, consultoría ambiental, montaje electromecánico de parques solares.', 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=300&q=80', 'https://olympusenergy.gr', 'latam@olympusenergy.gr', '+54 11 5233-9000', 'Grecia / Argentina', '1', 'active', '2026-08-24 22:51:04', '2026-08-24 22:51:04');
INSERT INTO `members` (`id`, `company_name`, `slug`, `sector`, `description`, `services`, `logo_url`, `website_url`, `contact_email`, `contact_phone`, `country`, `is_featured`, `status`, `created_at`, `updated_at`) VALUES ('4', 'Constantinou Legal & Tax Advisory', 'constantinou-legal-tax-advisory', 'Servicios Jurídicos y Consultoría Corporativa', 'Estudio especializado en estructuración societaria, tratados de doble tributación, propiedad intelectual y comercio internacional.', 'Asesoramiento legal corporativo, fusiones y adquisiciones, radicación de inversiones.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80', 'https://constantinou-law.com', 'info@constantinou-law.com', '+54 11 4312-7788', 'Argentina', '1', 'active', '2026-08-24 22:51:04', '2026-08-24 22:51:04');


-- --------------------------------------------------------
-- Table structure for table `membership_applications`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `membership_applications`;
CREATE TABLE `membership_applications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `company_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_role` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cuit_rut` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sector` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interests` text COLLATE utf8mb4_unicode_ci,
  `comments` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','in_review','approved','contacted','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `membership_applications`
INSERT INTO `membership_applications` (`id`, `company_name`, `contact_name`, `contact_role`, `email`, `phone`, `cuit_rut`, `sector`, `website`, `interests`, `comments`, `status`, `notes`, `created_at`, `updated_at`) VALUES ('1', 'Hellas Maritime South America S.A.', 'Konstantinos Vlachos', 'Director de Operaciones', 'kvlachos@hellasmaritime.com', '+54 11 4321-9988', '30-71829384-9', 'Marítimo y Logística Naval', 'https://hellasmaritime.com', 'Comercio Bilateral e Inversiones, Participación en EUROCAMARA, Red Enterprise Europe Network (EEN)', 'Deseamos incorporarnos como socios activos de CICHA para participar en los comités de comercio exterior.', 'pending', NULL, '2026-08-24 23:02:41', '2026-08-24 23:02:41');


-- --------------------------------------------------------
-- Table structure for table `migrations`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `version` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `class` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `namespace` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `time` int NOT NULL,
  `batch` int unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `migrations`
INSERT INTO `migrations` (`id`, `version`, `class`, `group`, `namespace`, `time`, `batch`) VALUES ('1', '2026-08-25-000001', 'App\\Database\\Migrations\\CreateCichaTables', 'default', 'App', '1787622613', '1');
INSERT INTO `migrations` (`id`, `version`, `class`, `group`, `namespace`, `time`, `batch`) VALUES ('2', '2026-08-25-000002', 'App\\Database\\Migrations\\AddRolesAndPartnerTables', 'default', 'App', '1787623997', '2');


-- --------------------------------------------------------
-- Table structure for table `partner_benefits`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `partner_benefits`;
CREATE TABLE `partner_benefits` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_company` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Comercial',
  `discount_description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `how_to_claim` text COLLATE utf8mb4_unicode_ci,
  `logo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `valid_until` date DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `partner_benefits`
INSERT INTO `partner_benefits` (`id`, `title`, `provider_company`, `category`, `discount_description`, `how_to_claim`, `logo_url`, `valid_until`, `is_active`, `created_at`, `updated_at`) VALUES ('1', '25% de Descuento en Fletes y Logística Marítima Grecia - Cono Sur', 'Hellenic Shipping & Logistics', 'Logística & Transporte', 'Tarifa preferencial exclusiva para empresas socias de CICHA en fletes marítimos consolidados y desaduanamiento portuario en El Pireo y Buenos Aires.', 'Presentar credencial de socio activo o solicitar código de bonificación a la Secretaría de CICHA.', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=300&q=80', '2027-08-24', '1', '2026-08-24 23:13:40', '2026-08-24 23:13:40');
INSERT INTO `partner_benefits` (`id`, `title`, `provider_company`, `category`, `discount_description`, `how_to_claim`, `logo_url`, `valid_until`, `is_active`, `created_at`, `updated_at`) VALUES ('2', 'Pases VIP Gratuitos para Foros Económicos y Rondas de EUROCAMARA', 'EUROCAMARA Argentina', 'Networking Internacional', 'Acceso sin cargo a mesas redondas y rondas B2B organizadas por las 32 cámaras binacionales de EUROCAMARA y UCCEB.', 'Registro anticipado en el Portal de Socios de CICHA hasta 72 hs antes del evento.', 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=300&q=80', '2027-08-24', '1', '2026-08-24 23:13:40', '2026-08-24 23:13:40');
INSERT INTO `partner_benefits` (`id`, `title`, `provider_company`, `category`, `discount_description`, `how_to_claim`, `logo_url`, `valid_until`, `is_active`, `created_at`, `updated_at`) VALUES ('3', '1ª Consulta de Asesoría Legal Internacional Sin Cargo', 'Constantinou Legal & Tax Advisory', 'Servicios Profesionales', 'Diagnóstico preliminar gratuito en estructuración de inversiones bilaterales, contratos de distribución y registro de marcas en la Unión Europea.', 'Solicitar turno indicando número de socio CICHA a info@constantinou-law.com.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80', '2027-08-24', '1', '2026-08-24 23:13:40', '2026-08-24 23:13:40');


-- --------------------------------------------------------
-- Table structure for table `partner_resources`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `partner_resources`;
CREATE TABLE `partner_resources` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('informe_mercado','guia_legal','minuta_asamblea','circular_comercial') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'informe_mercado',
  `description` text COLLATE utf8mb4_unicode_ci,
  `file_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PDF',
  `file_size` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1.5 MB',
  `downloads` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `partner_resources`
INSERT INTO `partner_resources` (`id`, `title`, `category`, `description`, `file_url`, `file_type`, `file_size`, `downloads`, `is_active`, `created_at`, `updated_at`) VALUES ('1', 'Informe Sectorial 2026: Oportunidades del Sector Agroalimentario Argentino en Grecia', 'informe_mercado', 'Análisis exhaustivo sobre aranceles de importación en la UE, canales de distribución retail en Atenas y Salónica, y demanda de aceites, granos y legumbres.', 'https://cicha.com.ar/docs/informe_agroalimentario_grecia_2026.pdf', 'PDF', '3.8 MB', '43', '1', '2026-08-24 23:13:40', '2026-08-24 23:24:55');
INSERT INTO `partner_resources` (`id`, `title`, `category`, `description`, `file_url`, `file_type`, `file_size`, `downloads`, `is_active`, `created_at`, `updated_at`) VALUES ('2', 'Guía Jurídica y Tributaria: Tratado de Doble Imposición e Inversiones Grecia - Argentina', 'guia_legal', 'Manual práctico redactado por la Comisión Legal de CICHA sobre estructuración societaria, repatriación de dividendos y ventajas fiscales para empresas socias.', 'https://cicha.com.ar/docs/guia_tributaria_bilateral_cicha.pdf', 'PDF', '2.1 MB', '69', '1', '2026-08-24 23:13:40', '2026-08-24 23:25:05');
INSERT INTO `partner_resources` (`id`, `title`, `category`, `description`, `file_url`, `file_type`, `file_size`, `downloads`, `is_active`, `created_at`, `updated_at`) VALUES ('3', 'Minuta Oficial: Sesión Plenaria EUROCAMARA Argentina y Proyectos EEN 2026', 'minuta_asamblea', 'Resumen ejecutivo de acuerdos arancelarios, fondos de innovación verde de la Unión Europea y cronograma de misiones comerciales conjuntas.', 'https://cicha.com.ar/docs/minuta_plenaria_eurocamara_2026.pdf', 'PDF', '1.4 MB', '29', '1', '2026-08-24 23:13:40', '2026-08-24 23:13:40');
INSERT INTO `partner_resources` (`id`, `title`, `category`, `description`, `file_url`, `file_type`, `file_size`, `downloads`, `is_active`, `created_at`, `updated_at`) VALUES ('4', 'Circular de Comercio Exterior: Normativas Sanitarias y Fitosanitarias para Ingreso al Mercado Europeo', 'circular_comercial', 'Actualización de certificaciones requeridas por la Comisión Europea para exportadores de alimentos y bebidas del Cono Sur.', 'https://cicha.com.ar/docs/circular_sanitaria_ue_2026.pdf', 'PDF', '980 KB', '55', '1', '2026-08-24 23:13:40', '2026-08-24 23:13:40');


-- --------------------------------------------------------
-- Table structure for table `settings`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `key_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value_text` longtext COLLATE utf8mb4_unicode_ci,
  `group_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general',
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_name` (`key_name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `settings`
INSERT INTO `settings` (`id`, `key_name`, `value_text`, `group_name`, `updated_at`) VALUES ('1', 'site_name', 'Cámara de Industria y Comercio Heleno Argentina (CICHA)', 'general', '2026-08-24 22:51:04');
INSERT INTO `settings` (`id`, `key_name`, `value_text`, `group_name`, `updated_at`) VALUES ('2', 'site_acronym', 'CICHA', 'general', '2026-08-24 22:51:04');
INSERT INTO `settings` (`id`, `key_name`, `value_text`, `group_name`, `updated_at`) VALUES ('3', 'contact_email', 'info@cicha.com.ar', 'contact', '2026-08-24 22:51:04');
INSERT INTO `settings` (`id`, `key_name`, `value_text`, `group_name`, `updated_at`) VALUES ('4', 'trade_email', 'comercio@cicha.com.ar', 'contact', '2026-08-24 22:51:04');
INSERT INTO `settings` (`id`, `key_name`, `value_text`, `group_name`, `updated_at`) VALUES ('5', 'phone_primary', '+54 11 4328-9898', 'contact', '2026-08-24 22:51:04');
INSERT INTO `settings` (`id`, `key_name`, `value_text`, `group_name`, `updated_at`) VALUES ('6', 'phone_secondary', '+54 11 4328-9899', 'contact', '2026-08-24 22:51:04');
INSERT INTO `settings` (`id`, `key_name`, `value_text`, `group_name`, `updated_at`) VALUES ('7', 'address_street', 'Av. Leandro N. Alem 1074, Piso 7', 'contact', '2026-08-24 22:51:04');
INSERT INTO `settings` (`id`, `key_name`, `value_text`, `group_name`, `updated_at`) VALUES ('8', 'address_city', 'Ciudad Autónoma de Buenos Aires', 'contact', '2026-08-24 22:51:04');
INSERT INTO `settings` (`id`, `key_name`, `value_text`, `group_name`, `updated_at`) VALUES ('9', 'address_country', 'Argentina (C1001AAT)', 'contact', '2026-08-24 22:51:04');
INSERT INTO `settings` (`id`, `key_name`, `value_text`, `group_name`, `updated_at`) VALUES ('10', 'office_hours', 'Lunes a Viernes de 09:00 a 18:00 hs', 'contact', '2026-08-24 22:51:04');
INSERT INTO `settings` (`id`, `key_name`, `value_text`, `group_name`, `updated_at`) VALUES ('11', 'social_linkedin', 'https://www.linkedin.com/company/cicha-argentina', 'social', '2026-08-24 22:51:04');
INSERT INTO `settings` (`id`, `key_name`, `value_text`, `group_name`, `updated_at`) VALUES ('12', 'social_twitter', 'https://twitter.com/cicha_arg', 'social', '2026-08-24 22:51:04');
INSERT INTO `settings` (`id`, `key_name`, `value_text`, `group_name`, `updated_at`) VALUES ('13', 'social_facebook', 'https://facebook.com/cicha.argentina', 'social', '2026-08-24 22:51:04');
INSERT INTO `settings` (`id`, `key_name`, `value_text`, `group_name`, `updated_at`) VALUES ('14', 'social_instagram', 'https://instagram.com/cicha_argentina', 'social', '2026-08-24 22:51:04');
INSERT INTO `settings` (`id`, `key_name`, `value_text`, `group_name`, `updated_at`) VALUES ('15', 'meta_description', 'Cámara de Industria y Comercio Heleno Argentina. Miembro activo de EUROCAMARA Argentina, nodo EEN de la Unión Europea y miembro de UCCEB.', 'seo', '2026-08-24 22:51:04');
INSERT INTO `settings` (`id`, `key_name`, `value_text`, `group_name`, `updated_at`) VALUES ('16', 'meta_keywords', 'CICHA, Grecia, Argentina, Comercio Bilateral, Eurocamara, EEN, UCCEB, Inversiones, Negocios, Heleno Argentina', 'seo', '2026-08-24 22:51:04');


-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','secretario','socio') COLLATE utf8mb4_unicode_ci DEFAULT 'admin',
  `member_id` int unsigned DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `users`
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `member_id`, `avatar`, `status`, `created_at`, `updated_at`) VALUES ('1', 'Administrador CICHA', 'admin@cicha.com.ar', '$2y$10$owwGhgJnY0AO65ZKYknjvupPqG/r05yWiwpqg3kL/HBO58dNMgaI.', 'admin', NULL, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80', 'active', '2026-08-24 22:51:04', '2026-08-24 22:51:04');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `member_id`, `avatar`, `status`, `created_at`, `updated_at`) VALUES ('2', 'Lic. Nikolaos Georgiou (Secretaría)', 'secretaria@cicha.com.ar', '$2y$10$roDyHJT4OogeWIvNTM227u6AW5tucbo6ifS6SNaQHx0Y3g6KQ58ya', 'secretario', NULL, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80', 'active', '2026-08-24 23:13:40', '2026-08-24 23:13:40');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `member_id`, `avatar`, `status`, `created_at`, `updated_at`) VALUES ('3', 'Hellenic Shipping & Logistics (Socio Activo)', 'socio@cicha.com.ar', '$2y$10$P3Xh.CYt9uG9tZW17dLJD.2Xy9dUy7HDds58MNhaVxjqDeSsiUU9a', 'socio', '1', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80', 'active', '2026-08-24 23:13:40', '2026-08-24 23:13:40');

SET FOREIGN_KEY_CHECKS=1;
