<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class CichaSeeder extends Seeder
{
    public function run()
    {
        $now = date('Y-m-d H:i:s');

        // 1. Admin User
        $this->db->table('users')->insert([
            'id'         => 1,
            'name'       => 'Administrador CICHA',
            'email'      => 'admin@cicha.com.ar',
            'password'   => password_hash('admin123', PASSWORD_BCRYPT),
            'role'       => 'admin',
            'avatar'     => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
            'status'     => 'active',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // 2. Settings
        $settings = [
            ['key_name' => 'site_name', 'value_text' => 'Cámara de Industria y Comercio Heleno Argentina (CICHA)', 'group_name' => 'general'],
            ['key_name' => 'site_acronym', 'value_text' => 'CICHA', 'group_name' => 'general'],
            ['key_name' => 'contact_email', 'value_text' => 'info@cicha.com.ar', 'group_name' => 'contact'],
            ['key_name' => 'trade_email', 'value_text' => 'comercio@cicha.com.ar', 'group_name' => 'contact'],
            ['key_name' => 'phone_primary', 'value_text' => '+54 11 4328-9898', 'group_name' => 'contact'],
            ['key_name' => 'phone_secondary', 'value_text' => '+54 11 4328-9899', 'group_name' => 'contact'],
            ['key_name' => 'address_street', 'value_text' => 'Av. Leandro N. Alem 1074, Piso 7', 'group_name' => 'contact'],
            ['key_name' => 'address_city', 'value_text' => 'Ciudad Autónoma de Buenos Aires', 'group_name' => 'contact'],
            ['key_name' => 'address_country', 'value_text' => 'Argentina (C1001AAT)', 'group_name' => 'contact'],
            ['key_name' => 'office_hours', 'value_text' => 'Lunes a Viernes de 09:00 a 18:00 hs', 'group_name' => 'contact'],
            ['key_name' => 'social_linkedin', 'value_text' => 'https://www.linkedin.com/company/cicha-argentina', 'group_name' => 'social'],
            ['key_name' => 'social_twitter', 'value_text' => 'https://twitter.com/cicha_arg', 'group_name' => 'social'],
            ['key_name' => 'social_facebook', 'value_text' => 'https://facebook.com/cicha.argentina', 'group_name' => 'social'],
            ['key_name' => 'social_instagram', 'value_text' => 'https://instagram.com/cicha_argentina', 'group_name' => 'social'],
            ['key_name' => 'meta_description', 'value_text' => 'Cámara de Industria y Comercio Heleno Argentina. Miembro activo de EUROCAMARA Argentina, nodo EEN de la Unión Europea y miembro de UCCEB.', 'group_name' => 'seo'],
            ['key_name' => 'meta_keywords', 'value_text' => 'CICHA, Grecia, Argentina, Comercio Bilateral, Eurocamara, EEN, UCCEB, Inversiones, Negocios, Heleno Argentina', 'group_name' => 'seo'],
        ];

        foreach ($settings as $setting) {
            $setting['updated_at'] = $now;
            $this->db->table('settings')->insert($setting);
        }

        // 3. Institutional Sections
        $sections = [
            [
                'section_key' => 'mision',
                'title'       => 'Nuestra Misión',
                'subtitle'    => 'Fuerza creadora para el desarrollo bilateral equitativo',
                'content'     => 'La misión de la Cámara de Industria y Comercio Heleno Argentina, es ser una fuerza creadora -entre Argentina y Grecia - en un ambiente de negocios que contribuya al desarrollo de nuestra sociedad, enmarcando con justicia e igualdad de oportunidades. Promover el desarrollo de negocios sustentables, comercio bilateral, inversión productiva genuina, alentando emprendimientos privados y una economía de mercado, todo eso enmarcado con responsabilidad, ética y transparencia. Articular foros de conocimiento entre sus socios y facilitar el diálogo entre los sectores públicos y privados.',
                'image_url'   => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
                'icon_name'   => 'Target',
                'order_num'   => 1,
                'is_active'   => 1,
                'updated_at'  => $now,
            ],
            [
                'section_key' => 'objeto',
                'title'       => 'Objeto de la Cámara',
                'subtitle'    => 'Representación y articulación del empresariado heleno y bilateral',
                'content'     => 'La Cámara de Industria y Comercio Heleno Argentina, tiene como nucleamiento y representación del empresariado griego o de ascendencia griega, residente en la Argentina, así como en general, de ambos o de terceros países con intereses, operaciones o inversiones en Grecia y/o Argentina. Fomenta el intercambio comercial, industrial, tecnológico y cultural entre ambas naciones.',
                'image_url'   => 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
                'icon_name'   => 'Compass',
                'order_num'   => 2,
                'is_active'   => 1,
                'updated_at'  => $now,
            ],
            [
                'section_key' => 'historia',
                'title'       => 'Historia y Reconocimientos Oficiales',
                'subtitle'    => 'Más de 35 años de trayectoria uniendo lazos diplomáticos y comerciales',
                'content'     => 'La Cámara de Industria y Comercio Heleno Argentina fue oficialmente reconocida por el gobierno argentino el 1 de noviembre de 1989, y por el gobierno griego el 18 de septiembre de 1998. Desde sus orígenes, se ha consolidado como un puente fundamental de integración comercial, cultural y productiva entre la República Argentina y la República Helénica. A lo largo de las décadas, ha articulado misiones comerciales, foros de inversión y convenios de cooperación con entidades europeas y multilaterales.',
                'image_url'   => 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
                'icon_name'   => 'Award',
                'order_num'   => 3,
                'is_active'   => 1,
                'updated_at'  => $now,
            ],
            [
                'section_key' => 'redes_estrategicas',
                'title'       => 'Inserción Institucional y Redes Internacionales',
                'subtitle'    => 'EUROCAMARA Argentina, Nodo EEN de la Unión Europea y UCCEB',
                'content'     => 'Desde Mayo de 2017, CICHA es miembro activo de la EUROCAMARA Argentina y compone nodo de la red EEN (Enterprise Europe Network) de la Unión Europea, la mayor red mundial de apoyo a empresas con proyección internacional. Asimismo, desde hace más de una década, es miembro activo de la UCCEB (Unión de Cámaras Comerciales Extranjeras Binacionales), compuesta actualmente por 32 cámaras de comercio internacionales en Argentina.',
                'image_url'   => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
                'icon_name'   => 'Globe2',
                'order_num'   => 4,
                'is_active'   => 1,
                'updated_at'  => $now,
            ],
        ];

        foreach ($sections as $sec) {
            $this->db->table('institutional_sections')->insert($sec);
        }

        // 4. Authorities
        $authorities = [
            [
                'name'         => 'Dimitrios Papadopoulos',
                'role_title'   => 'Presidente',
                'category'     => 'directiva',
                'company'      => 'Hellenic Maritime & Logistics Group',
                'bio'          => 'Empresario naviero con más de 30 años de experiencia en el comercio marítimo e inversiones bilaterales entre Grecia y el Cono Sur.',
                'photo_url'    => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                'linkedin_url' => 'https://linkedin.com',
                'order_num'    => 1,
                'is_active'    => 1,
                'created_at'   => $now,
                'updated_at'   => $now,
            ],
            [
                'name'         => 'Dra. Elena Constantinou',
                'role_title'   => 'Vicepresidenta 1ª',
                'category'     => 'directiva',
                'company'      => 'Constantinou & Asociados Law Firm',
                'bio'          => 'Especialista en derecho internacional privado, inversiones extranjeras y regulaciones comerciales de la Unión Europea.',
                'photo_url'    => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
                'linkedin_url' => 'https://linkedin.com',
                'order_num'    => 2,
                'is_active'    => 1,
                'created_at'   => $now,
                'updated_at'   => $now,
            ],
            [
                'name'         => 'Lic. Nikolaos Georgiou',
                'role_title'   => 'Secretario General',
                'category'     => 'directiva',
                'company'      => 'Aegean Agro Foods S.A.',
                'bio'          => 'Licenciado en Comercio Exterior, articulador de rondas de negocios en Eurocámara y representante ante la Red EEN.',
                'photo_url'    => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
                'linkedin_url' => 'https://linkedin.com',
                'order_num'    => 3,
                'is_active'    => 1,
                'created_at'   => $now,
                'updated_at'   => $now,
            ],
            [
                'name'         => 'Ing. Marcos Katsaros',
                'role_title'   => 'Tesorero',
                'category'     => 'directiva',
                'company'      => 'Katsaros Engineering & Energy',
                'bio'          => 'Ingeniero industrial especializado en energías renovables y proyectos de transición energética greco-argentinos.',
                'photo_url'    => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
                'linkedin_url' => 'https://linkedin.com',
                'order_num'    => 4,
                'is_active'    => 1,
                'created_at'   => $now,
                'updated_at'   => $now,
            ],
            [
                'name'         => 'Dra. Sofia Andreadis',
                'role_title'   => 'Directora de Asuntos Eurocámara y EEN',
                'category'     => 'directiva',
                'company'      => 'EuroConsulting Network',
                'bio'          => 'Coordinadora de programas de financiamiento e innovación de la Unión Europea para PYMES socias de CICHA.',
                'photo_url'    => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
                'linkedin_url' => 'https://linkedin.com',
                'order_num'    => 5,
                'is_active'    => 1,
                'created_at'   => $now,
                'updated_at'   => $now,
            ],
        ];

        foreach ($authorities as $auth) {
            $this->db->table('authorities')->insert($auth);
        }

        // 5. Alliances
        $alliances = [
            [
                'name'           => 'EUROCAMARA Argentina',
                'slug'           => 'eurocamara-argentina',
                'category'       => 'institucional',
                'description'    => 'Cámara de Cámaras de Comercio Europeas en Argentina. CICHA es miembro activo desde mayo de 2017, participando en foros económicos bilaterales y comisiones de diálogo público-privado.',
                'website_url'    => 'https://eurocamara.com.ar',
                'logo_url'       => 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=300&q=80',
                'highlight_text' => 'Miembro Activo desde Mayo 2017',
                'order_num'      => 1,
                'is_active'      => 1,
                'created_at'     => $now,
                'updated_at'     => $now,
            ],
            [
                'name'           => 'Enterprise Europe Network (EEN)',
                'slug'           => 'enterprise-europe-network',
                'category'       => 'red_europea',
                'description'    => 'La mayor red mundial de apoyo a pequeñas y medianas empresas con ambiciones internacionales, financiada por la Comisión Europea. CICHA compone el nodo argentino de la red.',
                'website_url'    => 'https://een.ec.europa.eu',
                'logo_url'       => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80',
                'highlight_text' => 'Nodo Oficial en Argentina - Unión Europea',
                'order_num'      => 2,
                'is_active'      => 1,
                'created_at'     => $now,
                'updated_at'     => $now,
            ],
            [
                'name'           => 'UCCEB - Unión de Cámaras Binacionales',
                'slug'           => 'ucceb-argentina',
                'category'       => 'binacional',
                'description'    => 'Unión de Cámaras Comerciales Extranjeras Binacionales en la República Argentina, actualmente compuesta por 32 cámaras. CICHA integra la federación desde hace más de una década.',
                'website_url'    => 'https://ucceb.org.ar',
                'logo_url'       => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80',
                'highlight_text' => 'Miembro Activo desde hace más de una década (32 Cámaras)',
                'order_num'      => 3,
                'is_active'      => 1,
                'created_at'     => $now,
                'updated_at'     => $now,
            ],
            [
                'name'           => 'Embajada de Grecia en Argentina',
                'slug'           => 'embajada-grecia-argentina',
                'category'       => 'diplomatica',
                'description'    => 'Representación diplomática oficial de la República Helénica en Buenos Aires con estrecha colaboración en misiones comerciales y culturales.',
                'website_url'    => 'https://www.mfa.gr/buenosaires',
                'logo_url'       => 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=300&q=80',
                'highlight_text' => 'Reconocimiento Oficial del Gobierno Griego (1998)',
                'order_num'      => 4,
                'is_active'      => 1,
                'created_at'     => $now,
                'updated_at'     => $now,
            ],
        ];

        foreach ($alliances as $all) {
            $this->db->table('alliances')->insert($all);
        }

        // 6. Categories
        $categories = [
            ['id' => 1, 'name' => 'Comercio Bilateral', 'slug' => 'comercio-bilateral', 'type' => 'news', 'created_at' => $now],
            ['id' => 2, 'name' => 'Eurocámara & EEN', 'slug' => 'eurocamara-een', 'type' => 'news', 'created_at' => $now],
            ['id' => 3, 'name' => 'Eventos & Networking', 'slug' => 'eventos-networking', 'type' => 'events', 'created_at' => $now],
            ['id' => 4, 'name' => 'Rondas de Negocios', 'slug' => 'rondas-de-negocios', 'type' => 'events', 'created_at' => $now],
            ['id' => 5, 'name' => 'Oportunidades de Inversión', 'slug' => 'oportunidades-inversion', 'type' => 'opportunities', 'created_at' => $now],
        ];

        foreach ($categories as $cat) {
            $this->db->table('categories')->insert($cat);
        }

        // 7. Articles
        $articles = [
            [
                'category_id'  => 1,
                'title'        => 'Grecia y Argentina profundizan acuerdos de cooperación comercial y energética',
                'slug'         => 'grecia-argentina-acuerdos-comercial-energetica',
                'summary'      => 'Representantes de CICHA, diplomáticos helenos y cámaras empresariales analizaron nuevos incentivos para las exportaciones alimenticias y energías limpias.',
                'content'      => '<p>En el marco del fortalecimiento de las relaciones comerciales entre Grecia y Argentina, la Cámara de Industria y Comercio Heleno Argentina (CICHA) celebró una jornada de trabajo donde se evaluaron las principales complementariedades productivas de ambas naciones.</p><p>Entre los ejes destacados se subrayó el potencial del sector agroalimentario argentino (aceites, legumbres, carnes) y la destacada capacidad logística y naviera de Grecia como puerta de entrada estratégica de productos al sudeste europeo y la cuenca mediterránea.</p>',
                'image_url'    => 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
                'author'       => 'Comisión de Prensa CICHA',
                'published_at' => date('Y-m-d', strtotime('-5 days')),
                'is_featured'  => 1,
                'status'       => 'published',
                'created_at'   => $now,
                'updated_at'   => $now,
            ],
            [
                'category_id'  => 2,
                'title'        => 'CICHA impulsa la participación de PYMES argentinas en la red Enterprise Europe Network (EEN)',
                'slug'         => 'cicha-impulsa-participacion-pymes-red-een',
                'summary'      => 'Como nodo activo de la red EEN de la Unión Europea, CICHA brinda asesoramiento y vinculación tecnológica a empresas interesadas en el mercado europeo.',
                'content'      => '<p>La red Enterprise Europe Network (EEN) es la plataforma de articulación empresarial más extensa del mundo, con presencia en más de 60 países. A través del nodo CICHA, las empresas argentinas socias pueden acceder a búsquedas directas de socios comerciales y tecnológicos en Grecia y toda la Unión Europea.</p>',
                'image_url'    => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
                'author'       => 'Nodo EEN Argentina',
                'published_at' => date('Y-m-d', strtotime('-15 days')),
                'is_featured'  => 1,
                'status'       => 'published',
                'created_at'   => $now,
                'updated_at'   => $now,
            ],
            [
                'category_id'  => 1,
                'title'        => 'Conmemoración de los 35 años de trayectoria institucional de CICHA en Argentina',
                'slug'         => 'conmemoracion-35-anos-cicha-argentina',
                'summary'      => 'Un recorrido histórico desde el reconocimiento por el gobierno argentino en 1989 y griego en 1998 hasta la actualidad.',
                'content'      => '<p>Desde el 1 de noviembre de 1989, cuando la Cámara de Industria y Comercio Heleno Argentina fue reconocida por el gobierno argentino, la institución ha mantenido un compromiso inquebrantable con la ética, el desarrollo sustentable y el diálogo entre sectores públicos y privados.</p>',
                'image_url'    => 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
                'author'       => 'Secretaría General CICHA',
                'published_at' => date('Y-m-d', strtotime('-30 days')),
                'is_featured'  => 0,
                'status'       => 'published',
                'created_at'   => $now,
                'updated_at'   => $now,
            ],
        ];

        foreach ($articles as $art) {
            $this->db->table('articles')->insert($art);
        }

        // 8. Events
        $events = [
            [
                'category_id'      => 4,
                'title'            => 'Foro de Comercio Bilateral Argentina - Grecia 2026',
                'slug'             => 'foro-comercio-bilateral-argentina-grecia-2026',
                'description'      => 'Encuentro anual de empresarios, autoridades diplomáticas y miembros de EUROCAMARA y UCCEB. Oportunidades en agroindustria, servicios basados en el conocimiento y logística naval.',
                'event_date'       => date('Y-m-d H:i:s', strtotime('+15 days 10:00:00')),
                'end_date'         => date('Y-m-d H:i:s', strtotime('+15 days 17:30:00')),
                'location_type'    => 'hibrido',
                'location_address' => 'Sede Eurocámara Argentina / Transmisión en vivo por Zoom',
                'registration_url' => 'https://cicha.com.ar/registro-foro-2026',
                'image_url'        => 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
                'organizer'        => 'CICHA / Eurocámara Argentina / Red EEN',
                'is_featured'      => 1,
                'status'           => 'upcoming',
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
            [
                'category_id'      => 3,
                'title'            => 'Webinar: Cómo exportar al mercado griego y la Unión Europea a través de la Red EEN',
                'slug'             => 'webinar-exportar-mercado-griego-ue-een',
                'description'      => 'Taller práctico dictado por expertos en comercio exterior y normativas sanitarias y aduaneras de la Unión Europea.',
                'event_date'       => date('Y-m-d H:i:s', strtotime('+28 days 15:00:00')),
                'end_date'         => date('Y-m-d H:i:s', strtotime('+28 days 16:30:00')),
                'location_type'    => 'virtual',
                'location_address' => 'Plataforma Virtual CICHA EEN',
                'registration_url' => 'https://cicha.com.ar/webinar-een',
                'image_url'        => 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=1200&q=80',
                'organizer'        => 'Comisión de Comercio Exterior CICHA',
                'is_featured'      => 1,
                'status'           => 'upcoming',
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
        ];

        foreach ($events as $ev) {
            $this->db->table('events')->insert($ev);
        }

        // 9. Members
        $members = [
            [
                'company_name'  => 'Hellenic Shipping & Logistics',
                'slug'          => 'hellenic-shipping-logistics',
                'sector'        => 'Transporte Marítimo y Logística Internacional',
                'description'   => 'Líder en fletes marítimos, consolidación de cargas a granel y logística portuaria entre el Mediterráneo y el Atlántico Sur.',
                'services'      => 'Transporte marítimo internacional, desaduanamiento, depósitos fiscales, asesoramiento logístico.',
                'logo_url'      => 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=300&q=80',
                'website_url'   => 'https://hellenicshipping.com',
                'contact_email' => 'operaciones@hellenicshipping.com',
                'contact_phone' => '+54 11 4800-1122',
                'country'       => 'Argentina / Grecia',
                'is_featured'   => 1,
                'status'        => 'active',
                'created_at'    => $now,
                'updated_at'    => $now,
            ],
            [
                'company_name'  => 'Aegean Olive & Fine Foods S.A.',
                'slug'          => 'aegean-olive-fine-foods',
                'sector'        => 'Agroindustria y Alimentos Premium',
                'description'   => 'Importadora y distribuidora de aceites de oliva con Denominación de Origen Protegida (Kalamata), aceitunas y especialidades griegas en Argentina.',
                'services'      => 'Importación, distribución mayorista, canal horeca, retail gourmet.',
                'logo_url'      => 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80',
                'website_url'   => 'https://aegeanfoods.com.ar',
                'contact_email' => 'ventas@aegeanfoods.com.ar',
                'contact_phone' => '+54 11 4755-3344',
                'country'       => 'Argentina',
                'is_featured'   => 1,
                'status'        => 'active',
                'created_at'    => $now,
                'updated_at'    => $now,
            ],
            [
                'company_name'  => 'Olympus Renewable Energy',
                'slug'          => 'olympus-renewable-energy',
                'sector'        => 'Energías Renovables y Tecnología',
                'description'   => 'Desarrollo de proyectos fotovoltaicos y eólicos con transferencia de tecnología europea y financiamiento bilateral.',
                'services'      => 'Ingeniería EPC, consultoría ambiental, montaje electromecánico de parques solares.',
                'logo_url'      => 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=300&q=80',
                'website_url'   => 'https://olympusenergy.gr',
                'contact_email' => 'latam@olympusenergy.gr',
                'contact_phone' => '+54 11 5233-9000',
                'country'       => 'Grecia / Argentina',
                'is_featured'   => 1,
                'status'        => 'active',
                'created_at'    => $now,
                'updated_at'    => $now,
            ],
            [
                'company_name'  => 'Constantinou Legal & Tax Advisory',
                'slug'          => 'constantinou-legal-tax-advisory',
                'sector'        => 'Servicios Jurídicos y Consultoría Corporativa',
                'description'   => 'Estudio especializado en estructuración societaria, tratados de doble tributación, propiedad intelectual y comercio internacional.',
                'services'      => 'Asesoramiento legal corporativo, fusiones y adquisiciones, radicación de inversiones.',
                'logo_url'      => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80',
                'website_url'   => 'https://constantinou-law.com',
                'contact_email' => 'info@constantinou-law.com',
                'contact_phone' => '+54 11 4312-7788',
                'country'       => 'Argentina',
                'is_featured'   => 1,
                'status'        => 'active',
                'created_at'    => $now,
                'updated_at'    => $now,
            ],
        ];

        foreach ($members as $mem) {
            $this->db->table('members')->insert($mem);
        }

        // 10. Commercial Opportunities
        $opportunities = [
            [
                'title'          => 'Búsqueda de importadores para Aceite de Oliva Extra Virgen DOP Kalamata',
                'slug'           => 'busqueda-importadores-aceite-oliva-kalamata',
                'type'           => 'export',
                'origin_country' => 'Grecia',
                'target_country' => 'Argentina / Cono Sur',
                'sector'         => 'Alimentos Gourmet y Agroindustria',
                'description'    => 'Consorcio de productores de la región del Peloponeso busca socios distribuidores e importadores mayoristas en el mercado argentino con capacidad de distribución en canal retail y gastronómico.',
                'requirements'   => 'Empresa con registro de importador activo en INAL/ANMAT y red logística en principales centros urbanos.',
                'contact_person' => 'Dimitri Papandreou - Agregaduría Comercial',
                'contact_email'  => 'comercio@cicha.com.ar',
                'status'         => 'open',
                'deadline'       => date('Y-m-d', strtotime('+60 days')),
                'created_at'     => $now,
                'updated_at'     => $now,
            ],
            [
                'title'          => 'Oferta exportable de Legumbres y Maní argentino de alta calidad a Grecia',
                'slug'           => 'oferta-legumbres-mani-argentino-grecia',
                'type'           => 'export',
                'origin_country' => 'Argentina',
                'target_country' => 'Grecia / Unión Europea',
                'sector'         => 'Granos y Legumbres',
                'description'    => 'Exportadores argentinos certificados ofrecen garbanzos, porotos alubia y maní confitería para la industria procesadora griega y distribución en el sudeste de Europa.',
                'requirements'   => 'Certificación europea de trazabilidad fitosanitaria y cumplimiento de normativas UE.',
                'contact_person' => 'Lic. Nikolaos Georgiou - CICHA',
                'contact_email'  => 'een@cicha.com.ar',
                'status'         => 'open',
                'deadline'       => date('Y-m-d', strtotime('+90 days')),
                'created_at'     => $now,
                'updated_at'     => $now,
            ],
            [
                'title'          => 'Alianza tecnológica y distribución de Software para Gestión Logística Portuaria',
                'slug'           => 'alianza-software-gestion-logistica-portuaria',
                'type'           => 'partnership',
                'origin_country' => 'Grecia',
                'target_country' => 'Argentina',
                'sector'         => 'Tecnología & Marítimo',
                'description'    => 'Empresa tecnológica con base en El Pireo busca integradores locales en Argentina para implementar soluciones de gestión de flotas y terminales portuarias.',
                'requirements'   => 'Empresas de software y servicios IT con clientes en el sector de comercio exterior y naviero.',
                'contact_person' => 'Red EEN Argentina / CICHA',
                'contact_email'  => 'een@cicha.com.ar',
                'status'         => 'open',
                'deadline'       => date('Y-m-d', strtotime('+45 days')),
                'created_at'     => $now,
                'updated_at'     => $now,
            ],
        ];

        foreach ($opportunities as $opp) {
            $this->db->table('commercial_opportunities')->insert($opp);
        }
    }
}
