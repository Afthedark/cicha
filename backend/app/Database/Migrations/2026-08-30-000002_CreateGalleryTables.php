<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateGalleryTables extends Migration
{
    public function up()
    {
        // 1. Table photo_albums (Grupos / Álbumes de Fotos)
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'title' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'slug' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'unique'     => true,
            ],
            'description' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'cover_image_url' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            'event_date' => [
                'type' => 'DATE',
                'null' => true,
            ],
            'category' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
                'default'    => 'Institucional',
            ],
            'order_num' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 0,
            ],
            'is_active' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 1,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('photo_albums', true);

        // 2. Table gallery_photos (Fotos asociadas al álbum)
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'album_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'image_url' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'caption' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            'order_num' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 0,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('album_id', 'photo_albums', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('gallery_photos', true);
    }

    public function down()
    {
        $this->forge->dropTable('gallery_photos', true);
        $this->forge->dropTable('photo_albums', true);
    }
}
