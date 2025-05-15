<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\user\user_handler.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
$user = new UpdateUser();

$response_for_this_log = $_POST['name'];
$user_ID = $_POST['user_ID']; // this is uneditable in front end
$kld_ID = $_POST['kld_ID'];
$role = $_POST['role'] ?? null;
$kld_email = $_POST['kld_email'] ?? null;
$password = $_POST['password'] ?? null;
$f_name = $_POST['f_name'];
$m_name = $_POST['m_name'];
$l_name = $_POST['l_name'];
$unit = $_POST['unit'];

$response = $user->UpdateUser(
    $response_for_this_log,
    $user_ID, 
    $kld_ID,
    $role, 
    $kld_email,
    $password, 
    $f_name,
    $m_name,
    $l_name,
    $unit);

    if ($response === true) {
        echo "success";
    } elseif ($response === "duplicate") {
        echo "User already exists!";
    } else {
        echo "Error: " . $response;
    }

}
?>