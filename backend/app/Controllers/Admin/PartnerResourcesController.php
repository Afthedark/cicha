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
        $trash = $this->request->getGet('trash');
        $search = $this->request->getGet('q');
        $category = $this->request->getGet('category');

        $builder = $model;
        if ($trash === 'true' || $trash === '1') {
            $builder = $builder->onlyDeleted();
        }

        if (!empty($category) && $category !== 'all') {
            $builder = $builder->groupStart()
                ->where('category', $category)
                ->orLike('categories', '"' . $category . '"')
                ->groupEnd();
        }

        if (!empty($search)) {
            $builder = $builder->groupStart()
                ->like('title', $search)
                ->orLike('description', $search)
                ->orLike('category', $search)
                ->groupEnd();
        }

        $items = $builder->orderBy('created_at', 'DESC')->findAll();

        foreach ($items as &$item) {
            if (!empty($item['categories']) && is_string($item['categories'])) {
                $decoded = json_decode($item['categories'], true);
                $item['categories'] = is_array($decoded) ? $decoded : [$item['category']];
            } elseif (empty($item['categories']) && !empty($item['category'])) {
                $item['categories'] = [$item['category']];
            } else {
                $item['categories'] = [];
            }
        }

        return $this->respond(['status' => 200, 'data' => $items]);
    }

    public function show($id = null)
    {
        $model = new PartnerResourceModel();
        $item = $model->withDeleted()->find($id);
        if (!$item) return $this->failNotFound('Recurso no encontrado');

        if (!empty($item['categories']) && is_string($item['categories'])) {
            $decoded = json_decode($item['categories'], true);
            $item['categories'] = is_array($decoded) ? $decoded : [$item['category']];
        } elseif (empty($item['categories']) && !empty($item['category'])) {
            $item['categories'] = [$item['category']];
        } else {
            $item['categories'] = [];
        }

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

        $categoriesArr = [];
        if (!empty($input['categories'])) {
            $categoriesArr = is_array($input['categories']) 
                ? array_values(array_filter(array_map('trim', $input['categories'])))
                : array_values(array_filter(array_map('trim', explode(',', $input['categories']))));
        }

        $primaryCategory = !empty($categoriesArr) ? $categoriesArr[0] : ($input['category'] ?? 'Informes de Mercado');
        if (empty($categoriesArr) && !empty($primaryCategory)) {
            $categoriesArr = [$primaryCategory];
        }

        $data = [
            'title'       => trim($input['title']),
            'category'    => $primaryCategory,
            'categories'  => json_encode($categoriesArr, JSON_UNESCAPED_UNICODE),
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
        if (!$model->withDeleted()->find($id)) return $this->failNotFound('Recurso no encontrado');

        $input = $this->request->getJSON(true) ?: ($this->request->getRawInput() ?: $this->request->getVar());

        $data = [];
        if (isset($input['title'])) $data['title'] = trim($input['title']);
        
        if (isset($input['categories'])) {
            $categoriesArr = is_array($input['categories'])
                ? array_values(array_filter(array_map('trim', $input['categories'])))
                : array_values(array_filter(array_map('trim', explode(',', $input['categories']))));
            $data['categories'] = json_encode($categoriesArr, JSON_UNESCAPED_UNICODE);
            if (!empty($categoriesArr)) {
                $data['category'] = $categoriesArr[0];
            }
        } elseif (isset($input['category'])) {
            $data['category'] = trim($input['category']);
            $data['categories'] = json_encode([trim($input['category'])], JSON_UNESCAPED_UNICODE);
        }

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
        return $this->respondDeleted(['status' => 200, 'message' => 'Recurso eliminado (Soft Delete)']);
    }

    public function restore($id = null)
    {
        $model = new PartnerResourceModel();
        $item = $model->onlyDeleted()->find($id);
        if (!$item) return $this->failNotFound('Recurso en papelera no encontrado');
        
        $model->update($id, ['deleted_at' => null]);
        return $this->respond(['status' => 200, 'message' => 'Recurso restaurado con éxito']);
    }

    public function forceDelete($id = null)
    {
        $model = new PartnerResourceModel();
        $item = $model->withDeleted()->find($id);
        if (!$item) return $this->failNotFound('Recurso no encontrado');

        $model->delete($id, true);
        return $this->respondDeleted(['status' => 200, 'message' => 'Recurso eliminado permanentemente']);
    }
}
