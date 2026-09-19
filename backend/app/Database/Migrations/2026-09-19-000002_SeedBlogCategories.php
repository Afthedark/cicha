<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SeedBlogCategories extends Migration
{
    public function up()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('categories');

        $initialBlogCategories = [
            ['name' => 'Economía & Comercio', 'slug' => 'blog-economia-comercio', 'type' => 'blogs'],
            ['name' => 'Cultura & Tradición Helénica', 'slug' => 'blog-cultura-tradicion', 'type' => 'blogs'],
            ['name' => 'Oportunidades de Negocios', 'slug' => 'blog-oportunidades-negocios', 'type' => 'blogs'],
            ['name' => 'Geopolítica & UE', 'slug' => 'blog-geopolitica-ue', 'type' => 'blogs'],
            ['name' => 'Logística & Puertos', 'slug' => 'blog-logistica-puertos', 'type' => 'blogs'],
            ['name' => 'Tecnología & Energía', 'slug' => 'blog-tecnologia-energia', 'type' => 'blogs'],
        ];

        foreach ($initialBlogCategories as $cat) {
            $exists = $builder->where('name', $cat['name'])->where('type', 'blogs')->countAllResults();
            if ($exists === 0) {
                $builder->insert([
                    'name' => $cat['name'],
                    'slug' => $cat['slug'],
                    'type' => $cat['type'],
                    'created_at' => date('Y-m-d H:i:s'),
                ]);
            }
        }
    }

    public function down()
    {
        $db = \Config\Database::connect();
        $db->table('categories')->where('type', 'blogs')->delete();
    }
}
