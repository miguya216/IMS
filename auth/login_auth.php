<?php
require_once ('class/users.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = new User();
    $remember = isset($_POST['remember_me']);
    
    if ($user->login($_POST["username"], $_POST["password"], $remember)) {
        header("Location: admin/home.php");
        exit();
    } else {
        $error = "Invalid username or password.";
    }
}
?>