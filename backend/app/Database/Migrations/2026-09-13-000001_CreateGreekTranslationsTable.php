<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateGreekTranslationsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'section' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'default'    => 'general',
            ],
            'translation_key' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'unique'     => true,
            ],
            'original_es' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'text_el' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'description' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
            ],
            'order_num' => [
                'type'       => 'INT',
                'constraint' => 5,
                'default'    => 0,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('section');
        $this->forge->createTable('greek_translations', true);

        // Initial Seed Data with requested Greek translations
        $now = date('Y-m-d H:i:s');
        $seeds = [
            // 1. Header
            [
                'section'         => 'header',
                'translation_key' => 'header.slogan',
                'original_es'     => 'PUENTES QUE GENERAN OPORTUNIDADES',
                'text_el'         => 'ΓΕΦΥΡΕΣ ΠΟΥ ΔΗΜΙΟΥΡΓΟΥΝ ΕΥΚΑΙΡΙΕΣ',
                'description'     => 'Slogan institucional en la cabecera superior',
                'order_num'       => 1,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],

            // 2. Presentación
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.badge',
                'original_es'     => 'Presentación Institucional',
                'text_el'         => 'Θεσμική Παρουσίαση',
                'description'     => 'Badge o etiqueta superior de la página de presentación',
                'order_num'       => 10,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.title',
                'original_es'     => 'Cámara de Industria y Comercio Heleno Argentina',
                'text_el'         => 'Ελληνοαργεντινό Εμπορικό και Βιομηχανικό Επιμελητήριο',
                'description'     => 'Título principal institucional',
                'order_num'       => 11,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.subtitle',
                'original_es'     => 'Orígenes, Reconocimientos Oficiales y Redes Estratégicas de CICHA',
                'text_el'         => 'Προέλευση, Επίσημες Αναγνωρίσεις και Στρατηγικά Δίκτυα του CICHA',
                'description'     => 'Subtítulo institucional',
                'order_num'       => 12,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.history_title',
                'original_es'     => 'Orígenes & Fundación de C.I.C.H.A.',
                'text_el'         => 'Προέλευση & Ίδρυση του C.I.C.H.A.',
                'description'     => 'Título de la tarjeta fundacional de Aristóteles Onassis',
                'order_num'       => 13,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.history_p1',
                'original_es'     => 'La Cámara de Industria y Comercio Helénico-Argentina – C.I.C.H.A. fue fundada a principios de la década de 1940 por Aristóteles Onassis y los entonces destacados empresarios griegos de Argentina. En 1988, cobra un nuevo impulso y adquiere el reconocimiento, como tal, de ambos países. Desde entonces se mantiene activa con participación creciente en eventos comerciales.',
                'text_el'         => 'Το Ελληνοαργεντινό Εμπορικό και Βιομηχανικό Επιμελητήριο – C.I.C.H.A. ιδρύθηκε στις αρχές της δεκαετίας του 1940 από τον Αριστοτέλη Ωνάση και τους τότε διακεκριμένους Έλληνες επιχειρηματίες της Αργεντινής. Το 1988 απέκτησε νέα δυναμική και επίσημη αναγνώριση και από τις δύο χώρες. Έκτοτε παραμένει ενεργό με αυξανόμενη συμμετοχή σε εμπορικά γεγονότα.',
                'description'     => 'Párrafo 1 de la historia fundacional',
                'order_num'       => 14,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.history_p2',
                'original_es'     => 'La Cámara de Industria y Comercio Helénico-Argentina, está reconocida por Decreto Presidencial del gobierno griego del 18 de septiembre de 1998 y por decreto del gobierno argentino el 1 de noviembre de 1989.',
                'text_el'         => 'Το Ελληνοαργεντινό Εμπορικό και Βιομηχανικό Επιμελητήριο αναγνωρίζεται με Προεδρικό Διάταγμα της Ελληνικής Κυβέρνησης της 18ης Σεπτεμβρίου 1998 και με διάταγμα της Κυβέρνησης της Αργεντινής της 1ης Νοεμβρίου 1989.',
                'description'     => 'Párrafo 2 sobre los Decretos Presidenciales',
                'order_num'       => 15,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.mission_p1',
                'original_es'     => 'La Cámara de Industria y Comercio Helénico-Argentina (C.I.C.H.A.) cada día cobra más importancia y su misión se define de la siguiente manera:',
                'text_el'         => 'Το Ελληνοαργεντινό Εμπορικό και Βιομηχανικό Επιμελητήριο (C.I.C.H.A.) αποκτά καθημερινά μεγαλύτερη σημασία και η αποστολή του ορίζεται ως εξής:',
                'description'     => 'Introducción a la misión',
                'order_num'       => 16,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.mission_p2',
                'original_es'     => 'La misión de la Cámara es constituir una fuerza creativa entre Grecia y Argentina - en un entorno empresarial que contribuya al desarrollo de nuestra sociedad, enmarcado por la justicia y la igualdad de oportunidades. Impulsar el desarrollo de negocios sostenibles, el comercio bilateral, las inversiones genuinamente productivas, el fomento de la empresa privada y la economía de mercado, todo ello enmarcado desde la responsabilidad, la ética y la transparencia. La organización de Foros para el conocimiento y la facilitación del diálogo entre el sector público y privado.',
                'text_el'         => 'Η αποστολή του Επιμελητηρίου είναι να αποτελέσει μια δημιουργική δύναμη μεταξύ Ελλάδας και Αργεντινής - σε ένα επιχειρηματικό περιβάλλον που συμβάλλει στην ανάπτυξη της κοινωνίας μας, με γνώμονα τη δικαιοσύνη και την ισότητα ευκαιριών. Προώθηση της βιώσιμης επιχειρηματικής ανάπτυξης, του διμερούς εμπορίου, των παραγωγικών επενδύσεων, της ιδιωτικής πρωτοβουλίας και της οικονομίας της αγοράς, με υπευθυνότητα, ήθος και διαφάνεια.',
                'description'     => 'Declaración formal de la misión estratégica',
                'order_num'       => 17,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],

            // 3. La Cámara
            [
                'section'         => 'la_camara',
                'translation_key' => 'la_camara.headline',
                'original_es'     => 'ARGENTINA Y GRECIA, MÁS CERCA, MÁS LEJOS JUNTOS',
                'text_el'         => 'ΑΡΓΕΝΤΙΝΗ ΚΑΙ ΕΛΛΑΔΑ, ΠΙΟ ΚΟΝΤΑ, ΠΙΟ ΜΑΚΡΙΑ ΜΑΖΙ',
                'description'     => 'Titular principal del banner institucional',
                'order_num'       => 20,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'section'         => 'la_camara',
                'translation_key' => 'la_camara.motto',
                'original_es'     => 'Dos culturas un mismo futuro',
                'text_el'         => 'Δύο πολιτισμοί ένα κοινό μέλλον',
                'description'     => 'Lema institucional',
                'order_num'       => 21,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'section'         => 'la_camara',
                'translation_key' => 'la_camara.pillar1',
                'original_es'     => 'COMERCIO BILATERAL',
                'text_el'         => 'ΔΙΜΕΡΕΣ ΕΜΠΟΡΙΟ',
                'description'     => 'Pilar institucional 1',
                'order_num'       => 22,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'section'         => 'la_camara',
                'translation_key' => 'la_camara.pillar2',
                'original_es'     => 'DESARROLLO SUSTENTABLE',
                'text_el'         => 'ΒΙΩΣΙΜΗ ΑΝΑΠΤΥΞΗ',
                'description'     => 'Pilar institucional 2',
                'order_num'       => 23,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'section'         => 'la_camara',
                'translation_key' => 'la_camara.pillar3',
                'original_es'     => 'INNOVACIÓN Y CONOCIMIENTO',
                'text_el'         => 'ΚΑΙΝΟΤΟΜΙΑ ΚΑΙ ΓΝΩΣΗ',
                'description'     => 'Pilar institucional 3',
                'order_num'       => 24,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'section'         => 'la_camara',
                'translation_key' => 'la_camara.pillar4',
                'original_es'     => 'REDES INTERNACIONALES',
                'text_el'         => 'ΔΙΕΘΝΗ ΔΙΚΤΥΑ',
                'description'     => 'Pilar institucional 4',
                'order_num'       => 25,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'section'         => 'la_camara',
                'translation_key' => 'la_camara.authorities_title',
                'original_es'     => 'COMITÉ DIRECTIVO & COMISIÓN REVISORA',
                'text_el'         => 'ΔΙΟΙΚΗΤΙΚΟ ΣΥΜΒΟΥΛΙΟ & ΕΛΕΓΚΤΙΚΗ ΕΠΙΤΡΟΠΗ',
                'description'     => 'Título de la sección de autoridades',
                'order_num'       => 26,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'section'         => 'la_camara',
                'translation_key' => 'la_camara.authorities_subtitle',
                'original_es'     => 'Nómina oficial de directivos y empresarios comprometidos con el intercambio bilateral heleno-argentino.',
                'text_el'         => 'Επίσημος κατάλογος στελεχών και επιχειρηματιών δεσμευμένων στη διμερή ελληνοαργεντινή ανταλλαγή.',
                'description'     => 'Subtítulo de la sección de autoridades',
                'order_num'       => 27,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],

            // 4. Inicio / Home
            [
                'section'         => 'home',
                'translation_key' => 'home.hero_welcome',
                'original_es'     => 'CÁMARA DE INDUSTRIA Y COMERCIO HELENO ARGENTINA',
                'text_el'         => 'ΕΛΛΗΝΟΑΡΓΕΝΤΙΝΟ ΕΜΠΟΡΙΚΟ ΚΑΙ ΒΙΟΜΗΧΑΝΙΚΟ ΕΠΙΜΕΛΗΤΗΡΙΟ',
                'description'     => 'Título de bienvenida en el Home',
                'order_num'       => 30,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.hero_tagline',
                'original_es'     => 'Promoviendo el comercio, las inversiones y los lazos culturales y empresariales entre la República Argentina y la República Helénica desde 1940.',
                'text_el'         => 'Προώθηση του εμπορίου, των επενδύσεων και των πολιτιστικών και επιχειρηματικών δεσμών μεταξύ της Δημοκρατίας της Αργεντινής και της Ελληνικής Δημοκρατίας από το 1940.',
                'description'     => 'Bajada o texto introductorio en el Home',
                'order_num'       => 31,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],

            // 5. Contacto
            [
                'section'         => 'contacto',
                'translation_key' => 'contacto.title',
                'original_es'     => 'Contacto Institucional',
                'text_el'         => 'Θεσμική Επικοινωνία',
                'description'     => 'Título de la página de contacto',
                'order_num'       => 40,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'section'         => 'contacto',
                'translation_key' => 'contacto.subtitle',
                'original_es'     => 'Estamos a su disposición para consultas comerciales, relaciones institucionales y asesoramiento bilateral.',
                'text_el'         => 'Είμαστε στη διάθεσή σας για εμπορικές πληροφορίες, θεσμικές σχέσεις και διμερή υποστήριξη.',
                'description'     => 'Subtítulo de la página de contacto',
                'order_num'       => 41,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
        ];

        $this->db->table('greek_translations')->insertBatch($seeds);
    }

    public function down()
    {
        $this->forge->dropTable('greek_translations', true);
    }
}
