<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePartnerNewsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 10,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'category' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'default'    => 'Comunicado Oficial',
            ],
            'title' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
            ],
            'slug' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'unique'     => true,
            ],
            'summary' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'content' => [
                'type' => 'LONGTEXT',
            ],
            'image_url' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
            ],
            'author' => [
                'type'       => 'VARCHAR',
                'constraint' => 150,
                'default'    => 'Comisión Directiva CICHA',
            ],
            'published_at' => [
                'type' => 'DATE',
                'null' => true,
            ],
            'is_featured' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 0,
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['published', 'draft', 'archived'],
                'default'    => 'published',
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('category');
        $this->forge->createTable('partner_news', true);

        // Seed initial partner news items
        $now = date('Y-m-d H:i:s');
        $today = date('Y-m-d');
        $seeds = [
            [
                'category'     => 'Comunicado Oficial',
                'title'        => 'Nueva Guía de Oportunidades Comerciales Bilaterales Argentina-Grecia 2026',
                'slug'         => 'nueva-guia-oportunidades-comerciales-bilaterales-2026',
                'summary'      => 'Ponemos a disposición de nuestros asociados el informe estratégico con sectores priorizados para el comercio e inversión bilateral.',
                'content'      => "Estimados asociados,\n\nDesde la Cámara de Industria y Comercio Heleno Argentina nos complace presentar la nueva edición de la Guía de Oportunidades Comerciales Bilaterales 2026. Este documento consolida los análisis arancelarios, regímenes de fomento y contactos estratégicos con cámaras homólogas en Atenas y Tesalónica.\n\nLos sectores con mayor dinamismo proyectado para este semestre comprenden:\n1. Agroindustria & Alimentos Premium (Aceite de oliva, vinos, cítricos y granos).\n2. Tecnología, Software & Servicios Basados en el Conocimiento.\n3. Energía Renovable y Logística Marítima.\n\nInvitamos a las empresas socias a contactarse con nuestra comisión de comercio exterior para coordinar reuniones directas.",
                'image_url'    => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
                'author'       => 'Comisión Directiva CICHA',
                'published_at' => $today,
                'is_featured'  => 1,
                'status'       => 'published',
                'created_at'   => $now,
                'updated_at'   => $now,
            ],
            [
                'category'     => 'Acuerdos & Alianzas',
                'title'        => 'Ampliación de Beneficios en Logística y Transporte Internacional para Socios',
                'slug'         => 'ampliacion-beneficios-logistica-transporte-internacional',
                'summary'      => 'Se formalizó el nuevo acuerdo de cooperación que otorga tarifas preferenciales en fletes marítimos y aéreos hacia el Mediterráneo.',
                'content'      => "Informamos a la comunidad de socios que se ha ratificado el convenio de asistencia logística internacional. A través de este marco, las empresas socias activas podrán acceder a bonificaciones exclusivas en despachos de aduana y fletes hacia puertos helénicos.\n\nPara solicitar la constancia de membresía y acceder a las tarifas corporativas, consulte la sección de Beneficios o comuníquese con secretaría.",
                'image_url'    => 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
                'author'       => 'Secretaría Ejecutiva CICHA',
                'published_at' => date('Y-m-d', strtotime('-3 days')),
                'is_featured'  => 0,
                'status'       => 'published',
                'created_at'   => $now,
                'updated_at'   => $now,
            ],
            [
                'category'     => 'Reunión de Directorio',
                'title'        => 'Convocatoria a Sesión de Directorio y Presentación de Balances de Comercio',
                'slug'         => 'convocatoria-sesion-directorio-balances-comercio',
                'summary'      => 'Convocatoria formal a todos los miembros directivos y representantes de empresas socias para la próxima sesión ordinaria.',
                'content'      => "Se convoca a las autoridades y representantes acreditados a la reunión de directorio para el análisis de los avances en misiones comerciales bilaterales, revisión de convenios institucionales y bienvenida a los nuevos socios incorporados durante el último trimestre.\n\nEl orden del día completo y el material de lectura previo se encuentran disponibles en la sección de Actas y Documentos del portal.",
                'image_url'    => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
                'author'       => 'Presidencia CICHA',
                'published_at' => date('Y-m-d', strtotime('-7 days')),
                'is_featured'  => 0,
                'status'       => 'published',
                'created_at'   => $now,
                'updated_at'   => $now,
            ]
        ];

        $db = \Config\Database::connect();
        $db->table('partner_news')->insertBatch($seeds);
    }

    public function down()
    {
        $this->forge->dropTable('partner_news', true);
    }
}
