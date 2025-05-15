<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\conn.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Picqer\Barcode\BarcodeGeneratorPNG;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

class Asset {
    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function insertAsset($response_for_this_log, $inventory_tag, $serial_num, $asset_type, $brand, $responsibleTo, $f_name, $m_name, $l_name, $unit) {
        try {
            // Check for duplicates
            $checkStmt = $this->pdo->prepare("SELECT * FROM asset WHERE inventory_tag = ? OR serial_number = ?");
            $checkStmt->execute([$inventory_tag, $serial_num]);
            if ($checkStmt->rowCount() > 0) {
                return "duplicate";
            }
    
            // === Handle Asset Type and Brand ===
            if (is_numeric($brand)) {
                $stmt = $this->pdo->prepare("SELECT brand_ID, asset_type_id FROM brand WHERE brand_ID = ?");
                $stmt->execute([$brand]);
                $row = $stmt->fetch();
                $brand_id = $row['brand_ID'];
                $asset_type_id = $row['asset_type_id'];
            } else {
                if (is_numeric($asset_type)) {
                    $stmt = $this->pdo->prepare("SELECT asset_type_ID FROM asset_type WHERE asset_type_ID = ?");
                    $stmt->execute([$asset_type]);
                    $asset_type_id = $stmt->fetch()['asset_type_ID'];
                } else {
                    $insert = $this->pdo->prepare("INSERT INTO asset_type (asset_type) VALUES (?)");
                    $insert->execute([$asset_type]);
                    $asset_type_id = $this->pdo->lastInsertId();
                }
    
                $insert = $this->pdo->prepare("INSERT INTO brand (brand_name, asset_type_id) VALUES (?, ?)");
                $insert->execute([$brand, $asset_type_id]);
                $brand_id = $this->pdo->lastInsertId();
            }
    
            // === Handle User ===
            if (is_numeric($responsibleTo)) {
                // Existing user
                $stmt = $this->pdo->prepare("SELECT user_ID FROM user WHERE user_ID = ?");
                $stmt->execute([$responsibleTo]);
                $user = $stmt->fetch();
                if (!$user) return "Invalid user selected.";
                $user_id = $user['user_ID'];
            } else {
                // New user, handle unit first
                if (is_numeric($unit)) {
                    $unit_id = $unit;
                } else {
                    $insert = $this->pdo->prepare("INSERT INTO unit (unit_name) VALUES (?)");
                    $insert->execute([$unit]);
                    $unit_id = $this->pdo->lastInsertId();
                }
    
                $insert = $this->pdo->prepare("INSERT INTO user (f_name, m_name, l_name, unit_ID) VALUES (?, ?, ?, ?)");
                $insert->execute([$f_name, $m_name, $l_name, $unit_id]); 
                $user_id = $this->pdo->lastInsertId();
            }
    
            // === Barcode Generation ===
            $generator = new BarcodeGeneratorPNG();
            $barcodeData = $generator->getBarcode($inventory_tag, $generator::TYPE_CODE_128);
            $barcodeFilename = uniqid('barcode_') . '.png';
            $barcodePath = 'barcodes/' . $barcodeFilename;
            file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/ims/' . $barcodePath, $barcodeData);
    
            $stmt = $this->pdo->prepare("INSERT INTO barcode (barcode_image_path) VALUES (?)");
            $stmt->execute([$barcodePath]);
            $barcode_id = $this->pdo->lastInsertId();
    
            // === QR Code Generation ===
            $qrCode = new QrCode($inventory_tag);
            $qrWriter = new PngWriter();
            $qrFilename = uniqid('qr_') . '.png';
            $qrPath = 'qrcodes/' . $qrFilename;
            $qrData = $qrWriter->write($qrCode);
            file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/ims/' . $qrPath, $qrData->getString());
    
            $stmt = $this->pdo->prepare("INSERT INTO qr_code (qr_image_path) VALUES (?)");
            $stmt->execute([$qrPath]);
            $qr_id = $this->pdo->lastInsertId();
    
            // === Insert Asset ===
            $stmt = $this->pdo->prepare("INSERT INTO asset (brand_ID, asset_type_ID, inventory_tag, serial_number, responsible_user_ID, barcode_ID, qr_ID) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$brand_id, $asset_type_id, $inventory_tag, $serial_num, $user_id, $barcode_id, $qr_id]);
      
            // === Insert Log ===
            $timestamp = date("Y-m-d H:i:s");
            $logMessage = "$response_for_this_log added a new asset with Inventory Tag: '$inventory_tag' and Serial Number: '$serial_num' on $timestamp";
            $stmt = $this->pdo->prepare("INSERT INTO logs (log_content) VALUES (?)");
            $stmt->execute([$logMessage]);

            return true;
    
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }    
}

class ImportCSV {
    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

   public function importFromCSV($csvFilePath) {
    $handle = fopen($csvFilePath, 'r');
    if (!$handle) {
        return "Failed to open file.";
    }

    // Skip header row
    fgetcsv($handle);

    while (($row = fgetcsv($handle)) !== false) {
        // Trim and sanitize all fields
        $row = array_map('trim', $row);
        [$serial_num, $inventory_tag, $brand, $asset_type, $f_name, $m_name, $l_name, $unit] = $row;

        try {
            // Skip if duplicate asset
            $checkStmt = $this->pdo->prepare("SELECT * FROM asset WHERE inventory_tag = ? OR serial_number = ?");
            $checkStmt->execute([$inventory_tag, $serial_num]);
            if ($checkStmt->rowCount() > 0) {
                continue;
            }

            // Normalize for case-insensitive match
            $normalizedAssetType = strtolower($asset_type);
            $normalizedBrand = strtolower($brand);
            $normalizedUnit = strtolower($unit);

            // Handle Asset Type
            $stmt = $this->pdo->prepare("SELECT asset_type_ID FROM asset_type WHERE LOWER(asset_type) = ?");
            $stmt->execute([$normalizedAssetType]);
            if ($stmt->rowCount() > 0) {
                $asset_type_id = $stmt->fetch()['asset_type_ID'];
            } else {
                $insert = $this->pdo->prepare("INSERT INTO asset_type (asset_type) VALUES (?)");
                $insert->execute([$asset_type]);
                $asset_type_id = $this->pdo->lastInsertId();
            }

            // Handle Brand
            $stmt = $this->pdo->prepare("SELECT brand_ID FROM brand WHERE LOWER(brand_name) = ? AND asset_type_id = ?");
            $stmt->execute([$normalizedBrand, $asset_type_id]);
            if ($stmt->rowCount() > 0) {
                $brand_id = $stmt->fetch()['brand_ID'];
            } else {
                $insert = $this->pdo->prepare("INSERT INTO brand (brand_name, asset_type_id) VALUES (?, ?)");
                $insert->execute([$brand, $asset_type_id]);
                $brand_id = $this->pdo->lastInsertId();
            }

            // Handle Unit
            $stmt = $this->pdo->prepare("SELECT unit_ID FROM unit WHERE LOWER(unit_name) = ?");
            $stmt->execute([$normalizedUnit]);
            if ($stmt->rowCount() > 0) {
                $unit_id = $stmt->fetch()['unit_ID'];
            } else {
                $insert = $this->pdo->prepare("INSERT INTO unit (unit_name) VALUES (?)");
                $insert->execute([$unit]);
                $unit_id = $this->pdo->lastInsertId();
            }

            // Handle User
            $stmt = $this->pdo->prepare("SELECT user_ID FROM user WHERE f_name = ? AND m_name = ? AND l_name = ? AND unit_ID = ?");
            $stmt->execute([$f_name, $m_name, $l_name, $unit_id]);
            if ($stmt->rowCount() > 0) {
                $user_id = $stmt->fetch()['user_ID'];
            } else {
                $insert = $this->pdo->prepare("INSERT INTO user (f_name, m_name, l_name, unit_ID) VALUES (?, ?, ?, ?)");
                $insert->execute([$f_name, $m_name, $l_name, $unit_id]);
                $user_id = $this->pdo->lastInsertId();
            }

            // Barcode Generation
            $generator = new BarcodeGeneratorPNG();
            $barcodeData = $generator->getBarcode($inventory_tag, $generator::TYPE_CODE_128);
            $barcodeFilename = uniqid('barcode_') . '.png';
            $barcodePath = 'barcodes/' . $barcodeFilename;
            file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/ims/' . $barcodePath, $barcodeData);

            $stmt = $this->pdo->prepare("INSERT INTO barcode (barcode_image_path) VALUES (?)");
            $stmt->execute([$barcodePath]);
            $barcode_id = $this->pdo->lastInsertId();

            // QR Code Generation
            $qrCode = new QrCode($inventory_tag);
            $qrWriter = new PngWriter();
            $qrFilename = uniqid('qr_') . '.png';
            $qrPath = 'qrcodes/' . $qrFilename;
            $qrData = $qrWriter->write($qrCode);
            file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/ims/' . $qrPath, $qrData->getString());

            $stmt = $this->pdo->prepare("INSERT INTO qr_code (qr_image_path) VALUES (?)");
            $stmt->execute([$qrPath]);
            $qr_id = $this->pdo->lastInsertId();

            // Insert into asset table
            $stmt = $this->pdo->prepare("INSERT INTO asset (brand_ID, asset_type_ID, inventory_tag, serial_number, responsible_user_ID, barcode_ID, qr_ID) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$brand_id, $asset_type_id, $inventory_tag, $serial_num, $user_id, $barcode_id, $qr_id]);
        } catch (PDOException $e) {
            continue; // skip problematic row
        }
    }

    fclose($handle);
    return true;
}
}


class UpdateAsset {
    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function updateAssetDetails($response_for_this_log, $serial_num, $asset_type, $brand, $responsible_to, $unit) {
        try {
            // Check if the asset exists
            $stmt = $this->pdo->prepare("SELECT asset_ID FROM asset WHERE serial_number = ?");
            $stmt->execute([$serial_num]);
            $asset = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$asset) {
                return "Asset not found.";
            }

            // Begin transaction
            $this->pdo->beginTransaction();

            // Update asset details (only editable fields)
            $updateAssetStmt = $this->pdo->prepare("UPDATE asset 
                SET asset_type_ID = ?, brand_ID = ?, responsible_user_ID = ? 
                WHERE serial_number = ?");
            $updateAssetStmt->execute([$asset_type, $brand, $responsible_to, $serial_num]);

            // Update the user's unit
            $updateUserStmt = $this->pdo->prepare("UPDATE user 
                SET unit_ID = ? 
                WHERE user_ID = ?");
            $updateUserStmt->execute([$unit, $responsible_to]);
            
             // === Insert Log ===
            $timestamp = date("Y-m-d H:i:s");
            $logMessage = "$response_for_this_log update an asset with Serial Number: '$serial_num' on $timestamp";
            $stmt = $this->pdo->prepare("INSERT INTO logs (log_content) VALUES (?)");
            $stmt->execute([$logMessage]);

            // Commit transaction
            $this->pdo->commit();
            return true;

        } catch (PDOException $e) {
            $this->pdo->rollBack();
            return $e->getMessage();
        }
    }
}



class DeleteAsset {
    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function deleteAssetDetails($response_for_this_log, $serial_number) {
        try {
            $stmt = $this->pdo->prepare("UPDATE asset SET asset_status = 'inactive' WHERE serial_number = ?");
            if ($stmt->execute([$serial_number])) {
                // === Insert Log ===
                $timestamp = date("Y-m-d H:i:s");
                $logMessage = "$response_for_this_log deleted asset with Serial Number: '$serial_number' on $timestamp";
                $stmt = $this->pdo->prepare("INSERT INTO logs (log_content) VALUES (?)");
                $stmt->execute([$logMessage]);
                return "success";
            } else {
                return "failed to delete";
            }
            
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }
}

?>