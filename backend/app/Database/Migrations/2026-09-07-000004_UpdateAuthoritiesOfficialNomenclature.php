<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdateAuthoritiesOfficialNomenclature extends Migration
{
    public function up()
    {
        $db = \Config\Database::connect();
        
        // Update Mauricio Frumento
        $db->table('authorities')
            ->where('name LIKE', '%Mauricio Frumento%')
            ->update([
                'role_title' => 'Vocal Titular',
                'company'    => 'BANCO ICBC',
                'category'   => 'directiva',
                'order_num'  => 10,
                'is_active'  => 1,
            ]);

        // Normalize company and role names
        $db->table('authorities')->where('name LIKE', '%Georgios Souvatzis%')->update(['company' => 'IAS GROUP/ECOINNOVA', 'category' => 'directiva', 'order_num' => 2]);
        $db->table('authorities')->where('name LIKE', '%Gounaridis%')->update(['role_title' => 'Vice-Presidente 1º', 'company' => 'GEORGALOS HNOS S.A.I.C.A.', 'category' => 'directiva', 'order_num' => 3]);
        $db->table('authorities')->where('name LIKE', '%Kalogiannidis%')->update(['role_title' => 'Vice-Presidente 2º', 'company' => 'KALOP - ACROPOLIS CABLES S.A.', 'category' => 'directiva', 'order_num' => 4]);
        $db->table('authorities')->where('name LIKE', '%Kasimis%')->update(['role_title' => 'Secretario General', 'company' => 'PRODUCTOS PILAR S.A.', 'category' => 'directiva', 'order_num' => 5]);
        $db->table('authorities')->where('name LIKE', '%Bursky%')->update(['role_title' => 'Tesorero', 'company' => 'ESTUDIO SMIRNIOUDIS S.R.L.', 'category' => 'directiva', 'order_num' => 6]);
        $db->table('authorities')->where('name LIKE', '%Cotsiopoulos%')->update(['role_title' => 'Vocal Titular', 'company' => 'ARTEMISION SRL.', 'category' => 'directiva', 'order_num' => 7]);
        $db->table('authorities')->where('name LIKE', '%Davonis%')->update(['role_title' => 'Vocal Titular', 'company' => 'DAVONIS S.A.', 'category' => 'directiva', 'order_num' => 8]);
        $db->table('authorities')->where('name LIKE', '%Macipe%')->update(['role_title' => 'Vocal Titular', 'company' => 'BODEGAS KRONTIRAS S.A.', 'category' => 'directiva', 'order_num' => 9]);
        $db->table('authorities')->where('name LIKE', '%Themistocles Valaouris%')->update(['role_title' => 'Vocal Suplente', 'company' => 'HELLASMAR S.A.', 'category' => 'directiva', 'order_num' => 11]);
        $db->table('authorities')->where('name LIKE', '%Polijronopoulos%')->update(['role_title' => 'Presidente Comisión Revisora de Cuentas', 'company' => 'TEGA S.A.', 'category' => 'revisora', 'order_num' => 12]);
        $db->table('authorities')->where('name LIKE', '%Xanthopoulos%')->update(['role_title' => 'Miembro Titular Revisor de Cuentas', 'company' => 'COLEGIO SAINT MARY OF THE HILLS S.A.', 'category' => 'revisora', 'order_num' => 13]);
        $db->table('authorities')->where('name LIKE', '%Caravias Nazar%')->update(['role_title' => 'Miembro Titular Revisora de Cuentas', 'company' => 'ESTUDIO CONTABLE', 'category' => 'revisora', 'order_num' => 14]);
        $db->table('authorities')->where('name LIKE', '%Alejandro Aurelio Valaouris%')->update(['role_title' => 'Miembro Suplente Revisor de Cuentas', 'company' => 'HELLASMAR S.A.', 'category' => 'revisora', 'order_num' => 15]);
    }

    public function down()
    {
    }
}
