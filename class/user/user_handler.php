<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\conn.php';

class User {

    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function insertNewUser($role, $kld_email, $password, $kld_id, $firstName, $middleName, $lastName, $unit) {
        try {
            $this->pdo->beginTransaction();
    
            // Always insert into kld if kld_ID is given, even if email is null
            if (!empty($kld_id)) {
                $stmt = $this->pdo->prepare("SELECT kld_ID FROM kld WHERE kld_ID = ?");
                $stmt->execute([$kld_id]);
    
                if ($stmt->rowCount() === 0) {
                    $stmt = $this->pdo->prepare("INSERT INTO kld (kld_ID, kld_email) VALUES (?, ?)");
                    $stmt->execute([$kld_id, $kld_email]);
                }
            }
    
            // Handle unit (insert if name, get ID if numeric)
            if (is_numeric($unit)) {
                $stmt = $this->pdo->prepare("SELECT unit_ID FROM unit WHERE unit_ID = ?");
                $stmt->execute([$unit]);
                $unit_id = $stmt->fetchColumn();
            } else {
                $stmt = $this->pdo->prepare("SELECT unit_ID FROM unit WHERE unit_name = ?");
                $stmt->execute([$unit]);
                if ($stmt->rowCount() === 0) {
                    $stmt = $this->pdo->prepare("INSERT INTO unit (unit_name) VALUES (?)");
                    $stmt->execute([$unit]);
                    $unit_id = $this->pdo->lastInsertId();
                } else {
                    $unit_id = $stmt->fetchColumn();
                }
            }
    
            // Only handle role if we are going to create an account
            $role_id = null;
            if (!empty($kld_email) && !empty($password) && !empty($role)) {
                if (is_numeric($role)) {
                    $stmt = $this->pdo->prepare("SELECT role_ID FROM role WHERE role_ID = ?");
                    $stmt->execute([$role]);
                    $role_id = $stmt->fetchColumn();
                } else {
                    $stmt = $this->pdo->prepare("SELECT role_ID FROM role WHERE role_name = ?");
                    $stmt->execute([$role]);
                    if ($stmt->rowCount() === 0) {
                        $stmt = $this->pdo->prepare("INSERT INTO role (role_name) VALUES (?)");
                        $stmt->execute([$role]);
                        $role_id = $this->pdo->lastInsertId();
                    } else {
                        $role_id = $stmt->fetchColumn();
                    }
                }
            }
    
            // Check for duplicate user (same name and unit)
            $stmt = $this->pdo->prepare("
                SELECT user_ID FROM user 
                WHERE f_name = ? AND m_name = ? AND l_name = ? AND unit_ID = ?
            ");
            $stmt->execute([$firstName, $middleName, $lastName, $unit_id]);
            if ($stmt->rowCount() > 0) {
                $this->pdo->rollBack();
                return "duplicate";
            }
    
            // Insert into user table
            $stmt = $this->pdo->prepare("
                INSERT INTO user (f_name, m_name, l_name, kld_ID, unit_ID) 
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([$firstName, $middleName, $lastName, $kld_id ?: null, $unit_id]);
            $userId = $this->pdo->lastInsertId();
    
            // Insert into account if all necessary info is provided
            if (!empty($kld_email) && !empty($password) && !empty($role_id)) {
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $this->pdo->prepare("
                    INSERT INTO account (user_ID, kld_ID, password_hash, role_ID) 
                    VALUES (?, ?, ?, ?)
                ");
                $stmt->execute([$userId, $kld_id, $hashedPassword, $role_id]);
            }
    
            $this->pdo->commit();
            return true;
    
        } catch (PDOException $e) {
            $this->pdo->rollBack();
            return $e->getMessage();
        }
    }
    
}

class UpdateUser {
    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function UpdateUser($user_ID, $kld_ID, $role, $kld_email, $password, $f_name, $m_name, $l_name, $unit) {
        try {
            $this->pdo->beginTransaction();
    
            // Fetch current data
            $stmt = $this->pdo->prepare("
                SELECT u.f_name, u.m_name, u.l_name, u.unit_ID, u.kld_ID, 
                       k.kld_email, a.role_ID, a.account_ID
                FROM user u
                LEFT JOIN account a ON u.user_ID = a.user_ID
                LEFT JOIN kld k ON u.kld_ID = k.kld_ID
                WHERE u.user_ID = ?
            ");
            $stmt->execute([$user_ID]);
            $current = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if (!$current) {
                $this->pdo->rollBack();
                return "User not found";
            }
    
            $changes = false;
    
            // Compare and detect changes
            if ($f_name !== $current['f_name'] || 
                $m_name !== $current['m_name'] || 
                $l_name !== $current['l_name'] || 
                (int)$unit !== (int)$current['unit_ID'] || 
                $kld_ID !== $current['kld_ID']) {
                $changes = true;
            }
    
            // Check for duplicate KLD email
            if (!empty($kld_email)) {
                $stmt = $this->pdo->prepare("SELECT kld_ID FROM kld WHERE kld_email = ? AND kld_ID != ?");
                $stmt->execute([$kld_email, $kld_ID]);
                if ($stmt->rowCount() > 0) {
                    $this->pdo->rollBack();
                    return "duplicate_email";
                }
            }
    
            // Check for duplicate KLD ID if changed
            if (!empty($kld_ID) && $kld_ID !== $current['kld_ID']) {
                $stmt = $this->pdo->prepare("SELECT kld_ID FROM kld WHERE kld_ID = ?");
                $stmt->execute([$kld_ID]);
                if ($stmt->rowCount() > 0 && empty($kld_email)) {
                    $this->pdo->rollBack();
                    return "duplicate_kld_id";
                }
            }
    
            // Insert or update KLD table
            if (!empty($kld_ID)) {
                $stmt = $this->pdo->prepare("SELECT * FROM kld WHERE kld_ID = ?");
                $stmt->execute([$kld_ID]);
    
                if ($stmt->rowCount() > 0) {
                    if (!empty($kld_email) && $kld_email !== $current['kld_email']) {
                        $update = $this->pdo->prepare("UPDATE kld SET kld_email = ? WHERE kld_ID = ?");
                        $update->execute([$kld_email, $kld_ID]);
                        $changes = true;
                    }
                } else {
                    $insert = $this->pdo->prepare("INSERT INTO kld (kld_ID, kld_email) VALUES (?, ?)");
                    $insert->execute([$kld_ID, $kld_email]);
                    $changes = true;
                }
            }
    
            // Handle role processing
            if (!empty($role)) {
                $stmt = $this->pdo->prepare("SELECT role_ID FROM role WHERE role_name = ?");
                $stmt->execute([$role]);
                $roleRow = $stmt->fetch();
    
                if ($roleRow) {
                    $role_ID = $roleRow['role_ID'];
                } else {
                    $insertRole = $this->pdo->prepare("INSERT INTO role (role_name) VALUES (?)");
                    $insertRole->execute([$role]);
                    $role_ID = $this->pdo->lastInsertId();
                }
    
                if ((int)$role_ID !== (int)$current['role_ID']) {
                    $changes = true;
                }
            } else {
                $role_ID = $current['role_ID'];
            }
    
            if (!empty($password)) {
                $changes = true;
            }
    
            if (!$changes) {
                $this->pdo->rollBack();
                return "no_changes";
            }
    
            // Update user table
            $stmt = $this->pdo->prepare("UPDATE user SET f_name = ?, m_name = ?, l_name = ?, unit_ID = ?, kld_ID = ? WHERE user_ID = ?");
            $stmt->execute([$f_name, $m_name, $l_name, $unit, $kld_ID, $user_ID]);
    
            // Insert or update account
            if (!empty($kld_email)) {
                $stmt = $this->pdo->prepare("SELECT account_ID FROM account WHERE user_ID = ?");
                $stmt->execute([$user_ID]);
                $accountExists = $stmt->fetch();
    
                if ($accountExists) {
                    // Update
                    $query = "UPDATE account SET kld_ID = :kld_ID, role_ID = :role_ID";
                    $params = [':kld_ID' => $kld_ID, ':role_ID' => $role_ID];
    
                    if (!empty($password)) {
                        $query .= ", password_hash = :password_hash";
                        $params[':password_hash'] = password_hash($password, PASSWORD_DEFAULT);
                    }
    
                    $query .= " WHERE user_ID = :user_ID";
                    $params[':user_ID'] = $user_ID;
    
                    $stmt = $this->pdo->prepare($query);
                    $stmt->execute($params);
                } else {
                    // Insert
                    $stmt = $this->pdo->prepare("INSERT INTO account (user_ID, kld_ID, role_ID, password_hash) VALUES (?, ?, ?, ?)");
                    $stmt->execute([
                        $user_ID,
                        $kld_ID,
                        $role_ID,
                        password_hash($password, PASSWORD_DEFAULT)
                    ]);
                }
            }
    
            $this->pdo->commit();
            return true;
    
        } catch (Exception $e) {
            $this->pdo->rollBack();
            return $e->getMessage();
        }
    }    
    
}


class DeleteUser{
    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function deleteUserDetails($user_ID){
        try{
            $stmt = $this->pdo->prepare("UPDATE user SET user_status = 'inactive' WHERE user_ID = ?");
            if($stmt->execute([$user_ID])){
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
