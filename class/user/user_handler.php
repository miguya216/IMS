<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\conn.php';

class User {

    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function insertNewUser($role, $username, $password, $full_name, $unit) {
        try {
            // Begin transaction
            $this->pdo->beginTransaction();
    
            // Check if the user already exists in the unit
            $stmt = $this->pdo->prepare("
                SELECT u.user_ID 
                FROM user u 
                JOIN unit un ON u.unit_id = un.unit_ID 
                WHERE u.full_name = ? AND un.unit_name = ?
            ");
            $stmt->execute([$full_name, $unit]);
            if ($stmt->rowCount() > 0) {
                $this->pdo->rollBack();
                return "duplicate";
            }
    
            // Check if the username already exists
            if (!empty($username)) {
                $stmt = $this->pdo->prepare("SELECT account_ID FROM account WHERE username = ?");
                $stmt->execute([$username]);
                if ($stmt->rowCount() > 0) {
                    $this->pdo->rollBack();
                    return "duplicate"; // 
                }
            }
    
            // Check unit existence or insert new one
            $stmt = $this->pdo->prepare("SELECT unit_ID FROM unit WHERE unit_name = ?");
            $stmt->execute([$unit]);
            if ($stmt->rowCount() == 0) {
                $insert = $this->pdo->prepare("INSERT INTO unit (unit_name) VALUES (?)");
                $insert->execute([$unit]);
                $unit_id = $this->pdo->lastInsertId();
            } else {
                $unit_id = $stmt->fetch()['unit_ID'];
            }
    
            // Insert new user
            $stmt = $this->pdo->prepare("INSERT INTO user (full_name, unit_id) VALUES (:full_name, :unit_id)");
            $stmt->execute([
                ':full_name' => $full_name,
                ':unit_id' => $unit_id
            ]);
            $userId = $this->pdo->lastInsertId();
    
            // Check if the role exists
            $stmtRole = $this->pdo->prepare("SELECT role_ID FROM role WHERE role_name = ?");
            $stmtRole->execute([$role]);
            if ($stmtRole->rowCount() == 0) {
               $insertRole = $this->pdo->prepare("INSERT INTO role (role_name) VALUES (?)");
               $insertRole->execute([$role]);
               $role_id = $this->pdo->lastInsertId();
            }else{
                $role_id = $stmtRole->fetch()['role_ID'];
            }
    
            // Create account if credentials were provided
            if (!empty($role) && !empty($username) && !empty($password)) {
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
                $stmtAccount = $this->pdo->prepare("
                    INSERT INTO account (user_id, username, password_hash, role_id)
                    VALUES (:user_id, :username, :password_hash, :role_id)
                ");
                $stmtAccount->execute([
                    ':user_id' => $userId,
                    ':username' => $username,
                    ':password_hash' => $hashedPassword,
                    ':role_id' => $role_id
                ]);
            }
    
            $this->pdo->commit();
            return true;
    
        } catch (PDOException $e) {
            $this->pdo->rollBack();
            return $e->getMessage(); // 🔄 This will be treated as error in InsertAuth.php
        }
    }
    
}

class UpdateUser {
    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function UpdateUser($user_ID, $role, $username, $password, $fullname, $unit_ID) {
        try {
            $this->pdo->beginTransaction();
    
            // Get current user and account info
            $stmt = $this->pdo->prepare("
                SELECT u.full_name, u.unit_ID, a.username, a.role_ID
                FROM user u
                LEFT JOIN account a ON u.user_ID = a.user_ID
                WHERE u.user_ID = ?
            ");
            $stmt->execute([$user_ID]);
            $currentData = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if (!$currentData) {
                $this->pdo->rollBack();
                return "User not found";
            }
    
            // Track changes
            $changes = false;
            if ($fullname !== $currentData['full_name']) $changes = true;
            if ((int)$unit_ID !== (int)$currentData['unit_ID']) $changes = true;
            if (!empty($username) && $username !== $currentData['username']) $changes = true;
            if (!empty($password)) $changes = true;
            if (!empty($role)) {
                // Get role ID for comparison
                $stmt = $this->pdo->prepare("SELECT role_ID FROM role WHERE role_name = ?");
                $stmt->execute([$role]);
                $roleRow = $stmt->fetch();
                if (!$roleRow) {
                    // Insert new role if not found
                    $insertRole = $this->pdo->prepare("INSERT INTO role (role_name) VALUES (?)");
                    $insertRole->execute([$role]);
                    $role_ID = $this->pdo->lastInsertId();
                } else {
                    $role_ID = $roleRow['role_ID'];
                }
                if ((int)$role_ID !== (int)$currentData['role_ID']) $changes = true;
            } else {
                $role_ID = $currentData['role_ID'];
            }
    
            if (!$changes) {
                $this->pdo->rollBack();
                return "duplicate"; // No changes
            }
    
            // Update user table
            $stmt = $this->pdo->prepare("UPDATE user SET full_name = ?, unit_ID = ? WHERE user_ID = ?");
            $stmt->execute([$fullname, $unit_ID, $user_ID]);
    
            // Update account table if exists
            $stmt = $this->pdo->prepare("SELECT account_ID FROM account WHERE user_ID = ?");
            $stmt->execute([$user_ID]);
            $accountExists = $stmt->rowCount() > 0;
    
            if ($accountExists) {
                $query = "UPDATE account SET ";
                $params = [];
                if (!empty($username) && $username !== $currentData['username']) {
                    // Check for username conflict
                    $checkUsername = $this->pdo->prepare("SELECT account_ID FROM account WHERE username = ? AND user_ID != ?");
                    $checkUsername->execute([$username, $user_ID]);
                    if ($checkUsername->rowCount() > 0) {
                        $this->pdo->rollBack();
                        return "duplicate";
                    }
                    $query .= "username = :username, ";
                    $params[':username'] = $username;
                }
                if (!empty($password)) {
                    $query .= "password_hash = :password_hash, ";
                    $params[':password_hash'] = password_hash($password, PASSWORD_DEFAULT);
                }
                if (!empty($role)) {
                    $query .= "role_ID = :role_ID, ";
                    $params[':role_ID'] = $role_ID;
                }
                $query = rtrim($query, ", ") . " WHERE user_ID = :user_ID";
                $params[':user_ID'] = $user_ID;
    
                if (count($params) > 1) {
                    $stmt = $this->pdo->prepare($query);
                    $stmt->execute($params);
                }
            } else {
                // Create new account if doesn't exist
                if (!empty($username) && !empty($password) && !empty($role_ID)) {
                    $stmt = $this->pdo->prepare("
                        INSERT INTO account (user_ID, username, password_hash, role_ID)
                        VALUES (?, ?, ?, ?)
                    ");
                    $stmt->execute([
                        $user_ID,
                        $username,
                        password_hash($password, PASSWORD_DEFAULT),
                        $role_ID
                    ]);
                }
            }
    
            $this->pdo->commit();
            return true;
    
        } catch (PDOException $e) {
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
