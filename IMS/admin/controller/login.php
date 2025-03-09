<?php
session_start();
require_once ('class/users.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = new User();
    if ($user->login($_POST["username"], $_POST["password"])) {
        header("Location: home.php");
        exit();
    } else {
        $error = "Invalid username or password.";
    }
}
?>