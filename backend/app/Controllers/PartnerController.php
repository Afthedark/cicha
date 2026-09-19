<?php

namespace App\Controllers;

use App\Models\PartnerResourceModel;
use App\Models\PartnerBenefitModel;
use App\Models\CommercialOpportunityModel;
use App\Models\MemberModel;
use App\Models\EventModel;
use App\Models\CategoryModel;
use App\Models\PartnerMinuteModel;
use App\Models\DecreeModel;
use App\Models\PartnerNewsModel;
use CodeIgniter\RESTful\ResourceController;

class PartnerController extends ResourceController
{
    protected $format = 'json';

    public function dashboard()
    {
        $userData = $this->request->user ?? \App\Filters\JwtAuthFilter::$currentUser ?? null;
        $resourceModel = new PartnerResourceModel();
        $benefitModel  = new PartnerBenefitModel();
        $oppModel      = new CommercialOpportunityModel();
        $memberModel   = new MemberModel();
        $eventModel    = new EventModel();
        $newsModel     = new PartnerNewsModel();

        $memberInfo = null;
        if (!empty($userData->member_id)) {
            $memberInfo = $memberModel->find($userData->member_id);
        }

        $latestResources = $resourceModel->where('is_active', 1)->orderBy('created_at', 'DESC')->findAll(4);
        $activeBenefits  = $benefitModel->where('is_active', 1)->orderBy('created_at', 'DESC')->findAll(4);
        $vipOpportunities= $oppModel->where('status', 'open')->orderBy('created_at', 'DESC')->findAll(4);
        $upcomingEvents  = $eventModel->where('status', 'upcoming')->orderBy('event_date', 'ASC')->findAll(3);
        $latestNews      = $newsModel->where('status', 'published')->orderBy('published_at', 'DESC')->findAll(4);

        $stats = [
            'total_resources'     => $resourceModel->where('is_active', 1)->countAllResults(),
            'total_benefits'      => $benefitModel->where('is_active', 1)->countAllResults(),
            'total_opportunities' => $oppModel->where('status', 'open')->countAllResults(),
            'total_members'       => $memberModel->where('status', 'active')->countAllResults(),
            'total_news'          => $newsModel->where('status', 'published')->countAllResults(),
        ];

        return $this->respond([
            'status' => 200,
            'data'   => [
                'user'                => $userData,
                'member_info'         => $memberInfo,
                'stats'               => $stats,
                'latest_resources'    => $latestResources,
                'active_benefits'     => $activeBenefits,
                'vip_opportunities'   => $vipOpportunities,
                'upcoming_events'     => $upcomingEvents,
                'latest_news'         => $latestNews,
            ]
        ]);
    }

    public function getResources()
    {
        $resourceModel = new PartnerResourceModel();
        $category = $this->request->getGet('category');

        $builder = $resourceModel->where('is_active', 1);
        if ($category && $category !== 'all') {
            $builder->where('category', $category);
        }

        $resources = $builder->orderBy('created_at', 'DESC')->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => $resources
        ]);
    }

    public function downloadResource($id = null)
    {
        $resourceModel = new PartnerResourceModel();
        $resource = $resourceModel->find($id);

        if (!$resource) {
            return $this->failNotFound('Recurso no encontrado.');
        }

        // Increment download counter
        $resourceModel->update($id, ['downloads' => ((int) $resource['downloads']) + 1]);

        return $this->respond([
            'status'  => 200,
            'message' => 'Descarga autorizada para socio.',
            'url'     => $resource['file_url'],
            'title'   => $resource['title']
        ]);
    }

    public function getOpportunities()
    {
        $oppModel = new CommercialOpportunityModel();
        $type = $this->request->getGet('type');
        $sector = $this->request->getGet('sector');

        $builder = $oppModel->where('status', 'open');
        if ($type && $type !== 'all') {
            $builder->where('type', $type);
        }
        if ($sector && $sector !== 'all') {
            $builder->like('sector', $sector);
        }

        // Returns full opportunities with direct contact data for socios
        $opportunities = $builder->orderBy('created_at', 'DESC')->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => $opportunities
        ]);
    }

    public function getBenefits()
    {
        $benefitModel = new PartnerBenefitModel();
        $category = $this->request->getGet('category');

        $builder = $benefitModel->where('is_active', 1);
        if ($category && $category !== 'all') {
            $builder->where('category', $category);
        }

        $benefits = $builder->orderBy('created_at', 'DESC')->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => $benefits
        ]);
    }

    public function getDirectory()
    {
        $memberModel = new MemberModel();
        $search = $this->request->getGet('q');
        $sector = $this->request->getGet('sector');

        $builder = $memberModel->where('status', 'active');
        if ($sector) {
            $builder->like('sector', $sector);
        }
        if ($search) {
            $builder->groupStart()
                ->like('company_name', $search)
                ->orLike('description', $search)
                ->orLike('services', $search)
                ->groupEnd();
        }

        $members = $builder->orderBy('order_num', 'ASC')
            ->orderBy('company_name', 'ASC')
            ->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => $members
        ]);
    }

    public function getCategories()
    {
        $model = new CategoryModel();
        $type = $this->request->getGet('type');

        $builder = $model->orderBy('name', 'ASC');
        if ($type) {
            $builder->where('type', $type);
        }

        $categories = $builder->findAll();
        return $this->respond([
            'status' => 200,
            'data'   => $categories
        ]);
    }

    public function getMinutes()
    {
        $db = \Config\Database::connect();
        $search = $this->request->getGet('q');
        $category = $this->request->getGet('category');

        $builder = $db->table('partner_minutes pm')
            ->select('pm.*, u.name as user_name, u.email as user_email, u.avatar as user_avatar, m.company_name, m.logo_url as company_logo')
            ->join('users u', 'u.id = pm.user_id', 'left')
            ->join('members m', 'm.id = pm.member_id', 'left')
            ->where('pm.is_active', 1);

        if (!empty($category) && $category !== 'all') {
            $builder->where('pm.category', $category);
        }

        if (!empty($search)) {
            $builder->groupStart()
                ->like('pm.title', $search)
                ->orLike('pm.description', $search)
                ->orLike('pm.category', $search)
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

    public function createMinute()
    {
        $userData = $this->request->user ?? \App\Filters\JwtAuthFilter::$currentUser ?? null;
        if (!$userData || empty($userData->id)) {
            return $this->failUnauthorized('No autorizado para publicar actas.');
        }

        $minuteModel = new PartnerMinuteModel();
        $input = $this->request->getJSON(true) ?? $this->request->getPost();

        if (empty($input['title'])) {
            return $this->fail('El título del acta es obligatorio.');
        }

        if (empty($input['file_url'])) {
            return $this->fail('Debe adjuntar un documento PDF o especificar una URL válida.');
        }

        $documentType = (!empty($input['document_type']) && in_array($input['document_type'], ['file', 'url'])) 
            ? $input['document_type'] 
            : 'file';

        $data = [
            'user_id'       => $userData->id,
            'member_id'     => !empty($userData->member_id) ? $userData->member_id : null,
            'title'         => trim($input['title']),
            'category'      => !empty($input['category']) ? trim($input['category']) : 'Asamblea General',
            'description'   => !empty($input['description']) ? trim($input['description']) : null,
            'document_type' => $documentType,
            'file_url'      => trim($input['file_url']),
            'file_name'     => !empty($input['file_name']) ? trim($input['file_name']) : null,
            'file_size'     => !empty($input['file_size']) ? trim($input['file_size']) : null,
            'meeting_date'  => !empty($input['meeting_date']) ? $input['meeting_date'] : null,
            'downloads'     => 0,
            'is_active'     => 1,
        ];

        $insertedId = $minuteModel->insert($data);
        if (!$insertedId) {
            return $this->fail($minuteModel->errors() ?: 'Error al registrar el acta.');
        }

        $newMinute = $minuteModel->find($insertedId);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Acta publicada exitosamente entre los socios.',
            'data'    => $newMinute
        ]);
    }

    public function deleteMinute($id = null)
    {
        $userData = $this->request->user ?? \App\Filters\JwtAuthFilter::$currentUser ?? null;
        if (!$userData || empty($userData->id)) {
            return $this->failUnauthorized('No autorizado.');
        }

        $minuteModel = new PartnerMinuteModel();
        $minute = $minuteModel->find($id);

        if (!$minute) {
            return $this->failNotFound('Acta no encontrada.');
        }

        // Only author or admin/secretario can delete
        $isAuthor = ((int) $minute['user_id'] === (int) $userData->id);
        $isAdminOrSecretary = in_array($userData->role ?? '', ['admin', 'secretario']);

        if (!$isAuthor && !$isAdminOrSecretary) {
            return $this->failForbidden('No tienes permisos para eliminar esta acta.');
        }

        $minuteModel->delete($id);

        return $this->respond([
            'status'  => 200,
            'message' => 'Acta eliminada exitosamente.'
        ]);
    }

    public function downloadMinute($id = null)
    {
        $minuteModel = new PartnerMinuteModel();
        $minute = $minuteModel->find($id);

        if (!$minute) {
            return $this->failNotFound('Acta no encontrada.');
        }

        // Increment download counter
        $minuteModel->update($id, ['downloads' => ((int) $minute['downloads']) + 1]);

        return $this->respond([
            'status'        => 200,
            'message'       => 'Acceso a documento concedido.',
            'url'           => $minute['file_url'],
            'document_type' => $minute['document_type'],
            'title'         => $minute['title']
        ]);
    }

    public function getDecrees()
    {
        $model = new DecreeModel();
        $search = $this->request->getGet('q');

        $builder = $model->where('is_active', 1)
            ->orderBy('issue_date', 'DESC')
            ->orderBy('created_at', 'DESC');

        if (!empty($search)) {
            $builder->groupStart()
                ->like('title', $search)
                ->orLike('decree_number', $search)
                ->orLike('description', $search)
                ->groupEnd();
        }

        $decrees = $builder->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => $decrees
        ]);
    }

    public function downloadDecree($id = null)
    {
        $model = new DecreeModel();
        $decree = $model->find($id);

        if (!$decree) {
            return $this->failNotFound('Decreto no encontrado.');
        }

        $model->update($id, ['downloads' => ((int) $decree['downloads']) + 1]);

        return $this->respond([
            'status'        => 200,
            'message'       => 'Acceso a documento concedido.',
            'url'           => $decree['file_url'],
            'document_type' => $decree['document_type'],
            'title'         => $decree['title']
        ]);
    }

    public function getNews()
    {
        $model = new PartnerNewsModel();
        $category = $this->request->getGet('category');
        $q = $this->request->getGet('q');

        $builder = $model->where('status', 'published');

        if (!empty($category)) {
            $builder->where('category', $category);
        }

        if (!empty($q)) {
            $builder->groupStart()
                ->like('title', $q)
                ->orLike('summary', $q)
                ->orLike('content', $q)
                ->orLike('author', $q)
                ->groupEnd();
        }

        $news = $builder->orderBy('published_at', 'DESC')
                        ->orderBy('created_at', 'DESC')
                        ->findAll();

        // Distinct categories for quick filtering
        $allCategories = $model->where('status', 'published')
            ->select('category')
            ->distinct()
            ->findAll();
        $categoriesList = array_values(array_filter(array_column($allCategories, 'category')));

        return $this->respond([
            'status' => 200,
            'data'   => [
                'news'       => $news,
                'categories' => $categoriesList,
            ]
        ]);
    }

    public function getNewsDetail($slugOrId = null)
    {
        $model = new PartnerNewsModel();
        $item = is_numeric($slugOrId) ? $model->find($slugOrId) : $model->where('slug', $slugOrId)->first();

        if (!$item || $item['status'] !== 'published') {
            return $this->failNotFound('Comunicado o noticia del boletín no encontrada.');
        }

        // Related news
        $related = $model->where('status', 'published')
            ->where('id !=', $item['id'])
            ->orderBy('published_at', 'DESC')
            ->findAll(3);

        return $this->respond([
            'status' => 200,
            'data'   => [
                'item'    => $item,
                'related' => $related,
            ]
        ]);
    }

    public function getB2BMeetings()
    {
        $model = new \App\Models\B2BMeetingModel();
        $sector = $this->request->getGet('sector');
        $search = $this->request->getGet('q');

        $builder = $model->where('is_active', 1);

        if ($sector && $sector !== 'all') {
            $builder->where('sector', $sector);
        }

        if ($search) {
            $builder->groupStart()
                ->like('title', $search)
                ->orLike('public_summary', $search)
                ->orLike('partner_detailed_report', $search)
                ->orLike('location', $search)
                ->groupEnd();
        }

        $items = $builder->orderBy('meeting_date', 'DESC')->findAll();
        $categoryModel = new \App\Models\CategoryModel();
        $categories = $categoryModel->where('type', 'b2b')->orderBy('name', 'ASC')->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => [
                'meetings'   => $items,
                'categories' => $categories
            ]
        ]);
    }

    public function getB2BMeetingDetail($slugOrId = null)
    {
        $model = new \App\Models\B2BMeetingModel();
        $item = is_numeric($slugOrId) ? $model->find($slugOrId) : $model->where('slug', $slugOrId)->first();

        if (!$item || !$item['is_active']) {
            return $this->failNotFound('Encuentro B2B no encontrado.');
        }

        return $this->respond([
            'status' => 200,
            'data'   => $item
        ]);
    }
}


