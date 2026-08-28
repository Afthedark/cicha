<?php

namespace App\Controllers\Admin;

use App\Models\ArticleModel;
use App\Models\CategoryModel;
use CodeIgniter\RESTful\ResourceController;

class ArticlesController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $articleModel = new ArticleModel();
        $articles = $articleModel->getWithCategory();
        return $this->respond(['status' => 200, 'data' => $articles]);
    }

    public function show($id = null)
    {
        $articleModel = new ArticleModel();
        $article = $articleModel->getWithCategory($id);
        if (!$article) {
            return $this->failNotFound('Artículo no encontrado');
        }
        return $this->respond(['status' => 200, 'data' => $article]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true) ?: $this->request->getRawInput() ?: $this->request->getVar();

        $rules = [
            'title'   => 'required|min_length[3]',
            'content' => 'required',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $title = $input['title'] ?? 'noticia';
        $slug = url_title($title, '-', true) . '-' . time();

        $data = [
            'title'        => $title,
            'slug'         => $slug,
            'category_id'  => $input['category_id'] ?? null,
            'summary'      => $input['summary'] ?? '',
            'content'      => $input['content'] ?? '',
            'image_url'    => $input['image_url'] ?? '',
            'author'       => $input['author'] ?? 'Comisión de Prensa CICHA',
            'published_at' => $input['published_at'] ?? date('Y-m-d H:i:s'),
            'is_featured'  => !empty($input['is_featured']) ? 1 : 0,
            'status'       => $input['status'] ?? 'draft',
            'views_count'  => 0,
        ];

        $articleModel = new ArticleModel();
        $id = $articleModel->insert($data);

        return $this->respondCreated(['status' => 201, 'message' => 'Artículo creado con éxito', 'id' => $id]);
    }

    public function update($id = null)
    {
        $articleModel = new ArticleModel();
        $article = $articleModel->find($id);
        if (!$article) {
            return $this->failNotFound('Artículo no encontrado');
        }

        $input = $this->request->getJSON(true) ?: $this->request->getRawInput() ?: $this->request->getVar();

        $data = [];
        if (isset($input['title'])) {
            $data['title'] = $input['title'];
            $data['slug'] = url_title($input['title'], '-', true) . '-' . $id;
        }
        if (isset($input['category_id'])) $data['category_id'] = $input['category_id'] ?: null;
        if (isset($input['summary'])) $data['summary'] = $input['summary'];
        if (isset($input['content'])) $data['content'] = $input['content'];
        if (isset($input['image_url'])) $data['image_url'] = $input['image_url'];
        if (isset($input['author'])) $data['author'] = $input['author'];
        if (isset($input['published_at'])) $data['published_at'] = $input['published_at'];
        if (isset($input['is_featured'])) $data['is_featured'] = !empty($input['is_featured']) ? 1 : 0;
        if (isset($input['status'])) $data['status'] = $input['status'];

        if (!empty($data)) {
            $articleModel->update($id, $data);
        }

        return $this->respond(['status' => 200, 'message' => 'Artículo actualizado con éxito']);
    }

    public function delete($id = null)
    {
        $articleModel = new ArticleModel();
        if (!$articleModel->find($id)) {
            return $this->failNotFound('Artículo no encontrado');
        }
        $articleModel->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'Artículo eliminado']);
    }
}
