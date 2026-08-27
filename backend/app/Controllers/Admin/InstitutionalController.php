<?php

namespace App\Controllers\Admin;

use App\Models\InstitutionalSectionModel;
use CodeIgniter\RESTful\ResourceController;

class InstitutionalController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new InstitutionalSectionModel();
        $sections = $model->orderBy('order_num', 'ASC')->findAll();
        return $this->respond(['status' => 200, 'data' => $sections]);
    }

    public function show($id = null)
    {
        $model = new InstitutionalSectionModel();
        $section = $model->find($id);
        if (!$section) return $this->failNotFound('Sección institucional no encontrada');
        return $this->respond(['status' => 200, 'data' => $section]);
    }

    public function update($id = null)
    {
        $model = new InstitutionalSectionModel();
        if (!$model->find($id)) return $this->failNotFound('Sección no encontrada');

        $input = $this->request->getRawInput();
        if (empty($input)) $input = $this->request->getVar();

        $data = [];
        if (isset($input['title'])) $data['title'] = $input['title'];
        if (isset($input['subtitle'])) $data['subtitle'] = $input['subtitle'];
        if (isset($input['content'])) $data['content'] = $input['content'];
        if (isset($input['image_url'])) $data['image_url'] = $input['image_url'];
        if (isset($input['icon_name'])) $data['icon_name'] = $input['icon_name'];
        if (isset($input['order_num'])) $data['order_num'] = (int) $input['order_num'];
        if (isset($input['is_active'])) $data['is_active'] = $input['is_active'] ? 1 : 0;

        $model->update($id, $data);
        return $this->respond(['status' => 200, 'message' => 'Sección actualizada con éxito']);
    }
}
