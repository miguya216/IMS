<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\conn.php'; 

class Inventory {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function fetchAllAssets() {
        $sql = "
           SELECT 
                asset.asset_ID,
                asset.inventory_tag,
                asset.serial_number,
                asset_type.asset_type,
                asset_type.asset_type_status,
                brand.brand_name,
                brand.brand_status,
                user.full_name AS responsible_user,
                user.user_status,
                unit.unit_name AS user_unit,
                unit.unit_status
            FROM 
                asset
            LEFT JOIN 
                asset_type ON asset.asset_type_ID = asset_type.asset_type_ID
            LEFT JOIN 
                brand ON asset.brand_ID = brand.brand_ID
            LEFT JOIN 
                user ON asset.responsible_user_ID = user.user_ID
            LEFT JOIN 
                unit ON user.unit_ID = unit.unit_ID
            WHERE 
                asset.asset_status = 'active'
        ";
    
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll();
    }
    

    public function fetchAssetBySerial($serial) {
        $stmt = $this->pdo->prepare("SELECT 
            a.serial_number,
            a.inventory_tag,
            b.barcode_image_path,
            q.qr_image_path,
            at.asset_type,
            at.asset_type_status,
            br.brand_name,
            br.brand_status,
            u.full_name AS responsible_user,
            u.user_status,
            un.unit_name AS user_unit,
            un.unit_status
        FROM asset a
        LEFT JOIN barcode b ON a.barcode_image_path_ID = b.barcode_image_path_ID
        LEFT JOIN qr_code q ON a.qr_image_path_ID = q.qr_image_path_ID
        LEFT JOIN asset_type at ON a.asset_type_ID = at.asset_type_ID
        LEFT JOIN brand br ON a.brand_ID = br.brand_ID
        LEFT JOIN user u ON a.responsible_user_ID = u.user_ID
        LEFT JOIN unit un ON u.unit_ID = un.unit_ID
        WHERE a.serial_number = :serial");
    
        $stmt->execute(['serial' => $serial]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
}

class Users {
    private $pdo;
    
    public function __construct($pdo){
        $this->pdo = $pdo;
    }
    public function fetchAllUsers(){
        $sql = "
        SELECT 
            user.user_ID,
            user.full_name,
            unit.unit_name,
            unit.unit_status,
            account.username,
            role.role_name,
            role.role_status
        FROM 
            user
        LEFT JOIN 
            unit ON user.unit_ID = unit.unit_ID
        LEFT JOIN 
            account ON user.user_ID = account.user_ID
        LEFT JOIN 
            role ON account.role_ID = role.role_ID
        WHERE
            user.user_status = 'active'";
    
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll();
    }
    


    public function fetchUserById($userId) {
        $stmt = $this->pdo->prepare("SELECT 
            u.user_ID,
            u.full_name,
            un.unit_name,
            un.unit_status,
            a.username,
            a.password_hash,
            r.role_name
        FROM user u
        LEFT JOIN unit un ON u.unit_ID = un.unit_ID
        LEFT JOIN account a ON u.user_ID = a.user_ID
        LEFT JOIN role r ON a.role_ID = r.role_ID
        WHERE u.user_ID = :userId");
    
        $stmt->execute(['userId' => $userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
}

class Role {
    private $pdo;
    
    public function __construct($pdo){
        $this->pdo = $pdo;
    }
    public function fetchRoleById($role_ID){
        $stmt = $this->pdo->prepare(
            "SELECT role_ID, role_name, role_status
            FROM role
            WHERE role_ID = :role_ID"
        );

        $stmt->execute(['role_ID' => $role_ID]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}

class Unit {
    private $pdo;

    public function __construct($pdo){
        $this->pdo = $pdo;
    }

    public function fetchUnitById($unit_ID){
        $stmt = $this->pdo->prepare(
            "SELECT unit_ID, unit_name, unit_status
             FROM unit
             WHERE unit_ID = :unit_ID"
        );

        $stmt->execute(['unit_ID' => $unit_ID]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}


class Asset_type {
    private $pdo;

    public function __construct($pdo){
        $this->pdo = $pdo;
    }

    public function fetchAssetTypeById($asset_type_ID){
        $stmt = $this->pdo->prepare(
            "SELECT asset_type_ID, asset_type, asset_type_status
             FROM asset_type
             WHERE asset_type_ID = :asset_type_ID"
        );

        $stmt->execute(['asset_type_ID' => $asset_type_ID]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}


class Brand {
    private $pdo;

    public function __construct($pdo){
        $this->pdo = $pdo;
    }

    public function fetchBrandById($brand_ID){
        $stmt = $this->pdo->prepare(
            "SELECT brand_ID, brand_name, brand_status
             FROM brand
             WHERE brand_ID = :brand_ID"
        );

        $stmt->execute(['brand_ID' => $brand_ID]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}

?>
