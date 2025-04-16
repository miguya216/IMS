<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/ims/auth/check_session.php';

if (!isset($_SESSION['account_ID'])) {
    header("Location: /ims/login.php");
    exit();
}
?>
