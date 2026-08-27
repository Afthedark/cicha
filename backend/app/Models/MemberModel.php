<?php

namespace App\Models;

use CodeIgniter\Model;

class MemberModel extends Model
{
    protected $table = 'members';
    protected $primaryKey = 'id';
    protected $allowedFields = ['company_name', 'slug', 'sector', 'description', 'services', 'logo_url', 'website_url', 'contact_email', 'contact_phone', 'country', 'is_featured', 'status'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
