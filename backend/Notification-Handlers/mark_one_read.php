<?php
session_start();
require_once __DIR__ . '/../conn.php';

if (!isset($_SESSION['user']['account_ID'])) {
    echo json_encode(["success" => false, "error" => "Unauthorized"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$notification_ID = $input['notification_ID'] ?? null;
$account_ID = $_SESSION['user']['account_ID'];

if (!$notification_ID) {
    echo json_encode(["success" => false, "error" => "Missing notification_ID"]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        UPDATE notification
        SET is_read = 1
        WHERE notification_ID = :notif_ID
          AND (recipient_account_ID = :acc_ID OR recipient_account_ID IS NULL)
    ");
    $stmt->execute([
        ":notif_ID" => $notification_ID,
        ":acc_ID" => $account_ID,
    ]);

    echo json_encode(["success" => true]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
