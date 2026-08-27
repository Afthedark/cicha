<?php

namespace App\Models;

use CodeIgniter\Model;

class ArticleModel extends Model
{
    protected $table = 'articles';
    protected $primaryKey = 'id';
    protected $allowedFields = ['category_id', 'title', 'slug', 'summary', 'content', 'image_url', 'author', 'published_at', 'is_featured', 'status'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    public function getWithCategory($id = null)
    {
        $builder = $this->db->table($this->table)
            ->select('articles.*, categories.name as category_name, categories.slug as category_slug')
            ->join('categories', 'categories.id = articles.category_id', 'left');

        if ($id !== null) {
            return $builder->where('articles.id', $id)->get()->getRowArray();
        }

        return $builder->orderBy('articles.published_at', 'DESC')->get()->getResultArray();
    }
}
