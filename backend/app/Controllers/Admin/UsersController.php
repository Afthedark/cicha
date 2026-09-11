<?php

namespace App\Controllers\Admin;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;

class UsersController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $currentUser = $this->request->user ?? \App\Filters\JwtAuthFilter::$currentUser ?? null;
        $userModel = new UserModel();
        $roleParam = $this->request->getGet('role');

        $users = $userModel->getUsersWithMember();

        if ($roleParam === 'staff') {
            $users = array_values(array_filter($users, fn($u) => in_array($u['role'], ['admin', 'secretario'])));
        } elseif ($roleParam === 'socio') {
            $users = array_values(array_filter($users, fn($u) => $u['role'] === 'socio'));
        } elseif (!empty($roleParam)) {
            $roles = explode(',', $roleParam);
            $users = array_values(array_filter($users, fn($u) => in_array($u['role'], $roles)));
        }

        // Si el usuario autenticado NO es el Super Admin (ID 1), ocultar al Super Admin
        $currentUserId = $currentUser ? (int) ($currentUser->id ?? 0) : 0;
        if ($currentUserId !== 1) {
            $users = array_values(array_filter($users, fn($u) => (int) $u['id'] !== 1));
        }

        return $this->respond(['status' => 200, 'data' => $users]);
    }

    public function show($id = null)
    {
        $currentUser = $this->request->user ?? \App\Filters\JwtAuthFilter::$currentUser ?? null;
        $currentUserId = $currentUser ? (int) ($currentUser->id ?? 0) : 0;

        // Si se solicita al Super Admin (ID 1) y quien consulta NO es el Super Admin, denegar
        if ((int) $id === 1 && $currentUserId !== 1) {
            return $this->failNotFound('Usuario no encontrado');
        }

        $userModel = new UserModel();
        $user = $userModel->find($id);
        if (!$user) return $this->failNotFound('Usuario no encontrado');
        unset($user['password']);
        return $this->respond(['status' => 200, 'data' => $user]);
    }

    public function create()
    {
        $currentUser = $this->request->user ?? \App\Filters\JwtAuthFilter::$currentUser ?? null;
        $input = $this->request->getJSON(true) ?: $this->request->getVar();

        $rules = [
            'name'     => 'required|min_length[3]',
            'email'    => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|min_length[6]',
            'role'     => 'required|in_list[admin,secretario,socio]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        // Secretarios solo pueden dar de alta cuentas con rol socio
        if ($currentUser && $currentUser->role === 'secretario' && $input['role'] !== 'socio') {
            return $this->failForbidden('Los secretarios solo tienen permisos para registrar cuentas de socios.');
        }

        $data = [
            'name'       => $input['name'],
            'email'      => $input['email'],
            'password'   => password_hash($input['password'], PASSWORD_BCRYPT),
            'role'       => $input['role'],
            'member_id'  => !empty($input['member_id']) ? (int) $input['member_id'] : null,
            'avatar'     => $input['avatar'] ?? null,
            'status'     => $input['status'] ?? 'active',
        ];

        $userModel = new UserModel();
        $id = $userModel->insert($data);

        return $this->respondCreated(['status' => 201, 'message' => 'Usuario creado con éxito', 'id' => $id]);
    }

    public function update($id = null)
    {
        $currentUser = $this->request->user ?? \App\Filters\JwtAuthFilter::$currentUser ?? null;
        $currentUserId = $currentUser ? (int) ($currentUser->id ?? 0) : 0;

        // Protección estricta: Solo el propio Super Admin (ID 1) puede modificar su cuenta
        if ((int) $id === 1 && $currentUserId !== 1) {
            return $this->failForbidden('No tiene permisos para modificar la cuenta del Super Administrador.');
        }

        $userModel = new UserModel();
        $user = $userModel->find($id);
        if (!$user) return $this->failNotFound('Usuario no encontrado');

        $input = $this->request->getJSON(true) ?: ($this->request->getRawInput() ?: $this->request->getVar());

        // Secretarios solo pueden gestionar usuarios socios
        if ($currentUser && $currentUser->role === 'secretario') {
            if ($user['role'] !== 'socio' || (isset($input['role']) && $input['role'] !== 'socio')) {
                return $this->failForbidden('Los secretarios solo tienen permisos para gestionar cuentas de socios.');
            }
        }

        $data = [];
        if (!empty($input['name'])) $data['name'] = $input['name'];
        if (!empty($input['email']) && $input['email'] !== $user['email']) {
            $data['email'] = $input['email'];
        }
        if (!empty($input['role'])) $data['role'] = $input['role'];
        if (isset($input['member_id'])) $data['member_id'] = !empty($input['member_id']) ? (int) $input['member_id'] : null;
        if (isset($input['avatar'])) $data['avatar'] = $input['avatar'];
        if (!empty($input['status'])) $data['status'] = $input['status'];
        if (!empty($input['password']) && strlen($input['password']) >= 6) {
            $data['password'] = password_hash($input['password'], PASSWORD_BCRYPT);
        }

        $userModel->update($id, $data);
        return $this->respond(['status' => 200, 'message' => 'Usuario actualizado con éxito']);
    }

    public function delete($id = null)
    {
        $currentUser = $this->request->user ?? \App\Filters\JwtAuthFilter::$currentUser ?? null;
        $userModel = new UserModel();
        $target = $userModel->find($id);
        if (!$target) return $this->failNotFound('Usuario no encontrado');
        if ((int) $id === 1) {
            return $this->failForbidden('No es posible eliminar al Super Administrador principal del sistema.');
        }

        if ($currentUser && $currentUser->role === 'secretario' && $target['role'] !== 'socio') {
            return $this->failForbidden('Los secretarios solo tienen permisos para eliminar cuentas de socios.');
        }

        $userModel->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'Usuario eliminado con éxito']);
    }
}
