<?php

namespace App\Models;

use CodeIgniter\Model;

class InterestLinkModel extends Model
{
    protected $table          = 'interest_links';
    protected $primaryKey     = 'id';
    protected $useAutoIncrement = true;
    protected $returnType     = 'array';
    
    // Soft Deletes enabled
    protected $useSoftDeletes = true;
    protected $deletedField   = 'deleted_at';

    protected $allowedFields = [
        'category_id',
        'title',
        'description',
        'url',
        'logo_url',
        'order_num',
        'is_featured',
        'is_active',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'title' => 'required|min_length[2]|max_length[255]',
        'url'   => 'required|valid_url|max_length[500]',
    ];

    /**
     * Get links joined with category information
     */
    public function getWithCategory(?int $categoryId = null, ?string $categorySlug = null, bool $onlyActive = false)
    {
        $builder = $this->select('interest_links.*, categories.name as category_name, categories.slug as category_slug')
            ->join('categories', 'categories.id = interest_links.category_id', 'left');

        if ($onlyActive) {
            $builder->where('interest_links.is_active', 1);
        }

        if ($categoryId !== null) {
            $builder->where('interest_links.category_id', $categoryId);
        }

        if ($categorySlug !== null && $categorySlug !== 'all') {
            $builder->where('categories.slug', $categorySlug);
        }

        return $builder->orderBy('interest_links.order_num', 'ASC')
            ->orderBy('interest_links.created_at', 'DESC')
            ->findAll();
    }
}
