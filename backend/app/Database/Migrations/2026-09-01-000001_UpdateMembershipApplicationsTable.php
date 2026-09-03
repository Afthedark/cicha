<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdateMembershipApplicationsTable extends Migration
{
    public function up()
    {
        $fields = [
            'applicant_type' => [
                'type'       => 'ENUM',
                'constraint' => ['empresa', 'persona_fisica'],
                'default'    => 'empresa',
                'after'      => 'id',
            ],
            'business_name' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
                'after'      => 'company_name',
            ],
            'company_logo_url' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
                'after'      => 'business_name',
            ],
            'birth_date' => [
                'type' => 'DATE',
                'null' => true,
                'after' => 'contact_role',
            ],
            'doc_type' => [
                'type'       => 'VARCHAR',
                'constraint' => '50',
                'null'       => true,
                'after'      => 'birth_date',
            ],
            'doc_number' => [
                'type'       => 'VARCHAR',
                'constraint' => '50',
                'null'       => true,
                'after'      => 'doc_type',
            ],
            'nationality' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
                'null'       => true,
                'after'      => 'doc_number',
            ],
            'address' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
                'after'      => 'nationality',
            ],
            'profession' => [
                'type'       => 'VARCHAR',
                'constraint' => '150',
                'null'       => true,
                'after'      => 'address',
            ],
            'referral_source' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
                'after'      => 'website',
            ],
            'referral_socio_name' => [
                'type'       => 'VARCHAR',
                'constraint' => '150',
                'null'       => true,
                'after'      => 'referral_source',
            ],
            'additional_services' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'interests',
            ],
            'payment_preference' => [
                'type'       => 'ENUM',
                'constraint' => ['anual', 'semestral'],
                'default'    => 'anual',
                'after'      => 'additional_services',
            ],
            'sponsor_1_name' => [
                'type'       => 'VARCHAR',
                'constraint' => '150',
                'null'       => true,
                'after'      => 'payment_preference',
            ],
            'sponsor_2_name' => [
                'type'       => 'VARCHAR',
                'constraint' => '150',
                'null'       => true,
                'after'      => 'sponsor_1_name',
            ],
            'greece_relation_type' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
                'after'      => 'sponsor_2_name',
            ],
            'greece_relation_details' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'greece_relation_type',
            ],
            'internal_verdict' => [
                'type'       => 'ENUM',
                'constraint' => ['pending', 'approved', 'rejected'],
                'default'    => 'pending',
                'after'      => 'status',
            ],
            'internal_reasons' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'internal_verdict',
            ],
            'verdict_date' => [
                'type' => 'DATE',
                'null' => true,
                'after' => 'internal_reasons',
            ],
            'approved_by_president' => [
                'type'       => 'VARCHAR',
                'constraint' => '150',
                'null'       => true,
                'after'      => 'verdict_date',
            ],
            'approved_by_secretary' => [
                'type'       => 'VARCHAR',
                'constraint' => '150',
                'null'       => true,
                'after'      => 'approved_by_president',
            ],
            'approved_by_treasurer' => [
                'type'       => 'VARCHAR',
                'constraint' => '150',
                'null'       => true,
                'after'      => 'approved_by_secretary',
            ],
        ];

        $this->forge->addColumn('membership_applications', $fields);
    }

    public function down()
    {
        $columns = [
            'applicant_type',
            'business_name',
            'company_logo_url',
            'birth_date',
            'doc_type',
            'doc_number',
            'nationality',
            'address',
            'profession',
            'referral_source',
            'referral_socio_name',
            'additional_services',
            'payment_preference',
            'sponsor_1_name',
            'sponsor_2_name',
            'greece_relation_type',
            'greece_relation_details',
            'internal_verdict',
            'internal_reasons',
            'verdict_date',
            'approved_by_president',
            'approved_by_secretary',
            'approved_by_treasurer',
        ];

        $this->forge->dropColumn('membership_applications', $columns);
    }
}
