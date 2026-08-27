<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class JwtAuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization');
        
        if (empty($authHeader)) {
            $response = service('response');
            return $response->setJSON([
                'status'  => 401,
                'error'   => 401,
                'message' => 'Token de autorización no provisto (Bearer token missing).'
            ])->setStatusCode(401);
        }

        $tokenParts = explode(' ', $authHeader);
        $token = end($tokenParts);

        if (!$token) {
            $response = service('response');
            return $response->setJSON([
                'status'  => 401,
                'error'   => 401,
                'message' => 'Formato de autorización inválido.'
            ])->setStatusCode(401);
        }

        try {
            $secretKey = env('JWT_SECRET_KEY', 'cicha_chamber_heleno_argentina_super_secret_jwt_key_2026');
            $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
            
            // Attach user data to request
            $request->user = $decoded->data ?? null;
        } catch (Exception $e) {
            $response = service('response');
            return $response->setJSON([
                'status'  => 401,
                'error'   => 401,
                'message' => 'Token inválido o expirado: ' . $e->getMessage()
            ])->setStatusCode(401);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // No action needed after request
    }
}
