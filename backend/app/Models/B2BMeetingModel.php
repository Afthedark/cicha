<?php

namespace App\Models;

use CodeIgniter\Model;

class B2BMeetingModel extends Model
{
    protected $table = 'b2b_meetings';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'title',
        'slug',
        'sector',
        'meeting_date',
        'location',
        'modality',
        'status',
        'cover_image_url',
        'public_summary',
        'participants_count',
        'meetings_count',
        'agreements_count',
        'partner_detailed_report',
        'partner_companies_list',
        'partner_conclusions',
        'partner_document_url',
        'partner_contact_info',
        'is_active',
    ];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
