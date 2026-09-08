<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class FixAuthoritiesCategories extends Migration
{
    public function up()
    {
        $db = \Config\Database::connect();
        
        // Fix Revisores
        $db->query("UPDATE authorities SET category = 'revisora' WHERE (category = '' OR category IS NULL) AND (role_title LIKE '%Revisor%' OR role_title LIKE '%Revisora%')");
        
        // Fix Honorarios
        $db->query("UPDATE authorities SET category = 'honorario' WHERE (category = '' OR category IS NULL) AND (role_title LIKE '%Honorario%' OR role_title LIKE '%Honoraria%')");
        
        // Fix any remaining empty categories
        $db->query("UPDATE authorities SET category = 'directiva' WHERE category = '' OR category IS NULL");
        
        // Ensure all are active by default
        $db->query("UPDATE authorities SET is_active = 1 WHERE is_active IS NULL");
    }

    public function down()
    {
        // No action needed
    }
}
