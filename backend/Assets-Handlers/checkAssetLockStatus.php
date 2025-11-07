<?php
require_once __DIR__ . '/../conn.php';

$data = json_decode(file_get_contents("php://input"), true);
$assetIDs = $data['ids'] ?? [];

if (empty($assetIDs)) {
  echo json_encode(['locked' => [], 'hasLocked' => false]);
  exit;
}

$placeholders = implode(',', array_fill(0, count($assetIDs), '?'));

$sql = "
  SELECT a.asset_ID
  FROM asset a
  WHERE a.asset_ID IN ($placeholders)
  AND (
    -- Active BRS
    a.asset_ID IN (
      SELECT ba.asset_ID
      FROM brs_asset ba
      JOIN reservation_borrowing b ON b.brs_ID = ba.brs_ID
      WHERE LOWER(b.brs_status) NOT IN ('completed', 'cancelled')
    )
    OR
    -- Active RIS
    a.kld_property_tag IN (
      SELECT TRIM(ra.asset_property_no)
      FROM ris_assets ra
      JOIN requisition_and_issue r ON r.ris_ID = ra.ris_ID
      WHERE LOWER(r.ris_status) NOT IN ('completed', 'cancelled')
      AND ra.asset_property_no IS NOT NULL
    )
  )
";

$stmt = $pdo->prepare($sql);
$stmt->execute($assetIDs);

$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
$locked = array_map(fn($r) => (int)$r['asset_ID'], $rows);

echo json_encode([
  'locked' => $locked,
  'hasLocked' => count($locked) > 0
]);
?>
