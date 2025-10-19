<?php
require_once __DIR__ . '/../conn.php';

header("Content-Type: application/json");

try {
    // Fetch all active rooms with their QR value
    $stmt = $pdo->prepare("
        SELECT 
            r.room_ID, 
            r.room_number, 
            r.room_qr_value,
            q.qr_image_path
        FROM room r
        INNER JOIN qr_code q ON r.room_qr_ID = q.qr_ID
        WHERE r.room_status = 'active'
        ORDER BY r.room_number ASC
    ");
    $stmt->execute();

    $rooms = $stmt->fetchAll();

    if ($rooms) {
        echo json_encode([
            "success" => true,
            "data" => $rooms
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No active rooms found."
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error fetching rooms: " . $e->getMessage()
    ]);
}
?>