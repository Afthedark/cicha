<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SeedMemberCategories extends Migration
{
    public function up()
    {
        $defaultCategories = [
            'Marítimo & Logística',
            'Agroindustria & Alimentos',
            'Energía & Sustentabilidad',
            'Servicios Jurídicos & Finanzas',
            'Tecnología & Innovación',
            'Turismo & Comercio Exterior',
            'Industria & Manufactura',
        ];

        $db = \Config\Database::connect();
        $builder = $db->table('categories');

        foreach ($defaultCategories as $name) {
            $exists = $builder->where('name', $name)->where('type', 'members')->countAllResults();
            if ($exists === 0) {
                $builder->insert([
                    'name'       => $name,
                    'slug'       => url_title($name, '-', true),
                    'type'       => 'members',
                    'created_at' => date('Y-m-d H:i:s'),
                ]);
            }
        }
    }

    public function down()
    {
        $db = \Config\Database::connect();
        $db->table('categories')->where('type', 'members')->delete();
    }
}
