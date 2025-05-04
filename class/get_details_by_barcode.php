<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/IMS/class/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['barcode_path'])) {
    $inventory_tag = $_POST['barcode_path']; // This is actually the inventory tag

    $sql = "
       SELECT 
    bc.barcode_image_path,
    a.inventory_tag, 
    a.serial_number,
    at.asset_type,
    b.brand_name AS brand,
    CONCAT(u.f_name, ' ', u.m_name, ' ', u.l_name) AS responsible_user,
    un.unit_name AS unit,
    qr.qr_image_path
FROM asset a
JOIN barcode bc ON a.barcode_ID = bc.barcode_ID
JOIN asset_type at ON a.asset_type_ID = at.asset_type_ID
JOIN brand b ON a.brand_ID = b.brand_ID
JOIN user u ON a.responsible_user_ID = u.user_ID
JOIN unit un ON u.unit_ID = un.unit_ID
LEFT JOIN qr_code qr ON a.qr_ID = qr.qr_ID
WHERE a.inventory_tag = ?
LIMIT 1;
";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$inventory_tag]);
    $asset = $stmt->fetch();

    echo json_encode(['success' => (bool) $asset, 'asset' => $asset ?: null]);
}
?>
