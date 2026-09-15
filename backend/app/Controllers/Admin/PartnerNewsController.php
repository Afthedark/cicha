<?php

namespace App\Controllers\Admin;

use App\Models\PartnerNewsModel;
use CodeIgniter\RESTful\ResourceController;

class PartnerNewsController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new PartnerNewsModel();
        $status = $this->request->getGet('status');
        $category = $this->request->getGet('category');
        $q = $this->request->getGet('q');

        $builder = $model;
        if (!empty($status)) {
            $builder = $builder->where('status', $status);
        }
        if (!empty($category)) {
            $builder = $builder->where('category', $category);
        }
        if (!empty($q)) {
            $builder = $builder->groupStart()
                ->like('title', $q)
                ->orLike('summary', $q)
                ->orLike('content', $q)
                ->orLike('author', $q)
                ->groupEnd();
        }

        $news = $builder->orderBy('published_at', 'DESC')
                        ->orderBy('created_at', 'DESC')
                        ->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => $news,
        ]);
    }

    public function show($id = null)
    {
        $model = new PartnerNewsModel();
        $item = is_numeric($id) ? $model->find($id) : $model->where('slug', $id)->first();

        if (!$item) {
            return $this->failNotFound('Noticia del boletín no encontrada');
        }

        return $this->respond([
            'status' => 200,
            'data'   => $item,
        ]);
    }

    public function create()
    {
        $model = new PartnerNewsModel();
        $input = $this->request->getJSON(true) ?: ($this->request->getRawInput() ?: $this->request->getVar());
        if (empty($input)) $input = [];

        $title = trim($input['title'] ?? '');
        if (empty($title)) {
            return $this->failValidationError('El título de la noticia es obligatorio.');
        }

        $slug = !empty($input['slug']) ? $model->generateSlug($input['slug']) : $model->generateSlug($title);

        $data = [
            'category'     => !empty($input['category']) ? trim($input['category']) : 'Comunicado Oficial',
            'title'        => $title,
            'slug'         => $slug,
            'summary'      => $input['summary'] ?? null,
            'content'      => $input['content'] ?? '',
            'image_url'    => $input['image_url'] ?? null,
            'author'       => !empty($input['author']) ? trim($input['author']) : 'Comisión Directiva CICHA',
            'published_at' => !empty($input['published_at']) ? $input['published_at'] : date('Y-m-d'),
            'is_featured'  => !empty($input['is_featured']) ? 1 : 0,
            'status'       => !empty($input['status']) ? $input['status'] : 'published',
        ];

        $id = $model->insert($data);
        if (!$id) {
            return $this->failServerError('Error al crear la noticia del boletín.');
        }

        $created = $model->find($id);
        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Noticia de boletín creada con éxito',
            'data'    => $created,
        ]);
    }

    public function update($id = null)
    {
        $model = new PartnerNewsModel();
        $existing = $model->find($id);
        if (!$existing) {
            return $this->failNotFound('Noticia del boletín no encontrada.');
        }

        $input = $this->request->getJSON(true) ?: ($this->request->getRawInput() ?: $this->request->getVar());
        if (empty($input)) $input = [];

        $data = [];
        if (isset($input['title'])) {
            $data['title'] = trim($input['title']);
            if (empty($input['slug']) || $input['slug'] === $existing['slug']) {
                $data['slug'] = $model->generateSlug($data['title'], $id);
            }
        }
        if (isset($input['slug']) && !empty($input['slug']) && $input['slug'] !== $existing['slug']) {
            $data['slug'] = $model->generateSlug($input['slug'], $id);
        }
        if (isset($input['category'])) $data['category'] = trim($input['category']);
        if (isset($input['summary'])) $data['summary'] = $input['summary'];
        if (isset($input['content'])) $data['content'] = $input['content'];
        if (isset($input['image_url'])) $data['image_url'] = $input['image_url'];
        if (isset($input['author'])) $data['author'] = trim($input['author']);
        if (isset($input['published_at'])) $data['published_at'] = $input['published_at'];
        if (isset($input['is_featured'])) $data['is_featured'] = $input['is_featured'] ? 1 : 0;
        if (isset($input['status'])) $data['status'] = $input['status'];

        if (!empty($data)) {
            $model->update($id, $data);
        }

        $updated = $model->find($id);
        return $this->respond([
            'status'  => 200,
            'message' => 'Noticia de boletín actualizada con éxito',
            'data'    => $updated,
        ]);
    }

    public function delete($id = null)
    {
        $model = new PartnerNewsModel();
        $existing = $model->find($id);
        if (!$existing) {
            return $this->failNotFound('Noticia no encontrada');
        }

        $model->delete($id);
        return $this->respondDeleted([
            'status'  => 200,
            'message' => 'Noticia eliminada con éxito',
        ]);
    }
}
