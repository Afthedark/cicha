<?php

namespace App\Controllers;

use App\Models\SettingModel;
use App\Models\InstitutionalSectionModel;
use App\Models\AuthorityModel;
use App\Models\AllianceModel;
use App\Models\CategoryModel;
use App\Models\ArticleModel;
use App\Models\EventModel;
use App\Models\MemberModel;
use App\Models\CommercialOpportunityModel;
use App\Models\MembershipApplicationModel;
use App\Models\ContactMessageModel;
use CodeIgniter\RESTful\ResourceController;

class PublicController extends ResourceController
{
    protected $format = 'json';

    public function getHomeData()
    {
        $settingModel       = new SettingModel();
        $sectionModel       = new InstitutionalSectionModel();
        $allianceModel      = new AllianceModel();
        $articleModel       = new ArticleModel();
        $eventModel         = new EventModel();
        $memberModel        = new MemberModel();
        $opportunityModel   = new CommercialOpportunityModel();

        // Convert settings key-value pairs
        $rawSettings = $settingModel->findAll();
        $settings = [];
        foreach ($rawSettings as $s) {
            $settings[$s['key_name']] = $s['value_text'];
        }

        $mision = $sectionModel->where('section_key', 'mision')->where('is_active', 1)->first();
        $historia = $sectionModel->where('section_key', 'historia')->where('is_active', 1)->first();
        $alliances = $allianceModel->where('is_active', 1)->orderBy('order_num', 'ASC')->findAll();
        
        $featuredArticles = $articleModel->getWithCategory();
        $featuredArticles = array_slice($featuredArticles, 0, 3);

        $upcomingEvents = $eventModel->where('status', 'upcoming')
            ->where('event_date >=', date('Y-m-d H:i:s'))
            ->orderBy('event_date', 'ASC')
            ->findAll(4);

        $featuredMembers = $memberModel->where('is_featured', 1)
            ->where('status', 'active')
            ->findAll(8);

        $opportunities = $opportunityModel->where('status', 'open')
            ->orderBy('created_at', 'DESC')
            ->findAll(4);

        return $this->respond([
            'status' => 200,
            'data'   => [
                'settings'          => $settings,
                'mision'            => $mision,
                'historia'          => $historia,
                'alliances'         => $alliances,
                'featured_articles' => $featuredArticles,
                'upcoming_events'   => $upcomingEvents,
                'featured_members'  => $featuredMembers,
                'opportunities'     => $opportunities,
                'stats' => [
                    'years_active'     => date('Y') - 1989,
                    'binational_cams'  => 32,
                    'een_coverage'     => '60+ países',
                    'eurocamara_since' => '2017'
                ]
            ]
        ]);
    }

    public function getInstitutional()
    {
        $sectionModel   = new InstitutionalSectionModel();
        $authorityModel = new AuthorityModel();
        $allianceModel  = new AllianceModel();

        $sections = $sectionModel->where('is_active', 1)->orderBy('order_num', 'ASC')->findAll();
        $authorities = $authorityModel->where('is_active', 1)->orderBy('order_num', 'ASC')->findAll();
        $alliances = $allianceModel->where('is_active', 1)->orderBy('order_num', 'ASC')->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => [
                'sections'    => $sections,
                'authorities' => $authorities,
                'alliances'   => $alliances,
            ]
        ]);
    }

    public function getArticles()
    {
        $articleModel = new ArticleModel();
        $categorySlug = $this->request->getGet('category');
        $search       = $this->request->getGet('q');

        $builder = $articleModel->db->table('articles')
            ->select('articles.*, categories.name as category_name, categories.slug as category_slug')
            ->join('categories', 'categories.id = articles.category_id', 'left')
            ->where('articles.status', 'published');

        if ($categorySlug) {
            $builder->where('categories.slug', $categorySlug);
        }

        if ($search) {
            $builder->groupStart()
                ->like('articles.title', $search)
                ->orLike('articles.summary', $search)
                ->orLike('articles.content', $search)
                ->groupEnd();
        }

        $articles = $builder->orderBy('articles.published_at', 'DESC')->get()->getResultArray();
        $categoryModel = new CategoryModel();
        $categories = $categoryModel->where('type', 'news')->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => [
                'articles'   => $articles,
                'categories' => $categories
            ]
        ]);
    }

    public function getArticleBySlug($slug = null)
    {
        $articleModel = new ArticleModel();
        $article = $articleModel->db->table('articles')
            ->select('articles.*, categories.name as category_name, categories.slug as category_slug')
            ->join('categories', 'categories.id = articles.category_id', 'left')
            ->where('articles.slug', $slug)
            ->where('articles.status', 'published')
            ->get()->getRowArray();

        if (!$article) {
            return $this->failNotFound('Artículo no encontrado.');
        }

        // Related articles
        $related = $articleModel->where('id !=', $article['id'])
            ->where('status', 'published')
            ->orderBy('published_at', 'DESC')
            ->findAll(3);

        return $this->respond([
            'status' => 200,
            'data'   => [
                'article' => $article,
                'related' => $related
            ]
        ]);
    }

    public function getEvents()
    {
        $eventModel = new EventModel();
        $filter = $this->request->getGet('filter'); // 'upcoming', 'past', 'all'

        $builder = $eventModel->db->table('events')
            ->select('events.*, categories.name as category_name')
            ->join('categories', 'categories.id = events.category_id', 'left');

        if ($filter === 'past') {
            $builder->where('events.event_date <', date('Y-m-d H:i:s'));
            $builder->orderBy('events.event_date', 'DESC');
        } else {
            // default upcoming
            $builder->where('events.event_date >=', date('Y-m-d H:i:s'));
            $builder->orderBy('events.event_date', 'ASC');
        }

        $events = $builder->get()->getResultArray();

        return $this->respond([
            'status' => 200,
            'data'   => $events
        ]);
    }

    public function getMembers()
    {
        $memberModel = new MemberModel();
        $sector = $this->request->getGet('sector');
        $search = $this->request->getGet('q');

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

        $members = $builder->orderBy('is_featured', 'DESC')
            ->orderBy('company_name', 'ASC')
            ->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => $members
        ]);
    }

    public function getOpportunities()
    {
        $opportunityModel = new CommercialOpportunityModel();
        $type = $this->request->getGet('type');

        $builder = $opportunityModel->where('status', 'open');

        if ($type) {
            $builder->where('type', $type);
        }

        $opportunities = $builder->orderBy('created_at', 'DESC')->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => $opportunities
        ]);
    }

    public function getAlliances()
    {
        $allianceModel = new AllianceModel();
        $alliances = $allianceModel->where('is_active', 1)->orderBy('order_num', 'ASC')->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => $alliances
        ]);
    }

    public function getSettings()
    {
        $settingModel = new SettingModel();
        $rawSettings = $settingModel->findAll();
        $settings = [];
        foreach ($rawSettings as $s) {
            $settings[$s['key_name']] = $s['value_text'];
        }

        return $this->respond([
            'status' => 200,
            'data'   => $settings
        ]);
    }

    public function submitContact()
    {
        $rules = [
            'name'    => 'required|min_length[3]',
            'email'   => 'required|valid_email',
            'subject' => 'required|min_length[3]',
            'message' => 'required|min_length[10]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $contactModel = new ContactMessageModel();
        $data = [
            'name'       => $this->request->getVar('name'),
            'email'      => $this->request->getVar('email'),
            'phone'      => $this->request->getVar('phone') ?? '',
            'subject'    => $this->request->getVar('subject'),
            'message'    => $this->request->getVar('message'),
            'is_read'    => 0,
            'status'     => 'new',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        $contactModel->insert($data);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Mensaje recibido con éxito. Nos pondremos en contacto a la brevedad.',
        ]);
    }

    public function submitApplication()
    {
        $rules = [
            'company_name' => 'required|min_length[2]',
            'contact_name' => 'required|min_length[3]',
            'email'        => 'required|valid_email',
            'phone'        => 'required|min_length[6]',
            'sector'       => 'required',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $appModel = new MembershipApplicationModel();
        $data = [
            'company_name' => $this->request->getVar('company_name'),
            'contact_name' => $this->request->getVar('contact_name'),
            'contact_role' => $this->request->getVar('contact_role') ?? '',
            'email'        => $this->request->getVar('email'),
            'phone'        => $this->request->getVar('phone'),
            'cuit_rut'     => $this->request->getVar('cuit_rut') ?? '',
            'sector'       => $this->request->getVar('sector'),
            'website'      => $this->request->getVar('website') ?? '',
            'interests'    => is_array($this->request->getVar('interests')) ? implode(', ', $this->request->getVar('interests')) : ($this->request->getVar('interests') ?? ''),
            'comments'     => $this->request->getVar('comments') ?? '',
            'status'       => 'pending',
            'created_at'   => date('Y-m-d H:i:s'),
            'updated_at'   => date('Y-m-d H:i:s'),
        ];

        $appModel->insert($data);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Solicitud de afiliación enviada con éxito. La Comisión Directiva revisará su presentación.',
        ]);
    }
}
