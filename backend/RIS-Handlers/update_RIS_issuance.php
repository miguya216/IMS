<?php
// update_RIS_issuance.php
header("Content-Type: application/json");
require_once __DIR__ . '/../conn.php';
require_once __DIR__ . '/../Notification-Handlers/notif_config.php';
require_once __DIR__ . '/../email_config.php';
session_start();

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
    $pdo->beginTransaction();

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data["ris_ID"])) {
        echo json_encode(["status" => "error", "message" => "Invalid input"]);
        exit;
    }

    $ris_ID = intval($data["ris_ID"]);
    $items = $data["items"] ?? [];
    $consumables = $data["consumables"] ?? [];
    $ris_status = isset($data["ris_status"]) ? trim($data["ris_status"]) : null;

    // Get RIS info (creator + ris_no) — using ris_ID as source of truth
    $stmt = $pdo->prepare("SELECT ris_no, account_ID FROM requisition_and_issue WHERE ris_ID = ?");
    $stmt->execute([$ris_ID]);
    $risInfo = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$risInfo) {
        echo json_encode(["status" => "error", "message" => "RIS not found"]);
        exit;
    }

    $ris_no = $risInfo["ris_no"];
    $creatorID = $risInfo["account_ID"];
    $adminID = $_SESSION["account_ID"] ?? null; // the user performing update

    // Update ris_assets (if any)
    if (!empty($items)) {
        $stmt = $pdo->prepare("
            UPDATE ris_assets
            SET quantity_issuance = :quantity_issuance, ris_remarks = :ris_remarks
            WHERE ris_asset_ID = :ris_asset_ID AND ris_ID = :ris_ID
        ");

        foreach ($items as $item) {
            $stmt->execute([
                ":quantity_issuance" => $item["quantity_issuance"] ?? null,
                ":ris_remarks" => $item["ris_remarks"] ?? null,
                ":ris_asset_ID" => $item["item_id"],
                ":ris_ID" => $ris_ID
            ]);
        }
    }


    // Update ris_consumables (and adjust stock + update stock_card_record when needed)
    // We must deduct ONLY the difference between new issued qty and previously stored issued qty.
    if (!empty($consumables)) {

        // --- 1) Fetch previous issuance values for comparison (before we update rows) ---
        $stmtPrev = $pdo->prepare("
            SELECT ris_consumable_ID, quantity_issuance
            FROM ris_consumables
            WHERE ris_ID = ?
        ");
        $stmtPrev->execute([$ris_ID]);
        $previousIssuance = [];
        foreach ($stmtPrev->fetchAll(PDO::FETCH_ASSOC) as $row) {
            // store previous issuance keyed by ris_consumable_ID
            $previousIssuance[$row['ris_consumable_ID']] = $row['quantity_issuance'] ?? null;
        }

        // --- 2) Update ris_consumables with incoming values ---
        $stmtUpdateRIS = $pdo->prepare("
            UPDATE ris_consumables
            SET quantity_issuance = :quantity_issuance, ris_remarks = :ris_remarks
            WHERE ris_consumable_ID = :ris_consumable_ID AND ris_ID = :ris_ID
        ");

        foreach ($consumables as $c) {
            $quantity_issuance = isset($c["quantity_issuance"]) && $c["quantity_issuance"] !== ""
                ? floatval($c["quantity_issuance"])
                : null;

            $stmtUpdateRIS->execute([
                ":quantity_issuance"     => $quantity_issuance,
                ":ris_remarks"           => $c["ris_remarks"] ?? null,
                ":ris_consumable_ID"     => $c["item_id"],
                ":ris_ID"                => $ris_ID
            ]);
        }

        // --- 3) Re-fetch the updated ris_consumables rows (so we can compare new vs old) ---
        $stmtGet = $pdo->prepare("
            SELECT rc.ris_consumable_ID, rc.consumable_ID, rc.quantity_issuance, rc.ris_remarks, c.total_quantity
            FROM ris_consumables rc
            JOIN consumable c ON rc.consumable_ID = c.consumable_ID
            WHERE rc.ris_ID = ?
        ");
        $stmtGet->execute([$ris_ID]);
        $issuedItems = $stmtGet->fetchAll(PDO::FETCH_ASSOC);

        // --- 4) Prepare statements used inside loop (prepare once) ---
        $selectStockCard = $pdo->prepare("SELECT stock_card_ID FROM stock_card WHERE consumable_ID = :cid LIMIT 1");
        $insertStockCard = $pdo->prepare("INSERT INTO stock_card (consumable_ID) VALUES (:cid)");
        $updateConsumable = $pdo->prepare("
            UPDATE consumable
            SET total_quantity = GREATEST(total_quantity - :qty, 0)
            WHERE consumable_ID = :cid
        ");
        $selectBalance = $pdo->prepare("SELECT total_quantity FROM consumable WHERE consumable_ID = :cid");
        $selectRecordId = $pdo->prepare("
            SELECT record_ID
            FROM stock_card_record
            WHERE stock_card_ID = :stock_card_ID
            AND reference_type = 'RIS'
            AND reference_ID = :reference_ID
            ORDER BY record_ID DESC
            LIMIT 1
        ");
        $updateRecordById = $pdo->prepare("
            UPDATE stock_card_record
            SET quantity_out = :qty_out, balance = :balance
            WHERE record_ID = :record_ID
        ");
        $insertRecord = $pdo->prepare("
            INSERT INTO stock_card_record 
            (stock_card_ID, reference_type, reference_ID, officer_user_ID, quantity_in, quantity_out, balance, remarks) 
            VALUES (:stock_card_ID, 'RIS', :reference_ID, :officer_user_ID, 0, :qty_out, :balance, :remarks)
        ");

        // --- 5) Loop through updated items, compute difference, and deduct only diff ---
        foreach ($issuedItems as $it) {
            $ris_consumable_ID = (int)$it['ris_consumable_ID'];
            $consumable_ID = (int)$it['consumable_ID'];
            $new_qty = $it['quantity_issuance'] !== null ? (float)$it['quantity_issuance'] : null;
            $old_qty = array_key_exists($ris_consumable_ID, $previousIssuance) ? $previousIssuance[$ris_consumable_ID] : null;
            $old_qty = $old_qty !== null ? (float)$old_qty : null;

            // difference = how much we should deduct now (new - old)
            $diff = ($new_qty ?? 0) - ($old_qty ?? 0);
            $user_remark = trim($it['ris_remarks'] ?? '');

            // Skip if there is no positive difference (nothing new to deduct)
            if ($diff <= 0) continue;

            // ensure stock_card exists
            $selectStockCard->execute([":cid" => $consumable_ID]);
            $stockCard = $selectStockCard->fetchColumn();

            if (!$stockCard) {
                $insertStockCard->execute([":cid" => $consumable_ID]);
                $stockCard = $pdo->lastInsertId();
            }

            // deduct only the difference from consumable total quantity
            $updateConsumable->execute([":qty" => $diff, ":cid" => $consumable_ID]);

            // get new balance
            $selectBalance->execute([":cid" => $consumable_ID]);
            $balance = (int)$selectBalance->fetchColumn();

            // update or insert stock_card_record for this RIS & stock_card
            $selectRecordId->execute([
                ":stock_card_ID" => $stockCard,
                ":reference_ID" => $ris_no
            ]);
            $recordID = $selectRecordId->fetchColumn();

            if ($recordID) {
                // update record to reflect the cumulative issued qty (new_qty) and new balance
                $updateRecordById->execute([
                    ":qty_out" => $new_qty !== null ? $new_qty : 0,
                    ":balance" => $balance,
                    ":record_ID" => $recordID
                ]);
            } else {
                // insert a new record that shows the current issued qty for this RIS
                $insertRecord->execute([
                    ":stock_card_ID" => $stockCard,
                    ":reference_ID" => $ris_no,
                    ":officer_user_ID" => $adminID,
                    ":qty_out" => $new_qty !== null ? $new_qty : 0,
                    ":balance" => $balance,
                    ":remarks" => !empty($user_remark) ? $user_remark : "Issued via RIS ($ris_status)"
                ]);
            }
        }
    }


    // Update RIS status
    if ($ris_status) {
        $stmt = $pdo->prepare("UPDATE requisition_and_issue SET ris_status = :status WHERE ris_ID = :ris_ID");
        $stmt->execute([":status" => $ris_status, ":ris_ID" => $ris_ID]);
    }

    // Notify creator (NOT admin)
    $title = "RIS Updated";
    $message = "Your Requisition and Issue Slip ({$ris_no}) has been updated. Status: " . strtoupper($ris_status ?: "unchanged") . ".";
    $module = "RIS";

    sendNotification($pdo, $title, $message, $creatorID, $adminID, $module, $ris_no);

    // Fetch creator's email
    $stmtEmail = $pdo->prepare("
        SELECT k.kld_email 
        FROM account a
        JOIN kld k ON a.kld_ID = k.kld_ID
        WHERE a.account_ID = ?
        LIMIT 1
    ");
    $stmtEmail->execute([$creatorID]);
    $creatorEmail = $stmtEmail->fetchColumn();

    if ($creatorEmail) {
        $emailSubject = "RIS Updated: {$ris_no}";
        $emailBody = "
            <p>Hello,</p>
            <p>Your Requisition and Issue Slip <strong>{$ris_no}</strong> has been updated by an Admin.</p>
            <p>Status: <strong>" . strtoupper($ris_status ?: "unchanged") . "</strong></p>
            <p>Please check the system for details.</p>
            <p>Regards,<br>IMS Admin</p>
        ";
        sendEmail($creatorEmail, $emailSubject, $emailBody);
    }

    $pdo->commit();

    echo json_encode([
        "status" => "success",
        "message" => "Issuance updated successfully (Status: " . ($ris_status ?: "unchanged") . ")"
    ]);
    
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["status" => "error", "message" => "Server error: " . $e->getMessage()]);
}
?>
