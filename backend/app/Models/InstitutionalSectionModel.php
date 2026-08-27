<?php

namespace App\Models;

use CodeIgniter\Model;

class InstitutionalSectionModel extends Model
{
    protected $table = 'institutional_sections';
    protected $primaryKey = 'id';
    protected $allowedFields = ['section_key', 'title', 'subtitle', 'content', 'image_url', 'icon_name', 'order_num', 'is_active'];
    protected $useTimestamps = true;
    protected $createdField = '';
    protected $updatedField = 'updated_at';
}
