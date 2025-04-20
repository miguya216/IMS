<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/ims/class/asset/fetch_data.php';

header('Content-Type: application/json');

if (isset($_GET['serial'])) {
    $serial = $_GET['serial'];
    $inventory = new Inventory($pdo);
    $asset = $inventory->fetchAssetBySerial($serial);

    if ($asset) {
        echo json_encode($asset);
    } else {
        echo json_encode(['error' => 'Asset not found', 'serial_received' => $serial]);
    }
} else {
    echo json_encode(['error' => 'No serial received']);
}
?>
