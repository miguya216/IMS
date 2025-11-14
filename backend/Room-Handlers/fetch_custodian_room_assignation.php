<?php
session_start();
require_once __DIR__ . '/../conn.php';

header("Content-Type: application/json");

if (!isset($_SESSION['user']['user_ID'])) {
    die("Unauthorized access");
}

$user_ID = $_SESSION['user']['user_ID'];

try {
    $stmt = $pdo->prepare("
        SELECT 
            ra.room_assignation_ID,
            ra.room_assignation_no,
            fr.room_number AS from_room,
            tr.room_number AS to_room,
            CONCAT(u.f_name, ' ', u.l_name) AS moved_by,
            ra.moved_at
        FROM room_assignation ra
        INNER JOIN room_a_asset raa ON ra.room_assignation_ID = raa.room_assignation_ID
        INNER JOIN asset a ON raa.asset_ID = a.asset_ID
        LEFT JOIN room fr ON ra.from_room_ID = fr.room_ID
        LEFT JOIN room tr ON ra.to_room_ID = tr.room_ID
        INNER JOIN user u ON ra.moved_by = u.user_ID
        WHERE ra.log_status = 'active'
          AND a.responsible_user_ID = :user_ID   
        GROUP BY ra.room_assignation_ID
        ORDER BY ra.moved_at DESC
    ");

    $stmt->execute([":user_ID" => $user_ID]);
    $result = $stmt->fetchAll();

    echo json_encode(["success" => true, "data" => $result]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
