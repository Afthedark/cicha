<?php

namespace App\Controllers\Admin;

use App\Models\PartnerBenefitModel;
use CodeIgniter\RESTful\ResourceController;

class PartnerBenefitsController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new PartnerBenefitModel();
        $items = $model->orderBy('created_at', 'DESC')->findAll();
        return $this->respond(['status' => 200, 'data' => $items]);
    }

    public function show($id = null)
    {
        $model = new PartnerBenefitModel();
        $item = $model->find($id);
        if (!$item) return $this->failNotFound('Beneficio no encontrado');
        return $this->respond(['status' => 200, 'data' => $item]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true) ?: $this->request->getVar();

        $rules = [
            'title'                => 'required|min_length[3]',
            'provider_company'     => 'required',
            'discount_description' => 'required',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = [
            'title'                => $input['title'],
            'provider_company'     => $input['provider_company'],
            'category'             => $input['category'] ?? 'Comercial',
            'discount_description' => $input['discount_description'],
            'how_to_claim'         => $input['how_to_claim'] ?? '',
            'logo_url'             => $input['logo_url'] ?? '',
            'valid_until'          => !empty($input['valid_until']) ? $input['valid_until'] : null,
            'is_active'            => !empty($input['is_active']) ? 1 : 0,
        ];

        $model = new PartnerBenefitModel();
        $id = $model->insert($data);

        return $this->respondCreated(['status' => 201, 'message' => 'Beneficio creado con éxito', 'id' => $id]);
    }

    public function update($id = null)
    {
        $model = new PartnerBenefitModel();
        if (!$model->find($id)) return $this->failNotFound('Beneficio no encontrado');

        $input = $this->request->getJSON(true) ?: ($this->request->getRawInput() ?: $this->request->getVar());

        $data = [];
        if (isset($input['title'])) $data['title'] = $input['title'];
        if (isset($input['provider_company'])) $data['provider_company'] = $input['provider_company'];
        if (isset($input['category'])) $data['category'] = $input['category'];
        if (isset($input['discount_description'])) $data['discount_description'] = $input['discount_description'];
        if (isset($input['how_to_claim'])) $data['how_to_claim'] = $input['how_to_claim'];
        if (isset($input['logo_url'])) $data['logo_url'] = $input['logo_url'];
        if (isset($input['valid_until'])) $data['valid_until'] = !empty($input['valid_until']) ? $input['valid_until'] : null;
        if (isset($input['is_active'])) $data['is_active'] = $input['is_active'] ? 1 : 0;

        $model->update($id, $data);
        return $this->respond(['status' => 200, 'message' => 'Beneficio actualizado con éxito']);
    }

    public function delete($id = null)
    {
        $model = new PartnerBenefitModel();
        if (!$model->find($id)) return $this->failNotFound('Beneficio no encontrado');
        $model->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'Beneficio eliminado']);
    }
}
