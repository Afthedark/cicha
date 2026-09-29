<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddSourceLinksToArticles extends Migration
{
    public function up()
    {
        $fields = [
            'source_links' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'status',
            ],
        ];

        if (!$this->db->fieldExists('source_links', 'articles')) {
            $this->forge->addColumn('articles', $fields);
        }
    }

    public function down()
    {
        if ($this->db->fieldExists('source_links', 'articles')) {
            $this->forge->dropColumn('articles', 'source_links');
        }
    }
}
