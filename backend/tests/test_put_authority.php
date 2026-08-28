<?php
$baseUrl = 'http://127.0.0.1:8080/index.php/api';

// Login as admin
$ch = curl_init("$baseUrl/auth/login");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["email" => "admin@cicha.com.ar", "password" => "admin123"]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$login = json_decode(curl_exec($ch), true);
$token = $login['token'] ?? null;
curl_close($ch);

echo "Token received: " . substr($token, 0, 15) . "...\n";

// Test PUT
$ch2 = curl_init("$baseUrl/admin/authorities/6");
curl_setopt($ch2, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch2, CURLOPT_POSTFIELDS, json_encode(["photo_url" => "http://127.0.0.1:8080/uploads/test.jpg", "name" => "Gerardo Esteban Bursky"]));
curl_setopt($ch2, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer " . $token
]);
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
$res = curl_exec($ch2);
$httpCode = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
curl_close($ch2);

echo "HTTP Code: $httpCode\n";
echo "Response: $res\n";
