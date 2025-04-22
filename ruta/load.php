<?php
header('Access-Control-Allow-Origin: http://localhost:5173'); // Allow requests from your frontend
header('Access-Control-Allow-Methods: GET, OPTIONS'); // Allow GET and OPTIONS methods
header('Access-Control-Allow-Headers: Content-Type'); // Allow Content-Type header
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$id = $_GET['id'] ?? null;
if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'No ID provided']);
    exit;
}

// Define the notebooks folder
$notebooksDir = __DIR__ . "/notebooks";
$filePath = $notebooksDir . "/$id.txt";

if (!file_exists($filePath)) {
    http_response_code(404);
    echo json_encode(['error' => 'Notebook not found']);
    exit;
}

$savedData = json_decode(file_get_contents($filePath), true);
if ($savedData === null) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to read notebook']);
    exit;
}

// Include startDate and endDate in the response
echo json_encode([
    'success' => true,
    'notes' => $savedData['notes'] ?? [],
    'startDate' => $savedData['startDate'] ?? null, // Ensure startDate is included
    'endDate' => $savedData['endDate'] ?? null     // Ensure endDate is included
]);
?>
