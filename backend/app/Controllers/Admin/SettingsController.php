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
        $settings = $this->request->getVar('settings');

        if (!is_array($settings)) {
            return $this->failValidationErrors('Formato de configuraciones inválido.');
        }

        foreach ($settings as $key => $val) {
            $existing = $model->where('key_name', $key)->first();
            if ($existing) {
                $model->update($existing['id'], ['value_text' => (string) $val, 'updated_at' => date('Y-m-d H:i:s')]);
            } else {
                $model->insert(['key_name' => $key, 'value_text' => (string) $val, 'group_name' => 'general', 'updated_at' => date('Y-m-d H:i:s')]);
            }
        }

        return $this->respond(['status' => 200, 'message' => 'Configuración guardada exitosamente']);
    }
}
