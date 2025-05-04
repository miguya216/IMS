<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\conn.php';

class DataFetcher {
    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function getAllAssetTypes() {
        return $this->fetchAll("SELECT * FROM asset_type WHERE asset_type_status = 'active'");
    }

    public function getAllBrands() {
        return $this->fetchAll("SELECT * FROM brand WHERE brand_status = 'active'");
    }

    public function getAllUnits() {
        return $this->fetchAll("SELECT * FROM unit WHERE unit_status = 'active'");
    }

    public function getAllRoles() {
        return $this->fetchAll("SELECT * FROM role WHERE role_status = 'active'");
    }

    public function getAllBarcodes() {
        return $this->fetchAll("SELECT * FROM barcode");
    }

    public function getAllUsers() {
        return $this->fetchAll("SELECT * FROM user WHERE user_status = 'active'");
    }

    public function getAllAssets() {
        return $this->fetchAll("SELECT * FROM asset");
    }

    public function getAllReturns() {
        return $this->fetchAll("SELECT * FROM return_table");
    }

    public function getAllRequests() {
        return $this->fetchAll("SELECT * FROM request_form");
    }
    public function getAllLogs() {
        return $this->fetchAll("SELECT * FROM logs");
    }

    private function fetchAll($query) {
        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
