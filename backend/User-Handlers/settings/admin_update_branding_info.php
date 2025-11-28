<?php
require_once __DIR__ . '/../../conn.php';
header('Content-Type: application/json');

// Read JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['emailSender']) || empty(trim($input['emailSender']))) {
    echo json_encode(['error' => 'Email sender cannot be empty.']);
    exit;
}

if (!isset($input['emailSenderPassword']) || empty(trim($input['emailSenderPassword']))) {
    echo json_encode(['error' => 'Email sender Password cannot be empty.']);
    exit;
}

$emailSender = trim($input['emailSender']);
$emailSenderPassword = trim($input['emailSenderPassword']);

try {
    // Make sure record exists (you may have only one row, e.g., setting_pref_ID = 1)
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM settings_preferences WHERE setting_pref_ID = 1");
    $stmt->execute();
    $exists = $stmt->fetchColumn();

    if ($exists) {
        // Update existing record
        $updateStmt = $pdo->prepare("
            UPDATE settings_preferences 
            SET 
            email_sender = :emailSender,
            email_sender_password = :emailSenderPassword
            WHERE setting_pref_ID = 1
        ");
        $updateStmt->execute([
            'emailSender' => $emailSender, 
            'emailSenderPassword' => $emailSenderPassword
        ]);
    } else {
        // Create initial record if missing
        $insertStmt = $pdo->prepare("
            INSERT INTO settings_preferences (setting_pref_ID, email_sender)
            VALUES (1, :emailSender)
        ");
        $insertStmt->execute(['emailSender' => $emailSender]);
    }

    // Return updated data (so frontend can refresh UI)
    $selectStmt = $pdo->query("
        SELECT email_sender AS emailSender, header_footer_img_path AS headerFooterImgPath 
        FROM settings_preferences 
        WHERE setting_pref_ID = 1
    ");
    $result = $selectStmt->fetch();

    echo json_encode($result ?: [
        'emailSender' => $emailSender,
        'headerFooterImgPath' => null
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
