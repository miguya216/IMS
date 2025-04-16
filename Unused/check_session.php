<?php
session_start();
require_once($_SERVER['DOCUMENT_ROOT'] . '/ims/class/conn.php');

if (!isset($_SESSION['account_ID']) && isset($_COOKIE['remember_token'])) {
    $stmt = $pdo->prepare("SELECT * FROM account WHERE remember_token = :token AND token_expiry > NOW()");
    $stmt->execute(['token' => $_COOKIE['remember_token']]);
    $user = $stmt->fetch();

    if ($user) {
        $_SESSION['account_ID'] = $user['account_ID'];
        $_SESSION['user_ID'] = $user['user_ID'];
        $_SESSION['role_ID'] = $user['role_ID'];
        $_SESSION['username'] = $user['username'];
    } else {
        setcookie("remember_token", "", time() - 3600, "/");
    }
}
?>