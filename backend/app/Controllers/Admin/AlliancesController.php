<?php

namespace App\Controllers\Admin;

use App\Models\AllianceModel;
use CodeIgniter\RESTful\ResourceController;

class AlliancesController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new AllianceModel();
        $items = $model->orderBy('order_num', 'ASC')->findAll();
        return $this->respond(['status' => 200, 'data' => $items]);
    }

    public function show($id = null)
    {
        $model = new AllianceModel();
        $item = $model->find($id);
        if (!$item) return $this->failNotFound('Alianza no encontrada');
        return $this->respond(['status' => 200, 'data' => $item]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true) ?: $this->request->getRawInput() ?: $this->request->getVar();

        $rules = [
            'name' => 'required|min_length[3]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $name = $input['name'] ?? 'alianza';
        $slug = url_title($name, '-', true) . '-' . time();

        $data = [
            'name'           => $name,
            'slug'           => $slug,
            'category'       => $input['category'] ?? 'institucional',
            'description'    => $input['description'] ?? '',
            'website_url'    => $input['website_url'] ?? '',
            'logo_url'       => $input['logo_url'] ?? '',
            'highlight_text' => $input['highlight_text'] ?? '',
            'order_num'      => (int) ($input['order_num'] ?? 0),
            'is_active'      => !empty($input['is_active']) ? 1 : 0,
        ];

        $model = new AllianceModel();
        $id = $model->insert($data);

        return $this->respondCreated(['status' => 201, 'message' => 'Alianza creada con éxito', 'id' => $id]);
    }

    public function update($id = null)
    {
        $model = new AllianceModel();
        if (!$model->find($id)) return $this->failNotFound('Alianza no encontrada');

        $input = $this->request->getJSON(true) ?: $this->request->getRawInput() ?: $this->request->getVar();

        $data = [];
        if (isset($input['name'])) {
            $data['name'] = $input['name'];
            $data['slug'] = url_title($input['name'], '-', true) . '-' . $id;
        }
        if (isset($input['category'])) $data['category'] = $input['category'];
        if (isset($input['description'])) $data['description'] = $input['description'];
        if (isset($input['website_url'])) $data['website_url'] = $input['website_url'];
        if (isset($input['logo_url'])) $data['logo_url'] = $input['logo_url'];
        if (isset($input['highlight_text'])) $data['highlight_text'] = $input['highlight_text'];
        if (isset($input['order_num'])) $data['order_num'] = (int) $input['order_num'];
        if (isset($input['is_active'])) $data['is_active'] = !empty($input['is_active']) ? 1 : 0;

        if (!empty($data)) {
            $model->update($id, $data);
        }

        return $this->respond(['status' => 200, 'message' => 'Alianza actualizada con éxito']);
    }

    public function delete($id = null)
    {
        $model = new AllianceModel();
        if (!$model->find($id)) return $this->failNotFound('Alianza no encontrada');
        $model->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'Alianza eliminada']);
    }
}
