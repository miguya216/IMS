<?php
session_start();
require_once __DIR__ . '/../conn.php';
header('Content-Type: application/json');

$user_ID = $_SESSION['user']['user_ID'] ?? null;

class RISDropdownOptions {
    private $pdo;
    private $user_ID;

    public function __construct($pdo, $user_ID) {
        $this->pdo = $pdo;
        $this->user_ID = $user_ID;
    }

    public function fetchSelections() {
        return [
            'ris_tag_type' => $this->getAllRIStype(),
            'admin_assets' => $this->getAssetsByUser1(),
            'custodian_assets' => $this->getAssetsByLoggedInUser(),
            'consumables' => $this->getConsumables()
        ];
    }

    private function getAllRIStype() {
        $stmt = $this->pdo->prepare("
            SELECT ris_tag_ID, ris_tag_name
            FROM ris_tag_type
            WHERE ris_tag_status = 'active'
        ");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private function getAssetsByUser1() {
        $stmt = $this->pdo->prepare("
            SELECT 
                a.kld_property_tag, 
                at.asset_type, 
                b.brand_name
            FROM asset a
            JOIN asset_type at ON a.asset_type_ID = at.asset_type_ID
            JOIN brand b ON a.brand_ID = b.brand_ID
            JOIN asset_condition ac ON a.asset_condition_ID = ac.asset_condition_ID
            JOIN account acc ON acc.user_ID = a.responsible_user_ID
            WHERE 
                a.asset_status = 'active'
                AND a.asset_condition_ID = 1
                AND acc.role_ID IN (1, 2)
                AND a.is_borrowable = 'no'
                AND NOT EXISTS (
                    SELECT 1 
                    FROM ris_assets ra
                    JOIN requisition_and_issue ri ON ri.ris_ID = ra.ris_ID
                    WHERE ra.asset_property_no = a.kld_property_tag
                    AND (ri.ris_status != 'completed' AND ri.ris_status != 'cancelled')
                )
        ");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    private function getAssetsByLoggedInUser() {
        $stmt = $this->pdo->prepare("
            SELECT a.kld_property_tag, at.asset_type, b.brand_name
            FROM asset a
            JOIN asset_type at ON a.asset_type_ID = at.asset_type_ID
            JOIN brand b ON a.brand_ID = b.brand_ID
            WHERE a.asset_status = 'active'
            AND a.responsible_user_ID = :user_ID
            AND NOT EXISTS (
                SELECT 1 
                FROM ris_assets ra
                JOIN requisition_and_issue ri ON ri.ris_ID = ra.ris_ID
                WHERE ra.asset_property_no = a.kld_property_tag
                AND (ri.ris_status != 'completed' AND ri.ris_status != 'cancelled')
            )
        ");
        $stmt->execute(['user_ID' => $this->user_ID]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private function getConsumables() {
        $stmt = $this->pdo->prepare("
            SELECT 
                c.consumable_ID,
                c.kld_property_tag,
                c.consumable_name,
                c.unit_of_measure,
                c.description,
                c.total_quantity,
                c.price_amount,
                c.date_acquired
            FROM consumable c
            WHERE c.consumable_status = 'active'
        ");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

try {
    $dropdown = new RISDropdownOptions($pdo, $user_ID);
    echo json_encode($dropdown->fetchSelections());
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
