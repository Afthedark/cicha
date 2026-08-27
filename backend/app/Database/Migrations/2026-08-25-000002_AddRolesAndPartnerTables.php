<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddRolesAndPartnerTables extends Migration
{
    public function up()
    {
        // 1. Modify users table to support roles and member_id
        $fields = [
            'role' => [
                'type'       => 'ENUM',
                'constraint' => ['admin', 'secretario', 'socio'],
                'default'    => 'admin',
            ],
            'member_id' => [
                'type'       => 'INT',
                'constraint' => 10,
                'unsigned'   => true,
                'null'       => true,
                'after'      => 'role'
            ]
        ];
        $this->forge->modifyColumn('users', ['role' => $fields['role']]);
        $this->forge->addColumn('users', ['member_id' => $fields['member_id']]);

        // 2. Partner Resources Table (Exclusive reports & documents for partners)
        $this->forge->addField([
            'id'          => ['type' => 'INT', 'constraint' => 10, 'unsigned' => true, 'auto_increment' => true],
            'title'       => ['type' => 'VARCHAR', 'constraint' => 255],
            'category'    => ['type' => 'ENUM', 'constraint' => ['informe_mercado', 'guia_legal', 'minuta_asamblea', 'circular_comercial'], 'default' => 'informe_mercado'],
            'description' => ['type' => 'TEXT', 'null' => true],
            'file_url'    => ['type' => 'VARCHAR', 'constraint' => 255],
            'file_type'   => ['type' => 'VARCHAR', 'constraint' => 50, 'default' => 'PDF'],
            'file_size'   => ['type' => 'VARCHAR', 'constraint' => 50, 'default' => '1.5 MB'],
            'downloads'   => ['type' => 'INT', 'default' => 0],
            'is_active'   => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 1],
            'created_at'  => ['type' => 'DATETIME', 'null' => true],
            'updated_at'  => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('partner_resources', true);

        // 3. Partner Benefits Table (Exclusive benefits & agreements)
        $this->forge->addField([
            'id'                   => ['type' => 'INT', 'constraint' => 10, 'unsigned' => true, 'auto_increment' => true],
            'title'                => ['type' => 'VARCHAR', 'constraint' => 255],
            'provider_company'     => ['type' => 'VARCHAR', 'constraint' => 150],
            'category'             => ['type' => 'VARCHAR', 'constraint' => 100, 'default' => 'Comercial'],
            'discount_description' => ['type' => 'TEXT'],
            'how_to_claim'         => ['type' => 'TEXT', 'null' => true],
            'logo_url'             => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'valid_until'          => ['type' => 'DATE', 'null' => true],
            'is_active'            => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 1],
            'created_at'           => ['type' => 'DATETIME', 'null' => true],
            'updated_at'           => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('partner_benefits', true);
    }

    public function down()
    {
        $this->forge->dropTable('partner_benefits', true);
        $this->forge->dropTable('partner_resources', true);
        $this->forge->dropColumn('users', 'member_id');
    }
}
