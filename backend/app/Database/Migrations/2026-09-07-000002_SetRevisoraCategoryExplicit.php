<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SetRevisoraCategoryExplicit extends Migration
{
    public function up()
    {
        $db = \Config\Database::connect();
        $db->query("UPDATE authorities SET category = 'revisora' WHERE role_title LIKE '%Revisor%' OR role_title LIKE '%Revisora%'");
    }

    public function down()
    {
    }
}
