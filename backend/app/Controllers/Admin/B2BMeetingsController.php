<?php

namespace App\Controllers\Admin;

use App\Models\B2BMeetingModel;
use CodeIgniter\RESTful\ResourceController;

class B2BMeetingsController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new B2BMeetingModel();
        $items = $model->orderBy('meeting_date', 'DESC')->findAll();
        return $this->respond(['status' => 200, 'data' => $items]);
    }

    public function show($id = null)
    {
        $model = new B2BMeetingModel();
        $item = $model->find($id);
        if (!$item) {
            return $this->failNotFound('Encuentro B2B no encontrado');
        }
        return $this->respond(['status' => 200, 'data' => $item]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true) ?: $this->request->getVar();

        $rules = [
            'title' => 'required|min_length[3]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $title = $input['title'];
        $slug = !empty($input['slug']) ? url_title($input['slug'], '-', true) : url_title($title, '-', true);

        // Ensure unique slug
        $model = new B2BMeetingModel();
        $existing = $model->where('slug', $slug)->first();
        if ($existing) {
            $slug .= '-' . time();
        }

        $data = [
            'title'                   => $title,
            'slug'                    => $slug,
            'sector'                  => $input['sector'] ?? 'Multisectorial',
            'meeting_date'            => !empty($input['meeting_date']) ? $input['meeting_date'] : null,
            'location'                => $input['location'] ?? 'Buenos Aires / Atenas (Híbrido)',
            'modality'                => $input['modality'] ?? 'hibrido',
            'status'                  => $input['status'] ?? 'completed',
            'cover_image_url'         => $input['cover_image_url'] ?? '',
            'public_summary'          => $input['public_summary'] ?? '',
            'participants_count'      => isset($input['participants_count']) ? (int)$input['participants_count'] : 0,
            'meetings_count'          => isset($input['meetings_count']) ? (int)$input['meetings_count'] : 0,
            'agreements_count'        => isset($input['agreements_count']) ? (int)$input['agreements_count'] : 0,
            'partner_detailed_report' => $input['partner_detailed_report'] ?? '',
            'partner_companies_list'  => $input['partner_companies_list'] ?? '',
            'partner_conclusions'     => $input['partner_conclusions'] ?? '',
            'partner_document_url'    => $input['partner_document_url'] ?? '',
            'partner_contact_info'    => $input['partner_contact_info'] ?? '',
            'is_active'               => isset($input['is_active']) ? ((int)$input['is_active'] ? 1 : 0) : 1,
        ];

        $id = $model->insert($data);

        return $this->respondCreated(['status' => 201, 'message' => 'Encuentro B2B creado con éxito', 'id' => $id]);
    }

    public function update($id = null)
    {
        $model = new B2BMeetingModel();
        if (!$model->find($id)) {
            return $this->failNotFound('Encuentro B2B no encontrado');
        }

        $input = $this->request->getJSON(true) ?: ($this->request->getRawInput() ?: $this->request->getVar());

        $data = [];
        if (isset($input['title'])) {
            $data['title'] = $input['title'];
            if (empty($input['slug'])) {
                $data['slug'] = url_title($input['title'], '-', true);
            }
        }
        if (isset($input['slug'])) $data['slug'] = url_title($input['slug'], '-', true);
        if (isset($input['sector'])) $data['sector'] = $input['sector'];
        if (isset($input['meeting_date'])) $data['meeting_date'] = !empty($input['meeting_date']) ? $input['meeting_date'] : null;
        if (isset($input['location'])) $data['location'] = $input['location'];
        if (isset($input['modality'])) $data['modality'] = $input['modality'];
        if (isset($input['status'])) $data['status'] = $input['status'];
        if (isset($input['cover_image_url'])) $data['cover_image_url'] = $input['cover_image_url'];
        if (isset($input['public_summary'])) $data['public_summary'] = $input['public_summary'];
        if (isset($input['participants_count'])) $data['participants_count'] = (int)$input['participants_count'];
        if (isset($input['meetings_count'])) $data['meetings_count'] = (int)$input['meetings_count'];
        if (isset($input['agreements_count'])) $data['agreements_count'] = (int)$input['agreements_count'];
        if (isset($input['partner_detailed_report'])) $data['partner_detailed_report'] = $input['partner_detailed_report'];
        if (isset($input['partner_companies_list'])) $data['partner_companies_list'] = $input['partner_companies_list'];
        if (isset($input['partner_conclusions'])) $data['partner_conclusions'] = $input['partner_conclusions'];
        if (isset($input['partner_document_url'])) $data['partner_document_url'] = $input['partner_document_url'];
        if (isset($input['partner_contact_info'])) $data['partner_contact_info'] = $input['partner_contact_info'];
        if (isset($input['is_active'])) $data['is_active'] = (int)$input['is_active'] ? 1 : 0;

        $model->update($id, $data);
        return $this->respond(['status' => 200, 'message' => 'Encuentro B2B actualizado con éxito']);
    }

    public function delete($id = null)
    {
        $model = new B2BMeetingModel();
        if (!$model->find($id)) {
            return $this->failNotFound('Encuentro B2B no encontrado');
        }
        $model->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'Encuentro B2B eliminado']);
    }
}
