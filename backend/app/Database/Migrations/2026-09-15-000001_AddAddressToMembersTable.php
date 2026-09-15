<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddAddressToMembersTable extends Migration
{
    public function up()
    {
        if ($this->db->tableExists('members')) {
            $fields = [];
            if (!$this->db->fieldExists('address', 'members')) {
                $fields['address'] = [
                    'type'       => 'VARCHAR',
                    'constraint' => 255,
                    'null'       => true,
                    'after'      => 'contact_phone',
                ];
            }

            if (!empty($fields)) {
                $this->forge->addColumn('members', $fields);
            }
        }
    }

    public function down()
    {
        if ($this->db->tableExists('members') && $this->db->fieldExists('address', 'members')) {
            $this->forge->dropColumn('members', 'address');
        }
    }
}
