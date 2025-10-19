<?php
require_once __DIR__ . '/../conn.php';
header("Content-Type: application/json");

try {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['room_ID']) || !isset($input['kld_property_tag'])) {
        echo json_encode([
            "success" => false,
            "message" => "Missing room_ID or kld_property_tag"
        ]);
        exit;
    }

    $room_ID = intval($input['room_ID']);
    $kld_property_tag = trim($input['kld_property_tag']);

    // Check if asset belongs to this room
    $stmt = $pdo->prepare("SELECT asset_ID, room_ID, kld_property_tag 
                           FROM asset 
                           WHERE kld_property_tag = ? AND room_ID = ?");
    $stmt->execute([$kld_property_tag, $room_ID]);
    $match = $stmt->fetch();

    if ($match) {
        echo json_encode([
            "success" => true,
            "belongs" => true,
            "message" => "Asset belongs to this room"
        ]);
    } else {
        echo json_encode([
            "success" => true,
            "belongs" => false,
            "message" => "This asset does not belong to the selected room"
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
}
?>