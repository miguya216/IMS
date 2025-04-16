<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\auth\web_protector.php';

if (isset($_SESSION['account_ID'])) {
    header("Location: /ims/admin/home.php");
    exit();
}
?>

