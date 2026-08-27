<?php

namespace App\Models;

use CodeIgniter\Model;

class PartnerBenefitModel extends Model
{
    protected $table = 'partner_benefits';
    protected $primaryKey = 'id';
    protected $allowedFields = ['title', 'provider_company', 'category', 'discount_description', 'how_to_claim', 'logo_url', 'valid_until', 'is_active'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
