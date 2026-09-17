<?php

namespace App\Controllers\Admin;

use App\Models\InstitutionalSectionModel;
use CodeIgniter\RESTful\ResourceController;

class InstitutionalController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new InstitutionalSectionModel();
        $pageTarget = $this->request->getGet('page_target');
        if (!empty($pageTarget)) {
            $model->where('page_target', $pageTarget);
        }
        $sections = $model->orderBy('order_num', 'ASC')->orderBy('id', 'ASC')->findAll();
        return $this->respond(['status' => 200, 'data' => $sections]);
    }

    public function show($id = null)
    {
        $model = new InstitutionalSectionModel();
        $section = $model->find($id);
        if (!$section) return $this->failNotFound('Sección institucional no encontrada');
        return $this->respond(['status' => 200, 'data' => $section]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true) ?: ($this->request->getRawInput() ?: $this->request->getVar());
        if (empty($input)) $input = [];

        $model = new InstitutionalSectionModel();

        $sectionKey = trim($input['section_key'] ?? '');
        if (empty($sectionKey)) {
            return $this->failValidationError('La clave de la sección (section_key) es obligatoria.');
        }

        // Format slug-like section_key
        $sectionKey = strtolower(preg_replace('/[^a-zA-Z0-9_]+/', '_', $sectionKey));

        $existing = $model->where('section_key', $sectionKey)->first();
        if ($existing) {
            return $this->failValidationError('Ya existe una sección con esa clave única.');
        }

        $title = trim($input['title'] ?? '');
        if (empty($title)) {
            return $this->failValidationError('El título de la sección es obligatorio.');
        }

        $data = [
            'section_key' => $sectionKey,
            'page_target' => $input['page_target'] ?? 'home',
            'title'       => $title,
            'subtitle'    => $input['subtitle'] ?? null,
            'content'     => $input['content'] ?? '',
            'image_url'   => $input['image_url'] ?? null,
            'icon_name'   => $input['icon_name'] ?? null,
            'order_num'   => isset($input['order_num']) ? (int) $input['order_num'] : 1,
            'is_active'   => isset($input['is_active']) ? ($input['is_active'] ? 1 : 0) : 1,
        ];

        $id = $model->insert($data);
        if (!$id) {
            return $this->failServerError('Error al crear la sección institucional.');
        }

        return $this->respondCreated(['status' => 201, 'message' => 'Sección creada con éxito', 'id' => $id]);
    }

    public function update($id = null)
    {
        $model = new InstitutionalSectionModel();
        if (!$model->find($id)) return $this->failNotFound('Sección no encontrada');

        $input = $this->request->getJSON(true) ?: ($this->request->getRawInput() ?: $this->request->getVar());
        if (empty($input)) $input = [];

        $data = [];
        if (isset($input['section_key'])) {
            $key = strtolower(preg_replace('/[^a-zA-Z0-9_]+/', '_', trim($input['section_key'])));
            if (!empty($key)) {
                $existing = $model->where('section_key', $key)->where('id !=', $id)->first();
                if ($existing) {
                    return $this->failValidationError('Ya existe otra sección con esa clave única.');
                }
                $data['section_key'] = $key;
            }
        }
        if (isset($input['page_target'])) $data['page_target'] = $input['page_target'];
        if (isset($input['title'])) $data['title'] = $input['title'];
        if (isset($input['subtitle'])) $data['subtitle'] = $input['subtitle'];
        if (isset($input['content'])) $data['content'] = $input['content'];
        if (isset($input['image_url'])) $data['image_url'] = $input['image_url'];
        if (isset($input['icon_name'])) $data['icon_name'] = $input['icon_name'];
        if (isset($input['order_num'])) $data['order_num'] = (int) $input['order_num'];
        if (isset($input['is_active'])) $data['is_active'] = $input['is_active'] ? 1 : 0;

        if (!empty($data)) {
            $model->update($id, $data);
        }
        return $this->respond(['status' => 200, 'message' => 'Sección actualizada con éxito']);
    }

    public function delete($id = null)
    {
        $model = new InstitutionalSectionModel();
        $section = $model->find($id);
        if (!$section) return $this->failNotFound('Sección institucional no encontrada');

        $model->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'Sección eliminada con éxito']);
    }
}
