<?php
session_start();
require_once('class/conn.php');

if (isset($_SESSION['session_ID'])) {
    $stmt = $pdo->prepare("UPDATE session SET logout_timestamp = NOW() WHERE session_ID = :id");
    $stmt->execute(['id' => $_SESSION['session_ID']]);
}

if (isset($_SESSION['account_ID'])) {
    $pdo->prepare("UPDATE account SET remember_token = NULL, token_expiry = NULL WHERE account_ID = :id")
        ->execute(['id' => $_SESSION['account_ID']]);
}

// Clear session & cookie
setcookie("remember_token", "", time() - 3600, "/");
session_unset();
session_destroy();

header("Location: login.php");
exit();
?>
