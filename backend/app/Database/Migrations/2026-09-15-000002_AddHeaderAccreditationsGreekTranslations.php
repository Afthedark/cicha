<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddHeaderAccreditationsGreekTranslations extends Migration
{
    public function up()
    {
        $now = date('Y-m-d H:i:s');
        $db = \Config\Database::connect();
        $builder = $db->table('greek_translations');

        $entries = [
            [
                'section'         => 'header',
                'translation_key' => 'header.official_recognition',
                'original_es'     => 'Reconocimiento Oficial: Argentina 1989 • Grecia 1998',
                'text_el'         => 'Επίσημη Αναγνώριση: Αργεντινή 1989 • Ελλάδα 1998',
                'description'     => 'Texto de reconocimiento oficial en la cabecera superior',
                'order_num'       => 2,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'section'         => 'header',
                'translation_key' => 'header.memberships',
                'original_es'     => 'Miembro EUROCAMARA • Nodo EEN Unión Europea • UCCEB (32 Cámaras)',
                'text_el'         => 'Μέλος EUROCAMARA • Κόμβος EEN Ευρωπαϊκής Ένωσης • UCCEB (32 Επιμελητήρια)',
                'description'     => 'Texto de membresías y alianzas en la cabecera superior',
                'order_num'       => 3,
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
        ];

        foreach ($entries as $entry) {
            $exists = $builder->where('translation_key', $entry['translation_key'])->countAllResults();
            if ($exists == 0) {
                $builder->insert($entry);
            } else {
                $builder->where('translation_key', $entry['translation_key'])->update([
                    'original_es' => $entry['original_es'],
                    'text_el'     => $entry['text_el'],
                    'description' => $entry['description'],
                    'order_num'   => $entry['order_num'],
                    'updated_at'  => $now,
                ]);
            }
        }
    }

    public function down()
    {
        $db = \Config\Database::connect();
        $db->table('greek_translations')
            ->whereIn('translation_key', ['header.official_recognition', 'header.memberships'])
            ->delete();
    }
}
