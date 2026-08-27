<?php

namespace App\Controllers\Admin;

use App\Models\ArticleModel;
use App\Models\EventModel;
use App\Models\MemberModel;
use App\Models\CommercialOpportunityModel;
use App\Models\MembershipApplicationModel;
use App\Models\ContactMessageModel;
use CodeIgniter\RESTful\ResourceController;

class DashboardController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $articleModel     = new ArticleModel();
        $eventModel       = new EventModel();
        $memberModel      = new MemberModel();
        $opportunityModel = new CommercialOpportunityModel();
        $applicationModel = new MembershipApplicationModel();
        $messageModel     = new ContactMessageModel();

        $stats = [
            'total_articles'       => $articleModel->countAllResults(),
            'total_events'         => $eventModel->countAllResults(),
            'total_members'        => $memberModel->countAllResults(),
            'total_opportunities'  => $opportunityModel->countAllResults(),
            'pending_applications' => $applicationModel->where('status', 'pending')->countAllResults(),
            'unread_messages'      => $messageModel->where('is_read', 0)->countAllResults(),
        ];

        $recentApplications = $applicationModel->orderBy('created_at', 'DESC')->findAll(5);
        $recentMessages     = $messageModel->orderBy('created_at', 'DESC')->findAll(5);
        $recentArticles     = $articleModel->orderBy('created_at', 'DESC')->findAll(5);

        return $this->respond([
            'status' => 200,
            'data'   => [
                'stats'               => $stats,
                'recent_applications' => $recentApplications,
                'recent_messages'     => $recentMessages,
                'recent_articles'     => $recentArticles,
            ]
        ]);
    }
}
