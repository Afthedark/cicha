<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */

$routes->get('/', 'Home::index');

// OPTIONS catch-all for CORS preflights
$routes->options('(:any)', static function () {
    $response = service('response');
    $response->setHeader('Access-Control-Allow-Origin', '*');
    $response->setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Authorization, X-API-KEY, Access-Control-Request-Method');
    $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE');
    return $response->setStatusCode(200);
});

// Group: API
$routes->group('api', static function ($routes) {
    
    // Auth Routes
    $routes->group('auth', static function ($routes) {
        $routes->post('login', 'AuthController::login');
        $routes->get('me', 'AuthController::me', ['filter' => 'jwt']);
        $routes->post('profile', 'AuthController::updateProfile', ['filter' => 'jwt']);
    });

    // Public Portal Routes (Visitante)
    $routes->group('public', static function ($routes) {
        $routes->get('home', 'PublicController::getHomeData');
        $routes->get('banners', 'PublicController::getBanners');
        $routes->get('institutional', 'PublicController::getInstitutional');
        $routes->get('articles', 'PublicController::getArticles');
        $routes->get('articles/(:segment)', 'PublicController::getArticleBySlug/$1');
        $routes->get('events', 'PublicController::getEvents');
        $routes->get('members', 'PublicController::getMembers');
        $routes->get('opportunities', 'PublicController::getOpportunities');
        $routes->get('alliances', 'PublicController::getAlliances');
        $routes->get('settings', 'PublicController::getSettings');
        $routes->post('contact', 'PublicController::submitContact');
        $routes->post('apply', 'PublicController::submitApplication');
    });

    // Exclusive Partner Portal Routes (Role: socio, admin, secretario)
    $routes->group('partner', ['filter' => ['jwt', 'role:admin,secretario,socio']], static function ($routes) {
        $routes->get('dashboard', 'PartnerController::dashboard');
        $routes->get('resources', 'PartnerController::getResources');
        $routes->post('resources/(:num)/download', 'PartnerController::downloadResource/$1');
        $routes->get('opportunities', 'PartnerController::getOpportunities');
        $routes->get('benefits', 'PartnerController::getBenefits');
        $routes->get('directory', 'PartnerController::getDirectory');
    });

    // Admin Content Management (Roles: admin, secretario)
    $routes->group('admin', ['filter' => ['jwt', 'role:admin,secretario']], static function ($routes) {
        $routes->get('dashboard', 'Admin\DashboardController::index');

        // Articles / News
        $routes->resource('articles', ['controller' => 'Admin\ArticlesController']);

        // Home Banners / Portadas
        $routes->resource('banners', ['controller' => 'Admin\BannersController']);

        // Events
        $routes->resource('events', ['controller' => 'Admin\EventsController']);

        // Members
        $routes->resource('members', ['controller' => 'Admin\MembersController']);

        // Commercial Opportunities
        $routes->resource('opportunities', ['controller' => 'Admin\OpportunitiesController']);

        // Exclusive Partner Resources & Benefits Management
        $routes->resource('partner-resources', ['controller' => 'Admin\PartnerResourcesController']);
        $routes->resource('partner-benefits', ['controller' => 'Admin\PartnerBenefitsController']);

        // Applications
        $routes->get('applications', 'Admin\ApplicationsController::index');
        $routes->get('applications/(:num)', 'Admin\ApplicationsController::show/$1');
        $routes->put('applications/(:num)', 'Admin\ApplicationsController::update/$1');
        $routes->delete('applications/(:num)', 'Admin\ApplicationsController::delete/$1');

        // Messages
        $routes->get('messages', 'Admin\MessagesController::index');
        $routes->get('messages/(:num)', 'Admin\MessagesController::show/$1');
        $routes->put('messages/(:num)', 'Admin\MessagesController::update/$1');
        $routes->delete('messages/(:num)', 'Admin\MessagesController::delete/$1');

        // Authorities / Board
        $routes->resource('authorities', ['controller' => 'Admin\AuthoritiesController']);

        // Institutional Sections
        $routes->get('institutional', 'Admin\InstitutionalController::index');
        $routes->get('institutional/(:num)', 'Admin\InstitutionalController::show/$1');
        $routes->put('institutional/(:num)', 'Admin\InstitutionalController::update/$1');

        // Alliances
        $routes->resource('alliances', ['controller' => 'Admin\AlliancesController']);

        // Settings
        $routes->get('settings', 'Admin\SettingsController::index');
        $routes->post('settings', 'Admin\SettingsController::updateAll');

        // Uploads
        $routes->post('upload', 'Admin\UploadController::uploadImage');
    });

    // Admin-Only System Management (Role: admin only - Strict User Management)
    $routes->group('admin', ['filter' => ['jwt', 'role:admin']], static function ($routes) {
        // User & Role Management (Strict Admin only)
        $routes->resource('users', ['controller' => 'Admin\UsersController']);
    });
});
