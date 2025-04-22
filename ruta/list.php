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

// Define the notebooks folder
$notebooksDir = __DIR__ . "/notebooks";

// Check if the notebooks folder exists
if (!is_dir($notebooksDir)) {
    http_response_code(404);
    echo json_encode(['error' => 'Notebooks folder not found']);
    exit;
}

// Scan the notebooks folder for .txt files
$files = array_diff(scandir($notebooksDir), ['.', '..']);
$notebooks = [];

foreach ($files as $file) {
    if (pathinfo($file, PATHINFO_EXTENSION) === 'txt') {
        $notebooks[] = pathinfo($file, PATHINFO_FILENAME); // Add the filename without extension
    }
}

// Return the list of notebooks
echo json_encode(['success' => true, 'notebooks' => $notebooks]);
?>
