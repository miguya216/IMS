<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/ims/class/asset/asset_handler.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['serial'])) {
    $serial = $_POST['serial'];

     // Get full name from session for logging
    $response_for_this_log = isset($_SESSION['full_name']) ? $_SESSION['full_name'] : 'Unknown User';

    $deleter = new DeleteAsset();
    echo $deleter->deleteAssetDetails($response_for_this_log, $serial);
} else {
    echo "Invalid request.";
}
?>