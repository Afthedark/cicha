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
    public static $currentUser = null;

    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization') ?: $request->getHeaderLine('X-Authorization');

        // Fallback for Apache/cPanel stripping Authorization header
        if (empty($authHeader)) {
            if (function_exists('getallheaders')) {
                $headers = getallheaders();
                if (!empty($headers['Authorization'])) {
                    $authHeader = $headers['Authorization'];
                } elseif (!empty($headers['authorization'])) {
                    $authHeader = $headers['authorization'];
                } elseif (!empty($headers['X-Authorization'])) {
                    $authHeader = $headers['X-Authorization'];
                } elseif (!empty($headers['x-authorization'])) {
                    $authHeader = $headers['x-authorization'];
                }
            }
        }

        if (empty($authHeader) && isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (empty($authHeader) && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        } elseif (empty($authHeader) && isset($_SERVER['HTTP_X_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_X_AUTHORIZATION'];
        }
        
        if (empty($authHeader)) {
            $response = service('response');
            return $response->setJSON([
                'status'  => 401,
                'error'   => 401,
                'message' => 'Token de autorización no provisto (Bearer token missing).'
            ])->setStatusCode(401);
        }

        // Also check getenv() and $_ENV in case env() is cached
        $secretKey = env('JWT_SECRET_KEY') ?: getenv('JWT_SECRET_KEY') ?: 'cicha_chamber_heleno_argentina_super_secret_jwt_key_2026';
        $secretKey = trim($secretKey, "'\"");

        // Strip "Bearer " and whitespace
        $token = preg_replace('/^Bearer\s+/i', '', trim($authHeader));

        // If still empty, check query param or post
        if (empty($token) && $request->getGet('token')) {
            $token = trim($request->getGet('token'));
        }

        if (empty($token)) {
            $response = service('response');
            return $response->setJSON([
                'status'  => 401,
                'error'   => 401,
                'message' => 'Formato de autorización inválido o token no provisto.'
            ])->setStatusCode(401);
        }

        try {
            $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
            
            // Attach user data to request and static variable
            $userData = $decoded->data ?? null;
            $request->user = $userData;
            self::$currentUser = $userData;
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
