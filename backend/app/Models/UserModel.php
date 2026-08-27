<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $allowedFields = ['name', 'email', 'password', 'role', 'member_id', 'avatar', 'status'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    public function getUsersWithMember()
    {
        return $this->db->table('users')
            ->select('users.id, users.name, users.email, users.role, users.member_id, users.avatar, users.status, users.created_at, members.company_name as member_company_name')
            ->join('members', 'members.id = users.member_id', 'left')
            ->orderBy('users.id', 'DESC')
            ->get()->getResultArray();
    }
}
