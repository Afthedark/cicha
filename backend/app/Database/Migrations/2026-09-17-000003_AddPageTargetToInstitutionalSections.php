<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddPageTargetToInstitutionalSections extends Migration
{
    public function up()
    {
        $db = \Config\Database::connect();
        
        // Check if column exists
        if (!$db->fieldExists('page_target', 'institutional_sections')) {
            $fields = [
                'page_target' => [
                    'type'       => 'VARCHAR',
                    'constraint' => 50,
                    'default'    => 'home',
                    'after'      => 'section_key'
                ]
            ];
            $this->forge->addColumn('institutional_sections', $fields);
        }
    }

    public function down()
    {
        $db = \Config\Database::connect();
        if ($db->fieldExists('page_target', 'institutional_sections')) {
            $this->forge->dropColumn('institutional_sections', 'page_target');
        }
    }
}
