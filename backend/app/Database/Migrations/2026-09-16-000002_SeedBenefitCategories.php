<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SeedBenefitCategories extends Migration
{
    public function up()
    {
        // Default categories for partner benefits / convenios
        $defaultCategories = [
            'Logística & Transporte',
            'Networking Internacional',
            'Servicios Profesionales',
            'Comercio Exterior',
            'Asesoría Legal & Tributaria',
            'Hotelería & Eventos',
            'Comercial',
        ];

        $now = date('Y-m-d H:i:s');
        foreach ($defaultCategories as $name) {
            $slug = url_title($name, '-', true);
            $existing = $this->db->table('categories')
                ->where('type', 'benefits')
                ->where('slug', $slug)
                ->get()
                ->getRowArray();

            if (!$existing) {
                $this->db->table('categories')->insert([
                    'name'       => $name,
                    'slug'       => $slug,
                    'type'       => 'benefits',
                    'created_at' => $now,
                ]);
            }
        }
    }

    public function down()
    {
        $this->db->table('categories')->where('type', 'benefits')->delete();
    }
}
