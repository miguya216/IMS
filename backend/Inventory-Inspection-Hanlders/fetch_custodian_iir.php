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
            iir.iir_id as iir_id,
            iir.iir_no AS iir_no,
            CONCAT(u.f_name, ' ', COALESCE(u.m_name, ''), ' ', u.l_name) AS employee_name,
            r.room_number AS room_no,
            un.unit_name AS unit,
            ro.role_name AS role
        FROM inventory_inspection_report iir
        INNER JOIN user u ON iir.user_ID = u.user_ID
        LEFT JOIN unit un ON u.unit_ID = un.unit_ID
        LEFT JOIN account acc ON acc.user_ID = u.user_ID
        LEFT JOIN role ro ON acc.role_ID = ro.role_ID
        LEFT JOIN iir_asset ia ON ia.iir_ID = iir.iir_ID
        LEFT JOIN asset a ON ia.asset_ID = a.asset_ID
        LEFT JOIN room r ON a.room_ID = r.room_ID
        WHERE iir.iir_status = 'active'
        AND iir.user_ID = :user_ID   -- ← FIXED
        GROUP BY iir.iir_ID
        ORDER BY iir.created_at DESC
    ");

    $stmt->execute([":user_ID" => $user_ID]);

    $iirReports = $stmt->fetchAll();

    echo json_encode($iirReports);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>