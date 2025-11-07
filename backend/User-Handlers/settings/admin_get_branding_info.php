<?php
require_once __DIR__ . '/../../conn.php';
header('Content-Type: application/json');

try {
    // Fetch the first (and usually only) row from settings_preferences
    $stmt = $pdo->query("SELECT email_sender, header_footer_img_path FROM settings_preferences LIMIT 1");
    $result = $stmt->fetch();

    if ($result) {
        echo json_encode([
            "error" => false,
            "emailSender" => $result['email_sender'],
            "headerFooterImgPath" => $result['header_footer_img_path']
        ]);
    } else {
        echo json_encode([
            "error" => true,
            "message" => "No branding settings found."
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Database error: " . $e->getMessage()
    ]);
    exit;
}
?>
