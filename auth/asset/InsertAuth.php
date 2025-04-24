<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\asset\asset_handler.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $Assets = new Asset();

    $brand = ($_POST['brand'] ?? '') === '__new_brand__' ? ($_POST['new_brand'] ?? null) : ($_POST['brand'] ?? null);
    $responsibleTo = ($_POST['responsibleTo'] ?? '') === '__new_responsibleTo__' ? ($_POST['new_responsibleTo'] ?? null) : ($_POST['responsibleTo'] ?? null);
    $unit = ($_POST['unit'] ?? '') === '__new_unit__' ? ($_POST['new_unit'] ?? null) : ($_POST['unit'] ?? null);
    $asset = ($_POST['asset'] ?? '') === '__new_asset_type__' ? ($_POST['new_asset'] ?? null) : ($_POST['asset'] ?? null);
    
    $response = $Assets->insertAsset(
        $_POST['inventory_tag'], 
        $_POST['serial_num'], 
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