<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class RolesAndPartnersSeeder extends Seeder
{
    public function run()
    {
        $now = date('Y-m-d H:i:s');

        // 1. Secretary User (Role: secretario)
        $existingSec = $this->db->table('users')->where('email', 'secretaria@cicha.com.ar')->get()->getRowArray();
        if (!$existingSec) {
            $this->db->table('users')->insert([
                'name'       => 'Lic. Nikolaos Georgiou (Secretaría)',
                'email'      => 'secretaria@cicha.com.ar',
                'password'   => password_hash('sec123', PASSWORD_BCRYPT),
                'role'       => 'secretario',
                'avatar'     => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
                'status'     => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // 2. Partner User (Role: socio, linked to Member Hellenic Shipping & Logistics)
        $existingSocio = $this->db->table('users')->where('email', 'socio@cicha.com.ar')->get()->getRowArray();
        if (!$existingSocio) {
            $this->db->table('users')->insert([
                'name'       => 'Hellenic Shipping & Logistics (Socio Activo)',
                'email'      => 'socio@cicha.com.ar',
                'password'   => password_hash('socio123', PASSWORD_BCRYPT),
                'role'       => 'socio',
                'member_id'  => 1, // Hellenic Shipping
                'avatar'     => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
                'status'     => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // 3. Partner Resources (Exclusive Documents)
        $resources = [
            [
                'title'       => 'Informe Sectorial 2026: Oportunidades del Sector Agroalimentario Argentino en Grecia',
                'category'    => 'informe_mercado',
                'description' => 'Análisis exhaustivo sobre aranceles de importación en la UE, canales de distribución retail en Atenas y Salónica, y demanda de aceites, granos y legumbres.',
                'file_url'    => 'https://cicha.com.ar/docs/informe_agroalimentario_grecia_2026.pdf',
                'file_type'   => 'PDF',
                'file_size'   => '3.8 MB',
                'downloads'   => 42,
                'is_active'   => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'title'       => 'Guía Jurídica y Tributaria: Tratado de Doble Imposición e Inversiones Grecia - Argentina',
                'category'    => 'guia_legal',
                'description' => 'Manual práctico redactado por la Comisión Legal de CICHA sobre estructuración societaria, repatriación de dividendos y ventajas fiscales para empresas socias.',
                'file_url'    => 'https://cicha.com.ar/docs/guia_tributaria_bilateral_cicha.pdf',
                'file_type'   => 'PDF',
                'file_size'   => '2.1 MB',
                'downloads'   => 68,
                'is_active'   => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'title'       => 'Minuta Oficial: Sesión Plenaria EUROCAMARA Argentina y Proyectos EEN 2026',
                'category'    => 'minuta_asamblea',
                'description' => 'Resumen ejecutivo de acuerdos arancelarios, fondos de innovación verde de la Unión Europea y cronograma de misiones comerciales conjuntas.',
                'file_url'    => 'https://cicha.com.ar/docs/minuta_plenaria_eurocamara_2026.pdf',
                'file_type'   => 'PDF',
                'file_size'   => '1.4 MB',
                'downloads'   => 29,
                'is_active'   => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'title'       => 'Circular de Comercio Exterior: Normativas Sanitarias y Fitosanitarias para Ingreso al Mercado Europeo',
                'category'    => 'circular_comercial',
                'description' => 'Actualización de certificaciones requeridas por la Comisión Europea para exportadores de alimentos y bebidas del Cono Sur.',
                'file_url'    => 'https://cicha.com.ar/docs/circular_sanitaria_ue_2026.pdf',
                'file_type'   => 'PDF',
                'file_size'   => '980 KB',
                'downloads'   => 55,
                'is_active'   => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ]
        ];

        foreach ($resources as $res) {
            $this->db->table('partner_resources')->insert($res);
        }

        // 4. Partner Benefits
        $benefits = [
            [
                'title'                => '25% de Descuento en Fletes y Logística Marítima Grecia - Cono Sur',
                'provider_company'     => 'Hellenic Shipping & Logistics',
                'category'             => 'Logística & Transporte',
                'discount_description' => 'Tarifa preferencial exclusiva para empresas socias de CICHA en fletes marítimos consolidados y desaduanamiento portuario en El Pireo y Buenos Aires.',
                'how_to_claim'         => 'Presentar credencial de socio activo o solicitar código de bonificación a la Secretaría de CICHA.',
                'logo_url'             => 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=300&q=80',
                'valid_until'          => date('Y-m-d', strtotime('+365 days')),
                'is_active'            => 1,
                'created_at'           => $now,
                'updated_at'           => $now,
            ],
            [
                'title'                => 'Pases VIP Gratuitos para Foros Económicos y Rondas de EUROCAMARA',
                'provider_company'     => 'EUROCAMARA Argentina',
                'category'             => 'Networking Internacional',
                'discount_description' => 'Acceso sin cargo a mesas redondas y rondas B2B organizadas por las 32 cámaras binacionales de EUROCAMARA y UCCEB.',
                'how_to_claim'         => 'Registro anticipado en el Portal de Socios de CICHA hasta 72 hs antes del evento.',
                'logo_url'             => 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=300&q=80',
                'valid_until'          => date('Y-m-d', strtotime('+365 days')),
                'is_active'            => 1,
                'created_at'           => $now,
                'updated_at'           => $now,
            ],
            [
                'title'                => '1ª Consulta de Asesoría Legal Internacional Sin Cargo',
                'provider_company'     => 'Constantinou Legal & Tax Advisory',
                'category'             => 'Servicios Profesionales',
                'discount_description' => 'Diagnóstico preliminar gratuito en estructuración de inversiones bilaterales, contratos de distribución y registro de marcas en la Unión Europea.',
                'how_to_claim'         => 'Solicitar turno indicando número de socio CICHA a info@constantinou-law.com.',
                'logo_url'             => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80',
                'valid_until'          => date('Y-m-d', strtotime('+365 days')),
                'is_active'            => 1,
                'created_at'           => $now,
                'updated_at'           => $now,
            ]
        ];

        foreach ($benefits as $ben) {
            $this->db->table('partner_benefits')->insert($ben);
        }
    }
}
