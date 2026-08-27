<?php

namespace App\Controllers\Admin;

use App\Models\PartnerResourceModel;
use CodeIgniter\RESTful\ResourceController;

class PartnerResourcesController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new PartnerResourceModel();
        $items = $model->orderBy('created_at', 'DESC')->findAll();
        return $this->respond(['status' => 200, 'data' => $items]);
    }

    public function show($id = null)
    {
        $model = new PartnerResourceModel();
        $item = $model->find($id);
        if (!$item) return $this->failNotFound('Recurso no encontrado');
        return $this->respond(['status' => 200, 'data' => $item]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true) ?: $this->request->getVar();

        $rules = [
            'title'    => 'required|min_length[3]',
            'file_url' => 'required',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = [
            'title'       => $input['title'],
            'category'    => $input['category'] ?? 'informe_mercado',
            'description' => $input['description'] ?? '',
            'file_url'    => $input['file_url'],
            'file_type'   => $input['file_type'] ?? 'PDF',
            'file_size'   => $input['file_size'] ?? '1.5 MB',
            'downloads'   => 0,
            'is_active'   => !empty($input['is_active']) ? 1 : 0,
        ];

        $model = new PartnerResourceModel();
        $id = $model->insert($data);

        return $this->respondCreated(['status' => 201, 'message' => 'Recurso creado con éxito', 'id' => $id]);
    }

    public function update($id = null)
    {
        $model = new PartnerResourceModel();
        if (!$model->find($id)) return $this->failNotFound('Recurso no encontrado');

        $input = $this->request->getJSON(true) ?: ($this->request->getRawInput() ?: $this->request->getVar());

        $data = [];
        if (isset($input['title'])) $data['title'] = $input['title'];
        if (isset($input['category'])) $data['category'] = $input['category'];
        if (isset($input['description'])) $data['description'] = $input['description'];
        if (isset($input['file_url'])) $data['file_url'] = $input['file_url'];
        if (isset($input['file_type'])) $data['file_type'] = $input['file_type'];
        if (isset($input['file_size'])) $data['file_size'] = $input['file_size'];
        if (isset($input['is_active'])) $data['is_active'] = $input['is_active'] ? 1 : 0;

        $model->update($id, $data);
        return $this->respond(['status' => 200, 'message' => 'Recurso actualizado con éxito']);
    }

    public function delete($id = null)
    {
        $model = new PartnerResourceModel();
        if (!$model->find($id)) return $this->failNotFound('Recurso no encontrado');
        $model->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'Recurso eliminado']);
    }
}
