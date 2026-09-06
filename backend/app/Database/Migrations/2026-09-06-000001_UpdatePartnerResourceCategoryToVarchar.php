<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdatePartnerResourceCategoryToVarchar extends Migration
{
    public function up()
    {
        $fields = [
            'category' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'default'    => 'Marítimo & Logística',
            ],
        ];
        $this->forge->modifyColumn('partner_resources', $fields);
    }

    public function down()
    {
        $fields = [
            'category' => [
                'type'       => 'ENUM',
                'constraint' => ['informe_mercado', 'guia_legal', 'minuta_asamblea', 'circular_comercial'],
                'default'    => 'informe_mercado',
            ],
        ];
        $this->forge->modifyColumn('partner_resources', $fields);
    }
}
