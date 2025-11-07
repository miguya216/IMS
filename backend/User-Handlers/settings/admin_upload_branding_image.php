<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../../conn.php';

try {
    if (!isset($_FILES['image'])) {
        throw new Exception('No file uploaded');
    }

    $file = $_FILES['image'];

    // Validate file type
    $allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!in_array($file['type'], $allowedTypes)) {
        throw new Exception('Invalid file type. Only PNG or JPG allowed.');
    }

    // Create directory if not exists
    $folder = BASE_STORAGE_PATH . 'resources/header-footer/';
    if (!is_dir($folder)) {
        mkdir($folder, 0777, true);
    }

    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $newFileName = 'header_footer_' . time() . '.' . $extension;

    $fullPath = $folder . $newFileName;

    // Move file
    if (!move_uploaded_file($file['tmp_name'], $fullPath)) {
        throw new Exception('Failed to save uploaded image.');
    }

    // Store relative path in DB
    $relativePath = 'resources/header-footer/' . $newFileName;

    $stmt = $pdo->prepare("UPDATE settings_preferences SET header_footer_img_path = ? WHERE setting_pref_ID = 1");
    $stmt->execute([$relativePath]);

    echo json_encode([
        "error" => false,
        "message" => "Header/Footer image uploaded successfully.",
        "headerFooterImgPath" => $relativePath
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "error" => true,
        "message" => $e->getMessage()
    ]);
}
?>
