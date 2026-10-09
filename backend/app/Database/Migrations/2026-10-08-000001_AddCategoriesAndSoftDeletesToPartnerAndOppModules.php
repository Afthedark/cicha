<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddCategoriesAndSoftDeletesToPartnerAndOppModules extends Migration
{
    public function up()
    {
        // 1. Update partner_resources
        $resourceFields = [];
        if (!$this->db->fieldExists('deleted_at', 'partner_resources')) {
            $resourceFields['deleted_at'] = [
                'type' => 'DATETIME',
                'null' => true,
                'after' => 'updated_at',
            ];
        }
        if (!$this->db->fieldExists('categories', 'partner_resources')) {
            $resourceFields['categories'] = [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'category',
            ];
        }
        if (!empty($resourceFields)) {
            $this->forge->addColumn('partner_resources', $resourceFields);
        }

        // Migrate existing partner_resources category to categories JSON
        $existingResources = $this->db->table('partner_resources')->get()->getResultArray();
        foreach ($existingResources as $res) {
            if (empty($res['categories']) && !empty($res['category'])) {
                $cats = array_values(array_filter(array_map('trim', explode(',', $res['category']))));
                if (empty($cats)) {
                    $cats = [$res['category']];
                }
                $this->db->table('partner_resources')
                    ->where('id', $res['id'])
                    ->update(['categories' => json_encode($cats, JSON_UNESCAPED_UNICODE)]);
            }
        }

        // 2. Update partner_news
        $newsFields = [];
        if (!$this->db->fieldExists('deleted_at', 'partner_news')) {
            $newsFields['deleted_at'] = [
                'type' => 'DATETIME',
                'null' => true,
                'after' => 'updated_at',
            ];
        }
        if (!$this->db->fieldExists('categories', 'partner_news')) {
            $newsFields['categories'] = [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'category',
            ];
        }
        if (!empty($newsFields)) {
            $this->forge->addColumn('partner_news', $newsFields);
        }

        // Migrate existing partner_news category to categories JSON
        $existingNews = $this->db->table('partner_news')->get()->getResultArray();
        foreach ($existingNews as $nw) {
            if (empty($nw['categories']) && !empty($nw['category'])) {
                $cats = array_values(array_filter(array_map('trim', explode(',', $nw['category']))));
                if (empty($cats)) {
                    $cats = [$nw['category']];
                }
                $this->db->table('partner_news')
                    ->where('id', $nw['id'])
                    ->update(['categories' => json_encode($cats, JSON_UNESCAPED_UNICODE)]);
            }
        }

        // 3. Update commercial_opportunities
        $oppFields = [];
        if (!$this->db->fieldExists('deleted_at', 'commercial_opportunities')) {
            $oppFields['deleted_at'] = [
                'type' => 'DATETIME',
                'null' => true,
                'after' => 'updated_at',
            ];
        }
        if (!$this->db->fieldExists('categories', 'commercial_opportunities')) {
            $oppFields['categories'] = [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'sector',
            ];
        }
        if (!empty($oppFields)) {
            $this->forge->addColumn('commercial_opportunities', $oppFields);
        }

        // Migrate existing commercial_opportunities sector to categories JSON
        $existingOpps = $this->db->table('commercial_opportunities')->get()->getResultArray();
        foreach ($existingOpps as $opp) {
            if (empty($opp['categories']) && !empty($opp['sector'])) {
                $cats = array_values(array_filter(array_map('trim', explode(',', $opp['sector']))));
                if (empty($cats)) {
                    $cats = [$opp['sector']];
                }
                $this->db->table('commercial_opportunities')
                    ->where('id', $opp['id'])
                    ->update(['categories' => json_encode($cats, JSON_UNESCAPED_UNICODE)]);
            }
        }

        // 4. Seed default categories in categories table
        $now = date('Y-m-d H:i:s');
        $moduleCategories = [
            'resources' => [
                'Informes de Mercado',
                'Regulaciones & Aduanas',
                'Estadísticas Bilaterales',
                'Guías de Inversión',
                'Presentaciones Corporativas',
                'Documentos Institucionales',
            ],
            'partner_news' => [
                'Comunicado Oficial',
                'Comercio Bilateral',
                'Acuerdos & Alianzas',
                'Reunión de Directorio',
                'Análisis & Normativas',
                'Eventos & Encuentros',
            ],
            'opportunities' => [
                'Agroalimentos & Bebidas',
                'Tecnología & Software',
                'Logística & Puertos',
                'Energía Renovable',
                'Turismo & Hotelería',
                'Inversiones & Bienes Raíces',
                'Servicios Profesionales',
                'Comercio Exterior',
            ],
        ];

        foreach ($moduleCategories as $type => $names) {
            foreach ($names as $name) {
                $baseSlug = clean_slug($name);
                $slug = $baseSlug;

                $existing = $this->db->table('categories')
                    ->where('slug', $slug)
                    ->get()
                    ->getRowArray();

                if ($existing) {
                    if ($existing['type'] !== $type) {
                        $slug = $baseSlug . '-' . $type;
                        $existingTyped = $this->db->table('categories')
                            ->where('slug', $slug)
                            ->get()
                            ->getRowArray();
                        if (!$existingTyped) {
                            $this->db->table('categories')->insert([
                                'name'       => $name,
                                'slug'       => $slug,
                                'type'       => $type,
                                'created_at' => $now,
                            ]);
                        }
                    }
                } else {
                    $this->db->table('categories')->insert([
                        'name'       => $name,
                        'slug'       => $slug,
                        'type'       => $type,
                        'created_at' => $now,
                    ]);
                }
            }
        }
    }

    public function down()
    {
        if ($this->db->fieldExists('deleted_at', 'partner_resources')) {
            $this->forge->dropColumn('partner_resources', 'deleted_at');
        }
        if ($this->db->fieldExists('categories', 'partner_resources')) {
            $this->forge->dropColumn('partner_resources', 'categories');
        }

        if ($this->db->fieldExists('deleted_at', 'partner_news')) {
            $this->forge->dropColumn('partner_news', 'deleted_at');
        }
        if ($this->db->fieldExists('categories', 'partner_news')) {
            $this->forge->dropColumn('partner_news', 'categories');
        }

        if ($this->db->fieldExists('deleted_at', 'commercial_opportunities')) {
            $this->forge->dropColumn('commercial_opportunities', 'deleted_at');
        }
        if ($this->db->fieldExists('categories', 'commercial_opportunities')) {
            $this->forge->dropColumn('commercial_opportunities', 'categories');
        }
    }
}
