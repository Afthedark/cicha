<?php

namespace App\Controllers\Admin;

use App\Models\MembershipApplicationModel;
use CodeIgniter\RESTful\ResourceController;

class ApplicationsController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new MembershipApplicationModel();
        $status = $this->request->getGet('status');

        $builder = $model->orderBy('created_at', 'DESC');
        if ($status) {
            $builder->where('status', $status);
        }

        $items = $builder->findAll();
        return $this->respond(['status' => 200, 'data' => $items]);
    }

    public function show($id = null)
    {
        $model = new MembershipApplicationModel();
        $item = $model->find($id);
        if (!$item) return $this->failNotFound('Solicitud no encontrada');
        return $this->respond(['status' => 200, 'data' => $item]);
    }

    public function update($id = null)
    {
        $model = new MembershipApplicationModel();
        if (!$model->find($id)) return $this->failNotFound('Solicitud no encontrada');

        $input = $this->request->getRawInput();
        if (empty($input)) $input = $this->request->getVar();

        $data = [];
        if (isset($input['status'])) $data['status'] = $input['status'];
        if (isset($input['notes'])) $data['notes'] = $input['notes'];

        $model->update($id, $data);
        return $this->respond(['status' => 200, 'message' => 'Solicitud de afiliación actualizada']);
    }

    public function delete($id = null)
    {
        $model = new MembershipApplicationModel();
        if (!$model->find($id)) return $this->failNotFound('Solicitud no encontrada');
        $model->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'Solicitud eliminada']);
    }
}
