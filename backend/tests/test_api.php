<?php
$ch = curl_init('http://127.0.0.1:8080/index.php/api/auth/login');
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'email' => 'admin@cicha.com.ar',
    'password' => 'admin123'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$res = curl_exec($ch);
echo "LOGIN RESPONSE:\n" . $res . "\n";

$data = json_decode($res, true);
if (isset($data['token'])) {
    $token = $data['token'];
    $ch2 = curl_init('http://127.0.0.1:8080/index.php/api/admin/dashboard');
    curl_setopt($ch2, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
    $res2 = curl_exec($ch2);
    echo "\nDASHBOARD RESPONSE:\n" . $res2 . "\n";
}
