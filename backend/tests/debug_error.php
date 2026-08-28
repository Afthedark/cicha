<?php
$baseUrl = 'http://127.0.0.1:8080/index.php/api';

$ch = curl_init("$baseUrl/auth/login");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["email" => "admin@cicha.com.ar", "password" => "admin123"]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$login = json_decode(curl_exec($ch), true);
$token = $login['token'];
curl_close($ch);

$ch2 = curl_init("$baseUrl/admin/authorities/6");
curl_setopt($ch2, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch2, CURLOPT_POSTFIELDS, json_encode(["photo_url" => "http://127.0.0.1:8080/uploads/test.jpg"]));
curl_setopt($ch2, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer " . $token
]);
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
$raw = curl_exec($ch2);
$json = json_decode($raw, true);
curl_close($ch2);

echo "MESSAGE: " . ($json['message'] ?? 'none') . "\n";
echo "ERROR TITLE: " . ($json['title'] ?? 'none') . "\n";
if (isset($json['trace'])) {
    echo "FILE: " . ($json['trace'][0]['file'] ?? 'none') . ":" . ($json['trace'][0]['line'] ?? 'none') . "\n";
}
