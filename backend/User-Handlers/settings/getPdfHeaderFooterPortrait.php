<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../conn.php';

try {
    // Fetch the header_footer_img_path
    $stmt = $pdo->prepare("SELECT header_footer_img_path FROM settings_preferences LIMIT 1");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result && !empty($result['header_footer_img_path'])) {
        $imgPath = $result['header_footer_img_path'];

        // Construct full file path if needed
        $fullPath = BASE_STORAGE_PATH . $imgPath;

        // Check if file exists
        if (file_exists($fullPath)) {
            echo json_encode([
                "success" => true,
                "header_footer_img_path" => $imgPath,
                "full_path" => $fullPath
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Image file not found.",
                "header_footer_img_path" => $imgPath
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No header/footer image path found in settings."
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
?>
