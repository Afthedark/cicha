<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class RoleFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $userData = $request->user ?? null;

        if (!$userData) {
            $response = service('response');
            return $response->setJSON([
                'status'  => 401,
                'error'   => 401,
                'message' => 'No autenticado.'
            ])->setStatusCode(401);
        }

        if (empty($arguments)) {
            return;
        }

        // Arguments can be passed like ['admin'], ['admin', 'secretario'], or ['admin', 'secretario', 'socio']
        $userRole = $userData->role ?? '';

        if (!in_array($userRole, $arguments)) {
            $response = service('response');
            return $response->setJSON([
                'status'  => 403,
                'error'   => 403,
                'message' => 'Acceso denegado: Su rol (' . $userRole . ') no posee los permisos necesarios para esta sección.'
            ])->setStatusCode(403);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
    }
}
