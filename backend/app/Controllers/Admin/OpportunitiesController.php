<?php

namespace App\Controllers\Admin;

use App\Models\CommercialOpportunityModel;
use CodeIgniter\RESTful\ResourceController;

class OpportunitiesController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new CommercialOpportunityModel();
        $items = $model->orderBy('created_at', 'DESC')->findAll();
        return $this->respond(['status' => 200, 'data' => $items]);
    }

    public function show($id = null)
    {
        $model = new CommercialOpportunityModel();
        $item = $model->find($id);
        if (!$item) return $this->failNotFound('Oportunidad no encontrada');
        return $this->respond(['status' => 200, 'data' => $item]);
    }

    public function create()
    {
        $rules = [
            'title'       => 'required|min_length[3]',
            'sector'      => 'required',
            'description' => 'required',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $title = $this->request->getVar('title');
        $slug = url_title($title, '-', true) . '-' . time();

        $data = [
            'title'          => $title,
            'slug'           => $slug,
            'type'           => $this->request->getVar('type') ?: 'export',
            'origin_country' => $this->request->getVar('origin_country') ?: 'Grecia',
            'target_country' => $this->request->getVar('target_country') ?: 'Argentina',
            'sector'         => $this->request->getVar('sector'),
            'description'    => $this->request->getVar('description'),
            'requirements'   => $this->request->getVar('requirements') ?: '',
            'contact_person' => $this->request->getVar('contact_person') ?: '',
            'contact_email'  => $this->request->getVar('contact_email') ?: '',
            'status'         => $this->request->getVar('status') ?: 'open',
            'deadline'       => $this->request->getVar('deadline') ?: null,
        ];

        $model = new CommercialOpportunityModel();
        $id = $model->insert($data);

        return $this->respondCreated(['status' => 201, 'message' => 'Oportunidad creada con éxito', 'id' => $id]);
    }

    public function update($id = null)
    {
        $model = new CommercialOpportunityModel();
        if (!$model->find($id)) return $this->failNotFound('Oportunidad no encontrada');

        $input = $this->request->getRawInput();
        if (empty($input)) $input = $this->request->getVar();

        $data = [];
        if (isset($input['title'])) {
            $data['title'] = $input['title'];
            $data['slug'] = url_title($input['title'], '-', true) . '-' . $id;
        }
        if (isset($input['type'])) $data['type'] = $input['type'];
        if (isset($input['origin_country'])) $data['origin_country'] = $input['origin_country'];
        if (isset($input['target_country'])) $data['target_country'] = $input['target_country'];
        if (isset($input['sector'])) $data['sector'] = $input['sector'];
        if (isset($input['description'])) $data['description'] = $input['description'];
        if (isset($input['requirements'])) $data['requirements'] = $input['requirements'];
        if (isset($input['contact_person'])) $data['contact_person'] = $input['contact_person'];
        if (isset($input['contact_email'])) $data['contact_email'] = $input['contact_email'];
        if (isset($input['status'])) $data['status'] = $input['status'];
        if (isset($input['deadline'])) $data['deadline'] = $input['deadline'] ?: null;

        $model->update($id, $data);
        return $this->respond(['status' => 200, 'message' => 'Oportunidad comercial actualizada']);
    }

    public function delete($id = null)
    {
        $model = new CommercialOpportunityModel();
        if (!$model->find($id)) return $this->failNotFound('Oportunidad no encontrada');
        $model->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'Oportunidad eliminada']);
    }
}
