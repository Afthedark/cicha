<?php

namespace App\Models;

use CodeIgniter\Model;

class GalleryPhotoModel extends Model
{
    protected $table = 'gallery_photos';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'album_id',
        'image_url',
        'caption',
        'order_num',
    ];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}
