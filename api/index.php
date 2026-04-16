<?php

require_once __DIR__ . '/PasswordGenerator.php';
require_once __DIR__ . '/Encryptor.php';
require_once __DIR__ . '/ExcelExporter.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    jsonResponse(['success' => false, 'error' => 'Method Not Allowed.']);
}

$rawBody = file_get_contents('php://input');
$body = json_decode($rawBody, true);

if (json_last_error() !== JSON_ERROR_NONE || !is_array($body)) {
    http_response_code(400);
    jsonResponse(['success' => false, 'error' => 'Invalid JSON body.']);
}

$action = isset($_GET['action']) ? trim($_GET['action']) : 'generate';
$quantity = isset($body['quantity']) ? (int) $body['quantity'] : 0;
$length = isset($body['length']) ? (int) $body['length'] : 0;
$type = isset($body['type']) ? trim($body['type']) : 'alphanumeric';
$method = isset($body['method']) ? strtolower(trim($body['method'])) : 'sha256';
$aesKey = isset($body['aes_key']) ? trim($body['aes_key']) : '';

$validTypes = ['numbers', 'letters', 'alphanumeric', 'alphanumeric_symbols'];
$validMethods = ['md5', 'sha256', 'aes256'];

$errors = [];

if ($quantity < 1 || $quantity > 30000) {
    $errors[] = 'La cantidad debe estar entre 1 y 30,000.';
}
if ($length < 4 || $length > 512) {
    $errors[] = 'La longitud debe estar entre 4 y 512 caracteres.';
}
if (!in_array($type, $validTypes)) {
    $errors[] = "Tipo inválido. Opciones: " . implode(', ', $validTypes);
}
if (!in_array($method, $validMethods)) {
    $errors[] = "Método inválido. Opciones: " . implode(', ', $validMethods);
}
if ($method === 'aes256' && empty($aesKey)) {
    $errors[] = 'La clave AES es requerida para el método AES-256.';
}

if (!empty($errors)) {
    http_response_code(422);
    jsonResponse(['success' => false, 'errors' => $errors]);
}

try {
    $plains = PasswordGenerator::generateBatch($quantity, $length, $type);
    $passwords = [];

    foreach ($plains as $plain) {
        $hashed = Encryptor::encrypt($plain, $method, $aesKey);
        $passwords[] = ['plain' => $plain, 'hashed' => $hashed];
    }
} catch (\Exception $e) {
    http_response_code(500);
    jsonResponse(['success' => false, 'error' => $e->getMessage()]);
}

if ($action === 'export') {
    try {
        ExcelExporter::export($passwords, $method);
    } catch (\Exception $e) {
        http_response_code(503);
        jsonResponse(['success' => false, 'error' => 'Excel export failed: ' . $e->getMessage()]);
    }
} else {
    header('Content-Type: application/json; charset=utf-8');
    jsonResponse([
        'success' => true,
        'count' => count($passwords),
        'method' => $method,
        'type' => $type,
        'length' => $length,
        'data' => $passwords,
    ]);
}

function jsonResponse(array $data): void
{
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}
