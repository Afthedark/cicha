<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePartnerMinutesTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'user_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'member_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
            ],
            'title' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'description' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'document_type' => [
                'type'       => 'ENUM',
                'constraint' => ['file', 'url'],
                'default'    => 'file',
            ],
            'file_url' => [
                'type'       => 'VARCHAR',
                'constraint' => '1000',
            ],
            'file_name' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            'file_size' => [
                'type'       => 'VARCHAR',
                'constraint' => '50',
                'null'       => true,
            ],
            'meeting_date' => [
                'type' => 'DATE',
                'null' => true,
            ],
            'downloads' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 0,
            ],
            'is_active' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 1,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('user_id');
        $this->forge->addKey('member_id');
        $this->forge->createTable('partner_minutes', true);
    }

    public function down()
    {
        $this->forge->dropTable('partner_minutes', true);
    }
}
