<?php

namespace App\Models;

use CodeIgniter\Model;

class MembershipApplicationModel extends Model
{
    protected $table = 'membership_applications';
    protected $primaryKey = 'id';
    protected $allowedFields = ['company_name', 'contact_name', 'contact_role', 'email', 'phone', 'cuit_rut', 'sector', 'website', 'interests', 'comments', 'status', 'notes'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
