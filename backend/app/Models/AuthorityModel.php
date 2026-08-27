<?php

namespace App\Models;

use CodeIgniter\Model;

class AuthorityModel extends Model
{
    protected $table = 'authorities';
    protected $primaryKey = 'id';
    protected $allowedFields = ['name', 'role_title', 'category', 'company', 'bio', 'photo_url', 'linkedin_url', 'order_num', 'is_active'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
