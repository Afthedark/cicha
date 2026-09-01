<?php

namespace App\Controllers\Admin;

use App\Models\PhotoAlbumModel;
use App\Models\GalleryPhotoModel;
use CodeIgniter\RESTful\ResourceController;

class GalleryController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $albumModel = new PhotoAlbumModel();
        $albums = $albumModel->getWithPhotos();
        return $this->respond(['status' => 200, 'data' => $albums]);
    }

    public function show($id = null)
    {
        $albumModel = new PhotoAlbumModel();
        $album = $albumModel->getWithPhotos($id);
        if (!$album) {
            return $this->failNotFound('Álbum de fotos no encontrado');
        }
        return $this->respond(['status' => 200, 'data' => $album]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true) ?: $this->request->getRawInput() ?: $this->request->getVar();

        $rules = [
            'title' => 'required|min_length[3]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $title = $input['title'] ?? 'album';
        $slug = url_title($title, '-', true) . '-' . time();

        $albumData = [
            'title'           => $title,
            'slug'            => $slug,
            'description'     => $input['description'] ?? '',
            'cover_image_url' => $input['cover_image_url'] ?? '',
            'event_date'      => !empty($input['event_date']) ? $input['event_date'] : date('Y-m-d'),
            'category'        => $input['category'] ?? 'Institucional',
            'order_num'       => (int)($input['order_num'] ?? 0),
            'is_active'       => !empty($input['is_active']) ? 1 : 0,
        ];

        $albumModel = new PhotoAlbumModel();
        $albumId = $albumModel->insert($albumData);

        // Si se enviaron fotos iniciales
        if (!empty($input['photos']) && is_array($input['photos'])) {
            $photoModel = new GalleryPhotoModel();
            foreach ($input['photos'] as $idx => $photo) {
                $imgUrl = is_array($photo) ? ($photo['image_url'] ?? '') : $photo;
                $caption = is_array($photo) ? ($photo['caption'] ?? '') : '';
                if (!empty($imgUrl)) {
                    $photoModel->insert([
                        'album_id'  => $albumId,
                        'image_url' => $imgUrl,
                        'caption'   => $caption,
                        'order_num' => $idx + 1,
                    ]);
                }
            }
        }

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Álbum y fotos creados con éxito',
            'data'    => array_merge(['id' => $albumId], $albumData),
        ]);
    }

    public function update($id = null)
    {
        $albumModel = new PhotoAlbumModel();
        $existing = $albumModel->find($id);
        if (!$existing) {
            return $this->failNotFound('Álbum no encontrado');
        }

        $input = $this->request->getJSON(true) ?: $this->request->getRawInput() ?: $this->request->getVar();

        $albumData = [
            'title'           => $input['title'] ?? $existing['title'],
            'description'     => $input['description'] ?? $existing['description'],
            'cover_image_url' => $input['cover_image_url'] ?? $existing['cover_image_url'],
            'event_date'      => $input['event_date'] ?? $existing['event_date'],
            'category'        => $input['category'] ?? $existing['category'],
            'order_num'       => isset($input['order_num']) ? (int)$input['order_num'] : $existing['order_num'],
            'is_active'       => isset($input['is_active']) ? (int)$input['is_active'] : $existing['is_active'],
        ];

        if (!empty($input['title']) && $input['title'] !== $existing['title']) {
            $albumData['slug'] = url_title($input['title'], '-', true) . '-' . $existing['id'];
        }

        $albumModel->update($id, $albumData);

        // Si se actualizan o reemplazan fotos
        if (isset($input['photos']) && is_array($input['photos'])) {
            $photoModel = new GalleryPhotoModel();
            $photoModel->where('album_id', $id)->delete();

            foreach ($input['photos'] as $idx => $photo) {
                $imgUrl = is_array($photo) ? ($photo['image_url'] ?? '') : $photo;
                $caption = is_array($photo) ? ($photo['caption'] ?? '') : '';
                if (!empty($imgUrl)) {
                    $photoModel->insert([
                        'album_id'  => $id,
                        'image_url' => $imgUrl,
                        'caption'   => $caption,
                        'order_num' => $idx + 1,
                    ]);
                }
            }
        }

        return $this->respond([
            'status'  => 200,
            'message' => 'Álbum actualizado correctamente',
            'data'    => array_merge(['id' => $id], $albumData),
        ]);
    }

    public function delete($id = null)
    {
        $albumModel = new PhotoAlbumModel();
        if (!$albumModel->find($id)) {
            return $this->failNotFound('Álbum no encontrado');
        }

        $albumModel->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'Álbum y fotos eliminados']);
    }

    public function addPhoto($albumId = null)
    {
        $input = $this->request->getJSON(true) ?: $this->request->getRawInput() ?: $this->request->getVar();
        $imageUrl = $input['image_url'] ?? '';

        if (empty($imageUrl)) {
            return $this->failValidationError('Se requiere la URL de la imagen.');
        }

        $photoModel = new GalleryPhotoModel();
        $photoId = $photoModel->insert([
            'album_id'  => $albumId,
            'image_url' => $imageUrl,
            'caption'   => $input['caption'] ?? '',
            'order_num' => (int)($input['order_num'] ?? 0),
        ]);

        return $this->respondCreated(['status' => 201, 'message' => 'Foto agregada', 'id' => $photoId]);
    }

    public function deletePhoto($photoId = null)
    {
        $photoModel = new GalleryPhotoModel();
        if (!$photoModel->find($photoId)) {
            return $this->failNotFound('Foto no encontrada');
        }

        $photoModel->delete($photoId);
        return $this->respondDeleted(['status' => 200, 'message' => 'Foto eliminada']);
    }
}
