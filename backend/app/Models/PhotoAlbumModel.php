<?php

namespace App\Models;

use CodeIgniter\Model;

class PhotoAlbumModel extends Model
{
    protected $table = 'photo_albums';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'title',
        'slug',
        'description',
        'cover_image_url',
        'event_date',
        'category',
        'order_num',
        'is_active',
    ];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    public function getWithPhotos($id = null, $search = null, $category = null, $limit = null)
    {
        if ($id !== null) {
            $album = $this->find($id);
            if ($album) {
                $photoModel = new GalleryPhotoModel();
                $album['photos'] = $photoModel->where('album_id', $id)->orderBy('order_num', 'ASC')->findAll();
            }
            return $album;
        }

        $builder = $this->orderBy('order_num', 'ASC')->orderBy('event_date', 'DESC');

        if (!empty($search)) {
            $builder->groupStart()
                ->like('title', $search)
                ->orLike('description', $search)
                ->orLike('category', $search)
                ->groupEnd();
        }

        if (!empty($category) && $category !== 'all') {
            $builder->where('category', $category);
        }

        if ($limit !== null && $limit > 0) {
            $builder->limit($limit);
        }

        $albums = $builder->findAll();
        $photoModel = new GalleryPhotoModel();

        foreach ($albums as &$album) {
            $album['photos_count'] = $photoModel->where('album_id', $album['id'])->countAllResults();
            $album['photos'] = $photoModel->where('album_id', $album['id'])->orderBy('order_num', 'ASC')->limit(6)->findAll();
        }

        return $albums;
    }
}
