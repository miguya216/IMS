<?php
require_once('conn.php');

class User {
    private $pdo;

    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function login($username, $password, $remember = false) {
        $stmt = $this->pdo->prepare("SELECT * FROM account WHERE username = :username");
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch();
    
        if ($user && $user['status'] === 'active' && password_verify($password, $user['password_hash'])) {
            session_start();
            $_SESSION['account_ID'] = $user['account_ID'];
            $_SESSION['user_ID'] = $user['user_ID'];
            $_SESSION['role_ID'] = $user['role_ID'];
            $_SESSION['username'] = $username;
    
            // Remember me
            if ($remember) {
                $token = bin2hex(random_bytes(32));
                $expiry = date('Y-m-d H:i:s', strtotime('+7 days'));
    
                $this->pdo->prepare("UPDATE account SET remember_token = :token, token_expiry = :expiry WHERE account_ID = :id")
                          ->execute(['token' => $token, 'expiry' => $expiry, 'id' => $user['account_ID']]);
    
                setcookie("remember_token", $token, time() + (86400 * 7), "/"); // 7 days
            }
    
            // Session log
            $this->pdo->prepare("INSERT INTO session (account_ID, login_timestamp) VALUES (:id, NOW())")
                      ->execute(['id' => $user['account_ID']]);
    
            $_SESSION['session_ID'] = $this->pdo->lastInsertId();
    
            return true;
        }
    
        return false;
    }
    
}
?>
