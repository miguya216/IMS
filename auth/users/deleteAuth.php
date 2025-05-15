<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/ims/class/user/user_handler.php';
session_start();
if($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['user'])){
    $user_ID = $_POST['user'];
    $response_for_this_log = isset($_SESSION['full_name']) ? $_SESSION['full_name'] : 'Unknown User';
    $deleter = new DeleteUser();
    echo $deleter->deleteUserDetails($response_for_this_log, $user_ID);
} else{
    echo "Invalid Request";
}
?>