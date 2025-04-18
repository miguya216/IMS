<?php
session_start();
require_once($_SERVER['DOCUMENT_ROOT'] . '/ims/class/conn.php');

// Check remember me token if session is missing
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

// Force login redirect for all pages that include this file
if (!isset($_SESSION['account_ID'])) {
    header("Location: /ims/login.php");
    exit();
}

// Optional: restrict admin-only pages automatically
$current_page = basename($_SERVER['PHP_SELF']);
$admin_only_pages = ['manage_accounts.php', 'admin_page.php', 'account_logs.php']; // add more as needed

if ($_SESSION['role_ID'] != 1 && in_array($current_page, $admin_only_pages)) {
    echo "Access denied. Admins only.";
    exit();
}
?>