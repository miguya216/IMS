<?php
require_once __DIR__ . "/../conn.php";
require_once __DIR__ . '/../Notification-Handlers/notif_config.php';
require_once __DIR__ . '/../email_config.php';

session_start();
header("Content-Type: application/json");

function sendEmail($recipientEmail, $subject, $body) {
    try {
        $mail = getMailer();
        $mail->addAddress($recipientEmail);
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $body;
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email could not be sent. Mailer Error: {$mail->ErrorInfo}");
        return false;
    }
}

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode(["success" => false, "error" => "Invalid request body"]);
        exit;
    }

    $dateUsed   = $data['dateUsed'] ?? null;
    $timeUsed   = $data['timeUsed'] ?? null;
    $dateReturn = $data['dateReturn'] ?? null;
    $timeReturn = $data['timeReturn'] ?? null;
    $purpose    = $data['purpose'] ?? null;
    $items      = $data['items'] ?? [];

    if (!$dateUsed || !$timeUsed || !$dateReturn || !$timeReturn || !$purpose || empty($items)) {
        echo json_encode(["success" => false, "error" => "Missing required fields"]);
        exit;
    }

    $user_ID = $_SESSION['user']['user_ID'] ?? null;
    if (!$user_ID) {
        echo json_encode(["success" => false, "error" => "User not logged in"]);
        exit;
    }

    $pdo->beginTransaction();

    // Generate brs_no (e.g., BRS-25-000001)
    $today = date("y");
    $stmtCount = $pdo->prepare("
        SELECT COUNT(*)+1 AS seq 
        FROM reservation_borrowing 
        WHERE YEAR(created_at) = YEAR(CURDATE())
    ");
    $stmtCount->execute();
    $seq = str_pad($stmtCount->fetchColumn(), 6, "0", STR_PAD_LEFT);
    $brs_no = "BRS-" . $today . "-" . $seq;

    // Insert into reservation_borrowing
    $stmt = $pdo->prepare("
        INSERT INTO reservation_borrowing 
        (brs_no, user_ID, date_of_use, time_of_use, date_of_return, time_of_return, purpose) 
        VALUES (:brs_no, :user_ID, :date_of_use, :time_of_use, :date_of_return, :time_of_return, :purpose)
    ");
    $stmt->execute([
        ":brs_no"        => $brs_no,
        ":user_ID"       => $user_ID,
        ":date_of_use"   => $dateUsed,
        ":time_of_use"   => $timeUsed,
        ":date_of_return"=> $dateReturn,
        ":time_of_return"=> $timeReturn,
        ":purpose"       => $purpose
    ]);

    $brs_ID = $pdo->lastInsertId();

    // Insert into brs_asset
    $stmtAsset = $pdo->prepare("
        INSERT INTO brs_asset (brs_ID, asset_ID, qty_brs, UOM_brs) 
        VALUES (:brs_ID, :asset_ID, :qty_brs, :UOM_brs)
    ");
    $stmtUpdate = $pdo->prepare("UPDATE asset SET asset_status = 'pending' WHERE asset_ID = :asset_ID");

    // Prepare property card and record statements
    $stmtCheckCard = $pdo->prepare("SELECT property_card_ID FROM property_card WHERE asset_ID = :asset_ID");
    $stmtInsertCard = $pdo->prepare("INSERT INTO property_card (asset_ID) VALUES (:asset_ID)");
    $stmtInsertRecord = $pdo->prepare("
        INSERT INTO property_card_record 
        (property_card_ID, reference_type, reference_ID, officer_user_ID, price_amount, remarks) 
        VALUES (:property_card_ID, :reference_type, :reference_ID, :officer_user_ID, :price_amount, :remarks)
    ");

    // Fetch asset price
    $stmtAssetPrice = $pdo->prepare("SELECT price_amount FROM asset WHERE asset_ID = :asset_ID");
    $stmtRoom = $pdo->prepare("SELECT room_ID FROM asset WHERE asset_ID = :asset_ID");


    foreach ($items as $item) {
        $asset_ID = $item['description'] ?? null;
        $qty      = $item['quantity'] ?? 1;
        $uom      = $item['uom'] ?? null;

        if (!$asset_ID) continue;

        // Insert asset reservation
        $stmtAsset->execute([
            ":brs_ID"   => $brs_ID,
            ":asset_ID" => $asset_ID,
            ":qty_brs"  => $qty,
            ":UOM_brs"  => $uom
        ]);

        // Update asset status
        $stmtUpdate->execute([":asset_ID" => $asset_ID]);

        // Ensure property card exists
        $stmtCheckCard->execute([":asset_ID" => $asset_ID]);
        $property_card_ID = $stmtCheckCard->fetchColumn();

        if (!$property_card_ID) {
            $stmtInsertCard->execute([":asset_ID" => $asset_ID]);
            $property_card_ID = $pdo->lastInsertId();
        }

        // Get asset price
        $stmtAssetPrice->execute([":asset_ID" => $asset_ID]);
        $price_amount = $stmtAssetPrice->fetchColumn() ?: 0;

        // --- Fetch current room_ID of the asset ---
        $stmtRoom->execute([":asset_ID" => $asset_ID]);
        $currentRoomID = $stmtRoom->fetchColumn() ?: null;

        // --- Insert property card record (with room tracking) ---
        $stmtInsertRecord = $pdo->prepare("
            INSERT INTO property_card_record 
            (property_card_ID, reference_type, reference_ID, officer_user_ID, room_ID, price_amount, remarks)
            VALUES (:property_card_ID, :reference_type, :reference_ID, :officer_user_ID, :room_ID, :price_amount, :remarks)
        ");

        $stmtInsertRecord->execute([
            ":property_card_ID" => $property_card_ID,
            ":reference_type"   => 'BRS',
            ":reference_ID"     => $brs_no,
            ":officer_user_ID"  => $user_ID,
            ":room_ID"          => $currentRoomID,
            ":price_amount"     => $price_amount,
            ":remarks"          => 'Borrow'
        ]);

    }

    $pdo->commit();

    // Send Notification to Admins & Super-Admins
    $adminQuery = $pdo->query("
        SELECT account_ID 
        FROM account a 
        JOIN role r ON a.role_ID = r.role_ID 
        WHERE (r.role_name = 'Super-Admin' OR r.role_name = 'Admin') 
        AND r.role_status = 'active'
    ");
    $admins = $adminQuery->fetchAll(PDO::FETCH_COLUMN);

    $title = "New Borrowing Request Submitted";
    $message = "A new borrowing request ({$brs_no}) has been submitted and is awaiting approval.";
    $module = "BRS";

    if (!empty($admins)) {
        foreach ($admins as $adminAccountID) {
            sendNotification($pdo, $title, $message, $adminAccountID, $user_ID, $module, $brs_no);
        }
    } else {
        // Fallback broadcast if no admins found
        sendNotification($pdo, $title, $message, null, $user_ID, $module, $brs_no);
    }

     // Email Admins and Super-Admins ===
    $adminEmailsQuery = $pdo->query("
        SELECT kld.kld_email
        FROM account a
        JOIN role r ON a.role_ID = r.role_ID
        JOIN kld ON a.kld_ID = kld.kld_ID
        WHERE (r.role_name = 'Super-Admin' OR r.role_name = 'Admin')
        AND r.role_status = 'active'
        AND kld.kld_email IS NOT NULL
    ");
    $adminEmails = $adminEmailsQuery->fetchAll(PDO::FETCH_COLUMN);

    $emailSubject = "BRS Created: {$brs_no}";
    $emailBody = "
        <p>Hello,</p>
        <p>A new Reservation and Borrowing Request (<strong>{$brs_no}</strong>) has just been created by a user.</p>
        <p>Please check the system for more details.</p>
        <p>Regards,<br>IMS Admin</p>
    ";

    foreach ($adminEmails as $email) {
        sendEmail($email, $emailSubject, $emailBody);
    }

    echo json_encode([
        "success" => true,
        "message" => "Reservation saved successfully and recorded in property card",
        "brs_no"  => $brs_no
    ]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
