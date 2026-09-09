<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddOrderNumToMembersTable extends Migration
{
    public function up()
    {
        $this->forge->addColumn('members', [
            'order_num' => [
                'type'       => 'INT',
                'constraint' => 10,
                'unsigned'   => true,
                'default'    => 0,
                'after'      => 'status',
            ],
        ]);

        // Backfill: preserva el orden alfabético actual como posición inicial
        $rows = $this->db->table('members')->orderBy('company_name', 'ASC')->get()->getResult();
        $pos = 1;
        foreach ($rows as $row) {
            $this->db->table('members')->where('id', $row->id)->update(['order_num' => $pos++]);
        }
    }

    public function down()
    {
        $this->forge->dropColumn('members', 'order_num');
    }
}
