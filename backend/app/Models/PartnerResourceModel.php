<?php

namespace App\Models;

use CodeIgniter\Model;

class PartnerResourceModel extends Model
{
    protected $table = 'partner_resources';
    protected $primaryKey = 'id';
    protected $allowedFields = ['title', 'category', 'description', 'file_url', 'file_type', 'file_size', 'downloads', 'is_active'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
