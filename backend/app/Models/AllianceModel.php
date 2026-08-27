<?php

namespace App\Models;

use CodeIgniter\Model;

class AllianceModel extends Model
{
    protected $table = 'alliances';
    protected $primaryKey = 'id';
    protected $allowedFields = ['name', 'slug', 'category', 'description', 'website_url', 'logo_url', 'highlight_text', 'order_num', 'is_active'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
