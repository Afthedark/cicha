<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddRepresentativeToMembersTable extends Migration
{
    public function up()
    {
        $fields = [
            'representative_name' => [
                'type'       => 'VARCHAR',
                'constraint' => '150',
                'null'       => true,
                'after'      => 'company_name',
            ],
        ];

        $this->forge->addColumn('members', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('members', 'representative_name');
    }
}
