<?php

namespace App\Controllers;

use App\Models\PartnerResourceModel;
use App\Models\PartnerBenefitModel;
use App\Models\CommercialOpportunityModel;
use App\Models\MemberModel;
use App\Models\EventModel;
use App\Models\CategoryModel;
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

        $memberInfo = null;
        if (!empty($userData->member_id)) {
            $memberInfo = $memberModel->find($userData->member_id);
        }

        $latestResources = $resourceModel->where('is_active', 1)->orderBy('created_at', 'DESC')->findAll(4);
        $activeBenefits  = $benefitModel->where('is_active', 1)->orderBy('created_at', 'DESC')->findAll(4);
        $vipOpportunities= $oppModel->where('status', 'open')->orderBy('created_at', 'DESC')->findAll(4);
        $upcomingEvents  = $eventModel->where('status', 'upcoming')->orderBy('event_date', 'ASC')->findAll(3);

        $stats = [
            'total_resources'     => $resourceModel->where('is_active', 1)->countAllResults(),
            'total_benefits'      => $benefitModel->where('is_active', 1)->countAllResults(),
            'total_opportunities' => $oppModel->where('status', 'open')->countAllResults(),
            'total_members'       => $memberModel->where('status', 'active')->countAllResults(),
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

        $members = $builder->orderBy('company_name', 'ASC')->findAll();

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
}
