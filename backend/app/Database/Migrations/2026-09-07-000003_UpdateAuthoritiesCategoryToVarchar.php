<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdateAuthoritiesCategoryToVarchar extends Migration
{
    public function up()
    {
        $db = \Config\Database::connect();
        // Modify category column from ENUM to VARCHAR(50)
        $db->query("ALTER TABLE authorities MODIFY COLUMN category VARCHAR(50) NOT NULL DEFAULT 'directiva'");

        // Now update the records
        $db->query("UPDATE authorities SET category = 'revisora' WHERE role_title LIKE '%Revisor%' OR role_title LIKE '%Revisora%'");
        $db->query("UPDATE authorities SET category = 'honorario' WHERE role_title LIKE '%Honorario%' OR role_title LIKE '%Honoraria%'");
        $db->query("UPDATE authorities SET category = 'directiva' WHERE category = '' OR category IS NULL");
    }

    public function down()
    {
    }
}
