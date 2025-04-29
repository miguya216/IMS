<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\reference\reference_handler.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $entity_type = $_POST['entity_type'];
    $entity_ID = $_POST['entity_ID'];
    $entity_name = $_POST['entity_name'];

    switch ($entity_type) {
        case "role":
            $ref = new UpdateRole();
            $response = $ref->updateRole($entity_ID, $entity_name); // Corrected here
            break;

        case "unit":
            $ref = new UpdateUnit();
            $response = $ref->updateUnit($entity_ID, $entity_name); // Corrected here
            break;

        case "asset_type":
            $ref = new UpdateAssetType();
            $response = $ref->updateAssetType($entity_ID, $entity_name); // Corrected here
            break;

        case "brand":
            $ref = new UpdateBrand();
            $response = $ref->updateBrand($entity_ID, $entity_name); // Corrected here
            break;

        default:
            echo "Invalid entity type!";
            exit;
    }

    // Handle response
    if ($response === true) {
        echo "success";
    } elseif ($response === "duplicate") {
        echo "duplicate";
    } else {
        echo "Error: " . $response;
    }
}
?>
