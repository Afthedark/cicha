<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddPresentationInstitutionalSection extends Migration
{
    public function up()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('institutional_sections');

        $exists = $builder->where('section_key', 'presentacion')->countAllResults();

        $content = "La Cámara de Industria y Comercio Helénico-Argentina – C.I.C.H.A - fue fundada a principios de la década de 1940 por Aristóteles Onassis y los entonces destacados empresarios griegos de Argentina. En 1988, cobra un nuevo impulso y adquiere el reconocimiento, como tal, de ambos países. Desde entonces se mantiene activa con participación creciente en eventos comerciales.

La Cámara de Industria y Comercio Helénico-Argentina, está reconocida por Decreto Presidencial del gobierno griego del 18 de septiembre de 1998 y por decreto del gobierno argentino el 1 de noviembre de 1989.

Desde mayo de 2017 es miembro activo y parte de la Comisión Directiva de la EUROCAMARA Argentina, y es nudo de las redes EEN (Enterprise Network Europe), EBN (Enterprise Bussines Network) de la Unión Europea. También es miembro del comité de negociación para la celebración del acuerdo UE-MERCOSUR, y el ingreso de Argentina a la OCDE (organización para la Cooperación y el Desarrollo Económico), el TEAM EUROPE de la Embajada de la UE dedicado a instalar inversiones europeas en Argentina, etc.

Desde hace más de dos décadas es miembro activo de la UCCEB (Unión de Cámaras Comerciales Extranjeras Binacionales), que hoy consta de 38 miembros y que, a través de sus miembros, comercializan entre el 95 y el 97% del comercio exterior de Argentina.

La Cámara de Industria y Comercio Helénico-Argentina mantiene vínculos tanto con la Embajada de Grecia en Argentina como con la Embajada de Argentina en Grecia. Además tiene colaboración directa con la Cancillería Argentina, el Ministerio de Relaciones Exteriores de Grecia, y las varias Cámaras Comerciales de Grecia. La Cámara de Industria y Comercio Helénico-Argentina tiene aproximadamente 50 empresas miembros, tanto de Grecia como de Argentina.

La Cámara de Industria y Comercio Helénico-Argentina (C.I.C.H.A.) cada día cobra más importancia y su misión se define de la siguiente manera:
La misión de la Cámara es constituir una fuerza creativa entre Grecia y Argentina - en un entorno empresarial que contribuya al desarrollo de nuestra sociedad, enmarcado por la justicia y la igualdad de oportunidades. Impulsar el desarrollo de negocios sostenibles, el comercio bilateral, las inversiones genuinamente productivas, el fomento de la empresa privada y la economía de mercado, todo ello enmarcado desde la responsabilidad, la ética y la transparencia. La organización de Foros para el conocimiento y la facilitación del diálogo entre el sector público y privado.";

        if ($exists === 0) {
            $builder->insert([
                'section_key' => 'presentacion',
                'title'       => 'Presentación Institucional',
                'subtitle'    => 'Orígenes, Reconocimientos Oficiales y Redes Estratégicas de CICHA',
                'content'     => $content,
                'image_url'   => 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
                'icon_name'   => 'Building2',
                'order_num'   => 0,
                'is_active'   => 1,
                'updated_at'  => date('Y-m-d H:i:s'),
            ]);
        }
    }

    public function down()
    {
        $db = \Config\Database::connect();
        $db->table('institutional_sections')->where('section_key', 'presentacion')->delete();
    }
}
