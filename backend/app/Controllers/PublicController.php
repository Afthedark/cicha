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
use App\Models\BannerModel;
use App\Models\BlogModel;
use App\Models\PhotoAlbumModel;
use App\Models\GalleryPhotoModel;
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
        $bannerModel        = new BannerModel();

        // Convert settings key-value pairs
        $rawSettings = $settingModel->findAll();
        $settings = [];
        foreach ($rawSettings as $s) {
            $settings[$s['key_name']] = $s['value_text'];
        }

        $banners = $bannerModel->where('is_active', 1)->orderBy('order_num', 'ASC')->orderBy('id', 'DESC')->findAll();
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
                'banners'               => $banners,
                'settings'              => $settings,
                'mision'                => $mision,
                'historia'              => $historia,
                'alliances'             => $alliances,
                'featured_articles'     => $featuredArticles,
                'upcoming_events'       => $upcomingEvents,
                'featured_members'      => $featuredMembers,
                'featured_opportunities'=> $opportunities,
                'stats' => [
                    'years_active'     => date('Y') - 1989,
                    'binational_cams'  => 32,
                    'een_coverage'     => '60+ países',
                    'eurocamara_since' => '2017'
                ]
            ]
        ]);
    }

    public function getBanners()
    {
        $bannerModel = new BannerModel();
        $banners = $bannerModel->where('is_active', 1)->orderBy('order_num', 'ASC')->orderBy('id', 'DESC')->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => $banners,
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
        $input = $this->request->getJSON(true) ?: $this->request->getRawInput() ?: $this->request->getVar();
        $applicantType = $input['applicant_type'] ?? 'empresa';

        $rules = [
            'email'            => 'required|valid_email',
            'phone'            => 'required|min_length[5]',
            'company_logo_url' => 'required|min_length[5]',
        ];

        $messages = [
            'company_logo_url' => [
                'required' => 'El logotipo de la empresa o emprendimiento personal es obligatorio.',
                'min_length' => 'Debe adjuntar una imagen válida para el logotipo o distintivo.',
            ],
        ];

        if ($applicantType === 'empresa') {
            $rules['company_name'] = 'required|min_length[2]';
            $rules['contact_name'] = 'required|min_length[2]';
        } else {
            $rules['contact_name'] = 'required|min_length[2]';
        }

        if (!$this->validate($rules, $messages)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $appModel = new MembershipApplicationModel();
        
        $data = [
            'applicant_type'          => $applicantType,
            'company_name'            => $input['company_name'] ?? ($input['contact_name'] ?? 'Persona Física'),
            'business_name'           => $input['business_name'] ?? '',
            'company_logo_url'        => $input['company_logo_url'] ?? '',
            'contact_name'            => $input['contact_name'] ?? '',
            'contact_role'            => $input['contact_role'] ?? '',
            'birth_date'              => !empty($input['birth_date']) ? $input['birth_date'] : null,
            'doc_type'                => $input['doc_type'] ?? '',
            'doc_number'              => $input['doc_number'] ?? '',
            'nationality'             => $input['nationality'] ?? '',
            'address'                 => $input['address'] ?? '',
            'profession'              => $input['profession'] ?? '',
            'email'                   => $input['email'],
            'phone'                   => $input['phone'],
            'cuit_rut'                => $input['cuit_rut'] ?? '',
            'sector'                  => $input['sector'] ?? 'General / Otro',
            'website'                 => $input['website'] ?? '',
            'referral_source'         => $input['referral_source'] ?? '',
            'referral_socio_name'     => $input['referral_socio_name'] ?? '',
            'interests'               => is_array($input['interests'] ?? null) ? implode(', ', $input['interests']) : ($input['interests'] ?? ''),
            'additional_services'     => is_array($input['additional_services'] ?? null) ? implode(' | ', array_filter($input['additional_services'])) : ($input['additional_services'] ?? ''),
            'payment_preference'      => $input['payment_preference'] ?? 'anual',
            'sponsor_1_name'          => $input['sponsor_1_name'] ?? '',
            'sponsor_2_name'          => $input['sponsor_2_name'] ?? '',
            'greece_relation_type'    => is_array($input['greece_relation_type'] ?? null) ? implode(', ', $input['greece_relation_type']) : ($input['greece_relation_type'] ?? ''),
            'greece_relation_details' => $input['greece_relation_details'] ?? '',
            'comments'                => $input['comments'] ?? '',
            'status'                  => 'pending',
            'internal_verdict'        => 'pending',
        ];

        $appModel->insert($data);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Solicitud de afiliación registrada con éxito. La Comisión Directiva de CICHA evaluará su presentación.',
        ]);
    }

    public function getBlogs()
    {
        $blogModel = new BlogModel();
        $category  = $this->request->getGet('category');
        $search    = $this->request->getGet('q');

        $blogs = $blogModel->getPublished($category, $search);

        // Extract available categories
        $allCategories = $blogModel->where('status', 'published')
            ->select('category')
            ->distinct()
            ->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => [
                'blogs'      => $blogs,
                'categories' => array_map(function($c) { return $c['category']; }, $allCategories),
            ]
        ]);
    }

    public function getBlogBySlug($slug = null)
    {
        $blogModel = new BlogModel();
        $blog = $blogModel->where('slug', $slug)
            ->where('status', 'published')
            ->first();

        if (!$blog) {
            return $this->failNotFound('Artículo de blog no encontrado');
        }

        // Get related blogs
        $related = $blogModel->where('status', 'published')
            ->where('id !=', $blog['id'])
            ->orderBy('published_at', 'DESC')
            ->limit(3)
            ->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => [
                'blog'    => $blog,
                'related' => $related,
            ]
        ]);
    }

    public function getGallery()
    {
        $albumModel = new PhotoAlbumModel();
        $photoModel = new GalleryPhotoModel();

        $category = $this->request->getGet('category');
        $builder = $albumModel->where('is_active', 1);

        if (!empty($category) && $category !== 'all') {
            $builder->where('category', $category);
        }

        $albums = $builder->orderBy('order_num', 'ASC')->orderBy('event_date', 'DESC')->findAll();

        foreach ($albums as &$album) {
            $album['photos'] = $photoModel->where('album_id', $album['id'])->orderBy('order_num', 'ASC')->findAll();
            $album['photos_count'] = count($album['photos']);
        }

        // Distinct categories for filter
        $categories = $albumModel->where('is_active', 1)->select('category')->distinct()->findAll();

        // Also flatten all photos for general feed / masonry
        $allPhotos = $photoModel->db->table('gallery_photos')
            ->select('gallery_photos.*, photo_albums.title as album_title, photo_albums.category as album_category, photo_albums.event_date')
            ->join('photo_albums', 'photo_albums.id = gallery_photos.album_id')
            ->where('photo_albums.is_active', 1)
            ->orderBy('photo_albums.event_date', 'DESC')
            ->get()->getResultArray();

        return $this->respond([
            'status' => 200,
            'data'   => [
                'albums'     => $albums,
                'all_photos' => $allPhotos,
                'categories' => array_map(function($c) { return $c['category']; }, $categories),
            ]
        ]);
    }

    public function getAlbumBySlug($slug = null)
    {
        $albumModel = new PhotoAlbumModel();
        $photoModel = new GalleryPhotoModel();

        $album = $albumModel->where('slug', $slug)->where('is_active', 1)->first();
        if (!$album) {
            return $this->failNotFound('Álbum de fotos no encontrado');
        }

        $album['photos'] = $photoModel->where('album_id', $album['id'])->orderBy('order_num', 'ASC')->findAll();
        $album['photos_count'] = count($album['photos']);

        return $this->respond([
            'status' => 200,
            'data'   => $album,
        ]);
    }
}
