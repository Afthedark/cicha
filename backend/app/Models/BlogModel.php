<?php

namespace App\Models;

use CodeIgniter\Model;

class BlogModel extends Model
{
    protected $table = 'blogs';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'title',
        'slug',
        'author',
        'author_role',
        'summary',
        'content',
        'image_url',
        'category',
        'tags',
        'read_time',
        'is_featured',
        'status',
        'published_at',
    ];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    public function getPublished($category = null, $search = null)
    {
        $builder = $this->where('status', 'published');

        if (!empty($category) && $category !== 'all') {
            $builder->where('category', $category);
        }

        if (!empty($search)) {
            $builder->groupStart()
                ->like('title', $search)
                ->orLike('summary', $search)
                ->orLike('content', $search)
                ->orLike('tags', $search)
                ->groupEnd();
        }

        return $builder->orderBy('published_at', 'DESC')->findAll();
    }
}
