<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/IMS/class/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['barcode_path'])) {
    $barcode_path = $_POST['barcode_path'];

    $sql = "
    SELECT 
        bc.barcode_image_path AS barcode_img_path,
        a.inventory_tag, a.serial_number,
        at.asset_type,
        b.brand_name AS brand,
        u.full_name AS responsible_user,
        un.unit_name AS unit,
        qr.qr_image_path AS qr_path
    FROM asset a
    JOIN barcode bc ON a.barcode_image_path_ID = bc.barcode_image_path_ID
    JOIN asset_type at ON a.asset_type_ID = at.asset_type_ID
    JOIN brand b ON a.brand_ID = b.brand_ID
    JOIN user u ON a.responsible_user_ID = u.user_ID
    JOIN unit un ON u.unit_ID = un.unit_ID
    LEFT JOIN qr_code qr ON a.qr_image_path_ID = qr.qr_image_path_ID
    WHERE bc.barcode_image_path = ?
    LIMIT 1
";


    $stmt = $pdo->prepare($sql);
    $stmt->execute([$barcode_path]);
    $asset = $stmt->fetch();

    echo json_encode(['success' => (bool) $asset, 'asset' => $asset ?: null]);
}
?>
