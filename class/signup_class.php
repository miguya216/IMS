<?php
require_once('conn.php');
class SignUP{
private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

  public function insertNewBorrower($f_name, $m_name, $l_name, $kld_email, $kld_ID, $password, $unit) {
    try {
        // Check if KLD ID or Email already exists
        $stmt = $this->pdo->prepare("SELECT * FROM kld WHERE kld_ID = :kld_ID OR kld_email = :kld_email");
        $stmt->execute([
            ':kld_ID' => $kld_ID,
            ':kld_email' => $kld_email
        ]);

        if ($stmt->rowCount() > 0) {
            return ['status' => false, 'message' => 'KLD ID or Email already exists.'];
        }

        // Begin transaction
        $this->pdo->beginTransaction();

        // Insert into kld table
        $insertKLD = $this->pdo->prepare("INSERT INTO kld (kld_ID, kld_email) VALUES (:kld_ID, :kld_email)");
        $insertKLD->execute([
            ':kld_ID' => $kld_ID,
            ':kld_email' => $kld_email
        ]);

        // Insert into user table
        $insertUser = $this->pdo->prepare("INSERT INTO user (f_name, m_name, l_name, kld_ID, unit_ID) 
            VALUES (:f_name, :m_name, :l_name, :kld_ID, :unit_ID)");
        $insertUser->execute([
            ':f_name' => $f_name,
            ':m_name' => $m_name,
            ':l_name' => $l_name,
            ':kld_ID' => $kld_ID,
            ':unit_ID' => $unit
        ]);
        $user_ID = $this->pdo->lastInsertId();

        // Get borrower role ID
        $roleStmt = $this->pdo->prepare("SELECT role_ID FROM role WHERE role_name = 'borrower' AND role_status = 'active'");
        $roleStmt->execute();
        $role = $roleStmt->fetch(PDO::FETCH_ASSOC);

        if (!$role) {
            $this->pdo->rollBack();
            return ['status' => false, 'message' => 'Borrower role not found.'];
        }

        $role_ID = $role['role_ID'];

        // Hash the password
        $password_hash = password_hash($password, PASSWORD_DEFAULT);

        // Insert into account table
        $insertAccount = $this->pdo->prepare("INSERT INTO account (user_ID, kld_ID, password_hash, role_ID)
            VALUES (:user_ID, :kld_ID, :password_hash, :role_ID)");
        $insertAccount->execute([
            ':user_ID' => $user_ID,
            ':kld_ID' => $kld_ID,
            ':password_hash' => $password_hash,
            ':role_ID' => $role_ID
        ]);

        // Commit transaction
        $this->pdo->commit();
        return ['status' => true, 'message' => 'Registration successful.'];
        
    } catch (Exception $e) {
        $this->pdo->rollBack();
        return ['status' => false, 'message' => 'Registration failed: ' . $e->getMessage()];
    }
}

}
?>