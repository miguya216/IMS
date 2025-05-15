<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\auth\web_protector.php';

if (isset($_SESSION['account_ID'])) {
    $role = $_SESSION['role_ID'];

    if ($role == 1 || $role == 2) {
        header("Location: admin/home.php");
    } elseif ($role == 3) {
        header("Location: admin/borrower.php");
    } else {
        header("Location: login.php");
    }
}
?>

