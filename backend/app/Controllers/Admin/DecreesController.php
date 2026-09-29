<?php

namespace App\Controllers\Admin;

use App\Models\DecreeModel;
use CodeIgniter\RESTful\ResourceController;

class DecreesController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new DecreeModel();
        $search = $this->request->getGet('q');

        $builder = $model->orderBy('issue_date', 'DESC')->orderBy('created_at', 'DESC');

        if (!empty($search)) {
            $builder->groupStart()
                ->like('title', $search)
                ->orLike('decree_number', $search)
                ->orLike('description', $search)
                ->groupEnd();
        }

        $decrees = $builder->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => $decrees
        ]);
    }

    public function show($id = null)
    {
        $model = new DecreeModel();
        $decree = $model->find($id);

        if (!$decree) {
            return $this->failNotFound('Decreto no encontrado.');
        }

        return $this->respond([
            'status' => 200,
            'data'   => $decree
        ]);
    }

    public function create()
    {
        $model = new DecreeModel();
        $input = $this->request->getJSON(true) ?? $this->request->getPost();

        if (empty($input['title'])) {
            return $this->fail('El título del decreto es obligatorio.');
        }

        $documentType = (!empty($input['document_type']) && in_array($input['document_type'], ['file', 'url', 'text', 'both'])) 
            ? $input['document_type'] 
            : 'file';

        if ($documentType === 'text' && empty($input['content'])) {
            return $this->fail('Debe ingresar el texto del decreto.');
        }

        if ($documentType === 'file' && empty($input['file_url'])) {
            return $this->fail('Debe adjuntar un archivo PDF o ingresar una URL.');
        }

        $data = [
            'title'             => trim($input['title']),
            'decree_number'     => !empty($input['decree_number']) ? trim($input['decree_number']) : null,
            'description'       => !empty($input['description']) ? trim($input['description']) : null,
            'content'           => !empty($input['content']) ? trim($input['content']) : null,
            'cover_image_url'   => !empty($input['cover_image_url']) ? trim($input['cover_image_url']) : null,
            'author'            => !empty($input['author']) ? trim($input['author']) : null,
            'author_avatar_url' => !empty($input['author_avatar_url']) ? trim($input['author_avatar_url']) : null,
            'logo_url'          => !empty($input['logo_url']) ? trim($input['logo_url']) : null,
            'document_type'     => $documentType,
            'file_url'          => !empty($input['file_url']) ? trim($input['file_url']) : null,
            'file_name'         => !empty($input['file_name']) ? trim($input['file_name']) : ($documentType === 'text' ? 'Decreto Digital' : null),
            'file_size'         => !empty($input['file_size']) ? trim($input['file_size']) : ($documentType === 'text' ? 'Texto Oficial' : null),
            'issue_date'        => !empty($input['issue_date']) ? $input['issue_date'] : null,
            'downloads'         => 0,
            'is_active'         => isset($input['is_active']) ? (int) $input['is_active'] : 1,
        ];

        $insertedId = $model->insert($data);
        if (!$insertedId) {
            return $this->fail($model->errors() ?: 'Error al registrar el decreto.');
        }

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Decreto creado exitosamente.',
            'data'    => $model->find($insertedId)
        ]);
    }

    public function update($id = null)
    {
        $model = new DecreeModel();
        $decree = $model->find($id);

        if (!$decree) {
            return $this->failNotFound('Decreto no encontrado.');
        }

        $input = $this->request->getJSON(true) ?? $this->request->getRawInput();

        $data = [];
        if (isset($input['title']))             $data['title']             = trim($input['title']);
        if (isset($input['decree_number']))     $data['decree_number']     = trim($input['decree_number']) ?: null;
        if (isset($input['description']))       $data['description']       = trim($input['description']) ?: null;
        if (isset($input['content']))           $data['content']           = trim($input['content']) ?: null;
        if (isset($input['cover_image_url']))   $data['cover_image_url']   = trim($input['cover_image_url']) ?: null;
        if (isset($input['author']))            $data['author']            = trim($input['author']) ?: null;
        if (isset($input['author_avatar_url'])) $data['author_avatar_url'] = trim($input['author_avatar_url']) ?: null;
        if (isset($input['logo_url']))          $data['logo_url']          = trim($input['logo_url']) ?: null;
        if (isset($input['document_type']))     $data['document_type']     = $input['document_type'];
        if (isset($input['file_url']))          $data['file_url']          = trim($input['file_url']) ?: null;
        if (isset($input['file_name']))         $data['file_name']         = trim($input['file_name']) ?: null;
        if (isset($input['file_size']))         $data['file_size']         = trim($input['file_size']) ?: null;
        if (isset($input['issue_date']))        $data['issue_date']        = $input['issue_date'] ?: null;
        if (isset($input['is_active']))         $data['is_active']         = (int) $input['is_active'];

        if (empty($data)) {
            return $this->fail('No hay datos para actualizar.');
        }

        $model->update($id, $data);

        return $this->respond([
            'status'  => 200,
            'message' => 'Decreto actualizado exitosamente.',
            'data'    => $model->find($id)
        ]);
    }

    public function delete($id = null)
    {
        $model = new DecreeModel();
        if (!$model->find($id)) {
            return $this->failNotFound('Decreto no encontrado.');
        }

        $model->delete($id);

        return $this->respond([
            'status'  => 200,
            'message' => 'Decreto eliminado exitosamente.'
        ]);
    }
}
