<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateB2BMeetingsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'title' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'slug' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'unique'     => true,
            ],
            'sector' => [
                'type'       => 'VARCHAR',
                'constraint' => '150',
                'default'    => 'Multisectorial',
            ],
            'meeting_date' => [
                'type' => 'DATE',
                'null' => true,
            ],
            'location' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'default'    => 'Buenos Aires / Atenas (Híbrido)',
            ],
            'modality' => [
                'type'       => 'VARCHAR',
                'constraint' => '50',
                'default'    => 'hibrido', // presencial, virtual, hibrido
            ],
            'status' => [
                'type'       => 'VARCHAR',
                'constraint' => '50',
                'default'    => 'completed', // completed, in_progress, upcoming
            ],
            'cover_image_url' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            // Public fields (básico)
            'public_summary' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'participants_count' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 0,
            ],
            'meetings_count' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 0,
            ],
            'agreements_count' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 0,
            ],
            // Partner fields (detallado y exclusivo)
            'partner_detailed_report' => [
                'type' => 'LONGTEXT',
                'null' => true,
            ],
            'partner_companies_list' => [
                'type' => 'LONGTEXT',
                'null' => true,
            ],
            'partner_conclusions' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'partner_document_url' => [
                'type'       => 'VARCHAR',
                'constraint' => '500',
                'null'       => true,
            ],
            'partner_contact_info' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            'is_active' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 1,
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
        $this->forge->createTable('b2b_meetings', true);

        // Seed initial rich data
        $now = date('Y-m-d H:i:s');
        $initialData = [
            [
                'title'                   => 'Ronda Bilateral Agroalimentaria & Vinos de Autor Atenas - Cono Sur 2026',
                'slug'                    => 'ronda-bilateral-agroalimentaria-vinos-2026',
                'sector'                  => 'Alimentos & Bebidas',
                'meeting_date'            => '2026-05-18',
                'location'                => 'Salón Libertador CICHA, Buenos Aires (Híbrido con Atenas)',
                'modality'                => 'hibrido',
                'status'                  => 'completed',
                'cover_image_url'         => 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
                'public_summary'          => 'Encuentro comercial enfocado en la exportación de vinos argentinos de alta gama, aceites de oliva premium, miel orgánica y frutos secos mediterráneos. Se congregaron cámaras importadoras griegas de la red EUROCAMARA y productores certificados de Argentina.',
                'participants_count'      => 38,
                'meetings_count'          => 84,
                'agreements_count'        => 12,
                'partner_detailed_report' => "## Balance General de la Ronda Bilateral\nDurante 2 jornadas intensivas de trabajo se celebraron 84 mesas de negociación directa (1-a-1) de 25 minutos cada una.\n\n### Acuerdos Principales Celebrados:\n1. **Distribución en Retail Griego**: 3 bodegas mendocinas socias de CICHA cerraron cartas de intención (LOI) con la distribuidora helénica *Aegean Food & Wine Imports* para distribución en Atenas y Salónica por un volumen inicial proyectado de 14.000 botellas.\n2. **Importación Arancelaria Preferencial**: Acuerdos marco de suministro para aceite de oliva virgen extra y aceitunas Kalamata con certificación de origen.\n3. **Línea Logística Consolidada**: Tarifa bonificada del 25% acordada con Hellenic Shipping para embarques en contenedor consolidado (LCL).",
                'partner_companies_list'  => "- **Hellenic Gourmet Imports S.A.** (Atenas) - Interés: Vinos Malbec Reserva y Cabernet Franc.\n- **Mediterranean Olive Trading Ltd.** (El Pireo) - Interés: Frutos secos y pasas de uva argentinas.\n- **Bodegas del Cono Sur S.A.** (Mendoza, Socio CICHA) - Oferta: Vinos de altura con denominación de origen.\n- **Alimentos Andinos Gourmet** (San Juan, Socio CICHA) - Oferta: Aceites monovarietales y miel fraccionada.",
                'partner_conclusions'     => "Se concluye que el mercado griego mantiene una demanda insatisfecha de vinos varietales sudamericanos premium. Se recomienda a los socios con volumen exportable solicitar la homologación fitosanitaria europea inmediata.",
                'partner_document_url'    => 'https://cicha.com.ar/docs/informe-ronda-agroalimentaria-2026.pdf',
                'partner_contact_info'    => 'comercioexterior@cicha.com.ar | Tel: +54 11 4312-8899 (Int. 104)',
                'is_active'               => 1,
                'created_at'              => $now,
                'updated_at'              => $now,
            ],
            [
                'title'                   => 'Misión Comercial & Encuentro B2B Transporte Marítimo y Logística Portuaria',
                'slug'                    => 'mision-comercial-transporte-maritimo-logistica-2026',
                'sector'                  => 'Logística Portuaria',
                'meeting_date'            => '2026-07-10',
                'location'                => 'Puerto de El Pireo (Piraeus Port Authority), Grecia',
                'modality'                => 'presencial',
                'status'                  => 'completed',
                'cover_image_url'         => 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
                'public_summary'          => 'Misión empresarial público-privada entre operadores navieros helenos, agentes de carga multimodal y autoridades de puertos de ultramar argentinos para optimizar los corredores marítimos del Atlántico Sur y el Mediterráneo Oriental.',
                'participants_count'      => 46,
                'meetings_count'          => 112,
                'agreements_count'        => 16,
                'partner_detailed_report' => "## Informe de Misión Estratégica en El Pireo\nLa misión comercial encabezada por directivos de CICHA y representantes de la Embajada de Grecia en Buenos Aires permitió destrabar convenios de escala directa en fletes hacia el Cono Sur.\n\n### Resultados Operativos y Logísticos:\n- Firma de memorando de entendimiento para ventanilla única de desaduanamiento portuario rápido para socios de CICHA en terminales del Pireo.\n- Bonificación de estadía en depósito fiscal portuario por hasta 7 días libres de recargo.\n- Establecimiento de canal de comunicación directo 24/7 entre agencias marítimas argentinas y navieras helenas.",
                'partner_companies_list'  => "- **Piraeus Shipping Lines Ltd.** (Grecia)\n- **Hellenic Cargo Logistics** (Atenas)\n- **Transmarítima Austral S.R.L.** (Buenos Aires, Socio CICHA)\n- **Terminales Portuarias del Sur** (Zárate, Socio CICHA)",
                'partner_conclusions'     => "Las empresas socias disponen a partir de este mes de una reducción del 18% en tiempos de tránsito sobre el corredor Piraeus-Santos-Buenos Aires.",
                'partner_document_url'    => 'https://cicha.com.ar/docs/informe-mision-maritima-pireo.pdf',
                'partner_contact_info'    => 'logistica@cicha.com.ar | Coordinación Portuaria CICHA',
                'is_active'               => 1,
                'created_at'              => $now,
                'updated_at'              => $now,
            ],
            [
                'title'                   => 'Cumbre B2B Tecnologías Verdes, Eficiencia Energética & Software Binacional',
                'slug'                    => 'cumbre-b2b-tecnologias-verdes-software-2026',
                'sector'                  => 'Tecnología & Energía',
                'meeting_date'            => '2026-09-02',
                'location'                => 'Plataforma Virtual Interactiva CICHA - EUROCAMARA',
                'modality'                => 'virtual',
                'status'                  => 'completed',
                'cover_image_url'         => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
                'public_summary'          => 'Ronda virtual B2B para la integración de software argentino de gestión agrotech, soluciones de energía solar fotovoltaica e ingeniería ambiental con fondos de inversión de la Unión Europea y empresas griegas.',
                'participants_count'      => 52,
                'meetings_count'          => 128,
                'agreements_count'        => 19,
                'partner_detailed_report' => "## Informe de Negociaciones Tecnológicas y Startups\nSe vincularon 14 empresas argentinas de software y servicios basados en el conocimiento con 18 compañías griegas integradoras de soluciones IoT y energías limpias.\n\n### Acuerdos Destacados:\n- Dos empresas socias de CICHA fueron preseleccionadas para consorcios del programa europeo Horizon Europe con apoyo de la secretaría de CICHA.\n- Joint venture en desarrollo para comercialización de sensores IoT para silos y trazabilidad de granos en Grecia y Chipre.",
                'partner_companies_list'  => "- **Hellas CleanTech Ventures** (Atenas)\n- **Athenian Software Solutions** (Salónica)\n- **InnovaTech Argentina S.A.** (Córdoba, Socio CICHA)\n- **GeoSistemas Agro B2B** (Buenos Aires, Socio CICHA)",
                'partner_conclusions'     => "Gran receptividad del talento técnico argentino y de los marcos de doble imposición favorables entre ambos países.",
                'partner_document_url'    => 'https://cicha.com.ar/docs/dossier-tecnologias-verdes-2026.pdf',
                'partner_contact_info'    => 'tecnologia@cicha.com.ar | Nodo EEN Unión Europea',
                'is_active'               => 1,
                'created_at'              => $now,
                'updated_at'              => $now,
            ],
        ];

        foreach ($initialData as $data) {
            $this->db->table('b2b_meetings')->insert($data);
        }
    }

    public function down()
    {
        $this->forge->dropTable('b2b_meetings', true);
    }
}
