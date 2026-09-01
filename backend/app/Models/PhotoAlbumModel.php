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

    public function getWithPhotos($id = null)
    {
        if ($id !== null) {
            $album = $this->find($id);
            if ($album) {
                $photoModel = new GalleryPhotoModel();
                $album['photos'] = $photoModel->where('album_id', $id)->orderBy('order_num', 'ASC')->findAll();
            }
            return $album;
        }

        $albums = $this->orderBy('order_num', 'ASC')->orderBy('event_date', 'DESC')->findAll();
        $photoModel = new GalleryPhotoModel();

        foreach ($albums as &$album) {
            $album['photos_count'] = $photoModel->where('album_id', $album['id'])->countAllResults();
            $album['photos'] = $photoModel->where('album_id', $album['id'])->orderBy('order_num', 'ASC')->limit(6)->findAll();
        }

        return $albums;
    }
}
