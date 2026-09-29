<?php

namespace App\Controllers\Admin;

use App\Models\PartnerMinuteModel;
use CodeIgniter\RESTful\ResourceController;

class PartnerMinutesController extends ResourceController
{
    protected $modelName = 'App\Models\PartnerMinuteModel';
    protected $format    = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $search = $this->request->getGet('q');
        $category = $this->request->getGet('category');

        $builder = $db->table('partner_minutes pm')
            ->select('pm.*, u.name as user_name, u.email as user_email, u.avatar as user_avatar, m.company_name, m.logo_url as company_logo')
            ->join('users u', 'u.id = pm.user_id', 'left')
            ->join('members m', 'm.id = pm.member_id', 'left');

        if (!empty($category) && $category !== 'all') {
            $builder->groupStart()
                ->where('pm.category', $category)
                ->orLike('pm.categories', '"' . $category . '"')
                ->orLike('pm.category', $category)
                ->groupEnd();
        }

        if (!empty($search)) {
            $builder->groupStart()
                ->like('pm.title', $search)
                ->orLike('pm.description', $search)
                ->orLike('pm.category', $search)
                ->orLike('pm.categories', $search)
                ->orLike('u.name', $search)
                ->orLike('m.company_name', $search)
                ->groupEnd();
        }

        $minutes = $builder->orderBy('pm.created_at', 'DESC')->get()->getResultArray();

        return $this->respond([
            'status' => 200,
            'data'   => $minutes
        ]);
    }

    public function show($id = null)
    {
        $db = \Config\Database::connect();
        $minute = $db->table('partner_minutes pm')
            ->select('pm.*, u.name as user_name, u.email as user_email, u.avatar as user_avatar, m.company_name, m.logo_url as company_logo')
            ->join('users u', 'u.id = pm.user_id', 'left')
            ->join('members m', 'm.id = pm.member_id', 'left')
            ->where('pm.id', $id)
            ->get()
            ->getRowArray();

        if (!$minute) {
            return $this->failNotFound('Acta no encontrada.');
        }

        return $this->respond([
            'status' => 200,
            'data'   => $minute
        ]);
    }

    public function create()
    {
        $userData = $this->request->user ?? \App\Filters\JwtAuthFilter::$currentUser ?? null;
        if (!$userData || empty($userData->id)) {
            return $this->failUnauthorized('No autorizado para publicar actas.');
        }

        $input = $this->request->getJSON(true) ?? $this->request->getPost();

        if (empty($input['title'])) {
            return $this->fail('El título del acta es obligatorio.');
        }

        $documentType = (!empty($input['document_type']) && in_array($input['document_type'], ['file', 'url', 'text', 'both'])) 
            ? $input['document_type'] 
            : 'file';

        if ($documentType === 'text' && empty($input['content'])) {
            return $this->fail('Debe ingresar el contenido del texto del acta.');
        }

        if ($documentType === 'file' && empty($input['file_url'])) {
            return $this->fail('Debe adjuntar un documento PDF.');
        }

        // Process categories
        $rawCategories = $input['categories'] ?? null;
        $categoriesList = [];
        if (is_array($rawCategories)) {
            $categoriesList = array_values(array_filter(array_map('trim', $rawCategories)));
        } elseif (is_string($rawCategories)) {
            $decoded = json_decode($rawCategories, true);
            if (is_array($decoded)) {
                $categoriesList = array_values(array_filter(array_map('trim', $decoded)));
            } else {
                $categoriesList = array_values(array_filter(array_map('trim', explode(',', $rawCategories))));
            }
        }
        if (empty($categoriesList) && !empty($input['category'])) {
            $categoriesList = array_values(array_filter(array_map('trim', explode(',', $input['category']))));
        }
        if (empty($categoriesList)) {
            $categoriesList = ['Asamblea General'];
        }

        $primaryCategory = implode(', ', $categoriesList);
        $categoriesJson = json_encode($categoriesList, JSON_UNESCAPED_UNICODE);

        $data = [
            'user_id'           => $userData->id,
            'member_id'         => !empty($input['member_id']) ? $input['member_id'] : null,
            'title'             => trim($input['title']),
            'category'          => $primaryCategory,
            'categories'        => $categoriesJson,
            'description'       => !empty($input['description']) ? trim($input['description']) : null,
            'content'           => !empty($input['content']) ? trim($input['content']) : null,
            'cover_image_url'   => !empty($input['cover_image_url']) ? trim($input['cover_image_url']) : null,
            'author_avatar_url' => !empty($input['author_avatar_url']) ? trim($input['author_avatar_url']) : null,
            'logo_url'          => !empty($input['logo_url']) ? trim($input['logo_url']) : null,
            'document_type'     => $documentType,
            'file_url'          => !empty($input['file_url']) ? trim($input['file_url']) : null,
            'file_name'         => !empty($input['file_name']) ? trim($input['file_name']) : ($documentType === 'text' ? 'Acta Digital' : null),
            'file_size'         => !empty($input['file_size']) ? trim($input['file_size']) : ($documentType === 'text' ? 'Texto Oficial' : null),
            'meeting_date'      => !empty($input['meeting_date']) ? $input['meeting_date'] : date('Y-m-d'),
            'is_active'         => isset($input['is_active']) ? (int)$input['is_active'] : 1,
            'downloads'         => 0,
        ];

        $minuteModel = new PartnerMinuteModel();
        if ($minuteModel->insert($data)) {
            $insertedId = $minuteModel->getInsertID();
            return $this->respondCreated([
                'status'  => 201,
                'message' => 'Acta institucional registrada exitosamente.',
                'id'      => $insertedId
            ]);
        }

        return $this->fail($minuteModel->errors() ?: 'Error al guardar el acta.');
    }

    public function update($id = null)
    {
        $minuteModel = new PartnerMinuteModel();
        $minute = $minuteModel->find($id);
        if (!$minute) {
            return $this->failNotFound('Acta no encontrada.');
        }

        $input = $this->request->getJSON(true) ?? $this->request->getRawInput() ?? $this->request->getVar();

        $data = [];
        if (isset($input['title']))         $data['title']         = trim($input['title']);
        
        // Process categories on update
        if (isset($input['categories']) || isset($input['category'])) {
            $rawCategories = $input['categories'] ?? $input['category'];
            $categoriesList = [];
            if (is_array($rawCategories)) {
                $categoriesList = array_values(array_filter(array_map('trim', $rawCategories)));
            } elseif (is_string($rawCategories)) {
                $decoded = json_decode($rawCategories, true);
                if (is_array($decoded)) {
                    $categoriesList = array_values(array_filter(array_map('trim', $decoded)));
                } else {
                    $categoriesList = array_values(array_filter(array_map('trim', explode(',', $rawCategories))));
                }
            }
            if (!empty($categoriesList)) {
                $data['category']   = implode(', ', $categoriesList);
                $data['categories'] = json_encode($categoriesList, JSON_UNESCAPED_UNICODE);
            }
        }

        if (isset($input['description']))       $data['description']       = trim($input['description']);
        if (isset($input['content']))           $data['content']           = trim($input['content']);
        if (isset($input['cover_image_url']))   $data['cover_image_url']   = trim($input['cover_image_url']) ?: null;
        if (isset($input['author_avatar_url'])) $data['author_avatar_url'] = trim($input['author_avatar_url']) ?: null;
        if (isset($input['logo_url']))          $data['logo_url']          = trim($input['logo_url']) ?: null;
        if (isset($input['document_type']))     $data['document_type']     = $input['document_type'];
        if (isset($input['file_url']))          $data['file_url']          = trim($input['file_url']) ?: null;
        if (isset($input['file_name']))         $data['file_name']         = trim($input['file_name']) ?: null;
        if (isset($input['file_size']))         $data['file_size']         = trim($input['file_size']) ?: null;
        if (isset($input['meeting_date']))      $data['meeting_date']      = $input['meeting_date'];
        if (isset($input['is_active']))         $data['is_active']         = (int)$input['is_active'];

        if (empty($data)) {
            return $this->fail('No se recibieron datos para actualizar.');
        }

        if ($minuteModel->update($id, $data)) {
            return $this->respond([
                'status'  => 200,
                'message' => 'Acta actualizada exitosamente.'
            ]);
        }

        return $this->fail($minuteModel->errors() ?: 'Error al actualizar el acta.');
    }

    public function delete($id = null)
    {
        $minuteModel = new PartnerMinuteModel();
        $minute = $minuteModel->find($id);
        if (!$minute) {
            return $this->failNotFound('Acta no encontrada.');
        }

        if ($minuteModel->delete($id)) {
            return $this->respondDeleted([
                'status'  => 200,
                'message' => 'Acta eliminada exitosamente.'
            ]);
        }

        return $this->fail('Error al eliminar el acta.');
    }
}
