<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\conn.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '\ims\class\user\user_handler.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
   
    $user = new User();
    $response_for_this_log = $_POST['name'];
    $createAccount = isset($_POST['toggle_account_fields']);
    $role = ($_POST['role'] === '__new_role__') ? $_POST['new_role'] : $_POST['role'];
    $kld_email = $_POST['kld_email'] ?? null;
    $password = $_POST['password'] ?? null;
    
    $kld_id = $_POST['kld_id'];
    $firstName = $_POST['f_name'];
    $middleName = $_POST['m_name'] ?? '';
    $lastName = $_POST['l_name'];
    
    $unit = ($_POST['unit'] === '__new_unit__') ? $_POST['new_unit'] : $_POST['unit'];
    
   
    $response_user_add = $user->insertNewUser($response_for_this_log, $role, $kld_email, $password, $kld_id, $firstName, $middleName, $lastName, $unit);

    if ($response_user_add === true) {
        echo "success";
    } elseif ($response_user_add === "duplicate") {
        echo "User already exists!";
    } else {
        echo "Error: " . $response_user_add;
    }
}
