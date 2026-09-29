<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class StandardizeMediaAndPdfFieldsAcrossModules extends Migration
{
    public function up()
    {
        // 1. Table: articles (Noticias & Prensa)
        $articlesColumns = [];
        if (!$this->db->fieldExists('author_avatar_url', 'articles')) {
            $articlesColumns['author_avatar_url'] = ['type' => 'VARCHAR', 'constraint' => 500, 'null' => true, 'after' => 'author'];
        }
        if (!$this->db->fieldExists('logo_url', 'articles')) {
            $articlesColumns['logo_url'] = ['type' => 'VARCHAR', 'constraint' => 500, 'null' => true, 'after' => 'image_url'];
        }
        if (!$this->db->fieldExists('document_type', 'articles')) {
            $articlesColumns['document_type'] = ['type' => 'VARCHAR', 'constraint' => 50, 'default' => 'text', 'null' => true, 'after' => 'content'];
        }
        if (!$this->db->fieldExists('file_url', 'articles')) {
            $articlesColumns['file_url'] = ['type' => 'VARCHAR', 'constraint' => 1000, 'null' => true, 'after' => 'document_type'];
        }
        if (!$this->db->fieldExists('file_name', 'articles')) {
            $articlesColumns['file_name'] = ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true, 'after' => 'file_url'];
        }
        if (!$this->db->fieldExists('file_size', 'articles')) {
            $articlesColumns['file_size'] = ['type' => 'VARCHAR', 'constraint' => 50, 'null' => true, 'after' => 'file_name'];
        }
        if (!empty($articlesColumns)) {
            $this->forge->addColumn('articles', $articlesColumns);
        }

        // 2. Table: blogs (Blogs & Columnas)
        $blogsColumns = [];
        if (!$this->db->fieldExists('author_avatar_url', 'blogs')) {
            $blogsColumns['author_avatar_url'] = ['type' => 'VARCHAR', 'constraint' => 500, 'null' => true, 'after' => 'author_role'];
        }
        if (!$this->db->fieldExists('logo_url', 'blogs')) {
            $blogsColumns['logo_url'] = ['type' => 'VARCHAR', 'constraint' => 500, 'null' => true, 'after' => 'image_url'];
        }
        if (!$this->db->fieldExists('document_type', 'blogs')) {
            $blogsColumns['document_type'] = ['type' => 'VARCHAR', 'constraint' => 50, 'default' => 'text', 'null' => true, 'after' => 'content'];
        }
        if (!$this->db->fieldExists('file_url', 'blogs')) {
            $blogsColumns['file_url'] = ['type' => 'VARCHAR', 'constraint' => 1000, 'null' => true, 'after' => 'document_type'];
        }
        if (!$this->db->fieldExists('file_name', 'blogs')) {
            $blogsColumns['file_name'] = ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true, 'after' => 'file_url'];
        }
        if (!$this->db->fieldExists('file_size', 'blogs')) {
            $blogsColumns['file_size'] = ['type' => 'VARCHAR', 'constraint' => 50, 'null' => true, 'after' => 'file_name'];
        }
        if (!empty($blogsColumns)) {
            $this->forge->addColumn('blogs', $blogsColumns);
        }

        // 3. Table: partner_minutes (Actas & Resoluciones)
        $minutesColumns = [];
        if (!$this->db->fieldExists('cover_image_url', 'partner_minutes')) {
            $minutesColumns['cover_image_url'] = ['type' => 'VARCHAR', 'constraint' => 500, 'null' => true, 'after' => 'title'];
        }
        if (!$this->db->fieldExists('author_avatar_url', 'partner_minutes')) {
            $minutesColumns['author_avatar_url'] = ['type' => 'VARCHAR', 'constraint' => 500, 'null' => true, 'after' => 'cover_image_url'];
        }
        if (!$this->db->fieldExists('logo_url', 'partner_minutes')) {
            $minutesColumns['logo_url'] = ['type' => 'VARCHAR', 'constraint' => 500, 'null' => true, 'after' => 'author_avatar_url'];
        }
        if (!empty($minutesColumns)) {
            $this->forge->addColumn('partner_minutes', $minutesColumns);
        }

        // 4. Table: decrees (Decretos & Resoluciones)
        $decreesColumns = [];
        if (!$this->db->fieldExists('cover_image_url', 'decrees')) {
            $decreesColumns['cover_image_url'] = ['type' => 'VARCHAR', 'constraint' => 500, 'null' => true, 'after' => 'title'];
        }
        if (!$this->db->fieldExists('author', 'decrees')) {
            $decreesColumns['author'] = ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true, 'default' => 'Consejo Directivo CICHA', 'after' => 'decree_number'];
        }
        if (!$this->db->fieldExists('author_avatar_url', 'decrees')) {
            $decreesColumns['author_avatar_url'] = ['type' => 'VARCHAR', 'constraint' => 500, 'null' => true, 'after' => 'author'];
        }
        if (!$this->db->fieldExists('content', 'decrees')) {
            $decreesColumns['content'] = ['type' => 'LONGTEXT', 'null' => true, 'after' => 'description'];
        }
        if (!empty($decreesColumns)) {
            $this->forge->addColumn('decrees', $decreesColumns);
        }

        // 5. Table: partner_news (Boletín de Noticias Socios)
        $partnerNewsColumns = [];
        if (!$this->db->fieldExists('author_avatar_url', 'partner_news')) {
            $partnerNewsColumns['author_avatar_url'] = ['type' => 'VARCHAR', 'constraint' => 500, 'null' => true, 'after' => 'author'];
        }
        if (!$this->db->fieldExists('logo_url', 'partner_news')) {
            $partnerNewsColumns['logo_url'] = ['type' => 'VARCHAR', 'constraint' => 500, 'null' => true, 'after' => 'image_url'];
        }
        if (!$this->db->fieldExists('document_type', 'partner_news')) {
            $partnerNewsColumns['document_type'] = ['type' => 'VARCHAR', 'constraint' => 50, 'default' => 'text', 'null' => true, 'after' => 'content'];
        }
        if (!$this->db->fieldExists('file_url', 'partner_news')) {
            $partnerNewsColumns['file_url'] = ['type' => 'VARCHAR', 'constraint' => 1000, 'null' => true, 'after' => 'document_type'];
        }
        if (!$this->db->fieldExists('file_name', 'partner_news')) {
            $partnerNewsColumns['file_name'] = ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true, 'after' => 'file_url'];
        }
        if (!$this->db->fieldExists('file_size', 'partner_news')) {
            $partnerNewsColumns['file_size'] = ['type' => 'VARCHAR', 'constraint' => 50, 'null' => true, 'after' => 'file_name'];
        }
        if (!empty($partnerNewsColumns)) {
            $this->forge->addColumn('partner_news', $partnerNewsColumns);
        }
    }

    public function down()
    {
        // Rollback columns if needed
        $dropColumns = [
            'articles' => ['author_avatar_url', 'logo_url', 'document_type', 'file_url', 'file_name', 'file_size'],
            'blogs' => ['author_avatar_url', 'logo_url', 'document_type', 'file_url', 'file_name', 'file_size'],
            'partner_minutes' => ['cover_image_url', 'author_avatar_url', 'logo_url'],
            'decrees' => ['cover_image_url', 'author', 'author_avatar_url', 'content'],
            'partner_news' => ['author_avatar_url', 'logo_url', 'document_type', 'file_url', 'file_name', 'file_size'],
        ];

        foreach ($dropColumns as $table => $cols) {
            foreach ($cols as $col) {
                if ($this->db->fieldExists($col, $table)) {
                    $this->forge->dropColumn($table, $col);
                }
            }
        }
    }
}
