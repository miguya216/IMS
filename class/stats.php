<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/ims/class/conn.php';
header('Content-Type: application/json');

try {
    $totalAssets = $pdo->query("SELECT COUNT(*) FROM asset")->fetchColumn();
    $activeAssets = $pdo->query("SELECT COUNT(*) FROM asset WHERE asset_status = 'active'")->fetchColumn();
    $inactiveAssets = $pdo->query("SELECT COUNT(*) FROM asset WHERE asset_status = 'inactive'")->fetchColumn();
    $totalUsers = $pdo->query("SELECT COUNT(*) FROM user")->fetchColumn();

    $stmt = $pdo->query("
        SELECT at.asset_type, COUNT(a.asset_ID) as count 
        FROM asset a 
        JOIN asset_type at ON a.asset_type_ID = at.asset_type_ID 
        GROUP BY at.asset_type
    ");
    $assetsByType = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Additional stats
    $totalReturns = $pdo->query("SELECT COUNT(*) FROM return_table")->fetchColumn();

    $mostReturnedType = $pdo->query("
        SELECT at.asset_type, COUNT(rt.return_ID) as return_count
        FROM return_table rt
        JOIN asset a ON rt.asset_ID = a.asset_ID
        JOIN asset_type at ON a.asset_type_ID = at.asset_type_ID
        GROUP BY at.asset_type
        ORDER BY return_count DESC
        LIMIT 1
    ")->fetch(PDO::FETCH_ASSOC);

    $totalRequests = $pdo->query("SELECT COUNT(*) FROM request_form")->fetchColumn();

    $mostRequestedItem = $pdo->query("
        SELECT item_name, COUNT(*) as request_count
        FROM request_form
        GROUP BY item_name
        ORDER BY request_count DESC
        LIMIT 1
    ")->fetch(PDO::FETCH_ASSOC);

    $totalUnits = $pdo->query("SELECT COUNT(*) FROM unit")->fetchColumn();
    $totalRoles = $pdo->query("SELECT COUNT(*) FROM role")->fetchColumn();

    // Final combined output
    echo json_encode([
        "totalAssets" => $totalAssets,
        "activeAssets" => $activeAssets,
        "inactiveAssets" => $inactiveAssets,
        "totalUsers" => $totalUsers,
        "assetsByType" => $assetsByType,
        "totalReturns" => $totalReturns,
        "mostReturnedType" => $mostReturnedType,
        "totalRequests" => $totalRequests,
        "mostRequestedItem" => $mostRequestedItem,
        "totalUnits" => $totalUnits,
        "totalRoles" => $totalRoles
    ]);
} catch (Exception $e) {
    echo json_encode([
        "error" => "Failed to fetch stats",
        "message" => $e->getMessage()
    ]);
}
