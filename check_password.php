<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow all origins
header('Access-Control-Allow-Methods: POST, OPTIONS'); // Allow POST and OPTIONS methods
header('Access-Control-Allow-Headers: Content-Type'); // Allow Content-Type header

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$input = json_decode(file_get_contents('php://input'), true);
$password = $input['password'] ?? '';

// List of valid passwords
$validPasswords = ['password1', 'password2', 'password3']; // Replace with your actual passwords

// Check if the password is valid
$isValid = in_array($password, $validPasswords);

// Log the user information
$logData = [
    'date' => date('Y-m-d H:i:s'),
    'ip' => $_SERVER['REMOTE_ADDR'],
    'password' => $password,
    'success' => $isValid
];
file_put_contents('user_log.txt', json_encode($logData) . PHP_EOL, FILE_APPEND);

if ($isValid) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
?>
