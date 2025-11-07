<?php
require_once __DIR__ . '/../conn.php';
header("Content-Type: application/json; charset=UTF-8");

try {
    // ===== SUMMARY =====
    $stmt = $pdo->query("SELECT COUNT(*) FROM asset WHERE asset_status != 'inactive'");
    $totalAssets = $stmt->fetchColumn();

    $stmt = $pdo->query("SELECT COUNT(*) FROM consumable WHERE consumable_status = 'active'");
    $totalConsumables = $stmt->fetchColumn();

    $stmt = $pdo->query("SELECT COUNT(*) FROM user WHERE user_status = 'active'");
    $totalUsers = $stmt->fetchColumn();

    // ===== REQUISITION =====
    $reqCounts = $pdo->query("
        SELECT 
            SUM(ris_status = 'pending') AS pending,
            SUM(ris_status = 'cancelled') AS cancelled,
            SUM(ris_status = 'issuing') AS issuing
        FROM requisition_and_issue
    ")->fetch(PDO::FETCH_ASSOC);

    // ===== BORROWING =====
    $brsCounts = $pdo->query("
        SELECT 
            SUM(brs_status = 'pending') AS pending,
            SUM(brs_status = 'cancelled') AS cancelled,
            SUM(brs_status = 'issuing') AS issuing
        FROM reservation_borrowing
    ")->fetch(PDO::FETCH_ASSOC);

    // ===== ASSET BY STATUS =====
    $assetByStatus = $pdo->query("
        SELECT asset_status, COUNT(*) AS count 
        FROM asset 
        WHERE asset_status IN ('active', 'inactive')
        GROUP BY asset_status
    ")->fetchAll(PDO::FETCH_ASSOC);

    // ===== ASSET BY TYPE =====
    $assetByType = $pdo->query("
        SELECT at.asset_type, COUNT(a.asset_ID) AS count
        FROM asset a
        JOIN asset_type at ON a.asset_type_ID = at.asset_type_ID
        GROUP BY at.asset_type
    ")->fetchAll(PDO::FETCH_ASSOC);

    // ===== ASSET BY BRAND =====
    $assetByBrand = $pdo->query("
        SELECT b.brand_name, COUNT(a.asset_ID) AS count
        FROM asset a
        JOIN brand b ON a.brand_ID = b.brand_ID
        GROUP BY b.brand_name
    ")->fetchAll(PDO::FETCH_ASSOC);

    // ===== BORROWED ASSET LISTING =====
    $borrowedAssets = $pdo->query("
        SELECT 
            rb.brs_no,
            u.f_name, u.l_name,
            a.property_tag,
            a.kld_property_tag,
            rb.date_of_return
        FROM reservation_borrowing rb
        JOIN brs_asset ba ON rb.brs_ID = ba.brs_ID
        JOIN asset a ON ba.asset_ID = a.asset_ID
        JOIN user u ON rb.user_ID = u.user_ID
        WHERE rb.brs_status IN ('on-going')
          AND rb.date_of_return >= CURDATE()
        ORDER BY rb.date_of_return ASC
        LIMIT 7
    ")->fetchAll(PDO::FETCH_ASSOC);

    // ===== CONSUMABLES LOW STOCK =====
    $lowStock = $pdo->query("
        SELECT 
            consumable_name,
            total_quantity,
            unit_of_measure
        FROM consumable
        WHERE total_quantity < 10
        ORDER BY total_quantity ASC
        LIMIT 8
    ")->fetchAll(PDO::FETCH_ASSOC);

    // if none below 10 → show 7 lowest
    if (empty($lowStock)) {
        $lowStock = $pdo->query("
            SELECT 
                consumable_name,
                total_quantity,
                unit_of_measure
            FROM consumable
            ORDER BY total_quantity ASC
            LIMIT 8
        ")->fetchAll(PDO::FETCH_ASSOC);
    }

    // ===== OUTPUT =====
    echo json_encode([
        "success" => true,
        "summary" => [
            "totalAssets" => $totalAssets,
            "totalConsumables" => $totalConsumables,
            "totalUsers" => $totalUsers
        ],
        "requisition" => $reqCounts,
        "borrowing" => $brsCounts,
        "assetByStatus" => $assetByStatus,
        "assetByType" => $assetByType,
        "assetByBrand" => $assetByBrand,
        "borrowedAssets" => $borrowedAssets,
        "lowStockConsumables" => $lowStock
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>
