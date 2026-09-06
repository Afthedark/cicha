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

        $allowedTypes = [
            'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/zip',
            'application/x-zip-compressed',
            'text/plain',
            'text/csv'
        ];
        if (!in_array($file->getMimeType(), $allowedTypes)) {
            return $this->fail('Tipo de archivo no permitido. Se aceptan imágenes (JPG, PNG, WEBP) y documentos (PDF, Word, Excel, PowerPoint, ZIP, CSV).');
        }

        if ($file->getSizeByUnit('mb') > 30) {
            return $this->fail('El archivo supera el tamaño máximo permitido (30MB).');
        }

        $uploadPath = FCPATH . 'uploads/';
        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }

        $origExtension = strtoupper($file->getClientExtension() ?: 'PDF');
        $sizeBytes = $file->getSize();
        $formattedSize = $sizeBytes > 1048576 
            ? round($sizeBytes / 1048576, 1) . ' MB' 
            : round($sizeBytes / 1024, 1) . ' KB';

        $newName = $file->getRandomName();
        $file->move($uploadPath, $newName);

        // Public URL pointing dynamically to /uploads/{filename} according to App.baseURL in production
        $url = base_url('uploads/' . $newName);

        return $this->respond([
            'status'     => 200,
            'message'    => 'Archivo subido exitosamente',
            'url'        => $url,
            'filename'   => $newName,
            'file_type'  => $origExtension,
            'file_size'  => $formattedSize,
        ]);
    }
}
