<?php

namespace App\Controllers\Admin;

use CodeIgniter\RESTful\ResourceController;

class MigrationController extends ResourceController
{
    protected $format = 'json';

    public function run()
    {
        // Clave de seguridad autorizada
        $allowedSecret = env('MIGRATION_SECRET_KEY') ?: getenv('MIGRATION_SECRET_KEY') ?: 'cicha_migration_secret_key_2026';
        $allowedSecret = trim($allowedSecret, "'\"");

        $providedSecret = $this->request->getGet('secret') ?: $this->request->getPost('secret');

        if (empty($providedSecret) || $providedSecret !== $allowedSecret) {
            return $this->respond([
                'status'  => 401,
                'error'   => 'Unauthorized',
                'message' => 'Acceso denegado. Se requiere un parámetro ?secret válido para ejecutar migraciones.',
            ], 401);
        }

        $migrate = \Config\Services::migrations();

        try {
            // Ejecutar todas las migraciones pendientes hasta la última versión
            $success = $migrate->latest();

            // Obtener historial de migraciones de forma segura
            $applied = method_exists($migrate, 'getHistory') ? $migrate->getHistory() : [];

            return $this->respond([
                'status'     => 200,
                'success'    => true,
                'message'    => '✅ Base de datos actualizada con éxito.',
                'details'    => [
                    'migrated'         => $success,
                    'applied_history'  => array_map(function($m) {
                        return is_object($m) ? [
                            'version' => $m->version ?? '',
                            'name'    => $m->name ?? '',
                            'group'   => $m->group ?? '',
                            'time'    => isset($m->time) ? date('Y-m-d H:i:s', $m->time) : ''
                        ] : (array)$m;
                    }, $applied),
                    'timestamp'        => date('Y-m-d H:i:s'),
                ],
            ], 200);

        } catch (\Throwable $e) {
            return $this->respond([
                'status'  => 500,
                'error'   => 'Migration Failed',
                'message' => 'Error al ejecutar las migraciones: ' . $e->getMessage(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
            ], 500);
        }
    }
}
