<?php

namespace App\Controllers\Admin;

use App\Models\MemberModel;
use CodeIgniter\RESTful\ResourceController;

class MembersController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $memberModel = new MemberModel();
        $members = $memberModel->orderBy('company_name', 'ASC')->findAll();
        return $this->respond(['status' => 200, 'data' => $members]);
    }

    public function show($id = null)
    {
        $memberModel = new MemberModel();
        $member = $memberModel->find($id);
        if (!$member) return $this->failNotFound('Socio no encontrado');
        return $this->respond(['status' => 200, 'data' => $member]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true) ?: $this->request->getRawInput() ?: $this->request->getVar();

        $rules = [
            'company_name' => 'required|min_length[3]',
            'sector'       => 'required',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $slug = url_title($input['company_name'] ?? 'empresa', '-', true) . '-' . time();

        $data = [
            'company_name'  => $input['company_name'] ?? '',
            'slug'          => $slug,
            'sector'        => $input['sector'] ?? '',
            'description'   => $input['description'] ?? '',
            'services'      => $input['services'] ?? '',
            'logo_url'      => $input['logo_url'] ?? '',
            'website_url'   => $input['website_url'] ?? '',
            'contact_email' => $input['contact_email'] ?? '',
            'contact_phone' => $input['contact_phone'] ?? '',
            'country'       => $input['country'] ?? 'Argentina',
            'is_featured'   => !empty($input['is_featured']) ? 1 : 0,
            'status'        => $input['status'] ?? 'active',
        ];

        $memberModel = new MemberModel();
        $id = $memberModel->insert($data);

        return $this->respondCreated(['status' => 201, 'message' => 'Socio registrado con éxito', 'id' => $id]);
    }

    public function update($id = null)
    {
        $memberModel = new MemberModel();
        if (!$memberModel->find($id)) return $this->failNotFound('Socio no encontrado');

        $input = $this->request->getJSON(true) ?: $this->request->getRawInput() ?: $this->request->getVar();

        $data = [];
        if (isset($input['company_name'])) {
            $data['company_name'] = $input['company_name'];
            $data['slug'] = url_title($input['company_name'], '-', true) . '-' . $id;
        }
        if (isset($input['sector'])) $data['sector'] = $input['sector'];
        if (isset($input['description'])) $data['description'] = $input['description'];
        if (isset($input['services'])) $data['services'] = $input['services'];
        if (isset($input['logo_url'])) $data['logo_url'] = $input['logo_url'];
        if (isset($input['website_url'])) $data['website_url'] = $input['website_url'];
        if (isset($input['contact_email'])) $data['contact_email'] = $input['contact_email'];
        if (isset($input['contact_phone'])) $data['contact_phone'] = $input['contact_phone'];
        if (isset($input['country'])) $data['country'] = $input['country'];
        if (isset($input['is_featured'])) $data['is_featured'] = !empty($input['is_featured']) ? 1 : 0;
        if (isset($input['status'])) $data['status'] = $input['status'];

        if (!empty($data)) {
            $memberModel->update($id, $data);
        }

        return $this->respond(['status' => 200, 'message' => 'Socio actualizado con éxito']);
    }

    public function delete($id = null)
    {
        $memberModel = new MemberModel();
        if (!$memberModel->find($id)) return $this->failNotFound('Socio no encontrado');
        $memberModel->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'Socio eliminado']);
    }
}
