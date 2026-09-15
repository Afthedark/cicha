<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddEnglishToTranslationsTable extends Migration
{
    public function up()
    {
        // Add text_en column to greek_translations table if not exists
        $db = \Config\Database::connect();
        $fields = $db->getFieldNames('greek_translations');

        if (!in_array('text_en', $fields)) {
            $this->forge->addColumn('greek_translations', [
                'text_en' => [
                    'type' => 'TEXT',
                    'null' => true,
                    'after' => 'text_el',
                ],
            ]);
        }

        // Seed default English translations
        $englishTranslations = [
            // 1. Header
            'header.slogan' => 'BRIDGES THAT CREATE OPPORTUNITIES',
            'header.official_recognition' => 'Official Recognition: Argentina 1989 • Greece 1998',
            'header.memberships' => 'EUROCAMARA Member • European Union EEN Node • UCCEB (32 Chambers)',

            // 2. Presentación
            'presentacion.badge' => 'Institutional Presentation',
            'presentacion.title' => 'Hellenic-Argentine Chamber of Industry and Commerce',
            'presentacion.subtitle' => 'Origins, Official Recognitions and Strategic Networks of CICHA',
            'presentacion.history_title' => 'Origins & Founding of C.I.C.H.A.',
            'presentacion.history_p1' => 'The Hellenic-Argentine Chamber of Industry and Commerce – C.I.C.H.A. was founded in the early 1940s by Aristotle Onassis and the prominent Greek businessmen of Argentina at the time. In 1988, it gained renewed momentum and formal recognition from both nations. Since then, it has remained active with growing participation in commercial events.',
            'presentacion.history_p2' => 'The Hellenic-Argentine Chamber of Industry and Commerce is officially recognized by Presidential Decree of the Greek Government dated September 18, 1998, and by Decree of the Argentine Government on November 1, 1989.',
            'presentacion.mission_p1' => 'The Hellenic-Argentine Chamber of Industry and Commerce (C.I.C.H.A.) gains greater importance every day, and its mission is defined as follows:',
            'presentacion.mission_p2' => 'The Chamber\'s mission is to be a creative force between Greece and Argentina - in a business environment that fosters social development, framed by justice and equal opportunities. Promoting sustainable business development, bilateral trade, productive investments, private enterprise, and the market economy, all based on responsibility, ethics, and transparency. Organizing Forums for knowledge and facilitating dialogue between public and private sectors.',

            // 3. La Cámara
            'la_camara.headline' => 'ARGENTINA AND GREECE, CLOSER, FURTHER TOGETHER',
            'la_camara.motto' => 'Two cultures, one shared future',
            'la_camara.pillar1' => 'BILATERAL TRADE',
            'la_camara.pillar2' => 'SUSTAINABLE DEVELOPMENT',
            'la_camara.pillar3' => 'INNOVATION AND KNOWLEDGE',
            'la_camara.pillar4' => 'INTERNATIONAL NETWORKS',
            'la_camara.authorities_title' => 'BOARD OF DIRECTORS & AUDIT COMMITTEE',
            'la_camara.authorities_subtitle' => 'Official roster of executives and business leaders committed to Hellenic-Argentine bilateral exchange.',

            // 4. Inicio / Home
            'home.hero_welcome' => 'HELLENIC-ARGENTINE CHAMBER OF INDUSTRY AND COMMERCE',
            'home.hero_tagline' => 'Promoting trade, investments, and cultural and business ties between the Argentine Republic and the Hellenic Republic since 1940.',

            // 5. Contacto
            'contacto.title' => 'Institutional Contact',
            'contacto.subtitle' => 'We are at your disposal for commercial inquiries, institutional relations, and bilateral advice.',
        ];

        $builder = $db->table('greek_translations');
        $now = date('Y-m-d H:i:s');

        foreach ($englishTranslations as $key => $textEn) {
            $builder->where('translation_key', $key)->update([
                'text_en'    => $textEn,
                'updated_at' => $now,
            ]);
        }
    }

    public function down()
    {
        $db = \Config\Database::connect();
        $fields = $db->getFieldNames('greek_translations');
        if (in_array('text_en', $fields)) {
            $this->forge->dropColumn('greek_translations', 'text_en');
        }
    }
}
