<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/ims/class/asset/asset_handler.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['serial'])) {
    $serial = $_POST['serial'];
    $deleter = new DeleteAsset();
    echo $deleter->deleteAssetDetails($serial);
} else {
    echo "Invalid request.";
}
?>