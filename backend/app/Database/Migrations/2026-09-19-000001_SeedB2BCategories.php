<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SeedB2BCategories extends Migration
{
    public function up()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('categories');

        $initialSectors = [
            ['name' => 'Alimentos & Bebidas', 'slug' => 'b2b-alimentos-bebidas', 'type' => 'b2b'],
            ['name' => 'Logística Portuaria', 'slug' => 'b2b-logistica-portuaria', 'type' => 'b2b'],
            ['name' => 'Tecnología & Energía', 'slug' => 'b2b-tecnologia-energia', 'type' => 'b2b'],
            ['name' => 'Servicios Profesionales', 'slug' => 'b2b-servicios-profesionales', 'type' => 'b2b'],
            ['name' => 'Comercio Exterior', 'slug' => 'b2b-comercio-exterior', 'type' => 'b2b'],
            ['name' => 'Multisectorial', 'slug' => 'b2b-multisectorial', 'type' => 'b2b'],
        ];

        foreach ($initialSectors as $sec) {
            $exists = $builder->where('name', $sec['name'])->where('type', 'b2b')->countAllResults();
            if ($exists === 0) {
                $builder->insert([
                    'name' => $sec['name'],
                    'slug' => $sec['slug'],
                    'type' => $sec['type'],
                    'created_at' => date('Y-m-d H:i:s'),
                ]);
            }
        }
    }

    public function down()
    {
        $db = \Config\Database::connect();
        $db->table('categories')->where('type', 'b2b')->delete();
    }
}
