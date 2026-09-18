<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SeedHomeOpportunitiesSectionAndTranslations extends Migration
{
    public function up()
    {
        $db = \Config\Database::connect();
        $now = date('Y-m-d H:i:s');

        // 1. Insertar o actualizar la sección institucional para Inicio (Oportunidades Comerciales Bilaterales)
        $existingSec = $db->table('institutional_sections')
            ->where('section_key', 'home_oportunidades')
            ->get()
            ->getRowArray();

        $secData = [
            'section_key' => 'home_oportunidades',
            'page_target' => 'home',
            'title'       => 'Oportunidades Comerciales Bilaterales',
            'subtitle'    => 'Comercio Exterior & Inversión Egea',
            'content'     => 'Demandas y ofertas comerciales activas gestionadas a través de CICHA y el nodo Enterprise Europe Network.',
            'icon_name'   => 'TrendingUp',
            'order_num'   => 3,
            'is_active'   => 1,
            'updated_at'  => $now,
        ];

        if ($existingSec) {
            $db->table('institutional_sections')
                ->where('id', $existingSec['id'])
                ->update($secData);
        } else {
            $db->table('institutional_sections')->insert($secData);
        }

        // 2. Asegurar claves en la tabla de traducciones manuales (greek_translations)
        $translations = [
            [
                'section'         => 'home',
                'translation_key' => 'home.opp_tag',
                'original_es'     => 'Comercio Exterior & Inversión Egea',
                'text_el'         => 'Εξωτερικό Εμπόριο & Επενδύσεις Αιγαίου',
                'text_en'         => 'Foreign Trade & Aegean Investment',
                'description'     => 'Tag superior de la sección de Oportunidades Comerciales en Inicio',
                'order_num'       => 28,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.opp_title',
                'original_es'     => 'Oportunidades Comerciales Bilaterales',
                'text_el'         => 'Διμερείς Εμπορικές Ευκαιρίες',
                'text_en'         => 'Bilateral Commercial Opportunities',
                'description'     => 'Título principal de la sección de Oportunidades Comerciales en Inicio',
                'order_num'       => 29,
            ],
            [
                'section'         => 'home',
                'translation_key' => 'home.opp_subtitle',
                'original_es'     => 'Demandas y ofertas comerciales activas gestionadas a través de CICHA y el nodo Enterprise Europe Network.',
                'text_el'         => 'Ενεργές εμπορικές ζητήσεις και προσφορές που διαχειρίζεται το CICHA και ο κόμβος Enterprise Europe Network.',
                'text_en'         => 'Active commercial demands and offers managed through CICHA and the Enterprise Europe Network node.',
                'description'     => 'Subtítulo / Bajada de la sección de Oportunidades Comerciales en Inicio',
                'order_num'       => 30,
            ],
        ];

        foreach ($translations as $tr) {
            $existingTr = $db->table('greek_translations')
                ->where('translation_key', $tr['translation_key'])
                ->get()
                ->getRowArray();

            if ($existingTr) {
                $db->table('greek_translations')
                    ->where('id', $existingTr['id'])
                    ->update([
                        'section'     => $tr['section'],
                        'original_es' => $tr['original_es'],
                        'description' => $tr['description'],
                        'updated_at'  => $now,
                    ]);
            } else {
                $tr['created_at'] = $now;
                $tr['updated_at'] = $now;
                $db->table('greek_translations')->insert($tr);
            }
        }
    }

    public function down()
    {
        $db = \Config\Database::connect();
        $db->table('institutional_sections')->where('section_key', 'home_oportunidades')->delete();
    }
}
