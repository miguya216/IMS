<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\user\user_handler.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
$user = new UpdateUser();

$user_ID = $_POST['user_ID'];
$role = $_POST['user_detail_role'] ?? null;
$username = $_POST['user_detail_username'] ?? null;
$password = $_POST['user_detail_password'] ?? null;
$fullname = $_POST['user_detail_fullname'];
$unit = $_POST['user_detail_unit'];

$response = $user->UpdateUser(
    $user_ID, 
    $role, 
    $username, 
    $password, 
    $fullname, 
    $unit);

    if ($response === true) {
        echo "success";
    } elseif ($response === "duplicate") {
        echo "duplicate";
    } else {
        echo "Error: " . $response;
    }

}
?>