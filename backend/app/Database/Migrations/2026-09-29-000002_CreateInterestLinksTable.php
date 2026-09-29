<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateInterestLinksTable extends Migration
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
            'category_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
            ],
            'title' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'description' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'url' => [
                'type'       => 'VARCHAR',
                'constraint' => '500',
            ],
            'logo_url' => [
                'type'       => 'VARCHAR',
                'constraint' => '500',
                'null'       => true,
            ],
            'order_num' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 0,
            ],
            'is_featured' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
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
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('category_id');
        $this->forge->addKey('is_active');
        $this->forge->addKey('deleted_at');
        $this->forge->createTable('interest_links', true);

        // Seed initial categories for interest links
        $db = \Config\Database::connect();
        $categories = [
            [
                'name' => 'Organismos Públicos & Embajadas',
                'slug' => 'organismos-publicos-embajadas',
                'type' => 'links',
            ],
            [
                'name' => 'Cámaras & Entidades Bilaterales',
                'slug' => 'camaras-entidades-bilaterales',
                'type' => 'links',
            ],
            [
                'name' => 'Comercio Exterior & Aduana',
                'slug' => 'comercio-exterior-aduana',
                'type' => 'links',
            ],
            [
                'name' => 'Cultura, Educación & Cooperación',
                'slug' => 'cultura-educacion-cooperacion',
                'type' => 'links',
            ],
            [
                'name' => 'Herramientas Empresariales',
                'slug' => 'herramientas-empresariales',
                'type' => 'links',
            ],
        ];

        foreach ($categories as $cat) {
            $exists = $db->table('categories')
                ->where('slug', $cat['slug'])
                ->where('type', 'links')
                ->countAllResults();

            if ($exists === 0) {
                $db->table('categories')->insert($cat);
            }
        }
    }

    public function down()
    {
        $this->forge->dropTable('interest_links', true);
    }
}
