<?php

namespace App\Models;

use CodeIgniter\Model;

class CommercialOpportunityModel extends Model
{
    protected $table = 'commercial_opportunities';
    protected $primaryKey = 'id';
    protected $allowedFields = ['title', 'slug', 'type', 'origin_country', 'target_country', 'sector', 'description', 'requirements', 'contact_person', 'contact_email', 'status', 'deadline'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
