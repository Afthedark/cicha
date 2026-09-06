<?php

namespace App\Controllers\Admin;

use App\Models\CategoryModel;
use App\Models\MemberModel;
use CodeIgniter\RESTful\ResourceController;

class CategoriesController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new CategoryModel();
        $type = $this->request->getGet('type');

        $builder = $model->orderBy('name', 'ASC');
        if ($type) {
            $builder->where('type', $type);
        }

        $categories = $builder->findAll();
        return $this->respond(['status' => 200, 'data' => $categories]);
    }

    public function show($id = null)
    {
        $model = new CategoryModel();
        $cat = $model->find($id);
        if (!$cat) return $this->failNotFound('Categoría no encontrada');
        return $this->respond(['status' => 200, 'data' => $cat]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true) ?: $this->request->getRawInput() ?: $this->request->getVar();

        $rules = [
            'name' => 'required|min_length[2]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $slug = url_title($input['name'], '-', true);
        $type = $input['type'] ?? 'members';

        $data = [
            'name' => $input['name'],
            'slug' => $slug,
            'type' => $type,
        ];

        $model = new CategoryModel();
        $id = $model->insert($data);

        return $this->respondCreated(['status' => 201, 'message' => 'Categoría / Rubro creado con éxito', 'id' => $id]);
    }

    public function update($id = null)
    {
        $model = new CategoryModel();
        $existing = $model->find($id);
        if (!$existing) return $this->failNotFound('Categoría no encontrada');

        $input = $this->request->getJSON(true) ?: $this->request->getRawInput() ?: $this->request->getVar();

        $data = [];
        if (isset($input['name'])) {
            $data['name'] = $input['name'];
            $data['slug'] = url_title($input['name'], '-', true);

            // Si es de tipo members, actualizar también en cascada el sector en los socios asociados
            if ($existing['type'] === 'members') {
                $memberModel = new MemberModel();
                $memberModel->where('sector', $existing['name'])->set(['sector' => $input['name']])->update();
            }
        }
        if (isset($input['type'])) $data['type'] = $input['type'];

        if (!empty($data)) {
            $model->update($id, $data);
        }

        return $this->respond(['status' => 200, 'message' => 'Categoría / Rubro actualizado con éxito']);
    }

    public function delete($id = null)
    {
        $model = new CategoryModel();
        $existing = $model->find($id);
        if (!$existing) return $this->failNotFound('Categoría no encontrada');

        $model->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'Categoría eliminada']);
    }
}
