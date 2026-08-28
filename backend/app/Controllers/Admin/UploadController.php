<?php

namespace App\Controllers\Admin;

use CodeIgniter\RESTful\ResourceController;

class UploadController extends ResourceController
{
    protected $format = 'json';

    public function uploadImage()
    {
        $file = $this->request->getFile('file');

        if (!$file || !$file->isValid()) {
            return $this->fail('No se subió ningún archivo o el archivo no es válido.');
        }

        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
        if (!in_array($file->getMimeType(), $allowedTypes)) {
            return $this->fail('Tipo de archivo no permitido. Solo se aceptan imágenes JPEG, PNG, WEBP, GIF y SVG.');
        }

        if ($file->getSizeByUnit('mb') > 10) {
            return $this->fail('El archivo supera el tamaño máximo permitido (10MB).');
        }

        $uploadPath = FCPATH . 'uploads/';
        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }

        $newName = $file->getRandomName();
        $file->move($uploadPath, $newName);

        // Public URL pointing dynamically to /uploads/{filename} according to App.baseURL in production
        $url = base_url('uploads/' . $newName);

        return $this->respond([
            'status'  => 200,
            'message' => 'Imagen subida exitosamente',
            'url'     => $url,
            'filename'=> $newName,
        ]);
    }
}
