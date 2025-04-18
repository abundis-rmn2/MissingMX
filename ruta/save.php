<?php
header('Access-Control-Allow-Origin: http://localhost:5173'); // Allow requests from your frontend
header('Access-Control-Allow-Methods: POST, OPTIONS'); // Allow POST and OPTIONS methods
header('Access-Control-Allow-Headers: Content-Type'); // Allow Content-Type header
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['notes'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

// Define the notebooks folder
$notebooksDir = __DIR__ . "/notebooks";

// Create the notebooks folder if it doesn't exist
if (!is_dir($notebooksDir)) {
    if (!mkdir($notebooksDir, 0777, true)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create notebooks directory']);
        exit;
    }
}

// Get the notebook name from the request, or use a unique ID if not provided
$name = $data['name'] ?? uniqid();
$name = preg_replace('/[^a-zA-Z0-9_-]/', '_', $name); // Sanitize the name to avoid invalid characters
$filePath = $notebooksDir . "/$name.txt";

if (file_put_contents($filePath, json_encode($data['notes'], JSON_PRETTY_PRINT))) {
    echo json_encode(['success' => true, 'name' => $name]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save notes']);
}
?>
