<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateBlogsTable extends Migration
{
    public function up()
    {
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
            'author' => [
                'type'       => 'VARCHAR',
                'constraint' => '150',
                'default'    => 'Comisión Editorial CICHA',
            ],
            'author_role' => [
                'type'       => 'VARCHAR',
                'constraint' => '150',
                'null'       => true,
            ],
            'summary' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'content' => [
                'type' => 'LONGTEXT',
            ],
            'image_url' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            'category' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
                'default'    => 'General',
            ],
            'tags' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            'read_time' => [
                'type'       => 'VARCHAR',
                'constraint' => '50',
                'default'    => '5 min de lectura',
            ],
            'is_featured' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 0,
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['published', 'draft', 'archived'],
                'default'    => 'published',
            ],
            'published_at' => [
                'type' => 'DATETIME',
                'null' => false,
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
        $this->forge->createTable('blogs', true);
    }

    public function down()
    {
        $this->forge->dropTable('blogs', true);
    }
}
