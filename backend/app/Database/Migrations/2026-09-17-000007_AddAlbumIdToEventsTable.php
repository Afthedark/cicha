<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddAlbumIdToEventsTable extends Migration
{
    public function up()
    {
        $db = \Config\Database::connect();
        
        if (!$db->fieldExists('album_id', 'events')) {
            $fields = [
                'album_id' => [
                    'type'       => 'INT',
                    'constraint' => 10,
                    'unsigned'   => true,
                    'null'       => true,
                    'after'      => 'image_url',
                ],
            ];
            $this->forge->addColumn('events', $fields);
        }
    }

    public function down()
    {
        $db = \Config\Database::connect();
        if ($db->fieldExists('album_id', 'events')) {
            $this->forge->dropColumn('events', 'album_id');
        }
    }
}
