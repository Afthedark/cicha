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
        $rules = [
            'company_name' => 'required|min_length[2]',
            'sector'       => 'required',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $company = $this->request->getVar('company_name');
        $slug = url_title($company, '-', true) . '-' . time();

        $data = [
            'company_name'  => $company,
            'slug'          => $slug,
            'sector'        => $this->request->getVar('sector'),
            'description'   => $this->request->getVar('description') ?: '',
            'services'      => $this->request->getVar('services') ?: '',
            'logo_url'      => $this->request->getVar('logo_url') ?: '',
            'website_url'   => $this->request->getVar('website_url') ?: '',
            'contact_email' => $this->request->getVar('contact_email') ?: '',
            'contact_phone' => $this->request->getVar('contact_phone') ?: '',
            'country'       => $this->request->getVar('country') ?: 'Argentina',
            'is_featured'   => $this->request->getVar('is_featured') ? 1 : 0,
            'status'        => $this->request->getVar('status') ?: 'active',
        ];

        $memberModel = new MemberModel();
        $id = $memberModel->insert($data);

        return $this->respondCreated(['status' => 201, 'message' => 'Socio registrado con éxito', 'id' => $id]);
    }

    public function update($id = null)
    {
        $memberModel = new MemberModel();
        if (!$memberModel->find($id)) return $this->failNotFound('Socio no encontrado');

        $input = $this->request->getRawInput();
        if (empty($input)) $input = $this->request->getVar();

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
        if (isset($input['is_featured'])) $data['is_featured'] = $input['is_featured'] ? 1 : 0;
        if (isset($input['status'])) $data['status'] = $input['status'];

        $memberModel->update($id, $data);
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
