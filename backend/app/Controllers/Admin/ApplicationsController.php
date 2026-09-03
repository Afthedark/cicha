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

        $input = $this->request->getJSON(true) ?: $this->request->getRawInput() ?: $this->request->getVar();

        $allowedFields = [
            'status',
            'notes',
            'internal_verdict',
            'internal_reasons',
            'verdict_date',
            'approved_by_president',
            'approved_by_secretary',
            'approved_by_treasurer',
        ];

        $data = [];
        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $data[$field] = $input[$field];
            }
        }

        // Auto-sync status if internal_verdict is changed
        if (!empty($input['internal_verdict'])) {
            if ($input['internal_verdict'] === 'approved') {
                $data['status'] = 'approved';
            } elseif ($input['internal_verdict'] === 'rejected') {
                $data['status'] = 'rejected';
            }
        }

        $model->update($id, $data);
        return $this->respond(['status' => 200, 'message' => 'Solicitud de afiliación actualizada correctamente']);
    }

    public function delete($id = null)
    {
        $model = new MembershipApplicationModel();
        if (!$model->find($id)) return $this->failNotFound('Solicitud no encontrada');
        $model->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'Solicitud eliminada']);
    }
}
