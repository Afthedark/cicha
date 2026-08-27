<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateCichaTables extends Migration
{
    public function up()
    {
        // 1. Users
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 10, 'unsigned' => true, 'auto_increment' => true],
            'name' => ['type' => 'VARCHAR', 'constraint' => 100],
            'email' => ['type' => 'VARCHAR', 'constraint' => 150, 'unique' => true],
            'password' => ['type' => 'VARCHAR', 'constraint' => 255],
            'role' => ['type' => 'ENUM', 'constraint' => ['admin', 'editor'], 'default' => 'admin'],
            'avatar' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'status' => ['type' => 'ENUM', 'constraint' => ['active', 'inactive'], 'default' => 'active'],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('users', true);

        // 2. Settings
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 10, 'unsigned' => true, 'auto_increment' => true],
            'key_name' => ['type' => 'VARCHAR', 'constraint' => 100, 'unique' => true],
            'value_text' => ['type' => 'LONGTEXT', 'null' => true],
            'group_name' => ['type' => 'VARCHAR', 'constraint' => 50, 'default' => 'general'],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('settings', true);

        // 3. Institutional Sections
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 10, 'unsigned' => true, 'auto_increment' => true],
            'section_key' => ['type' => 'VARCHAR', 'constraint' => 80, 'unique' => true],
            'title' => ['type' => 'VARCHAR', 'constraint' => 200],
            'subtitle' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'content' => ['type' => 'LONGTEXT'],
            'image_url' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'icon_name' => ['type' => 'VARCHAR', 'constraint' => 50, 'null' => true],
            'order_num' => ['type' => 'INT', 'default' => 0],
            'is_active' => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 1],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('institutional_sections', true);

        // 4. Authorities
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 10, 'unsigned' => true, 'auto_increment' => true],
            'name' => ['type' => 'VARCHAR', 'constraint' => 120],
            'role_title' => ['type' => 'VARCHAR', 'constraint' => 150],
            'category' => ['type' => 'ENUM', 'constraint' => ['directiva', 'honorario', 'comite'], 'default' => 'directiva'],
            'company' => ['type' => 'VARCHAR', 'constraint' => 150, 'null' => true],
            'bio' => ['type' => 'TEXT', 'null' => true],
            'photo_url' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'linkedin_url' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'order_num' => ['type' => 'INT', 'default' => 0],
            'is_active' => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 1],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('authorities', true);

        // 5. Alliances
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 10, 'unsigned' => true, 'auto_increment' => true],
            'name' => ['type' => 'VARCHAR', 'constraint' => 150],
            'slug' => ['type' => 'VARCHAR', 'constraint' => 100, 'unique' => true],
            'category' => ['type' => 'VARCHAR', 'constraint' => 50, 'default' => 'internacional'],
            'description' => ['type' => 'TEXT', 'null' => true],
            'website_url' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'logo_url' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'highlight_text' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'order_num' => ['type' => 'INT', 'default' => 0],
            'is_active' => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 1],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('alliances', true);

        // 6. Categories
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 10, 'unsigned' => true, 'auto_increment' => true],
            'name' => ['type' => 'VARCHAR', 'constraint' => 100],
            'slug' => ['type' => 'VARCHAR', 'constraint' => 100, 'unique' => true],
            'type' => ['type' => 'ENUM', 'constraint' => ['news', 'events', 'members', 'opportunities'], 'default' => 'news'],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('categories', true);

        // 7. Articles (News & Press)
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 10, 'unsigned' => true, 'auto_increment' => true],
            'category_id' => ['type' => 'INT', 'constraint' => 10, 'unsigned' => true, 'null' => true],
            'title' => ['type' => 'VARCHAR', 'constraint' => 255],
            'slug' => ['type' => 'VARCHAR', 'constraint' => 255, 'unique' => true],
            'summary' => ['type' => 'TEXT', 'null' => true],
            'content' => ['type' => 'LONGTEXT'],
            'image_url' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'author' => ['type' => 'VARCHAR', 'constraint' => 100, 'default' => 'CICHA Institucional'],
            'published_at' => ['type' => 'DATE', 'null' => true],
            'is_featured' => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 0],
            'status' => ['type' => 'ENUM', 'constraint' => ['published', 'draft'], 'default' => 'published'],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('articles', true);

        // 8. Events
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 10, 'unsigned' => true, 'auto_increment' => true],
            'category_id' => ['type' => 'INT', 'constraint' => 10, 'unsigned' => true, 'null' => true],
            'title' => ['type' => 'VARCHAR', 'constraint' => 255],
            'slug' => ['type' => 'VARCHAR', 'constraint' => 255, 'unique' => true],
            'description' => ['type' => 'LONGTEXT'],
            'event_date' => ['type' => 'DATETIME'],
            'end_date' => ['type' => 'DATETIME', 'null' => true],
            'location_type' => ['type' => 'ENUM', 'constraint' => ['presencial', 'virtual', 'hibrido'], 'default' => 'presencial'],
            'location_address' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'registration_url' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'image_url' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'organizer' => ['type' => 'VARCHAR', 'constraint' => 150, 'default' => 'CICHA / Red EEN'],
            'is_featured' => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 0],
            'status' => ['type' => 'ENUM', 'constraint' => ['upcoming', 'completed', 'cancelled'], 'default' => 'upcoming'],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('events', true);

        // 9. Members
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 10, 'unsigned' => true, 'auto_increment' => true],
            'company_name' => ['type' => 'VARCHAR', 'constraint' => 150],
            'slug' => ['type' => 'VARCHAR', 'constraint' => 150, 'unique' => true],
            'sector' => ['type' => 'VARCHAR', 'constraint' => 100],
            'description' => ['type' => 'TEXT', 'null' => true],
            'services' => ['type' => 'TEXT', 'null' => true],
            'logo_url' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'website_url' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'contact_email' => ['type' => 'VARCHAR', 'constraint' => 150, 'null' => true],
            'contact_phone' => ['type' => 'VARCHAR', 'constraint' => 80, 'null' => true],
            'country' => ['type' => 'VARCHAR', 'constraint' => 80, 'default' => 'Argentina'],
            'is_featured' => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 0],
            'status' => ['type' => 'ENUM', 'constraint' => ['active', 'inactive'], 'default' => 'active'],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('members', true);

        // 10. Commercial Opportunities
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 10, 'unsigned' => true, 'auto_increment' => true],
            'title' => ['type' => 'VARCHAR', 'constraint' => 255],
            'slug' => ['type' => 'VARCHAR', 'constraint' => 255, 'unique' => true],
            'type' => ['type' => 'ENUM', 'constraint' => ['export', 'import', 'investment', 'partnership', 'een_node'], 'default' => 'export'],
            'origin_country' => ['type' => 'VARCHAR', 'constraint' => 50, 'default' => 'Grecia'],
            'target_country' => ['type' => 'VARCHAR', 'constraint' => 50, 'default' => 'Argentina'],
            'sector' => ['type' => 'VARCHAR', 'constraint' => 100],
            'description' => ['type' => 'LONGTEXT'],
            'requirements' => ['type' => 'TEXT', 'null' => true],
            'contact_person' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
            'contact_email' => ['type' => 'VARCHAR', 'constraint' => 150, 'null' => true],
            'status' => ['type' => 'ENUM', 'constraint' => ['open', 'in_negotiation', 'closed'], 'default' => 'open'],
            'deadline' => ['type' => 'DATE', 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('commercial_opportunities', true);

        // 11. Membership Applications
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 10, 'unsigned' => true, 'auto_increment' => true],
            'company_name' => ['type' => 'VARCHAR', 'constraint' => 150],
            'contact_name' => ['type' => 'VARCHAR', 'constraint' => 120],
            'contact_role' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
            'email' => ['type' => 'VARCHAR', 'constraint' => 150],
            'phone' => ['type' => 'VARCHAR', 'constraint' => 50],
            'cuit_rut' => ['type' => 'VARCHAR', 'constraint' => 50, 'null' => true],
            'sector' => ['type' => 'VARCHAR', 'constraint' => 100],
            'website' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'interests' => ['type' => 'TEXT', 'null' => true],
            'comments' => ['type' => 'TEXT', 'null' => true],
            'status' => ['type' => 'ENUM', 'constraint' => ['pending', 'in_review', 'approved', 'contacted', 'rejected'], 'default' => 'pending'],
            'notes' => ['type' => 'TEXT', 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('membership_applications', true);

        // 12. Contact Messages
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 10, 'unsigned' => true, 'auto_increment' => true],
            'name' => ['type' => 'VARCHAR', 'constraint' => 120],
            'email' => ['type' => 'VARCHAR', 'constraint' => 150],
            'phone' => ['type' => 'VARCHAR', 'constraint' => 50, 'null' => true],
            'subject' => ['type' => 'VARCHAR', 'constraint' => 200],
            'message' => ['type' => 'LONGTEXT'],
            'is_read' => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 0],
            'status' => ['type' => 'ENUM', 'constraint' => ['new', 'responded', 'archived'], 'default' => 'new'],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('contact_messages', true);
    }

    public function down()
    {
        $this->forge->dropTable('contact_messages', true);
        $this->forge->dropTable('membership_applications', true);
        $this->forge->dropTable('commercial_opportunities', true);
        $this->forge->dropTable('members', true);
        $this->forge->dropTable('events', true);
        $this->forge->dropTable('articles', true);
        $this->forge->dropTable('categories', true);
        $this->forge->dropTable('alliances', true);
        $this->forge->dropTable('authorities', true);
        $this->forge->dropTable('institutional_sections', true);
        $this->forge->dropTable('settings', true);
        $this->forge->dropTable('users', true);
    }
}
