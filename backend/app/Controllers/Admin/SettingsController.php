<?php

namespace App\Controllers\Admin;

use App\Models\SettingModel;
use CodeIgniter\RESTful\ResourceController;

class SettingsController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new SettingModel();
        $rawSettings = $model->findAll();
        $settings = [];
        foreach ($rawSettings as $s) {
            $settings[$s['key_name']] = $s['value_text'];
        }
        return $this->respond(['status' => 200, 'data' => $settings]);
    }

    public function updateAll()
    {
        $model = new SettingModel();
        $input = $this->request->getJSON(true) ?: $this->request->getRawInput() ?: $this->request->getVar();
        $settings = $input['settings'] ?? $input;

        if (!is_array($settings)) {
            return $this->failValidationErrors('Formato de configuraciones inválido.');
        }

        foreach ($settings as $key => $val) {
            // Ignorar claves internas no relacionadas con settings si vinieran
            if (is_array($val)) continue;

            $valStr = (string) ($val ?? '');
            $existing = $model->where('key_name', $key)->first();
            if ($existing) {
                $model->update($existing['id'], [
                    'value_text' => $valStr,
                    'updated_at' => date('Y-m-d H:i:s')
                ]);
            } else {
                $model->insert([
                    'key_name'   => (string) $key,
                    'value_text' => $valStr,
                    'group_name' => 'general',
                    'updated_at' => date('Y-m-d H:i:s')
                ]);
            }
        }

        return $this->respond([
            'status'  => 200,
            'message' => 'Configuración guardada exitosamente'
        ]);
    }
}
