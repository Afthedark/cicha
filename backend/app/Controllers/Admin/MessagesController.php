<?php

namespace App\Controllers\Admin;

use App\Models\ContactMessageModel;
use CodeIgniter\RESTful\ResourceController;

class MessagesController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new ContactMessageModel();
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
        $model = new ContactMessageModel();
        $item = $model->find($id);
        if (!$item) return $this->failNotFound('Mensaje no encontrado');

        // Mark as read automatically when opened
        if ($item['is_read'] == 0) {
            $model->update($id, ['is_read' => 1]);
            $item['is_read'] = 1;
        }

        return $this->respond(['status' => 200, 'data' => $item]);
    }

    public function update($id = null)
    {
        $model = new ContactMessageModel();
        if (!$model->find($id)) return $this->failNotFound('Mensaje no encontrado');

        $input = $this->request->getRawInput();
        if (empty($input)) $input = $this->request->getVar();

        $data = [];
        if (isset($input['is_read'])) $data['is_read'] = $input['is_read'] ? 1 : 0;
        if (isset($input['status'])) $data['status'] = $input['status'];

        $model->update($id, $data);
        return $this->respond(['status' => 200, 'message' => 'Estado del mensaje actualizado']);
    }

    public function delete($id = null)
    {
        $model = new ContactMessageModel();
        if (!$model->find($id)) return $this->failNotFound('Mensaje no encontrado');
        $model->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'Mensaje eliminado']);
    }
}
