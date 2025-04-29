<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\conn.php';

class UpdateRole {
    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function updateRole($role_ID, $role_name) {
        try {
            $checkRole = $this->pdo->prepare("SELECT * FROM role WHERE role_name = ?");
            $checkRole->execute([$role_name]);
            if ($checkRole->rowCount() > 0) {
                return "duplicate";
            }
            
            $stmt = $this->pdo->prepare("UPDATE role SET role_name = ? WHERE role_ID = ?");
            $stmt->execute([$role_name, $role_ID]);

            return true;

        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }
}

class UpdateUnit {
    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function updateUnit($unit_ID, $unit_name) {
        try {
            $checkUnit = $this->pdo->prepare("SELECT * FROM unit WHERE unit_name = ?");
            $checkUnit->execute([$unit_name]);
            if ($checkUnit->rowCount() > 0) {
                return "duplicate";
            }
            
            $stmt = $this->pdo->prepare("UPDATE unit SET unit_name = ? WHERE unit_ID = ?");
            $stmt->execute([$unit_name, $unit_ID]);

            return true;

        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }
}

class UpdateAssetType {
    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function updateAssetType($asset_type_ID, $asset_type) {
        try {
            $checkAssetType = $this->pdo->prepare("SELECT * FROM asset_type WHERE asset_type = ?");
            $checkAssetType->execute([$asset_type]);
            if ($checkAssetType->rowCount() > 0) {
                return "duplicate";
            }
            
            $stmt = $this->pdo->prepare("UPDATE asset_type SET asset_type = ? WHERE asset_type_ID = ?");
            $stmt->execute([$asset_type, $asset_type_ID]);

            return true;

        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }
}

class UpdateBrand {
    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function updateBrand($brand_ID, $brand_name) {
        try {
            $checkBrand = $this->pdo->prepare("SELECT * FROM brand WHERE brand_name = ?");
            $checkBrand->execute([$brand_name]);
            if ($checkBrand->rowCount() > 0) {
                return "duplicate";
            }
            
            $stmt = $this->pdo->prepare("UPDATE brand SET brand_name = ? WHERE brand_ID = ?");
            $stmt->execute([$brand_name, $brand_ID]);

            return true;

        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }
}


class DeleteRole{
    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function deleteRole($role_ID){
        try{
            $stmt = $this->pdo->prepare("UPDATE role SET role_status = 'inactive' WHERE role_ID = ?");
            if($stmt->execute([$role_ID])){
                return "success";
            }
            else{
                return "failed to delete";
            }
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }
}

class DeleteUnit{
    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function deleteUnit($unit_ID){
        try{
            $stmt = $this->pdo->prepare("UPDATE unit SET unit_status = 'inactive' WHERE unit_ID = ?");
            if($stmt->execute([$unit_ID])){
                return "success";
            }
            else{
                return "failed to delete";
            }
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }
}

class DeleteAsset_type{
    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function deleteAsset_type($asset_type_ID){
        try{
            $stmt = $this->pdo->prepare("UPDATE asset_type SET asset_type_status = 'inactive' WHERE asset_type_ID = ?");
            if($stmt->execute([$asset_type_ID])){
                return "success";
            }
            else{
                return "failed to delete";
            }
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }
}

class DeleteBrand{
    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function deleteBrand($brand_ID){
        try{
            $stmt = $this->pdo->prepare("UPDATE brand SET brand_status = 'inactive' WHERE brand_ID = ?");
            if($stmt->execute([$brand_ID])){
                return "success";
            }
            else{
                return "failed to delete";
            }
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }
}
?>
