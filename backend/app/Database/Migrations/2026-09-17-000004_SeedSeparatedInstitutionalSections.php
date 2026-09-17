<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SeedSeparatedInstitutionalSections extends Migration
{
    public function up()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('institutional_sections');

        $sections = [
            // 1. INICIO (page_target = 'home')
            [
                'section_key' => 'home_mision',
                'page_target' => 'home',
                'title'       => 'Nuestra Misión',
                'subtitle'    => 'Fuerza creadora para el desarrollo bilateral equitativo',
                'content'     => 'La misión de la Cámara de Industria y Comercio Heleno Argentina, es ser una fuerza creadora -entre Argentina y Grecia - en un ambiente de negocios que contribuya al desarrollo de nuestra sociedad, enmarcando con justicia e igualdad de oportunidades. Promover el desarrollo de negocios sustentables, comercio bilateral, inversión productiva genuina, alentando emprendimientos privados y una economía de mercado, todo eso enmarcado con responsabilidad, ética y transparencia. Articular foros de conocimiento entre sus socios y facilitar el diálogo entre los sectores públicos y privados.',
                'icon_name'   => 'Target',
                'order_num'   => 1,
                'is_active'   => 1,
            ],
            [
                'section_key' => 'home_objeto',
                'page_target' => 'home',
                'title'       => 'Objeto de la Cámara',
                'subtitle'    => 'Representación y articulación del empresariado heleno y bilateral',
                'content'     => 'La Cámara de Industria y Comercio Heleno Argentina, tiene como nucleamiento y representación del empresariado griego o de ascendencia griega, residente en la Argentina, así como en general, de ambos o de terceros países con intereses, operaciones o inversiones en Grecia y/o Argentina. Fomenta el intercambio comercial, industrial, tecnológico y cultural entre ambas naciones.',
                'icon_name'   => 'ShieldCheck',
                'order_num'   => 2,
                'is_active'   => 1,
            ],

            // 2. PRESENTACIÓN (page_target = 'presentacion')
            [
                'section_key' => 'presentacion_historia',
                'page_target' => 'presentacion',
                'title'       => 'Origen & Fundación de C.I.C.H.A.',
                'subtitle'    => 'Legado de Aristóteles Onassis y los pioneros helenos en Argentina (1940)',
                'content'     => "La Cámara de Industria y Comercio Helénico-Argentina – C.I.C.H.A - fue fundada a principios de la década de 1940 por Aristóteles Onassis y los entonces destacados empresarios griegos de Argentina. En 1988, cobra un nuevo impulso y adquiere el reconocimiento, como tal, de ambos países. Desde entonces se mantiene activa con participación creciente en eventos comerciales.\n\nLa Cámara de Industria y Comercio Helénico-Argentina, está reconocida por Decreto Presidencial del gobierno griego del 18 de septiembre de 1998 y por decreto del gobierno argentino el 1 de noviembre de 1989.",
                'icon_name'   => 'Building2',
                'order_num'   => 1,
                'is_active'   => 1,
            ],
            [
                'section_key' => 'presentacion_mision',
                'page_target' => 'presentacion',
                'title'       => 'Misión y Visión Institucional',
                'subtitle'    => 'Compromiso ético, desarrollo equitativo y sustentabilidad bilateral',
                'content'     => "La Cámara de Industria y Comercio Helénico-Argentina (C.I.C.H.A.) cada día cobra más importancia y su misión se define de la siguiente manera:\n\nLa misión de la Cámara es constituir una fuerza creativa entre Grecia y Argentina - en un entorno empresarial que contribuya al desarrollo de nuestra sociedad, enmarcado por la justicia y la igualdad de oportunidades. Impulsar el desarrollo de negocios sostenibles, el comercio bilateral, las inversiones genuinamente productivas, el fomento de la empresa privada y la economía de mercado, todo ello enmarcado desde la responsabilidad, la ética y la transparencia. La organización de Foros para el conocimiento y la facilitación del diálogo entre el sector público y privado.",
                'icon_name'   => 'Award',
                'order_num'   => 2,
                'is_active'   => 1,
            ],

            // 3. LA CÁMARA (page_target = 'la_camara')
            [
                'section_key' => 'camara_historia',
                'page_target' => 'la_camara',
                'title'       => 'Historia y Trayectoria de la Cámara',
                'subtitle'    => 'Reconocimiento oficial y presencia binacional consolidada',
                'content'     => 'La Cámara de Industria y Comercio Heleno Argentina (C.I.C.H.A.) es una entidad binacional reconocida oficialmente por los gobiernos de la República Argentina y la República Helénica. Desde su origen en la década de 1940 impulsada por figuras de la talla de Aristóteles Onassis, y su posterior refundación institucional en 1988 con decretos oficiales de 1989 y 1998, representa un puente sólido e ininterrumpido de negocios, cultura e inversiones.',
                'icon_name'   => 'Landmark',
                'order_num'   => 1,
                'is_active'   => 1,
            ],
            [
                'section_key' => 'camara_redes',
                'page_target' => 'la_camara',
                'title'       => 'Redes Estratégicas y Articulación Internacional',
                'subtitle'    => 'Integración activa con Eurocámara, EEN y UCCEB',
                'content'     => "Desde mayo de 2017, CICHA es miembro pleno de EUROCÁMARA Argentina y compone el nodo Enterprise Europe Network (EEN) de la Comisión Europea.\n\nAsimismo, forma parte activa de la UCCEB (Unión de Cámaras de Comercio Extranjeras y Binacionales) junto a más de 30 cámaras internacionales, facilitando la articulación público-privada de alto impacto.",
                'icon_name'   => 'Network',
                'order_num'   => 2,
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
        $builder->whereIn('page_target', ['home', 'presentacion', 'la_camara'])->delete();
    }
}
