<?php

namespace App\Models;

use CodeIgniter\Model;

class PartnerResourceModel extends Model
{
    protected $table = 'partner_resources';
    protected $primaryKey = 'id';
    protected $useSoftDeletes = true;
    protected $deletedField = 'deleted_at';
    protected $allowedFields = ['title', 'category', 'categories', 'description', 'file_url', 'file_type', 'file_size', 'downloads', 'is_active', 'deleted_at'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}

