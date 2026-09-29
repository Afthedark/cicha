<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddCategoriesJsonToPartnerMinutesTable extends Migration
{
    public function up()
    {
        // 1. Add categories column (TEXT/JSON) to partner_minutes if not exists
        if (!$this->db->fieldExists('categories', 'partner_minutes')) {
            $this->forge->addColumn('partner_minutes', [
                'categories' => [
                    'type' => 'TEXT',
                    'null' => true,
                    'after' => 'category',
                ],
            ]);
        }

        // 2. Populate categories from existing category column for existing records
        $existingMinutes = $this->db->table('partner_minutes')->get()->getResultArray();
        foreach ($existingMinutes as $min) {
            if (empty($min['categories']) && !empty($min['category'])) {
                $cats = array_values(array_filter(array_map('trim', explode(',', $min['category']))));
                if (empty($cats)) {
                    $cats = [$min['category']];
                }
                $this->db->table('partner_minutes')
                    ->where('id', $min['id'])
                    ->update(['categories' => json_encode($cats, JSON_UNESCAPED_UNICODE)]);
            }
        }

        // 3. Ensure recommended categories exist in categories table
        $defaultCategories = [
            'Asamblea General',
            'Comisión Directiva',
            'Resoluciones Institucionales',
            'TEAM EUROPE',
            'UCCEB',
            'ECA',
            'Comité Ejecutivo',
            'Comisión Revisora',
            'Acuerdos Comerciales',
        ];

        $now = date('Y-m-d H:i:s');
        foreach ($defaultCategories as $name) {
            $baseSlug = clean_slug($name);
            $slug = $baseSlug;

            $existing = $this->db->table('categories')
                ->where('slug', $slug)
                ->get()
                ->getRowArray();

            if ($existing) {
                if ($existing['type'] !== 'minutes') {
                    $slug = $baseSlug . '-minutes';
                    $existingMinutesSlug = $this->db->table('categories')
                        ->where('slug', $slug)
                        ->get()
                        ->getRowArray();
                    if (!$existingMinutesSlug) {
                        $this->db->table('categories')->insert([
                            'name'       => $name,
                            'slug'       => $slug,
                            'type'       => 'minutes',
                            'created_at' => $now,
                        ]);
                    }
                }
            } else {
                $this->db->table('categories')->insert([
                    'name'       => $name,
                    'slug'       => $slug,
                    'type'       => 'minutes',
                    'created_at' => $now,
                ]);
            }
        }
    }

    public function down()
    {
        if ($this->db->fieldExists('categories', 'partner_minutes')) {
            $this->forge->dropColumn('partner_minutes', 'categories');
        }
    }
}
