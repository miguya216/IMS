<?php
session_start();
require_once "../conn.php";

header('Content-Type: application/json');

// Validate session
if (!isset($_SESSION['user']['user_ID'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$userID = $_SESSION['user']['user_ID'];

// STEP 1 — Get the unit_ID of logged-in user
$getUnit = $pdo->prepare("
    SELECT unit_ID 
    FROM user 
    WHERE user_ID = ?
");
$getUnit->execute([$userID]);
$userUnit = $getUnit->fetchColumn();

if (!$userUnit) {
    echo json_encode([]);
    exit;
}

// STEP 2 — Fetch consumables consumed by this unit
$sql = $pdo->prepare("
    SELECT 
        ris.ris_no AS transaction_no,
        c.consumable_name,
        ris.created_at AS date_consumed,
        rc.quantity_issuance AS quantity
    FROM ris_consumables rc
    INNER JOIN consumable c 
        ON rc.consumable_ID = c.consumable_ID
    INNER JOIN requisition_and_issue ris 
        ON rc.ris_ID = ris.ris_ID
    INNER JOIN account a 
        ON ris.account_ID = a.account_ID
    INNER JOIN user u 
        ON a.user_ID = u.user_ID
    WHERE 
        u.unit_ID = ?
        AND rc.quantity_issuance > 0
        AND ris.ris_status = 'completed'
    ORDER BY ris.created_at DESC
");
$sql->execute([$userUnit]);

$rows = $sql->fetchAll();

echo json_encode($rows);
exit;
?>
