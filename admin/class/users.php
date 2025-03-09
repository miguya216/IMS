<?php
require_once ('conn.php');

class User {
    private $conn;

    public function __construct() {
        $this->conn = require "conn.php"; // Use the connection from conn.php
    }

    // public function register($username, $password) {
    //     $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    //     $stmt = $this->conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    //     $stmt->bind_param("ss", $username, $hashedPassword);
    //     return $stmt->execute();
    // }

    public function login($username, $password) {
        $stmt = $this->conn->prepare("SELECT * FROM account WHERE username = ? and password = ?");
        $stmt->bind_param("ss", $username, $password);
        $stmt->execute();
    
        // Debugging output
        if ($stmt->error) {
            die("SQL Error: " . $stmt->error); // Show SQL errors if any
        }
    
        $stmt->store_result(); // Store result to get number of rows
        if ($stmt->num_rows == 1) {
            // $stmt->bind_result($username);
            // $stmt->fetch();
            // session_start();
            // $_SESSION["user"] = $username;
            return true;
        }
    
        // $stmt->store_result();

        // if ($stmt->num_rows > 0) {
        //     $stmt->bind_result($hashedPassword);
        //     $stmt->fetch();

        //     if (password_verify($password, $hashedPassword)) {
        //         session_start();
        //         $_SESSION["user"] = $username;
        //         return true;
        //     }
        
        return false;
    }
}
?>
