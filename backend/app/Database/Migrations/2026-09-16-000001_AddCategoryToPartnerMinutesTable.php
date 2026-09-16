<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddCategoryToPartnerMinutesTable extends Migration
{
    public function up()
    {
        // 1. Add category column to partner_minutes if not exists
        if (!$this->db->fieldExists('category', 'partner_minutes')) {
            $this->forge->addColumn('partner_minutes', [
                'category' => [
                    'type'       => 'VARCHAR',
                    'constraint' => '150',
                    'null'       => true,
                    'default'    => 'Asamblea General',
                    'after'      => 'title',
                ],
            ]);
        }

        // 2. Seed initial categories for minutes
        $defaultCategories = [
            'Asamblea General',
            'Comité Ejecutivo',
            'Comisión Revisora',
            'Acuerdos Comerciales',
            'Resoluciones Institucionales',
            'Sesiones Extraordinarias',
        ];

        $now = date('Y-m-d H:i:s');
        foreach ($defaultCategories as $name) {
            $slug = url_title($name, '-', true);
            $existing = $this->db->table('categories')
                ->where('type', 'minutes')
                ->where('slug', $slug)
                ->get()
                ->getRowArray();

            if (!$existing) {
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
        if ($this->db->fieldExists('category', 'partner_minutes')) {
            $this->forge->dropColumn('partner_minutes', 'category');
        }

        $this->db->table('categories')->where('type', 'minutes')->delete();
    }
}
