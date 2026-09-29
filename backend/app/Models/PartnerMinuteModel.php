<?php

namespace App\Models;

use CodeIgniter\Model;

class PartnerMinuteModel extends Model
{
    protected $table            = 'partner_minutes';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'user_id',
        'member_id',
        'title',
        'category',
        'categories',
        'description',
        'content',
        'cover_image_url',
        'author_avatar_url',
        'logo_url',
        'document_type',
        'file_url',
        'file_name',
        'file_size',
        'meeting_date',
        'downloads',
        'is_active',
    ];

    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'title'         => 'required|min_length[3]|max_length[255]',
        'document_type' => 'permit_empty|in_list[file,url,text,both]',
        'file_url'      => 'permit_empty|max_length[1000]',
    ];
}
