<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\conn.php';

class RequestForm {

    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function insertRequest($kld_ID, $kld_email, $brand_ID, $UOM, $quantity, $purpose){
    try {
        $this->pdo->beginTransaction();

        // 1. Check if kld_ID exists in `kld` table
        $stmt = $this->pdo->prepare("SELECT kld_ID FROM kld WHERE kld_ID = ?");
        $stmt->execute([$kld_ID]);
        $existingKld = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$existingKld) {
            // Insert new kld_ID and email if not found
            $stmt = $this->pdo->prepare("INSERT INTO kld (kld_ID, kld_email) VALUES (?, ?)");
            $stmt->execute([$kld_ID, $kld_email]);
        }

        // 2. Check for duplicate request
        $stmt = $this->pdo->prepare("SELECT * FROM request_form 
                                     WHERE kld_ID = ? AND brand_ID = ? AND request_status = 'active' AND response_status = 'pending'");
        $stmt->execute([$kld_ID, $brand_ID]);
        if ($stmt->rowCount() > 0) {
            $this->pdo->rollBack();
            return "duplicate";
        }

        // 3. Get user info for borrower_name and unit_ID
        $stmt = $this->pdo->prepare("SELECT f_name, m_name, l_name, unit_ID FROM user WHERE kld_ID = ?");
        $stmt->execute([$kld_ID]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            $this->pdo->rollBack();
            return "User not found for given KLD ID.";
        }

        $borrower_name = trim($user['f_name'] . ' ' . $user['m_name'] . ' ' . $user['l_name']);
        $unit_ID = $user['unit_ID'];

        // 4. Insert into request_form
        $stmt = $this->pdo->prepare("INSERT INTO request_form 
            (borrower_name, kld_ID, request_date, request_time, brand_ID, uom, quantity, unit_ID, purpose, request_note) 
            VALUES (?, ?, CURDATE(), CURTIME(), ?, ?, ?, ?, ?, NULL)");

        $stmt->execute([
            $borrower_name,
            $kld_ID,
            $brand_ID,
            $UOM,
            $quantity,
            $unit_ID,
            $purpose
        ]);

        $this->pdo->commit();
        return true;

    } catch (PDOException $e) {
        $this->pdo->rollBack();
        return $e->getMessage();
    }
}

}

class UpdateRequest {
    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function updateRequestForm($request_ID, $response_status) {
        try {
            $stmt = $this->pdo->prepare("UPDATE request_form SET response_status = :status WHERE request_ID = :id");
            $stmt->bindParam(':status', $response_status);
            $stmt->bindParam(':id', $request_ID, PDO::PARAM_INT);
            return $stmt->execute(); // returns true on success
        } catch (PDOException $e) {
            return $e->getMessage(); // return error string on failure
        }
    }
}

?>