<?php

namespace App\Models;

use CodeIgniter\Model;

class CommercialOpportunityModel extends Model
{
    protected $table = 'commercial_opportunities';
    protected $primaryKey = 'id';
    protected $useSoftDeletes = true;
    protected $deletedField = 'deleted_at';
    protected $allowedFields = ['title', 'slug', 'type', 'origin_country', 'target_country', 'sector', 'categories', 'description', 'requirements', 'contact_person', 'contact_email', 'status', 'deadline', 'deleted_at'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}

