<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;
use Exception;

class AuthController extends ResourceController
{
    protected $format = 'json';

    public function login()
    {
        $input = $this->request->getJSON(true);
        if (!$input) {
            $input = $this->request->getPost() ?: $this->request->getVar();
        }

        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            return $this->failValidationErrors([
                'email'    => 'El correo electrónico es requerido.',
                'password' => 'La contraseña es requerida.'
            ]);
        }

        $userModel = new UserModel();
        $user = $userModel->where('email', $email)->first();

        if (!$user) {
            return $this->failUnauthorized('Credenciales inválidas (Usuario no encontrado).');
        }

        if ($user['status'] !== 'active') {
            return $this->failUnauthorized('Esta cuenta se encuentra inactiva. Contacte al administrador.');
        }

        if (!password_verify($password, $user['password'])) {
            return $this->failUnauthorized('Credenciales inválidas (Contraseña incorrecta).');
        }

        $secretKey = env('JWT_SECRET_KEY', 'cicha_chamber_heleno_argentina_super_secret_jwt_key_2026');
        $iat = time();
        $exp = $iat + (int) env('JWT_TIME_TO_LIVE', 86400);

        $payload = [
            'iss'  => 'cicha-api',
            'aud'  => 'cicha-app',
            'iat'  => $iat,
            'exp'  => $exp,
            'data' => [
                'id'        => $user['id'],
                'name'      => $user['name'],
                'email'     => $user['email'],
                'role'      => $user['role'],
                'member_id' => $user['member_id'] ?? null,
                'avatar'    => $user['avatar'],
            ]
        ];

        $token = JWT::encode($payload, $secretKey, 'HS256');

        unset($user['password']);

        return $this->respond([
            'status'  => 200,
            'message' => 'Inicio de sesión exitoso.',
            'token'   => $token,
            'user'    => $user,
        ]);
    }

    public function me()
    {
        $userData = $this->request->user ?? null;
        if (!$userData) {
            return $this->failUnauthorized('No autenticado');
        }

        $userModel = new UserModel();
        $user = $userModel->find($userData->id);
        if (!$user) {
            return $this->failNotFound('Usuario no encontrado');
        }

        unset($user['password']);
        return $this->respond(['status' => 200, 'user' => $user]);
    }

    public function updateProfile()
    {
        $userData = $this->request->user ?? null;
        if (!$userData) {
            return $this->failUnauthorized('No autenticado');
        }

        $userModel = new UserModel();
        $user = $userModel->find($userData->id);
        if (!$user) {
            return $this->failNotFound('Usuario no encontrado');
        }

        $name     = $this->request->getVar('name');
        $avatar   = $this->request->getVar('avatar');
        $password = $this->request->getVar('password');

        $updateData = [];
        if ($name) $updateData['name'] = $name;
        if ($avatar) $updateData['avatar'] = $avatar;
        if ($password && strlen($password) >= 6) {
            $updateData['password'] = password_hash($password, PASSWORD_BCRYPT);
        }

        if (!empty($updateData)) {
            $userModel->update($user['id'], $updateData);
        }

        $updatedUser = $userModel->find($user['id']);
        unset($updatedUser['password']);

        return $this->respond([
            'status'  => 200,
            'message' => 'Perfil actualizado exitosamente.',
            'user'    => $updatedUser,
        ]);
    }
}
