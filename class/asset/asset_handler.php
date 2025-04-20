<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\conn.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Picqer\Barcode\BarcodeGeneratorPNG;
class Asset {
    private $pdo;

   public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }
        
    public function insertAsset($inventory_tag, $serial_num, $asset_type, $brand, $responsible_to, $unit) {
    try {
        // Check duplicates
        $checkStmt = $this->pdo->prepare("SELECT * FROM asset WHERE inventory_tag = ? OR serial_number = ?");
        $checkStmt->execute([$inventory_tag, $serial_num]);
        if ($checkStmt->rowCount() > 0) {
            return "duplicate";
        }

        // check asset
        $stmt = $this->pdo->prepare("SELECT asset_type_ID FROM asset_type WHERE asset_type = ?");
        $stmt->execute([$asset_type]);
        if ($stmt->rowCount() == 0) {
            $insert = $this->pdo->prepare("INSERT INTO asset_type (asset_type) VALUES (?)");
            $insert->execute([$asset_type]);
            $asset_type_id = $this->pdo->lastInsertId();
        } else {
            $asset_type_id = $stmt->fetch()['asset_type_ID'];
        }

        // Check brand
        $stmt = $this->pdo->prepare("SELECT brand_ID FROM brand WHERE brand_name = ?");
        $stmt->execute([$brand]);
        if ($stmt->rowCount() == 0) {
            $insert = $this->pdo->prepare("INSERT INTO brand (brand_name) VALUES (?)");
            $insert->execute([$brand]);
            $brand_id = $this->pdo->lastInsertId();
        } else {
            $brand_id = $stmt->fetch()['brand_ID'];
        }

        // check unit
        $stmt = $this->pdo->prepare("SELECT unit_ID FROM unit WHERE unit_name = ?");
        $stmt->execute([$unit]);
        if ($stmt->rowCount() == 0) {
            $insert = $this->pdo->prepare("INSERT INTO unit (unit_name) VALUES (?)");
            $insert->execute([$unit]);
            $unit_id = $this->pdo->lastInsertId();
        } else {
            $unit_id = $stmt->fetch()['unit_ID'];
        }

        // check user (responsible)
        $stmt = $this->pdo->prepare("SELECT user_ID FROM user WHERE full_name = ?");
        $stmt->execute([$responsible_to]);
        if ($stmt->rowCount() == 0) {
            $insert = $this->pdo->prepare("INSERT INTO user (full_name, unit_ID) VALUES (?, ?)");
            $insert->execute([$responsible_to, $unit_id]);
            $user_id = $this->pdo->lastInsertId();
        } else {
            $user_id = $stmt->fetch()['user_ID'];
        }

         //  Generate barcode image using the library
         $generator = new BarcodeGeneratorPNG();
         $barcodeData = $generator->getBarcode($inventory_tag, $generator::TYPE_CODE_128);

         // Save barcode image
         $filename = uniqid('barcode_') . '.png';
         $barcode_path = 'barcodes/' . $filename;
         file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/ims/' . $barcode_path, $barcodeData);

         // Save barcode path in database
         $stmt = $this->pdo->prepare("INSERT INTO barcode (barcode_image_path) VALUES (?)");
         $stmt->execute([$barcode_path]);
         $barcode_id = $this->pdo->lastInsertId();

         // Final insert into asset table
         $stmt = $this->pdo->prepare("INSERT INTO asset (brand_ID, asset_type_ID, inventory_tag, serial_number, responsible_user_ID, barcode_image_path_ID) VALUES (?, ?, ?, ?, ?, ?)");
         $stmt->execute([$brand_id, $asset_type_id, $inventory_tag, $serial_num, $user_id, $barcode_id]);

         return true;

    } catch (PDOException $e) {
        return $e->getMessage(); // or false if you want simple fail
    }
}

}

class UpdateAsset {
    private $pdo;

    public function __construct() {
         global $pdo;
         $this->pdo = $pdo;
     }

     public function updateAssetDetails($serial_num, $asset_type, $brand, $responsible_to, $unit) {
        try {
            // Get or insert asset_type
            $stmt = $this->pdo->prepare("SELECT asset_type_ID FROM asset_type WHERE asset_type = ?");
            $stmt->execute([$asset_type]);
            if ($stmt->rowCount() == 0) {
                $insert = $this->pdo->prepare("INSERT INTO asset_type (asset_type) VALUES (?)");
                $insert->execute([$asset_type]);
                $asset_type_id = $this->pdo->lastInsertId();
            } else {
                $asset_type_id = $stmt->fetch()['asset_type_ID'];
            }
    
            // Get or insert brand
            $stmt = $this->pdo->prepare("SELECT brand_ID FROM brand WHERE brand_name = ?");
            $stmt->execute([$brand]);
            if ($stmt->rowCount() == 0) {
                $insert = $this->pdo->prepare("INSERT INTO brand (brand_name) VALUES (?)");
                $insert->execute([$brand]);
                $brand_id = $this->pdo->lastInsertId();
            } else {
                $brand_id = $stmt->fetch()['brand_ID'];
            }
    
            // Get or insert unit
            $stmt = $this->pdo->prepare("SELECT unit_ID FROM unit WHERE unit_name = ?");
            $stmt->execute([$unit]);
            if ($stmt->rowCount() == 0) {
                $insert = $this->pdo->prepare("INSERT INTO unit (unit_name) VALUES (?)");
                $insert->execute([$unit]);
                $unit_id = $this->pdo->lastInsertId();
            } else {
                $unit_id = $stmt->fetch()['unit_ID'];
            }
    
            // Get or insert user
            $stmt = $this->pdo->prepare("SELECT user_ID FROM user WHERE full_name = ?");
            $stmt->execute([$responsible_to]);
            if ($stmt->rowCount() == 0) {
                $insert = $this->pdo->prepare("INSERT INTO user (full_name, unit_ID) VALUES (?, ?)");
                $insert->execute([$responsible_to, $unit_id]);
                $user_id = $this->pdo->lastInsertId();
            } else {
                $user = $stmt->fetch();
                $user_id = $user['user_ID'];
    
                // Update user's unit if changed
                $checkUnit = $this->pdo->prepare("SELECT unit_ID FROM user WHERE user_ID = ?");
                $checkUnit->execute([$user_id]);
                $existingUnitId = $checkUnit->fetchColumn();
                if ($existingUnitId != $unit_id) {
                    $updateUnit = $this->pdo->prepare("UPDATE user SET unit_ID = ? WHERE user_ID = ?");
                    $updateUnit->execute([$unit_id, $user_id]);
                }
            }
    
            // Update asset details (excluding inventory_tag and serial_number)
            $stmt = $this->pdo->prepare("
                UPDATE asset SET 
                    asset_type_ID = ?, 
                    brand_ID = ?, 
                    responsible_user_ID = ?
                WHERE serial_number = ?
            ");
            $stmt->execute([$asset_type_id, $brand_id, $user_id, $serial_num]);
    
            return true;
    
        } catch (PDOException $e) {
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

    public function deleteAssetDetails($serial_number) {
        try {
            $stmt = $this->pdo->prepare("UPDATE asset SET asset_status = 'inactive' WHERE serial_number = ?");
            if ($stmt->execute([$serial_number])) {
                return "success";
            } else {
                return "fail";
            }
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }
}

?>