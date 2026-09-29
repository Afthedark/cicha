<?php

namespace App\Controllers\Admin;

use App\Models\InterestLinkModel;
use CodeIgniter\RESTful\ResourceController;

class InterestLinksController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new InterestLinkModel();
        $search = $this->request->getGet('q');
        $categoryId = $this->request->getGet('category_id');
        $status = $this->request->getGet('status');

        $builder = $model->select('interest_links.*, categories.name as category_name, categories.slug as category_slug')
            ->join('categories', 'categories.id = interest_links.category_id', 'left')
            ->orderBy('interest_links.order_num', 'ASC')
            ->orderBy('interest_links.created_at', 'DESC');

        if (!empty($search)) {
            $builder->groupStart()
                ->like('interest_links.title', $search)
                ->orLike('interest_links.description', $search)
                ->orLike('interest_links.url', $search)
                ->orLike('categories.name', $search)
                ->groupEnd();
        }

        if (!empty($categoryId) && $categoryId !== 'all') {
            $builder->where('interest_links.category_id', (int) $categoryId);
        }

        if ($status !== null && $status !== '' && $status !== 'all') {
            $builder->where('interest_links.is_active', $status === 'active' || $status === '1' ? 1 : 0);
        }

        $links = $builder->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => $links
        ]);
    }

    public function show($id = null)
    {
        $model = new InterestLinkModel();
        $link = $model->select('interest_links.*, categories.name as category_name, categories.slug as category_slug')
            ->join('categories', 'categories.id = interest_links.category_id', 'left')
            ->find($id);

        if (!$link) {
            return $this->failNotFound('Enlace de interés no encontrado.');
        }

        return $this->respond([
            'status' => 200,
            'data'   => $link
        ]);
    }

    public function create()
    {
        $model = new InterestLinkModel();
        $input = $this->request->getJSON(true) ?? $this->request->getPost();

        if (empty($input['title'])) {
            return $this->fail('El título del enlace es obligatorio.');
        }

        if (empty($input['url'])) {
            return $this->fail('La URL de destino es obligatoria.');
        }

        $data = [
            'category_id' => !empty($input['category_id']) ? (int) $input['category_id'] : null,
            'title'       => trim($input['title']),
            'description' => !empty($input['description']) ? trim($input['description']) : null,
            'url'         => trim($input['url']),
            'logo_url'    => !empty($input['logo_url']) ? trim($input['logo_url']) : null,
            'order_num'   => isset($input['order_num']) ? (int) $input['order_num'] : 0,
            'is_featured' => isset($input['is_featured']) ? (int) $input['is_featured'] : 0,
            'is_active'   => isset($input['is_active']) ? (int) $input['is_active'] : 1,
        ];

        $insertedId = $model->insert($data);
        if (!$insertedId) {
            return $this->fail($model->errors() ?: 'Error al registrar el enlace de interés.');
        }

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Enlace de interés creado exitosamente.',
            'data'    => $model->select('interest_links.*, categories.name as category_name')
                ->join('categories', 'categories.id = interest_links.category_id', 'left')
                ->find($insertedId)
        ]);
    }

    public function update($id = null)
    {
        $model = new InterestLinkModel();
        $link = $model->find($id);

        if (!$link) {
            return $this->failNotFound('Enlace de interés no encontrado.');
        }

        $input = $this->request->getJSON(true) ?? $this->request->getRawInput();

        $data = [];
        if (array_key_exists('category_id', $input)) {
            $data['category_id'] = !empty($input['category_id']) ? (int) $input['category_id'] : null;
        }
        if (isset($input['title']))       $data['title']       = trim($input['title']);
        if (isset($input['description'])) $data['description'] = trim($input['description']) ?: null;
        if (isset($input['url']))         $data['url']         = trim($input['url']);
        if (isset($input['logo_url']))    $data['logo_url']    = trim($input['logo_url']) ?: null;
        if (isset($input['order_num']))   $data['order_num']   = (int) $input['order_num'];
        if (isset($input['is_featured'])) $data['is_featured'] = (int) $input['is_featured'];
        if (isset($input['is_active']))   $data['is_active']   = (int) $input['is_active'];

        if (empty($data)) {
            return $this->fail('No hay datos para actualizar.');
        }

        $model->update($id, $data);

        return $this->respond([
            'status'  => 200,
            'message' => 'Enlace de interés actualizado exitosamente.',
            'data'    => $model->select('interest_links.*, categories.name as category_name')
                ->join('categories', 'categories.id = interest_links.category_id', 'left')
                ->find($id)
        ]);
    }

    public function delete($id = null)
    {
        $model = new InterestLinkModel();
        $link = $model->find($id);

        if (!$link) {
            return $this->failNotFound('Enlace de interés no encontrado.');
        }

        // Soft delete execution
        $model->delete($id);

        return $this->respond([
            'status'  => 200,
            'message' => 'Enlace de interés eliminado exitosamente (Soft Delete).'
        ]);
    }

    public function restore($id = null)
    {
        $model = new InterestLinkModel();
        // Look up including deleted records
        $link = $model->onlyDeleted()->find($id);

        if (!$link) {
            return $this->failNotFound('Enlace eliminado no encontrado.');
        }

        $model->update($id, ['deleted_at' => null]);

        return $this->respond([
            'status'  => 200,
            'message' => 'Enlace de interés restaurado exitosamente.'
        ]);
    }
}
