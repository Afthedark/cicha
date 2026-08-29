<?php

namespace App\Controllers\Admin;

use App\Models\BannerModel;
use CodeIgniter\RESTful\ResourceController;

class BannersController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $bannerModel = new BannerModel();
        $banners = $bannerModel->orderBy('order_num', 'ASC')->orderBy('id', 'DESC')->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => $banners,
        ]);
    }

    public function show($id = null)
    {
        $bannerModel = new BannerModel();
        $banner = $bannerModel->find($id);

        if (!$banner) {
            return $this->failNotFound('Portada no encontrada.');
        }

        return $this->respond([
            'status' => 200,
            'data'   => $banner,
        ]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true);
        if (empty($input)) {
            $input = $this->request->getRawInput();
        }
        if (empty($input)) {
            $input = $this->request->getVar();
        }

        $bannerModel = new BannerModel();

        $data = [
            'title'       => $input['title'] ?? '',
            'subtitle'    => $input['subtitle'] ?? '',
            'badge_text'  => $input['badge_text'] ?? null,
            'image_url'   => $input['image_url'] ?? null,
            'button_text' => $input['button_text'] ?? null,
            'button_url'  => $input['button_url'] ?? null,
            'order_num'   => isset($input['order_num']) ? (int)$input['order_num'] : 1,
            'is_active'   => isset($input['is_active']) ? (int)$input['is_active'] : 1,
        ];

        if (!$bannerModel->insert($data)) {
            return $this->failValidationErrors($bannerModel->errors());
        }

        $newId = $bannerModel->getInsertID();
        $created = $bannerModel->find($newId);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Portada creada exitosamente.',
            'data'    => $created,
        ]);
    }

    public function update($id = null)
    {
        $bannerModel = new BannerModel();
        $banner = $bannerModel->find($id);

        if (!$banner) {
            return $this->failNotFound('Portada no encontrada.');
        }

        $input = $this->request->getJSON(true);
        if (empty($input)) {
            $input = $this->request->getRawInput();
        }
        if (empty($input)) {
            $input = $this->request->getVar();
        }

        $data = [];
        if (isset($input['title'])) $data['title'] = $input['title'];
        if (array_key_exists('subtitle', $input)) $data['subtitle'] = $input['subtitle'];
        if (array_key_exists('badge_text', $input)) $data['badge_text'] = $input['badge_text'];
        if (array_key_exists('image_url', $input)) $data['image_url'] = $input['image_url'];
        if (array_key_exists('button_text', $input)) $data['button_text'] = $input['button_text'];
        if (array_key_exists('button_url', $input)) $data['button_url'] = $input['button_url'];
        if (isset($input['order_num'])) $data['order_num'] = (int)$input['order_num'];
        if (isset($input['is_active'])) $data['is_active'] = (int)$input['is_active'];

        if (!empty($data)) {
            $bannerModel->update($id, $data);
        }

        $updated = $bannerModel->find($id);

        return $this->respond([
            'status'  => 200,
            'message' => 'Portada actualizada exitosamente.',
            'data'    => $updated,
        ]);
    }

    public function delete($id = null)
    {
        $bannerModel = new BannerModel();
        $banner = $bannerModel->find($id);

        if (!$banner) {
            return $this->failNotFound('Portada no encontrada.');
        }

        $bannerModel->delete($id);

        return $this->respondDeleted([
            'status'  => 200,
            'message' => 'Portada eliminada exitosamente.',
        ]);
    }
}
