<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\asset\asset_handler.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $Assets = new Asset();

    $response_for_this_log = $_POST['name'];
    // Handle new or existing values
    $brand = ($_POST['brand'] ?? '') === '__new_brand__' ? ($_POST['new_brand'] ?? null) : ($_POST['brand'] ?? null);
    $responsibleTo = ($_POST['responsibleTo'] ?? '') === '__new_responsibleTo__' ? null : ($_POST['responsibleTo'] ?? null);
    $unit = ($_POST['unit'] ?? '') === '__new_unit__' ? ($_POST['new_unit'] ?? null) : ($_POST['unit'] ?? null);
    $asset = ($_POST['asset'] ?? '') === '__new_asset_type__' ? ($_POST['new_asset'] ?? null) : ($_POST['asset'] ?? null);

    // Collect name only if adding new user
    $f_name = $m_name = $l_name = null;
    if ($responsibleTo === null && isset($_POST['new_responsibleTo_f'], $_POST['new_responsibleTo_m'], $_POST['new_responsibleTo_l'])) {
        $f_name = $_POST['new_responsibleTo_f'];
        $m_name = $_POST['new_responsibleTo_m'];
        $l_name = $_POST['new_responsibleTo_l'];
    }

    // Insert asset (with existing or new user)
    $response = $Assets->insertAsset(
        $response_for_this_log,
        $_POST['inventory_tag'], 
        $_POST['serial_num'], 
        $asset, 
        $brand, 
        $responsibleTo,
        $f_name, 
        $m_name, 
        $l_name, 
        $unit
    );

    // Response handling
    if ($response === true) {
        echo "success";
    } elseif ($response === "duplicate") {
        echo "Item already exists!";
    } else {
        echo "Error: " . $response;
    }
}
?>
