<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddContentToPartnerMinutesTable extends Migration
{
    public function up()
    {
        // 1. Add content column if not exists
        if (!$this->db->fieldExists('content', 'partner_minutes')) {
            $this->forge->addColumn('partner_minutes', [
                'content' => [
                    'type' => 'LONGTEXT',
                    'null' => true,
                    'after' => 'description',
                ],
            ]);
        }

        // 2. Modify document_type to VARCHAR(20) to support 'text', 'file', 'url'
        $this->forge->modifyColumn('partner_minutes', [
            'document_type' => [
                'type'       => 'VARCHAR',
                'constraint' => '20',
                'default'    => 'file',
            ],
            'file_url' => [
                'type'       => 'VARCHAR',
                'constraint' => '1000',
                'null'       => true,
            ],
        ]);
    }

    public function down()
    {
        if ($this->db->fieldExists('content', 'partner_minutes')) {
            $this->forge->dropColumn('partner_minutes', 'content');
        }
    }
}
