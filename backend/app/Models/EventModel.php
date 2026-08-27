<?php

namespace App\Models;

use CodeIgniter\Model;

class EventModel extends Model
{
    protected $table = 'events';
    protected $primaryKey = 'id';
    protected $allowedFields = ['category_id', 'title', 'slug', 'description', 'event_date', 'end_date', 'location_type', 'location_address', 'registration_url', 'image_url', 'organizer', 'is_featured', 'status'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    public function getWithCategory($id = null)
    {
        $builder = $this->db->table($this->table)
            ->select('events.*, categories.name as category_name')
            ->join('categories', 'categories.id = events.category_id', 'left');

        if ($id !== null) {
            return $builder->where('events.id', $id)->get()->getRowArray();
        }

        return $builder->orderBy('events.event_date', 'ASC')->get()->getResultArray();
    }
}
