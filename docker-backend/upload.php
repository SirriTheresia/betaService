<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['file'])) {
        echo json_encode(["error" => "No file uploaded."]);
        exit();
    }

    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileName = uniqid() . '_' . basename($_FILES['file']['name']);
    $uploadFile = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadFile)) {
        $url = "http://localhost:8080/uploads/" . $fileName;
        echo json_encode(["url" => $url]);
    } else {
        echo json_encode(["error" => "Failed to upload file."]);
    }
} else {
    echo json_encode(["error" => "Invalid request method."]);
}
