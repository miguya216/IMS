<?php
session_start();
require_once __DIR__ . '/../conn.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['asset_IDs']) || !isset($data['room_ID'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing parameters"]);
    exit;
}

$user_ID = $_SESSION['user']['user_ID']; // user performing action
$asset_IDs = $data['asset_IDs'];
$room_ID = intval($data['room_ID']);

if (!is_array($asset_IDs) || count($asset_IDs) === 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "No assets selected"]);
    exit;
}

try {
    $pdo->beginTransaction();

    // Get old room of first asset (assuming same room for batch)
    $sqlOld = "SELECT room_ID FROM asset WHERE asset_ID = ? LIMIT 1";
    $stmtOld = $pdo->prepare($sqlOld);
    $stmtOld->execute([$asset_IDs[0]]);
    $from_room_ID = $stmtOld->fetchColumn();

    // Generate room_assignation_no (simple format: RA-YYYYMMDD-HHMMSS)
    $room_assignation_no = "RA-" . date("Ymd-His");

    // Insert header into room_assignation (temporary placeholder for room_assignation_no)
    $insertRA = "
        INSERT INTO room_assignation (room_assignation_no, from_room_ID, to_room_ID, moved_by) 
        VALUES ('TEMP', ?, ?, ?)
    ";
    $stmtRA = $pdo->prepare($insertRA);
    $stmtRA->execute([
        $from_room_ID ?: null,
        $room_ID,
        $user_ID
    ]);
    $room_assignation_ID = $pdo->lastInsertId();

    // Format: RA-YY-000001
    $yearShort = date("y"); // last 2 digits of year
    $room_assignation_no = sprintf("RA-%s-%06d", $yearShort, $room_assignation_ID);

    // Update the placeholder with the formatted number
    $updateRA = "
        UPDATE room_assignation
        SET room_assignation_no = ?
        WHERE room_assignation_ID = ?
    ";
    $stmtUpdateRA = $pdo->prepare($updateRA);
    $stmtUpdateRA->execute([$room_assignation_no, $room_assignation_ID]);

    // Update assets' room_ID
    $placeholders = implode(',', array_fill(0, count($asset_IDs), '?'));
    $sqlUpdate = "
        UPDATE asset
        SET room_ID = ?
        WHERE asset_ID IN ($placeholders)
          AND asset_status = 'active'
          AND responsible_user_ID = ?
    ";
    $stmtUpdate = $pdo->prepare($sqlUpdate);
    $params = array_merge([$room_ID], $asset_IDs, [$user_ID]);
    $stmtUpdate->execute($params);

    // Prepare reusable statements
    $sqlCondition = "SELECT asset_ID, asset_condition_ID, room_ID, price_amount FROM asset WHERE asset_ID = ?";
    $stmtCondition = $pdo->prepare($sqlCondition);

    $sqlInsertRAAsset = "
        INSERT INTO room_a_asset (room_assignation_ID, asset_ID, current_asset_conditon)
        VALUES (?, ?, ?)
    ";
    $stmtInsertRAAsset = $pdo->prepare($sqlInsertRAAsset);

    // --- 🧾 Property Card Statements ---
    $checkCard = $pdo->prepare("SELECT property_card_ID FROM property_card WHERE asset_ID = :asset_ID");
    $insertCard = $pdo->prepare("INSERT INTO property_card (asset_ID) VALUES (:asset_ID)");

    $insertRecord = $pdo->prepare("
        INSERT INTO property_card_record 
        (property_card_ID, reference_type, reference_ID, officer_user_ID, room_ID, price_amount, remarks)
        VALUES (:property_card_ID, 'RA', :reference_ID, :officer_user_ID, :room_ID, :price_amount, :remarks)
    ");

    foreach ($asset_IDs as $asset_ID) {
        $stmtCondition->execute([$asset_ID]);
        $row = $stmtCondition->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            // Fetch condition name
            $conditionNameStmt = $pdo->prepare("SELECT condition_name FROM asset_condition WHERE asset_condition_ID = ?");
            $conditionNameStmt->execute([$row['asset_condition_ID']]);
            $conditionName = $conditionNameStmt->fetchColumn() ?: 'Unknown';

            // Insert into room_a_asset
            $stmtInsertRAAsset->execute([
                $room_assignation_ID,
                $asset_ID,
                $conditionName
            ]);

            // --- 🧾 Property Card Logic ---
            $checkCard->execute([":asset_ID" => $asset_ID]);
            $propertyCard = $checkCard->fetchColumn();

            // Create property card if it doesn’t exist
            if (!$propertyCard) {
                $insertCard->execute([":asset_ID" => $asset_ID]);
                $propertyCard = $pdo->lastInsertId();
            }

            // Insert property_card_record using current room (before transfer)
            $insertRecord->execute([
                ":property_card_ID" => $propertyCard,
                ":reference_ID"     => $room_assignation_no,
                ":officer_user_ID"  => $user_ID,
                ":room_ID"          => $row['room_ID'], 
                ":price_amount"     => $row['price_amount'],
                ":remarks"          => "Room Transfer"
            ]);
        }
    }

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Selected assets moved successfully",
        "room_assignation_no" => $room_assignation_no
    ]);
} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
