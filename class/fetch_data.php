<?php
require_once('conn.php'); 

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
        ";

        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll();
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
