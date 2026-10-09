<?php

namespace App\Controllers\Admin;

use App\Models\CommercialOpportunityModel;
use CodeIgniter\RESTful\ResourceController;

class OpportunitiesController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new CommercialOpportunityModel();
        $trash = $this->request->getGet('trash');
        $type = $this->request->getGet('type');
        $sector = $this->request->getGet('sector');
        $status = $this->request->getGet('status');
        $q = $this->request->getGet('q');

        $builder = $model;

        if ($trash === 'true' || $trash === '1') {
            $builder = $builder->onlyDeleted();
        }

        if (!empty($type) && $type !== 'all') {
            $builder = $builder->where('type', $type);
        }

        if (!empty($status) && $status !== 'all') {
            $builder = $builder->where('status', $status);
        }

        if (!empty($sector) && $sector !== 'all') {
            $builder = $builder->groupStart()
                ->where('sector', $sector)
                ->orLike('categories', '"' . $sector . '"')
                ->orLike('sector', $sector)
                ->groupEnd();
        }

        if (!empty($q)) {
            $builder = $builder->groupStart()
                ->like('title', $q)
                ->orLike('description', $q)
                ->orLike('sector', $q)
                ->orLike('contact_person', $q)
                ->orLike('origin_country', $q)
                ->orLike('target_country', $q)
                ->groupEnd();
        }

        $items = $builder->orderBy('created_at', 'DESC')->findAll();

        foreach ($items as &$item) {
            if (!empty($item['categories']) && is_string($item['categories'])) {
                $decoded = json_decode($item['categories'], true);
                $item['categories'] = is_array($decoded) ? $decoded : [$item['sector']];
            } elseif (empty($item['categories']) && !empty($item['sector'])) {
                $item['categories'] = [$item['sector']];
            } else {
                $item['categories'] = [];
            }
        }

        return $this->respond(['status' => 200, 'data' => $items]);
    }

    public function show($id = null)
    {
        $model = new CommercialOpportunityModel();
        $item = is_numeric($id) ? $model->withDeleted()->find($id) : $model->withDeleted()->where('slug', $id)->first();
        if (!$item) return $this->failNotFound('Oportunidad no encontrada');

        if (!empty($item['categories']) && is_string($item['categories'])) {
            $decoded = json_decode($item['categories'], true);
            $item['categories'] = is_array($decoded) ? $decoded : [$item['sector']];
        } elseif (empty($item['categories']) && !empty($item['sector'])) {
            $item['categories'] = [$item['sector']];
        } else {
            $item['categories'] = [];
        }

        return $this->respond(['status' => 200, 'data' => $item]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true) ?: ($this->request->getRawInput() ?: $this->request->getVar());

        $rules = [
            'title'       => 'required|min_length[3]',
            'description' => 'required',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $title = trim($input['title'] ?? '');
        $slug = clean_slug($title) . '-' . time();

        $categoriesArr = [];
        if (!empty($input['categories'])) {
            $categoriesArr = is_array($input['categories']) 
                ? array_values(array_filter(array_map('trim', $input['categories'])))
                : array_values(array_filter(array_map('trim', explode(',', $input['categories']))));
        }

        $primarySector = !empty($categoriesArr) ? $categoriesArr[0] : (!empty($input['sector']) ? trim($input['sector']) : 'General');
        if (empty($categoriesArr) && !empty($primarySector)) {
            $categoriesArr = [$primarySector];
        }

        $data = [
            'title'          => $title,
            'slug'           => $slug,
            'type'           => $input['type'] ?? 'export',
            'origin_country' => $input['origin_country'] ?? 'Grecia',
            'target_country' => $input['target_country'] ?? 'Argentina',
            'sector'         => $primarySector,
            'categories'     => json_encode($categoriesArr, JSON_UNESCAPED_UNICODE),
            'description'    => $input['description'] ?? '',
            'requirements'   => $input['requirements'] ?? '',
            'contact_person' => $input['contact_person'] ?? '',
            'contact_email'  => $input['contact_email'] ?? '',
            'status'         => $input['status'] ?? 'open',
            'deadline'       => !empty($input['deadline']) ? $input['deadline'] : null,
        ];

        $model = new CommercialOpportunityModel();
        $id = $model->insert($data);

        return $this->respondCreated(['status' => 201, 'message' => 'Oportunidad creada con éxito', 'id' => $id]);
    }

    public function update($id = null)
    {
        $model = new CommercialOpportunityModel();
        if (!$model->withDeleted()->find($id)) return $this->failNotFound('Oportunidad no encontrada');

        $input = $this->request->getJSON(true) ?: ($this->request->getRawInput() ?: $this->request->getVar());
        if (empty($input)) {
            $input = [];
        }

        $data = [];
        if (isset($input['title'])) {
            $data['title'] = trim($input['title']);
            $data['slug'] = clean_slug($input['title']) . '-' . $id;
        }
        if (isset($input['type'])) $data['type'] = $input['type'];
        if (isset($input['origin_country'])) $data['origin_country'] = $input['origin_country'];
        if (isset($input['target_country'])) $data['target_country'] = $input['target_country'];
        
        if (isset($input['categories'])) {
            $categoriesArr = is_array($input['categories'])
                ? array_values(array_filter(array_map('trim', $input['categories'])))
                : array_values(array_filter(array_map('trim', explode(',', $input['categories']))));
            $data['categories'] = json_encode($categoriesArr, JSON_UNESCAPED_UNICODE);
            if (!empty($categoriesArr)) {
                $data['sector'] = $categoriesArr[0];
            }
        } elseif (isset($input['sector'])) {
            $data['sector'] = trim($input['sector']);
            $data['categories'] = json_encode([trim($input['sector'])], JSON_UNESCAPED_UNICODE);
        }

        if (isset($input['description'])) $data['description'] = $input['description'];
        if (isset($input['requirements'])) $data['requirements'] = $input['requirements'];
        if (isset($input['contact_person'])) $data['contact_person'] = $input['contact_person'];
        if (isset($input['contact_email'])) $data['contact_email'] = $input['contact_email'];
        if (isset($input['status'])) $data['status'] = $input['status'];
        if (array_key_exists('deadline', $input)) {
            $data['deadline'] = !empty($input['deadline']) ? $input['deadline'] : null;
        }

        if (!empty($data)) {
            $model->update($id, $data);
        }

        return $this->respond(['status' => 200, 'message' => 'Oportunidad comercial actualizada']);
    }

    public function delete($id = null)
    {
        $model = new CommercialOpportunityModel();
        if (!$model->find($id)) return $this->failNotFound('Oportunidad no encontrada');
        $model->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'Oportunidad eliminada (Soft Delete)']);
    }

    public function restore($id = null)
    {
        $model = new CommercialOpportunityModel();
        $item = $model->onlyDeleted()->find($id);
        if (!$item) return $this->failNotFound('Oportunidad en papelera no encontrada');

        $model->update($id, ['deleted_at' => null]);
        return $this->respond(['status' => 200, 'message' => 'Oportunidad comercial restaurada con éxito']);
    }

    public function forceDelete($id = null)
    {
        $model = new CommercialOpportunityModel();
        $item = $model->withDeleted()->find($id);
        if (!$item) return $this->failNotFound('Oportunidad no encontrada');

        $model->delete($id, true);
        return $this->respondDeleted(['status' => 200, 'message' => 'Oportunidad eliminada permanentemente']);
    }
}
