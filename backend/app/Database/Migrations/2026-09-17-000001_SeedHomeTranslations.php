<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SeedHomeTranslations extends Migration
{
    public function up()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('greek_translations');

        $translations = [
            // Top Title
            [
                'section'         => 'home',
                'translation_key' => 'home.top_title',
                'original_es'     => 'CÁMARA DE INDUSTRIA Y COMERCIO HELENO ARGENTINA',
                'text_el'         => 'ΕΛΛΗΝΟΑΡΓΕΝΤΙΝΟ ΕΠΙΜΕΛΗΤΗΡΙΟ ΒΙΟΜΗΧΑΝΙΑΣ ΚΑΙ ΕΜΠΟΡΙΟΥ',
                'text_en'         => 'HELLENIC ARGENTINE CHAMBER OF INDUSTRY AND COMMERCE',
                'description'     => 'Título institucional superior en la página de inicio',
                'order_num'       => 1,
            ],
            // Reconocimientos Oficiales
            [
                'section'         => 'home',
                'translation_key' => 'home.recog_title',
                'original_es'     => 'Reconocimientos Oficiales',
                'text_el'         => 'Επίσημες Αναγνωρίσεις',
                'text_en'         => 'Official Recognitions',
                'description'     => 'Encabezado de la barra de reconocimientos oficiales',
                'order_num'       => 2,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.recog_arg_label',
                'original_es'     => 'Gobierno Argentino:',
                'text_el'         => 'Κυβέρνηση της Αργεντινής:',
                'text_en'         => 'Argentine Government:',
                'description'     => 'Etiqueta de reconocimiento del Gobierno Argentino',
                'order_num'       => 3,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.recog_arg_date',
                'original_es'     => '1 de Noviembre 1989',
                'text_el'         => '1 Νοεμβρίου 1989',
                'text_en'         => 'November 1, 1989',
                'description'     => 'Fecha o decreto de reconocimiento del Gobierno Argentino',
                'order_num'       => 4,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.recog_gr_label',
                'original_es'     => 'Gobierno Griego:',
                'text_el'         => 'Ελληνική Κυβέρνηση:',
                'text_en'         => 'Greek Government:',
                'description'     => 'Etiqueta de reconocimiento del Gobierno Griego',
                'order_num'       => 5,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.recog_gr_date',
                'original_es'     => '18 de Septiembre 1998',
                'text_el'         => '18 Σεπτεμβρίου 1998',
                'text_en'         => 'September 18, 1998',
                'description'     => 'Fecha o decreto de reconocimiento del Gobierno Griego',
                'order_num'       => 6,
            ],
            // Hero Bilateral & Párrafos
            [
                'section'         => 'home',
                'translation_key' => 'home.hero_title',
                'original_es'     => 'Impulsando el Comercio Bilateral e Inversiones entre Grecia y Argentina',
                'text_el'         => 'Προώθηση του Διμερούς Εμπορίου και των Επενδύσεων μεταξύ Ελλάδας και Αργεντινής',
                'text_en'         => 'Promoting Bilateral Trade and Investments between Greece and Argentina',
                'description'     => 'Título principal de la sección institucional Hero',
                'order_num'       => 7,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.hero_p1',
                'original_es'     => 'La Cámara de Industria y Comercio Heleno Argentina, desde Mayo 2017 es miembro activo de la EUROCAMARA Argentina, y compone nodo de la red EEN (Europe Enterprise Network) de la Unión Europea.',
                'text_el'         => 'Το Ελληνοαργεντινό Επιμελητήριο Βιομηχανίας και Εμπορίου, από τον Μάιο του 2017 είναι ενεργό μέλος του EUROCAMARA Argentina, και αποτελεί κόμβο του δικτύου EEN (Enterprise Europe Network) της Ευρωπαϊκής Ένωσης.',
                'text_en'         => 'The Hellenic Argentine Chamber of Industry and Commerce, since May 2017 is an active member of EUROCAMARA Argentina, and serves as a node of the European Union\'s EEN (Enterprise Europe Network).',
                'description'     => 'Primer párrafo institucional del Hero',
                'order_num'       => 8,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.hero_p2',
                'original_es'     => 'Desde hace más de una década, es miembro activo de la UCCEB (Unión de Cámaras Comerciales Extranjeras Binacionales), compuesta actualmente de 32 cámaras.',
                'text_el'         => 'Για περισσότερο από μια δεκαετία, είναι ενεργό μέλος της UCCEB (Ένωση Διμερών Ξένων Εμπορικών Επιμελητηρίων), η οποία αποτελείται επί του παρόντος από 32 επιμελητήρια.',
                'text_en'         => 'For more than a decade, it has been an active member of UCCEB (Union of Foreign Binational Commercial Chambers), currently comprising 32 chambers.',
                'description'     => 'Segundo párrafo institucional del Hero',
                'order_num'       => 9,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.hero_p3',
                'original_es'     => 'La Cámara de Industria y Comercio Heleno Argentina, reconocida por el gobierno griego el 18 de septiembre de 1998, y por el gobierno argentino el 1 de noviembre de 1989, cada día está tomando mayor relevancia.',
                'text_el'         => 'Το Ελληνοαργεντινό Επιμελητήριο Βιομηχανίας και Εμπορίου, αναγνωρισμένο από την ελληνική κυβέρνηση στις 18 Σεπτεμβρίου 1998 και από την κυβέρνηση της Αργεντινής την 1η Νοεμβρίου 1989, αποκτά καθημερινά μεγαλύτερη σημασία.',
                'text_en'         => 'The Hellenic Argentine Chamber of Industry and Commerce, recognized by the Greek government on September 18, 1998, and by the Argentine government on November 1, 1989, is gaining greater relevance every day.',
                'description'     => 'Tercer párrafo institucional del Hero',
                'order_num'       => 10,
            ],
            // Nodos Estratégicos (Checks)
            [
                'section'         => 'home',
                'translation_key' => 'home.check_eurocamara',
                'original_es'     => 'Miembro EUROCAMARA (2017)',
                'text_el'         => 'Μέλος EUROCAMARA (2017)',
                'text_en'         => 'EUROCAMARA Member (2017)',
                'description'     => 'Insignia de membresía Eurocámara',
                'order_num'       => 11,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.check_een',
                'original_es'     => 'Nodo EEN Unión Europea',
                'text_el'         => 'Κόμβος EEN Ευρωπαϊκής Ένωσης',
                'text_en'         => 'European Union EEN Node',
                'description'     => 'Insignia de nodo Enterprise Europe Network',
                'order_num'       => 12,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.check_ucceb',
                'original_es'     => 'Miembro UCCEB (32 Cámaras)',
                'text_el'         => 'Μέλος UCCEB (32 Επιμελητήρια)',
                'text_en'         => 'UCCEB Member (32 Chambers)',
                'description'     => 'Insignia de membresía UCCEB',
                'order_num'       => 13,
            ],
            // Tarjetas Columna Derecha (Trayectoria & Contadores)
            [
                'section'         => 'home',
                'translation_key' => 'home.stats_card_title',
                'original_es'     => 'Trayectoria & Representación',
                'text_el'         => 'Πορεία & Εκπροσώπηση',
                'text_en'         => 'Trajectory & Representation',
                'description'     => 'Título de la tarjeta de estadísticas y trayectoria',
                'order_num'       => 14,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.stats_card_badge',
                'original_es'     => 'Oficial',
                'text_el'         => 'Επίσημο',
                'text_en'         => 'Official',
                'description'     => 'Badge de estatus en tarjeta de trayectoria',
                'order_num'       => 15,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.stats_years_label',
                'original_es'     => 'Años de Trayectoria Bilateral (1989)',
                'text_el'         => 'Χρόνια Διμερούς Πορείας (1989)',
                'text_en'         => 'Years of Bilateral Trajectory (1989)',
                'description'     => 'Etiqueta del contador de años de trayectoria',
                'order_num'       => 16,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.stats_chambers_label',
                'original_es'     => 'Cámaras Binacionales en UCCEB',
                'text_el'         => 'Διμερή Επιμελητήρια στο UCCEB',
                'text_en'         => 'Binational Chambers in UCCEB',
                'description'     => 'Etiqueta del contador de cámaras UCCEB',
                'order_num'       => 17,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.stats_countries_label',
                'original_es'     => 'Países en Red Enterprise Europe Network',
                'text_el'         => 'Χώρες στο Δίκτυο Enterprise Europe Network',
                'text_en'         => 'Countries in Enterprise Europe Network',
                'description'     => 'Etiqueta del contador de países EEN',
                'order_num'       => 18,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.stats_public_private_label',
                'original_es'     => 'Articulación Público-Privada',
                'text_el'         => 'Δημόσια-Ιδιωτική Συνεργασία',
                'text_en'         => 'Public-Private Articulation',
                'description'     => 'Etiqueta del contador 100% articulación público-privada',
                'order_num'       => 19,
            ],
            // Tarjeta Agenda Bilateral
            [
                'section'         => 'home',
                'translation_key' => 'home.agenda_card_title',
                'original_es'     => 'Agenda Bilateral',
                'text_el'         => 'Διμερής Ατζέντα',
                'text_en'         => 'Bilateral Agenda',
                'description'     => 'Título de la tarjeta de agenda bilateral',
                'order_num'       => 20,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.agenda_card_subtitle',
                'original_es'     => 'Próximos foros y encuentros oficiales',
                'text_el'         => 'Προσεχή φόρουμ και επίσημες συναντήσεις',
                'text_en'         => 'Upcoming forums and official meetings',
                'description'     => 'Subtítulo de la tarjeta de agenda bilateral',
                'order_num'       => 21,
            ],
            // Misión & Objeto
            [
                'section'         => 'home',
                'translation_key' => 'home.mission_title',
                'original_es'     => 'Nuestra Misión',
                'text_el'         => 'Η Αποστολή μας',
                'text_en'         => 'Our Mission',
                'description'     => 'Título del bloque de Misión',
                'order_num'       => 22,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.mission_subtitle',
                'original_es'     => 'Fuerza creadora para el desarrollo bilateral equitativo',
                'text_el'         => 'Δημιουργική δύναμη για δίκαιη διμερή ανάπτυξη',
                'text_en'         => 'Creative force for equitable bilateral development',
                'description'     => 'Subtítulo del bloque de Misión',
                'order_num'       => 23,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.mission_text',
                'original_es'     => 'La Cámara de Industria y Comercio Heleno Argentina es una fuerza creadora e impulsora que fomenta el desarrollo socioeconómico de sus miembros, mediante la representación, prestación de servicios de excelencia, promoción de oportunidades de negocios, comercio e inversión bilateral, y el fortalecimiento continuo de los lazos culturales, institucionales y comerciales entre la República Helénica y la República Argentina.',
                'text_el'         => 'Το Ελληνοαργεντινό Επιμελητήριο Βιομηχανίας και Εμπορίου αποτελεί δημιουργική και κινητήρια δύναμη που προάγει την κοινωνικοοικονομική ανάπτυξη των μελών του, μέσω της εκπροσώπησης, της παροχής υπηρεσιών αριστείας, της προώθησης επιχειρηματικών ευκαιριών, του εμπορίου και των διμερών επενδύσεων, καθώς και της συνεχούς ενίσχυσης των πολιτιστικών, θεσμικών και εμπορικών δεσμών μεταξύ της Ελληνικής Δημοκρατίας και της Δημοκρατίας της Αργεντινής.',
                'text_en'         => 'The Hellenic Argentine Chamber of Industry and Commerce is a creative and driving force that fosters the socioeconomic development of its members through representation, provision of excellence services, promotion of business opportunities, bilateral trade and investment, and the continuous strengthening of cultural, institutional, and commercial ties between the Hellenic Republic and the Argentine Republic.',
                'description'     => 'Texto descriptivo completo de la Misión institucional',
                'order_num'       => 24,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.object_title',
                'original_es'     => 'Objeto de la Cámara',
                'text_el'         => 'Σκοπός του Επιμελητηρίου',
                'text_en'         => 'Chamber\'s Purpose',
                'description'     => 'Título del bloque de Objeto',
                'order_num'       => 25,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.object_subtitle',
                'original_es'     => 'Representación y articulación del empresariado heleno y bilateral',
                'text_el'         => 'Εκπροσώπηση και διάρθρωση του ελληνικού και διμερούς επιχειρηματικού κόσμου',
                'text_en'         => 'Representation and coordination of Hellenic and bilateral business community',
                'description'     => 'Subtítulo del bloque de Objeto',
                'order_num'       => 26,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.object_text',
                'original_es'     => 'Nucleamos a personas humanas y jurídicas, de origen griego o vinculadas a la actividad comercial e industrial con Grecia, para la defensa de sus legítimos intereses gremiales y comerciales. Articulamos gestiones ante organismos públicos y privados, promovemos el arbitraje mercantil, facilitamos la radicación de inversiones, y fomentamos activamente la cooperación científica, técnica, cultural y social entre ambas naciones.',
                'text_el'         => 'Συσπειρώνουμε φυσικά και νομικά πρόσωπα, ελληνικής καταγωγής ή συνδεδεμένα με την εμπορική και βιομηχανική δραστηριότητα με την Ελλάδα, για την προάσπιση των νόμιμων συνδικαλιστικών και εμπορικών τους συμφερόντων. Συντονίζουμε ενέργειες ενώπιον δημόσιων και ιδιωτικών φορέων, προωθούμε την εμπορική διαιτησία, διευκολύνουμε την εγκατάσταση επενδύσεων και ενθαρρύνουμε ενεργά την επιστημονική, τεχνική, πολιτιστική και κοινωνική συνεργασία μεταξύ των δύο εθνών.',
                'text_en'         => 'We bring together natural and legal persons of Greek origin or linked to commercial and industrial activity with Greece, for the defense of their legitimate trade and business interests. We coordinate actions before public and private bodies, promote commercial arbitration, facilitate investment placement, and actively encourage scientific, technical, cultural, and social cooperation between both nations.',
                'description'     => 'Texto descriptivo completo del Objeto de la Cámara',
                'order_num'       => 27,
            ],
            // Oportunidades Comerciales
            [
                'section'         => 'home',
                'translation_key' => 'home.opp_tag',
                'original_es'     => 'Comercio Exterior & Inversión Egea',
                'text_el'         => 'Εξωτερικό Εμπόριο & Επενδύσεις Αιγαίου',
                'text_en'         => 'Foreign Trade & Aegean Investment',
                'description'     => 'Tag superior de Oportunidades Comerciales',
                'order_num'       => 28,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.opp_title',
                'original_es'     => 'Oportunidades Comerciales Bilaterales',
                'text_el'         => 'Διμερείς Εμπορικές Ευκαιρίες',
                'text_en'         => 'Bilateral Commercial Opportunities',
                'description'     => 'Título de la sección de Oportunidades Comerciales',
                'order_num'       => 29,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.opp_subtitle',
                'original_es'     => 'Demandas y ofertas comerciales activas gestionadas a través de CICHA y el nodo Enterprise Europe Network.',
                'text_el'         => 'Ενεργές εμπορικές ζητήσεις και προσφορές που διαχειρίζεται το CICHA και ο κόμβος Enterprise Europe Network.',
                'text_en'         => 'Active commercial demands and offers managed through CICHA and the Enterprise Europe Network node.',
                'description'     => 'Subtítulo de la sección de Oportunidades Comerciales',
                'order_num'       => 30,
            ],
            // Noticias & Próximos Eventos
            [
                'section'         => 'home',
                'translation_key' => 'home.news_tag',
                'original_es'     => 'Actualidad',
                'text_el'         => 'Επικαιρότητα',
                'text_en'         => 'Latest News',
                'description'     => 'Tag de la sección de Noticias',
                'order_num'       => 31,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.news_title',
                'original_es'     => 'Noticias & Comunicados',
                'text_el'         => 'Νέα & Ανακοινώσεις',
                'text_en'         => 'News & Press Releases',
                'description'     => 'Título de la sección de Noticias',
                'order_num'       => 32,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.events_tag',
                'original_es'     => 'Agenda',
                'text_el'         => 'Ατζέντα',
                'text_en'         => 'Agenda',
                'description'     => 'Tag de la sección de Próximos Eventos',
                'order_num'       => 33,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.events_title',
                'original_es'     => 'Próximos Eventos',
                'text_el'         => 'Προσεχείς Εκδηλώσεις',
                'text_en'         => 'Upcoming Events',
                'description'     => 'Título de la sección de Próximos Eventos',
                'order_num'       => 34,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.events_empty',
                'original_es'     => 'No hay eventos programados en este momento.',
                'text_el'         => 'Δεν υπάρχουν προγραμματισμένες εκδηλώσεις αυτή τη στιγμή.',
                'text_en'         => 'There are no scheduled events at this time.',
                'description'     => 'Mensaje cuando no hay eventos próximos',
                'order_num'       => 35,
            ],
            // Banner de Comunidad Inferior
            [
                'section'         => 'home',
                'translation_key' => 'home.community_badge',
                'original_es'     => 'Comunidad Empresarial',
                'text_el'         => 'Επιχειρηματική Κοινότητα',
                'text_en'         => 'Business Community',
                'description'     => 'Badge del banner inferior de membresía',
                'order_num'       => 36,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.community_title',
                'original_es'     => 'Súmese a la Red Empresarial Heleno Argentina',
                'text_el'         => 'Γίνετε μέλος του Ελληνοαργεντινού Επιχειρηματικού Δικτύου',
                'text_en'         => 'Join the Hellenic Argentine Business Network',
                'description'     => 'Título principal del banner inferior de membresía',
                'order_num'       => 37,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.community_subtitle',
                'original_es'     => 'Integre una comunidad influyente con acceso a Eurocámara, rondas comerciales de la Unión Europea y vínculos institucionales directos con Grecia y el Cono Sur.',
                'text_el'         => 'Ενταχθείτε σε μια κοινότητα με επιρροή, με πρόσβαση στο Eurocámara, επιχειρηματικούς γύρους της Ευρωπαϊκής Ένωσης και άμεσους θεσμικούς δεσμούς με την Ελλάδα και τον Νότιο Κώνο.',
                'text_en'         => 'Join an influential community with access to Eurochamber, European Union trade missions, and direct institutional links with Greece and the Southern Cone.',
                'description'     => 'Subtítulo del banner inferior de membresía',
                'order_num'       => 38,
            ],
        ];

        foreach ($translations as $row) {
            $existing = $builder->where('translation_key', $row['translation_key'])->get()->getRow();
            if ($existing) {
                $builder->where('translation_key', $row['translation_key'])->update([
                    'section'     => $row['section'],
                    'original_es' => $row['original_es'],
                    'text_el'     => $row['text_el'],
                    'text_en'     => $row['text_en'],
                    'description' => $row['description'],
                    'order_num'   => $row['order_num'],
                    'updated_at'  => date('Y-m-d H:i:s'),
                ]);
            } else {
                $row['created_at'] = date('Y-m-d H:i:s');
                $row['updated_at'] = date('Y-m-d H:i:s');
                $builder->insert($row);
            }
        }
    }

    public function down()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('greek_translations');
        $builder->where('section', 'home')->delete();
    }
}
