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
                brand.brand_name,
                user.full_name AS responsible_user,
                unit.unit_name AS user_unit
            FROM 
                asset
            JOIN 
                asset_type ON asset.asset_type_ID = asset_type.asset_type_ID
            JOIN 
                brand ON asset.brand_ID = brand.brand_ID
            JOIN 
                user ON asset.responsible_user_ID = user.user_ID
            JOIN 
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
                at.asset_type,
                br.brand_name,
                u.full_name AS responsible_user,
                un.unit_name AS user_unit
            FROM asset a
            INNER JOIN barcode b ON a.barcode_image_path_ID = b.barcode_image_path_ID
            INNER JOIN asset_type at ON a.asset_type_ID = at.asset_type_ID
            INNER JOIN brand br ON a.brand_ID = br.brand_ID
            INNER JOIN user u ON a.responsible_user_ID = u.user_ID
            INNER JOIN unit un ON u.unit_ID = un.unit_ID
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
        account.username,
        role.role_name
    FROM 
        user
    JOIN 
        unit ON user.unit_ID = unit.unit_ID
    LEFT JOIN 
        account ON user.user_ID = account.user_ID
    LEFT JOIN 
        role ON account.role_ID = role.role_ID
";


    $stmt = $this->pdo->query($sql);
    return $stmt->fetchAll();
    }
}
?>
