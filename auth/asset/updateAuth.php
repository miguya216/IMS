<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\asset\asset_handler.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $Assets = new UpdateAsset();
    $response_for_this_log = $_POST['name'];
    // Just use posted values directly
    $serial_num = $_POST['serial'];
    $inventory_tag = $_POST['inventory_tag'];
    $asset = $_POST['asset'];
    $brand = $_POST['brand'];
    $responsibleTo = $_POST['responsibleTo'];
    $unit = $_POST['unit'];

    // Proceed with update using serial number as the unique ID
    $response = $Assets->updateAssetDetails(
        $response_for_this_log,
        $serial_num, 
        $asset, 
        $brand, 
        $responsibleTo, 
        $unit
    );

    if ($response === true) {
        echo "success";
    } elseif ($response === "duplicate") {
        echo "Item already exists!";
    } else {
        echo "Error: " . $response;
    }
}
?>
