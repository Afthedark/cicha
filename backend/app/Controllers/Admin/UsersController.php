<?php

namespace App\Controllers\Admin;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;

class UsersController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $userModel = new UserModel();
        $users = $userModel->getUsersWithMember();
        return $this->respond(['status' => 200, 'data' => $users]);
    }

    public function show($id = null)
    {
        $userModel = new UserModel();
        $user = $userModel->find($id);
        if (!$user) return $this->failNotFound('Usuario no encontrado');
        unset($user['password']);
        return $this->respond(['status' => 200, 'data' => $user]);
    }

    public function create()
    {
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
        $userModel = new UserModel();
        $user = $userModel->find($id);
        if (!$user) return $this->failNotFound('Usuario no encontrado');

        $input = $this->request->getJSON(true) ?: ($this->request->getRawInput() ?: $this->request->getVar());

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
        $userModel = new UserModel();
        if (!$userModel->find($id)) return $this->failNotFound('Usuario no encontrado');
        if ((int) $id === 1) {
            return $this->fail('No es posible eliminar al Administrador principal del sistema.');
        }
        $userModel->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'Usuario eliminado con éxito']);
    }
}
