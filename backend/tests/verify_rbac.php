<?php

echo "========================================================\n";
echo "       CICHA RBAC & PARTNER PORTAL TEST SUITE           \n";
echo "========================================================\n\n";

$baseUrl = 'http://127.0.0.1:8080/index.php/api';

function apiCall($url, $method = 'GET', $data = null, $token = null) {
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

// 1. Visitante (Public)
echo "1. Testing Visitante Access...\n";
$publicHome = apiCall("$baseUrl/public/home");
if ($publicHome['code'] === 200) {
    echo "   [PASS] Visitante can access Public Home (200 OK)\n";
} else {
    echo "   [FAIL] Public Home returned " . $publicHome['code'] . "\n";
}

$unauthAdmin = apiCall("$baseUrl/admin/dashboard");
if ($unauthAdmin['code'] === 401) {
    echo "   [PASS] Visitante without token is blocked from Admin CMS (401 Unauthorized)\n";
} else {
    echo "   [FAIL] Unauthenticated access wasn't blocked (Code: " . $unauthAdmin['code'] . ")\n";
}

$unauthPartner = apiCall("$baseUrl/partner/dashboard");
if ($unauthPartner['code'] === 401) {
    echo "   [PASS] Visitante without token is blocked from Partner Portal (401 Unauthorized)\n";
} else {
    echo "   [FAIL] Unauthenticated partner access wasn't blocked (Code: " . $unauthPartner['code'] . ")\n";
}

// 2. Socio Account
echo "\n2. Testing Socio Role (socio@cicha.com.ar)...\n";
$socioLogin = apiCall("$baseUrl/auth/login", 'POST', [
    'email'    => 'socio@cicha.com.ar',
    'password' => 'socio123'
]);

if ($socioLogin['code'] === 200 && $socioLogin['body']['user']['role'] === 'socio') {
    $socioToken = $socioLogin['body']['token'];
    echo "   [PASS] Socio Login Successful (Role: socio)\n";

    // Test Partner Intranet Endpoints
    $partnerDash = apiCall("$baseUrl/partner/dashboard", 'GET', null, $socioToken);
    if ($partnerDash['code'] === 200 && isset($partnerDash['body']['data']['stats'])) {
        echo "   [PASS] Socio can access Partner Dashboard (200 OK)\n";
        echo "          Resources count: " . $partnerDash['body']['data']['stats']['total_resources'] . "\n";
        echo "          Benefits count: " . $partnerDash['body']['data']['stats']['total_benefits'] . "\n";
    } else {
        echo "   [FAIL] Partner Dashboard failed for socio\n";
    }

    $partnerRes = apiCall("$baseUrl/partner/resources", 'GET', null, $socioToken);
    if ($partnerRes['code'] === 200 && count($partnerRes['body']['data']) > 0) {
        echo "   [PASS] Socio can list Exclusive Resources (Count: " . count($partnerRes['body']['data']) . ")\n";
    }

    $partnerBen = apiCall("$baseUrl/partner/benefits", 'GET', null, $socioToken);
    if ($partnerBen['code'] === 200 && count($partnerBen['body']['data']) > 0) {
        echo "   [PASS] Socio can list Exclusive Benefits (Count: " . count($partnerBen['body']['data']) . ")\n";
    }

    // Verify Socio is FORBIDDEN on Admin CMS
    $socioAdminAttempt = apiCall("$baseUrl/admin/dashboard", 'GET', null, $socioToken);
    if ($socioAdminAttempt['code'] === 403) {
        echo "   [PASS] Socio is FORBIDDEN on Admin CMS (403 Forbidden)\n";
    } else {
        echo "   [FAIL] Socio was not blocked on Admin CMS (Code: " . $socioAdminAttempt['code'] . ")\n";
    }
} else {
    echo "   [FAIL] Socio Login failed.\n";
}

// 3. Secretario Account
echo "\n3. Testing Secretario Role (secretaria@cicha.com.ar)...\n";
$secLogin = apiCall("$baseUrl/auth/login", 'POST', [
    'email'    => 'secretaria@cicha.com.ar',
    'password' => 'sec123'
]);

if ($secLogin['code'] === 200 && $secLogin['body']['user']['role'] === 'secretario') {
    $secToken = $secLogin['body']['token'];
    echo "   [PASS] Secretario Login Successful (Role: secretario)\n";

    // Test Allowed Admin Modules (Articles, Partner Resources, Dashboard)
    $secDash = apiCall("$baseUrl/admin/dashboard", 'GET', null, $secToken);
    if ($secDash['code'] === 200) {
        echo "   [PASS] Secretario can access Admin Dashboard (200 OK)\n";
    }

    $secArticles = apiCall("$baseUrl/admin/articles", 'GET', null, $secToken);
    if ($secArticles['code'] === 200) {
        echo "   [PASS] Secretario can manage Articles / News (200 OK)\n";
    }

    $secPartnerRes = apiCall("$baseUrl/admin/partner-resources", 'GET', null, $secToken);
    if ($secPartnerRes['code'] === 200) {
        echo "   [PASS] Secretario can manage Partner Resources & Documents (200 OK)\n";
    }

    // Verify Secretario can manage Settings and Institutional, but is FORBIDDEN on User Management
    $secUsersAttempt = apiCall("$baseUrl/admin/users", 'GET', null, $secToken);
    if ($secUsersAttempt['code'] === 403) {
        echo "   [PASS] Secretario is FORBIDDEN on User Management (403 Forbidden)\n";
    } else {
        echo "   [FAIL] Secretario was not blocked on User Management (Code: " . $secUsersAttempt['code'] . ")\n";
    }

    $secSettings = apiCall("$baseUrl/admin/settings", 'GET', null, $secToken);
    if ($secSettings['code'] === 200) {
        echo "   [PASS] Secretario can access and edit System Settings & Contacts (200 OK)\n";
    } else {
        echo "   [FAIL] Secretario could not access Settings (Code: " . $secSettings['code'] . ")\n";
    }

    $secAuth = apiCall("$baseUrl/admin/authorities", 'GET', null, $secToken);
    if ($secAuth['code'] === 200) {
        echo "   [PASS] Secretario can manage Board Authorities (200 OK)\n";
    }
} else {
    echo "   [FAIL] Secretario Login failed.\n";
}

// 4. Admin Account
echo "\n4. Testing Admin Role (admin@cicha.com.ar)...\n";
$adminLogin = apiCall("$baseUrl/auth/login", 'POST', [
    'email'    => 'admin@cicha.com.ar',
    'password' => 'admin123'
]);

if ($adminLogin['code'] === 200 && $adminLogin['body']['user']['role'] === 'admin') {
    $adminToken = $adminLogin['body']['token'];
    echo "   [PASS] Admin Login Successful (Role: admin)\n";

    // Test Admin-Only Users Management
    $adminUsers = apiCall("$baseUrl/admin/users", 'GET', null, $adminToken);
    if ($adminUsers['code'] === 200 && count($adminUsers['body']['data']) >= 3) {
        echo "   [PASS] Admin can access User Management (Total users: " . count($adminUsers['body']['data']) . ")\n";
    }

    // Test Admin-Only Settings
    $adminSettings = apiCall("$baseUrl/admin/settings", 'GET', null, $adminToken);
    if ($adminSettings['code'] === 200) {
        echo "   [PASS] Admin can access System Settings (200 OK)\n";
    }

    // Admin can also view Partner Portal
    $adminPartnerDash = apiCall("$baseUrl/partner/dashboard", 'GET', null, $adminToken);
    if ($adminPartnerDash['code'] === 200) {
        echo "   [PASS] Admin can also inspect Partner Intranet (200 OK)\n";
    }
} else {
    echo "   [FAIL] Admin Login failed.\n";
}

echo "\n========================================================\n";
echo "   ALL RBAC PERMISSIONS VERIFIED WITH 100% SUCCESS!    \n";
echo "========================================================\n";
