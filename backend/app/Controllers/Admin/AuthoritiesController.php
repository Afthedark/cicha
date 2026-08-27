<?php

namespace App\Controllers\Admin;

use App\Models\AuthorityModel;
use CodeIgniter\RESTful\ResourceController;

class AuthoritiesController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new AuthorityModel();
        $items = $model->orderBy('order_num', 'ASC')->findAll();
        return $this->respond(['status' => 200, 'data' => $items]);
    }

    public function show($id = null)
    {
        $model = new AuthorityModel();
        $item = $model->find($id);
        if (!$item) return $this->failNotFound('Autoridad no encontrada');
        return $this->respond(['status' => 200, 'data' => $item]);
    }

    public function create()
    {
        $rules = [
            'name'       => 'required|min_length[3]',
            'role_title' => 'required',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = [
            'name'         => $this->request->getVar('name'),
            'role_title'   => $this->request->getVar('role_title'),
            'category'     => $this->request->getVar('category') ?: 'directiva',
            'company'      => $this->request->getVar('company') ?: '',
            'bio'          => $this->request->getVar('bio') ?: '',
            'photo_url'    => $this->request->getVar('photo_url') ?: '',
            'linkedin_url' => $this->request->getVar('linkedin_url') ?: '',
            'order_num'    => (int) ($this->request->getVar('order_num') ?: 0),
            'is_active'    => $this->request->getVar('is_active') ? 1 : 0,
        ];

        $model = new AuthorityModel();
        $id = $model->insert($data);

        return $this->respondCreated(['status' => 201, 'message' => 'Autoridad creada con éxito', 'id' => $id]);
    }

    public function update($id = null)
    {
        $model = new AuthorityModel();
        if (!$model->find($id)) return $this->failNotFound('Autoridad no encontrada');

        $input = $this->request->getRawInput();
        if (empty($input)) $input = $this->request->getVar();

        $data = [];
        if (isset($input['name'])) $data['name'] = $input['name'];
        if (isset($input['role_title'])) $data['role_title'] = $input['role_title'];
        if (isset($input['category'])) $data['category'] = $input['category'];
        if (isset($input['company'])) $data['company'] = $input['company'];
        if (isset($input['bio'])) $data['bio'] = $input['bio'];
        if (isset($input['photo_url'])) $data['photo_url'] = $input['photo_url'];
        if (isset($input['linkedin_url'])) $data['linkedin_url'] = $input['linkedin_url'];
        if (isset($input['order_num'])) $data['order_num'] = (int) $input['order_num'];
        if (isset($input['is_active'])) $data['is_active'] = $input['is_active'] ? 1 : 0;

        $model->update($id, $data);
        return $this->respond(['status' => 200, 'message' => 'Autoridad actualizada con éxito']);
    }

    public function delete($id = null)
    {
        $model = new AuthorityModel();
        if (!$model->find($id)) return $this->failNotFound('Autoridad no encontrada');
        $model->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'Autoridad eliminada']);
    }
}
