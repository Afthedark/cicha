<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddGalleryImagesToEventsTable extends Migration
{
    public function up()
    {
        $db = \Config\Database::connect();
        
        if (!$db->fieldExists('gallery_images', 'events')) {
            $fields = [
                'gallery_images' => [
                    'type' => 'TEXT',
                    'null' => true,
                    'after' => 'image_url',
                ],
            ];
            $this->forge->addColumn('events', $fields);
        }
    }

    public function down()
    {
        $db = \Config\Database::connect();
        if ($db->fieldExists('gallery_images', 'events')) {
            $this->forge->dropColumn('events', 'gallery_images');
        }
    }
}
