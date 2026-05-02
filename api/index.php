<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\PasswordGenerator;
use App\Encryptor;
use App\ExcelExporter;

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

// API Key Validation
$expectedApiKey = getenv('API_KEY') ?: 'master_key_12345';
$headers = getallheaders();
$providedApiKey = $headers['X-API-KEY'] ?? ($headers['x-api-key'] ?? null);

// Require API KEY if it's explicitly set or if it's the default master key
if ($providedApiKey !== $expectedApiKey) {
    http_response_code(401);
    jsonResponse(['success' => false, 'error' => 'Unauthorized. Invalid API Key.']);
}

// Simple IP-Based Rate Limiting
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$limitDir = __DIR__ . '/storage/limits';
if (!is_dir($limitDir)) {
    mkdir($limitDir, 0777, true);
}
$limitFile = $limitDir . '/' . md5($ip) . '.json';
$now = time();

$rateLimit = [
    'hits' => 0,
    'reset' => $now + 60
];

if (file_exists($limitFile)) {
    $data = json_decode(file_get_contents($limitFile), true);
    if (is_array($data)) {
        $rateLimit = $data;
    }
}

if ($now > $rateLimit['reset']) {
    $rateLimit['hits'] = 1;
    $rateLimit['reset'] = $now + 60;
} else {
    $rateLimit['hits']++;
}

file_put_contents($limitFile, json_encode($rateLimit));

if ($rateLimit['hits'] > 45) { // Permit 45 requests per minute
    http_response_code(429);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'error' => 'Demasiadas solicitudes. Por favor, intenta de nuevo en un minuto.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
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
$customSymbols = isset($body['custom_symbols']) ? trim($body['custom_symbols']) : '';
$method = isset($body['method']) ? strtolower(trim($body['method'])) : 'sha256';
$aesKey = isset($body['aes_key']) ? trim($body['aes_key']) : '';
$excludeAmbiguous = isset($body['exclude_ambiguous']) ? (bool) $body['exclude_ambiguous'] : false;
$strictRules = isset($body['strict_rules']) ? (bool) $body['strict_rules'] : false;

$validTypes = ['numbers', 'letters', 'alphanumeric', 'alphanumeric_symbols', 'passphrase'];
$validMethods = ['md5', 'sha256', 'aes256', 'bcrypt', 'argon2id'];

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
    $plains = PasswordGenerator::generateBatch($quantity, $length, $type, $excludeAmbiguous, $strictRules, $customSymbols);
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
