<?php

namespace App\Controllers\Admin;

use App\Models\EventModel;
use CodeIgniter\RESTful\ResourceController;

class EventsController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $eventModel = new EventModel();
        $events = $eventModel->getWithCategory();
        return $this->respond(['status' => 200, 'data' => $events]);
    }

    public function show($id = null)
    {
        $eventModel = new EventModel();
        $event = $eventModel->getWithCategory($id);
        if (!$event) return $this->failNotFound('Evento no encontrado');
        return $this->respond(['status' => 200, 'data' => $event]);
    }

    public function create()
    {
        $rules = [
            'title'      => 'required|min_length[3]',
            'event_date' => 'required',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $title = $this->request->getVar('title');
        $slug = url_title($title, '-', true) . '-' . time();

        $data = [
            'category_id'      => $this->request->getVar('category_id') ?: null,
            'title'            => $title,
            'slug'             => $slug,
            'description'      => $this->request->getVar('description') ?: '',
            'event_date'       => $this->request->getVar('event_date'),
            'end_date'         => $this->request->getVar('end_date') ?: null,
            'location_type'    => $this->request->getVar('location_type') ?: 'presencial',
            'location_address' => $this->request->getVar('location_address') ?: '',
            'registration_url' => $this->request->getVar('registration_url') ?: '',
            'image_url'        => $this->request->getVar('image_url') ?: '',
            'organizer'        => $this->request->getVar('organizer') ?: 'CICHA / Red EEN',
            'is_featured'      => $this->request->getVar('is_featured') ? 1 : 0,
            'status'           => $this->request->getVar('status') ?: 'upcoming',
        ];

        $eventModel = new EventModel();
        $id = $eventModel->insert($data);

        return $this->respondCreated(['status' => 201, 'message' => 'Evento creado con éxito', 'id' => $id]);
    }

    public function update($id = null)
    {
        $eventModel = new EventModel();
        if (!$eventModel->find($id)) return $this->failNotFound('Evento no encontrado');

        $input = $this->request->getRawInput();
        if (empty($input)) $input = $this->request->getVar();

        $data = [];
        if (isset($input['title'])) {
            $data['title'] = $input['title'];
            $data['slug'] = url_title($input['title'], '-', true) . '-' . $id;
        }
        if (isset($input['category_id'])) $data['category_id'] = $input['category_id'] ?: null;
        if (isset($input['description'])) $data['description'] = $input['description'];
        if (isset($input['event_date'])) $data['event_date'] = $input['event_date'];
        if (isset($input['end_date'])) $data['end_date'] = $input['end_date'] ?: null;
        if (isset($input['location_type'])) $data['location_type'] = $input['location_type'];
        if (isset($input['location_address'])) $data['location_address'] = $input['location_address'];
        if (isset($input['registration_url'])) $data['registration_url'] = $input['registration_url'];
        if (isset($input['image_url'])) $data['image_url'] = $input['image_url'];
        if (isset($input['organizer'])) $data['organizer'] = $input['organizer'];
        if (isset($input['is_featured'])) $data['is_featured'] = $input['is_featured'] ? 1 : 0;
        if (isset($input['status'])) $data['status'] = $input['status'];

        $eventModel->update($id, $data);
        return $this->respond(['status' => 200, 'message' => 'Evento actualizado con éxito']);
    }

    public function delete($id = null)
    {
        $eventModel = new EventModel();
        if (!$eventModel->find($id)) return $this->failNotFound('Evento no encontrado');
        $eventModel->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'Evento eliminado']);
    }
}
