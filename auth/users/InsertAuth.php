<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\conn.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\user\user_handler.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $user = new User();

    $role = ($_POST['role'] === '__new_role__') ? $_POST['new_role'] : $_POST['role'];
    $username = $_POST['username'] ?? null;
    $password = $_POST['password'] ?? null;
    $FullName = $_POST['full_name'] ?? '';
    $unit = ($_POST['unit'] === '__new_unit__') ? $_POST['new_unit'] : $_POST['unit'];
   
    $response_user_add = $user->insertNewUser($role, $username, $password, $FullName, $unit);

    if ($response_user_add === true) {
        echo "success";
    } elseif ($response_user_add === "duplicate") {
        echo "User already exists!";
    } else {
        echo "Error: " . $response_user_add;
    }
}
