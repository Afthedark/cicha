<?php

namespace App\Controllers\Admin;

use App\Models\BlogModel;
use CodeIgniter\RESTful\ResourceController;

class BlogsController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $blogModel = new BlogModel();
        $blogs = $blogModel->orderBy('published_at', 'DESC')->findAll();
        return $this->respond(['status' => 200, 'data' => $blogs]);
    }

    public function show($id = null)
    {
        $blogModel = new BlogModel();
        $blog = $blogModel->find($id);
        if (!$blog) {
            return $this->failNotFound('Blog no encontrado');
        }
        return $this->respond(['status' => 200, 'data' => $blog]);
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

        $title = $input['title'] ?? 'blog-post';
        $slug = url_title($title, '-', true) . '-' . time();

        $data = [
            'title'        => $title,
            'slug'         => $slug,
            'author'       => $input['author'] ?? 'Comisión Editorial CICHA',
            'author_role'  => $input['author_role'] ?? '',
            'summary'      => $input['summary'] ?? '',
            'content'      => $input['content'] ?? '',
            'image_url'    => $input['image_url'] ?? '',
            'category'     => $input['category'] ?? 'General',
            'tags'         => $input['tags'] ?? '',
            'read_time'    => $input['read_time'] ?? '5 min de lectura',
            'is_featured'  => !empty($input['is_featured']) ? 1 : 0,
            'status'       => $input['status'] ?? 'published',
            'published_at' => $input['published_at'] ?? date('Y-m-d H:i:s'),
        ];

        $blogModel = new BlogModel();
        $id = $blogModel->insert($data);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Blog publicado con éxito',
            'data'    => array_merge(['id' => $id], $data),
        ]);
    }

    public function update($id = null)
    {
        $blogModel = new BlogModel();
        $existing = $blogModel->find($id);
        if (!$existing) {
            return $this->failNotFound('Blog no encontrado');
        }

        $input = $this->request->getJSON(true) ?: $this->request->getRawInput() ?: $this->request->getVar();

        $data = [
            'title'        => $input['title'] ?? $existing['title'],
            'author'       => $input['author'] ?? $existing['author'],
            'author_role'  => $input['author_role'] ?? $existing['author_role'],
            'summary'      => $input['summary'] ?? $existing['summary'],
            'content'      => $input['content'] ?? $existing['content'],
            'image_url'    => $input['image_url'] ?? $existing['image_url'],
            'category'     => $input['category'] ?? $existing['category'],
            'tags'         => $input['tags'] ?? $existing['tags'],
            'read_time'    => $input['read_time'] ?? $existing['read_time'],
            'is_featured'  => isset($input['is_featured']) ? (int)$input['is_featured'] : $existing['is_featured'],
            'status'       => $input['status'] ?? $existing['status'],
            'published_at' => $input['published_at'] ?? $existing['published_at'],
        ];

        if (!empty($input['title']) && $input['title'] !== $existing['title']) {
            $data['slug'] = url_title($input['title'], '-', true) . '-' . $existing['id'];
        }

        $blogModel->update($id, $data);

        return $this->respond([
            'status'  => 200,
            'message' => 'Blog actualizado correctamente',
            'data'    => array_merge(['id' => $id], $data),
        ]);
    }

    public function delete($id = null)
    {
        $blogModel = new BlogModel();
        if (!$blogModel->find($id)) {
            return $this->failNotFound('Blog no encontrado');
        }

        $blogModel->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'Blog eliminado']);
    }
}
