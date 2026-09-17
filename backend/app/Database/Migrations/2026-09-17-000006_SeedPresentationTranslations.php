<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SeedPresentationTranslations extends Migration
{
    public function up()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('greek_translations');

        $translations = [
            // 1. Header Banner
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.badge',
                'original_es'     => 'Presentación Institucional',
                'text_el'         => 'Θεσμική Παρουσίαση',
                'text_en'         => 'Institutional Presentation',
                'description'     => 'Insignia superior de la cabecera en Presentación',
                'order_num'       => 1,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.title',
                'original_es'     => 'Cámara de Industria y Comercio Heleno Argentina',
                'text_el'         => 'Ελληνοαργεντινό Επιμελητήριο Βιομηχανίας και Εμπορίου',
                'text_en'         => 'Hellenic Argentine Chamber of Industry and Commerce',
                'description'     => 'Título principal de la página de Presentación',
                'order_num'       => 2,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.subtitle',
                'original_es'     => 'Orígenes, Reconocimientos Oficiales y Redes Estratégicas de CICHA',
                'text_el'         => 'Προέλευση, Επίσημες Αναγνωρίσεις και Στρατηγικά Δίκτυα του CICHA',
                'text_en'         => 'Origins, Official Recognitions and Strategic Networks of CICHA',
                'description'     => 'Subtítulo institucional bajo el título principal',
                'order_num'       => 3,
            ],

            // 2. Tarjeta Destacada - Onassis 1940 & Decretos
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.history_badge',
                'original_es'     => 'Legado Histórico 1940',
                'text_el'         => 'Ιστορική Κληρονομιά 1940',
                'text_en'         => 'Historical Legacy 1940',
                'description'     => 'Insignia de legado histórico 1940',
                'order_num'       => 4,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.history_title',
                'original_es'     => 'Orígenes & Fundación de C.I.C.H.A.',
                'text_el'         => 'Προέλευση & Ίδρυση του C.I.C.H.A.',
                'text_en'         => 'Origins & Foundation of C.I.C.H.A.',
                'description'     => 'Título del bloque fundacional',
                'order_num'       => 5,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.history_p1',
                'original_es'     => 'La Cámara de Industria y Comercio Helénico-Argentina – C.I.C.H.A. fue fundada a principios de la década de 1940 por Aristóteles Onassis y los entonces destacados empresarios griegos de Argentina.',
                'text_el'         => 'Το Ελληνοαργεντινό Εμπορικό και Βιομηχανικό Επιμελητήριο – C.I.C.H.A. ιδρύθηκε στις αρχές της δεκαετίας του 1940 από τον Αριστοτέλη Ωνάση και τους τότε διακεκριμένους Έλληνες επιχειρηματίες της Αργεντινής.',
                'text_en'         => 'The Hellenic-Argentine Chamber of Commerce and Industry – C.I.C.H.A. was founded in the early 1940s by Aristotle Onassis and distinguished Greek entrepreneurs in Argentina at the time.',
                'description'     => 'Primer párrafo fundacional Onassis',
                'order_num'       => 6,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.history_p2',
                'original_es'     => 'En 1988 cobra un nuevo impulso y adquiere el pleno reconocimiento oficial de ambos países, manteniéndose desde entonces activa con una participación creciente en los flujos de comercio e inversiones bilaterales.',
                'text_el'         => 'Το 1988 απέκτησε νέα δυναμική και πλήρη επίσημη αναγνώριση και από τις δύο χώρες, διατηρώντας έκτοτε ενεργό παρουσία με αυξανόμενη συμμετοχή στις ροές διμερούς εμπορίου και επενδύσεων.',
                'text_en'         => 'In 1988 it gained renewed momentum and full official recognition from both nations, maintaining an active presence ever since with growing participation in bilateral trade and investment flows.',
                'description'     => 'Segundo párrafo de refundación 1988',
                'order_num'       => 7,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.decree_ar_title',
                'original_es'     => 'Decreto Argentino (1989)',
                'text_el'         => 'Διάταγμα Αργεντινής (1989)',
                'text_en'         => 'Argentine Decree (1989)',
                'description'     => 'Título del decreto de Argentina',
                'order_num'       => 8,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.decree_ar',
                'original_es'     => 'Reconocimiento por decreto del gobierno argentino el 1 de noviembre de 1989.',
                'text_el'         => 'Αναγνώριση με διάταγμα της κυβέρνησης της Αργεντινής την 1η Νοεμβρίου 1989.',
                'text_en'         => 'Recognition by decree of the Argentine government on November 1, 1989.',
                'description'     => 'Texto explicativo del decreto argentino de 1989',
                'order_num'       => 9,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.decree_gr_title',
                'original_es'     => 'Decreto Helénico (1998)',
                'text_el'         => 'Ελληνικό Προεδρικό Διάταγμα (1998)',
                'text_en'         => 'Hellenic Presidential Decree (1998)',
                'description'     => 'Título del decreto griego',
                'order_num'       => 10,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.decree_gr',
                'original_es'     => 'Reconocimiento por Decreto Presidencial del gobierno griego el 18 de septiembre de 1998.',
                'text_el'         => 'Αναγνώριση με Προεδρικό Διάταγμα της Ελληνικής Κυβέρνησης στις 18 Σεπτεμβρίου 1998.',
                'text_en'         => 'Recognition by Presidential Decree of the Hellenic Government on September 18, 1998.',
                'description'     => 'Texto explicativo del decreto presidencial griego de 1998',
                'order_num'       => 11,
            ],

            // 3. Documento Oficial: Marco Institucional y Trayectoria Bilateral
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.framework_title',
                'original_es'     => 'Marco Institucional y Trayectoria Bilateral',
                'text_el'         => 'Θεσμικό Πλαίσιο και Διμερής Πορεία',
                'text_en'         => 'Institutional Framework and Bilateral Trajectory',
                'description'     => 'Título del documento de presentación',
                'order_num'       => 12,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.framework_subtitle',
                'original_es'     => 'Documento de Presentación de la Cámara',
                'text_el'         => 'Έγγραφο Παρουσίασης του Επιμελητηρίου',
                'text_en'         => 'Chamber Presentation Document',
                'description'     => 'Subtítulo del documento de presentación',
                'order_num'       => 13,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.framework_p1',
                'original_es'     => 'La Cámara de Industria y Comercio Helénico-Argentina – C.I.C.H.A - fue fundada a principios de la década de 1940 por Aristóteles Onassis y los entonces destacados empresarios griegos de Argentina. En 1988, cobra un nuevo impulso y adquiere el reconocimiento, como tal, de ambos países. Desde entonces se mantiene activa con participación creciente en eventos comerciales.',
                'text_el'         => 'Το Ελληνοαργεντινό Εμπορικό και Βιομηχανικό Επιμελητήριο – C.I.C.H.A. ιδρύθηκε στις αρχές της δεκαετίας του 1940 από τον Αριστοτέλη Ωνάση και τους τότε διακεκριμένους Έλληνες επιχειρηματίες της Αργεντινής. Το 1988 απέκτησε νέα δυναμική και επίσημη αναγνώριση και από τις δύο χώρες. Έκτοτε παραμένει ενεργό με αυξανόμενη συμμετοχή σε εμπορικά γεγονότα.',
                'text_en'         => 'The Hellenic-Argentine Chamber of Commerce and Industry – C.I.C.H.A. was founded in the early 1940s by Aristotle Onassis and distinguished Greek entrepreneurs of Argentina at the time. In 1988 it gained new momentum and official recognition from both nations. Since then, it has maintained an active presence with increasing participation in commercial events.',
                'description'     => 'Párrafo 1 del documento institucional',
                'order_num'       => 14,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.framework_p2',
                'original_es'     => 'La Cámara de Industria y Comercio Helénico-Argentina, está reconocida por Decreto Presidencial del gobierno griego del 18 de septiembre de 1998 y por decreto del gobierno argentino el 1 de noviembre de 1989.',
                'text_el'         => 'Το Ελληνοαργεντινό Εμπορικό και Βιομηχανικό Επιμελητήριο αναγνωρίζεται με Προεδρικό Διάταγμα της Ελληνικής Κυβέρνησης της 18ης Σεπτεμβρίου 1998 και με διάταγμα της Κυβέρνησης της Αργεντινής της 1ης Νοεμβρίου 1989.',
                'text_en'         => 'The Hellenic-Argentine Chamber of Commerce and Industry is recognized by Presidential Decree of the Hellenic Government dated September 18, 1998, and by Decree of the Argentine Government dated November 1, 1989.',
                'description'     => 'Párrafo 2 del documento institucional',
                'order_num'       => 15,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.framework_p3',
                'original_es'     => 'Desde mayo de 2017 es miembro activo y parte de la Comisión Directiva de la EUROCAMARA Argentina, y es nudo de las redes EEN (Enterprise Network Europe), EBN (Enterprise Bussines Network) de la Unión Europea. También es miembro del comité de negociación para la celebración del acuerdo UE-MERCOSUR, y el ingreso de Argentina a la OCDE (organización para la Cooperación y el Desarrollo Económico), el TEAM EUROPE de la Embajada de la UE dedicado a instalar inversiones europeas en Argentina, etc.',
                'text_el'         => 'Από τον Μάιο του 2017 είναι ενεργό μέλος και τμήμα του Διοικητικού Συμβουλίου του EUROCAMARA Argentina, και αποτελεί κόμβο των δικτύων EEN (Enterprise Europe Network), EBN (European Business and Innovation Centre Network) της Ευρωπαϊκής Ένωσης. Είναι επίσης μέλος της διαπραγματευτικής επιτροπής για τη σύναψη της συμφωνίας ΕΕ-MERCOSUR, της ένταξης της Αργεντινής στον ΟΟΣΑ (Οργανισμός Οικονομικής Συνεργασίας και Ανάπτυξης), της πρωτοβουλίας TEAM EUROPE της Αντιπροσωπείας της ΕΕ κ.ά.',
                'text_en'         => 'Since May 2017 it is an active member and part of the Board of Directors of EUROCAMARA Argentina, and serves as a node for the EEN (Enterprise Europe Network) and EBN networks of the European Union. It is also a member of the negotiating committee for the EU-MERCOSUR agreement, Argentina\'s accession to the OECD, and the EU Delegation\'s TEAM EUROPE initiative dedicated to facilitating European investment in Argentina.',
                'description'     => 'Párrafo 3 del documento: Eurocámara, EEN, EBN, OCDE',
                'order_num'       => 16,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.framework_p4',
                'original_es'     => 'Desde hace más de dos décadas es miembro activo de la UCCEB (Unión de Cámaras Comerciales Extranjeras Binacionales), que hoy consta de 38 miembros y que, a través de sus miembros, comercializan entre el 95 y el 97% del comercio exterior de Argentina.',
                'text_el'         => 'Για περισσότερες από δύο δεκαετίες είναι ενεργό μέλος της UCCEB (Ένωση Διμερών Ξένων Εμπορικών Επιμελητηρίων), η οποία σήμερα αριθμεί 38 μέλη που διακινούν μεταξύ 95% και 97% του εξωτερικού εμπορίου της Αργεντινής.',
                'text_en'         => 'For over two decades it has been an active member of UCCEB (Union of Foreign Binational Commercial Chambers), which currently comprises 38 members representing between 95% and 97% of Argentina\'s foreign trade.',
                'description'     => 'Párrafo 4 del documento: UCCEB 38 miembros',
                'order_num'       => 17,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.framework_p5',
                'original_es'     => 'La Cámara de Industria y Comercio Helénico-Argentina mantiene vínculos tanto con la Embajada de Grecia en Argentina como con la Embajada de Argentina en Grecia. Además tiene colaboración directa con la Cancillería Argentina, el Ministerio de Relaciones Exteriores de Grecia, y las varias Cámaras Comerciales de Grecia. La Cámara de Industria y Comercio Helénico-Argentina tiene aproximadamente 50 empresas miembros, tanto de Grecia como de Argentina.',
                'text_el'         => 'Το Ελληνοαργεντινό Εμπορικό και Βιομηχανικό Επιμελητήριο διατηρεί στενούς δεσμούς τόσο με την Πρεσβεία της Ελλάδας στην Αργεντινή όσο και με την Πρεσβεία της Αργεντινής στην Ελλάδα. Συνεργάζεται άμεσα με το Υπουργείο Εξωτερικών της Αργεντινής (Cancillería), το Υπουργείο Εξωτερικών της Ελλάδας και διάφορα Εμπορικά Επιμελητήρια της Ελλάδας. Αριθμεί περίπου 50 εταιρείες-μέλη από την Ελλάδα και την Αργεντινή.',
                'text_en'         => 'The Hellenic-Argentine Chamber of Commerce and Industry maintains ties with both the Embassy of Greece in Argentina and the Embassy of Argentina in Greece. It also collaborates directly with the Argentine Ministry of Foreign Affairs, the Hellenic Ministry of Foreign Affairs, and various Chambers of Commerce across Greece. It represents approximately 50 member companies from both nations.',
                'description'     => 'Párrafo 5 del documento: Embajadas, Cancillería y empresas',
                'order_num'       => 18,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.framework_p6',
                'original_es'     => 'La Cámara de Industria y Comercio Helénico-Argentina (C.I.C.H.A.) cada día cobra más importancia y su misión se define de la siguiente manera: La misión de la Cámara es constituir una fuerza creativa entre Grecia y Argentina - en un entorno empresarial que contribuya al desarrollo de nuestra sociedad, enmarcado por la justicia y la igualdad de oportunidades. Impulsar el desarrollo de negocios sostenibles, el comercio bilateral, las inversiones genuinamente productivas, el fomento de la empresa privada y la economía de mercado, todo ello enmarcado desde la responsabilidad, la ética y la transparencia. La organización de Foros para el conocimiento y la facilitación del diálogo entre el sector público y privado.',
                'text_el'         => 'Το Ελληνοαργεντινό Εμπορικό και Βιομηχανικό Επιμελητήριο (C.I.C.H.A.) αποκτά καθημερινά μεγαλύτερη σημασία: Αποστολή του είναι να αποτελεί δημιουργική δύναμη μεταξύ Ελλάδας και Αργεντινής – σε ένα επιχειρηματικό περιβάλλον που συμβάλλει στην ανάπτυξη της κοινωνίας μας με δικαιοσύνη και ίσες ευκαιρίες. Προώθηση της βιώσιμης ανάπτυξης, του διμερούς εμπορίου, των παραγωγικών επενδύσεων και της διαμόρφωσης φόρουμ διαλόγου δημόσιου και ιδιωτικού τομέα.',
                'text_en'         => 'The Hellenic-Argentine Chamber of Commerce and Industry (C.I.C.H.A.) grows in relevance every day: Its mission is to be a creative force between Greece and Argentina – within a business ecosystem that fosters societal development with equity and equal opportunity. Promoting sustainable business growth, bilateral trade, genuine productive investments, and facilitating public-private knowledge forums.',
                'description'     => 'Párrafo 6 del documento: Síntesis de Misión',
                'order_num'       => 19,
            ],

            // 4. Tarjeta Dorada de Misión Institucional
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.mission_badge',
                'original_es'     => 'Misión Institucional',
                'text_el'         => 'Θεσμική Αποστολή',
                'text_en'         => 'Institutional Mission',
                'description'     => 'Insignia de la tarjeta dorada de Misión',
                'order_num'       => 20,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.mission_title',
                'original_es'     => 'Fuerza Creativa entre Grecia y Argentina',
                'text_el'         => 'Δημιουργική Δύναμη μεταξύ Ελλάδας και Αργεντινής',
                'text_en'         => 'Creative Force between Greece and Argentina',
                'description'     => 'Título de la tarjeta dorada de Misión',
                'order_num'       => 21,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.mission_quote',
                'original_es'     => '"Constituir una fuerza creativa entre Grecia y Argentina en un entorno empresarial que contribuya al desarrollo de nuestra sociedad, enmarcado por la justicia y la igualdad de oportunidades. Impulsar el desarrollo de negocios sostenibles, el comercio bilateral, las inversiones genuinamente productivas, el fomento de la empresa privada y la economía de mercado, todo ello enmarcado desde la responsabilidad, la ética y la transparencia."',
                'text_el'         => '«Να αποτελέσουμε μια δημιουργική δύναμη μεταξύ Ελλάδας και Αργεντινής σε ένα επιχειρηματικό περιβάλλον που συμβάλλει στην ανάπτυξη της κοινωνίας μας, με γνώμονα τη δικαιοσύνη και την ισότητα ευκαιριών. Προώθηση της βιώσιμης επιχειρηματικής ανάπτυξης, του διμερούς εμπορίου, των παραγωγικών επενδύσεων, της ιδιωτικής πρωτοβουλίας και της οικονομίας της αγοράς, με υπευθυνότητα, ήθος και διαφάνεια.»',
                'text_en'         => '"To constitute a creative force between Greece and Argentina in a business environment that contributes to the development of our society, framed by justice and equal opportunities. Promoting sustainable business growth, bilateral trade, genuinely productive investments, private initiative, and the market economy, all framed with responsibility, ethics, and transparency."',
                'description'     => 'Cita textual de Misión Institucional en tarjeta dorada',
                'order_num'       => 22,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.check_forums',
                'original_es'     => 'Foros de Conocimiento',
                'text_el'         => 'Φόρουμ Γνώσης',
                'text_en'         => 'Knowledge Forums',
                'description'     => 'Pilar 1: Foros de Conocimiento',
                'order_num'       => 23,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.check_public_private',
                'original_es'     => 'Articulación Público-Privada',
                'text_el'         => 'Δημόσια-Ιδιωτική Συνεργασία',
                'text_en'         => 'Public-Private Articulation',
                'description'     => 'Pilar 2: Articulación Público-Privada',
                'order_num'       => 24,
            ],
            [
                'section'         => 'presentacion',
                'translation_key' => 'presentacion.check_trade',
                'original_es'     => 'Comercio Bilateral Sostenible',
                'text_el'         => 'Βιώσιμο Διμερές Εμπόριο',
                'text_en'         => 'Sustainable Bilateral Trade',
                'description'     => 'Pilar 3: Comercio Bilateral Sostenible',
                'order_num'       => 25,
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
        $builder->where('section', 'presentacion')->delete();
    }
}
