<?php

namespace App\Models;

use CodeIgniter\Model;

class MembershipApplicationModel extends Model
{
    protected $table = 'membership_applications';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'applicant_type',
        'company_name',
        'business_name',
        'company_logo_url',
        'contact_name',
        'contact_role',
        'birth_date',
        'doc_type',
        'doc_number',
        'nationality',
        'address',
        'profession',
        'email',
        'phone',
        'cuit_rut',
        'sector',
        'website',
        'referral_source',
        'referral_socio_name',
        'interests',
        'additional_services',
        'payment_preference',
        'sponsor_1_name',
        'sponsor_2_name',
        'greece_relation_type',
        'greece_relation_details',
        'comments',
        'status',
        'internal_verdict',
        'internal_reasons',
        'verdict_date',
        'approved_by_president',
        'approved_by_secretary',
        'approved_by_treasurer',
        'notes',
    ];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
