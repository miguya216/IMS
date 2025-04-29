<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/ims/class/user/user_handler.php';

if($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['user'])){
    $user_ID = $_POST['user'];
    $deleter = new DeleteUser();
    echo $deleter->deleteUserDetails($user_ID);
} else{
    echo "Invalid Request";
}
?>