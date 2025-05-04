<?php
// import_csv.php

// Include necessary database connection (Assuming you already have a DB connection file)
include('conn.php');

// Function to check for duplicates
function checkDuplicate($pdo, $inventoryTag, $serialNumber) {
    $stmt = $pdo->prepare("SELECT asset_ID FROM asset WHERE inventory_tag = ? OR serial_number = ?");
    $stmt->execute([$inventoryTag, $serialNumber]);
    return $stmt->rowCount() > 0;
}

// Handle CSV file upload and import
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['csv_file'])) {
    $file = $_FILES['csv_file']['tmp_name'];

    if (($handle = fopen($file, "r")) !== FALSE) {
        // Skip the header row
        fgetcsv($handle);

        // Prepare SQL statements
        $insertAssetStmt = $pdo->prepare("INSERT INTO asset (inventory_tag, serial_number, brand_ID, asset_type_ID, responsible_user_ID, unit_ID, barcode_ID, qr_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

        $response = ['success' => false, 'message' => ''];

        // Loop through CSV rows and import
        while (($data = fgetcsv($handle)) !== FALSE) {
            // Extract data from CSV
            $inventoryTag = $data[0];
            $serialNumber = $data[1];
            $brandName = $data[2];
            $assetTypeName = $data[3];
            $responsibleTo = $data[4];
            $unitName = $data[5];

            // Check for duplicate
            if (checkDuplicate($pdo, $inventoryTag, $serialNumber)) {
                $response['message'] = "Duplicate data found for Inventory Tag: $inventoryTag or Serial Number: $serialNumber.";
                echo json_encode($response);
                exit();
            }

            // Get brand ID
            $brandStmt = $pdo->prepare("SELECT brand_ID FROM brand WHERE brand_name = ?");
            $brandStmt->execute([$brandName]);
            $brandRow = $brandStmt->fetch(PDO::FETCH_ASSOC);
            if ($brandRow) {
                $brandID = $brandRow['brand_ID'];
            } else {
                // Handle brand not found (create a new brand or return error)
                continue; // Skip this row if brand is not found
            }

            // Get asset type ID
            $assetTypeStmt = $pdo->prepare("SELECT asset_type_ID FROM asset_type WHERE asset_type = ?");
            $assetTypeStmt->execute([$assetTypeName]);
            $assetTypeRow = $assetTypeStmt->fetch(PDO::FETCH_ASSOC);
            if ($assetTypeRow) {
                $assetTypeID = $assetTypeRow['asset_type_ID'];
            } else {
                // Handle asset type not found (create a new asset type or return error)
                continue; // Skip this row if asset type is not found
            }

            // Get responsible user ID
            $userStmt = $pdo->prepare("SELECT user_ID FROM user WHERE CONCAT(f_name, ' ', l_name) = ?");
            $userStmt->execute([$responsibleTo]);
            $userRow = $userStmt->fetch(PDO::FETCH_ASSOC);
            if ($userRow) {
                $responsibleUserID = $userRow['user_ID'];
            } else {
                // Handle responsible user not found (create a new user or return error)
                continue; // Skip this row if responsible user is not found
            }

            // Get unit ID
            $unitStmt = $pdo->prepare("SELECT unit_ID FROM unit WHERE unit_name = ?");
            $unitStmt->execute([$unitName]);
            $unitRow = $unitStmt->fetch(PDO::FETCH_ASSOC);
            if ($unitRow) {
                $unitID = $unitRow['unit_ID'];
            } else {
                // Handle unit not found (create a new unit or return error)
                continue; // Skip this row if unit is not found
            }

            // Assume barcode and QR are already generated and available
            $barcodeID = 1; // Placeholder, use actual logic for barcode ID generation
            $qrID = 1; // Placeholder, use actual logic for QR ID generation

            // Insert asset into database
            $insertAssetStmt->execute([
                $inventoryTag, $serialNumber, $brandID, $assetTypeID, $responsibleUserID, $unitID, $barcodeID, $qrID
            ]);
        }

        fclose($handle);

        $response['success'] = true;
        $response['message'] = 'CSV data imported successfully.';
        echo json_encode($response);
    } else {
        $response['message'] = 'Failed to open CSV file.';
        echo json_encode($response);
    }
} else {
    $response['message'] = 'No file uploaded or invalid request.';
    echo json_encode($response);
}
?>
