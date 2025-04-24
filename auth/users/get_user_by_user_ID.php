<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/ims/class/fetch_data.php';

header('Content-Type: application/json');

if (isset($_GET['user_ID'])) {
    $user_ID = $_GET['user_ID'];
    $users = new Users($pdo); // lowercase to match usage below
$user_data = $users->fetchUserById($user_ID); // renamed for clarity

if ($user_data) {
    echo json_encode($user_data);
} else {
    echo json_encode(['error' => 'User not found', 'user_ID_received' => $user_ID]);
}

} else {
    echo json_encode(['error' => 'No user_ID received']);
}
?>
