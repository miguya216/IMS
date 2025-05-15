<?php
require_once ('class/login_class.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = new User();
    $remember = isset($_POST['remember_me']);
    
    if ($user->login($_POST["kld_email"], $_POST["password"], $remember)) {
        if ($role == 1 || $role == 2) {
            header("Location: admin/home.php");
        } elseif ($role == 3) {
            header("Location: admin/borrower.php");
        } else {
            // fallback if role is unknown
            header("Location: login.php");
        }
        exit();
    } else {
        $error = "Invalid KLD email or password";
    }
}
?>