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
            a.asset_ID,
            a.inventory_tag,
            a.serial_number,
            at.asset_type,
            at.asset_type_status,
            br.brand_name,
            br.brand_status,
            CONCAT(u.f_name, ' ', u.l_name) AS responsible_user,
            u.user_status,
            un.unit_name AS user_unit,
            un.unit_status
        FROM asset a
        LEFT JOIN asset_type at ON a.asset_type_ID = at.asset_type_ID
        LEFT JOIN brand br ON a.brand_ID = br.brand_ID
        LEFT JOIN user u ON a.responsible_user_ID = u.user_ID
        LEFT JOIN unit un ON u.unit_ID = un.unit_ID
        WHERE a.asset_status = 'active'
    ";
    
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll();
    }
    

    public function fetchAssetBySerial($serial) {
        $stmt = $this->pdo->prepare("SELECT 
            a.asset_ID,
            a.inventory_tag,
            a.serial_number,
            at.asset_type_ID,
            at.asset_type,
            b.brand_ID,
            b.brand_name,
            u.user_ID AS responsible_user,
            CONCAT(u.f_name, ' ', u.m_name, ' ', u.l_name) AS responsible_name,
            un.unit_ID,
            un.unit_name,
            qr.qr_image_path,
            bc.barcode_image_path
        FROM asset a
        LEFT JOIN asset_type at ON a.asset_type_ID = at.asset_type_ID
        LEFT JOIN brand b ON a.brand_ID = b.brand_ID
        LEFT JOIN user u ON a.responsible_user_ID = u.user_ID
        LEFT JOIN unit un ON u.unit_ID = un.unit_ID
        LEFT JOIN barcode bc ON a.barcode_ID = bc.barcode_ID
        LEFT JOIN qr_code qr ON a.qr_ID = qr.qr_ID
        WHERE a.serial_number = :serial;");
    
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
                    u.user_ID,
                    u.kld_ID,
                    CONCAT(u.f_name, ' ', u.l_name) AS full_name,
                    
                    un.unit_name,
                    un.unit_status,

                    r.role_name,
                    r.role_status,
                    
                    k.kld_email
                FROM user u
                LEFT JOIN unit un ON u.unit_ID = un.unit_ID
                LEFT JOIN account a ON u.user_ID = a.user_ID
                LEFT JOIN role r ON a.role_ID = r.role_ID
                LEFT JOIN kld k ON u.kld_ID = k.kld_ID
                WHERE u.user_status = 'active';
            ";

        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll();
    }
    


   public function fetchUserById($userId) {
    $stmt = $this->pdo->prepare("SELECT 
    u.user_ID,
    u.f_name,
    u.m_name,
    u.l_name,
    u.user_status,
    
    un.unit_name,
    un.unit_status,
    
    -- Fetch kld_ID directly from the user table
    u.kld_ID, 
    
    -- If there's an account, fetch password_hash, else return NULL
    IFNULL(a.password_hash, NULL) AS password_hash, 
    
    -- Fetch role only if account exists
    IFNULL(r.role_name, NULL) AS role_name,
    
    -- Fetch kld_email only if there is a matching kld record
    IFNULL(k.kld_email, NULL) AS kld_email
    
FROM user u
LEFT JOIN unit un ON u.unit_ID = un.unit_ID
LEFT JOIN account a ON u.user_ID = a.user_ID
LEFT JOIN role r ON a.role_ID = r.role_ID
LEFT JOIN kld k ON u.kld_ID = k.kld_ID
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

class Request {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Fetch all requests
    public function fetchAllRequest() {
        $sql = "
            SELECT 
                r.request_ID,
                r.borrower_name,
                r.kld_ID,
                r.request_date,
                r.request_time,
                b.brand_name,
                r.uom,
                r.quantity,
                u.unit_name,
                r.purpose,
                r.request_note,
                r.response_status,
                r.request_status
            FROM request_form r
            JOIN brand b ON r.brand_ID = b.brand_ID
            JOIN unit u ON r.unit_ID = u.unit_ID
            ORDER BY r.request_date DESC, r.request_time DESC
        ";

        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Fetch request by request_ID
    public function fetchRequestByID($request_ID) {
        $stmt = $this->pdo->prepare("SELECT 
                r.request_ID,
                r.borrower_name,
                r.kld_ID,
                k.kld_email,
                r.request_date,
                r.request_time,
                b.brand_name,
                r.uom,
                r.quantity,
                u.unit_name,
                r.purpose,
                r.request_note,
                r.response_status,
                r.request_status
            FROM request_form r
            JOIN brand b ON r.brand_ID = b.brand_ID
            JOIN unit u ON r.unit_ID = u.unit_ID
            JOIN kld k ON r.kld_ID = k.kld_ID
            WHERE r.request_ID = :request_ID
            LIMIT 1;");
        $stmt->execute(['request_ID' => $request_ID]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
} 


?>
