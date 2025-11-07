<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../conn.php';

try {
    $sql = "SELECT header_footer_img_path FROM settings_preferences LIMIT 1";
    $stmt = $pdo->query($sql);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result && !empty($result['header_footer_img_path'])) {
        echo json_encode([
            'header_footer_img_path' => $result['header_footer_img_path']
        ]);
    } else {
        echo json_encode(['header_footer_img_path' => null]);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>