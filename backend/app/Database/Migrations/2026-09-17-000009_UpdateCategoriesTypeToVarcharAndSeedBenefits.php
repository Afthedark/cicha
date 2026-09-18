<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdateCategoriesTypeToVarcharAndSeedBenefits extends Migration
{
    public function up()
    {
        // 1. Modificar columna 'type' a VARCHAR(50) para permitir 'benefits', 'gallery', 'minutes', etc.
        $this->forge->modifyColumn('categories', [
            'type' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'default'    => 'news',
                'null'       => false,
            ],
            'slug' => [
                'type'       => 'VARCHAR',
                'constraint' => 150,
                'null'       => false,
            ],
        ]);

        // 2. Sembrar o actualizar categorías para Club de Beneficios
        $defaultBenefits = [
            'Logística & Transporte',
            'Networking Internacional',
            'Servicios Profesionales',
            'Comercio Exterior',
            'Asesoría Legal & Tributaria',
            'Hotelería & Eventos',
            'Comercial',
        ];

        $now = date('Y-m-d H:i:s');
        foreach ($defaultBenefits as $name) {
            $baseSlug = url_title($name, '-', true);
            $existing = $this->db->table('categories')
                ->where('name', $name)
                ->get()
                ->getRowArray();

            if ($existing) {
                // Si existía con type vacío o erróneo, actualizar a 'benefits'
                $this->db->table('categories')
                    ->where('id', $existing['id'])
                    ->update([
                        'type' => 'benefits',
                        'slug' => $baseSlug . '-benefits',
                    ]);
            } else {
                $this->db->table('categories')->insert([
                    'name'       => $name,
                    'slug'       => $baseSlug . '-benefits',
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
