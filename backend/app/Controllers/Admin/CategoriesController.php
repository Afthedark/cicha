<?php

namespace App\Controllers\Admin;

use App\Models\CategoryModel;
use App\Models\MemberModel;
use CodeIgniter\RESTful\ResourceController;

class CategoriesController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new CategoryModel();
        $type = $this->request->getGet('type');

        $builder = $model->orderBy('name', 'ASC');
        if ($type) {
            $builder->where('type', $type);
        }

        $categories = $builder->findAll();
        return $this->respond(['status' => 200, 'data' => $categories]);
    }

    public function show($id = null)
    {
        $model = new CategoryModel();
        $cat = $model->find($id);
        if (!$cat) return $this->failNotFound('Categoría no encontrada');
        return $this->respond(['status' => 200, 'data' => $cat]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true) ?: $this->request->getRawInput() ?: $this->request->getVar();

        $rules = [
            'name' => 'required|min_length[2]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $type = $input['type'] ?? 'members';
        $baseSlug = url_title($input['name'], '-', true);
        if (empty($baseSlug)) {
            $baseSlug = 'cat-' . time();
        }

        $model = new CategoryModel();
        $slug = $baseSlug;
        $counter = 1;
        while ($model->where('slug', $slug)->first()) {
            $slug = $baseSlug . '-' . $type . ($counter > 1 ? "-{$counter}" : '');
            $counter++;
            if ($counter > 15) {
                $slug = $baseSlug . '-' . substr(md5(uniqid()), 0, 6);
                break;
            }
        }

        $data = [
            'name' => trim($input['name']),
            'slug' => $slug,
            'type' => $type,
        ];

        $id = $model->insert($data);

        return $this->respondCreated(['status' => 201, 'message' => 'Categoría / Rubro creado con éxito', 'id' => $id]);
    }

    public function update($id = null)
    {
        $model = new CategoryModel();
        $existing = $model->find($id);
        if (!$existing) return $this->failNotFound('Categoría no encontrada');

        $input = $this->request->getJSON(true) ?: $this->request->getRawInput() ?: $this->request->getVar();

        $data = [];
        if (isset($input['name']) && !empty(trim($input['name']))) {
            $newName = trim($input['name']);
            $targetType = $input['type'] ?? $existing['type'];
            $baseSlug = url_title($newName, '-', true);
            if (empty($baseSlug)) {
                $baseSlug = 'cat-' . time();
            }

            $slug = $baseSlug;
            $counter = 1;
            while ($model->where('slug', $slug)->where('id !=', $id)->first()) {
                $slug = $baseSlug . '-' . $targetType . ($counter > 1 ? "-{$counter}" : '');
                $counter++;
                if ($counter > 15) {
                    $slug = $baseSlug . '-' . substr(md5(uniqid()), 0, 6);
                    break;
                }
            }

            $data['name'] = $newName;
            $data['slug'] = $slug;

            // Si es de tipo members, actualizar también en cascada el sector en los socios asociados
            if ($existing['type'] === 'members') {
                $memberModel = new MemberModel();
                $memberModel->where('sector', $existing['name'])->set(['sector' => $newName])->update();
            }

            // Si es de tipo gallery, actualizar también en cascada en los álbumes de fotos asociados
            if ($existing['type'] === 'gallery') {
                $albumModel = new \App\Models\PhotoAlbumModel();
                $albumModel->where('category', $existing['name'])->set(['category' => $newName])->update();
            }

            // Si es de tipo benefits, actualizar también en cascada en los beneficios asociados
            if ($existing['type'] === 'benefits') {
                $benefitModel = new \App\Models\PartnerBenefitModel();
                $benefitModel->where('category', $existing['name'])->set(['category' => $newName])->update();
            }

            // Si es de tipo b2b, actualizar también en cascada el sector en las reuniones B2B asociadas
            if ($existing['type'] === 'b2b') {
                $b2bModel = new \App\Models\B2BMeetingModel();
                $b2bModel->where('sector', $existing['name'])->set(['sector' => $newName])->update();
            }

            // Si es de tipo blogs, actualizar también en cascada la categoría en las notas editoriales asociadas
            if ($existing['type'] === 'blogs') {
                $blogModel = new \App\Models\BlogModel();
                $blogModel->where('category', $existing['name'])->set(['category' => $newName])->update();
            }
        }
        if (isset($input['type'])) $data['type'] = $input['type'];

        if (!empty($data)) {
            $model->update($id, $data);
        }

        return $this->respond(['status' => 200, 'message' => 'Categoría / Rubro actualizado con éxito']);
    }

    public function delete($id = null)
    {
        $model = new CategoryModel();
        $existing = $model->find($id);
        if (!$existing) return $this->failNotFound('Categoría no encontrada');

        // Si es de tipo noticias, desvincular de forma segura los artículos asociados (soft detach)
        if ($existing['type'] === 'news' || $existing['type'] === 'events') {
            $articleModel = new \App\Models\ArticleModel();
            $articleModel->where('category_id', $id)->set(['category_id' => null])->update();
        }

        // Si es de tipo b2b, reasignar de forma segura a Multisectorial
        if ($existing['type'] === 'b2b') {
            $b2bModel = new \App\Models\B2BMeetingModel();
            $b2bModel->where('sector', $existing['name'])->set(['sector' => 'Multisectorial'])->update();
        }

        // Si es de tipo blogs, reasignar de forma segura a General
        if ($existing['type'] === 'blogs') {
            $blogModel = new \App\Models\BlogModel();
            $blogModel->where('category', $existing['name'])->set(['category' => 'General'])->update();
        }

        $model->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'Categoría eliminada']);
    }
}
