<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\reference\reference_handler.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {

    $id = $_POST['id'];
    $type = $_POST['type'];
    
    if ($type == 'role') {
        $role_ID = $_POST['role_ID'];
        $deleteRole = new DeleteRole();
        echo $deleteRole->deleteRole($role_ID);
    } elseif ($type == 'unit') {
        $unit_ID = $_POST['unit_ID'];
        $deleteUnit = new DeleteUnit();
        echo $deleteUnit->deleteUnit($unit_ID);
    } elseif ($type == 'asset_type') {
        $asset_type_ID = $_POST['asset_type_ID'];
        $deleteAsset_type = new DeleteAsset_type();
        echo $deleteAsset_type->deleteAsset_type($asset_type_ID);
    } elseif ($type == 'brand') {
        $brand_ID = $_POST['brand_ID'];
        $deleteBrand = new DeleteBrand();
        echo $deleteBrand->deleteBrand($brand_ID);
    }
}
?>
