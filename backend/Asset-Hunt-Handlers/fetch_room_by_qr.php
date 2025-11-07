<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../conn.php';

$response = ["success" => false, "message" => "Invalid request"];

try {
    // ✅ Accept QR value (POST or GET)
    $qrValue = $_POST['qr_value'] ?? $_GET['qr_value'] ?? null;

    if ($qrValue) {
        $stmt = $pdo->prepare("
            SELECT room_ID, room_number 
            FROM room 
            WHERE room_qr_value = ? AND room_status = 'active'
            LIMIT 1
        ");
        $stmt->execute([$qrValue]);
        $room = $stmt->fetch();

        if ($room) {
            $response = [
                "success" => true,
                "room" => $room
            ];
        } else {
            $response = [
                "success" => false,
                "message" => "No active room found for this QR code."
            ];
        }
    } else {
        $response = [
            "success" => false,
            "message" => "QR value is required."
        ];
    }
} catch (Exception $e) {
    $response = [
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ];
}

echo json_encode($response);
?>