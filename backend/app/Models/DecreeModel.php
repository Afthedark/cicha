<?php

namespace App\Models;

use CodeIgniter\Model;

class DecreeModel extends Model
{
    protected $table            = 'decrees';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'title',
        'decree_number',
        'description',
        'logo_url',
        'document_type',
        'file_url',
        'file_name',
        'file_size',
        'issue_date',
        'downloads',
        'is_active',
    ];

    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'title'         => 'required|min_length[3]|max_length[255]',
        'file_url'      => 'required|max_length[1000]',
        'document_type' => 'in_list[file,url]',
    ];
}
