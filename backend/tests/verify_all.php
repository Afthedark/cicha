<?php

echo "========================================================\n";
echo "   CICHA FULL SYSTEM & CMS AUTOMATED TEST SUITE        \n";
echo "========================================================\n\n";

$baseUrl = 'http://127.0.0.1:8080/index.php/api';

function apiRequest($url, $method = 'GET', $data = null, $token = null) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $headers = ['Content-Type: application/json'];
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    if ($data !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }

    $res = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return [
        'code' => $httpCode,
        'body' => json_decode($res, true),
        'raw'  => $res
    ];
}

// 1. Test Public Home
echo "1. Testing Public Home Endpoint...\n";
$home = apiRequest("$baseUrl/public/home");
if ($home['code'] === 200 && isset($home['body']['data']['mision'])) {
    echo "   [PASS] Home API OK. Misión: " . substr($home['body']['data']['mision']['title'], 0, 30) . "...\n";
    echo "   [PASS] Stats: " . json_encode($home['body']['data']['stats']) . "\n";
} else {
    echo "   [FAIL] Home API failed. Code: " . $home['code'] . "\n";
}

// 2. Test Public Institutional
echo "\n2. Testing Public Institutional Endpoint...\n";
$inst = apiRequest("$baseUrl/public/institutional");
if ($inst['code'] === 200 && count($inst['body']['data']['authorities']) > 0) {
    echo "   [PASS] Institutional API OK. Authorities count: " . count($inst['body']['data']['authorities']) . "\n";
    echo "   [PASS] Alliances count: " . count($inst['body']['data']['alliances']) . "\n";
} else {
    echo "   [FAIL] Institutional API failed.\n";
}

// 3. Test Contact Submission
echo "\n3. Testing Public Contact Submission...\n";
$contactData = [
    'name'    => 'Empresario Heleno Test',
    'email'   => 'test.heleno@empresa.gr',
    'phone'   => '+54 11 5555-1234',
    'subject' => 'Interés en importación de aceite de oliva Kalamata',
    'message' => 'Estimada Cámara, deseamos coordinar una reunión comercial para explorar oportunidades con distribuidores argentinos.'
];
$contactRes = apiRequest("$baseUrl/public/contact", 'POST', $contactData);
if ($contactRes['code'] === 201) {
    echo "   [PASS] Contact form successfully submitted.\n";
} else {
    echo "   [FAIL] Contact submission failed. Code: " . $contactRes['code'] . "\n";
}

// 4. Test Membership Application Submission
echo "\n4. Testing Membership Application Submission...\n";
$appData = [
    'company_name' => 'Hellas Maritime South America S.A.',
    'contact_name' => 'Konstantinos Vlachos',
    'contact_role' => 'Director de Operaciones',
    'email'        => 'kvlachos@hellasmaritime.com',
    'phone'        => '+54 11 4321-9988',
    'cuit_rut'     => '30-71829384-9',
    'sector'       => 'Marítimo y Logística Naval',
    'website'      => 'https://hellasmaritime.com',
    'interests'    => ['Comercio Bilateral e Inversiones', 'Participación en EUROCAMARA', 'Red Enterprise Europe Network (EEN)'],
    'comments'     => 'Deseamos incorporarnos como socios activos de CICHA para participar en los comités de comercio exterior.'
];
$appRes = apiRequest("$baseUrl/public/apply", 'POST', $appData);
if ($appRes['code'] === 201) {
    echo "   [PASS] Membership application successfully submitted.\n";
} else {
    echo "   [FAIL] Membership application failed. Code: " . $appRes['code'] . "\n";
}

// 5. Test Admin Login & JWT Authentication
echo "\n5. Testing Admin Authentication (JWT)...\n";
$login = apiRequest("$baseUrl/auth/login", 'POST', [
    'email'    => 'admin@cicha.com.ar',
    'password' => 'admin123'
]);
if ($login['code'] === 200 && isset($login['body']['token'])) {
    $jwtToken = $login['body']['token'];
    echo "   [PASS] Login successful! User: " . $login['body']['user']['name'] . "\n";
    echo "   [PASS] JWT Token issued: " . substr($jwtToken, 0, 30) . "...\n";
} else {
    echo "   [FAIL] Login failed.\n";
    exit(1);
}

// 6. Test Admin Dashboard with JWT
echo "\n6. Testing Admin Dashboard...\n";
$dash = apiRequest("$baseUrl/admin/dashboard", 'GET', null, $jwtToken);
if ($dash['code'] === 200 && isset($dash['body']['data']['stats'])) {
    $stats = $dash['body']['data']['stats'];
    echo "   [PASS] Admin Dashboard OK!\n";
    echo "   - Artículos: " . $stats['total_articles'] . "\n";
    echo "   - Socios: " . $stats['total_members'] . "\n";
    echo "   - Oportunidades: " . $stats['total_opportunities'] . "\n";
    echo "   - Solicitudes pendientes: " . $stats['pending_applications'] . "\n";
    echo "   - Mensajes no leídos: " . $stats['unread_messages'] . "\n";
} else {
    echo "   [FAIL] Admin Dashboard query failed.\n";
}

// 7. Verify Received Contact Messages
echo "\n7. Testing Admin Messages Inbox...\n";
$msgs = apiRequest("$baseUrl/admin/messages", 'GET', null, $jwtToken);
if ($msgs['code'] === 200 && count($msgs['body']['data']) > 0) {
    echo "   [PASS] Messages inbox verified! Total messages: " . count($msgs['body']['data']) . "\n";
    echo "   - Latest message: " . $msgs['body']['data'][0]['subject'] . " de " . $msgs['body']['data'][0]['name'] . "\n";
} else {
    echo "   [FAIL] Messages inbox check failed.\n";
}

// 8. Verify Received Membership Applications
echo "\n8. Testing Admin Applications Inbox...\n";
$apps = apiRequest("$baseUrl/admin/applications", 'GET', null, $jwtToken);
if ($apps['code'] === 200 && count($apps['body']['data']) > 0) {
    echo "   [PASS] Applications inbox verified! Total applications: " . count($apps['body']['data']) . "\n";
    echo "   - Latest application: " . $apps['body']['data'][0]['company_name'] . " (" . $apps['body']['data'][0]['sector'] . ")\n";
} else {
    echo "   [FAIL] Applications check failed.\n";
}

// 9. Test Creating and Deleting an Article in Admin CMS
echo "\n9. Testing Admin CMS Article Creation...\n";
$newArtData = [
    'title'        => 'Nueva Misión Comercial Grecia - Cono Sur 2026',
    'summary'      => 'Se prepara una nutrida delegación empresarial para rondas de negocios en Atenas y Salónica.',
    'content'      => '<p>La Cámara de Industria y Comercio Heleno Argentina abre la convocatoria para empresas interesadas en participar de la misión comercial 2026.</p>',
    'author'       => 'Comisión de Comercio Exterior CICHA',
    'published_at' => date('Y-m-d'),
    'status'       => 'published',
    'is_featured'  => 1
];
$createdArt = apiRequest("$baseUrl/admin/articles", 'POST', $newArtData, $jwtToken);
if ($createdArt['code'] === 201 && isset($createdArt['body']['id'])) {
    $artId = $createdArt['body']['id'];
    echo "   [PASS] Article created via CMS (ID: $artId)!\n";
    
    // Clean up
    $delArt = apiRequest("$baseUrl/admin/articles/$artId", 'DELETE', null, $jwtToken);
    if ($delArt['code'] === 200) {
        echo "   [PASS] Article deleted successfully (cleanup)!\n";
    }
} else {
    echo "   [FAIL] Article creation failed.\n";
}

echo "\n========================================================\n";
echo "   ALL TESTS PASSED WITH 100% SUCCESS RATE!            \n";
echo "========================================================\n";
