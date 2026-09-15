<?php

namespace App\Controllers\Admin;

use App\Models\GreekTranslationModel;
use CodeIgniter\RESTful\ResourceController;

class GreekTranslationsController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new GreekTranslationModel();
        $translations = $model->orderBy('order_num', 'ASC')->findAll();
        return $this->respond(['status' => 200, 'data' => $translations]);
    }

    public function show($id = null)
    {
        $model = new GreekTranslationModel();
        $item = $model->find($id);
        if (!$item) {
            return $this->failNotFound('Traducción no encontrada');
        }
        return $this->respond(['status' => 200, 'data' => $item]);
    }

    public function update($id = null)
    {
        $model = new GreekTranslationModel();
        $existing = $model->find($id);
        if (!$existing) {
            return $this->failNotFound('Traducción no encontrada');
        }

        $input = $this->request->getJSON(true) ?: ($this->request->getRawInput() ?: $this->request->getVar());
        if (empty($input)) {
            $input = [];
        }

        $data = [];
        if (isset($input['text_el'])) {
            $data['text_el'] = $input['text_el'];
        }
        if (isset($input['text_en'])) {
            $data['text_en'] = $input['text_en'];
        }
        if (isset($input['original_es'])) {
            $data['original_es'] = $input['original_es'];
        }
        if (isset($input['description'])) {
            $data['description'] = $input['description'];
        }
        if (isset($input['order_num'])) {
            $data['order_num'] = (int) $input['order_num'];
        }

        if (!empty($data)) {
            $model->update($id, $data);
        }

        $updated = $model->find($id);
        return $this->respond([
            'status' => 200,
            'message' => 'Traducción actualizada con éxito',
            'data' => $updated,
        ]);
    }

    public function updateBatch()
    {
        $model = new GreekTranslationModel();
        $input = $this->request->getJSON(true) ?: ($this->request->getRawInput() ?: $this->request->getVar());
        
        $items = isset($input['translations']) && is_array($input['translations']) 
            ? $input['translations'] 
            : (is_array($input) ? $input : []);

        if (empty($items)) {
            return $this->failValidationErrors('No se enviaron traducciones para actualizar');
        }

        foreach ($items as $item) {
            if (isset($item['id'])) {
                $updateData = [];
                if (isset($item['text_el'])) {
                    $updateData['text_el'] = $item['text_el'];
                }
                if (isset($item['text_en'])) {
                    $updateData['text_en'] = $item['text_en'];
                }
                if (isset($item['original_es'])) {
                    $updateData['original_es'] = $item['original_es'];
                }
                if (!empty($updateData)) {
                    $model->update($item['id'], $updateData);
                }
            }
        }

        $all = $model->orderBy('order_num', 'ASC')->findAll();
        return $this->respond([
            'status' => 200,
            'message' => 'Traducciones actualizadas con éxito',
            'data' => $all,
        ]);
    }
}
