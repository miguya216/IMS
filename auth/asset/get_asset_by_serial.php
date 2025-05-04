<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/ims/class/fetch_data.php';

header('Content-Type: application/json');

if (isset($_GET['serial'])) {
    $serial = $_GET['serial'];
    $inventory = new Inventory($pdo);
    $asset = $inventory->fetchAssetBySerial($serial);

    if ($asset) {
        echo json_encode([
            'status' => 'success',
            'data' => [
                'inventory_tag' => $asset['inventory_tag'],
                'serial_number' => $asset['serial_number'],
                'asset_type_ID' => $asset['asset_type_ID'],
                'brand_ID' => $asset['brand_ID'],
                'responsible_user' => $asset['responsible_user'],
                'unit_ID' => $asset['unit_ID'],
                'qr_path' => $asset['qr_image_path'],
                'barcode_path' => $asset['barcode_image_path']
            ]
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Asset not found', 'serial_received' => $serial]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'No serial received']);
}
?>
