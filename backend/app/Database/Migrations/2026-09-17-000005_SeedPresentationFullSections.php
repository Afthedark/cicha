<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SeedPresentationFullSections extends Migration
{
    public function up()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('institutional_sections');

        $sections = [
            // 1. Orígenes & Fundación de C.I.C.H.A. (Tarjeta Destacada Onassis & Decretos)
            [
                'section_key' => 'presentacion_historia',
                'page_target' => 'presentacion',
                'title'       => 'Orígenes & Fundación de C.I.C.H.A.',
                'subtitle'    => 'Legado Histórico 1940',
                'content'     => "La Cámara de Industria y Comercio Helénico-Argentina – C.I.C.H.A. fue fundada a principios de la década de 1940 por Aristóteles Onassis y los entonces destacados empresarios griegos de Argentina.\n\nEn 1988 cobra un nuevo impulso y adquiere el pleno reconocimiento oficial de ambos países, manteniéndose desde entonces activa con una participación creciente en los flujos de comercio e inversiones bilaterales.",
                'icon_name'   => 'Building2',
                'order_num'   => 1,
                'is_active'   => 1,
            ],

            // 2. Marco Institucional y Trayectoria Bilateral (Documento Oficial Completo)
            [
                'section_key' => 'presentacion_marco',
                'page_target' => 'presentacion',
                'title'       => 'Marco Institucional y Trayectoria Bilateral',
                'subtitle'    => 'Documento de Presentación de la Cámara',
                'content'     => "La Cámara de Industria y Comercio Helénico-Argentina – C.I.C.H.A - fue fundada a principios de la década de 1940 por Aristóteles Onassis y los entonces destacados empresarios griegos de Argentina. En 1988, cobra un nuevo impulso y adquiere el reconocimiento, como tal, de ambos países. Desde entonces se mantiene activa con participación creciente en eventos comerciales.\n\nLa Cámara de Industria y Comercio Helénico-Argentina, está reconocida por Decreto Presidencial del gobierno griego del 18 de septiembre de 1998 y por decreto del gobierno argentino el 1 de noviembre de 1989.\n\nDesde mayo de 2017 es miembro activo y parte de la Comisión Directiva de la EUROCAMARA Argentina, y es nudo de las redes EEN (Enterprise Network Europe), EBN (Enterprise Bussines Network) de la Unión Europea. También es miembro del comité de negociación para la celebración del acuerdo UE-MERCOSUR, y el ingreso de Argentina a la OCDE (organización para la Cooperación y el Desarrollo Económico), el TEAM EUROPE de la Embajada de la UE dedicado a instalar inversiones europeas en Argentina, etc.\n\nDesde hace más de dos décadas es miembro activo de la UCCEB (Unión de Cámaras Comerciales Extranjeras Binacionales), que hoy consta de 38 miembros y que, a través de sus miembros, comercializan entre el 95 y el 97% del comercio exterior de Argentina.\n\nLa Cámara de Industria y Comercio Helénico-Argentina mantiene vínculos tanto con la Embajada de Grecia en Argentina como con la Embajada de Argentina en Grecia. Además tiene colaboración directa con la Cancillería Argentina, el Ministerio de Relaciones Exteriores de Grecia, y las varias Cámaras Comerciales de Grecia. La Cámara de Industria y Comercio Helénico-Argentina tiene aproximadamente 50 empresas miembros, tanto de Grecia como de Argentina.\n\nLa Cámara de Industria y Comercio Helénico-Argentina (C.I.C.H.A.) cada día cobra más importancia y su misión se define de la siguiente manera: La misión de la Cámara es constituir una fuerza creativa entre Grecia y Argentina - en un entorno empresarial que contribuya al desarrollo de nuestra sociedad, enmarcado por la justicia y la igualdad de oportunidades. Impulsar el desarrollo de negocios sostenibles, el comercio bilateral, las inversiones genuinamente productivas, el fomento de la empresa privada y la economía de mercado, todo ello enmarcado desde la responsabilidad, la ética y la transparencia. La organización de Foros para el conocimiento y la facilitación del diálogo entre el sector público y privado.",
                'icon_name'   => 'FileText',
                'order_num'   => 2,
                'is_active'   => 1,
            ],

            // 3. Misión Institucional (Tarjeta Dorada de Misión)
            [
                'section_key' => 'presentacion_mision',
                'page_target' => 'presentacion',
                'title'       => 'Fuerza Creativa entre Grecia y Argentina',
                'subtitle'    => 'Misión Institucional',
                'content'     => 'Constituir una fuerza creativa entre Grecia y Argentina en un entorno empresarial que contribuya al desarrollo de nuestra sociedad, enmarcado por la justicia y la igualdad de oportunidades. Impulsar el desarrollo de negocios sostenibles, el comercio bilateral, las inversiones genuinamente productivas, el fomento de la empresa privada y la economía de mercado, todo ello enmarcado desde la responsabilidad, la ética y la transparencia.',
                'icon_name'   => 'Target',
                'order_num'   => 3,
                'is_active'   => 1,
            ],
        ];

        foreach ($sections as $row) {
            $existing = $builder->where('section_key', $row['section_key'])->get()->getRow();
            if ($existing) {
                $builder->where('section_key', $row['section_key'])->update([
                    'page_target' => $row['page_target'],
                    'title'       => $row['title'],
                    'subtitle'    => $row['subtitle'],
                    'content'     => $row['content'],
                    'icon_name'   => $row['icon_name'],
                    'order_num'   => $row['order_num'],
                    'is_active'   => $row['is_active'],
                    'updated_at'  => date('Y-m-d H:i:s'),
                ]);
            } else {
                $row['updated_at'] = date('Y-m-d H:i:s');
                $builder->insert($row);
            }
        }
    }

    public function down()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('institutional_sections');
        $builder->where('page_target', 'presentacion')->delete();
    }
}
